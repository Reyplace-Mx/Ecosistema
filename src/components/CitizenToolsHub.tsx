import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Camera,
  Volume2,
  QrCode,
  Sparkles,
  HelpCircle,
  AlertCircle,
  FileCheck,
  Search,
  ExternalLink,
  Layers,
  Zap,
  DollarSign
} from 'lucide-react';
import { CurrencyScanner } from './CurrencyScanner';
import { AcousticNoiseMeterTool } from './AcousticNoiseMeterTool';
import { FiscalQRScannerTool } from './FiscalQRScannerTool';

export type CitizenToolType = 'banknote_scanner' | 'noise_meter' | 'qr_fiscal';

export function CitizenToolsHub() {
  const [activeTool, setActiveTool] = useState<CitizenToolType>('banknote_scanner');

  return (
    <div className="space-y-6 w-full animate-fade-in" id="citizen-tools-hub-root">
      {/* Category Navigation Pills */}
      <div className="glass-panel-reyplace rounded-3xl p-4 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/40 neu-inset-dark">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              Herramientas Ciudadanas de Protección Urbana
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Utilidades ópticas, acústicas y de verificación fiscal para el ciudadano
            </p>
          </div>
        </div>

        {/* Sub-tools Tab Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/50 p-1.5 rounded-2xl border border-white/10 text-xs font-mono w-full sm:w-auto">
          <button
            onClick={() => setActiveTool('banknote_scanner')}
            className={`px-3.5 py-2 rounded-xl font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTool === 'banknote_scanner'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            Currency Scanner & Billetes
          </button>

          <button
            onClick={() => setActiveTool('noise_meter')}
            className={`px-3.5 py-2 rounded-xl font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTool === 'noise_meter'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            Decibelímetro Urbano
          </button>

          <button
            onClick={() => setActiveTool('qr_fiscal')}
            className={`px-3.5 py-2 rounded-xl font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTool === 'qr_fiscal'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Sellos Fiscales SAT / QR
          </button>
        </div>
      </div>

      {/* Active Citizen Tool Component */}
      <div className="transition-all">
        {activeTool === 'banknote_scanner' && <CurrencyScanner />}
        {activeTool === 'noise_meter' && <AcousticNoiseMeterTool />}
        {activeTool === 'qr_fiscal' && <FiscalQRScannerTool />}
      </div>
    </div>
  );
}
