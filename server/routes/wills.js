const express = require('express');
const { supabase } = require('../lib/supabase');
const { generateWillPDF, generateAssessmentPDF } = require('../lib/pdfGenerator');
const { uploadPDF, getSignedUrl, deletePDF } = require('../lib/storage');
const { sendWillDocumentsEmail } = require('../lib/emailService');
const router = express.Router();

async function createNotification(userId, type, title, message, actionType = 'none', relatedId = null, metadata = {}) {
  try {
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        action_type: actionType,
        related_id: relatedId,
        metadata
      });
    console.log(`[Notification] Created ${type} notification for user ${userId}`);
  } catch (error) {
    console.error('[Notification] Failed to create notification:', error);
  }
}

router.post('/', async (req, res) => {
  try {
    const { 
      user_id, 
      country,
      jurisdiction,
      jurisdiction_full_name
    } = req.body;

    const { data, error } = await supabase
      .from('wills')
      .insert([{
        user_id,
        country,
        jurisdiction,
        jurisdiction_full_name,
        status: 'draft',
        questionnaire_round: 1
      }])
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error creating will:', error);
    res.status(500).json({ error: 'Failed to create will' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('wills')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching wills:', error);
    res.status(500).json({ error: 'Failed to fetch wills' });
  }
});

router.get('/:willId', async (req, res) => {
  try {
    const { willId } = req.params;

    const { data, error } = await supabase
      .from('wills')
      .select('*')
      .eq('id', willId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Will not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching will:', error);
    res.status(500).json({ error: 'Failed to fetch will' });
  }
});

router.put('/:willId', async (req, res) => {
  try {
    const { willId } = req.params;
    const updates = req.body;

    const allowedFields = [
      'compliance_statement',
      'compliance_generated_at',
      'qa_data',
      'questionnaire_round',
      'questionnaire_completed',
      'will_content',
      'assessment_content',
      'will_pdf_path',
      'assessment_pdf_path',
      'disclaimer_accepted',
      'disclaimer_accepted_at',
      'status'
    ];

    const filteredUpdates = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    const { data, error } = await supabase
      .from('wills')
      .update(filteredUpdates)
      .eq('id', willId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating will:', error);
    res.status(500).json({ error: 'Failed to update will' });
  }
});

router.delete('/:willId', async (req, res) => {
  try {
    const { willId } = req.params;

    const { error } = await supabase
      .from('wills')
      .delete()
      .eq('id', willId);

    if (error) throw error;

    res.json({ message: 'Will deleted successfully' });
  } catch (error) {
    console.error('Error deleting will:', error);
    res.status(500).json({ error: 'Failed to delete will' });
  }
});

router.post('/:willId/generate-pdfs', async (req, res) => {
  try {
    const { willId } = req.params;
    
    console.log(`[PDF Generation] Starting for will ID: ${willId}`);
    
    // Fetch the will data
    const { data: will, error: fetchError } = await supabase
      .from('wills')
      .select('*')
      .eq('id', willId)
      .single();
    
    if (fetchError) {
      console.error('[PDF Generation] Error fetching will:', fetchError);
      throw fetchError;
    }
    
    if (!will) {
      return res.status(404).json({ error: 'Will not found' });
    }
    
    // Check if questionnaire is completed
    if (!will.questionnaire_completed) {
      return res.status(400).json({ 
        error: 'Cannot generate PDFs. Please complete the questionnaire first.' 
      });
    }
    
    // Fetch user profile for full_name
    console.log('[PDF Generation] Fetching user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', will.user_id)
      .single();
    
    if (profileError) {
      console.error('[PDF Generation] Error fetching profile:', profileError);
    }
    
    console.log('[PDF Generation] Generating Will PDF...');
    const willPDFBuffer = await generateWillPDF(will, profile);
    
    console.log('[PDF Generation] Generating Assessment PDF...');
    const assessmentPDFBuffer = await generateAssessmentPDF(will, profile);
    
    // Generate file paths
    const timestamp = Date.now();
    const willPDFPath = `${will.user_id}/${willId}/will_${timestamp}.pdf`;
    const assessmentPDFPath = `${will.user_id}/${willId}/assessment_${timestamp}.pdf`;
    
    console.log('[PDF Generation] Uploading Will PDF to storage...');
    await uploadPDF(willPDFBuffer, willPDFPath);
    
    console.log('[PDF Generation] Uploading Assessment PDF to storage...');
    await uploadPDF(assessmentPDFBuffer, assessmentPDFPath);
    
    // Update will record with PDF paths
    console.log('[PDF Generation] Updating will record with PDF paths...');
    const { data: updatedWill, error: updateError } = await supabase
      .from('wills')
      .update({
        will_pdf_path: willPDFPath,
        assessment_pdf_path: assessmentPDFPath,
        status: 'completed'
      })
      .eq('id', willId)
      .select()
      .single();
    
    if (updateError) {
      console.error('[PDF Generation] Error updating will:', updateError);
      throw updateError;
    }
    
    // Generate signed URLs for download (valid for 1 hour)
    console.log('[PDF Generation] Generating signed URLs...');
    const willDownloadUrl = await getSignedUrl(willPDFPath, 3600);
    const assessmentDownloadUrl = await getSignedUrl(assessmentPDFPath, 3600);
    
    console.log('[PDF Generation] PDF generation completed successfully');
    
    res.json({
      success: true,
      will: updatedWill,
      downloadUrls: {
        willPdf: willDownloadUrl,
        assessmentPdf: assessmentDownloadUrl
      },
      message: 'PDFs generated successfully'
    });
    
  } catch (error) {
    console.error('[PDF Generation] Error:', error);
    
    const { willId } = req.params;
    const { data: will } = await supabase
      .from('wills')
      .select('user_id')
      .eq('id', willId)
      .single();
    
    if (will?.user_id) {
      await createNotification(
        will.user_id,
        'pdf_failure',
        'PDF Generation Failed',
        `Failed to generate PDF documents for your will. Error: ${error.message}`,
        'retry_pdf',
        willId,
        { error: error.message, timestamp: new Date().toISOString() }
      );
    }
    
    res.status(500).json({ 
      error: 'Failed to generate PDFs',
      details: error.message 
    });
  }
});

router.get('/:willId/download-pdfs', async (req, res) => {
  try {
    const { willId } = req.params;
    
    // Fetch the will data
    const { data: will, error: fetchError } = await supabase
      .from('wills')
      .select('will_pdf_path, assessment_pdf_path')
      .eq('id', willId)
      .single();
    
    if (fetchError) throw fetchError;
    
    if (!will) {
      return res.status(404).json({ error: 'Will not found' });
    }
    
    if (!will.will_pdf_path || !will.assessment_pdf_path) {
      return res.status(400).json({ 
        error: 'PDFs not yet generated. Please generate PDFs first.' 
      });
    }
    
    // Generate signed URLs (valid for 1 hour)
    const willDownloadUrl = await getSignedUrl(will.will_pdf_path, 3600);
    const assessmentDownloadUrl = await getSignedUrl(will.assessment_pdf_path, 3600);
    
    res.json({
      downloadUrls: {
        willPdf: willDownloadUrl,
        assessmentPdf: assessmentDownloadUrl
      }
    });
    
  } catch (error) {
    console.error('Error generating download URLs:', error);
    res.status(500).json({ 
      error: 'Failed to generate download URLs',
      details: error.message 
    });
  }
});

const emailRateLimiter = new Map();

function checkEmailRateLimit(userId, maxEmails = 5, windowMs = 3600000) {
  const now = Date.now();
  const userKey = userId;
  
  if (!emailRateLimiter.has(userKey)) {
    emailRateLimiter.set(userKey, []);
  }
  
  const timestamps = emailRateLimiter.get(userKey).filter(t => now - t < windowMs);
  
  if (timestamps.length >= maxEmails) {
    return false;
  }
  
  timestamps.push(now);
  emailRateLimiter.set(userKey, timestamps);
  return true;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

router.post('/:willId/share-email', async (req, res) => {
  try {
    const { willId } = req.params;
    const { recipientEmail, userId } = req.body;
    
    if (!recipientEmail || !userId) {
      return res.status(400).json({ error: 'Recipient email and user ID are required' });
    }
    
    if (!validateEmail(recipientEmail)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }
    
    if (!checkEmailRateLimit(userId)) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Maximum 5 emails per hour.' 
      });
    }
    
    console.log(`[Email Share] Starting email share for will ID: ${willId} to ${recipientEmail}`);
    
    const { data: will, error: fetchError } = await supabase
      .from('wills')
      .select('*')
      .eq('id', willId)
      .eq('user_id', userId)
      .single();
    
    if (fetchError) {
      console.error('[Email Share] Error fetching will:', fetchError);
      throw fetchError;
    }
    
    if (!will) {
      return res.status(404).json({ error: 'Will not found or access denied' });
    }
    
    if (!will.will_pdf_path || !will.assessment_pdf_path) {
      return res.status(400).json({ 
        error: 'PDFs not yet generated. Please generate PDFs first.' 
      });
    }
    
    console.log('[Email Share] Fetching user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', will.user_id)
      .single();
    
    if (profileError) {
      console.error('[Email Share] Error fetching profile:', profileError);
    }
    
    console.log('[Email Share] Regenerating PDFs from latest will data...');
    const willPDFBuffer = await generateWillPDF(will, profile);
    const assessmentPDFBuffer = await generateAssessmentPDF(will, profile);
    
    const userName = profile?.full_name || 'User';
    
    console.log('[Email Share] Sending email...');
    await sendWillDocumentsEmail(
      recipientEmail,
      userName,
      willPDFBuffer,
      assessmentPDFBuffer
    );
    
    console.log(`[Email Share] Successfully sent will ${willId} to ${recipientEmail} for user ${userId}`);
    
    res.json({
      success: true,
      message: `Will documents successfully sent to ${recipientEmail}`
    });
    
  } catch (error) {
    console.error('[Email Share] Error:', error);
    
    const { willId } = req.params;
    const { userId, recipientEmail } = req.body;
    
    if (userId) {
      await createNotification(
        userId,
        'email_failure',
        'Email Sharing Failed',
        `Failed to send will documents to ${recipientEmail || 'recipient'}. Error: ${error.message}`,
        'retry_email',
        willId,
        { 
          recipientEmail: recipientEmail || 'unknown',
          error: error.message, 
          timestamp: new Date().toISOString() 
        }
      );
    }
    
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

module.exports = router;
