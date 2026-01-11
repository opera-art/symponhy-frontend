'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ContentInteractionOrbProps {
  state?: 'idle' | 'approved' | 'denied' | 'dissolving';
  className?: string;
}

// Random range helper
const random = (min: number, max: number) => Math.random() * (max - min) + min;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  sizeBase: number;
  life: number;
  decay: number;
  hueOffset: number;
  angle: number;
}

export const ContentInteractionOrb: React.FC<ContentInteractionOrbProps> = ({
  state = 'idle',
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const frameCountRef = useRef(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const stateRef = useRef(state);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 150, y: 150 }); // Mouse position for parallax

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for speed like art.html
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 300; // Modal context size
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const W = size;
    const H = size;
    const centerX = W / 2;
    const centerY = H / 2;

    // Initialize mouse to center
    mouseRef.current = { x: centerX, y: centerY };

    // Match art.html particle count (scaled for modal size)
    const isLowEnd = !(navigator as any).deviceMemory || (navigator as any).deviceMemory < 4;
    const PARTICLE_COUNT = isLowEnd ? 1500 : 3000;

    // Initialize particles (match art.html exactly)
    const initializeParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 300; // Start spread out (art.html: initial = 300)

        particlesRef.current.push({
          x: centerX + Math.cos(angle) * dist,
          y: centerY + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: random(1, 4),
          sizeBase: random(1, 4),
          life: random(0.1, 1),
          decay: random(0.005, 0.02),
          hueOffset: random(-15, 15),
          angle: Math.random() * Math.PI * 2,
        });
      }
    };

    initializeParticles();

    // Mouse tracking with parallax (art.html style)
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const targetX = e.clientX - rect.left;
      const targetY = e.clientY - rect.top;
      // Smooth lerp (art.html uses 0.1)
      mouseRef.current.x += (targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (targetY - mouseRef.current.y) * 0.1;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      frameCountRef.current++;
      const frameCount = frameCountRef.current;
      timeRef.current += 0.05;
      const time = timeRef.current;

      if (prefersReducedMotion) {
        // Fallback: static gradient
        ctx.clearRect(0, 0, W, H);
        const glowRadius = size * 0.5;
        const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
        grad.addColorStop(0, 'rgba(255, 200, 50, 0.2)');
        grad.addColorStop(0.5, 'rgba(200, 100, 0, 0.1)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Clear with trails - art.html uses rgba(2, 2, 4, 0.2) for deep void with trails
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(2, 2, 4, 0.2)';
      ctx.fillRect(0, 0, W, H);

      // Switch to additive blending for particle glow
      ctx.globalCompositeOperation = 'lighter';

      const stateInfluence = stateRef.current;

      // Draw core glow based on state (use mouse position like art.html)
      const glowRadius = 300; // Match art.html gradient radius
      const glowGradient = ctx.createRadialGradient(
        mouseRef.current.x,
        mouseRef.current.y,
        0,
        mouseRef.current.x,
        mouseRef.current.y,
        glowRadius
      );

      let glowColor1, glowColor2, glowColor3;

      if (stateInfluence === 'approved') {
        glowColor1 = 'rgba(100, 255, 150, 0.2)';
        glowColor2 = 'rgba(100, 200, 100, 0.08)';
        glowColor3 = 'rgba(0, 0, 0, 0)';
      } else if (stateInfluence === 'denied') {
        glowColor1 = 'rgba(255, 100, 100, 0.15)';
        glowColor2 = 'rgba(200, 50, 50, 0.05)';
        glowColor3 = 'rgba(0, 0, 0, 0)';
      } else {
        glowColor1 = 'rgba(255, 200, 50, 0.15)';
        glowColor2 = 'rgba(200, 100, 0, 0.05)';
        glowColor3 = 'rgba(0, 0, 0, 0)';
      }

      glowGradient.addColorStop(0, glowColor1);
      glowGradient.addColorStop(0.4, glowColor2);
      glowGradient.addColorStop(1, glowColor3);
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, W, H);

      // Update and draw particles (use mouse position like art.html)
      particlesRef.current = particlesRef.current.map((p) => {
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        // Vortex physics
        let force = 100 / (dist + 1);

        // State-specific force modulation
        if (stateInfluence === 'approved') {
          force *= 0.6; // Weaker vortex for stable state
        } else if (stateInfluence === 'denied') {
          force *= 1.2; // Stronger chaotic vortex
        } else if (stateInfluence === 'dissolving') {
          force *= 0.3; // Very weak for dissolution
        }

        // Tangential force (spin)
        p.vx += Math.sin(angle) * force * 0.05;
        p.vy -= Math.cos(angle) * force * 0.05;

        // Outward explosion force (pressure)
        p.vx += Math.cos(angle) * 0.02;
        p.vy += Math.sin(angle) * 0.02;

        // Turbulence (simulated noise)
        p.vx += Math.sin(p.y * 0.05 + time) * 0.02;
        p.vy += Math.cos(p.x * 0.05 + time) * 0.02;

        // Friction
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Update life
        let decayRate = p.decay;
        if (stateInfluence === 'dissolving') {
          decayRate *= 2; // Faster dissolution
        } else if (stateInfluence === 'approved') {
          decayRate *= 0.7; // Slower fade for stable state
        }
        p.life -= decayRate;

        // Shrink as it dies (art.html exact formula)
        p.size = p.sizeBase * p.life;

        // Reset if dead or off screen too far (art.html exact logic)
        if (p.life <= 0 || dist > Math.max(W, H)) {
          // art.html: tight core reset (50px) near mouse position
          const newAngle = Math.random() * Math.PI * 2;
          const newDist = Math.random() * 50; // Tight in core (art.html)
          return {
            ...p,
            x: mouseRef.current.x + (Math.random() - 0.5) * 20, // ±10px from mouse
            y: mouseRef.current.y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            life: random(0.1, 1),
            decay: random(0.005, 0.02),
            sizeBase: random(1, 4),
            hueOffset: random(-15, 15),
          };
        }

        return p;
      });

      // Draw particles with sophisticated color system
      particlesRef.current.forEach((p) => {
        let h, s, l, a;

        if (stateInfluence === 'approved') {
          // Greenshift for approval
          if (p.life > 0.8) {
            h = 120 + p.hueOffset;
            s = 100;
            l = 80 + p.life * 20;
            a = p.life;
          } else if (p.life > 0.4) {
            h = 120 + p.hueOffset - (1 - p.life) * 40;
            s = 100;
            l = 50 + p.life * 20;
            a = p.life * 0.8;
          } else {
            h = 120 + p.life * 100;
            s = 80;
            l = 30 * p.life;
            a = p.life * 0.5;
          }
        } else if (stateInfluence === 'denied') {
          // Redshift for denial
          if (p.life > 0.8) {
            h = 0 + p.hueOffset;
            s = 100;
            l = 80 + p.life * 20;
            a = p.life;
          } else if (p.life > 0.4) {
            h = 0 + p.hueOffset - (1 - p.life) * 40;
            s = 100;
            l = 50 + p.life * 20;
            a = p.life * 0.8;
          } else {
            h = 340 + p.life * 100;
            s = 80;
            l = 30 * p.life;
            a = p.life * 0.5;
          }
        } else {
          // Default nebula colors: White -> Gold -> Red -> Purple
          if (p.life > 0.8) {
            h = 40 + p.hueOffset;
            s = 100;
            l = 80 + p.life * 20;
            a = p.life;
          } else if (p.life > 0.4) {
            h = 30 + p.hueOffset - (1 - p.life) * 40;
            s = 100;
            l = 50 + p.life * 20;
            a = p.life * 0.8;
          } else {
            h = 340 + p.life * 100;
            s = 80;
            l = 30 * p.life;
            a = p.life * 0.5;
          }
        }

        ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        'bg-slate-950/90 backdrop-blur-sm rounded-full',
        className
      )}
      style={{
        aspectRatio: '1 / 1',
        boxShadow:
          '0 0 60px rgba(255, 192, 36, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.5)',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-full"
      />

      {/* Subtle connection line for chat binding */}
      {state !== 'dissolving' && (
        <div
          className="absolute right-0 top-1/2 w-16 h-px"
          style={{
            background: 'linear-gradient(90deg, rgba(255,192,36,0.15), transparent)',
            transform: 'translateX(100%)',
          }}
        />
      )}

      {/* State indicator overlays */}
      {state === 'approved' && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: 'inset 0 0 40px rgba(100, 255, 150, 0.15)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {state === 'denied' && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: 'inset 0 0 30px rgba(255, 100, 100, 0.1)',
          }}
        />
      )}
    </div>
  );
};
