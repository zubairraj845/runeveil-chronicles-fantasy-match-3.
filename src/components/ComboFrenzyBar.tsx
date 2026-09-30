import React, { useState, useEffect } from 'react';

interface ComboFrenzyBarProps {
  consecutiveMatches: number;
  comboMultiplier: number;
  lastMatchTimestamp: number;
  comboWindowMs: number;
  onExpire: () => void;
}

export const ComboFrenzyBar: React.FC<ComboFrenzyBarProps> = ({
  consecutiveMatches,
  comboMultiplier,
  lastMatchTimestamp,
  comboWindowMs,
  onExpire
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (consecutiveMatches <= 0 || lastMatchTimestamp <= 0) {
      setTimeRemaining(0);
      return;
    }

    const initialRemaining = Math.max(0, comboWindowMs - (Date.now() - lastMatchTimestamp));
    setTimeRemaining(initialRemaining);

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastMatchTimestamp;
      const remaining = Math.max(0, comboWindowMs - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 60);

    return () => clearInterval(interval);
  }, [consecutiveMatches, lastMatchTimestamp, comboWindowMs, onExpire]);

  return (
    <div className="w-full max-w-md mb-2 px-1">
      <div
        className={`flex items-center justify-between px-3 py-1.5 rounded-xl border transition-all duration-300 ${
          comboMultiplier > 1.0
            ? comboMultiplier >= 3.0
              ? 'bg-gradient-to-r from-purple-950/90 via-amber-950/80 to-purple-950/90 border-amber-400/90 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
              : comboMultiplier >= 2.0
              ? 'bg-purple-950/80 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
              : 'bg-slate-900/80 border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
            : 'bg-slate-950/60 border-slate-800/80'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-black px-2 py-0.5 rounded-lg font-cinzel transition-transform ${
              comboMultiplier > 1.0
                ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-sm scale-105'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {comboMultiplier > 1.0 ? `${comboMultiplier.toFixed(1)}× COMBO` : '1.0× BASE'}
          </span>

          <span className="text-[11px] font-semibold text-slate-300 font-cinzel truncate">
            {comboMultiplier >= 4.0
              ? '🔥 Godlike Overdrive!'
              : comboMultiplier >= 3.0
              ? '⚡ Celestial Storm!'
              : comboMultiplier >= 2.5
              ? '🔮 Mana Surge!'
              : comboMultiplier >= 2.0
              ? '✨ Arcane Flow!'
              : comboMultiplier >= 1.5
              ? '🌟 Speed Combo!'
              : 'Match consecutive runes to ignite multiplier!'}
          </span>
        </div>

        {consecutiveMatches > 1 && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 font-cinzel shrink-0">
            <span>{consecutiveMatches}x Streak</span>
          </div>
        )}
      </div>

      {/* Combo Timer Countdown Bar */}
      {timeRemaining > 0 && (
        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-1">
          <div
            className={`h-full transition-all duration-75 rounded-full ${
              comboMultiplier >= 3.0
                ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500'
                : comboMultiplier >= 2.0
                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                : 'bg-gradient-to-r from-cyan-400 to-blue-500'
            }`}
            style={{
              width: `${Math.min(100, Math.max(0, (timeRemaining / comboWindowMs) * 100))}%`
            }}
          />
        </div>
      )}
    </div>
  );
};
