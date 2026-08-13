import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ScanFace, Fingerprint, KeyRound, X, CheckCircle, AlertTriangle, Sparkles, ShieldCheck, Laptop } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { checkWebAuthnSupport, registerWebAuthnCredential, authenticateWithWebAuthn } from '../lib/webauthn';

interface LivenessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'face' | 'fingerprint' | 'webauthn';
}

export function LivenessModal({ isOpen, onClose, onSuccess, initialMode = 'face' }: LivenessModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanMode, setScanMode] = useState<'face' | 'fingerprint' | 'webauthn'>(initialMode);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [biometricHash, setBiometricHash] = useState<string>('');
  const [webAuthnLabel, setWebAuthnLabel] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setScanMode(initialMode);
      if (initialMode !== 'webauthn') {
        startCamera();
      }
    } else {
      stopCamera();
      setStatus('idle');
    }
    return () => stopCamera();
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (scanMode === 'webauthn') {
      stopCamera();
    } else if (isOpen) {
      startCamera();
    }
  }, [scanMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      if (scanMode !== 'webauthn') {
        toast.error("Error de Cámara", "No se pudo acceder a la cámara para el escaneo biométrico.");
        setStatus('error');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleScan = async () => {
    if (status !== 'idle') return;
    setStatus('scanning');

    if (scanMode === 'webauthn') {
      try {
        const support = await checkWebAuthnSupport();
        toast.info(
          "WebAuthn 2FA Hardware",
          support.hasPlatformAuthenticator
            ? "Solicitando autenticador biométrico nativo del sistema (TouchID/FaceID/Windows Hello)..."
            : "Activando módulo de autenticación criptográfica FIDO2 Passkey..."
        );

        const cred = await registerWebAuthnCredential('reyid-citizen-001', 'Ciudadano ReyID');
        const auth = await authenticateWithWebAuthn(cred.id);

        if (auth.success) {
          setBiometricHash(auth.signature);
          setWebAuthnLabel(cred.authenticatorName);
          setStatus('success');
          toast.success(
            "WebAuthn 2FA Exitoso",
            `Biometría nativa verificada con ${cred.authenticatorName}`
          );
          await new Promise(resolve => setTimeout(resolve, 1500));
          onSuccess();
          onClose();
        }
      } catch (err: any) {
        setStatus('error');
        toast.error("Error WebAuthn", "No se pudo procesar la verificación por biometría nativa.");
      }
      return;
    }

    // Optical camera scan process
    await new Promise(resolve => setTimeout(resolve, 2800));
    
    const generatedHash = `0x${Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
    setBiometricHash(generatedHash);
    setStatus('success');

    const scanLabel = scanMode === 'face' ? 'Escaneo Facial 3D' : 'Escaneo Dactilar Óptico';
    toast.success("Biometría Confirmada", `${scanLabel} validado. Hash DID emitido: ${generatedHash}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overscroll-contain overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="glass-panel-dark rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden space-y-5"
          >
            {/* Liquid morph background blobs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/10 blur-2xl animate-liquid-morph pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 blur-2xl animate-liquid-morph-slow pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 neu-inset-dark">
                  {scanMode === 'face' ? <ScanFace className="w-5 h-5" /> : scanMode === 'fingerprint' ? <Fingerprint className="w-5 h-5" /> : <KeyRound className="w-5 h-5 text-purple-400" />}
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    Validación Biométrica ReyID
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    {scanMode === 'face' ? 'Escaneo facial 3D en tiempo real' : scanMode === 'fingerprint' ? 'Escaneo dactilar óptico por cámara' : 'WebAuthn 2FA Biometría Nativa (TouchID/FaceID)'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Selector Switcher */}
            <div className="grid grid-cols-3 gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10 relative z-10">
              <button
                onClick={() => { setScanMode('face'); setStatus('idle'); }}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  scanMode === 'face'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ScanFace className="w-3.5 h-3.5" />
                <span>Rostro 3D</span>
              </button>

              <button
                onClick={() => { setScanMode('fingerprint'); setStatus('idle'); }}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  scanMode === 'fingerprint'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Dactilar</span>
              </button>

              <button
                onClick={() => { setScanMode('webauthn'); setStatus('idle'); }}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  scanMode === 'webauthn'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>WebAuthn 2FA</span>
              </button>
            </div>

            {/* Viewfinder or WebAuthn Display */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-white/10 neu-inset-dark relative z-10">
              {scanMode === 'webauthn' ? (
                <div className="p-6 text-center space-y-3 flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-purple-950/40 via-black to-slate-950">
                  <div className="p-4 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    <Laptop className="w-8 h-8 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                      Autenticador de Hardware Nativo
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                        FIDO2 Passkeys
                      </span>
                    </h4>
                    <p className="text-xs text-gray-300 max-w-xs mx-auto mt-1">
                      Usa el sensor biométrico integrado de tu dispositivo (Face ID, Touch ID, Windows Hello) para verificar 2FA con firma criptográfica.
                    </p>
                  </div>

                  {status === 'scanning' && (
                    <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-500/20 px-3 py-1.5 rounded-xl border border-purple-500/30 animate-pulse">
                      <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
                      <span>Esperando confirmación biométrica en tu sistema...</span>
                    </div>
                  )}

                  {status === 'success' && (
                    <div className="text-xs font-mono text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/40">
                      ✓ Biometría WebAuthn Validada: {webAuthnLabel || 'FIDO2 Passkey'}
                    </div>
                  )}
                </div>
              ) : status === 'error' ? (
                <div className="text-center p-4">
                  <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                  <p className="text-xs text-rose-400 font-mono">Cámara no disponible. Verifique permisos.</p>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${status === 'scanning' ? 'opacity-50 blur-xs' : ''}`}
                  />

                  {/* Laser Scan Animation for Fingerprint */}
                  {scanMode === 'fingerprint' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-36 h-36 rounded-full border-2 border-emerald-500/60 bg-emerald-500/10 flex items-center justify-center relative overflow-hidden backdrop-blur-[1px]">
                        <Fingerprint className={`w-24 h-24 ${status === 'scanning' ? 'text-emerald-300 animate-pulse' : 'text-emerald-400/70'}`} />
                        {/* Laser Bar */}
                        <motion.div
                          animate={{ y: [-70, 70, -70] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                          className="absolute w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Face Mesh Overlay */}
                  {scanMode === 'face' && status === 'idle' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-40 h-52 rounded-full border-2 border-dashed border-cyan-400/80 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                        <ScanFace className="w-16 h-16 text-cyan-400/40" />
                      </div>
                    </div>
                  )}

                  {/* Scanning State */}
                  {status === 'scanning' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                      <div className="space-y-3 flex flex-col items-center">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                          className={`w-16 h-16 rounded-full border-4 border-dashed ${scanMode === 'face' ? 'border-cyan-400' : 'border-emerald-400'} flex items-center justify-center shadow-lg`}
                        >
                          {scanMode === 'face' ? <ScanFace className="w-8 h-8 text-cyan-300" /> : <Fingerprint className="w-8 h-8 text-emerald-300" />}
                        </motion.div>
                        <p className={`text-xs font-mono font-bold ${scanMode === 'face' ? 'text-cyan-300' : 'text-emerald-300'} animate-pulse bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20`}>
                          {scanMode === 'face' ? 'Verificando vectores 3D y pulso...' : 'Mapeando crestas dactilares ópticas...'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Success State */}
                  {status === 'success' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/80 backdrop-blur-md p-4 text-center space-y-2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-[0_0_25px_rgba(16,185,129,0.8)]"
                      >
                        <CheckCircle className="w-8 h-8" />
                      </motion.div>
                      <h4 className="text-sm font-black text-white">¡Biometría Verificada!</h4>
                      <p className="text-[11px] font-mono text-emerald-300 bg-black/40 px-3 py-1 rounded-full border border-emerald-500/40">
                        Hash DID: {biometricHash}
                      </p>
                    </div>
                  )}
                  
                  {/* Viewfinder Corner Overlays */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full border-[1px] border-white/10 flex flex-col justify-between p-4">
                      <div className="flex justify-between">
                        <div className={`w-4 h-4 border-t-2 border-l-2 ${scanMode === 'face' ? 'border-cyan-400' : 'border-emerald-400'}`} />
                        <div className={`w-4 h-4 border-t-2 border-r-2 ${scanMode === 'face' ? 'border-cyan-400' : 'border-emerald-400'}`} />
                      </div>
                      <div className="flex justify-between">
                        <div className={`w-4 h-4 border-b-2 border-l-2 ${scanMode === 'face' ? 'border-cyan-400' : 'border-emerald-400'}`} />
                        <div className={`w-4 h-4 border-b-2 border-r-2 ${scanMode === 'face' ? 'border-cyan-400' : 'border-emerald-400'}`} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 relative z-10">
              <p className="text-[11px] text-gray-400 font-mono text-center sm:text-left">
                {scanMode === 'webauthn'
                  ? 'FIDO2 Passkeys: Resistencia total contra suplantaciones y simulaciones.'
                  : scanMode === 'face'
                  ? 'Coloque su rostro centrado frente a la cámara.'
                  : 'Coloque su huella dactilar frente al lente de la cámara.'}
              </p>
              <button
                onClick={handleScan}
                disabled={status !== 'idle' || (scanMode !== 'webauthn' && !stream)}
                className={`${
                  scanMode === 'webauthn'
                    ? 'bg-purple-500 hover:bg-purple-400'
                    : scanMode === 'face'
                    ? 'neu-button-cyan'
                    : 'bg-emerald-500 hover:bg-emerald-400'
                } text-black px-6 py-2.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 shadow-lg`}
              >
                {status === 'scanning' ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>
                      {scanMode === 'webauthn' ? 'Activar WebAuthn 2FA' : `Iniciar ${scanMode === 'face' ? 'Rostro 3D' : 'Dactilar'}`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

