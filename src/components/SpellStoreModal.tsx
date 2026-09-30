import React from 'react';
import { PlayerProfile, BoosterType } from '../types/game';
import { BOOSTER_DETAILS } from '../data/leaderboard';
import { soundEngine } from '../utils/audio';
import { updatePlayerProfile } from '../utils/storage';
import { X, Sparkles, ShoppingBag, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpellStoreModalProps {
  profile: PlayerProfile;
  onClose: () => void;
  onProfileUpdated: (profile: PlayerProfile) => void;
}

export const SpellStoreModal: React.FC<SpellStoreModalProps> = ({
  profile,
  onClose,
  onProfileUpdated
}) => {
  const handleBuy = (boosterId: BoosterType, cost: number) => {
    if (profile.gold < cost) return;

    soundEngine.playBooster(boosterId);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });

    const nextInventory = {
      ...profile.inventory,
      [boosterId]: (profile.inventory[boosterId] || 0) + 1
    };

    const nextProfile = updatePlayerProfile({
      gold: profile.gold - cost,
      inventory: nextInventory
    });

    onProfileUpdated(nextProfile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-purple-900/80 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-100 font-cinzel">
                Alchemy Bazaar
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Magical Spell Relics & Boosters</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-300 font-bold">🪙 {profile.gold} Gold Available</span>
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

        {/* Booster List */}
        <div className="flex flex-col gap-2.5 my-2">
          {BOOSTER_DETAILS.map(b => {
            const currentOwned = profile.inventory[b.id as BoosterType] || 0;
            const canAfford = profile.gold >= b.cost;

            return (
              <div
                key={b.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-purple-800/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-xl bg-slate-900 border border-slate-700">
                    {b.icon}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100 font-cinzel">
                        {b.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                        Owned: {currentOwned}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 max-w-sm">
                      {b.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBuy(b.id as BoosterType, b.cost)}
                  disabled={!canAfford}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-cinzel transition-all shrink-0 ${
                    canAfford
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md hover:scale-105'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>🪙 {b.cost}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
