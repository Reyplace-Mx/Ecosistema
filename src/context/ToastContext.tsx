import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  toast: {
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type, title, message, duration = 4000 }: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, title, message, duration };

    setToasts((prev) => [...prev.slice(-4), newToast]); // keep max 5

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toastHelpers = {
    success: (title: string, message?: string) => showToast({ type: 'success', title, message }),
    error: (title: string, message?: string) => showToast({ type: 'error', title, message }),
    info: (title: string, message?: string) => showToast({ type: 'info', title, message }),
    warning: (title: string, message?: string) => showToast({ type: 'warning', title, message }),
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toast: toastHelpers }}>
      {children}
      
      {/* Toast Render Portal Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-[#111112]/95 border backdrop-blur-md shadow-2xl relative overflow-hidden group"
              style={{
                borderColor:
                  toast.type === 'success'
                    ? 'rgba(34, 197, 94, 0.3)'
                    : toast.type === 'error'
                    ? 'rgba(239, 68, 68, 0.3)'
                    : toast.type === 'warning'
                    ? 'rgba(245, 158, 11, 0.3)'
                    : 'rgba(6, 182, 212, 0.3)',
              }}
            >
              <div
                className="w-1 h-full absolute left-0 top-0"
                style={{
                  backgroundColor:
                    toast.type === 'success'
                      ? '#22c55e'
                      : toast.type === 'error'
                      ? '#ef4444'
                      : toast.type === 'warning'
                      ? '#f59e0b'
                      : '#06b6d4',
                }}
              />

              <div className="shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400" />}
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <p className="text-xs font-bold text-white tracking-wide">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed break-words">{toast.message}</p>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 shrink-0"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
