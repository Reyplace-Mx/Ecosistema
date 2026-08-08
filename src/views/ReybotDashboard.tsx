import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, MessageSquare, ShieldAlert, Briefcase, Rss, Users, 
  GraduationCap, Sparkles, Zap, CheckCircle, Clock, TrendingUp, 
  BrainCircuit, Bot, Lightbulb, FileText, Lock, Settings
} from 'lucide-react';
import type { ReybotInteraction } from '../types';

const MOCK_INTERACTIONS: ReybotInteraction[] = [
  { id: 'int_1', module: 'Soporte Pro', user: 'Juan Pérez', intent: 'Problema con facturación', status: 'resolved', timestamp: 'Hace 5 min' },
  { id: 'int_2', module: 'Marketplace', user: 'Ana García', intent: 'Recomendación de producto', status: 'processing', timestamp: 'Hace 12 min' },
  { id: 'int_3', module: 'Reybot Guardian', user: 'Sistema', intent: 'Alerta de transacción sospechosa', status: 'escalated', timestamp: 'Hace 30 min' }
];

const MODULE_EXPLANATIONS = {
  assistant: {
    title: 'Reybot Asistente',
    desc: 'Soporte omnicanal y asistente personal 24/7.',
    icon: MessageSquare,
    functions: ['Soporte técnico y resolución de dudas', 'Automatización de tareas rutinarias', 'Navegación guiada por el ecosistema']
  },
  guardian: {
    title: 'Reybot Guardian',
    desc: 'Escudo protector basado en IA para la Cúpula Digital.',
    icon: ShieldAlert,
    functions: ['Seguridad proactiva', 'Detección de fraude y anomalías', 'Moderación de contenido']
  },
  business: {
    title: 'Reybot Business',
    desc: 'Analista de datos y agente de ventas autónomo para empresas.',
    icon: Briefcase,
    functions: ['Automatización de ventas', 'Recomendaciones de inventario', 'Insights de mercado predictivos']
  },
  news: {
    title: 'Reybot News',
    desc: 'Curador de noticias y generador de contexto.',
    icon: Rss,
    functions: ['Resúmenes ejecutivos de noticias', 'Detección de fake news', 'Personalización de feed cívico']
  },
  social: {
    title: 'Reybot Social',
    desc: 'Optimizador de redes y conexiones en Unión.live.',
    icon: Users,
    functions: ['Recomendaciones de networking', 'Emparejamiento de intereses', 'Gestión de reputación digital']
  },
  education: {
    title: 'Reybot Educativo',
    desc: 'Tutor personalizado para la Academia Reyplace.',
    icon: GraduationCap,
    functions: ['Explicación de módulos y conceptos', 'Rutas de aprendizaje dinámicas', 'Evaluación continua']
  }
};

export function ReybotDashboard() {
  const [activeTab, setActiveTab] = useState<keyof typeof MODULE_EXPLANATIONS>('assistant');
  const activeModule = MODULE_EXPLANATIONS[activeTab];

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto animate-fade-in">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Cpu className="w-8 h-8 text-cyan-600 dark:text-purple-400" />
            Capa de IA <span className="text-slate-400 dark:text-gray-600 font-medium">/</span> Reybot Completo
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-2 max-w-3xl">Inteligencia artificial ubicua que potencia, protege y asiste en todos los módulos de Reyplace mediante automatización, resúmenes, recomendaciones y seguridad activa.</p>
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
                  ? 'bg-cyan-50 dark:bg-purple-500/20 text-cyan-700 dark:text-purple-400 border border-cyan-200 dark:border-purple-500/20 shadow-sm' 
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <mod.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{mod.title.replace('Reybot ', '')}</span>
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
              <div className="p-3 bg-cyan-50 dark:bg-purple-500/10 rounded-xl border border-cyan-100 dark:border-purple-500/20">
                <activeModule.icon className="w-8 h-8 text-cyan-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activeModule.title}</h2>
                <p className="text-sm font-mono text-cyan-600 dark:text-purple-400">{activeModule.desc}</p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activeModule.functions.map((func, idx) => {
                const funcIcons = [Lightbulb, CheckCircle, Zap, ShieldAlert, FileText, Settings];
                const Icon = funcIcons[idx % funcIcons.length];
                return (
                  <div key={idx} className="bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/5 p-4 rounded-xl flex items-start gap-3">
                    <Icon className="w-5 h-5 text-cyan-500 dark:text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-gray-300 font-medium">{func}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full md:w-72 space-y-4 shrink-0">
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 dark:text-gray-500">Capacidades Core</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-cyan-600 dark:text-purple-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">Soporte Continuo</span>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-cyan-600 dark:text-purple-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">Análisis Predictivo</span>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-600 dark:text-purple-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">Privacidad Zero-Knowledge</span>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Monitor de Interacciones Global */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600 dark:text-purple-400" /> Monitor en Tiempo Real
              </h3>
              <span className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-green-400 bg-emerald-50 dark:bg-green-500/10 px-3 py-1 rounded-full border border-emerald-200 dark:border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-green-400 animate-pulse"></div> Online
              </span>
            </div>
            
            <div className="space-y-3">
              {MOCK_INTERACTIONS.map(interaction => (
                <div 
                  key={interaction.id}
                  className="bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/5 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-200 dark:hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      interaction.status === 'resolved' ? 'bg-emerald-100 dark:bg-green-500/10 border-emerald-200 dark:border-green-500/20 text-emerald-600 dark:text-green-400' :
                      interaction.status === 'escalated' ? 'bg-rose-100 dark:bg-red-500/10 border-rose-200 dark:border-red-500/20 text-rose-600 dark:text-red-400' :
                      'bg-cyan-100 dark:bg-purple-500/10 border-cyan-200 dark:border-purple-500/20 text-cyan-600 dark:text-purple-400'
                    }`}>
                      {interaction.status === 'resolved' ? <CheckCircle className="w-5 h-5" /> :
                       interaction.status === 'escalated' ? <ShieldAlert className="w-5 h-5" /> :
                       <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">{interaction.intent}</p>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-slate-500">{interaction.user}</span>
                        <span className="text-slate-300 dark:text-gray-600">•</span>
                        <span className="text-slate-400">{interaction.module}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left md:text-right">
                    <span className={`inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded border ${
                      interaction.status === 'resolved' ? 'bg-emerald-50 dark:bg-green-500/10 text-emerald-600 dark:text-green-400 border-emerald-200 dark:border-green-500/20' :
                      interaction.status === 'escalated' ? 'bg-rose-50 dark:bg-red-500/10 text-rose-600 dark:text-red-400 border-rose-200 dark:border-red-500/20' :
                      'bg-cyan-50 dark:bg-purple-500/10 text-cyan-600 dark:text-purple-400 border-cyan-200 dark:border-purple-500/20'
                    }`}>
                      {interaction.status === 'resolved' ? 'Resuelto por IA' : interaction.status === 'escalated' ? 'Escalado a Humano' : 'Procesando'}
                    </span>
                    <p className="text-[9px] text-slate-400 dark:text-gray-500 mt-1">{interaction.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-[#111112] dark:to-[#1a0b1f] border border-slate-200 dark:border-purple-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden h-full">
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 dark:text-gray-500 mb-6">Métricas Globales Reybot</h3>
            
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-[10px] text-slate-500 dark:text-gray-500 mb-1 uppercase font-bold tracking-widest">Resolución Autónoma</p>
                <p className="text-3xl font-light text-slate-900 dark:text-white mb-1">87.4%</p>
                <p className="text-xs text-emerald-600 dark:text-green-400 flex items-center gap-1 font-bold"><TrendingUp className="w-3 h-3" /> +2.1% esta semana</p>
              </div>
              
              <div>
                <p className="text-[10px] text-slate-500 dark:text-gray-500 mb-1 uppercase font-bold tracking-widest">Tiempo de Respuesta Medio</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white mb-1">&lt;1.2s</p>
              </div>
              
              <div>
                <p className="text-[10px] text-slate-500 dark:text-gray-500 mb-1 uppercase font-bold tracking-widest">Interacciones Hoy</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">45,210</p>
              </div>
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-100 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Activity(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2" />
    </svg>
  );
}
