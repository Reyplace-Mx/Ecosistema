import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'dark' | 'light' | 'system';

export type ColorPreset = 
  // 6 Decade Visual Theme Styles
  | 'theme_70s'    // 1. 70's: Retro Groove, Disco, Mustard, Burnt Orange, Avocado, Woodgrain & Warm Sepia
  | 'theme_80s'    // 2. 80's: Synthwave Neon, Outrun Cyber-Grid, Hot Magenta, Laser Cyan, CRT Glow
  | 'theme_90s'    // 3. 90's: Memphis Pop & Cyber Web, Vibrant Teal, Pop Purple, Coral & Geometric
  | 'theme_2000s'  // 4. 2000's: Y2K & Frutiger Aero, Aqua Liquid Gloss, Chrome Sheen & Specular Flares
  | 'theme_2010s'  // 5. 2010's: Flat & Material Minimalist, Clean Indigo, Emerald, Crisp Paper UI
  | 'theme_2020s'  // 6. 2020's: Neo-Glassmorphism & Bento, OLED Cosmic Dark, Hyper Cyan/Magenta, ZKP Glow
  // Classic Accent Palettes
  | 'cyan'        // Default Reyplace Cyan & Blue
  | 'sapphire'    // Cyber Sapphire / Cobalt
  | 'emerald'     // Matrix / Quantum Emerald
  | 'violet'      // Galactic Magenta / Violet
  | 'amber'       // Sol / Reycoin Gold
  | 'crimson'     // Cyberpunk Crimson / Neon Red
  | 'titanium';   // Monochrome / Corporate Stealth

export interface ColorPresetConfig {
  id: ColorPreset;
  name: string;
  decade?: '1970s' | '1980s' | '1990s' | '2000s' | '2010s' | '2020s' | 'classic';
  subtitle: string;
  description: string;
  primary: string;       // Primary HEX
  primaryDark: string;   // Secondary HEX
  accent: string;        // Accent HEX
  secondaryAccent?: string;
  badgeGradient: string;
  glowColor: string;     // rgba
  tag: string;
  eraPill: string;
  bgDark: string;
  bgLight: string;
  cardBgDark: string;
  cardBgLight: string;
  vibeQuote: string;
  eraFeatures: string[];
}

export const COLOR_PRESETS: Record<ColorPreset, ColorPresetConfig> = {
  theme_70s: {
    id: 'theme_70s',
    decade: '1970s',
    name: "70's Retro Groove",
    subtitle: 'Nostalgia Setentera • Disco, Ámbar & Mostaza',
    description: 'Tonos tierra cálidos, mostaza vintage, naranja quemado, verde aguacate y elegancia analógica de vinilo.',
    primary: '#d97706',
    primaryDark: '#92400e',
    accent: '#ea580c',
    secondaryAccent: '#65a30d',
    badgeGradient: 'from-amber-500 via-orange-600 to-yellow-600',
    glowColor: 'rgba(217, 119, 6, 0.5)',
    tag: '1970s Disco',
    eraPill: 'Vinilo & Mostaza',
    bgDark: '#1a110a',
    bgLight: '#fdf8ec',
    cardBgDark: '#261910',
    cardBgLight: '#fffcf5',
    vibeQuote: 'Peace, Love & Analog Groove',
    eraFeatures: [
      'Gama de tierras cálidas: mostaza, arcilla y terracota',
      'Textura cálida vintage con acentos madera y cromo pulido',
      'Atmósfera disco cálida con sombras orgánicas y bordes envolventes'
    ]
  },
  theme_80s: {
    id: 'theme_80s',
    decade: '1980s',
    name: "80's Synthwave Neon",
    subtitle: 'Nostalgia Ochentera • Retrowave, Neón & Cyber-Grid',
    description: 'Fucsia láser, cian eléctrico, púrpura arcade, horizonte retrowave y alto contraste electrizante.',
    primary: '#f43f5e',
    primaryDark: '#831843',
    accent: '#06b6d4',
    secondaryAccent: '#a855f7',
    badgeGradient: 'from-pink-500 via-rose-500 to-cyan-400',
    glowColor: 'rgba(244, 63, 94, 0.55)',
    tag: '1980s Synthwave',
    eraPill: 'Neón & CRT Grid',
    bgDark: '#0a0314',
    bgLight: '#fdf4ff',
    cardBgDark: '#160829',
    cardBgLight: '#ffffff',
    vibeQuote: 'Outrun the Horizon • Neon Dreams',
    eraFeatures: [
      'Rejilla de perspectiva Synthwave en movimiento',
      'Brillo de neón magenta, cian láser y púrpura retro-arcade',
      'Estética Outrun con acentos cromados electrizantes'
    ]
  },
  theme_90s: {
    id: 'theme_90s',
    decade: '1990s',
    name: "90's Memphis & Cyber",
    subtitle: 'Nostalgia Noventera • Pop Memphis & Web 1.0',
    description: 'Turquesa pop vibrante, morado digital, amarillo flúor, formas geométricas y nostalgia de la era dorada web.',
    primary: '#0d9488',
    primaryDark: '#115e59',
    accent: '#8b5cf6',
    secondaryAccent: '#f59e0b',
    badgeGradient: 'from-teal-400 via-indigo-500 to-amber-400',
    glowColor: 'rgba(13, 148, 136, 0.5)',
    tag: '1990s Memphis',
    eraPill: 'Turquesa & Pop Web',
    bgDark: '#08111e',
    bgLight: '#f0fdfa',
    cardBgDark: '#0f1f38',
    cardBgLight: '#ffffff',
    vibeQuote: 'World Wide Web 1.0 • CD-ROM & Cassette Pop',
    eraFeatures: [
      'Patrones geométricos Memphis en atmósfera ambiental',
      'Duo-tono icónico: Turquesa vibrante y Púrpura Pop',
      'Nostalgia digital con relieves retro-tech y bordes definidos'
    ]
  },
  theme_2000s: {
    id: 'theme_2000s',
    decade: '2000s',
    name: "2000's Y2K & Aqua Gloss",
    subtitle: 'Nostalgia 2000s • Frutiger Aero & Skeuomorph',
    description: 'Aqua líquido cristalino, reflejos de burbujas vítreas, cromo plateado, destellos de lente y optimismo Y2K.',
    primary: '#0284c7',
    primaryDark: '#0369a1',
    accent: '#38bdf8',
    secondaryAccent: '#84cc16',
    badgeGradient: 'from-sky-400 via-cyan-400 to-lime-400',
    glowColor: 'rgba(2, 132, 199, 0.5)',
    tag: '2000s Frutiger Aero',
    eraPill: 'Aqua Gloss & Y2K',
    bgDark: '#031124',
    bgLight: '#f0f9ff',
    cardBgDark: '#071d3d',
    cardBgLight: '#ffffff',
    vibeQuote: 'Millennium Optimism • Glossy Aqua & Liquid Glass',
    eraFeatures: [
      'Reflejos especulares superiores "Glossy Glass" en botones y tarjetas',
      'Burbujas flotantes en atmósfera Frutiger Aero',
      'Paleta aqua cielo, cromo metálico y verde lima vibrante'
    ]
  },
  theme_2010s: {
    id: 'theme_2010s',
    decade: '2010s',
    name: "2010's Flat & Material",
    subtitle: 'Nostalgia 2010s • Minimalismo & Material Design',
    description: 'Diseño plano hiperlimpio, sombras sutiles de papel, paleta índigo y esmeralda de máxima claridad y foco.',
    primary: '#4f46e5',
    primaryDark: '#3730a3',
    accent: '#10b981',
    secondaryAccent: '#f59e0b',
    badgeGradient: 'from-indigo-500 via-blue-600 to-emerald-500',
    glowColor: 'rgba(79, 70, 229, 0.4)',
    tag: '2010s Material',
    eraPill: 'Flat UI & Índigo',
    bgDark: '#0f172a',
    bgLight: '#f8fafc',
    cardBgDark: '#1e293b',
    cardBgLight: '#ffffff',
    vibeQuote: 'Less is More • Flat Geometry & Crisp Shadows',
    eraFeatures: [
      'Superficies planas de alta legibilidad inspiradas en Material UI',
      'Elevación nítida con sombras suaves de capas superpuestas',
      'Acentos sólidos Índigo, Esmeralda y Ámbar puro'
    ]
  },
  theme_2020s: {
    id: 'theme_2020s',
    decade: '2020s',
    name: "2020's Neo-Glass & Bento",
    subtitle: 'Era 2020s • Glassmorphism, OLED & Web3 HUD',
    description: 'Vidrio esmerilado con desenfoque dinámico, contraste OLED cósmico, acentos cian/fucsia cuánticos y bento grids.',
    primary: '#00d2ff',
    primaryDark: '#0284c7',
    accent: '#d946ef',
    secondaryAccent: '#10b981',
    badgeGradient: 'from-cyan-400 via-blue-600 to-fuchsia-500',
    glowColor: 'rgba(0, 210, 255, 0.5)',
    tag: '2020s Neo-Glass',
    eraPill: 'Glass Bento & OLED',
    bgDark: '#050a18',
    bgLight: '#f8fafc',
    cardBgDark: '#081226',
    cardBgLight: '#ffffff',
    vibeQuote: 'Hyper-Cosmic Glass • Decentralized Future',
    eraFeatures: [
      'Glassmorphism multicapa con desenfoque backdrop de 24px',
      'Canvas negro cósmico OLED con acentos cian de alta fidelidad',
      'Micro-resplandores cuánticos y tarjetas Bento modulares'
    ]
  },
  cyan: {
    id: 'cyan',
    decade: 'classic',
    name: 'Cian Aurora',
    subtitle: 'Estándar Oficial Reyplace',
    description: 'Acento azul cian clásico oficial del ecosistema.',
    primary: '#00d2ff',
    primaryDark: '#0284c7',
    accent: '#2563eb',
    badgeGradient: 'from-cyan-500 to-blue-600',
    glowColor: 'rgba(0, 210, 255, 0.45)',
    tag: 'Oficial',
    eraPill: 'Clásico',
    bgDark: '#050a18',
    bgLight: '#f8fafc',
    cardBgDark: '#081226',
    cardBgLight: '#ffffff',
    vibeQuote: 'Conectamos, Innovamos, Transformamos',
    eraFeatures: ['Paleta original Reyplace Cian y Azul Real']
  },
  sapphire: {
    id: 'sapphire',
    decade: 'classic',
    name: 'Cyber Sapphire',
    subtitle: 'Azul Cósmico Profundo',
    description: 'Cobalto y zafiro de alta densidad para entornos de ciberdefensa.',
    primary: '#38bdf8',
    primaryDark: '#1d4ed8',
    accent: '#6366f1',
    badgeGradient: 'from-sky-400 to-indigo-600',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    tag: 'Ciberseguridad',
    eraPill: 'Zafiro',
    bgDark: '#060f26',
    bgLight: '#f0f9ff',
    cardBgDark: '#0b193d',
    cardBgLight: '#ffffff',
    vibeQuote: 'Deep Cyber Defense & Sentinel Shield',
    eraFeatures: ['Acentos azul cobalto y zafiro celestial']
  },
  emerald: {
    id: 'emerald',
    decade: 'classic',
    name: 'Quantum Emerald',
    subtitle: 'Terminal Matrix Cúpula',
    description: 'Verde esmeralda cuántico optimizado para datos financieros y telemetría.',
    primary: '#10b981',
    primaryDark: '#047857',
    accent: '#059669',
    badgeGradient: 'from-emerald-400 to-teal-600',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    tag: 'Fintech',
    eraPill: 'Esmeralda',
    bgDark: '#04140e',
    bgLight: '#f0fdf4',
    cardBgDark: '#08261b',
    cardBgLight: '#ffffff',
    vibeQuote: 'Quantum Matrix • High Integrity Nodes',
    eraFeatures: ['Acentos verde terminal de alta precisión']
  },
  violet: {
    id: 'violet',
    decade: 'classic',
    name: 'Galactic Violet',
    subtitle: 'Magenta & Púrpura Metaverso',
    description: 'Magenta futurista y púrpura cósmico para experiencias inmersivas.',
    primary: '#d946ef',
    primaryDark: '#9333ea',
    accent: '#7c3aed',
    badgeGradient: 'from-fuchsia-500 to-purple-600',
    glowColor: 'rgba(217, 70, 239, 0.45)',
    tag: 'Metaverso',
    eraPill: 'Violeta',
    bgDark: '#12051f',
    bgLight: '#fdf4ff',
    cardBgDark: '#210b38',
    cardBgLight: '#ffffff',
    vibeQuote: 'Infinite Dimensions & Digital Realms',
    eraFeatures: ['Acentos fucsia y violeta espacial']
  },
  amber: {
    id: 'amber',
    decade: 'classic',
    name: 'Sol & Reycoin',
    subtitle: 'Dorado Cálido & Ámbar',
    description: 'Dorado brillante y ámbar solar inspirado en la economía del token RYC.',
    primary: '#f59e0b',
    primaryDark: '#d97706',
    accent: '#f97316',
    badgeGradient: 'from-amber-400 to-orange-500',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    tag: 'Tokens',
    eraPill: 'Dorado',
    bgDark: '#1a1004',
    bgLight: '#fffbeb',
    cardBgDark: '#291b07',
    cardBgLight: '#ffffff',
    vibeQuote: 'Golden Horizon • Decentralized Wealth',
    eraFeatures: ['Acentos solares dorados y ámbar']
  },
  crimson: {
    id: 'crimson',
    decade: 'classic',
    name: 'Neon Crimson',
    subtitle: 'Rojo Carmesí de Alta Prioridad',
    description: 'Carmesí intenso para monitoreo crítico y gestión de incidentes.',
    primary: '#f43f5e',
    primaryDark: '#be123c',
    accent: '#e11d48',
    badgeGradient: 'from-rose-500 to-red-600',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    tag: 'Alertas',
    eraPill: 'Carmesí',
    bgDark: '#1c050b',
    bgLight: '#fff1f2',
    cardBgDark: '#2e0a13',
    cardBgLight: '#ffffff',
    vibeQuote: 'Immediate Sentinel Response Protocol',
    eraFeatures: ['Acentos rojo carmesí de alta visibilidad']
  },
  titanium: {
    id: 'titanium',
    decade: 'classic',
    name: 'Titanium Stealth',
    subtitle: 'Monocromático Alta Densidad',
    description: 'Escala monocromática elegante y neutra para entornos corporativos.',
    primary: '#94a3b8',
    primaryDark: '#475569',
    accent: '#cbd5e1',
    badgeGradient: 'from-slate-400 to-slate-600',
    glowColor: 'rgba(148, 163, 184, 0.45)',
    tag: 'Empresarial',
    eraPill: 'Titanio',
    bgDark: '#0b0f19',
    bgLight: '#f8fafc',
    cardBgDark: '#161e2e',
    cardBgLight: '#ffffff',
    vibeQuote: 'Enterprise Stealth & Mathematical Precision',
    eraFeatures: ['Acentos monocromáticos de alta sobriedad']
  },
};

export type UiDensity = 'comfortable' | 'compact';
export type BackgroundFx = 'aurora_blobs' | 'cyber_grid' | 'deep_space' | 'none';

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  colorPreset: ColorPreset;
  density: UiDensity;
  backgroundFx: BackgroundFx;
  setTheme: (theme: ThemeMode) => void;
  setColorPreset: (preset: ColorPreset) => void;
  setDensity: (density: UiDensity) => void;
  setBackgroundFx: (fx: BackgroundFx) => void;
  initThemeListener: () => () => void;
}

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeToDocument(
  resolved: 'dark' | 'light',
  mode: ThemeMode,
  preset: ColorPreset = 'theme_2020s',
  density: UiDensity = 'comfortable',
  backgroundFx: BackgroundFx = 'aurora_blobs'
) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  
  if (resolved === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
  
  const config = COLOR_PRESETS[preset] || COLOR_PRESETS.theme_2020s;

  root.setAttribute('data-theme', mode);
  root.setAttribute('data-resolved-theme', resolved);
  root.setAttribute('data-color-preset', preset);
  root.setAttribute('data-decade', config.decade || 'classic');
  root.setAttribute('data-density', density);
  root.setAttribute('data-background-fx', backgroundFx);

  // Apply custom CSS variable overrides based on color preset & decade
  root.style.setProperty('--primary-preset-color', config.primary);
  root.style.setProperty('--primary-preset-dark', config.primaryDark);
  root.style.setProperty('--primary-preset-accent', config.accent);
  root.style.setProperty('--primary-preset-secondary', config.secondaryAccent || config.accent);
  root.style.setProperty('--primary-preset-glow', config.glowColor);
  root.style.setProperty('--decade-bg-dark', config.bgDark);
  root.style.setProperty('--decade-bg-light', config.bgLight);
  root.style.setProperty('--decade-card-bg-dark', config.cardBgDark);
  root.style.setProperty('--decade-card-bg-light', config.cardBgLight);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      resolvedTheme: 'dark',
      colorPreset: 'cyan',
      density: 'comfortable',
      backgroundFx: 'aurora_blobs',
      
      setTheme: (mode: ThemeMode) => {
        const resolved = mode === 'system' ? getSystemTheme() : mode;
        const currentPreset = get().colorPreset || 'cyan';
        const currentDensity = get().density || 'comfortable';
        const currentBgFx = get().backgroundFx || 'aurora_blobs';
        
        applyThemeToDocument(resolved, mode, currentPreset, currentDensity, currentBgFx);
        set({ theme: mode, resolvedTheme: resolved });
      },

      setColorPreset: (preset: ColorPreset) => {
        const state = get();
        applyThemeToDocument(
          state.resolvedTheme,
          state.theme,
          preset,
          state.density,
          state.backgroundFx
        );
        set({ colorPreset: preset });
      },

      setDensity: (density: UiDensity) => {
        const state = get();
        applyThemeToDocument(
          state.resolvedTheme,
          state.theme,
          state.colorPreset,
          density,
          state.backgroundFx
        );
        set({ density });
      },

      setBackgroundFx: (backgroundFx: BackgroundFx) => {
        const state = get();
        applyThemeToDocument(
          state.resolvedTheme,
          state.theme,
          state.colorPreset,
          state.density,
          backgroundFx
        );
        set({ backgroundFx });
      },

      initThemeListener: () => {
        const state = get();
        const mode = state.theme || 'dark';
        const preset = state.colorPreset || 'cyan';
        const density = state.density || 'comfortable';
        const backgroundFx = state.backgroundFx || 'aurora_blobs';
        
        const resolved = mode === 'system' ? getSystemTheme() : mode;
        applyThemeToDocument(resolved, mode, preset, density, backgroundFx);
        set({ resolvedTheme: resolved });

        if (typeof window === 'undefined') return () => {};

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
          if (get().theme === 'system') {
            const newResolved = getSystemTheme();
            applyThemeToDocument(
              newResolved,
              'system',
              get().colorPreset,
              get().density,
              get().backgroundFx
            );
            set({ resolvedTheme: newResolved });
          }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      },
    }),
    {
      name: 'reyplace-theme-preference-v2',
      partialize: (state) => ({
        theme: state.theme,
        colorPreset: state.colorPreset,
        density: state.density,
        backgroundFx: state.backgroundFx,
      }),
    }
  )
);
