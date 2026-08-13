import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Copy, ExternalLink, LogOut, Coins, Fingerprint, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface UserProfilePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (module: string) => void;
  onLogout?: () => void;
}

export function UserProfilePopover({ isOpen, onClose, onNavigate, onLogout }: UserProfilePopoverProps) {
  const { toast } = useToast();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const copyDid = () => {
    navigator.clipboard.writeText('did:rey:0x4E92817A128B237C902918237190823718029318');
    toast.success('DID Copiado', 'Tu identificador ReyID ha sido copiado.');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={popoverRef}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        className="absolute top-14 right-4 z-50 w-80 bg-[#111112] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden text-white"
      >
        {/* Header Profile Info */}
        <div className="p-4 bg-gradient-to-br from-cyan-950/40 via-black to-slate-900 border-b border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20 border border-cyan-400/40">
              AV
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">Alex Vanguard</h4>
              <p className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" /> Ciudadano Verificado
              </p>
            </div>
          </div>

          {/* DID Pill */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-2 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 min-w-0">
              <Fingerprint className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-[11px] text-gray-400 truncate">did:rey:0x4E92...8A9</span>
            </div>
            <button
              onClick={copyDid}
              className="p-1 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-md transition-colors cursor-pointer shrink-0"
              title="Copiar DID"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Balance Preview */}
        <div className="p-4 bg-black/30 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Wallet Reycoin</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">250.00 RYC</div>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              onNavigate?.('Pagos & Reycoin');
            }}
            className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono cursor-pointer"
          >
            Wallet <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Quick Links */}
        <div className="p-2 space-y-1 text-xs font-medium">
          <button
            onClick={() => {
              onClose();
              onNavigate?.('ReyID & Usuarios');
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Mi Identidad ReyID</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigate?.('Perfil Pro (Público)');
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Fingerprint className="w-4 h-4 text-blue-400" />
              <span>Perfil Pro Público</span>
            </div>
          </button>
        </div>

        {/* Footer Logout */}
        <div className="p-2 border-t border-white/10 bg-black/40">
          <button
            onClick={() => {
              onClose();
              if (onLogout) onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
