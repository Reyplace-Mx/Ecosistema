import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Lock, Fingerprint, Key, AlertOctagon, CheckCircle2, RefreshCw } from 'lucide-react';
import { useSecurityStore } from '../store/useSecurityStore';
import { useToast } from '../context/ToastContext';

export function AntiTheftLockModal() {
  const { antiTheftLocked, antiTheftReason, unlockAntiTheft } = useSecurityStore();
  const [pin, setPin] = useState('');
  const [isVerifyingBio, setIsVerifyingBio] = useState(false);
  const [bioSuccess, setBioSuccess] = useState(false);
  const toast = useToast();

  if (!antiTheftLocked) return null;

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockAntiTheft(pin)) {
      toast.success('Desbloqueo Exitoso', 'La Cúpula de Seguridad ha reanudado el acceso al ecosistema.');
      setPin('');
    } else {
      toast.error('PIN Inválido', 'Introduce tu clave de seguridad o usa verificación biométrica.');
    }
  };

  const handleBiometricUnlock = () => {
    setIsVerifyingBio(true);
    setTimeout(() => {
      setIsVerifyingBio(false);
      setBioSuccess(true);
      setTimeout(() => {
        unlockAntiTheft('REYID-PASSKEY-OK');
        toast.success('Biometría ReyID Aceptada', 'Identidad confirmada. Saldo y módulos desbloqueados.');
        setBioSuccess(false);
      }, 700);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-slate-900 border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(244,63,94,0.3)] text-white relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0 animate-pulse">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/30 text-rose-300 border border-rose-500/40">
                Bloqueo Anti-Robo Activo
              </span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-white">Cúpula de Seguridad: Modo Blindaje</h2>
          </div>
        </div>

        <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4 mb-6 text-sm text-rose-200">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-100">Motivo del Bloqueo:</p>
              <p className="text-xs text-rose-300/90 mt-0.5">{antiTheftReason || 'Alerta de intrusión o activación preventiva de pánico.'}</p>
              <p className="text-[11px] text-rose-400/80 mt-2 font-mono">
                🔒 Wallets congeladas | Sesiones remotas revocadas | Claves privadas cifradas en HSM
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleBiometricUnlock}
            disabled={isVerifyingBio}
            className={`w-full py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all cursor-pointer ${
              bioSuccess
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg shadow-rose-900/40'
            }`}
          >
            {isVerifyingBio ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Escaneando Liveness 3D / WebAuthn...</span>
              </>
            ) : bioSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>¡Identidad Verificada! Desbloqueando...</span>
              </>
            ) : (
              <>
                <Fingerprint className="w-5 h-5" />
                <span>Desbloquear con Biometría ReyID (Liveness / Passkey)</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-slate-800 flex-1" />
            <span className="text-xs text-slate-500 uppercase font-mono tracking-widest">o mediante PIN de Emergencia</span>
            <div className="h-px bg-slate-800 flex-1" />
          </div>

          <form onSubmit={handleUnlockPin} className="space-y-3">
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ingresa PIN de seguridad (ej. 1234)"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-700"
            >
              Verificar PIN Criptográfico
            </button>
          </form>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Protocolo Cúpula Zero-Trust v4.8</span>
          <span className="font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Vigilancia SOC Activa
          </span>
        </div>
      </motion.div>
    </div>
  );
}
