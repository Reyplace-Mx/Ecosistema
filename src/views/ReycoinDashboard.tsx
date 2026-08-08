import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Coins, 
  Wallet, 
  ArrowRightLeft, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileCode2, 
  History,
  ShieldCheck,
  Zap,
  TrendingUp,
  CreditCard,
  Copy,
  ExternalLink
} from 'lucide-react';
import type { WalletData, Transaction, SmartContract } from '../types';

const MOCK_WALLET: WalletData = {
  address: '0x7F4...3A9B',
  balanceInternalRYC: 12500,
  balanceWeb3RYC: 4500,
  totalFiatUSD: 17000,
  status: 'active'
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    date: 'Hace 2 horas',
    type: 'payment',
    amountRYC: -120,
    amountUSD: -120,
    status: 'completed',
    description: 'Hardware Wallet "Reyplace Safe"',
    network: 'internal'
  },
  {
    id: 'tx_2',
    date: 'Hoy, 09:41',
    type: 'deposit',
    amountRYC: 500,
    amountUSD: 500,
    status: 'completed',
    description: 'Recarga desde Tarjeta',
    network: 'web3',
    txHash: '0x8a9...b2f1'
  },
  {
    id: 'tx_3',
    date: 'Ayer',
    type: 'fee',
    amountRYC: -15,
    amountUSD: -15,
    status: 'completed',
    description: 'Logística - Envío Local',
    network: 'internal'
  },
  {
    id: 'tx_4',
    date: 'Hace 2 días',
    type: 'withdrawal',
    amountRYC: -1000,
    amountUSD: -1000,
    status: 'pending',
    description: 'Retiro a Cuenta Bancaria',
    network: 'web3',
    txHash: '0x3c2...e8d4'
  }
];

const MOCK_CONTRACTS: SmartContract[] = [
  {
    id: 'sc_1',
    name: 'Escrow Marketplace #4592',
    type: 'escrow',
    status: 'active',
    balanceRYC: 450,
    participants: 2
  },
  {
    id: 'sc_2',
    name: 'Suscripción Servicios Pro',
    type: 'subscription',
    status: 'active',
    balanceRYC: 50,
    participants: 125
  }
];

export function ReycoinDashboard() {
  const [activeTab, setActiveTab] = useState<'wallet' | 'transactions' | 'contracts'>('wallet');

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
            <Coins className="w-8 h-8 text-amber-400" />
            Pagos & Reycoin <span className="text-gray-600 font-medium">/</span> Centro Financiero
          </h1>
          <p className="text-gray-400 mt-2">Gestiona tu ReyWallet, tokens Web3, contratos inteligentes y comisiones.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#111112] border border-white/5 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('wallet')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'wallet' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            ReyWallet
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'transactions' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Historial
          </button>
          <button 
            onClick={() => setActiveTab('contracts')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'contracts' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Contratos (Smart)
          </button>
        </div>
      </header>

      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-amber-600/20 to-amber-900/40 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden h-[240px] flex flex-col justify-between group">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h3 className="text-amber-400/80 uppercase font-bold tracking-widest text-xs mb-1">Saldo Interno (Off-chain)</h3>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="text-xs text-amber-200/50">Cero gas, transacciones instantáneas</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Coins className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div className="text-4xl font-light text-white flex items-baseline gap-2 mb-2">
                    {MOCK_WALLET.balanceInternalRYC.toLocaleString()} <span className="text-xl text-amber-400 font-bold">RYC</span>
                  </div>
                  <div className="text-sm text-amber-200/70">≈ ${(MOCK_WALLET.balanceInternalRYC).toLocaleString()} USD</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#111112] to-[#0c0c0d] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden h-[240px] flex flex-col justify-between group">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all duration-700"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-400 uppercase font-bold tracking-widest text-xs mb-1">Saldo Web3 (On-chain)</h3>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-gray-500">Reycoin v2 en Blockchain</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Wallet className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div className="text-4xl font-light text-white flex items-baseline gap-2 mb-2">
                    {MOCK_WALLET.balanceWeb3RYC.toLocaleString()} <span className="text-xl text-gray-400 font-bold">RYC</span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    {MOCK_WALLET.address} 
                    <button className="hover:text-white transition-colors"><Copy className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl">
               <h3 className="text-sm font-bold text-white mb-6">Acciones Rápidas</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <button className="bg-[#080809] border border-white/5 hover:border-amber-500/30 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowDownRight className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Recargar</span>
                 </button>
                 <button className="bg-[#080809] border border-white/5 hover:border-amber-500/30 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Enviar</span>
                 </button>
                 <button className="bg-[#080809] border border-white/5 hover:border-cyan-500/30 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRightLeft className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest text-center">Bridge<br/><span className="text-[9px] text-gray-500">(Int ↔ Web3)</span></span>
                 </button>
                 <button className="bg-[#080809] border border-white/5 hover:border-white/20 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-white/5 text-gray-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Retirar</span>
                 </button>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" /> Rendimiento de Cuenta
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-[#080809] border border-white/5 rounded-xl p-5">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Patrimonio Total (Equivalente)</p>
                  <div className="text-2xl font-bold text-white mb-2">${MOCK_WALLET.totalFiatUSD.toLocaleString()} USD</div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden flex">
                    <div className="bg-amber-500 h-full" style={{ width: '73%' }}></div>
                    <div className="bg-cyan-500 h-full" style={{ width: '27%' }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    <span>Interno (73%)</span>
                    <span>Web3 (27%)</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Beneficios Reyplace Pro</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Cashback Acumulado</span>
                    <span className="text-amber-400 font-bold">+125 RYC</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Comisiones Ahorradas</span>
                    <span className="text-green-400 font-bold">45 RYC</span>
                  </div>
                </div>
                
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white transition-colors">
                  Generar Reporte Fiscal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-[#111112] border border-white/5 rounded-2xl shadow-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" /> Historial de Movimientos
            </h3>
            <div className="flex items-center gap-2">
              <select className="bg-[#080809] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-amber-500/50">
                <option>Todos los movimientos</option>
                <option>Solo Depósitos</option>
                <option>Solo Retiros</option>
                <option>Pagos (Marketplace)</option>
              </select>
              <select className="bg-[#080809] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-amber-500/50">
                <option>Red Interna & Web3</option>
                <option>Solo Red Interna</option>
                <option>Solo Web3</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            {MOCK_TRANSACTIONS.map(tx => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={tx.id} 
                className="bg-[#080809] border border-white/5 hover:border-white/10 rounded-xl p-4 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                    tx.amountRYC > 0 ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {tx.amountRYC > 0 ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">{tx.description}</h4>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-gray-500">{tx.date}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                      <span className={`uppercase font-bold tracking-widest ${
                        tx.network === 'internal' ? 'text-amber-500/70' : 'text-cyan-500/70'
                      }`}>
                        {tx.network === 'internal' ? 'Off-chain' : 'On-chain'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className={`text-sm font-bold flex items-center gap-1 ${
                    tx.amountRYC > 0 ? 'text-green-400' : 'text-white'
                  }`}>
                    {tx.amountRYC > 0 ? '+' : ''}{tx.amountRYC} <span className="text-[10px] text-gray-500">RYC</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {tx.status === 'pending' && (
                      <span className="text-[9px] uppercase font-bold tracking-widest bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">
                        Pendiente
                      </span>
                    )}
                    {tx.txHash && (
                      <a href="#" className="text-[10px] text-gray-500 hover:text-cyan-400 flex items-center gap-1 transition-colors">
                        Tx: {tx.txHash.substring(0, 6)}... <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'contracts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MOCK_CONTRACTS.map(contract => (
             <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               key={contract.id} 
               className="bg-[#111112] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group"
             >
               <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                 <FileCode2 className="w-32 h-32" />
               </div>
               
               <div className="relative z-10 flex justify-between items-start mb-6">
                 <div>
                   <div className="flex items-center gap-2 mb-2">
                     <span className="text-[10px] uppercase font-bold tracking-widest bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
                       {contract.type}
                     </span>
                     <span className="text-[10px] uppercase font-bold tracking-widest bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> Activo
                     </span>
                   </div>
                   <h3 className="text-lg font-bold text-white">{contract.name}</h3>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                 <div className="bg-[#080809] border border-white/5 rounded-xl p-4">
                   <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Balance Bloqueado</p>
                   <p className="text-xl font-bold text-white">{contract.balanceRYC} <span className="text-xs text-amber-500">RYC</span></p>
                 </div>
                 <div className="bg-[#080809] border border-white/5 rounded-xl p-4">
                   <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Participantes</p>
                   <p className="text-xl font-bold text-white">{contract.participants}</p>
                 </div>
               </div>
               
               <div className="flex gap-3 relative z-10">
                 <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white transition-colors">
                   Ver Reglas (ABI)
                 </button>
                 <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white transition-colors flex items-center justify-center gap-1">
                   Auditoría Blockchain <ExternalLink className="w-3 h-3" />
                 </button>
               </div>
             </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
