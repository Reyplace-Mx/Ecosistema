import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Flame,
  ThermometerSun,
  Radio,
  Bell,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldAlert,
  Info,
  Clock,
  ExternalLink,
  Activity
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export interface EmergencyAlert {
  id: string;
  type: 'seismic' | 'hurricane' | 'temperature' | 'incident';
  title: string;
  severity: 'extreme' | 'high' | 'moderate' | 'info';
  location: string;
  time: string;
  description: string;
  instructions: string[];
  protocolUrl?: string;
  metrics?: { label: string; value: string }[];
  active: boolean;
}

const INITIAL_ALERTS: EmergencyAlert[] = [
  {
    id: 'alert-seismic-01',
    type: 'seismic',
    title: 'Alerta Sísmica Temprana (SASMEX)',
    severity: 'extreme',
    location: 'Costa del Pacífico • Cercano a Región Central (180 km)',
    time: 'Hace 4 min',
    description: 'Sismo detectado con intensidad fuerte. Estimado de arribo a zona urbana en 42 segundos. Mantenga la calma y active protocolos de evacuación.',
    instructions: [
      'Diríjase inmediatamente a puntos de reunión o zonas de menor riesgo.',
      'No use elevadores ni escaleras durante el movimiento.',
      'Su ReyID y documentos en Cúpula Digital están protegidos dinámicamente.'
    ],
    metrics: [
      { label: 'Magnitud', value: '5.2 Mw' },
      { label: 'Profundidad', value: '15.4 km' },
      { label: 'Estado Nodos', value: '100% Operativos' }
    ],
    active: true
  },
  {
    id: 'alert-hurricane-02',
    type: 'hurricane',
    title: 'Alerta de Ciclón / Huracán "Reyna"',
    severity: 'high',
    location: 'Zona Costera & Valles del Sur',
    time: 'Actualizado hace 12 min',
    description: 'Ciclón Tropical "Reyna" elevado a Categoría 2. Rachas de viento sostenidas de 155 km/h con precipitaciones intensas en las próximas 12 horas.',
    instructions: [
      'Sujete objetos sueltos en techos y balcones.',
      'Identifique el refugio temporal más cercano en la app.',
      'Evite cruzar ríos o arroyos con corriente elevada.'
    ],
    metrics: [
      { label: 'Categoría', value: 'Cat 2' },
      { label: 'Vientos', value: '155 km/h' },
      { label: 'Oleaje', value: '3.5 - 5.0m' }
    ],
    active: true
  },
  {
    id: 'alert-temp-03',
    type: 'temperature',
    title: 'Alerta por Ola de Calor Severa',
    severity: 'moderate',
    location: 'Ecosistema Metropolitano & Zona Central',
    time: 'Vigente hasta las 18:00 hrs',
    description: 'Temperatura máxima pronosticada de 39°C con alto índice de radiación UV (Nivel 11+ Extremadamente Alto).',
    instructions: [
      'Manténgase hidratado continuamente con agua potable o suero.',
      'Evite la exposición solar directa entre las 11:00 y las 16:00 hrs.',
      'Priorice atención a adultos mayores, menores de edad y mascotas.'
    ],
    metrics: [
      { label: 'Temp. Máxima', value: '39°C' },
      { label: 'Índice UV', value: '11+ Extremo' },
      { label: 'Humedad', value: '28%' }
    ],
    active: true
  },
  {
    id: 'alert-incident-04',
    type: 'incident',
    title: 'Mantenimiento Preventivo de Servidores & Obras Civiles',
    severity: 'info',
    location: 'Av. Central & Nodos de Red Reychain Norte',
    time: 'Programado hoy 23:00 hrs',
    description: 'Sincronización de nodos de validación Supabase sin interrupción de servicio. Cierre vial parcial por obras de conectividad de fibra óptica municipal.',
    instructions: [
      'La firma de contratos en ReyID continuará funcionando normalmente.',
      'Tome vías alternas si transita por la zona centro.'
    ],
    metrics: [
      { label: 'Tiempo Estimado', value: '45 mins' },
      { label: 'Impacto Red', value: 'Sin Interrupción' }
    ],
    active: true
  }
];

export function EmergencyAlertsWidget() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(INITIAL_ALERTS);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'seismic' | 'hurricane' | 'temperature' | 'incident'>('all');
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>('alert-seismic-01');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { toast } = useToast();

  const activeAlerts = alerts.filter(a => a.active);
  const filteredAlerts = selectedCategory === 'all'
    ? activeAlerts
    : activeAlerts.filter(a => a.type === selectedCategory);

  const toggleDismissAlert = (id: string, title: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: false } : a));
    toast.info('Alerta Archiva', `Has silenciado temporalmente: "${title}"`);
  };

  const getSeverityBadge = (severity: EmergencyAlert['severity']) => {
    switch (severity) {
      case 'extreme':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          indicator: 'bg-rose-500 animate-ping',
          label: 'CRÍTICA / SÍSMICA'
        };
      case 'high':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          indicator: 'bg-amber-500 animate-pulse',
          label: 'ALTA / METEOROLÓGICA'
        };
      case 'moderate':
        return {
          bg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
          indicator: 'bg-orange-400',
          label: 'PRECAUCIÓN TÉRMICA'
        };
      case 'info':
      default:
        return {
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          indicator: 'bg-cyan-400',
          label: 'INFORMATIVA'
        };
    }
  };

  const getTypeIcon = (type: EmergencyAlert['type']) => {
    switch (type) {
      case 'seismic':
        return <Activity className="w-5 h-5 text-rose-400" />;
      case 'hurricane':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'temperature':
        return <ThermometerSun className="w-5 h-5 text-orange-400" />;
      case 'incident':
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="glass-panel-reyplace rounded-3xl p-6 relative overflow-hidden transition-all duration-300">
      {/* Background ambient lighting in brand spectrum */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 blur-3xl animate-liquid-morph pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00d2ff]/10 blur-3xl animate-liquid-morph-slow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d946ef]/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 neu-inset-dark flex items-center justify-center">
            <Radio className="w-6 h-6 animate-pulse text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Alertas de Protección Civil & Clima
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                {activeAlerts.length} ACTIVAS
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Monitoreo en tiempo real sísmico, meteorológico e incidentes urbanos
            </p>
          </div>
        </div>

        {/* Audio Toggle & Refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              toast.info(
                soundEnabled ? 'Sirena Desactivada' : 'Sirena de Emergencia Activa',
                soundEnabled ? 'Notificaciones silenciosas.' : 'Recibirás un tono de alerta sísmica en segundo plano.'
              );
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-lg shadow-rose-950/40'
                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
            }`}
            title="Activar sirena sísmica"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-400 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Sirena Activa' : 'Sin Sonido'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6 relative z-10 font-mono text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 font-extrabold'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
          }`}
        >
          Todas ({activeAlerts.length})
        </button>
        <button
          onClick={() => setSelectedCategory('seismic')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'seismic'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 font-extrabold'
              : 'bg-white/5 text-rose-400 hover:bg-rose-500/10 border border-rose-500/20'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Sísmicas
        </button>
        <button
          onClick={() => setSelectedCategory('hurricane')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'hurricane'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-extrabold'
              : 'bg-white/5 text-amber-400 hover:bg-amber-500/10 border border-amber-500/20'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Huracanes
        </button>
        <button
          onClick={() => setSelectedCategory('temperature')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'temperature'
              ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20 font-extrabold'
              : 'bg-white/5 text-orange-400 hover:bg-orange-500/10 border border-orange-500/20'
          }`}
        >
          <ThermometerSun className="w-3.5 h-3.5" />
          Temperatura
        </button>
        <button
          onClick={() => setSelectedCategory('incident')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'incident'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20 font-extrabold'
              : 'bg-white/5 text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/20'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          Incidentes
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4 relative z-10">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/5 text-gray-400 font-mono text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            No hay alertas activas en esta categoría en este momento.
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const badge = getSeverityBadge(alert.severity);
            const isExpanded = expandedAlertId === alert.id;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  alert.severity === 'extreme'
                    ? 'bg-rose-950/20 border-rose-500/40 shadow-xl shadow-rose-950/30'
                    : alert.severity === 'high'
                    ? 'bg-amber-950/20 border-amber-500/30 shadow-lg shadow-amber-950/20'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Alert Card Header */}
                <div className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer" onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}>
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 shrink-0 mt-0.5">
                      {getTypeIcon(alert.type)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border flex items-center gap-1.5 ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.indicator}`} />
                          {badge.label}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          {alert.time}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {alert.title}
                      </h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 font-mono mt-0.5">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        {alert.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDismissAlert(alert.id, alert.title);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Archivar alerta"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/5 bg-black/30 space-y-4"
                    >
                      <p className="text-xs text-gray-300 leading-relaxed font-sans">
                        {alert.description}
                      </p>

                      {/* Key Metrics */}
                      {alert.metrics && alert.metrics.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 py-2">
                          {alert.metrics.map((m, idx) => (
                            <div key={idx} className="neu-inset-dark p-2.5 rounded-xl text-center border border-white/5">
                              <div className="text-[10px] font-mono text-gray-400 uppercase">{m.label}</div>
                              <div className="text-xs font-bold text-cyan-300 font-mono mt-0.5">{m.value}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Protocol Instructions */}
                      <div className="space-y-2 bg-white/5 p-3.5 rounded-xl border border-white/5">
                        <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                          Protocolo Recomendado de Protección Civil
                        </div>
                        <ul className="space-y-1.5">
                          {alert.instructions.map((inst, idx) => (
                            <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                              <span className="text-cyan-400 font-bold font-mono">•</span>
                              <span>{inst}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-between items-center pt-1 text-xs">
                        <span className="text-[10px] font-mono text-gray-500">
                          Sincronizado vía Reychain Civil Network Node #09
                        </span>
                        <button
                          onClick={() => {
                            toast.success('Protocolo Descargado', `Protocolo de seguridad para ${alert.title} guardado localmente.`);
                          }}
                          className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Descargar Protocolo PDF</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
