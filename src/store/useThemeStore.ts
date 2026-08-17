import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'dark' | 'light' | 'system';

export type ColorPreset = 
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
  subtitle: string;
  primary: string;       // Primary HEX
  primaryDark: string;   // Secondary HEX
  accent: string;        // Accent HEX
  badgeGradient: string;
  glowColor: string;     // rgba
  tag: string;
}

export const COLOR_PRESETS: Record<ColorPreset, ColorPresetConfig> = {
  cyan: {
    id: 'cyan',
    name: 'Cian Aurora',
    subtitle: 'Estándar Oficial Reyplace',
    primary: '#00d2ff',
    primaryDark: '#0284c7',
    accent: '#2563eb',
    badgeGradient: 'from-cyan-500 to-blue-600',
    glowColor: 'rgba(0, 210, 255, 0.45)',
    tag: 'Oficial',
  },
  sapphire: {
    id: 'sapphire',
    name: 'Cyber Sapphire',
    subtitle: 'Azul Cósmico Profundo',
    primary: '#38bdf8',
    primaryDark: '#1d4ed8',
    accent: '#6366f1',
    badgeGradient: 'from-sky-400 to-indigo-600',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    tag: 'Ciberseguridad',
  },
  emerald: {
    id: 'emerald',
    name: 'Quantum Emerald',
    subtitle: 'Terminal Matrix Cúpula',
    primary: '#10b981',
    primaryDark: '#047857',
    accent: '#059669',
    badgeGradient: 'from-emerald-400 to-teal-600',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    tag: 'Fintech',
  },
  violet: {
    id: 'violet',
    name: 'Galactic Violet',
    subtitle: 'Magenta & Púrpura Metaverso',
    primary: '#d946ef',
    primaryDark: '#9333ea',
    accent: '#7c3aed',
    badgeGradient: 'from-fuchsia-500 to-purple-600',
    glowColor: 'rgba(217, 70, 239, 0.45)',
    tag: 'Metaverso',
  },
  amber: {
    id: 'amber',
    name: 'Sol & Reycoin',
    subtitle: 'Dorado Cálido & Ámbar',
    primary: '#f59e0b',
    primaryDark: '#d97706',
    accent: '#f97316',
    badgeGradient: 'from-amber-400 to-orange-500',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    tag: 'Tokens',
  },
  crimson: {
    id: 'crimson',
    name: 'Neon Crimson',
    subtitle: 'Rojo Carmesí de Alta Prioridad',
    primary: '#f43f5e',
    primaryDark: '#be123c',
    accent: '#e11d48',
    badgeGradient: 'from-rose-500 to-red-600',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    tag: 'Alertas',
  },
  titanium: {
    id: 'titanium',
    name: 'Titanium Stealth',
    subtitle: 'Monocromático Alta Densidad',
    primary: '#94a3b8',
    primaryDark: '#475569',
    accent: '#cbd5e1',
    badgeGradient: 'from-slate-400 to-slate-600',
    glowColor: 'rgba(148, 163, 184, 0.45)',
    tag: 'Empresarial',
  },
};

export type UiDensity = 'comfortable' | 'compact';
export type BackgroundFx = 'aurora_blobs' | 'minimal_grid' | 'none';

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
  preset: ColorPreset = 'cyan',
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
  
  root.setAttribute('data-theme', mode);
  root.setAttribute('data-resolved-theme', resolved);
  root.setAttribute('data-color-preset', preset);
  root.setAttribute('data-density', density);
  root.setAttribute('data-background-fx', backgroundFx);

  // Apply custom CSS variable overrides based on color preset
  const config = COLOR_PRESETS[preset] || COLOR_PRESETS.cyan;
  root.style.setProperty('--primary-preset-color', config.primary);
  root.style.setProperty('--primary-preset-dark', config.primaryDark);
  root.style.setProperty('--primary-preset-accent', config.accent);
  root.style.setProperty('--primary-preset-glow', config.glowColor);
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
