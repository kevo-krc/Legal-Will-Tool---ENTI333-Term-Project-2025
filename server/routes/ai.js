const express = require('express');
const { 
  generateComplianceStatement, 
  generateInitialQuestions, 
  generateFollowUpQuestions,
  generateWillAssessment 
} = require('../lib/gemini');
const router = express.Router();

router.post('/compliance', async (req, res) => {
  try {
    const { jurisdiction, country } = req.body;

    if (!jurisdiction || !country) {
      return res.status(400).json({ 
        error: 'Missing required fields: jurisdiction and country' 
      });
    }

    if (!['CA', 'US'].includes(country)) {
      return res.status(400).json({ 
        error: 'Country must be CA or US' 
      });
    }

    const statement = await generateComplianceStatement(jurisdiction, country);

    res.json({ 
      compliance_statement: statement,
      jurisdiction,
      country,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating compliance statement:', error);
    
    if (error.name === 'GeminiQuotaError') {
      return res.status(429).json({ 
        error: error.message,
        errorType: error.type,
        retryAfter: error.retryAfter
      });
    }
    
    if (error.status === 503 || error.statusText === 'Service Unavailable') {
      return res.status(503).json({ 
        error: 'AI service is temporarily overloaded. Please try again in a moment.',
        errorType: 'SERVICE_UNAVAILABLE',
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate compliance statement',
      message: error.message 
    });
  }
});

router.post('/questions/initial', async (req, res) => {
  try {
    const { jurisdiction, country, userName } = req.body;

    if (!jurisdiction || !country || !userName) {
      return res.status(400).json({ 
        error: 'Missing required fields: jurisdiction, country, userName' 
      });
    }

    const questions = await generateInitialQuestions(jurisdiction, country, userName);

    res.json({ 
      questions,
      round: 1,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating initial questions:', error);
    
    if (error.name === 'GeminiQuotaError') {
      return res.status(429).json({ 
        error: error.message,
        errorType: error.type,
        retryAfter: error.retryAfter
      });
    }
    
    if (error.status === 503 || error.statusText === 'Service Unavailable') {
      return res.status(503).json({ 
        error: 'AI service is temporarily overloaded. Please try again in a moment.',
        errorType: 'SERVICE_UNAVAILABLE',
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate questions',
      message: error.message 
    });
  }
});

router.post('/questions/followup', async (req, res) => {
  try {
    const { previousAnswers, jurisdiction, country, roundNumber } = req.body;

    if (!previousAnswers || !jurisdiction || !country || !roundNumber) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    if (roundNumber < 2 || roundNumber > 3) {
      return res.status(400).json({ 
        error: 'Round number must be 2 or 3' 
      });
    }

    const questions = await generateFollowUpQuestions(
      previousAnswers, 
      jurisdiction, 
      country, 
      roundNumber
    );

    res.json({ 
      questions,
      round: roundNumber,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    
    if (error.name === 'GeminiQuotaError') {
      return res.status(429).json({ 
        error: error.message,
        errorType: error.type,
        retryAfter: error.retryAfter
      });
    }
    
    if (error.status === 503 || error.statusText === 'Service Unavailable') {
      return res.status(503).json({ 
        error: 'AI service is temporarily overloaded. Please try again in a moment.',
        errorType: 'SERVICE_UNAVAILABLE',
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate follow-up questions',
      message: error.message 
    });
  }
});

router.post('/assessment', async (req, res) => {
  try {
    const { allAnswers, jurisdiction, country } = req.body;

    if (!allAnswers || !jurisdiction || !country) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    const assessment = await generateWillAssessment(allAnswers, jurisdiction, country);

    res.json({ 
      assessment,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating assessment:', error);
    
    if (error.name === 'GeminiQuotaError') {
      return res.status(429).json({ 
        error: error.message,
        errorType: error.type,
        retryAfter: error.retryAfter
      });
    }
    
    if (error.status === 503 || error.statusText === 'Service Unavailable') {
      return res.status(503).json({ 
        error: 'AI service is temporarily overloaded. Please try again in a moment.',
        errorType: 'SERVICE_UNAVAILABLE',
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate assessment',
      message: error.message 
    });
  }
});

module.exports = router;
