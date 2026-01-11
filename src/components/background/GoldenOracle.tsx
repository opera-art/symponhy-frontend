'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const GoldenOracle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    particles?: THREE.Points;
    uniforms?: any;
    animationId?: number;
  }>({});

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current.scene = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 14); // Closer camera = bigger sphere
    sceneRef.current.camera = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    sceneRef.current.renderer = renderer;

    // Vertex Shader (exact from ESFERA.HTML)
    const vertexShader = `
      uniform float uTime;
      uniform float uDistortion;
      uniform float uSize;
      uniform vec2 uMouse;

      varying float vAlpha;
      varying vec3 vPos;
      varying float vNoise;

      // Simplex Noise (Standard implementation)
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 = v - i + dot(i, C.xxx) ;
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );
          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
          i = mod289(i);
          vec4 p = permute( permute( permute(
                      i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
          float n_ = 1.0/7.0;
          vec3  ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
      }

      void main() {
          vec3 pos = position;

          // Smoother, more organic noise (Liquid/Ink feel)
          float noiseFreq = 0.5;
          float noiseAmp = uDistortion;
          float noise = snoise(vec3(pos.x * noiseFreq + uTime * 0.1, pos.y * noiseFreq, pos.z * noiseFreq));

          vNoise = noise;

          // Deform the sphere along normal based on noise
          vec3 newPos = pos + (normalize(pos) * noise * noiseAmp);

          // Interaction
          float dist = distance(uMouse * 10.0, newPos.xy);
          float interaction = smoothstep(5.0, 0.0, dist);
          newPos += normalize(pos) * interaction * 0.5;

          vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Size variation based on depth and noise
          gl_PointSize = uSize * (24.0 / -mvPosition.z) * (1.0 + noise * 0.5);

          vAlpha = 1.0;
          vPos = newPos;
      }
    `;

    // Fragment Shader (exact from ESFERA.HTML)
    const fragmentShader = `
      uniform vec3 uColor;
      uniform float uOpacity;

      varying float vNoise;
      varying vec3 vPos;

      void main() {
          // Soft circle particle
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;

          // Soft edges for "ink blot" effect
          float alpha = smoothstep(0.5, 0.2, dist) * uOpacity;

          // Color variation based on noise (creates depth)
          vec3 darkColor = uColor * 0.5;
          vec3 lightColor = uColor * 1.8; // Highlights

          vec3 finalColor = mix(darkColor, lightColor, vNoise * 0.5 + 0.5);

          gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    // Geometry - Dense IcosahedronGeometry for organic particle effect
    const geometry = new THREE.IcosahedronGeometry(4.5, 30);

    // Uniforms
    const uniforms = {
      uTime: { value: 0 },
      uDistortion: { value: 0.6 },
      uSize: { value: 2.5 },
      uColor: { value: new THREE.Color('#3A86FF') }, // Cosmic blue
      uOpacity: { value: 0.8 },
      uMouse: { value: new THREE.Vector2(0, 0) }
    };
    sceneRef.current.uniforms = uniforms;

    // Material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    // Create particle system
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    sceneRef.current.particles = particles;

    // Create smaller multiplying spheres
    const smallSpheres: Array<{
      mesh: THREE.Points;
      velocity: THREE.Vector3;
      life: number;
      maxLife: number;
    }> = [];

    function createSmallSphere() {
      const smallGeometry = new THREE.IcosahedronGeometry(1.2, 20);
      const smallUniforms = {
        uTime: { value: 0 },
        uDistortion: { value: 0.4 },
        uSize: { value: 1.8 },
        uColor: { value: new THREE.Color('#3A86FF') },
        uOpacity: { value: 0.6 },
        uMouse: { value: new THREE.Vector2(0, 0) }
      };

      const smallMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: smallUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending
      });

      const smallSphere = new THREE.Points(smallGeometry, smallMaterial);

      // Random direction
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const velocity = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * 0.02,
        Math.sin(phi) * Math.sin(theta) * 0.02,
        Math.cos(phi) * 0.02
      );

      scene.add(smallSphere);

      smallSpheres.push({
        mesh: smallSphere,
        velocity,
        life: 0,
        maxLife: 300 // frames
      });
    }

    // Create initial small spheres
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createSmallSphere(), i * 2000);
    }

    // Spawn new spheres periodically
    const spawnInterval = setInterval(() => {
      if (smallSpheres.length < 5) {
        createSmallSphere();
      }
    }, 3000);

    // Animation variables
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      uniforms.uMouse.value.x += (mouseX - uniforms.uMouse.value.x) * 0.05;
      uniforms.uMouse.value.y += (mouseY - uniforms.uMouse.value.y) * 0.05;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    function animate() {
      sceneRef.current.animationId = requestAnimationFrame(animate);

      time += 0.01;

      // Rotate particle system slowly
      if (particles) {
        particles.rotation.y = time * 0.05;
        particles.rotation.z = Math.sin(time * 0.1) * 0.05;
      }

      // Update small spheres
      for (let i = smallSpheres.length - 1; i >= 0; i--) {
        const sphere = smallSpheres[i];
        sphere.life++;

        // Move sphere
        sphere.mesh.position.add(sphere.velocity);

        // Rotate
        sphere.mesh.rotation.y = time * 0.08;
        sphere.mesh.rotation.x = time * 0.05;

        // Update uniforms
        const mat = sphere.mesh.material as THREE.ShaderMaterial;
        mat.uniforms.uTime.value = time;

        // Fade out and scale down near end of life
        const lifeRatio = sphere.life / sphere.maxLife;
        mat.uniforms.uOpacity.value = 0.6 * (1 - lifeRatio);
        sphere.mesh.scale.setScalar(1 - lifeRatio * 0.5);

        // Remove dead spheres
        if (sphere.life >= sphere.maxLife) {
          scene.remove(sphere.mesh);
          sphere.mesh.geometry.dispose();
          mat.dispose();
          smallSpheres.splice(i, 1);
        }
      }

      // Smooth camera sway based on mouse
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      uniforms.uTime.value = time;
      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      clearInterval(spawnInterval);

      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }

      // Clean up small spheres
      smallSpheres.forEach(sphere => {
        scene.remove(sphere.mesh);
        sphere.mesh.geometry.dispose();
        (sphere.mesh.material as THREE.Material).dispose();
      });

      if (sceneRef.current.renderer) {
        sceneRef.current.renderer.dispose();
        container.removeChild(sceneRef.current.renderer.domElement);
      }

      if (sceneRef.current.particles) {
        sceneRef.current.particles.geometry.dispose();
        (sceneRef.current.particles.material as THREE.Material).dispose();
      }
    };
  }, []);

  return (
    <div className={`absolute inset-0 bg-white flex items-center justify-center overflow-hidden ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
