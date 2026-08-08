import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, ShieldAlert, ShieldCheck, Lock, Eye, EyeOff, Activity, 
  Server, FileKey, Fingerprint, AlertTriangle, CheckCircle, Clock, 
  Search, Filter, LockKeyhole, Cpu, TrendingUp
} from 'lucide-react';
import type { CupulaThreat } from '../types';

const MOCK_THREATS: CupulaThreat[] = [
  { id: 'thr_1', type: 'Intento de Acceso No Autorizado', severity: 'medium', origin: 'IP Anónima (Proxy)', status: 'blocked', timestamp: 'Hace 15 min' },
  { id: 'thr_2', type: 'Ataque DDoS Mitigado', severity: 'high', origin: 'Botnet Distribuida', status: 'investigating', timestamp: 'Hace 2 horas' },
  { id: 'thr_3', type: 'Escaneo de Puertos', severity: 'low', origin: 'Rango IP Sospechoso', status: 'monitoring', timestamp: 'Hace 5 horas' }
];

const MODULE_EXPLANATIONS = {
  firewall: {
    title: 'Firewall Inteligente',
    desc: 'Barrera perimetral dinámica de próxima generación.',
    icon: ShieldAlert,
    functions: ['Bloqueo de DDoS en tiempo real', 'Filtrado de IPs maliciosas', 'Reglas heurísticas adaptativas']
  },
  encryption: {
    title: 'Cifrado Extremo',
    desc: 'Criptografía AES-256 de extremo a extremo.',
    icon: Lock,
    functions: ['Gestión de claves HSM', 'Pruebas de Zero-Knowledge', 'Privacidad por diseño']
  },
  fraud: {
    title: 'Anti-Fraude',
    desc: 'Motor de biometría conductual y transaccional.',
    icon: Activity,
    functions: ['Análisis de velocidad de compra', 'Bloqueo de cuentas bot', 'Prevención de fraudes P2P']
  },
  audit: {
    title: 'Auditoría',
    desc: 'Registro inmutable de acciones críticas.',
    icon: Search,
    functions: ['Logs a prueba de alteraciones', 'Reportes normativos', 'Trazabilidad de administradores']
  },
  monitoring: {
    title: 'Monitoreo SOC',
    desc: 'Centro de operaciones y observabilidad 24/7.',
    icon: Server,
    functions: ['Alertas proactivas automáticas', 'Inspección de latencia', 'Visibilidad global']
  },
  risk: {
    title: 'Análisis de Riesgo',
    desc: 'Evaluación predictiva de vulnerabilidades.',
    icon: AlertTriangle,
    functions: ['Scoring dinámico de amenazas', 'Modelado predictivo', 'Auditoría de dependencias']
  },
  web3: {
    title: 'Protección Web3',
    desc: 'Escudo para contratos inteligentes y wallets.',
    icon: ShieldCheck,
    functions: ['Análisis estático de código', 'Prevención de Re-entrancy', 'Validación de oráculos']
  }
};

export function CupulaDashboard() {
  const [activeTab, setActiveTab] = useState<keyof typeof MODULE_EXPLANATIONS>('firewall');
  const activeModule = MODULE_EXPLANATIONS[activeTab];

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto animate-fade-in">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-rose-600 dark:text-rose-500" />
            Capa de Seguridad <span className="text-slate-400 dark:text-gray-600 font-medium">/</span> Cúpula Digital
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-2 max-w-3xl">Protección perimetral, cifrado extremo y monitoreo constante para salvaguardar el ecosistema Reyplace contra amenazas cibernéticas modernas.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-xl p-1.5 shadow-sm">
          {Object.entries(MODULE_EXPLANATIONS).map(([key, mod]) => (
            <motion.button 
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(key as keyof typeof MODULE_EXPLANATIONS)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === key 
                  ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-500 border border-rose-200 dark:border-rose-500/20 shadow-sm' 
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <mod.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{mod.title}</span>
            </motion.button>
          ))}
        </div>
      </header>

      {/* Explicación de Módulo Activo */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-2xl p-6 md:p-8 shadow-xl"
      >
        <div className="flex items-start justify-between flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-100 dark:border-rose-500/20">
                <activeModule.icon className="w-8 h-8 text-rose-600 dark:text-rose-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activeModule.title}</h2>
                <p className="text-sm font-mono text-rose-600 dark:text-rose-400">{activeModule.desc}</p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activeModule.functions.map((func, idx) => {
                const funcIcons = [ShieldCheck, CheckCircle, LockKeyhole, Eye, FileKey, Activity];
                const Icon = funcIcons[idx % funcIcons.length];
                return (
                  <div key={idx} className="bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/5 p-4 rounded-xl flex items-start gap-3">
                    <Icon className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-gray-300 font-medium">{func}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full md:w-72 space-y-4 shrink-0">
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 dark:text-gray-500">Mecanismos Críticos</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-rose-600 dark:text-rose-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">Defensa Activa</span>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-rose-600 dark:text-rose-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">Análisis Hardware</span>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-rose-600 dark:text-rose-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">Firma Criptográfica</span>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vista Global (WAF & Log) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-500" /> Registro de Amenazas (WAF)
              </h3>
              <div className="flex gap-2">
                <button className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-white/10 px-2 py-1 rounded">
                  Filtros
                </button>
                <button className="text-[10px] uppercase font-bold tracking-widest text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 transition-colors border border-rose-200 dark:border-rose-500/20 px-2 py-1 rounded bg-rose-50 dark:bg-rose-500/10">
                  Exportar
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {MOCK_THREATS.map(threat => (
                <div 
                  key={threat.id}
                  className="bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/5 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-rose-200 dark:hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      threat.severity === 'high' || threat.severity === 'critical' ? 'bg-rose-100 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-500' :
                      threat.severity === 'medium' ? 'bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-500' :
                      'bg-slate-200 dark:bg-gray-500/10 border-slate-300 dark:border-gray-500/20 text-slate-500 dark:text-gray-400'
                    }`}>
                      {threat.status === 'blocked' ? <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-green-500" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">{threat.type}</p>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-slate-500 font-mono">{threat.origin}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left md:text-right">
                    <span className={`inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded border ${
                      threat.status === 'blocked' ? 'bg-emerald-50 dark:bg-green-500/10 text-emerald-600 dark:text-green-500 border-emerald-200 dark:border-green-500/20' :
                      threat.status === 'investigating' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-500/20' :
                      'bg-cyan-50 dark:bg-blue-500/10 text-cyan-600 dark:text-blue-400 border-cyan-200 dark:border-blue-500/20'
                    }`}>
                      {threat.status === 'blocked' ? 'Bloqueado' : threat.status === 'investigating' ? 'Investigando' : 'Monitoreando'}
                    </span>
                    <p className="text-[9px] text-slate-400 dark:text-gray-500 mt-1">{threat.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-[#111112] dark:to-[#1f0b0b] border border-slate-200 dark:border-rose-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden h-full">
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 dark:text-gray-500 mb-6">Estado Global de Seguridad</h3>
            
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-[10px] text-slate-500 dark:text-gray-500 mb-1 uppercase font-bold tracking-widest">Nivel de Protección</p>
                <p className="text-3xl font-light text-emerald-600 dark:text-green-500 mb-1">Máximo</p>
                <p className="text-xs text-slate-600 dark:text-gray-400">Reglas estrictas activadas</p>
              </div>
              
              <div>
                <p className="text-[10px] text-slate-500 dark:text-gray-500 mb-1 uppercase font-bold tracking-widest">Tráfico Malicioso Bloqueado</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  12,450 reqs <TrendingUp className="w-3 h-3 text-rose-500" />
                </p>
              </div>
              
              <button className="w-full py-2 bg-rose-600 hover:bg-rose-700 dark:hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer mt-4">
                Activar Modo Pánico
              </button>
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-rose-100 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

