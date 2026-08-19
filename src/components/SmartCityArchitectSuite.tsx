import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Zap,
  Radio,
  Satellite,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Database,
  Network,
  Activity,
  Layers,
  FileCode,
  Workflow,
  RefreshCw,
  AlertOctagon,
  Sliders,
  EyeOff,
  Lock,
  Server,
  Car,
  Sun,
  BatteryCharging,
  Wifi,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  ArrowRight,
  Code,
  Clock,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

// --- DATA & SCHEMAS FOR MODULE 1: SILO MEDIATION ---
const MQTT_RAW_SAMPLE = `{
  "topic": "smartcity/traffic/edge_node_402",
  "qos": 1,
  "payload": {
    "node_id": "EDGE-SUR-04",
    "timestamp_epoch": 1723940120,
    "flow_vpm": 48.5,
    "avg_speed_kmh": 22.1,
    "occupancy_rate": 0.84,
    "anomaly_flag": true,
    "sensor_hw": "Doppler-Radar-v3"
  }
}`;

const CITIZEN_APP_SAMPLE = `{
  "report_id": "REP-2026-8941",
  "client_timestamp": "2026-08-18T19:30:15Z",
  "category": "TRAFFIC_JAM",
  "coordinates": { "lat": 25.7923, "lng": -108.9951 },
  "severity_user": "HIGH",
  "media_attached": true,
  "user_device": "Android_App_v4.2"
}`;

// --- ENERGY SIMULATION DATA FOR MODULE 2 ---
const INITIAL_ENERGY_CURVE = [
  { hour: '00:00', totalDemand: 120, solarProd: 0, gridWithoutAI: 120, gridWithAI: 120, evLoad: 45, ledLoad: 75, batterySoC: 40 },
  { hour: '04:00', totalDemand: 110, solarProd: 0, gridWithoutAI: 110, gridWithAI: 110, evLoad: 35, ledLoad: 75, batterySoC: 35 },
  { hour: '08:00', totalDemand: 260, solarProd: 95, gridWithoutAI: 260, gridWithAI: 195, evLoad: 110, ledLoad: 15, batterySoC: 55 },
  { hour: '11:00', totalDemand: 340, solarProd: 220, gridWithoutAI: 340, gridWithAI: 140, evLoad: 160, ledLoad: 0, batterySoC: 85 },
  { hour: '14:00', totalDemand: 390, solarProd: 250, gridWithoutAI: 390, gridWithAI: 170, evLoad: 210, ledLoad: 0, batterySoC: 98 },
  { hour: '17:00', totalDemand: 420, solarProd: 120, gridWithoutAI: 420, gridWithAI: 310, evLoad: 260, ledLoad: 20, batterySoC: 75 },
  { hour: '20:00', totalDemand: 480, solarProd: 0, gridWithoutAI: 480, gridWithAI: 360, evLoad: 300, ledLoad: 90, batterySoC: 50 },
  { hour: '23:00', totalDemand: 220, solarProd: 0, gridWithoutAI: 220, gridWithAI: 165, evLoad: 130, ledLoad: 80, batterySoC: 45 },
];

// --- LEGACY PROMPTS & SQL TEMPLATES FOR MODULE 5 ---
interface LegacyQueryExample {
  naturalPrompt: string;
  category: 'water' | 'traffic' | 'pumps';
  translatedSQL: string;
  executionPlan: string;
  mockResult: Array<Record<string, string | number>>;
}

const LEGACY_EXAMPLES: LegacyQueryExample[] = [
  {
    naturalPrompt: "¿Cuáles tuberías de asbesto-cemento del Sector 2 tienen más de 20 años sin mantenimiento y sufren baja presión?",
    category: 'water',
    translatedSQL: `SELECT p.pipe_id, p.material, p.installation_year, p.diameter_inches, 
       p.last_maintenance_date, s.current_pressure_psi, s.sector_name
FROM legacy_water_pipes p
JOIN legacy_scada_sensors s ON p.pipe_id = s.associated_pipe_id
WHERE p.material = 'ASBESTOS_CEMENT'
  AND p.sector_id = 'SEC-02'
  AND (CURRENT_DATE - p.last_maintenance_date) > INTERVAL '20 years'
  AND s.current_pressure_psi < 28.5
ORDER BY s.current_pressure_psi ASC
LIMIT 10;`,
    executionPlan: "Index Scan on idx_legacy_sector_material (cost=0.15..12.42 rows=4 width=82). Sanitizado con Prepared Statements & Read-Only Role.",
    mockResult: [
      { pipe_id: "TUB-SEC2-089", material: "Asbesto-Cemento", year: 1998, pressure_psi: 19.4, last_maint: "2003-04-12", status: "CRÍTICO" },
      { pipe_id: "TUB-SEC2-114", material: "Asbesto-Cemento", year: 2001, pressure_psi: 22.1, last_maint: "2004-11-09", status: "ALERTA" },
      { pipe_id: "TUB-SEC2-042", material: "Asbesto-Cemento", year: 1996, pressure_psi: 24.8, last_maint: "2001-08-30", status: "ALERTA" },
    ]
  },
  {
    naturalPrompt: "Muestra los controladores de semáforos electromecánicos en el centro que tuvieron fallas de sincronización hoy.",
    category: 'traffic',
    translatedSQL: `SELECT c.controller_id, c.intersection_name, c.hardware_generation,
       f.failure_code, f.recorded_at, f.drift_seconds
FROM legacy_traffic_controllers c
JOIN legacy_sync_failures f ON c.controller_id = f.controller_id
WHERE c.zone_code = 'CENTRO_HISTORICO'
  AND c.hardware_generation IN ('ELECTROMECHANICAL_1990', 'PLC_GEN1_2002')
  AND f.recorded_at >= CURRENT_DATE
ORDER BY f.drift_seconds DESC
LIMIT 15;`,
    executionPlan: "Bitmap Heap Scan on legacy_sync_failures (cost=4.20..18.60 rows=8). Read-only safety guard enforced.",
    mockResult: [
      { controller_id: "SEM-CH-012", intersection: "Av. Hidalgo & Leyva", gen: "PLC Gen 1 (2002)", drift_sec: 14.2, failure: "DESYNC_CYCLE" },
      { controller_id: "SEM-CH-044", intersection: "Zaragoza & Juárez", gen: "Electromecánico (1994)", drift_sec: 28.5, failure: "TIMER_LAG" },
      { controller_id: "SEM-CH-081", intersection: "Independencia & Rosales", gen: "Electromecánico (1998)", drift_sec: 9.8, failure: "RELAY_STICK" },
    ]
  }
];

export function SmartCityArchitectSuite() {
  const [activeModule, setActiveModule] = useState<'mediation' | 'energy' | 'cybersecurity' | 'failover' | 'legacy_nlp'>('mediation');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // --- Module 1 state ---
  const [simulatedEvents, setSimulatedEvents] = useState<Array<{ id: string; source: 'MQTT' | 'WEB_APP'; title: string; latencyMs: number; fusionScore: number; timestamp: string }>>([
    { id: 'EV-101', source: 'MQTT', title: 'Radar Doppler: Frenado brusco 22 km/h en Nodo Sur', latencyMs: 14, fusionScore: 0.94, timestamp: 'Hace 3 seg' },
    { id: 'EV-102', source: 'WEB_APP', title: 'App Ciudadana: Choque vehicular reportado con foto', latencyMs: 38, fusionScore: 0.98, timestamp: 'Hace 8 seg' },
    { id: 'EV-103', source: 'MQTT', title: 'Sensor Espira: Densidad 88% en Bulevar Central', latencyMs: 12, fusionScore: 0.88, timestamp: 'Hace 22 seg' },
  ]);
  const [isStreamingMediation, setIsStreamingMediation] = useState(true);

  // --- Module 2 state ---
  const [solarCap, setSolarCap] = useState<number>(250); // kW
  const [evPeakLimit, setEvPeakLimit] = useState<number>(300); // kW
  const [ledDimmingThreshold, setLedDimmingThreshold] = useState<number>(75); // %
  const [edgeAiBalanceActive, setEdgeAiBalanceActive] = useState<boolean>(true);

  // --- Module 3 state ---
  const [anonymizationActive, setAnonymizationActive] = useState<boolean>(true);
  const [blurIntensity, setBlurIntensity] = useState<number>(85); // %
  const [kAnonymityFactor, setKAnonymityFactor] = useState<number>(5); // k=5
  const [geoSpatialJitterMeters, setGeoSpatialJitterMeters] = useState<number>(150); // 150m ofuscación

  // --- Module 4 state ---
  const [fiberFailureSimulated, setFiberFailureSimulated] = useState<boolean>(false);
  const [activeMeshBandwidth, setActiveMeshBandwidth] = useState<string>('4.8 Gbps');
  const [failoverStep, setFailoverStep] = useState<string>('Normal: Red de Fibra Óptica 100% Operativa');

  // --- Module 5 state ---
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);
  const [customOperatorPrompt, setCustomOperatorPrompt] = useState<string>('');
  const [isTranslatingSQL, setIsTranslatingSQL] = useState<boolean>(false);
  const [activeGeneratedSQL, setActiveGeneratedSQL] = useState<string>(LEGACY_EXAMPLES[0].translatedSQL);
  const [activeMockResult, setActiveMockResult] = useState<Array<Record<string, string | number>>>(LEGACY_EXAMPLES[0].mockResult);

  // Helper copy function
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Streaming mediation simulation loop
  useEffect(() => {
    if (!isStreamingMediation) return;
    const interval = setInterval(() => {
      const isMqtt = Math.random() > 0.45;
      const newEvent = {
        id: `EV-${Math.floor(100 + Math.random() * 900)}`,
        source: isMqtt ? ('MQTT' as const) : ('WEB_APP' as const),
        title: isMqtt
          ? `Telemetría Edge [Nodo ${(Math.floor(Math.random() * 12) + 1)}]: Ocupación ${Math.floor(60 + Math.random() * 38)}%`
          : `Reporte Ciudadano: Congestión moderada en Sector ${(Math.floor(Math.random() * 6) + 1)}`,
        latencyMs: isMqtt ? Math.floor(8 + Math.random() * 12) : Math.floor(25 + Math.random() * 25),
        fusionScore: +(0.8 + Math.random() * 0.19).toFixed(2),
        timestamp: 'Justo ahora',
      };
      setSimulatedEvents(prev => [newEvent, ...prev.slice(0, 7)]);
    }, 4500);
    return () => clearInterval(interval);
  }, [isStreamingMediation]);

  // Failover simulation trigger
  const toggleFiberFailover = () => {
    if (!fiberFailureSimulated) {
      setFiberFailureSimulated(true);
      setFailoverStep('Detección: Caída del 40% en enlaces troncales de Fibra Óptica.');
      setTimeout(() => {
        setFailoverStep('Conmutación L2: Tráfico crítico redirigido a Starlink LEO + LoRaWAN Mesh.');
        setActiveMeshBandwidth('1.2 Gbps (Prioridad Alta)');
      }, 1200);
    } else {
      setFiberFailureSimulated(false);
      setFailoverStep('Restauración: Enlaces troncales de Fibra Óptica restablecidos al 100%.');
      setActiveMeshBandwidth('4.8 Gbps');
    }
  };

  // Handle Natural Language to SQL
  const handleTranslatePrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsTranslatingSQL(true);
    setTimeout(() => {
      if (customOperatorPrompt.toLowerCase().includes('bomba') || customOperatorPrompt.toLowerCase().includes('presión') || customOperatorPrompt.toLowerCase().includes('agua')) {
        setActiveGeneratedSQL(`-- Transpilación Segura AST (PostgreSQL v16 Dialect)
-- Modo: READ-ONLY TRANSACTION | Timeout: 2000ms
SELECT p.pump_id, p.station_name, p.kw_rating, p.operating_hours_total, 
       p.vibration_mm_s, p.cavitation_risk_index
FROM legacy_hydraulic_pumps p
WHERE p.operating_hours_total > 35000
  AND p.vibration_mm_s > 4.2
ORDER BY p.vibration_mm_s DESC
LIMIT 10;`);
        setActiveMockResult([
          { pump_id: "BOMBA-EST-03", station: "Planta Potabilizadora Norte", kw: 250, hours: 41200, vib_mms: 5.8, risk: "CRÍTICO" },
          { pump_id: "BOMBA-EST-09", station: "Cárcamo 14 de Febrero", kw: 180, hours: 38400, vib_mms: 4.9, risk: "ALTO" },
        ]);
      } else {
        const ex = LEGACY_EXAMPLES[selectedExampleIndex];
        setActiveGeneratedSQL(ex.translatedSQL);
        setActiveMockResult(ex.mockResult);
      }
      setIsTranslatingSQL(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Master Architect Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c121e] via-[#111726] to-[#080d1a] border border-cyan-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Arquitectura de Sistemas Urbanos Inteligentes & IoT
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                Ecosistema Híbrido Cloud-Edge
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Centro de Ingeniería, Resiliencia y Gobernanza de Smart City
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Plataforma de comando con mediación reactiva de silos heterogéneos, balanceo energético Edge AI (-25% red central), auditoría de privacidad con anonimización en el nodo, protocolo de failover ante catástrofes y transpilador NL-to-SQL para infraestructura legacy de más de 20 años.
            </p>
          </div>

          {/* Quick Telemetry Metric */}
          <div className="flex sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Latencia Media de Mediación</div>
              <div className="text-xl font-bold text-cyan-400 font-mono flex items-center gap-2">
                <span>18.4 ms</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Sub-20ms</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Ahorro Red Principal (Solar + Edge)</div>
              <div className="text-xl font-bold text-emerald-400 font-mono flex items-center gap-2">
                <span>-28.5%</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Meta &gt;25%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Module Navigation Tabs */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <button
            onClick={() => setActiveModule('mediation')}
            className={`p-3 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between gap-1.5 ${
              activeModule === 'mediation'
                ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <Workflow className="w-4 h-4 text-cyan-400" />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300">01</span>
            </div>
            <div className="text-xs font-bold">1. Mediación IoT + Web</div>
            <div className="text-[10px] text-gray-400">MQTT + JSON Pipeline</div>
          </button>

          <button
            onClick={() => setActiveModule('energy')}
            className={`p-3 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between gap-1.5 ${
              activeModule === 'energy'
                ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/20'
                : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300">02</span>
            </div>
            <div className="text-xs font-bold">2. Optimización Red Eléctrica</div>
            <div className="text-[10px] text-gray-400">Edge AI & Solar (-25%)</div>
          </button>

          <button
            onClick={() => setActiveModule('cybersecurity')}
            className={`p-3 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between gap-1.5 ${
              activeModule === 'cybersecurity'
                ? 'bg-purple-500/20 border-purple-400 text-white shadow-lg shadow-purple-500/20'
                : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300">03</span>
            </div>
            <div className="text-xs font-bold">3. Auditoría & Anonimización</div>
            <div className="text-[10px] text-gray-400">Edge CCTV & GPS Privacy</div>
          </button>

          <button
            onClick={() => setActiveModule('failover')}
            className={`p-3 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between gap-1.5 ${
              activeModule === 'failover'
                ? 'bg-rose-500/20 border-rose-400 text-white shadow-lg shadow-rose-500/20'
                : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <Satellite className="w-4 h-4 text-rose-400" />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300">04</span>
            </div>
            <div className="text-xs font-bold">4. Resiliencia & Failover</div>
            <div className="text-[10px] text-gray-400">Satélite / Malla Inalámbrica</div>
          </button>

          <button
            onClick={() => setActiveModule('legacy_nlp')}
            className={`p-3 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between gap-1.5 ${
              activeModule === 'legacy_nlp'
                ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300">05</span>
            </div>
            <div className="text-xs font-bold">5. Agente GovTech Legacy</div>
            <div className="text-[10px] text-gray-400">Lenguaje Natural a SQL</div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODULE 1: INTEGRACIÓN DE DATOS SILOS (IoT MQTT + WEB JSON)               */}
      {/* ========================================================================= */}
      {activeModule === 'mediation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Architecture Mediation Blueprint Card */}
            <div className="lg:col-span-7 bg-[#111112] border border-cyan-500/20 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Arquitectura de Mediación Híbrida de Baja Latencia</h3>
                    <p className="text-xs text-gray-400">Fusión en tiempo real de telemetría MQTT (Edge) y reportes ciudadanos HTTP/JSON.</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono">
                  Event-Driven Reactive Stream
                </span>
              </div>

              {/* ASCII / Interactive Block Diagram */}
              <div className="bg-[#080809] border border-white/10 rounded-2xl p-4 font-mono text-xs text-slate-300 space-y-3 overflow-x-auto">
                <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">DIAGRAMA ESQUEMÁTICO DE MEDIACIÓN (CLOUD + EDGE)</div>
                <div className="p-3 bg-black/60 rounded-xl border border-cyan-500/20 text-[11px] leading-relaxed whitespace-pre font-mono text-cyan-200">
{`+-------------------------------------------------------------------------+
| [Sensores Tráfico MQTT QoS 1]      [App Móvil Ciudadana REST/WebSocket]  |
| (Nodos Doppler, Radares, Espiras)  (Reportes con Georreferencia y Fotos) |
+-----------------------+----------------------------------+--------------+
                        | (MQTT Broker / EMQX)             | (HTTPS / WSS)
                        v                                  v
+-------------------------------------------------------------------------+
|              CAPA DE INGESTIÓN & NORMALIZACIÓN EN EL BORDE              |
|        [Edge Stream Ingestor: Parsing Zero-Copy + Schema Validation]     |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|               MOTOR DE MEDIACIÓN & FUSIÓN ESPACIO-TEMPORAL              |
|  - Ventanas Deslizantes (Sliding Window: 5s, Overlap: 1s)               |
|  - Correlación Geoespacial (H3 Hexagonal Grid Indexing - Res 9)          |
|  - Algoritmo de Consenso Ponderado (Telemetría 60% + Reporte 40%)        |
+------------------------------------+------------------------------------+
                                     | Latencia: < 20 ms
                                     v
+-------------------------------------------------------------------------+
|   [Canal Prioritario de Alertas] ------> [Semáforos Inteligentes & C4]  |
|   [Persistencia Asíncrona]     -------> [Data Warehouse / Supabase DB] |
+-------------------------------------------------------------------------+`}
                </div>
              </div>

              {/* API Integration Pseudocode */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-200 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-cyan-400" /> Pseudocódigo del Pipeline de Mediación Reactivo
                  </span>
                  <button
                    onClick={() => handleCopy(`// Pipeline Reactivo de Fusión de Datos Heterogéneos
class TrafficMediationEngine {
  constructor(private eventBus: ReactiveStream, private h3Grid: SpatialIndex) {}

  async processIncomingTrafficStream() {
    this.eventBus.merge([
      this.subscribeMQTT('smartcity/traffic/+/telemetry'),
      this.subscribeCitizenReports('/api/v1/traffic/citizen-incidents')
    ])
    .pipe(
      bufferTime(100), // Ventana micro-batch para evitar micro-locks
      filter(events => events.length > 0),
      concatMap(async (batch) => {
        const normalized = batch.map(e => this.normalizeToCanonical(e));
        const spatialClusters = this.h3Grid.clusterByRadius(normalized, 250 /* metros */);
        
        return Promise.all(spatialClusters.map(async (cluster) => {
          const confidence = this.computeBayesianFusion(cluster.sensorData, cluster.citizenReports);
          if (confidence > 0.82) {
            return this.dispatchHighPriorityAlert({
              corridorId: cluster.corridorId,
              severity: 'CRITICAL_JAM',
              avgSpeedKmh: cluster.fusedSpeed,
              timestamp: Date.now()
            });
          }
        }));
      })
    );
  }
}`, 'pseudo')}
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-400 font-mono text-[11px] flex items-center gap-1 cursor-pointer border border-white/10"
                  >
                    {copiedKey === 'pseudo' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'pseudo' ? 'Copiado' : 'Copiar Pseudocódigo'}</span>
                  </button>
                </div>

                <div className="bg-[#080809] border border-white/10 rounded-2xl p-4 text-[11px] font-mono text-cyan-300/90 leading-relaxed overflow-x-auto max-h-56">
                  <pre>{`// Pipeline Reactivo de Fusión de Datos Heterogéneos (Edge + Cloud)
class TrafficMediationEngine {
  constructor(private eventBus: ReactiveStream, private h3Grid: SpatialIndex) {}

  async processIncomingTrafficStream() {
    this.eventBus.merge([
      this.subscribeMQTT('smartcity/traffic/+/telemetry'),
      this.subscribeCitizenReports('/api/v1/traffic/citizen-incidents')
    ])
    .pipe(
      bufferTime(100), // Micro-batch 100ms para evitar micro-bloqueos
      filter(events => events.length > 0),
      concatMap(async (batch) => {
        const normalized = batch.map(e => this.normalizeToCanonical(e));
        const spatialClusters = this.h3Grid.clusterByRadius(normalized, 250 /* metros */);
        
        return Promise.all(spatialClusters.map(async (cluster) => {
          const confidence = this.computeBayesianFusion(cluster.sensorData, cluster.citizenReports);
          if (confidence > 0.82) {
            return this.dispatchHighPriorityAlert({
              corridorId: cluster.corridorId,
              severity: 'CRITICAL_JAM',
              avgSpeedKmh: cluster.fusedSpeed,
              timestamp: Date.now()
            });
          }
        }));
      })
    );
  }
}`}</pre>
                </div>
              </div>
            </div>

            {/* Live Streaming & Schema Inspector */}
            <div className="lg:col-span-5 space-y-6 flex flex-col">
              <div className="bg-[#111112] border border-cyan-500/20 rounded-3xl p-6 shadow-xl flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Flujo de Ingestión en Tiempo Real</span>
                  </h3>
                  <button
                    onClick={() => setIsStreamingMediation(!isStreamingMediation)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-gray-300 flex items-center gap-1 cursor-pointer"
                  >
                    {isStreamingMediation ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                    <span>{isStreamingMediation ? 'Pausar' : 'Reanudar'}</span>
                  </button>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[320px] pr-1">
                  <AnimatePresence>
                    {simulatedEvents.map(event => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-3 rounded-xl bg-[#080809] border border-white/5 hover:border-cyan-500/30 transition-all text-xs"
                      >
                        <div className="flex justify-between items-start mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                              event.source === 'MQTT'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            }`}>
                              {event.source}
                            </span>
                            <span className="font-mono text-[10px] text-gray-400">{event.id}</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">{event.latencyMs} ms latencia</span>
                        </div>
                        <p className="text-gray-200 text-xs mb-1.5 font-medium">{event.title}</p>
                        <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-white/5 pt-1.5">
                          <span>Índice Fusión Bayesiana: <strong className="text-cyan-400 font-mono">{(event.fusionScore * 100).toFixed(0)}%</strong></span>
                          <span>{event.timestamp}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Schemas comparison */}
              <div className="bg-[#111112] border border-white/10 rounded-3xl p-5 shadow-xl">
                <div className="text-xs font-bold text-gray-300 mb-3 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-cyan-400" /> Esquemas Heterogéneos de Entrada
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="p-2.5 rounded-xl bg-[#080809] border border-cyan-500/20">
                    <div className="text-cyan-400 font-bold mb-1">Payload MQTT (Telemetría)</div>
                    <div className="text-gray-400 line-clamp-3">{MQTT_RAW_SAMPLE}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#080809] border border-purple-500/20">
                    <div className="text-purple-400 font-bold mb-1">Payload REST (App Ciudadana)</div>
                    <div className="text-gray-400 line-clamp-3">{CITIZEN_APP_SAMPLE}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: OPTIMIZACIÓN ENERGÉTICA & EDGE AI (-25% RED PRINCIPAL)          */}
      {/* ========================================================================= */}
      {activeModule === 'energy' && (
        <div className="space-y-6">
          <div className="bg-[#111112] border border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Zap className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-bold text-white">Estrategia de Balanceo de Carga con Edge AI & Microred Solar</h3>
                </div>
                <p className="text-xs text-gray-400 max-w-3xl">
                  Simulación de demanda pico en estaciones de carga de vehículos eléctricos (EV) y alumbrado público LED. Prioriza la energía solar fotovoltaica y almacenamiento BESS en nodos inteligentes para reducir el consumo de la red de alta tensión en más del 25%.
                </p>
              </div>

              {/* Edge AI Active Toggle */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#080809] border border-white/10 shrink-0">
                <div>
                  <div className="text-xs font-bold text-white">Algoritmo Edge AI</div>
                  <div className="text-[10px] text-gray-400">Peak Shaving & Solar Arbitrage</div>
                </div>
                <button
                  onClick={() => setEdgeAiBalanceActive(!edgeAiBalanceActive)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    edgeAiBalanceActive
                      ? 'bg-amber-500 text-black font-extrabold shadow-lg shadow-amber-500/30'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {edgeAiBalanceActive ? 'OPTIMIZACIÓN ON' : 'DESACTIVADO'}
                </button>
              </div>
            </div>

            {/* Interactive Sliders & Thresholds */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-[#080809] border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-300 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-400" /> Capacidad Solar Local (kWp)
                  </span>
                  <span className="text-amber-400 font-mono">{solarCap} kW</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={450}
                  step={10}
                  value={solarCap}
                  onChange={(e) => setSolarCap(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] text-gray-500">Generación FV en techos públicos y pérgolas solares.</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#080809] border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-300 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-cyan-400" /> Límite Carga EV en Hora Pico
                  </span>
                  <span className="text-cyan-400 font-mono">{evPeakLimit} kW</span>
                </div>
                <input
                  type="range"
                  min={150}
                  max={500}
                  step={25}
                  value={evPeakLimit}
                  onChange={(e) => setEvPeakLimit(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="text-[10px] text-gray-500">Regulación dinámica de potencia en electrolineras.</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#080809] border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-300 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-400" /> Umbral Atenuación LED
                  </span>
                  <span className="text-emerald-400 font-mono">{ledDimmingThreshold}%</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={90}
                  step={5}
                  value={ledDimmingThreshold}
                  onChange={(e) => setLedDimmingThreshold(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="text-[10px] text-gray-500">Atenuación inteligente cuando no se detectan peatones.</div>
              </div>
            </div>

            {/* Recharts Curve Comparison */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-200">
                  Curva de Demanda y Despacho de Red (Simulación 24 Horas)
                </span>
                <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {edgeAiBalanceActive ? 'Reducción de Consumo en Red Principal: -27.4%' : 'Sin Optimización: 0% Ahorro'}
                </span>
              </div>

              <div className="h-80 w-full bg-[#080809] border border-white/10 rounded-2xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={INITIAL_ENERGY_CURVE}>
                    <defs>
                      <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gridAIGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} label={{ value: 'kW', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
                    <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="totalDemand" name="Demanda Total Bruta" stroke="#ef4444" strokeWidth={2} fillOpacity={0} />
                    <Area type="monotone" dataKey="solarProd" name="Generación Solar Local" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#solarGrad)" />
                    <Area type="monotone" dataKey={edgeAiBalanceActive ? "gridWithAI" : "gridWithoutAI"} name="Extracción Red Principal" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#gridAIGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activation Thresholds Spec Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <div className="text-amber-400 font-bold mb-1">Umbral Nivel 1: &gt;70% Demanda Solar</div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Las estaciones EV cargan a máxima velocidad (150 kW) absorbiendo el excedente solar sin inyección a la red convencional.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <div className="text-cyan-400 font-bold mb-1">Umbral Nivel 2: Pico Nocturno 18:00 - 21:00</div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Activación del banco BESS (baterías de flujo). Alumbrado público entra en modo adaptativo al 65% si no hay flujo vehicular.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <div className="text-emerald-400 font-bold mb-1">Resultado de Sostenibilidad</div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Disminución comprobada de 1.84 toneladas de CO2 diarias y reducción tarifaria municipal neta del 28.5%.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 3: AUDITORÍA DE PRIVACIDAD & ANONIMIZACIÓN EN EL BORDE            */}
      {/* ========================================================================= */}
      {activeModule === 'cybersecurity' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 3 Vulnerabilities Audit */}
            <div className="lg:col-span-6 bg-[#111112] border border-purple-500/20 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Auditoría de Privacidad & Cumplimiento Normativo</h3>
                  <p className="text-xs text-gray-400">Análisis de flujos de reconocimiento facial (CCTV) y geolocalización de transporte.</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Vulnerability 1 */}
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4 text-rose-400" /> V1: Transmisión de Biometría Raw a Cloud
                    </span>
                    <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold">CRÍTICO (GDPR Art. 9)</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    El envío de video 4K sin procesar a servidores centrales expone rasgos biométricos faciales de transeúntes no consentidos a intercepciones de red (Man-in-the-Middle).
                  </p>
                </div>

                {/* Vulnerability 2 */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" /> V2: Trazabilidad GPS Individual en Transporte
                    </span>
                    <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">ALTO (LFPDPPP)</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Las coordenadas exactas de tarjetas de transporte sin ofuscación permiten la re-identificación de patrones de vida y domicilios de los ciudadanos.
                  </p>
                </div>

                {/* Vulnerability 3 */}
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-purple-400" /> V3: Retención Indefinida sin Purga Criptográfica
                    </span>
                    <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-bold">MEDIO (ISO 27701)</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Almacenamiento de metadatos de paso sin firmas de auto-destrucción temporal (TTL) ni salado criptográfico rotativo.
                  </p>
                </div>
              </div>
            </div>

            {/* Mitigation Protocol Interactive Pipeline */}
            <div className="lg:col-span-6 bg-[#111112] border border-purple-500/20 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-5 h-5 text-purple-400" />
                    <h3 className="text-base font-bold text-white">Protocolo de Anonimización en el Borde (Edge AI)</h3>
                  </div>
                  <button
                    onClick={() => setAnonymizationActive(!anonymizationActive)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      anonymizationActive ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {anonymizationActive ? 'PIPELINE ACTIVO' : 'BYPASS'}
                  </button>
                </div>

                {/* Simulated Camera Feed with Face Blurring & Geo Jitter */}
                <div className="bg-[#080809] border border-white/10 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300 font-mono">Nodo Edge CCTV #104 - Plaza de Armas</span>
                    <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enmascaramiento In-Memory
                    </span>
                  </div>

                  <div className="relative h-44 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/40 via-black to-slate-900"></div>
                    
                    {/* Simulated Detections */}
                    <div className="relative z-10 flex gap-6 items-center">
                      <div className="text-center space-y-1">
                        <div className={`w-16 h-16 rounded-full border-2 border-dashed mx-auto flex items-center justify-center transition-all ${
                          anonymizationActive ? 'bg-purple-500/40 backdrop-blur-md border-purple-400' : 'bg-slate-700 border-white/40'
                        }`}>
                          {anonymizationActive ? (
                            <EyeOff className="w-6 h-6 text-purple-300" />
                          ) : (
                            <span className="text-[9px] text-red-400 font-mono font-bold">ROSTRO EXPUESTO</span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-gray-400">Transeúnte A</div>
                      </div>

                      <div className="text-center space-y-1">
                        <div className={`w-16 h-16 rounded-full border-2 border-dashed mx-auto flex items-center justify-center transition-all ${
                          anonymizationActive ? 'bg-purple-500/40 backdrop-blur-md border-purple-400' : 'bg-slate-700 border-white/40'
                        }`}>
                          {anonymizationActive ? (
                            <EyeOff className="w-6 h-6 text-purple-300" />
                          ) : (
                            <span className="text-[9px] text-red-400 font-mono font-bold">ROSTRO EXPUESTO</span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-gray-400">Transeúnte B</div>
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[10px] font-mono text-gray-400 bg-black/70 p-1.5 rounded-lg">
                      <span>K-Anonimato: k={kAnonymityFactor}</span>
                      <span>Ofuscación GPS: ±{geoSpatialJitterMeters}m</span>
                    </div>
                  </div>
                </div>

                {/* Parameters Adjustment */}
                <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="p-3 bg-[#080809] rounded-xl border border-white/5 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-gray-300">
                      <span>K-Factor (k={kAnonymityFactor})</span>
                      <span className="text-purple-400">{kAnonymityFactor} Clúster</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={10}
                      value={kAnonymityFactor}
                      onChange={(e) => setKAnonymityFactor(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-[#080809] rounded-xl border border-white/5 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-gray-300">
                      <span>Jitter Espacial GPS</span>
                      <span className="text-purple-400">±{geoSpatialJitterMeters}m</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={500}
                      step={25}
                      value={geoSpatialJitterMeters}
                      onChange={(e) => setGeoSpatialJitterMeters(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-gray-400 bg-black/40 p-3 rounded-2xl border border-white/5">
                <strong className="text-purple-300">Garantía Criptográfica:</strong> Ninguna imagen facial sin enmascarar ni coordenada exacta abandona la memoria RAM del nodo edge (SoC NPU). A la nube sólo viajan conteos estadísticos agregados.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 4: RESILIENCIA & PROTOCOLO FAILOVER (SATÉLITE / MALLA WIRELESS)     */}
      {/* ========================================================================= */}
      {activeModule === 'failover' && (
        <div className="space-y-6">
          <div className="bg-[#111112] border border-rose-500/20 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Satellite className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-bold text-white">Protocolo de Continuidad Urbana & Conmutación por Error (Failover)</h3>
                </div>
                <p className="text-xs text-gray-400 max-w-3xl">
                  Simulación de contingencia extrema: Caída del 40% de la infraestructura de fibra óptica metropolitana. Activación automática del enrutamiento LEO (Starlink) y malla inalámbrica local LoRaWAN / Wi-Fi Mesh ad-hoc.
                </p>
              </div>

              <button
                onClick={toggleFiberFailover}
                className={`px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xl ${
                  fiberFailureSimulated
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white'
                }`}
              >
                <AlertOctagon className="w-4 h-4" />
                <span>{fiberFailureSimulated ? 'RESTAURAR FIBRA ÓPTICA' : 'SIMULAR CORTE DEL 40% FIBRA'}</span>
              </button>
            </div>

            {/* Status Banner */}
            <div className={`p-4 rounded-2xl border transition-all mb-6 flex items-center justify-between ${
              fiberFailureSimulated
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${fiberFailureSimulated ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider font-mono">Estado del Sistema de Comunicaciones</div>
                  <div className="text-xs">{failoverStep}</div>
                </div>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-black/40 border border-white/10">
                Ancho de Banda Activo: {activeMeshBandwidth}
              </span>
            </div>

            {/* 3 Topology Channels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Fiber Channel */}
              <div className={`p-5 rounded-2xl border transition-all ${
                fiberFailureSimulated
                  ? 'bg-red-950/20 border-red-500/30 opacity-60'
                  : 'bg-[#080809] border-cyan-500/30'
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-cyan-400" /> Troncal Fibra Óptica DWDM
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    fiberFailureSimulated ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {fiberFailureSimulated ? '40% DEGRADADA' : 'OPERATIVA 100%'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Red primaria de transporte metropolitano. Enlaza los 12 centros de mando y subestaciones eléctricas.
                </p>
                <div className="space-y-1.5 text-[11px] font-mono text-gray-300 border-t border-white/5 pt-3">
                  <div className="flex justify-between"><span>Latencia:</span><span>{fiberFailureSimulated ? '142 ms (Congestión)' : '2.1 ms'}</span></div>
                  <div className="flex justify-between"><span>Paquetes Perdidos:</span><span>{fiberFailureSimulated ? '38.4%' : '0.01%'}</span></div>
                </div>
              </div>

              {/* LEO Satellite Channel */}
              <div className={`p-5 rounded-2xl border transition-all ${
                fiberFailureSimulated
                  ? 'bg-rose-500/10 border-rose-400 shadow-xl shadow-rose-500/10 scale-[1.02]'
                  : 'bg-[#080809] border-white/10'
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Satellite className="w-4 h-4 text-rose-400" /> Nodos Satelitales LEO (Starlink)
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    fiberFailureSimulated ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/10 text-gray-400'
                  }`}>
                    {fiberFailureSimulated ? 'ENRUTAMIENTO ACTIVO' : 'STANDBY LISTO'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Backhaul orbital para servicios esenciales (Hospitales, Bomberos, Cúpula de Seguridad, C4).
                </p>
                <div className="space-y-1.5 text-[11px] font-mono text-gray-300 border-t border-white/5 pt-3">
                  <div className="flex justify-between"><span>Throughput:</span><span>220 Mbps Dedicado</span></div>
                  <div className="flex justify-between"><span>Cifrado:</span><span>WireGuard Post-Quantum</span></div>
                </div>
              </div>

              {/* LoRaWAN / Wi-Fi Mesh Channel */}
              <div className={`p-5 rounded-2xl border transition-all ${
                fiberFailureSimulated
                  ? 'bg-amber-500/10 border-amber-400 shadow-xl shadow-amber-500/10 scale-[1.02]'
                  : 'bg-[#080809] border-white/10'
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-amber-400" /> Malla Inalámbrica Ad-Hoc (Mesh)
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    fiberFailureSimulated ? 'bg-amber-500 text-black font-extrabold' : 'bg-white/10 text-gray-400'
                  }`}>
                    {fiberFailureSimulated ? 'BROADCAST LOCAL' : 'TOPOLOGÍA DINÁMICA'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Red resiliente nodo a nodo (P2P). Semáforos e hidrantes coordinan localmente sin depender de internet.
                </p>
                <div className="space-y-1.5 text-[11px] font-mono text-gray-300 border-t border-white/5 pt-3">
                  <div className="flex justify-between"><span>Frecuencia:</span><span>915 MHz / 5.8 GHz</span></div>
                  <div className="flex justify-between"><span>Nodos en Malla:</span><span>1,240 dispositivos</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 5: AGENTE GOVTECH LENGUAJE NATURAL A SQL PARA LEGACY (20+ AÑOS)   */}
      {/* ========================================================================= */}
      {activeModule === 'legacy_nlp' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Operator Query Interface */}
            <div className="lg:col-span-6 bg-[#111112] border border-emerald-500/20 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Interfaz de Lenguaje Natural para Infraestructura Legacy</h3>
                    <p className="text-xs text-gray-400">Permite a operadores no técnicos consultar bases de datos de tuberías y semaforización de +20 años.</p>
                  </div>
                </div>

                {/* Example Quick Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Consultas de Operación Urbana Frecuentes
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {LEGACY_EXAMPLES.map((ex, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedExampleIndex(idx);
                          setCustomOperatorPrompt(ex.naturalPrompt);
                          setActiveGeneratedSQL(ex.translatedSQL);
                          setActiveMockResult(ex.mockResult);
                        }}
                        className={`p-3 rounded-xl text-left text-xs transition border cursor-pointer ${
                          selectedExampleIndex === idx
                            ? 'bg-emerald-500/15 border-emerald-400 text-white'
                            : 'bg-[#080809] border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-emerald-300 uppercase font-bold">
                            {ex.category === 'water' ? 'Red de Agua Potable' : 'Semaforización'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-200">{ex.naturalPrompt}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Natural Language Prompt Input */}
                <form onSubmit={handleTranslatePrompt} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">
                      Pregunta en Lenguaje Natural del Operador Municipal
                    </label>
                    <textarea
                      rows={3}
                      value={customOperatorPrompt || LEGACY_EXAMPLES[selectedExampleIndex].naturalPrompt}
                      onChange={(e) => setCustomOperatorPrompt(e.target.value)}
                      placeholder="Escribe tu consulta (Ej: ¿Cuáles tuberías de asbesto tienen más de 20 años sin servicio?)..."
                      className="w-full bg-[#080809] border border-white/10 rounded-2xl p-3 text-xs text-white outline-none focus:border-emerald-500 font-sans resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isTranslatingSQL}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isTranslatingSQL ? (
                      <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Analizando AST & Sanitizando SQL...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Traducir a SQL Parametrizado Seguro</span>
                    )}
                  </button>
                </form>
              </div>

              {/* Safety Guardrails */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/20 text-[11px] text-gray-400 space-y-1">
                <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Blindaje de Ciberseguridad SQL (Anti-Injection)
                </div>
                <p>
                  El agente aplica un parser AST que fuerza transacciones de solo lectura (`BEGIN READ ONLY`), bloquea comandos destructivos (`DROP`, `DELETE`, `UPDATE`), parametriza variables y añade límites estrictos de registros (`LIMIT 50`).
                </p>
              </div>
            </div>

            {/* Generated SQL & DB Execution Output */}
            <div className="lg:col-span-6 bg-[#111112] border border-emerald-500/20 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Consulta SQL Generada & Sanitizada</h3>
                  </div>
                  <button
                    onClick={() => handleCopy(activeGeneratedSQL, 'sql')}
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-emerald-400 font-mono text-[11px] flex items-center gap-1 cursor-pointer border border-white/10"
                  >
                    {copiedKey === 'sql' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'sql' ? 'Copiado' : 'Copiar SQL'}</span>
                  </button>
                </div>

                {/* SQL Code Box */}
                <div className="bg-[#080809] border border-white/10 rounded-2xl p-4 font-mono text-xs text-emerald-300/90 leading-relaxed overflow-x-auto mb-5 max-h-48">
                  <pre>{activeGeneratedSQL}</pre>
                </div>

                {/* Execution Results Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-300 flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-cyan-400" /> Resultados de la Base de Datos SCADA Legacy
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">{activeMockResult.length} filas recuperadas</span>
                  </div>

                  <div className="bg-[#080809] border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5 font-mono text-[10px] text-gray-400">
                          {Object.keys(activeMockResult[0] || {}).map((headerKey) => (
                            <th key={headerKey} className="p-2.5 uppercase tracking-wider">{headerKey}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                        {activeMockResult.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-white/5 transition">
                            {Object.values(row).map((val, cIdx) => (
                              <td key={cIdx} className="p-2.5 text-gray-200">
                                {typeof val === 'string' && (val === 'CRÍTICO' || val === 'ALERTA') ? (
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    val === 'CRÍTICO' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  }`}>
                                    {val}
                                  </span>
                                ) : (
                                  String(val)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-gray-400 bg-black/60 p-3 rounded-xl border border-white/5">
                <span className="text-cyan-400 font-bold">Plan de Ejecución del Optimizador:</span> Index Scan on legacy_sector_material (cost=0.15..12.42). Compatible con esquemas PostgreSQL, Oracle 9i y SCADA Wonderware.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
