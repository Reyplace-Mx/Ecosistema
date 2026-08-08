import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
}

interface AuthContextType {
  user: UserSession | null;
  isLoggedIn: boolean;
  login: (email: string, name?: string) => Promise<void>;
  signup: (email: string, name: string, handle?: string) => Promise<void>;
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
    if (user) {
      localStorage.setItem('reyplace_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('reyplace_user_session');
    }
  }, [user]);

  const login = async (email: string, name?: string) => {
    // Simulate network latency / auth call
    await new Promise((res) => setTimeout(res, 600));
    setUser({
      ...DEFAULT_USER,
      email,
      name: name || email.split('@')[0].toUpperCase(),
    });
  };

  const signup = async (email: string, name: string, handle?: string) => {
    await new Promise((res) => setTimeout(res, 700));
    const newUser: UserSession = {
      ...DEFAULT_USER,
      uid: `usr_${Math.random().toString(36).substring(2, 8)}`,
      email,
      name,
      handle: handle ? (handle.startsWith('@') ? handle : `@${handle}`) : `@${name.toLowerCase().replace(/\s+/g, '')}`,
      reycoinBalance: 100.0, // bonus welcome RYC
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
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
