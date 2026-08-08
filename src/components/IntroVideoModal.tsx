import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, X, Maximize, Sparkles, MapPin, Radio, Shield, Film, Image as ImageIcon } from 'lucide-react';
import brandBanner from '../assets/images/reyplace_brand_banner_1786197069951.jpg';
import logoBadge from '../assets/images/reyplace_logo_badge_1786197084782.jpg';

interface IntroVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IntroVideoModal({ isOpen, onClose }: IntroVideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl bg-[#0c0c0e] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/20 flex flex-col"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-6 bg-[#080809] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={logoBadge}
                alt="Reyplace Logo"
                className="w-9 h-9 rounded-xl border border-cyan-500/30 object-cover shadow-lg shadow-cyan-500/20"
                referrerPolicy="no-referrer"
              />
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wider flex items-center gap-2">
                  REYPLACE <span className="text-cyan-400 font-mono text-xs px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">Video Presentación</span>
                </h2>
                <p className="text-xs text-gray-400 flex items-center gap-1.5 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Los Mochis, Sinaloa, México
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Video Viewport */}
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
            {/* Animated Canvas Background / Fallback Video Visualizer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/40 via-purple-950/30 to-blue-950/40">
              <img
                src={brandBanner}
                alt="Reyplace Intro Brand"
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            </div>

            {/* Glowing Brand Overlay inside Video */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-3"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono tracking-widest uppercase backdrop-blur-md">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" /> Transmisión Oficial Reyplace
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                  Reyplace
                </h1>
                <p className="text-xs sm:text-sm font-bold text-cyan-300 tracking-[0.25em] uppercase font-mono">
                  CONECTAMOS • INNOVAMOS • TRANSFORMAMOS
                </p>
                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-gray-300 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/10 max-w-fit mx-auto mt-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Los Mochis, Sinaloa, México
                </div>
              </motion.div>
            </div>

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all shadow-lg shadow-cyan-500/30 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="text-xs font-mono text-gray-300">
                  <span className="text-cyan-400">00:07</span> / 00:07 HD 1080p
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-md">
                  Cúpula AV Engine
                </span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="p-4 sm:p-6 bg-[#080809] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400 space-y-1">
              <p className="font-bold text-white">Ecosistema Digital Híbrido Modular</p>
              <p>ReyID • Smart City • Marketplace • Cúpula Digital • Reycoin v2</p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Entrar al Ecosistema
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
