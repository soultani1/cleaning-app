import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import supabase from '@/lib/supabaseClient';

// Define types for our context
type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props type for the AuthProvider component
type AuthProviderProps = {
  children: ReactNode;
};

/**
 * AuthProvider component to wrap the application and provide authentication state
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // State to track user, session, and loading status
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the initial session when the component mounts
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        }
        
        // Set initial state from the session
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Unexpected error during getSession:', error);
      } finally {
        // Mark loading as complete regardless of outcome
        setLoading(false);
      }
    };

    // Call the function to get initial session
    getInitialSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Clean up subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Create the value object for the context
  const value = {
    user,
    session,
    loading,
  };

  // Only render children after the initial loading is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 * This simplifies consuming the context in components
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};