
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isStaff: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check user roles
          console.log("Checking roles for user:", session.user.id);
          const { data: adminCheck, error: adminError } = await supabase.rpc('is_admin', { user_id: session.user.id });
          const { data: staffCheck, error: staffError } = await supabase.rpc('is_staff_or_admin', { user_id: session.user.id });
          
          if (adminError) console.error("Admin check error:", adminError);
          if (staffError) console.error("Staff check error:", staffError);
          
          console.log("Role check results:", { adminCheck, staffCheck });
          setIsAdmin(!!adminCheck);
          setIsStaff(!!staffCheck);
        } else {
          setIsAdmin(false);
          setIsStaff(false);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    console.log("Checking for existing session");
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting session:", error);
      }
      
      console.log("Existing session:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check user roles
        console.log("Checking roles for existing user:", session.user.id);
        
        // Fixed Promise handling for role checks
        Promise.all([
          supabase.rpc('is_admin', { user_id: session.user.id }),
          supabase.rpc('is_staff_or_admin', { user_id: session.user.id })
        ]).then(([adminResult, staffResult]) => {
          if (adminResult.error) console.error("Admin check error:", adminResult.error);
          if (staffResult.error) console.error("Staff check error:", staffResult.error);
          
          console.log("Is admin:", adminResult.data);
          console.log("Is staff:", staffResult.data);
          
          setIsAdmin(!!adminResult.data);
          setIsStaff(!!staffResult.data);
        }).catch(error => {
          console.error("Error checking roles:", error);
        }).finally(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in with email:", email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Sign in error:", error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Sign in successful");
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log("Signing up with email:", email);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        console.error("Sign up error:", error);
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Sign up successful");
      toast({
        title: "Account created",
        description: "Please check your email for verification link.",
      });
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Sign out successful");
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    isAdmin,
    isStaff,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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
