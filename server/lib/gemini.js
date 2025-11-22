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
    maxOutputTokens: 4096,
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

class EmptyGeminiResponseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmptyGeminiResponseError';
    this.isTransient = true;
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
  
  if (error.name === 'EmptyGeminiResponseError' || error.isTransient === true) {
    console.log(`[Transient Error] Detected empty/invalid AI response - will retry`);
    return true;
  }
  
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

function formatPersonAnswer(personData) {
  if (!personData || typeof personData !== 'object') return personData;
  
  const parts = [];
  if (personData.name) parts.push(`Name: ${personData.name}`);
  if (personData.relationship) parts.push(`Relationship: ${personData.relationship}`);
  if (personData.age) parts.push(`Age: ${personData.age}`);
  if (personData.address) parts.push(`Address: ${personData.address}`);
  
  return parts.length > 0 ? parts.join(', ') : '[Not provided]';
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
        const formattedAnswer = typeof answer === 'object' ? formatPersonAnswer(answer) : answer;
        return `${questionText}: ${formattedAnswer}`;
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

async function generateComplianceStatement(jurisdiction, country, age) {
  const ageNote = age !== undefined && age !== null
    ? `\n\nUSER AGE: ${age} years old
    - If the user is BELOW the minimum age requirement for ${jurisdiction}, clearly state this in item #1 (Testamentary Capacity)
    - Note that they may continue but should consult an attorney, as the will may not be legally valid
    - If the user MEETS the age requirement, simply state the requirement without additional commentary`
    : '';

  const prompt = `You are a legal expert. Generate an itemized list of legal requirements for creating a FORMAL will in ${jurisdiction}, ${country === 'CA' ? 'Canada' : 'United States'}.${ageNote}

CRITICAL INSTRUCTIONS:
- Maximum 300-400 words
- Provide 5-7 NUMBERED, ITEMIZED requirements
- Each item should be 1-2 sentences
- Focus ONLY on formal typed/printed wills (exclude holograph/handwritten wills)
- Use clear, direct language

Required items (numbered list format):
1. Testamentary Capacity (age requirement - COMPARE TO USER'S AGE IF PROVIDED)
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
      options: ["Single", "Married", "Divorced", "Widowed", "Common-law/Domestic Partnership", "Separated"],
      tooltip: "Your marital status affects how your estate is distributed and your spouse's legal rights."
    },
    {
      id: "spouse_name",
      question: "If married or in a common-law relationship, what is your spouse/partner's full legal name?",
      type: "text",
      required: false,
      tooltip: "Use the exact legal name as it appears on official documents."
    },
    {
      id: "spouse_details",
      question: "If married or in a common-law relationship, provide your spouse/partner's details below. If not applicable, leave blank.",
      type: "person",
      required: false,
      fields: ["age", "address"],
      tooltip: "Complete contact information helps with legal identification and estate matters."
    },
    {
      id: "children_details",
      question: "List all your children (include full names and ages). If none, write 'None'.",
      type: "textarea",
      required: true,
      tooltip: "Include all biological, adopted, and stepchildren to ensure proper distribution of your estate."
    },
    {
      id: "guardian_for_minors",
      question: "If you have minor children (under 18), who should be their legal guardian?",
      type: "person",
      required: false,
      fields: ["name", "relationship", "age", "address"],
      tooltip: "A guardian will care for your minor children if both parents are deceased. Complete information is needed for legal documentation."
    },
    {
      id: "executor_details",
      question: "Who should be your Personal Representative (Executor)?",
      type: "person",
      required: true,
      fields: ["name", "relationship", "age", "address"],
      tooltip: "An executor manages your estate, pays debts, and distributes assets according to your will. Complete information is required for legal documentation."
    },
    {
      id: "executor_compensation",
      question: "Should your executor receive compensation for their services?",
      type: "select",
      required: true,
      options: ["Yes - standard executor fees", "No - they should serve without compensation", "Specific amount (will specify in follow-up)"],
      tooltip: "Executors can receive payment for their time and effort in managing your estate."
    },
    {
      id: "alternate_executor",
      question: "Who should be the alternate Personal Representative if your first choice cannot serve?",
      type: "person",
      required: true,
      fields: ["name", "relationship", "age", "address"],
      tooltip: "An alternate executor steps in if your primary executor is unable or unwilling to serve. Complete information is required for legal documentation."
    },
    {
      id: "specific_bequests",
      question: "Do you want to leave specific gifts to particular people or charities? (e.g., '$5,000 to my sister Jane Doe', 'My car to John Smith', 'My jewelry to my daughter'). If none, write 'None'.",
      type: "textarea",
      required: false,
      tooltip: "Specific bequests are individual gifts of money, property, or possessions to named beneficiaries."
    },
    {
      id: "beneficiary_distribution",
      question: "After paying debts and distributing any specific gifts above, how should the remainder (residue) of your estate be divided? Be specific with percentages or fractions (e.g., '100% to my spouse Sarah Smith', '50% to child A, 50% to child B', '1/3 to each of my 3 children').",
      type: "textarea",
      required: true,
      tooltip: "The residue is what remains of your estate after debts, taxes, and specific gifts are distributed."
    },
    {
      id: "contingent_beneficiaries",
      question: "If any primary beneficiary dies before you, who should receive their share? Be specific about the replacement beneficiary or how shares should be redistributed.",
      type: "textarea",
      required: true,
      tooltip: "Contingent beneficiaries ensure your assets go where you want even if a primary beneficiary predeceases you."
    },
    {
      id: "real_estate",
      question: "Do you own any real estate (house, land, etc.)? If yes, provide addresses and ownership type (sole, joint with spouse, etc.). If none, write 'None'.",
      type: "textarea",
      required: true,
      tooltip: "Real estate ownership details help ensure proper transfer of property to your beneficiaries."
    },
    {
      id: "financial_assets",
      question: "Summarize your financial assets: bank accounts, investments, retirement accounts, life insurance. Approximate values are fine.",
      type: "textarea",
      required: true,
      tooltip: "A summary of your financial assets helps your executor understand the scope of your estate."
    },
    {
      id: "debts_liabilities",
      question: "Do you have significant debts or liabilities (mortgage, loans, etc.)? If yes, briefly describe. If none, write 'None'.",
      type: "textarea",
      required: true,
      tooltip: "Debts must be paid from your estate before assets are distributed to beneficiaries."
    },
    {
      id: "digital_assets",
      question: "Do you have digital assets or online accounts that need to be addressed (social media, cryptocurrency, digital businesses)? If yes, describe briefly. If none, write 'None'.",
      type: "textarea",
      required: false,
      tooltip: "Digital assets include online accounts, cryptocurrency, and digital property that have monetary or sentimental value."
    },
    {
      id: "funeral_preferences",
      question: "Do you have specific funeral or burial preferences (burial, cremation, specific location)? If none, write 'No preference'.",
      type: "textarea",
      required: false,
      tooltip: "Stating your funeral preferences helps your family honor your wishes during a difficult time."
    }
  ];
}

async function generateInitialQuestions(jurisdiction, country, userName) {
  return getStaticInitialQuestions(jurisdiction, country);
}

async function generateFollowUpQuestions(previousAnswers, jurisdiction, country, roundNumber, userProfile = {}) {
  const summarized = summarizeAnswers(previousAnswers);
  
  const previouslyAskedQuestions = [];
  const providedInformation = [];
  
  if (userProfile.full_name) {
    providedInformation.push(`User's full legal name: ${userProfile.full_name}`);
  }
  if (userProfile.date_of_birth) {
    providedInformation.push(`User's date of birth: ${userProfile.date_of_birth}`);
  }
  
  previousAnswers.forEach(round => {
    if (round.questions && Array.isArray(round.questions)) {
      round.questions.forEach(q => {
        if (q.question) {
          previouslyAskedQuestions.push(q.question);
        }
      });
    }
    
    if (round.answers && typeof round.answers === 'object') {
      Object.entries(round.answers).forEach(([key, value]) => {
        if (value && value !== 'None' && value !== 'N/A' && value !== 'No preference') {
          if (key.includes('name') || key.includes('executor') || key.includes('beneficiar') || key.includes('guardian') || key.includes('spouse') || key.includes('details') || key.includes('address')) {
            const formattedValue = typeof value === 'object' ? formatPersonAnswer(value) : value;
            providedInformation.push(`${key}: ${formattedValue}`);
          }
        }
      });
    }
  });
  
  const previousQuestionsText = previouslyAskedQuestions.length > 0 
    ? `\n\nQUESTIONS ALREADY ASKED (NEVER REPEAT OR REPHRASE THESE):\n${previouslyAskedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n`
    : '';
  
  const providedInfoText = providedInformation.length > 0
    ? `\n\nINFORMATION ALREADY PROVIDED (DO NOT RE-ASK FOR THIS DATA):\n${providedInformation.map((info, i) => `${i + 1}. ${info}`).join('\n')}\n`
    : '';
  
  const prompt = `You are a lawyer gathering ESSENTIAL information TO CREATE a legally valid will. Review the client's answers and ask ${roundNumber === 2 ? '4-6' : '2-4' } follow-up questions to fill CRITICAL GAPS only.

Previous answers (summarized):
${summarized}
${previousQuestionsText}
${providedInfoText}
Jurisdiction: ${jurisdiction}, ${country === 'CA' ? 'Canada' : 'United States'}
Round ${roundNumber} of 3

STRICT RULES TO PREVENT REDUNDANT QUESTIONS:
1. NEVER ask for a person's "full legal name" if you already have their name in the answers above
2. For PEOPLE: If you have a name, only ask for MISSING details (age, address, relationship) - NOT the name again
3. For CHARITABLE ORGANIZATIONS: Ask for "registered charitable name and registration number" - NEVER "full legal name"
4. NEVER repeat questions from previous rounds, even with different wording
5. If the user answered "I do not know" or similar, accept it and DO NOT ask again
6. The user cannot "confirm" things with others - this is a single-session form

${roundNumber === 2 ? 'ROUND 2 - ESSENTIAL WILL REQUIREMENTS (ask if missing):' : 'ROUND 3 - FINAL CRITICAL GAPS (ask ONLY if absolutely necessary):'}

PRIORITY 1 - REQUIRED FOR VALID WILL:
- Missing executor information (full name, age, address - BUT DO NOT ask about willingness if already asked)
- Missing alternate executor (full name, relationship)
- Unclear beneficiary distribution (must have specific percentages or clear division)
- Missing guardian for minors (if they have children under 18)
- Missing alternate guardian for minors
- Vague residue clause (who gets the remainder after specific gifts?)

PRIORITY 2 - ESSENTIAL CLARIFICATIONS:
- If percentages don't add to 100%, ask for clarification
- If beneficiaries are vague ("my children"), ask for specific names
- If assets listed but distribution unclear, ask how each major asset should be distributed
- Missing debt payment instructions (should debts be paid before distribution?)
- If minor children inherit, ask about trust age threshold (18, 21, 25?)

PRIORITY 3 - ONLY IF CRITICAL:
- Per stirpes vs per capita for deceased beneficiaries (only if multiple children/beneficiaries)
- Ademption clause for specific gifts (what if item no longer owned?)
- Digital asset access (only if they mentioned digital assets/crypto)

${roundNumber === 3 ? 'IMPORTANT: Most information should be gathered by now. Only ask about truly CRITICAL missing pieces needed for a functional will. DO NOT repeat questions from Round 2.' : ''}

ABSOLUTELY FORBIDDEN (DO NOT ASK):
- Questions already asked in previous rounds (see list above)
- Information already provided (see list above) - if you have a person's name, DON'T ask for their "full legal name" again
- "Full legal name" of organizations - use "registered charitable name and registration number" instead
- Whether they have "now" confirmed anything with anyone - this is a single-session questionnaire
- Repeating a question because the user said "I do not know" - accept that answer
- Witness names or signing procedures (we handle that in instructions)
- Legal formalities or will format
- Tax planning or estate planning strategies

GOOD QUESTION EXAMPLES:
✓ "What is the residential address for [person's name that you already have]?"
✓ "What is [person's name]'s age?"
✓ "What is the registered charitable name and registration number for [charity mentioned]?"
✓ "Should your mortgage be paid off from estate assets or assumed by beneficiary?"

BAD QUESTION EXAMPLES (NEVER ASK THESE):
✗ "What is [name]'s full legal name?" (when you already have their name)
✗ "What is the full legal name of [organization]?" (organizations don't have "full legal names")
✗ Any question that's already in the "QUESTIONS ALREADY ASKED" list above

Return ONLY a JSON array with this exact structure:
[
  {
    "id": "specific_beneficiary_names",
    "question": "Your question here?",
    "type": "text",
    "required": true,
    "tooltip": "Brief 1-sentence explanation of why this information is needed for the will."
  }
]

IMPORTANT: Each question MUST include a "tooltip" field with a brief (1 sentence) explanation of why this information is legally necessary or important for creating the will.

Be DIRECT and SPECIFIC. Return ONLY valid JSON array, no extra text.`;

  const { result } = await executeWithRetry(
    async () => {
      const response = await model.generateContent(prompt);
      let text = (await response.response).text().trim();
      
      console.log('[Follow-up Questions] Raw Gemini response:', text);
      
      text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      console.log('[Follow-up Questions] After removing code fences:', text);
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('[Follow-up Questions] No JSON array found. Full text:', text);
        throw new EmptyGeminiResponseError('AI returned empty or invalid response - no JSON array found');
      }
      
      let parsed;
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('JSON parse error. Raw text:', jsonMatch[0]);
        const cleaned = jsonMatch[0]
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
          .replace(/,\s*([}\]])/g, '$1')
          .replace(/([{,])\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
        
        try {
          parsed = JSON.parse(cleaned);
        } catch (secondError) {
          console.error('Failed to parse even after cleaning:', cleaned);
          throw new EmptyGeminiResponseError(`AI returned malformed JSON - ${parseError.message}`);
        }
      }
      
      return parsed;
    },
    'generateFollowUpQuestions'
  );
  
  return result;
}

async function generateWillAssessment(allAnswers, jurisdiction, country, age) {
  const summarized = summarizeAnswers(allAnswers);
  
  const ageWarning = age !== undefined && age !== null
    ? `\n\nUSER AGE: ${age} years old
    - In section 2 (READINESS), if the user is BELOW the minimum age requirement for ${jurisdiction}, explicitly state that they do not meet the age requirement
    - Note that the will may not be legally valid and they MUST consult an attorney
    - If they MEET the age requirement, proceed normally without mentioning age`
    : '';
  
  const prompt = `You have gathered comprehensive information TO CREATE a legal will for ${jurisdiction}, ${country === 'CA' ? 'Canada' : 'United States'}. Provide a brief summary of key decisions and NEXT STEPS for will execution.${ageWarning}

Information gathered (summarized):
${summarized}

ASSESSMENT FORMAT (250-350 words maximum):

1. WILL SUMMARY (4-6 sentences):
   - Executor appointed: [name]
   - Beneficiaries and distribution: [brief summary]
   - Guardian for minors (if applicable): [name]
   - Key assets covered: [brief list]
   - Special bequests (if any): [brief mention]

2. READINESS FOR WILL CREATION (2-3 sentences):
   - State whether we have sufficient information to draft a legally valid will
   - IF USER IS UNDERAGE: Clearly state they do not meet the minimum age requirement and the will may not be legally valid
   - Note if any CRITICAL information is still missing (executor, beneficiaries, or distribution percentages)
   - If missing critical info, state what is needed before proceeding

3. NEXT STEPS - WILL EXECUTION REQUIREMENTS (5-7 points):
   For ${jurisdiction}, the will must be executed as follows:
   - The will document must be printed (not handwritten, not electronic signature)
   - Testator (will-maker) must sign at the end of the document
   - Signature must be witnessed by [2 or 3] independent witnesses simultaneously present
   - Witnesses must be adults (18+ years) who are NOT beneficiaries or spouses of beneficiaries
   - Witnesses must sign in the presence of the testator and each other
   - Each witness should provide their full name, address, and occupation
   - [Any other jurisdiction-specific requirements]

4. CRITICAL GAPS (only if absolutely necessary - 1-2 sentences):
   - Only mention if executor name, beneficiary distribution, or guardian (for minors) is completely missing
   - IF USER IS UNDERAGE: Include age requirement as a critical gap

STRONG LIABILITY DISCLAIMER (3-4 sentences):
- This tool does NOT provide legal advice
- This tool and its creators assume NO legal liability whatsoever
- The generated will may not reflect recent legal changes
- Users MUST have the will reviewed by a licensed attorney before signing or execution

Format as plain text with clear section headers. BE DIRECT AND ACTIONABLE.`;

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
