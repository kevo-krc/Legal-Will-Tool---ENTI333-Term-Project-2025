const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set');
  throw new Error('Gemini API key is required');
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  }
});

class RateLimiter {
  constructor(requestsPerMinute = 10) {
    this.requestsPerMinute = requestsPerMinute;
    this.minDelayMs = Math.ceil((60 * 1000) / requestsPerMinute);
    this.lastRequestTime = 0;
    this.queue = Promise.resolve();
  }

  async waitIfNeeded() {
    const next = this.queue.then(async () => {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.minDelayMs) {
        const waitTime = this.minDelayMs - timeSinceLastRequest;
        console.log(`[Rate Limiter] Waiting ${waitTime}ms before next request (next available: ${new Date(this.lastRequestTime + this.minDelayMs).toISOString()})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      this.lastRequestTime = Date.now();
      console.log(`[Rate Limiter] Request allowed at ${new Date(this.lastRequestTime).toISOString()}`);
    });
    
    this.queue = next;
    return next;
  }
}

const rateLimiter = new RateLimiter(10);

class GeminiQuotaError extends Error {
  constructor(message, type, retryAfter) {
    super(message);
    this.name = 'GeminiQuotaError';
    this.type = type;
    this.retryAfter = retryAfter;
  }
}

function parseQuotaError(error) {
  if (error.status === 429) {
    const errorMessage = error.message || '';
    
    let retryAfter = null;
    if (error.errorDetails) {
      const retryInfo = error.errorDetails.find(d => d['@type']?.includes('RetryInfo'));
      if (retryInfo?.retryDelay) {
        const match = retryInfo.retryDelay.match(/(\d+)/);
        retryAfter = match ? parseInt(match[1]) : null;
      }
    }
    
    if (errorMessage.includes('requests per minute') || errorMessage.includes('RPM')) {
      return new GeminiQuotaError(
        'Rate limit exceeded: Too many requests per minute (max 10/min). Please wait a moment.',
        'RPM',
        retryAfter || 60
      );
    }
    
    if (errorMessage.includes('requests per day') || errorMessage.includes('RPD') || errorMessage.includes('daily')) {
      return new GeminiQuotaError(
        'Daily quota exceeded: You have used all 250 requests for today. Quota resets at midnight Pacific Time.',
        'RPD',
        retryAfter
      );
    }
    
    return new GeminiQuotaError(
      'Gemini API quota exceeded. Please try again later.',
      'UNKNOWN',
      retryAfter
    );
  }
  
  return error;
}

async function generateComplianceStatement(jurisdiction, country) {
  const prompt = `You are a legal expert specializing in estate planning law.

Generate a clear, accurate compliance statement for creating a legal will in ${jurisdiction}, ${country === 'CA' ? 'Canada' : 'United States'}.

The compliance statement should include:
1. Basic legal requirements for a valid will in this jurisdiction
2. Witnessing requirements (number of witnesses, qualifications)
3. Age requirements for the testator
4. Mental capacity requirements
5. Any specific rules unique to this jurisdiction
6. Important disclaimers about what this tool can and cannot do

Keep the tone professional but accessible. The statement should be 200-300 words.
Format the output as plain text without markdown.`;

  try {
    await rateLimiter.waitIfNeeded();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating compliance statement:', error);
    const quotaError = parseQuotaError(error);
    if (quotaError.name === 'GeminiQuotaError') {
      console.error(`[QUOTA ERROR] ${quotaError.type}: ${quotaError.message}`);
      if (quotaError.retryAfter) {
        console.error(`Retry after: ${quotaError.retryAfter} seconds`);
      }
    }
    throw quotaError;
  }
}

async function generateInitialQuestions(jurisdiction, country, userName) {
  const prompt = `You are an expert estate planning attorney helping ${userName} create a legal will for ${jurisdiction}, ${country === 'CA' ? 'Canada' : 'United States'}.

Generate 5-7 essential questions for the first round of a will questionnaire. These questions should gather fundamental information about:
1. Beneficiaries (spouse, children, family members)
2. Executors (who will manage the estate)
3. Guardians (if there are minor children)
4. Major assets (property, investments, accounts)
5. Special wishes or instructions

Format your response as a JSON array of question objects. Each object should have:
- "id": a unique identifier (q1, q2, q3, etc.)
- "question": the question text
- "type": "text", "textarea", "select", or "multi-select"
- "required": true or false
- "options": array of options (only for select/multi-select types)

Example format:
[
  {
    "id": "q1",
    "question": "What is your current marital status?",
    "type": "select",
    "required": true,
    "options": ["Single", "Married", "Divorced", "Widowed", "Common-law/Domestic Partnership"]
  },
  {
    "id": "q2",
    "question": "Do you have any children?",
    "type": "select",
    "required": true,
    "options": ["Yes", "No"]
  }
]

IMPORTANT: Return ONLY the JSON array, no additional text or explanation.`;

  try {
    await rateLimiter.waitIfNeeded();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating initial questions:', error);
    const quotaError = parseQuotaError(error);
    if (quotaError.name === 'GeminiQuotaError') {
      console.error(`[QUOTA ERROR] ${quotaError.type}: ${quotaError.message}`);
      if (quotaError.retryAfter) {
        console.error(`Retry after: ${quotaError.retryAfter} seconds`);
      }
    }
    throw quotaError;
  }
}

async function generateFollowUpQuestions(previousAnswers, jurisdiction, country, roundNumber) {
  const prompt = `You are an expert estate planning attorney. Based on the previous answers provided, generate ${roundNumber === 2 ? '3-5' : '2-3'} follow-up questions to gather more specific details for creating a comprehensive will.

Previous answers:
${JSON.stringify(previousAnswers, null, 2)}

Jurisdiction: ${jurisdiction}, ${country === 'CA' ? 'Canada' : 'United States'}
Round: ${roundNumber} of 3

Generate questions that:
1. Clarify or expand on previous answers
2. Address specific distribution of assets
3. Handle special circumstances mentioned
4. Gather any remaining critical information
5. Are tailored to the person's unique situation

Format your response as a JSON array of question objects with the same structure as before:
[
  {
    "id": "q{number}",
    "question": "...",
    "type": "text|textarea|select|multi-select",
    "required": true|false,
    "options": [...] (only for select types)
  }
]

IMPORTANT: Return ONLY the JSON array, no additional text or explanation.`;

  try {
    await rateLimiter.waitIfNeeded();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    const quotaError = parseQuotaError(error);
    if (quotaError.name === 'GeminiQuotaError') {
      console.error(`[QUOTA ERROR] ${quotaError.type}: ${quotaError.message}`);
      if (quotaError.retryAfter) {
        console.error(`Retry after: ${quotaError.retryAfter} seconds`);
      }
    }
    throw quotaError;
  }
}

async function generateWillAssessment(allAnswers, jurisdiction, country) {
  const prompt = `You are a legal expert in estate planning. Based on the questionnaire answers provided, create a legal assessment document that evaluates the completeness and validity of the information for creating a will in ${jurisdiction}, ${country === 'CA' ? 'Canada' : 'United States'}.

Questionnaire Answers:
${JSON.stringify(allAnswers, null, 2)}

Create an assessment that includes:
1. Summary of key decisions (beneficiaries, executors, guardians)
2. Analysis of asset distribution
3. Identification of any potential legal issues or gaps
4. Recommendations for additional considerations
5. Confirmation that the information meets legal requirements
6. Any disclaimers or warnings

The assessment should be professional, clear, and 400-600 words.
Format the output as plain text with clear sections.`;

  try {
    await rateLimiter.waitIfNeeded();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating assessment:', error);
    const quotaError = parseQuotaError(error);
    if (quotaError.name === 'GeminiQuotaError') {
      console.error(`[QUOTA ERROR] ${quotaError.type}: ${quotaError.message}`);
      if (quotaError.retryAfter) {
        console.error(`Retry after: ${quotaError.retryAfter} seconds`);
      }
    }
    throw quotaError;
  }
}

module.exports = {
  generateComplianceStatement,
  generateInitialQuestions,
  generateFollowUpQuestions,
  generateWillAssessment
};
