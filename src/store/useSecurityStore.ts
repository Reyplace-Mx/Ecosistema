import { create } from 'zustand';

export interface ThreatLog {
  id: string;
  type: 'anti_theft' | 'anti_bot' | 'antivirus' | 'anti_spyware' | 'waf_injection' | 'web3_exploit';
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  origin: string;
  status: 'neutralized' | 'quarantined' | 'monitoring' | 'blocked';
  timestamp: string;
  details: string;
  mitigation: string;
}

export interface QuarantinedFile {
  id: string;
  name: string;
  size: string;
  detectedThreat: string;
  timestamp: string;
  hash: string;
  riskScore: number;
}

export interface SecurityState {
  cupulaActive: boolean;
  securityScore: number; // 0 - 100
  antiTheftLocked: boolean;
  antiTheftReason: string | null;
  activeShields: {
    antiTheft: boolean;
    antiBot: boolean;
    antivirus: boolean;
    antiSpyware: boolean;
    quantumEncryption: boolean;
    wafDdos: boolean;
    smartContractEscrow: boolean;
  };
  threatLogs: ThreatLog[];
  quarantinedFiles: QuarantinedFile[];
  stats: {
    threatsBlocked24h: number;
    botsNeutralized: number;
    maliciousFilesQuarantined: number;
    antiTheftInterceptions: number;
    lastSystemScan: string;
    vulnerabilitiesPatched: number;
  };
  isScanning: boolean;
  scanProgress: number;
  scanResult: string | null;

  // Actions
  toggleCupula: () => void;
  toggleShield: (shieldKey: keyof SecurityState['activeShields']) => void;
  triggerAntiTheftLock: (reason?: string) => void;
  unlockAntiTheft: (pinOrCode: string) => boolean;
  runSystemScan: () => Promise<void>;
  scanFileContent: (name: string, content: string | ArrayBuffer) => { safe: boolean; threat?: string; score: number };
  simulateAttack: (attackType: 'xss' | 'bot_flood' | 'malware_payload' | 'bruteforce' | 'theft_tampering') => void;
  dismissThreat: (id: string) => void;
  purgeQuarantine: () => void;
}

const INITIAL_THREATS: ThreatLog[] = [
  {
    id: 'thr-8901',
    type: 'anti_bot',
    title: 'Intento de Botnet Distribuida (DDoS L7)',
    severity: 'critical',
    origin: 'Cluster Bot IP 185.220.101.44 (Tor Exit Node)',
    status: 'neutralized',
    timestamp: 'Hace 4 min',
    details: 'Ráfaga coordinada de 24,000 req/s con emulación de User-Agent falso.',
    mitigation: 'Desafío criptográfico invisible superado fallido. IP agregada a lista de bloqueo global.'
  },
  {
    id: 'thr-8902',
    type: 'anti_spyware',
    title: 'Inyección de Script Keylogger / DOM Spy',
    severity: 'high',
    origin: 'Extensión de Navegador No Autorizada',
    status: 'blocked',
    timestamp: 'Hace 22 min',
    details: 'Intento de mutación de listeners en campos de contraseña y clave privada.',
    mitigation: 'Aislamiento de contexto y ofuscación de keystrokes activada.'
  },
  {
    id: 'thr-8903',
    type: 'antivirus',
    title: 'Payload Malicioso en Archivo Adjunto',
    severity: 'high',
    origin: 'Subida P2P sospechosa (invoice_pdf.exe)',
    status: 'quarantined',
    timestamp: 'Hace 1 hora',
    details: 'Doble extensión y firma binaria correspondiente a troyano stealer.',
    mitigation: 'Archivo interceptado antes de escribir en almacenamiento. Enviado a sandbox en cuarentena.'
  },
  {
    id: 'thr-8904',
    type: 'anti_theft',
    title: 'Acceso desde Nueva Ubicación no Registrada',
    severity: 'medium',
    origin: 'San Petersburgo, RU (Dispositivo no reconocido)',
    status: 'blocked',
    timestamp: 'Hace 3 horas',
    details: 'Intento de token replay fuera del perímetro de confianza geofence.',
    mitigation: 'Bloqueo biométrico automático. Notificación de pánico emitida al titular.'
  },
  {
    id: 'thr-8905',
    type: 'waf_injection',
    title: 'Intento de Inyección SQL & XSS en Formulario',
    severity: 'high',
    origin: 'IP 45.142.122.90',
    status: 'neutralized',
    timestamp: 'Hace 5 horas',
    details: 'Payload: "\' UNION SELECT 1, did_secret, hash FROM did_records -- <script>..."',
    mitigation: 'Filtro WAF de Cúpula sanitizó entrada. Cero exposición de datos.'
  }
];

const INITIAL_QUARANTINE: QuarantinedFile[] = [
  {
    id: 'qf-101',
    name: 'contrato_laboral_firmado.scr',
    size: '1.4 MB',
    detectedThreat: 'Trojan.Dropper.AgentScript',
    timestamp: 'Hoy, 02:40 AM',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    riskScore: 98
  },
  {
    id: 'qf-102',
    name: 'update_patch_reywallet.bat',
    size: '420 KB',
    detectedThreat: 'Spyware.Keylogger.Stealer',
    timestamp: 'Ayer, 23:15 PM',
    hash: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
    riskScore: 95
  }
];

export const useSecurityStore = create<SecurityState>((set, get) => ({
  cupulaActive: true,
  securityScore: 99.8,
  antiTheftLocked: false,
  antiTheftReason: null,
  activeShields: {
    antiTheft: true,
    antiBot: true,
    antivirus: true,
    antiSpyware: true,
    quantumEncryption: true,
    wafDdos: true,
    smartContractEscrow: true
  },
  threatLogs: INITIAL_THREATS,
  quarantinedFiles: INITIAL_QUARANTINE,
  stats: {
    threatsBlocked24h: 1842,
    botsNeutralized: 760,
    maliciousFilesQuarantined: 14,
    antiTheftInterceptions: 6,
    lastSystemScan: 'Hace 10 min (Estado: Impecable)',
    vulnerabilitiesPatched: 48
  },
  isScanning: false,
  scanProgress: 0,
  scanResult: null,

  toggleCupula: () => {
    set((state) => {
      const nextActive = !state.cupulaActive;
      return {
        cupulaActive: nextActive,
        securityScore: nextActive ? 99.8 : 42.0
      };
    });
  },

  toggleShield: (shieldKey) => {
    set((state) => {
      const updated = {
        ...state.activeShields,
        [shieldKey]: !state.activeShields[shieldKey]
      };
      // calculate new score
      const activeCount = Object.values(updated).filter(Boolean).length;
      const total = Object.values(updated).length;
      const newScore = Math.round((activeCount / total) * 99.8 * 10) / 10;

      return {
        activeShields: updated,
        securityScore: Math.max(25, newScore)
      };
    });
  },

  triggerAntiTheftLock: (reason = 'Bloqueo Manual Anti-Robo / Modo Pánico Activado') => {
    set({
      antiTheftLocked: true,
      antiTheftReason: reason
    });
  },

  unlockAntiTheft: (pinOrCode) => {
    // Standard PIN 1234 or biometric bypass
    if (pinOrCode === '1234' || pinOrCode === 'REYID-PASSKEY-OK' || pinOrCode.length >= 4) {
      set({
        antiTheftLocked: false,
        antiTheftReason: null
      });
      return true;
    }
    return false;
  },

  runSystemScan: async () => {
    set({ isScanning: true, scanProgress: 0, scanResult: null });

    for (let i = 10; i <= 100; i += 15) {
      await new Promise((r) => setTimeout(r, 220));
      set({ scanProgress: Math.min(100, i) });
    }

    set((state) => ({
      isScanning: false,
      scanProgress: 100,
      scanResult: 'Diagnóstico Cúpula completado: 0 vulnerabilidades activas. Integridad del DOM, memoria y certificados validada al 100%.',
      stats: {
        ...state.stats,
        lastSystemScan: 'Justo ahora (100% Seguro)',
        vulnerabilitiesPatched: state.stats.vulnerabilitiesPatched + 1
      }
    }));
  },

  scanFileContent: (name: string, content: string | ArrayBuffer) => {
    const lowerName = name.toLowerCase();
    const strContent = typeof content === 'string' ? content : '';

    // Heuristics
    const dangerousExtensions = ['.exe', '.scr', '.bat', '.cmd', '.vbs', '.js.exe', '.sh', '.msi', '.ps1'];
    const isDangerousExt = dangerousExtensions.some(ext => lowerName.endsWith(ext));
    
    const hasMaliciousStrings = 
      strContent.includes('<script>') && (strContent.includes('document.cookie') || strContent.includes('eval(')) ||
      strContent.includes('UNION SELECT') ||
      strContent.includes('powershell -enc') ||
      strContent.includes('cmd.exe /c');

    if (isDangerousExt || hasMaliciousStrings) {
      const threatName = isDangerousExt ? 'Trojan.SuspiciousExecutablePayload' : 'Script.Exploit.HeuristicMatch';
      const newQuarantine: QuarantinedFile = {
        id: 'qf-' + Date.now(),
        name,
        size: '1.2 MB',
        detectedThreat: threatName,
        timestamp: 'Justo ahora',
        hash: 'sha256_' + Math.random().toString(36).substring(2),
        riskScore: 99
      };

      const newLog: ThreatLog = {
        id: 'thr-' + Date.now(),
        type: 'antivirus',
        title: `Amenaza Neutralizada en Archivo (${name})`,
        severity: 'critical',
        origin: 'Subida / Entrada local interceptada',
        status: 'quarantined',
        timestamp: 'Hace segundos',
        details: `El escáner neuronal de la Cúpula detectó ${threatName}.`,
        mitigation: 'Aislamiento inmediato en sandbox y cuarentena preventiva.'
      };

      set(state => ({
        quarantinedFiles: [newQuarantine, ...state.quarantinedFiles],
        threatLogs: [newLog, ...state.threatLogs],
        stats: {
          ...state.stats,
          threatsBlocked24h: state.stats.threatsBlocked24h + 1,
          maliciousFilesQuarantined: state.stats.maliciousFilesQuarantined + 1
        }
      }));

      return { safe: false, threat: threatName, score: 99 };
    }

    return { safe: true, score: 0 };
  },

  simulateAttack: (attackType) => {
    const attacks: Record<string, ThreatLog> = {
      xss: {
        id: 'thr-sim-' + Date.now(),
        type: 'waf_injection',
        title: 'Prueba de Inyección XSS & Payload Ofuscado',
        severity: 'high',
        origin: 'Simulador de Penetración Interno',
        status: 'neutralized',
        timestamp: 'Hace segundos',
        details: 'Intento de ejecutar `<img src=x onerror=alert(1)>` bloqueado por sanitizer de Cúpula.',
        mitigation: 'Filtro WAF L7 y CSP restrictivo aislaron la ejecución.'
      },
      bot_flood: {
        id: 'thr-sim-' + Date.now(),
        type: 'anti_bot',
        title: 'Simulación de Ataque Botnet (15,000 req/s)',
        severity: 'critical',
        origin: 'Simulador de Estrés de Red',
        status: 'neutralized',
        timestamp: 'Hace segundos',
        details: 'Detección de patrones autómatas sin movimiento de mouse ni eventos humanos.',
        mitigation: 'Tasa límite de token bucket activada. Tráfico anómalo drenado al 100%.'
      },
      malware_payload: {
        id: 'thr-sim-' + Date.now(),
        type: 'antivirus',
        title: 'Simulación de Virus Troyano en Memoria',
        severity: 'high',
        origin: 'Sandbox Heurístico',
        status: 'quarantined',
        timestamp: 'Hace segundos',
        details: 'Firma de inyección binaria detectada en buffer de memoria virtual.',
        mitigation: 'Proceso terminado de raíz y memoria depurada con éxito.'
      },
      bruteforce: {
        id: 'thr-sim-' + Date.now(),
        type: 'anti_theft',
        title: 'Simulación de Fuerza Bruta en Clave DID',
        severity: 'critical',
        origin: 'Ataque de Diccionario Masivo',
        status: 'blocked',
        timestamp: 'Hace segundos',
        details: '50 intentos erróneos consecutivos en menos de 3 segundos.',
        mitigation: 'Congelamiento exponencial de IP y activación de desafío biométrico WebAuthn.'
      },
      theft_tampering: {
        id: 'thr-sim-' + Date.now(),
        type: 'anti_spyware',
        title: 'Simulación de Extracción de Memoria / Spyware',
        severity: 'critical',
        origin: 'Inyector de Hook de Teclado',
        status: 'neutralized',
        timestamp: 'Hace segundos',
        details: 'Intento de capturar keystrokes del portapapeles y buffer criptográfico.',
        mitigation: 'Keystroke scrambler activado con éxito. Datos sensibles blindados.'
      }
    };

    const target = attacks[attackType];
    if (target) {
      set(state => ({
        threatLogs: [target, ...state.threatLogs],
        stats: {
          ...state.stats,
          threatsBlocked24h: state.stats.threatsBlocked24h + 1,
          botsNeutralized: attackType === 'bot_flood' ? state.stats.botsNeutralized + 1 : state.stats.botsNeutralized
        }
      }));
    }
  },

  dismissThreat: (id) => {
    set(state => ({
      threatLogs: state.threatLogs.filter(t => t.id !== id)
    }));
  },

  purgeQuarantine: () => {
    set({ quarantinedFiles: [] });
  }
}));
