const express = require('express');
const { supabase } = require('../lib/supabase');
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

module.exports = router;
