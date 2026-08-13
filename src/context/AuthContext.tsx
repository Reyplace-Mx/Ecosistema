import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface UserSession {
  uid: string;
  name: string;
  email: string;
  handle: string;
  did: string;
  walletAddress: string;
  reycoinBalance: number;
  role: string;
  kycStatus: 'verified' | 'pending' | 'unverified';
  securityLevel: 'standard' | 'high' | 'maximum';
  joinedAt: string;
  authProvider?: 'email' | 'google' | 'web3';
}

interface AuthContextType {
  user: UserSession | null;
  isLoggedIn: boolean;
  login: (email: string, name?: string) => Promise<void>;
  signup: (email: string, name: string, handle?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithWeb3Wallet: () => Promise<void>;
  logout: () => void;
  updateUserBalance: (amount: number) => void;
}

const DEFAULT_USER: UserSession = {
  uid: 'usr_rey_9981a',
  name: 'Global Tech Solutions',
  email: 'contacto.reyplace@gmail.com',
  handle: '@globaltech',
  did: 'did:rey:0x7aF982...b3A1',
  walletAddress: '0x7aF982...3b9',
  reycoinBalance: 12450.00,
  role: 'Pro Business',
  kycStatus: 'verified',
  securityLevel: 'maximum',
  joinedAt: '2024-11-12',
  authProvider: 'google',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('reyplace_user_session');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  useEffect(() => {
    // Check Supabase active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // If we wanted to merge Supabase user with local demo state:
        const mergedUser: UserSession = {
          ...DEFAULT_USER,
          uid: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || 'Supabase User',
          authProvider: session.user.app_metadata?.provider as any || 'email',
        };
        setUser(mergedUser);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const mergedUser: UserSession = {
          ...DEFAULT_USER,
          uid: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || 'Supabase User',
          authProvider: session.user.app_metadata?.provider as any || 'email',
        };
        setUser(mergedUser);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('reyplace_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('reyplace_user_session');
    }
  }, [user]);

  const login = async (email: string, name?: string) => {
    // In a real app we'd do: await supabase.auth.signInWithPassword({ email, password })
    // For demo keeping the delay pattern to avoid requiring password form yet
    await new Promise((res) => setTimeout(res, 600));
    const cleanName = name || email.split('@')[0].toUpperCase();
    setUser({
      ...DEFAULT_USER,
      email,
      name: cleanName,
      handle: `@${email.split('@')[0].toLowerCase()}`,
      authProvider: 'email',
    });
  };

  const signup = async (email: string, name: string, handle?: string) => {
    await new Promise((res) => setTimeout(res, 700));
    const randomHex = Math.random().toString(16).substring(2, 10);
    const newUser: UserSession = {
      ...DEFAULT_USER,
      uid: `usr_${Math.random().toString(36).substring(2, 8)}`,
      email,
      name,
      handle: handle ? (handle.startsWith('@') ? handle : `@${handle}`) : `@${name.toLowerCase().replace(/\s+/g, '')}`,
      did: `did:rey:0x${randomHex}...AE9`,
      walletAddress: `0x${randomHex}...4F1`,
      reycoinBalance: 250.0, // welcome bonus RYC
      authProvider: 'email',
    };
    setUser(newUser);
  };

  const loginWithGoogle = async () => {
    // Trigger real Supabase OAuth
    if (import.meta.env.VITE_SUPABASE_URL) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
    } else {
      // Fallback
      await new Promise((res) => setTimeout(res, 800));
      const googleUser: UserSession = {
        ...DEFAULT_USER,
        uid: `usr_goog_${Math.random().toString(36).substring(2, 8)}`,
        name: 'Usuario Google Supabase',
        email: 'user.google@reyplace.live',
        handle: '@google_rey',
        did: 'did:rey:0xGoogle99...F4A',
        walletAddress: '0xGoogle99...3C8',
        reycoinBalance: 500.0,
        role: 'Verified Citizen',
        authProvider: 'google',
      };
      setUser(googleUser);
    }
  };

  const loginWithWeb3Wallet = async () => {
    await new Promise((res) => setTimeout(res, 1000));
    const randomWallet = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 6)}`;
    const web3User: UserSession = {
      ...DEFAULT_USER,
      uid: `usr_web3_${Math.random().toString(36).substring(2, 8)}`,
      name: `Web3 Holder (${randomWallet.substring(0, 6)}...)`,
      email: `${randomWallet.substring(2, 8)}@web3.reyplace`,
      handle: `@web3_${randomWallet.substring(2, 8)}`,
      did: `did:rey:${randomWallet}`,
      walletAddress: `${randomWallet}...EE2`,
      reycoinBalance: 2500.0,
      role: 'Web3 Node & Holder',
      authProvider: 'web3',
    };
    setUser(web3User);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('reyplace_user_session');
  };

  const updateUserBalance = (amount: number) => {
    setUser((prev) => (prev ? { ...prev, reycoinBalance: prev.reycoinBalance + amount } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        signup,
        loginWithGoogle,
        loginWithWeb3Wallet,
        logout,
        updateUserBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

