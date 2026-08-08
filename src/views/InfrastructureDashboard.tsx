import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Server, Box, Network, Database, HardDrive, Cpu, 
  Activity, Save, AlertCircle, CheckCircle, RefreshCw,
  Globe, Zap, ArrowUp, Link, Layers, Terminal
} from 'lucide-react';
import type { InfrastructureNode } from '../types';

const MOCK_NODES: InfrastructureNode[] = [
  { id: 'node_1', name: 'reyplace-api-prod-01', type: 'server', status: 'healthy', region: 'us-east', load: 45, uptime: '99.99%' },
  { id: 'node_2', name: 'db-master-cluster', type: 'database', status: 'healthy', region: 'us-east', load: 62, uptime: '99.95%' },
  { id: 'node_3', name: 'cache-redis-01', type: 'cache', status: 'warning', region: 'eu-west', load: 88, uptime: '99.90%' },
  { id: 'node_4', name: 'cdn-edge-latam', type: 'cdn', status: 'healthy', region: 'sa-east', load: 25, uptime: '100%' }
];

const MODULE_EXPLANATIONS = {
  servers: {
    title: 'Servidores & Cómputo',
    desc: 'Infraestructura elástica de alto rendimiento.',
    icon: Server,
    functions: ['Auto-escalado predictivo', 'Cómputo en el borde', 'Balanceo global']
  },
  containers: {
    title: 'Contenedores',
    desc: 'Orquestación de microservicios con Kubernetes.',
    icon: Box,
    functions: ['Despliegues zero-downtime', 'Aislamiento de procesos', 'Service mesh']
  },
  cdn: {
    title: 'CDN & Edge',
    desc: 'Entrega de contenido ultrarrápida.',
    icon: Globe,
    functions: ['Caché distribuido global', 'Compresión en vuelo', 'Enrutamiento Anycast']
  },
  db: {
    title: 'Bases de Datos',
    desc: 'Almacenamiento relacional y NoSQL.',
    icon: Database,
    functions: ['Replicación multi-región', 'Sharding automático', 'Recuperación PITR']
  },
  cache: {
    title: 'Caché en Memoria',
    desc: 'Reducción de latencia sub-milisegundo.',
    icon: Zap,
    functions: ['Redis/Memcached', 'Invalidadación inteligente', 'Sesiones distribuidas']
  },
  events: {
    title: 'Bus de Eventos',
    desc: 'Arquitectura orientada a eventos (Kafka).',
    icon: Network,
    functions: ['Procesamiento asíncrono', 'Garantía de entrega', 'Replay de eventos']
  },
  monitoring: {
    title: 'Monitoreo APM',
    desc: 'Observabilidad completa del stack.',
    icon: Activity,
    functions: ['Trazas distribuidas', 'Métricas de negocio', 'Alertas sintéticas']
  },
  backups: {
    title: 'Backups & DR',
    desc: 'Continuidad de negocio garantizada.',
    icon: Save,
    functions: ['Snapshots incrementales', 'Pruebas de restauración', 'Bóveda fría (Glacier)']
  }
};

export function InfrastructureDashboard() {
  const [activeTab, setActiveTab] = useState<keyof typeof MODULE_EXPLANATIONS>('servers');
  const activeModule = MODULE_EXPLANATIONS[activeTab];

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto animate-fade-in">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Server className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            Capa de Infraestructura <span className="text-slate-400 dark:text-gray-600 font-medium">/</span> Cloud & DevOps
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-2 max-w-3xl">La base técnica escalable que soporta millones de usuarios concurrentes en todo el ecosistema Reyplace.</p>
        </div>
        
        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-xl p-1.5 shadow-sm">
          {Object.entries(MODULE_EXPLANATIONS).map(([key, mod]) => (
            <motion.button 
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(key as keyof typeof MODULE_EXPLANATIONS)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === key 
                  ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-500 border border-blue-200 dark:border-blue-500/20 shadow-sm' 
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
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                <activeModule.icon className="w-8 h-8 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activeModule.title}</h2>
                <p className="text-sm font-mono text-blue-600 dark:text-blue-400">{activeModule.desc}</p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activeModule.functions.map((func, idx) => {
                const funcIcons = [CheckCircle, ArrowUp, RefreshCw, Link, Layers, Cpu];
                const Icon = funcIcons[idx % funcIcons.length];
                return (
                  <div key={idx} className="bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/5 p-4 rounded-xl flex items-start gap-3">
                    <Icon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-gray-300 font-medium">{func}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full md:w-72 space-y-4 shrink-0">
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 dark:text-gray-500">Métricas Críticas</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">Latencia P99</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-green-500">42ms</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">Uso de Cómputo</span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-500">45%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">Uptime Global</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-green-500">99.999%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Global Status View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600 dark:text-blue-500" /> Nodos de Infraestructura (Top)
              </h3>
              <div className="flex gap-2">
                <button className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-white/10 px-2 py-1 rounded">
                  Región
                </button>
                <button className="text-[10px] uppercase font-bold tracking-widest text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors border border-blue-200 dark:border-blue-500/20 px-2 py-1 rounded bg-blue-50 dark:bg-blue-500/10">
                  Ver Mapa Topológico
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {MOCK_NODES.map(node => (
                <div 
                  key={node.id}
                  className="bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/5 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-200 dark:hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      node.status === 'critical' || node.status === 'offline' ? 'bg-rose-100 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-500' :
                      node.status === 'warning' ? 'bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-500' :
                      'bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-500'
                    }`}>
                      {node.type === 'server' ? <Server className="w-5 h-5" /> : 
                       node.type === 'database' ? <Database className="w-5 h-5" /> :
                       node.type === 'cache' ? <Zap className="w-5 h-5" /> :
                       <Globe className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">{node.name}</p>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-slate-500 font-mono">{node.region}</span>
                        <span className="text-slate-400 dark:text-gray-600">•</span>
                        <span className="text-slate-500">Uptime: {node.uptime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left md:text-right flex items-center md:flex-col gap-4 md:gap-1">
                    <div className="w-24 bg-slate-200 dark:bg-white/5 rounded-full h-1.5 md:hidden">
                      <div className={`h-1.5 rounded-full ${node.load > 80 ? 'bg-rose-500' : node.load > 60 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${node.load}%` }}></div>
                    </div>
                    
                    <span className={`inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded border ${
                      node.status === 'healthy' ? 'bg-emerald-50 dark:bg-green-500/10 text-emerald-600 dark:text-green-500 border-emerald-200 dark:border-green-500/20' :
                      node.status === 'warning' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-500/20' :
                      'bg-rose-50 dark:bg-red-500/10 text-rose-600 dark:text-red-500 border-rose-200 dark:border-red-500/20'
                    }`}>
                      {node.status === 'healthy' ? 'Óptimo' : node.status === 'warning' ? 'Alerta' : 'Crítico'}
                    </span>
                    <div className="hidden md:flex items-center gap-2 mt-1">
                       <span className="text-[9px] text-slate-400 dark:text-gray-500 uppercase">Carga:</span>
                       <div className="w-16 bg-slate-200 dark:bg-white/5 rounded-full h-1">
                         <div className={`h-1 rounded-full ${node.load > 80 ? 'bg-rose-500' : node.load > 60 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${node.load}%` }}></div>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-[#111112] dark:to-[#0a0f1a] border border-slate-200 dark:border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden h-full">
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 dark:text-gray-500 mb-6">Estado General del Sistema</h3>
            
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-[10px] text-slate-500 dark:text-gray-500 mb-1 uppercase font-bold tracking-widest">Saturación de Red</p>
                <p className="text-3xl font-light text-blue-600 dark:text-blue-400 mb-1">12.4 <span className="text-sm font-bold">Gbps</span></p>
                <p className="text-xs text-slate-600 dark:text-gray-400">Tráfico global entrante</p>
              </div>
              
              <div>
                <p className="text-[10px] text-slate-500 dark:text-gray-500 mb-1 uppercase font-bold tracking-widest">Incidentes Abiertos</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  0 <CheckCircle className="w-4 h-4 text-emerald-500" />
                </p>
              </div>
              
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer mt-4">
                Escalar Recursos Manualmente
              </button>
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-100 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
