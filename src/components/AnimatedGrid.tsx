"use client";

import { useEffect, useRef } from 'react';

export default function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    const spacing = 40;
    const lineWidth = 1;

    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Configuração das linhas
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      
      // Linhas horizontais
      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Linhas verticais
      for (let x = 0; x < canvas.width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Pontos de interseção com glitch
      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          if (Math.random() > 0.99) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(x - 1, y - 1, 3, 3);
          } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
          }
        }
      }
      
      // Efeito de glitch aleatório
      if (Math.random() > 0.95) {
        const glitchX = Math.random() * canvas.width;
        const glitchY = Math.random() * canvas.height;
        const glitchWidth = Math.random() * 100 + 50;
        const glitchHeight = Math.random() * 5 + 2;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(glitchX, glitchY, glitchWidth, glitchHeight);
      }
      
      time += 0.01;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
} 