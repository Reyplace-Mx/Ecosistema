import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Home,
  Fingerprint,
  Layers,
  Users,
  GraduationCap,
  MessageSquare,
  Rss,
  Store,
  ShoppingCart,
  Briefcase,
  Truck,
  Database,
  Building2,
  Landmark,
  Cpu,
  Coins,
  Shield,
  Hexagon,
  Server,
  ScanFace,
  Film,
  Sparkles,
  ArrowRight,
  Command,
  Radio
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (moduleName: string) => void;
  onTriggerAction?: (actionId: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  category: 'Módulos' | 'Acciones' | 'Core';
  icon: React.ElementType;
  action: () => void;
  badge?: string;
}

export function CommandPalette({ isOpen, onClose, onNavigate, onTriggerAction }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { toast } = useToast();

  const commands: CommandItem[] = useMemo(() => [
    // Modules
    { id: 'mod-inicio', title: 'Inicio Dashboard', description: 'Visión general del ecosistema Reyplace', category: 'Módulos', icon: Home, action: () => onNavigate('Inicio') },
    { id: 'mod-reyid', title: 'ReyID & Usuarios', description: 'Gestión de identidad digital, biometría y wallet', category: 'Módulos', icon: Fingerprint, badge: 'Popular', action: () => onNavigate('ReyID & Usuarios') },
    { id: 'mod-arquitectura', title: 'Arquitectura & PM', description: 'Proyectos arquitectónicos y gestión urbana', category: 'Módulos', icon: Layers, action: () => onNavigate('Arquitectura & PM') },
    { id: 'mod-unionlive', title: 'Unión.live', description: 'Transmisiones en vivo y participación ciudadana', category: 'Módulos', icon: MessageSquare, action: () => onNavigate('Unión.live') },
    { id: 'mod-serviciospro', title: 'Servicios Pro', description: 'Contratación de profesionales verificados', category: 'Módulos', icon: Briefcase, action: () => onNavigate('Servicios Pro') },
    { id: 'mod-marketplace', title: 'Marketplace', description: 'Comercio descentralizado con Reycoin', category: 'Módulos', icon: ShoppingCart, action: () => onNavigate('Marketplace') },
    { id: 'mod-negocios', title: 'Negocios & PyMEs', description: 'Gestión empresarial e incentivos locales', category: 'Módulos', icon: Store, action: () => onNavigate('Negocios') },
    { id: 'mod-logistica', title: 'Logística Smart', description: 'Monitoreo de flotas y envíos autónomos', category: 'Módulos', icon: Truck, action: () => onNavigate('Logística') },
    { id: 'mod-smartcity', title: 'Smart City', description: 'Sensores urbanos, tráfico e infraestructura', category: 'Módulos', icon: Building2, action: () => onNavigate('Smart City') },
    { id: 'mod-gobierno', title: 'Gobierno Digital', description: 'Trámites transparentes y votaciones blockchain', category: 'Módulos', icon: Landmark, action: () => onNavigate('Gobierno Digital') },
    { id: 'mod-reycoin', title: 'Pagos & Reycoin', description: 'Billetera Web3, staking y transacciones', category: 'Módulos', icon: Coins, action: () => onNavigate('Pagos & Reycoin') },
    { id: 'mod-reybot', title: 'Reybot AI Assistant', description: 'Asistente de inteligencia artificial Reyplace', category: 'Módulos', icon: Cpu, badge: 'AI', action: () => onNavigate('Reybot AI') },
    { id: 'mod-comunidad', title: 'Comunidad & Social', description: 'Foros, iniciativas e impacto social', category: 'Módulos', icon: Users, action: () => onNavigate('Comunidad') },
    { id: 'mod-academia', title: 'Academia Digital', description: 'Cursos, certificaciones y desarrollo', category: 'Módulos', icon: GraduationCap, action: () => onNavigate('Academia') },
    { id: 'mod-cupula', title: 'Cúpula Digital', description: 'Centro de ciberseguridad y encriptación', category: 'Módulos', icon: Shield, action: () => onNavigate('Cúpula Digital') },
    { id: 'mod-blockchain', title: 'Blockchain Layer', description: 'Explorador de bloques y nodos activos', category: 'Módulos', icon: Hexagon, action: () => onNavigate('Blockchain Layer') },
    { id: 'mod-infraestructura', title: 'Infraestructura Cloud', description: 'Servidores, Cloud SQL y Supabase', category: 'Módulos', icon: Server, action: () => onNavigate('Infraestructura') },

    // Actions
    {
      id: 'act-biometric-config',
      title: 'Configuración Biométrica (FaceID / TouchID / Passkey)',
      description: 'Ajustar preferencias de biometría y firmas en Cúpula Digital',
      category: 'Acciones',
      icon: ScanFace,
      badge: 'Ajustes',
      action: () => {
        onNavigate('ReyID & Usuarios');
        toast.info('Configuración Biométrica', 'Abriendo preferencias de biometría.');
      }
    },
    {
      id: 'act-civil-alerts',
      title: 'Alertas de Protección Civil & Clima',
      description: 'Consultar alertas sísmicas, meteorológicas e incidentes en tiempo real',
      category: 'Acciones',
      icon: Radio,
      badge: 'Alerta ⚠️',
      action: () => {
        onNavigate('ReyID & Usuarios');
        toast.info('Alertas de Emergencia', 'Mostrando panel de Protección Civil.');
      }
    },
    {
      id: 'act-liveness',
      title: 'Prueba de Vida (Liveness Detection)',
      description: 'Iniciar escaneo biométrico con cámara 3D',
      category: 'Acciones',
      icon: ScanFace,
      badge: 'Biometría',
      action: () => {
        onNavigate('ReyID & Usuarios');
        onTriggerAction?.('open-liveness');
      }
    },
    {
      id: 'act-video',
      title: 'Ver Video Introductorio',
      description: 'Conoce la visión del ecosistema Reyplace',
      category: 'Acciones',
      icon: Film,
      action: () => {
        onTriggerAction?.('open-video');
      }
    },
    {
      id: 'act-copy-did',
      title: 'Copiar mi Identidad ReyID (DID)',
      description: 'Copiar did:rey:0x4E92...8A9 al portapapeles',
      category: 'Acciones',
      icon: Sparkles,
      action: () => {
        navigator.clipboard.writeText('did:rey:0x4E92817A128B237C902918237190823718029318');
        toast.success('DID Copiado', 'Tu identificador ReyID se ha guardado en el portapapeles.');
      }
    }
  ], [onNavigate, onTriggerAction, toast]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(cmd =>
      cmd.title.toLowerCase().includes(q) ||
      (cmd.description && cmd.description.toLowerCase().includes(q)) ||
      cmd.category.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside Command Palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="bg-[#111112] border border-cyan-500/30 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3 bg-white/5">
            <Search className="w-5 h-5 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Escribe para buscar módulos, comandos o acciones (ej. Liveness, Reycoin)..."
              className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 font-sans"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-gray-400 bg-white/10 px-2 py-0.5 rounded border border-white/10">
              ESC
            </kbd>
          </div>

          {/* List of Results */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No se encontraron módulos o acciones para <span className="text-white">"{query}"</span>
              </div>
            ) : (
              filteredCommands.map((cmd, idx) => {
                const isSelected = idx === selectedIndex;
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-cyan-500/15 border border-cyan-500/30 text-white'
                        : 'hover:bg-white/5 text-gray-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold truncate">{cmd.title}</span>
                          {cmd.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold uppercase">
                              {cmd.badge}
                            </span>
                          )}
                        </div>
                        {cmd.description && (
                          <p className="text-[11px] text-gray-400 truncate mt-0.5">{cmd.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">{cmd.category}</span>
                      <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-gray-600'}`} />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Palette Footer */}
          <div className="px-4 py-2.5 bg-[#0a0a0b] border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="bg-white/10 text-gray-300 px-1.5 py-0.5 rounded text-[10px]">↑↓</kbd> Navegar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-white/10 text-gray-300 px-1.5 py-0.5 rounded text-[10px]">↵</kbd> Seleccionar
              </span>
            </div>
            <div className="flex items-center gap-1 text-cyan-400 font-bold">
              <Command className="w-3 h-3" /> Reyplace Palette
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
