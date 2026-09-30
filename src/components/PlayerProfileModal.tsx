import React from 'react';
import { PlayerProfile, getVictoryStreakMultiplier } from '../types/game';
import { Flame, Star, Trophy, Sparkles, Coins, Zap, Shield, X, Award } from 'lucide-react';

interface PlayerProfileModalProps {
  profile: PlayerProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  profile,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const currentStreak = profile.victoryStreak || 0;
  const highestStreak = profile.highestVictoryStreak || currentStreak;
  const currentMultiplier = getVictoryStreakMultiplier(currentStreak);

  // Total stars collected
  const totalStars = Object.values(profile.levelStars || {}).reduce((acc, s) => acc + s, 0);

  const streakMilestones = [
    { streak: 1, mult: '1.00×', label: 'Initiate', desc: 'Base Stardust' },
    { streak: 2, mult: '1.15×', label: 'Adept', desc: '+15% Stardust' },
    { streak: 3, mult: '1.30×', label: 'Sorcerer', desc: '+30% Stardust' },
    { streak: 4, mult: '1.45×', label: 'Warmage', desc: '+45% Stardust' },
    { streak: 5, mult: '1.60×', label: 'Archmage', desc: '+60% Stardust' },
    { streak: 10, mult: '2.50×', label: 'Celestial', desc: 'Max +150% Stardust' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-purple-800/80 rounded-3xl p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 border-b border-purple-900/50 pb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg flex items-center justify-center text-3xl">
            <span className="drop-shadow-md">{profile.avatar}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-100 font-cinzel tracking-wide">
                {profile.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-900/70 border border-purple-500/60 text-[10px] font-bold text-purple-200 uppercase font-cinzel">
                Stage {profile.unlockedLevel}
              </span>
            </div>
            <p className="text-xs text-purple-300 font-medium font-cinzel mt-0.5">
              {profile.title}
            </p>
          </div>
        </div>

        {/* Victory Streak & Stardust Multiplier Spotlight Card */}
        <div className="my-5 rounded-2xl p-4 bg-gradient-to-br from-amber-950/80 via-purple-950/90 to-slate-950 border-2 border-amber-500/70 shadow-[0_0_25px_rgba(251,191,36,0.35)] relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-7xl opacity-15 select-none pointer-events-none">
            🔥
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/50 text-lg shadow-sm">
                🔥
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 font-cinzel block">
                  Active Arcane Streak
                </span>
                <span className="text-lg font-black text-slate-100 font-cinzel">
                  {currentStreak} Consecutive {currentStreak === 1 ? 'Victory' : 'Victories'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-purple-300 font-cinzel block">
                Stardust Boost
              </span>
              <span className="text-2xl font-black font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-md">
                {currentMultiplier.toFixed(2)}×
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            Every consecutive level conquered without defeat increases your{' '}
            <strong className="text-purple-300 font-semibold">Astral Stardust multiplier</strong> by{' '}
            <strong className="text-amber-300 font-semibold">+15%</strong> (up to 2.50×). A defeat resets the active streak.
          </p>

          <div className="mt-3 pt-3 border-t border-purple-900/60 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Highest All-Time Streak:</span>
            </span>
            <span className="font-extrabold text-amber-300 font-cinzel text-sm">
              👑 {highestStreak} {highestStreak === 1 ? 'Win' : 'Wins'}
            </span>
          </div>

          {/* Milestone Tier Progress */}
          <div className="mt-3 pt-3 border-t border-purple-900/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-cinzel block mb-2">
              Streak Multiplier Milestones:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              {streakMilestones.slice(0, 6).map(m => {
                const reached = currentStreak >= m.streak;
                return (
                  <div
                    key={m.streak}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] transition-all ${
                      reached
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="block font-black text-xs font-cinzel">{m.mult}</span>
                    <span className="text-[10px] opacity-80 block truncate">
                      {m.streak} {m.streak === 1 ? 'Win' : 'Wins'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Player Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-center">
            <span className="text-slate-400 text-[10px] uppercase font-cinzel block">Total Stars</span>
            <span className="text-lg font-black text-amber-400 font-cinzel flex items-center justify-center gap-1 mt-0.5">
              <Star className="w-4 h-4 fill-amber-400" />
              {totalStars}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-center">
            <span className="text-slate-400 text-[10px] uppercase font-cinzel block">Gold Coins</span>
            <span className="text-lg font-black text-yellow-300 font-cinzel flex items-center justify-center gap-1 mt-0.5">
              <span>🪙</span>
              {profile.gold.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-center">
            <span className="text-slate-400 text-[10px] uppercase font-cinzel block">Astral Dust</span>
            <span className="text-lg font-black text-purple-300 font-cinzel flex items-center justify-center gap-1 mt-0.5">
              <span>✨</span>
              {profile.stardust.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-center">
            <span className="text-slate-400 text-[10px] uppercase font-cinzel block">Endless Record</span>
            <span className="text-lg font-black text-cyan-300 font-cinzel flex items-center justify-center gap-1 mt-0.5">
              <Trophy className="w-4 h-4 text-cyan-400" />
              {profile.endlessHighScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Booster Inventory Stock */}
        <div className="mt-4 pt-4 border-t border-purple-900/40">
          <span className="text-xs font-bold text-slate-300 font-cinzel block mb-2">
            Archmage Spell Inventory:
          </span>
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            <div className="bg-slate-950/70 border border-slate-800 p-2 rounded-xl">
              <span className="text-base block">☄️</span>
              <span className="text-[10px] text-slate-400 block font-cinzel">Meteor</span>
              <span className="font-bold text-slate-200">{profile.inventory.meteor || 0}</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 p-2 rounded-xl">
              <span className="text-base block">⚡</span>
              <span className="text-[10px] text-slate-400 block font-cinzel">Bolt</span>
              <span className="font-bold text-slate-200">{profile.inventory.arcane_bolt || 0}</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 p-2 rounded-xl">
              <span className="text-base block">⏳</span>
              <span className="text-[10px] text-slate-400 block font-cinzel">Chrono</span>
              <span className="font-bold text-slate-200">{profile.inventory.chrono || 0}</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 p-2 rounded-xl">
              <span className="text-base block">🪄</span>
              <span className="text-[10px] text-slate-400 block font-cinzel">Wand</span>
              <span className="font-bold text-slate-200">{profile.inventory.wand || 0}</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 p-2 rounded-xl">
              <span className="text-base block">🌀</span>
              <span className="text-[10px] text-slate-400 block font-cinzel">Shuffle</span>
              <span className="font-bold text-slate-200">{profile.inventory.shuffle || 0}</span>
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider font-cinzel transition-colors shadow-lg"
        >
          Return to Chronicles
        </button>
      </div>
    </div>
  );
};
