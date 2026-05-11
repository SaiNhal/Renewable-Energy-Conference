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
class AuthManager {
  private static instance: AuthManager;
  private initialized = false;
  private initializing = false;
  private initPromise: Promise<void> | null = null;
  private subscription: any = null;
  private listeners = new Set<(user: User | null, session: Session | null) => void>();

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  async initialize(): Promise<{ user: User | null; session: Session | null }> {
    if (this.initialized) {
      // Return current session if already initialized
      const { data: { session } } = await supabase.auth.getSession();
      return { user: session?.user ?? null, session };
    }

    if (this.initializing && this.initPromise) {
      // Wait for ongoing initialization
      await this.initPromise;
      const { data: { session } } = await supabase.auth.getSession();
      return { user: session?.user ?? null, session };
    }

    this.initializing = true;
    this.initPromise = this._initialize();

    try {
      const result = await this.initPromise;
      this.initialized = true;
      return result;
    } finally {
      this.initializing = false;
      this.initPromise = null;
    }
  }

  private async _initialize(): Promise<{ user: User | null; session: Session | null }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Set up global auth state change listener
      if (!this.subscription) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            // Notify all listeners
            this.listeners.forEach(listener => {
              try {
                listener(session?.user ?? null, session);
              } catch (error) {
                console.error("Auth listener error:", error);
              }
            });
          }
        );
        this.subscription = subscription;
      }

      return { user: session?.user ?? null, session };
    } catch (error) {
      console.error("Auth initialization error:", error);
      return { user: null, session: null };
    }
  }

  addListener(listener: (user: User | null, session: Session | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async checkAdmin(userId: string): Promise<boolean> {
    try {
      const { data } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      return !!data;
    } catch (error) {
      console.error("Admin check error:", error);
      return false;
    }
  }

  async signIn(email: string, password: string): Promise<{ data: any; error: AuthError | null }> {
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      return result;
    } catch (error) {
      console.error("Sign in error:", error);
      return { data: null, error: error as AuthError };
    }
  }

  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const authManager = AuthManager.getInstance();
  const isMountedRef = useRef(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user: initialUser, session: initialSession } = await authManager.initialize();

        if (!isMountedRef.current) return;

        setUser(initialUser);
        setSession(initialSession);

        if (initialUser) {
          const adminStatus = await authManager.checkAdmin(initialUser.id);
          if (isMountedRef.current) {
            setIsAdmin(adminStatus);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Auth provider initialization error:", error);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const removeListener = authManager.addListener(async (newUser, newSession) => {
      if (!isMountedRef.current) return;

      setUser(newUser);
      setSession(newSession);

      if (newUser) {
        const adminStatus = await authManager.checkAdmin(newUser.id);
        if (isMountedRef.current) {
          setIsAdmin(adminStatus);
        }
      } else {
        setIsAdmin(false);
      }

      if (isMountedRef.current) {
        setLoading(false);
      }
    });

    return () => {
      isMountedRef.current = false;
      removeListener();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isMountedRef.current) return { error: null };

    setLoading(true);
    try {
      const { data, error } = await authManager.signIn(email, password);

      if (data?.session?.user && isMountedRef.current) {
        setUser(data.session.user);
        setSession(data.session);
        const adminStatus = await authManager.checkAdmin(data.session.user.id);
        setIsAdmin(adminStatus);
      }

      return { error };
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
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      await authManager.signOut();
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
