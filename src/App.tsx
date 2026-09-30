/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PlayerProfile, LevelConfig, LevelObjective, BoosterType, GemColor, getVictoryStreakMultiplier } from './types/game';
import { CAMPAIGN_LEVELS, ENDLESS_MODE_CONFIG } from './data/levels';
import {
  getPlayerProfile,
  savePlayerProfile,
  updatePlayerProfile,
  getDailyRewardsState,
  submitScore,
  updateQuestProgress
} from './utils/storage';
import { soundEngine } from './utils/audio';

// Components
import { Navbar } from './components/Navbar';
import { WorldMap } from './components/WorldMap';
import { GameHUD } from './components/GameHUD';
import { GameBoard } from './components/GameBoard';
import { BoosterBar } from './components/BoosterBar';
import { DuelMode } from './components/DuelMode';
import { LeaderboardModal } from './components/LeaderboardModal';
import { DailyRewardModal } from './components/DailyRewardModal';
import { SeasonalModal } from './components/SeasonalModal';
import { SpellStoreModal } from './components/SpellStoreModal';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { GameOverModal } from './components/GameOverModal';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(getPlayerProfile());
  const [view, setView] = useState<'WORLD_MAP' | 'PLAYING_LEVEL' | 'ENDLESS_RUSH' | 'SPELL_DUEL'>('WORLD_MAP');
  const [currentLevel, setCurrentLevel] = useState<LevelConfig>(CAMPAIGN_LEVELS[0]);

  // Match-3 Active Gameplay State
  const [score, setScore] = useState<number>(0);
  const [movesLeft, setMovesLeft] = useState<number>(20);
  const [timeRemaining, setTimeRemaining] = useState<number | undefined>(undefined);
  const [objectives, setObjectives] = useState<LevelObjective[]>([]);
  const [activeBooster, setActiveBooster] = useState<BoosterType | null>(null);

  // Audio settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundEngine.isSoundEnabled());
  const [musicEnabled, setMusicEnabled] = useState<boolean>(soundEngine.isMusicEnabled());

  // Modal Dialogs
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showDaily, setShowDaily] = useState<boolean>(false);
  const [showSeasonal, setShowSeasonal] = useState<boolean>(false);
  const [showStore, setShowStore] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameOverData, setGameOverData] = useState<{
    isOpen: boolean;
    isVictory: boolean;
    stars: number;
    score: number;
    victoryStreak?: number;
  } | null>(null);

  const dailyState = getDailyRewardsState();

  // Endless Rush Timer
  useEffect(() => {
    if (view !== 'ENDLESS_RUSH' || isPaused || timeRemaining === undefined || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === undefined || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [view, isPaused, timeRemaining]);

  // Start Level handler
  const handleStartLevel = (level: LevelConfig) => {
    setCurrentLevel(level);
    setScore(0);
    setMovesLeft(level.moves);
    setTimeRemaining(level.timeLimit);
    setObjectives(level.objectives.map(o => ({ ...o, current: 0 })));
    setActiveBooster(null);
    setGameOverData(null);
    setIsPaused(false);
    setView(level.id === 999 ? 'ENDLESS_RUSH' : 'PLAYING_LEVEL');
  };

  const handleStartEndless = () => {
    handleStartLevel(ENDLESS_MODE_CONFIG);
  };

  const handleScoreDelta = (points: number) => {
    setScore(prev => prev + points);
  };

  const handleMoveConsumed = () => {
    if (timeRemaining === undefined) {
      setMovesLeft(prev => Math.max(0, prev - 1));
    }
  };

  const handleObjectiveProgress = (type: LevelObjective['type'], delta: number, gemColor?: GemColor) => {
    setObjectives(prev =>
      prev.map(obj => {
        if (obj.type === type) {
          if (type === 'collect_gems') {
            if (obj.gemColor === gemColor) {
              return { ...obj, current: obj.current + delta };
            }
          } else {
            return { ...obj, current: obj.current + delta };
          }
        }
        return obj;
      })
    );

    // Update seasonal quests accordingly
    if (type === 'clear_frost') {
      updateQuestProgress('quest_2', delta);
    } else if (type === 'collect_relics') {
      updateQuestProgress('quest_4', delta);
    }
  };

  // Booster selection & consumption
  const handleSelectBooster = (booster: BoosterType) => {
    if (booster === 'chrono') {
      // Instantly adds +5 moves
      const currentCount = profile.inventory.chrono || 0;
      if (currentCount > 0) {
        soundEngine.playBooster('chrono');
        setMovesLeft(prev => prev + 5);
        const updated = updatePlayerProfile({
          inventory: { ...profile.inventory, chrono: currentCount - 1 }
        });
        setProfile(updated);
      }
    } else if (booster === 'shuffle') {
      // Instantly triggers board reshuffle
      const currentCount = profile.inventory.shuffle || 0;
      if (currentCount > 0) {
        soundEngine.playBooster('shuffle');
        const updated = updatePlayerProfile({
          inventory: { ...profile.inventory, shuffle: currentCount - 1 }
        });
        setProfile(updated);
        // Force reset board
        handleStartLevel(currentLevel);
      }
    } else {
      // Target-based boosters (meteor, arcane_bolt, wand)
      setActiveBooster(prev => (prev === booster ? null : booster));
    }
  };

  const handleBoosterUsed = () => {
    if (!activeBooster) return;
    const currentCount = profile.inventory[activeBooster] || 0;
    if (currentCount > 0) {
      const updated = updatePlayerProfile({
        inventory: { ...profile.inventory, [activeBooster]: currentCount - 1 }
      });
      setProfile(updated);
    }
    setActiveBooster(null);
  };

  // Level Complete (Victory)
  const handleLevelComplete = (stars: number, finalScore: number) => {
    // Save progress
    const nextUnlocked = Math.max(profile.unlockedLevel, currentLevel.id + 1);
    const existingStars = profile.levelStars[currentLevel.id] || 0;
    const existingHigh = profile.highScores[currentLevel.id] || 0;

    // Victory Streak & Stardust Multiplier Tracker
    const isCampaign = currentLevel.id !== 999;
    const currentStreak = isCampaign ? (profile.victoryStreak || 0) + 1 : (profile.victoryStreak || 0);
    const highestStreak = isCampaign
      ? Math.max(profile.highestVictoryStreak || 0, currentStreak)
      : (profile.highestVictoryStreak || 0);
    const streakMultiplier = getVictoryStreakMultiplier(currentStreak);

    const goldReward = 150 + stars * 50;
    const baseStardust = 25 + stars * 15;
    const stardustReward = Math.round(baseStardust * streakMultiplier);

    const updatedProfile: PlayerProfile = {
      ...profile,
      unlockedLevel: nextUnlocked,
      gold: profile.gold + goldReward,
      stardust: profile.stardust + stardustReward,
      victoryStreak: currentStreak,
      highestVictoryStreak: highestStreak,
      levelStars: {
        ...profile.levelStars,
        [currentLevel.id]: Math.max(existingStars, stars)
      },
      highScores: {
        ...profile.highScores,
        [currentLevel.id]: Math.max(existingHigh, finalScore)
      },
      endlessHighScore:
        currentLevel.id === 999
          ? Math.max(profile.endlessHighScore, finalScore)
          : profile.endlessHighScore
    };

    savePlayerProfile(updatedProfile);
    setProfile(updatedProfile);

    // Global Leaderboard submission
    if (currentLevel.id === 999) {
      submitScore('endless', finalScore, 'Endless Arcane Rush (90s)');
      if (finalScore >= 18000) updateQuestProgress('quest_6', finalScore);
    } else {
      submitScore('campaign', finalScore, `Stage ${currentLevel.id} · ${currentLevel.name}`);
    }

    setGameOverData({
      isOpen: true,
      isVictory: true,
      stars,
      score: finalScore,
      victoryStreak: currentStreak
    });
  };

  // Level Failed (Defeat)
  const handleLevelFailed = (finalScore: number) => {
    const goldEarned = 30;
    // Defeat resets the active victory streak
    const updated: PlayerProfile = {
      ...profile,
      gold: profile.gold + goldEarned,
      victoryStreak: 0
    };
    savePlayerProfile(updated);
    setProfile(updated);

    setGameOverData({
      isOpen: true,
      isVictory: false,
      stars: 0,
      score: finalScore,
      victoryStreak: 0
    });
  };

  const handleNextLevel = () => {
    const nextIdx = CAMPAIGN_LEVELS.findIndex(l => l.id === currentLevel.id) + 1;
    if (nextIdx < CAMPAIGN_LEVELS.length) {
      handleStartLevel(CAMPAIGN_LEVELS[nextIdx]);
    } else {
      setView('WORLD_MAP');
      setGameOverData(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c16] text-slate-100 flex flex-col relative overflow-x-hidden">
      {/* Fantasy Backdrop Ambient Scrim */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 bg-cover bg-center"
        style={{
          backgroundImage: `url('/src/assets/images/fantasy_realm_backdrop_1790754468575.jpg')`
        }}
      />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#0b0c16]/80 via-[#0b0c16]/90 to-[#0b0c16]" />

      {/* Main Top Navigation Bar (Strict 3-zone Top Bar Contract) */}
      <Navbar
        profile={profile}
        currentView={view}
        soundEnabled={soundEnabled}
        musicEnabled={musicEnabled}
        canClaimDaily={dailyState.canClaimToday}
        onNavigateMap={() => setView('WORLD_MAP')}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenDaily={() => setShowDaily(true)}
        onOpenSeasonal={() => setShowSeasonal(true)}
        onOpenStore={() => setShowStore(true)}
        onOpenProfile={() => setShowProfile(true)}
        onToggleSound={() => setSoundEnabled(soundEngine.toggleSound())}
        onToggleMusic={() => setMusicEnabled(soundEngine.toggleMusic())}
      />

      {/* Main View Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start p-2 md:p-4">
        {view === 'WORLD_MAP' && (
          <WorldMap
            profile={profile}
            onSelectLevel={handleStartLevel}
            onStartEndless={handleStartEndless}
            onStartDuel={() => setView('SPELL_DUEL')}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
            onOpenDaily={() => setShowDaily(true)}
            onOpenSeasonal={() => setShowSeasonal(true)}
            onOpenProfile={() => setShowProfile(true)}
          />
        )}

        {(view === 'PLAYING_LEVEL' || view === 'ENDLESS_RUSH') && (
          <div className="w-full flex flex-col items-center gap-3">
            <GameHUD
              level={currentLevel}
              score={score}
              movesLeft={movesLeft}
              timeRemaining={timeRemaining}
              objectives={objectives}
              soundEnabled={soundEnabled}
              musicEnabled={musicEnabled}
              onToggleSound={() => setSoundEnabled(soundEngine.toggleSound())}
              onToggleMusic={() => setMusicEnabled(soundEngine.toggleMusic())}
              onPause={() => setIsPaused(!isPaused)}
              onBackToMap={() => setView('WORLD_MAP')}
            />

            <GameBoard
              level={currentLevel}
              score={score}
              movesLeft={movesLeft}
              timeRemaining={timeRemaining}
              objectives={objectives}
              activeBooster={activeBooster}
              onScoreDelta={handleScoreDelta}
              onMoveConsumed={handleMoveConsumed}
              onObjectiveProgress={handleObjectiveProgress}
              onLevelComplete={handleLevelComplete}
              onLevelFailed={handleLevelFailed}
              onResetBooster={handleBoosterUsed}
            />

            <BoosterBar
              inventory={profile.inventory}
              activeBooster={activeBooster}
              onSelectBooster={handleSelectBooster}
              onBuyBooster={() => setShowStore(true)}
              gold={profile.gold}
            />
          </div>
        )}

        {view === 'SPELL_DUEL' && (
          <DuelMode
            profile={profile}
            onExit={() => setView('WORLD_MAP')}
            onProfileUpdated={p => setProfile(p)}
          />
        )}
      </main>

      {/* Pause Dialog */}
      {isPaused && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-purple-900 rounded-3xl p-6 text-center shadow-2xl flex flex-col gap-4">
            <span className="text-4xl">⏸️</span>
            <h3 className="text-xl font-bold font-cinzel text-slate-100">Chronos Pause</h3>
            <p className="text-xs text-slate-400">
              The leylines are frozen. Take a breath, Sorcerer.
            </p>

            <button
              type="button"
              onClick={() => setIsPaused(false)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-cinzel transition-colors"
            >
              Resume Incantation
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPaused(false);
                setView('WORLD_MAP');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
            >
              Retreat to Realm Map
            </button>
          </div>
        </div>
      )}

      {/* Game Over / Victory Modal */}
      {gameOverData && (
        <GameOverModal
          isVictory={gameOverData.isVictory}
          stars={gameOverData.stars}
          score={gameOverData.score}
          level={currentLevel}
          victoryStreak={gameOverData.victoryStreak ?? profile.victoryStreak}
          onNextLevel={handleNextLevel}
          onRestart={() => handleStartLevel(currentLevel)}
          onBackToMap={() => {
            setGameOverData(null);
            setView('WORLD_MAP');
          }}
          onOpenLeaderboard={() => {
            setGameOverData(null);
            setShowLeaderboard(true);
          }}
        />
      )}

      {/* Player Profile & Victory Streak Modal */}
      <PlayerProfileModal
        profile={profile}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

      {/* Global Leaderboards Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          profile={profile}
          onClose={() => setShowLeaderboard(false)}
          onProfileUpdated={p => setProfile(p)}
        />
      )}

      {/* Daily Login Rewards Modal */}
      {showDaily && (
        <DailyRewardModal
          profile={profile}
          onClose={() => setShowDaily(false)}
          onProfileUpdated={p => setProfile(p)}
        />
      )}

      {/* Seasonal Dragon Event Modal */}
      {showSeasonal && (
        <SeasonalModal
          profile={profile}
          onClose={() => setShowSeasonal(false)}
          onProfileUpdated={p => setProfile(p)}
        />
      )}

      {/* Alchemy Store Modal */}
      {showStore && (
        <SpellStoreModal
          profile={profile}
          onClose={() => setShowStore(false)}
          onProfileUpdated={p => setProfile(p)}
        />
      )}
    </div>
  );
}
