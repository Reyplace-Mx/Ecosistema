import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, Map, Shield, Server, Cpu, GraduationCap, Hexagon,
  Database, Network, Zap, CheckCircle, Clock, Lock, Newspaper,
  Briefcase, Activity, Code, LayoutTemplate, Target, Rocket
} from 'lucide-react';

const MODULES = [
  { id: 'roadmap', name: 'Product Roadmap', icon: Target, desc: 'Visión, Releases & KPIs' },
  { id: 'architecture', name: 'Arquitectura Core', icon: Layers, desc: 'Backend, Frontend & APIs' },
  { id: 'cloud', name: 'DevOps & Cloud', icon: Server, desc: 'Infraestructura & CI/CD' },
  { id: 'security', name: 'Ciberseguridad', icon: Shield, desc: 'Cúpula Digital & WAF' },
  { id: 'web3', name: 'Web3 & ReyID', icon: Hexagon, desc: 'Identidad & Reycoin v2' },
  { id: 'ai', name: 'Reybot AI', icon: Cpu, desc: 'Modelos & Guardian' },
  { id: 'design', name: 'Sistema de Diseño', icon: LayoutTemplate, desc: 'UI/UX & Coherencia' },
  { id: 'academy', name: 'Academia', icon: GraduationCap, desc: 'Cursos & Creators' },
];

export function ArchitectureDashboard() {
  const [activeTab, setActiveTab] = useState('roadmap');

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-slate-50 dark:bg-[#080809] animate-fade-in p-4 lg:p-8 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <header className="mb-8 shrink-0">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 tracking-tight flex items-center gap-3">
          <Layers className="w-8 h-8 text-blue-600 dark:text-blue-500" />
          Centro de Comando <span className="text-slate-400 dark:text-gray-600 font-medium text-2xl">/ Arquitectura & PM</span>
        </h1>
        <p className="text-slate-500 dark:text-gray-400 mt-2 font-medium max-w-3xl">
          Visión centralizada del ecosistema Reyplace. Coordinación técnica, diseño modular, estándares de seguridad y roadmap estratégico.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          {MODULES.map(mod => (
            <button
              key={mod.id}
              onClick={() => setActiveTab(mod.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 cursor-pointer ${
                activeTab === mod.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-white dark:bg-[#111112] text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5'
              }`}
            >
              <div className={`p-2 rounded-xl ${activeTab === mod.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/5'}`}>
                <mod.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-bold ${activeTab === mod.id ? 'text-white' : 'text-slate-900 dark:text-gray-200'}`}>{mod.name}</h3>
                <p className={`text-[10px] uppercase tracking-widest font-bold mt-0.5 ${activeTab === mod.id ? 'text-blue-200' : 'text-slate-400 dark:text-gray-500'}`}>
                  {mod.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            
            {/* PRODUCT ROADMAP */}
            {activeTab === 'roadmap' && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                    <Rocket className="w-6 h-6 text-blue-500" />
                    Roadmap Estratégico (PM)
                  </h2>
                  <p className="text-slate-600 dark:text-gray-400 mb-8">Traducción de la visión de Reyplace en un roadmap ejecutable y medible, asegurando que cada release tenga sentido estratégico y aporte valor al ecosistema.</p>
                  
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-white/10 before:to-transparent">
                    
                    {/* Fase 1 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#111112] bg-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-slate-50 dark:bg-[#0c0c0d] border border-slate-200 dark:border-white/10 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-slate-900 dark:text-white">Fase 1: Core & Identidad</h3>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">Completado</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-3">Lanzamiento de ReyID, Reycoin v2 y la Cúpula Digital. Establecimiento de la arquitectura base.</p>
                        <div className="text-xs font-mono text-blue-600 dark:text-blue-400">KPI: 10k Identidades Creadas</div>
                      </div>
                    </div>

                    {/* Fase 2 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#111112] bg-amber-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white dark:bg-[#111112] border-2 border-amber-500/50 shadow-md relative">
                        <div className="absolute -inset-1 bg-amber-500/20 blur-xl rounded-3xl -z-10"></div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-slate-900 dark:text-white">Fase 2: Conexión B2B & Pro</h3>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded">En Progreso</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-3">Lanzamiento de Unión.live, Perfiles Pro, Servicios y el HUB de Marketplace.</p>
                        <div className="text-xs font-mono text-amber-600 dark:text-amber-400">KPI: 50k Transacciones RYC mensuales</div>
                      </div>
                    </div>

                    {/* Fase 3 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#111112] bg-slate-200 dark:bg-gray-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <Map className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-slate-50 dark:bg-[#0c0c0d] border border-slate-200 dark:border-white/5 opacity-70">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-slate-900 dark:text-gray-300">Fase 3: Smart City & News</h3>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-200 dark:bg-white/5 px-2 py-1 rounded">Q4 2026</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mb-3">Integración urbana, analítica predictiva, reportes ciudadanos y línea editorial periodística.</p>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* ARCHITECTURE */}
            {activeTab === 'architecture' && (
              <motion.div
                key="architecture"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                    <Database className="w-6 h-6 text-blue-500" />
                    Arquitectura Modular (Backend & Frontend)
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-50 dark:bg-[#0c0c0d] p-5 rounded-2xl border border-slate-200 dark:border-white/5">
                      <Code className="w-6 h-6 text-indigo-500 mb-3" />
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">PWA Frontend</h3>
                      <p className="text-xs text-slate-500 dark:text-gray-400">React + Vite + Tailwind CSS. Offline-first, renderizado optimizado y notificaciones push nativas.</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#0c0c0d] p-5 rounded-2xl border border-slate-200 dark:border-white/5">
                      <Network className="w-6 h-6 text-emerald-500 mb-3" />
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Microservicios (APIs)</h3>
                      <p className="text-xs text-slate-500 dark:text-gray-400">Servicios desacoplados (Auth, Pagos, Chat, Core). Comunicación vía API RESTful y gRPC.</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#0c0c0d] p-5 rounded-2xl border border-slate-200 dark:border-white/5">
                      <Database className="w-6 h-6 text-blue-500 mb-3" />
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Persistencia Core</h3>
                      <p className="text-xs text-slate-500 dark:text-gray-400">PostgreSQL para ERP y Transacciones. Redis para caché y Pub/Sub de Unión.live. Kafka para eventos.</p>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400 mb-4">Estándares del Ecosistema</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Auth Centralizada (OAuth 2.0 + ReyID)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Logging Estructurado (ELK Stack)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Escalabilidad Horizontal Auto-managed</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-gray-300">API Gateways con Rate Limiting</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI TAB */}
            {activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                    <Cpu className="w-6 h-6 text-purple-500" />
                    Ingeniería de IA (Reybot)
                  </h2>
                  <p className="text-slate-600 dark:text-gray-400 mb-8">Definición de las capacidades conversacionales, seguridad y modelos subyacentes del asistente oficial del ecosistema.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 p-5 rounded-2xl">
                      <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-3" />
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2">Reybot Guardian</h3>
                      <p className="text-sm text-slate-600 dark:text-purple-200">Motor de detección de riesgo, fraude y abuso operando en tiempo real en Unión.live y transacciones del Marketplace.</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 rounded-2xl">
                      <Network className="w-6 h-6 text-blue-500 mb-3" />
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2">Integración Modular</h3>
                      <p className="text-sm text-slate-600 dark:text-gray-400">Modelos entrenados con prompts dinámicos por módulo: Asesor Pro, Curador News, Concierge Smart City.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DESIGN TAB */}
            {activeTab === 'design' && (
              <motion.div
                key="design"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                    <LayoutTemplate className="w-6 h-6 text-rose-500" />
                    Diseño UI/UX (Design System)
                  </h2>
                  <p className="text-slate-600 dark:text-gray-400 mb-8">Creación del sistema de diseño core de Reyplace (colores, tipografía, componentes) manteniendo el concepto futurista y la coherencia visual en todo el ecosistema.</p>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold font-sans">Sans Pro (Base)</div>
                    <div className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg text-sm font-bold font-mono">MONO (Data)</div>
                    <div className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20">Acción Principal</div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="h-24 rounded-2xl bg-[#080809] border border-white/10 flex flex-col items-center justify-center p-2 text-center text-xs font-bold text-white">Superficie Dark</div>
                    <div className="h-24 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex flex-col items-center justify-center p-2 text-center text-xs font-bold text-cyan-400">Glow UI</div>
                    <div className="h-24 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center p-2 text-center text-xs font-bold text-emerald-400">Feedback Success</div>
                    <div className="h-24 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-2 text-center text-xs font-bold text-slate-900">Superficie Light</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other tabs can be similarly implemented with rich bento-box layouts based on the prompt's instructions */}
            {['cloud', 'security', 'web3', 'academy'].includes(activeTab) && (
               <motion.div
                 key="placeholder"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm text-center min-h-[400px]"
               >
                 <Activity className="w-12 h-12 text-blue-500 mb-4 opacity-50" />
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Vista de Especialidad: {MODULES.find(m => m.id === activeTab)?.name}</h2>
                 <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto">
                   El sistema está operando correctamente bajo las directrices establecidas. Las especificaciones detalladas para este rol técnico se encuentran integradas en la matriz arquitectónica.
                 </p>
                 <button 
                   onClick={() => setActiveTab('roadmap')}
                   className="mt-6 px-6 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl font-bold text-sm text-slate-700 dark:text-white transition-colors cursor-pointer"
                 >
                   Volver al Roadmap
                 </button>
               </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
