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
  Bot,
  Footprints,
  Plane,
  CornerDownRight,
  Clock,
  Gauge,
  Leaf,
  Globe,
  SlidersHorizontal,
  Route as RouteIcon,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export type EngineMode = 'cesium_globe' | 'mapbox_3d' | 'osrm_router';
export type RouteProfile = 'vehicular' | 'peatonal' | 'dron_vtol';
export type TrafficFilter = 'all' | 'critical_congestion' | 'accidents' | 'roadworks' | 'fluid';

export interface TrafficIncident {
  id: string;
  type: 'accident' | 'congestion' | 'roadwork';
  title: string;
  location: string;
  delayMinutes: number;
  severity: 'critical' | 'warning' | 'info';
  speedKmh: number;
  coords: { x: number; y: number; lat: number; lng: number };
  detectedAt: string;
  affectedLanes: string;
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

export interface OsrmWaypoint {
  id: string;
  name: string;
  type: 'origin' | 'destination' | 'waypoint';
  coords: { x: number; y: number; lat: number; lng: number };
}

export interface OsrmTurnStep {
  id: number;
  instruction: string;
  distance: string;
  duration: string;
  maneuver: 'depart' | 'turn_right' | 'turn_left' | 'straight' | 'crosswalk' | 'arrive';
  roadName: string;
  co2SavedKg?: number;
  trafficLevel: 'fluid' | 'moderate' | 'slow';
}

const PRESET_LOCATIONS: OsrmWaypoint[] = [
  { id: 'loc-1', name: 'Centro Cívico & Hub ReyID', type: 'origin', coords: { x: 25, y: 35, lat: 19.4326, lng: -99.1332 } },
  { id: 'loc-2', name: 'Hospital Central Smart 3D', type: 'destination', coords: { x: 75, y: 65, lat: 19.4410, lng: -99.1210 } },
  { id: 'loc-3', name: 'Distrito Financiero & Bolsa Tech', type: 'waypoint', coords: { x: 50, y: 40, lat: 19.4280, lng: -99.1450 } },
  { id: 'loc-4', name: 'Parque Lineal Peatonal & Bulevar Verde', type: 'waypoint', coords: { x: 35, y: 70, lat: 19.4385, lng: -99.1520 } },
  { id: 'loc-5', name: 'Puerto Seco & Terminal Multimodal', type: 'destination', coords: { x: 80, y: 25, lat: 19.4520, lng: -99.1105 } }
];

const MOCK_INCIDENTS: TrafficIncident[] = [
  {
    id: 'inc-1',
    type: 'accident',
    title: 'Colisión Múltiple - Av. Insurgentes Smart',
    location: 'Intersección Norte / Av. Insurgentes 3D',
    delayMinutes: 18,
    severity: 'critical',
    speedKmh: 8,
    coords: { x: 38, y: 42, lat: 19.4362, lng: -99.1384 },
    detectedAt: 'Hace 4 min (Cámara IA #84)',
    affectedLanes: '2 de 3 carriles bloqueados'
  },
  {
    id: 'inc-2',
    type: 'congestion',
    title: 'Congestión Pico - Bulevar Central V2X',
    location: 'Paso Elevado Sector Financiero',
    delayMinutes: 12,
    severity: 'warning',
    speedKmh: 15,
    coords: { x: 62, y: 58, lat: 19.4390, lng: -99.1280 },
    detectedAt: 'Hace 9 min (Sensor Radar IoT)',
    affectedLanes: 'Tráfico denso sostenido'
  },
  {
    id: 'inc-3',
    type: 'roadwork',
    title: 'Despliegue Fibra Óptica 5G & V2X',
    location: 'Anillo Periférico Inteligente Este',
    delayMinutes: 6,
    severity: 'info',
    speedKmh: 30,
    coords: { x: 75, y: 30, lat: 19.4470, lng: -99.1150 },
    detectedAt: 'Programada (Mantenimiento)',
    affectedLanes: '1 carril lateral cerrado'
  }
];

const INITIAL_FLEET: DroneFleetUnit[] = [
  {
    id: 'flt-1',
    name: 'Dron Patrulla Alpha-01 (IA Reybot)',
    type: 'drone',
    status: 'patrullando',
    speedKmh: 68,
    altitudeMeters: 125,
    batteryPercent: 88,
    destination: 'Zona Residencial Norte',
    etaMinutes: 4,
    coords: { x: 30, y: 25 },
    osrmPath: [{ x: 30, y: 25 }, { x: 45, y: 35 }, { x: 55, y: 40 }, { x: 65, y: 50 }]
  },
  {
    id: 'flt-2',
    name: 'Ambulancia Conectada V2X AM-04',
    type: 'ambulance',
    status: 'emergencia',
    speedKmh: 84,
    batteryPercent: 95,
    destination: 'Hospital Central Smart 3D',
    etaMinutes: 3,
    coords: { x: 20, y: 70 },
    osrmPath: [{ x: 20, y: 70 }, { x: 38, y: 65 }, { x: 50, y: 55 }, { x: 68, y: 45 }]
  },
  {
    id: 'flt-3',
    name: 'Patrulla Autónoma P-102',
    type: 'police',
    status: 'en_ruta',
    speedKmh: 52,
    batteryPercent: 79,
    destination: 'Cruce Av. Insurgentes',
    etaMinutes: 5,
    coords: { x: 70, y: 75 },
    osrmPath: [{ x: 70, y: 75 }, { x: 60, y: 60 }, { x: 48, y: 48 }, { x: 38, y: 42 }]
  }
];

export function SmartCityTraffic3DWidget() {
  const [engineMode, setEngineMode] = useState<EngineMode>('cesium_globe');
  const [routeProfile, setRouteProfile] = useState<RouteProfile>('vehicular');
  const [trafficFilter, setTrafficFilter] = useState<TrafficFilter>('all');

  // Layer Visibility Controls
  const [show3DBuildings, setShow3DBuildings] = useState(true);
  const [showPointCloud, setShowPointCloud] = useState(true);
  const [showTrafficHeatmap, setShowTrafficHeatmap] = useState(true);
  const [showV2XSignals, setShowV2XSignals] = useState(true);
  const [showFleetDrones, setShowFleetDrones] = useState(true);
  const [showAccidentPins, setShowAccidentPins] = useState(true);
  const [isNightMode, setIsNightMode] = useState(true);

  // 3D Viewport Adjustments
  const [pitchAngle, setPitchAngle] = useState(48); // 0° - 75°
  const [orbitAngle, setOrbitAngle] = useState(30); // 0° - 360°
  const [zoomLevel, setZoomLevel] = useState(1.15); // 0.8 - 2.0
  const [globeRotation, setGlobeRotation] = useState(0);

  // Animation & Simulation State
  const [isSimulating, setIsSimulating] = useState(true);
  const [simStep, setSimStep] = useState(0);
  const [selectedIncident, setSelectedIncident] = useState<TrafficIncident | null>(MOCK_INCIDENTS[0]);
  const [selectedFleetUnit, setSelectedFleetUnit] = useState<DroneFleetUnit | null>(INITIAL_FLEET[0]);

  // OSRM Navigation Planner State
  const [originId, setOriginId] = useState('loc-1');
  const [destinationId, setDestinationId] = useState('loc-2');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  // Canvas Ref for WebGL/3D Render
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate dynamic steps based on profile and locations
  const originLoc = PRESET_LOCATIONS.find(l => l.id === originId) || PRESET_LOCATIONS[0];
  const destLoc = PRESET_LOCATIONS.find(l => l.id === destinationId) || PRESET_LOCATIONS[1];

  const getProfileSteps = (): OsrmTurnStep[] => {
    if (routeProfile === 'peatonal') {
      return [
        { id: 1, instruction: `Salida desde ${originLoc.name} por acera podotáctil`, distance: '120 m', duration: '2 min', maneuver: 'depart', roadName: 'Sendero Peatonal Seguro', co2SavedKg: 0.4, trafficLevel: 'fluid' },
        { id: 2, instruction: 'Cruce peatonal con sensor acústico y prioridad inteligente', distance: '40 m', duration: '1 min', maneuver: 'crosswalk', roadName: 'Paso Cebra Conectado V2P', co2SavedKg: 0.2, trafficLevel: 'fluid' },
        { id: 3, instruction: 'Giro a la izquierda por ciclovía y alameda arbolada', distance: '650 m', duration: '8 min', maneuver: 'turn_left', roadName: 'Parque Lineal Sustentable', co2SavedKg: 1.1, trafficLevel: 'fluid' },
        { id: 4, instruction: 'Paso por pasarela peatonal elevada iluminada por energía solar', distance: '300 m', duration: '4 min', maneuver: 'straight', roadName: 'Puente Peatonal Biorreactivo', co2SavedKg: 0.5, trafficLevel: 'fluid' },
        { id: 5, instruction: `Llegada a destino peatonal: ${destLoc.name}`, distance: '80 m', duration: '1 min', maneuver: 'arrive', roadName: 'Plaza de Acceso Inclusivo', co2SavedKg: 0.3, trafficLevel: 'fluid' }
      ];
    } else if (routeProfile === 'dron_vtol') {
      return [
        { id: 1, instruction: `Despegue vertical VTOL desde helipuerto de ${originLoc.name}`, distance: '50 m', duration: '0.5 min', maneuver: 'depart', roadName: 'Corredor Aéreo UTM-01', co2SavedKg: 1.8, trafficLevel: 'fluid' },
        { id: 2, instruction: 'Ascenso a altitud de crucero segura (120m AGL)', distance: '400 m', duration: '1 min', maneuver: 'straight', roadName: 'Capa Aérea Urbana Libre', co2SavedKg: 2.5, trafficLevel: 'fluid' },
        { id: 3, instruction: 'Navegación por vector directo geofence sobrepasando congestión terrestre', distance: '2.8 km', duration: '2.5 min', maneuver: 'straight', roadName: 'Skyway Autónomo Certificado', co2SavedKg: 4.2, trafficLevel: 'fluid' },
        { id: 4, instruction: `Aproximación y descenso guiado por baliza láser hacia ${destLoc.name}`, distance: '150 m', duration: '1 min', maneuver: 'arrive', roadName: 'Plataforma VTOL Inteligente', co2SavedKg: 1.2, trafficLevel: 'fluid' }
      ];
    }

    // Default: Vehicular
    return [
      { id: 1, instruction: `Incorporación desde ${originLoc.name} al carril inteligente V2X`, distance: '450 m', duration: '1.2 min', maneuver: 'depart', roadName: 'Av. Conectada de Acceso Rápido', trafficLevel: 'fluid' },
      { id: 2, instruction: 'Continuar recto por Bulevar Smart Grid (Sincronización Ola Verde 60 km/h)', distance: '1.8 km', duration: '2.4 min', maneuver: 'straight', roadName: 'Bulevar Central', trafficLevel: 'fluid' },
      { id: 3, instruction: 'Giro a la derecha en Distribuidor Elevado para evadir accidente en Insurgentes', distance: '1.2 km', duration: '1.8 min', maneuver: 'turn_right', roadName: 'Anillo Periférico 3D', trafficLevel: 'moderate' },
      { id: 4, instruction: 'Incorporación a carril de desaceleración y acceso a bahía inteligente', distance: '600 m', duration: '1.1 min', maneuver: 'turn_left', roadName: 'Acceso Sur', trafficLevel: 'fluid' },
      { id: 5, instruction: `Llegada a destino vehicular: ${destLoc.name} (Bahía de estacionamiento reservada)`, distance: '100 m', duration: '0.5 min', maneuver: 'arrive', roadName: 'Zona Drop-off Automatizada', trafficLevel: 'fluid' }
    ];
  };

  const currentSteps = getProfileSteps();
  const totalDistance = routeProfile === 'peatonal' ? '1.19 km' : routeProfile === 'dron_vtol' ? '3.40 km' : '4.15 km';
  const totalDuration = routeProfile === 'peatonal' ? '16 min' : routeProfile === 'dron_vtol' ? '5.0 min' : '7.0 min';
  const co2Savings = routeProfile === 'peatonal' ? '2.5 kg CO₂' : routeProfile === 'dron_vtol' ? '9.7 kg CO₂' : '1.8 kg CO₂ (Ruta Eco)';

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

      ctx.clearRect(0, 0, width, height);

      // Background styling
      if (isNightMode) {
        const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 60, width / 2, height / 2, width);
        bgGradient.addColorStop(0, '#0a162d');
        bgGradient.addColorStop(1, '#020611');
        ctx.fillStyle = bgGradient;
      } else {
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, '#e2e8f0');
        bgGradient.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = bgGradient;
      }
      ctx.fillRect(0, 0, width, height);

      // ==========================================
      // ENGINE MODE 1: CESIUM VIRTUAL GLOBE 3D
      // ==========================================
      if (engineMode === 'cesium_globe') {
        const centerX = width / 2;
        const centerY = height / 2 + 10;
        const globeRadius = 145 * zoomLevel;

        // Atmospheric Scattering Outer Glow
        const atmosphereGrad = ctx.createRadialGradient(centerX, centerY, globeRadius * 0.9, centerX, centerY, globeRadius * 1.3);
        atmosphereGrad.addColorStop(0, 'rgba(0, 210, 255, 0.45)');
        atmosphereGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
        atmosphereGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = atmosphereGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, globeRadius * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Earth Globe Body with Night/Day texture shading
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
        ctx.clip();

        // Earth Base
        const earthGrad = ctx.createLinearGradient(centerX - globeRadius, centerY - globeRadius, centerX + globeRadius, centerY + globeRadius);
        earthGrad.addColorStop(0, isNightMode ? '#0f172a' : '#1e3a8a');
        earthGrad.addColorStop(0.4, isNightMode ? '#1e293b' : '#0284c7');
        earthGrad.addColorStop(1, isNightMode ? '#020617' : '#0369a1');
        ctx.fillStyle = earthGrad;
        ctx.fill();

        // Continent Landmasses & Urban Photogrammetry Textures
        ctx.fillStyle = isNightMode ? 'rgba(34, 197, 94, 0.15)' : 'rgba(74, 222, 128, 0.4)';
        ctx.strokeStyle = isNightMode ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;

        // Simulated globe latitude/longitude grid rings
        const rotationOffset = (globeRotation * Math.PI) / 180;
        for (let lat = -60; lat <= 60; lat += 30) {
          const latY = centerY + Math.sin((lat * Math.PI) / 180) * globeRadius;
          const latWidth = Math.cos((lat * Math.PI) / 180) * globeRadius;
          ctx.beginPath();
          ctx.ellipse(centerX, latY, latWidth, latWidth * 0.25, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Longitude arcs rotating
        for (let lng = 0; lng < 360; lng += 45) {
          const angle = ((lng + globeRotation) * Math.PI) / 180;
          const cosVal = Math.cos(angle);
          if (Math.sin(angle) > -0.2) { // visible hemisphere
            ctx.beginPath();
            ctx.ellipse(centerX + cosVal * (globeRadius * 0.6), centerY, Math.abs(cosVal) * globeRadius * 0.4 + 5, globeRadius, 0, 0, Math.PI * 2);
            ctx.strokeStyle = isNightMode ? 'rgba(0, 210, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)';
            ctx.stroke();
          }
        }

        // City Lights & CesiumJS 3D Regional Clusters
        const clusters = [
          { x: centerX - 40, y: centerY - 20, name: 'Distrito Central 3D', pulse: true, size: 8, color: '#38bdf8' },
          { x: centerX + 55, y: centerY + 15, name: 'Hospital Smart Hub', pulse: false, size: 6, color: '#a855f7' },
          { x: centerX - 25, y: centerY + 50, name: 'Puerto Seco Multimodal', pulse: true, size: 5, color: '#10b981' },
          { x: centerX + 30, y: centerY - 60, name: 'Parque Tecnológico', pulse: false, size: 6, color: '#f59e0b' }
        ];

        clusters.forEach((cluster) => {
          ctx.beginPath();
          ctx.arc(cluster.x, cluster.y, cluster.size, 0, Math.PI * 2);
          ctx.fillStyle = cluster.color;
          ctx.fill();

          if (cluster.pulse) {
            ctx.beginPath();
            ctx.arc(cluster.x, cluster.y, cluster.size + (Math.sin(Date.now() / 250) + 1) * 4, 0, Math.PI * 2);
            ctx.strokeStyle = cluster.color;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Label
          ctx.fillStyle = isNightMode ? '#ffffff' : '#0f172a';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(cluster.name, cluster.x + 10, cluster.y + 3);
        });

        // Trajectory Arc connecting nodes on Cesium Globe
        ctx.beginPath();
        ctx.moveTo(clusters[0].x, clusters[0].y);
        ctx.bezierCurveTo(centerX + 10, centerY - 60, centerX + 40, centerY - 20, clusters[1].x, clusters[1].y);
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();

        // 3D Globe Ring Indicator
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ==========================================
      // ENGINE MODE 2 & 3: MAPBOX 3D / OSRM ROUTING
      // ==========================================
      if (engineMode === 'mapbox_3d' || engineMode === 'osrm_router') {
        ctx.save();
        ctx.translate(width / 2, height / 2 + 20);

        const radOrbit = (orbitAngle * Math.PI) / 180;
        const pitchScale = Math.cos((pitchAngle * Math.PI) / 180) * 0.7 + 0.3;

        ctx.scale(zoomLevel, zoomLevel * pitchScale);
        ctx.rotate(radOrbit);

        // Ground Grid
        const gridSize = 450;
        ctx.strokeStyle = isNightMode ? 'rgba(0, 210, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 1;

        for (let x = -gridSize; x <= gridSize; x += 45) {
          ctx.beginPath();
          ctx.moveTo(x, -gridSize);
          ctx.lineTo(x, gridSize);
          ctx.stroke();
        }
        for (let y = -gridSize; y <= gridSize; y += 45) {
          ctx.beginPath();
          ctx.moveTo(-gridSize, y);
          ctx.lineTo(gridSize, y);
          ctx.stroke();
        }

        // Road Networks
        const roadColor = isNightMode ? '#0f2347' : '#cbd5e1';
        ctx.strokeStyle = roadColor;
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';

        // Major Arteries
        const roads = [
          [[-300, -100], [300, -100]],
          [[-300, 80], [300, 80]],
          [[-120, -300], [-120, 300]],
          [[140, -300], [140, 300]],
          [[-280, -280], [280, 280]]
        ];

        roads.forEach(([p1, p2]) => {
          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.stroke();
        });

        // Mapbox Real-Time Traffic Flow Colored Lines
        if (showTrafficHeatmap) {
          // Fluid Road (Green)
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.75)';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(-300, -100);
          ctx.lineTo(0, -100);
          ctx.stroke();

          // Moderate Congestion (Amber)
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
          ctx.beginPath();
          ctx.moveTo(0, -100);
          ctx.lineTo(300, -100);
          ctx.stroke();

          // Critical Congestion (Red / Pulsing)
          const pulseAlpha = 0.6 + Math.sin(Date.now() / 200) * 0.35;
          ctx.strokeStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(-120, -100);
          ctx.lineTo(-120, 80);
          ctx.stroke();
        }

        // 3D Extruded Buildings (LOD 3.2 CityGML / BIM)
        if (show3DBuildings) {
          const buildings = [
            { x: -220, y: -200, w: 70, h: 60, height3d: 90, color: '#1e3a8a', label: 'Torre ReyID' },
            { x: -60, y: -220, w: 80, h: 70, height3d: 130, color: '#0369a1', label: 'Hub Financiero' },
            { x: 180, y: -200, w: 75, h: 65, height3d: 110, color: '#4338ca', label: 'Centro I+D' },
            { x: -220, y: 120, w: 90, h: 70, height3d: 75, color: '#047857', label: 'Hospital Smart' },
            { x: -40, y: 130, w: 100, h: 80, height3d: 145, color: '#7c3aed', label: 'Cúpula Digital' },
            { x: 180, y: 120, w: 85, h: 75, height3d: 85, color: '#b45309', label: 'Puerto Seco' },
            { x: -50, y: -40, w: 95, h: 70, height3d: 160, color: '#0284c7', label: 'Sky Tower 3D' }
          ];

          buildings.forEach((b) => {
            const zH = b.height3d * 0.65;

            // Isometric Base
            ctx.fillStyle = isNightMode ? '#09152b' : '#94a3b8';
            ctx.fillRect(b.x, b.y, b.w, b.h);

            // Front/Side extrusion
            ctx.fillStyle = isNightMode ? '#0f294d' : '#64748b';
            ctx.beginPath();
            ctx.moveTo(b.x, b.y + b.h);
            ctx.lineTo(b.x + b.w, b.y + b.h);
            ctx.lineTo(b.x + b.w, b.y + b.h - zH);
            ctx.lineTo(b.x, b.y + b.h - zH);
            ctx.closePath();
            ctx.fill();

            // Right face
            ctx.fillStyle = isNightMode ? '#163c6e' : '#475569';
            ctx.beginPath();
            ctx.moveTo(b.x + b.w, b.y);
            ctx.lineTo(b.x + b.w, b.y + b.h);
            ctx.lineTo(b.x + b.w, b.y + b.h - zH);
            ctx.lineTo(b.x + b.w, b.y - zH);
            ctx.closePath();
            ctx.fill();

            // Roof Top
            ctx.fillStyle = isNightMode ? b.color : '#cbd5e1';
            ctx.fillRect(b.x, b.y - zH, b.w, b.h);

            // Roof Glow Edges
            ctx.strokeStyle = isNightMode ? 'rgba(56, 189, 248, 0.6)' : 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(b.x, b.y - zH, b.w, b.h);

            // Window illumination grid
            if (isNightMode) {
              ctx.fillStyle = 'rgba(254, 240, 138, 0.7)';
              for (let wx = b.x + 8; wx < b.x + b.w - 8; wx += 14) {
                for (let wy = b.y + 8 - zH; wy < b.y + b.h - 8; wy += 18) {
                  if ((wx + wy) % 2 === 0) {
                    ctx.fillRect(wx, wy, 5, 6);
                  }
                }
              }
            }
          });
        }

        // LiDAR Point Cloud Particles
        if (showPointCloud) {
          const time = Date.now() / 1000;
          ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
          for (let i = 0; i < 40; i++) {
            const px = Math.sin(i * 1.7 + time) * 260;
            const py = Math.cos(i * 2.3 + time * 0.8) * 220;
            const pz = (Math.sin(i + time * 2) + 1) * 35;
            ctx.beginPath();
            ctx.arc(px, py - pz, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // OSRM Active Trajectory Overlay
        if (engineMode === 'osrm_router') {
          const originCoords = { x: (originLoc.coords.x - 50) * 5, y: (originLoc.coords.y - 50) * 4 };
          const destCoords = { x: (destLoc.coords.x - 50) * 5, y: (destLoc.coords.y - 50) * 4 };

          // Glow Route Path
          ctx.beginPath();
          ctx.moveTo(originCoords.x, originCoords.y);
          ctx.lineTo(originCoords.x, (originCoords.y + destCoords.y) / 2);
          ctx.lineTo(destCoords.x, (originCoords.y + destCoords.y) / 2);
          ctx.lineTo(destCoords.x, destCoords.y);

          const routeColor = routeProfile === 'peatonal' ? '#10b981' : routeProfile === 'dron_vtol' ? '#a855f7' : '#06b6d4';
          ctx.strokeStyle = routeColor;
          ctx.lineWidth = routeProfile === 'peatonal' ? 5 : 7;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();

          // Animated Route Pulses along Path
          const progress = (Date.now() / 1500) % 1;
          const currentX = originCoords.x + (destCoords.x - originCoords.x) * progress;
          const currentY = originCoords.y + (destCoords.y - originCoords.y) * progress;

          ctx.beginPath();
          ctx.arc(currentX, currentY, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(currentX, currentY, 14, 0, Math.PI * 2);
          ctx.strokeStyle = routeColor;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Origin Pin
          ctx.beginPath();
          ctx.arc(originCoords.x, originCoords.y, 9, 0, Math.PI * 2);
          ctx.fillStyle = '#10b981';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Destination Pin
          ctx.beginPath();
          ctx.arc(destCoords.x, destCoords.y, 9, 0, Math.PI * 2);
          ctx.fillStyle = '#ef4444';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Live Incident Markers (Accidents / Collisions)
        if (showAccidentPins) {
          MOCK_INCIDENTS.forEach((inc) => {
            if (trafficFilter !== 'all' && trafficFilter !== 'accidents' && inc.type !== 'accident') return;

            const ix = (inc.coords.x - 50) * 6;
            const iy = (inc.coords.y - 50) * 5;

            ctx.beginPath();
            ctx.arc(ix, iy, 12, 0, Math.PI * 2);
            ctx.fillStyle = inc.severity === 'critical' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(245, 158, 11, 0.9)';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Pulsing Warning Wave
            ctx.beginPath();
            ctx.arc(ix, iy, 12 + (Math.sin(Date.now() / 200) + 1) * 6, 0, Math.PI * 2);
            ctx.strokeStyle = inc.severity === 'critical' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(245, 158, 11, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Exclamation Symbol
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText('!', ix - 2, iy + 4);
          });
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render3DCityCanvas);
    };

    render3DCityCanvas();

    // Auto rotate globe slightly
    const globeTimer = setInterval(() => {
      setGlobeRotation((prev) => (prev + 0.4) % 360);
    }, 50);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(globeTimer);
    };
  }, [
    engineMode,
    routeProfile,
    trafficFilter,
    show3DBuildings,
    showPointCloud,
    showTrafficHeatmap,
    showAccidentPins,
    isNightMode,
    pitchAngle,
    orbitAngle,
    zoomLevel,
    originId,
    destinationId,
    globeRotation
  ]);

  const triggerCalculateRoute = () => {
    setIsCalculatingRoute(true);
    setActiveStepIndex(0);
    setTimeout(() => {
      setIsCalculatingRoute(false);
    }, 450);
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header & Mode Switcher */}
      <div className="p-4 bg-slate-950 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400">
            <Globe className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">Gemelo Digital Geoespacial & Ruteo OSRM</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                CesiumJS / Mapbox 3D / OSRM
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Visualización en 3D con texturas urbanas, cálculo de rutas vehiculares y peatonales, y telemetría de tráfico en vivo.
            </p>
          </div>
        </div>

        {/* Engine Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
          <button
            onClick={() => setEngineMode('cesium_globe')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              engineMode === 'cesium_globe'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Globo CesiumJS 3D</span>
          </button>

          <button
            onClick={() => setEngineMode('mapbox_3d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              engineMode === 'mapbox_3d'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Mapbox 3D Urbano</span>
          </button>

          <button
            onClick={() => setEngineMode('osrm_router')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              engineMode === 'osrm_router'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Planificador OSRM</span>
          </button>
        </div>
      </div>

      {/* Secondary Controls & Layer Filters Toolbar */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Profile / Traffic Filters */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {engineMode === 'osrm_router' ? (
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/10">
              <span className="text-[10px] font-mono font-bold text-slate-400 px-2 uppercase">Perfil:</span>
              <button
                onClick={() => { setRouteProfile('vehicular'); triggerCalculateRoute(); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  routeProfile === 'vehicular' ? 'bg-cyan-500 text-black font-extrabold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Vehicular V2X</span>
              </button>
              <button
                onClick={() => { setRouteProfile('peatonal'); triggerCalculateRoute(); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  routeProfile === 'peatonal' ? 'bg-emerald-500 text-black font-extrabold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>Peatonal / Bici</span>
              </button>
              <button
                onClick={() => { setRouteProfile('dron_vtol'); triggerCalculateRoute(); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  routeProfile === 'dron_vtol' ? 'bg-purple-500 text-white font-extrabold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Dron / VTOL</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider font-bold shrink-0">
                Filtros Tráfico Mapbox:
              </span>
              <button
                onClick={() => setTrafficFilter('all')}
                className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-all ${
                  trafficFilter === 'all' ? 'bg-white text-black shadow' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setTrafficFilter('critical_congestion')}
                className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1 ${
                  trafficFilter === 'critical_congestion' ? 'bg-rose-500 text-white shadow' : 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                <span>Congestión</span>
              </button>
              <button
                onClick={() => setTrafficFilter('accidents')}
                className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1 ${
                  trafficFilter === 'accidents' ? 'bg-amber-500 text-black shadow' : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Accidentes ({MOCK_INCIDENTS.filter(i => i.type === 'accident').length})</span>
              </button>
            </div>
          )}
        </div>

        {/* 3D Layers Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShow3DBuildings(!show3DBuildings)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
              show3DBuildings ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            Edificios 3D
          </button>
          <button
            onClick={() => setShowTrafficHeatmap(!showTrafficHeatmap)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
              showTrafficHeatmap ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            Flujo Mapbox
          </button>
          <button
            onClick={() => setShowPointCloud(!showPointCloud)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
              showPointCloud ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            LiDAR
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

      {/* Main Viewport & Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px] relative">
        {/* 3D Canvas Viewport */}
        <div className="lg:col-span-8 bg-black relative flex flex-col items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
          <canvas
            ref={canvasRef}
            width={760}
            height={500}
            className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
          />

          {/* Floating 3D Camera Controls */}
          <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md p-3 rounded-2xl border border-white/10 space-y-2 text-xs text-slate-300 z-10 max-w-[200px] shadow-xl">
            <div className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> Cámara 3D
              </span>
              <button
                onClick={() => { setPitchAngle(48); setOrbitAngle(30); setZoomLevel(1.15); }}
                className="hover:text-white text-slate-500"
                title="Restablecer Cámara"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Inclinación Pitch</span>
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
                <span>Órbita Yaw</span>
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
                <span>Zoom Escala</span>
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

          {/* Bottom Telemetry Bar */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono z-10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Cesium WebGL 60 FPS</span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">
                LOD CityGML: <strong className="text-purple-400">3.2 Fotogrametría</strong>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">
                OSRM Latencia: <strong className="text-cyan-400">8.4 ms</strong>
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Georef: 19.4326° N, 99.1332° W (WGS84)
            </div>
          </div>
        </div>

        {/* Right Info / OSRM Navigation Sidebar */}
        <div className="lg:col-span-4 bg-slate-950 p-4 space-y-4 flex flex-col justify-between overflow-y-auto max-h-[520px]">
          {/* Engine: OSRM Route Planner */}
          {engineMode === 'osrm_router' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <RouteIcon className="w-4 h-4 text-emerald-400" />
                  <span>Cálculo de Rutas Inteligentes OSRM</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {routeProfile.toUpperCase()}
                </span>
              </div>

              {/* Origin & Destination Selectors */}
              <div className="space-y-2 text-xs bg-slate-900/80 p-3 rounded-2xl border border-white/10">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Origen de Salida:
                  </label>
                  <select
                    value={originId}
                    onChange={(e) => { setOriginId(e.target.value); triggerCalculateRoute(); }}
                    className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-sans text-xs focus:border-cyan-400 outline-none"
                  >
                    {PRESET_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Destino de Llegada:
                  </label>
                  <select
                    value={destinationId}
                    onChange={(e) => { setDestinationId(e.target.value); triggerCalculateRoute(); }}
                    className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-sans text-xs focus:border-cyan-400 outline-none"
                  >
                    {PRESET_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* OSRM Route Summary Cards */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-slate-900/80 border border-white/10 rounded-xl">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">Distancia</div>
                  <div className="text-xs font-bold text-cyan-400 mt-0.5">{totalDistance}</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 border border-white/10 rounded-xl">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">Tiempo ETA</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">{totalDuration}</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 border border-white/10 rounded-xl">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">Ahorro Eco</div>
                  <div className="text-xs font-bold text-purple-400 mt-0.5">{co2Savings}</div>
                </div>
              </div>

              {/* Turn by Turn Instructions List */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center justify-between">
                  <span>Instrucciones de Trayectoria ({currentSteps.length} tramos):</span>
                  <span className="text-emerald-400">OSRM v5.27</span>
                </div>

                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {currentSteps.map((step, idx) => (
                    <div
                      key={step.id}
                      onClick={() => setActiveStepIndex(idx)}
                      className={`p-2 rounded-xl text-[11px] border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        idx === activeStepIndex
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-white font-bold'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-black/60 text-emerald-400 font-mono text-[10px] flex items-center justify-center font-bold shrink-0">
                          {step.id}
                        </span>
                        <div className="leading-tight">
                          <div>{step.instruction}</div>
                          <div className="text-[9px] font-mono text-slate-400">{step.roadName}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[9px] font-mono text-cyan-300 font-bold">{step.distance}</div>
                        <div className="text-[9px] font-mono text-slate-500">{step.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Engine: Mapbox Traffic & Incidents */}
          {engineMode === 'mapbox_3d' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Incidentes en Tiempo Real (Mapbox)</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {MOCK_INCIDENTS.length} Reportes
                </span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
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
                    <div className="text-[10px] text-slate-500 mt-0.5">{inc.affectedLanes}</div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mt-2 pt-2 border-t border-white/5">
                      <span>Vel. Flujo: <strong className="text-cyan-400">{inc.speedKmh} km/h</strong></span>
                      <span className="text-xs text-cyan-400 font-bold flex items-center gap-1">
                        Centrar en 3D <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Engine: Cesium Virtual Globe Drones & Satellites */}
          {engineMode === 'cesium_globe' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>Flotas y Drones Conectados</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  {INITIAL_FLEET.length} Activos
                </span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
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
                        {unit.batteryPercent}% Bat.
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

          {/* Action CTA Button */}
          <div className="pt-2 border-t border-white/10">
            {engineMode === 'osrm_router' ? (
              <button
                onClick={() => {
                  setActiveStepIndex((prev) => (prev + 1) % currentSteps.length);
                }}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold py-2.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Avanzar Paso OSRM ({activeStepIndex + 1}/{currentSteps.length})</span>
              </button>
            ) : (
              <button
                onClick={() => setEngineMode('osrm_router')}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold py-2.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Abrir Trazado de Rutas OSRM</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
