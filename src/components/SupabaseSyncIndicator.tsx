import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, RefreshCw, CheckCircle2, ShieldAlert, Sparkles, Activity, KeyRound } from 'lucide-react';
import type { SupabaseSyncState } from '../types';

interface SupabaseSyncIndicatorProps {
  status: SupabaseSyncState;
  lastSyncTime?: string;
  channelName?: string;
  pingMs?: number;
  onManualSync?: () => void;
  compact?: boolean;
}

export function SupabaseSyncIndicator({
  status,
  lastSyncTime = 'Hace un momento',
  channelName = 'realtime:reyid_identities',
  pingMs = 18,
  onManualSync,
  compact = false,
}: SupabaseSyncIndicatorProps) {

  const statusConfig = {
    synced: {
      color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      dotColor: 'bg-emerald-400',
      glow: 'shadow-emerald-500/20',
      icon: CheckCircle2,
      label: 'Supabase Realtime Sincronizado',
      badgeText: 'ONLINE [200 OK]',
    },
    syncing: {
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
      dotColor: 'bg-cyan-400',
      glow: 'shadow-cyan-500/30',
      icon: RefreshCw,
      label: 'Sincronizando con Supabase Database...',
      badgeText: 'SYNCING DATA',
    },
    signing: {
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
      dotColor: 'bg-amber-400',
      glow: 'shadow-amber-500/30',
      icon: KeyRound,
      label: 'Firmando Criptográficamente & Sync Supabase...',
      badgeText: 'CRYPTO SIGNING',
    },
    updated: {
      color: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
      dotColor: 'bg-purple-400',
      glow: 'shadow-purple-500/30',
      icon: Sparkles,
      label: 'Identidad Actualizada en Supabase',
      badgeText: 'REALTIME COMMIT',
    },
    error: {
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
      dotColor: 'bg-rose-400',
      glow: 'shadow-rose-500/20',
      icon: ShieldAlert,
      label: 'Error de Reconexión Supabase',
      badgeText: 'RETRYING',
    },
  };

  const currentConfig = statusConfig[status] || statusConfig.synced;
  const Icon = currentConfig.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${currentConfig.color} shadow-lg ${currentConfig.glow}`}>
          <div className="relative flex items-center justify-center">
            {status === 'syncing' || status === 'signing' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <Icon className="w-3.5 h-3.5" />
              </motion.div>
            ) : (
              <Icon className="w-3.5 h-3.5" />
            )}
            <motion.span
              animate={status === 'synced' ? { scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute w-2 h-2 rounded-full ${currentConfig.dotColor} -top-1 -right-1 opacity-75`}
            />
          </div>
          <span className="font-bold tracking-tight">{currentConfig.badgeText}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${currentConfig.color} shadow-lg ${currentConfig.glow}`}
    >
      {/* Background Pulse Animation for Syncing / Signing */}
      <AnimatePresence>
        {(status === 'syncing' || status === 'signing') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left Side: Icon & Status Text */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-black/40 border border-white/10 shrink-0">
            {status === 'syncing' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <RefreshCw className="w-5 h-5 text-cyan-400" />
              </motion.div>
            ) : status === 'signing' ? (
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <KeyRound className="w-5 h-5 text-amber-400" />
              </motion.div>
            ) : status === 'updated' ? (
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: [1, 1.2, 1], rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="w-5 h-5 text-purple-300" />
              </motion.div>
            ) : (
              <Database className="w-5 h-5 text-emerald-400" />
            )}

            {/* Status Ping Dot */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentConfig.dotColor}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${currentConfig.dotColor}`} />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Supabase Realtime Engine
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-black/40 border border-white/10">
                {currentConfig.badgeText}
              </span>
            </div>
            <p className="text-xs mt-0.5 opacity-90 font-medium">{currentConfig.label}</p>
          </div>
        </div>

        {/* Right Side: Channel Details & Manual Sync Trigger */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
          <div className="text-right font-mono text-[11px] hidden md:block">
            <div className="text-gray-400 flex items-center justify-end gap-1">
              <Activity className="w-3 h-3 text-cyan-400" /> Latencia: <span className="text-emerald-400 font-bold">{pingMs}ms</span>
            </div>
            <div className="text-gray-500 text-[10px]">Canal: {channelName}</div>
          </div>

          {onManualSync && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onManualSync}
              disabled={status === 'syncing' || status === 'signing'}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
              title="Forzar re-sincronización con Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${status === 'syncing' ? 'animate-spin' : ''}`} />
              <span>Sincronizar Supabase</span>
            </motion.button>
          )}
        </div>

      </div>

      {/* Footer Info Line */}
      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          WebSocket SSL WSS Active
        </span>
        <span>Última Sincronización: <strong className="text-gray-200">{lastSyncTime}</strong></span>
      </div>
    </motion.div>
  );
}
