import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Fingerprint, ScanFace, Mail, Smartphone, Lock, CheckCircle2, Sparkles } from 'lucide-react';

interface BiometricPanelProps {
  livenessCompleted: boolean;
  onOpenLiveness: () => void;
  lastValidationDate?: string;
}

export function BiometricPanel({ livenessCompleted, onOpenLiveness, lastValidationDate = '24 Ene 2026' }: BiometricPanelProps) {
  const steps = [
    { name: 'Email KYC', icon: Mail, status: 'completed' },
    { name: 'Teléfono', icon: Smartphone, status: 'completed' },
    { name: 'Prueba de Vida', icon: ScanFace, status: livenessCompleted ? 'completed' : 'pending' },
    { name: 'Documento ID', icon: Fingerprint, status: 'locked' }
  ];

  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progress = (completedCount / steps.length) * 100;
  const currentLevel = completedCount >= 3 ? 3 : 2; // UI mapping
  
  const circumference = 2 * Math.PI * 40; // r=40
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="glass-panel-dark rounded-3xl p-6 sm:p-7 relative overflow-hidden transition-all duration-300">
      {/* Liquid morphing background blobs */}
      <div className="absolute -top-12 -right-12 w-56 h-56 bg-cyan-500/15 blur-2xl animate-liquid-morph pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-600/10 blur-3xl animate-liquid-morph-slow pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
        
        {/* Progress Circle Section with Neumorphic Ring */}
        <div className="flex flex-col items-center justify-center space-y-4 min-w-[150px]">
          <div className="relative flex items-center justify-center w-36 h-36 rounded-full neu-inset-dark p-3">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="liquidCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="liquidEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
                fill="transparent"
                className="text-white/10"
              />
              {/* Progress Circle with Liquid Gradient */}
              <motion.circle
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="50"
                cy="50"
                r="40"
                stroke={livenessCompleted ? "url(#liquidEmeraldGrad)" : "url(#liquidCyanGrad)"}
                strokeWidth="7"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
              />
            </svg>
            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center">
              <ShieldCheck className={`w-9 h-9 mb-1 ${livenessCompleted ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`} />
              <span className="text-2xl font-black text-white font-mono tracking-tight">{Math.round(progress)}%</span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono">Nivel de Seguridad</div>
            <div className={`text-sm font-extrabold flex items-center justify-center gap-1.5 ${livenessCompleted ? 'text-emerald-400' : 'text-cyan-400'}`}>
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              Nivel {currentLevel} • {livenessCompleted ? 'Avanzado' : 'Intermedio'}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 w-full space-y-5">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                Estado Biométrico
                <span className="rainbow-shimmer-stamp text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                  <span className="shimmer-text">VERIFIED ID</span>
                </span>
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-1">
                Última validación: <span className="text-gray-200 font-semibold">{livenessCompleted ? new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : lastValidationDate}</span>
              </p>
            </div>

            {!livenessCompleted && (
              <button 
                onClick={onOpenLiveness}
                className="neu-button-cyan text-black px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <ScanFace className="w-4 h-4" />
                <span>Validar Liveness</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-3.5 p-3.5 rounded-2xl border backdrop-blur-md transition-all duration-200 ${
                  step.status === 'completed' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 shadow-lg shadow-emerald-950/20' 
                    : step.status === 'pending'
                      ? 'bg-cyan-500/10 border-cyan-500/30 shadow-lg shadow-cyan-950/20 animate-pulse-glow'
                      : 'bg-white/5 border-white/5 opacity-45'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${
                  step.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 
                  step.status === 'pending' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 
                  'bg-white/10 text-gray-400'
                }`}>
                  <step.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{step.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    {step.status === 'completed' ? 'Verificado' : step.status === 'pending' ? 'Requerido' : 'Pendiente'}
                  </div>
                </div>
                <div className="shrink-0">
                  {step.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {step.status === 'locked' && <Lock className="w-4 h-4 text-gray-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}

