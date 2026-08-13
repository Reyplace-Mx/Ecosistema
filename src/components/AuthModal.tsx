import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ShieldCheck, Sparkles, Fingerprint, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, initialMode = 'login', onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup, loginWithGoogle, loginWithWeb3Wallet } = useAuth();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Campo requerido', 'Ingresa tu correo electrónico.');
      return;
    }
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(email, name || 'Usuario Reyplace');
        toast.success('Sesión Iniciada', 'Bienvenido de nuevo al Ecosistema Reyplace.');
      } else {
        await signup(email, name || 'Usuario Reyplace', '@' + (name.toLowerCase().replace(/\s+/g, '') || 'usuario'));
        toast.success('Registro Exitoso', 'Tu identidad ReyID ha sido aprovisionada con éxito.');
      }
      setIsLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      toast.error('Error de autenticación', err?.message || 'Inténtalo nuevamente.');
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Sesión Google', 'Autenticado mediante Google Identity.');
      setIsLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      setIsLoading(false);
    }
  };

  const handleWeb3 = async () => {
    setIsLoading(true);
    try {
      await loginWithWeb3Wallet();
      toast.success('Web3 Conectado', 'Firma criptográfica verificada en ReyID.');
      setIsLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl glass-panel-reyplace p-6 sm:p-8 shadow-2xl border border-[#00d2ff]/30"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d2ff]/15 blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d946ef]/15 blur-3xl pointer-events-none -z-10" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-mono font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> REYID SECURE ACCESS
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {mode === 'login' ? 'Iniciar Sesión en Reyplace' : 'Crear Cuenta ReyID'}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Accede a todos los módulos del Ecosistema Digital en Los Mochis
            </p>
          </div>

          {/* Social Auth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleGoogle}
              disabled={isLoading}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all hover:scale-[1.02] cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              onClick={handleWeb3}
              disabled={isLoading}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Fingerprint className="w-4 h-4 text-[#00d2ff]" />
              <span>Web3 Wallet</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#061024] px-3 text-[10px] text-gray-500 font-mono uppercase tracking-widest absolute">o usa tu correo</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">Nombre Completo</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00d2ff]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono text-gray-400 mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@reyplace.com"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00d2ff]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-gray-400 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00d2ff]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full brand-button-spectrum text-white font-extrabold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Acceder al Ecosistema' : 'Registrar Mi ReyID'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-5 text-center text-xs text-gray-400">
            {mode === 'login' ? (
              <p>
                ¿No tienes cuenta aún?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-[#00d2ff] font-bold hover:underline cursor-pointer"
                >
                  Registrarme ahora
                </button>
              </p>
            ) : (
              <p>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#00d2ff] font-bold hover:underline cursor-pointer"
                >
                  Iniciar Sesión
                </button>
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-gray-500 font-mono">
            <CheckCircle2 className="w-3 h-3 text-[#10b981]" /> CÚPULA DIGITAL CERTIFIED • LOS MOCHIS, SINALOA
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
