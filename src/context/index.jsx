import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '@/db/supabase';

const UrlContext = createContext();

export const UrlProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch current user
  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsAuthenticated(!!user);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Check auth state on mount
  useEffect(() => {
    fetchUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setIsAuthenticated(!!session?.user);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <UrlContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        fetchUser,
        logout,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};

export const UrlState = () => {
  const context = useContext(UrlContext);
  if (!context) {
    throw new Error('UrlState must be used within UrlProvider');
  }
  return context;
};