const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const aiRoutes = require('./routes/ai');
const willsRoutes = require('./routes/wills');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/ai', aiRoutes);
app.use('/api/wills', willsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Legal Will Generation Tool API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/config/check', (req, res) => {
  const hasSupabaseUrl = !!process.env.SUPABASE_URL;
  const hasSupabaseKey = !!process.env.SUPABASE_ANON_KEY;
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  const hasSendGridKey = !!process.env.SENDGRID_API_KEY;

  res.json({
    supabase: hasSupabaseUrl && hasSupabaseKey,
    gemini: hasGeminiKey,
    sendgrid: hasSendGridKey,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Checking configuration...');
  console.log(`- Supabase URL: ${process.env.SUPABASE_URL ? 'Set' : 'Missing'}`);
  console.log(`- Supabase Anon Key: ${process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing'}`);
  console.log(`- Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Set' : 'Missing'}`);
  console.log(`- SendGrid API Key: ${process.env.SENDGRID_API_KEY ? 'Set' : 'Missing'}`);
});
