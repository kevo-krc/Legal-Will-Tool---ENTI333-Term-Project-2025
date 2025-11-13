const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set');
  throw new Error('Gemini API key is required');
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  }
});

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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating compliance statement:', error);
    throw error;
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
    throw error;
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
    throw error;
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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating assessment:', error);
    throw error;
  }
}

module.exports = {
  generateComplianceStatement,
  generateInitialQuestions,
  generateFollowUpQuestions,
  generateWillAssessment
};
