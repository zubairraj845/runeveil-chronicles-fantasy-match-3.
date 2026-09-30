import React, { useState, useEffect, useRef } from 'react';
import { LevelConfig, LevelObjective } from '../types/game';
import { Volume2, VolumeX, Music, Pause, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { ArcaneHUDParticles } from './ArcaneHUDParticles';
import { soundEngine } from '../utils/audio';

interface GameHUDProps {
  level: LevelConfig;
  score: number;
  movesLeft: number;
  timeRemaining?: number;
  objectives: LevelObjective[];
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onPause: () => void;
  onBackToMap: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  level,
  score,
  movesLeft,
  timeRemaining,
  objectives,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onPause,
  onBackToMap
}) => {
  const [star1, star2, star3] = level.starThresholds;
  const currentStars = score >= star3 ? 3 : score >= star2 ? 2 : score >= star1 ? 1 : 0;
  const progressPercent = Math.min(100, Math.round((score / star3) * 100));

  const [showParticleExplosion, setShowParticleExplosion] = useState<boolean>(false);
  const hasTriggeredRef = useRef<boolean>(false);
  const hudCardRef = useRef<HTMLDivElement | null>(null);

  const allObjectivesMet =
    objectives.length > 0 &&
    objectives.every(obj => (obj.type === 'score' ? score >= obj.target : obj.current >= obj.target));

  // Reset explosion trigger when changing levels
  useEffect(() => {
    hasTriggeredRef.current = false;
    setShowParticleExplosion(false);
  }, [level.id]);

  // Trigger Arcane Confetti & Particle Explosion upon clearing all objectives
  useEffect(() => {
    if (allObjectivesMet && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      setShowParticleExplosion(true);
      soundEngine.playVictory();
    }
  }, [allObjectivesMet]);

  return (
    <header className="relative w-full max-w-xl mx-auto flex flex-col gap-2 p-2">
      {/* Arcane Particles & Confetti Canvas Overlay */}
      <ArcaneHUDParticles
        isActive={showParticleExplosion}
        anchorRect={hudCardRef.current?.getBoundingClientRect()}
      />

      {/* Top Utility Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToMap}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Realm Map</span>
        </button>

        <div className="text-center">
          <span className="text-[11px] font-medium text-purple-300 uppercase tracking-widest block font-cinzel">
            {level.realmName}
          </span>
          <h2 className="text-sm font-bold text-slate-100 font-cinzel truncate max-w-[200px]">
            {level.name}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
          <button
            type="button"
            onClick={onToggleMusic}
            title={musicEnabled ? 'Stop Ambient Music' : 'Play Ambient Music'}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
          >
            <Music className={`w-4 h-4 ${musicEnabled ? 'text-amber-400' : 'text-slate-500'}`} />
          </button>
          <button
            type="button"
            onClick={onPause}
            title="Pause Game"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Celebratory Banner when all objectives are cleared */}
      {allObjectivesMet && (
        <div className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/25 to-amber-500/20 border border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.4)] animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="text-xs font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-purple-200 font-cinzel">
            ★ ALL OBJECTIVES CLEARED! ★
          </span>
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      )}

      {/* Main Stats Display */}
      <div
        ref={hudCardRef}
        className={`relative grid grid-cols-12 gap-2 items-center bg-slate-900/90 backdrop-blur-md rounded-2xl border transition-all duration-300 p-3 shadow-lg ${
          allObjectivesMet
            ? 'border-amber-400/80 shadow-[0_0_25px_rgba(251,191,36,0.35)]'
            : 'border-purple-900/40'
        }`}
      >
        {/* Moves / Timer Box */}
        <div className="col-span-3 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] uppercase font-semibold text-purple-300 font-cinzel">
            {timeRemaining !== undefined ? 'Time Left' : 'Moves'}
          </span>
          <span className={`text-2xl font-black tabular-nums tracking-tight font-cinzel ${
            (timeRemaining !== undefined ? timeRemaining <= 10 : movesLeft <= 5) ? 'text-red-400 animate-pulse' : 'text-amber-300'
          }`}>
            {timeRemaining !== undefined ? `${timeRemaining}s` : movesLeft}
          </span>
        </div>

        {/* Score & Star Progress Meter */}
        <div className="col-span-5 flex flex-col justify-center px-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-300 font-cinzel">Score</span>
            <span className="font-bold text-amber-300 tabular-nums">{score.toLocaleString()}</span>
          </div>

          <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-amber-500 to-yellow-400 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.6)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Star Threshold Markers */}
          <div className="flex items-center justify-between mt-1 px-1 text-[11px]">
            <span className={`transition-transform duration-200 ${currentStars >= 1 ? 'scale-125 text-amber-300 drop-shadow-[0_0_6px_#f59e0b]' : 'text-slate-600 opacity-60'}`}>
              ★
            </span>
            <span className={`transition-transform duration-200 ${currentStars >= 2 ? 'scale-125 text-amber-300 drop-shadow-[0_0_6px_#f59e0b]' : 'text-slate-600 opacity-60'}`}>
              ★
            </span>
            <span className={`transition-transform duration-200 ${currentStars >= 3 ? 'scale-125 text-amber-300 drop-shadow-[0_0_6px_#f59e0b]' : 'text-slate-600 opacity-60'}`}>
              ★
            </span>
          </div>
        </div>

        {/* Objectives Box */}
        <div
          className={`col-span-4 flex flex-col gap-1 justify-center p-1.5 rounded-xl border transition-all duration-300 ${
            allObjectivesMet
              ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] animate-pulse'
              : 'bg-slate-950/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-semibold font-cinzel text-center">
            {allObjectivesMet ? (
              <span className="text-amber-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Done!
              </span>
            ) : (
              <span className="text-purple-300">Objectives</span>
            )}
          </div>

          <div className="flex flex-col gap-1 max-h-[50px] overflow-y-auto">
            {objectives.map((obj, i) => {
              const isMet = obj.current >= obj.target;
              return (
                <div key={i} className="flex items-center justify-between text-[11px] gap-1 px-1">
                  <span className="truncate text-slate-300" title={obj.label}>
                    {obj.type === 'clear_frost' && '❄️ Rime'}
                    {obj.type === 'collect_relics' && '🪶 Relic'}
                    {obj.type === 'score' && '🎯 Score'}
                    {obj.type === 'collect_gems' && (
                      obj.gemColor === 'ruby' ? '🔥 Ruby' :
                      obj.gemColor === 'emerald' ? '🌿 Gaia' :
                      obj.gemColor === 'sapphire' ? '💧 Sapphire' :
                      obj.gemColor === 'topaz' ? '⚡ Topaz' :
                      obj.gemColor === 'amethyst' ? '🔮 Void' : '💎 Star'
                    )}
                  </span>
                  <span className={`font-bold tabular-nums shrink-0 ${isMet ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {Math.min(obj.target, obj.current)}/{obj.target}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
