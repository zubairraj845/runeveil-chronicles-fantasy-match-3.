import React from 'react';
import { Sparkles, Flame, Zap } from 'lucide-react';

interface ComboFloatingBannerProps {
  multiplier: number;
  chainStep: number;
  triggerKey: number;
}

export const ComboFloatingBanner: React.FC<ComboFloatingBannerProps> = ({
  multiplier,
  chainStep,
  triggerKey
}) => {
  if (chainStep < 2 || multiplier < 1.0) return null;

  const isSuper = multiplier >= 3.0 || chainStep >= 4;
  const isHigh = multiplier >= 2.0 || chainStep >= 3;

  const tierTitle =
    multiplier >= 4.0 || chainStep >= 5
      ? 'GODLIKE OVERDRIVE!'
      : multiplier >= 3.0 || chainStep >= 4
      ? 'CELESTIAL SURGE!'
      : multiplier >= 2.0 || chainStep >= 3
      ? 'MANA CASCADE!'
      : 'ARCANE CHAIN!';

  const badgeTheme = isSuper
    ? 'from-amber-400 via-rose-500 to-purple-600 text-white border-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.8)]'
    : isHigh
    ? 'from-purple-600 via-fuchsia-600 to-indigo-600 text-white border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.7)]'
    : 'from-cyan-500 via-blue-600 to-purple-600 text-white border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]';

  return (
    <div
      key={triggerKey}
      className="absolute -top-7 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center animate-combo-scale-pop"
    >
      <div
        className={`px-4 py-1.5 rounded-2xl bg-gradient-to-r ${badgeTheme} border-2 backdrop-blur-md flex items-center gap-2.5 shadow-2xl`}
      >
        <span className="text-base animate-spin" style={{ animationDuration: '2s' }}>
          {isSuper ? '🔥' : isHigh ? '⚡' : '✨'}
        </span>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-[10px] font-black uppercase tracking-wider font-cinzel opacity-90">
              Chain Reaction ×{chainStep}
            </span>
            <span className="text-[10px] opacity-75 font-semibold">·</span>
            <span className="text-[10px] font-bold text-amber-200 uppercase font-cinzel">
              {tierTitle}
            </span>
          </div>

          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl md:text-2xl font-black tracking-tight font-cinzel drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-amber-300">
              {multiplier.toFixed(1)}×
            </span>
            <span className="text-xs md:text-sm font-extrabold uppercase font-cinzel tracking-wider text-slate-100">
              Multiplier!
            </span>
          </div>
        </div>

        <span className="text-base animate-pulse">
          {isSuper ? '👑' : isHigh ? '🔮' : '✦'}
        </span>
      </div>
    </div>
  );
};
