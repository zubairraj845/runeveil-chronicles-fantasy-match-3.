import React from 'react';
import { LevelConfig, getVictoryStreakMultiplier } from '../types/game';
import { Star, Trophy, ArrowRight, RotateCcw, Map, Flame } from 'lucide-react';

interface GameOverModalProps {
  isVictory: boolean;
  stars: number;
  score: number;
  level: LevelConfig;
  victoryStreak?: number;
  onNextLevel?: () => void;
  onRestart: () => void;
  onBackToMap: () => void;
  onOpenLeaderboard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isVictory,
  stars,
  score,
  level,
  victoryStreak = 0,
  onNextLevel,
  onRestart,
  onBackToMap,
  onOpenLeaderboard
}) => {
  const goldEarned = isVictory ? 150 + stars * 50 : 25;
  const baseStardust = isVictory ? 25 + stars * 15 : 5;
  const stardustMultiplier = isVictory ? getVictoryStreakMultiplier(victoryStreak) : 1.0;
  const stardustEarned = isVictory ? Math.round(baseStardust * stardustMultiplier) : 5;
  const hasBonus = isVictory && stardustMultiplier > 1.0;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-purple-900/80 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
        {/* Title Icon */}
        <div className="my-2">
          {isVictory ? (
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(251,191,36,0.5)] animate-bounce">
              🏆
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border-2 border-red-400 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(239,68,68,0.5)]">
              🥀
            </div>
          )}
        </div>

        {/* Victory/Defeat Heading */}
        <h2 className="text-2xl font-black font-cinzel text-slate-100 mt-2">
          {isVictory ? 'Arcane Seal Restored!' : 'Out of Mana Moves'}
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          {isVictory
            ? `You triumphed over ${level.name} and conquered the realm trial!`
            : 'The mystical weave unravelled before all objectives were fulfilled.'}
        </p>

        {/* Star Rating Display */}
        {isVictory && (
          <div className="flex items-center justify-center gap-2 my-4">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  stars >= s
                    ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_12px_#f59e0b]'
                    : 'text-slate-700 opacity-40'
                }`}
              >
                <Star className="w-8 h-8 fill-current" />
              </div>
            ))}
          </div>
        )}

        {/* Rewards Box */}
        <div className="w-full bg-slate-950/80 rounded-2xl border border-slate-800 p-4 my-3 flex items-center justify-around text-xs">
          <div>
            <span className="text-slate-400 block font-cinzel">Score Achieved</span>
            <span className="text-base font-extrabold text-amber-400 tabular-nums font-cinzel">
              {score.toLocaleString()}
            </span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="text-slate-400 block font-cinzel">Gold Coins</span>
            <span className="text-base font-extrabold text-yellow-300 tabular-nums font-cinzel">
              🪙 +{goldEarned}
            </span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="text-slate-400 block font-cinzel">Astral Dust</span>
            <span className="text-base font-extrabold text-purple-300 tabular-nums font-cinzel">
              ✨ +{stardustEarned}
            </span>
            {hasBonus && (
              <span className="text-[10px] text-amber-300 font-bold block">
                ({stardustMultiplier.toFixed(2)}× streak bonus)
              </span>
            )}
          </div>
        </div>

        {/* Victory Streak & Multiplier Status */}
        {isVictory ? (
          <div className="w-full mb-3 p-3 rounded-2xl bg-gradient-to-r from-amber-950/70 via-purple-950/70 to-slate-900 border border-amber-500/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-left">
              <span className="text-xl animate-pulse">🔥</span>
              <div>
                <span className="font-extrabold text-amber-300 font-cinzel block">
                  Victory Streak: {victoryStreak} {victoryStreak === 1 ? 'Stage' : 'Stages'}
                </span>
                <span className="text-[11px] text-purple-200">
                  {hasBonus
                    ? `+${Math.round((stardustMultiplier - 1) * 100)}% Bonus Stardust Multiplier active!`
                    : 'Clear consecutive stages to grow your multiplier!'}
                </span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/60 font-cinzel font-black text-amber-300 text-sm">
              {stardustMultiplier.toFixed(2)}×
            </div>
          </div>
        ) : (
          <div className="w-full mb-3 p-2.5 rounded-xl bg-red-950/50 border border-red-800/40 text-xs text-red-300 flex items-center justify-center gap-2">
            <span>🥀</span>
            <span>Victory streak reset. Conquer the trial again to rebuild your multiplier!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 mt-2">
          {isVictory && onNextLevel && (
            <button
              type="button"
              onClick={onNextLevel}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs font-cinzel shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2"
            >
              <span>Next Realm Stage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onRestart}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Stage</span>
            </button>

            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Leaderboard</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onBackToMap}
            className="py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1 mt-1"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Return to Realm Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
