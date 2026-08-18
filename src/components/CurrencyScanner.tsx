import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  CameraOff,
  FlipHorizontal,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Upload,
  RefreshCw,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  FileCheck,
  Sun,
  Moon,
  Crosshair,
  Sliders,
  ChevronRight,
  HelpCircle,
  Flame,
  Volume2,
  VolumeX,
  Volume1,
  Layers,
  ArrowRight,
  Radio,
  Scan,
  Activity,
  Fingerprint,
  ZoomIn,
  ZoomOut,
  Target,
  Sparkle,
  Vibrate,
  Check,
  X,
  XCircle,
  SlidersHorizontal,
  BellRing
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export type OpticalFilterMode = 'natural' | 'uv_fluorescence' | 'intaglio_relief' | 'watermark_backlight' | 'infrared_ir';

export interface SecurityFeatureZone {
  id: string;
  name: string;
  category: 'tilt' | 'touch' | 'look' | 'spectral';
  x: number; // percentage coordinate 0-100 on banknote
  y: number; // percentage coordinate 0-100 on banknote
  radius: number;
  description: string;
  verificationTip: string;
  verified: boolean;
  score: number;
  spectrogramLabel: string;
}

export interface BanknoteModel {
  id: string;
  currency: 'MXN' | 'USD' | 'EUR';
  denomination: string;
  name: string;
  substrate: string;
  series: string;
  portrait: string;
  dimensions: string;
  uvExpectation: string;
  colorShiftDetail: string;
  zones: SecurityFeatureZone[];
  sampleBgGradient: string;
}

const BANKNOTE_CATALOG: BanknoteModel[] = [
  {
    id: 'mxn-500-g',
    currency: 'MXN',
    denomination: '$500 MXN',
    name: 'Benito Juárez (Familia G)',
    substrate: 'Papel de Algodón',
    series: 'Familia G - Banxico (2018+)',
    portrait: 'Presidente Benito Juárez / Ballena Gris (Vizcaíno)',
    dimensions: '146 x 65 mm',
    uvExpectation: 'Fluorescencia amarillo-verdosa en reverso y fibras luminiscentes en tono magenta.',
    colorShiftDetail: 'El numeral "500" cambia de color de verde olivo a azul cobalto con efecto Spark Live.',
    sampleBgGradient: 'from-blue-900/60 via-slate-900/90 to-blue-950/80',
    zones: [
      {
        id: 'spark_500',
        name: 'Denominación Spark Live 3D',
        category: 'tilt',
        x: 82,
        y: 28,
        radius: 36,
        description: 'Numeral 500 dinámico con degradado magnético que fluye de verde a azul al girar.',
        verificationTip: 'Inclina el billete hacia la luz para observar el recorrido del resplandor.',
        verified: true,
        score: 99.2,
        spectrogramLabel: 'OVI / Spark Live 520nm-480nm'
      },
      {
        id: 'thread_3d',
        name: 'Hilo Dinámico 3D Intercalado',
        category: 'tilt',
        x: 62,
        y: 50,
        radius: 30,
        description: 'Banda entrelazada con figuras de caracoles prehispánicos en movimiento parallax 3D.',
        verificationTip: 'Al mover verticalmente el billete, los caracoles se desplazan horizontalmente.',
        verified: true,
        score: 98.6,
        spectrogramLabel: 'Micro-lens Array Hologram'
      },
      {
        id: 'intaglio_text',
        name: 'Relieves Calcográficos Intaglio',
        category: 'touch',
        x: 45,
        y: 18,
        radius: 38,
        description: 'Texto "BANCO DE MÉXICO", prócer Benito Juárez y líneas táctiles con relieve perceptible.',
        verificationTip: 'Pasa la yema de tus dedos sobre las letras y el cuello del prócer.',
        verified: true,
        score: 97.8,
        spectrogramLabel: 'Tactile Micro-Groove Profile (Sobel)'
      },
      {
        id: 'watermark_juarez',
        name: 'Marca de Agua Multitonal',
        category: 'look',
        x: 22,
        y: 50,
        radius: 42,
        description: 'Retrato idéntico de Benito Juárez y número 500 visible a trasluz con gradaciones tonales.',
        verificationTip: 'Pon el billete a contraluz; la marca no debe verse como una plasta blanca opaca.',
        verified: true,
        score: 99.5,
        spectrogramLabel: 'Transillumination Grayscale Gradient'
      },
      {
        id: 'uv_fibers',
        name: 'Fibras & Tintas Fluorescentes UV',
        category: 'spectral',
        x: 50,
        y: 75,
        radius: 45,
        description: 'Fibrillas reactivas que brillan en rojo/amarillo bajo 365nm sin blanquear el papel.',
        verificationTip: 'Activa el modo de luz UV para observar la fluorescencia selectiva.',
        verified: true,
        score: 99.1,
        spectrogramLabel: 'Photoluminescence Peak @ 365nm'
      }
    ]
  },
  {
    id: 'mxn-50-g',
    currency: 'MXN',
    denomination: '$50 MXN',
    name: 'Ajolote & Xochimilco (Familia G)',
    substrate: 'Polímero de Alta Seguridad',
    series: 'Familia G - Banxico (2021+)',
    portrait: 'Fundación Tenochtitlan / Ajolote en Xochimilco',
    dimensions: '125 x 65 mm',
    uvExpectation: 'Resplandor verde y naranja brillante en el reverso con el ajolote y flores de maíz.',
    colorShiftDetail: 'El numeral "50" y el glifo mexica cambian de color al rotar el billete verticalmente.',
    sampleBgGradient: 'from-amber-950/60 via-purple-950/80 to-slate-950/90',
    zones: [
      {
        id: 'window_poly',
        name: 'Ventana Transparente Continua',
        category: 'look',
        x: 20,
        y: 50,
        radius: 45,
        description: 'Zona de polímero cristalino transparente con el número 50 y líneas en relieve integradas.',
        verificationTip: 'Verifica la absoluta transparencia sin adhesivos ni cortes.',
        verified: true,
        score: 99.8,
        spectrogramLabel: 'BOPP Polymer Optical Clearance'
      },
      {
        id: 'spark_50',
        name: 'Denominación Multicolor (Spark)',
        category: 'tilt',
        x: 75,
        y: 25,
        radius: 34,
        description: 'El numeral "50" cambia de oro cobrizo a verde esmeralda con halo circular dinámico.',
        verificationTip: 'Gira suavemente para ver el aro de luz interior.',
        verified: true,
        score: 98.9,
        spectrogramLabel: 'Optically Variable Spark 580nm-530nm'
      },
      {
        id: 'intaglio_tenoch',
        name: 'Relieves Táctiles en Polímero',
        category: 'touch',
        x: 50,
        y: 40,
        radius: 40,
        description: 'Monolito Teocalli de la Guerra Sagrada y texto "Banco de México" con alto relieve.',
        verificationTip: 'Siente la rugosidad sobre el monolito prehispánico.',
        verified: true,
        score: 97.4,
        spectrogramLabel: 'Polymer Raised Ink Profile'
      },
      {
        id: 'uv_axolotl',
        name: 'Fluorescencia de Ecosistema UV',
        category: 'spectral',
        x: 55,
        y: 75,
        radius: 48,
        description: 'Flores y contorno del ajolote emiten luz amarilla y verde brillante bajo 365nm.',
        verificationTip: 'Observa la luminiscencia en el reverso bajo radiación ultravioleta.',
        verified: true,
        score: 99.6,
        spectrogramLabel: 'Dual Phosphor Emission 540nm'
      }
    ]
  },
  {
    id: 'mxn-200-g',
    currency: 'MXN',
    denomination: '$200 MXN',
    name: 'Hidalgo & Morelos (Familia G)',
    substrate: 'Papel de Algodón',
    series: 'Familia G - Banxico (2019+)',
    portrait: 'Miguel Hidalgo y José María Morelos / Águila Real (El Pinacate)',
    dimensions: '139 x 65 mm',
    uvExpectation: 'Fluorescencia verde brillante en el reverso y fibrillas multicolores.',
    colorShiftDetail: 'El numeral 200 cambia de color de verde a azul con hilo 3D verde.',
    sampleBgGradient: 'from-emerald-950/60 via-slate-900/90 to-teal-950/80',
    zones: [
      {
        id: 'spark_200',
        name: 'Spark Live 200 Verde-Azul',
        category: 'tilt',
        x: 80,
        y: 28,
        radius: 35,
        description: 'Numeral 200 con destellos concéntricos que viran de verde a azul.',
        verificationTip: 'Inclina el billete para ver el juego de colores.',
        verified: true,
        score: 98.5,
        spectrogramLabel: 'Dynamic OVI Shift'
      },
      {
        id: 'thread_200',
        name: 'Hilo de Seguridad 3D',
        category: 'tilt',
        x: 60,
        y: 50,
        radius: 32,
        description: 'Banda con figuras de la Campana de Dolores con movimiento tridimensional.',
        verificationTip: 'La campana se mueve al cambiar el ángulo de vista.',
        verified: true,
        score: 99.0,
        spectrogramLabel: 'Micro-optics 3D Motion Ribbon'
      },
      {
        id: 'watermark_campana',
        name: 'Marca de Agua (Campana & 200)',
        category: 'look',
        x: 22,
        y: 50,
        radius: 40,
        description: 'Campana de Dolores y número 200 visibles con nitidez a trasluz.',
        verificationTip: 'Coloca el billete frente a una lámpara blanca.',
        verified: true,
        score: 99.2,
        spectrogramLabel: 'Multitone High-Def Watermark'
      }
    ]
  },
  {
    id: 'usd-100-franklin',
    currency: 'USD',
    denomination: '$100 USD',
    name: 'Benjamin Franklin (Federal Reserve)',
    substrate: 'Papel de Algodón/Lino (75/25)',
    series: 'Series 2013A+ / NexGen Fed',
    portrait: 'Benjamin Franklin / Independence Hall (Philadelphia)',
    dimensions: '156 x 66 mm',
    uvExpectation: 'El hilo de seguridad brilla en color ROSA INTENSO bajo luz UV (365nm).',
    colorShiftDetail: 'La campana dentro del tintero de cobre cambia de bronce a verde.',
    sampleBgGradient: 'from-cyan-950/60 via-slate-900/90 to-blue-950/80',
    zones: [
      {
        id: 'bell_inkwell',
        name: 'Campana en el Tintero (Color-Shifting)',
        category: 'tilt',
        x: 58,
        y: 58,
        radius: 36,
        description: 'Campana que aparece y desaparece dentro del tintero de cobre al inclinar.',
        verificationTip: 'La campana cambia de color bronce a verde esmeralda al mover el billete.',
        verified: true,
        score: 99.4,
        spectrogramLabel: 'Optically Variable Bell Ink'
      },
      {
        id: 'ribbon_3d_blue',
        name: 'Cinta de Seguridad 3D Azul Tejida',
        category: 'tilt',
        x: 42,
        y: 50,
        radius: 34,
        description: 'Cinta azul entretejida con micro-lentes que muestran números "100" y campanas.',
        verificationTip: 'Si inclinas el billete verticalmente, las campanas se mueven horizontalmente.',
        verified: true,
        score: 99.7,
        spectrogramLabel: 'Crane Motion 3D Micro-optic Ribbon'
      },
      {
        id: 'portrait_collar',
        name: 'Relieve Intaglio & Cuello de Franklin',
        category: 'touch',
        x: 65,
        y: 35,
        radius: 42,
        description: 'Impresión calcográfica en el hombro de Franklin y frase "THE UNITED STATES OF AMERICA".',
        verificationTip: 'Toca el hombro izquierdo de Franklin para sentir la textura rugosa.',
        verified: true,
        score: 98.8,
        spectrogramLabel: 'Engraving Depth Sensor'
      },
      {
        id: 'uv_pink_thread',
        name: 'Hilo UV Fluorescente Rosa',
        category: 'spectral',
        x: 25,
        y: 50,
        radius: 40,
        description: 'Hilo de polímero interno que emite una intensa fluorescencia ROSA a 365nm.',
        verificationTip: 'Bajo luz ultravioleta, el hilo vertical debe brillar en rosa/magenta nítido.',
        verified: true,
        score: 99.9,
        spectrogramLabel: 'Federal Reserve UV Pink 620nm'
      }
    ]
  },
  {
    id: 'eur-50-europa',
    currency: 'EUR',
    denomination: '€50 EUR',
    name: 'Europa Series (BCE)',
    substrate: 'Papel de Algodón Puro',
    series: 'Europa Series (2017+)',
    portrait: 'Retrato mitológico de Europa / Arquitectura Renacentista',
    dimensions: '140 x 77 mm',
    uvExpectation: 'Fibras luminosas tricolores (rojo, verde, azul) y bandera de la UE en verde.',
    colorShiftDetail: 'El número esmeralda cambia de verde a azul oscuro con rayo vertical.',
    sampleBgGradient: 'from-amber-950/60 via-slate-900/90 to-orange-950/80',
    zones: [
      {
        id: 'emerald_num_50',
        name: 'Número Esmeralda con Reflejo',
        category: 'tilt',
        x: 18,
        y: 75,
        radius: 35,
        description: 'El número 50 brillante produce un efecto luminoso vertical y cambia a azul.',
        verificationTip: 'Gira el billete para ver la línea de luz que recorre el número.',
        verified: true,
        score: 99.1,
        spectrogramLabel: 'Emerald Spark Effect'
      },
      {
        id: 'portrait_window_eur',
        name: 'Ventana con Retrato de Europa',
        category: 'look',
        x: 85,
        y: 35,
        radius: 38,
        description: 'Ventana holográfica en la parte superior que muestra a la diosa Europa a contraluz.',
        verificationTip: 'Al mirar a trasluz, el retrato se hace visible por ambos lados.',
        verified: true,
        score: 99.6,
        spectrogramLabel: 'Kinegram Hologram Window'
      },
      {
        id: 'intaglio_borders',
        name: 'Líneas Táctiles en los Bordes',
        category: 'touch',
        x: 8,
        y: 50,
        radius: 35,
        description: 'Serie de líneas cortas en relieve en los bordes izquierdo y derecho para invidentes.',
        verificationTip: 'Toca los laterales del anverso para verificar el relieve continuo.',
        verified: true,
        score: 98.2,
        spectrogramLabel: 'Tactile Edge Braille Pattern'
      }
    ]
  }
];

export function CurrencyScanner() {
  const toast = useToast();

  // Selected Banknote Model
  const [selectedBanknote, setSelectedBanknote] = useState<BanknoteModel>(BANKNOTE_CATALOG[0]);
  
  // Camera & Stream State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isFlashActive, setIsFlashActive] = useState<boolean>(false);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Optical & Spectral Filters
  const [filterMode, setFilterMode] = useState<OpticalFilterMode>('natural');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [isHapticEnabled, setIsHapticEnabled] = useState<boolean>(true);
  const [accessibilityAnnouncement, setAccessibilityAnnouncement] = useState<string>('Escáner listo');

  // Verification Pulse Engine
  const [isVerificationPulseActive, setIsVerificationPulseActive] = useState<boolean>(true);
  const [pulseSpeed, setPulseSpeed] = useState<'normal' | 'fast' | 'slow'>('normal');
  const [pulseCount, setPulseCount] = useState<number>(0);
  const [activeZoneHighlight, setActiveZoneHighlight] = useState<SecurityFeatureZone | null>(null);
  const [isAutoCyclingZones, setIsAutoCyclingZones] = useState<boolean>(true);
  const [currentZoneIndex, setCurrentZoneIndex] = useState<number>(0);

  // Dynamic security zones state for the selected banknote (allows manual interactive verification / rejection)
  const [currentZones, setCurrentZones] = useState<SecurityFeatureZone[]>(BANKNOTE_CATALOG[0].zones);

  // Diagnostic Status
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<{
    authenticityScore: number;
    status: 'AUTHENTIC' | 'SUSPICIOUS' | 'COUNTERFEIT';
    checksPassed: number;
    totalChecks: number;
    details: string[];
  } | null>(null);

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // =========================================================================
  // HAPTIC FEEDBACK ENGINE (Web Vibration API with accessibility patterns)
  // =========================================================================
  const triggerHaptic = (pattern: 'success' | 'fail' | 'pulse' | 'select' | 'warning' | 'node_pass' | 'node_fail') => {
    if (!isHapticEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (pattern === 'success') {
          // Double crisp ascending vibration confirmation
          navigator.vibrate([45, 40, 75, 40, 110]);
        } else if (pattern === 'fail') {
          // Triple heavy buzzing alarm vibration
          navigator.vibrate([130, 60, 180, 60, 240]);
        } else if (pattern === 'node_pass') {
          // Sharp double tick
          navigator.vibrate([35, 40, 65]);
        } else if (pattern === 'node_fail') {
          // Double low vibration buzz
          navigator.vibrate([90, 50, 140]);
        } else if (pattern === 'pulse') {
          // Micro-tick on radar sweep
          navigator.vibrate(22);
        } else if (pattern === 'select') {
          // Light snap on tap
          navigator.vibrate(30);
        } else if (pattern === 'warning') {
          navigator.vibrate([80, 50, 80]);
        }
      } catch {
        // Safe failover for unsupported environments
      }
    }
  };

  // Safe Web Audio Context Getter
  const getAudioContext = (): AudioContext | null => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }
      const ctx = audioContextRef.current;
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
      return ctx;
    } catch {
      return null;
    }
  };

  // =========================================================================
  // DISTINCT AUDIO CUES (Web Audio API Synthesizer)
  // =========================================================================

  // 1. SUCCESS CHIRP: Harmonious ascending arpeggio with high-sparkle envelope (C6, E6, G6, C7)
  const playSuccessChirp = () => {
    triggerHaptic('success');
    setAccessibilityAnnouncement('Verificación exitosa: Billete auténtico confirmado.');
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6 -> E6 -> G6 -> C7

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.055);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.055 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.055 + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + 0.2);
    });
  };

  // 2. FAIL CHIRP: Dissonant descending alert tone with rapid saw/triangle drop (370Hz & 260Hz -> 90Hz)
  const playFailChirp = () => {
    triggerHaptic('fail');
    setAccessibilityAnnouncement('Alerta de seguridad: Discrepancia o sospecha de billete apócrifo detectada.');
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Primary descending sawtooth
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(370, now);
    osc1.frequency.exponentialRampToValueAtTime(100, now + 0.26);

    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.exponentialRampToValueAtTime(0.09, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.3);

    // Dissonant secondary harmonic
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(260, now + 0.04);
    osc2.frequency.exponentialRampToValueAtTime(75, now + 0.3);

    gain2.gain.setValueAtTime(0.0001, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.08, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.04);
    osc2.stop(now + 0.34);
  };

  // 3. NODE PASS CHIRP: Fast positive harmonic beep
  const playNodePassChirp = (frequency = 1250) => {
    triggerHaptic('node_pass');
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.35, now + 0.07);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  };

  // 4. NODE FAIL CHIRP: Low rejection buzzer
  const playNodeFailChirp = () => {
    triggerHaptic('node_fail');
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.14);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  };

  // 5. RADAR PULSE TONE: Subtle acoustic feedback for radar sweep
  const playPulseAudioTone = (frequency = 880) => {
    triggerHaptic('pulse');
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.4, now + 0.07);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.035, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  };

  // Start Camera Feed
  const startCamera = async () => {
    setCameraError(null);
    setCapturedSnapshot(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('El navegador no soporta captura de video WebRTC directa.');
      toast.error('Cámara no compatible', 'Utiliza la opción de subir fotografía de billete.');
      return;
    }

    try {
      // Stop previous stream if active
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setIsCameraActive(true);
      toast.success('Cámara y Escáner Activo', 'Alinea el billete con las marcas guía para iniciar el pulso de verificación.');
      playPulseAudioTone(980);
    } catch (err: unknown) {
      console.warn('Camera stream error:', err);
      setCameraError('No se pudo acceder a la cámara o se denegaron los permisos.');
      setIsCameraActive(false);
      toast.info('Modo Simulación Óptica Activado', 'Puedes cargar una foto o probar con la muestra espectral predeterminada.');
    }
  };

  // Stop Camera Feed
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsFlashActive(false);
  };

  // Switch front/back camera
  const toggleCameraFacing = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    if (isCameraActive) {
      stopCamera();
      setTimeout(() => startCamera(), 150);
    }
  };

  // Toggle Hardware Flash if supported
  const toggleFlash = async () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      const capabilities = (videoTrack.getCapabilities ? videoTrack.getCapabilities() : {}) as { torch?: boolean };
      if (capabilities.torch) {
        const nextState = !isFlashActive;
        await (videoTrack as MediaStreamTrack & { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
          advanced: [{ torch: nextState }]
        });
        setIsFlashActive(nextState);
        toast.info(nextState ? 'Luz de Alta Intensidad Activada' : 'Luz Desactivada');
      } else {
        setIsFlashActive(!isFlashActive);
        toast.info('Luz Simulada', 'El sensor de hardware no permite control directo del flash.');
      }
    } catch {
      setIsFlashActive(!isFlashActive);
    }
  };

  // Trigger Manual Verification Pulse Burst
  const triggerVerificationPulseBurst = () => {
    setIsVerificationPulseActive(true);
    setPulseCount(prev => prev + 1);
    playPulseAudioTone(1050);
    toast.info('Pulso de Verificación Emitido', `Inspeccionando ${currentZones.length} capas de seguridad holográfica.`);
  };

  // Auto-cycle through security zones during verification pulse
  useEffect(() => {
    if (!isAutoCyclingZones || currentZones.length === 0) return;

    const intervalTime = pulseSpeed === 'fast' ? 2200 : pulseSpeed === 'slow' ? 4500 : 3200;
    const timer = setInterval(() => {
      setCurrentZoneIndex(prev => {
        const nextIdx = (prev + 1) % currentZones.length;
        const targetZone = currentZones[nextIdx];
        setActiveZoneHighlight(targetZone);
        if (isVerificationPulseActive) {
          if (targetZone.verified) {
            playPulseAudioTone(850 + nextIdx * 80);
          } else {
            playNodeFailChirp();
          }
        }
        return nextIdx;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isAutoCyclingZones, currentZones, pulseSpeed, isVerificationPulseActive]);

  // Set initial active zone when banknote changes
  useEffect(() => {
    if (selectedBanknote.zones.length > 0) {
      setCurrentZones(selectedBanknote.zones);
      setActiveZoneHighlight(selectedBanknote.zones[0]);
      setCurrentZoneIndex(0);
      setDiagnosticResult(null);
    }
  }, [selectedBanknote]);

  // Real-time Canvas Processing for Optical Filters (UV, Intaglio Sobel, Watermark, IR)
  useEffect(() => {
    let animationFrameId: number;

    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !isCameraActive) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Draw raw frame
      ctx.drawImage(video, 0, 0, width, height);

      // Apply pixel transformations if optical filter is active
      if (filterMode !== 'natural') {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const avg = (r + g + b) / 3;

          if (filterMode === 'uv_fluorescence') {
            // UV 365nm simulation: deep ultraviolet violet field + boosted neon emission
            const uvField = avg < 120 ? avg * 0.35 : avg * 0.7;
            data[i] = Math.min(255, uvField * 0.45 + (r > 160 ? r * 1.3 : 0)); // Magenta / UV Blue
            data[i + 1] = Math.min(255, (g > 130 && g > r * 0.9) ? g * 1.6 : g * 0.25); // Neon Green phosphor
            data[i + 2] = Math.min(255, uvField * 1.35 + 45); // Deep 365nm violet
          } else if (filterMode === 'intaglio_relief') {
            // Sobel Tactile Relief / Edge micro-grooves
            const nextPixelAvg = i + 4 < data.length ? (data[i + 4] + data[i + 5] + data[i + 6]) / 3 : avg;
            const diff = Math.abs(avg - nextPixelAvg) * 4.5;
            data[i] = diff > 42 ? 0 : 220;
            data[i + 1] = diff > 42 ? 255 : 220;
            data[i + 2] = diff > 42 ? 210 : 220;
          } else if (filterMode === 'watermark_backlight') {
            // High-gamma Transillumination Backlight
            const trans = Math.pow(avg / 255, 0.55) * 255;
            data[i] = trans;
            data[i + 1] = trans * 0.96;
            data[i + 2] = trans * 0.82;
          } else if (filterMode === 'infrared_ir') {
            // IR Metameric Absorption
            const isDarkPigment = avg < 75;
            data[i] = isDarkPigment ? 20 : 240;
            data[i + 1] = isDarkPigment ? 20 : 240;
            data[i + 2] = isDarkPigment ? 30 : 240;
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }

      animationFrameId = requestAnimationFrame(processFrame);
    };

    if (isCameraActive) {
      animationFrameId = requestAnimationFrame(processFrame);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isCameraActive, filterMode]);

  // Toggle individual zone verification status (for manual inspection / interactive testing)
  const toggleZoneVerification = (zoneId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentZones(prev => {
      const updated = prev.map(z => {
        if (z.id === zoneId) {
          const nextVerified = !z.verified;
          if (nextVerified) {
            playNodePassChirp(1200);
            toast.success(`Nodo de Seguridad: ${z.name}`, 'Verificación aprobada.');
          } else {
            playNodeFailChirp();
            toast.error(`Nodo de Seguridad: ${z.name}`, 'Marcado como discrepancia o fallo espectral.');
          }
          return { ...z, verified: nextVerified };
        }
        return z;
      });

      // Also sync active zone highlight if it matches
      if (activeZoneHighlight && activeZoneHighlight.id === zoneId) {
        const found = updated.find(u => u.id === zoneId);
        if (found) setActiveZoneHighlight(found);
      }

      return updated;
    });
  };

  // Run Diagnostic Authenticity Analysis with Distinct Success or Fail Chirps
  const runDiagnosticAnalysis = (overrideStatus?: 'AUTHENTIC' | 'SUSPICIOUS' | 'COUNTERFEIT') => {
    setIsAnalyzing(true);
    triggerHaptic('pulse');
    playPulseAudioTone(1100);

    setTimeout(() => {
      const totalChecks = currentZones.length;
      const verifiedCount = overrideStatus === 'COUNTERFEIT' 
        ? 1 
        : overrideStatus === 'SUSPICIOUS'
        ? Math.floor(totalChecks / 2)
        : currentZones.filter(z => z.verified).length;

      const avgScore = overrideStatus === 'COUNTERFEIT'
        ? 34.8
        : overrideStatus === 'SUSPICIOUS'
        ? 62.4
        : (currentZones.reduce((acc, z) => acc + (z.verified ? z.score : 25), 0) / (totalChecks || 1));

      const computedStatus: 'AUTHENTIC' | 'SUSPICIOUS' | 'COUNTERFEIT' = 
        overrideStatus || 
        (avgScore >= 85 ? 'AUTHENTIC' : avgScore >= 60 ? 'SUSPICIOUS' : 'COUNTERFEIT');

      const resultDetails = computedStatus === 'AUTHENTIC' ? [
        'Relieve calcográfico táctil detectado con rugosidad nominal.',
        'Fluorescencia de tintas OVI y banda holográfica dentro de longitud de onda esperada (365nm).',
        'Ventana transparente y marca de agua sin evidencia de sobreimpresión o corte mecánico.',
        'Microtextos legibles con definición tipográfica oficial.'
      ] : computedStatus === 'SUSPICIOUS' ? [
        'Falla parcial en fluorescencia UV (longitud de onda alterada o emisión tenue).',
        'Relieve táctil plano o con bajo relieve calcográfico en bordes.',
        'Ventana transparente con micro-aberraciones ópticas o bordes adhesivos.',
        'Se sugiere revisión manual bajo lente macro o lámpara de Wood UV.'
      ] : [
        'ALERTA CRÍTICA: Falso relieve detectado (impresión inkjet estándar sin intaglio calcográfico).',
        'Ausencia de tintas de cambio óptico variable Spark Live 3D.',
        'Marca de agua simulada con tinta blanca opaca sin gradación tonal continua.',
        'Pieza catalogada como presunta falsificación apócrifa (protocolo Banxico aplicable).'
      ];

      setDiagnosticResult({
        authenticityScore: parseFloat(avgScore.toFixed(1)),
        status: computedStatus,
        checksPassed: verifiedCount,
        totalChecks: totalChecks,
        details: resultDetails
      });
      setIsAnalyzing(false);

      if (computedStatus === 'AUTHENTIC') {
        playSuccessChirp();
        toast.success('Análisis Completado: AUTÉNTICO', `Billete verificado con ${avgScore.toFixed(1)}% de coincidencia espectral.`);
      } else {
        playFailChirp();
        toast.error(`Alerta: ${computedStatus === 'COUNTERFEIT' ? 'BILLETE APÓCRIFO DETECTADO' : 'PIEZA SOSPECHOSA'}`, `Coincidencia espectral baja (${avgScore.toFixed(1)}%). Revisa los puntos críticos.`);
      }
    }, 1600);
  };

  // Preset Scenario: Simulate 100% Authentic Banknote
  const handleSimulateAuthentic = () => {
    setCurrentZones(prev => prev.map(z => ({ ...z, verified: true })));
    toast.info('Simulación Iniciada', 'Evaluando muestra auténtica...');
    runDiagnosticAnalysis('AUTHENTIC');
  };

  // Preset Scenario: Simulate Counterfeit / Apocryphal Banknote
  const handleSimulateCounterfeit = () => {
    setCurrentZones(prev => prev.map((z, idx) => ({
      ...z,
      verified: idx === 0 ? true : false,
      score: Math.min(z.score, 35)
    })));
    toast.info('Simulación Iniciada', 'Evaluando muestra con fallas ópticas...');
    runDiagnosticAnalysis('COUNTERFEIT');
  };

  // Capture Snapshot
  const captureSnapshot = () => {
    if (!isCameraActive && !videoRef.current) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedSnapshot(dataUrl);
      stopCamera();
      toast.success('Captura Espectral Completada', 'Analizando patrones de autenticidad.');
      runDiagnosticAnalysis();
    }
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedSnapshot(event.target.result as string);
        stopCamera();
        toast.success('Fotografía Cargada', 'Iniciando escaneo óptico y pulso de verificación.');
        runDiagnosticAnalysis();
      }
    };
    reader.readAsDataURL(file);
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div className="space-y-6 w-full animate-fade-in" id="currency-scanner-component">
      {/* Hidden Live Region for Screen Readers / Accessibility */}
      <div role="status" aria-live="polite" className="sr-only">
        {accessibilityAnnouncement}
      </div>

      {/* Component Header / Banner */}
      <div className="glass-panel-reyplace rounded-3xl p-5 border border-white/10 relative overflow-hidden">
        {/* Background ambient decorative glow */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/40 shrink-0 neu-inset-dark">
              <Scan className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Currency Scanner & Detector de Billetes Falsos
                </h2>
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-extrabold border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  VERIFICATION PULSE LIVE 2026
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
                Escáner óptico en tiempo real con <strong className="text-emerald-400">Pulso de Verificación Láser</strong>, retroalimentación <strong className="text-cyan-300">Háptica</strong> y <strong className="text-amber-300">Cues Acústicos</strong> (Chirps de Éxito / Falla) para accesibilidad y respuesta inmediata.
              </p>
            </div>
          </div>

          {/* Quick Denomination Switcher */}
          <div className="flex items-center gap-2 flex-wrap bg-black/40 p-2 rounded-2xl border border-white/10">
            <span className="text-xs font-mono text-gray-400 ml-1">Divisa / Denominación:</span>
            <select
              value={selectedBanknote.id}
              onChange={(e) => {
                const found = BANKNOTE_CATALOG.find(b => b.id === e.target.value);
                if (found) setSelectedBanknote(found);
              }}
              aria-label="Seleccionar Billete a Escanear"
              className="bg-slate-900 border border-emerald-500/50 text-white font-bold text-xs rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer shadow-inner"
            >
              {BANKNOTE_CATALOG.map((note) => (
                <option key={note.id} value={note.id} className="bg-slate-950 text-white">
                  {note.denomination} • {note.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ACCESSIBILITY & AUDIO-HAPTIC FEEDBACK HUD BAR */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-black/80 to-slate-900/90 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <BellRing className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white uppercase tracking-wider">
                Retroalimentación Sensorial & Accesibilidad
              </span>
              <span className="px-2 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                Audio Cues + Haptic API
              </span>
            </div>
            <p className="text-[11px] text-gray-300 mt-0.5">
              Chirps acústicos armónicos diferenciados y patrones de vibración para invidentes y respuesta rápida.
            </p>
          </div>
        </div>

        {/* Audio & Haptic Action Toggles and Test Chirps */}
        <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
          {/* Audio Toggle */}
          <button
            onClick={() => {
              const next = !isSoundEnabled;
              setIsSoundEnabled(next);
              if (next) playNodePassChirp(1000);
              toast.info(next ? 'Sonido Activado' : 'Sonido Silenciado');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border transition-all flex items-center gap-1.5 cursor-pointer ${
              isSoundEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-white/5 text-gray-400 border-white/10'
            }`}
            title="Activar / Silenciar Cues Acústicos"
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            <span>Audio {isSoundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Haptic Toggle */}
          <button
            onClick={() => {
              const next = !isHapticEnabled;
              setIsHapticEnabled(next);
              if (next) triggerHaptic('select');
              toast.info(next ? 'Vibración Háptica Activada' : 'Vibración Desactivada');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border transition-all flex items-center gap-1.5 cursor-pointer ${
              isHapticEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-white/5 text-gray-400 border-white/10'
            }`}
            title="Activar / Desactivar Vibración Háptica"
          >
            <Vibrate className="w-4 h-4 text-cyan-400" />
            <span>Háptica {isHapticEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Test Success Chirp Button */}
          <button
            onClick={playSuccessChirp}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-sm"
            title="Probar Chirp de Autenticidad (Arpegio C6-C7 + Vibración)"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chirp Éxito</span>
          </button>

          {/* Test Fail Chirp Button */}
          <button
            onClick={playFailChirp}
            className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900/90 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-sm"
            title="Probar Chirp de Falla/Alerta (Tono Discrepante + Vibración de Alarma)"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Chirp Falla</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Viewport + Live Stream Overlay (7 cols) & Security Features Matrix (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center Viewport: Camera Stream + Verification Pulse Overlay (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-slate-950/95 overflow-hidden shadow-2xl relative flex flex-col">
            {/* Viewport Top Bar: Status, Optical Mode Selector & Pulse Trigger */}
            <div className="p-3 sm:p-4 border-b border-white/10 bg-black/60 flex items-center justify-between gap-2 flex-wrap z-20">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isCameraActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                <span className="text-xs font-mono font-extrabold text-white uppercase tracking-wider">
                  {selectedBanknote.denomination} • {selectedBanknote.series}
                </span>
              </div>

              {/* Optical Filter Mode Pills */}
              <div className="flex items-center gap-1 bg-black/70 p-1 rounded-xl border border-white/10 text-[11px] font-mono">
                <button
                  onClick={() => {
                    setFilterMode('natural');
                    triggerHaptic('select');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    filterMode === 'natural'
                      ? 'bg-slate-200 text-black font-extrabold shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  RGB Natural
                </button>
                <button
                  onClick={() => {
                    setFilterMode('uv_fluorescence');
                    playPulseAudioTone(1100);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    filterMode === 'uv_fluorescence'
                      ? 'bg-purple-600 text-white font-extrabold shadow-md shadow-purple-500/40'
                      : 'text-purple-400 hover:text-purple-300'
                  }`}
                >
                  <Moon className="w-3 h-3" />
                  UV 365nm
                </button>
                <button
                  onClick={() => {
                    setFilterMode('intaglio_relief');
                    playPulseAudioTone(1000);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    filterMode === 'intaglio_relief'
                      ? 'bg-cyan-500 text-black font-extrabold shadow-md shadow-cyan-500/40'
                      : 'text-cyan-400 hover:text-cyan-300'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  Relieve
                </button>
                <button
                  onClick={() => {
                    setFilterMode('watermark_backlight');
                    playPulseAudioTone(950);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    filterMode === 'watermark_backlight'
                      ? 'bg-amber-500 text-black font-extrabold shadow-md shadow-amber-500/40'
                      : 'text-amber-400 hover:text-amber-300'
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  Contraluz
                </button>
              </div>
            </div>

            {/* LIVE CAMERA STREAM & PULSE OVERLAY CONTAINER */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#030712] flex items-center justify-center overflow-hidden select-none">
              {/* Hidden HTML Video Stream */}
              <video
                ref={videoRef}
                playsInline
                muted
                className="hidden"
                onLoadedMetadata={() => {
                  if (canvasRef.current && videoRef.current) {
                    canvasRef.current.width = videoRef.current.videoWidth || 640;
                    canvasRef.current.height = videoRef.current.videoHeight || 480;
                  }
                }}
              />

              {/* Active Processed Live Video Canvas */}
              {isCameraActive && !capturedSnapshot && (
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={480}
                  className="w-full h-full object-cover transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})` }}
                />
              )}

              {/* Captured Photo Mode */}
              {capturedSnapshot && (
                <div className="w-full h-full relative flex items-center justify-center bg-black">
                  <img
                    src={capturedSnapshot}
                    alt="Muestra de billete analizado"
                    className={`max-w-full max-h-full object-contain ${
                      filterMode === 'uv_fluorescence' ? 'hue-rotate-180 brightness-125 contrast-150 saturate-200' : ''
                    } ${
                      filterMode === 'intaglio_relief' ? 'grayscale contrast-200 invert' : ''
                    } ${
                      filterMode === 'watermark_backlight' ? 'brightness-150 contrast-125' : ''
                    }`}
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                  <div className="absolute top-3 left-3 bg-black/80 px-3 py-1 rounded-xl text-emerald-400 text-xs font-mono border border-emerald-500/40 flex items-center gap-1.5 shadow-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    Fotografía Capturada & Procesada
                  </div>
                </div>
              )}

              {/* Synthetic Reference Banknote Mode (when camera is inactive) */}
              {!isCameraActive && !capturedSnapshot && (
                <div className={`w-full h-full relative flex items-center justify-center bg-gradient-to-br ${selectedBanknote.sampleBgGradient} p-6`}>
                  {/* Subtle Banknote Micro-Pattern Watermark Background */}
                  <div className="w-[88%] h-[80%] rounded-2xl border-2 border-emerald-400/40 bg-black/40 backdrop-blur-md p-4 relative flex flex-col justify-between shadow-2xl overflow-hidden">
                    {/* Background guilloche geometric lines */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:12px_12px]" />

                    {/* Banknote Top Row Header */}
                    <div className="flex justify-between items-start z-10">
                      <div>
                        <div className="text-[10px] font-mono tracking-widest text-emerald-400/90 font-bold uppercase">
                          BANCO EMISOR / CURRENCY SPECIFICATION
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          {selectedBanknote.denomination}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/40">
                          {selectedBanknote.substrate}
                        </span>
                        <div className="text-[11px] font-mono text-gray-300 mt-1">
                          {selectedBanknote.dimensions}
                        </div>
                      </div>
                    </div>

                    {/* Banknote Center Portrait & Security Watermark */}
                    <div className="flex items-center justify-between z-10 my-2">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-cyan-400/50 bg-cyan-950/40 flex items-center justify-center text-cyan-300 text-center p-2 text-[10px] font-mono">
                        <span>MARCA DE AGUA</span>
                      </div>

                      <div className="text-center px-2">
                        <div className="text-xs sm:text-sm font-extrabold text-white">
                          {selectedBanknote.portrait.split('/')[0]}
                        </div>
                        <div className="text-[10px] text-emerald-300 font-mono mt-0.5">
                          {selectedBanknote.colorShiftDetail}
                        </div>
                      </div>

                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-emerald-400/50 bg-emerald-950/40 flex items-center justify-center text-emerald-300 text-center p-2 text-[10px] font-mono font-bold">
                        <span>SPARK LIVE 3D</span>
                      </div>
                    </div>

                    {/* Banknote Bottom Bar */}
                    <div className="flex justify-between items-end text-[10px] font-mono text-gray-400 z-10">
                      <span>SERIE: {selectedBanknote.series}</span>
                      <span className="text-emerald-400 font-bold">ESTÁNDAR NOM-BANXICO</span>
                    </div>
                  </div>

                  {/* Start Camera Overlay Prompt */}
                  <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center z-20">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-xl mb-3 neu-inset-dark">
                      <Camera className="w-7 h-7 animate-pulse" />
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                      Cámara Lista para Escaneo en Vivo
                    </h4>
                    <p className="text-xs text-gray-300 max-w-sm mt-1 mb-4 leading-relaxed">
                      Activa la cámara de tu dispositivo para proyectar los <strong className="text-emerald-400">Pulsos de Verificación</strong> en tiempo real sobre billetes físicos.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                      <button
                        onClick={startCamera}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer transition-all active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        Activar Cámara en Vivo
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <Upload className="w-4 h-4 text-cyan-400" />
                        Cargar Imagen
                      </button>
                    </div>
                    {cameraError && (
                      <p className="text-[11px] text-amber-400 font-mono mt-3 flex items-center gap-1 bg-black/60 px-3 py-1 rounded-lg border border-amber-500/30">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {cameraError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Banknote Framing Reticle & Measurement Guides Overlay */}
              <div className="absolute inset-3 sm:inset-6 border-2 border-dashed border-emerald-400/40 rounded-3xl pointer-events-none flex flex-col justify-between p-3 z-30">
                {/* Corner Markers */}
                <div className="flex justify-between items-start text-[10px] font-mono text-emerald-400">
                  <div className="bg-black/70 px-2 py-0.5 rounded-lg border border-emerald-500/40 backdrop-blur-sm flex items-center gap-1">
                    <Target className="w-3 h-3 text-emerald-400" />
                    <span>ALINEACIÓN ÓPTICA {selectedBanknote.dimensions}</span>
                  </div>
                  <div className="bg-black/70 px-2 py-0.5 rounded-lg border border-cyan-500/40 backdrop-blur-sm text-cyan-300 font-bold">
                    PULSO: {isVerificationPulseActive ? 'ACTIVO' : 'PAUSADO'}
                  </div>
                </div>

                {/* Center Targeting Crosshair */}
                <div className="flex justify-center items-center opacity-70 pointer-events-none">
                  <Crosshair className="w-10 h-10 text-emerald-400/60 animate-spin-slow" />
                </div>

                {/* Bottom HUD Bar on Viewport */}
                <div className="flex justify-between items-end text-[10px] font-mono text-cyan-400">
                  <div className="bg-black/70 px-2 py-0.5 rounded-lg border border-cyan-500/40 backdrop-blur-sm">
                    FILTRO: {filterMode.toUpperCase()}
                  </div>
                  <div className="bg-black/70 px-2 py-0.5 rounded-lg border border-emerald-500/40 backdrop-blur-sm text-emerald-300 font-bold">
                    ZOOM: {zoomLevel.toFixed(1)}x
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* THE "VERIFICATION PULSE" ANIMATION OVERLAY ON DETECTED SECURITY NODES */}
              {/* ========================================================================= */}
              {isVerificationPulseActive && (
                <div className="absolute inset-0 pointer-events-auto z-40">
                  {/* Dynamic Vertical Laser Line Scanner */}
                  <motion.div
                    animate={{ y: ['0%', '100%', '0%'] }}
                    transition={{
                      duration: pulseSpeed === 'fast' ? 1.8 : pulseSpeed === 'slow' ? 3.5 : 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className={`absolute left-0 right-0 h-1 pointer-events-none z-30 ${
                      filterMode === 'uv_fluorescence'
                        ? 'bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_20px_#c084fc]'
                        : filterMode === 'intaglio_relief'
                        ? 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee]'
                        : 'bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#34d399]'
                    }`}
                  />

                  {/* Interactive Security Feature Target Hotspots with Concentric Verification Pulses */}
                  {currentZones.map((zone, idx) => {
                    const isSelected = activeZoneHighlight?.id === zone.id;
                    const isZonePassed = zone.verified;

                    return (
                      <div
                        key={zone.id}
                        onClick={() => {
                          setActiveZoneHighlight(zone);
                          setIsAutoCyclingZones(false);
                          if (isZonePassed) {
                            playPulseAudioTone(900 + idx * 100);
                          } else {
                            playNodeFailChirp();
                          }
                          toast.info(zone.name, zone.verificationTip);
                        }}
                        style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-40"
                        title={`${zone.name} (${isZonePassed ? 'Aprobado' : 'Fallo'})`}
                      >
                        {/* Concentric Verification Pulse Wave 1 */}
                        <motion.div
                          animate={{
                            scale: isSelected ? [1, 2.8, 3.8] : [1, 2.2, 3],
                            opacity: isSelected ? [0.8, 0.4, 0] : [0.6, 0.2, 0]
                          }}
                          transition={{
                            duration: pulseSpeed === 'fast' ? 1.4 : pulseSpeed === 'slow' ? 3.0 : 2.0,
                            repeat: Infinity,
                            delay: idx * 0.35,
                            ease: 'easeOut'
                          }}
                          className={`absolute inset-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 pointer-events-none ${
                            !isZonePassed
                              ? 'border-rose-400 bg-rose-400/15 shadow-[0_0_15px_#f43f5e]'
                              : isSelected
                              ? 'border-emerald-400 bg-emerald-400/10 shadow-[0_0_15px_#34d399]'
                              : 'border-cyan-400/60 bg-cyan-400/5'
                          }`}
                        />

                        {/* Concentric Verification Pulse Wave 2 */}
                        <motion.div
                          animate={{
                            scale: isSelected ? [1, 2.2, 3.2] : [1, 1.8, 2.5],
                            opacity: isSelected ? [0.9, 0.5, 0] : [0.7, 0.3, 0]
                          }}
                          transition={{
                            duration: pulseSpeed === 'fast' ? 1.4 : pulseSpeed === 'slow' ? 3.0 : 2.0,
                            repeat: Infinity,
                            delay: idx * 0.35 + 0.5,
                            ease: 'easeOut'
                          }}
                          className={`absolute inset-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border pointer-events-none ${
                            !isZonePassed
                              ? 'border-rose-300'
                              : isSelected
                              ? 'border-emerald-300'
                              : 'border-cyan-300/40'
                          }`}
                        />

                        {/* Central Target Node Marker */}
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all transform group-hover:scale-110 shadow-lg ${
                            !isZonePassed
                              ? 'bg-rose-600 text-white border-rose-300 shadow-[0_0_15px_#e11d48] ring-2 ring-rose-500/40'
                              : isSelected
                              ? 'bg-emerald-500 text-black border-white shadow-[0_0_20px_#10b981] ring-4 ring-emerald-500/40 font-black scale-110'
                              : 'bg-black/80 text-emerald-400 border-emerald-400/70 hover:border-emerald-300'
                          }`}
                        >
                          {isZonePassed ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                        </div>

                        {/* Floating Target Label Pill */}
                        <div
                          className={`absolute left-1/2 -translate-x-1/2 top-9 whitespace-nowrap px-2.5 py-1 rounded-xl text-[10px] font-mono font-extrabold border shadow-xl transition-all pointer-events-none ${
                            !isZonePassed
                              ? 'bg-rose-950/90 text-rose-300 border-rose-400/80 shadow-[0_0_15px_rgba(244,63,94,0.4)] opacity-100 scale-105'
                              : isSelected
                              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105'
                              : 'bg-black/85 text-gray-300 border-white/20 opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isZonePassed ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            <span>{zone.name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Viewport Bottom Controls Bar: Capture, Flash, Zoom, Sound & Pulse Speed */}
            <div className="p-3 sm:p-4 bg-black/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 z-20">
              {/* Left Control Group */}
              <div className="flex items-center gap-2 flex-wrap">
                {isCameraActive ? (
                  <>
                    <button
                      onClick={captureSnapshot}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/30 hover:brightness-110 transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Capturar & Diagnosticar
                    </button>
                    <button
                      onClick={toggleCameraFacing}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 cursor-pointer"
                      title="Alternar Cámara Frontal / Trasera"
                    >
                      <FlipHorizontal className="w-4 h-4" />
                    </button>
                    <button
                      onClick={toggleFlash}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isFlashActive
                          ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-md shadow-amber-500/30'
                          : 'bg-white/5 text-gray-300 border-white/10'
                      }`}
                      title="Linterna / Flash de Inspección"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                    <button
                      onClick={stopCamera}
                      className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer"
                      title="Detener Cámara"
                    >
                      <CameraOff className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/30 hover:brightness-110 transition-all active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      Iniciar Cámara
                    </button>
                    {capturedSnapshot && (
                      <button
                        onClick={() => {
                          setCapturedSnapshot(null);
                          setDiagnosticResult(null);
                          triggerHaptic('select');
                        }}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold border border-white/10 cursor-pointer"
                      >
                        Reiniciar Vista
                      </button>
                    )}
                  </>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 cursor-pointer"
                  title="Subir Fotografía de Billete"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>

              {/* Right Control Group: Pulse Burst, Zoom & Acoustic Feedback */}
              <div className="flex items-center gap-2">
                {/* Sound Toggle */}
                <button
                  onClick={() => {
                    const next = !isSoundEnabled;
                    setIsSoundEnabled(next);
                    if (next) playNodePassChirp(900);
                  }}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isSoundEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/5 text-gray-500 border-white/10'
                  }`}
                  title={isSoundEnabled ? 'Sonido de Radar Activo' : 'Sonido Silenciado'}
                >
                  {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Digital Zoom Controls */}
                <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-xl border border-white/10 text-xs font-mono">
                  <button
                    onClick={() => {
                      setZoomLevel(prev => Math.max(1.0, prev - 0.2));
                      triggerHaptic('select');
                    }}
                    disabled={zoomLevel <= 1.0}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Reducir Zoom"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-emerald-400 font-bold text-[11px]">
                    {zoomLevel.toFixed(1)}x
                  </span>
                  <button
                    onClick={() => {
                      setZoomLevel(prev => Math.min(3.0, prev + 0.2));
                      triggerHaptic('select');
                    }}
                    disabled={zoomLevel >= 3.0}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Aumentar Zoom Digital"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Manual Pulse Trigger Button */}
                <button
                  onClick={triggerVerificationPulseBurst}
                  className="px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/50 text-xs font-mono font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10 active:scale-95 transition-all"
                  title="Emitir Ráfaga de Pulso de Verificación"
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Emitir Pulso</span>
                </button>
              </div>
            </div>
          </div>

          {/* Banxico Official Protocol "TOCA • MIRA • GIRA" Quick Banner & Simulation Actions */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-blue-950/40 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white tracking-wider uppercase">
                  Protocolo Oficial Banxico: Toca • Mira • Gira
                </h4>
                <p className="text-[11px] text-gray-300 mt-0.5">
                  1. Siente los relieves. 2. Observa la marca de agua a contraluz. 3. Gira para ver el cambio de color Spark Live.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
              <button
                onClick={() => runDiagnosticAnalysis()}
                disabled={isAnalyzing}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all shadow-sm"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analizando...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-3.5 h-3.5" />
                    <span>Verificar Todo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Security Feature Inspector & Diagnostic Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Security Feature Spotlight Card */}
          <div className="glass-panel-reyplace rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Inspección de Nodo Activo
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = !isAutoCyclingZones;
                    setIsAutoCyclingZones(next);
                    triggerHaptic('select');
                  }}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                    isAutoCyclingZones
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-white/5 text-gray-400 border-white/10'
                  }`}
                >
                  {isAutoCyclingZones ? 'Auto-Scan: ON' : 'Auto-Scan: OFF'}
                </button>
              </div>
            </div>

            {activeZoneHighlight ? (
              <div className="space-y-3.5">
                <div className={`p-3.5 rounded-2xl bg-black/60 border space-y-2 transition-colors ${
                  activeZoneHighlight.verified ? 'border-emerald-500/40' : 'border-rose-500/50'
                }`}>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                      <Sparkles className={`w-4 h-4 shrink-0 ${activeZoneHighlight.verified ? 'text-emerald-400' : 'text-rose-400'}`} />
                      {activeZoneHighlight.name}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                      activeZoneHighlight.verified
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                      {activeZoneHighlight.verified ? `${activeZoneHighlight.score}% COINCIDENCIA` : 'FALLA ESPECTRAL'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {activeZoneHighlight.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 text-[11px] text-cyan-300 flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                    <div>
                      <strong className="text-white">Instrucción para el Ciudadano: </strong>
                      {activeZoneHighlight.verificationTip}
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-gray-400 flex items-center justify-between pt-1">
                    <span>Firma Espectral:</span>
                    <span className={`font-bold ${activeZoneHighlight.verified ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {activeZoneHighlight.spectrogramLabel}
                    </span>
                  </div>

                  {/* Node Quick Action: Toggle Pass / Fail with Sound & Haptics */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-gray-400">Estado de Validación:</span>
                    <button
                      onClick={(e) => toggleZoneVerification(activeZoneHighlight.id, e)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm ${
                        activeZoneHighlight.verified
                          ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {activeZoneHighlight.verified ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Aprobado (OK)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Sospechoso (Fallo)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* All Security Features Checklist */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-gray-400 uppercase">
                      Capas Holográficas & Espectrales ({currentZones.length}):
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {currentZones.filter(z => z.verified).length} de {currentZones.length} validadas
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {currentZones.map((zone, idx) => {
                      const isSelected = activeZoneHighlight?.id === zone.id;
                      const isVerified = zone.verified;

                      return (
                        <div
                          key={zone.id}
                          onClick={() => {
                            setActiveZoneHighlight(zone);
                            setIsAutoCyclingZones(false);
                            if (isVerified) {
                              playPulseAudioTone(900 + idx * 80);
                            } else {
                              playNodeFailChirp();
                            }
                          }}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            !isVerified
                              ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                              : isSelected
                              ? 'bg-emerald-950/60 border-emerald-500/60 text-white shadow-md'
                              : 'bg-black/30 border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              !isVerified
                                ? 'bg-rose-500'
                                : isSelected
                                ? 'bg-emerald-400 animate-ping'
                                : 'bg-emerald-500'
                            }`} />
                            <span className="text-xs font-bold truncate">{zone.name}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-mono font-extrabold ${isVerified ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isVerified ? `${zone.score}%` : 'FALLO'}
                            </span>
                            <button
                              onClick={(e) => toggleZoneVerification(zone.id, e)}
                              className={`p-1 rounded-lg border transition-all cursor-pointer ${
                                isVerified
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40'
                                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/40'
                              }`}
                              title={isVerified ? 'Marcar como fallo (Chirp de Falla)' : 'Marcar como aprobado (Chirp de Éxito)'}
                            >
                              {isVerified ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Simulation Scenarios Bar (Authentic vs Counterfeit) */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Simulaciones:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleSimulateAuthentic}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold cursor-pointer transition-all flex items-center gap-1"
                      title="Simular billete 100% auténtico con arpegio de éxito"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Simular Auténtico</span>
                    </button>
                    <button
                      onClick={handleSimulateCounterfeit}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold cursor-pointer transition-all flex items-center gap-1"
                      title="Simular pieza apócrifa con tono de alerta y vibración"
                    >
                      <ShieldAlert className="w-3 h-3 text-rose-400" />
                      <span>Simular Apócrifo</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400 text-xs">
                Selecciona un nodo del billete para inspección focalizada.
              </div>
            )}
          </div>

          {/* Diagnostic Result Card */}
          {diagnosticResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-panel-reyplace rounded-3xl p-5 border space-y-3 ${
                diagnosticResult.status === 'AUTHENTIC'
                  ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 to-black/60'
                  : diagnosticResult.status === 'SUSPICIOUS'
                  ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/30 to-black/60'
                  : 'border-rose-500/40 bg-gradient-to-b from-rose-950/30 to-black/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {diagnosticResult.status === 'AUTHENTIC' ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
                  )}
                  <h4 className="text-sm font-black text-white tracking-wider uppercase">
                    Certificado de Verificación Óptica
                  </h4>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                  diagnosticResult.status === 'AUTHENTIC'
                    ? 'bg-emerald-500 text-black'
                    : diagnosticResult.status === 'SUSPICIOUS'
                    ? 'bg-amber-500 text-black'
                    : 'bg-rose-500 text-white animate-pulse'
                }`}>
                  {diagnosticResult.status} ({diagnosticResult.authenticityScore}%)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1.5">
                <div className={`text-xs font-bold ${
                  diagnosticResult.status === 'AUTHENTIC' ? 'text-emerald-300' : 'text-rose-300'
                }`}>
                  {diagnosticResult.checksPassed} de {diagnosticResult.totalChecks} pruebas de autenticidad validadas.
                </div>
                <ul className="text-[11px] text-gray-300 space-y-1 pl-4 list-disc">
                  {diagnosticResult.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1">
                <span>TIMESTAMP: {new Date().toLocaleTimeString()}</span>
                <span className={diagnosticResult.status === 'AUTHENTIC' ? 'text-emerald-400' : 'text-rose-400'}>
                  {diagnosticResult.status === 'AUTHENTIC' ? 'HASH SHA-256 VALIDADO' : 'FALLA CRÍTICA REGISTRADA'}
                </span>
              </div>
            </motion.div>
          )}

          {/* Emergency / Counterfeit Report Action */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-gray-300">
                ¿Detectaste una pieza presuntamente apócrifa?
              </span>
            </div>
            <button
              onClick={() => {
                triggerHaptic('warning');
                toast.info('Protocolo Banxico', 'Lleva la pieza a cualquier sucursal bancaria para su envío gratuito al Banco de México.');
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold whitespace-nowrap cursor-pointer transition-all"
            >
              Guía de Retención
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
