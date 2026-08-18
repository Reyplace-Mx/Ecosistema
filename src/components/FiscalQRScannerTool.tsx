import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  QrCode,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  Building,
  DollarSign
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function FiscalQRScannerTool() {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<{
    uuid: string;
    rfcEmisor: string;
    rfcReceptor: string;
    total: string;
    fecha: string;
    status: 'vigente' | 'cancelado' | 'no_encontrado';
    pacCertificador: string;
  } | null>(null);

  const [manualFolio, setManualFolio] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateScan = (codeType: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedData({
        uuid: '4A29B8C1-8F3E-45D0-9B21-7890ABCDEF12',
        rfcEmisor: 'REY900101XYZ',
        rfcReceptor: 'XAXX010101000',
        total: '$1,450.00 MXN',
        fecha: new Date().toLocaleDateString('es-MX'),
        status: 'vigente',
        pacCertificador: 'SAT-99001-EDICOM'
      });
      toast.success('CFDI 4.0 Validado', 'Factura certificada y vigente ante el SAT.');
    }, 1200);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Validador de Códigos QR & Sellos Fiscales (SAT / CFDI)</h3>
            <p className="text-xs text-gray-300">Escanea recibos de comercio, boletos oficiales y facturas electrónicas para verificar su autenticidad.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => simulateScan('camera')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <Camera className="w-4 h-4" />
            Escanear QR
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            Subir Archivo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={() => simulateScan('file')}
            className="hidden"
          />
        </div>
      </div>

      {/* Manual UUID Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={manualFolio}
          onChange={(e) => setManualFolio(e.target.value)}
          placeholder="Ingresa Folio Fiscal UUID (ej. 4A29B8C1-8F3E-45D0-9B21-7890ABCDEF12)..."
          className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-mono outline-none focus:border-emerald-500"
        />
        <button
          onClick={() => simulateScan('manual')}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold border border-white/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Search className="w-4 h-4 text-emerald-400" />
          Consultar
        </button>
      </div>

      {/* Scanned Verification Result */}
      <AnimatePresence>
        {scannedData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white text-sm">Comprobante Fiscal Digital Certificado (CFDI 4.0)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/30">
                ESTADO: VIGENTE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-400 text-[10px]">FOLIO FISCAL UUID</span>
                <p className="text-white font-bold truncate">{scannedData.uuid}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-400 text-[10px]">RFC EMISOR</span>
                <p className="text-cyan-300 font-bold">{scannedData.rfcEmisor}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-400 text-[10px]">IMPORTE TOTAL</span>
                <p className="text-emerald-400 font-bold">{scannedData.total}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-400 text-[10px]">PAC CERTIFICADOR</span>
                <p className="text-purple-300 font-bold">{scannedData.pacCertificador}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
