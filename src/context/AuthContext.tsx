import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { syncUserDataToFirestore, subscribeToReyIDFirestore } from '../lib/firestoreSync';
import { recordReyIDAuthEvent } from '../lib/reyidAuthEvents';
import {
  registerWebAuthnCredential,
  authenticateWithWebAuthn,
  getStoredBiometricCredentials,
  detectBiometricHardware
} from '../lib/webauthn';

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
  authProvider?: 'email' | 'google' | 'web3' | 'webauthn';
  livenessVerified?: boolean;
  verificationLevel?: number;
  biometricCredentialId?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoggedIn: boolean;
  login: (email: string, password?: string, name?: string) => Promise<void>;
  signup: (email: string, password?: string, name?: string, handle?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithWeb3Wallet: () => Promise<void>;
  loginWithBiometrics: (credentialId?: string) => Promise<UserSession>;
  registerWithBiometrics: (
    fullName?: string,
    handle?: string,
    algorithm?: 'ES256' | 'Ed25519' | 'RS256'
  ) => Promise<{ credential: any; user: UserSession }>;
  logout: () => void;
  updateUserBalance: (amount: number) => void;
  setLivenessVerified: (verified: boolean) => void;
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
  livenessVerified: true,
  verificationLevel: 3,
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

  // Supabase Auth Listener and Session Sync
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const mergedUser: UserSession = {
          ...DEFAULT_USER,
          uid: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || 'Ciudadano ReyID',
          handle: session.user.user_metadata?.handle || `@${(session.user.email || 'user').split('@')[0]}`,
          authProvider: (session.user.app_metadata?.provider as any) || 'email',
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
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Ciudadano ReyID',
          handle: session.user.user_metadata?.handle || `@${(session.user.email || 'user').split('@')[0]}`,
          authProvider: (session.user.app_metadata?.provider as any) || 'email',
        };
        setUser(mergedUser);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Firestore Realtime Listener for multi-device sync
  useEffect(() => {
    if (!user?.uid) return;

    // Sync current session state to Firestore
    syncUserDataToFirestore({
      userId: user.uid,
      fullName: user.name,
      email: user.email,
      handle: user.handle,
      verificationLevel: user.verificationLevel || 3,
      biometricVerified: !!user.livenessVerified,
      livenessCompleted: !!user.livenessVerified,
      updatedAt: new Date().toISOString(),
      devicesCount: 3,
      walletAddress: user.walletAddress,
      reputationScore: 98,
    });

    // Realtime listener
    const unsubscribeDoc = subscribeToReyIDFirestore(user.uid, (firestoreData) => {
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          verificationLevel: firestoreData.verificationLevel,
          livenessVerified: firestoreData.biometricVerified,
        };
      });
    });

    return () => {
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, [user?.uid]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('reyplace_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('reyplace_user_session');
    }
  }, [user]);

  const login = async (email: string, password?: string, name?: string) => {
    if (password && import.meta.env.VITE_SUPABASE_URL) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.warn('Supabase Login warn:', error.message);
      } else if (data.session?.user) {
        const supUser: UserSession = {
          ...DEFAULT_USER,
          uid: data.session.user.id,
          email: data.session.user.email || email,
          name: name || data.session.user.user_metadata?.full_name || email.split('@')[0],
          authProvider: 'email',
        };
        setUser(supUser);
        recordReyIDAuthEvent({
          method: 'WebAuthn / Passkey',
          status: 'SUCCESS',
          statusLabel: 'Autenticación Exitosa (Supabase)',
          device: 'Navegador Web / Dispositivo Seguro',
          did: supUser.did || 'did:rey:0x7aF982...b3A1',
          user: supUser.name,
          ipAddress: '187.190.45.12',
          location: 'Los Mochis, Sinaloa',
          cryptographicHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
          algorithm: 'ES256 (FIDO2 L3)',
        });
        return;
      }
    }

    // Fallback demo login
    await new Promise((res) => setTimeout(res, 600));
    const cleanName = name || email.split('@')[0].toUpperCase();
    const loggedUser: UserSession = {
      ...DEFAULT_USER,
      email,
      name: cleanName,
      handle: `@${email.split('@')[0].toLowerCase()}`,
      authProvider: 'email',
    };
    setUser(loggedUser);
    recordReyIDAuthEvent({
      method: email.includes('biometric') || email.includes('passkey') ? 'WebAuthn / Passkey' : 'Touch ID / Huella',
      status: 'SUCCESS',
      statusLabel: 'Autenticación Exitosa',
      device: 'MacBook Pro M3 (Touch ID)',
      did: loggedUser.did || 'did:rey:0x7aF982...b3A1',
      user: loggedUser.name,
      ipAddress: '187.190.45.12',
      location: 'Los Mochis, Sinaloa',
      cryptographicHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      algorithm: 'ES256 (Secure Enclave)',
    });
  };

  const signup = async (email: string, password?: string, name?: string, handle?: string) => {
    const displayName = name || email.split('@')[0];
    if (password && import.meta.env.VITE_SUPABASE_URL) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: displayName, handle }
        }
      });
      if (error) {
        console.warn('Supabase Signup warn:', error.message);
      } else if (data.user) {
        const supUser: UserSession = {
          ...DEFAULT_USER,
          uid: data.user.id,
          email,
          name: displayName,
          handle: handle ? (handle.startsWith('@') ? handle : `@${handle}`) : `@${displayName.toLowerCase().replace(/\s+/g, '')}`,
          authProvider: 'email',
        };
        setUser(supUser);
        return;
      }
    }

    await new Promise((res) => setTimeout(res, 700));
    const randomHex = Math.random().toString(16).substring(2, 10);
    const newUser: UserSession = {
      ...DEFAULT_USER,
      uid: `usr_${Math.random().toString(36).substring(2, 8)}`,
      email,
      name: displayName,
      handle: handle ? (handle.startsWith('@') ? handle : `@${handle}`) : `@${displayName.toLowerCase().replace(/\s+/g, '')}`,
      did: `did:rey:0x${randomHex}...AE9`,
      walletAddress: `0x${randomHex}...4F1`,
      reycoinBalance: 250.0, // welcome bonus RYC
      authProvider: 'email',
    };
    setUser(newUser);
  };

  const loginWithGoogle = async () => {
    if (import.meta.env.VITE_SUPABASE_URL) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
    } else {
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

  const loginWithBiometrics = async (credentialId?: string): Promise<UserSession> => {
    const assertion = await authenticateWithWebAuthn(credentialId);
    if (!assertion.success) {
      throw new Error('Fallo en la verificación biométrica del hardware.');
    }

    const storedPasskeys = getStoredBiometricCredentials();
    const matchedPasskey = credentialId
      ? storedPasskeys.find((c) => c.id === credentialId)
      : storedPasskeys[0];

    const bioUser: UserSession = {
      ...DEFAULT_USER,
      uid: `usr_bio_${assertion.credentialId.substring(0, 8)}`,
      name: matchedPasskey?.userDisplayName || assertion.userName || 'Alex Vanguard (Pro Business)',
      email: matchedPasskey?.userHandle || 'contacto.reyplace@gmail.com',
      handle: matchedPasskey?.userHandle?.startsWith('@')
        ? matchedPasskey.userHandle
        : `@${(matchedPasskey?.userDisplayName || 'alexvanguard').toLowerCase().replace(/\s+/g, '')}`,
      did: assertion.didProof || 'did:rey:0x7aF982ef91b2c41893c8340d91a92182b3A1',
      walletAddress: '0x71C...89e2',
      reycoinBalance: 14200.0,
      role: 'Pro Business / Smart City Operator',
      kycStatus: 'verified',
      securityLevel: 'maximum',
      authProvider: 'webauthn',
      livenessVerified: true,
      verificationLevel: 3,
      biometricCredentialId: assertion.credentialId,
    };

    setUser(bioUser);

    // Record immutable audit event
    recordReyIDAuthEvent({
      method: 'WebAuthn / Passkey',
      status: 'PASSKEY_VALIDATED',
      statusLabel: 'Autenticación Biométrica Hardware (FIDO2 L3)',
      device: assertion.authenticatorName || detectBiometricHardware(),
      did: bioUser.did,
      user: bioUser.name,
      ipAddress: '187.190.45.12',
      location: 'Los Mochis, Sinaloa',
      cryptographicHash: assertion.signature || `0x${Math.random().toString(16).substring(2, 10)}`,
      algorithm: assertion.algorithm || 'ES256 (NIST P-256)',
    });

    return bioUser;
  };

  const registerWithBiometrics = async (
    fullName = 'Ciudadano ReyID',
    handle = '@ciudadano',
    algorithm: 'ES256' | 'Ed25519' | 'RS256' = 'ES256'
  ): Promise<{ credential: any; user: UserSession }> => {
    const cred = await registerWebAuthnCredential(handle, fullName, algorithm);

    const randomDid = `did:rey:0x${Array.from(new Uint8Array(16), () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const newBioUser: UserSession = {
      ...DEFAULT_USER,
      uid: `usr_bio_${cred.id.substring(0, 8)}`,
      name: fullName,
      email: `${handle.replace('@', '')}@reyplace.live`,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      did: randomDid,
      walletAddress: `0x${randomDid.substring(10, 16)}...${randomDid.substring(randomDid.length - 4)}`,
      reycoinBalance: 500.0,
      role: 'Verified Citizen (Hardware Enclave)',
      kycStatus: 'verified',
      securityLevel: 'maximum',
      authProvider: 'webauthn',
      livenessVerified: true,
      verificationLevel: 3,
      biometricCredentialId: cred.id,
    };

    setUser(newBioUser);

    recordReyIDAuthEvent({
      method: 'WebAuthn / Passkey',
      status: 'SUCCESS',
      statusLabel: 'Enclave Seguro Inicializado (Registro WebAuthn)',
      device: cred.authenticatorName,
      did: newBioUser.did,
      user: newBioUser.name,
      ipAddress: '187.190.45.12',
      location: 'Los Mochis, Sinaloa',
      cryptographicHash: `0x${Math.random().toString(16).substring(2, 12)}`,
      algorithm: cred.algorithm,
    });

    return { credential: cred, user: newBioUser };
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase logout warn:', e);
    }
    setUser(null);
    localStorage.removeItem('reyplace_user_session');
  };

  const updateUserBalance = (amount: number) => {
    setUser((prev) => (prev ? { ...prev, reycoinBalance: prev.reycoinBalance + amount } : null));
  };

  const setLivenessVerified = (verified: boolean) => {
    setUser((prev) => prev ? {
      ...prev,
      livenessVerified: verified,
      verificationLevel: verified ? 3 : 2
    } : null);
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
        loginWithBiometrics,
        registerWithBiometrics,
        logout,
        updateUserBalance,
        setLivenessVerified,
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


