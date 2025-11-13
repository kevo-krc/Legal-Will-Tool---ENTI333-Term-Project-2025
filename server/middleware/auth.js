const { supabase } = require('../lib/supabase');

async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[Auth Middleware] Missing authorization header');
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      console.log('[Auth Middleware] Empty token');
      return res.status(401).json({ error: 'Missing authentication token' });
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('[Auth Middleware] Token validation error:', error?.message || 'No user found');
      return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }
    
    req.authenticatedUserId = user.id;
    req.authenticatedUser = user;
    
    console.log(`[Auth Middleware] Authenticated user: ${req.authenticatedUserId}`);
    
    next();
  } catch (err) {
    console.error('[Auth Middleware] Unexpected error:', err);
    return res.status(401).json({ error: 'Authentication failed. Please log in again.' });
  }
}

module.exports = { authenticateUser };
