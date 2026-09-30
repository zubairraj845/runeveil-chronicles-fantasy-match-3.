import React from 'react';
import { BoosterType, PlayerInventory } from '../types/game';
import { BOOSTER_DETAILS } from '../data/leaderboard';

interface BoosterBarProps {
  inventory: PlayerInventory;
  activeBooster: BoosterType | null;
  onSelectBooster: (booster: BoosterType) => void;
  onBuyBooster: (booster: BoosterType) => void;
  gold: number;
}

export const BoosterBar: React.FC<BoosterBarProps> = ({
  inventory,
  activeBooster,
  onSelectBooster,
  onBuyBooster,
  gold
}) => {
  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900/80 backdrop-blur-md rounded-2xl border border-purple-900/50 p-3 shadow-xl">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
          <span>✨</span> Arcane Spell Boosters
        </span>
        {activeBooster && (
          <span className="text-xs text-amber-300 font-medium animate-pulse">
            Targeting active: Click board to cast!
          </span>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {BOOSTER_DETAILS.map(b => {
          const count = inventory[b.id as BoosterType] || 0;
          const isSelected = activeBooster === b.id;
          const canAfford = gold >= b.cost;

          return (
            <div key={b.id} className="relative flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  if (count > 0) {
                    onSelectBooster(b.id as BoosterType);
                  } else {
                    onBuyBooster(b.id as BoosterType);
                  }
                }}
                title={`${b.name}: ${b.description}`}
                className={`w-full group flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-purple-600/50 border-amber-400 ring-2 ring-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.6)] scale-105'
                    : count > 0
                    ? 'bg-slate-800/90 border-slate-700/80 hover:border-purple-500 hover:bg-slate-700/70'
                    : 'bg-slate-900/40 border-slate-800/60 opacity-70 hover:opacity-100 hover:border-amber-500/50'
                }`}
              >
                <span className="text-2xl transition-transform group-hover:scale-115">
                  {b.icon}
                </span>

                <span className="text-[11px] font-medium text-slate-200 mt-1 truncate max-w-full text-center">
                  {b.name.split(' ')[0]}
                </span>

                {/* Badge for count or cost */}
                <div className="mt-1">
                  {count > 0 ? (
                    <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-900/80 text-purple-200 border border-purple-500/40">
                      {count}
                    </span>
                  ) : (
                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${canAfford ? 'bg-amber-950/80 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      🪙{b.cost}
                    </span>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
