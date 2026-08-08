import React, { useState } from 'react';
import { motion } from 'motion/react';
import { IntroVideoModal } from './IntroVideoModal';
import { ThemeSelector } from './ThemeSelector';
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
  Wallet,
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
  Sparkles,
  Layers
} from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080809] text-slate-800 dark:text-gray-200 flex font-sans selection:bg-cyan-500/30 transition-colors duration-200">
      {/* Intro Video Modal */}
      <IntroVideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c0c0d] z-10 transition-colors duration-200">
        <div className="h-16 flex items-center px-5 border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-3">
            <img
              src={logoBadge}
              alt="Reyplace Logo"
              className="w-8 h-8 rounded-lg border border-cyan-500/30 object-cover shadow-lg shadow-cyan-500/20"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-slate-900 dark:text-white font-bold tracking-widest text-base leading-none">REYPLACE</span>
              <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-mono tracking-tighter uppercase mt-0.5">Ecosistema Digital</span>
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

        <div className="p-4 border-t border-slate-200 dark:border-white/5">
          <button className="flex items-center gap-3 px-3 py-2 text-sm text-slate-500 dark:text-gray-500 hover:text-slate-800 dark:hover:text-gray-300 transition-colors w-full cursor-pointer">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#080809]/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-600 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-[#111112] border border-slate-200 dark:border-white/5 rounded-full px-4 py-1.5 focus-within:border-cyan-500/50 transition-colors">
              <Search className="w-4 h-4 text-slate-400 dark:text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar en el ecosistema..." 
                className="bg-transparent border-none outline-none text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-600 w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
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
            
            <button className="relative p-2 text-slate-500 dark:text-gray-500 hover:text-slate-800 dark:hover:text-gray-300 transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-3 lg:pl-6 border-l border-slate-200 dark:border-white/5">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-slate-900 dark:text-white">Alex Vanguard</div>
                <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono tracking-wider uppercase">Ciudadano Verificado</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                AV
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>

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
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-300">
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
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
