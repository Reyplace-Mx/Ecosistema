import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Moon,
  Monitor,
  Check,
  Palette,
  Sparkles,
  Sliders,
  Maximize2,
  Minimize2,
  Eye,
  Zap,
  Layers,
  CheckCircle2,
  RotateCcw,
  X,
  ShieldCheck,
  Radio,
  Tv,
  Gamepad2,
  Droplets,
  Square,
  Cpu,
  Wallet,
  Activity,
  CheckCheck,
  History,
  Flame,
  Clock
} from 'lucide-react';
import {
  useThemeStore,
  ThemeMode,
  ColorPreset,
  COLOR_PRESETS,
  UiDensity,
  BackgroundFx,
} from '../store/useThemeStore';
import { useToast } from '../context/ToastContext';

export function ThemeSelector() {
  const {
    theme,
    setTheme,
    resolvedTheme,
    colorPreset,
    setColorPreset,
    density,
    setDensity,
    backgroundFx,
    setBackgroundFx,
  } = useThemeStore();

  const [isOpen, setIsOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'decades' | 'classic' | 'mode' | 'display'>('decades');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // STAGED DRAFT STATE FOR LIVE PREVIEW
  const [draftPreset, setDraftPreset] = useState<ColorPreset>(colorPreset);
  const [draftMode, setDraftMode] = useState<ThemeMode>(theme);
  const [draftDensity, setDraftDensity] = useState<UiDensity>(density);
  const [draftBgFx, setDraftBgFx] = useState<BackgroundFx>(backgroundFx);

  // Sync draft state with store state whenever opened or store updates
  useEffect(() => {
    if (isOpen) {
      setDraftPreset(colorPreset);
      setDraftMode(theme);
      setDraftDensity(density);
      setDraftBgFx(backgroundFx);
    }
  }, [isOpen, colorPreset, theme, density, backgroundFx]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeModeOptions: { mode: ThemeMode; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: 'dark', label: 'Oscuro Cúpula', desc: 'Canvas negro cósmico con acentos luminosos', icon: Moon },
    { mode: 'light', label: 'Claro Sol', desc: 'Canvas blanco de alta claridad y contraste', icon: Sun },
    { mode: 'system', label: 'Sistema OS', desc: 'Sincronizado dinámicamente con el SO', icon: Monitor },
  ];

  const activePresetConfig = COLOR_PRESETS[colorPreset] || COLOR_PRESETS.theme_2020s;
  const draftPresetConfig = COLOR_PRESETS[draftPreset] || COLOR_PRESETS.theme_2020s;

  // Determine if there are pending unapplied changes
  const hasPendingChanges =
    draftPreset !== colorPreset ||
    draftMode !== theme ||
    draftDensity !== density ||
    draftBgFx !== backgroundFx;

  // Compute resolved preview theme for the sample card
  const getPreviewResolvedMode = (): 'dark' | 'light' => {
    if (draftMode === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'dark';
    }
    return draftMode;
  };

  const previewResolvedMode = getPreviewResolvedMode();

  // Decade list configuration
  const decadePresets: { key: ColorPreset; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'theme_70s', icon: Radio },
    { key: 'theme_80s', icon: Tv },
    { key: 'theme_90s', icon: Gamepad2 },
    { key: 'theme_2000s', icon: Droplets },
    { key: 'theme_2010s', icon: Square },
    { key: 'theme_2020s', icon: Cpu },
  ];

  const classicPresets: ColorPreset[] = [
    'cyan',
    'sapphire',
    'emerald',
    'violet',
    'amber',
    'crimson',
    'titanium',
  ];

  // Apply Staged Draft to Global System
  const handleApplyChanges = () => {
    setTheme(draftMode);
    setColorPreset(draftPreset);
    setDensity(draftDensity);
    setBackgroundFx(draftBgFx);
    
    toast.success(
      'Estilo Visual Aplicado',
      `Tema ${draftPresetConfig.name} (${draftPresetConfig.subtitle}) activado globalmente.`
    );
    setIsOpen(false);
  };

  // Revert Staged Draft to Current Global Active Store State
  const handleDiscardChanges = () => {
    setDraftPreset(colorPreset);
    setDraftMode(theme);
    setDraftDensity(density);
    setDraftBgFx(backgroundFx);
    toast.info('Cambios Descartados', 'Se restauraron los valores activos del sistema.');
  };

  // Reset to 2020s default
  const handleResetToDefaults = () => {
    setDraftPreset('theme_2020s');
    setDraftMode('dark');
    setDraftDensity('comfortable');
    setDraftBgFx('aurora_blobs');
    toast.info('Borrador Restablecido', 'Tema de la era 2020 cargado en borrador.');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button with Dynamic Glowing Color Orb */}
      <motion.button
        id="theme-selector-trigger"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-slate-200 dark:border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm relative group"
        title={`Tema Activo: ${activePresetConfig.name} (${theme})`}
        aria-label="Selector de 6 Estilos de Temas Visuales por Década"
      >
        {/* Glowing Color Dot Indicator */}
        <div className="relative flex items-center justify-center">
          <span
            className="w-2.5 h-2.5 rounded-full transition-all duration-300 group-hover:scale-125"
            style={{
              backgroundColor: activePresetConfig.primary,
              boxShadow: `0 0 10px ${activePresetConfig.primary}`,
            }}
          />
        </div>

        <History className="w-4 h-4 text-cyan-500 dark:text-cyan-400 group-hover:rotate-12 transition-transform" />

        <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase">
          <span className="text-slate-700 dark:text-slate-200">{activePresetConfig.name}</span>
          <span className="text-slate-400 dark:text-slate-500">• {theme}</span>
        </div>
      </motion.button>

      {/* Expanded Design Variation Drawer / Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="theme-selector-dropdown"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 mt-3 w-[330px] sm:w-[470px] md:w-[520px] bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-cyan-500/20 rounded-3xl shadow-2xl shadow-cyan-500/10 z-50 overflow-hidden backdrop-blur-2xl flex flex-col max-h-[88vh]"
          >
            {/* Header */}
            <div className="p-4 bg-slate-50 dark:bg-black/40 border-b border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div
                  className="p-2 rounded-xl text-black font-bold flex items-center justify-center transition-all duration-300 shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${draftPresetConfig.primary}, ${draftPresetConfig.primaryDark})`,
                  }}
                >
                  <Palette className="w-4 h-4 text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Estilos UI/UX por Décadas
                    </h4>
                    {hasPendingChanges && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                        Borrador
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">
                    70's • 80's • 90's • 2000's • 2010's • 2020's
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  id="reset-theme-draft-btn"
                  onClick={handleResetToDefaults}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  title="Restablecer Valores Por Defecto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  id="close-theme-selector-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* LIVE PREVIEW COMPONENT CONTAINER */}
            <div className="p-3.5 bg-slate-100/70 dark:bg-black/30 border-b border-slate-200/60 dark:border-white/5 shrink-0 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-gray-300 font-bold uppercase">
                  <Eye className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                  <span>Previsualización en Tiempo Real</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-gray-400">
                    Modo: <strong className="uppercase">{previewResolvedMode}</strong>
                  </span>
                  <span className="text-slate-300 dark:text-gray-600">•</span>
                  <span className="font-bold" style={{ color: draftPresetConfig.primary }}>
                    {draftPresetConfig.name}
                  </span>
                </div>
              </div>

              {/* Realistic Interactive Sample Block Container */}
              <div
                id="theme-live-preview-box"
                className={`rounded-2xl p-3.5 transition-all duration-300 border relative overflow-hidden shadow-md ${
                  previewResolvedMode === 'dark'
                    ? 'bg-[#0b0f19] text-white border-white/10'
                    : 'bg-white text-slate-900 border-slate-200 shadow-slate-200/50'
                }`}
                style={{
                  backgroundColor: previewResolvedMode === 'dark' ? draftPresetConfig.cardBgDark : draftPresetConfig.cardBgLight,
                  borderColor: `${draftPresetConfig.primary}40`,
                  fontSize: draftDensity === 'compact' ? '12px' : '13px',
                }}
              >
                {/* Simulated Atmospheric Layer */}
                <div
                  className="absolute -right-6 -top-6 w-28 h-28 rounded-full blur-xl pointer-events-none opacity-30 transition-all duration-500"
                  style={{ backgroundColor: draftPresetConfig.primary }}
                />

                {/* Sample Card Content */}
                <div className="relative z-10 space-y-2.5">
                  {/* Sample Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-black text-xs shrink-0 shadow-sm transition-all"
                        style={{
                          background: `linear-gradient(135deg, ${draftPresetConfig.primary}, ${draftPresetConfig.accent})`,
                        }}
                      >
                        <ShieldCheck className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <div className="font-bold text-xs leading-none">{draftPresetConfig.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {draftPresetConfig.vibeQuote}
                        </div>
                      </div>
                    </div>

                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase transition-colors"
                      style={{
                        backgroundColor: `${draftPresetConfig.primary}20`,
                        color: draftPresetConfig.primary,
                        borderColor: `${draftPresetConfig.primary}40`,
                        borderWidth: '1px',
                      }}
                    >
                      {draftPresetConfig.eraPill || draftPresetConfig.tag}
                    </span>
                  </div>

                  {/* Sample Metric & Interactive Elements */}
                  <div
                    className={`grid grid-cols-2 gap-2 p-2 rounded-xl border transition-all ${
                      previewResolvedMode === 'dark'
                        ? 'bg-black/40 border-white/5'
                        : 'bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div>
                      <div className="text-[9px] font-mono text-gray-400 flex items-center gap-1">
                        <Wallet className="w-3 h-3 text-gray-400" />
                        <span>Balance RYC</span>
                      </div>
                      <div
                        className="font-bold text-xs font-mono mt-0.5"
                        style={{ color: draftPresetConfig.primary }}
                      >
                        2,750.00 RYC
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] font-mono text-gray-400 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-emerald-400" />
                        <span>Nostalgia Shield</span>
                      </div>
                      <div className="font-bold text-xs font-mono mt-0.5 text-emerald-400">
                        100% Auténtico
                      </div>
                    </div>
                  </div>

                  {/* Sample Action Buttons */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      className="flex-1 py-1.5 px-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-default"
                      style={{
                        background: `linear-gradient(135deg, ${draftPresetConfig.primary}, ${draftPresetConfig.primaryDark})`,
                        color: '#000000',
                        boxShadow: `0 2px 10px ${draftPresetConfig.glowColor}`,
                      }}
                    >
                      <Zap className="w-3 h-3 text-black" />
                      <span>Ejecutar Acción</span>
                    </button>

                    <button
                      type="button"
                      className={`py-1.5 px-2.5 rounded-xl text-[11px] font-mono font-bold border transition-colors cursor-default ${
                        previewResolvedMode === 'dark'
                          ? 'bg-white/5 border-white/10 text-gray-300'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {draftPresetConfig.tag}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub Tabs Navigation */}
            <div className="grid grid-cols-4 p-1.5 bg-slate-100 dark:bg-black/50 border-b border-slate-200/60 dark:border-white/5 text-[11px] font-mono font-bold shrink-0">
              {[
                { id: 'decades', label: '6 Décadas', icon: History },
                { id: 'classic', label: 'Clásicos', icon: Sparkles },
                { id: 'mode', label: 'Luz / Modo', icon: Sun },
                { id: 'display', label: 'Efectos', icon: Sliders },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id as any)}
                    className={`py-1.5 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm font-extrabold'
                        : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Tab Controls Area */}
            <div className="p-4 overflow-y-auto flex-1 max-h-[290px] space-y-3">
              {/* Tab 1: 6 DECADE THEMES */}
              {activeSubTab === 'decades' && (
                <div className="space-y-2.5">
                  <div className="text-[10px] text-slate-500 dark:text-gray-400 font-mono uppercase tracking-wider flex items-center justify-between">
                    <span>6 Estilos de Épocas & Nostalgia Histórica</span>
                    <span className="font-bold text-cyan-400">1970 — 2020+</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {decadePresets.map(({ key, icon: EraIcon }) => {
                      const preset = COLOR_PRESETS[key];
                      const isDraftSelected = draftPreset === key;
                      const isSystemActive = colorPreset === key;

                      return (
                        <button
                          key={key}
                          onClick={() => setDraftPreset(key)}
                          className={`w-full p-3 rounded-2xl border transition-all text-left flex flex-col gap-2 group cursor-pointer ${
                            isDraftSelected
                              ? 'bg-slate-50 dark:bg-white/10 border-slate-400 dark:border-cyan-400/80 shadow-md ring-1 ring-cyan-500/30'
                              : 'bg-white/50 dark:bg-black/20 border-slate-200/70 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {/* Era Icon Badge */}
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-black shrink-0 shadow-sm transition-transform group-hover:scale-105"
                                style={{
                                  background: `linear-gradient(135deg, ${preset.primary}, ${preset.accent})`,
                                }}
                              >
                                <EraIcon className="w-4 h-4 text-black" />
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-slate-900 dark:text-white">
                                    {preset.name}
                                  </span>
                                  <span
                                    className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold"
                                    style={{
                                      backgroundColor: `${preset.primary}20`,
                                      color: preset.primary,
                                      borderColor: `${preset.primary}40`,
                                      borderWidth: '1px',
                                    }}
                                  >
                                    {preset.eraPill}
                                  </span>
                                  {isSystemActive && (
                                    <span className="text-[9px] font-mono text-emerald-500 font-bold">
                                      [Activo]
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">
                                  {preset.subtitle}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Color Swatch Dots */}
                              <div className="flex items-center -space-x-1.5">
                                <span
                                  className="w-4 h-4 rounded-full border-2 border-white dark:border-[#0d1322] shadow-sm"
                                  style={{ backgroundColor: preset.primary }}
                                />
                                <span
                                  className="w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0d1322]"
                                  style={{ backgroundColor: preset.accent }}
                                />
                                {preset.secondaryAccent && (
                                  <span
                                    className="w-3 h-3 rounded-full border-2 border-white dark:border-[#0d1322]"
                                    style={{ backgroundColor: preset.secondaryAccent }}
                                  />
                                )}
                              </div>

                              {isDraftSelected && (
                                <CheckCircle2
                                  className="w-4 h-4 shrink-0"
                                  style={{ color: preset.primary }}
                                />
                              )}
                            </div>
                          </div>

                          {/* Era Vibe Features Description */}
                          <div className="text-[10px] text-slate-600 dark:text-gray-300 font-sans border-t border-slate-100 dark:border-white/5 pt-1.5 flex items-center justify-between">
                            <span className="italic">{preset.vibeQuote}</span>
                            <span className="text-[9px] font-mono text-slate-400 dark:text-gray-500 font-semibold">
                              {preset.tag}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: Classic Presets */}
              {activeSubTab === 'classic' && (
                <div className="space-y-2">
                  <div className="text-[10px] text-slate-500 dark:text-gray-400 font-mono uppercase tracking-wider flex items-center justify-between">
                    <span>Paletas Cromáticas Monocolor Clásicas</span>
                    <span className="font-bold" style={{ color: draftPresetConfig.primary }}>
                      {draftPresetConfig.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {classicPresets.map((presetKey) => {
                      const preset = COLOR_PRESETS[presetKey];
                      const isDraftSelected = draftPreset === presetKey;
                      const isSystemActive = colorPreset === presetKey;

                      return (
                        <button
                          key={presetKey}
                          onClick={() => setDraftPreset(presetKey)}
                          className={`w-full p-2.5 rounded-2xl border transition-all text-left flex items-center justify-between group cursor-pointer ${
                            isDraftSelected
                              ? 'bg-slate-50 dark:bg-white/10 border-slate-400 dark:border-cyan-400/60 shadow-md'
                              : 'bg-white/50 dark:bg-black/20 border-slate-200/70 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Color Swatches */}
                            <div className="flex items-center -space-x-1.5 shrink-0">
                              <span
                                className="w-5 h-5 rounded-full border-2 border-white dark:border-[#0d1322] shadow-sm transition-transform group-hover:scale-110"
                                style={{ backgroundColor: preset.primary }}
                              />
                              <span
                                className="w-4 h-4 rounded-full border-2 border-white dark:border-[#0d1322]"
                                style={{ backgroundColor: preset.accent }}
                              />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-900 dark:text-white">
                                  {preset.name}
                                </span>
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 border border-slate-200/50 dark:border-white/5">
                                  {preset.tag}
                                </span>
                                {isSystemActive && (
                                  <span className="text-[9px] font-mono text-emerald-500 font-bold">
                                    [Activo]
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">
                                {preset.subtitle}
                              </p>
                            </div>
                          </div>

                          {isDraftSelected && (
                            <CheckCircle2
                              className="w-4 h-4 shrink-0"
                              style={{ color: preset.primary }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: Lighting & Theme Modes */}
              {activeSubTab === 'mode' && (
                <div className="space-y-2">
                  <div className="text-[10px] text-slate-500 dark:text-gray-400 font-mono uppercase tracking-wider">
                    Modo de Iluminación Ambiental
                  </div>

                  <div className="space-y-1.5">
                    {themeModeOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isDraftSelected = draftMode === opt.mode;
                      const isSystemActive = theme === opt.mode;

                      return (
                        <button
                          key={opt.mode}
                          onClick={() => setDraftMode(opt.mode)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                            isDraftSelected
                              ? 'bg-slate-50 dark:bg-white/10 border-slate-400 dark:border-cyan-400/50 text-slate-900 dark:text-white shadow-sm'
                              : 'bg-white/50 dark:bg-black/20 border-slate-200/70 dark:border-white/5 text-slate-600 dark:text-gray-300 hover:bg-slate-100/80 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`p-2 rounded-xl border ${
                                isDraftSelected
                                  ? 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30'
                                  : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 border-slate-200/60 dark:border-white/5'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs">{opt.label}</span>
                                {isSystemActive && (
                                  <span className="text-[9px] font-mono text-emerald-500 font-bold">
                                    [Activo]
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono font-normal">
                                {opt.desc}
                              </div>
                            </div>
                          </div>

                          {isDraftSelected && <Check className="w-4 h-4 text-cyan-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 4: Effects & UI Density */}
              {activeSubTab === 'display' && (
                <div className="space-y-3 font-mono">
                  {/* Density Switch */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                      Densidad de la Interfaz
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setDraftDensity('comfortable')}
                        className={`p-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          draftDensity === 'comfortable'
                            ? 'bg-slate-50 dark:bg-white/10 border-slate-400 dark:border-cyan-400/50 text-slate-900 dark:text-white shadow-sm'
                            : 'bg-white/50 dark:bg-black/20 border-slate-200/70 dark:border-white/5 text-slate-500 dark:text-gray-400'
                        }`}
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Confortable</span>
                      </button>

                      <button
                        onClick={() => setDraftDensity('compact')}
                        className={`p-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          draftDensity === 'compact'
                            ? 'bg-slate-50 dark:bg-white/10 border-slate-400 dark:border-cyan-400/50 text-slate-900 dark:text-white shadow-sm'
                            : 'bg-white/50 dark:bg-black/20 border-slate-200/70 dark:border-white/5 text-slate-500 dark:text-gray-400'
                        }`}
                      >
                        <Minimize2 className="w-3.5 h-3.5" />
                        <span>Compacto (Pro)</span>
                      </button>
                    </div>
                  </div>

                  {/* Background Atmosphere / Blobs */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                      Atmósfera & Partículas Dinámicas
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                      {[
                        { id: 'aurora_blobs', label: 'Aurora Blobs', icon: Zap },
                        { id: 'cyber_grid', label: 'Cyber Grid', icon: Layers },
                        { id: 'deep_space', label: 'Deep Space', icon: Sparkles },
                        { id: 'none', label: 'Plano', icon: Eye },
                      ].map((fx) => {
                        const isDraftSelected = draftBgFx === fx.id;
                        const Icon = fx.icon;
                        return (
                          <button
                            key={fx.id}
                            onClick={() => setDraftBgFx(fx.id as any)}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                              isDraftSelected
                                ? 'bg-slate-50 dark:bg-white/10 border-slate-400 dark:border-cyan-400/50 text-slate-900 dark:text-white shadow-sm'
                                : 'bg-white/50 dark:bg-black/20 border-slate-200/70 dark:border-white/5 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">{fx.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CONFIRMATION & ACTION FOOTER */}
            <div className="p-3.5 bg-slate-50 dark:bg-black/60 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5">
                {hasPendingChanges ? (
                  <button
                    id="discard-theme-changes-btn"
                    onClick={handleDiscardChanges}
                    className="px-3 py-2 rounded-xl bg-slate-200/70 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-gray-300 font-mono text-[11px] font-bold transition-all cursor-pointer"
                  >
                    Descartar
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Sincronizado</span>
                  </div>
                )}
              </div>

              <motion.button
                id="apply-theme-global-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApplyChanges}
                className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                style={{
                  background: `linear-gradient(135deg, ${draftPresetConfig.primary}, ${draftPresetConfig.primaryDark})`,
                  color: '#000000',
                  boxShadow: `0 2px 14px ${draftPresetConfig.glowColor}`,
                }}
              >
                <CheckCheck className="w-4 h-4 text-black" />
                <span>Aplicar al Sistema</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
