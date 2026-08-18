import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, ShieldAlert, ShieldCheck, Lock, Eye, EyeOff, Activity, 
  Server, FileKey, Fingerprint, AlertTriangle, CheckCircle, Clock, 
  Search, Filter, LockKeyhole, Cpu, TrendingUp, Bug, Bot, Zap,
  AlertOctagon, RefreshCw, Play, Sparkles, Database, FileCode,
  Radio, HardDrive, Terminal
} from 'lucide-react';
import { useSecurityStore, ThreatLog } from '../store/useSecurityStore';
import { useBiometricStore } from '../store/useBiometricStore';
import { AntivirusScannerModal } from '../components/AntivirusScannerModal';
import { SecurityDomeAuditModal } from '../components/SecurityDomeAuditModal';
import { useToast } from '../context/ToastContext';

type ModuleKey = 'anti_theft' | 'anti_bot' | 'antivirus' | 'anti_spyware' | 'quantum_encryption' | 'soc_waf';

interface SecurityModuleInfo {
  id: ModuleKey;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  badge: string;
  summary: string;
  functions: string[];
  techSpecs: { label: string; value: string }[];
}

const SECURITY_MODULES: Record<ModuleKey, SecurityModuleInfo> = {
  anti_theft: {
    id: 'anti_theft',
    title: 'Cúpula Anti-Robo & Killswitch',
    subtitle: 'Protección biométrica de hardware y bloqueo remoto instantáneo',
    icon: Fingerprint,
    color: 'rose',
    badge: 'Hardware & Identity',
    summary: 'Aísla el ecosistema en milisegundos ante robos de dispositivos, intentos de sesión sospechosos o suplantación de identidad.',
    functions: [
      'Bloqueo biométrico forzado WebAuthn / Passkeys con prueba de vida 3D',
      'Killswitch remoto: Revocación instantánea de sesiones y tokens OAuth',
      'Congelamiento preventivo de saldos Reycoin (RYC) y credenciales DID',
      'Geofencing de seguridad: Alerta por accesos fuera de la zona de confianza'
    ],
    techSpecs: [
      { label: 'Tiempo de Reacción Killswitch', value: '< 12 ms' },
      { label: 'Protección de Wallets', value: 'Zero-Knowledge Vault' },
      { label: 'Autenticación', value: 'FIDO2 / WebAuthn Level 3' }
    ]
  },
  anti_bot: {
    id: 'anti_bot',
    title: 'Escudo Anti-Bots & Turing Heuristics',
    subtitle: 'Filtrado inteligente de tráfico autómata y mitigación DDoS L7',
    icon: Bot,
    color: 'amber',
    badge: 'Neural Traffic Filter',
    summary: 'Identifica y neutraliza crawlers no autorizados, granjas de bots, emuladores headless y ataques coordinados de fuerza bruta.',
    functions: [
      'Detección de navegadores headless (Puppeteer, Selenium, Playwright)',
      'Análisis de micro-trayectorias de cursor y dinámica de tecleo humano',
      'Desafío criptográfico Proof-of-Work transparente (sin CAPTCHAs molestos)',
      'Mitigación dinámica de ataques DDoS en Capa de Aplicación (L7)'
    ],
    techSpecs: [
      { label: 'Capacidad de Mitigación', value: '1.2 Tbps / 500k req/s' },
      { label: 'Tasa de Falsos Positivos', value: '< 0.001%' },
      { label: 'Mecanismo Turing', value: 'Behavioral Micro-Telemetry' }
    ]
  },
  antivirus: {
    id: 'antivirus',
    title: 'Antivirus & Sandbox Neuronal',
    subtitle: 'Inspección heurística y aislamiento preventivo de amenazas',
    icon: Bug,
    color: 'emerald',
    badge: 'Zero-Day Shield',
    summary: 'Supervisa de forma continua subidas de archivos, blobs binarios, contratos inteligentes y payloads entrantes en tiempo real.',
    functions: [
      'Escaneo heurístico de firmas de malware, troyanos, ransomware y scripts espía',
      'Sandbox virtual aislado para inspeccionar adjuntos antes de su apertura',
      'Bloqueo de extensiones peligrosas (.exe, .scr, .vbs, .bat camuflados)',
      'Bóveda de cuarentena criptográfica con sanitización automática'
    ],
    techSpecs: [
      { label: 'Motor de Detección', value: 'Heurístico + Firmas AI' },
      { label: 'Velocidad de Escaneo', value: '50 MB/s en memoria' },
      { label: 'Aislamiento', value: 'WASM Sandbox Enclave' }
    ]
  },
  anti_spyware: {
    id: 'anti_spyware',
    title: 'Anti-Spyware & Anti-Keylogger',
    subtitle: 'Protección de memoria DOM, teclado y privacidad absoluta',
    icon: EyeOff,
    color: 'cyan',
    badge: 'Privacy Fortress',
    summary: 'Impide que extensiones maliciosas del navegador o malware residente espíen pulsaciones de teclas, portapapeles o datos en pantalla.',
    functions: [
      'Ofuscador virtual de pulsaciones de teclas contra Keyloggers residentes',
      'Sanitizador de portapapeles: Limpieza de claves privadas y semillas',
      'Detección de observadores DOM no autorizados y scripts de inyección',
      'Escudo anti-phishing con verificación de reputación de URLs externas'
    ],
    techSpecs: [
      { label: 'Protección de Teclado', value: 'Event Scrambling Dinámico' },
      { label: 'Integridad del DOM', value: 'Mutation Sentinel Activo' },
      { label: 'Filtrado de Rastreadores', value: '100% de Telemetría Externa Bloqueada' }
    ]
  },
  quantum_encryption: {
    id: 'quantum_encryption',
    title: 'Cifrado Extremo Post-Quantum',
    subtitle: 'Criptografía militar híbrida y gestión de claves HSM',
    icon: LockKeyhole,
    color: 'purple',
    badge: 'Post-Quantum Safe',
    summary: 'Protege las comunicaciones y la base de datos de identidades con algoritmos resistentes incluso a computación cuántica futura.',
    functions: [
      'Cifrado de extremo a extremo AES-256-GCM combinado con Kyber/Dilithium',
      'Pruebas de Conocimiento Cero (ZKP) para validación de identidad sin revelar datos',
      'Módulo de Seguridad de Hardware (HSM) descentralizado para firmas DID',
      'Rotación automatizada de llaves de sesión y secreto perfecto hacia adelante'
    ],
    techSpecs: [
      { label: 'Algoritmo Principal', value: 'AES-256-GCM + CRYSTALS-Kyber' },
      { label: 'Nivel de Cifrado', value: 'Militar / Banca Central' },
      { label: 'Forward Secrecy', value: 'Activado en todas las sesiones' }
    ]
  },
  soc_waf: {
    id: 'soc_waf',
    title: 'Centro SOC & WAF Inteligente',
    subtitle: 'Monitoreo 24/7 de eventos de red y protección OWASP Top 10',
    icon: Activity,
    color: 'blue',
    badge: 'SOC 24/7 Continuous',
    summary: 'Auditoría continua de seguridad en tiempo real con registro inmutable para cumplimiento normativo y resiliencia cibernética.',
    functions: [
      'Defensa activa contra inyecciones SQL, NoSQL, XSS y Prototype Pollution',
      'Auditoría y trazabilidad inmutable en Blockchain de acciones críticas',
      'Inspección estática de contratos inteligentes para prevenir Re-entrancy',
      'Cabeceras HTTP de grado bancario (HSTS, CSP estricto, X-Frame-Options)'
    ],
    techSpecs: [
      { label: 'Cumplimiento', value: 'OWASP Top 10 + ISO 27001' },
      { label: 'Trazabilidad', value: 'Blockchain Ledger Audit' },
      { label: 'Uptime del Escudo', value: '99.999% Garantizado' }
    ]
  }
};

export function CupulaDashboard() {
  const {
    cupulaActive,
    securityScore,
    activeShields,
    threatLogs,
    stats,
    toggleCupula,
    toggleShield,
    triggerAntiTheftLock,
    simulateAttack,
    dismissThreat
  } = useSecurityStore();
  const { requestVerification } = useBiometricStore();

  const [activeTab, setActiveTab] = useState<ModuleKey>('anti_theft');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAntivirusModalOpen, setIsAntivirusModalOpen] = useState(false);
  const [isSecurity18RulesOpen, setIsSecurity18RulesOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const toast = useToast();
  const currentModule = SECURITY_MODULES[activeTab];

  const handleSimulate = (type: 'xss' | 'bot_flood' | 'malware_payload' | 'bruteforce' | 'theft_tampering') => {
    setIsSimulating(true);
    simulateAttack(type);
    setTimeout(() => {
      setIsSimulating(false);
      toast.success('Ataque Simulado Neutralizado', 'La Cúpula de Seguridad detectó y bloqueó la amenaza al 100%.');
    }, 400);
  };

  const filteredThreats = threatLogs.filter(t => {
    if (filterSeverity !== 'all' && t.severity !== filterSeverity) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.details.toLowerCase().includes(q) || t.origin.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Header with Live Status & Quick Shield Controls */}
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 shrink-0 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start gap-4 z-10">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
            cupulaActive 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.25)]' 
              : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500'
          }`}>
            <Shield className={`w-8 h-8 ${cupulaActive ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 border ${
                cupulaActive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${cupulaActive ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
                {cupulaActive ? 'CÚPULA SIEMPRE ACTIVA (24/7)' : 'CÚPULA EN MODO REDUCIDO'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                Score: {securityScore}%
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight mt-1 text-slate-900 dark:text-white">
              Cúpula de Seguridad <span className="font-bold text-rose-600 dark:text-rose-500">Ultra-Robusta</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Sistema integral de protección autónoma: blindaje anti-robo, escudo anti-bots, antivirus heurístico, anti-spyware y cifrado cuántico.
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => setIsSecurity18RulesOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25 border border-emerald-400/50 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-black" />
            <span>18 Reglas de Seguridad (Activas)</span>
          </button>

          <button
            onClick={() => {
              requestVerification({
                title: 'Autenticación Cúpula Sentinel 3D',
                subtitle: 'Verificación de credenciales de Oficial de Seguridad mediante Escaneo de Retina / Huella WebGL',
                actionBadge: 'Acceso Nivel Alfa',
                type: 'retina',
                onSuccess: () => {
                  toast.success('Autorización Nivel Alfa Concedida', 'Identidad confirmada en el enclave seguro ZKP.');
                }
              });
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-700 dark:text-cyan-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-cyan-500/40 shadow-sm cursor-pointer"
          >
            <Fingerprint className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Escáner Biométrico WebGL</span>
          </button>

          <button
            onClick={() => setIsAntivirusModalOpen(true)}
            className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700 shadow-sm cursor-pointer"
          >
            <Bug className="w-4 h-4 text-emerald-400" />
            <span>Escáner Antivirus</span>
          </button>

          <button
            onClick={() => handleSimulate('xss')}
            disabled={isSimulating}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-cyan-600/20 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Simulador de Ataque</span>
          </button>

          <button
            onClick={() => {
              triggerAntiTheftLock('Activación manual preventiva de Modo Pánico / Anti-Robo.');
              toast.error('Modo Anti-Robo Activado', 'Ecosistema bloqueado preventivamente. Requiere biometría o PIN.');
            }}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-rose-600/30 cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Modo Anti-Robo / Pánico</span>
          </button>
        </div>
      </header>

      {/* Security Modules Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {Object.values(SECURITY_MODULES).map((mod) => {
          const Icon = mod.icon;
          const isSelected = activeTab === mod.id;
          return (
            <motion.button
              key={mod.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(mod.id)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer border ${
                isSelected
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 shadow-md'
                  : 'bg-white dark:bg-[#0b1120] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-500' : 'text-slate-400'}`} />
              <span>{mod.title}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Active Module Detail Banner */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-500">
                <currentModule.icon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
                    {currentModule.badge}
                  </span>
                  <span className="text-xs font-mono text-emerald-500 flex items-center gap-1 font-bold">
                    <CheckCircle className="w-3.5 h-3.5" /> Blindaje Activo 24/7
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {currentModule.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {currentModule.subtitle}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentModule.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentModule.functions.map((func, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-200"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{func}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between space-y-4 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                Especificaciones de Telemetría
              </h3>
              <div className="space-y-2.5">
                {currentModule.techSpecs.map((spec, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-200 dark:border-slate-800 last:border-0">
                    <span className="text-slate-500 dark:text-slate-400">{spec.label}</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Interruptor de Módulo</span>
                <button
                  onClick={() => {
                    const keyMap: Record<ModuleKey, keyof typeof activeShields> = {
                      anti_theft: 'antiTheft',
                      anti_bot: 'antiBot',
                      antivirus: 'antivirus',
                      anti_spyware: 'antiSpyware',
                      quantum_encryption: 'quantumEncryption',
                      soc_waf: 'wafDdos'
                    };
                    toggleShield(keyMap[activeTab]);
                    toast.success('Configuración Actualizada', `Se ha modificado el estado de ${currentModule.title}.`);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                >
                  Alternar Estado
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                La Cúpula mantiene este escudo sincronizado con el backend en cada solicitud.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cyber Attack Stress Test Simulator Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Laboratorio de Resiliencia & Prueba de Penetración (Live Sandbox)</h3>
              <p className="text-xs text-slate-400">Lanza ataques simulados para comprobar cómo la Cúpula neutraliza amenazas sin afectar el rendimiento</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/60">
            Tasa de Neutralización: 100%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { id: 'xss', label: 'Inyección XSS / SQLi', desc: 'WAF Filter Test', icon: FileCode },
            { id: 'bot_flood', label: 'Ataque Botnet (DDoS)', desc: '15k req/s Mitigation', icon: Bot },
            { id: 'malware_payload', label: 'Inyección de Troyano', desc: 'Heuristic Sandbox', icon: Bug },
            { id: 'bruteforce', label: 'Fuerza Bruta DID', desc: 'WebAuthn Challenge', icon: Lock },
            { id: 'theft_tampering', label: 'Spyware / Keylogger', desc: 'Keystroke Scramble', icon: EyeOff }
          ].map((test) => {
            const Icon = test.icon;
            return (
              <button
                key={test.id}
                onClick={() => handleSimulate(test.id as any)}
                className="p-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-2xl text-left transition-all hover:border-cyan-500/50 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-mono text-slate-400 group-hover:text-cyan-300">Simular</span>
                </div>
                <p className="text-xs font-bold text-slate-100">{test.label}</p>
                <p className="text-[10px] text-slate-400">{test.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Threat Logs & Telemetry Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Live WAF & Threat Registry Table */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Registro de Amenazas Neutralizadas en Vivo</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/10 text-rose-500 font-mono font-bold">
                {filteredThreats.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar IP o amenaza..."
                  className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">Severidad: Todas</option>
                <option value="critical">Críticas</option>
                <option value="high">Altas</option>
                <option value="medium">Medias</option>
              </select>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredThreats.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No hay amenazas que coincidan con los filtros. Perímetro 100% seguro.
              </div>
            ) : (
              filteredThreats.map((threat) => (
                <div
                  key={threat.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 hover:border-rose-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        threat.severity === 'critical' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30' :
                        threat.severity === 'high' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                        'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                      }`}>
                        {threat.severity}
                      </span>
                      <p className="font-bold text-slate-900 dark:text-white">{threat.title}</p>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{threat.details}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                      ✓ Acción: {threat.mitigation}
                    </p>
                  </div>

                  <div className="text-right shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Neutralizado
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{threat.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Global Security Metrics & Health Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
              Telemetría Global de la Cúpula
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Amenazas Bloqueadas (24h)</span>
                  <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{stats.threatsBlocked24h.toLocaleString()}</span>
                </div>
                <div className="w-full bg-emerald-200 dark:bg-emerald-900/40 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[99%]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Bots & Crawlers Filtrados</span>
                  <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">{stats.botsNeutralized.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">Intercepciones Anti-Robo</span>
                  <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">{stats.antiTheftInterceptions}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Último Diagnóstico Cúpula:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{stats.lastSystemScan}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Vulnerabilidades Parcheadas:</span>
                <span className="font-mono text-emerald-500 font-bold">{stats.vulnerabilitiesPatched} activas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AntivirusScannerModal
        isOpen={isAntivirusModalOpen}
        onClose={() => setIsAntivirusModalOpen(false)}
      />

      <SecurityDomeAuditModal
        isOpen={isSecurity18RulesOpen}
        onClose={() => setIsSecurity18RulesOpen(false)}
      />
    </div>
  );
}
