"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User, SupabaseClient } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  supabase: SupabaseClient | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      const { supabase: supabaseClient } = await import("@/lib/supabaseClient");
      setSupabase(supabaseClient);

      // Get initial session
      const { data: { session } } = await supabaseClient.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Subscribe to auth state changes
      const { data: listener } = supabaseClient.auth.onAuthStateChange((event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // Store the unsubscribe function
      unsubscribe = () => {
        listener.subscription.unsubscribe();
      };
    };

    initializeAuth();

    // Cleanup on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const value = { user, session, supabase, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};