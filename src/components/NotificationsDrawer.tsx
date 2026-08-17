import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  Check, 
  ShieldCheck, 
  RefreshCw, 
  Coins, 
  ScanFace, 
  Info, 
  Trash2, 
  Radio, 
  Building2, 
  Share2, 
  Shield, 
  Vote, 
  Send,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { 
  loadPushPreferences, 
  savePushPreferences, 
  subscribeToPushNotifications, 
  unsubscribeFromPushNotifications, 
  triggerLocalPushNotification, 
  isPushNotificationSupported,
  getNotificationPermission,
  PushSubscriptionPreferences 
} from '../lib/pushNotifications';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'Seguridad' | 'Red' | 'Transacción' | 'Smart City' | 'Meta Business';
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
  const [activeTab, setActiveTab] = useState<'inbox' | 'push_settings'>('inbox');
  const [pushPrefs, setPushPrefs] = useState<PushSubscriptionPreferences>(loadPushPreferences());
  const [isProcessingPush, setIsProcessingPush] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

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
      title: 'Tráfico en Los Mochis (Smart City)',
      message: 'Ola verde activa en Blvd. Gabriel Leyva hacia el centro.',
      time: 'Hace 12 min',
      category: 'Smart City',
      read: false,
      icon: Building2,
    },
    {
      id: '3',
      title: 'Nuevo Lead WhatsApp (Meta Shop)',
      message: 'Cliente de Fracc. Scally interesado en Sensor IoT.',
      time: 'Hace 25 min',
      category: 'Meta Business',
      read: false,
      icon: Share2,
    },
    {
      id: '4',
      title: 'Sincronización Supabase Realtime',
      message: 'Tu nodo de identidad se sincronizó con la nube.',
      time: 'Hace 40 min',
      category: 'Red',
      read: false,
      icon: RefreshCw,
    },
    {
      id: '5',
      title: 'Recompensa Reycoin (+250 RYC)',
      message: 'Bono de bienvenida acreditado en tu wallet.',
      time: 'Hace 1 hora',
      category: 'Transacción',
      read: true,
      icon: Coins,
    },
  ]);

  useEffect(() => {
    setPushPrefs(loadPushPreferences());
    setPermissionStatus(getNotificationPermission());
  }, [isOpen]);

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

  const handleTogglePushMaster = async () => {
    setIsProcessingPush(true);
    try {
      if (pushPrefs.enabled) {
        await unsubscribeFromPushNotifications();
        setPushPrefs(prev => ({ ...prev, enabled: false }));
        toast.info('Notificaciones Desactivadas', 'Ya no recibirás alertas push en segundo plano.');
      } else {
        const res = await subscribeToPushNotifications(pushPrefs);
        if (res.success) {
          setPushPrefs(prev => ({ ...prev, enabled: true }));
          setPermissionStatus(getNotificationPermission());
          toast.success('Suscripción Push Activada', 'Recibirás alertas en segundo plano sobre tus módulos.');
          
          // Trigger welcome notification
          await triggerLocalPushNotification({
            title: '¡Suscripción Push Reyplace Activa!',
            body: 'Te notificaremos al instante sobre tráfico en Mochis, ventas en Meta y seguridad.',
            module: 'smart_city'
          });
        } else {
          toast.error('Permiso Requerido', res.error || 'No se pudo activar la suscripción push.');
        }
      }
    } catch (err: any) {
      toast.error('Error Push', 'Ocurrió un error al gestionar la suscripción.');
    } finally {
      setIsProcessingPush(false);
    }
  };

  const handleToggleTopic = (topicKey: keyof PushSubscriptionPreferences) => {
    const updated = { ...pushPrefs, [topicKey]: !pushPrefs[topicKey] };
    setPushPrefs(updated);
    savePushPreferences(updated);
    toast.success('Preferencia Guardada', 'Se actualizó tu canal de alertas.');
  };

  const handleSendTestNotification = async (module: 'smart_city' | 'meta_business' | 'reyid_security' | 'governance') => {
    let title = '';
    let body = '';

    if (module === 'smart_city') {
      title = '🚨 Alerta Vial Los Mochis (Smart City)';
      body = 'Congestión moderada detectada en Blvd. Centenario y Rosales. Desvío OSRM sugerido.';
    } else if (module === 'meta_business') {
      title = '🛍️ Nuevo Lead en FB Marketplace Mochis';
      body = 'Un comprador en Zona Centro inició chat en WhatsApp por Kit Agrícola LoRa.';
    } else if (module === 'reyid_security') {
      title = '🛡️ Alerta de Seguridad ReyID';
      body = 'Inicio de sesión con Passkey FIDO2 confirmado desde navegador seguro.';
    } else {
      title = '🏛️ Votación Cúpula DAO Abierta';
      body = 'Nueva propuesta de presupuesto municipal en Los Mochis lista para votar.';
    }

    const sent = await triggerLocalPushNotification({
      title,
      body,
      module
    });

    // Also add to local drawer list
    const newItem: NotificationItem = {
      id: `push_${Date.now()}`,
      title,
      message: body,
      time: 'Justo ahora',
      category: module === 'smart_city' ? 'Smart City' : module === 'meta_business' ? 'Meta Business' : 'Seguridad',
      read: false,
      icon: module === 'smart_city' ? Building2 : module === 'meta_business' ? Share2 : ShieldCheck,
    };
    setNotifications(prev => [newItem, ...prev]);

    if (sent) {
      toast.success('Notificación Push Enviada', 'Alerta procesada por el Service Worker.');
    } else {
      toast.info('Notificación Generada', 'Alerta agregada a la bandeja interna.');
    }
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
                  Centro de Notificaciones
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {unreadCount} sin leer
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400">Service Worker Push & Ecosistema en vivo</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation (Bandeja vs Configuración Push) */}
          <div className="flex border-b border-white/10 bg-black/40 p-1.5 gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'inbox'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Bandeja ({notifications.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('push_settings')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'push_settings'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Suscripción Push</span>
            </button>
          </div>

          {/* TAB 1: INBOX */}
          {activeTab === 'inbox' && (
            <>
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
                    <p className="text-xs text-gray-600 max-w-xs">Estarás al tanto cuando haya actualizaciones de seguridad, tráfico o transacciones.</p>
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
                            item.category === 'Smart City' ? 'bg-blue-500/20 text-blue-400' :
                            item.category === 'Meta Business' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-gray-500/20 text-gray-300'
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
            </>
          )}

          {/* TAB 2: PUSH NOTIFICATION SUBSCRIPTION SYSTEM */}
          {activeTab === 'push_settings' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Push Master Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Suscripción Web Push</h4>
                      <p className="text-[11px] text-gray-400">Notificaciones vía Service Worker PWA</p>
                    </div>
                  </div>

                  <button
                    onClick={handleTogglePushMaster}
                    disabled={isProcessingPush}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      pushPrefs.enabled
                        ? 'bg-emerald-500 text-black font-extrabold shadow-md shadow-emerald-500/20'
                        : 'bg-cyan-600 text-black font-extrabold hover:bg-cyan-500'
                    }`}
                  >
                    {isProcessingPush ? (
                      <span className="animate-spin">⌛</span>
                    ) : pushPrefs.enabled ? (
                      'ACTIVO'
                    ) : (
                      'ACTIVAR'
                    )}
                  </button>
                </div>

                <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between text-gray-400">
                    <span>Estado Permiso:</span>
                    <strong className={permissionStatus === 'granted' ? 'text-emerald-400' : 'text-amber-400'}>
                      {permissionStatus.toUpperCase()}
                    </strong>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Service Worker Scope:</span>
                    <span className="text-cyan-300">/sw.js (PWA v1)</span>
                  </div>
                </div>
              </div>

              {/* Module Subscriptions Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Módulos de Interés Suscritos
                </h4>

                <div className="space-y-2">
                  <div 
                    onClick={() => handleToggleTopic('smartCityTraffic')}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Smart City Los Mochis</div>
                        <p className="text-[11px] text-gray-400">Alertas viales, clima y reportes ciudadanos</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={pushPrefs.smartCityTraffic} 
                      onChange={() => {}}
                      className="accent-cyan-400 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div 
                    onClick={() => handleToggleTopic('metaBusinessLeads')}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                        <Share2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Meta Business & WhatsApp</div>
                        <p className="text-[11px] text-gray-400">Leads de FB Marketplace y ventas RYC</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={pushPrefs.metaBusinessLeads} 
                      onChange={() => {}}
                      className="accent-cyan-400 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div 
                    onClick={() => handleToggleTopic('reyidSecurity')}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">ReyID & Seguridad Cúpula</div>
                        <p className="text-[11px] text-gray-400">Intentos de acceso y firmas criptográficas</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={pushPrefs.reyidSecurity} 
                      onChange={() => {}}
                      className="accent-cyan-400 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div 
                    onClick={() => handleToggleTopic('governanceVotes')}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Vote className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Gobernanza & Reycoin</div>
                        <p className="text-[11px] text-gray-400">Votaciones DAO y transferencias de wallet</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={pushPrefs.governanceVotes} 
                      onChange={() => {}}
                      className="accent-cyan-400 w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Test Notification Simulator */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-white">Probar Disparo de Alertas Push</h4>
                </div>
                <p className="text-[11px] text-gray-400">
                  Prueba la recepción de alertas inmediatas a través del Service Worker en tu dispositivo.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSendTestNotification('smart_city')}
                    className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 text-[11px] font-bold text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Tráfico Mochis</span>
                  </button>

                  <button
                    onClick={() => handleSendTestNotification('meta_business')}
                    className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 text-[11px] font-bold text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Meta Lead</span>
                  </button>

                  <button
                    onClick={() => handleSendTestNotification('reyid_security')}
                    className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 text-[11px] font-bold text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>ReyID 2FA</span>
                  </button>

                  <button
                    onClick={() => handleSendTestNotification('governance')}
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 text-[11px] font-bold text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <Vote className="w-3.5 h-3.5 shrink-0" />
                    <span>Voto DAO</span>
                  </button>
                </div>
              </div>
            </div>
          )}

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

