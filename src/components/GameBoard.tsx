import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Gem, BoardTile, LevelConfig, LevelObjective, BoosterType, FloatingText, BeamEffect, ExplosionEffect, GemColor } from '../types/game';
import { createInitialGrid, detectMatches, areAdjacent, hasPossibleMoves, getNextId } from '../utils/matchLogic';
import { soundEngine } from '../utils/audio';
import { GemIcon } from './GemIcon';
import { ComboFloatingBanner } from './ComboFloatingBanner';
import { ComboFrenzyBar } from './ComboFrenzyBar';
import { ArcaneRuneIdle } from './ArcaneRuneIdle';
import confetti from 'canvas-confetti';

interface GameBoardProps {
  level: LevelConfig;
  score: number;
  movesLeft: number;
  timeRemaining?: number;
  objectives: LevelObjective[];
  activeBooster: BoosterType | null;
  onScoreDelta: (points: number) => void;
  onMoveConsumed: () => void;
  onObjectiveProgress: (type: LevelObjective['type'], delta: number, gemColor?: GemColor) => void;
  onLevelComplete: (stars: number, finalScore: number) => void;
  onLevelFailed: (finalScore: number) => void;
  onResetBooster: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  level,
  score,
  movesLeft,
  timeRemaining,
  objectives,
  activeBooster,
  onScoreDelta,
  onMoveConsumed,
  onObjectiveProgress,
  onLevelComplete,
  onLevelFailed,
  onResetBooster
}) => {
  const [gems, setGems] = useState<(Gem | null)[][]>([]);
  const [tiles, setTiles] = useState<BoardTile[][]>([]);
  const [selectedGem, setSelectedGem] = useState<{ row: number; col: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [activeBeams, setActiveBeams] = useState<BeamEffect[]>([]);
  const [activeExplosions, setActiveExplosions] = useState<ExplosionEffect[]>([]);
  const [isReshuffling, setIsReshuffling] = useState<boolean>(false);

  // Consecutive Time-Based Combo Multiplier State
  const COMBO_WINDOW_MS = 4500;
  const [consecutiveMatches, setConsecutiveMatches] = useState<number>(0);
  const [comboMultiplier, setComboMultiplier] = useState<number>(1.0);
  const [lastMatchTime, setLastMatchTime] = useState<number>(0);
  const lastMatchTimestamp = useRef<number>(0);
  const comboMultiplierRef = useRef<number>(1.0);

  // Active swapping tiles for subtle arcane glow transition
  const [swappingCoords, setSwappingCoords] = useState<{ r1: number; c1: number; r2: number; c2: number } | null>(null);

  // Floating Combo Multiplier Banner for Chain Reactions
  const [chainBannerData, setChainBannerData] = useState<{
    multiplier: number;
    chainStep: number;
    triggerKey: number;
  } | null>(null);

  // Drag tracking
  const dragStartPos = useRef<{ row: number; col: number; x: number; y: number } | null>(null);
  const comboCounter = useRef<number>(1);
  const boardRef = useRef<HTMLDivElement>(null);

  // Isolated Combo Expiration Callback
  const handleComboExpire = useCallback(() => {
    setConsecutiveMatches(0);
    setComboMultiplier(1.0);
    comboMultiplierRef.current = 1.0;
  }, []);

  // Initialize Board on Level change
  useEffect(() => {
    const { gems: initGems, tiles: initTiles } = createInitialGrid(level);
    setGems(initGems);
    setTiles(initTiles);
    setSelectedGem(null);
    setIsProcessing(false);
    comboCounter.current = 1;
    setConsecutiveMatches(0);
    setComboMultiplier(1.0);
    setLastMatchTime(0);
    lastMatchTimestamp.current = 0;
    comboMultiplierRef.current = 1.0;
  }, [level]);

  // Check victory / failure conditions
  useEffect(() => {
    if (gems.length === 0) return;

    // Check if all objectives are fulfilled
    const allObjectivesMet = objectives.every(obj => {
      if (obj.type === 'score') return score >= obj.target;
      return obj.current >= obj.target;
    });

    if (allObjectivesMet) {
      const [star1, star2, star3] = level.starThresholds;
      const stars = score >= star3 ? 3 : score >= star2 ? 2 : score >= star1 ? 1 : 1;
      soundEngine.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onLevelComplete(stars, score);
      return;
    }

    // Check if out of moves or time
    if (timeRemaining !== undefined && timeRemaining <= 0) {
      soundEngine.playDefeat();
      onLevelFailed(score);
    } else if (timeRemaining === undefined && movesLeft <= 0 && !isProcessing) {
      soundEngine.playDefeat();
      onLevelFailed(score);
    }
  }, [score, movesLeft, timeRemaining, objectives, isProcessing, level, onLevelComplete, onLevelFailed, gems.length]);

  // Helper: Spawn floating text popup
  const addFloatingText = (text: string, x: number, y: number, color: string = '#fbbf24') => {
    const id = `ft_${Date.now()}_${Math.random()}`;
    setFloatingTexts(prev => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1200);
  };

  // Helper: Trigger visual laser beam
  const triggerBeam = (type: 'beam_h' | 'beam_v', index: number) => {
    const id = `beam_${Date.now()}_${Math.random()}`;
    setActiveBeams(prev => [
      ...prev,
      type === 'beam_h' ? { id, type, row: index } : { id, type, col: index }
    ]);
    setTimeout(() => {
      setActiveBeams(prev => prev.filter(b => b.id !== id));
    }, 450);
  };

  // Helper: Trigger explosion ring
  const triggerExplosion = (row: number, col: number, radius: number = 1) => {
    const id = `expl_${Date.now()}_${Math.random()}`;
    setActiveExplosions(prev => [...prev, { id, row, col, radius, color: '#f59e0b' }]);
    setTimeout(() => {
      setActiveExplosions(prev => prev.filter(e => e.id !== id));
    }, 500);
  };

  // Gravity Drop and Cascade Recursion
  const applyGravityAndCascade = useCallback(async (currentGrid: (Gem | null)[][], currentTiles: BoardTile[][]) => {
    const rows = level.rows;
    const cols = level.cols;
    const colors = level.colorPalette || (['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst'] as GemColor[]);
    let updatedGrid = currentGrid.map(row => [...row]);

    // 1. Move gems down
    for (let c = 0; c < cols; c++) {
      let writeRow = rows - 1;
      for (let r = rows - 1; r >= 0; r--) {
        if (updatedGrid[r][c] !== null) {
          if (writeRow !== r) {
            updatedGrid[writeRow][c] = {
              ...updatedGrid[r][c]!,
              row: writeRow,
              col: c
            };
            updatedGrid[r][c] = null;
          }
          writeRow--;
        }
      }

      // Fill empty spaces from top with new gems
      for (let r = writeRow; r >= 0; r--) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        updatedGrid[r][c] = {
          id: getNextId(),
          color: randomColor,
          special: 'none',
          row: r,
          col: c,
          isNew: true
        };
      }
    }

    setGems(updatedGrid);

    // Give time for gravity fall animation
    await new Promise(res => setTimeout(res, 220));

    // Check relics reaching bottom row
    let relicsSaved = 0;
    for (let c = 0; c < cols; c++) {
      const bottomGem = updatedGrid[rows - 1][c];
      if (bottomGem && bottomGem.special === 'relic') {
        relicsSaved++;
        updatedGrid[rows - 1][c] = null;
        addFloatingText('🪶 Relic Recovered!', c * 50, (rows - 1) * 50, '#38bdf8');
      }
    }

    if (relicsSaved > 0) {
      onObjectiveProgress('collect_relics', relicsSaved);
      onScoreDelta(relicsSaved * 1000);
      soundEngine.playSingularity();
      // Drop again after relic collection
      applyGravityAndCascade(updatedGrid, currentTiles);
      return;
    }

    // 2. Detect any new cascade matches
    const { allMatchedCoords, specialSpawns } = detectMatches(updatedGrid);

    if (allMatchedCoords.size > 0) {
      comboCounter.current += 1;

      // Trigger floating Combo Multiplier component with scaling animation
      const activeMult = Math.min(
        5.0,
        Math.max(comboMultiplierRef.current, 1.0 + (comboCounter.current - 1) * 0.5)
      );
      soundEngine.playMatch(comboCounter.current, activeMult);

      setChainBannerData({
        multiplier: activeMult,
        chainStep: comboCounter.current,
        triggerKey: Date.now() + Math.random()
      });

      if (comboCounter.current >= 4) {
        addFloatingText(`Divine Sorcery! x${comboCounter.current}`, 150, 180, '#f43f5e');
      } else if (comboCounter.current >= 2) {
        addFloatingText(`Arcane Cascade! x${comboCounter.current}`, 150, 180, '#a855f7');
      }

      await processMatchRemoval(updatedGrid, currentTiles, allMatchedCoords, specialSpawns);
    } else {
      // Check for available moves, otherwise reshuffle
      if (!hasPossibleMoves(updatedGrid)) {
        setIsReshuffling(true);
        addFloatingText('Reshuffling Runes...', 140, 180, '#38bdf8');
        soundEngine.playBooster('shuffle');
        await new Promise(res => setTimeout(res, 700));

        const reshuffled = createInitialGrid(level);
        setGems(reshuffled.gems);
        setIsReshuffling(false);
      }

      comboCounter.current = 1;
      setIsProcessing(false);
    }
  }, [level, onObjectiveProgress, onScoreDelta]);

  // Process Removal of matched gems & special triggers
  const processMatchRemoval = async (
    currentGrid: (Gem | null)[][],
    currentTiles: BoardTile[][],
    matchedCoords: Set<string>,
    specialSpawns: { row: number; col: number; color: GemColor; special: Gem['special'] }[]
  ) => {
    const rows = level.rows;
    const cols = level.cols;
    const coordsToClear = new Set<string>(matchedCoords);
    let frostClearedCount = 0;
    const colorCollected: Record<string, number> = {};

    // 1. Process special power-ups that are inside the match set
    matchedCoords.forEach(coord => {
      const [r, c] = coord.split(',').map(Number);
      const gem = currentGrid[r][c];
      if (!gem) return;

      if (gem.special === 'beam_h') {
        soundEngine.playCleaverBeam();
        triggerBeam('beam_h', r);
        for (let col = 0; col < cols; col++) coordsToClear.add(`${r},${col}`);
      } else if (gem.special === 'beam_v') {
        soundEngine.playCleaverBeam();
        triggerBeam('beam_v', c);
        for (let row = 0; row < rows; row++) coordsToClear.add(`${row},${c}`);
      } else if (gem.special === 'bomb') {
        soundEngine.playBombExplosion();
        triggerExplosion(r, c, 1);
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              coordsToClear.add(`${nr},${nc}`);
            }
          }
        }
      }
    });

    // 2. Remove coords & damage adjacent tiles (frost / bramble)
    const updatedTiles = currentTiles.map(r => r.map(t => ({ ...t })));

    coordsToClear.forEach(coord => {
      const [r, c] = coord.split(',').map(Number);
      const gem = currentGrid[r][c];

      if (gem && gem.special !== 'relic') {
        colorCollected[gem.color] = (colorCollected[gem.color] || 0) + 1;
      }

      // Check tile damage
      if (updatedTiles[r] && updatedTiles[r][c]) {
        const obs = updatedTiles[r][c].obstacle;
        if (obs === 'frost_2') {
          updatedTiles[r][c].obstacle = 'frost_1';
          frostClearedCount++;
        } else if (obs === 'frost_1' || obs === 'bramble') {
          updatedTiles[r][c].obstacle = 'none';
          frostClearedCount++;
        }
      }

      // Also damage adjacent brambles
      const neighbors = [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1]
      ];
      neighbors.forEach(([nr, nc]) => {
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (updatedTiles[nr][nc].obstacle === 'bramble') {
            updatedTiles[nr][nc].obstacle = 'none';
            frostClearedCount++;
          }
        }
      });
    });

    // Update Objectives
    if (frostClearedCount > 0) {
      onObjectiveProgress('clear_frost', frostClearedCount);
    }
    Object.entries(colorCollected).forEach(([color, count]) => {
      onObjectiveProgress('collect_gems', count, color as GemColor);
    });

    // --- CONSECUTIVE TIME-BASED COMBO MULTIPLIER ---
    const now = Date.now();
    const timeSinceLast = now - lastMatchTimestamp.current;
    let newStreak = 1;

    if (lastMatchTimestamp.current > 0 && timeSinceLast <= COMBO_WINDOW_MS) {
      newStreak = (consecutiveMatches || 1) + 1;
    }

    lastMatchTimestamp.current = now;
    setConsecutiveMatches(newStreak);
    setLastMatchTime(now);

    // Multiplier calculation: 1.0 -> 1.5 -> 2.0 -> 2.5 -> 3.0 -> up to 5.0x
    const newMultiplier = Math.min(5.0, 1.0 + (newStreak - 1) * 0.5);
    setComboMultiplier(newMultiplier);
    comboMultiplierRef.current = newMultiplier;

    if (newMultiplier > 1.0) {
      soundEngine.playComboEscalation(newMultiplier);
      if (newStreak >= 2) {
        const tierName =
          newMultiplier >= 4.0
            ? '🔥 COSMIC OVERDRIVE!'
            : newMultiplier >= 3.0
            ? '⚡ MANA SURGE!'
            : newMultiplier >= 2.0
            ? '✨ ARCANE FLOW!'
            : '🌟 SPEED COMBO!';
        addFloatingText(`${tierName} ${newMultiplier.toFixed(1)}×`, 140, 110, '#fbbf24');
      }
    }

    const basePoints = coordsToClear.size * 60 * comboCounter.current;
    const pointsEarned = Math.round(basePoints * newMultiplier);
    onScoreDelta(pointsEarned);
    onObjectiveProgress('score', pointsEarned);

    if (newMultiplier > 1.0) {
      addFloatingText(`+${pointsEarned} (${newMultiplier.toFixed(1)}× Multiplier!)`, 140, 140, '#38bdf8');
    }

    // 3. Smooth Candy Crush spin animation: Mark matched stones to spin & pop with light
    const spinningGrid = currentGrid.map((rowArr, r) =>
      rowArr.map((gem, c) =>
        coordsToClear.has(`${r},${c}`) && gem ? { ...gem, isMatched: true } : gem
      )
    );
    setGems(spinningGrid);

    // Allow the smooth spin animation to complete gracefully
    await new Promise(res => setTimeout(res, 280));

    // Apply removal to grid
    const updatedGrid = spinningGrid.map((rowArr, r) =>
      rowArr.map((gem, c) => (coordsToClear.has(`${r},${c}`) ? null : gem))
    );

    // Place any new special power-ups formed from 4+ or T/L shapes
    specialSpawns.forEach(spawn => {
      updatedGrid[spawn.row][spawn.col] = {
        id: getNextId(),
        color: spawn.color,
        special: spawn.special,
        row: spawn.row,
        col: spawn.col
      };
      addFloatingText(
        spawn.special === 'singularity' ? '🌟 Cosmic Singularity!' : spawn.special === 'bomb' ? '💥 Elemental Burst!' : '⚡ Arcane Beam!',
        spawn.col * 48,
        spawn.row * 48,
        '#e0e7ff'
      );
    });

    setTiles(updatedTiles);
    setGems(updatedGrid);

    await new Promise(res => setTimeout(res, 200));
    applyGravityAndCascade(updatedGrid, updatedTiles);
  };

  // Perform Swap with Validation or Special Combo
  const executeSwap = async (r1: number, c1: number, r2: number, c2: number) => {
    if (isProcessing) return;
    setIsProcessing(true);
    soundEngine.playGemSwap();

    const g1 = gems[r1][c1];
    const g2 = gems[r2][c2];

    if (!g1 || !g2) {
      setIsProcessing(false);
      return;
    }

    // Trigger subtle arcane glow transition on the swapping adjacent pair
    setSwappingCoords({ r1, c1, r2, c2 });
    setTimeout(() => {
      setSwappingCoords(null);
    }, 360);

    // --- CHECK SPECIAL COMBO SWAPS ---
    // Singularity + Singularity: SUPERNOVA (Wipe whole board)
    if (g1.special === 'singularity' && g2.special === 'singularity') {
      onMoveConsumed();
      soundEngine.playSingularity();
      addFloatingText('🌌 SUPERNOVA CATACLYSM!', 120, 160, '#f43f5e');

      const allCoords = new Set<string>();
      for (let r = 0; r < level.rows; r++) {
        for (let c = 0; c < level.cols; c++) {
          allCoords.add(`${r},${c}`);
        }
      }
      await processMatchRemoval(gems, tiles, allCoords, []);
      return;
    }

    // Singularity + (Normal / Beam / Bomb)
    if (g1.special === 'singularity' || g2.special === 'singularity') {
      onMoveConsumed();
      soundEngine.playSingularity();
      const targetColor = g1.special === 'singularity' ? g2.color : g1.color;
      const partnerSpecial = g1.special === 'singularity' ? g2.special : g1.special;

      const coordsToWipe = new Set<string>();
      coordsToWipe.add(`${r1},${c1}`);
      coordsToWipe.add(`${r2},${c2}`);

      for (let r = 0; r < level.rows; r++) {
        for (let c = 0; c < level.cols; c++) {
          const item = gems[r][c];
          if (item && item.color === targetColor) {
            coordsToWipe.add(`${r},${c}`);
          }
        }
      }

      addFloatingText(
        partnerSpecial === 'beam_h' || partnerSpecial === 'beam_v'
          ? '⚡ Prismatic Laser Barrage!'
          : partnerSpecial === 'bomb'
          ? '💥 Prismatic Mega-Detonation!'
          : '✨ Singularity Absorption!',
        120,
        160,
        '#d8b4fe'
      );

      await processMatchRemoval(gems, tiles, coordsToWipe, []);
      return;
    }

    // Beam + Bomb combo: Giant 3-wide crosshair
    if (
      (g1.special.startsWith('beam') && g2.special === 'bomb') ||
      (g2.special.startsWith('beam') && g1.special === 'bomb')
    ) {
      onMoveConsumed();
      soundEngine.playBombExplosion();
      soundEngine.playCleaverBeam();
      addFloatingText('⚡💥 CROSSFIRE CLEAVE!', 120, 160, '#fbbf24');

      const crossCoords = new Set<string>();
      for (let dr = -1; dr <= 1; dr++) {
        const row = r2 + dr;
        if (row >= 0 && row < level.rows) {
          triggerBeam('beam_h', row);
          for (let c = 0; c < level.cols; c++) crossCoords.add(`${row},${c}`);
        }
      }
      for (let dc = -1; dc <= 1; dc++) {
        const col = c2 + dc;
        if (col >= 0 && col < level.cols) {
          triggerBeam('beam_v', col);
          for (let r = 0; r < level.rows; r++) crossCoords.add(`${r},${col}`);
        }
      }
      await processMatchRemoval(gems, tiles, crossCoords, []);
      return;
    }

    // Normal Swap Validation
    const nextGrid = gems.map(row => [...row]);
    nextGrid[r1][c1] = { ...g2, row: r1, col: c1 };
    nextGrid[r2][c2] = { ...g1, row: r2, col: c2 };

    const { allMatchedCoords, specialSpawns } = detectMatches(nextGrid);

    if (allMatchedCoords.size > 0) {
      // Valid move!
      onMoveConsumed();
      setGems(nextGrid);
      comboCounter.current = 1;
      soundEngine.playMatch(1, comboMultiplierRef.current);
      await processMatchRemoval(nextGrid, tiles, allMatchedCoords, specialSpawns);
    } else {
      // Invalid move -> wiggle and revert back
      setGems(nextGrid);
      await new Promise(res => setTimeout(res, 180));
      setGems(gems); // revert
      setIsProcessing(false);
    }
  };

  // Booster Cast Handler
  const handleBoosterCast = (targetRow: number, targetCol: number) => {
    if (!activeBooster) return;

    if (activeBooster === 'meteor') {
      soundEngine.playBooster('meteor');
      triggerExplosion(targetRow, targetCol, 1);
      addFloatingText('☄️ Meteor Strike!', targetCol * 48, targetRow * 48, '#f97316');

      const targetCoords = new Set<string>();
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = targetRow + dr;
          const nc = targetCol + dc;
          if (nr >= 0 && nr < level.rows && nc >= 0 && nc < level.cols) {
            targetCoords.add(`${nr},${nc}`);
          }
        }
      }
      onResetBooster();
      processMatchRemoval(gems, tiles, targetCoords, []);
    } else if (activeBooster === 'arcane_bolt') {
      soundEngine.playBooster('arcane_bolt');
      addFloatingText('⚡ Bolt!', targetCol * 48, targetRow * 48, '#38bdf8');
      const targetCoords = new Set<string>([`${targetRow},${targetCol}`]);
      onResetBooster();
      processMatchRemoval(gems, tiles, targetCoords, []);
    } else if (activeBooster === 'wand') {
      // Transmutation wand sets selection to swap with next clicked adjacent tile without match check
      if (!selectedGem) {
        setSelectedGem({ row: targetRow, col: targetCol });
        soundEngine.playGemSelect();
      } else {
        if (areAdjacent(selectedGem.row, selectedGem.col, targetRow, targetCol)) {
          soundEngine.playBooster('wand');
          addFloatingText('🪄 Transmutation!', targetCol * 48, targetRow * 48, '#c084fc');

          // Trigger subtle arcane glow transition on transmuting pair
          setSwappingCoords({ r1: selectedGem.row, c1: selectedGem.col, r2: targetRow, c2: targetCol });
          setTimeout(() => setSwappingCoords(null), 360);

          const nextGrid = gems.map(r => [...r]);
          const g1 = nextGrid[selectedGem.row][selectedGem.col]!;
          const g2 = nextGrid[targetRow][targetCol]!;

          nextGrid[selectedGem.row][selectedGem.col] = { ...g2, row: selectedGem.row, col: selectedGem.col };
          nextGrid[targetRow][targetCol] = { ...g1, row: targetRow, col: targetCol };

          setGems(nextGrid);
          setSelectedGem(null);
          onResetBooster();

          // Check if match formed
          const { allMatchedCoords, specialSpawns } = detectMatches(nextGrid);
          if (allMatchedCoords.size > 0) {
            processMatchRemoval(nextGrid, tiles, allMatchedCoords, specialSpawns);
          }
        } else {
          setSelectedGem({ row: targetRow, col: targetCol });
        }
      }
    }
  };

  // Click on Gem Tile
  const handleGemClick = (row: number, col: number) => {
    if (isProcessing) return;

    if (activeBooster) {
      handleBoosterCast(row, col);
      return;
    }

    if (!selectedGem) {
      setSelectedGem({ row, col });
      soundEngine.playGemSelect();
    } else {
      if (selectedGem.row === row && selectedGem.col === col) {
        setSelectedGem(null); // unselect
      } else if (areAdjacent(selectedGem.row, selectedGem.col, row, col)) {
        const prev = selectedGem;
        setSelectedGem(null);
        executeSwap(prev.row, prev.col, row, col);
      } else {
        // change selection to new gem
        setSelectedGem({ row, col });
        soundEngine.playGemSelect();
      }
    }
  };

  // Touch & Mouse Drag handlers
  const handlePointerDown = (row: number, col: number, e: React.PointerEvent) => {
    if (isProcessing || activeBooster) return;
    dragStartPos.current = { row, col, x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (row: number, col: number, e: React.PointerEvent) => {
    if (!dragStartPos.current || isProcessing) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    const threshold = 24;

    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      const fromR = dragStartPos.current.row;
      const fromC = dragStartPos.current.col;
      let toR = fromR;
      let toC = fromC;

      if (Math.abs(dx) > Math.abs(dy)) {
        toC = dx > 0 ? fromC + 1 : fromC - 1;
      } else {
        toR = dy > 0 ? fromR + 1 : fromR - 1;
      }

      if (toR >= 0 && toR < level.rows && toC >= 0 && toC < level.cols) {
        setSelectedGem(null);
        executeSwap(fromR, fromC, toR, toC);
      }
    }
    dragStartPos.current = null;
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center select-none" ref={boardRef}>
      {/* Combo Multiplier Frenzy Bar (isolated re-render timer for 60fps) */}
      <ComboFrenzyBar
        consecutiveMatches={consecutiveMatches}
        comboMultiplier={comboMultiplier}
        lastMatchTimestamp={lastMatchTime}
        comboWindowMs={COMBO_WINDOW_MS}
        onExpire={handleComboExpire}
      />

      {/* Board Frame Container */}
      <div
        className={`relative p-3 rounded-3xl bg-slate-950/80 border-2 transition-all duration-300 ${
          comboMultiplier >= 3.0
            ? 'border-amber-400/90 animate-frenzy-border'
            : 'border-purple-900/60 shadow-[0_0_30px_rgba(79,70,229,0.25)]'
        } backdrop-blur-xl`}
      >
        {/* Floating Text Component: Scaling Combo Multiplier on Chain Reactions */}
        {chainBannerData && (
          <ComboFloatingBanner
            multiplier={chainBannerData.multiplier}
            chainStep={chainBannerData.chainStep}
            triggerKey={chainBannerData.triggerKey}
          />
        )}

        {/* Floating notifications */}
        {floatingTexts.map(ft => (
          <div
            key={ft.id}
            className="absolute pointer-events-none z-30 font-extrabold text-sm md:text-base animate-bounce drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            style={{ left: ft.x, top: ft.y, color: ft.color }}
          >
            {ft.text}
          </div>
        ))}

        {/* Laser Beams */}
        {activeBeams.map(beam => (
          <div
            key={beam.id}
            className={`absolute pointer-events-none z-20 ${
              beam.type === 'beam_h'
                ? 'left-0 right-0 h-4 bg-cyan-300 animate-beam-h shadow-[0_0_20px_#38bdf8]'
                : 'top-0 bottom-0 w-4 bg-cyan-300 animate-beam-v shadow-[0_0_20px_#38bdf8]'
            }`}
            style={{
              top: beam.type === 'beam_h' ? `${(beam.row! + 0.5) * (100 / level.rows)}%` : 0,
              left: beam.type === 'beam_v' ? `${(beam.col! + 0.5) * (100 / level.cols)}%` : 0,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}

        {/* Explosion Rings */}
        {activeExplosions.map(exp => (
          <div
            key={exp.id}
            className="absolute pointer-events-none z-20 rounded-full border-4 border-amber-300 bg-amber-500/30 animate-ping shadow-[0_0_30px_#f59e0b]"
            style={{
              top: `${((exp.row - exp.radius) / level.rows) * 100}%`,
              left: `${((exp.col - exp.radius) / level.cols) * 100}%`,
              width: `${((exp.radius * 2 + 1) / level.cols) * 100}%`,
              height: `${((exp.radius * 2 + 1) / level.rows) * 100}%`
            }}
          />
        ))}

        {/* Reshuffle Overlay */}
        {isReshuffling && (
          <div className="absolute inset-0 z-30 bg-purple-950/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-2">
            <span className="text-4xl animate-spin">🌀</span>
            <span className="text-lg font-bold text-purple-200 font-cinzel">Reshuffling Ancient Runes...</span>
          </div>
        )}

        {/* Grid Container */}
        <div
          className="grid gap-1.5 touch-none"
          style={{
            gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))`,
            width: 'min(92vw, 460px)',
            height: 'min(92vw, 460px)'
          }}
        >
          {gems.map((rowArr, r) =>
            rowArr.map((gem, c) => {
              const tile = tiles[r]?.[c];
              const isSelected = selectedGem?.row === r && selectedGem?.col === c;
              const isSwapping =
                swappingCoords !== null &&
                ((swappingCoords.r1 === r && swappingCoords.c1 === c) ||
                  (swappingCoords.r2 === r && swappingCoords.c2 === c));
              const hasFrost1 = tile?.obstacle === 'frost_1';
              const hasFrost2 = tile?.obstacle === 'frost_2';
              const hasBramble = tile?.obstacle === 'bramble';

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleGemClick(r, c)}
                  onPointerDown={e => handlePointerDown(r, c, e)}
                  onPointerUp={e => handlePointerUp(r, c, e)}
                  className={`relative flex items-center justify-center rounded-2xl cursor-pointer transition-all duration-200 ${
                    (r + c) % 2 === 0 ? 'bg-slate-900/60' : 'bg-slate-800/40'
                  } ${
                    isSwapping
                      ? 'border-purple-400 ring-2 ring-purple-400/90 shadow-[0_0_24px_rgba(168,85,247,0.7),inset_0_0_12px_rgba(251,191,36,0.6)] z-20 scale-105'
                      : 'border-slate-800/60 hover:border-purple-500/40'
                  }`}
                >
                  {/* Subtle Arcane Leyline Transition Glow */}
                  {isSwapping && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/25 via-amber-400/30 to-purple-500/25 pointer-events-none animate-arcane-leyline z-20 flex items-center justify-center">
                      <span className="text-xs text-amber-200 filter drop-shadow-[0_0_6px_#f59e0b] animate-ping">✧</span>
                    </div>
                  )}

                  {/* Obstacle Layer: Frost */}
                  {hasFrost1 && (
                    <div className="absolute inset-0 rounded-2xl bg-cyan-400/25 border-2 border-cyan-300/60 shadow-[inset_0_0_8px_rgba(34,211,238,0.5)] z-10 pointer-events-none flex items-center justify-center">
                      <span className="text-xs opacity-75">❄️</span>
                    </div>
                  )}

                  {hasFrost2 && (
                    <div className="absolute inset-0 rounded-2xl bg-cyan-200/40 border-2 border-cyan-100 shadow-[inset_0_0_12px_rgba(103,232,249,0.8)] z-10 pointer-events-none flex items-center justify-center">
                      <span className="text-sm">🧊</span>
                    </div>
                  )}

                  {/* Obstacle Layer: Bramble */}
                  {hasBramble && (
                    <div className="absolute inset-0 rounded-2xl bg-emerald-950/80 border-2 border-emerald-600/80 shadow-[inset_0_0_10px_rgba(5,150,105,0.7)] z-10 pointer-events-none flex items-center justify-center">
                      <span className="text-sm">🌿</span>
                    </div>
                  )}

                  {/* Relic Exit Altar at Bottom Row */}
                  {tile?.hasRelicCollector && (
                    <div className="absolute -bottom-1 left-2 right-2 h-1 bg-amber-400/60 rounded-full blur-[1px] pointer-events-none" />
                  )}

                  {/* Gem Icon with Arcane Rune Idle breathing animation */}
                  {gem && (
                    <div className="w-full h-full p-1 flex items-center justify-center">
                      <ArcaneRuneIdle
                        row={r}
                        col={c}
                        isIdle={!gem.isMatched && !isSelected && !isSwapping}
                      >
                        <GemIcon
                          color={gem.color}
                          special={gem.special}
                          isSelected={isSelected}
                          isMatched={gem.isMatched}
                          isSwapping={isSwapping}
                          size={48}
                        />
                      </ArcaneRuneIdle>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
