export type GemColor = 'ruby' | 'sapphire' | 'emerald' | 'topaz' | 'amethyst' | 'diamond';

export type SpecialType = 'none' | 'beam_h' | 'beam_v' | 'bomb' | 'singularity' | 'relic';

export type ObstacleType = 'none' | 'frost_1' | 'frost_2' | 'bramble';

export interface Gem {
  id: string;
  color: GemColor;
  special: SpecialType;
  row: number;
  col: number;
  isMatched?: boolean;
  isNew?: boolean;
}

export interface BoardTile {
  row: number;
  col: number;
  obstacle: ObstacleType;
  hasRelicCollector?: boolean; // bottom tile where relics exit
}

export interface LevelObjective {
  type: 'score' | 'clear_frost' | 'collect_gems' | 'collect_relics';
  target: number;
  current: number;
  gemColor?: GemColor;
  label: string;
}

export interface LevelConfig {
  id: number;
  realmId: number;
  realmName: string;
  name: string;
  subtitle: string;
  rows: number;
  cols: number;
  moves: number;
  timeLimit?: number; // for rush modes
  objectives: LevelObjective[];
  obstaclesLayout?: { row: number; col: number; type: ObstacleType }[];
  initialRelics?: { row: number; col: number }[];
  starThresholds: [number, number, number];
  colorPalette?: GemColor[];
  lore: string;
}

export type BoosterType = 'meteor' | 'arcane_bolt' | 'chrono' | 'wand' | 'shuffle';

export interface BoosterInfo {
  id: BoosterType;
  name: string;
  description: string;
  icon: string;
  cost: number;
}

export interface PlayerInventory {
  meteor: number;
  arcane_bolt: number;
  chrono: number;
  wand: number;
  shuffle: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  gold: number;
  stardust: number;
  unlockedLevel: number;
  levelStars: Record<number, number>; // levelId -> stars (1-3)
  highScores: Record<number, number>; // levelId -> score
  endlessHighScore: number;
  inventory: PlayerInventory;
  activeBoardTheme: 'arcane_obsidian' | 'astral_void' | 'crystal_glade';
  victoryStreak?: number; // Consecutive levels completed without losing
  highestVictoryStreak?: number; // All-time highest consecutive victory streak
}

export function getVictoryStreakMultiplier(streak: number = 0): number {
  if (streak <= 1) return 1.0;
  return Number((1.0 + Math.min(10, streak - 1) * 0.15).toFixed(2));
}

export interface LeaderboardEntry {
  id: string;
  rank?: number;
  name: string;
  title: string;
  avatar: string;
  score: number;
  levelInfo: string;
  mode: 'campaign' | 'endless' | 'duel';
  date: string;
  isPlayer?: boolean;
  tier: 'Novice' | 'Adept' | 'Sorcerer' | 'Archmage' | 'Celestial';
}

export interface DailyRewardDay {
  day: number;
  rewardType: 'gold' | 'booster' | 'cosmetic' | 'chest';
  title: string;
  amount?: number;
  booster?: BoosterType;
  claimed: boolean;
  iconName: string;
}

export interface SeasonQuest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  rewardStardust: number;
  completed: boolean;
}

export interface SeasonTier {
  tier: number;
  stardustRequired: number;
  rewardName: string;
  rewardType: 'gold' | 'booster' | 'title' | 'theme' | 'avatar';
  amount?: number;
  booster?: BoosterType;
  unlocked: boolean;
  claimed: boolean;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  scale?: number;
}

export interface BeamEffect {
  id: string;
  type: 'beam_h' | 'beam_v';
  row?: number;
  col?: number;
}

export interface ExplosionEffect {
  id: string;
  row: number;
  col: number;
  color: string;
  radius: number;
}
