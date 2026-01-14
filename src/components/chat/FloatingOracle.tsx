'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FloatingOracleProps {
  size?: number;
  className?: string;
  color?: string;
  showOrbits?: boolean;
  intensity?: number; // 0-1, controls sphere energy/power
  isListening?: boolean; // true when user is typing
}

export const FloatingOracle: React.FC<FloatingOracleProps> = ({
  size = 64,
  className = '',
  color = '#D4AF37',
  showOrbits = true,
  intensity = 0.5,
  isListening = false,
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
    atomGroup?: THREE.Group;
    mousePos?: THREE.Vector2;
    worldMousePos?: THREE.Vector3;
    isHovering?: boolean;
    electrons?: THREE.Mesh[];
    interactionStrength?: number;
    intensity?: number;
    isListening?: boolean;
    listeningStrength?: number;
  }>({});

  // Update intensity ref when prop changes
  useEffect(() => {
    sceneRef.current.intensity = intensity;
  }, [intensity]);

  // Update isListening ref when prop changes
  useEffect(() => {
    sceneRef.current.isListening = isListening;
  }, [isListening]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    sceneRef.current.intensity = intensity;

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

    // Systems Group (for main sphere)
    const systemsGroup = new THREE.Group();
    scene.add(systemsGroup);
    sceneRef.current.systemsGroup = systemsGroup;

    // Atom Group (for orbit lines and electrons)
    const atomGroup = new THREE.Group();
    scene.add(atomGroup);
    sceneRef.current.atomGroup = atomGroup;

    sceneRef.current.mousePos = new THREE.Vector2(0, 0);
    sceneRef.current.worldMousePos = new THREE.Vector3(0, 0, 0);
    sceneRef.current.isHovering = false;
    sceneRef.current.interactionStrength = 0;

    // Vertex Shader - Gold luxury feel with enhanced interaction and intensity
    const vertexShader = `
      uniform float uTime;
      uniform float uDistortion;
      uniform float uSize;
      uniform vec2 uMouse;
      uniform float uInteraction;
      uniform float uIntensity;

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

        // Intensity affects distortion and animation speed - SUBTLE values
        float intensityBoost = 0.3 + uIntensity * 0.4;
        float noiseFreq = 0.4;
        float noiseAmp = (uDistortion * 0.5 + uInteraction * 0.15) * intensityBoost;
        float timeSpeed = 0.08 + uIntensity * 0.05;

        float noise = snoise(vec3(pos.x * noiseFreq + uTime * timeSpeed, pos.y * noiseFreq, pos.z * noiseFreq));
        vNoise = noise;
        vec3 newPos = pos + (normalize(pos) * noise * noiseAmp);

        // Pulsing effect - very subtle
        float pulseStrength = 0.015 + uIntensity * 0.02;
        float pulse = 1.0 + sin(uTime * (1.5 + uIntensity * 0.5)) * pulseStrength * (1.0 + uInteraction * 0.3);
        newPos *= pulse;

        // Mouse interaction - stronger effect
        float dist = distance(uMouse * 10.0, newPos.xy);
        float interaction = smoothstep(6.0, 0.0, dist);
        newPos += normalize(pos) * interaction * (0.8 + uInteraction * 0.5 + uIntensity * 0.5);

        vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Particle size increases with intensity
        float sizeBoost = 1.0 + uIntensity * 0.5;
        gl_PointSize = uSize * sizeBoost * (24.0 / -mvPosition.z) * (1.0 + noise * 0.5 + uInteraction * 0.2);
        vAlpha = 1.0;
        vPos = newPos;
      }
    `;

    // Fragment Shader - Luxurious gold effect with glow and intensity
    const fragmentShader = `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uInteraction;
      uniform float uIntensity;

      varying float vNoise;
      varying vec3 vPos;

      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        if (dist > 0.5) discard;

        float alpha = smoothstep(0.5, 0.15, dist) * uOpacity;

        // Gold gradient with shimmer - more vibrant with intensity
        vec3 darkGold = uColor * (0.4 + uIntensity * 0.2);
        vec3 brightGold = uColor * (1.6 + uIntensity * 0.4);
        vec3 shimmer = vec3(1.0, 0.95, 0.8) * (0.3 + uIntensity * 0.2);

        vec3 finalColor = mix(darkGold, brightGold, vNoise * 0.5 + 0.5);
        finalColor += shimmer * pow(vNoise * 0.5 + 0.5, 2.0);

        // Extra glow on interaction and intensity
        finalColor += vec3(0.2, 0.15, 0.05) * (uInteraction + uIntensity * 0.5);

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
      uInteraction: { value: 0 },
      uIntensity: { value: intensity },
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

    // Sound Wave Rings - expanding circles
    const soundWaves: THREE.Line[] = [];
    const maxWaves = 4;
    const waveColor = new THREE.Color(color);

    for (let i = 0; i < maxWaves; i++) {
      const ringGeometry = new THREE.BufferGeometry();
      const ringPoints = 64;
      const positions = new Float32Array(ringPoints * 3);

      for (let j = 0; j < ringPoints; j++) {
        const angle = (j / ringPoints) * Math.PI * 2;
        positions[j * 3] = Math.cos(angle);
        positions[j * 3 + 1] = Math.sin(angle);
        positions[j * 3 + 2] = 0;
      }

      ringGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const ringMaterial = new THREE.LineBasicMaterial({
        color: waveColor,
        transparent: true,
        opacity: 0,
      });

      const ring = new THREE.LineLoop(ringGeometry, ringMaterial);
      ring.scale.set(5, 5, 5);
      (ring as any).wavePhase = i * (1 / maxWaves); // Stagger the waves
      (ring as any).waveSpeed = 0.008;
      scene.add(ring);
      soundWaves.push(ring);
    }

    // Create atom orbits with electrons
    const electrons: THREE.Mesh[] = [];
    sceneRef.current.electrons = electrons;

    if (showOrbits) {
      // Orbit configurations
      const orbitConfigs = [
        { rx: 6.5, ry: 6.5, rotX: Math.PI / 2, rotY: 0, rotZ: 0, speed: 0.8, electrons: 2 },
        { rx: 7.0, ry: 5.5, rotX: Math.PI / 3, rotY: Math.PI / 6, rotZ: 0.2, speed: 1.2, electrons: 1 },
        { rx: 5.8, ry: 7.2, rotX: Math.PI / 1.5, rotY: Math.PI / 4, rotZ: -0.3, speed: 1.0, electrons: 2 },
        { rx: 6.2, ry: 6.8, rotX: Math.PI / 2.5, rotY: -Math.PI / 5, rotZ: 0.4, speed: 0.9, electrons: 1 },
      ];

      orbitConfigs.forEach((config, orbitIndex) => {
        const curve = new THREE.EllipseCurve(0, 0, config.rx, config.ry, 0, 2 * Math.PI, false, 0);
        const points = curve.getPoints(128);
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(
          points.map(p => new THREE.Vector3(p.x, p.y, 0))
        );

        const orbitMat = new THREE.LineBasicMaterial({
          color: 0xD4AF37,
          transparent: true,
          opacity: 0.15,
        });
        const orbit = new THREE.Line(orbitGeo, orbitMat);
        orbit.rotation.x = config.rotX;
        orbit.rotation.y = config.rotY;
        orbit.rotation.z = config.rotZ;
        atomGroup.add(orbit);

        for (let i = 0; i < config.electrons; i++) {
          const electronGeo = new THREE.SphereGeometry(0.25, 16, 16);
          const electronMat = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.9,
          });
          const electron = new THREE.Mesh(electronGeo, electronMat);

          (electron as any).orbitConfig = config;
          (electron as any).orbitIndex = orbitIndex;
          (electron as any).electronIndex = i;
          (electron as any).phase = (i / config.electrons) * Math.PI * 2;

          atomGroup.add(electron);
          electrons.push(electron);

          const glowGeo = new THREE.SphereGeometry(0.4, 16, 16);
          const glowMat = new THREE.MeshBasicMaterial({
            color: 0xD4AF37,
            transparent: true,
            opacity: 0.3,
          });
          const glow = new THREE.Mesh(glowGeo, glowMat);
          electron.add(glow);
        }
      });
    }


    // Animation variables
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let targetInteraction = 0;

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (sceneRef.current.mousePos) {
        sceneRef.current.mousePos.set(targetMouseX * 8, targetMouseY * 8);
      }
      if (sceneRef.current.worldMousePos) {
        sceneRef.current.worldMousePos.set(targetMouseX * 8, targetMouseY * 8, 0);
      }
    };

    const handleMouseEnter = () => {
      sceneRef.current.isHovering = true;
      targetInteraction = 1;
    };

    const handleMouseLeave = () => {
      sceneRef.current.isHovering = false;
      targetInteraction = 0;
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

      const currentIntensity = sceneRef.current.intensity || 0.5;
      const listening = sceneRef.current.isListening || false;

      // Smooth transition for listening state
      const targetListeningStrength = listening ? 1 : 0;
      const currentListeningStrength = sceneRef.current.listeningStrength || 0;
      sceneRef.current.listeningStrength = currentListeningStrength + (targetListeningStrength - currentListeningStrength) * 0.15;
      const listeningBoost = sceneRef.current.listeningStrength;

      time += 0.008 * (1 + currentIntensity * 0.2 + listeningBoost * 0.3); // Speed up slightly when listening

      // Update intensity uniform with listening boost
      uniforms.uIntensity.value = currentIntensity + listeningBoost * 0.2;

      // Smooth interaction transition
      const currentInteraction = sceneRef.current.interactionStrength || 0;
      sceneRef.current.interactionStrength = currentInteraction + (targetInteraction - currentInteraction) * 0.1;
      uniforms.uInteraction.value = sceneRef.current.interactionStrength;

      // Smooth mouse following
      uniforms.uMouse.value.x += (targetMouseX - uniforms.uMouse.value.x) * 0.08;
      uniforms.uMouse.value.y += (targetMouseY - uniforms.uMouse.value.y) * 0.08;

      // Rotate main sphere system - gentle rotation
      if (systemsGroup) {
        systemsGroup.rotation.y = time * (0.03 + currentIntensity * 0.01);
        systemsGroup.rotation.z = Math.sin(time * 0.05) * (0.02 + currentIntensity * 0.01);
      }

      // Animate atom orbits and electrons
      if (atomGroup && showOrbits) {
        atomGroup.rotation.y = time * (0.02 + currentIntensity * 0.02);
        atomGroup.rotation.x = Math.sin(time * 0.03) * (0.1 + currentIntensity * 0.05);

        const interactionBoost = 1 + (sceneRef.current.interactionStrength || 0) * 0.5 + currentIntensity * 0.5;

        electrons.forEach((electron) => {
          const config = (electron as any).orbitConfig;
          const phase = (electron as any).phase;
          const baseAngle = time * config.speed * interactionBoost + phase;

          const x = Math.cos(baseAngle) * config.rx;
          const y = Math.sin(baseAngle) * config.ry;

          const pos = new THREE.Vector3(x, y, 0);
          pos.applyEuler(new THREE.Euler(config.rotX, config.rotY, config.rotZ));

          electron.position.copy(pos);

          const scale = 1 + Math.sin(time * 5 + phase) * 0.1 * (sceneRef.current.interactionStrength || 0) + currentIntensity * 0.2;
          electron.scale.setScalar(scale);
        });
      }

      // Animate sound waves - expanding rings
      soundWaves.forEach((ring) => {
        const wavePhase = (ring as any).wavePhase;
        const waveSpeed = (ring as any).waveSpeed * (1 + currentIntensity * 0.5);

        // Update phase
        (ring as any).wavePhase = (wavePhase + waveSpeed) % 1;
        const phase = (ring as any).wavePhase;

        // Scale from 5 to 12 based on phase
        const minScale = 5;
        const maxScale = 10 + currentIntensity * 4;
        const scale = minScale + phase * (maxScale - minScale);
        ring.scale.set(scale, scale, scale);

        // Opacity: fade in then out
        const opacity = phase < 0.3
          ? phase / 0.3 * 0.4
          : (1 - phase) / 0.7 * 0.4;
        (ring.material as THREE.LineBasicMaterial).opacity = opacity * (0.5 + currentIntensity * 0.5);

        // Gentle rotation
        ring.rotation.z += 0.002;
      });

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

      // Cleanup sound waves
      soundWaves.forEach(ring => {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });

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

      if (sceneRef.current.atomGroup) {
        sceneRef.current.atomGroup.children.forEach((child) => {
          if (child instanceof THREE.Line) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
          if (child instanceof THREE.Mesh) {
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
