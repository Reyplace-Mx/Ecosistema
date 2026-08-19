import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin
} from '@vis.gl/react-google-maps';
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
  FileCheck,
  ShieldCheck,
  Calendar,
  Radio,
  Wind,
  Droplet,
  Volume2,
  VolumeX,
  Lock,
  LocateFixed,
  Crosshair,
  BadgeCheck,
  X,
  Clock,
  FastForward,
  Cpu,
  Workflow,
  Wifi,
  Bell,
  Check,
  AlertOctagon,
  BrainCircuit,
  Bot,
  Copy,
  Download,
  Share2,
  Volume1,
  Headphones
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
  Tooltip,
  CartesianGrid
} from 'recharts';

// Access API Key from Vite defined env var or import.meta.env
const GOOGLE_MAPS_API_KEY =
  (process.env as any).GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

export interface SmartCityBuilding {
  id: string;
  name: string;
  type: 'tower' | 'transit' | 'hospital' | 'park' | 'government' | 'cultural' | 'commercial';
  buildingUsage: string;
  constructionDate: string;
  inceptionYear: number;
  completionYear: number;
  reyidVerifiedStatus: 'verified' | 'auditing' | 'pending';
  reyidCredentialId: string;
  heightMeters: number;
  floors: number;
  footprintM2: number;
  energyRating: 'LEED Platinum' | 'EDGE Advanced' | 'ISO 50001' | 'Net-Zero Ready';
  realtimeOccupancyPercent: number;
  zone: string;
  coords: { x: number; y: number; lat: number; lng: number };
  color: string;
  estimatedCostUsd: string;
  sensorDataByYear: {
    [year: number]: {
      hourlyTraffic: Array<{ hour: string; density: number; avgSpeed: number }>;
      airQuality: Array<{ time: string; aqi: number; pm25: number; no2: number }>;
      noiseDb: Array<{ time: string; db: number }>;
      solarKwh: Array<{ hour: string; solarOutput: number; gridDemand: number }>;
    };
  };
}

export interface UserGeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
  altitude: number | null;
  speed: number | null;
  timestamp: number;
  address?: string;
  isSimulated?: boolean;
}

export interface LayerVisibility {
  infrastructure: boolean;
  trafficFlow: boolean;
  environmentalSensors: boolean;
  zoningEnvelope: boolean;
  shadows: boolean;
}

export interface PredictiveInsightsData {
  summaryTitle: string;
  efficiencyScore: number;
  trendDirection: string;
  executiveSummary: string;
  criticalBottlenecks: string[];
  strategicRecommendations: string[];
  forecast2030Impact: {
    co2ReductionPercent: number;
    commuteTimeSavedMin: number;
    gridResilienceScore: number;
  };
  aiEngine?: string;
  generatedAt?: string;
}

// Predefined municipal boundary for Los Mochis (Urban Perimeter)
const LOS_MOCHIS_BOUNDARY = {
  name: 'Perímetro Urbano Municipal de Los Mochis',
  minLat: 25.7600,
  maxLat: 25.8150,
  minLng: -109.0250,
  maxLng: -108.9600
};

const PRESET_CITIES = [
  { id: 'los_mochis', name: 'Los Mochis (Distrito Centro & Rosales)', lat: 25.7923, lng: -108.9951, zoom: 16, heightLimit: 85 },
  { id: 'cdmx', name: 'CDMX (Paseo de la Reforma 3D)', lat: 19.4284, lng: -99.1676, zoom: 17, heightLimit: 260 },
  { id: 'san_francisco', name: 'San Francisco (Financial District 3D)', lat: 37.7952, lng: -122.4028, zoom: 17, heightLimit: 320 },
];

const INITIAL_BUILDINGS: SmartCityBuilding[] = [
  {
    id: 'bldg-1',
    name: 'Torre Bioclimática Reyplace Tech',
    type: 'tower',
    buildingUsage: 'Oficinas Corporativas Tech & Hub I+D',
    constructionDate: '2024 - Q3',
    inceptionYear: 2021,
    completionYear: 2024,
    reyidVerifiedStatus: 'verified',
    reyidCredentialId: 'RY-8921-MX-PLATINUM',
    heightMeters: 145,
    floors: 38,
    footprintM2: 2400,
    energyRating: 'LEED Platinum',
    realtimeOccupancyPercent: 78,
    zone: 'Distrito Financiero Norte',
    coords: { x: 42, y: 38, lat: 25.7935, lng: -108.9940 },
    color: '#06b6d4',
    estimatedCostUsd: '$48.5M USD',
    sensorDataByYear: {
      2020: {
        hourlyTraffic: [{ hour: '08:00', density: 95, avgSpeed: 12 }, { hour: '12:00', density: 85, avgSpeed: 16 }, { hour: '18:00', density: 98, avgSpeed: 10 }],
        airQuality: [{ time: '09:00', aqi: 110, pm25: 48, no2: 65 }, { time: '15:00', aqi: 95, pm25: 42, no2: 55 }],
        noiseDb: [{ time: '09:00', db: 78 }, { time: '15:00', db: 74 }],
        solarKwh: [{ hour: '10:00', solarOutput: 0, gridDemand: 450 }, { hour: '13:00', solarOutput: 0, gridDemand: 520 }]
      },
      2024: {
        hourlyTraffic: [{ hour: '08:00', density: 72, avgSpeed: 28 }, { hour: '12:00', density: 65, avgSpeed: 34 }, { hour: '18:00', density: 78, avgSpeed: 22 }],
        airQuality: [{ time: '09:00', aqi: 62, pm25: 25, no2: 38 }, { time: '15:00', aqi: 48, pm25: 19, no2: 25 }],
        noiseDb: [{ time: '09:00', db: 64 }, { time: '15:00', db: 62 }],
        solarKwh: [{ hour: '10:00', solarOutput: 310, gridDemand: 340 }, { hour: '13:00', solarOutput: 480, gridDemand: 390 }]
      },
      2026: {
        hourlyTraffic: [{ hour: '08:00', density: 55, avgSpeed: 38 }, { hour: '12:00', density: 48, avgSpeed: 42 }, { hour: '18:00', density: 60, avgSpeed: 35 }],
        airQuality: [{ time: '09:00', aqi: 42, pm25: 16, no2: 24 }, { time: '15:00', aqi: 35, pm25: 12, no2: 18 }],
        noiseDb: [{ time: '09:00', db: 55 }, { time: '15:00', db: 52 }],
        solarKwh: [{ hour: '10:00', solarOutput: 420, gridDemand: 280 }, { hour: '13:00', solarOutput: 610, gridDemand: 320 }]
      },
      2030: {
        hourlyTraffic: [{ hour: '08:00', density: 38, avgSpeed: 48 }, { hour: '12:00', density: 32, avgSpeed: 52 }, { hour: '18:00', density: 42, avgSpeed: 45 }],
        airQuality: [{ time: '09:00', aqi: 24, pm25: 8, no2: 12 }, { time: '15:00', aqi: 20, pm25: 6, no2: 10 }],
        noiseDb: [{ time: '09:00', db: 46 }, { time: '15:00', db: 44 }],
        solarKwh: [{ hour: '10:00', solarOutput: 580, gridDemand: 210 }, { hour: '13:00', solarOutput: 780, gridDemand: 240 }]
      }
    }
  },
  {
    id: 'bldg-2',
    name: 'Hospital Regional de Alta Especialidad 3D',
    type: 'hospital',
    buildingUsage: 'Servicios de Salud, Urgencias & Helipuerto',
    constructionDate: '2022 - Q1',
    inceptionYear: 2019,
    completionYear: 2022,
    reyidVerifiedStatus: 'verified',
    reyidCredentialId: 'RY-7740-MX-CRITICAL',
    heightMeters: 62,
    floors: 14,
    footprintM2: 8500,
    energyRating: 'Net-Zero Ready',
    realtimeOccupancyPercent: 91,
    zone: 'Sector Hospitalario Centro',
    coords: { x: 68, y: 32, lat: 25.7955, lng: -108.9915 },
    color: '#ef4444',
    estimatedCostUsd: '$36.2M USD',
    sensorDataByYear: {
      2024: {
        hourlyTraffic: [{ hour: '08:00', density: 68, avgSpeed: 28 }, { hour: '12:00', density: 58, avgSpeed: 34 }, { hour: '18:00', density: 72, avgSpeed: 26 }],
        airQuality: [{ time: '09:00', aqi: 45, pm25: 18, no2: 26 }, { time: '15:00', aqi: 36, pm25: 14, no2: 19 }],
        noiseDb: [{ time: '09:00', db: 58 }, { time: '15:00', db: 55 }],
        solarKwh: [{ hour: '10:00', solarOutput: 190, gridDemand: 480 }, { hour: '13:00', solarOutput: 280, gridDemand: 510 }]
      },
      2030: {
        hourlyTraffic: [{ hour: '08:00', density: 40, avgSpeed: 46 }, { hour: '12:00', density: 35, avgSpeed: 50 }, { hour: '18:00', density: 44, avgSpeed: 44 }],
        airQuality: [{ time: '09:00', aqi: 22, pm25: 7, no2: 10 }, { time: '15:00', aqi: 18, pm25: 5, no2: 8 }],
        noiseDb: [{ time: '09:00', db: 45 }, { time: '15:00', db: 42 }],
        solarKwh: [{ hour: '10:00', solarOutput: 480, gridDemand: 360 }, { hour: '13:00', solarOutput: 620, gridDemand: 390 }]
      }
    }
  },
  {
    id: 'bldg-3',
    name: 'Estación Central & Viaducto Elevado Metrobus',
    type: 'transit',
    buildingUsage: 'Intermodal Transporte Público & Carga EV',
    constructionDate: '2025 - Q4',
    inceptionYear: 2023,
    completionYear: 2025,
    reyidVerifiedStatus: 'verified',
    reyidCredentialId: 'RY-4412-MX-INFRA',
    heightMeters: 22,
    floors: 3,
    footprintM2: 14000,
    energyRating: 'EDGE Advanced',
    realtimeOccupancyPercent: 65,
    zone: 'Corredor Insurgentes Sur',
    coords: { x: 62, y: 64, lat: 25.7910, lng: -108.9920 },
    color: '#10b981',
    estimatedCostUsd: '$24.0M USD',
    sensorDataByYear: {
      2024: {
        hourlyTraffic: [{ hour: '08:00', density: 82, avgSpeed: 20 }, { hour: '12:00', density: 70, avgSpeed: 26 }, { hour: '18:00', density: 85, avgSpeed: 18 }],
        airQuality: [{ time: '09:00', aqi: 72, pm25: 32, no2: 48 }, { time: '15:00', aqi: 55, pm25: 22, no2: 32 }],
        noiseDb: [{ time: '09:00', db: 74 }, { time: '15:00', db: 70 }],
        solarKwh: [{ hour: '10:00', solarOutput: 280, gridDemand: 320 }, { hour: '13:00', solarOutput: 410, gridDemand: 360 }]
      },
      2030: {
        hourlyTraffic: [{ hour: '08:00', density: 30, avgSpeed: 55 }, { hour: '12:00', density: 25, avgSpeed: 58 }, { hour: '18:00', density: 35, avgSpeed: 52 }],
        airQuality: [{ time: '09:00', aqi: 19, pm25: 6, no2: 9 }, { time: '15:00', aqi: 15, pm25: 4, no2: 7 }],
        noiseDb: [{ time: '09:00', db: 50 }, { time: '15:00', db: 46 }],
        solarKwh: [{ hour: '10:00', solarOutput: 690, gridDemand: 180 }, { hour: '13:00', solarOutput: 890, gridDemand: 220 }]
      }
    }
  }
];

export function Photorealistic3DTilesPlanner() {
  const [selectedCity, setSelectedCity] = useState(PRESET_CITIES[0]);
  const [buildings, setBuildings] = useState<SmartCityBuilding[]>(INITIAL_BUILDINGS);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('bldg-1');
  const [showInfoWindow, setShowInfoWindow] = useState<boolean>(true);
  const [selectedSensorMetric, setSelectedSensorMetric] = useState<'traffic' | 'air_quality' | 'noise' | 'solar'>('traffic');

  // Layer Management State
  const [layers, setLayers] = useState<LayerVisibility>({
    infrastructure: true,
    trafficFlow: true,
    environmentalSensors: true,
    zoningEnvelope: true,
    shadows: true
  });

  // Temporal Simulation State (Slider & Auto-Play)
  const [simulationYear, setSimulationYear] = useState<number>(2024);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // View Modes: 3D Photorealistic Mesh vs 2D Live Google Maps
  const [viewMode, setViewMode] = useState<'3d_photorealistic' | '2d_satellite'>('3d_photorealistic');
  const [activeTool, setActiveTool] = useState<'inspect' | 'shadow_study' | 'zoning' | 'add_building'>('inspect');

  // 3D Rendering & Camera State
  const [cameraPitch, setCameraPitch] = useState<number>(55);
  const [cameraBearing, setCameraBearing] = useState<number>(45);
  const [cameraAltitude, setCameraAltitude] = useState<number>(380);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [sunHour, setSunHour] = useState<number>(14.5);

  // Geolocation & Geofence Toast State
  const [isTrackingLocation, setIsTrackingLocation] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<UserGeoPosition | null>(null);
  const [geofenceBreachToast, setGeofenceBreachToast] = useState<{
    show: boolean;
    lat: number;
    lng: number;
    timestamp: string;
  } | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // ==========================================
  // SPATIAL AUDIO MANAGER (Web Audio API)
  // ==========================================
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [audioVolume, setAudioVolume] = useState<number>(0.35); // 0.0 to 1.0
  const [audioStatusText, setAudioStatusText] = useState<string>('Audio Espacial Inactivo');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const windFilterRef = useRef<BiquadFilterNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const trafficFilterRef = useRef<BiquadFilterNode | null>(null);
  const trafficGainRef = useRef<GainNode | null>(null);
  const pannerNodeRef = useRef<StereoPannerNode | null>(null);

  // Initialize Web Audio Synthesis Graph
  const initSpatialAudio = () => {
    try {
      if (audioCtxRef.current) {
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        return;
      }

      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(audioVolume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Stereo Panner for bearing
      let panner: StereoPannerNode | null = null;
      if (ctx.createStereoPanner) {
        panner = ctx.createStereoPanner();
        panner.connect(masterGain);
        pannerNodeRef.current = panner;
      }

      const destinationNode = panner || masterGain;

      // 1. Noise Generator Buffer (White/Pink noise loop for wind & traffic rumble)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02; // Pink-ish smoothing
        lastOut = output[i];
      }

      // Wind Noise Source
      const windSource = ctx.createBufferSource();
      windSource.buffer = noiseBuffer;
      windSource.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(320, ctx.currentTime);
      windFilter.Q.setValueAtTime(1.5, ctx.currentTime);
      windFilterRef.current = windFilter;

      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(0.2, ctx.currentTime);
      windGainRef.current = windGain;

      windSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(destinationNode);
      windSource.start(0);

      // Traffic Rumbler Source
      const trafficSource = ctx.createBufferSource();
      trafficSource.buffer = noiseBuffer;
      trafficSource.loop = true;

      const trafficFilter = ctx.createBiquadFilter();
      trafficFilter.type = 'lowpass';
      trafficFilter.frequency.setValueAtTime(160, ctx.currentTime);
      trafficFilterRef.current = trafficFilter;

      const trafficGain = ctx.createGain();
      trafficGain.gain.setValueAtTime(0.15, ctx.currentTime);
      trafficGainRef.current = trafficGain;

      trafficSource.connect(trafficFilter);
      trafficFilter.connect(trafficGain);
      trafficGain.connect(destinationNode);
      trafficSource.start(0);

    } catch (e) {
      console.warn('Web Audio spatial initialization warning:', e);
    }
  };

  // Toggle Spatial Audio
  const toggleSpatialAudio = () => {
    if (!isAudioEnabled) {
      initSpatialAudio();
      setIsAudioEnabled(true);
    } else {
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.05);
      }
      setIsAudioEnabled(false);
    }
  };

  // Update Spatial Audio Parameters on Camera / Location changes
  useEffect(() => {
    if (!isAudioEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const currTime = ctx.currentTime;

    // 1. Master Volume
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(audioVolume, currTime, 0.05);
    }

    // 2. Altitude-based soundscape mixing
    // High altitude (>400m) -> Wind dominant, Traffic muffled
    // Low altitude (<250m) -> Traffic dominant, Wind gentle
    const altitudeRatio = Math.max(0, Math.min(1, (cameraAltitude - 150) / 650)); // 0.0 to 1.0

    if (windGainRef.current) {
      const windVol = 0.05 + altitudeRatio * 0.45;
      windGainRef.current.gain.setTargetAtTime(windVol, currTime, 0.1);
    }

    if (windFilterRef.current) {
      const windFreq = 200 + altitudeRatio * 600 + (cameraPitch / 90) * 200;
      windFilterRef.current.frequency.setTargetAtTime(windFreq, currTime, 0.1);
    }

    if (trafficGainRef.current) {
      const trafficVol = (1 - altitudeRatio) * 0.4 + (layers.trafficFlow ? 0.15 : 0.05);
      trafficGainRef.current.gain.setTargetAtTime(trafficVol, currTime, 0.1);
    }

    if (trafficFilterRef.current) {
      const trafficFreq = 120 + (1 - altitudeRatio) * 280;
      trafficFilterRef.current.frequency.setTargetAtTime(trafficFreq, currTime, 0.1);
    }

    // 3. Bearing Panning (-1.0 to 1.0)
    if (pannerNodeRef.current) {
      const panVal = Math.sin((cameraBearing * Math.PI) / 180) * 0.6;
      pannerNodeRef.current.pan.setTargetAtTime(panVal, currTime, 0.1);
    }

    // Soundscape status text
    if (altitudeRatio > 0.65) {
      setAudioStatusText(`Viento de Altura (${cameraAltitude}m) • Resonancia Atmosférica`);
    } else if (altitudeRatio < 0.35) {
      setAudioStatusText(`Tráfico Urbano a Nivel de Calle • Ruidos Motores & Flujo 3D`);
    } else {
      setAudioStatusText(`Mezcla Acústica Híbrida (${cameraAltitude}m) • Brisa & Rumor Vial`);
    }
  }, [isAudioEnabled, audioVolume, cameraAltitude, cameraPitch, cameraBearing, layers.trafficFlow]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // ==========================================
  // PREDICTIVE INSIGHTS PANEL (Gemini API)
  // ==========================================
  const [showInsightsModal, setShowInsightsModal] = useState<boolean>(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);
  const [insightsData, setInsightsData] = useState<PredictiveInsightsData | null>(null);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Fetch AI Predictive Insights from Server-side Gemini endpoint
  const generatePredictiveInsights = async () => {
    setIsLoadingInsights(true);
    setInsightsError(null);
    setShowInsightsModal(true);

    try {
      const res = await fetch('/api/smartcity-predictive-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeLayers: layers,
          simulationYear,
          selectedBuilding: selectedBuilding ? {
            name: selectedBuilding.name,
            type: selectedBuilding.type,
            buildingUsage: selectedBuilding.buildingUsage,
            energyRating: selectedBuilding.energyRating,
            heightMeters: selectedBuilding.heightMeters,
          } : undefined,
          telemetrySummary: {
            avgTrafficDensity: 68,
            avgSpeedKmh: 32,
            avgAqi: 42,
            avgPm25: 16,
            solarOutputKw: 380,
            gridDemandKw: 340,
          }
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || `HTTP ${res.status}`);
      }

      const data: PredictiveInsightsData = await res.json();
      setInsightsData(data);
    } catch (err: any) {
      console.error('Error fetching predictive insights:', err);
      setInsightsError(err?.message || 'No fue posible contactar con Gemini');
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const copyInsightsToClipboard = () => {
    if (!insightsData) return;
    const text = `=== INFORME PREDICTIVO GEMINI SMART CITY ===
Título: ${insightsData.summaryTitle}
Eficiencia Urbana: ${insightsData.efficiencyScore}% (${insightsData.trendDirection})
Año: ${simulationYear}

RESUMEN EJECUTIVO:
${insightsData.executiveSummary}

CUELLOS DE BOTELLA:
${insightsData.criticalBottlenecks.map((b, i) => `${i + 1}. ${b}`).join('\n')}

RECOMENDACIONES ESTRATÉGICAS:
${insightsData.strategicRecommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

IMPACTO 2030:
- Reducción CO2: ${insightsData.forecast2030Impact.co2ReductionPercent}%
- Tiempo de viaje ahorrado: ${insightsData.forecast2030Impact.commuteTimeSavedMin} min
- Resiliencia de red: ${insightsData.forecast2030Impact.gridResilienceScore}/100`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // Add Building Form State
  const [newBldgName, setNewBldgName] = useState('Complejo Residencial Marina 3D');
  const [newBldgType, setNewBldgType] = useState<'tower' | 'transit' | 'hospital' | 'park' | 'government' | 'cultural' | 'commercial'>('tower');
  const [newBldgUsage, setNewBldgUsage] = useState('Residencial Sustentable & Co-living');
  const [newBldgConstDate, setNewBldgConstDate] = useState('2026 - Q2');
  const [newBldgHeight, setNewBldgHeight] = useState<number>(80);
  const [newBldgFloors, setNewBldgFloors] = useState<number>(20);
  const [newBldgFootprint, setNewBldgFootprint] = useState<number>(3000);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Helper: check if coordinates are within the municipal boundary
  const checkGeofence = (lat: number, lng: number) => {
    const b = LOS_MOCHIS_BOUNDARY;
    const isInside = lat >= b.minLat && lat <= b.maxLat && lng >= b.minLng && lng <= b.maxLng;
    if (!isInside) {
      setGeofenceBreachToast({
        show: true,
        lat,
        lng,
        timestamp: new Date().toLocaleTimeString()
      });
    } else {
      setGeofenceBreachToast(null);
    }
  };

  // Timeline Auto-play Loop
  useEffect(() => {
    if (!isPlayingTimeline) return;
    const years = [2020, 2024, 2026, 2030];
    const interval = setInterval(() => {
      setSimulationYear(prev => {
        const nextIdx = (years.indexOf(prev) + 1) % years.length;
        return years[nextIdx];
      });
    }, 2500 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlayingTimeline, playbackSpeed]);

  // Selected building reference with temporal data
  const selectedBuilding = useMemo(() => {
    return buildings.find(b => b.id === selectedBuildingId) || buildings[0];
  }, [buildings, selectedBuildingId]);

  // Get active sensor data based on current simulationYear
  const activeSensorData = useMemo(() => {
    if (!selectedBuilding) return null;
    const dataByYear = selectedBuilding.sensorDataByYear;
    if (dataByYear[simulationYear]) return dataByYear[simulationYear];
    const availableYears = Object.keys(dataByYear).map(Number);
    const closestYear = availableYears.reduce((prev, curr) =>
      Math.abs(curr - simulationYear) < Math.abs(prev - simulationYear) ? curr : prev
    );
    return dataByYear[closestYear];
  }, [selectedBuilding, simulationYear]);

  // Geolocation API live tracking effect with Geofence check
  useEffect(() => {
    if (!isTrackingLocation) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!('geolocation' in navigator)) {
      setIsTrackingLocation(false);
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({
          lat,
          lng,
          accuracy: Math.round(pos.coords.accuracy),
          altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : null,
          speed: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : null,
          timestamp: pos.timestamp,
          address: 'Ubicación GPS en Vivo del Ciudadano'
        });
        checkGeofence(lat, lng);
      },
      (err) => {
        console.warn('GPS watch error:', err.message);
        setIsTrackingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isTrackingLocation]);

  // Rotation animation loop
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setCameraBearing(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isRotating]);

  // Trigger test geofence breach (Outside boundary)
  const triggerOutsideBoundaryTest = () => {
    const outsideLat = 25.8450;
    const outsideLng = -109.0600;
    setUserLocation({
      lat: outsideLat,
      lng: outsideLng,
      accuracy: 15,
      altitude: 12,
      speed: 45,
      timestamp: Date.now(),
      address: 'Zona Rural / Carretera Los Mochis-Ahome (Fuera de Geovalla)',
      isSimulated: true
    });
    checkGeofence(outsideLat, outsideLng);
  };

  // Reset position inside boundary
  const resetInsideBoundary = () => {
    setUserLocation({
      lat: selectedCity.lat,
      lng: selectedCity.lng,
      accuracy: 8,
      altitude: 10,
      speed: 0,
      timestamp: Date.now(),
      address: 'Distrito Centro Los Mochis (Dentro de Jurisdicción)',
      isSimulated: true
    });
    setGeofenceBreachToast(null);
  };

  // Canvas 3D Photorealistic Mesh Render with Temporal Buildings, Layers & Overlays
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

    // Render 3D Ground Tiles Texture
    ctx.strokeStyle = isNight ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;
    const gridSize = 16;
    const spacing = 42 * (500 / cameraAltitude);

    for (let i = -gridSize; i <= gridSize; i++) {
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

    // 4. LAYER OVERLAY: Infrastructure Pipes, 5G Fiber & Power Substation Vectors
    if (layers.infrastructure) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);

      const infraNodes = [
        { x: -120, y: -80 },
        { x: 40, y: -60 },
        { x: 140, y: 70 },
        { x: -60, y: 110 },
        { x: -120, y: -80 }
      ];

      ctx.beginPath();
      infraNodes.forEach((node, idx) => {
        const nx = centerX + (node.x * Math.cos(radBearing) - node.y * Math.sin(radBearing));
        const ny = centerY + (node.x * Math.sin(radBearing) + node.y * Math.cos(radBearing)) * pitchScale;
        if (idx === 0) ctx.moveTo(nx, ny);
        else ctx.lineTo(nx, ny);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      [ { x: -80, y: -20 }, { x: 90, y: 40 }, { x: -20, y: 80 } ].forEach((cell, idx) => {
        const cx = centerX + (cell.x * Math.cos(radBearing) - cell.y * Math.sin(radBearing));
        const cy = centerY + (cell.x * Math.sin(radBearing) + cell.y * Math.cos(radBearing)) * pitchScale;
        if (cy > horizonY) {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(cx - 35, cy - 20, 70, 14);
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`5G Node #${idx + 1}`, cx, cy - 10);
        }
      });
    }

    // 5. LAYER OVERLAY: Traffic Flow Heatmap Vectors
    if (layers.trafficFlow) {
      const trafficFlowLines = [
        { start: { x: -180, y: 0 }, end: { x: 180, y: 0 }, color: '#ef4444' },
        { start: { x: 0, y: -180 }, end: { x: 0, y: 180 }, color: '#10b981' },
        { start: { x: -120, y: -120 }, end: { x: 120, y: 120 }, color: '#f59e0b' }
      ];

      trafficFlowLines.forEach(line => {
        const sx = centerX + (line.start.x * Math.cos(radBearing) - line.start.y * Math.sin(radBearing));
        const sy = centerY + (line.start.x * Math.sin(radBearing) + line.start.y * Math.cos(radBearing)) * pitchScale;
        const ex = centerX + (line.end.x * Math.cos(radBearing) - line.end.y * Math.sin(radBearing));
        const ey = centerY + (line.end.x * Math.sin(radBearing) + line.end.y * Math.cos(radBearing)) * pitchScale;

        if (sy > horizonY && ey > horizonY) {
          ctx.strokeStyle = line.color;
          ctx.lineWidth = 4;
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      });
    }

    // 6. LAYER OVERLAY: Environmental Sensors (Air Quality & Decibels)
    if (layers.environmentalSensors) {
      const envSensors = [
        { x: -50, y: -90, val: 'AQI 34 (Excelente)', color: '#10b981' },
        { x: 110, y: -30, val: '64 dB (Permitido)', color: '#f59e0b' },
        { x: -90, y: 90, val: '780 W/m²', color: '#eab308' }
      ];

      envSensors.forEach(sensor => {
        const sx = centerX + (sensor.x * Math.cos(radBearing) - sensor.y * Math.sin(radBearing));
        const sy = centerY + (sensor.x * Math.sin(radBearing) + sensor.y * Math.cos(radBearing)) * pitchScale;

        if (sy > horizonY) {
          ctx.fillStyle = sensor.color;
          ctx.beginPath();
          ctx.arc(sx, sy, 7, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
          ctx.fillRect(sx - 45, sy - 24, 90, 16);
          ctx.fillStyle = sensor.color;
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`📡 ${sensor.val}`, sx, sy - 13);
        }
      });
    }

    // 7. Render 3D City Buildings (with Temporal Construction Stage based on simulationYear)
    buildings.forEach(b => {
      let developmentRatio = 1.0;
      let stageLabel = 'Operativo';

      if (simulationYear < b.inceptionYear) {
        developmentRatio = 0.08;
        stageLabel = 'Planeación';
      } else if (simulationYear < b.completionYear) {
        const progress = (simulationYear - b.inceptionYear) / (b.completionYear - b.inceptionYear);
        developmentRatio = Math.max(0.25, Math.min(0.9, progress));
        stageLabel = `En Obra (${Math.round(developmentRatio * 100)}%)`;
      }

      const isSelected = b.id === selectedBuildingId;
      const pOffsetNormX = (b.coords.x - 50) * 8;
      const pOffsetNormY = (b.coords.y - 50) * 8;

      const px = centerX + (pOffsetNormX * Math.cos(radBearing) - pOffsetNormY * Math.sin(radBearing));
      const py = centerY + (pOffsetNormX * Math.sin(radBearing) + pOffsetNormY * Math.cos(radBearing)) * pitchScale;
      const fullHeight = (b.heightMeters * 1.5) * (500 / cameraAltitude);
      const pHeight = fullHeight * developmentRatio;
      const pw = Math.sqrt(b.footprintM2) * 1.1 * (500 / cameraAltitude);

      if (py > horizonY) {
        // Shadow Study Render
        if (layers.shadows && !isNight) {
          const sunAngle = ((sunHour - 12) / 6) * Math.PI * 0.45;
          const shadowLength = pHeight * Math.abs(Math.tan((18 - sunHour) * 0.15) + 0.5);

          ctx.fillStyle = isSelected ? 'rgba(6, 182, 212, 0.45)' : 'rgba(0, 0, 0, 0.55)';
          ctx.beginPath();
          ctx.moveTo(px - pw / 2, py);
          ctx.lineTo(px + pw / 2, py);
          ctx.lineTo(px + pw / 2 + Math.sin(sunAngle) * shadowLength, py + Math.cos(sunAngle) * shadowLength * 0.45);
          ctx.lineTo(px - pw / 2 + Math.sin(sunAngle) * shadowLength, py + Math.cos(sunAngle) * shadowLength * 0.45);
          ctx.closePath();
          ctx.fill();
        }

        // Proposed Building Mesh
        const projGrad = ctx.createLinearGradient(px - pw / 2, py - pHeight, px + pw / 2, py);
        projGrad.addColorStop(0, developmentRatio < 1 ? '#f59e0b' : b.color);
        projGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = projGrad;
        ctx.globalAlpha = isSelected ? 0.95 : 0.8;
        ctx.fillRect(px - pw / 2, py - pHeight, pw, pHeight);

        // Highlight Edges & Floors
        ctx.strokeStyle = isSelected ? '#ffffff' : (developmentRatio < 1 ? '#f59e0b' : b.color);
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.strokeRect(px - pw / 2, py - pHeight, pw, pHeight);

        // Floor division lines
        const currentFloors = Math.max(1, Math.round(b.floors * developmentRatio));
        const floorHeightPx = pHeight / currentFloors;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        for (let f = 1; f < currentFloors; f++) {
          const fy = py - (f * floorHeightPx);
          ctx.beginPath();
          ctx.moveTo(px - pw / 2 + 2, fy);
          ctx.lineTo(px + pw / 2 - 2, fy);
          ctx.stroke();
        }

        // Building Info Badge / Pin
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = isSelected ? '#06b6d4' : '#ffffff';
        ctx.font = isSelected ? 'bold 12px sans-serif' : '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(b.name, px, py - pHeight - 14);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(px - 50, py - pHeight - 34, 100, 16);
        ctx.fillStyle = developmentRatio < 1 ? '#f59e0b' : '#38bdf8';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`${stageLabel} • ${Math.round(b.heightMeters * developmentRatio)}m`, px, py - pHeight - 22);
      }
    });

    // 8. Render Municipal Boundary Perimeter Warning Polygon
    const boundaryRadius = 240 * (500 / cameraAltitude);
    ctx.strokeStyle = geofenceBreachToast?.show ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, boundaryRadius, boundaryRadius * pitchScale, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 9. Render Pulsing 'Current Position' GPS Marker if Geolocation is Active
    if (userLocation) {
      const userNormX = userLocation.isSimulated && userLocation.lat > 25.82 ? 260 : 0;
      const userNormY = userLocation.isSimulated && userLocation.lng < -109.04 ? -260 : 20;

      const ux = centerX + (userNormX * Math.cos(radBearing) - userNormY * Math.sin(radBearing));
      const uy = centerY + (userNormX * Math.sin(radBearing) + userNormY * Math.cos(radBearing)) * pitchScale;

      if (uy > horizonY) {
        const isBreached = Boolean(geofenceBreachToast?.show);
        const pulseRadius = 24 + Math.sin(Date.now() / 200) * 8;

        ctx.fillStyle = isBreached ? 'rgba(239, 68, 68, 0.35)' : 'rgba(59, 130, 246, 0.3)';
        ctx.beginPath();
        ctx.arc(ux, uy, pulseRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isBreached ? '#ef4444' : '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ux, uy, 12, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = isBreached ? '#f87171' : '#60a5fa';
        ctx.beginPath();
        ctx.arc(ux, uy, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(ux - 75, uy - 34, 150, 20);
        ctx.fillStyle = isBreached ? '#f87171' : '#60a5fa';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(isBreached ? '⚠️ FUERA DE LÍMITE' : '📍 TU UBICACIÓN (GPS)', ux, uy - 20);
      }
    }

    ctx.restore();
  }, [
    selectedCity,
    buildings,
    selectedBuildingId,
    simulationYear,
    layers,
    cameraPitch,
    cameraBearing,
    cameraAltitude,
    sunHour,
    activeTool,
    userLocation,
    geofenceBreachToast
  ]);

  // Handle canvas click to select building
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height * 0.65;
    const radBearing = (cameraBearing * Math.PI) / 180;
    const pitchScale = Math.sin((cameraPitch * Math.PI) / 180);

    let closestBldg: SmartCityBuilding | null = null;
    let minDistance = 50;

    buildings.forEach(b => {
      const pOffsetNormX = (b.coords.x - 50) * 8;
      const pOffsetNormY = (b.coords.y - 50) * 8;
      const px = centerX + (pOffsetNormX * Math.cos(radBearing) - pOffsetNormY * Math.sin(radBearing));
      const py = centerY + (pOffsetNormX * Math.sin(radBearing) + pOffsetNormY * Math.cos(radBearing)) * pitchScale;
      const dist = Math.hypot(clickX - px, clickY - py);
      if (dist < minDistance) {
        minDistance = dist;
        closestBldg = b;
      }
    });

    if (closestBldg) {
      setSelectedBuildingId(closestBldg.id);
      setShowInfoWindow(true);
    }
  };

  // Handle Add Building Form
  const handleAddBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `bldg-${Date.now()}`;
    const newBuilding: SmartCityBuilding = {
      id: newId,
      name: newBldgName,
      type: newBldgType,
      buildingUsage: newBldgUsage,
      constructionDate: newBldgConstDate,
      inceptionYear: 2024,
      completionYear: 2027,
      reyidVerifiedStatus: 'verified',
      reyidCredentialId: `RY-${Math.floor(1000 + Math.random() * 9000)}-MX-NEW`,
      heightMeters: newBldgHeight,
      floors: newBldgFloors,
      footprintM2: newBldgFootprint,
      energyRating: 'LEED Platinum',
      realtimeOccupancyPercent: 60,
      zone: 'Nueva Zona en Desarrollo 3D',
      coords: {
        x: Math.floor(25 + Math.random() * 50),
        y: Math.floor(25 + Math.random() * 50),
        lat: selectedCity.lat + (Math.random() - 0.5) * 0.008,
        lng: selectedCity.lng + (Math.random() - 0.5) * 0.008,
      },
      color: newBldgType === 'hospital' ? '#ef4444' : newBldgType === 'park' ? '#22c55e' : '#06b6d4',
      estimatedCostUsd: `$${(newBldgHeight * 0.35 + newBldgFootprint * 0.002).toFixed(1)}M USD`,
      sensorDataByYear: {
        2024: {
          hourlyTraffic: [{ hour: '08:00', density: 75, avgSpeed: 25 }, { hour: '12:00', density: 65, avgSpeed: 30 }, { hour: '18:00', density: 80, avgSpeed: 20 }],
          airQuality: [{ time: '09:00', aqi: 50, pm25: 20, no2: 28 }, { time: '15:00', aqi: 42, pm25: 16, no2: 22 }],
          noiseDb: [{ time: '09:00', db: 62 }, { time: '15:00', db: 58 }],
          solarKwh: [{ hour: '10:00', solarOutput: 250, gridDemand: 300 }, { hour: '13:00', solarOutput: 390, gridDemand: 350 }]
        },
        2030: {
          hourlyTraffic: [{ hour: '08:00', density: 35, avgSpeed: 50 }, { hour: '12:00', density: 30, avgSpeed: 55 }, { hour: '18:00', density: 40, avgSpeed: 48 }],
          airQuality: [{ time: '09:00', aqi: 20, pm25: 6, no2: 8 }, { time: '15:00', aqi: 15, pm25: 4, no2: 6 }],
          noiseDb: [{ time: '09:00', db: 48 }, { time: '15:00', db: 44 }],
          solarKwh: [{ hour: '10:00', solarOutput: 520, gridDemand: 180 }, { hour: '13:00', solarOutput: 740, gridDemand: 220 }]
        }
      }
    };

    setBuildings([newBuilding, ...buildings]);
    setSelectedBuildingId(newId);
    setShowInfoWindow(true);
    setActiveTool('inspect');
  };

  const hasValidKey = Boolean(GOOGLE_MAPS_API_KEY) && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY';

  return (
    <div className="space-y-6">
      {/* Geofence Breach Toast Notification */}
      <AnimatePresence>
        {geofenceBreachToast?.show && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="p-4 rounded-2xl bg-rose-950/95 border-2 border-rose-500 shadow-2xl text-white backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/20 rounded-xl border border-rose-500/50 text-rose-400">
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-rose-200 text-sm uppercase tracking-wider">
                    Alerta de Geovalla: Fuera del Perímetro Municipal
                  </span>
                  <span className="text-[10px] font-mono bg-rose-900/60 px-2 py-0.5 rounded text-rose-300">
                    {geofenceBreachToast.timestamp}
                  </span>
                </div>
                <p className="text-xs text-rose-100/90 mt-0.5">
                  La posición actual ({geofenceBreachToast.lat.toFixed(4)}, {geofenceBreachToast.lng.toFixed(4)}) se encuentra fuera del polígono regulado de Los Mochis.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={resetInsideBoundary}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-extrabold text-xs transition cursor-pointer flex items-center gap-1 shadow-md shadow-rose-900/50"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Reubicar al Centro</span>
              </button>
              <button
                onClick={() => setGeofenceBreachToast(null)}
                className="p-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-rose-300 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner with Spatial Audio & Gemini Insights Button */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1322] via-[#0f172a] to-[#080d1a] border border-cyan-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-cyan-400" />
                Google Maps Platform • Map Tiles API
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                Audio Espacial Web Audio API
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                IA Predictiva Gemini
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Gemelo Digital 3D: Audio Espacial, Capas IoT & Análisis Predictivo Gemini
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Monitoreo urbano holístico con paisajes sonoros 3D sintetizados en tiempo real por el Web Audio API, simulación temporal (2020-2030) y diagnóstico de eficiencia multicapa asistido por Gemini.
            </p>
          </div>

          {/* View Toggle & AI Insights Action */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            {/* Gemini Predictive Insights Button */}
            <button
              onClick={generatePredictiveInsights}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs transition shadow-lg shadow-purple-500/25 hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer border border-purple-300/40"
            >
              <BrainCircuit className="w-4 h-4 text-purple-200 animate-pulse" />
              <span>Análisis Predictivo Gemini</span>
            </button>

            {/* Toggle 3D View Button */}
            <div className="p-1.5 bg-black/60 rounded-2xl border border-cyan-500/30 backdrop-blur-md flex items-center gap-1">
              <button
                onClick={() => setViewMode('3d_photorealistic')}
                className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === '3d_photorealistic'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold shadow-md shadow-cyan-500/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Box className="w-4 h-4" />
                <span>Teselas 3D Cesium</span>
              </button>
              <button
                onClick={() => setViewMode('2d_satellite')}
                className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === '2d_satellite'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-md shadow-blue-500/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>2D Satélite Maps</span>
              </button>
            </div>
          </div>
        </div>

        {/* Temporal Simulation Timeline Slider */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-gray-200">Línea Temporal de Desarrollo Urbano & Sensores:</span>
              <span className="font-mono px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-extrabold text-xs">
                Año {simulationYear}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
                className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isPlayingTimeline
                    ? 'bg-amber-500 text-black font-extrabold shadow-md'
                    : 'bg-black/40 border border-white/10 text-gray-300 hover:text-white'
                }`}
              >
                {isPlayingTimeline ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isPlayingTimeline ? 'Pausar Simulación' : 'Reproducir Evolución'}</span>
              </button>

              <button
                onClick={() => setPlaybackSpeed(s => s === 1 ? 2 : 1)}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-mono border border-white/10"
              >
                {playbackSpeed}x Velocidad
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-gray-400">
              <span className={simulationYear === 2020 ? 'text-cyan-400 font-bold' : ''}>2020 (Línea Base)</span>
              <span className={simulationYear === 2024 ? 'text-cyan-400 font-bold' : ''}>2024 (Presente)</span>
              <span className={simulationYear === 2026 ? 'text-cyan-400 font-bold' : ''}>2026 (Viaducto & 3D)</span>
              <span className={simulationYear === 2030 ? 'text-cyan-400 font-bold' : ''}>2030 (Plan Maestro Smart City)</span>
            </div>
            <input
              type="range"
              min={2020}
              max={2030}
              step={1}
              value={simulationYear}
              onChange={(e) => setSimulationYear(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Spatial Audio & Layer Management Control Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Spatial Audio Manager Control Widget */}
        <div className="lg:col-span-5 p-4 rounded-3xl bg-[#111112] border border-cyan-500/30 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl border ${isAudioEnabled ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                {isAudioEnabled ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  Audio Espacial Web Audio API
                </h4>
                <p className="text-[10px] text-gray-400 font-mono">{audioStatusText}</p>
              </div>
            </div>

            <button
              onClick={toggleSpatialAudio}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                isAudioEnabled
                  ? 'bg-cyan-500 text-black font-extrabold border-cyan-300 shadow-md shadow-cyan-500/30'
                  : 'bg-black/50 border-white/10 text-gray-300 hover:text-white'
              }`}
            >
              {isAudioEnabled ? 'Activado' : 'Activar Audio 3D'}
            </button>
          </div>

          {/* Volume slider & dynamic soundscape telemetry */}
          {isAudioEnabled && (
            <div className="flex items-center gap-3 pt-1 border-t border-white/10">
              <Volume1 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={audioVolume}
                onChange={(e) => setAudioVolume(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-cyan-300 shrink-0">
                {Math.round(audioVolume * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Layer Management Control Toolbar */}
        <div className="lg:col-span-7 p-4 rounded-3xl bg-[#111112] border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Capas Activas:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setLayers(l => ({ ...l, infrastructure: !l.infrastructure }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                layers.infrastructure
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                  : 'bg-black/40 border-white/5 text-gray-500 hover:text-gray-300'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>Infraestructura</span>
            </button>

            <button
              onClick={() => setLayers(l => ({ ...l, trafficFlow: !l.trafficFlow }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                layers.trafficFlow
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-sm'
                  : 'bg-black/40 border-white/5 text-gray-500 hover:text-gray-300'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Flujo Vial</span>
            </button>

            <button
              onClick={() => setLayers(l => ({ ...l, environmentalSensors: !l.environmentalSensors }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                layers.environmentalSensors
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm'
                  : 'bg-black/40 border-white/5 text-gray-500 hover:text-gray-300'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Sensores IoT</span>
            </button>

            <button
              onClick={() => setLayers(l => ({ ...l, shadows: !l.shadows }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                layers.shadows
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                  : 'bg-black/40 border-white/5 text-gray-500 hover:text-gray-300'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Sombras</span>
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
            <div className="flex flex-wrap items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
              <button
                onClick={() => setActiveTool('inspect')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTool === 'inspect' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Explorar Edificios</span>
              </button>

              <button
                onClick={() => setActiveTool('shadow_study')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTool === 'shadow_study' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Sombras Solares</span>
              </button>

              <button
                onClick={() => setActiveTool('add_building')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTool === 'add_building' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Edificio</span>
              </button>
            </div>

            {viewMode === '3d_photorealistic' && (
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
                  <span>{isRotating ? 'Pausar' : 'Órbita 360°'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Interactive Viewport Area */}
          <div className="relative flex-1 min-h-[500px] bg-slate-950 rounded-2xl overflow-hidden border border-cyan-500/20 shadow-inner flex items-center justify-center group">
            {viewMode === '3d_photorealistic' ? (
              <>
                <canvas
                  ref={canvasRef}
                  width={900}
                  height={520}
                  onClick={handleCanvasClick}
                  className="w-full h-full object-cover cursor-pointer"
                />

                <div className="absolute top-4 left-4 p-3 rounded-2xl bg-black/75 border border-white/10 backdrop-blur-md text-[11px] font-mono space-y-1 text-gray-300 pointer-events-none">
                  <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5" />
                    <span>Teselas 3D Cesium Mesh</span>
                  </div>
                  <div>Cámara Altura: <strong className="text-white">{cameraAltitude}m</strong></div>
                  <div>Giro Bearing: <strong className="text-white">{cameraBearing}°</strong></div>
                  <div>Año Simulado: <strong className="text-cyan-300">{simulationYear}</strong></div>
                  {isAudioEnabled && (
                    <div className="text-emerald-400 font-bold flex items-center gap-1">
                      <Volume2 className="w-3 h-3 animate-pulse" />
                      <span>Audio Espacial Activo</span>
                    </div>
                  )}
                </div>

                {activeTool === 'shadow_study' && (
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-black/85 border border-amber-500/40 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Horario Solar:</span>
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
              </>
            ) : (
              <div className="w-full h-full min-h-[500px] flex items-center justify-center">
                {hasValidKey ? (
                  <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly">
                    <Map
                      defaultCenter={{ lat: selectedCity.lat, lng: selectedCity.lng }}
                      defaultZoom={selectedCity.zoom}
                      mapId="DEMO_MAP_ID"
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      style={{ width: '100%', height: '100%', minHeight: '500px', borderRadius: '1rem' }}
                    >
                      {buildings.map(b => (
                        <AdvancedMarker
                          key={b.id}
                          position={{ lat: b.coords.lat, lng: b.coords.lng }}
                          title={b.name}
                          onClick={() => {
                            setSelectedBuildingId(b.id);
                            setShowInfoWindow(true);
                          }}
                        >
                          <Pin background={b.color} glyphColor="#ffffff" borderColor="#000000" />
                        </AdvancedMarker>
                      ))}
                    </Map>
                  </APIProvider>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 bg-slate-900/95 text-center rounded-2xl border border-cyan-500/30 max-w-md mx-auto shadow-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mb-4">
                      <Key className="w-7 h-7 text-cyan-400 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1.5">Google Maps API Key Requerida</h3>
                    <p className="text-xs text-gray-300 leading-relaxed mb-4">
                      Configura <code>GOOGLE_MAPS_PLATFORM_KEY</code> en <strong>Settings ⚙️ &gt; Secrets</strong> para activar la vista satelital en vivo.
                    </p>
                    <button
                      onClick={() => setViewMode('3d_photorealistic')}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Volver a Teselas 3D
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Camera Sliders Controls */}
          {viewMode === '3d_photorealistic' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-gray-300">
                  <span>Inclinación Pitch</span>
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
                  <span>Giro Bearing (Pan Audio)</span>
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
                  <span>Altitud (Frecuencia Audio)</span>
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
          )}
        </div>

        {/* Side Panel: Interactive Building Info Window & Recharts Sensor Overlay */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          {activeTool !== 'add_building' ? (
            <div className="bg-[#111112] border border-cyan-500/20 rounded-3xl p-6 shadow-xl space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Metadatos del Inmueble</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    Año {simulationYear}
                  </span>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {buildings.map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setSelectedBuildingId(b.id);
                        setShowInfoWindow(true);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 transition cursor-pointer border ${
                        selectedBuildingId === b.id
                          ? 'bg-cyan-500 text-black border-cyan-300 shadow'
                          : 'bg-black/40 text-gray-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {b.name.split(' ')[0]} {b.name.split(' ')[1] || ''}
                    </button>
                  ))}
                </div>

                {selectedBuilding && showInfoWindow && (
                  <motion.div
                    key={`${selectedBuilding.id}-${simulationYear}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-[#080809] border border-cyan-500/30 space-y-3.5 shadow-lg relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                          Zona: {selectedBuilding.zone}
                        </span>
                        <h4 className="text-base font-extrabold text-white leading-snug">{selectedBuilding.name}</h4>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2 py-1 rounded-lg text-[10px] font-mono font-bold">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>VERIFICADO</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-0.5">
                        <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-cyan-400" />
                          <span>Building Usage:</span>
                        </div>
                        <div className="font-bold text-gray-100 text-[11px] leading-tight">
                          {selectedBuilding.buildingUsage}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-0.5">
                        <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          <span>Construction Date:</span>
                        </div>
                        <div className="font-bold text-amber-300 text-[11px]">
                          {selectedBuilding.constructionDate}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-0.5 col-span-2">
                        <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>ReyID Verified Status:</span>
                        </div>
                        <div className="font-mono text-[11px] text-emerald-300 font-bold flex items-center justify-between">
                          <span>{selectedBuilding.reyidCredentialId}</span>
                          <span className="text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Auditoría Criptográfica</span>
                        </div>
                      </div>
                    </div>

                    {activeSensorData && (
                      <div className="pt-2 border-t border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Telemetría Sensor en {simulationYear}</span>
                          </span>
                          <span className="text-[10px] text-cyan-300 font-mono">
                            {simulationYear >= 2026 ? 'Proyección Smart City' : 'Histórico Registrado'}
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-1 p-1 bg-black/60 rounded-xl border border-white/5 text-[10px] font-bold">
                          <button
                            onClick={() => setSelectedSensorMetric('traffic')}
                            className={`py-1 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                              selectedSensorMetric === 'traffic' ? 'bg-cyan-500 text-black font-extrabold' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            <Car className="w-3 h-3" /> Tráfico
                          </button>
                          <button
                            onClick={() => setSelectedSensorMetric('air_quality')}
                            className={`py-1 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                              selectedSensorMetric === 'air_quality' ? 'bg-emerald-500 text-black font-extrabold' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            <Wind className="w-3 h-3" /> Aire
                          </button>
                          <button
                            onClick={() => setSelectedSensorMetric('noise')}
                            className={`py-1 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                              selectedSensorMetric === 'noise' ? 'bg-amber-500 text-black font-extrabold' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            <Volume2 className="w-3 h-3" /> Ruido
                          </button>
                          <button
                            onClick={() => setSelectedSensorMetric('solar')}
                            className={`py-1 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                              selectedSensorMetric === 'solar' ? 'bg-yellow-500 text-black font-extrabold' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            <Zap className="w-3 h-3" /> Solar
                          </button>
                        </div>

                        <div className="h-36 w-full bg-black/40 rounded-xl p-2 border border-white/5">
                          {selectedSensorMetric === 'traffic' && (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={activeSensorData.hourlyTraffic}>
                                <defs>
                                  <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="hour" stroke="#64748b" fontSize={9} />
                                <YAxis stroke="#64748b" fontSize={9} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4', fontSize: '11px' }} />
                                <Area type="monotone" dataKey="density" name="Densidad %" stroke="#06b6d4" fillOpacity={1} fill="url(#trafficGrad)" />
                                <Line type="monotone" dataKey="avgSpeed" name="Vel. km/h" stroke="#f59e0b" strokeWidth={2} dot={false} />
                              </AreaChart>
                            </ResponsiveContainer>
                          )}

                          {selectedSensorMetric === 'air_quality' && (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={activeSensorData.airQuality}>
                                <defs>
                                  <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="time" stroke="#64748b" fontSize={9} />
                                <YAxis stroke="#64748b" fontSize={9} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#10b981', fontSize: '11px' }} />
                                <Area type="monotone" dataKey="aqi" name="AQI General" stroke="#10b981" fillOpacity={1} fill="url(#aqiGrad)" />
                                <Line type="monotone" dataKey="pm25" name="PM2.5 (µg/m³)" stroke="#f43f5e" strokeWidth={2} dot={false} />
                              </AreaChart>
                            </ResponsiveContainer>
                          )}

                          {selectedSensorMetric === 'noise' && (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={activeSensorData.noiseDb}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="time" stroke="#64748b" fontSize={9} />
                                <YAxis stroke="#64748b" fontSize={9} domain={[30, 90]} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#f59e0b', fontSize: '11px' }} />
                                <Bar dataKey="db" name="Nivel Decibelios (dB)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          )}

                          {selectedSensorMetric === 'solar' && (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={activeSensorData.solarKwh}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="hour" stroke="#64748b" fontSize={9} />
                                <YAxis stroke="#64748b" fontSize={9} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#eab308', fontSize: '11px' }} />
                                <Area type="monotone" dataKey="solarOutput" name="Gen. Solar (kW)" stroke="#eab308" fill="#eab308" fillOpacity={0.3} />
                                <Line type="monotone" dataKey="gridDemand" name="Demanda Red (kW)" stroke="#38bdf8" strokeWidth={2} dot={false} />
                              </AreaChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTool('add_building')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Agregar Nuevo Inmueble 3D
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#111112] border border-emerald-500/20 rounded-3xl p-6 shadow-xl space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-white">Registro de Nueva Estructura 3D</h3>
                  </div>
                  <button
                    onClick={() => setActiveTool('inspect')}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>

                <form onSubmit={handleAddBuilding} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-300 mb-1">Nombre del Edificio / Proyecto</label>
                    <input
                      type="text"
                      value={newBldgName}
                      onChange={(e) => setNewBldgName(e.target.value)}
                      required
                      className="w-full bg-[#080809] border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">Building Usage (Uso del Suelo)</label>
                    <input
                      type="text"
                      value={newBldgUsage}
                      onChange={(e) => setNewBldgUsage(e.target.value)}
                      required
                      className="w-full bg-[#080809] border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-300 mb-1">Tipo de Estructura</label>
                      <select
                        value={newBldgType}
                        onChange={(e) => setNewBldgType(e.target.value as any)}
                        className="w-full bg-[#080809] border border-white/10 rounded-xl p-2.5 text-white outline-none"
                      >
                        <option value="tower">Torre Residencial / Oficinas</option>
                        <option value="transit">Estación / Viaducto</option>
                        <option value="hospital">Hospital Regional</option>
                        <option value="park">Parque Esponja</option>
                        <option value="government">Sede Gubernamental</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-300 mb-1">Construction Date</label>
                      <input
                        type="text"
                        value={newBldgConstDate}
                        onChange={(e) => setNewBldgConstDate(e.target.value)}
                        className="w-full bg-[#080809] border border-white/10 rounded-xl p-2.5 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-gray-300 mb-1">
                      <span>Altura Total (Metros)</span>
                      <span className="text-emerald-400 font-mono">{newBldgHeight} m</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={350}
                      value={newBldgHeight}
                      onChange={(e) => setNewBldgHeight(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 hover:opacity-95 cursor-pointer mt-4"
                  >
                    Guardar & Certificar en ReyID
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Predictive Insights Modal (Gemini API) */}
      <AnimatePresence>
        {showInsightsModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0f172a] border border-purple-500/40 rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/50 text-purple-300">
                    <BrainCircuit className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      Diagnóstico Predictivo de Eficiencia Urbana
                      <span className="text-[10px] font-mono bg-purple-900/60 px-2.5 py-0.5 rounded-full text-purple-300 border border-purple-500/40 font-bold">
                        Gemini 2.5 Flash
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      Análisis holístico de capas: Infraestructura, Flujo Vial y Sensores IoT (Año {simulationYear})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowInsightsModal(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Loading State */}
              {isLoadingInsights && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin flex items-center justify-center">
                    <BrainCircuit className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Gemini está analizando la correlación de capas urbanas...</h4>
                    <p className="text-xs text-gray-400 mt-1">Evaluando dispersión de contaminantes, cuellos de botella viales y resiliencia de la red eléctrica.</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {insightsError && (
                <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs space-y-2">
                  <div className="font-bold flex items-center gap-2 text-rose-300">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Error al generar análisis predictivo</span>
                  </div>
                  <p>{insightsError}</p>
                </div>
              )}

              {/* Insights Results */}
              {insightsData && !isLoadingInsights && (
                <div className="space-y-5 text-xs text-gray-300">
                  {/* Score & Title Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900/80 to-cyan-950/60 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-purple-300 font-bold tracking-wider">
                        {insightsData.trendDirection === 'POSITIVE_OPTIMIZATION' ? '📈 Tendencia: Optimización Positiva' : '⚖️ Tendencia: Equilibrio Estable'}
                      </span>
                      <h4 className="text-base font-extrabold text-white mt-0.5">{insightsData.summaryTitle}</h4>
                    </div>

                    <div className="flex items-center gap-3 bg-black/60 px-4 py-2.5 rounded-2xl border border-white/10 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400 font-medium">Índice Eficiencia</div>
                        <div className="text-xl font-mono font-extrabold text-cyan-400">{insightsData.efficiencyScore}%</div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <h5 className="font-bold text-white flex items-center gap-2">
                      <Bot className="w-4 h-4 text-purple-400" />
                      <span>Resumen Ejecutivo Multicapa:</span>
                    </h5>
                    <p className="text-gray-300 leading-relaxed text-xs">
                      {insightsData.executiveSummary}
                    </p>
                  </div>

                  {/* Bottlenecks & Recommendations Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Critical Bottlenecks */}
                    <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                      <h5 className="font-bold text-rose-300 flex items-center gap-2">
                        <AlertOctagon className="w-4 h-4 text-rose-400" />
                        <span>Cuellos de Botella Detectados:</span>
                      </h5>
                      <ul className="space-y-1.5 pl-2">
                        {insightsData.criticalBottlenecks.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-rose-100/90 text-[11px] leading-snug">
                            <span className="text-rose-400 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Strategic Recommendations */}
                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                      <h5 className="font-bold text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Recomendaciones Estratégicas Edge AI:</span>
                      </h5>
                      <ul className="space-y-1.5 pl-2">
                        {insightsData.strategicRecommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-emerald-100/90 text-[11px] leading-snug">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 2030 Impact Projections */}
                  <div className="p-4 rounded-2xl bg-black/50 border border-cyan-500/30 space-y-3">
                    <h5 className="font-bold text-cyan-300 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>Impacto Proyectado para el Horizonte 2030:</span>
                    </h5>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-lg font-mono font-extrabold text-emerald-400">
                          -{insightsData.forecast2030Impact.co2ReductionPercent}%
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Emisiones de CO₂</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-lg font-mono font-extrabold text-cyan-400">
                          -{insightsData.forecast2030Impact.commuteTimeSavedMin} min
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Tiempo de Traslado</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-lg font-mono font-extrabold text-purple-400">
                          {insightsData.forecast2030Impact.gridResilienceScore}/100
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Resiliencia de Red</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <div className="text-[10px] font-mono text-gray-400">
                  Motor: {insightsData?.aiEngine || 'Gemini 2.5 Flash'}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyInsightsToClipboard}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedReport ? 'Copiado' : 'Copiar Informe'}</span>
                  </button>

                  <button
                    onClick={() => setShowInsightsModal(false)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
