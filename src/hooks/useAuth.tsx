import { createContext, useContext, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const authCheckId = useRef(0);

  const checkAdmin = useCallback(async (userId: string) => {
    const { data, error } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    if (error) {
      console.error("Unable to verify admin role:", error.message);
      return false;
    }

    return !!data;
  }, []);

  const applySession = useCallback(async (nextSession: Session | null) => {
    const checkId = authCheckId.current + 1;
    authCheckId.current = checkId;

    setLoading(true);
    setSession(nextSession);
    setUser(nextSession?.user ?? null);

    if (!nextSession?.user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const hasAdminRole = await checkAdmin(nextSession.user.id);

      if (authCheckId.current === checkId) {
        setIsAdmin(hasAdminRole);
      }
    } catch (error) {
      if (authCheckId.current === checkId) {
        console.error("Unable to verify admin role:", error);
        setIsAdmin(false);
      }
    } finally {
      if (authCheckId.current === checkId) {
        setLoading(false);
      }
    }
  }, [checkAdmin]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setTimeout(() => {
          void applySession(session);
        }, 0);
      }
    );

    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error("Unable to restore auth session:", error.message);
        }

        void applySession(session);
      })
      .catch((error) => {
        console.error("Unable to restore auth session:", error);
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      });

    return () => {
      authCheckId.current += 1;
      subscription.unsubscribe();
    };
  }, [applySession]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
