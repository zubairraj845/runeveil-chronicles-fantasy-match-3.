import React, { useState } from 'react';
import { PlayerProfile, SeasonTier, SeasonQuest } from '../types/game';
import { CURRENT_SEASON, SEASON_TIERS } from '../data/seasonal';
import { getSeasonQuests, getSeasonTiers, saveSeasonTiers, updatePlayerProfile } from '../utils/storage';
import { soundEngine } from '../utils/audio';
import { X, Sparkles, Check, Lock, Gift, Award, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SeasonalModalProps {
  profile: PlayerProfile;
  onClose: () => void;
  onProfileUpdated: (profile: PlayerProfile) => void;
}

export const SeasonalModal: React.FC<SeasonalModalProps> = ({
  profile,
  onClose,
  onProfileUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'tiers' | 'quests'>('tiers');
  const [tiers, setTiers] = useState<SeasonTier[]>(getSeasonTiers());
  const [quests, setQuests] = useState<SeasonQuest[]>(getSeasonQuests());

  const currentStardust = profile.stardust;

  const handleClaimTier = (tierIndex: number) => {
    const tier = tiers[tierIndex];
    if (tier.claimed || currentStardust < tier.stardustRequired) return;

    soundEngine.playVictory();
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

    // Grant reward to player
    let updatedProfile = { ...profile };
    if (tier.rewardType === 'gold' && tier.amount) {
      updatedProfile.gold += tier.amount;
    } else if (tier.rewardType === 'booster' && tier.booster) {
      updatedProfile.inventory[tier.booster] = (updatedProfile.inventory[tier.booster] || 0) + (tier.amount || 1);
    } else if (tier.rewardType === 'title') {
      updatedProfile.title = tier.rewardName.replace('Title: "', '').replace('"', '');
    } else if (tier.rewardType === 'avatar') {
      updatedProfile.avatar = '🐉';
      updatedProfile.title = 'Dragon Sovereign';
    }

    onProfileUpdated(updatedProfile);
    updatePlayerProfile(updatedProfile);

    // Update tier state
    const nextTiers = tiers.map((t, idx) =>
      idx === tierIndex ? { ...t, claimed: true, unlocked: true } : t
    );
    setTiers(nextTiers);
    saveSeasonTiers(nextTiers);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-purple-900/80 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-hidden">
        {/* Header with Seasonal Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-purple-800/60 shadow-lg">
          <img
            src={CURRENT_SEASON.bannerImage}
            alt={CURRENT_SEASON.title}
            referrerPolicy="no-referrer"
            className="w-full h-36 md:h-44 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-300 font-cinzel uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Seasonal Event · {CURRENT_SEASON.daysRemaining} Days Left
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-100 font-cinzel">
                  {CURRENT_SEASON.title}
                </h2>
                <p className="text-xs text-slate-300 line-clamp-1 max-w-lg">
                  {CURRENT_SEASON.description}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-cinzel block uppercase">Your Stardust</span>
                <span className="text-lg md:text-xl font-black text-purple-300 tabular-nums flex items-center gap-1 justify-end">
                  <span>✨</span> {currentStardust}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('tiers')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors font-cinzel ${
                activeTab === 'tiers'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Event Pass (10 Tiers)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quests')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors font-cinzel ${
                activeTab === 'quests'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Seasonal Quests
            </button>
          </div>

          <span className="text-xs text-slate-400">
            Earn Stardust in Campaign & Quests
          </span>
        </div>

        {/* Tab 1: 10-Tier Event Pass */}
        {activeTab === 'tiers' && (
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5">
            {tiers.map((tier, idx) => {
              const isUnlocked = currentStardust >= tier.stardustRequired;
              const isClaimed = tier.claimed;

              return (
                <div
                  key={tier.tier}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isClaimed
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                      : isUnlocked
                      ? 'bg-purple-950/70 border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.3)] ring-1 ring-amber-400/40'
                      : 'bg-slate-950/70 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-black font-cinzel text-purple-300">
                      T{tier.tier}
                    </span>

                    <div>
                      <h4 className="text-sm font-bold text-slate-200 font-cinzel">
                        {tier.rewardName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="text-purple-300">Requires {tier.stardustRequired} Stardust</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-400 capitalize">{tier.rewardType}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isClaimed ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50">
                        <Check className="w-3.5 h-3.5" /> Claimed
                      </span>
                    ) : isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => handleClaimTier(idx)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs font-cinzel shadow-md transition-transform hover:scale-105"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        <span>Claim Reward</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-slate-500 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                        <Lock className="w-3.5 h-3.5" />
                        <span>{tier.stardustRequired - currentStardust} more needed</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Seasonal Quests */}
        {activeTab === 'quests' && (
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5">
            {quests.map(quest => {
              const isCompleted = quest.completed || quest.progress >= quest.target;
              const percent = Math.min(100, Math.round((quest.progress / quest.target) * 100));

              return (
                <div
                  key={quest.id}
                  className={`p-3.5 rounded-2xl border flex flex-col gap-2 ${
                    isCompleted
                      ? 'bg-purple-950/40 border-purple-800/60'
                      : 'bg-slate-950/70 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 font-cinzel">
                        {quest.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {quest.description}
                      </p>
                    </div>

                    <span className="text-xs font-extrabold text-purple-300 font-cinzel px-2.5 py-1 rounded-xl bg-purple-950 border border-purple-800 shrink-0">
                      +{quest.rewardStardust} ✨
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Progress</span>
                    <span className="font-bold tabular-nums text-slate-200">
                      {Math.min(quest.target, quest.progress)} / {quest.target}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        isCompleted ? 'bg-emerald-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
