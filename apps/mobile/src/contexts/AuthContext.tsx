import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  display_name: string;
  avatar_url: string;
  leetcode_username: string | null;
  freeze_tokens: number;
  theme_slug: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  partnerProfile: Profile | null;
  loading: boolean;
  mockLogin: (userType: 'A' | 'B') => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndPartner = async (userId: string) => {
    try {
      // 1. Fetch own profile
      const { data: ownProfile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileErr) throw profileErr;
      
      // If trigger failed, we create a dummy profile so the app doesn't crash
      if (!ownProfile) {
        const { data: newProfile } = await supabase.from('profiles').insert({
          id: userId,
          display_name: 'Test User',
          theme_slug: 'default'
        }).select().single();
        setProfile(newProfile);
      } else {
        setProfile(ownProfile);
      }

      // 2. Fetch partner link (either user_one or user_two)
      const { data: link, error: linkErr } = await supabase
        .from('partner_links')
        .select('*')
        .or(`user_one_id.eq.${userId},user_two_id.eq.${userId}`)
        .eq('status', 'active')
        .maybeSingle();

      if (link && !linkErr) {
        const partnerId = link.user_one_id === userId ? link.user_two_id : link.user_one_id;
        
        // 3. Fetch partner profile
        const { data: partnerData, error: partnerErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', partnerId)
          .single();

        if (!partnerErr) {
          setPartnerProfile(partnerData);
        } else {
          setPartnerProfile(null);
        }
      } else {
        setPartnerProfile(null);
      }
    } catch (e) {
      console.error('Error fetching profile/partner data:', e);
    }
  };

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      setUser(activeSession?.user ?? null);
      if (activeSession?.user) {
        fetchProfileAndPartner(activeSession.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setLoading(true);
        await fetchProfileAndPartner(newSession.user.id);
        setLoading(false);
      } else {
        setProfile(null);
        setPartnerProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfileAndPartner(user.id);
    }
  };

  const mockLogin = async (userType: 'A' | 'B') => {
    setLoading(true);
    const email = `dev_${userType.toLowerCase()}@bloom.com`;
    const password = 'Password123!';

    try {
      // Attempt Sign In
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        // If user doesn't exist, attempt sign up
        if (error.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                display_name: `Test User ${userType}`,
              },
            },
          });

          if (signUpErr) {
            // Check if email confirmation is enabled on Supabase
            if (signUpErr.message.includes('Email confirmation is required') || signUpErr.message.includes('confirm your email')) {
              throw new Error(
                'Supabase requires email confirmation. Please disable "Confirm email" under Auth -> Providers -> Email in your Supabase Dashboard to use the developer login toggle.'
              );
            }
            throw signUpErr;
          }

          // If signup requires confirmation but auto-signs in, handle it
          if (signUpData.session) {
            setSession(signUpData.session);
            setUser(signUpData.user);
          } else {
            // Re-attempt sign in after signup (if auto-confirm is on)
            const { error: retryError } = await supabase.auth.signInWithPassword({ email, password });
            if (retryError) throw retryError;
          }
        } else {
          throw error;
        }
      } else {
        setSession(data.session);
        setUser(data.user);
      }
    } catch (e: any) {
      console.error('Mock login failed:', e);
      alert(e.message || 'Mock login failed. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        partnerProfile,
        loading,
        mockLogin,
        signOut,
        refreshProfile,
      }}
    >
      {children}
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
