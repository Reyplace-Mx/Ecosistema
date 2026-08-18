import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Pin,
  PinOff,
  ChevronDown,
  ChevronUp,
  Shield,
  Radio,
  Car,
  Activity,
  Cpu,
  Zap,
  Lock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ThermometerSun,
  Layers,
  Sparkles,
  RefreshCw,
  Smartphone,
  LayoutGrid,
  Maximize2,
  Minimize2,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
  Bot,
  ExternalLink,
  Clock,
  Timer,
  ShieldCheck
} from 'lucide-react';
import { useBiometricStore } from '../store/useBiometricStore';
import { useToast } from '../context/ToastContext';

export type HUDWidgetCategory = 'all' | 'security' | 'smart_city' | 'web3' | 'ai';

export interface HUDWidgetDef {
  id: string;
  title: string;
  category: 'security' | 'smart_city' | 'web3' | 'ai';
  categoryLabel: string;
  iconKey: string;
  accentColor: string;
  badgeText: string;
  isPinned: boolean;
  order: number;
  isCollapsed?: boolean;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Lock,
  Radio,
  Shield,
  Car,
  Zap,
  Bot,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck
};

const BASE_HUD_WIDGETS: Omit<HUDWidgetDef, 'isPinned' | 'order' | 'isCollapsed'>[] = [
  {
    id: 'hud-biometric-enclave',
    title: 'Enclave Biométrico & Caché de Sesión',
    category: 'security',
    categoryLabel: 'Seguridad Zero-Trust',
    iconKey: 'Lock',
    accentColor: 'cyan',
    badgeText: 'FIDO2 / ZKP',
  },
  {
    id: 'hud-citizen-banknote',
    title: 'Detector de Billetes Falsos & Herramientas',
    category: 'smart_city',
    categoryLabel: 'Herramientas Ciudadanas',
    iconKey: 'ShieldCheck',
    accentColor: 'emerald',
    badgeText: 'BANXICO / UV',
  },
  {
    id: 'hud-emergency-protection',
    title: 'Protección Civil & Radar Sísmico (SASMEX)',
    category: 'smart_city',
    categoryLabel: 'Smart City & Clima',
    iconKey: 'Radio',
    accentColor: 'rose',
    badgeText: 'TIEMPO REAL',
  },
  {
    id: 'hud-cupula-defense',
    title: 'Cúpula Digital Zero-Day & Escudo Cibernético',
    category: 'security',
    categoryLabel: 'Cúpula Shield',
    iconKey: 'Shield',
    accentColor: 'emerald',
    badgeText: 'ESCUDO ACTIVO',
  },
  {
    id: 'hud-smart-traffic-3d',
    title: 'Tráfico Urbano 3D & Telemetría IoT',
    category: 'smart_city',
    categoryLabel: 'Movilidad',
    iconKey: 'Car',
    accentColor: 'amber',
    badgeText: 'RADAR 3D',
  },
  {
    id: 'hud-reycoin-gas',
    title: 'Reychain Settlement & Gas Metrics',
    category: 'web3',
    categoryLabel: 'Web3 / DeFi',
    iconKey: 'Zap',
    accentColor: 'blue',
    badgeText: '3,850 TPS',
  },
  {
    id: 'hud-reybot-apm',
    title: 'Reybot AI Neural Diagnostics & APM',
    category: 'ai',
    categoryLabel: 'Inteligencia Artificial',
    iconKey: 'Bot',
    accentColor: 'purple',
    badgeText: 'LATENCIA 18ms',
  }
];

const DEFAULT_PINNED_IDS = ['hud-biometric-enclave', 'hud-emergency-protection'];

const STORAGE_KEY = 'reyplace_hud_prefs_v3';

interface HUDUserPreferences {
  pinnedIds: string[];
  collapsedIds: string[];
  orderMap: Record<string, number>;
}

const buildWidgetsFromPrefs = (prefs?: Partial<HUDUserPreferences>): HUDWidgetDef[] => {
  const pinnedSet = new Set(prefs?.pinnedIds || DEFAULT_PINNED_IDS);
  const collapsedSet = new Set(prefs?.collapsedIds || []);
  const orderMap = prefs?.orderMap || {};

  return BASE_HUD_WIDGETS.map((base, idx) => ({
    ...base,
    isPinned: pinnedSet.has(base.id),
    isCollapsed: collapsedSet.has(base.id),
    order: orderMap[base.id] !== undefined ? orderMap[base.id] : idx + 1,
  }));
};

interface HUDWidgetSystemProps {
  onNavigate?: (tab: string) => void;
}

export function HUDWidgetSystem({ onNavigate }: HUDWidgetSystemProps) {
  const { toast } = useToast();
  const {
    isSessionAuthenticated,
    getRemainingSessionSeconds,
    cachedAuthExpiresAt,
    sessionCacheDuration,
    clearSessionCache,
    extendSessionCache,
    requestVerification,
  } = useBiometricStore();

  const [widgets, setWidgets] = useState<HUDWidgetDef[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return buildWidgetsFromPrefs(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read saved HUD preferences:', e);
    }
    return buildWidgetsFromPrefs();
  });

  const [activeCategory, setActiveCategory] = useState<HUDWidgetCategory>('all');
  const [remainingSecs, setRemainingSecs] = useState<number>(0);
  const [trafficScanPhase, setTrafficScanPhase] = useState<number>(0);

  // Periodic visual updates for traffic radar
  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficScanPhase(p => (p + 1) % 100);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Track session remaining seconds
  useEffect(() => {
    const updateCountdown = () => {
      setRemainingSecs(getRemainingSessionSeconds());
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [cachedAuthExpiresAt, getRemainingSessionSeconds]);

  // Persist only clean serializable preferences
  useEffect(() => {
    try {
      const prefs: HUDUserPreferences = {
        pinnedIds: widgets.filter(w => w.isPinned).map(w => w.id),
        collapsedIds: widgets.filter(w => w.isCollapsed).map(w => w.id),
        orderMap: widgets.reduce((acc, w) => ({ ...acc, [w.id]: w.order }), {}),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Could not persist HUD preferences:', e);
    }
  }, [widgets]);

  // Sort widgets: Pinned items first (by order), then unpinned items (by order)
  const sortedWidgets = [...widgets].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return a.order - b.order;
  });

  const filteredWidgets = activeCategory === 'all'
    ? sortedWidgets
    : sortedWidgets.filter(w => w.category === activeCategory);

  // Toggle Pin/Unpin with Framer Motion Auto-Reordering
  const handleTogglePin = (id: string, currentPinStatus: boolean, title: string) => {
    setWidgets(prev => {
      const updated = prev.map(w => {
        if (w.id === id) {
          return { ...w, isPinned: !currentPinStatus };
        }
        return w;
      });
      return updated;
    });

    toast.info(
      !currentPinStatus ? 'Widget Anclado al HUD' : 'Widget Desanclado',
      !currentPinStatus
        ? `"${title}" se ha fijado en la cabecera del HUD.`
        : `"${title}" ha vuelto al orden dinámico.`
    );
  };

  // Toggle Collapse/Expand
  const handleToggleCollapse = (id: string) => {
    setWidgets(prev =>
      prev.map(w => (w.id === id ? { ...w, isCollapsed: !w.isCollapsed } : w))
    );
  };

  // Reset to default
  const handleResetOrder = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('reyplace_hud_widgets_state_v2');
    } catch (e) {
      // ignore
    }
    setWidgets(buildWidgetsFromPrefs());
    toast.success('HUD Restablecido', 'Se ha recuperado el orden y anclaje predeterminado de los widgets.');
  };

  // Format seconds to mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCached = isSessionAuthenticated('maximum');

  return (
    <div className="w-full space-y-4" id="hud-widget-system-container">
      {/* HUD System Control Bar */}
      <div className="glass-panel-reyplace rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden border border-white/10">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 neu-inset-dark">
            <Layers className="w-5 h-5 animate-pulse text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                HUD de Telemetría & Módulos Vivos
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
                AUTO-STACK MOBILE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Reordenamiento dinámico con Framer Motion • {widgets.filter(w => w.isPinned).length} fijados
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 relative z-10 w-full sm:w-auto justify-between sm:justify-end">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-xs font-mono">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-cyan-500 text-black font-extrabold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Todos ({widgets.length})
            </button>
            <button
              onClick={() => setActiveCategory('security')}
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeCategory === 'security'
                  ? 'bg-cyan-500 text-black font-extrabold'
                  : 'text-gray-400 hover:text-cyan-300'
              }`}
            >
              <Shield className="w-3 h-3" />
              Seguridad
            </button>
            <button
              onClick={() => setActiveCategory('smart_city')}
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeCategory === 'smart_city'
                  ? 'bg-amber-500 text-black font-extrabold'
                  : 'text-gray-400 hover:text-amber-300'
              }`}
            >
              <Radio className="w-3 h-3" />
              Smart City
            </button>
          </div>

          <button
            onClick={handleResetOrder}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Restablecer Orden del HUD"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Auto-Stacking Grid Container with Framer Motion Layout Animations */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 transition-all duration-300"
      >
        <AnimatePresence>
          {filteredWidgets.map((widget) => {
            const Icon = ICON_MAP[widget.iconKey] || Shield;
            const isPinned = widget.isPinned;
            const isCollapsed = widget.isCollapsed;

            return (
              <motion.div
                key={widget.id}
                layout
                layoutId={widget.id}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 28,
                  mass: 0.8,
                }}
                className={`rounded-3xl border transition-all duration-300 relative overflow-hidden backdrop-blur-xl flex flex-col ${
                  isPinned
                    ? 'bg-slate-900/90 dark:bg-[#0c1424]/90 border-cyan-500/40 shadow-lg shadow-cyan-950/20 ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/60 dark:bg-[#0a0f1d]/70 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Pinned Glow Line Accent */}
                {isPinned && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                )}

                {/* Card Header */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-white/5 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2.5 rounded-2xl shrink-0 flex items-center justify-center ${
                        isPinned
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          : 'bg-white/5 text-gray-400 border border-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider truncate">
                          {widget.categoryLabel}
                        </span>
                        {isPinned && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-extrabold border border-cyan-500/30 flex items-center gap-1">
                            <Pin className="w-2.5 h-2.5 fill-cyan-400" />
                            ANCLADO
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                        {widget.title}
                      </h3>
                    </div>
                  </div>

                  {/* Widget Actions: Pin / Unpin & Collapse */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleTogglePin(widget.id, isPinned, widget.title)}
                      className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-mono ${
                        isPinned
                          ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-sm shadow-cyan-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10'
                      }`}
                      title={isPinned ? 'Desanclar widget' : 'Anclar al inicio del HUD'}
                    >
                      {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleToggleCollapse(widget.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                      title={isCollapsed ? 'Expandir' : 'Colapsar'}
                    >
                      {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Widget Body Content */}
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="p-4 sm:p-5 flex-1 flex flex-col justify-between"
                    >
                      {/* 1. ENCLAVE BIOMÉTRICO WIDGET */}
                      {widget.id === 'hud-biometric-enclave' && (
                        <div className="space-y-3.5">
                          <div className="p-3 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-400 font-mono flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                Estado de Autorización:
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-bold border ${
                                  isCached
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                }`}
                              >
                                {isCached ? 'SESIÓN ACTIVA' : 'RE-AUTORIZACIÓN REQUERIDA'}
                              </span>
                            </div>

                            {isCached ? (
                              <div className="flex items-center justify-between text-xs font-mono pt-1">
                                <span className="text-gray-300">Expira en:</span>
                                <span className="text-cyan-300 font-bold text-sm bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-500/30 animate-pulse">
                                  {formatTime(remainingSecs)}
                                </span>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 leading-snug">
                                Activa el token temporal para acceder a la Cúpula Digital, Bóveda ZK y firmas sin re-escanear retina ni huella.
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {isCached ? (
                              <>
                                <button
                                  onClick={() => extendSessionCache(15)}
                                  className="py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <Timer className="w-3.5 h-3.5" />
                                  +15 min
                                </button>
                                <button
                                  onClick={clearSessionCache}
                                  className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  Revocar Caché
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() =>
                                  requestVerification({
                                    title: 'Autorización de Alta Seguridad',
                                    subtitle: 'Verifica tu identidad para activar la caché de sesión temporal.',
                                    securityLevel: 'maximum',
                                    onSuccess: () => {
                                      toast.success('Caché Habilitada', 'Módulos de alta seguridad autorizados.');
                                    },
                                  })
                                }
                                className="col-span-2 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
                              >
                                <Eye className="w-4 h-4" />
                                Escanear & Activar Sesión ({sessionCacheDuration} min)
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* CITIZEN BANKNOTE & OPTICAL SCANNER WIDGET */}
                      {widget.id === 'hud-citizen-banknote' && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-1.5">
                            <div className="flex justify-between items-center text-xs font-mono">
                              <span className="text-gray-300">Currency Scanner:</span>
                              <span className="text-emerald-400 font-bold">Verification Pulse Live</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Pulso óptico, luz UV (365nm), relieve Intaglio e hilo 3D.</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (onNavigate) onNavigate('Smart City');
                              toast.info('Currency Scanner', 'Abriendo escáner con pulso de verificación en vivo.');
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 transition-all"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Abrir Currency Scanner</span>
                          </button>
                        </div>
                      )}

                      {/* 2. PROTECCIÓN CIVIL WIDGET */}
                      {widget.id === 'hud-emergency-protection' && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-rose-300 font-bold flex items-center gap-1">
                                <Activity className="w-3.5 h-3.5 text-rose-400 animate-ping" />
                                Sensor Sísmico Activo
                              </span>
                              <span className="text-[10px] font-mono text-gray-400">Hace 3 min</span>
                            </div>
                            <p className="text-xs text-slate-200">
                              Costa del Pacífico • Monitoreo de ondas P y S en estado normal (0.02g).
                            </p>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                            <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                              <div className="text-[9px] text-gray-400">MAGNITUD</div>
                              <div className="text-emerald-400 font-bold">5.2 Mw</div>
                            </div>
                            <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                              <div className="text-[9px] text-gray-400">NODOS RED</div>
                              <div className="text-cyan-400 font-bold">100%</div>
                            </div>
                            <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                              <div className="text-[9px] text-gray-400">ALERTA</div>
                              <div className="text-emerald-400 font-bold">VERDE</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. CÚPULA ZERO-DAY DEFENSE */}
                      {widget.id === 'hud-cupula-defense' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-gray-400">Nivel de Defensa:</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <Shield className="w-3.5 h-3.5" />
                              NIVEL 4 (MAXIMUM)
                            </span>
                          </div>
                          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-gray-400">Amenazas Bloqueadas Hoy:</span>
                              <span className="text-cyan-400 font-bold">14,290</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-400 w-[98%]" />
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (onNavigate) onNavigate('Cúpula');
                              toast.info('Cúpula Digital', 'Navegando a la consola central de seguridad.');
                            }}
                            className="w-full py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-cyan-300 border border-cyan-500/20 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Abrir Centro Cúpula</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* 4. TRÁFICO URBANO 3D */}
                      {widget.id === 'hud-smart-traffic-3d' && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-2xl bg-black/50 border border-amber-500/30 space-y-2 relative overflow-hidden">
                            {/* Radar sweep beam */}
                            <div 
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent pointer-events-none transition-all duration-300"
                              style={{ transform: `translateX(${(trafficScanPhase * 4) % 300 - 150}%)` }}
                            />
                            <div className="flex items-center justify-between text-xs font-mono relative z-10">
                              <span className="text-amber-300 font-bold flex items-center gap-1.5">
                                <Car className="w-3.5 h-3.5 text-amber-400" />
                                V2X Grid Metropolitano
                              </span>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                                FLUIDO 88%
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono relative z-10">
                              <div className="bg-slate-900/80 p-2 rounded-xl border border-white/5">
                                <div className="text-gray-400">CORREDOR SUR</div>
                                <div className="text-emerald-400 font-bold text-xs">54 km/h</div>
                              </div>
                              <div className="bg-slate-900/80 p-2 rounded-xl border border-white/5">
                                <div className="text-gray-400">DRONES VTOL</div>
                                <div className="text-cyan-300 font-bold text-xs">12 en vuelo</div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              if (onNavigate) onNavigate('Smart City');
                              toast.info('Smart City', 'Navegando al mapa de tráfico 3D completo.');
                            }}
                            className="w-full py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-amber-300 border border-amber-500/20 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Abrir Simulador 3D / OSRM</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* 5. REYCOIN GAS & TPS */}
                      {widget.id === 'hud-reycoin-gas' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                              <div className="text-[10px] text-gray-400">GAS L2</div>
                              <div className="text-cyan-300 font-bold text-sm">0.001 Gwei</div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                              <div className="text-[10px] text-gray-400">THROUGHPUT</div>
                              <div className="text-emerald-400 font-bold text-sm">3,850 TPS</div>
                            </div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-200 font-mono flex items-center justify-between">
                            <span>Bloque actual:</span>
                            <span className="font-bold">#18,940,211</span>
                          </div>
                        </div>
                      )}

                      {/* 6. REYBOT AI APM */}
                      {widget.id === 'hud-reybot-apm' && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-purple-300 font-bold flex items-center gap-1">
                                <Bot className="w-3.5 h-3.5" />
                                Red Neuronal Activa
                              </span>
                              <span className="text-emerald-400 font-bold">99.98% SLA</span>
                            </div>
                            <p className="text-xs text-gray-300">
                              Modelos Gemini 2.5 Flash & Flash-Lite orquestando consultas de Smart City.
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                            <span>Latencia de inferencia:</span>
                            <span className="text-cyan-300 font-bold">18ms</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
