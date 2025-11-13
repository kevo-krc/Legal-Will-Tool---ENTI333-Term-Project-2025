const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { deleteAllUserFiles } = require('../lib/storage');
const { sendWillDocumentsEmail } = require('../lib/emailService');

router.delete('/:userId/data', async (req, res) => {
  try {
    const { userId } = req.params;
    const { requestingUserId } = req.body;
    
    if (!requestingUserId) {
      return res.status(400).json({ error: 'Missing requestingUserId in request body' });
    }
    
    if (userId !== requestingUserId) {
      console.error(`[Data Deletion] Authorization failed: userId ${userId} !== requestingUserId ${requestingUserId}`);
      return res.status(403).json({ error: 'Unauthorized: You can only delete your own account' });
    }
    
    console.log(`[Data Deletion] Starting complete data deletion for user: ${userId}`);
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('user_id', userId)
      .single();
    
    if (profileError) {
      console.error('[Data Deletion] Error fetching profile:', profileError);
      throw profileError;
    }
    
    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userEmail = profile.email;
    const userName = profile.full_name;
    
    console.log(`[Data Deletion] Step 1: Deleting all PDF files from storage...`);
    try {
      await deleteAllUserFiles(userId);
      console.log('[Data Deletion] Storage files deleted successfully');
    } catch (storageError) {
      console.error('[Data Deletion] Warning: Error deleting storage files:', storageError);
    }
    
    console.log(`[Data Deletion] Step 2: Deleting all wills from database...`);
    const { error: willsError } = await supabase
      .from('wills')
      .delete()
      .eq('user_id', userId);
    
    if (willsError) {
      console.error('[Data Deletion] Error deleting wills:', willsError);
      throw willsError;
    }
    console.log('[Data Deletion] Wills deleted successfully');
    
    console.log(`[Data Deletion] Step 3: Deleting user profile...`);
    const { error: profileDeleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId);
    
    if (profileDeleteError) {
      console.error('[Data Deletion] Error deleting profile:', profileDeleteError);
      throw profileDeleteError;
    }
    console.log('[Data Deletion] Profile deleted successfully');
    
    console.log(`[Data Deletion] Step 4: Deleting Supabase Auth user...`);
    const { createClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authDeleteError) {
      console.error('[Data Deletion] Error deleting auth user:', authDeleteError);
      throw new Error(`Failed to delete auth user: ${authDeleteError.message}`);
    }
    console.log('[Data Deletion] Auth user deleted successfully');
    
    console.log(`[Data Deletion] Step 5: Sending confirmation email...`);
    try {
      await sendDataDeletionConfirmationEmail(userEmail, userName);
      console.log('[Data Deletion] Confirmation email sent successfully');
    } catch (emailError) {
      console.error('[Data Deletion] Warning: Could not send confirmation email:', emailError);
    }
    
    console.log(`[Data Deletion] Complete data deletion finished successfully for user: ${userId}`);
    
    res.json({
      success: true,
      message: 'All user data has been permanently deleted',
      email: userEmail
    });
    
  } catch (error) {
    console.error('[Data Deletion] Error:', error);
    res.status(500).json({ 
      error: 'Failed to delete user data',
      details: error.message 
    });
  }
});

async function sendDataDeletionConfirmationEmail(recipientEmail, userName) {
  const sgMail = require('@sendgrid/mail');
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDER_EMAIL;
  
  if (!apiKey || !fromEmail) {
    throw new Error('Email service not configured');
  }
  
  sgMail.setApiKey(apiKey);
  
  const msg = {
    to: recipientEmail,
    from: fromEmail,
    subject: 'Account Data Deletion Confirmation - Legal Will Generation Tool',
    text: `Dear ${userName},\n\nThis email confirms that all your personal data has been permanently deleted from the Legal Will Generation Tool.\n\nThe following data has been removed:\n- Your user profile and account information\n- All created will documents and assessments\n- All questionnaire responses and stored data\n- All generated PDF files\n\nThis action cannot be undone. If you wish to use the service again in the future, you will need to create a new account.\n\nThank you for using our service.\n\nBest regards,\nLegal Will Generation Tool`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1E3A8A;">Account Data Deletion Confirmation</h2>
        
        <p>Dear ${userName},</p>
        
        <p>This email confirms that all your personal data has been <strong>permanently deleted</strong> from the Legal Will Generation Tool.</p>
        
        <div style="background-color: #F3F4F6; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0;">
          <h3 style="color: #1E3A8A; margin-top: 0;">Data Removed:</h3>
          <ul style="margin: 10px 0;">
            <li>Your user profile and account information</li>
            <li>All created will documents and assessments</li>
            <li>All questionnaire responses and stored data</li>
            <li>All generated PDF files</li>
          </ul>
        </div>
        
        <div style="background-color: #FEE2E2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0;">
          <p style="color: #991B1B; margin: 0;">
            <strong>Important:</strong> This action cannot be undone. If you wish to use the service again in the future, you will need to create a new account.
          </p>
        </div>
        
        <p style="margin-top: 30px;">
          Thank you for using our service.
        </p>
        
        <p style="margin-top: 20px;">
          Best regards,<br>
          <strong>Legal Will Generation Tool</strong>
        </p>
      </div>
    `
  };
  
  await sgMail.send(msg);
  console.log('[Email Service] Data deletion confirmation sent to:', recipientEmail);
}

module.exports = router;
