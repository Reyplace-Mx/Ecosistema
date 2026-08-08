import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useThemeStore, ThemeMode } from '../store/useThemeStore';

export function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { mode: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: 'dark', label: 'Oscuro Cúpula', icon: Moon },
    { mode: 'light', label: 'Claro Sol', icon: Sun },
    { mode: 'system', label: 'Sistema OS', icon: Monitor },
  ];

  const currentIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const IconComponent = currentIcon;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-slate-200 dark:border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        title={`Tema actual: ${theme}`}
        aria-label="Seleccionar tema"
      >
        <IconComponent className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
        <span className="text-[10px] font-mono font-bold uppercase hidden xl:inline text-slate-600 dark:text-slate-400">
          {theme}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-cyan-500/10 z-50 overflow-hidden"
          >
            <div className="px-3 py-1.5 border-b border-slate-100 dark:border-white/5 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-gray-400">
                Tema de Interfaz
              </span>
            </div>

            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.mode;

              return (
                <button
                  key={opt.mode}
                  onClick={() => {
                    setTheme(opt.mode);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                      : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-500' : 'text-gray-400'}`} />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-500" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
