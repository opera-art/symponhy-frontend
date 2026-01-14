'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Cpu } from 'lucide-react';

const modeNames = ['NEBULA CLOUD', 'QUANTUM TORUS', 'CYBER LATTICE', 'WARP VORTEX'];

export default function OnboardingPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [currentMode, setCurrentMode] = useState(0);
  const [colorPalette, setColorPalette] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [particleCount, setParticleCount] = useState(65000);

  const sceneRef = useRef<any>({});

  const initScene = useCallback(async () => {
    if (!canvasRef.current) return;

    const container = canvasRef.current;
    const THREE = await import('three');

    const isMobile = window.innerWidth < 768;
    const pCount = isMobile ? 35000 : 65000;
    setParticleCount(pCount);

    // State
    const STATE = {
      mouse: { x: 0, y: 0 },
      mode: 0,
      targetMode: 0,
      time: 0,
      colorPalette: 0,
    };
    sceneRef.current.state = STATE;

    // Renderer - FULL SCREEN
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x030305, 1);
    container.appendChild(renderer.domElement);
    sceneRef.current.renderer = renderer;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030305, 0.015);
    scene.background = new THREE.Color(0x030305);
    sceneRef.current.scene = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = isMobile ? 40 : 28;
    sceneRef.current.camera = camera;

    // Particle Shaders
    const vertexShader = `
      uniform float uTime;
      uniform float uMode;
      uniform vec2 uMouse;
      attribute vec3 aRandom;
      attribute float aIndex;
      varying vec3 vColor;
      varying float vAlpha;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      vec3 getPosSphere(float idx) {
        float phi = acos(-1.0 + (2.0 * idx) / ${pCount}.0);
        float theta = sqrt(${pCount}.0 * 3.1415926) * phi;
        float r = 12.0 + aRandom.x * 2.0;
        return vec3(r * sin(phi) * cos(theta), r * sin(phi) * sin(theta), r * cos(phi));
      }

      vec3 getPosTorus(float idx) {
        float t = idx * 0.1;
        float r = 10.0 + aRandom.y * 3.0;
        float tube = 3.0 + aRandom.x * 2.0;
        float angle = (idx / ${pCount}.0) * 6.28 * 15.0;
        return vec3((r + tube * cos(angle)) * cos(t), (r + tube * cos(angle)) * sin(t), tube * sin(angle));
      }

      vec3 getPosLattice(float idx) {
        float size = 25.0;
        float step = pow(${pCount}.0, 1.0/3.0);
        float x = mod(idx, step);
        float y = mod(floor(idx/step), step);
        float z = floor(idx/(step*step));
        return (vec3(x, y, z) / step - 0.5) * size;
      }

      vec3 getPosVortex(float idx) {
        float r = (idx / ${pCount}.0) * 18.0;
        float ang = r * 3.0;
        float h = (aRandom.x - 0.5) * 8.0 * (1.0 - r/20.0);
        return vec3(r * cos(ang), r * sin(ang), h);
      }

      void main() {
        float t = uTime * 0.15;
        float m = uMode;
        vec3 pSphere = getPosSphere(aIndex);
        vec3 pTorus = getPosTorus(aIndex);
        vec3 pLattice = getPosLattice(aIndex);
        vec3 pVortex = getPosVortex(aIndex);

        vec3 noiseBase = vec3(snoise(vec3(aIndex*0.01, t*0.2, 0.0)), snoise(vec3(aIndex*0.01, 0.0, t*0.2)), snoise(vec3(0.0, aIndex*0.01, t*0.2)));
        pSphere += noiseBase * 4.0;
        pTorus += noiseBase * 2.0;
        pLattice += noiseBase * 1.5;
        pVortex += noiseBase * 2.0;

        float c = cos(t*0.3); float s = sin(t*0.3);
        pTorus.xy = mat2(c, -s, s, c) * pTorus.xy;
        pTorus.xz = mat2(c, -s, s, c) * pTorus.xz;

        float va = t * 1.0 - length(pVortex.xy)*0.2;
        float vc = cos(va); float vs = sin(va);
        pVortex.xy = mat2(vc, -vs, vs, vc) * pVortex.xy;

        vec3 pos;
        if(m <= 0.0) pos = pSphere;
        else if(m <= 1.0) pos = mix(pSphere, pTorus, m);
        else if(m <= 2.0) pos = mix(pTorus, pLattice, m - 1.0);
        else if(m <= 3.0) pos = mix(pLattice, pVortex, m - 2.0);
        else pos = pVortex;

        vec3 mousePos = vec3(uMouse * 20.0, 0.0);
        float d = distance(pos, mousePos);
        float influence = smoothstep(15.0, 0.0, d);
        pos += normalize(pos - mousePos) * influence * 5.0;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = (1.5 + aRandom.y * 2.0) * (30.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;

        float depthFade = smoothstep(60.0, 10.0, -mvPosition.z);
        vAlpha = depthFade * (0.2 + aRandom.z * 0.6);
        vColor = pos;
      }
    `;

    const fragmentShader = `
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center);
        if (dist > 0.5) discard;
        float glow = 1.0 - smoothstep(0.0, 0.5, dist);
        glow = pow(glow, 1.5);
        vec3 col = mix(uColor1, uColor2, smoothstep(-20.0, 20.0, vColor.x + vColor.y));
        gl_FragColor = vec4(col, vAlpha * glow);
      }
    `;

    // Geometry
    const geometry = new THREE.BufferGeometry();
    const indices = new Float32Array(pCount);
    const randoms = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      indices[i] = i;
      randoms[i * 3] = Math.random();
      randoms[i * 3 + 1] = Math.random();
      randoms[i * 3 + 2] = Math.random();
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pCount * 3).fill(0), 3));
    geometry.setAttribute('aIndex', new THREE.BufferAttribute(indices, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));

    const palettes = [
      { c1: new THREE.Color('#818cf8'), c2: new THREE.Color('#2dd4bf') },
      { c1: new THREE.Color('#f472b6'), c2: new THREE.Color('#60a5fa') },
      { c1: new THREE.Color('#fb923c'), c2: new THREE.Color('#e11d48') },
    ];

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMode: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor1: { value: palettes[0].c1.clone() },
        uColor2: { value: palettes[0].c2.clone() },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    sceneRef.current.material = material;
    sceneRef.current.palettes = palettes;

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const clock = new THREE.Clock();

    // Mouse
    const handleMouseMove = (e: MouseEvent) => {
      STATE.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      STATE.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation
    function animate() {
      sceneRef.current.animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      STATE.time += delta;

      if (Math.abs(STATE.mode - STATE.targetMode) > 0.001) {
        STATE.mode += (STATE.targetMode - STATE.mode) * 0.05;
      }
      material.uniforms.uMode.value = STATE.mode;
      material.uniforms.uTime.value = STATE.time;

      const currentMouse = material.uniforms.uMouse.value;
      currentMouse.x += (STATE.mouse.x - currentMouse.x) * 0.1;
      currentMouse.y += (STATE.mouse.y - currentMouse.y) * 0.1;

      const targetC1 = palettes[STATE.colorPalette].c1;
      const targetC2 = palettes[STATE.colorPalette].c2;
      material.uniforms.uColor1.value.lerp(targetC1, 0.05);
      material.uniforms.uColor2.value.lerp(targetC2, 0.05);

      const zTarget = (isMobile ? 40 : 28) + Math.sin(STATE.time * 0.5) * 2;
      camera.position.z += (zTarget - camera.position.z) * 0.02;
      camera.position.x = Math.sin(STATE.time * 0.2) * 2;
      camera.position.y = Math.cos(STATE.time * 0.15) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    setIsLoading(false);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current.animationId) cancelAnimationFrame(sceneRef.current.animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  useEffect(() => {
    const cleanup = initScene();
    return () => { cleanup.then(fn => fn && fn()); };
  }, [initScene]);

  // Update mode
  useEffect(() => {
    if (sceneRef.current.state) sceneRef.current.state.targetMode = currentMode;
  }, [currentMode]);

  // Update color
  useEffect(() => {
    if (sceneRef.current.state) sceneRef.current.state.colorPalette = colorPalette;
  }, [colorPalette]);

  return (
    <div className="h-screen bg-[#030305] overflow-hidden relative">
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-40 mix-blend-overlay" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.06))', backgroundSize: '100% 4px' }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-30" style={{ background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.8) 120%)' }} />

      {/* Three.js Canvas - FULL SCREEN */}
      <div ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Loading */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#030305] flex flex-col items-center justify-center">
          <div className="relative w-12 h-12 mb-6">
            <div className="absolute inset-0 rounded-full border border-white animate-ping" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" />
            </div>
          </div>
          <div className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase">Initializing</div>
        </div>
      )}

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-4 md:p-6 z-20 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="relative w-2 h-2">
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
              <div className="absolute inset-0 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </div>
            <h1 className="text-xs md:text-sm font-medium tracking-tight uppercase text-white/90">Symponhy<span className="opacity-40">.AI</span></h1>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-white/40 tracking-wider">
            <span className="text-white/70">{modeNames[currentMode]}</span>
            <span className="w-px h-2 bg-white/10" />
            <span className="opacity-60">{(particleCount / 1000).toFixed(0)}K NODES</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pointer-events-none">
        <div className="h-[300px]" /> {/* Spacer for sphere */}

        <p className="text-white/50 text-center max-w-md mb-10 text-[15px] leading-relaxed pointer-events-auto">
          Para personalizar sua experiencia, preciso conhecer melhor seu negocio.
          <br /><span className="text-white/30">Escolha o tipo de briefing.</span>
        </p>

        <div className="flex gap-4 w-full max-w-xl pointer-events-auto">
          <button onClick={() => router.push('/onboarding/essential')} className="flex-1 rounded-2xl p-5 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-left backdrop-blur-xl" style={{ background: 'rgba(10,10,12,0.75)' }}>
            <span className="text-[13px] text-white/40 mb-1 block">Completo</span>
            <h3 className="text-lg font-semibold text-white/90 mb-2">Briefing Essencial</h3>
            <p className="text-[13px] text-white/50">Formulario completo para personalizar sua experiencia</p>
            <div className="mt-4 pt-3 border-t border-white/5">
              <span className="text-xs text-white/30 font-mono">15-20 min · 70+ perguntas</span>
            </div>
          </button>

          <button onClick={() => router.push('/onboarding/complete')} className="flex-1 relative rounded-2xl p-5 border border-emerald-500/30 hover:border-emerald-500/50 transition-all text-left" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(10,10,12,0.9) 100%)' }}>
            <span className="absolute -top-2 left-5 px-2 py-0.5 text-[10px] font-medium text-emerald-400 rounded-full border border-emerald-500/30 bg-[#030305]">Recomendado</span>
            <span className="text-[13px] text-white/40 mb-1 block">Completo</span>
            <h3 className="text-lg font-semibold text-white mb-2">Briefing Completo</h3>
            <p className="text-[13px] text-white/50">Contexto detalhado para resultados impecaveis</p>
            <div className="mt-4 pt-3 border-t border-white/10">
              <span className="text-xs text-white/40 font-mono">15 min · 20 perguntas</span>
            </div>
          </button>
        </div>

        <button onClick={() => router.push('/dashboard')} className="mt-8 text-[13px] text-white/30 hover:text-white/60 transition-colors font-mono tracking-wider pointer-events-auto">
          CONFIGURAR DEPOIS
        </button>
      </main>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 w-full z-20 p-4 md:p-6 flex justify-between items-end pointer-events-none">
        <div className="p-3 rounded-xl pointer-events-auto w-64 backdrop-blur-xl border border-white/5" style={{ background: 'rgba(10,10,12,0.75)' }}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Cpu className="w-3 h-3 text-white/40" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/50">Visualization</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {['Nebula', 'Torus', 'Lattice', 'Vortex'].map((name, idx) => (
              <button key={name} onClick={() => setCurrentMode(idx)} className={`flex items-center justify-between px-2.5 py-2 rounded-lg transition-all border text-left ${currentMode === idx ? 'bg-white/10 border-white/10' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
                <span className={`text-[10px] font-medium ${currentMode === idx ? 'text-white' : 'text-white/60'}`}>{name}</span>
                <span className="text-[9px] font-mono text-white/20">0{idx + 1}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 pointer-events-auto">
          <div className="p-1.5 rounded-full flex flex-col gap-2" style={{ background: 'rgba(10,10,12,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[0, 1, 2].map(idx => (
              <button key={idx} onClick={() => setColorPalette(idx)} className={`w-6 h-6 rounded-full ring-1 ring-white/10 hover:scale-110 transition-transform ${colorPalette === idx ? 'ring-2 ring-white/30' : ''} ${idx === 0 ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : idx === 1 ? 'bg-gradient-to-br from-pink-400 to-blue-500' : 'bg-gradient-to-br from-orange-400 to-rose-600'}`} />
            ))}
          </div>
          <div className="text-[9px] font-mono text-right text-white/20">
            <p>INTERACTION ENGINE V2.0</p>
            <p>SYMPONHY.AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
