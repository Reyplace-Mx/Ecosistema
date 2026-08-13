import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ScanFace,
  Fingerprint,
  ShieldCheck,
  Lock,
  KeyRound,
  Check,
  Sparkles,
  Save,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Smartphone,
  Eye,
  BellRing
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export interface BiometricMethodOption {
  id: 'faceid' | 'fingerprint' | 'liveness' | 'passkey';
  title: string;
  subtitle: string;
  icon: React.ElementType;
  recommendedFor: string;
  status: 'active' | 'available' | 'not_configured';
  supportedHardware: boolean;
}

export function BiometricConfigSection() {
  const { toast } = useToast();

  // Biometric preferences state
  const [primaryMethod, setPrimaryMethod] = useState<'faceid' | 'fingerprint' | 'liveness' | 'passkey'>('faceid');
  const [secondaryFallback, setSecondaryFallback] = useState<'fingerprint' | 'passkey' | 'none'>('fingerprint');

  // Toggle settings
  const [requireForSigning, setRequireForSigning] = useState(true);
  const [strictLivenessThreshold, setStrictLivenessThreshold] = useState(true);
  const [autoBiometricLogin, setAutoBiometricLogin] = useState(true);
  const [autoLockTimeout, setAutoLockTimeout] = useState<'3min' | '5min' | '15min' | 'never'>('5min');
  const [notifyUnrecognizedLogin, setNotifyUnrecognizedLogin] = useState(true);

  // Testing modal / state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | null>(null);

  const BIOMETRIC_METHODS: BiometricMethodOption[] = [
    {
      id: 'faceid',
      title: 'FaceID / Reconocimiento Facial 3D',
      subtitle: 'Autenticación ultra rápida mediante mapa de profundidad facial.',
      icon: ScanFace,
      recommendedFor: 'Recomendado para inicio de sesión diario',
      status: 'active',
      supportedHardware: true
    },
    {
      id: 'fingerprint',
      title: 'Huella Digital / TouchID',
      subtitle: 'Lector biométrico dactilar de alta precisión y baja latencia.',
      icon: Fingerprint,
      recommendedFor: 'Ideal para dispositivos móviles y computadoras táctiles',
      status: 'available',
      supportedHardware: true
    },
    {
      id: 'liveness',
      title: 'Prueba de Vida Facial (Liveness 3D)',
      subtitle: 'Verificación activa anti-spoofing con movimiento ocular y expresión.',
      icon: Eye,
      recommendedFor: 'Requerido para operaciones de alto valor en Cúpula Digital',
      status: 'available',
      supportedHardware: true
    },
    {
      id: 'passkey',
      title: 'Passkeys FIDO2 / Hardware Key',
      subtitle: 'Llaves criptográficas locales almacenadas en el enclave seguro (YubiKey/Apple Enclave).',
      icon: KeyRound,
      recommendedFor: 'Máxima seguridad física ante ataques de phishing',
      status: 'available',
      supportedHardware: true
    }
  ];

  const handleSaveConfig = () => {
    // Save to localStorage or state
    localStorage.setItem('reyid_biometric_primary', primaryMethod);
    localStorage.setItem('reyid_biometric_require_signing', String(requireForSigning));
    
    toast.success(
      'Configuración Biométrica Guardada',
      `Método primario establecido en: ${BIOMETRIC_METHODS.find(m => m.id === primaryMethod)?.title}`
    );
  };

  const handleTestBiometrics = () => {
    setIsTesting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTesting(false);
      setTestResult('success');
      toast.success(
        'Prueba Biométrica Exitosa',
        `El sensor ha verificado correctamente tu ${BIOMETRIC_METHODS.find(m => m.id === primaryMethod)?.title}`
      );
    }, 2200);
  };

  return (
    <div className="space-y-6">
      {/* Banner Summary */}
      <div className="glass-panel-reyplace rounded-3xl p-6 sm:p-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00d2ff]/10 blur-3xl animate-liquid-morph pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#d946ef]/10 blur-3xl animate-liquid-morph-slow pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/30 neu-inset-dark flex items-center justify-center">
              <Sliders className="w-7 h-7 text-[#00d2ff]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Preferencias de Autenticación Biométrica
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] text-[10px] font-mono font-bold border border-[#00d2ff]/30">
                  ReyID Passkey Engine
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-1 max-w-2xl">
                Selecciona tu método biométrico preferido (FaceID, Huella Digital, Passkeys) y ajusta los parámetros de seguridad para firmas criptográficas.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleTestBiometrics}
              disabled={isTesting}
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-[#00d2ff] font-mono font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#d946ef]" />
              <span>{isTesting ? 'Escaneando...' : 'Probar Método Seleccionado'}</span>
            </button>

            <button
              onClick={handleSaveConfig}
              className="brand-button-spectrum text-white px-6 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-lg shadow-fuchsia-950/40"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </div>
      </div>

      {/* Test Biometrics Result Notification */}
      <AnimatePresence>
        {testResult === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-xs font-mono"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                Verificación biométrica simulada correctamente. Tu dispositivo responde con el enclave de seguridad local.
              </span>
            </div>
            <button
              onClick={() => setTestResult(null)}
              className="text-emerald-400 font-bold hover:underline"
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 1: Select Primary Biometric Method */}
      <div className="glass-panel-dark rounded-3xl p-6 sm:p-7 space-y-5">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              1. Método Primario Preferido
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Este método será invocado por defecto al iniciar sesión y firmar documentos.
            </p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
            Hardware Compatible
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BIOMETRIC_METHODS.map(method => {
            const isSelected = primaryMethod === method.id;
            const Icon = method.icon;

            return (
              <div
                key={method.id}
                onClick={() => setPrimaryMethod(method.id)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-xl shadow-cyan-950/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-cyan-500 text-black px-3 py-1 rounded-bl-xl text-[10px] font-mono font-extrabold flex items-center gap-1">
                    <Check className="w-3 h-3" /> SELECCIONADO
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl shrink-0 ${
                    isSelected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-black/40 text-gray-400 border border-white/10'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-1 pr-12">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {method.title}
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      {method.subtitle}
                    </p>
                    <div className="text-[10px] text-cyan-400 font-mono font-semibold pt-1">
                      {method.recommendedFor}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Fallback & Security Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Secondary Method Fallback */}
        <div className="glass-panel-dark rounded-3xl p-6 sm:p-7 space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight border-b border-white/10 pb-3">
            2. Respaldos & Métodos Secundarios
          </h3>

          <div className="space-y-3">
            <label className="text-xs font-mono text-gray-300 block">
              Método de respaldo si el sensor principal falla:
            </label>
            <select
              value={secondaryFallback}
              onChange={(e) => setSecondaryFallback(e.target.value as any)}
              className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:border-cyan-500 outline-none"
            >
              <option value="fingerprint">Huella Digital (TouchID / Sensor)</option>
              <option value="passkey">Llave de Seguridad Passkey FIDO2</option>
              <option value="none">Sin respaldo secundario (Sólo PIN/Password)</option>
            </select>
            <p className="text-[11px] text-gray-400 font-mono">
              Se solicitará si el escáner facial 3D no puede verificar tu identidad tras 3 intentos.
            </p>
          </div>

          <div className="pt-3 space-y-3 border-t border-white/10">
            <label className="text-xs font-mono text-gray-300 block">
              Bloqueo Automático por Inactividad:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['3min', '5min', '15min', 'never'] as const).map(timeout => (
                <button
                  key={timeout}
                  onClick={() => setAutoLockTimeout(timeout)}
                  className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    autoLockTimeout === timeout
                      ? 'bg-cyan-500 text-black font-extrabold'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {timeout === 'never' ? 'Nunca' : timeout}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Policies Toggles */}
        <div className="glass-panel-dark rounded-3xl p-6 sm:p-7 space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight border-b border-white/10 pb-3">
            3. Políticas de Firma & Cúpula Digital
          </h3>

          <div className="space-y-4">
            {/* Toggle 1: Require biometrics for signatures */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">Exigir Biometría para Firma Cúpula</div>
                <div className="text-[10px] text-gray-400 font-mono">Solicita confirmación facial/dactilar antes de firmar cualquier contrato Web3.</div>
              </div>
              <button
                onClick={() => setRequireForSigning(!requireForSigning)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  requireForSigning ? 'bg-cyan-500' : 'bg-gray-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                  requireForSigning ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Toggle 2: Strict Liveness 3D */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">Umbral de Liveness 3D Estricto (95%+)</div>
                <div className="text-[10px] text-gray-400 font-mono">Exige prueba activa de vida con microgestos para evitar fotografías o máscaras.</div>
              </div>
              <button
                onClick={() => setStrictLivenessThreshold(!strictLivenessThreshold)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  strictLivenessThreshold ? 'bg-cyan-500' : 'bg-gray-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                  strictLivenessThreshold ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Toggle 3: Auto login */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">Inicio Biométrico Inmediato</div>
                <div className="text-[10px] text-gray-400 font-mono">Inicia sesión al abrir la plataforma sin necesidad de ingresar contraseña.</div>
              </div>
              <button
                onClick={() => setAutoBiometricLogin(!autoBiometricLogin)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  autoBiometricLogin ? 'bg-cyan-500' : 'bg-gray-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                  autoBiometricLogin ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Toggle 4: Alert unrecognized */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">Alertas por Intento no Reconocido</div>
                <div className="text-[10px] text-gray-400 font-mono">Notifica al correo si un intento biométrico falla 2 veces consecutivas.</div>
              </div>
              <button
                onClick={() => setNotifyUnrecognizedLogin(!notifyUnrecognizedLogin)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  notifyUnrecognizedLogin ? 'bg-cyan-500' : 'bg-gray-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                  notifyUnrecognizedLogin ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
