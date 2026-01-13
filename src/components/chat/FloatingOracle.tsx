'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FloatingOracleProps {
  size?: number;
  className?: string;
  color?: string;
  showOrbits?: boolean;
}

export const FloatingOracle: React.FC<FloatingOracleProps> = ({
  size = 64,
  className = '',
  color = '#D4AF37',
  showOrbits = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    particles?: THREE.Points;
    uniforms?: any;
    animationId?: number;
    systemsGroup?: THREE.Group;
    lineGroup?: THREE.Group;
    musicNotes?: THREE.Group;
    mousePos?: THREE.Vector2;
    isHovering?: boolean;
  }>({});

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current.scene = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 18);
    sceneRef.current.camera = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    sceneRef.current.renderer = renderer;

    // Systems Group
    const systemsGroup = new THREE.Group();
    scene.add(systemsGroup);
    sceneRef.current.systemsGroup = systemsGroup;

    // Music Notes Group
    const musicNotes = new THREE.Group();
    scene.add(musicNotes);
    sceneRef.current.musicNotes = musicNotes;
    sceneRef.current.mousePos = new THREE.Vector2(0, 0);
    sceneRef.current.isHovering = false;

    // Vertex Shader - Gold luxury feel
    const vertexShader = `
      uniform float uTime;
      uniform float uDistortion;
      uniform float uSize;
      uniform vec2 uMouse;

      varying float vAlpha;
      varying vec3 vPos;
      varying float vNoise;

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
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
        i = mod289(i);
        vec4 p = permute(permute(permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 1.0/7.0;
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

      void main() {
        vec3 pos = position;
        float noiseFreq = 0.5;
        float noiseAmp = uDistortion;
        float noise = snoise(vec3(pos.x * noiseFreq + uTime * 0.1, pos.y * noiseFreq, pos.z * noiseFreq));
        vNoise = noise;
        vec3 newPos = pos + (normalize(pos) * noise * noiseAmp);

        // Mouse interaction - stronger effect
        float dist = distance(uMouse * 10.0, newPos.xy);
        float interaction = smoothstep(6.0, 0.0, dist);
        newPos += normalize(pos) * interaction * 0.8;

        vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = uSize * (24.0 / -mvPosition.z) * (1.0 + noise * 0.5);
        vAlpha = 1.0;
        vPos = newPos;
      }
    `;

    // Fragment Shader - Luxurious gold effect
    const fragmentShader = `
      uniform vec3 uColor;
      uniform float uOpacity;

      varying float vNoise;
      varying vec3 vPos;

      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        if (dist > 0.5) discard;

        float alpha = smoothstep(0.5, 0.15, dist) * uOpacity;

        // Gold gradient with shimmer
        vec3 darkGold = uColor * 0.4;
        vec3 brightGold = uColor * 1.6;
        vec3 shimmer = vec3(1.0, 0.95, 0.8) * 0.3;

        vec3 finalColor = mix(darkGold, brightGold, vNoise * 0.5 + 0.5);
        finalColor += shimmer * pow(vNoise * 0.5 + 0.5, 2.0);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    // Geometry
    const geometry = new THREE.IcosahedronGeometry(4.5, 30);

    // Uniforms
    const uniforms = {
      uTime: { value: 0 },
      uDistortion: { value: 0.6 },
      uSize: { value: 2.8 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0.9 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };
    sceneRef.current.uniforms = uniforms;

    // Material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const particles = new THREE.Points(geometry, material);
    systemsGroup.add(particles);
    sceneRef.current.particles = particles;

    // Orbit lines - Gold color
    const lineGroup = new THREE.Group();
    sceneRef.current.lineGroup = lineGroup;

    if (showOrbits) {
      systemsGroup.add(lineGroup);

      const createOrbit = (radius: number, rotationX: number, rotationY: number) => {
        const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
        const points = curve.getPoints(128);
        const geo = new THREE.BufferGeometry().setFromPoints(
          points.map(p => new THREE.Vector3(p.x, p.y, 0))
        );
        const mat = new THREE.LineBasicMaterial({
          color: 0xD4AF37,
          transparent: true,
          opacity: 0.2,
        });
        const orbit = new THREE.Line(geo, mat);
        orbit.rotation.x = rotationX;
        orbit.rotation.y = rotationY;
        lineGroup.add(orbit);
        return orbit;
      };

      createOrbit(5.5, Math.PI / 2, 0);
      createOrbit(5.2, Math.PI / 3, Math.PI / 6);
      createOrbit(6.0, Math.PI / 1.8, Math.PI / 4);
    }

    // Music Note class
    class MusicNote {
      mesh: THREE.Sprite;
      velocity: THREE.Vector3;
      life: number;
      maxLife: number;

      constructor(x: number, y: number) {
        // Create canvas for music note
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d')!;

        // Draw music note symbol
        ctx.font = '48px serif';
        ctx.fillStyle = '#D4AF37';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const notes = ['♪', '♫', '♩', '♬'];
        ctx.fillText(notes[Math.floor(Math.random() * notes.length)], 32, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 1,
        });

        this.mesh = new THREE.Sprite(spriteMaterial);
        this.mesh.position.set(x, y, 0);
        this.mesh.scale.set(1.2, 1.2, 1);

        // Random upward velocity with slight horizontal drift
        this.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.15,
          0.08 + Math.random() * 0.08,
          0
        );

        this.life = 0;
        this.maxLife = 60 + Math.random() * 40;
      }

      update() {
        this.life++;
        this.mesh.position.add(this.velocity);

        // Fade out
        const progress = this.life / this.maxLife;
        this.mesh.material.opacity = 1 - progress;

        // Slight wave motion
        this.mesh.position.x += Math.sin(this.life * 0.1) * 0.02;

        // Scale down slightly
        const scale = 1.2 * (1 - progress * 0.3);
        this.mesh.scale.set(scale, scale, 1);

        return this.life < this.maxLife;
      }

      dispose() {
        this.mesh.material.map?.dispose();
        this.mesh.material.dispose();
      }
    }

    const activeNotes: MusicNote[] = [];
    let noteSpawnTimer = 0;

    // Animation variables
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (sceneRef.current.mousePos) {
        sceneRef.current.mousePos.set(targetMouseX * 8, targetMouseY * 8);
      }
    };

    const handleMouseEnter = () => {
      sceneRef.current.isHovering = true;
    };

    const handleMouseLeave = () => {
      sceneRef.current.isHovering = false;
    };

    // Global mouse for camera sway
    const handleGlobalMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX = (e.clientX - centerX) / (window.innerWidth / 2);
      mouseY = -(e.clientY - centerY) / (window.innerHeight / 2);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousemove', handleGlobalMouse);

    // Animation loop
    function animate() {
      sceneRef.current.animationId = requestAnimationFrame(animate);
      time += 0.01;

      // Smooth mouse following
      uniforms.uMouse.value.x += (targetMouseX - uniforms.uMouse.value.x) * 0.08;
      uniforms.uMouse.value.y += (targetMouseY - uniforms.uMouse.value.y) * 0.08;

      // Rotate system
      if (systemsGroup) {
        systemsGroup.rotation.y = time * 0.05;
        systemsGroup.rotation.z = Math.sin(time * 0.1) * 0.05;
      }

      // Rotate orbits
      if (lineGroup && showOrbits) {
        lineGroup.rotation.x = Math.sin(time * 0.05) * 0.2;
        lineGroup.children.forEach((orbit, i) => {
          orbit.rotation.z += 0.002 * (i + 1);
        });
      }

      // Spawn music notes when hovering
      if (sceneRef.current.isHovering && sceneRef.current.mousePos) {
        noteSpawnTimer++;
        if (noteSpawnTimer > 8) {
          noteSpawnTimer = 0;
          const note = new MusicNote(
            sceneRef.current.mousePos.x + (Math.random() - 0.5) * 2,
            sceneRef.current.mousePos.y + (Math.random() - 0.5) * 2
          );
          activeNotes.push(note);
          musicNotes.add(note.mesh);
        }
      }

      // Update music notes
      for (let i = activeNotes.length - 1; i >= 0; i--) {
        const note = activeNotes[i];
        if (!note.update()) {
          musicNotes.remove(note.mesh);
          note.dispose();
          activeNotes.splice(i, 1);
        }
      }

      // Camera sway
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      uniforms.uTime.value = time;
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleGlobalMouse);

      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }

      // Cleanup notes
      activeNotes.forEach(note => note.dispose());

      if (sceneRef.current.renderer) {
        sceneRef.current.renderer.dispose();
        if (container.contains(sceneRef.current.renderer.domElement)) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }
      }

      if (sceneRef.current.particles) {
        sceneRef.current.particles.geometry.dispose();
        (sceneRef.current.particles.material as THREE.Material).dispose();
      }

      if (sceneRef.current.lineGroup) {
        sceneRef.current.lineGroup.children.forEach((child) => {
          if (child instanceof THREE.Line) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });
      }
    };
  }, [size, color, showOrbits]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: size, height: size, cursor: 'pointer' }}
    />
  );
};
