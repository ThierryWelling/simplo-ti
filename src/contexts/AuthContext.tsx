"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut as authSignOut, getCurrentUser } from '@/lib/auth';
import type { UserProfile } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isEmailConfirmed: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  signIn: async () => {},
  signOut: async () => {},
  loading: true,
  isEmailConfirmed: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        checkSession();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsEmailConfirmed(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setIsEmailConfirmed(session.user.email_confirmed_at != null);
        const profile = await getCurrentUser();
        if (profile) {
          setUser(profile);
        }
      } else {
        setIsEmailConfirmed(true);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      setLoading(false);
      setIsEmailConfirmed(true);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const profile = await signIn(email, password);
      setUser(profile);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsEmailConfirmed(session.user.email_confirmed_at != null);
      }
      
      // Redirecionar baseado no papel do usuário
      switch (profile.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'colaborador':
          router.push('/chamados');
          break;
        case 'auxiliar':
          router.push('/chamados/gerenciar');
          break;
        default:
          router.push('/chamados');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await authSignOut();
      setUser(null);
      setIsEmailConfirmed(true);
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      signIn: handleSignIn, 
      signOut: handleSignOut, 
      loading,
      isEmailConfirmed
    }}>
      {children}
    </AuthContext.Provider>
  );
} 