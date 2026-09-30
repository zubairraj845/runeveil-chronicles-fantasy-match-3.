import React, { useState } from 'react';
import { PlayerProfile, LevelConfig, getVictoryStreakMultiplier } from '../types/game';
import { CAMPAIGN_LEVELS } from '../data/levels';
import { Lock, Play, Star, Sparkles, Swords, Zap, Flame, User } from 'lucide-react';

interface WorldMapProps {
  profile: PlayerProfile;
  onSelectLevel: (level: LevelConfig) => void;
  onStartEndless: () => void;
  onStartDuel: () => void;
  onOpenLeaderboard: () => void;
  onOpenDaily: () => void;
  onOpenSeasonal: () => void;
  onOpenProfile: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  profile,
  onSelectLevel,
  onStartEndless,
  onStartDuel,
  onOpenLeaderboard,
  onOpenDaily,
  onOpenSeasonal,
  onOpenProfile
}) => {
  const [selectedRealmId, setSelectedRealmId] = useState<number>(1);
  const currentStreak = profile.victoryStreak || 0;
  const streakMultiplier = getVictoryStreakMultiplier(currentStreak);

  const realms = [
    { id: 1, name: 'Whispering Wilds', icon: '🌿', desc: 'Ancient forests alive with primordial earth runes', bg: 'from-emerald-950/60 to-slate-900' },
    { id: 2, name: 'Crystal Caverns', icon: '💎', desc: 'Glacial grottos of luminous sapphire and rime', bg: 'from-cyan-950/60 to-slate-900' },
    { id: 3, name: 'Dragonspire Caldera', icon: '🔥', desc: 'Volcanic peaks guarding sacred dragon eggs', bg: 'from-red-950/60 to-slate-900' },
    { id: 4, name: 'The Astral Citadel', icon: '🌌', desc: 'Cosmic throne hovering amidst starlight nebulae', bg: 'from-purple-950/60 to-slate-900' }
  ];

  const realmLevels = CAMPAIGN_LEVELS.filter(lvl => lvl.realmId === selectedRealmId);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 px-4 py-6">
      {/* Player Profile & Victory Streak Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-3xl bg-gradient-to-r from-amber-950/60 via-purple-950/70 to-slate-900/90 border border-purple-800/60 shadow-xl backdrop-blur-md">
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex items-center gap-3 text-left hover:opacity-90 transition-opacity w-full sm:w-auto"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center text-2xl">
            <span className="drop-shadow-sm">{profile.avatar}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-100 font-cinzel tracking-wide">
                {profile.name}
              </h2>
              <span className="text-[10px] text-purple-200 font-bold px-2 py-0.5 rounded-full bg-purple-900/70 border border-purple-500/50 uppercase font-cinzel">
                Stage {profile.unlockedLevel}
              </span>
            </div>
            <p className="text-xs text-purple-300/80 font-cinzel mt-0.5">
              {profile.title}
            </p>
          </div>
        </button>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-purple-900/40">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/80 border border-amber-500/60 shadow-md">
            <span className="text-xl animate-pulse">🔥</span>
            <div>
              <span className="text-[9px] uppercase font-black text-amber-400 font-cinzel block leading-none tracking-wider">
                Victory Streak
              </span>
              <span className="text-xs font-bold text-slate-100 font-cinzel">
                {currentStreak} {currentStreak === 1 ? 'Win' : 'Wins'}{' '}
                <span className="text-amber-300 font-black">({streakMultiplier.toFixed(2)}× ✨)</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenProfile}
            className="px-3.5 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-600/60 text-xs font-bold text-purple-200 font-cinzel transition-all shadow-sm hover:scale-102"
          >
            Profile
          </button>
        </div>
      </div>
      {/* Realm Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-purple-900/50 shadow-2xl bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 font-cinzel tracking-wider">
              <span>🏰</span>
              <span>Realm Map · Campaign Adventure</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-100 font-cinzel mt-1 tracking-wide">
              The Chronicles of Runeveil
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Restore the shattered elemental seals across 4 mystical realms. Master line cleavers, elemental bombs, and cosmic singularity orbs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onStartEndless}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-105 font-cinzel"
            >
              <Zap className="w-4 h-4" />
              <span>Endless Rush</span>
            </button>
            <button
              type="button"
              onClick={onStartDuel}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 font-cinzel"
            >
              <Swords className="w-4 h-4" />
              <span>Spell Duel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Realm Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {realms.map(realm => {
          const isSelected = selectedRealmId === realm.id;
          const isUnlocked = profile.unlockedLevel >= (realm.id - 1) * 3 + 1;

          return (
            <button
              key={realm.id}
              type="button"
              onClick={() => setSelectedRealmId(realm.id)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-purple-900/40 border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.3)] ring-1 ring-amber-400/50'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-purple-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{realm.icon}</span>
                {!isUnlocked && <Lock className="w-3.5 h-3.5 text-slate-500" />}
              </div>
              <h3 className="text-sm font-bold text-slate-200 mt-2 font-cinzel truncate">
                {realm.name}
              </h3>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Lv. {(realm.id - 1) * 3 + 1} - {realm.id * 3}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Realm Levels Grid */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-purple-400 font-cinzel font-semibold">
              Realm {selectedRealmId}
            </span>
            <h2 className="text-xl font-bold text-slate-100 font-cinzel">
              {realms[selectedRealmId - 1].name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {realms[selectedRealmId - 1].desc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {realmLevels.map(level => {
            const isUnlocked = profile.unlockedLevel >= level.id;
            const stars = profile.levelStars[level.id] || 0;
            const highScore = profile.highScores[level.id] || 0;

            return (
              <div
                key={level.id}
                className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 ${
                  isUnlocked
                    ? 'bg-slate-950/80 border-purple-900/60 hover:border-amber-400/70 hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800 font-cinzel">
                      Stage {level.id}
                    </span>

                    {/* Star display */}
                    <div className="flex items-center gap-0.5 text-xs">
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            stars >= s
                              ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_4px_#f59e0b]'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 mt-2 font-cinzel">
                    {level.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {level.subtitle}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Moves: <b className="text-slate-200">{level.moves}</b></span>
                    <span>·</span>
                    <span>Best: <b className="text-amber-300 tabular-nums">{highScore ? highScore.toLocaleString() : '-'}</b></span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => onSelectLevel(level)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-md font-cinzel"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{stars > 0 ? 'Replay Stage' : 'Cast Runes'}</span>
                    </button>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Complete Stage {level.id - 1}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
