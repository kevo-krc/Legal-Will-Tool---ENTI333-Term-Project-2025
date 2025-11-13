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

  const withTimeout = (promise, timeoutMs = 10000) => {
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
          setAuthError('Connection timeout. Please check your internet connection and try again.');
          console.log('[Auth Timeout] Session/profile fetch exceeded 10 seconds');
        } else {
          setAuthError('Authentication failed. Please try logging in again.');
        }
        setUser(null);
        setProfile(null);
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
          } catch (error) {
            if (error.message === 'Authentication timeout') {
              setAuthError('Connection timeout. Please check your internet connection and try again.');
            }
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
      const { data, error } = await withTimeout(
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single()
      );

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.message === 'Authentication timeout') {
        console.log('[Auth Timeout] Profile fetch exceeded 10 seconds');
      }
      throw error;
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      const { data: authData, error: signUpError } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: userData.fullName,
              phone: userData.phone || null
            }
          }
        })
      );

      if (signUpError) throw signUpError;

      let profileTimedOut = false;
      if (authData.user) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
          await fetchProfile(authData.user.id);
        } catch (profileError) {
          if (profileError.message === 'Authentication timeout') {
            profileTimedOut = true;
            setAuthError('Connection timeout while loading profile. Please check your internet connection and refresh.');
          } else {
            throw profileError;
          }
        }
      }

      if (!profileTimedOut) {
        setAuthError(null);
      }
      
      return { data: authData, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      if (error.message === 'Authentication timeout') {
        console.log('[Auth Timeout] Sign-up request exceeded 10 seconds');
      }
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password,
        })
      );

      if (error) throw error;

      let profileTimedOut = false;
      if (data.user) {
        try {
          await fetchProfile(data.user.id);
        } catch (profileError) {
          if (profileError.message === 'Authentication timeout') {
            profileTimedOut = true;
            setAuthError('Connection timeout while loading profile. Please check your internet connection and refresh.');
          } else {
            throw profileError;
          }
        }
      }

      if (!profileTimedOut) {
        setAuthError(null);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      if (error.message === 'Authentication timeout') {
        console.log('[Auth Timeout] Sign-in request exceeded 10 seconds');
      }
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await withTimeout(
        supabase.auth.signOut()
      );
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      if (error.message === 'Authentication timeout') {
        console.log('[Auth Timeout] Sign-out request exceeded 10 seconds');
        setUser(null);
        setProfile(null);
      }
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await withTimeout(
        supabase
          .from('profiles')
          .update(updates)
          .eq('user_id', user.id)
          .select()
          .single()
      );

      if (error) throw error;

      setProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.message === 'Authentication timeout') {
        console.log('[Auth Timeout] Profile update exceeded 10 seconds');
      }
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
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session?.access_token || null;
    } catch (error) {
      console.error('Error getting session token:', error);
      return null;
    }
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
    getSessionToken,
    logout: signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
