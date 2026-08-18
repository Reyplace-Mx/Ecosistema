import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Map as MapIcon, 
  AlertTriangle, 
  Car, 
  CloudRain, 
  ShieldAlert, 
  Lock,
  Camera,
  Activity,
  Wind,
  CheckCircle,
  Clock,
  Radio,
  Eye,
  Settings,
  Plus,
  Send,
  Zap,
  Wifi,
  Droplet,
  FileCheck,
  ChevronRight,
  Sparkles,
  Bot
} from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import type { CityAlert, CitySensor } from '../types';
import { IssueReportModal } from '../components/IssueReportModal';
import { SmartCityTraffic3DWidget } from '../components/SmartCityTraffic3DWidget';
import { CitizenToolsHub } from '../components/CitizenToolsHub';
import { SmartCitySupabaseManager } from '../components/SmartCitySupabaseManager';
import { ShieldCheck, Database } from 'lucide-react';

const MOCK_ALERTS: CityAlert[] = [
  {
    id: 'alt_1',
    type: 'traffic',
    title: 'Congestión Severa - Vía Principal',
    description: 'Tráfico detenido por accidente. Desvíos automáticos activados en red logística.',
    severity: 'critical',
    location: 'Vía Principal, Sector 4',
    timestamp: 'Hace 10 min',
    isEncryptedReport: false
  },
  {
    id: 'alt_2',
    type: 'weather',
    title: 'Alerta de Lluvias Fuertes',
    description: 'Precipitación estimada de 40mm/h en la próxima hora.',
    severity: 'warning',
    location: 'Toda la ciudad',
    timestamp: 'Hace 30 min',
    isEncryptedReport: false
  },
  {
    id: 'alt_3',
    type: 'security',
    title: 'Reporte Anónimo Cifrado',
    description: 'Reporte ciudadano de actividad sospechosa. Cifrado ZK activado.',
    severity: 'warning',
    location: 'Zona Industrial Sur',
    timestamp: 'Hace 2 horas',
    isEncryptedReport: true
  }
];

const MOCK_SENSORS: CitySensor[] = [
  {
    id: 'sn_1',
    type: 'traffic',
    name: 'Radar Flujo Vehicular',
    location: 'Intersección Norte-Sur',
    status: 'online',
    lastReading: '245 vehículos/hora'
  },
  {
    id: 'sn_2',
    type: 'camera',
    name: 'Cam 4K - Plaza Central',
    location: 'Plaza Central',
    status: 'online',
    lastReading: 'Feed Activo'
  },
  {
    id: 'sn_3',
    type: 'air_quality',
    name: 'Sensor PM2.5 / AQI',
    location: 'Parque Metropolitano',
    status: 'online',
    lastReading: 'AQI: 42 (Bueno)'
  },
  {
    id: 'sn_4',
    type: 'weather',
    name: 'Estación Meteorológica',
    location: 'Torre Reyplace',
    status: 'maintenance',
    lastReading: 'Calibrando'
  }
];

const TRAFFIC_DATA = [
  { time: '00:00', flow: 40, vehicles: 120 },
  { time: '04:00', flow: 20, vehicles: 45 },
  { time: '08:00', flow: 92, vehicles: 850 },
  { time: '12:00', flow: 75, vehicles: 620 },
  { time: '16:00', flow: 88, vehicles: 780 },
  { time: '20:00', flow: 60, vehicles: 410 },
  { time: '23:59', flow: 35, vehicles: 90 },
];

const AIR_QUALITY_DATA = [
  { day: 'Lun', aqi: 38, pm25: 12 },
  { day: 'Mar', aqi: 42, pm25: 15 },
  { day: 'Mié', aqi: 35, pm25: 10 },
  { day: 'Jue', aqi: 55, pm25: 22 },
  { day: 'Vie', aqi: 48, pm25: 18 },
  { day: 'Sáb', aqi: 30, pm25: 8 },
  { day: 'Dom', aqi: 28, pm25: 7 },
];

const UTILITY_DATA = [
  { hour: '06h', water: 450, energy: 320 },
  { hour: '09h', water: 780, energy: 650 },
  { hour: '12h', water: 920, energy: 890 },
  { hour: '15h', water: 850, energy: 810 },
  { hour: '18h', water: 990, energy: 950 },
  { hour: '21h', water: 600, energy: 540 },
];

interface InfraNode {
  id: string;
  name: string;
  type: 'transport' | 'safety' | 'services';
  status: 'optimal' | 'warning' | 'critical';
  x: number;
  y: number;
  metric: string;
}

const INFRA_NODES: InfraNode[] = [
  { id: 'n1', name: 'Nodo Vial Principal Sur', type: 'transport', status: 'optimal', x: 30, y: 40, metric: '45 km/h' },
  { id: 'n2', name: 'CCTV Cruce Central', type: 'safety', status: 'optimal', x: 50, y: 50, metric: '1080p 60FPS' },
  { id: 'n3', name: 'Estación Bombeo Agua #2', type: 'services', status: 'warning', x: 70, y: 30, metric: '78% Presión' },
  { id: 'n4', name: 'Subestación Eléctrica Norte', type: 'services', status: 'optimal', x: 20, y: 70, metric: '12.4 MW' },
  { id: 'n5', name: 'Radar Tráfico Bulevar', type: 'transport', status: 'critical', x: 65, y: 75, metric: 'Congestión' },
  { id: 'n6', name: 'Dron Guardia Sector 3', type: 'safety', status: 'optimal', x: 40, y: 25, metric: 'En Patrulla' },
];

export function SmartCityDashboard() {
  const [activeTab, setActiveTab] = useState<'map' | 'analytics' | 'alerts' | 'sensors' | 'reports' | 'tools' | 'supabase_security'>('supabase_security');
  const [mapViewMode, setMapViewMode] = useState<'traffic_3d' | 'hologram_nodes'>('traffic_3d');
  const [mapLayer, setMapLayer] = useState<'all' | 'transport' | 'safety' | 'services'>('all');
  const [selectedNode, setSelectedNode] = useState<InfraNode | null>(null);

  // Citizen Report Form State
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState('Obras Públicas');
  const [reportLocation, setReportLocation] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [submittedTickets, setSubmittedTickets] = useState<Array<{id: string; title: string; dept: string; hash: string; status: string; date: string}>>([
    { id: 'TCK-9012', title: 'Bache profundo en Av. Insurgentes', dept: 'Obras Públicas', hash: '0x8F9B2C...4A11', status: 'En Ruta', date: 'Hace 25 min' },
    { id: 'TCK-9011', title: 'Luminaria fundida en Parque Central', dept: 'Alumbrado', hash: '0x3E21A8...9F00', status: 'Completado', date: 'Ayer' }
  ]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  // Reybot Notifications action state
  const [alertsList, setAlertsList] = useState<CityAlert[]>(MOCK_ALERTS);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle || !reportLocation) return;
    const newId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomHash = `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}...${Math.random().toString(16).substring(2, 6).toUpperCase()}`;
    const newTicket = {
      id: newId,
      title: reportTitle,
      dept: reportCategory,
      hash: randomHash,
      status: 'En Ruta',
      date: 'Justo ahora'
    };
    setSubmittedTickets([newTicket, ...submittedTickets]);
    setReportTitle('');
    setReportLocation('');
    setReportDesc('');
    setShowReportModal(false);
  };

  const handleReybotAction = (actionType: string, alertId: string) => {
    setAlertsList(prev => prev.map(a => a.id === alertId ? { ...a, description: `${a.description} [Reybot: ${actionType} ejecutado con éxito]` } : a));
  };

  const filteredNodes = mapLayer === 'all' ? INFRA_NODES : INFRA_NODES.filter(n => n.type === mapLayer);

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col overflow-y-auto animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            Smart City <span className="text-slate-400 dark:text-gray-600 font-medium text-2xl">/ Centro de Control</span>
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-2 font-medium">Monitoreo urbano en tiempo real. Integrado con mapas holográficos, analítica Recharts, reportes blockchain, detector de billetes falsos y herramientas ciudadanas.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-xl p-1.5 shadow-sm">
          <button 
            onClick={() => setActiveTab('supabase_security')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'supabase_security' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold shadow-md shadow-cyan-500/25 border border-cyan-400' 
                : 'text-slate-600 dark:text-cyan-400 hover:text-cyan-300'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Base de Datos & Seguridad Supabase</span>
          </button>
          <button 
            onClick={() => setActiveTab('map')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === 'map' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'}`}
          >
            Mapa Holográfico
          </button>
          <button 
            onClick={() => setActiveTab('tools')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'tools' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-md shadow-emerald-500/20' : 'text-slate-600 dark:text-emerald-400 hover:text-emerald-300'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            Herramientas Ciudadanas
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'}`}
          >
            Analítica Recharts
          </button>
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === 'alerts' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'}`}
          >
            Alertas & Reybot
          </button>
          <button 
            onClick={() => setActiveTab('sensors')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === 'sensors' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'}`}
          >
            Sensores IoT
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === 'reports' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'}`}
          >
            Reportes Ciudadanos
          </button>
        </div>
      </header>

      {/* 8 Municipal Smart City Pillars Grid Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-4 shadow-sm">
        <div className="p-3 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-200 dark:border-blue-500/10 space-y-1 text-center">
          <Wifi className="w-5 h-5 text-blue-600 dark:text-cyan-400 mx-auto" />
          <div className="text-[10px] font-bold text-slate-800 dark:text-white">1. Fibra & 5G</div>
          <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">100% Cobertura</span>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-500/5 rounded-2xl border border-amber-200 dark:border-amber-500/10 space-y-1 text-center">
          <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto" />
          <div className="text-[10px] font-bold text-slate-800 dark:text-white">2. Red Sensores IoT</div>
          <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">1,240 Nodos Active</span>
        </div>

        <div className="p-3 bg-purple-50 dark:bg-purple-500/5 rounded-2xl border border-purple-200 dark:border-purple-500/10 space-y-1 text-center">
          <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto" />
          <div className="text-[10px] font-bold text-slate-800 dark:text-white">3. Centro Datos AI</div>
          <span className="text-[9px] font-mono text-purple-600 dark:text-purple-400 font-bold">Centro Operativo</span>
        </div>

        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-200 dark:border-emerald-500/10 space-y-1 text-center">
          <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <div className="text-[10px] font-bold text-slate-800 dark:text-white">4. Gobierno Abierto</div>
          <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">100% Digital</span>
        </div>

        <div className="p-3 bg-cyan-50 dark:bg-cyan-500/5 rounded-2xl border border-cyan-200 dark:border-cyan-500/10 space-y-1 text-center">
          <Car className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mx-auto" />
          <div className="text-[10px] font-bold text-slate-800 dark:text-white">5. Movilidad Smart</div>
          <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">Semáforos IA</span>
        </div>

        <div className="p-3 bg-yellow-50 dark:bg-yellow-500/5 rounded-2xl border border-yellow-200 dark:border-yellow-500/10 space-y-1 text-center">
          <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mx-auto" />
          <div className="text-[10px] font-bold text-slate-800 dark:text-white">6. Smart Grids LED</div>
          <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">-38% CO2 Emisiones</span>
        </div>

        <div className="p-3 bg-rose-50 dark:bg-rose-500/5 rounded-2xl border border-rose-200 dark:border-rose-500/10 space-y-1 text-center">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 mx-auto" />
          <div className="text-[10px] font-bold text-slate-800 dark:text-white">7. Alerta Temprana</div>
          <span className="text-[9px] font-mono text-rose-600 dark:text-rose-400 font-bold">CCTV Reconocimiento</span>
        </div>

        <div className="p-3 bg-indigo-50 dark:bg-indigo-500/5 rounded-2xl border border-indigo-200 dark:border-indigo-500/10 space-y-1 text-center">
          <Send className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto" />
          <div className="text-[10px] font-bold text-slate-800 dark:text-white">8. Participación</div>
          <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">Ticket Blockchain</span>
        </div>
      </div>


      {/* Map Tab */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          {/* Sub-View Switcher for Map Tab */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <MapIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Centro de Visualización Geoespacial</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">Selecciona el modo de visualización urbana y rastreo de tráfico.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-black/40 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setMapViewMode('traffic_3d')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  mapViewMode === 'traffic_3d'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Tráfico 3D & Gemelo Digital (Mapbox / Cesium / OSRM)</span>
              </button>

              <button
                onClick={() => setMapViewMode('hologram_nodes')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  mapViewMode === 'hologram_nodes'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>Nodos Holográficos IoT</span>
              </button>
            </div>
          </div>

          {/* Render 3D Traffic & Digital Twin Widget */}
          {mapViewMode === 'traffic_3d' && (
            <SmartCityTraffic3DWidget />
          )}

          {/* Render Holographic Nodes Map */}
          {mapViewMode === 'hologram_nodes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
          <div className="lg:col-span-9 bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <MapIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Mapa Holográfico de Infraestructura Urbana
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-green-400 uppercase font-bold tracking-widest bg-emerald-50 dark:bg-green-500/10 px-3 py-1 rounded-full border border-emerald-200 dark:border-green-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live Sat Sync
                </span>
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Reportar Incidencia
                </button>
              </div>
            </div>
            
            {/* Holographic Canvas Area */}
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center min-h-[450px] shadow-inner group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/40 via-slate-950 to-cyan-950/20 pointer-events-none"></div>
              
              {/* Simulated Grid Lines / Roads */}
              <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
                <div className="w-full h-0.5 bg-cyan-400 absolute"></div>
                <div className="h-full w-0.5 bg-cyan-400 absolute"></div>
                <div className="w-3/4 h-3/4 border border-cyan-500/30 rounded-full absolute"></div>
                <div className="w-1/2 h-1/2 border border-blue-500/40 rounded-full absolute"></div>
              </div>

              {/* Infrastructure Nodes Render */}
              <div className="absolute inset-0 p-8">
                {filteredNodes.map(node => (
                  <motion.button
                    key={node.id}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedNode(node)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl border backdrop-blur-md shadow-xl transition-all cursor-pointer flex flex-col items-center group/node ${
                      node.status === 'critical' ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse' :
                      node.status === 'warning' ? 'bg-amber-500/20 border-amber-500 text-amber-300' :
                      'bg-blue-500/20 border-cyan-400 text-cyan-300'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-current shadow-[0_0_12px_currentColor] mb-1"></div>
                    <span className="text-[10px] font-bold text-white whitespace-nowrap bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">{node.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Selected Node Details Popup */}
              {selectedNode && (
                <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-80 bg-slate-900/95 border border-blue-500/40 rounded-2xl p-4 backdrop-blur-xl shadow-2xl z-20">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{selectedNode.type}</span>
                    <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white text-xs font-bold">✕</button>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{selectedNode.name}</h4>
                  <p className="text-xs text-slate-300 mb-3">Métrica Actual: <span className="font-mono text-cyan-300 font-bold">{selectedNode.metric}</span></p>
                  <div className="flex gap-2">
                    <button onClick={() => alert(`Diagnóstico remoto iniciado para ${selectedNode.name}`)} className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition">Diagnóstico IoT</button>
                    <button onClick={() => setSelectedNode(null)} className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition">Cerrar</button>
                  </div>
                </div>
              )}
              
              {/* Layer Toggles Bottom Bar */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 z-10">
                 <button 
                   onClick={() => setMapLayer('all')}
                   className={`flex-1 min-w-[100px] backdrop-blur-md rounded-xl p-2.5 text-xs font-bold transition-all border ${mapLayer === 'all' ? 'bg-blue-600 text-white border-blue-400 shadow-lg' : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800'}`}
                 >
                   🌐 Todos los Nodos
                 </button>
                 <button 
                   onClick={() => setMapLayer('transport')}
                   className={`flex-1 min-w-[100px] backdrop-blur-md rounded-xl p-2.5 text-xs font-bold transition-all border ${mapLayer === 'transport' ? 'bg-amber-600 text-white border-amber-400 shadow-lg' : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800'}`}
                 >
                   🚗 Capa Tránsito
                 </button>
                 <button 
                   onClick={() => setMapLayer('safety')}
                   className={`flex-1 min-w-[100px] backdrop-blur-md rounded-xl p-2.5 text-xs font-bold transition-all border ${mapLayer === 'safety' ? 'bg-purple-600 text-white border-purple-400 shadow-lg' : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800'}`}
                 >
                   🛡️ Capa Seguridad
                 </button>
                 <button 
                   onClick={() => setMapLayer('services')}
                   className={`flex-1 min-w-[100px] backdrop-blur-md rounded-xl p-2.5 text-xs font-bold transition-all border ${mapLayer === 'services' ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg' : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800'}`}
                 >
                   ⚡ Capa Servicios
                 </button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 space-y-6 flex flex-col">
            <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 dark:text-gray-400 mb-4">Salud Urbana</h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-1.5 font-bold">
                    <span className="text-slate-700 dark:text-gray-300">Calidad del Aire (AQI)</span>
                    <span className="text-emerald-600 dark:text-green-400">42 (Excelente)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5 font-bold">
                    <span className="text-slate-700 dark:text-gray-300">Flujo Vehicular</span>
                    <span className="text-amber-600 dark:text-amber-400">68% Saturación</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5 font-bold">
                    <span className="text-slate-700 dark:text-gray-300">Red WiFi Cúpula</span>
                    <span className="text-blue-600 dark:text-cyan-400">98% Conectado</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-500 dark:bg-cyan-400 h-2 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 dark:text-gray-400">Tickets Blockchain</h3>
                <span className="text-[10px] bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-200 dark:border-blue-500/20">{submittedTickets.length}</span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {submittedTickets.map(t => (
                  <div key={t.id} className="bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/5 p-3.5 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{t.title}</span>
                      <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">{t.id}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-gray-500">
                      <span>{t.dept} • <span className="font-mono text-purple-600 dark:text-purple-400">{t.hash}</span></span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}
        </div>
      )}

      {/* Analytics Recharts Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Traffic Flow Recharts */}
            <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-amber-500" /> Flujo Vehicular (24h)
                </h3>
                <span className="text-xs font-mono bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-500/20">Real-time IoT</span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TRAFFIC_DATA}>
                    <defs>
                      <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                    <Area type="monotone" dataKey="vehicles" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#trafficGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Air Quality Recharts */}
            <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Wind className="w-5 h-5 text-emerald-500" /> Índice Calidad del Aire (AQI Semanal)
                </h3>
                <span className="text-xs font-mono bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">Sensores PM2.5</span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={AIR_QUALITY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="aqi" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Utility Usage Recharts */}
            <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" /> Consumo de Servicios (Agua & Energía)
                </h3>
                <span className="text-xs font-mono bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/20">Telemetría Municipal</span>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={UTILITY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                    <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Alerts & Reybot Tab */}
      {activeTab === 'alerts' && (
        <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Centro de Alertas & Automatización Reybot
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Monitoreo de incidentes con color-coding de severidad y respuestas automatizadas por IA.</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition">
              Emitir Alerta Municipal
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alertsList.map(alert => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={alert.id} 
                className={`border rounded-2xl p-6 transition-all relative overflow-hidden flex flex-col justify-between shadow-sm ${
                  alert.severity === 'critical' 
                    ? 'bg-red-50/50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20' 
                    : 'bg-amber-50/50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{alert.timestamp}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">{alert.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-gray-300 mb-6 leading-relaxed">{alert.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400">
                    <MapIcon className="w-3.5 h-3.5" /> {alert.location}
                  </div>
                  <button 
                    onClick={() => handleReybotAction('Desvío Automático & Cuadrilla Asignada', alert.id)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                  >
                    <Bot className="w-4 h-4" /> Reybot: Ejecutar Acción Automática
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Sensors IoT Tab */}
      {activeTab === 'sensors' && (
        <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <Activity className="w-5 h-5 text-blue-600 dark:text-cyan-400" /> Red de Sensores IoT Municipales
             </h3>
             <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-gray-400">
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Online (98%)</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Mantenimiento (2%)</span>
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#080809]">
                  <th className="px-5 py-4 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Sensor / Ubicación</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Tipo</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Última Lectura</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Estado</th>
                  <th className="px-5 py-4 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {MOCK_SENSORS.map(sensor => (
                  <tr key={sensor.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          sensor.type === 'camera' ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400' :
                          sensor.type === 'traffic' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400' :
                          sensor.type === 'air_quality' ? 'bg-emerald-50 dark:bg-green-500/10 border-emerald-200 dark:border-green-500/20 text-emerald-600 dark:text-green-400' :
                          'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400'
                        }`}>
                           {sensor.type === 'camera' ? <Camera className="w-5 h-5" /> : 
                            sensor.type === 'traffic' ? <Car className="w-5 h-5" /> :
                            sensor.type === 'air_quality' ? <Wind className="w-5 h-5" /> :
                            <CloudRain className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{sensor.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-gray-500">{sensor.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                       <span className="text-xs text-slate-600 dark:text-gray-300 uppercase font-bold tracking-widest">{sensor.type.replace('_', ' ')}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-800 dark:text-gray-200 font-mono font-bold">{sensor.lastReading || '--'}</span>
                    </td>
                    <td className="px-5 py-4">
                      {sensor.status === 'online' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-green-500/10 text-emerald-700 dark:text-green-400 text-[10px] uppercase font-bold tracking-widest border border-emerald-200 dark:border-green-500/20">
                          <CheckCircle className="w-3 h-3" /> Online
                        </span>
                      )}
                      {sensor.status === 'maintenance' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] uppercase font-bold tracking-widest border border-amber-200 dark:border-amber-500/20">
                          <Settings className="w-3 h-3" /> Mant.
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors ml-auto shadow-sm">
                        <Eye className="w-4 h-4 text-slate-600 dark:text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Citizen Reports Tab */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-5 bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-500" /> Reportar Incidencia Ciudadana
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">Crea un ticket indexado automáticamente en blockchain para total transparencia y enrutado a Obras Públicas, Alumbrado o Tránsito.</p>

              {/* Gemini Vision Camera Shortcut Banner */}
              <button
                type="button"
                onClick={() => setShowCameraModal(true)}
                className="w-full mb-6 p-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-cyan-500/20 hover:opacity-95 transition cursor-pointer border border-cyan-400/30"
              >
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-200" />
                  <span>Usar Cámara + IA Gemini Vision</span>
                </div>
                <span className="text-[10px] uppercase font-mono bg-white/20 px-2 py-0.5 rounded-full border border-white/30">
                  Auto-Análisis
                </span>
              </button>

              <form onSubmit={handleCreateReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">Título del Problema</label>
                  <input 
                    type="text" 
                    value={reportTitle} 
                    onChange={e => setReportTitle(e.target.value)} 
                    placeholder="Ej. Bache profundo en Av. Insurgentes" 
                    required
                    className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-gray-200 outline-none focus:border-blue-500" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">Departamento Asignado</label>
                  <select 
                    value={reportCategory}
                    onChange={e => setReportCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-gray-200 outline-none focus:border-blue-500"
                  >
                    <option value="Obras Públicas">Obras Públicas (Baches / Pavimento)</option>
                    <option value="Alumbrado">Alumbrado Público</option>
                    <option value="Tránsito">Tránsito & Movilidad</option>
                    <option value="Saneamiento">Saneamiento & Agua</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">Ubicación exacta / Referencia</label>
                  <input 
                    type="text" 
                    value={reportLocation} 
                    onChange={e => setReportLocation(e.target.value)} 
                    placeholder="Ej. Esquina Blvd. Rosales y Calle 5" 
                    required
                    className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-gray-200 outline-none focus:border-blue-500" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">Descripción detallada</label>
                  <textarea 
                    value={reportDesc}
                    onChange={e => setReportDesc(e.target.value)}
                    rows={3} 
                    placeholder="Describe la incidencia..."
                    className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-gray-200 outline-none focus:border-blue-500 resize-none"
                  ></textarea>
                </div>

                <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Registrar en Blockchain y Enrutar
                </button>
              </form>
           </div>
           
           <div className="lg:col-span-7 bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm p-6 md:p-8 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Registro de Tickets Cifrados en Blockchain
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">Seguimiento en tiempo real de cada reporte ciudadano con hash verificable.</p>
              
              <div className="space-y-4 flex-1 overflow-y-auto">
                {submittedTickets.map(t => (
                  <div key={t.id} className="bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/5 p-5 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-cyan-500/20">{t.id}</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.title}</h4>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">{t.status}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-gray-400 pt-3 border-t border-slate-200 dark:border-white/5 mt-3">
                      <span>Departamento: <strong className="text-slate-800 dark:text-gray-200">{t.dept}</strong></span>
                      <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-500/20">Hash: {t.hash}</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      )}

      {/* Consola de Gestión: Base de Datos y Seguridad Supabase Smart City Los Mochis */}
      {activeTab === 'supabase_security' && (
        <SmartCitySupabaseManager />
      )}

      {/* Herramientas Ciudadanas: Detector de Billetes Falsos, Decibelímetro, CFDI SAT */}
      {activeTab === 'tools' && (
        <CitizenToolsHub />
      )}

      {/* Modal Reporte Rápido desde Mapa */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111112] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setShowReportModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white">✕</button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Reporte Ciudadano Express</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">Envía tu reporte directamente al sistema municipal con indexación blockchain.</p>

            <form onSubmit={handleCreateReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">Título</label>
                <input type="text" value={reportTitle} onChange={e => setReportTitle(e.target.value)} placeholder="Ej. Semáforo apagado" required className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-gray-200 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">Departamento</label>
                <select value={reportCategory} onChange={e => setReportCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-gray-200 outline-none">
                  <option value="Tránsito">Tránsito Municipal</option>
                  <option value="Obras Públicas">Obras Públicas</option>
                  <option value="Alumbrado">Alumbrado</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">Ubicación</label>
                <input type="text" value={reportLocation} onChange={e => setReportLocation(e.target.value)} placeholder="Ej. Calle Principal" required className="w-full bg-slate-50 dark:bg-[#080809] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-gray-200 outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl font-bold text-xs text-slate-700 dark:text-white transition">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition shadow-md shadow-blue-500/20">Enviar Reporte</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Reporte con Cámara y Gemini Vision AI */}
      <IssueReportModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onReportCreated={(newRep) => {
          setSubmittedTickets(prev => [
            {
              id: newRep.id,
              title: newRep.type,
              dept: 'Obras Públicas (Gemini AI)',
              hash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}...${Math.random().toString(16).substring(2, 6).toUpperCase()}`,
              status: 'En Ruta',
              date: 'Justo ahora'
            },
            ...prev
          ]);
        }}
      />
    </div>
  );
}

