import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ArcaneHUDParticlesProps {
  isActive: boolean;
  anchorRect?: DOMRect | null;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotSpeed: number;
  shape: 'star' | 'circle' | 'sparkle' | 'rune';
}

export const ArcaneHUDParticles: React.FC<ArcaneHUDParticlesProps> = ({
  isActive,
  anchorRect
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // 1. Trigger dual-stage Canvas Confetti anchored around the GameHUD
    const originX = anchorRect
      ? (anchorRect.left + anchorRect.width * 0.75) / window.innerWidth
      : 0.5;
    const originY = anchorRect
      ? (anchorRect.top + anchorRect.height * 0.5) / window.innerHeight
      : 0.15;

    // First burst: Explosive starburst
    confetti({
      particleCount: 55,
      spread: 100,
      startVelocity: 35,
      ticks: 200,
      origin: { x: originX, y: originY },
      colors: ['#fbbf24', '#f59e0b', '#c084fc', '#e879f9', '#38bdf8', '#6ee7b7', '#f43f5e'],
      shapes: ['star', 'circle'],
      scalar: 1.2,
      zIndex: 9999
    });

    // Secondary burst: Cascading golden stardust shower
    const timer = setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 70,
        startVelocity: 30,
        origin: { x: Math.max(0.1, originX - 0.2), y: originY },
        colors: ['#fbbf24', '#fef08a', '#c084fc'],
        shapes: ['star'],
        scalar: 1.0,
        zIndex: 9999
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 70,
        startVelocity: 30,
        origin: { x: Math.min(0.9, originX + 0.2), y: originY },
        colors: ['#38bdf8', '#fbbf24', '#e879f9'],
        shapes: ['star'],
        scalar: 1.0,
        zIndex: 9999
      });
    }, 180);

    // 2. Interactive Arcane Particles on Local Canvas Overlay
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const colors = [
      '#fef08a', // starlight gold
      '#fbbf24', // radiant amber
      '#c084fc', // mystic violet
      '#e879f9', // astral fuchsia
      '#38bdf8', // celestial blue
      '#6ee7b7'  // gaia emerald
    ];

    const particles: Particle[] = [];
    const particleCount = 75;

    // Origin around right side where Objectives card sits
    const startX = width * 0.78;
    const startY = height * 0.55;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.8;
      const speed = Math.random() * 7 + 2.5;

      const shapes: Particle['shape'][] = ['star', 'circle', 'sparkle', 'rune'];
      particles.push({
        x: startX + (Math.random() - 0.5) * 40,
        y: startY + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 2,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.016 + 0.012,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      });
    }

    let shockwaveRadius = 5;
    let shockwaveAlpha = 1;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Expanding Shockwave Ring
      if (shockwaveAlpha > 0.01) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(startX, startY, shockwaveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 191, 36, ${shockwaveAlpha})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 15;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(startX, startY, shockwaveRadius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(192, 132, 252, ${shockwaveAlpha * 0.8})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();

        shockwaveRadius += 4.5;
        shockwaveAlpha *= 0.94;
      }

      // Draw and update each arcane particle
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // light gravity drift
        p.vx *= 0.96; // air resistance
        p.alpha -= p.decay;
        p.rotation += p.rotSpeed;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        if (p.shape === 'star') {
          drawStar(ctx, 0, 0, 4, p.size * 1.3, p.size * 0.5);
        } else if (p.shape === 'sparkle') {
          drawCrossSpark(ctx, 0, 0, p.size * 1.4);
        } else if (p.shape === 'rune') {
          ctx.font = `${Math.round(p.size * 1.6)}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✦', 0, 0);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (particles.length > 0 || shockwaveAlpha > 0.01) {
        animFrameRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      clearTimeout(timer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isActive, anchorRect]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-hidden"
    />
  );
};

// Helper: 4-pointed or 5-pointed star
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

// Helper: 4-point cross spark
function drawCrossSpark(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(cx - radius, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - radius);
  ctx.quadraticCurveTo(cx, cy, cx + radius, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + radius);
  ctx.quadraticCurveTo(cx, cy, cx - radius, cy);
  ctx.closePath();
  ctx.fill();
}
