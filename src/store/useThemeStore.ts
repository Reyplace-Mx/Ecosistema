import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: ThemeMode) => void;
  initThemeListener: () => () => void;
}

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeToDocument(resolved: 'dark' | 'light', mode: ThemeMode) {
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
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      resolvedTheme: 'dark',
      setTheme: (mode: ThemeMode) => {
        const resolved = mode === 'system' ? getSystemTheme() : mode;
        applyThemeToDocument(resolved, mode);
        set({ theme: mode, resolvedTheme: resolved });
      },
      initThemeListener: () => {
        const state = get();
        const mode = state.theme || 'dark';
        const resolved = mode === 'system' ? getSystemTheme() : mode;
        applyThemeToDocument(resolved, mode);
        set({ resolvedTheme: resolved });

        if (typeof window === 'undefined') return () => {};

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
          if (get().theme === 'system') {
            const newResolved = getSystemTheme();
            applyThemeToDocument(newResolved, 'system');
            set({ resolvedTheme: newResolved });
          }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      },
    }),
    {
      name: 'reyplace-theme-preference',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
