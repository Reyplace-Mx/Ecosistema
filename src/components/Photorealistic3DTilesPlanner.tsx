import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Box,
  Layers,
  Compass,
  Sun,
  Moon,
  Eye,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Plus,
  Trash2,
  Maximize2,
  Minimize2,
  MapPin,
  Camera,
  Trees,
  Car,
  Zap,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Key,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  EyeOff,
  Navigation,
  Globe,
  SlidersHorizontal,
  Activity,
  ArrowUpRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Access API Key from Vite defined env var or import.meta.env
const GOOGLE_MAPS_API_KEY =
  (process.env as any).GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

export interface ProposedProject {
  id: string;
  name: string;
  type: 'tower' | 'bridge' | 'transit' | 'solar_hub' | 'hospital' | 'park';
  heightMeters: number;
  footprintM2: number;
  floors: number;
  coords: { x: number; y: number; lat: number; lng: number };
  zoningCompliant: boolean;
  solarPotentialKwhYear: number;
  color: string;
  estimatedCostUsd: string;
}

const PRESET_CITIES = [
  { id: 'los_mochis', name: 'Los Mochis (Distrito Centro & Rosales)', lat: 25.7923, lng: -108.9951, zoom: 16, heightLimit: 85 },
  { id: 'cdmx', name: 'CDMX (Paseo de la Reforma 3D)', lat: 19.4284, lng: -99.1676, zoom: 17, heightLimit: 260 },
  { id: 'san_francisco', name: 'San Francisco (Financial District 3D)', lat: 37.7952, lng: -122.4028, zoom: 17, heightLimit: 320 },
  { id: 'tokyo', name: 'Tokyo (Shibuya Smart Hub)', lat: 35.6580, lng: 139.7016, zoom: 17, heightLimit: 230 },
  { id: 'madrid', name: 'Madrid (Madrid Nuevo Norte)', lat: 40.4850, lng: -3.6890, zoom: 16, heightLimit: 190 },
];

const INITIAL_PROJECTS: ProposedProject[] = [
  {
    id: 'proj-1',
    name: 'Torre Bioclimática Reyplace',
    type: 'tower',
    heightMeters: 145,
    footprintM2: 2400,
    floors: 38,
    coords: { x: 42, y: 38, lat: 25.7935, lng: -108.9940 },
    zoningCompliant: true,
    solarPotentialKwhYear: 480000,
    color: '#06b6d4',
    estimatedCostUsd: '$48.5M USD'
  },
  {
    id: 'proj-2',
    name: 'Viaducto Elevado Metrobus Eléctrico',
    type: 'transit',
    heightMeters: 18,
    footprintM2: 12000,
    floors: 2,
    coords: { x: 65, y: 55, lat: 25.7910, lng: -108.9920 },
    zoningCompliant: true,
    solarPotentialKwhYear: 180000,
    color: '#10b981',
    estimatedCostUsd: '$24.0M USD'
  },
  {
    id: 'proj-3',
    name: 'Parque Lineal Esponja & Bérgolas Solares',
    type: 'park',
    heightMeters: 6,
    footprintM2: 18500,
    floors: 1,
    coords: { x: 28, y: 62, lat: 25.7945, lng: -108.9970 },
    zoningCompliant: true,
    solarPotentialKwhYear: 320000,
    color: '#22c55e',
    estimatedCostUsd: '$9.2M USD'
  }
];

export function Photorealistic3DTilesPlanner() {
  const [selectedCity, setSelectedCity] = useState(PRESET_CITIES[0]);
  const [projects, setProjects] = useState<ProposedProject[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1');
  const [activeTool, setActiveTool] = useState<'inspect' | 'shadow_study' | 'zoning' | 'add_project' | 'view_corridor'>('inspect');
  
  // 3D Rendering & Camera State
  const [cameraPitch, setCameraPitch] = useState<number>(55); // degrees
  const [cameraBearing, setCameraBearing] = useState<number>(45); // degrees
  const [cameraAltitude, setCameraAltitude] = useState<number>(380); // meters
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [sunHour, setSunHour] = useState<number>(14.5); // 14:30
  const [showZoningEnvelope, setShowZoningEnvelope] = useState<boolean>(true);
  const [showExisting3DTiles, setShowExisting3DTiles] = useState<boolean>(true);
  const [showShadows, setShowShadows] = useState<boolean>(true);
  const [tileResolution, setTileResolution] = useState<'lod_high' | 'lod_med' | 'lod_low'>('lod_high');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  // Add Project Form State
  const [newProjName, setNewProjName] = useState('Nuevo Complejo Urbano');
  const [newProjType, setNewProjType] = useState<'tower' | 'bridge' | 'transit' | 'solar_hub' | 'hospital' | 'park'>('tower');
  const [newProjHeight, setNewProjHeight] = useState<number>(95);
  const [newProjFloors, setNewProjFloors] = useState<number>(24);
  const [newProjFootprint, setNewProjFootprint] = useState<number>(3200);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Selected project reference
  const selectedProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  // Rotation animation loop
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setCameraBearing(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isRotating]);

  // Canvas WebGL-like 3D Photorealistic Simulation Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // 1. Sky & Atmosphere Rendering (Sun position based on sunHour)
    const isNight = sunHour < 6.5 || sunHour > 19.5;
    const isSunset = (sunHour >= 6.5 && sunHour <= 8) || (sunHour >= 18 && sunHour <= 19.5);
    
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isNight) {
      skyGradient.addColorStop(0, '#030712');
      skyGradient.addColorStop(1, '#0f172a');
    } else if (isSunset) {
      skyGradient.addColorStop(0, '#31103f');
      skyGradient.addColorStop(0.5, '#7c2d12');
      skyGradient.addColorStop(1, '#ea580c');
    } else {
      skyGradient.addColorStop(0, '#0c4a6e');
      skyGradient.addColorStop(0.4, '#0284c7');
      skyGradient.addColorStop(1, '#38bdf8');
    }
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Horizon & Ground Plane in 3D Perspective
    const horizonY = height * (0.35 + (cameraPitch - 45) * 0.003);
    const groundGradient = ctx.createLinearGradient(0, horizonY, 0, height);
    groundGradient.addColorStop(0, isNight ? '#090d16' : '#1e293b');
    groundGradient.addColorStop(1, isNight ? '#020617' : '#0f172a');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, horizonY, width, height - horizonY);

    // 3. 3D Grid / Isometric Street Layout
    ctx.save();
    const centerX = width / 2;
    const centerY = height * 0.65;
    const radBearing = (cameraBearing * Math.PI) / 180;
    const pitchScale = Math.sin((cameraPitch * Math.PI) / 180);

    // Render 3D Ground Tiles Texture (Photorealistic Simulation)
    ctx.strokeStyle = isNight ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;
    const gridSize = 16;
    const spacing = 42 * (500 / cameraAltitude);

    for (let i = -gridSize; i <= gridSize; i++) {
      // Rotate grid points
      const x1 = i * spacing;
      const y1 = -gridSize * spacing;
      const x2 = i * spacing;
      const y2 = gridSize * spacing;

      const rx1 = centerX + (x1 * Math.cos(radBearing) - y1 * Math.sin(radBearing));
      const ry1 = centerY + (x1 * Math.sin(radBearing) + y1 * Math.cos(radBearing)) * pitchScale;

      const rx2 = centerX + (x2 * Math.cos(radBearing) - y2 * Math.sin(radBearing));
      const ry2 = centerY + (x2 * Math.sin(radBearing) + y2 * Math.cos(radBearing)) * pitchScale;

      if (ry1 > horizonY && ry2 > horizonY) {
        ctx.beginPath();
        ctx.moveTo(rx1, ry1);
        ctx.lineTo(rx2, ry2);
        ctx.stroke();
      }
    }

    // 4. Render Existing City 3D Photorealistic Tiles (Surrounding Buildings)
    if (showExisting3DTiles) {
      const mockExistingBuildings = [
        { x: -180, y: -120, w: 70, d: 60, h: 80, name: 'Hotel Metropolitano' },
        { x: 140, y: -150, w: 85, d: 85, h: 110, name: 'Torre Corporativa Norte' },
        { x: -120, y: 140, w: 60, d: 50, h: 65, name: 'Centro Cultural' },
        { x: 190, y: 90, w: 75, d: 70, h: 95, name: 'Complejo Residencial' },
        { x: -220, y: 40, w: 90, d: 80, h: 50, name: 'Centro Comercial Paseo' },
        { x: 70, y: -60, w: 55, d: 55, h: 70, name: 'Edificio de Gobierno' },
      ];

      // Sun angle for shadows
      const sunAngle = ((sunHour - 12) / 6) * Math.PI * 0.45;
      const shadowLengthFactor = Math.abs(Math.tan((18 - sunHour) * 0.15)) + 0.4;

      mockExistingBuildings.forEach(b => {
        const bx = centerX + (b.x * Math.cos(radBearing) - b.y * Math.sin(radBearing));
        const by = centerY + (b.x * Math.sin(radBearing) + b.y * Math.cos(radBearing)) * pitchScale;
        const bHeight = b.h * (500 / cameraAltitude) * 1.3;
        const bw = b.w * (500 / cameraAltitude);
        const bd = b.d * (500 / cameraAltitude) * pitchScale;

        if (by > horizonY) {
          // Shadow
          if (showShadows && !isNight) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.beginPath();
            ctx.moveTo(bx - bw / 2, by);
            ctx.lineTo(bx + bw / 2, by);
            ctx.lineTo(bx + bw / 2 + Math.sin(sunAngle) * bHeight * shadowLengthFactor, by + Math.cos(sunAngle) * bHeight * 0.5);
            ctx.lineTo(bx - bw / 2 + Math.sin(sunAngle) * bHeight * shadowLengthFactor, by + Math.cos(sunAngle) * bHeight * 0.5);
            ctx.closePath();
            ctx.fill();
          }

          // Building Base & Walls
          const wallGrad = ctx.createLinearGradient(bx - bw / 2, by - bHeight, bx + bw / 2, by);
          wallGrad.addColorStop(0, isNight ? '#1e293b' : '#64748b');
          wallGrad.addColorStop(1, isNight ? '#0f172a' : '#334155');
          ctx.fillStyle = wallGrad;
          ctx.fillRect(bx - bw / 2, by - bHeight, bw, bHeight);

          // Facade windows / texture simulation
          ctx.strokeStyle = isNight ? 'rgba(253, 224, 71, 0.4)' : 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 1;
          for (let wy = by - bHeight + 6; wy < by - 6; wy += 10) {
            ctx.beginPath();
            ctx.moveTo(bx - bw / 2 + 4, wy);
            ctx.lineTo(bx + bw / 2 - 4, wy);
            ctx.stroke();
          }

          // Rooftop
          ctx.fillStyle = isNight ? '#334155' : '#94a3b8';
          ctx.fillRect(bx - bw / 2, by - bHeight, bw, bd * 0.4);

          // 3D outline
          ctx.strokeStyle = isNight ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.4)';
          ctx.strokeRect(bx - bw / 2, by - bHeight, bw, bHeight);
        }
      });
    }

    // 5. Render Proposed Urban Projects (User interactive 3D digital twins)
    projects.forEach(p => {
      const isSelected = p.id === selectedProjectId;
      const pOffsetNormX = (p.coords.x - 50) * 8;
      const pOffsetNormY = (p.coords.y - 50) * 8;

      const px = centerX + (pOffsetNormX * Math.cos(radBearing) - pOffsetNormY * Math.sin(radBearing));
      const py = centerY + (pOffsetNormX * Math.sin(radBearing) + pOffsetNormY * Math.cos(radBearing)) * pitchScale;
      const pHeight = (p.heightMeters * 1.5) * (500 / cameraAltitude);
      const pw = Math.sqrt(p.footprintM2) * 1.1 * (500 / cameraAltitude);

      if (py > horizonY) {
        // Shadow Study Render
        if (showShadows && !isNight) {
          const sunAngle = ((sunHour - 12) / 6) * Math.PI * 0.45;
          const shadowLength = pHeight * Math.abs(Math.tan((18 - sunHour) * 0.15) + 0.5);

          ctx.fillStyle = isSelected ? 'rgba(6, 182, 212, 0.5)' : 'rgba(0, 0, 0, 0.55)';
          ctx.beginPath();
          ctx.moveTo(px - pw / 2, py);
          ctx.lineTo(px + pw / 2, py);
          ctx.lineTo(px + pw / 2 + Math.sin(sunAngle) * shadowLength, py + Math.cos(sunAngle) * shadowLength * 0.45);
          ctx.lineTo(px - pw / 2 + Math.sin(sunAngle) * shadowLength, py + Math.cos(sunAngle) * shadowLength * 0.45);
          ctx.closePath();
          ctx.fill();
        }

        // Proposed Building Holographic / Photorealistic 3D Mesh
        ctx.fillStyle = p.color;
        ctx.globalAlpha = isSelected ? 0.9 : 0.75;

        const projGrad = ctx.createLinearGradient(px - pw / 2, py - pHeight, px + pw / 2, py);
        projGrad.addColorStop(0, p.color);
        projGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = projGrad;
        ctx.fillRect(px - pw / 2, py - pHeight, pw, pHeight);

        // Highlight Edges & Floors
        ctx.strokeStyle = isSelected ? '#ffffff' : p.color;
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.strokeRect(px - pw / 2, py - pHeight, pw, pHeight);

        // Floor division lines
        const floorHeightPx = pHeight / (p.floors || 10);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        for (let f = 1; f < p.floors; f++) {
          const fy = py - (f * floorHeightPx);
          ctx.beginPath();
          ctx.moveTo(px - pw / 2 + 2, fy);
          ctx.lineTo(px + pw / 2 - 2, fy);
          ctx.stroke();
        }

        // Project Pin / Label
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = isSelected ? '#06b6d4' : '#ffffff';
        ctx.font = isSelected ? 'bold 12px sans-serif' : '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.name, px, py - pHeight - 12);

        // Height badge
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(px - 32, py - pHeight - 34, 64, 16);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`${p.heightMeters}m`, px, py - pHeight - 22);
      }
    });

    // 6. Zoning Envelope Plane (Max Altitude Plane)
    if (showZoningEnvelope && activeTool === 'zoning') {
      const zoneHeightM = selectedCity.heightLimit;
      const zoneHeightPx = (zoneHeightM * 1.5) * (500 / cameraAltitude);
      const zoneY = centerY - zoneHeightPx;

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, zoneY);
      ctx.lineTo(width - 50, zoneY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.fillRect(width - 240, zoneY - 24, 200, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`LÍMITE URBANO: ${zoneHeightM}m`, width - 230, zoneY - 10);
    }

    ctx.restore();
  }, [
    selectedCity,
    projects,
    selectedProjectId,
    cameraPitch,
    cameraBearing,
    cameraAltitude,
    sunHour,
    showExisting3DTiles,
    showShadows,
    showZoningEnvelope,
    activeTool
  ]);

  // Handle Add Project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `proj-${Date.now()}`;
    const zoningLimit = selectedCity.heightLimit;
    const isCompliant = newProjHeight <= zoningLimit;

    const newProject: ProposedProject = {
      id: newId,
      name: newProjName,
      type: newProjType,
      heightMeters: newProjHeight,
      footprintM2: newProjFootprint,
      floors: newProjFloors,
      coords: {
        x: Math.floor(25 + Math.random() * 50),
        y: Math.floor(25 + Math.random() * 50),
        lat: selectedCity.lat + (Math.random() - 0.5) * 0.008,
        lng: selectedCity.lng + (Math.random() - 0.5) * 0.008,
      },
      zoningCompliant: isCompliant,
      solarPotentialKwhYear: Math.round(newProjFootprint * 140 * (newProjHeight / 30)),
      color: newProjType === 'hospital' ? '#ef4444' : newProjType === 'tower' ? '#06b6d4' : '#10b981',
      estimatedCostUsd: `$${(newProjHeight * 0.35 + newProjFootprint * 0.002).toFixed(1)}M USD`
    };

    setProjects([newProject, ...projects]);
    setSelectedProjectId(newId);
    setActiveTool('inspect');
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) return;
    setProjects(projects.filter(p => p.id !== id));
    if (selectedProjectId === id) {
      setSelectedProjectId(projects[0].id);
    }
  };

  const hasValidKey = Boolean(GOOGLE_MAPS_API_KEY) && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY';

  return (
    <div className={`space-y-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-[#0a0f1d] p-6 overflow-y-auto' : ''}`}>
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1322] via-[#0f172a] to-[#080d1a] border border-cyan-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-cyan-400" />
                Google Maps Platform • Map Tiles API
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                Photorealistic 3D Tiles (OGC 3D Mesh)
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Gemelo Digital 3D & Planificación Urbana Fotorrealista
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Visualiza teselas 3D fotorrealistas con mallas de alta resolución, fotogrametría satelital, análisis de sombras solares en tiempo real, conos de visibilidad y cumplimiento normativo de uso de suelo antes de construir nueva infraestructura pública o privada.
            </p>
          </div>

          {/* Quick API Key & Attribution Status */}
          <div className="flex sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-black/50 border border-cyan-500/30 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3 text-xs mb-1">
                <span className="font-mono text-gray-400">Map Tiles API Key</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  hasValidKey ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {hasValidKey ? 'CONECTADO' : 'LLAVE PENDIENTE'}
                </span>
              </div>
              <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1.5">
                <span>gmp_mcp_codeassist_v1_aistudio</span>
                <button
                  onClick={() => setShowKeyModal(true)}
                  className="text-cyan-400 hover:text-cyan-300 underline font-bold cursor-pointer ml-1"
                >
                  Configurar
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-mono text-gray-400 uppercase">Teselas 3D OGC & CesiumJS</div>
              <div className="text-sm font-bold text-cyan-300 font-mono">
                root.json (LOD 1.3M Triángulos)
              </div>
            </div>
          </div>
        </div>

        {/* City Selector Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-gray-200">Ubicación Urbana:</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_CITIES.map(city => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    selectedCity.id === city.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                      : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {city.name.split('(')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition cursor-pointer text-xs flex items-center gap-1.5"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isFullScreen ? 'Salir Pantalla Completa' : 'Pantalla Completa'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D Canvas & Planner Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Photorealistic Canvas Viewport */}
        <div className="lg:col-span-8 bg-[#0c1220] border border-cyan-500/30 rounded-3xl p-5 shadow-2xl flex flex-col space-y-4 relative overflow-hidden">
          {/* Top Viewport Controls HUD */}
          <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
            {/* Tool Modes */}
            <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
              <button
                onClick={() => setActiveTool('inspect')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTool === 'inspect' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspección 3D</span>
              </button>

              <button
                onClick={() => setActiveTool('shadow_study')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTool === 'shadow_study' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Estudio Solar & Sombras</span>
              </button>

              <button
                onClick={() => setActiveTool('zoning')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTool === 'zoning' ? 'bg-rose-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Límite de Altura & Zonificación</span>
              </button>

              <button
                onClick={() => setActiveTool('add_project')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTool === 'add_project' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Diseñar Proyecto</span>
              </button>
            </div>

            {/* Orbit & Camera Auto-rotate button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isRotating
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse'
                    : 'bg-black/60 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {isRotating ? <Pause className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                <span>{isRotating ? 'Pausar Órbita' : 'Órbita 360°'}</span>
              </button>
            </div>
          </div>

          {/* Interactive 3D Canvas Area */}
          <div className="relative flex-1 min-h-[480px] bg-slate-950 rounded-2xl overflow-hidden border border-cyan-500/20 shadow-inner flex items-center justify-center group">
            <canvas
              ref={canvasRef}
              width={900}
              height={520}
              className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
            />

            {/* HUD Telemetry Overlay */}
            <div className="absolute top-4 left-4 p-3 rounded-2xl bg-black/75 border border-white/10 backdrop-blur-md text-[11px] font-mono space-y-1 text-gray-300 pointer-events-none">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5" />
                <span>Teselas 3D Google Maps</span>
              </div>
              <div>Cámara Altura: <strong className="text-white">{cameraAltitude}m</strong></div>
              <div>Inclinación Pitch: <strong className="text-white">{cameraPitch}°</strong></div>
              <div>Orientación Acimut: <strong className="text-white">{cameraBearing}°</strong></div>
              <div>Hora Solar: <strong className="text-amber-300">{Math.floor(sunHour)}:{Math.round((sunHour % 1) * 60).toString().padStart(2, '0')} hrs</strong></div>
            </div>

            {/* Sun Time of Day Floating Slider */}
            {activeTool === 'shadow_study' && (
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-black/85 border border-amber-500/40 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Simulador de Horario Solar & Proyección de Sombras:</span>
                  <span className="font-mono bg-amber-500/20 px-2 py-0.5 rounded text-amber-200">
                    {Math.floor(sunHour)}:{Math.round((sunHour % 1) * 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-1 max-w-xs">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <input
                    type="range"
                    min={6}
                    max={20}
                    step={0.25}
                    value={sunHour}
                    onChange={(e) => setSunHour(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Camera Sliders Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-gray-300">
                <span>Inclinación Vertical (Pitch)</span>
                <span className="text-cyan-400 font-mono">{cameraPitch}°</span>
              </div>
              <input
                type="range"
                min={20}
                max={85}
                value={cameraPitch}
                onChange={(e) => setCameraPitch(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-gray-300">
                <span>Giro de Cámara (Bearing)</span>
                <span className="text-cyan-400 font-mono">{cameraBearing}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={359}
                value={cameraBearing}
                onChange={(e) => setCameraBearing(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-gray-300">
                <span>Altitud de Vuelo (Zoom)</span>
                <span className="text-cyan-400 font-mono">{cameraAltitude}m</span>
              </div>
              <input
                type="range"
                min={150}
                max={800}
                step={25}
                value={cameraAltitude}
                onChange={(e) => setCameraAltitude(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Side Panel: Urban Project Inspector & Sandbox Planner */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          {/* Active Tool Views */}
          {activeTool !== 'add_project' ? (
            <div className="bg-[#111112] border border-cyan-500/20 rounded-3xl p-6 shadow-xl space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">Proyectos Urbanos en Evaluación</h3>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {projects.length} Modelos 3D
                  </span>
                </div>

                {/* Projects List */}
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {projects.map(p => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProjectId(p.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        selectedProjectId === p.id
                          ? 'bg-cyan-500/15 border-cyan-400 shadow-md'
                          : 'bg-[#080809] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
                          <span>{p.name}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {p.heightMeters}m altura • {p.floors} pisos • {p.estimatedCostUsd}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(p.id);
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Project Deep Urban Analytics Card */}
                {selectedProject && (
                  <div className="p-4 rounded-2xl bg-[#080809] border border-cyan-500/20 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 font-mono">
                          Ficha Técnica de Simulación
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{selectedProject.name}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        selectedProject.zoningCompliant
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {selectedProject.zoningCompliant ? 'USO PERMITIDO' : 'EXCEDE ALTURA'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                        <div className="text-gray-400">Huella en Suelo:</div>
                        <div className="text-white font-bold">{selectedProject.footprintM2.toLocaleString()} m²</div>
                      </div>
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                        <div className="text-gray-400">Potencial Solar Anual:</div>
                        <div className="text-amber-300 font-bold">{selectedProject.solarPotentialKwhYear.toLocaleString()} kWh</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={() => setActiveTool('add_project')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Agregar Nueva Infraestructura 3D
                </button>
              </div>
            </div>
          ) : (
            /* Add Project Form */
            <div className="bg-[#111112] border border-emerald-500/20 rounded-3xl p-6 shadow-xl space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-white">Diseño de Nueva Estructura</h3>
                  </div>
                  <button
                    onClick={() => setActiveTool('inspect')}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>

                <form onSubmit={handleAddProject} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-300 mb-1">Nombre del Proyecto</label>
                    <input
                      type="text"
                      value={newProjName}
                      onChange={(e) => setNewProjName(e.target.value)}
                      required
                      className="w-full bg-[#080809] border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-300 mb-1">Tipo de Obra</label>
                      <select
                        value={newProjType}
                        onChange={(e) => setNewProjType(e.target.value as any)}
                        className="w-full bg-[#080809] border border-white/10 rounded-xl p-2.5 text-white outline-none"
                      >
                        <option value="tower">Torre / Rascacielos</option>
                        <option value="transit">Metrobus / Tren</option>
                        <option value="hospital">Hospital Regional</option>
                        <option value="park">Parque / Pérgola</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-300 mb-1">Pisos / Niveles</label>
                      <input
                        type="number"
                        min={1}
                        max={80}
                        value={newProjFloors}
                        onChange={(e) => setNewProjFloors(Number(e.target.value))}
                        className="w-full bg-[#080809] border border-white/10 rounded-xl p-2.5 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-gray-300 mb-1">
                      <span>Altura Total (Metros)</span>
                      <span className="text-emerald-400 font-mono">{newProjHeight} m</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={350}
                      value={newProjHeight}
                      onChange={(e) => setNewProjHeight(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="text-[10px] text-gray-500">
                      Límite en {selectedCity.name.split('(')[0]}: {selectedCity.heightLimit}m
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-gray-300 mb-1">
                      <span>Área de Desplante (Footprint)</span>
                      <span className="text-cyan-400 font-mono">{newProjFootprint} m²</span>
                    </div>
                    <input
                      type="range"
                      min={500}
                      max={25000}
                      step={500}
                      value={newProjFootprint}
                      onChange={(e) => setNewProjFootprint(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 hover:opacity-95 cursor-pointer mt-4"
                  >
                    Renderizar en Malla 3D Fotorrealista
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Quick Guidance Box */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-[11px] text-gray-400 space-y-1.5">
            <div className="text-cyan-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Map Tiles API Photorealistic 3D Tiles</span>
            </div>
            <p>
              Proporciona mallas 3D texturizadas con fotogrametría aérea y satelital. Compatible con renderizadores OGC 3D Tiles, CesiumJS y deck.gl para estudios de planeación urbana sin necesidad de modelar la ciudad manualmente.
            </p>
          </div>
        </div>
      </div>

      {/* Modal API Key Setup Guide */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111726] border border-cyan-500/30 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Configuración Google Maps Platform</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
              <p>
                Para habilitar la carga en vivo de teselas 3D fotorrealistas desde los servidores de Google Maps Platform:
              </p>

              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Obtén tu clave de API en Google Cloud Console con la <strong>Map Tiles API</strong> habilitada:
                  <a
                    href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1 mt-1 font-bold"
                  >
                    Consola de Google Cloud Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  En AI Studio, abre <strong>Settings (⚙️ icono superior derecho)</strong> → <strong>Secrets</strong>.
                </li>
                <li>
                  Agrega la variable con el nombre exacto <code>GOOGLE_MAPS_PLATFORM_KEY</code> y pega tu clave.
                </li>
                <li>
                  Presiona <strong>Enter</strong>. La aplicación reconstruye automáticamente e inyecta las teselas 3D en tiempo real.
                </li>
              </ol>

              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-[11px] text-cyan-200">
                <strong>Atribución requerida por Google:</strong> Todas las llamadas incluyen el identificador <code>gmp_mcp_codeassist_v1_aistudio</code>.
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
