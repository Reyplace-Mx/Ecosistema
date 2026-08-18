import { create } from 'zustand';

export type BiometricScanType = 'retina' | 'fingerprint';
export type BiometricStatus = 'idle' | 'scanning' | 'verifying' | 'success' | 'failed';
export type SecurityLevel = 'standard' | 'maximum' | 'post_quantum';

export interface BiometricSessionCache {
  cachedAuthExpiresAt: number | null;
  cachedSecurityLevel: SecurityLevel | null;
  cachedMethod: BiometricScanType | null;
  cachedAt: number | null;
  sessionCacheDuration: number; // in minutes (e.g., 5, 15, 30, 60)
  rememberSession: boolean;
}

export interface BiometricRequestOptions {
  title?: string;
  subtitle?: string;
  actionBadge?: string;
  type?: BiometricScanType;
  securityLevel?: SecurityLevel;
  forceReauth?: boolean; // if true, ignores temporary cache and prompts user
  bypassIfCached?: boolean; // defaults to true
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface BiometricState {
  isOpen: boolean;
  type: BiometricScanType;
  title: string;
  subtitle: string;
  actionBadge: string;
  securityLevel: SecurityLevel;
  status: BiometricStatus;
  progress: number;
  confidenceScore: number;
  zkpHash: string;
  errorMessage: string | null;
  onSuccessCallback: (() => void) | null;
  onCancelCallback: (() => void) | null;

  // Session Cache Flag & Duration Settings
  rememberSession: boolean;
  sessionCacheDuration: number; // in minutes (default: 15 min)
  cachedAuthExpiresAt: number | null;
  cachedSecurityLevel: SecurityLevel | null;
  cachedMethod: BiometricScanType | null;
  cachedAt: number | null;

  // Actions
  requestVerification: (options?: BiometricRequestOptions) => void;
  setType: (type: BiometricScanType) => void;
  setRememberSession: (remember: boolean) => void;
  setSessionCacheDuration: (minutes: number) => void;
  isSessionAuthenticated: (requiredLevel?: SecurityLevel) => boolean;
  getRemainingSessionSeconds: () => number;
  clearSessionCache: () => void;
  extendSessionCache: (additionalMinutes?: number) => void;
  startScan: () => void;
  completeVerification: () => void;
  failVerification: (error?: string) => void;
  cancelVerification: () => void;
  reset: () => void;
}

const STORAGE_KEY = 'reyplace_biometric_session_cache_v1';

const getInitialCache = (): Partial<BiometricSessionCache> => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.cachedAuthExpiresAt && parsed.cachedAuthExpiresAt > Date.now()) {
        return {
          cachedAuthExpiresAt: parsed.cachedAuthExpiresAt,
          cachedSecurityLevel: parsed.cachedSecurityLevel || 'maximum',
          cachedMethod: parsed.cachedMethod || 'retina',
          cachedAt: parsed.cachedAt || Date.now(),
          sessionCacheDuration: parsed.sessionCacheDuration || 15,
          rememberSession: parsed.rememberSession !== undefined ? parsed.rememberSession : true,
        };
      }
    }
  } catch (e) {
    console.warn('Could not read biometric session cache:', e);
  }
  return {
    cachedAuthExpiresAt: null,
    cachedSecurityLevel: null,
    cachedMethod: null,
    cachedAt: null,
    sessionCacheDuration: 15,
    rememberSession: true,
  };
};

const saveCacheToStorage = (cache: BiometricSessionCache | null) => {
  try {
    if (!cache || !cache.cachedAuthExpiresAt || cache.cachedAuthExpiresAt <= Date.now()) {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } else {
      const payload = JSON.stringify(cache);
      sessionStorage.setItem(STORAGE_KEY, payload);
      localStorage.setItem(STORAGE_KEY, payload);
    }
  } catch (e) {
    console.warn('Could not save biometric session cache:', e);
  }
};

const generateProofHash = () => {
  const chars = '0123456789ABCDEF';
  let hex = '0xBIO-ZKP-';
  for (let i = 0; i < 16; i++) {
    hex += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hex;
};

const initialCache = getInitialCache();

export const useBiometricStore = create<BiometricState>((set, get) => ({
  isOpen: false,
  type: initialCache.cachedMethod || 'retina',
  title: 'Verificación Biométrica de Seguridad',
  subtitle: 'Autorización requerida para ejecutar esta operación crítica en el ecosistema',
  actionBadge: 'Acción Crítica Protegida',
  securityLevel: 'maximum',
  status: 'idle',
  progress: 0,
  confidenceScore: 0,
  zkpHash: '',
  errorMessage: null,
  onSuccessCallback: null,
  onCancelCallback: null,

  // Cache State
  rememberSession: initialCache.rememberSession !== undefined ? initialCache.rememberSession : true,
  sessionCacheDuration: initialCache.sessionCacheDuration || 15,
  cachedAuthExpiresAt: initialCache.cachedAuthExpiresAt || null,
  cachedSecurityLevel: initialCache.cachedSecurityLevel || null,
  cachedMethod: initialCache.cachedMethod || null,
  cachedAt: initialCache.cachedAt || null,

  isSessionAuthenticated: (requiredLevel = 'standard') => {
    const { cachedAuthExpiresAt, cachedSecurityLevel } = get();
    if (!cachedAuthExpiresAt) return false;
    if (Date.now() > cachedAuthExpiresAt) {
      // Expired
      get().clearSessionCache();
      return false;
    }

    // Security level hierarchy comparison
    const levels: Record<SecurityLevel, number> = {
      standard: 1,
      maximum: 2,
      post_quantum: 3,
    };

    const cachedRank = levels[cachedSecurityLevel || 'standard'] || 1;
    const requiredRank = levels[requiredLevel] || 1;

    return cachedRank >= requiredRank;
  },

  getRemainingSessionSeconds: () => {
    const { cachedAuthExpiresAt } = get();
    if (!cachedAuthExpiresAt) return 0;
    const remaining = Math.max(0, Math.floor((cachedAuthExpiresAt - Date.now()) / 1000));
    return remaining;
  },

  setRememberSession: (remember) => {
    set({ rememberSession: remember });
    const { cachedAuthExpiresAt, cachedSecurityLevel, cachedMethod, cachedAt, sessionCacheDuration } = get();
    if (cachedAuthExpiresAt && cachedAuthExpiresAt > Date.now()) {
      saveCacheToStorage({
        cachedAuthExpiresAt,
        cachedSecurityLevel,
        cachedMethod,
        cachedAt,
        sessionCacheDuration,
        rememberSession: remember,
      });
    }
  },

  setSessionCacheDuration: (minutes) => {
    const validMinutes = Math.max(1, Math.min(240, minutes));
    set({ sessionCacheDuration: validMinutes });
  },

  clearSessionCache: () => {
    set({
      cachedAuthExpiresAt: null,
      cachedSecurityLevel: null,
      cachedMethod: null,
      cachedAt: null,
    });
    saveCacheToStorage(null);
  },

  extendSessionCache: (additionalMinutes) => {
    const { sessionCacheDuration, cachedSecurityLevel, cachedMethod, rememberSession } = get();
    const duration = additionalMinutes || sessionCacheDuration || 15;
    const newExpiresAt = Date.now() + duration * 60 * 1000;
    const now = Date.now();

    set({
      cachedAuthExpiresAt: newExpiresAt,
      cachedSecurityLevel: cachedSecurityLevel || 'maximum',
      cachedMethod: cachedMethod || 'retina',
      cachedAt: now,
    });

    saveCacheToStorage({
      cachedAuthExpiresAt: newExpiresAt,
      cachedSecurityLevel: cachedSecurityLevel || 'maximum',
      cachedMethod: cachedMethod || 'retina',
      cachedAt: now,
      sessionCacheDuration: duration,
      rememberSession,
    });
  },

  requestVerification: (options = {}) => {
    const reqLevel = options.securityLevel || 'maximum';
    const bypassIfCached = options.bypassIfCached !== false;

    // Check if session cache is active and valid
    if (!options.forceReauth && bypassIfCached && get().isSessionAuthenticated(reqLevel)) {
      // User is already authenticated within the session duration!
      if (options.onSuccess) {
        // Run immediately without blocking or prompting
        setTimeout(() => {
          try {
            options.onSuccess?.();
          } catch (e) {
            console.error('Error executing biometric cached success callback:', e);
          }
        }, 50);
      }
      return;
    }

    // Prompt user with modal overlay
    set({
      isOpen: true,
      type: options.type || get().cachedMethod || 'retina',
      title: options.title || 'Verificación Biométrica de Seguridad',
      subtitle: options.subtitle || 'Autorización requerida para ejecutar esta operación crítica en el ecosistema',
      actionBadge: options.actionBadge || 'Acción Crítica Protegida',
      securityLevel: reqLevel,
      status: 'idle',
      progress: 0,
      confidenceScore: 0,
      zkpHash: generateProofHash(),
      errorMessage: null,
      onSuccessCallback: options.onSuccess || null,
      onCancelCallback: options.onCancel || null,
    });
  },

  setType: (type) => {
    if (get().status === 'scanning' || get().status === 'verifying') return;
    set({ type, status: 'idle', progress: 0, confidenceScore: 0 });
  },

  startScan: () => {
    set({ status: 'scanning', progress: 5, confidenceScore: 12, errorMessage: null });
  },

  completeVerification: () => {
    const now = Date.now();
    const { rememberSession, sessionCacheDuration, securityLevel, type } = get();
    const newExpiresAt = rememberSession ? now + sessionCacheDuration * 60 * 1000 : null;

    if (rememberSession && newExpiresAt) {
      saveCacheToStorage({
        cachedAuthExpiresAt: newExpiresAt,
        cachedSecurityLevel: securityLevel,
        cachedMethod: type,
        cachedAt: now,
        sessionCacheDuration,
        rememberSession,
      });
    }

    set({ 
      status: 'success', 
      progress: 100, 
      confidenceScore: 99.98,
      zkpHash: generateProofHash(),
      cachedAuthExpiresAt: newExpiresAt,
      cachedSecurityLevel: rememberSession ? securityLevel : null,
      cachedMethod: rememberSession ? type : null,
      cachedAt: rememberSession ? now : null,
    });

    const callback = get().onSuccessCallback;
    if (callback) {
      setTimeout(() => {
        try {
          callback();
        } catch (e) {
          console.error("Error executing biometric success callback:", e);
        }
      }, 1000);
    }
  },

  failVerification: (error = 'La verificación biométrica no pudo ser completada.') => {
    set({ status: 'failed', errorMessage: error });
  },

  cancelVerification: () => {
    const cancelCb = get().onCancelCallback;
    set({ isOpen: false, status: 'idle', progress: 0 });
    if (cancelCb) {
      try {
        cancelCb();
      } catch (e) {
        console.error("Error in cancel callback:", e);
      }
    }
  },

  reset: () => {
    set({
      isOpen: false,
      status: 'idle',
      progress: 0,
      confidenceScore: 0,
      errorMessage: null,
      onSuccessCallback: null,
      onCancelCallback: null,
    });
  }
}));

