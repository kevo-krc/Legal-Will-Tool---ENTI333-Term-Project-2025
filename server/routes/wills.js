const express = require('express');
const { supabase } = require('../lib/supabase');
const { generateWillPdf } = require('../services/pdfService');
const { sendWillEmail } = require('../services/emailService');
const router = express.Router();

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
      'status',
      'storage_base_path',
      'pdf_filename'
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

    if (updates.questionnaire_completed && updates.assessment_content) {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('account_number, email')
          .eq('user_id', data.user_id)
          .single();

        const userInfo = {
          email: profileData?.email || 'Not provided',
          account_number: profileData?.account_number || 'Not provided'
        };

        const pdfBuffer = await generateWillPdf({
          willId: data.id,
          user: userInfo,
          willData: data,
          assessmentContent: updates.assessment_content
        });

        const storagePath = `user_${data.user_id}/will_${data.id}`;
        const filename = 'draft.pdf';
        const fullPath = `${storagePath}/${filename}`;

        const { error: uploadError } = await supabase.storage
          .from('will-documents')
          .upload(fullPath, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true
          });

        if (uploadError) {
          console.error('Error uploading PDF:', uploadError);
        } else {
          const { data: updatedData, error: storageUpdateError } = await supabase
            .from('wills')
            .update({
              storage_base_path: storagePath,
              pdf_filename: filename
            })
            .eq('id', willId)
            .select()
            .single();

          if (storageUpdateError) {
            console.error('Error updating storage fields:', storageUpdateError);
          } else {
            return res.json(updatedData);
          }
        }
      } catch (pdfError) {
        console.error('Error generating PDF:', pdfError);
      }
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating will:', error);
    res.status(500).json({ error: 'Failed to update will' });
  }
});

router.get('/:willId/download', async (req, res) => {
  try {
    const { willId } = req.params;

    const { data: will, error: willError } = await supabase
      .from('wills')
      .select('*')
      .eq('id', willId)
      .single();

    if (willError) {
      if (willError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Will not found' });
      }
      throw willError;
    }

    if (!will.storage_base_path || !will.pdf_filename) {
      return res.status(404).json({ error: 'PDF not generated yet' });
    }

    const filePath = `${will.storage_base_path}/${will.pdf_filename}`;
    
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('will-documents')
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading PDF:', downloadError);
      return res.status(404).json({ error: 'PDF file not found' });
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="will_${will.jurisdiction}_${new Date().toISOString().split('T')[0]}.pdf"`);
    res.setHeader('Content-Length', buffer.length);
    
    res.send(buffer);
  } catch (error) {
    console.error('Error downloading will PDF:', error);
    res.status(500).json({ error: 'Failed to download PDF' });
  }
});

router.post('/:willId/email', async (req, res) => {
  try {
    const { willId } = req.params;

    const { data: will, error: willError } = await supabase
      .from('wills')
      .select('*')
      .eq('id', willId)
      .single();

    if (willError) {
      if (willError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Will not found' });
      }
      throw willError;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('user_id', will.user_id)
      .single();

    if (profileError || !profile?.email) {
      return res.status(400).json({ error: 'User email not found' });
    }

    if (!will.storage_base_path || !will.pdf_filename) {
      return res.status(422).json({ 
        error: 'PDF not generated yet. Please complete the questionnaire first.' 
      });
    }

    const filePath = `${will.storage_base_path}/${will.pdf_filename}`;
    
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('will-documents')
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading PDF for email:', downloadError);
      return res.status(404).json({ error: 'PDF file not found' });
    }

    const pdfBuffer = Buffer.from(await fileData.arrayBuffer());

    const emailResult = await sendWillEmail({
      to: profile.email,
      willId: will.id,
      jurisdiction: will.jurisdiction_full_name,
      pdfBuffer
    });

    res.json({ sent: true });
  } catch (error) {
    console.error('Error sending will email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

router.delete('/:willId', async (req, res) => {
  try {
    const { willId } = req.params;

    const { data: will, error: fetchError } = await supabase
      .from('wills')
      .select('*')
      .eq('id', willId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Will not found' });
      }
      throw fetchError;
    }

    let filesRemoved = 0;

    if (will.storage_base_path) {
      try {
        const folderPath = will.storage_base_path;
        
        const { data: fileList, error: listError } = await supabase.storage
          .from('will-documents')
          .list(folderPath);

        if (listError) {
          console.error('Error listing files for deletion:', listError);
          throw new Error(`Failed to list storage files: ${listError.message}`);
        }
        
        if (fileList && fileList.length > 0) {
          const filePaths = fileList.map(file => `${folderPath}/${file.name}`);
          
          const { data: removeData, error: removeError } = await supabase.storage
            .from('will-documents')
            .remove(filePaths);

          if (removeError) {
            console.error('Error removing files from storage:', removeError);
            throw new Error(`Failed to delete storage files: ${removeError.message}`);
          }
          
          filesRemoved = filePaths.length;
          console.log(`Successfully removed ${filesRemoved} files from storage`);
        } else {
          console.log('No files found in storage for this will (empty folder)');
        }
      } catch (storageError) {
        console.error('Storage deletion error:', storageError);
        return res.status(500).json({ 
          error: 'Failed to delete storage files',
          details: storageError.message 
        });
      }
    }

    const { error: deleteError } = await supabase
      .from('wills')
      .delete()
      .eq('id', willId);

    if (deleteError) {
      throw deleteError;
    }

    res.json({ 
      deleted: true, 
      filesRemoved 
    });
  } catch (error) {
    console.error('Error deleting will:', error);
    res.status(500).json({ error: 'Failed to delete will' });
  }
});

module.exports = router;
