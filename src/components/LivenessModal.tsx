import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ScanFace, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface LivenessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LivenessModal({ isOpen, onClose, onSuccess }: LivenessModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setStatus('idle');
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      toast.error("Error de Cámara", "No se pudo acceder a la cámara para la prueba de vida.");
      setStatus('error');
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
    
    // Simulate Gemini Vision / Liveness check process
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setStatus('success');
    toast.success("Verificación Exitosa", "Prueba de vida superada con éxito.");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="glass-panel-dark rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden space-y-5"
          >
            {/* Liquid morph background blobs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/10 blur-2xl animate-liquid-morph pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 blur-2xl animate-liquid-morph-slow pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 neu-inset-dark">
                  <ScanFace className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    Prueba de Vida (Liveness)
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">Verificación biométrica 3D en tiempo real</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-white/10 neu-inset-dark relative z-10">
              {status === 'error' ? (
                <div className="text-center p-4">
                  <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                  <p className="text-xs text-rose-400 font-mono">Cámara no disponible</p>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${status === 'scanning' ? 'opacity-50 blur-sm' : ''}`}
                  />
                  {status === 'scanning' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="space-y-3 flex flex-col items-center">
                        <motion.div
                          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-16 h-16 rounded-full border-4 border-dashed border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                        >
                          <ScanFace className="w-8 h-8 text-cyan-300" />
                        </motion.div>
                        <p className="text-xs font-mono font-bold text-cyan-300 animate-pulse bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-500/30">
                          Analizando biometría 3D...
                        </p>
                      </div>
                    </div>
                  )}
                  {status === 'success' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-950/60 backdrop-blur-md">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-[0_0_25px_rgba(16,185,129,0.8)]"
                      >
                        <CheckCircle className="w-8 h-8" />
                      </motion.div>
                    </div>
                  )}
                  
                  {/* Viewfinder overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full border-[1px] border-white/10 flex flex-col justify-between p-4">
                      <div className="flex justify-between">
                        <div className="w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                        <div className="w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                      </div>
                      <div className="flex justify-between">
                        <div className="w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                        <div className="w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 relative z-10">
              <p className="text-[11px] text-gray-400 font-mono text-center sm:text-left">
                Mantenga su rostro dentro del marco con buena iluminación.
              </p>
              <button
                onClick={handleScan}
                disabled={status !== 'idle' || !stream}
                className="neu-button-cyan text-black px-6 py-2.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {status === 'scanning' ? (
                  <span>Analizando...</span>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Iniciar Escaneo</span>
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
