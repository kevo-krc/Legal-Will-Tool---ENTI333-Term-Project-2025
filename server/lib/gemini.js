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

function getStaticInitialQuestions(jurisdiction, country) {
  return [
    {
      id: "marital_status",
      question: "What is your current marital status?",
      type: "select",
      required: true,
      options: ["Single", "Married", "Divorced", "Widowed", "Common-law/Domestic Partnership", "Separated"]
    },
    {
      id: "has_children",
      question: "Do you have any children or dependents under 18?",
      type: "select",
      required: true,
      options: ["Yes", "No"]
    },
    {
      id: "executor_name",
      question: "Who do you wish to appoint as your Personal Representative (Executor) to manage your estate? Provide their full legal name.",
      type: "text",
      required: true
    },
    {
      id: "executor_relationship",
      question: "What is the Personal Representative's relationship to you?",
      type: "text",
      required: true
    },
    {
      id: "alternate_executor",
      question: "Who should be the alternate Personal Representative if your first choice cannot act? Provide their full name.",
      type: "text",
      required: false
    },
    {
      id: "primary_beneficiary",
      question: "Who should receive the majority (residue) of your estate after debts and expenses? Provide full name(s).",
      type: "textarea",
      required: true
    },
    {
      id: "specific_gifts",
      question: "Are there any specific items or amounts you want to leave to particular people or charities? (e.g., '$5,000 to my sister Jane Doe' or 'My car to John Smith')",
      type: "textarea",
      required: false
    },
    {
      id: "major_assets",
      question: "What are your major assets? (e.g., real estate, bank accounts, investments, life insurance). Brief summary is fine.",
      type: "textarea",
      required: true
    }
  ];
}

async function generateInitialQuestions(jurisdiction, country, userName) {
  return getStaticInitialQuestions(jurisdiction, country);
}

async function generateFollowUpQuestions(previousAnswers, jurisdiction, country, roundNumber) {
  const summarized = summarizeAnswers(previousAnswers);
  
  const prompt = `You are gathering information FROM a user TO CREATE a legal will. Based on their previous answers, generate ${roundNumber === 2 ? '3-5' : '2-3'} follow-up questions to clarify missing or ambiguous information.

Previous answers (summarized):
${summarized}

Jurisdiction: ${jurisdiction}, ${country === 'CA' ? 'Canada' : 'United States'}
Round ${roundNumber} of 3

CRITICAL INSTRUCTIONS - ASK ONLY ABOUT MISSING/AMBIGUOUS DATA:
- If they said "has_children: Yes", ask about guardianship (who should care for minor children)
- If primary_beneficiary has multiple people, ask about distribution split (equal? percentages?)
- If they mentioned children but didn't specify their share, ask if children inherit if primary beneficiary dies (per stirpes)
- If specific_gifts was empty, ask if they're sure no specific items/amounts to anyone
- If they have minor children or young adult beneficiaries, ask about trusts (hold inheritance until certain age?)
- Ask about significant debts/liabilities if not mentioned
- Clarify any vague executor or beneficiary names (need full legal names)

DO NOT ASK:
- Questions about the will document itself (it will be typed and printed by this tool)
- Questions about witnesses (not user's responsibility)
- Questions about signing or executing the will

Return JSON array ONLY:
[
  {
    "id": "guardian_name",
    "question": "...",
    "type": "text|textarea|select",
    "required": true|false,
    "options": [...] (for select only)
  }
]

Keep questions SHORT and DIRECT. Return ONLY JSON, no extra text.`;

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
  
  const prompt = `You have gathered information FROM a user TO CREATE a legal will. Assess whether we have sufficient information to draft a legally valid will in ${jurisdiction}, ${country === 'CA' ? 'Canada' : 'United States'}.

Information gathered (summarized):
${summarized}

CRITICAL - BE CONCISE AND FOCUSED:
- Maximum 250-350 words
- Enumerate the KEY DECISIONS we've captured: executor, beneficiaries, guardians (if applicable), assets
- Assess if we have MINIMUM information needed for a legal will
- Identify any CRITICAL GAPS that prevent will creation
- Use short, direct sentences

Required sections (keep brief):
1. Summary of Key Decisions (3-4 sentences listing: executor, primary beneficiaries, guardianship if applicable, major assets)
2. Completeness Assessment (2-3 sentences: Do we have enough to create a basic valid will? What's missing if anything critical?)
3. Critical Gaps or Warnings (if any - 2-3 sentences about missing executor, beneficiary, or guardian information)

END WITH STRONG LIABILITY DISCLAIMER (3-4 sentences):
- This is NOT legal advice
- This tool and its creators assume NO legal liability whatsoever
- The generated will may not meet all legal requirements
- Users MUST consult a licensed attorney before signing or executing any will

Format as plain text with clear section headers. BE BRIEF AND DIRECT.`;

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
