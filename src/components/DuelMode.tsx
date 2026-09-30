import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, LevelConfig, GemColor } from '../types/game';
import { ALL_GEM_COLORS } from '../data/levels';
import { GameBoard } from './GameBoard';
import { soundEngine } from '../utils/audio';
import { submitScore, updateQuestProgress } from '../utils/storage';
import { Shield, Zap, Flame, Heart, ArrowLeft, Swords } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DuelModeProps {
  profile: PlayerProfile;
  onExit: () => void;
  onProfileUpdated: (profile: PlayerProfile) => void;
}

export const DuelMode: React.FC<DuelModeProps> = ({
  profile,
  onExit,
  onProfileUpdated
}) => {
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [rivalHp, setRivalHp] = useState<number>(100);
  const [rivalCastProgress, setRivalCastProgress] = useState<number>(0);
  const [duelStatus, setDuelStatus] = useState<'FIGHTING' | 'VICTORY' | 'DEFEAT'>('FIGHTING');
  const [combatLog, setCombatLog] = useState<string>('The Arcane Spell Clash begins! Channel elemental runes to breach the rival barrier.');

  const rivalName = 'Archmage Malakar';
  const rivalAvatar = '🦹‍♂️';

  const duelLevelConfig: LevelConfig = {
    id: 888,
    realmId: 88,
    realmName: 'Arcane Arena',
    name: 'Spell Duel: Clashing Leylines',
    subtitle: 'Match runes to cast offensive & defensive sorceries',
    rows: 8,
    cols: 8,
    moves: 999,
    colorPalette: ALL_GEM_COLORS,
    starThresholds: [5000, 10000, 15000],
    objectives: [
      { type: 'score', target: 999999, current: 0, label: 'Deplete Rival Barrier' }
    ],
    lore: 'Elemental clash between sorcerers of the Astral Circle.'
  };

  // Opponent auto-casting timer loop
  useEffect(() => {
    if (duelStatus !== 'FIGHTING') return;

    const interval = setInterval(() => {
      setRivalCastProgress(prev => {
        if (prev >= 100) {
          // Opponent unleashes spell
          const damage = Math.floor(Math.random() * 12) + 8;
          setPlayerHp(curr => {
            const next = Math.max(0, curr - damage);
            if (next <= 0) {
              setDuelStatus('DEFEAT');
              soundEngine.playDefeat();
            }
            return next;
          });
          soundEngine.playBombExplosion();
          setCombatLog(`${rivalName} unleashed a Shadow Javelin for -${damage} barrier!`);
          return 0;
        }
        return prev + 12; // charges every ~3.5 seconds
      });
    }, 400);

    return () => clearInterval(interval);
  }, [duelStatus]);

  // Handle player match events in duel
  const handleObjectiveProgress = (type: string, delta: number, gemColor?: GemColor) => {
    if (duelStatus !== 'FIGHTING') return;

    if (type === 'collect_gems' && gemColor) {
      if (gemColor === 'ruby') {
        // Fire burst
        const dmg = delta * 4;
        setRivalHp(curr => {
          const next = Math.max(0, curr - dmg);
          if (next <= 0) {
            handleVictory();
          }
          return next;
        });
        soundEngine.playCleaverBeam();
        setCombatLog(`You cast Flame Torrent! -${dmg} damage to rival!`);
      } else if (gemColor === 'sapphire') {
        // Shield restore
        const heal = delta * 3;
        setPlayerHp(curr => Math.min(100, curr + heal));
        setCombatLog(`You channeled Frost Aegis! +${heal} barrier restored!`);
      } else if (gemColor === 'topaz') {
        // Lightning Stun
        const dmg = delta * 3;
        setRivalCastProgress(p => Math.max(0, p - 35));
        setRivalHp(curr => {
          const next = Math.max(0, curr - dmg);
          if (next <= 0) handleVictory();
          return next;
        });
        setCombatLog(`Lightning Stun! Disrupted rival spell charge & dealt ${dmg} damage!`);
      } else {
        const dmg = delta * 2;
        setRivalHp(curr => {
          const next = Math.max(0, curr - dmg);
          if (next <= 0) handleVictory();
          return next;
        });
      }
    }
  };

  const handleVictory = () => {
    setDuelStatus('VICTORY');
    soundEngine.playVictory();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });

    // Grant gold & duel rating
    const updated = {
      ...profile,
      gold: profile.gold + 450,
      stardust: profile.stardust + 60
    };
    onProfileUpdated(updated);
    submitScore('duel', 2350, 'Defeated Archmage Malakar');
    updateQuestProgress('quest_5', 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 p-3">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Arena</span>
        </button>

        <div className="text-center">
          <span className="text-xs uppercase font-cinzel text-purple-400 font-bold flex items-center justify-center gap-1">
            <Swords className="w-3.5 h-3.5" /> Arcane Spell Duel
          </span>
          <h2 className="text-sm font-bold text-slate-100 font-cinzel">
            {profile.name} vs {rivalName}
          </h2>
        </div>

        <div className="w-16" />
      </div>

      {/* Duel Combat HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950/80 border border-purple-900/60 rounded-3xl p-4 shadow-xl backdrop-blur-md">
        {/* Player Status */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-3xl p-2 rounded-xl bg-purple-950/80 border border-purple-800">
            {profile.avatar}
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-200 font-cinzel">{profile.name}</span>
              <span className="font-bold text-emerald-400 tabular-nums">{playerHp} / 100</span>
            </div>
            <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-300"
                style={{ width: `${playerHp}%` }}
              />
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
              <span className="flex items-center gap-0.5 text-red-300"><Flame className="w-3 h-3" /> Ruby = Atk</span>
              <span className="flex items-center gap-0.5 text-cyan-300"><Shield className="w-3 h-3" /> Sapphire = Shield</span>
              <span className="flex items-center gap-0.5 text-yellow-300"><Zap className="w-3 h-3" /> Topaz = Stun</span>
            </div>
          </div>
        </div>

        {/* Rival Status */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-3xl p-2 rounded-xl bg-red-950/80 border border-red-800">
            {rivalAvatar}
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-200 font-cinzel">{rivalName}</span>
              <span className="font-bold text-red-400 tabular-nums">{rivalHp} / 100</span>
            </div>
            <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300"
                style={{ width: `${rivalHp}%` }}
              />
            </div>
            {/* Cast Bar */}
            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
              <span>Spell Casting:</span>
              <span className="font-bold text-amber-300 tabular-nums">{rivalCastProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-0.5">
              <div
                className="h-full bg-amber-400 transition-all duration-200"
                style={{ width: `${rivalCastProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Combat Log Ticker */}
      <div className="text-center text-xs font-medium text-purple-300 bg-purple-950/40 border border-purple-900/40 rounded-xl py-2 px-4 shadow-inner">
        {combatLog}
      </div>

      {/* Game Board */}
      <div className="w-full flex justify-center">
        <GameBoard
          level={duelLevelConfig}
          score={0}
          movesLeft={999}
          objectives={duelLevelConfig.objectives}
          activeBooster={null}
          onScoreDelta={() => {}}
          onMoveConsumed={() => {}}
          onObjectiveProgress={handleObjectiveProgress}
          onLevelComplete={() => {}}
          onLevelFailed={() => {}}
          onResetBooster={() => {}}
        />
      </div>

      {/* Victory / Defeat Modal */}
      {duelStatus !== 'FIGHTING' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-purple-900 rounded-3xl p-6 text-center shadow-2xl">
            <span className="text-5xl block mb-2">
              {duelStatus === 'VICTORY' ? '🏆' : '💀'}
            </span>
            <h2 className="text-2xl font-black font-cinzel text-slate-100">
              {duelStatus === 'VICTORY' ? 'Glorious Spell Victory!' : 'Barrier Shattered!'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {duelStatus === 'VICTORY'
                ? `You breached ${rivalName}'s barrier and conquered the Arcane Arena!`
                : `${rivalName}'s dark sorcery overpowered your defense.`}
            </p>

            {duelStatus === 'VICTORY' && (
              <div className="flex justify-center gap-4 my-4 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block">Gold Earned</span>
                  <span className="font-bold text-amber-300">🪙 +450</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Stardust</span>
                  <span className="font-bold text-purple-300">✨ +60</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Arena Rating</span>
                  <span className="font-bold text-emerald-400">+250 Pts</span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={onExit}
              className="w-full mt-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm font-cinzel transition-colors shadow-lg"
            >
              Return to Realm Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
