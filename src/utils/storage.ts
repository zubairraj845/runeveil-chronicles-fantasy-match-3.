import { PlayerProfile, DailyRewardDay, SeasonQuest, SeasonTier, LeaderboardEntry, BoosterType } from '../types/game';
import { INITIAL_SEASON_QUESTS, SEASON_TIERS } from '../data/seasonal';
import { GLOBAL_LEADERBOARD_SEED } from '../data/leaderboard';

const PROFILE_KEY = 'runeveil_player_profile';
const DAILY_REWARDS_KEY = 'runeveil_daily_rewards';
const LAST_LOGIN_DATE_KEY = 'runeveil_last_login_date';
const SEASON_QUESTS_KEY = 'runeveil_season_quests';
const SEASON_TIERS_KEY = 'runeveil_season_tiers';
const LEADERBOARD_KEY = 'runeveil_leaderboard';

const DEFAULT_PROFILE: PlayerProfile = {
  id: 'player_user_1',
  name: 'Archmage Apprentice',
  title: 'Novice of the Astral Circle',
  avatar: '🧙‍♂️',
  gold: 850,
  stardust: 320,
  unlockedLevel: 1,
  levelStars: {},
  highScores: {},
  endlessHighScore: 0,
  inventory: {
    meteor: 2,
    arcane_bolt: 3,
    chrono: 2,
    wand: 1,
    shuffle: 2
  },
  activeBoardTheme: 'arcane_obsidian',
  victoryStreak: 0,
  highestVictoryStreak: 0
};

export const SEVEN_DAY_REWARDS: DailyRewardDay[] = [
  { day: 1, rewardType: 'gold', title: '250 Gold Coins', amount: 250, claimed: false, iconName: '🪙' },
  { day: 2, rewardType: 'booster', title: '1x Arcane Bolt', booster: 'arcane_bolt', amount: 1, claimed: false, iconName: '⚡' },
  { day: 3, rewardType: 'booster', title: '1x Chrono Hourglass', booster: 'chrono', amount: 1, claimed: false, iconName: '⏳' },
  { day: 4, rewardType: 'gold', title: '500 Gold Coins', amount: 500, claimed: false, iconName: '🪙' },
  { day: 5, rewardType: 'booster', title: '1x Meteor Strike', booster: 'meteor', amount: 1, claimed: false, iconName: '☄️' },
  { day: 6, rewardType: 'booster', title: '1x Transmutation Wand', booster: 'wand', amount: 1, claimed: false, iconName: '🪄' },
  { day: 7, rewardType: 'chest', title: 'Mythic Celestial Reliquary (1000 Gold + All Boosters + 100 Stardust)', amount: 1000, claimed: false, iconName: '✨' },
];

export function getPlayerProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      savePlayerProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function savePlayerProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
}

export function updatePlayerProfile(partial: Partial<PlayerProfile>): PlayerProfile {
  const current = getPlayerProfile();
  const updated = { ...current, ...partial };
  savePlayerProfile(updated);
  return updated;
}

export function addInventoryItem(booster: BoosterType, amount: number = 1): PlayerProfile {
  const profile = getPlayerProfile();
  const currentCount = profile.inventory[booster] || 0;
  profile.inventory[booster] = currentCount + amount;
  savePlayerProfile(profile);
  return profile;
}

export function consumeInventoryItem(booster: BoosterType): boolean {
  const profile = getPlayerProfile();
  const currentCount = profile.inventory[booster] || 0;
  if (currentCount <= 0) return false;
  profile.inventory[booster] = currentCount - 1;
  savePlayerProfile(profile);
  return true;
}

// --- Daily Rewards System ---

export interface DailyRewardsState {
  currentStreak: number;
  lastClaimDate: string | null;
  canClaimToday: boolean;
  days: DailyRewardDay[];
}

export function getDailyRewardsState(): DailyRewardsState {
  const todayStr = new Date().toISOString().split('T')[0];
  const lastClaim = localStorage.getItem(LAST_LOGIN_DATE_KEY);
  let streak = parseInt(localStorage.getItem('runeveil_daily_streak') || '1', 10);
  if (isNaN(streak) || streak < 1) streak = 1;

  let days = SEVEN_DAY_REWARDS;
  const rawDays = localStorage.getItem(DAILY_REWARDS_KEY);
  if (rawDays) {
    try {
      days = JSON.parse(rawDays);
    } catch {
      days = SEVEN_DAY_REWARDS;
    }
  }

  const canClaimToday = lastClaim !== todayStr;

  return {
    currentStreak: streak,
    lastClaimDate: lastClaim,
    canClaimToday,
    days
  };
}

export function claimDailyReward(): { success: boolean; reward: DailyRewardDay; profile: PlayerProfile } {
  const state = getDailyRewardsState();
  if (!state.canClaimToday) {
    return { success: false, reward: state.days[0], profile: getPlayerProfile() };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const claimIdx = (state.currentStreak - 1) % 7;
  const currentReward = state.days[claimIdx];

  // Mark claimed
  const updatedDays = state.days.map((d, i) => {
    if (i === claimIdx) {
      return { ...d, claimed: true };
    }
    return d;
  });

  // Grant rewards
  let profile = getPlayerProfile();
  if (currentReward.rewardType === 'gold' && currentReward.amount) {
    profile.gold += currentReward.amount;
  } else if (currentReward.rewardType === 'booster' && currentReward.booster) {
    profile.inventory[currentReward.booster] = (profile.inventory[currentReward.booster] || 0) + (currentReward.amount || 1);
  } else if (currentReward.rewardType === 'chest') {
    profile.gold += 1000;
    profile.stardust += 100;
    profile.inventory.meteor += 1;
    profile.inventory.arcane_bolt += 1;
    profile.inventory.chrono += 1;
    profile.inventory.wand += 1;
    profile.inventory.shuffle += 1;
  }

  savePlayerProfile(profile);

  // Update streak and last claim
  const nextStreak = (state.currentStreak >= 7) ? 1 : state.currentStreak + 1;
  localStorage.setItem(LAST_LOGIN_DATE_KEY, todayStr);
  localStorage.setItem('runeveil_daily_streak', String(nextStreak));

  // If completing 7 days, reset claimed states for next loop
  if (state.currentStreak >= 7) {
    localStorage.setItem(DAILY_REWARDS_KEY, JSON.stringify(SEVEN_DAY_REWARDS));
  } else {
    localStorage.setItem(DAILY_REWARDS_KEY, JSON.stringify(updatedDays));
  }

  return { success: true, reward: currentReward, profile };
}

// --- Leaderboard Storage & Sync ---

export function getLeaderboard(mode: 'campaign' | 'endless' | 'duel'): LeaderboardEntry[] {
  let list: LeaderboardEntry[] = GLOBAL_LEADERBOARD_SEED.filter(e => e.mode === mode);
  try {
    const raw = localStorage.getItem(`${LEADERBOARD_KEY}_${mode}`);
    if (raw) {
      const stored = JSON.parse(raw);
      if (Array.isArray(stored) && stored.length > 0) {
        list = stored;
      }
    }
  } catch {
    // fallback to seed
  }

  // Inject or update user's entry if player has a score
  const profile = getPlayerProfile();
  let userScore = 0;
  let levelInfo = 'Realm 1 · Awakening of the Runes';

  if (mode === 'campaign') {
    // Sum of highest scores or single highest
    const scores = Object.values(profile.highScores);
    userScore = scores.reduce((a, b) => a + b, 0);
    levelInfo = `Unlocked Realm ${Math.min(4, Math.ceil(profile.unlockedLevel / 3))} (Lv. ${profile.unlockedLevel})`;
  } else if (mode === 'endless') {
    userScore = profile.endlessHighScore;
    levelInfo = 'Endless Arcane Rush (90s)';
  } else if (mode === 'duel') {
    userScore = 2100;
    levelInfo = 'Sorcerer Duelist';
  }

  if (userScore > 0) {
    const existingIdx = list.findIndex(e => e.isPlayer);
    const userEntry: LeaderboardEntry = {
      id: 'player_me',
      name: profile.name,
      title: profile.title,
      avatar: profile.avatar,
      score: userScore,
      levelInfo,
      mode,
      date: 'Just now',
      isPlayer: true,
      tier: userScore > 100000 ? 'Celestial' : userScore > 60000 ? 'Archmage' : userScore > 30000 ? 'Sorcerer' : 'Adept'
    };

    if (existingIdx >= 0) {
      if (userScore > list[existingIdx].score) {
        list[existingIdx] = userEntry;
      }
    } else {
      list.push(userEntry);
    }
  }

  // Sort descending and re-rank
  list.sort((a, b) => b.score - a.score);
  return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
}

export function submitScore(mode: 'campaign' | 'endless' | 'duel', score: number, levelName: string): LeaderboardEntry[] {
  const profile = getPlayerProfile();
  const list = getLeaderboard(mode);

  const existingIdx = list.findIndex(e => e.isPlayer);
  const userEntry: LeaderboardEntry = {
    id: 'player_me',
    name: profile.name,
    title: profile.title,
    avatar: profile.avatar,
    score: existingIdx >= 0 ? Math.max(score, list[existingIdx].score) : score,
    levelInfo: levelName,
    mode,
    date: 'Just now',
    isPlayer: true,
    tier: score > 100000 ? 'Celestial' : score > 60000 ? 'Archmage' : score > 30000 ? 'Sorcerer' : 'Adept'
  };

  if (existingIdx >= 0) {
    list[existingIdx] = userEntry;
  } else {
    list.push(userEntry);
  }

  list.sort((a, b) => b.score - a.score);
  const ranked = list.map((item, idx) => ({ ...item, rank: idx + 1 }));

  try {
    localStorage.setItem(`${LEADERBOARD_KEY}_${mode}`, JSON.stringify(ranked));
  } catch (e) {
    console.error(e);
  }

  return ranked;
}

// --- Seasonal Data ---

export function getSeasonQuests(): SeasonQuest[] {
  try {
    const raw = localStorage.getItem(SEASON_QUESTS_KEY);
    if (!raw) return INITIAL_SEASON_QUESTS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_SEASON_QUESTS;
  }
}

export function saveSeasonQuests(quests: SeasonQuest[]): void {
  try {
    localStorage.setItem(SEASON_QUESTS_KEY, JSON.stringify(quests));
  } catch (e) {
    console.error(e);
  }
}

export function updateQuestProgress(questId: string, delta: number): void {
  const quests = getSeasonQuests();
  let stardustReward = 0;
  const updated = quests.map(q => {
    if (q.id === questId && !q.completed) {
      const newProgress = Math.min(q.target, q.progress + delta);
      const nowCompleted = newProgress >= q.target;
      if (nowCompleted) {
        stardustReward += q.rewardStardust;
      }
      return { ...q, progress: newProgress, completed: nowCompleted };
    }
    return q;
  });

  saveSeasonQuests(updated);

  if (stardustReward > 0) {
    const profile = getPlayerProfile();
    profile.stardust += stardustReward;
    savePlayerProfile(profile);
  }
}

export function getSeasonTiers(): SeasonTier[] {
  try {
    const raw = localStorage.getItem(SEASON_TIERS_KEY);
    if (!raw) return SEASON_TIERS;
    return JSON.parse(raw);
  } catch {
    return SEASON_TIERS;
  }
}

export function saveSeasonTiers(tiers: SeasonTier[]): void {
  try {
    localStorage.setItem(SEASON_TIERS_KEY, JSON.stringify(tiers));
  } catch (e) {
    console.error(e);
  }
}
