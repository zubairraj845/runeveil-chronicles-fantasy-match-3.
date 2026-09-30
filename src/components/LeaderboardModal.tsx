import React, { useState } from 'react';
import { PlayerProfile, LeaderboardEntry } from '../types/game';
import { getLeaderboard, updatePlayerProfile } from '../utils/storage';
import { X, Trophy, Globe, Flame, Edit2, Check, Award } from 'lucide-react';

interface LeaderboardModalProps {
  profile: PlayerProfile;
  onClose: () => void;
  onProfileUpdated: (profile: PlayerProfile) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  profile,
  onClose,
  onProfileUpdated
}) => {
  const [activeMode, setActiveMode] = useState<'campaign' | 'endless' | 'duel'>('campaign');
  const [activePeriod, setActivePeriod] = useState<'all' | 'weekly' | 'daily'>('all');
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(profile.name);
  const [editTitle, setEditTitle] = useState<string>(profile.title);
  const [editAvatar, setEditAvatar] = useState<string>(profile.avatar);

  const entries = getLeaderboard(activeMode);
  const playerRank = entries.findIndex(e => e.isPlayer) + 1;
  const playerEntry = entries.find(e => e.isPlayer);

  const avatarOptions = ['🧙‍♂️', '🧙‍♀️', '🐉', '🔮', '✨', '🦅', '⚔️', '🌙', '🔥', '❄️'];
  const titleOptions = [
    'Novice of the Astral Circle',
    'Grand Celestial Archmage',
    'Void Sovereign',
    'Dragon Flame Invoker',
    'Tempest Oracle',
    'Verdant Enchanter',
    'Astral Wanderer',
    'Eclipse Harbinger'
  ];

  const handleSaveProfile = () => {
    const updated = updatePlayerProfile({
      name: editName.trim() || 'Archmage Apprentice',
      title: editTitle,
      avatar: editAvatar
    });
    onProfileUpdated(updated);
    setIsEditingProfile(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-purple-900/80 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-800 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-100 font-cinzel">
                Global Multiplayer Leaderboards
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Top Sorcerers Worldwide</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveMode('campaign')}
            className={`py-2 text-xs font-bold rounded-lg transition-all font-cinzel ${
              activeMode === 'campaign'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Campaign High Scores
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('endless')}
            className={`py-2 text-xs font-bold rounded-lg transition-all font-cinzel ${
              activeMode === 'endless'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Endless Arcane Rush
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('duel')}
            className={`py-2 text-xs font-bold rounded-lg transition-all font-cinzel ${
              activeMode === 'duel'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Spell Duel Arena
          </button>
        </div>

        {/* Player Profile Banner / Editable Badge */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-950 border border-purple-800/50 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-2xl bg-slate-900 border border-slate-700 shadow-inner">
              {profile.avatar}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100 font-cinzel">
                  {profile.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900 text-purple-200 border border-purple-700 font-medium">
                  {playerEntry ? playerEntry.tier : 'Adept'}
                </span>
              </div>
              <span className="text-xs text-purple-300 block">{profile.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-cinzel block">Your Rank</span>
              <span className="text-base font-extrabold text-amber-400 tabular-nums">
                {playerRank > 0 ? `#${playerRank}` : 'Unranked'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Title</span>
            </button>
          </div>
        </div>

        {/* Profile Editor Dropdown */}
        {isEditingProfile && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-purple-800/80 flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Sorcerer Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  maxLength={24}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Sorcerer Title</label>
                <select
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  {titleOptions.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Avatar Sigil</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {avatarOptions.map(av => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setEditAvatar(av)}
                    className={`p-2 rounded-xl border text-xl transition-transform ${
                      editAvatar === av ? 'border-amber-400 bg-purple-900/60 scale-110' : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-1">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-cinzel"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Presence</span>
              </button>
            </div>
          </div>
        )}

        {/* Global Rankings List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
          {entries.map((entry, index) => {
            const isTop3 = index < 3;
            const rankBadge =
              index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  entry.isPlayer
                    ? 'bg-purple-950/70 border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.3)] ring-1 ring-amber-400/50'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 text-center text-sm font-bold tabular-nums font-cinzel ${
                    isTop3 ? 'text-amber-400 text-base' : 'text-slate-500'
                  }`}>
                    {rankBadge}
                  </span>

                  <span className="text-2xl">{entry.avatar}</span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold font-cinzel ${entry.isPlayer ? 'text-amber-300' : 'text-slate-200'}`}>
                        {entry.name}
                      </span>
                      {entry.isPlayer && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{entry.title}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[11px] text-slate-500">{entry.levelInfo}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-amber-400 tabular-nums font-cinzel block">
                    {entry.score.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500">{entry.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
