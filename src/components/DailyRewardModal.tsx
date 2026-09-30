import React, { useState } from 'react';
import { PlayerProfile, DailyRewardDay } from '../types/game';
import { getDailyRewardsState, claimDailyReward } from '../utils/storage';
import { soundEngine } from '../utils/audio';
import { X, Calendar, Gift, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyRewardModalProps {
  profile: PlayerProfile;
  onClose: () => void;
  onProfileUpdated: (profile: PlayerProfile) => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  profile,
  onClose,
  onProfileUpdated
}) => {
  const [rewardState, setRewardState] = useState(getDailyRewardsState());
  const [justClaimed, setJustClaimed] = useState<DailyRewardDay | null>(null);

  const handleClaim = () => {
    if (!rewardState.canClaimToday) return;

    const result = claimDailyReward();
    if (result.success) {
      soundEngine.playVictory();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
      setJustClaimed(result.reward);
      setRewardState(getDailyRewardsState());
      onProfileUpdated(result.profile);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-purple-900/80 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-100 font-cinzel">
                Daily Astral Reliquary
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Login Streak: <b className="text-amber-300">Day {rewardState.currentStreak} of 7</b></span>
                <span aria-hidden="true">·</span>
                <span>Resets daily at midnight</span>
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

        {/* Just Claimed Banner */}
        {justClaimed && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-purple-950/80 border border-emerald-500/50 flex items-center gap-3 animate-pulse">
            <span className="text-2xl">{justClaimed.iconName}</span>
            <div>
              <span className="text-xs font-bold text-emerald-300 font-cinzel">Reward Claimed!</span>
              <p className="text-xs text-slate-200">{justClaimed.title}</p>
            </div>
          </div>
        )}

        {/* 7 Days Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-2">
          {rewardState.days.map((day, idx) => {
            const isToday = (rewardState.currentStreak - 1) % 7 === idx;
            const isPast = idx < (rewardState.currentStreak - 1) % 7 || (!rewardState.canClaimToday && isToday);
            const isDay7 = day.day === 7;

            return (
              <div
                key={day.day}
                className={`relative flex flex-col items-center justify-between p-3 rounded-2xl border text-center transition-all ${
                  isDay7 ? 'col-span-2 sm:col-span-2 bg-gradient-to-br from-purple-950/90 to-amber-950/60 border-amber-400/70' :
                  isToday && rewardState.canClaimToday
                    ? 'bg-purple-950/70 border-amber-400 ring-2 ring-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-102'
                    : isPast
                    ? 'bg-slate-950/40 border-slate-800/80 opacity-60'
                    : 'bg-slate-950/70 border-slate-800/80'
                }`}
              >
                <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-400 font-cinzel">
                  <span>Day {day.day}</span>
                  {isPast ? (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <Check className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : isToday ? (
                    <span className="text-amber-400 font-semibold">Today</span>
                  ) : null}
                </div>

                <div className="my-2 flex flex-col items-center">
                  <span className={`text-3xl transition-transform ${isToday && rewardState.canClaimToday ? 'animate-bounce' : ''}`}>
                    {day.iconName}
                  </span>
                  <span className="text-xs font-bold text-slate-200 mt-1 line-clamp-2">
                    {day.title}
                  </span>
                </div>

                {isDay7 && (
                  <span className="text-[10px] text-amber-300 font-cinzel uppercase tracking-wider font-bold">
                    ★ Mythic Relic Chest ★
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Claim Action Button */}
        <div className="pt-2">
          {rewardState.canClaimToday ? (
            <button
              type="button"
              onClick={handleClaim}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm font-cinzel shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-transform hover:scale-102 flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" />
              <span>Claim Day {rewardState.currentStreak} Gift</span>
            </button>
          ) : (
            <div className="w-full py-3 rounded-2xl bg-slate-800 border border-slate-700 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Today's Astral Gift Claimed! Return tomorrow for Day {((rewardState.currentStreak) % 7) + 1}.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
