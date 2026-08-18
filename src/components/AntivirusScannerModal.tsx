import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, ShieldCheck, Bug, FileCode, UploadCloud, 
  Trash2, AlertTriangle, CheckCircle, RefreshCw, X, Play, Shield
} from 'lucide-react';
import { useSecurityStore } from '../store/useSecurityStore';
import { useToast } from '../context/ToastContext';

interface AntivirusScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AntivirusScannerModal({ isOpen, onClose }: AntivirusScannerModalProps) {
  const { 
    isScanning, 
    scanProgress, 
    scanResult, 
    runSystemScan, 
    scanFileContent, 
    quarantinedFiles, 
    purgeQuarantine 
  } = useSecurityStore();
  const [dragOver, setDragOver] = useState(false);
  const [analyzedFileResult, setAnalyzedFileResult] = useState<{ name: string; safe: boolean; threat?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = (ev.target?.result as string) || '';
      const result = scanFileContent(file.name, content);
      setAnalyzedFileResult({
        name: file.name,
        safe: result.safe,
        threat: result.threat
      });

      if (result.safe) {
        toast.success('Archivo Limpio', `El archivo ${file.name} ha sido analizado por el sandbox de la Cúpula y no presenta amenazas.`);
      } else {
        toast.error('¡Amenaza Detectada!', `Se aisló ${result.threat} en ${file.name}. Enviado a cuarentena.`);
      }
    };
    reader.readAsText(file.slice(0, 1024 * 100)); // Read first 100kb for inspection
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-500">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Escáner Antivirus & Sandbox Heurístico</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Inspección de archivos, inyecciones de código y memoria en tiempo real</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-6 overflow-y-auto pr-1">
          {/* Quick System Scan Action */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Análisis Completo de Integridad del Sistema</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Verifica scripts cargados, firmas en caché, DOM y estado de tokens.</p>
            </div>
            <button
              onClick={runSystemScan}
              disabled={isScanning}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center gap-2 cursor-pointer shrink-0"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Escaneando ({scanProgress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Escanear Ahora</span>
                </>
              )}
            </button>
          </div>

          {/* Progress Bar when scanning */}
          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>Inspeccionando sectores de memoria y sandbox...</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-rose-500 to-cyan-500"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {scanResult && !isScanning && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{scanResult}</span>
            </div>
          )}

          {/* File Drag and Drop Sandbox Area */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Analizar Archivo en Sandbox Aislado
            </h4>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInput}
                className="hidden"
              />
              <UploadCloud className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Arrastra cualquier archivo o haz clic para examinar
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Soporta PDFs, scripts, binarios, contratos inteligentes e imágenes
              </p>
            </div>
          </div>

          {analyzedFileResult && (
            <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
              analyzedFileResult.safe
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/60 text-rose-800 dark:text-rose-300'
            }`}>
              <div className="flex items-center gap-3">
                {analyzedFileResult.safe ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                )}
                <div>
                  <p className="font-bold">{analyzedFileResult.name}</p>
                  <p className="text-[11px] opacity-80">
                    {analyzedFileResult.safe
                      ? 'No se detectaron firmas maliciosas ni scripts sospechosos.'
                      : `Amenaza Detectada: ${analyzedFileResult.threat} (Aislado en cuarentena)`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quarantined List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Bóveda de Cuarentena ({quarantinedFiles.length})
              </h4>
              {quarantinedFiles.length > 0 && (
                <button
                  onClick={purgeQuarantine}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Purgar Bóveda
                </button>
              )}
            </div>

            {quarantinedFiles.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                No hay archivos retenidos en cuarentena. El ecosistema está libre de malware.
              </div>
            ) : (
              <div className="space-y-2">
                {quarantinedFiles.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-100 dark:bg-rose-500/10 text-rose-600 rounded-lg">
                        <Bug className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                        <p className="text-[10px] text-rose-500 font-mono">{item.detectedThreat} • {item.size}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold">
                      Aislado
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Cerrar Escáner
          </button>
        </div>
      </motion.div>
    </div>
  );
}
