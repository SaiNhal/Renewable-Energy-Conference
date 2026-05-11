import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { AuthError, Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Global auth initialization state to prevent race conditions in React Strict Mode
let globalAuthInitialized = false;
let globalAuthInitializing = false;
let globalAuthSubscription: any = null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const isMountedRef = useRef(true);

  const checkAdmin = async (userId: string) => {
    try {
      const { data } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      if (isMountedRef.current) {
        setIsAdmin(!!data);
      }
    } catch (error) {
      console.error("Admin check error:", error);
      if (isMountedRef.current) {
        setIsAdmin(false);
      }
    }
  };

  const handleAuthStateChange = async (_event: string, session: Session | null) => {
    if (!isMountedRef.current) return;

    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      await checkAdmin(session.user.id);
    } else {
      setIsAdmin(false);
    }

    if (isMountedRef.current) {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prevent multiple auth initializations in React Strict Mode
    if (globalAuthInitialized || globalAuthInitializing) {
      // If already initialized, just set up local state
      if (globalAuthInitialized) {
        const getCurrentSession = async () => {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (isMountedRef.current) {
              setSession(session);
              setUser(session?.user ?? null);
              if (session?.user) {
                await checkAdmin(session.user.id);
              } else {
                setIsAdmin(false);
              }
              setLoading(false);
            }
          } catch (error) {
            console.error("Session check error:", error);
            if (isMountedRef.current) {
              setLoading(false);
            }
          }
        };
        getCurrentSession();
      }
      return;
    }

    globalAuthInitializing = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!isMountedRef.current) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await checkAdmin(session.user.id);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
        globalAuthInitialized = true;
        globalAuthInitializing = false;
      }
    };

    // Initialize auth once globally
    initializeAuth();

    // Set up global auth state change listener
    if (!globalAuthSubscription) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
      globalAuthSubscription = subscription;
    }

    return () => {
      isMountedRef.current = false;
      // Don't unsubscribe global subscription here - let it persist
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isMountedRef.current) return { error: null };

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (data?.session?.user && isMountedRef.current) {
        setUser(data.session.user);
        setSession(data.session);
        await checkAdmin(data.session.user.id);
      }

      return { error };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: error as AuthError };
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const signOut = async () => {
    if (!isMountedRef.current) return;

    setLoading(true);
    try {
      setSession(null);
      setUser(null);
      setIsAdmin(false);

      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
