import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IntroVideoModal } from './IntroVideoModal';
import { ThemeSelector } from './ThemeSelector';
import { CommandPalette } from './CommandPalette';
import { NotificationsDrawer } from './NotificationsDrawer';
import { UserProfilePopover } from './UserProfilePopover';
import { ShortcutsModal } from './ShortcutsModal';
import { AntiTheftLockModal } from './AntiTheftLockModal';
import { BiometricVerificationOverlay } from './BiometricVerificationOverlay';
import { useSecurityStore } from '../store/useSecurityStore';
import { useBiometricStore } from '../store/useBiometricStore';
import logoBadge from '../assets/images/reyplace_logo_badge_1786197084782.jpg';
import {
  Fingerprint,
  ShoppingCart,
  Briefcase,
  Rss,
  Building2,
  Hexagon,
  Cpu,
  Shield,
  MessageSquare,
  LogOut,
  Search,
  Bell,
  Menu,
  Store,
  Truck,
  Coins,
  Users,
  GraduationCap,
  Database,
  Landmark,
  Server,
  Home,
  Film,
  Layers,
  Keyboard,
  ChevronRight,
  ChevronUp,
  GripVertical
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export interface LayoutProps {
  children: React.ReactNode;
  activeModule?: string;
  onModuleChange?: (moduleName: string) => void;
}

const NAVIGATION = [
  {
    category: 'Principal',
    items: [
      { name: 'Inicio', icon: Home },
      { name: 'Arquitectura & PM', icon: Layers },
      { name: 'ReyID & Usuarios', icon: Fingerprint },
    ]
  },
  {
    category: 'Ecosistema',
    items: [
      { name: 'Comunidad', icon: Users },
      { name: 'Academia', icon: GraduationCap },
      { name: 'Unión.live', icon: MessageSquare },
      { name: 'Pro News', icon: Rss },
    ]
  },
  {
    category: 'Negocios & Operaciones',
    items: [
      { name: 'Negocios', icon: Store },
      { name: 'Marketplace', icon: ShoppingCart },
      { name: 'Servicios Pro', icon: Briefcase },
      { name: 'Perfil Pro (Público)', icon: Briefcase },
      { name: 'Logística', icon: Truck },
      { name: 'ERP Reyplace', icon: Database },
    ]
  },
  {
    category: 'Ciudad & Gobierno',
    items: [
      { name: 'Smart City', icon: Building2 },
      { name: 'Gobierno Digital', icon: Landmark },
    ]
  },
  {
    category: 'Core & Web3',
    items: [
      { name: 'Reybot AI', icon: Cpu },
      { name: 'Pagos & Reycoin', icon: Coins },
      { name: 'Cúpula Digital', icon: Shield },
      { name: 'Blockchain Layer', icon: Hexagon },
      { name: 'Infraestructura', icon: Server },
    ]
  }
];

export function Layout({ children, activeModule = 'ReyID & Usuarios', onModuleChange }: LayoutProps) {
  const { cupulaActive, securityScore } = useSecurityStore();
  const { requestVerification } = useBiometricStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Drag and drop navigation order state
  const [navGroups, setNavGroups] = useState(() => {
    try {
      const saved = localStorage.getItem('reyplace_nav_order');
      if (saved) {
        const orderMap = JSON.parse(saved);
        return NAVIGATION.map(group => ({
          ...group,
          items: [...group.items].sort((a, b) => {
            const orderA = orderMap[group.category]?.indexOf(a.name) ?? 999;
            const orderB = orderMap[group.category]?.indexOf(b.name) ?? 999;
            return orderA - orderB;
          })
        }));
      }
    } catch (e) {
      // fallback
    }
    return NAVIGATION;
  });

  const [draggedItem, setDraggedItem] = useState<{ category: string; name: string } | null>(null);

  const handleDragStart = (category: string, name: string) => {
    setDraggedItem({ category, name });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetCategory: string, targetName: string) => {
    if (!draggedItem || draggedItem.category !== targetCategory) return;

    const updated = navGroups.map(group => {
      if (group.category !== targetCategory) return group;
      const items = [...group.items];
      const dragIndex = items.findIndex(i => i.name === draggedItem.name);
      const dropIndex = items.findIndex(i => i.name === targetName);
      if (dragIndex === -1 || dropIndex === -1) return group;

      const [removed] = items.splice(dragIndex, 1);
      items.splice(dropIndex, 0, removed);
      return { ...group, items };
    });

    setNavGroups(updated);
    setDraggedItem(null);

    const orderMap: Record<string, string[]> = {};
    updated.forEach(g => {
      orderMap[g.category] = g.items.map(i => i.name);
    });
    localStorage.setItem('reyplace_nav_order', JSON.stringify(orderMap));
    toast.success('Orden de Módulos Guardado', 'Tu preferencia de navegación ha sido guardada.');
  };
  
  // Scroll enhancements state & ref
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { logout } = useAuth();
  const { toast } = useToast();

  const currentCategory = NAVIGATION.find(group =>
    group.items.some(item => item.name === activeModule)
  )?.category || 'Reyplace';

  // Smooth scroll reset to top whenever activeModule changes
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeModule]);

  // Handle scroll events inside the main content container
  const handleScroll = () => {
    if (!mainScrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = mainScrollRef.current;
    
    // Calculate progress percentage
    const totalScroll = scrollHeight - clientHeight;
    const progress = totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0;
    setScrollProgress(Math.min(100, Math.max(0, progress)));

    // Show floating Back-To-Top button if scrolled down more than 280px
    setShowScrollTop(scrollTop > 280);
  };

  const scrollToTop = () => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        onModuleChange?.('ReyID & Usuarios');
        toast.info('Navegación Rápida', 'Abriendo ReyID & Usuarios');
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setIsVideoOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onModuleChange, toast]);

  const handleActionFromCommandPalette = (actionId: string) => {
    if (actionId === 'open-video') {
      setIsVideoOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080809] text-slate-800 dark:text-gray-200 flex font-sans selection:bg-cyan-500/30 transition-colors duration-200 pb-16 lg:pb-0">
      <IntroVideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(mod) => onModuleChange?.(mod)}
        onTriggerAction={handleActionFromCommandPalette}
      />
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={(mod) => onModuleChange?.(mod)}
      />
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c0c0d] z-10 transition-colors duration-200">
        <div className="h-16 flex items-center px-5 border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-3">
            <img
              src={logoBadge}
              alt="Reyplace Logo"
              className="w-8.5 h-8.5 rounded-xl border border-cyan-500/40 object-cover shadow-lg shadow-cyan-500/25 ring-1 ring-[#d946ef]/30"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="brand-text-gradient font-black tracking-widest text-base leading-none">REYPLACE</span>
              <span className="text-[9px] text-[#00d2ff] font-mono tracking-wider uppercase mt-0.5 font-bold">Ecosistema Digital</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          <div className="px-3 text-[10px] text-gray-400 font-mono italic">
            💡 Arrastra y suelta elementos para reordenar
          </div>
          {navGroups.map((group) => (
            <div key={group.category} className="space-y-1">
              <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">{group.category}</div>
              {group.items.map((item) => (
                <div
                  key={item.name}
                  draggable
                  onDragStart={() => handleDragStart(group.category, item.name)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(group.category, item.name)}
                  className={`group relative flex items-center justify-between w-full rounded-lg transition-all duration-200 cursor-grab active:cursor-grabbing ${
                    activeModule === item.name
                      ? 'bg-cyan-500/10 dark:bg-white/5 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 dark:border-white/10 shadow-sm dark:shadow-[0_0_8px_rgba(6,182,212,0.1)] font-medium'
                      : 'text-slate-600 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <button
                    onClick={() => onModuleChange?.(item.name)}
                    className="flex-1 flex items-center gap-3 px-3 py-2.5 text-sm text-left cursor-pointer"
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${activeModule === item.name ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-gray-500'}`} />
                    <span className={`truncate ${activeModule === item.name ? 'font-medium' : ''}`}>{item.name}</span>
                  </button>
                  <div className="pr-2 opacity-0 group-hover:opacity-65 transition-opacity cursor-grab text-gray-400">
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-white/5 space-y-2">
          <button
            onClick={() => setIsShortcutsOpen(true)}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 transition-colors w-full cursor-pointer font-mono"
          >
            <span className="flex items-center gap-2">
              <Keyboard className="w-3.5 h-3.5" /> Atajos Teclado
            </span>
            <kbd className="bg-slate-200 dark:bg-black/50 px-1.5 py-0.5 rounded text-[10px]">?</kbd>
          </button>

          <button
            onClick={() => {
              logout();
              toast.info('Sesión Cerrada', 'Has cerrado sesión correctamente.');
            }}
            className="flex items-center gap-3 px-3 py-2 text-sm text-slate-500 dark:text-gray-500 hover:text-slate-800 dark:hover:text-gray-300 transition-colors w-full cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#080809]/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 z-20 sticky top-0 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-slate-600 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Context */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 dark:text-gray-500 font-mono mr-2">
              <span>{currentCategory}</span>
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-gray-600" />
              <span className="text-slate-900 dark:text-cyan-400 font-semibold">{activeModule}</span>
            </div>

            {/* Search Box Trigger Command Palette */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-3 bg-slate-100 dark:bg-[#111112] border border-slate-200 dark:border-white/5 hover:border-cyan-500/50 rounded-full px-4 py-1.5 transition-all text-left group cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-400 dark:text-gray-500 group-hover:text-cyan-400 transition-colors" />
              <span className="text-xs text-slate-400 dark:text-gray-500 group-hover:text-slate-700 dark:group-hover:text-gray-300 transition-colors w-32 sm:w-52 truncate">
                Buscar en el ecosistema...
              </span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono text-slate-400 dark:text-gray-500 bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded-full border border-slate-300 dark:border-white/10">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 relative">
            <button
              onClick={() => setIsVideoOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold transition-all shadow-lg shadow-cyan-500/10 cursor-pointer"
            >
              <Film className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">Ver Video Intro</span>
            </button>

            <ThemeSelector />

            {/* WebGL Biometric Verification Trigger Badge */}
            <button
              onClick={() => {
                requestVerification({
                  title: 'Verificación Biométrica WebGL',
                  subtitle: 'Demostración en vivo de escaneo de Retina 3D y Huella Dactilar Criptográfica',
                  actionBadge: 'FIDO2 / ZKP Enclave',
                  type: 'retina'
                });
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide transition-all border cursor-pointer bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
              title="Iniciar Verificación Biométrica WebGL"
            >
              <Fingerprint className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
              <span>ESCÁNER BIOMÉTRICO</span>
            </button>

            {/* Cúpula Security Dome Shield Status Badge */}
            <button
              onClick={() => onModuleChange?.('Cúpula Digital')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide transition-all border cursor-pointer ${
                cupulaActive
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
              }`}
              title="Cúpula de Seguridad: Siempre Activa"
            >
              <Shield className={`w-3.5 h-3.5 ${cupulaActive ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`} />
              <span>CÚPULA 24/7</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-rose-500/20 rounded-md text-rose-500 font-bold">
                {securityScore}%
              </span>
            </button>

            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] uppercase font-bold tracking-widest border border-cyan-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse"></span>
              <span>REYCOIN V2</span>
            </div>

            {/* Notifications Bell Trigger */}
            <button
              onClick={() => setIsNotificationsOpen(prev => !prev)}
              className="relative p-2 text-slate-500 dark:text-gray-500 hover:text-slate-800 dark:hover:text-gray-300 transition-colors cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
              title="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full"></span>
            </button>

            {/* User Profile Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(prev => !prev)}
                className="flex items-center gap-3 pl-2 sm:pl-3 lg:pl-4 border-l border-slate-200 dark:border-white/5 cursor-pointer group"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">Alex Vanguard</div>
                  <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono tracking-wider uppercase">Ciudadano Verificado</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)] group-hover:scale-105 transition-transform border border-cyan-400/30">
                  AV
                </div>
              </button>

              <UserProfilePopover
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onNavigate={(mod) => onModuleChange?.(mod)}
                onLogout={() => {
                  logout();
                  toast.info('Sesión Cerrada', 'Has cerrado sesión.');
                }}
              />
            </div>
          </div>

          {/* Scroll Reading Progress Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-200 dark:bg-white/5 overflow-hidden pointer-events-none">
            <div 
              className="h-full bg-gradient-to-r from-[#00d2ff] via-[#2563eb] to-[#d946ef] transition-all duration-150 ease-out shadow-[0_0_8px_rgba(0,210,255,0.8)]"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div 
          ref={mainScrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto smooth-scroll relative overscroll-contain"
        >
          {children}

          {/* Floating Back-To-Top Button */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, y: 15 }}
                onClick={scrollToTop}
                title="Volver Arriba"
                className="fixed bottom-20 lg:bottom-8 right-6 z-40 p-3 rounded-2xl bg-[#061024]/90 dark:bg-[#081226]/95 text-cyan-400 border border-cyan-500/40 shadow-[0_0_25px_rgba(0,210,255,0.35)] hover:border-cyan-300 hover:scale-110 active:scale-95 backdrop-blur-xl transition-all cursor-pointer group flex items-center gap-2"
              >
                <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                <span className="text-xs font-extrabold uppercase font-mono tracking-wider hidden sm:inline pr-1">Arriba</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (Floating Ergonomic Glass Dock) */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 h-16 bg-[#0c0c0d]/90 dark:bg-[#060810]/95 backdrop-blur-xl border border-white/10 dark:border-cyan-500/20 rounded-2xl z-40 flex items-center justify-around px-2 shadow-2xl shadow-black/80 safe-bottom-dock">
        <button
          onClick={() => onModuleChange?.('Inicio')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 gap-1 text-[10px] font-bold tracking-tight transition-all duration-200 cursor-pointer rounded-xl btn-tactile ${
            activeModule === 'Inicio' 
              ? 'text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]' 
              : 'text-slate-400 dark:text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-4.5 h-4.5" />
          <span>Inicio</span>
        </button>

        <button
          onClick={() => onModuleChange?.('ReyID & Usuarios')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 gap-1 text-[10px] font-bold tracking-tight transition-all duration-200 cursor-pointer rounded-xl btn-tactile ${
            activeModule === 'ReyID & Usuarios' 
              ? 'text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]' 
              : 'text-slate-400 dark:text-gray-400 hover:text-white'
          }`}
        >
          <Fingerprint className="w-4.5 h-4.5" />
          <span>ReyID</span>
        </button>

        {/* Central Action Button: Command Palette */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex flex-col items-center justify-center w-12 h-12 text-cyan-300 font-bold bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl -mt-6 shadow-xl shadow-cyan-500/30 border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer btn-tactile"
          title="Buscar en el Ecosistema (⌘K)"
        >
          <Search className="w-5 h-5 text-black" />
          <span className="text-[8px] font-mono text-black font-extrabold -mt-0.5">⌘K</span>
        </button>

        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] py-1 gap-1 text-[10px] font-bold tracking-tight text-slate-400 dark:text-gray-400 hover:text-white relative cursor-pointer rounded-xl btn-tactile"
        >
          <div className="relative">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full" />
          </div>
          <span>Alertas</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center min-w-[56px] py-1 gap-1 text-[10px] font-bold tracking-tight text-slate-400 dark:text-gray-400 hover:text-white cursor-pointer rounded-xl btn-tactile"
        >
          <Menu className="w-4.5 h-4.5" />
          <span>Menú</span>
        </button>
      </div>

      {/* Mobile Menu Overlay Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 lg:hidden flex">
            <motion.aside 
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="w-72 bg-[#0a0d14] border-r border-cyan-500/20 h-full flex flex-col shadow-2xl"
            >
              <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src={logoBadge}
                    alt="Reyplace Logo"
                    className="w-8.5 h-8.5 rounded-xl border border-cyan-500/40 object-cover shadow-lg shadow-cyan-500/25 ring-1 ring-[#d946ef]/30"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col">
                    <span className="brand-text-gradient font-black tracking-widest text-sm leading-none">REYPLACE</span>
                    <span className="text-[9px] text-[#00d2ff] font-mono tracking-wider uppercase mt-0.5 font-bold">Ecosistema Digital</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 border-b border-white/5">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCommandPaletteOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-cyan-500/40 transition-all font-mono"
                >
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Buscar módulo... (⌘K)</span>
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
                {NAVIGATION.map((group) => (
                  <div key={group.category} className="space-y-1">
                    <div className="px-3 mb-1.5 text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">{group.category}</div>
                    {group.items.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          onModuleChange?.(item.name);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all duration-150 ${
                          activeModule === item.name
                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                        }`}
                      >
                        <item.icon className={`w-4 h-4 shrink-0 ${activeModule === item.name ? 'text-cyan-400' : 'text-gray-500'}`} />
                        <span className="truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </nav>

              <div className="p-4 border-t border-white/10 space-y-2">
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                    toast.info('Sesión Cerrada', 'Has cerrado sesión correctamente.');
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 transition-colors w-full cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Cerrar Sesión
                </button>
              </div>
            </motion.aside>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* Global Anti-Theft Lock & Panic Emergency Modal */}
      <AntiTheftLockModal />

      {/* Global WebGL Bio-Metric Verification Overlay */}
      <BiometricVerificationOverlay />
    </div>
  );
}
