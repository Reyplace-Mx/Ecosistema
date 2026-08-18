import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Fingerprint, 
  Key, 
  Smartphone, 
  Laptop, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Info, 
  Lock, 
  Sparkles, 
  ChevronRight, 
  Hash, 
  Globe, 
  Activity, 
  ExternalLink,
  ShieldAlert,
  Zap,
  Check
} from 'lucide-react';
import { ReyIDAuthEvent } from '../types';
import { getRecentReyIDAuthEvents, recordReyIDAuthEvent } from '../lib/reyidAuthEvents';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

interface RecentActivityLogProps {
  className?: string;
  onNavigateToReyID?: () => void;
  compact?: boolean;
}

export function RecentActivityLog({ className = '', onNavigateToReyID, compact = false }: RecentActivityLogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<ReyIDAuthEvent[]>(() => getRecentReyIDAuthEvents());
  const [selectedEvent, setSelectedEvent] = useState<ReyIDAuthEvent | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Sync with localStorage & custom events
  useEffect(() => {
    const handleStorageChange = () => {
      setEvents(getRecentReyIDAuthEvents());
    };

    const handleCustomAuthEvent = () => {
      setEvents(getRecentReyIDAuthEvents());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('reyid:auth_event_recorded', handleCustomAuthEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('reyid:auth_event_recorded', handleCustomAuthEvent);
    };
  }, []);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setEvents(getRecentReyIDAuthEvents());
      setIsRefreshing(false);
      toast.info('Registro ReyID Actualizado', 'Se sincronizaron las últimas 5 autenticaciones exitosas con la Cúpula.');
    }, 450);
  };

  // Simulate a live new authentic event
  const handleSimulateNewSuccessAuth = () => {
    const methods: Array<ReyIDAuthEvent['method']> = [
      'WebAuthn / Passkey',
      'Biométrico Facial (Face ID)',
      'Touch ID / Huella',
      'YubiKey Hardware FIDO2',
      'OAuth Google Seguro'
    ];
    const devices = [
      'iPhone 15 Pro (Face ID Biometrics)',
      'MacBook Pro M3 (Touch ID Enclave)',
      'YubiKey 5 NFC (FIDO2 Hardware Key)',
      'iPad Pro M2 (Neural Engine FaceID)',
      'Dispositivo Seguro FIDO2 (WebAuthn)'
    ];
    
    const randomIdx = Math.floor(Math.random() * methods.length);
    const chosenMethod = methods[randomIdx];
    const chosenDevice = devices[randomIdx];

    const randomHash = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 6)}`;
    
    recordReyIDAuthEvent({
      method: chosenMethod,
      status: 'SUCCESS',
      statusLabel: 'Autenticación Exitosa',
      device: chosenDevice,
      did: user?.did || 'did:rey:0x7aF982...b3A1',
      user: user?.name || 'Global Tech Solutions',
      ipAddress: '187.190.' + Math.floor(10 + Math.random() * 80) + '.' + Math.floor(10 + Math.random() * 80),
      location: 'Los Mochis, Sinaloa',
      cryptographicHash: `${randomHash.substring(0, 8)}...${randomHash.substring(randomHash.length - 4)}`,
      aaguid: '00000000-0000-0000-0000-000000000000',
      algorithm: 'ES256 (FIDO2 L3)',
    });

    toast.success('Nueva Autenticación Registrada', `Validada mediante ${chosenMethod} con estado Exitoso.`);
  };

  const copyHashToClipboard = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(id);
    toast.info('Hash Copiado', 'Firma criptográfica copiada al portapapeles.');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getMethodIcon = (method: ReyIDAuthEvent['method']) => {
    switch (method) {
      case 'Biométrico Facial (Face ID)':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'Touch ID / Huella':
        return <Fingerprint className="w-4 h-4 text-cyan-400" />;
      case 'YubiKey Hardware FIDO2':
        return <Key className="w-4 h-4 text-amber-400" />;
      case 'WebAuthn / Passkey':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <Lock className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className={`bg-[#111112] border border-white/10 rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {/* Component Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#111112] via-[#141418] to-[#111112]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Recent Activity
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                Top 5 ReyID Exitosos
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Auditoría en tiempo real de los últimos 5 accesos verificados por token y biometría
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSimulateNewSuccessAuth}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Simular nueva autenticación exitosa ReyID"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Simular Acceso</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer active:scale-95"
            title="Sincronizar eventos con la Cúpula"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="divide-y divide-white/5">
        {events.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            No se han registrado eventos de autenticación recientes.
          </div>
        ) : (
          events.slice(0, 5).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
              className={`p-3.5 sm:p-4 hover:bg-white/[0.03] transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                selectedEvent?.id === event.id ? 'bg-cyan-500/5 border-l-2 border-l-cyan-400' : ''
              }`}
            >
              {/* Left Column: Icon + Method + Device + User */}
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  {getMethodIcon(event.method)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {event.method}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {event.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5 truncate">
                    <span className="text-gray-300 truncate">{event.device}</span>
                    <span>•</span>
                    <span className="font-mono text-cyan-400/80">{event.did}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Timestamps & Audit Status */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pl-11 sm:pl-0">
                <div className="text-left sm:text-right">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-200 justify-start sm:justify-end">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{event.formattedTime}</span>
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                    {event.formattedDate} • {event.location}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyHashToClipboard(event.cryptographicHash, event.id);
                    }}
                    className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-gray-300 hover:text-cyan-300 flex items-center gap-1 transition-all"
                    title="Copiar firma SHA-256"
                  >
                    <Hash className="w-3 h-3 text-gray-400" />
                    <span>{copiedHash === event.id ? '¡Copiado!' : event.cryptographicHash}</span>
                  </button>
                  <ChevronRight className={`w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-transform ${
                    selectedEvent?.id === event.id ? 'rotate-90 text-cyan-400' : ''
                  }`} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Detail Inspector Drawer (When clicked) */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black/50 border-t border-cyan-500/20 p-4 sm:p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                  Auditoría Criptográfica ReyID #{selectedEvent.id}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                ENCLAVE SEGURO VALIDADO
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px] font-mono">
              <div className="bg-[#111112] p-2.5 rounded-xl border border-white/5">
                <span className="text-gray-500 block text-[10px]">USUARIO & IDENTIDAD:</span>
                <span className="text-white font-bold truncate block">{selectedEvent.user}</span>
                <span className="text-cyan-400 text-[10px]">{selectedEvent.did}</span>
              </div>

              <div className="bg-[#111112] p-2.5 rounded-xl border border-white/5">
                <span className="text-gray-500 block text-[10px]">DISPOSITIVO & ATTESTATION:</span>
                <span className="text-gray-200 block truncate">{selectedEvent.device}</span>
                <span className="text-emerald-400 text-[10px]">{selectedEvent.algorithm || 'ES256 ECDSA'}</span>
              </div>

              <div className="bg-[#111112] p-2.5 rounded-xl border border-white/5">
                <span className="text-gray-500 block text-[10px]">RED & GEOLOCALIZACIÓN:</span>
                <span className="text-gray-200 block font-bold">{selectedEvent.ipAddress}</span>
                <span className="text-gray-400 text-[10px]">{selectedEvent.location}</span>
              </div>

              <div className="bg-[#111112] p-2.5 rounded-xl border border-white/5">
                <span className="text-gray-500 block text-[10px]">TIMESTAMP ISO-8601:</span>
                <span className="text-gray-200 block truncate">{selectedEvent.timestamp}</span>
                <span className="text-emerald-400 text-[10px]">Nivel FIDO2 L3</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
              <span className="text-gray-400 font-mono">
                Hash de Transacción: <strong className="text-cyan-300">{selectedEvent.cryptographicHash}</strong>
              </span>
              {onNavigateToReyID && (
                <button
                  onClick={onNavigateToReyID}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Abrir Panel ReyID</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Component Footer */}
      <div className="p-3 bg-[#0c0c0e] border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Cúpula Guardián ReyID: 5 de 5 accesos verificados y protegidos con WebAuthn</span>
        </div>
        {onNavigateToReyID && (
          <button
            onClick={onNavigateToReyID}
            className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer flex items-center gap-1 self-end sm:self-auto"
          >
            <span>Ver historial completo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
