import React, { useEffect, useRef } from 'react';
import { BiometricScanType, BiometricStatus } from '../store/useBiometricStore';

interface WebGLBiometricCanvasProps {
  type: BiometricScanType;
  status: BiometricStatus;
  progress: number;
  className?: string;
}

// Vertex shader shared by both modes
const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = (a_position + 1.0) * 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Retina Fragment Shader
const RETINA_FRAGMENT_SHADER_SOURCE = `
  precision highp float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform float u_progress;
  uniform int u_status; // 0: idle, 1: scanning, 2: verifying, 3: success, 4: failed
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  #define PI 3.14159265359

  // Hash function
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Simplex-like 2D noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; ++i) {
      v += a * noise(p);
      p = rot * p * 2.0 + vec2(100.0);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    // Parallax tilt
    uv += (u_mouse - 0.5) * 0.05;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // Dynamic pupil dilation oscillating with heart rate & scan excitement
    float pupilBase = 0.16 + 0.03 * sin(u_time * 2.5);
    if (u_status == 1 || u_status == 2) {
      pupilBase += 0.05 * sin(u_time * 6.0);
    }
    float irisRadius = 0.42;

    vec3 col = vec3(0.01, 0.02, 0.04); // Deep space backdrop

    // --- IRIS FIBERS & VASCULAR TEXTURE ---
    if (r > pupilBase * 0.9 && r < irisRadius * 1.05) {
      // Polar coordinate distortion
      float polarR = (r - pupilBase) / (irisRadius - pupilBase);
      float rays = sin(angle * 48.0 + fbm(vec2(angle * 6.0, r * 12.0) + u_time * 0.2) * 6.0);
      rays = smoothstep(-0.2, 0.9, rays);

      float vascular = fbm(vec2(angle * 14.0, r * 20.0 - u_time * 0.1));
      float fiberDepth = fbm(vec2(cos(angle) * 4.0, sin(angle) * 4.0) + r * 8.0);

      // Iris Color Palette (Holographic Cyan / Emerald / Violet)
      vec3 irisColorA = vec3(0.05, 0.85, 0.95); // Neon Cyan
      vec3 irisColorB = vec3(0.1, 0.4, 0.9);   // Deep Royal Blue
      vec3 irisColorC = vec3(0.9, 0.2, 0.6);   // Violet Accent
      
      if (u_status == 3) {
        // Success Emerald shift
        irisColorA = vec3(0.1, 0.95, 0.55);
        irisColorB = vec3(0.05, 0.7, 0.3);
      } else if (u_status == 4) {
        // Failed Rose shift
        irisColorA = vec3(1.0, 0.2, 0.3);
        irisColorB = vec3(0.6, 0.05, 0.1);
      }

      vec3 irisBase = mix(irisColorB, irisColorA, rays * 0.7 + fiberDepth * 0.3);
      irisBase = mix(irisBase, irisColorC, smoothstep(0.4, 0.9, vascular) * 0.35);

      // Limbal ring (dark outer edge of iris)
      float limbal = smoothstep(irisRadius * 1.05, irisRadius * 0.92, r);
      // Collarette ring
      float collarette = smoothstep(pupilBase * 0.95, pupilBase * 1.35, r);

      col = irisBase * limbal * collarette;
      
      // Pupil boundary soft shadow
      col *= smoothstep(pupilBase, pupilBase + 0.03, r);
    }

    // --- PUPIL (Deep Obsidian Void with Sub-surface reflection) ---
    if (r < pupilBase) {
      col = vec3(0.005, 0.008, 0.015);
      // Inner optical reflection dot
      float dotReflect = smoothstep(0.03, 0.005, length(uv - vec2(pupilBase * 0.35, pupilBase * 0.35)));
      col += vec3(0.4, 0.8, 1.0) * dotReflect * 0.6;
    }

    // --- HOLOGRAPHIC RETICLE RINGS & TARGETING ARCS ---
    float ring1 = abs(r - irisRadius) - 0.002;
    float ring1Glow = 0.003 / (abs(ring1) + 0.003);

    float ring2 = abs(r - 0.47) - 0.0015;
    float arcAngle = mod(angle + u_time * 0.8, PI * 2.0);
    float ring2Mask = step(1.2, mod(angle * 3.0 + u_time * 1.2, PI * 2.0));
    float ring2Glow = (0.002 / (abs(ring2) + 0.002)) * ring2Mask;

    float ring3 = abs(r - 0.51) - 0.001;
    float ring3Dashes = step(0.5, sin(angle * 36.0 - u_time * 1.5));
    float ring3Glow = (0.0015 / (abs(ring3) + 0.0015)) * ring3Dashes;

    vec3 hudColor = (u_status == 3) ? vec3(0.1, 0.95, 0.5) : (u_status == 4) ? vec3(1.0, 0.25, 0.3) : vec3(0.0, 0.85, 1.0);
    col += (ring1Glow * 0.8 + ring2Glow * 1.1 + ring3Glow * 0.7) * hudColor;

    // --- LASER SCAN LINE (Active during scanning / verifying) ---
    if (u_status == 1 || u_status == 2) {
      float scanY = sin(u_time * 3.5) * 0.48;
      float distToScan = abs(uv.y - scanY);
      float laserBeam = 0.003 / (distToScan + 0.003);
      float laserAura = exp(-distToScan * 22.0) * 0.6;
      
      // Laser color with chromatic split
      vec3 laserColor = vec3(0.0, 0.95, 1.0) * laserBeam + vec3(0.2, 0.5, 1.0) * laserAura;
      col += laserColor * smoothstep(0.52, 0.48, r);

      // Scintillating optical particles along the laser
      float pNoise = hash(vec2(floor(uv.x * 60.0), floor(scanY * 60.0) + floor(u_time * 20.0)));
      if (pNoise > 0.82 && distToScan < 0.04) {
        col += vec3(0.8, 1.0, 1.0) * (1.0 - distToScan / 0.04) * 0.8;
      }
    }

    // --- SUCCESS BURST RING ---
    if (u_status == 3) {
      float burstR = fract(u_time * 1.2) * 0.6;
      float burstRing = abs(r - burstR) - 0.004;
      float burstGlow = 0.005 / (abs(burstRing) + 0.005) * (1.0 - burstR / 0.6);
      col += vec3(0.2, 1.0, 0.6) * burstGlow * 1.5;
    }

    // Vignette
    col *= smoothstep(0.65, 0.35, r);

    gl_FragColor = vec4(col, 1.0);
  }
`;

// Fingerprint Fragment Shader
const FINGERPRINT_FRAGMENT_SHADER_SOURCE = `
  precision highp float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform float u_progress;
  uniform int u_status; // 0: idle, 1: scanning, 2: verifying, 3: success, 4: failed
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  #define PI 3.14159265359

  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 567.21));
    p += dot(p, p + 65.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    // Subtle parallax
    uv += (u_mouse - 0.5) * 0.04;

    // Center offset to shape fingerprint oval
    vec2 fpUv = uv;
    fpUv.y *= 0.82; // Elliptical stretch
    fpUv.y += 0.02;

    float r = length(fpUv);
    float angle = atan(fpUv.y, fpUv.x);

    vec3 col = vec3(0.01, 0.02, 0.04);

    // Oval mask of fingerprint area
    float fpMask = smoothstep(0.42, 0.38, length(vec2(uv.x * 1.15, uv.y * 0.88)));

    if (fpMask > 0.01) {
      // --- MATHEMATICAL DERMATOGLYPHIC RIDGES (Whorls & Delta loops) ---
      float coreDist = length(fpUv - vec2(0.0, -0.05));
      float coreWhorl = sin(coreDist * 95.0 + sin(angle * 3.0 + coreDist * 18.0) * 2.2);
      
      // Ridge turbulence & bifurcation simulation
      float ridgeNoise = sin(fpUv.x * 45.0 + sin(fpUv.y * 35.0) * 1.5) * 0.3;
      float ridgePattern = sin(coreDist * 88.0 + ridgeNoise + angle * 2.0);
      
      float ridgeLine = smoothstep(-0.25, 0.55, ridgePattern);

      vec3 ridgeColor = vec3(0.08, 0.6, 0.85); // Neon Cyan default
      if (u_status == 3) {
        ridgeColor = vec3(0.1, 0.95, 0.55); // Emerald
      } else if (u_status == 4) {
        ridgeColor = vec3(1.0, 0.25, 0.35); // Rose
      }

      // Capacitive contact glow
      float contactGlow = 0.4 + 0.6 * ridgeLine;
      col += ridgeColor * contactGlow * fpMask * 0.75;

      // Minutiae target anchor points (Bifurcations & Endings)
      vec2 m1 = vec2(0.08, 0.05);
      vec2 m2 = vec2(-0.11, -0.08);
      vec2 m3 = vec2(0.02, -0.15);
      vec2 m4 = vec2(-0.06, 0.12);

      float d1 = length(uv - m1);
      float d2 = length(uv - m2);
      float d3 = length(uv - m3);
      float d4 = length(uv - m4);

      float minutiaeGlow = (0.003 / (d1 + 0.003)) + (0.003 / (d2 + 0.003)) + 
                           (0.003 / (d3 + 0.003)) + (0.003 / (d4 + 0.003));
      
      if (u_status >= 1) {
        col += vec3(0.2, 1.0, 0.8) * minutiaeGlow * 0.25 * fpMask;
      }
    }

    // --- CAPACITIVE VERTICAL LASER SWEEP ---
    if (u_status == 1 || u_status == 2) {
      float laserY = sin(u_time * 3.8) * 0.40;
      float distToLaser = abs(uv.y - laserY);
      
      float beam = 0.004 / (distToLaser + 0.003);
      float aura = exp(-distToLaser * 18.0) * 0.8;
      
      vec3 laserColor = vec3(0.1, 0.9, 1.0) * beam + vec3(0.0, 0.4, 0.9) * aura;
      col += laserColor * fpMask * 1.3;

      // Scanning sparkle nodes
      float sparkle = hash(vec2(floor(uv.x * 40.0), floor(laserY * 40.0) + floor(u_time * 15.0)));
      if (sparkle > 0.85 && distToLaser < 0.03) {
        col += vec3(1.0, 1.0, 1.0) * 0.9 * fpMask;
      }
    }

    // --- HUD BOUNDARY & CROSSHAIRS ---
    float boundary = abs(length(vec2(uv.x * 1.15, uv.y * 0.88)) - 0.40) - 0.002;
    float boundaryGlow = 0.0025 / (abs(boundary) + 0.0025);
    
    // Crosshair ticks
    float crossX = step(abs(uv.x), 0.015) * step(abs(uv.y - 0.38), 0.02);
    float crossY = step(abs(uv.y), 0.015) * step(abs(uv.x - 0.35), 0.02);
    float crossCenter = (crossX + crossY);

    vec3 hudCol = (u_status == 3) ? vec3(0.1, 0.95, 0.5) : (u_status == 4) ? vec3(1.0, 0.25, 0.3) : vec3(0.0, 0.8, 1.0);
    col += (boundaryGlow * 0.6 + crossCenter * 0.8) * hudCol;

    // Vignette
    col *= smoothstep(0.6, 0.32, r);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function WebGLBiometricCanvas({ type, status, progress, className = '' }: WebGLBiometricCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const startTimeRef = useRef<number>(Date.now());

  // Uniform locations cache
  const uniformsRef = useRef<{
    time?: WebGLUniformLocation | null;
    progress?: WebGLUniformLocation | null;
    status?: WebGLUniformLocation | null;
    resolution?: WebGLUniformLocation | null;
    mouse?: WebGLUniformLocation | null;
  }>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) {
      gl = canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    }
    if (!gl) {
      console.warn("WebGL not supported, fallback to 2D");
      return;
    }
    glRef.current = gl;

    const compileShader = (source: string, shaderType: number) => {
      const shader = gl!.createShader(shaderType);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const fragmentSource = type === 'retina' ? RETINA_FRAGMENT_SHADER_SOURCE : FINGERPRINT_FRAGMENT_SHADER_SOURCE;

    const vertexShader = compileShader(VERTEX_SHADER_SOURCE, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    // Setup full-screen quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Cache uniforms
    uniformsRef.current = {
      time: gl.getUniformLocation(program, 'u_time'),
      progress: gl.getUniformLocation(program, 'u_progress'),
      status: gl.getUniformLocation(program, 'u_status'),
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      mouse: gl.getUniformLocation(program, 'u_mouse'),
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
      mouseRef.current.targetY = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (gl && program) {
        gl.deleteProgram(program);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [type]);

  // Render loop
  useEffect(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    if (!gl || !program || !canvas) return;

    let statusCode = 0;
    if (status === 'scanning') statusCode = 1;
    else if (status === 'verifying') statusCode = 2;
    else if (status === 'success') statusCode = 3;
    else if (status === 'failed') statusCode = 4;

    const render = () => {
      if (!gl || !program || !canvas) return;

      // Handle retina high-DPI sizing
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = Math.floor(canvas.clientWidth * dpr);
      const displayHeight = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }

      gl.useProgram(program);

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const elapsed = (Date.now() - startTimeRef.current) / 1000;

      const uniforms = uniformsRef.current;
      if (uniforms.time) gl.uniform1f(uniforms.time, elapsed);
      if (uniforms.progress) gl.uniform1f(uniforms.progress, progress / 100);
      if (uniforms.status) gl.uniform1i(uniforms.status, statusCode);
      if (uniforms.resolution) gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      if (uniforms.mouse) gl.uniform2f(uniforms.mouse, mouseRef.current.x, mouseRef.current.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [status, progress]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair"
      />
    </div>
  );
}
