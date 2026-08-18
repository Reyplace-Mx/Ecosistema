import React, { useState } from 'react';
import { motion } from 'motion/react';
import { IntroVideoModal } from '../components/IntroVideoModal';
import { WelcomeHero } from '../components/WelcomeHero';
import { HUDWidgetSystem } from '../components/HUDWidgetSystem';
import brandBanner from '../assets/images/reyplace_brand_banner_1786197069951.jpg';
import logoBadge from '../assets/images/reyplace_logo_badge_1786197084782.jpg';
import { 
  CloudSun,
  Bell,
  Bot,
  Fingerprint,
  TrendingUp,
  Coins,
  ShoppingCart,
  Truck,
  Wallet,
  Cpu,
  Store,
  Settings,
  PlusCircle,
  PackagePlus,
  CreditCard,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Database,
  Server,
  Play,
  Film,
  MapPin,
  Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Interactive3DUniverse } from '../components/Interactive3DUniverse';
import { RecentActivityLog } from '../components/RecentActivityLog';

interface HomeDashboardProps {
  onNavigate?: (module: string) => void;
}

export function HomeDashboard({ onNavigate }: HomeDashboardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const greeting = user ? `Buenos días, ${user.name}` : 'Buenos días, Global Tech';

  const handleAction = (title: string, msg: string) => {
    toast.info(title, msg);
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-4 sm:space-y-6 h-full flex flex-col overflow-y-auto relative">
      {/* Botón IA Flotante */}
      <motion.button 
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.90 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        onClick={() => {
          if (onNavigate) onNavigate('Reybot AI');
          toast.info('Reybot AI Guardian', 'Abriendo el asistente conversacional del ecosistema...');
        }}
        aria-label="Abrir Reybot IA"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-cyan-600 hover:bg-cyan-500 text-black rounded-full shadow-lg shadow-cyan-500/30 flex items-center justify-center z-50 cursor-pointer"
      >
        <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.button>

      {/* Intro Video Modal */}
      <IntroVideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />

      {/* Hero de Bienvenida (Pantalla Inicial) */}
      <WelcomeHero onNavigate={onNavigate} onOpenVideo={() => setIsVideoOpen(true)} />

      {/* Universo WebGL 3D Interactivo */}
      <Interactive3DUniverse />

      {/* Header Inteligente */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 bg-[#111112] p-4 sm:p-6 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            {greeting}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">Resumen del ecosistema y operaciones</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 self-start sm:self-auto">
          <div className="flex items-center gap-2 bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white/10">
            <CloudSun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            <span className="text-xs sm:text-sm font-medium text-white">22°C</span>
            <span className="text-[10px] sm:text-xs text-gray-400">Smart City</span>
          </div>
          <button 
            onClick={() => toast.info('Notificaciones', 'Cúpula Digital monitorizando 0 amenazas activas.')}
            className="relative p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/10 cursor-pointer"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
        </div>
      </header>

      {/* HUD Widget System with Framer Motion Auto-Stacking on Mobile & Pin Reordering */}
      <HUDWidgetSystem onNavigate={onNavigate} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Columna Izquierda: Tarjeta Identidad y Acciones */}
        <div className="xl:col-span-8 space-y-4 sm:space-y-6">
          
          {/* Tarjeta de Presentación / Video Intro Reyplace */}
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 group shadow-2xl bg-[#0c0c0e]">
            <img
              src={brandBanner}
              alt="Reyplace Banner Oficial"
              className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-xs font-mono text-cyan-300">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Ecosistema Oficial
                </div>
                <div className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-xl text-[10px] font-mono text-cyan-400 uppercase font-bold">
                  <MapPin className="w-3 h-3" /> Los Mochis, Sinaloa
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <img
                      src={logoBadge}
                      alt="Reyplace Emblem"
                      className="w-8 h-8 rounded-lg border border-cyan-500/40 object-cover shadow-lg"
                      referrerPolicy="no-referrer"
                    />
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Reyplace</h2>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-cyan-300 font-mono tracking-wider">
                    CONECTAMOS • INNOVAMOS • TRANSFORMAMOS
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsVideoOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-colors cursor-pointer shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" /> Reproducir Video Intro 🎥
                </motion.button>
              </div>
            </div>
          </div>

          {/* Tarjeta Identidad Reyplace */}
          <div className="bg-gradient-to-br from-[#111112] to-[#1a1a1c] border border-cyan-500/20 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
               <Fingerprint className="w-48 h-48 text-cyan-500" />
             </div>
             
             <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-10">
               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                 <Store className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
               </div>
               <div>
                 <h2 className="text-lg sm:text-2xl font-bold text-white">{user?.name || 'Global Tech Solutions'}</h2>
                 <p className="text-xs sm:text-sm text-cyan-400 font-mono">ReyID: {user?.did || '0x99...b8e1'}</p>
               </div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 relative z-10">
               <div className="bg-[#080809]/80 backdrop-blur-sm border border-white/5 rounded-xl p-3 sm:p-4">
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Nivel</p>
                 <p className="text-lg sm:text-xl font-bold text-white">{user?.role || 'Pro Business'}</p>
               </div>
               <div className="bg-[#080809]/80 backdrop-blur-sm border border-white/5 rounded-xl p-3 sm:p-4">
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Reputación</p>
                 <div className="flex items-center gap-2">
                   <p className="text-lg sm:text-xl font-bold text-white">4.9/5</p>
                   <TrendingUp className="w-4 h-4 text-green-400" />
                 </div>
               </div>
               <div className="bg-[#080809]/80 backdrop-blur-sm border border-cyan-500/10 rounded-xl p-3 sm:p-4">
                 <p className="text-[10px] uppercase font-bold tracking-widest text-cyan-500/70 mb-1">Balance ReyCoin</p>
                 <div className="flex items-center gap-2">
                   <Coins className="w-4 h-4 text-cyan-400" />
                   <p className="text-lg sm:text-xl font-bold text-white">{(user?.reycoinBalance ?? 12450).toLocaleString('en-US', { minimumFractionDigits: 2 })} RYC</p>
                 </div>
               </div>
             </div>
          </div>

          {/* Módulos Principales (Grid Responsivo CSS auto-fit) */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-3 sm:mb-4">Accesos Rápidos a Módulos</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 sm:gap-4">
              {[
                { name: 'Marketplace', target: 'Marketplace', icon: ShoppingCart, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                { name: 'Logística', target: 'Logística', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                { name: 'Wallet', target: 'Pagos & Reycoin', icon: Wallet, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
                { name: 'Reybot IA', target: 'Reybot AI', icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                { name: 'Empresa', target: 'Negocios', icon: Store, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
                { name: 'Centro de Control', target: 'Cúpula Digital', icon: Settings, color: 'text-gray-400', bg: 'bg-white/5', border: 'border-white/10' },
              ].map((module) => (
                <motion.button 
                  key={module.name}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  onClick={() => {
                    if (onNavigate) onNavigate(module.target);
                    toast.info(`Navegando a ${module.name}`, `Abriendo panel principal...`);
                  }}
                  className="bg-[#111112] border border-white/5 hover:border-cyan-500/30 hover:bg-white/5 transition-colors rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center gap-2 sm:gap-3 group cursor-pointer shadow-md hover:shadow-cyan-500/10 active:bg-cyan-500/10"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${module.bg} ${module.border} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <module.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${module.color}`} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white group-hover:text-cyan-400 transition-colors text-center">{module.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-3 sm:mb-4">Acciones Frecuentes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <motion.button 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => handleAction('Crear Producto', 'Módulo de catálogo iniciado en el Marketplace.')}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-xl p-3 sm:p-4 flex flex-col items-center gap-2 transition-colors cursor-pointer active:bg-cyan-500/10"
              >
                <PlusCircle className="w-5 h-5 text-gray-300" />
                <span className="text-xs font-bold text-gray-300">Crear Producto</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => handleAction('Crear Envío', 'Generando orden de recolección en Logística Reyplace.')}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-xl p-3 sm:p-4 flex flex-col items-center gap-2 transition-colors cursor-pointer active:bg-cyan-500/10"
              >
                <PackagePlus className="w-5 h-5 text-gray-300" />
                <span className="text-xs font-bold text-gray-300">Crear Envío</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => handleAction('Cobrar con Reycoin', 'Generando código QR / Link de cobro seguro.')}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-xl p-3 sm:p-4 flex flex-col items-center gap-2 transition-colors cursor-pointer active:bg-cyan-500/10"
              >
                <CreditCard className="w-5 h-5 text-gray-300" />
                <span className="text-xs font-bold text-gray-300">Cobrar</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => {
                  if (onNavigate) onNavigate('Reybot AI');
                  toast.info('Consulta Reybot IA', 'Abriendo hilo de análisis predictivo...');
                }}
                className="bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-xl p-3 sm:p-4 flex flex-col items-center gap-2 transition-colors cursor-pointer active:bg-cyan-500/20 shadow-lg shadow-cyan-500/10"
              >
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-400">Consultar IA</span>
              </motion.button>
            </div>
          </div>

          {/* Registro de Actividad Reciente ReyID (Últimas 5 Autenticaciones Exitosas) */}
          <RecentActivityLog onNavigateToReyID={() => onNavigate && onNavigate('ReyID & Usuarios')} />

        </div>

        {/* Columna Derecha: Feed Inteligente */}
        <div className="xl:col-span-4 space-y-4 sm:space-y-6">
          <div className="bg-[#111112] border border-white/5 rounded-2xl shadow-xl flex flex-col h-full min-h-[400px] sm:min-h-[500px]">
            <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Feed Inteligente
              </h3>
            </div>
            
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
              {/* Alerta */}
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 sm:p-4 flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-rose-500 mb-1">Inventario Bajo</p>
                  <p className="text-xs text-gray-400">El producto "Smart Sensor V2" está por agotarse. Te quedan 3 unidades en la bodega Norte.</p>
                </div>
              </div>
              
              {/* Recomendación IA */}
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 sm:p-4 flex gap-3 items-start">
                <Bot className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-cyan-400 mb-1">Sugerencia de Reybot</p>
                  <p className="text-xs text-gray-400">He notado un aumento del 15% en búsquedas de sensores en tu zona. ¿Deseas lanzar una promoción rápida?</p>
                  <button 
                    onClick={() => toast.success('Promoción Creada', 'Campañas automatizadas creadas en Marketplace.')}
                    className="mt-3 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-bold rounded transition-colors cursor-pointer"
                  >
                    Crear Promoción
                  </button>
                </div>
              </div>

              {/* Oportunidad */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 sm:p-4 flex gap-3 items-start">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-500 mb-1">Oportunidad de Contrato</p>
                  <p className="text-xs text-gray-400">El Gobierno Digital ha publicado una licitación para infraestructura Smart City que coincide con tu perfil.</p>
                  <button 
                    onClick={() => {
                      if (onNavigate) onNavigate('Gobierno Digital');
                      toast.info('Gobierno Digital', 'Mostrando pliegos de licitación Smart City...');
                    }}
                    className="mt-3 text-amber-500 text-xs font-bold hover:underline cursor-pointer"
                  >
                    Ver Licitación &rarr;
                  </button>
                </div>
              </div>
              
              {/* Notificación general */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 flex gap-3 items-start">
                <Truck className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white mb-1">Envío Entregado</p>
                  <p className="text-xs text-gray-400">El pedido #8922 ha sido confirmado por el cliente. Fondos liberados en Escrow.</p>
                  <p className="text-[10px] text-gray-500 mt-2 font-mono">Hace 2 horas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      {/* Integraciones & Proyectos (Ahorro de Tokens) */}
      <div className="mt-4 sm:mt-6 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-cyan-500/20 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Database className="w-32 h-32 text-cyan-400" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Server className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Consolidación de Proyectos & Tokens</h3>
              <p className="text-xs sm:text-sm text-cyan-400/80">Hemos analizado e integrado tus proyectos para optimizar el gasto de gas y tokens de IA.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-[#080809]/60 backdrop-blur-md border border-white/5 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">API Ecosistema</span>
                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-mono">INTEGRADO</span>
              </div>
              <p className="text-sm text-white font-medium mb-1">Endpoints Unificados</p>
              <p className="text-xs text-gray-500">Se consolidaron 5 APIs legacy. Ahorro estimado: 45% en peticiones IA.</p>
            </div>
            <div className="bg-[#080809]/60 backdrop-blur-md border border-white/5 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contratos L2</span>
                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-mono">OPTIMIZADO</span>
              </div>
              <p className="text-sm text-white font-medium mb-1">Rollups de Reycoin</p>
              <p className="text-xs text-gray-500">Transacciones batch para la Wallet. Ahorro de 80% en gas fees.</p>
            </div>
            <div className="bg-[#080809]/60 backdrop-blur-md border border-white/5 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bases de Datos</span>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-mono">SINCRONIZADO</span>
              </div>
              <p className="text-sm text-white font-medium mb-1">Data Lakes (Smart City)</p>
              <p className="text-xs text-gray-500">Ingesta centralizada de sensores, reduciendo duplicidad de datos.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

