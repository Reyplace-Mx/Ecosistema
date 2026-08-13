import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hexagon, Fingerprint, Coins, FileCode, Search, Wallet, 
  ArrowRight, ArrowDownLeft, ArrowUpRight, CheckCircle, Clock, 
  Link, ShieldCheck, Image as ImageIcon, RefreshCw, Layers, Database
} from 'lucide-react';
import type { Web3Transaction } from '../types';
import { BlockchainVolumeChart } from '../components/BlockchainVolumeChart';

const MOCK_TRANSACTIONS: Web3Transaction[] = [
  { id: 'tx_1', hash: '0x8f...3b9a', type: 'transfer', amount: 150.00, from: '0x12...a4f2', to: '0x99...b8e1', status: 'confirmed', timestamp: 'Hace 2 min' },
  { id: 'tx_2', hash: '0x2a...11c4', type: 'smart_contract', from: '0x55...d22f', to: 'Contrato Escrow (ERP)', status: 'confirmed', timestamp: 'Hace 15 min' },
  { id: 'tx_3', hash: '0x7e...99d1', type: 'nft_mint', from: 'Reyplace Academy', to: '0x33...f88c', status: 'pending', timestamp: 'Hace 1 hora' },
  { id: 'tx_4', hash: '0x1c...4a2b', type: 'identity_verification', from: 'Cúpula Digital', to: '0x88...e33d', status: 'confirmed', timestamp: 'Hace 3 horas' }
];

const MODULE_EXPLANATIONS = {
  reyid: {
    title: 'ReyID',
    desc: 'Identidad Descentralizada (DID).',
    icon: Fingerprint,
    functions: ['Verificación sin conocimiento cero', 'Control total de datos', 'Single Sign-On Web3']
  },
  reycoin: {
    title: 'Reycoin v2',
    desc: 'Token nativo del ecosistema.',
    icon: Coins,
    functions: ['Medio de pago principal', 'Staking y recompensas', 'Gobernanza comunitaria']
  },
  contracts: {
    title: 'Contratos Inteligentes',
    desc: 'Lógica de negocios inmutable.',
    icon: FileCode,
    functions: ['Escrow para Marketplace', 'Suscripciones Pro', 'Reglas de negocio']
  },
  audit: {
    title: 'Auditoría Blockchain',
    desc: 'Transparencia criptográfica.',
    icon: Search,
    functions: ['Verificación de hashes', 'Trazabilidad de fondos', 'Auditoría de noticias']
  },
  nft: {
    title: 'Activos NFT',
    desc: 'Bienes digitales y certificaciones.',
    icon: ImageIcon,
    functions: ['Tickets de eventos', 'Coleccionables Pro', 'Títulos de Academia']
  },
  wallet: {
    title: 'ReyWallet',
    desc: 'Billetera institucional MultiSig.',
    icon: Wallet,
    functions: ['Custodia compartida', 'Firma múltiple', 'Gestión de tesorería']
  }
};

export function BlockchainDashboard() {
  const [activeTab, setActiveTab] = useState<keyof typeof MODULE_EXPLANATIONS>('reyid');
  const activeModule = MODULE_EXPLANATIONS[activeTab];

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto animate-fade-in">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Hexagon className="w-8 h-8 text-amber-500" />
            Capa Web3 <span className="text-slate-400 dark:text-gray-600 font-medium">/</span> Blockchain Layer
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-2 max-w-3xl">La infraestructura descentralizada que da vida a ReyID, Reycoin v2 y la economía de contratos inteligentes.</p>
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
                  ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-500 border border-amber-200 dark:border-amber-500/20 shadow-sm' 
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
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20">
                <activeModule.icon className="w-8 h-8 text-amber-600 dark:text-amber-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activeModule.title}</h2>
                <p className="text-sm font-mono text-amber-600 dark:text-amber-400">{activeModule.desc}</p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activeModule.functions.map((func, idx) => {
                const funcIcons = [ShieldCheck, CheckCircle, Database, Link, Layers, RefreshCw];
                const Icon = funcIcons[idx % funcIcons.length];
                return (
                  <div key={idx} className="bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/5 p-4 rounded-xl flex items-start gap-3">
                    <Icon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-gray-300 font-medium">{func}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full md:w-72 space-y-4 shrink-0">
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 dark:text-gray-500">Métricas de Red</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">TPS Actual</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-green-500">4,200</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">Finalidad</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-green-500">&lt;1.5s</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <Hexagon className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">Costo de Gas</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-green-500">Sub-cent</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interactive Volume & Network Health Chart */}
      <section className="w-full">
        <BlockchainVolumeChart />
      </section>

      {/* Vista de Transacciones L2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-500" /> Explorador de Bloques (L2)
              </h3>
              <button className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-white/10 px-2 py-1 rounded">
                Ver Todas
              </button>
            </div>
            
            <div className="space-y-3">
              {MOCK_TRANSACTIONS.map(tx => (
                <div 
                  key={tx.id}
                  className="bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/5 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-200 dark:hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5`}>
                      {tx.type === 'transfer' ? <ArrowRight className="w-5 h-5 text-slate-500 dark:text-gray-400" /> :
                       tx.type === 'smart_contract' ? <FileCode className="w-5 h-5 text-cyan-500 dark:text-blue-400" /> :
                       tx.type === 'nft_mint' ? <ImageIcon className="w-5 h-5 text-purple-500 dark:text-purple-400" /> :
                       <Fingerprint className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white mb-0.5 flex items-center gap-2">
                        <span className="font-mono text-amber-600 dark:text-amber-500">{tx.hash}</span>
                      </p>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-slate-500 font-mono">De: {tx.from}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 dark:text-gray-600" />
                        <span className="text-slate-500 font-mono">Para: {tx.to}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left md:text-right">
                    {tx.amount && (
                      <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                        {tx.amount} <span className="text-[10px] text-amber-600 dark:text-amber-500">RYC</span>
                      </p>
                    )}
                    <span className={`inline-block text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${
                      tx.status === 'confirmed' ? 'bg-emerald-50 dark:bg-green-500/10 text-emerald-600 dark:text-green-500 border-emerald-200 dark:border-green-500/20' :
                      tx.status === 'pending' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-500/20' :
                      'bg-rose-50 dark:bg-red-500/10 text-rose-600 dark:text-red-500 border-rose-200 dark:border-red-500/20'
                    }`}>
                      {tx.status === 'confirmed' ? 'Confirmada' : tx.status === 'pending' ? 'Pendiente' : 'Fallida'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-[#111112] dark:to-[#1f160b] border border-slate-200 dark:border-amber-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden h-full flex flex-col justify-center text-center">
            <Coins className="w-12 h-12 text-amber-500 mx-auto mb-4 relative z-10" />
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 dark:text-gray-500 mb-2 relative z-10">Total Value Locked (TVL)</h3>
            <p className="text-4xl font-light text-slate-900 dark:text-white mb-1 relative z-10">
              2.4M <span className="text-sm font-bold text-amber-600 dark:text-amber-500">RYC</span>
            </p>
            <p className="text-xs text-emerald-600 dark:text-green-400 font-bold relative z-10 mb-6">+5.4% este mes</p>
            
            <button className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white dark:text-black rounded-lg text-sm font-bold transition-colors shadow-sm relative z-10 cursor-pointer">
              Gestionar Tesorería
            </button>
            
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-100 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
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
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

