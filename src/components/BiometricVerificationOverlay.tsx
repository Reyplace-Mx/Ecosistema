import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  Fingerprint, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Zap, 
  X, 
  CheckCircle2, 
  Cpu, 
  KeyRound, 
  Activity, 
  Sparkles,
  RefreshCw,
  Sliders,
  Radio,
  FileKey,
  Clock,
  Timer,
  Check,
  ShieldQuestion,
  History
} from 'lucide-react';
import { useBiometricStore, BiometricScanType } from '../store/useBiometricStore';
import { WebGLBiometricCanvas } from './WebGLBiometricCanvas';
import { biometricAudio } from '../utils/biometricAudio';

export function BiometricVerificationOverlay() {
  const {
    isOpen,
    type,
    title,
    subtitle,
    actionBadge,
    securityLevel,
    status,
    progress,
    confidenceScore,
    zkpHash,
    errorMessage,
    rememberSession,
    sessionCacheDuration,
    cachedAuthExpiresAt,
    isSessionAuthenticated,
    getRemainingSessionSeconds,
    setRememberSession,
    setSessionCacheDuration,
    clearSessionCache,
    extendSessionCache,
    setType,
    startScan,
    completeVerification,
    failVerification,
    cancelVerification
  } = useBiometricStore();

  const [scanProgress, setScanProgress] = useState(0);
  const [remainingSecs, setRemainingSecs] = useState(0);
  const [liveTelemetry, setLiveTelemetry] = useState({
    irisDilatacion: '3.42 mm',
    vascularMatches: 128,
    entropy: '0.9984',
    fps: 60,
    focalDepth: '14.2 cm'
  });

  const intervalRef = useRef<any>(null);

  // Timer countdown for active cache
  useEffect(() => {
    const updateCountdown = () => {
      setRemainingSecs(getRemainingSessionSeconds());
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [cachedAuthExpiresAt, getRemainingSessionSeconds]);

  // Sound effects and progress runner
  useEffect(() => {
    if (status === 'scanning') {
      biometricAudio.playLaserSweep(2400);
      setScanProgress(0);

      let current = 0;
      intervalRef.current = setInterval(() => {
        current += 4;
        if (current > 100) current = 100;
        setScanProgress(current);

        // Periodic minutiae audio tick
        if (current % 24 === 0) {
          biometricAudio.playMinutiaeLock();
          setLiveTelemetry(prev => ({
            ...prev,
            vascularMatches: Math.min(142, prev.vascularMatches + 3),
            entropy: (0.9980 + Math.random() * 0.0018).toFixed(4)
          }));
        }

        if (current >= 100) {
          clearInterval(intervalRef.current);
          useBiometricStore.setState({ status: 'verifying' });
          
          setTimeout(() => {
            biometricAudio.playSuccessChime();
            completeVerification();
          }, 800);
        }
      }, 70);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, completeVerification]);

  if (!isOpen) return null;

  const isScanning = status === 'scanning' || status === 'verifying';
  const isSuccess = status === 'success';
  const isCurrentlyCached = isSessionAuthenticated(securityLevel);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const durationOptions = [
    { minutes: 5, label: '5 min', desc: 'Rápido' },
    { minutes: 15, label: '15 min', desc: 'Recomendado' },
    { minutes: 30, label: '30 min', desc: 'Extendido' },
    { minutes: 60, label: '1 hora', desc: 'Sesión Larga' },
  ];

  return (
    <AnimatePresence>
      <div 
        id="biometric-verification-overlay"
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      >
        {/* Backdrop Glassmorphism */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!isScanning) cancelVerification();
          }}
          className="fixed inset-0 bg-slate-950/80 dark:bg-black/85 backdrop-blur-2xl transition-all"
        />

        {/* Ambient Hologram Halos */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <div className={`w-[600px] h-[600px] rounded-full blur-3xl opacity-30 transition-all duration-700 ${
            isSuccess 
              ? 'bg-emerald-500/40 scale-110' 
              : type === 'retina' 
                ? 'bg-cyan-500/30' 
                : 'bg-indigo-500/30'
          }`} />
        </div>

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-slate-900/95 dark:bg-[#070d18]/95 border border-cyan-500/30 dark:border-cyan-500/20 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-slate-100 overflow-hidden z-10 my-auto max-h-[95vh] flex flex-col"
        >
          {/* Top HUD Laser Line Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800 shrink-0">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  {actionBadge}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40">
                  FIDO2 WebAuthn L3 + ZKP
                </span>
                {isCurrentlyCached && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/40 flex items-center gap-1 animate-pulse">
                    <Timer className="w-3 h-3" />
                    Caché Activa: {formatTime(remainingSecs)}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {title}
              </h2>
              <p className="text-xs text-slate-400 line-clamp-2 sm:line-clamp-none">
                {subtitle}
              </p>
            </div>

            {!isScanning && (
              <button
                onClick={cancelVerification}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Scrollable Content Area */}
          <div className="overflow-y-auto flex-1 pr-1 space-y-4 py-3">
            {/* Biometric Type Selector Tabs */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setType('retina')}
                disabled={isScanning}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                  type === 'retina'
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">Escáner de Retina 3D</span>
              </button>

              <button
                onClick={() => setType('fingerprint')}
                disabled={isScanning}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                  type === 'fingerprint'
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Fingerprint className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">Huella Dactilar</span>
              </button>
            </div>

            {/* WebGL 3D Interactive Scanner Display */}
            <div className="relative w-full h-48 sm:h-60 rounded-2xl bg-black/60 border border-slate-800 p-2 overflow-hidden flex items-center justify-center group shadow-inner shrink-0">
              
              {/* Corner HUD Ticks */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400/80 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none" />

              {/* Live WebGL Canvas */}
              <WebGLBiometricCanvas
                type={type}
                status={status}
                progress={scanProgress}
                className="w-full h-full"
              />

              {/* Scanline Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

              {/* HUD Status Badge in Top Center */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md flex items-center gap-2 text-[10px] font-mono font-bold text-cyan-300 max-w-[90%] truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 ${isScanning ? 'bg-cyan-400 animate-ping' : isSuccess ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                <span className="truncate">
                  {status === 'idle' && 'SENSOR LISTO - ESPERANDO INICIO'}
                  {status === 'scanning' && `ESCANEANDO PATRÓN ${type === 'retina' ? 'RETINIANO' : 'DERMATOGLÍFICO'}...`}
                  {status === 'verifying' && 'GENERANDO PRUEBA ZERO-KNOWLEDGE (ZKP)...'}
                  {status === 'success' && 'AUTORIZACIÓN BIOMÉTRICA CONCEDIDA'}
                  {status === 'failed' && 'FALLO EN LA VERIFICACIÓN'}
                </span>
              </div>

              {/* Real-time Telemetry Floating HUD */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pointer-events-none bg-slate-950/70 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border border-slate-800/80">
                <div className="flex items-center gap-3">
                  <span>PUNTOS: <strong className="text-cyan-300">{liveTelemetry.vascularMatches}/142</strong></span>
                  <span className="hidden sm:inline">ENTROPÍA: <strong className="text-cyan-300">{liveTelemetry.entropy}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>ZKP: <strong className="text-emerald-400">{zkpHash.slice(0, 10)}...</strong></span>
                  <span className="text-cyan-400 font-bold">[{scanProgress}%]</span>
                </div>
              </div>

              {/* Success Overlay Checkmark */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-emerald-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-2 text-white z-20"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight">Verificación Exitosa</h3>
                  <p className="text-xs font-mono text-emerald-300">Firma Criptográfica: {confidenceScore}% de Precisión</p>
                  {rememberSession && (
                    <span className="text-[10px] font-mono text-emerald-200 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/40">
                      ⚡ Caché de sesión activada por {sessionCacheDuration} min
                    </span>
                  )}
                </motion.div>
              )}
            </div>

            {/* Progress Bar & Telemetry Status Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  {isScanning ? 'Procesando tensores neuronales...' : 'Enclave Criptográfico HSM Listo'}
                </span>
                <span className="text-cyan-400 font-bold">
                  {isSuccess ? '100% Verificado' : `${scanProgress}%`}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                <motion.div
                  className={`h-full rounded-full transition-all duration-100 ${
                    isSuccess 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                      : 'bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500'
                  }`}
                  style={{ width: `${isSuccess ? 100 : scanProgress}%` }}
                />
              </div>
            </div>

            {/* TEMPORARY SESSION CACHE FLAG CONFIGURATION PANEL */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/90 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <label 
                      htmlFor="remember-session-toggle" 
                      className="text-xs font-bold text-white cursor-pointer select-none"
                    >
                      Caché de Autorización de Sesión (TTL)
                    </label>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Zero Re-Prompt
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Mantén autorizados los módulos de alta seguridad (Cúpula Digital, Bóveda ZK, Firmas y Killswitch) durante esta sesión sin volver a solicitar verificación biométrica.
                  </p>
                </div>

                {/* Switch Toggle */}
                <button
                  id="remember-session-toggle"
                  type="button"
                  role="switch"
                  aria-checked={rememberSession}
                  disabled={isScanning}
                  onClick={() => setRememberSession(!rememberSession)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 p-0.5 ${
                    rememberSession ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white shadow-md"
                    animate={{ x: rememberSession ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Cache Duration Selectors */}
              {rememberSession && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>DURACIÓN DEL TOKEN TEMPORAL:</span>
                    <span className="text-cyan-400 font-bold">{sessionCacheDuration} minutos</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {durationOptions.map((opt) => (
                      <button
                        key={opt.minutes}
                        type="button"
                        disabled={isScanning}
                        onClick={() => setSessionCacheDuration(opt.minutes)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition-all text-center border cursor-pointer flex flex-col items-center justify-center ${
                          sessionCacheDuration === opt.minutes
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm ring-1 ring-cyan-500/40'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <span className="text-[9px] text-slate-500 font-normal">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Session Status & Revoke Actions */}
              {isCurrentlyCached && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-[11px] font-mono">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Caché activa: <strong>{formatTime(remainingSecs)}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => extendSessionCache(15)}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors text-[10px] font-bold cursor-pointer"
                    >
                      +15 min
                    </button>
                    <button
                      type="button"
                      onClick={clearSessionCache}
                      className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors text-[10px] font-bold cursor-pointer"
                    >
                      Revocar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 shrink-0">
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Protegido por la Cúpula 24/7 y Enclave FIDO2</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isScanning && !isSuccess && (
                <button
                  onClick={cancelVerification}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors border border-slate-700 cursor-pointer"
                >
                  Cancelar Operación
                </button>
              )}

              {status === 'idle' && (
                <button
                  onClick={startScan}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Iniciar Escaneo {type === 'retina' ? 'Ocular' : 'Dactilar'}</span>
                </button>
              )}

              {isScanning && (
                <button
                  disabled
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-cyan-400 border border-cyan-500/40 flex items-center justify-center gap-2 cursor-wait"
                >
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Escaneando... Mantenga la Posición</span>
                </button>
              )}

              {isSuccess && (
                <button
                  onClick={cancelVerification}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/30"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Continuar</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

