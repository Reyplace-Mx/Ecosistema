import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../store/useThemeStore';

export function BackgroundFxManager() {
  const { backgroundFx, colorPreset } = useThemeStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic Decade-specific particle & shape systems
    interface DecadeParticle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      rot: number;
      vRot: number;
      color: string;
      shape: 'bubble' | 'memphis_cross' | 'memphis_circle' | 'memphis_triangle' | 'dust' | 'neon_spark';
    }

    const particles: DecadeParticle[] = [];
    const particleCount = colorPreset === 'theme_2000s' ? 35 : colorPreset === 'theme_90s' ? 30 : colorPreset === 'theme_70s' ? 45 : 50;

    const colors70s = ['rgba(217, 119, 6, ', 'rgba(234, 88, 12, ', 'rgba(234, 179, 8, ', 'rgba(101, 163, 13, '];
    const colors80s = ['rgba(244, 63, 94, ', 'rgba(6, 182, 212, ', 'rgba(168, 85, 247, '];
    const colors90s = ['rgba(13, 148, 136, ', 'rgba(139, 92, 246, ', 'rgba(245, 158, 11, ', 'rgba(239, 68, 68, '];
    const colors2000s = ['rgba(56, 189, 248, ', 'rgba(2, 132, 199, ', 'rgba(132, 204, 22, '];

    for (let i = 0; i < particleCount; i++) {
      let shape: DecadeParticle['shape'] = 'dust';
      let color = 'rgba(0, 210, 255, ';

      if (colorPreset === 'theme_70s') {
        shape = 'dust';
        color = colors70s[Math.floor(Math.random() * colors70s.length)];
      } else if (colorPreset === 'theme_80s') {
        shape = 'neon_spark';
        color = colors80s[Math.floor(Math.random() * colors80s.length)];
      } else if (colorPreset === 'theme_90s') {
        const shapes: DecadeParticle['shape'][] = ['memphis_cross', 'memphis_circle', 'memphis_triangle'];
        shape = shapes[Math.floor(Math.random() * shapes.length)];
        color = colors90s[Math.floor(Math.random() * colors90s.length)];
      } else if (colorPreset === 'theme_2000s') {
        shape = 'bubble';
        color = colors2000s[Math.floor(Math.random() * colors2000s.length)];
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: shape === 'bubble' ? Math.random() * 18 + 8 : shape.startsWith('memphis') ? Math.random() * 12 + 8 : Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * (shape === 'bubble' ? 0.3 : 0.4),
        vy: shape === 'bubble' ? -(Math.random() * 0.5 + 0.2) : (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.15,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        color,
        shape
      });
    }

    let gridOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. 80's Retrowave Perspective Grid
      if (colorPreset === 'theme_80s' || backgroundFx === 'cyber_grid') {
        gridOffset = (gridOffset + 0.6) % 40;
        ctx.strokeStyle = colorPreset === 'theme_80s' ? 'rgba(244, 63, 94, 0.08)' : 'rgba(0, 210, 255, 0.06)';
        ctx.lineWidth = 1;

        // Vertical perspective lines
        for (let x = 0; x < width; x += 50) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // Horizontal moving lines
        for (let y = gridOffset; y < height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // 80s Horizon Laser Beam
        if (colorPreset === 'theme_80s') {
          const grad = ctx.createLinearGradient(0, height * 0.65, width, height * 0.65);
          grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
          grad.addColorStop(0.5, 'rgba(244, 63, 94, 0.15)');
          grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, height * 0.64, width, 3);
        }
      }

      // 2. Decade Particles rendering
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;

        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;
        if (p.y < -30) p.y = height + 30;
        if (p.y > height + 30) p.y = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (p.shape === 'bubble') {
          // 2000s Frutiger Aero Glossy Bubble
          const radius = p.size;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.alpha * 0.3})`;
          ctx.fill();
          ctx.strokeStyle = `${p.color}${p.alpha * 0.8})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Specular upper-left reflection
          ctx.beginPath();
          ctx.arc(-radius * 0.35, -radius * 0.35, radius * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.7})`;
          ctx.fill();
        } else if (p.shape === 'memphis_cross') {
          // 90s Memphis Cross Shape
          ctx.strokeStyle = `${p.color}${p.alpha})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(-p.size, 0);
          ctx.lineTo(p.size, 0);
          ctx.moveTo(0, -p.size);
          ctx.lineTo(0, p.size);
          ctx.stroke();
        } else if (p.shape === 'memphis_triangle') {
          // 90s Memphis Hollow Triangle
          ctx.strokeStyle = `${p.color}${p.alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size, p.size);
          ctx.lineTo(-p.size, p.size);
          ctx.closePath();
          ctx.stroke();
        } else if (p.shape === 'memphis_circle') {
          // 90s Memphis Striped Circle
          ctx.strokeStyle = `${p.color}${p.alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Ambient Dust / Neon Sparks
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [backgroundFx, colorPreset]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Background Atmosphere Glows depending on Decade Theme */}
      {colorPreset === 'theme_70s' && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/5 w-[550px] h-[550px] bg-amber-600/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/5 w-[650px] h-[650px] bg-orange-700/15 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 right-1/3 w-[450px] h-[450px] bg-yellow-600/10 rounded-full blur-[120px]" />
        </div>
      )}

      {colorPreset === 'theme_80s' && (
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[130px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-purple-600/25 rounded-full blur-[110px]" />
        </div>
      )}

      {colorPreset === 'theme_90s' && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[130px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[100px]" />
        </div>
      )}

      {colorPreset === 'theme_2000s' && (
        <div className="absolute inset-0 opacity-35">
          <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-sky-400/25 rounded-full blur-[130px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 right-1/3 w-[450px] h-[450px] bg-lime-400/15 rounded-full blur-[120px]" />
        </div>
      )}

      {colorPreset === 'theme_2010s' && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[100px]" />
        </div>
      )}

      {(colorPreset === 'theme_2020s' || colorPreset === 'cyan' || colorPreset === 'sapphire' || colorPreset === 'emerald' || colorPreset === 'violet' || colorPreset === 'amber' || colorPreset === 'crimson' || colorPreset === 'titanium') && (
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px]" />
        </div>
      )}

      {/* Interactive canvas for geometric, particles and grid animations */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
