"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// Note: We are NOT importing supabase here at the top level anymore.
import type { Session, User, SupabaseClient } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  supabase: SupabaseClient | null; // We can also pass the client through context
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function dynamically imports the supabase client
    // and sets up the auth listener. This breaks the circular dependency.
    const initializeAuth = async () => {
      // THE FIX: Dynamically import supabase client inside useEffect
      const { supabase: supabaseClient } = await import('@/lib/supabaseClient');
      setSupabase(supabaseClient);

      // Fetch the initial session
      const { data: { session } } = await supabaseClient.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Listen for auth state changes
      const { data: authListener } = supabaseClient.auth.onAuthStateChange(
        (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      // Cleanup listener on component unmount
      return () => {
        authListener?.subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    session,
    supabase,
    loading,
  };

  // Only render the application after the initial auth check is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
