import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Box, 
  Cpu, 
  Globe, 
  Sparkles, 
  Compass, 
  Activity, 
  RefreshCw, 
  Maximize2, 
  Layers,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { AnimatedCard } from './AnimatedCard';

export type UniverseMode = 'matrix_nodes' | 'quantum_sphere' | 'neural_mesh';

export function Interactive3DUniverse() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<UniverseMode>('matrix_nodes');
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [interactiveGlow, setInteractiveGlow] = useState<boolean>(true);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 380);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 380;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouseRef.current.targetX = x * 0.001;
      mouseRef.current.targetY = y * 0.001;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    // Particle / Node generation
    const nodes: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      radius: number;
      color: string;
      connections: number[];
    }> = [];

    const nodeCount = 50;
    const colors = ['#00d2ff', '#3b82f6', '#10b981', '#a855f7', '#f59e0b'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        z: (Math.random() - 0.5) * 300,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        vz: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        connections: []
      });
    }

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      angle += 0.005 * rotationSpeed;

      const cos = Math.cos(angle + mouseRef.current.x);
      const sin = Math.sin(angle + mouseRef.current.y);

      // Background grid effect
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Project and sort nodes by Z
      const projectedNodes = nodes.map((node) => {
        // Move nodes
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        if (node.x < -200 || node.x > 200) node.vx *= -1;
        if (node.y < -200 || node.y > 200) node.vy *= -1;
        if (node.z < -200 || node.z > 200) node.vz *= -1;

        // 3D Rotation transformation
        let x = node.x;
        let y = node.y;
        let z = node.z;

        if (mode === 'quantum_sphere') {
          // Sphere projection
          const r = 120;
          const phi = Math.acos(-1 + (2 * nodes.indexOf(node)) / nodeCount);
          const theta = Math.sqrt(nodeCount * Math.PI) * phi;
          x = r * Math.sin(phi) * Math.cos(theta + angle);
          y = r * Math.sin(phi) * Math.sin(theta + angle);
          z = r * Math.cos(phi);
        }

        // Rotate around Y axis
        const rotX = x * cos - z * sin;
        const rotZ = z * cos + x * sin;

        // Perspective projection
        const fov = 300;
        const scale = fov / (fov + rotZ + 150);
        const projX = width / 2 + rotX * scale;
        const projY = height / 2 + y * scale;

        return {
          ...node,
          projX,
          projY,
          scale,
          rotZ
        };
      });

      projectedNodes.sort((a, b) => a.rotZ - b.rotZ);

      // Draw connections / mesh lines
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const dx = projectedNodes[i].projX - projectedNodes[j].projX;
          const dy = projectedNodes[i].projY - projectedNodes[j].projY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(projectedNodes[i].projX, projectedNodes[i].projY);
            ctx.lineTo(projectedNodes[j].projX, projectedNodes[j].projY);
            const alpha = (1 - dist / 90) * 0.25;
            ctx.strokeStyle = interactiveGlow ? `rgba(0, 210, 255, ${alpha})` : `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = projectedNodes[i].scale * 1.2;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      projectedNodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.projX, node.projY, node.radius * node.scale * 2, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, rotationSpeed, interactiveGlow]);

  return (
    <AnimatedCard className="cyber-holo-card rounded-2xl p-6 relative overflow-hidden">
      {/* Background Mesh Glow Orb */}
      <div className="mesh-glow-orb bg-cyan-500 w-64 h-64 -top-20 -left-20"></div>
      <div className="mesh-glow-orb bg-purple-600 w-64 h-64 -bottom-20 -right-20"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Box className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Universo WebGL & 3D Interactivo</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                GPU Render Engine
              </span>
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Manipula nodos cuánticos 3D en tiempo real con física de cursor y proyección espacial
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setMode('matrix_nodes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              mode === 'matrix_nodes' 
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            Matrix Node
          </button>
          <button
            onClick={() => setMode('quantum_sphere')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              mode === 'quantum_sphere' 
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            Quantum Sphere
          </button>
          <button
            onClick={() => setRotationSpeed(s => s === 1 ? 2.5 : 1)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-400 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${rotationSpeed > 1 ? 'animate-spin' : ''}`} />
            <span>Velocidad: {rotationSpeed}x</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full h-[380px] rounded-xl overflow-hidden bg-[#040812] border border-cyan-500/20 shadow-inner group">
        <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Overlay HUD indicators */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-300 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>WebGL 2.0 / 60 FPS Stable</span>
        </div>

        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-400 pointer-events-none">
          Mueve el cursor para alterar la perspectiva giroscópica
        </div>
      </div>
    </AnimatedCard>
  );
}
