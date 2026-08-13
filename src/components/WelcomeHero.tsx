import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Play, 
  ChevronRight, 
  Radio, 
  Lock, 
  ThumbsUp, 
  Heart, 
  Flame, 
  Rocket, 
  Star, 
  ExternalLink,
  Layers,
  Briefcase,
  LogIn,
  UserPlus,
  Compass,
  CheckCircle2,
  RefreshCw,
  Cpu
} from 'lucide-react';
import reybotAvatar from '../assets/images/reybot_avatar_1786525838254.jpg';
import heroTechBg from '../assets/images/hero_tech_bg_1786525863423.jpg';
import logoBadge from '../assets/images/reyplace_logo_badge_1786197084782.jpg';
import brandBanner from '../assets/images/reyplace_brand_banner_1786197069951.jpg';
import smartCityBanner from '../assets/images/smart_city_banner_1786197097177.jpg';
import { AuthModal } from './AuthModal';
import { ProductDetailModal, ProductServiceItem } from './ProductDetailModal';
import { useToast } from '../context/ToastContext';

interface WelcomeHeroProps {
  onNavigate?: (module: string) => void;
  onOpenVideo?: () => void;
}

interface LiveComment {
  id: string;
  user: string;
  avatar: string;
  location: string;
  text: string;
  time: string;
  reaction?: string;
}

interface FloatingReaction {
  id: string;
  symbol: string;
  x: number;
}

export function WelcomeHero({ onNavigate, onOpenVideo }: WelcomeHeroProps) {
  const { toast } = useToast();

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Product Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<ProductServiceItem | null>(null);

  // System Boot Animation Effect State
  const [isBooting, setIsBooting] = useState(true);
  const [bootText, setBootText] = useState('SISTEMA INICIANDO REYPLACE v4.8...');

  // Reybot Portal Transition State
  const [botEntered, setBotEntered] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; timestamp: string }>>([
    {
      sender: 'bot',
      text: 'Hola, soy Reybot. Bienvenido a Reyplace. ¿Qué deseas explorar hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTypingBot, setIsTypingBot] = useState(false);

  // Live Comments State (Carrusel Izquierdo estilo Facebook Live)
  const [liveComments, setLiveComments] = useState<LiveComment[]>([
    {
      id: 'c1',
      user: 'Carlos Mendoza',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      location: 'Los Mochis',
      text: 'Excelente servicio, muy rápido.',
      time: 'Hace un momento',
      reaction: '👍',
    },
    {
      id: 'c2',
      user: 'María Fernández',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      location: 'Los Mochis',
      text: 'Reylog me ayudó a organizar mis entregas.',
      time: 'Hace 1 min',
      reaction: '❤️',
    },
    {
      id: 'c3',
      user: 'Ing. Fernando Ruiz',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      location: 'Sinaloa',
      text: 'La IA está impresionante.',
      time: 'Hace 2 min',
      reaction: '🔥',
    },
  ]);

  const [userComment, setUserComment] = useState('');

  // Floating Reactions Stream
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);

  // TikTok Vertical Products Carousel State (Carrusel Derecho)
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  const productItems: ProductServiceItem[] = [
    {
      id: 'reylog',
      tag: 'LOGÍSTICA INTELIGENTE',
      title: 'Reylog',
      subtitle: 'Gestión de Envíos & Rastreo 3D',
      description: 'Optimización de rutas en tiempo real con IA para entregas e-commerce en Los Mochis y todo Sinaloa.',
      longDescription: 'Reylog es el motor logístico de última milla para empresas y comercios locales. Permite rastrear flotas en mapas 3D, calcular costos en Reycoin y automatizar manifiestos digitales con firma criptográfica.',
      image: brandBanner,
      features: [
        'Rastreo satelital GPS en tiempo real',
        'Despacho automatizado con EmmanAI',
        'Firma de entrega en Cúpula Digital',
        'Pagos contra entrega con ReyCoin'
      ],
      metrics: [
        { label: 'Tiempo Promedio', value: '28 min' },
        { label: 'Envíos/Día', value: '1,420+' },
        { label: 'Efectividad', value: '99.4%' }
      ],
      actionLabel: 'Abrir Módulo Reylog',
      moduleTarget: 'Logística'
    },
    {
      id: 'reybal',
      tag: 'FINANZAS & CONTROL',
      title: 'Reybal',
      subtitle: 'Contabilidad Digital & Facturación CFDI',
      description: 'Panel integral de finanzas corporativas, cobros QR instantáneos y conciliación bancaria automatizada.',
      longDescription: 'Reybal simplifica el control financiero empresarial. Emite comprobantes fiscales CFDI en segundos, administra tu tesorería multimoneda (MXN, USD, RYC) y genera balances auditados en tiempo real.',
      image: heroTechBg,
      features: [
        'Facturación electrónica CFDI 4.0',
        'Auditoría continua anti-fraude',
        'Sincronización con bancos de Sinaloa',
        'Wallet multisig para empresas'
      ],
      metrics: [
        { label: 'Comprobantes', value: 'Sin Límite' },
        { label: 'Ahorro Tiempo', value: '75%' },
        { label: 'Seguridad', value: 'Nivel 4' }
      ],
      actionLabel: 'Explorar Reybal',
      moduleTarget: 'Pagos & Reycoin'
    },
    {
      id: 'emmanai',
      tag: 'IA COMERCIAL PREDICTIVA',
      title: 'EmmanAI',
      subtitle: 'Automatización de Ventas & Prospección',
      description: 'Módulo de inteligencia artificial que predice comportamientos de compra y gestiona prospectos en WhatsApp.',
      longDescription: 'EmmanAI analiza datos comerciales locales para recomendar estrategias de fijación de precios, cerrar ofertas automáticamente mediante bots de lenguaje natural y cualificar prospectos 24/7.',
      image: smartCityBanner,
      features: [
        'Atención automatizada por WhatsApp',
        'Predicción de demanda por zona',
        'Cierre de ventas guiado por IA',
        'Integración con CRM Reyplace'
      ],
      metrics: [
        { label: 'Conversión', value: '+38%' },
        { label: 'Atención 24/7', value: '100%' },
        { label: 'Precisión IA', value: '96.2%' }
      ],
      actionLabel: 'Activar EmmanAI',
      moduleTarget: 'Reybot AI'
    },
    {
      id: 'noticias',
      tag: 'NOTICIAS LOS MOCHIS',
      title: 'Ahome Digital 2026',
      subtitle: 'Innovación & Desarrollo Regional',
      description: 'Últimas novedades del ecosistema tecnológico, inversión industrial y eventos comunitarios en Sinaloa.',
      longDescription: 'Mantente informado sobre la expansión del Ecosistema Digital Reyplace en Ahome y el norte de Sinaloa. Conoce los nuevos comercios afiliados, acuerdos de infraestructura y becas tecnológicas.',
      image: brandBanner,
      features: [
        'Reportes económicos de Los Mochis',
        'Directorio de empresas verificadas',
        'Convocatorias de innovación',
        'Alertas de la comunidad en tiempo real'
      ],
      metrics: [
        { label: 'Lectores', value: '45,000+' },
        { label: 'Cobertura', value: 'Sinaloa' },
        { label: 'Actualización', value: 'En Vivo' }
      ],
      actionLabel: 'Leer Noticias',
      moduleTarget: 'Comunidad'
    },
    {
      id: 'promociones',
      tag: 'OFERTAS AFILIADAS',
      title: 'Promociones Reyplace',
      subtitle: 'Cashback & Descuentos Locales',
      description: 'Accede a beneficios exclusivos pagando con Reycoin o ReyID en restaurantes y tiendas de Los Mochis.',
      longDescription: 'Descubre promociones diarias en comercios locales. Obtén hasta 20% de reembolso en Reycoin al presentar tu código QR ReyID en establecimientos participantes.',
      image: heroTechBg,
      features: [
        'Cashback directo en Reycoin',
        'Cupones digitales intransferibles',
        'Red de comercios en Los Mochis',
        'Validación por QR anti-duplicados'
      ],
      metrics: [
        { label: 'Comercios', value: '180+' },
        { label: 'Cashback', value: 'Hasta 20%' },
        { label: 'Ahorro Mes', value: '$2,400' }
      ],
      actionLabel: 'Ver Promociones',
      moduleTarget: 'Marketplace'
    }
  ];

  // Boot Effect & Bot Portal Sequence
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setBootText('SECURE ENCLAVE CÚPULA DIGITAL... OK');
    }, 800);

    const timer2 = setTimeout(() => {
      setIsBooting(false);
      setBotEntered(true);
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // TikTok Vertical Auto-scroll Carousel interval
  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setActiveProductIndex((prev) => (prev + 1) % productItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isCarouselPaused, productItems.length]);

  // Simulated Live Comments Stream Generator
  useEffect(() => {
    const sampleComments = [
      { name: 'Lic. Sofía Beltrán', loc: 'Los Mochis', text: 'Cúpula Digital protege la facturación de mi empresa.', reaction: '🛡️' },
      { name: 'Roberto Valenzuela', loc: 'Ahome', text: 'Reycoin aceptado en mi negocio local 🔥', reaction: '🔥' },
      { name: 'Dr. Alejandro Soto', loc: 'Sinaloa', text: 'Orgullo sinaloense este software corporativo!', reaction: '👏' },
      { name: 'Karla Duarte', loc: 'Los Mochis', text: 'Atención inmediata de Reybot en WhatsApp.', reaction: '💬' },
      { name: 'Héctor Leyva', loc: 'Guasave', text: 'Unión Live transmitiendo eventos en HD.', reaction: '🚀' },
    ];

    const commentInterval = setInterval(() => {
      const randomItem = sampleComments[Math.floor(Math.random() * sampleComments.length)];
      const newComment: LiveComment = {
        id: `c_${Date.now()}`,
        user: randomItem.name,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=100&auto=format&fit=crop&q=80`,
        location: randomItem.loc,
        text: randomItem.text,
        time: 'Justo ahora',
        reaction: randomItem.reaction,
      };

      setLiveComments((prev) => [newComment, ...prev.slice(0, 4)]);
      triggerReaction(randomItem.reaction || '❤️');
    }, 5500);

    return () => clearInterval(commentInterval);
  }, []);

  // Emit Floating Reaction Function
  const triggerReaction = (symbol: string) => {
    const newReaction: FloatingReaction = {
      id: `react_${Date.now()}_${Math.random()}`,
      symbol,
      x: Math.floor(Math.random() * 60) + 20, // percentage horizontal placement
    };

    setFloatingReactions((prev) => [...prev.slice(-12), newReaction]);

    // Clean up reaction after animation
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2500);
  };

  // User submits a live comment
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    const newComment: LiveComment = {
      id: `usr_${Date.now()}`,
      user: 'Tú (Visitante)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      location: 'Los Mochis, SIN',
      text: userComment,
      time: 'Justo ahora',
      reaction: '👍',
    };

    setLiveComments((prev) => [newComment, ...prev.slice(0, 4)]);
    setUserComment('');
    triggerReaction('🔥');
    toast.success('Comentario enviado', 'Tu mensaje ha sido transmitido en el stream en vivo.');
  };

  // Interactive Reybot Chat Handler
  const handleSendMessage = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setInputMessage('');
    setIsTypingBot(true);

    // AI Intelligent Response simulation
    setTimeout(() => {
      let botAnswer = 'Con gusto te ayudo. En el Ecosistema Reyplace integrámos logística, finanzas, IA y seguridad para empresas de Sinaloa. ¿Deseas probar algún módulo específico?';

      const qLower = query.toLowerCase();
      if (qLower.includes('reylog') || qLower.includes('logistica') || qLower.includes('envio')) {
        botAnswer = 'Reylog es nuestro centro de logística 3D. Optimiza entregas e-commerce con mapas en vivo en Los Mochis. ¿Te llevo al módulo de Logística?';
      } else if (qLower.includes('reybal') || qLower.includes('finanza') || qLower.includes('factura')) {
        botAnswer = 'Reybal te permite emitir comprobantes fiscales CFDI 4.0 y administrar tu tesorería en ReyCoin y MXN de forma segura.';
      } else if (qLower.includes('emmanai') || qLower.includes('ia') || qLower.includes('ventas')) {
        botAnswer = 'EmmanAI es nuestro motor de inteligencia artificial comercial predictiva que automatiza tus ventas por WhatsApp 24/7.';
      } else if (qLower.includes('registro') || qLower.includes('cuenta')) {
        botAnswer = 'Para registrarte, pulsa el botón "Registrarme". Tu identidad ReyID se generará instantáneamente con encripción criptográfica.';
      } else if (qLower.includes('mochis') || qLower.includes('sinaloa') || qLower.includes('ubicacion')) {
        botAnswer = 'Nuestra sede central opera desde Los Mochis, Sinaloa, México, conectando a negocios y ciudadanos con tecnología de vanguardia.';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTypingBot(false);
    }, 900);
  };

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col justify-between overflow-hidden rounded-3xl bg-[#050a18] border border-cyan-500/30 shadow-2xl p-3 sm:p-6 text-white my-2">
      {/* 1. BACKGROUND VIDEO & HOLOGRAPHIC MESH SYSTEM */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Background Image Texture */}
        <img
          src={heroTechBg}
          alt="Reyplace Futuristic Corporate Background"
          className="w-full h-full object-cover opacity-25 mix-blend-screen scale-105"
        />

        {/* Ambient Animated Gradient Blobs */}
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#00d2ff]/15 blur-[120px] animate-liquid-morph" />
        <div className="absolute bottom-0 -left-20 w-[550px] h-[550px] bg-[#d946ef]/15 blur-[130px] animate-liquid-morph-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#2563eb]/10 blur-[150px] pointer-events-none" />

        {/* SVG Holographic Lines Overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="holoLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#2563eb" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d946ef" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <line x1="0" y1="20%" x2="100%" y2="80%" stroke="url(#holoLine)" strokeWidth="1" strokeDasharray="6,12" />
          <line x1="100%" y1="10%" x2="0" y2="90%" stroke="url(#holoLine)" strokeWidth="1" strokeDasharray="4,10" />
          <circle cx="50%" cy="50%" r="350" stroke="url(#holoLine)" strokeWidth="1" fill="none" strokeDasharray="8,16" className="animate-spin-slow" />
        </svg>
      </div>

      {/* SYSTEM BOOTING NOTIFICATION BAR */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-[#061024]/90 border border-[#00d2ff]/50 px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg flex items-center gap-2 text-xs font-mono text-[#00d2ff]"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00d2ff]" />
            <span>{bootText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. BARRA SUPERIOR — NAVEGACIÓN PRINCIPAL */}
      <header className="relative z-30 flex flex-col md:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl glass-panel-reyplace border border-white/10 shadow-xl">
        {/* Logo & Location */}
        <div className="flex items-center gap-3">
          <div className="relative group flex items-center gap-2.5">
            <div className="p-1 rounded-xl bg-gradient-to-br from-[#00d2ff] via-[#2563eb] to-[#d946ef] p-[1.5px] shadow-lg shadow-cyan-500/20">
              <img
                src={logoBadge}
                alt="Reyplace Holographic Emblem"
                className="w-9 h-9 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="brand-text-gradient text-xl font-black tracking-widest leading-none">
                  REYPLACE
                </span>
                <span className="rainbow-shimmer-stamp hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00d2ff]/15 border border-[#00d2ff]/30 text-[9px] font-mono font-bold text-[#00d2ff]">
                  <ShieldCheck className="shimmer-icon w-3 h-3 text-[#00d2ff]" />
                  <span className="shimmer-text">VERIFIED</span>
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono tracking-wider mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#f97316]" /> Los Mochis, Sinaloa, México
              </p>
            </div>
          </div>
        </div>

        {/* Security & System Info Status */}
        <div className="hidden lg:flex items-center gap-3 bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/10 font-mono text-[10px]">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
          <span className="text-gray-300">CÚPULA DIGITAL: <strong className="text-[#10b981]">ONLINE</strong></span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400">MICROTEXT_SECURITY: <code className="text-[#00d2ff]">0x8F...4B12</code></span>
        </div>

        {/* Navigation Action Buttons & WhatsApp */}
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
          {/* WhatsApp Direct Access */}
          <a
            href="https://wa.me/526682523847?text=Hola%20Reyplace,%20necesito%20asistencia%20en%20el%20Ecosistema"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10b981]/15 hover:bg-[#10b981]/25 border border-[#10b981]/30 text-[#10b981] text-xs font-mono font-bold transition-all hover:scale-105"
            title="Soporte directo por WhatsApp: 6682523847"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp:</span>
            <span>6682523847</span>
          </a>

          <button
            onClick={() => {
              if (onNavigate) onNavigate('Ecosistema');
              toast.info('Ecosistema', 'Navegando al resumen del ecosistema digital.');
            }}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 transition-colors cursor-pointer"
          >
            Ecosistema
          </button>

          <button
            onClick={() => openAuth('login')}
            className="px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] transition-colors cursor-pointer flex items-center gap-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Inicio de Sesión</span>
          </button>

          <button
            onClick={() => openAuth('signup')}
            className="brand-button-spectrum text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer shadow-md"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Registro</span>
          </button>
        </div>
      </header>

      {/* MAIN HERO GRID: LEFT LIVE STREAM | CENTER REYBOT | RIGHT TIKTOK CAROUSEL */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center my-4">

        {/* 4. CARRUSEL IZQUIERDO — COMENTARIOS EN VIVO (Estilo Facebook Live) */}
        <div className="lg:col-span-3 space-y-3 order-2 lg:order-1 relative">
          
          {/* Live Reactions Floating Container */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
            {floatingReactions.map((react) => (
              <motion.div
                key={react.id}
                initial={{ opacity: 1, y: 150, scale: 0.6 }}
                animate={{ opacity: 0, y: -120, scale: 1.5 }}
                transition={{ duration: 2.2, ease: 'easeOut' }}
                style={{ left: `${react.x}%` }}
                className="absolute text-2xl drop-shadow-lg"
              >
                {react.symbol}
              </motion.div>
            ))}
          </div>

          <div className="p-4 rounded-3xl glass-panel-reyplace border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
                  En Vivo • Comentarios
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                1,248 Conectados
              </span>
            </div>

            {/* Live Comment Stream Cards */}
            <div className="space-y-2.5 max-h-[280px] overflow-hidden flex flex-col justify-start">
              <AnimatePresence initial={false}>
                {liveComments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -30, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35 }}
                    className="p-2.5 rounded-2xl bg-black/40 border border-white/10 hover:border-[#00d2ff]/30 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <img
                            src={comment.avatar}
                            alt={comment.user}
                            className="w-6 h-6 rounded-full object-cover border border-[#00d2ff]/40"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#10b981] border border-black" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-[11px] block leading-none">{comment.user}</span>
                          <span className="text-[9px] text-[#00d2ff] font-mono">{comment.location}</span>
                        </div>
                      </div>
                      <span className="text-[10px]">{comment.reaction}</span>
                    </div>
                    <p className="text-gray-300 text-[11px] pl-8 leading-tight">
                      "{comment.text}"
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* User Interaction: Quick Reaction Buttons & Comment Input */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-around bg-black/40 py-1.5 px-2 rounded-2xl border border-white/5">
                {[
                  { symbol: '👍', label: 'Like' },
                  { symbol: '❤️', label: 'Love' },
                  { symbol: '🔥', label: 'Fire' },
                  { symbol: '🚀', label: 'Rocket' },
                  { symbol: '👏', label: 'Clap' },
                ].map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={() => triggerReaction(btn.symbol)}
                    className="hover:scale-130 transition-transform active:scale-90 text-base cursor-pointer p-1"
                    title={`Enviar ${btn.label}`}
                  >
                    {btn.symbol}
                  </button>
                ))}
              </div>

              <form onSubmit={handlePostComment} className="flex gap-1.5">
                <input
                  type="text"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff]"
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-xl bg-[#00d2ff]/20 hover:bg-[#00d2ff]/30 text-[#00d2ff] border border-[#00d2ff]/40 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Holographic Verification Badge / Anti-Fraud Layer */}
          <div className="rainbow-shimmer-stamp p-3 rounded-2xl bg-black/40 border border-[#00d2ff]/30 flex items-center justify-between text-[10px] font-mono text-gray-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="shimmer-icon w-4 h-4 text-[#00d2ff] shrink-0 animate-pulse" />
              <span className="shimmer-text font-bold">SELLO REYPLACE VERIFIED</span>
            </div>
            <span className="text-[#10b981] font-bold px-2 py-0.5 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30">100% SEGURO</span>
          </div>
        </div>

        {/* 2. REYBOT — ASISTENTE DE BIENVENIDA (CENTRO DE LA PANTALLA) */}
        <div className="lg:col-span-6 flex flex-col items-center text-center space-y-4 order-1 lg:order-2 py-2">

          {/* Reybot Image / Floating Robot Entrance */}
          <div className="relative group flex flex-col items-center">
            {/* Luminous Sphere Portal Background Effect */}
            <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-[#00d2ff]/30 via-[#2563eb]/20 to-[#d946ef]/30 blur-2xl animate-pulse pointer-events-none -z-10" />

            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.7 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, type: 'spring', stiffness: 100, damping: 15 }}
              className="relative cursor-pointer"
              onClick={() => handleSendMessage(undefined, 'Hola Reybot, explícame la plataforma')}
            >
              {/* Crown Glow & Portal Ring */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-28 border border-[#00d2ff]/40 rounded-full animate-ping pointer-events-none" />

              <motion.img
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                src={reybotAvatar}
                alt="Reybot - Asistente de Bienvenida Reyplace"
                className="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-3xl shadow-2xl border-2 border-[#00d2ff]/40 drop-shadow-[0_10px_30px_rgba(0,210,255,0.4)]"
                referrerPolicy="no-referrer"
              />

              {/* Verified Crown Tag */}
              <div className="absolute -bottom-2 bg-[#061024]/90 border border-[#00d2ff]/50 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold text-[#00d2ff] shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#d946ef]" /> REYBOT AI GUARDIAN
              </div>
            </motion.div>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Bienvenido al <span className="brand-text-gradient">Ecosistema Reyplace</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto font-medium">
              Conectamos • Innovamos • Transformamos — El software corporativo líder en Los Mochis, Sinaloa.
            </p>
          </div>

          {/* Minimal Chat Interface (El Corazón del Módulo 1) */}
          <div className="w-full max-w-md rounded-3xl glass-panel-reyplace border border-[#00d2ff]/30 p-4 shadow-2xl text-left space-y-3">
            {/* Automatic Initial Message */}
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-[#00d2ff]/20 border border-[#00d2ff]/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-[#00d2ff]" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#2563eb] to-[#d946ef] text-white rounded-tr-none font-medium'
                        : 'bg-black/60 border border-white/10 text-gray-200 rounded-tl-none font-sans'
                    }`}
                  >
                    {msg.text}
                    <span className="block text-[9px] text-gray-400 mt-1 text-right font-mono opacity-80">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTypingBot && (
                <div className="flex gap-2 items-center text-xs text-[#00d2ff] font-mono bg-black/40 p-2 rounded-xl border border-[#00d2ff]/20">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                  <span>Reybot está procesando la respuesta...</span>
                </div>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono no-scrollbar">
              <button
                onClick={() => handleSendMessage(undefined, '¿Qué es Reylog?')}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 shrink-0 cursor-pointer"
              >
                🚚 Logística Reylog
              </button>
              <button
                onClick={() => handleSendMessage(undefined, '¿Qué es Reybal?')}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 shrink-0 cursor-pointer"
              >
                💰 Finanzas Reybal
              </button>
              <button
                onClick={() => handleSendMessage(undefined, '¿Cómo funciona EmmanAI?')}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 shrink-0 cursor-pointer"
              >
                🤖 IA EmmanAI
              </button>
            </div>

            {/* Input Chat Field */}
            <form onSubmit={(e) => handleSendMessage(e)} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Pregunta algo a Reybot..."
                className="w-full bg-black/60 border border-white/15 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff]"
              />
              <button
                type="submit"
                className="brand-button-spectrum text-white p-2.5 rounded-2xl flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* VISIBLE FUNCTION BUTTONS (Las 4 Funciones Principales Requeridas) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl">
            {/* 1. Explorar Ecosistema */}
            <button
              onClick={() => {
                if (onNavigate) onNavigate('Ecosistema');
                toast.info('Ecosistema', 'Explorando la arquitectura del ecosistema.');
              }}
              className="group p-3.5 rounded-2xl bg-white/5 hover:bg-[#00d2ff]/10 border border-white/10 hover:border-[#00d2ff]/40 text-white font-bold text-xs flex flex-col items-center gap-2 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,210,255,0.25)] cursor-pointer backdrop-blur-md"
            >
              <div className="p-2 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] group-hover:scale-110 group-hover:bg-[#00d2ff] group-hover:text-black transition-all">
                <Compass className="w-5 h-5" />
              </div>
              <span className="group-hover:text-[#00d2ff] transition-colors">Explorar Ecosistema</span>
            </button>

            {/* 2. Ver Servicios */}
            <button
              onClick={() => {
                if (onNavigate) onNavigate('Servicios Pro');
                toast.info('Servicios Pro', 'Abriendo el catálogo de servicios corporativos.');
              }}
              className="group p-3.5 rounded-2xl bg-white/5 hover:bg-[#d946ef]/10 border border-white/10 hover:border-[#d946ef]/40 text-white font-bold text-xs flex flex-col items-center gap-2 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(217,70,239,0.25)] cursor-pointer backdrop-blur-md"
            >
              <div className="p-2 rounded-xl bg-[#d946ef]/10 border border-[#d946ef]/30 text-[#d946ef] group-hover:scale-110 group-hover:bg-[#d946ef] group-hover:text-black transition-all">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="group-hover:text-[#d946ef] transition-colors">Ver Servicios</span>
            </button>

            {/* 3. Iniciar Sesión */}
            <button
              onClick={() => openAuth('login')}
              className="group p-3.5 rounded-2xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 hover:border-[#00d2ff]/60 text-[#00d2ff] font-bold text-xs flex flex-col items-center gap-2 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] cursor-pointer backdrop-blur-md"
            >
              <div className="p-2 rounded-xl bg-[#00d2ff]/20 border border-[#00d2ff]/40 text-[#00d2ff] group-hover:scale-110 group-hover:bg-[#00d2ff] group-hover:text-black transition-all">
                <LogIn className="w-5 h-5" />
              </div>
              <span>Iniciar Sesión</span>
            </button>

            {/* 4. Registrarme */}
            <button
              onClick={() => openAuth('signup')}
              className="group p-3.5 rounded-2xl brand-button-spectrum text-white font-extrabold text-xs flex flex-col items-center gap-2 transition-all hover:scale-105 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(217,70,239,0.5)]"
            >
              <div className="p-2 rounded-xl bg-white/20 border border-white/30 text-white group-hover:scale-110 transition-all">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <span>Registrarme</span>
            </button>
          </div>
        </div>

        {/* 3. CARRUSEL DERECHO — PRODUCTOS / SERVICIOS / NOVEDADES (Estilo TikTok Vertical) */}
        <div className="lg:col-span-3 space-y-3 order-3 relative">
          <div
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
            className="p-4 rounded-3xl glass-panel-reyplace border border-white/10 space-y-3 shadow-xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#d946ef]" />
                <span className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
                  Destacados TikTok
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                {activeProductIndex + 1} / {productItems.length}
              </span>
            </div>

            {/* TikTok Vertical Card Stack */}
            <div className="relative min-h-[310px] overflow-hidden flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={productItems[activeProductIndex].id}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.95 }}
                  transition={{ duration: 0.45 }}
                  className="rounded-2xl overflow-hidden border border-white/15 bg-black/60 flex flex-col justify-between p-3 relative group"
                >
                  {/* Card Media Preview */}
                  <div className="relative rounded-xl overflow-hidden h-32 mb-2">
                    <img
                      src={productItems[activeProductIndex].image}
                      alt={productItems[activeProductIndex].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#00d2ff]/30 text-[#00d2ff] border border-[#00d2ff]/40 text-[9px] font-mono font-bold uppercase backdrop-blur-md">
                      {productItems[activeProductIndex].tag}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-white flex items-center justify-between">
                      <span>{productItems[activeProductIndex].title}</span>
                      <ChevronRight className="w-4 h-4 text-[#00d2ff]" />
                    </h3>
                    <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed">
                      {productItems[activeProductIndex].description}
                    </p>
                  </div>

                  {/* Action "Ver más" */}
                  <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400">
                      {productItems[activeProductIndex].subtitle}
                    </span>
                    <button
                      onClick={() => setSelectedProduct(productItems[activeProductIndex])}
                      className="px-3 py-1.5 rounded-xl bg-[#00d2ff]/15 hover:bg-[#00d2ff]/25 border border-[#00d2ff]/40 text-[#00d2ff] font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Ver más</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-1">
                {productItems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveProductIndex(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === activeProductIndex ? 'w-6 bg-[#00d2ff]' : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[9px] text-gray-500 font-mono">Auto-Scroll Suave</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          if (onNavigate) onNavigate('Ecosistema');
        }}
      />

      <ProductDetailModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
