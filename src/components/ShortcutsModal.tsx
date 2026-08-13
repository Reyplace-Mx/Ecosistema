import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command, X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'Navegación & Búsqueda',
      items: [
        { keys: ['⌘', 'K'], label: 'Abrir Command Palette / Buscar Módulos' },
        { keys: ['Ctrl', 'K'], label: 'Búsqueda rápida en Windows / Linux' },
        { keys: ['Esc'], label: 'Cerrar ventanas modales o paneles' },
        { keys: ['?'], label: 'Abrir este menú de atajos de teclado' },
      ],
    },
    {
      title: 'Identidad & Seguridad',
      items: [
        { keys: ['⌘', 'L'], label: 'Ir directamente a ReyID & Usuarios' },
        { keys: ['⌘', 'I'], label: 'Ver Video Introductorio Reyplace' },
      ],
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overscroll-contain overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#111112] border border-cyan-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-white"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Atajos de Teclado</h3>
                <p className="text-xs text-gray-400">Navegación ultra rápida en Reyplace</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {shortcutGroups.map((group) => (
              <div key={group.title} className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">{group.title}</h4>
                <div className="space-y-1.5">
                  {group.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-xs">
                      <span className="text-gray-300 font-medium">{item.label}</span>
                      <div className="flex items-center gap-1">
                        {item.keys.map((k, kIdx) => (
                          <kbd
                            key={kIdx}
                            className="bg-black/60 border border-white/20 text-cyan-300 font-mono text-[10px] px-2 py-0.5 rounded shadow-sm"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 text-center text-[11px] text-gray-500 font-mono">
            Presiona <kbd className="bg-white/10 px-1 py-0.5 rounded text-white">Esc</kbd> en cualquier momento para salir.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
