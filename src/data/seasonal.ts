import { SeasonQuest, SeasonTier } from '../types/game';

export const CURRENT_SEASON = {
  id: 'season_astral_dragon',
  title: 'Eclipse of the Astral Dragon',
  subtitle: 'Season 1 · Cosmic Convergence',
  description: 'The Astral Dragon reawakens across the celestial ley lines. Harness starfall runes, complete heroic trials, and claim exclusive galactic relics.',
  bannerImage: '/src/assets/images/seasonal_event_banner_1790754483850.jpg',
  daysRemaining: 18,
};

export const INITIAL_SEASON_QUESTS: SeasonQuest[] = [
  {
    id: 'quest_1',
    title: 'Arcane Artificer',
    description: 'Forge 12 special power-up gems (Line Cleavers, Bombs, or Singularity Orbs)',
    progress: 3,
    target: 12,
    rewardStardust: 120,
    completed: false
  },
  {
    id: 'quest_2',
    title: 'Frost & Thorn Breaker',
    description: 'Shatter 25 Frost or Bramble tiles across any realm',
    progress: 8,
    target: 25,
    rewardStardust: 150,
    completed: false
  },
  {
    id: 'quest_3',
    title: 'Cascade Conductor',
    description: 'Trigger a 4x or higher combo cascade in a single move',
    progress: 1,
    target: 1,
    rewardStardust: 180,
    completed: true // instant gratification trial
  },
  {
    id: 'quest_4',
    title: 'Sacred Relic Extractor',
    description: 'Deliver 4 Phoenix Feathers or Dragon Eggs to the altar',
    progress: 2,
    target: 4,
    rewardStardust: 200,
    completed: false
  },
  {
    id: 'quest_5',
    title: 'Spell Duel Victor',
    description: 'Overcome a rival sorcerer in the Arcane Duel Arena',
    progress: 0,
    target: 1,
    rewardStardust: 250,
    completed: false
  },
  {
    id: 'quest_6',
    title: 'Endless Astral Frenzy',
    description: 'Score 18,000+ points in Endless Arcane Rush mode',
    progress: 0,
    target: 18000,
    rewardStardust: 220,
    completed: false
  }
];

export const SEASON_TIERS: SeasonTier[] = [
  {
    tier: 1,
    stardustRequired: 100,
    rewardName: '500 Gold Coins',
    rewardType: 'gold',
    amount: 500,
    unlocked: true,
    claimed: true
  },
  {
    tier: 2,
    stardustRequired: 250,
    rewardName: '2x Chrono Hourglasses (+5 Moves)',
    rewardType: 'booster',
    booster: 'chrono',
    amount: 2,
    unlocked: true,
    claimed: false
  },
  {
    tier: 3,
    stardustRequired: 450,
    rewardName: '2x Meteor Strike Boosters',
    rewardType: 'booster',
    booster: 'meteor',
    amount: 2,
    unlocked: false,
    claimed: false
  },
  {
    tier: 4,
    stardustRequired: 700,
    rewardName: 'Title: "Astral Wanderer"',
    rewardType: 'title',
    unlocked: false,
    claimed: false
  },
  {
    tier: 5,
    stardustRequired: 1050,
    rewardName: '2x Transmutation Wands',
    rewardType: 'booster',
    booster: 'wand',
    amount: 2,
    unlocked: false,
    claimed: false
  },
  {
    tier: 6,
    stardustRequired: 1450,
    rewardName: '1,500 Gold + 3x Arcane Bolts',
    rewardType: 'gold',
    amount: 1500,
    unlocked: false,
    claimed: false
  },
  {
    tier: 7,
    stardustRequired: 1900,
    rewardName: 'Title: "Eclipse Harbinger"',
    rewardType: 'title',
    unlocked: false,
    claimed: false
  },
  {
    tier: 8,
    stardustRequired: 2400,
    rewardName: 'Cosmetic Board: "Astral Void"',
    rewardType: 'theme',
    unlocked: false,
    claimed: false
  },
  {
    tier: 9,
    stardustRequired: 3000,
    rewardName: 'Grand Sorcerer Pack (3x All Boosters)',
    rewardType: 'booster',
    amount: 3,
    unlocked: false,
    claimed: false
  },
  {
    tier: 10,
    stardustRequired: 3700,
    rewardName: 'Celestial Dragon Avatar & Crest',
    rewardType: 'avatar',
    unlocked: false,
    claimed: false
  }
];
