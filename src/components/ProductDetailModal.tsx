import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ArrowRight, Sparkles, Check, ShieldCheck, MapPin } from 'lucide-react';

export interface ProductServiceItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  features: string[];
  metrics?: { label: string; value: string }[];
  actionLabel?: string;
  moduleTarget?: string;
}

interface ProductDetailModalProps {
  item: ProductServiceItem | null;
  onClose: () => void;
  onNavigate?: (module: string) => void;
}

export function ProductDetailModal({ item, onClose, onNavigate }: ProductDetailModalProps) {
  if (!item) return null;

  const handleAction = () => {
    if (item.moduleTarget && onNavigate) {
      onNavigate(item.moduleTarget);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl glass-panel-reyplace p-6 sm:p-8 shadow-2xl border border-[#00d2ff]/30 max-h-[90vh] flex flex-col"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00d2ff]/15 blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#d946ef]/15 blur-3xl pointer-events-none -z-10" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-black/40 hover:bg-black/60 z-20 border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto pr-1 space-y-6">
            {/* Header Image / Media */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 h-52 sm:h-64">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40 text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-md">
                  {item.tag}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-black text-white">{item.title}</h3>
                <p className="text-xs text-[#00d2ff] font-mono mt-0.5">{item.subtitle}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <p className="text-sm text-gray-300 leading-relaxed">
                {item.longDescription}
              </p>

              {/* Metrics */}
              {item.metrics && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {item.metrics.map((m, idx) => (
                    <div key={idx} className="bg-black/40 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">{m.label}</span>
                      <span className="text-base font-extrabold text-white">{m.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Key Features */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-[#00d2ff] uppercase tracking-wider">
                Características Clave & Ventajas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-200 bg-white/5 border border-white/10 p-2.5 rounded-xl">
                    <Check className="w-4 h-4 text-[#10b981] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-[#f97316]" />
                <span>Disponible en Los Mochis & Sinaloa</span>
              </div>

              <button
                onClick={handleAction}
                className="w-full sm:w-auto brand-button-spectrum text-white font-extrabold text-xs px-6 py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>{item.actionLabel || 'Explorar Módulo en Reyplace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
