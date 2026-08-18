import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Activity, 
  Clock, 
  Smartphone, 
  Laptop, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  Search, 
  RefreshCw,
  Lock,
  Key,
  Globe
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { AnimatedCard } from './AnimatedCard';

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  did: string;
  action: 'Biometric Login' | 'Passkey Registration' | 'FIDO2 Challenge' | 'Token Transfer' | 'Security Audit';
  status: 'success' | 'warning' | 'failed';
  device: string;
  ipAddress: string;
  location: string;
}

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'LOG-8901',
    timestamp: 'Hace 2 mins',
    user: 'Carlos Mendoza',
    did: 'did:rey:0x8F92...31A',
    action: 'Biometric Login',
    status: 'success',
    device: 'iPhone 15 Pro (FaceID)',
    ipAddress: '187.190.45.12',
    location: 'Los Mochis, Sinaloa'
  },
  {
    id: 'LOG-8900',
    timestamp: 'Hace 8 mins',
    user: 'Dra. Sofía Ramírez',
    did: 'did:rey:0x4B12...99C',
    action: 'Passkey Registration',
    status: 'success',
    device: 'MacBook Pro M3 (TouchID)',
    ipAddress: '187.190.22.84',
    location: 'Culiacán, Sinaloa'
  },
  {
    id: 'LOG-8999',
    timestamp: 'Hace 15 mins',
    user: 'Desconocido / Bot',
    did: 'did:rey:0x000...000',
    action: 'FIDO2 Challenge',
    status: 'failed',
    device: 'Linux Headless Agent',
    ipAddress: '45.154.255.80',
    location: 'Nodo Desconocido (Proxy)'
  },
  {
    id: 'LOG-8998',
    timestamp: 'Hace 24 mins',
    user: 'Ing. Mateo Torres',
    did: 'did:rey:0x7C31...12F',
    action: 'Token Transfer',
    status: 'success',
    device: 'YubiKey 5Ci (Hardware)',
    ipAddress: '187.190.11.5',
    location: 'Los Mochis, Sinaloa'
  },
  {
    id: 'LOG-8997',
    timestamp: 'Hace 40 mins',
    user: 'Valentina Castro',
    did: 'did:rey:0x9A44...88E',
    action: 'Security Audit',
    status: 'warning',
    device: 'Android Pixel 8 Pro',
    ipAddress: '187.190.50.19',
    location: 'Mazatlán, Sinaloa'
  }
];

const TRAFFIC_DATA = [
  { time: '00:00', authentications: 120, failures: 4 },
  { time: '04:00', authentications: 45, failures: 12 },
  { time: '08:00', authentications: 430, failures: 8 },
  { time: '12:00', authentications: 850, failures: 15 },
  { time: '16:00', authentications: 620, failures: 6 },
  { time: '20:00', authentications: 340, failures: 3 },
];

export function ActivityStream() {
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const newLog: ActivityLog = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: 'Ahora mismo',
        user: 'Usuario Verificado ReyID',
        did: `did:rey:0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 5)}`,
        action: 'Biometric Login',
        status: 'success',
        device: 'Dispositivo Seguro FIDO2',
        ipAddress: '187.190.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
        location: 'Los Mochis, Sinaloa'
      };
      setLogs([newLog, ...logs]);
    }, 800);
  };

  const filteredLogs = logs.filter(log => {
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.did.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <AnimatedCard className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-cyan-500/20 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Flujo de Actividad y Tráfico ReyID</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                FIDO2 Live Stream
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-mono">
              Monitoreo en tiempo real de solicitudes criptográficas y autenticaciones biométricas
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Sincronizando...' : 'Actualizar Stream'}</span>
        </button>
      </div>

      {/* Traffic Analytics Chart */}
      <div className="bg-slate-50 dark:bg-[#0a0d14] border border-slate-200 dark:border-white/5 rounded-2xl p-4 shadow-inner space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Tráfico de Autenticaciones (Últimas 24 Horas)</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span className="text-gray-400">Exitosas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-gray-400">Anomalías / Bloqueadas</span>
            </div>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="time" stroke="#888888" fontSize={10} tickLine={false} />
              <YAxis stroke="#888888" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0d1322', 
                  borderColor: '#06b6d4', 
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: '#fff' 
                }} 
              />
              <Bar dataKey="authentications" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Autenticaciones" />
              <Bar dataKey="failures" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Bloqueadas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filtrar por usuario, DID, acción o ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-gray-200 outline-none focus:border-cyan-500 transition-colors font-mono"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-gray-200 outline-none focus:border-cyan-500 transition-colors font-mono"
          >
            <option value="all">Todos los Estados</option>
            <option value="success">Exitosas</option>
            <option value="warning">Advertencia</option>
            <option value="failed">Fallidas / Bloqueadas</option>
          </select>
        </div>
      </div>

      {/* Logs Feed */}
      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => {
            const isSuccess = log.status === 'success';
            const isWarning = log.status === 'warning';
            
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  isSuccess 
                    ? 'bg-white/5 dark:bg-[#0d1322]/50 border-slate-200 dark:border-white/5 hover:border-cyan-500/40' 
                    : isWarning
                    ? 'bg-amber-500/5 border-amber-500/20'
                    : 'bg-red-500/5 border-red-500/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    isSuccess ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                    isWarning ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{log.user}</span>
                      <span className="text-[10px] font-mono text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                        {log.action}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-gray-400 mt-0.5">
                      <span className="text-gray-600 dark:text-gray-500">{log.did}</span>
                      <span>•</span>
                      <span>{log.device}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 text-[11px] font-mono shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-white/5">
                  <span className="text-slate-700 dark:text-gray-300">{log.location}</span>
                  <span className="text-[10px] text-slate-400 dark:text-gray-500">{log.timestamp}</span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500 font-mono text-xs">
            No se encontraron registros de actividad con los filtros seleccionados.
          </div>
        )}
      </div>
    </AnimatedCard>
  );
}
