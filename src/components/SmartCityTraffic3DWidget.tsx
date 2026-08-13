import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Navigation,
  Car,
  AlertTriangle,
  Compass,
  Layers,
  Zap,
  Radio,
  Eye,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Building2,
  Box,
  Cpu,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Maximize2,
  RefreshCw,
  Sun,
  Moon,
  Crosshair,
  TrendingUp,
  Activity,
  Bot
} from 'lucide-react';

export type EngineMode = 'mapbox_3d' | 'cesium_twin' | 'osrm_route';
export type TrafficFilter = 'all' | 'critical_congestion' | 'accidents' | 'roadworks' | 'fluid';

export interface TrafficIncident {
  id: string;
  type: 'accident' | 'congestion' | 'roadwork';
  title: string;
  location: string;
  delayMinutes: number;
  severity: 'critical' | 'warning' | 'info';
  speedKmh: number;
  coords: { x: number; y: number };
}

export interface DroneFleetUnit {
  id: string;
  name: string;
  type: 'drone' | 'ambulance' | 'police' | 'logistics';
  status: 'en_ruta' | 'patrullando' | 'emergencia' | 'standby';
  speedKmh: number;
  altitudeMeters?: number;
  batteryPercent: number;
  destination: string;
  etaMinutes: number;
  coords: { x: number; y: number };
  osrmPath: Array<{ x: number; y: number }>;
}

const MOCK_INCIDENTS: TrafficIncident[] = [
  {
    id: 'inc-1',
    type: 'accident',
    title: 'Colisión Múltiple - Av. Insurgentes 3D',
    location: 'Intersección Norte / Av. Insurgentes',
    delayMinutes: 18,
    severity: 'critical',
    speedKmh: 8,
    coords: { x: 38, y: 42 }
  },
  {
    id: 'inc-2',
    type: 'congestion',
    title: 'Congestión Hora Punta - Bulevar Central',
    location: 'Paso Elevado Sector Financiero',
    delayMinutes: 12,
    severity: 'warning',
    speedKmh: 14,
    coords: { x: 62, y: 58 }
  },
  {
    id: 'inc-3',
    type: 'roadwork',
    title: 'Despliegue Fibra 5G - Zona Industrial',
    location: 'Anillo Periférico Este',
    delayMinutes: 6,
    severity: 'info',
    speedKmh: 28,
    coords: { x: 75, y: 30 }
  }
];

const INITIAL_FLEET: DroneFleetUnit[] = [
  {
    id: 'flt-1',
    name: 'Dron Guardia Alpha-01',
    type: 'drone',
    status: 'patrullando',
    speedKmh: 65,
    altitudeMeters: 120,
    batteryPercent: 88,
    destination: 'Zona Residencial Norte',
    etaMinutes: 4,
    coords: { x: 30, y: 25 },
    osrmPath: [
      { x: 30, y: 25 },
      { x: 45, y: 35 },
      { x: 55, y: 40 },
      { x: 65, y: 50 }
    ]
  },
  {
    id: 'flt-2',
    name: 'Ambulancia Emergencias AM-04',
    type: 'ambulance',
    status: 'emergencia',
    speedKmh: 82,
    batteryPercent: 95,
    destination: 'Hospital Central Smart',
    etaMinutes: 3,
    coords: { x: 20, y: 70 },
    osrmPath: [
      { x: 20, y: 70 },
      { x: 38, y: 65 },
      { x: 50, y: 55 },
      { x: 68, y: 45 }
    ]
  },
  {
    id: 'flt-3',
    name: 'Patrulla Inteligente P-102',
    type: 'police',
    status: 'en_ruta',
    speedKmh: 54,
    batteryPercent: 78,
    destination: 'Cruce Av. Insurgentes',
    etaMinutes: 5,
    coords: { x: 70, y: 75 },
    osrmPath: [
      { x: 70, y: 75 },
      { x: 60, y: 60 },
      { x: 48, y: 48 },
      { x: 38, y: 42 }
    ]
  }
];

const OSRM_NAV_STEPS = [
  { text: 'Iniciando ruta optimizada OSRM desde Centro Operativo', dist: '0.0 km', time: '0 min' },
  { text: 'Incorporación a Vía Conectada 3D en carril prioritario', dist: '0.8 km', time: '1 min' },
  { text: 'Giro a la derecha en Bulevar Smart Grid (Evitando congestión)', dist: '2.1 km', time: '3 min' },
  { text: 'Paso elevado con semáforos IA sincronizados en verde', dist: '3.5 km', time: '4 min' },
  { text: 'Llegada al destino objetivo (Punto de Intervención)', dist: '4.8 km', time: '5 min' }
];

export function SmartCityTraffic3DWidget() {
  const [engineMode, setEngineMode] = useState<EngineMode>('mapbox_3d');
  const [trafficFilter, setTrafficFilter] = useState<TrafficFilter>('all');
  
  // Layers State
  const [show3DBuildings, setShow3DBuildings] = useState(true);
  const [showPointCloud, setShowPointCloud] = useState(true);
  const [showBimCityGML, setShowBimCityGML] = useState(true);
  const [showTrafficRays, setShowTrafficRays] = useState(true);
  const [showFleetDrones, setShowFleetDrones] = useState(true);
  const [isNightMode, setIsNightMode] = useState(true);

  // 3D Viewport Adjustments
  const [pitchAngle, setPitchAngle] = useState(45); // 0° - 75°
  const [orbitAngle, setOrbitAngle] = useState(25); // 0° - 360°
  const [zoomLevel, setZoomLevel] = useState(1.1); // 0.8 - 2.0

  // Animation & Simulation State
  const [isSimulating, setIsSimulating] = useState(true);
  const [simStep, setSimStep] = useState(0);
  const [selectedIncident, setSelectedIncident] = useState<TrafficIncident | null>(MOCK_INCIDENTS[0]);
  const [selectedFleetUnit, setSelectedFleetUnit] = useState<DroneFleetUnit | null>(INITIAL_FLEET[0]);

  // OSRM Navigation Planner State
  const [osrmOrigin, setOsrmOrigin] = useState('Centro Operativo Smart');
  const [osrmDestination, setOsrmDestination] = useState('Hospital Central Smart');
  const [activeOsrmStep, setActiveOsrmStep] = useState(1);

  // Canvas Ref for WebGL/3D Render
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Continuous animation loop for WebGL / Canvas 3D rendering
  useEffect(() => {
    let animationFrameId: number;

    const render3DCityCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas with dark/cyber theme or light map background
      ctx.clearRect(0, 0, width, height);

      // Background styling
      if (isNightMode) {
        const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width);
        bgGradient.addColorStop(0, '#09152b');
        bgGradient.addColorStop(1, '#030814');
        ctx.fillStyle = bgGradient;
      } else {
        ctx.fillStyle = '#f1f5f9';
      }
      ctx.fillRect(0, 0, width, height);

      // Save context state for 3D isometric perspective transformation
      ctx.save();
      ctx.translate(width / 2, height / 2 + 20);
      
      // Calculate isometric 3D tilt & rotation matrix factors
      const radOrbit = (orbitAngle * Math.PI) / 180;
      const pitchScale = Math.cos((pitchAngle * Math.PI) / 180) * 0.7 + 0.3;

      ctx.scale(zoomLevel, zoomLevel * pitchScale);
      ctx.rotate(radOrbit);

      // Draw Grid ground / Urban base tile
      const gridSize = 480;
      ctx.strokeStyle = isNightMode ? 'rgba(0, 210, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 1;

      for (let x = -gridSize; x <= gridSize; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, -gridSize);
        ctx.lineTo(x, gridSize);
        ctx.stroke();
      }
      for (let y = -gridSize; y <= gridSize; y += 40) {
        ctx.beginPath();
        ctx.moveTo(-gridSize, y);
        ctx.lineTo(gridSize, y);
        ctx.stroke();
      }

      // Draw Road Networks (WebGL Vector Lines)
      const roadColor = isNightMode ? '#0f2347' : '#cbd5e1';
      ctx.strokeStyle = roadColor;
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';

      // Road 1: Main Highway
      ctx.beginPath();
      ctx.moveTo(-350, -100);
      ctx.lineTo(350, 100);
      ctx.stroke();

      // Road 2: Cross Avenue
      ctx.beginPath();
      ctx.moveTo(-150, 250);
      ctx.lineTo(150, -250);
      ctx.stroke();

      // Road 3: Perimeter Ring
      ctx.beginPath();
      ctx.arc(0, 0, 220, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Animated WebGL Traffic Rays (Green, Yellow, Red Flow Vectors)
      if (showTrafficRays) {
        const timeFactor = (Date.now() / 30) % 100;

        // Flow 1: Fluid Traffic (Green)
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 6;
        ctx.setLineDash([20, 15]);
        ctx.lineDashOffset = -timeFactor * 1.5;
        ctx.beginPath();
        ctx.moveTo(-350, -100);
        ctx.lineTo(-50, -14);
        ctx.stroke();

        // Flow 2: Moderate Traffic (Amber)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 6;
        ctx.setLineDash([15, 10]);
        ctx.lineDashOffset = -timeFactor * 0.8;
        ctx.beginPath();
        ctx.moveTo(-50, -14);
        ctx.lineTo(150, 42);
        ctx.stroke();

        // Flow 3: Congested Incident Zone (Red / Critical)
        if (trafficFilter === 'all' || trafficFilter === 'critical_congestion' || trafficFilter === 'accidents') {
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 8;
          ctx.setLineDash([10, 8]);
          ctx.lineDashOffset = -timeFactor * 0.2;
          ctx.beginPath();
          ctx.moveTo(150, 42);
          ctx.lineTo(350, 100);
          ctx.stroke();
        }

        ctx.setLineDash([]); // Reset line dash
      }

      // Render Extruded 3D Buildings (Mapbox / Cesium BIM Objects)
      if (show3DBuildings) {
        const buildingList = [
          { x: -180, y: -180, w: 50, h: 50, z: 90, name: 'Torre Reyplace 3D' },
          { x: -100, y: -220, w: 40, h: 40, z: 65, name: 'Centro Financiero' },
          { x: 120, y: -140, w: 60, h: 45, z: 110, name: 'Smart Hospital' },
          { x: -220, y: 80, w: 55, h: 55, z: 75, name: 'Centro Operativo' },
          { x: 180, y: 120, w: 50, h: 50, z: 85, name: 'Hub Logístico' },
          { x: 40, y: -180, w: 35, h: 35, z: 50, name: 'Plaza Digital' },
          { x: -60, y: 150, w: 45, h: 45, z: 70, name: 'Residencial 3D' },
        ];

        buildingList.forEach((b) => {
          // Base polygon
          ctx.fillStyle = isNightMode ? '#0c1a36' : '#94a3b8';
          ctx.fillRect(b.x, b.y, b.w, b.h);

          // 3D Top Polygon (extrusion roof)
          const zShift = b.z * (pitchAngle / 90);
          const topX = b.x - zShift * 0.3;
          const topY = b.y - zShift * 0.8;

          // Side Wall 1
          ctx.fillStyle = isNightMode ? '#061226' : '#64748b';
          ctx.beginPath();
          ctx.moveTo(b.x, b.y + b.h);
          ctx.lineTo(topX, topY + b.h);
          ctx.lineTo(topX + b.w, topY + b.h);
          ctx.lineTo(b.x + b.w, b.y + b.h);
          ctx.closePath();
          ctx.fill();

          // Side Wall 2
          ctx.fillStyle = isNightMode ? '#0f2752' : '#cbd5e1';
          ctx.beginPath();
          ctx.moveTo(b.x + b.w, b.y);
          ctx.lineTo(topX + b.w, topY);
          ctx.lineTo(topX + b.w, topY + b.h);
          ctx.lineTo(b.x + b.w, b.y + b.h);
          ctx.closePath();
          ctx.fill();

          // Roof Top
          const roofGradient = ctx.createLinearGradient(topX, topY, topX + b.w, topY + b.h);
          roofGradient.addColorStop(0, isNightMode ? '#1e3a8a' : '#e2e8f0');
          roofGradient.addColorStop(1, isNightMode ? '#3b82f6' : '#f8fafc');
          ctx.fillStyle = roofGradient;
          ctx.fillRect(topX, topY, b.w, b.h);

          // Neon Edge Trim
          ctx.strokeStyle = isNightMode ? 'rgba(0, 210, 255, 0.4)' : 'rgba(59, 130, 246, 0.4)';
          ctx.lineWidth = 1;
          ctx.strokeRect(topX, topY, b.w, b.h);
        });
      }

      // Render Point Cloud (Nubes de puntos LiDAR) - Cesium Feature
      if (showPointCloud) {
        ctx.fillStyle = isNightMode ? 'rgba(56, 189, 248, 0.6)' : 'rgba(37, 99, 235, 0.5)';
        for (let i = 0; i < 90; i++) {
          const px = (Math.sin(i * 1.7) * 260) % 280;
          const py = (Math.cos(i * 2.3) * 220) % 240;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Render Incidents Markers (Accidents & Congestion Pulse)
      MOCK_INCIDENTS.forEach((inc) => {
        if (
          trafficFilter === 'all' ||
          (trafficFilter === 'accidents' && inc.type === 'accident') ||
          (trafficFilter === 'critical_congestion' && inc.type === 'congestion') ||
          (trafficFilter === 'roadworks' && inc.type === 'roadwork')
        ) {
          const mapX = (inc.coords.x - 50) * 5;
          const mapY = (inc.coords.y - 50) * 4;

          // Flashing warning halo ring
          const pulse = (Date.now() / 250) % 20;
          ctx.strokeStyle = inc.severity === 'critical' ? '#f43f5e' : '#fbbf24';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(mapX, mapY, 12 + pulse, 0, Math.PI * 2);
          ctx.stroke();

          // Core Incident Icon Pin
          ctx.fillStyle = inc.severity === 'critical' ? '#e11d48' : '#d97706';
          ctx.beginPath();
          ctx.arc(mapX, mapY, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('!', mapX, mapY);
        }
      });

      // Render Fleet Units & Drones in Motion along OSRM Path
      if (showFleetDrones) {
        const animProgress = (Date.now() / 40) % 100;

        INITIAL_FLEET.forEach((unit, idx) => {
          const pathStep = Math.floor((animProgress / 100) * (unit.osrmPath.length - 1));
          const nextStep = Math.min(pathStep + 1, unit.osrmPath.length - 1);
          const ratio = (animProgress % 25) / 25;

          const p1 = unit.osrmPath[pathStep];
          const p2 = unit.osrmPath[nextStep];

          const currX = (p1.x + (p2.x - p1.x) * ratio - 50) * 5;
          const currY = (p1.y + (p2.y - p1.y) * ratio - 50) * 4;

          // Drone or Vehicle Icon representation
          if (unit.type === 'drone') {
            // Drone Rotor Halo
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(currX, currY - 25, 14, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = '#c084fc';
            ctx.beginPath();
            ctx.arc(currX, currY - 25, 6, 0, Math.PI * 2);
            ctx.fill();

            // Altitude Shadow Projection Line
            ctx.strokeStyle = 'rgba(192, 132, 252, 0.3)';
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(currX, currY);
            ctx.lineTo(currX, currY - 25);
            ctx.stroke();
            ctx.setLineDash([]);
          } else {
            // Emergency / Fleet Vehicle
            ctx.fillStyle = unit.type === 'ambulance' ? '#10b981' : '#3b82f6';
            ctx.shadowColor = unit.type === 'ambulance' ? '#10b981' : '#3b82f6';
            ctx.shadowBlur = 10;
            ctx.fillRect(currX - 8, currY - 5, 16, 10);
            ctx.shadowBlur = 0;
          }
        });
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render3DCityCanvas);
    };

    render3DCityCanvas();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    isNightMode,
    pitchAngle,
    orbitAngle,
    zoomLevel,
    show3DBuildings,
    showPointCloud,
    showBimCityGML,
    showTrafficRays,
    showFleetDrones,
    trafficFilter
  ]);

  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col font-sans relative">
      {/* Top Engine & Mode Selector Bar */}
      <div className="p-4 bg-slate-950/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30">
            <Box className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-white">Gemelo Digital 3D & Tráfico en Tiempo Real</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                WEBGL / CESIUM LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Mapas vectoriales 3D, simulación de congestión, nubes de puntos LiDAR y ruteo OSRM.
            </p>
          </div>
        </div>

        {/* Engine Switcher Buttons */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setEngineMode('mapbox_3d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              engineMode === 'mapbox_3d'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Mapbox 3D WebGL</span>
          </button>

          <button
            onClick={() => setEngineMode('cesium_twin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              engineMode === 'cesium_twin'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>CesiumJS Gemelo Digital</span>
          </button>

          <button
            onClick={() => setEngineMode('osrm_route')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              engineMode === 'osrm_route'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Motor Ruteo OSRM</span>
          </button>
        </div>
      </div>

      {/* Traffic Filter Toolbar */}
      <div className="px-4 py-2.5 bg-slate-900/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider font-bold shrink-0">
            Filtro Tráfico:
          </span>

          <button
            onClick={() => setTrafficFilter('all')}
            className={`px-2.5 py-1 rounded-xl font-extrabold cursor-pointer transition-all shrink-0 ${
              trafficFilter === 'all'
                ? 'bg-white text-black shadow-md'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            Todos los Eventos
          </button>

          <button
            onClick={() => setTrafficFilter('critical_congestion')}
            className={`px-2.5 py-1 rounded-xl font-extrabold cursor-pointer transition-all flex items-center gap-1 shrink-0 ${
              trafficFilter === 'critical_congestion'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            <span>Congestión Alta</span>
          </button>

          <button
            onClick={() => setTrafficFilter('accidents')}
            className={`px-2.5 py-1 rounded-xl font-extrabold cursor-pointer transition-all flex items-center gap-1 shrink-0 ${
              trafficFilter === 'accidents'
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Accidentes en Vivo</span>
          </button>

          <button
            onClick={() => setTrafficFilter('roadworks')}
            className={`px-2.5 py-1 rounded-xl font-extrabold cursor-pointer transition-all flex items-center gap-1 shrink-0 ${
              trafficFilter === 'roadworks'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-blue-500/10 text-blue-300 hover:bg-blue-500/20'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>Obras / Fibra 5G</span>
          </button>
        </div>

        {/* Layer Toggles & Camera Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShow3DBuildings(!show3DBuildings)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
              show3DBuildings
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            Edificios 3D
          </button>

          <button
            onClick={() => setShowPointCloud(!showPointCloud)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
              showPointCloud
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            LiDAR Point Cloud
          </button>

          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
            title="Alternar Modo Noche / Día"
          >
            {isNightMode ? <Moon className="w-3.5 h-3.5 text-cyan-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Main 3D Viewport & Interactive Panels Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] relative">
        {/* Left Column: 3D Canvas Viewport */}
        <div className="lg:col-span-8 bg-black relative flex flex-col items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
          <canvas
            ref={canvasRef}
            width={720}
            height={460}
            className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
          />

          {/* Viewport Overlay Controls */}
          <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 space-y-2 text-xs text-slate-300 z-10 max-w-[200px]">
            <div className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Controles Cámara 3D</span>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Inclinación (Pitch)</span>
                <span className="font-mono text-cyan-300">{pitchAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="75"
                value={pitchAngle}
                onChange={(e) => setPitchAngle(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Órbita 360°</span>
                <span className="font-mono text-cyan-300">{orbitAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={orbitAngle}
                onChange={(e) => setOrbitAngle(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Zoom WebGL</span>
                <span className="font-mono text-cyan-300">{zoomLevel.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.0"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1"
              />
            </div>
          </div>

          {/* Bottom Viewport Telemetry Badge */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono z-10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>60 FPS Render</span>
              </div>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">
                Latencia API: <strong className="text-cyan-400">12ms</strong>
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">
                Formato CityGML / BIM: <strong className="text-purple-400">LOD 3.2</strong>
              </span>
            </div>

            <div className="text-slate-400 text-[11px]">
              Coordenadas: 19.4326° N, 99.1332° W
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Info Sidebar (Incident details, OSRM Route Planner, Drone Telemetry) */}
        <div className="lg:col-span-4 bg-slate-950 p-4 space-y-4 flex flex-col justify-between overflow-y-auto max-h-[500px]">
          {/* Mode Specific Panel */}
          {engineMode === 'mapbox_3d' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Incidentes & Congestión en Vivo</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {MOCK_INCIDENTS.length} Activos
                </span>
              </div>

              <div className="space-y-2">
                {MOCK_INCIDENTS.map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedIncident?.id === inc.id
                        ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-xs text-white">{inc.title}</div>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md uppercase ${
                          inc.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        +{inc.delayMinutes} min
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1">{inc.location}</p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mt-2 pt-2 border-t border-white/5">
                      <span>Velocidad promedio: <strong className="text-cyan-400">{inc.speedKmh} km/h</strong></span>
                      <span className="text-xs text-cyan-400 font-bold flex items-center gap-1">
                        Ver en Mapa <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {engineMode === 'cesium_twin' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>Flotas & Drones Geoespaciales</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  {INITIAL_FLEET.length} Unidades
                </span>
              </div>

              <div className="space-y-2">
                {INITIAL_FLEET.map((unit) => (
                  <div
                    key={unit.id}
                    onClick={() => setSelectedFleetUnit(unit)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedFleetUnit?.id === unit.id
                        ? 'bg-purple-500/10 border-purple-500/50 shadow-md'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-white flex items-center gap-1.5">
                        <span className="p-1 rounded-lg bg-purple-500/20 text-purple-300">
                          {unit.type === 'drone' ? <Bot className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                        </span>
                        <span>{unit.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        Batería: {unit.batteryPercent}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300 mt-2 bg-black/40 p-2 rounded-xl">
                      <div>Velocidad: <strong className="text-cyan-300">{unit.speedKmh} km/h</strong></div>
                      <div>ETA Destino: <strong className="text-purple-300">{unit.etaMinutes} min</strong></div>
                      {unit.altitudeMeters && <div>Altitud: <strong className="text-amber-300">{unit.altitudeMeters}m</strong></div>}
                      <div>Estado: <strong className="text-emerald-300 uppercase">{unit.status}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {engineMode === 'osrm_route' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  <span>Ruteo Inteligente OSRM Paso a Paso</span>
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Punto de Origen</label>
                  <input
                    type="text"
                    value={osrmOrigin}
                    onChange={(e) => setOsrmOrigin(e.target.value)}
                    className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-white font-mono focus:border-emerald-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Punto Objetivo</label>
                  <input
                    type="text"
                    value={osrmDestination}
                    onChange={(e) => setOsrmDestination(e.target.value)}
                    className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-white font-mono focus:border-emerald-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Instrucciones de Navegación OSRM:</div>
                {OSRM_NAV_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl text-[11px] border flex items-center justify-between gap-2 transition-all ${
                      idx + 1 === activeOsrmStep
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-white font-bold'
                        : 'bg-white/5 border-white/5 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-black/60 text-emerald-400 font-mono text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{step.text}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">{step.dist}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action CTA */}
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                setActiveOsrmStep((prev) => (prev % OSRM_NAV_STEPS.length) + 1);
              }}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold py-2.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Simular Paso OSRM Siguiente</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
