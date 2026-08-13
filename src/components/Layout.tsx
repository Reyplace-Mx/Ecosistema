import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IntroVideoModal } from './IntroVideoModal';
import { ThemeSelector } from './ThemeSelector';
import { CommandPalette } from './CommandPalette';
import { NotificationsDrawer } from './NotificationsDrawer';
import { UserProfilePopover } from './UserProfilePopover';
import { ShortcutsModal } from './ShortcutsModal';
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
  ChevronRight
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const { logout } = useAuth();
  const { toast } = useToast();

  const currentCategory = NAVIGATION.find(group =>
    group.items.some(item => item.name === activeModule)
  )?.category || 'Reyplace';

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
          {NAVIGATION.map((group) => (
            <div key={group.category} className="space-y-1">
              <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">{group.category}</div>
              {group.items.map((item) => (
                <button
                  key={item.name}
                  onClick={() => onModuleChange?.(item.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                    activeModule === item.name
                      ? 'bg-cyan-500/10 dark:bg-white/5 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 dark:border-white/10 shadow-sm dark:shadow-[0_0_8px_rgba(6,182,212,0.1)] font-medium'
                      : 'text-slate-600 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeModule === item.name ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-gray-500'}`} />
                  <span className={activeModule === item.name ? 'font-medium' : ''}>{item.name}</span>
                </button>
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

            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] uppercase font-bold tracking-widest border border-cyan-500/20">
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
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0c0c0d]/95 backdrop-blur-lg border-t border-white/10 z-30 flex items-center justify-around px-2">
        <button
          onClick={() => onModuleChange?.('Inicio')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
            activeModule === 'Inicio' ? 'text-cyan-400 font-bold' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Inicio</span>
        </button>

        <button
          onClick={() => onModuleChange?.('ReyID & Usuarios')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
            activeModule === 'ReyID & Usuarios' ? 'text-cyan-400 font-bold' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Fingerprint className="w-5 h-5" />
          <span>ReyID</span>
        </button>

        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] text-cyan-400 font-bold p-2 bg-cyan-500/20 border border-cyan-500/30 rounded-2xl -mt-5 shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px]">⌘K</span>
        </button>

        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-medium text-gray-400 hover:text-white relative cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-3 w-2 h-2 bg-cyan-400 rounded-full" />
          <span>Alertas</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-medium text-gray-400 hover:text-white cursor-pointer"
        >
          <Menu className="w-5 h-5" />
          <span>Menú</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden flex">
          <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="w-64 bg-[#0c0c0d] border-r border-white/5 h-full flex flex-col"
          >
             <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <span className="font-black text-sm text-black">R</span>
                </div>
                <span className="text-white font-bold tracking-widest text-lg ml-1">REYPLACE</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-300 cursor-pointer">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
              {NAVIGATION.map((group) => (
                <div key={group.category} className="space-y-1">
                  <div className="px-3 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{group.category}</div>
                  {group.items.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        onModuleChange?.(item.name);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer ${
                        activeModule === item.name
                          ? 'bg-white/5 text-cyan-400 border border-white/10'
                          : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${activeModule === item.name ? 'text-cyan-400' : 'text-gray-500'}`} />
                      {item.name}
                    </button>
                  ))}
                </div>
              ))}
            </nav>
          </motion.aside>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </div>
  );
}
