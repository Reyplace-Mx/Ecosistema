import { db } from './firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import type { UserProfile } from '../types';

export interface ReyIDSyncPayload {
  userId: string;
  fullName: string;
  email: string;
  handle: string;
  verificationLevel: number;
  biometricVerified: boolean;
  livenessCompleted: boolean;
  updatedAt: string;
  devicesCount: number;
  walletAddress?: string;
  reputationScore?: number;
}

/**
 * Saves or updates user profile and ReyID data in Firestore for multi-device synchronization
 */
export async function syncUserDataToFirestore(payload: ReyIDSyncPayload): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', payload.userId);
    await setDoc(userRef, {
      ...payload,
      lastSyncedAt: new Date().toISOString(),
    }, { merge: true });

    // Also persist in local storage as reliable local cache
    localStorage.setItem(`reyplace_firestore_cache_${payload.userId}`, JSON.stringify(payload));
    console.log(`[Firestore Sync] Perfil ReyID ${payload.userId} sincronizado en la nube.`);
    return true;
  } catch (error) {
    console.warn('[Firestore Sync Fallback] Error guardando en Firestore, respaldando en cache local:', error);
    localStorage.setItem(`reyplace_firestore_cache_${payload.userId}`, JSON.stringify(payload));
    return false;
  }
}

/**
 * Fetches user profile data from Firestore
 */
export async function fetchUserDataFromFirestore(userId: string): Promise<ReyIDSyncPayload | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as ReyIDSyncPayload;
    }
  } catch (error) {
    console.warn('[Firestore Fetch Fallback] Leyendo desde cache local:', error);
  }

  // Fallback to local cache
  const cache = localStorage.getItem(`reyplace_firestore_cache_${userId}`);
  if (cache) {
    try {
      return JSON.parse(cache);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Real-time listener for Firestore changes under the same ReyID across devices
 */
export function subscribeToReyIDFirestore(userId: string, onUpdate: (data: ReyIDSyncPayload) => void) {
  try {
    const userRef = doc(db, 'users', userId);
    return onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as ReyIDSyncPayload;
        onUpdate(data);
      }
    }, (err) => {
      console.warn('[Firestore Realtime Listener Warn]:', err);
    });
  } catch (err) {
    console.warn('[Firestore Realtime Listener Setup Fail]:', err);
    return () => {};
  }
}
