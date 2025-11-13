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

function isTransientError(error) {
  if (!error) return false;
  
  let status = null;
  if (error.status !== undefined && error.status !== null) {
    if (typeof error.status === 'number') {
      status = error.status;
    } else if (typeof error.status === 'object' && error.status.code !== undefined && error.status.code !== null) {
      status = Number(error.status.code);
      if (!isFinite(status)) status = null;
    } else {
      status = Number(error.status);
      if (!isFinite(status)) status = null;
    }
  } else if (error.statusCode !== undefined && error.statusCode !== null) {
    status = Number(error.statusCode);
    if (!isFinite(status)) status = null;
  }
  
  if (status && status >= 500 && status <= 599) {
    console.log(`[Transient Error] Detected 5xx error: ${status}`);
    return true;
  }
  
  const statusText = (error.statusText || '').toLowerCase();
  if (statusText.includes('unavailable') || statusText.includes('timeout') || statusText.includes('overloaded')) {
    console.log(`[Transient Error] Detected via statusText: ${statusText}`);
    return true;
  }
  
  const message = (error.message || '').toLowerCase();
  if (message.includes('network') || 
      message.includes('timeout') || 
      message.includes('overloaded') ||
      message.includes('fetch') ||
      message.includes('econnreset') ||
      message.includes('enotfound') ||
      message.includes('etimedout') ||
      message.includes('econnrefused')) {
    console.log(`[Transient Error] Detected via message: ${error.message}`);
    return true;
  }
  
  const errorCode = error.code || error.errno;
  if (['ECONNRESET', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNREFUSED', 'ENETUNREACH'].includes(errorCode)) {
    console.log(`[Transient Error] Detected via error code: ${errorCode}`);
    return true;
  }
  
  return false;
}

function summarizeAnswers(qaData) {
  if (!qaData || qaData.length === 0) return 'No previous answers';
  
  const summaries = qaData.map((round, index) => {
    if (!round.answers || Object.keys(round.answers).length === 0) return null;
    
    const questionMap = {};
    if (round.questions && Array.isArray(round.questions)) {
      round.questions.forEach(q => {
        questionMap[q.id] = q.question;
      });
    }
    
    const answerPairs = Object.entries(round.answers)
      .map(([questionId, answer]) => {
        const questionText = questionMap[questionId] || questionId;
        return `${questionText}: ${answer}`;
      })
      .join('; ');
    
    return `Round ${index + 1}: ${answerPairs}`;
  }).filter(Boolean);
  
  return summaries.join('\n') || 'No previous answers';
}

async function executeWithRetry(promptFn, operationName, maxAttempts = 3, baseDelayMs = 2000) {
  const maxTotalWaitMs = 60000;
  let attempts = 0;
  let totalWaitMs = 0;
  let lastError = null;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    try {
      await rateLimiter.waitIfNeeded();
      const result = await promptFn();
      
      if (attempts > 1) {
        console.log(`[Retry Success] ${operationName} succeeded on attempt ${attempts} after ${totalWaitMs}ms total wait`);
      }
      
      return {
        success: true,
        result,
        metadata: {
          attempts,
          totalWaitMs
        }
      };
    } catch (error) {
      lastError = error;
      
      const quotaError = parseQuotaError(error);
      if (quotaError.name === 'GeminiQuotaError') {
        console.error(`[QUOTA ERROR] ${quotaError.type}: ${quotaError.message}`);
        if (quotaError.retryAfter) {
          console.error(`Retry after: ${quotaError.retryAfter} seconds`);
        }
        throw quotaError;
      }
      
      const shouldRetry = isTransientError(error);
      
      if (!shouldRetry || attempts >= maxAttempts) {
        console.error(`[Retry Failed] ${operationName} failed after ${attempts} attempt(s)`);
        error.retryMetadata = { attempts, totalWaitMs };
        throw error;
      }
      
      const exponentialDelay = baseDelayMs * Math.pow(2, attempts - 1);
      const jitter = exponentialDelay * 0.2 * (Math.random() - 0.5) * 2;
      const delayMs = Math.round(exponentialDelay + jitter);
      
      if (totalWaitMs + delayMs > maxTotalWaitMs) {
        console.log(`[Retry Abort] ${operationName} would breach max wait time (${maxTotalWaitMs}ms). Failing now.`);
        error.retryMetadata = { attempts, totalWaitMs, aborted: true };
        throw error;
      }
      
      console.log(`[Retry] ${operationName} attempt ${attempts} failed with ${error.status || error.code || 'error'}: ${error.message}. Retrying in ${delayMs}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delayMs));
      totalWaitMs += delayMs;
    }
  }
  
  lastError.retryMetadata = { attempts, totalWaitMs, exhausted: true };
  throw lastError;
}

async function generateComplianceStatement(jurisdiction, country) {
  const prompt = `You are a legal expert. Generate an itemized list of legal requirements for creating a FORMAL will in ${jurisdiction}, ${country === 'CA' ? 'Canada' : 'United States'}.

CRITICAL INSTRUCTIONS:
- Maximum 300-400 words
- Provide 5-7 NUMBERED, ITEMIZED requirements
- Each item should be 1-2 sentences
- Focus ONLY on formal typed/printed wills (exclude holograph/handwritten wills)
- Use clear, direct language

Required items (numbered list format):
1. Testamentary Capacity (age requirement)
2. Mental Capacity (understanding nature and effect of will)
3. Written Form (must be typed and printed)
4. Testator Signature (will-maker must sign)
5. Witness Presence (number of witnesses, must be present simultaneously)
6. Witness Signatures (witnesses must sign in testator's presence)
7. Witness Eligibility (cannot be beneficiaries or spouses of beneficiaries)

Format as numbered list (1., 2., 3., etc.) with brief explanation for each item.

EXCLUDE: Do NOT mention holograph wills, handwritten wills, or any alternatives to formal wills.

END WITH STRONG LIABILITY DISCLAIMER (3-4 sentences):
- This tool does NOT provide legal advice
- This tool and its creators assume NO legal liability whatsoever
- Information may not reflect recent legal changes
- Users MUST consult a licensed attorney before creating or executing a will

Format as plain text, no markdown or tables.`;

  const { result } = await executeWithRetry(
    async () => {
      const response = await model.generateContent(prompt);
      return (await response.response).text();
    },
    'generateComplianceStatement'
  );
  
  return result;
}

async function generateInitialQuestions(jurisdiction, country, userName) {
  const prompt = `Generate 5-7 ESSENTIAL questions for a will in ${jurisdiction}, ${country === 'CA' ? 'Canada' : 'United States'}.

CRITICAL - FOCUS ON MINIMUM REQUIREMENTS ONLY:
- Ask ONLY what's legally required for a valid will
- Keep questions SHORT and DIRECT
- Avoid optional/nice-to-have information
- Focus: beneficiaries, executor, guardians (if minor children), major assets

Return JSON array ONLY. Format:
[
  {
    "id": "q1",
    "question": "Marital status?",
    "type": "select",
    "required": true,
    "options": ["Single", "Married", "Divorced", "Widowed", "Common-law"]
  }
]

Keep questions concise. Return ONLY JSON, no extra text.`;

  const { result } = await executeWithRetry(
    async () => {
      const response = await model.generateContent(prompt);
      const text = (await response.response).text().trim();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }
      
      return JSON.parse(jsonMatch[0]);
    },
    'generateInitialQuestions'
  );
  
  return result;
}

async function generateFollowUpQuestions(previousAnswers, jurisdiction, country, roundNumber) {
  const summarized = summarizeAnswers(previousAnswers);
  
  const prompt = `Generate ${roundNumber === 2 ? '3-5' : '2-3'} follow-up questions for a will in ${jurisdiction}, ${country === 'CA' ? 'Canada' : 'United States'}.

Previous answers (summarized):
${summarized}

CRITICAL - BE BRIEF AND FOCUSED:
- Ask ONLY essential clarifications based on previous answers
- Keep questions SHORT and DIRECT
- Focus on MINIMUM requirements for legal validity
- Avoid unnecessary details

Round ${roundNumber} of 3.

Return JSON array ONLY:
[
  {
    "id": "q{number}",
    "question": "...",
    "type": "text|textarea|select|multi-select",
    "required": true|false,
    "options": [...] (for select types only)
  }
]

Return ONLY JSON, no extra text.`;

  const { result } = await executeWithRetry(
    async () => {
      const response = await model.generateContent(prompt);
      const text = (await response.response).text().trim();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }
      
      return JSON.parse(jsonMatch[0]);
    },
    'generateFollowUpQuestions'
  );
  
  return result;
}

async function generateWillAssessment(allAnswers, jurisdiction, country) {
  const summarized = summarizeAnswers(allAnswers);
  
  const prompt = `Create a BRIEF legal assessment for a will in ${jurisdiction}, ${country === 'CA' ? 'Canada' : 'United States'}.

Questionnaire answers (summarized):
${summarized}

CRITICAL - BE CONCISE AND FOCUSED:
- Maximum 250-350 words
- List ONLY the key decisions: beneficiaries, executor, guardians, major assets
- Identify ONLY critical legal gaps (if any)
- Use short, direct sentences
- NO unnecessary commentary

Required sections (keep brief):
1. Key Decisions Summary (3-4 sentences)
2. Legal Completeness Check (2-3 sentences)
3. Critical Gaps or Issues (if any - 2-3 sentences)

END WITH STRONG LIABILITY DISCLAIMER (3-4 sentences):
- This is NOT legal advice
- This tool and creators assume NO legal liability
- Results may not meet all legal requirements
- Users MUST consult a licensed attorney before executing a will

Format as plain text. BE BRIEF AND DIRECT.`;

  const { result } = await executeWithRetry(
    async () => {
      const response = await model.generateContent(prompt);
      return (await response.response).text();
    },
    'generateWillAssessment'
  );
  
  return result;
}

module.exports = {
  generateComplianceStatement,
  generateInitialQuestions,
  generateFollowUpQuestions,
  generateWillAssessment
};
