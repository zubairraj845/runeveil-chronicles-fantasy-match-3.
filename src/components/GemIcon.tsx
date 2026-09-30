import React from 'react';
import { GemColor, SpecialType } from '../types/game';

interface GemIconProps {
  color: GemColor;
  special?: SpecialType;
  isSelected?: boolean;
  isMatched?: boolean;
  isSwapping?: boolean;
  size?: number;
}

export const GemIcon = React.memo<GemIconProps>(({
  color,
  special = 'none',
  isSelected = false,
  isMatched = false,
  isSwapping = false,
  size = 54
}) => {
  // If it's a relic
  if (special === 'relic') {
    return (
      <div
        className={`relative flex items-center justify-center rounded-xl bg-amber-950/60 border-2 border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-transform duration-150 ${
          isMatched
            ? 'animate-match-spin'
            : isSwapping
            ? 'animate-arcane-swap ring-2 ring-purple-300'
            : isSelected
            ? 'scale-110 ring-2 ring-amber-300'
            : ''
        }`}
        style={{ width: size, height: size }}
      >
        <span className="text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-float-gentle">🪶</span>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-amber-500/20 to-transparent pointer-events-none" />
      </div>
    );
  }

  // If it's a cosmic singularity orb
  if (special === 'singularity') {
    return (
      <div
        className={`relative flex items-center justify-center rounded-full transition-transform duration-200 ${
          isMatched
            ? 'animate-match-spin'
            : isSwapping
            ? 'animate-arcane-swap ring-4 ring-purple-300 shadow-[0_0_25px_rgba(216,180,254,0.9)]'
            : isSelected
            ? 'scale-115 ring-4 ring-purple-300 shadow-[0_0_25px_rgba(216,180,254,0.9)]'
            : 'shadow-[0_0_16px_rgba(168,85,247,0.7)]'
        }`}
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-700 via-purple-500 to-pink-400 animate-spin flex items-center justify-center p-1" style={{ animationDuration: '4s' }}>
          <div className="w-full h-full rounded-full bg-slate-950/80 flex items-center justify-center border border-white/40">
            <span className="text-xl">✨</span>
          </div>
        </div>
        <div className="absolute inset-0 rounded-full border border-purple-300/60 pointer-events-none animate-pulse-glow" />
      </div>
    );
  }

  // Gem color palettes
  const colorConfigs: Record<
    GemColor,
    {
      gradient: string;
      border: string;
      glow: string;
      symbol: string;
      textColor: string;
    }
  > = {
    ruby: {
      gradient: 'from-red-600 via-rose-500 to-amber-500',
      border: 'border-red-400/60',
      glow: 'shadow-[0_0_12px_rgba(239,68,68,0.5)]',
      symbol: '🔥',
      textColor: 'text-red-200'
    },
    sapphire: {
      gradient: 'from-blue-700 via-cyan-600 to-sky-400',
      border: 'border-cyan-300/60',
      glow: 'shadow-[0_0_12px_rgba(6,182,212,0.5)]',
      symbol: '💧',
      textColor: 'text-cyan-200'
    },
    emerald: {
      gradient: 'from-emerald-700 via-green-600 to-lime-400',
      border: 'border-emerald-300/60',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]',
      symbol: '🌿',
      textColor: 'text-emerald-200'
    },
    topaz: {
      gradient: 'from-amber-600 via-yellow-500 to-orange-400',
      border: 'border-yellow-200/70',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
      symbol: '⚡',
      textColor: 'text-yellow-100'
    },
    amethyst: {
      gradient: 'from-purple-800 via-violet-600 to-fuchsia-400',
      border: 'border-purple-300/60',
      glow: 'shadow-[0_0_12px_rgba(168,85,247,0.5)]',
      symbol: '🔮',
      textColor: 'text-purple-200'
    },
    diamond: {
      gradient: 'from-slate-300 via-indigo-200 to-white',
      border: 'border-white/80',
      glow: 'shadow-[0_0_14px_rgba(255,255,255,0.7)]',
      symbol: '💎',
      textColor: 'text-indigo-950'
    }
  };

  const config = colorConfigs[color] || colorConfigs.ruby;

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br ${config.gradient} border ${
        config.border
      } ${config.glow} transition-all duration-150 select-none ${
        isMatched
          ? 'animate-match-spin'
          : isSwapping
          ? 'animate-arcane-swap ring-4 ring-purple-300 shadow-[0_0_24px_rgba(168,85,247,0.85)]'
          : isSelected
          ? 'scale-110 ring-4 ring-white/80 shadow-[0_0_20px_rgba(255,255,255,0.8)]'
          : 'hover:scale-105'
      }`}
      style={{ width: size, height: size }}
    >
      {/* Gloss reflection highlight */}
      <div className="absolute top-1 left-2 right-2 h-2.5 rounded-full bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />

      {/* Center Rune Symbol */}
      <span className="text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{config.symbol}</span>

      {/* Special Power-Up Badges */}
      {special === 'beam_h' && (
        <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
          <div className="w-full h-1.5 bg-white/90 rounded-full shadow-[0_0_8px_white]" />
          <span className="absolute left-1 text-[10px] text-white font-black">◀</span>
          <span className="absolute right-1 text-[10px] text-white font-black">▶</span>
        </div>
      )}

      {special === 'beam_v' && (
        <div className="absolute inset-0 flex flex-col items-center justify-between py-1 pointer-events-none">
          <div className="h-full w-1.5 bg-white/90 rounded-full shadow-[0_0_8px_white]" />
          <span className="absolute top-1 text-[10px] text-white font-black">▲</span>
          <span className="absolute bottom-1 text-[10px] text-white font-black">▼</span>
        </div>
      )}

      {special === 'bomb' && (
        <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-amber-300 animate-spin flex items-center justify-center pointer-events-none" style={{ animationDuration: '6s' }}>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_10px_#f59e0b]" />
        </div>
      )}
    </div>
  );
});

GemIcon.displayName = 'GemIcon';
