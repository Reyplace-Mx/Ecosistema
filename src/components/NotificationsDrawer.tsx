import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Check, ShieldCheck, RefreshCw, Coins, ScanFace, Info, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'Seguridad' | 'Red' | 'Transacción';
  read: boolean;
  icon: React.ElementType;
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (module: string) => void;
}

export function NotificationsDrawer({ isOpen, onClose, onNavigate }: NotificationsDrawerProps) {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Prueba de Vida Registrada',
      message: 'Escaneo biométrico 3D completado con éxito en ReyID.',
      time: 'Hace 5 min',
      category: 'Seguridad',
      read: false,
      icon: ScanFace,
    },
    {
      id: '2',
      title: 'Sincronización Supabase Realtime',
      message: 'Tu nodo de identidad se sincronizó con la nube.',
      time: 'Hace 18 min',
      category: 'Red',
      read: false,
      icon: RefreshCw,
    },
    {
      id: '3',
      title: 'Recompensa Reycoin (+250 RYC)',
      message: 'Bono de bienvenida acreditado en tu wallet.',
      time: 'Hace 1 hora',
      category: 'Transacción',
      read: true,
      icon: Coins,
    },
    {
      id: '4',
      title: 'Nodo Cúpula Digital Seguro',
      message: 'Tu sesión posee encriptación biométrica de nivel 3.',
      time: 'Hace 3 horas',
      category: 'Seguridad',
      read: true,
      icon: ShieldCheck,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Notificaciones Leídas', 'Se han marcado todas como leídas.');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.info('Notificaciones Limpiadas', 'Bandeja de notificaciones vaciada.');
  };

  const markSingleAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-[#0d0d0e] border-l border-white/10 h-full flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Notificaciones
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {unreadCount} sin leer
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400">Ecosistema Reyplace en vivo</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between text-xs text-gray-400 bg-black/30 font-mono">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 disabled:opacity-40 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> Marcar todas leídas
            </button>
            <button
              onClick={clearAll}
              disabled={notifications.length === 0}
              className="hover:text-rose-400 transition-colors flex items-center gap-1 disabled:opacity-40 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Limpiar
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto smooth-scroll overscroll-contain p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 space-y-3">
                <Info className="w-10 h-10 text-gray-600" />
                <p className="text-sm font-medium">Sin notificaciones pendientes</p>
                <p className="text-xs text-gray-600 max-w-xs">Estarás al tanto cuando haya actualizaciones de seguridad o transacciones.</p>
              </div>
            ) : (
              notifications.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => markSingleAsRead(item.id)}
                    className={`p-3.5 rounded-xl border transition-all relative cursor-pointer group ${
                      item.read
                        ? 'bg-white/5 border-white/5 opacity-70 hover:opacity-100'
                        : 'bg-cyan-500/10 border-cyan-500/20 shadow-lg shadow-cyan-500/5'
                    }`}
                  >
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-3.5 right-3.5" />
                    )}

                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        item.category === 'Seguridad' ? 'bg-cyan-500/20 text-cyan-400' :
                        item.category === 'Transacción' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">{item.title}</h4>
                        </div>
                        <p className="text-xs text-gray-300 mt-1 leading-relaxed">{item.message}</p>
                        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-500 font-mono">
                          <span>{item.category}</span>
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-black/40 text-center">
            <button
              onClick={() => {
                onClose();
                onNavigate?.('ReyID & Usuarios');
              }}
              className="w-full py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Ir a Panel de Seguridad ReyID
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
