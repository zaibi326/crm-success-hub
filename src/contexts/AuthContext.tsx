import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, role: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('AuthProvider initializing...');
    
    const initializeAuth = async () => {
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, !!session);
          
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('Auth state change - user found, fetching profile...');
            // Use setTimeout to avoid blocking the auth state change
            setTimeout(() => {
              fetchProfile(session.user.id, session.user.email || '');
            }, 0);
          } else {
            console.log('Auth state change - no user, clearing profile');
            setProfile(null);
            setIsLoading(false);
          }
        });

        // Then get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting initial session:", error);
          setIsLoading(false);
          return;
        }

        console.log('Initial session:', !!initialSession);
        
        if (initialSession?.user) {
          console.log('Initial session - user found, fetching profile...');
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchProfile(initialSession.user.id, initialSession.user.email || '');
        } else {
          console.log('Initial session - no user found');
          setIsLoading(false);
        }

        // Cleanup subscription on unmount
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error in auth initialization:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchProfile = async (userId: string, userEmail: string) => {
    try {
      console.log('Fetching profile for userId:', userId, 'email:', userEmail);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        
        // If profile doesn't exist, create a default one
        if (profileError.code === 'PGRST116') {
          console.log('Profile not found, creating default profile...');
          try {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                email: userEmail,
                first_name: '',
                last_name: '',
                role: 'Employee'
              })
              .select()
              .single();

            if (createError) {
              console.error("Error creating profile:", createError);
              toast({
                title: "Profile Creation Error",
                description: "Failed to create user profile. Please try again.",
                variant: "destructive",
              });
              setIsLoading(false);
              return;
            }

            setProfile(newProfile as Profile);
            console.log('Default profile created successfully:', newProfile);
            setIsLoading(false);
            return;
          } catch (createError) {
            console.error("Error in profile creation:", createError);
            setIsLoading(false);
            return;
          }
        }
        
        // For other errors, show toast and stop loading
        toast({
          title: "Profile Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setProfile(profileData as Profile);
      console.log('Profile fetched successfully:', profileData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      toast({
        title: "Profile Error",
        description: "Failed to load user profile. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        return { success: false, error: error.message };
      }
      
      console.log('Login successful');
      // Don't set isLoading to false here - let the auth state change handle it
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  const signup = async (email: string, password: string, role: string, firstName?: string, lastName?: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting signup for:', email);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role,
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      // Check if the user was created successfully but requires email confirmation
      if (data?.user && !data?.user.confirmed_at) {
        setIsLoading(false);
        return { success: true, error: "Please check your email to confirm your account." };
      }

      console.log('Signup successful');
      // Don't set isLoading to false here - let the auth state change handle it
      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: error.message || "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setIsLoading(true);
      if (!user?.id) throw new Error('User not authenticated');

      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating profile:", updateError);
        return { success: false, error: updateError.message };
      }

      setProfile(updatedProfile as Profile);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      return { success: true };
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast({
        title: "Update Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
