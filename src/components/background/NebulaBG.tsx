'use client';

import React, { useEffect, useRef } from 'react';

export const NebulaBG: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;
    let centerX = width / 2;
    let centerY = height / 2;
    let particles: Particle[] = [];
    let time = 0;

    const PARTICLE_COUNT = 3500;
    let mouse = { x: centerX, y: centerY };

    // Resize handling
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
      mouse.x = centerX;
      mouse.y = centerY;
    };

    window.addEventListener('resize', resize);
    resize();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const targetX = e.clientX;
      const targetY = e.clientY;
      mouse.x += (targetX - mouse.x) * 0.1;
      mouse.y += (targetY - mouse.y) * 0.1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Helper: Random Range
    const random = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      decay: number;
      sizeBase: number;
      size: number;
      hueOffset: number;

      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (initial ? 300 : 50);

        this.x = centerX + Math.cos(angle) * dist;
        this.y = centerY + Math.sin(angle) * dist;

        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;

        this.life = random(0.1, 1);
        this.decay = random(0.005, 0.02);

        this.sizeBase = random(1, 4);
        this.size = this.sizeBase;

        this.hueOffset = random(-15, 15);
      }

      update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        const force = 100 / (dist + 1);

        this.vx += Math.sin(angle) * force * 0.05;
        this.vy -= Math.cos(angle) * force * 0.05;

        this.vx += Math.cos(angle) * 0.02;
        this.vy += Math.sin(angle) * 0.02;

        this.vx += Math.sin(this.y * 0.05 + time) * 0.02;
        this.vy += Math.cos(this.x * 0.05 + time) * 0.02;

        this.vx *= 0.96;
        this.vy *= 0.96;

        this.x += this.vx;
        this.y += this.vy;

        this.life -= this.decay;
        this.size = this.sizeBase * this.life;

        if (this.life <= 0 || dist > Math.max(width, height)) {
          this.reset();
          this.x = mouse.x + (Math.random() - 0.5) * 20;
          this.y = mouse.y + (Math.random() - 0.5) * 20;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        let h, s, l, a;

        if (this.life > 0.8) {
          h = 40 + this.hueOffset;
          s = 100;
          l = 80 + this.life * 20;
          a = this.life;
        } else if (this.life > 0.4) {
          h = 30 + this.hueOffset - (1 - this.life) * 40;
          s = 100;
          l = 50 + this.life * 20;
          a = this.life * 0.8;
        } else {
          h = 340 + this.life * 100;
          s = 80;
          l = 30 * this.life;
          a = this.life * 0.5;
        }

        ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    const init = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    };

    // Animation loop
    const animate = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(2, 2, 4, 0.2)';
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';

      time += 0.05;

      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        300
      );
      gradient.addColorStop(0, 'rgba(255, 200, 50, 0.15)');
      gradient.addColorStop(0.4, 'rgba(200, 50, 0, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundColor: '#020204',
        display: 'block',
      }}
    />
  );
};
