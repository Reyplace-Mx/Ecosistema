import { ReyIDAuthEvent } from '../types';

const STORAGE_KEY = 'reyplace_recent_reyid_auth_events';

export const INITIAL_SUCCESSFUL_REYID_AUTH_EVENTS: ReyIDAuthEvent[] = [
  {
    id: 'AUTH-9401',
    timestamp: '2026-08-17T21:38:15.000Z',
    formattedTime: '21:38:15',
    formattedDate: '17 ago 2026',
    method: 'WebAuthn / Passkey',
    status: 'SUCCESS',
    statusLabel: 'Autenticación Biométrica Exitosa',
    device: 'iPhone 15 Pro (Face ID)',
    did: 'did:rey:0x7aF982...b3A1',
    user: 'Global Tech Solutions',
    ipAddress: '187.190.45.12',
    location: 'Los Mochis, Sinaloa',
    cryptographicHash: '0x8f72a91...44c1',
    aaguid: '00000000-0000-0000-0000-000000000000',
    algorithm: 'ES256 (FIDO2 L3)',
  },
  {
    id: 'AUTH-9400',
    timestamp: '2026-08-17T20:14:02.000Z',
    formattedTime: '20:14:02',
    formattedDate: '17 ago 2026',
    method: 'Touch ID / Huella',
    status: 'PASSKEY_VALIDATED',
    statusLabel: 'Passkey FIDO2 Validada',
    device: 'MacBook Pro M3 Max',
    did: 'did:rey:0x7aF982...b3A1',
    user: 'Global Tech Solutions',
    ipAddress: '187.190.45.12',
    location: 'Los Mochis, Sinaloa',
    cryptographicHash: '0x4b12c8e...779b',
    aaguid: '00000000-0000-0000-0000-000000000000',
    algorithm: 'ES256 (Secure Enclave)',
  },
  {
    id: 'AUTH-9399',
    timestamp: '2026-08-17T18:42:50.000Z',
    formattedTime: '18:42:50',
    formattedDate: '17 ago 2026',
    method: 'YubiKey Hardware FIDO2',
    status: 'VERIFIED',
    statusLabel: 'Firma Hardware Validada',
    device: 'YubiKey 5 NFC (USB-C)',
    did: 'did:rey:0x7aF982...b3A1',
    user: 'Admin Cúpula / Global Tech',
    ipAddress: '187.190.22.84',
    location: 'Los Mochis, Sinaloa',
    cryptographicHash: '0x9e31ff0...112d',
    aaguid: 'cbfe69d0-cbd9-409b-96e3-d0f510329e50',
    algorithm: 'Ed25519 (FIDO2 Hardware)',
  },
  {
    id: 'AUTH-9398',
    timestamp: '2026-08-17T15:10:33.000Z',
    formattedTime: '15:10:33',
    formattedDate: '17 ago 2026',
    method: 'OAuth Google Seguro',
    status: 'SUCCESS',
    statusLabel: 'Token OIDC Verificado',
    device: 'Google Pixel 8 Pro',
    did: 'did:rey:0x7aF982...b3A1',
    user: 'contacto.reyplace@gmail.com',
    ipAddress: '187.190.11.5',
    location: 'Los Mochis, Sinaloa',
    cryptographicHash: '0x33ca81b...90df',
    algorithm: 'RS256 (JWT PKCE)',
  },
  {
    id: 'AUTH-9397',
    timestamp: '2026-08-17T11:25:19.000Z',
    formattedTime: '11:25:19',
    formattedDate: '17 ago 2026',
    method: 'Biométrico Facial (Face ID)',
    status: 'VERIFIED',
    statusLabel: 'Liveness + Cripto Verificada',
    device: 'iPad Pro M2 (Face ID)',
    did: 'did:rey:0x7aF982...b3A1',
    user: 'Global Tech Solutions',
    ipAddress: '187.190.50.19',
    location: 'Culiacán, Sinaloa',
    cryptographicHash: '0x77d018a...62bc',
    algorithm: 'ES256 (Neural Engine)',
  },
];

export function getRecentReyIDAuthEvents(): ReyIDAuthEvent[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: ReyIDAuthEvent[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 5);
      }
    }
  } catch (e) {
    console.warn('Error reading ReyID auth events from localStorage', e);
  }
  return INITIAL_SUCCESSFUL_REYID_AUTH_EVENTS;
}

export function recordReyIDAuthEvent(event: Omit<ReyIDAuthEvent, 'id' | 'timestamp' | 'formattedTime' | 'formattedDate'>): ReyIDAuthEvent {
  const current = getRecentReyIDAuthEvents();
  const now = new Date();
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const newEvent: ReyIDAuthEvent = {
    id: `AUTH-${Math.floor(9402 + Math.random() * 1000)}`,
    timestamp: now.toISOString(),
    formattedTime,
    formattedDate,
    ...event,
  };

  const updated = [newEvent, ...current.filter(item => item.id !== newEvent.id)].slice(0, 5);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event so any listening component updates instantaneously
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('reyid:auth_event_recorded', { detail: newEvent }));
    }
  } catch (e) {
    console.warn('Error saving ReyID auth event to localStorage', e);
  }

  return newEvent;
}
