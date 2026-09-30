import React from 'react';
import { PlayerProfile, getVictoryStreakMultiplier } from '../types/game';
import { Trophy, Gift, Sparkles, ShoppingBag, Map, Volume2, VolumeX, Music, Flame, User } from 'lucide-react';

interface NavbarProps {
  profile: PlayerProfile;
  currentView: 'WORLD_MAP' | 'PLAYING_LEVEL' | 'ENDLESS_RUSH' | 'SPELL_DUEL';
  soundEnabled: boolean;
  musicEnabled: boolean;
  canClaimDaily: boolean;
  onNavigateMap: () => void;
  onOpenLeaderboard: () => void;
  onOpenDaily: () => void;
  onOpenSeasonal: () => void;
  onOpenStore: () => void;
  onOpenProfile: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  currentView,
  soundEnabled,
  musicEnabled,
  canClaimDaily,
  onNavigateMap,
  onOpenLeaderboard,
  onOpenDaily,
  onOpenSeasonal,
  onOpenStore,
  onOpenProfile,
  onToggleSound,
  onToggleMusic
}) => {
  const currentStreak = profile.victoryStreak || 0;
  const streakMultiplier = getVictoryStreakMultiplier(currentStreak);
  return (
    <header className="w-full border-b border-purple-900/40 bg-slate-950/85 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 py-3.5">
        {/* Zone 1: Brand Title (Single text element wordmark) */}
        <button
          type="button"
          onClick={onNavigateMap}
          className="text-lg md:text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-300 to-indigo-200 font-cinzel hover:opacity-90 transition-opacity"
        >
          Runeveil Chronicles
        </button>

        {/* Zone 2: 4-5 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300 font-cinzel">
          <button
            type="button"
            onClick={onNavigateMap}
            className={`transition-colors hover:text-amber-300 ${
              currentView === 'WORLD_MAP' ? 'text-amber-400 border-b border-amber-400 pb-0.5' : ''
            }`}
          >
            Realm Map
          </button>
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="transition-colors hover:text-amber-300 flex items-center gap-1.5"
          >
            <span>Global Leaderboards</span>
          </button>
          <button
            type="button"
            onClick={onOpenDaily}
            className="transition-colors hover:text-amber-300 relative flex items-center gap-1.5"
          >
            <span>Daily Gift</span>
            {canClaimDaily && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>
          <button
            type="button"
            onClick={onOpenSeasonal}
            className="transition-colors hover:text-purple-300 flex items-center gap-1.5 text-purple-300"
          >
            <span>Astral Event</span>
          </button>
          <button
            type="button"
            onClick={onOpenStore}
            className="transition-colors hover:text-amber-300"
          >
            Alchemy Bazaar
          </button>
        </nav>

        {/* Zone 3: Primary Action & Currencies */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Profile & Victory Streak Button */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-900/70 hover:border-amber-400/60 transition-all text-xs group"
            title="View Archmage Profile & Victory Streak"
          >
            <span className="text-base group-hover:scale-110 transition-transform">{profile.avatar}</span>
            {currentStreak > 0 ? (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/60 text-amber-300 font-bold font-cinzel text-[11px] shadow-sm">
                <span className="text-xs animate-pulse">🔥</span>
                <span>{currentStreak}</span>
                <span className="text-[10px] text-amber-200 hidden sm:inline">({streakMultiplier.toFixed(2)}× ✨)</span>
              </div>
            ) : (
              <span className="hidden sm:inline text-[11px] font-semibold text-slate-300 font-cinzel">
                Profile
              </span>
            )}
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold tabular-nums">
            <span className="text-amber-300 flex items-center gap-1" title="Gold Coins">
              <span>🪙</span> {profile.gold.toLocaleString()}
            </span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-purple-300 flex items-center gap-1" title="Astral Stardust">
              <span>✨</span> {profile.stardust.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Sound FX On' : 'Sound FX Muted'}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-purple-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>
            <button
              type="button"
              onClick={onToggleMusic}
              title={musicEnabled ? 'Music On' : 'Music Off'}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              <Music className={`w-3.5 h-3.5 ${musicEnabled ? 'text-amber-400' : 'text-slate-500'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden items-center justify-around border-t border-purple-950/60 py-2 px-2 text-[11px] font-semibold text-slate-300 font-cinzel">
        <button
          type="button"
          onClick={onNavigateMap}
          className="flex flex-col items-center gap-0.5 hover:text-amber-300"
        >
          <Map className="w-3.5 h-3.5" />
          <span>Map</span>
        </button>
        <button
          type="button"
          onClick={onOpenLeaderboard}
          className="flex flex-col items-center gap-0.5 hover:text-amber-300"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Ranks</span>
        </button>
        <button
          type="button"
          onClick={onOpenDaily}
          className="flex flex-col items-center gap-0.5 hover:text-amber-300 relative"
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Daily</span>
          {canClaimDaily && (
            <span className="absolute top-0 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
          )}
        </button>
        <button
          type="button"
          onClick={onOpenSeasonal}
          className="flex flex-col items-center gap-0.5 text-purple-300 hover:text-purple-200"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Event</span>
        </button>
        <button
          type="button"
          onClick={onOpenStore}
          className="flex flex-col items-center gap-0.5 hover:text-amber-300"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Bazaar</span>
        </button>
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex flex-col items-center gap-0.5 hover:text-amber-300 relative"
        >
          <span className="text-xs">{profile.avatar}</span>
          <span>Profile</span>
          {currentStreak > 0 && (
            <span className="absolute -top-1 right-1 px-1 rounded-full bg-amber-500 text-[8px] font-black text-slate-950">
              {currentStreak}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
