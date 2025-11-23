import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const withTimeout = (promise, timeoutMs = 60000) => {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('Authentication timeout')), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => {
      clearTimeout(timeoutId);
    });
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await withTimeout(
          supabase.auth.getSession()
        );
        
        if (error) throw error;
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        
        setAuthError(null);
      } catch (error) {
        console.error('Error getting session:', error);
        if (error.message === 'Authentication timeout') {
          setAuthError('Connection timeout. Please refresh the page or log in again.');
        } else {
          setAuthError('Authentication failed. Please try logging in again.');
        }
        setUser(null);
        setProfile(null);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            await fetchProfile(session.user.id);
            setAuthError(null);
          } catch (error) {
            console.error('Error loading profile on auth change:', error);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            phone: userData.phone || null
          }
        }
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
          await fetchProfile(authData.user.id);
        } catch (profileError) {
          console.error('Error fetching profile during sign-up:', profileError);
        }
      }

      setAuthError(null);
      return { data: authData, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        try {
          await fetchProfile(data.user.id);
        } catch (profileError) {
          console.error('Error fetching profile during sign-in:', profileError);
        }
      }

      setAuthError(null);
      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setUser(null);
      setProfile(null);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { data: null, error };
    }
  };

  const generateAccountNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `WL${timestamp}${random}`;
  };

  const getSessionToken = async () => {
    try {
      console.log('[getSessionToken] Requesting session from Supabase...');
      
      // Add timeout specifically for getSessionToken to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session token request timeout')), 10000)
      );
      
      const sessionPromise = supabase.auth.getSession();
      const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]);
      
      console.log('[getSessionToken] Received response:', { hasSession: !!session, hasError: !!error });
      if (error) throw error;
      const token = session?.access_token || null;
      console.log('[getSessionToken] Returning token:', token ? 'Token available' : 'No token');
      return token;
    } catch (error) {
      console.error('[getSessionToken] Error getting session token:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (!user) throw new Error('No user logged in');
    await fetchProfile(user.id);
  };

  const value = {
    user,
    profile,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    updateProfile,
    fetchProfile,
    refreshProfile,
    getSessionToken,
    logout: signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
