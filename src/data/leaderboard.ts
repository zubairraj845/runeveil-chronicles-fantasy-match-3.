import { LeaderboardEntry } from '../types/game';

export const GLOBAL_LEADERBOARD_SEED: LeaderboardEntry[] = [
  {
    id: 'lb_1',
    rank: 1,
    name: 'Aurelia Solspinner',
    title: 'Grand Celestial Archmage',
    avatar: '✨',
    score: 148200,
    levelInfo: 'Realm 4 · Sanctum of Starlight',
    mode: 'campaign',
    date: 'Today at 08:14',
    tier: 'Celestial'
  },
  {
    id: 'lb_2',
    rank: 2,
    name: 'Vaelin Shadowweaver',
    title: 'Void Sovereign',
    avatar: '🔮',
    score: 139550,
    levelInfo: 'Realm 4 · Void Rift Anomaly',
    mode: 'campaign',
    date: 'Yesterday',
    tier: 'Celestial'
  },
  {
    id: 'lb_3',
    rank: 3,
    name: 'Ignis Emberheart',
    title: 'Dragon Flame Invoker',
    avatar: '🔥',
    score: 124800,
    levelInfo: 'Realm 3 · Trial of Cinders',
    mode: 'campaign',
    date: '2 days ago',
    tier: 'Archmage'
  },
  {
    id: 'lb_4',
    rank: 4,
    name: 'Lysandra Stormcaller',
    title: 'Tempest Oracle',
    avatar: '⚡',
    score: 112400,
    levelInfo: 'Realm 3 · The Dragon Hatchery',
    mode: 'campaign',
    date: '3 days ago',
    tier: 'Archmage'
  },
  {
    id: 'lb_5',
    rank: 5,
    name: 'Rowan Sylvanblade',
    title: 'Verdant Enchanter',
    avatar: '🌿',
    score: 98600,
    levelInfo: 'Realm 2 · Singularity Convergence',
    mode: 'campaign',
    date: '4 days ago',
    tier: 'Sorcerer'
  },
  {
    id: 'lb_6',
    rank: 6,
    name: 'Zephyr Nightwalker',
    title: 'Astral Wanderer',
    avatar: '🌙',
    score: 87400,
    levelInfo: 'Realm 2 · The Phoenix Relic',
    mode: 'campaign',
    date: '5 days ago',
    tier: 'Sorcerer'
  },
  {
    id: 'lb_7',
    rank: 7,
    name: 'Morrigan Deepcaller',
    title: 'Tide Adept',
    avatar: '💧',
    score: 74200,
    levelInfo: 'Realm 2 · Glacial Mirrors',
    mode: 'campaign',
    date: '5 days ago',
    tier: 'Adept'
  },
  {
    id: 'lb_8',
    rank: 8,
    name: 'Kaelen Sunstride',
    title: 'Solar Apprentice',
    avatar: '☀️',
    score: 62000,
    levelInfo: 'Realm 1 · Tangle of Brambles',
    mode: 'campaign',
    date: '6 days ago',
    tier: 'Novice'
  },

  // Endless Rush entries
  {
    id: 'lb_endless_1',
    rank: 1,
    name: 'Aurelia Solspinner',
    title: 'Grand Celestial Archmage',
    avatar: '✨',
    score: 68400,
    levelInfo: 'Endless Arcane Rush (90s)',
    mode: 'endless',
    date: 'Today at 09:30',
    tier: 'Celestial'
  },
  {
    id: 'lb_endless_2',
    rank: 2,
    name: 'Chronos Weaver',
    title: 'Time Sovereign',
    avatar: '⏳',
    score: 54900,
    levelInfo: 'Endless Arcane Rush (90s)',
    mode: 'endless',
    date: 'Today at 07:15',
    tier: 'Celestial'
  },
  {
    id: 'lb_endless_3',
    rank: 3,
    name: 'Vaelin Shadowweaver',
    title: 'Void Sovereign',
    avatar: '🔮',
    score: 49800,
    levelInfo: 'Endless Arcane Rush (90s)',
    mode: 'endless',
    date: 'Yesterday',
    tier: 'Archmage'
  },
  {
    id: 'lb_endless_4',
    rank: 4,
    name: 'Sylas Runebound',
    title: 'Fast-Cast Sorcerer',
    avatar: '⚡',
    score: 41200,
    levelInfo: 'Endless Arcane Rush (90s)',
    mode: 'endless',
    date: '2 days ago',
    tier: 'Archmage'
  },
  {
    id: 'lb_endless_5',
    rank: 5,
    name: 'Elysia Frostspire',
    title: 'Ice Maiden',
    avatar: '❄️',
    score: 33500,
    levelInfo: 'Endless Arcane Rush (90s)',
    mode: 'endless',
    date: '3 days ago',
    tier: 'Sorcerer'
  },

  // Duel Mode entries
  {
    id: 'lb_duel_1',
    rank: 1,
    name: 'Valerius Battlemage',
    title: 'Undefeated Duelist (W: 34 / L: 2)',
    avatar: '⚔️',
    score: 2850,
    levelInfo: 'Duel Arena Rating',
    mode: 'duel',
    date: 'Today',
    tier: 'Celestial'
  },
  {
    id: 'lb_duel_2',
    rank: 2,
    name: 'Ignis Emberheart',
    title: 'Dragon Flame Invoker (W: 29 / L: 5)',
    avatar: '🔥',
    score: 2620,
    levelInfo: 'Duel Arena Rating',
    mode: 'duel',
    date: 'Yesterday',
    tier: 'Archmage'
  },
  {
    id: 'lb_duel_3',
    rank: 3,
    name: 'Morgana Hexblade',
    title: 'Curse Weaver (W: 24 / L: 7)',
    avatar: '👁️',
    score: 2410,
    levelInfo: 'Duel Arena Rating',
    mode: 'duel',
    date: '2 days ago',
    tier: 'Archmage'
  }
];

export const BOOSTER_DETAILS = [
  {
    id: 'meteor',
    name: 'Meteor Strike',
    description: 'Obliterates an entire 3x3 block of runes and obstacles with dragonfire.',
    icon: '☄️',
    cost: 400
  },
  {
    id: 'arcane_bolt',
    name: 'Arcane Bolt',
    description: 'Shatters any single designated rune, frost layer, or stubborn bramble.',
    icon: '⚡',
    cost: 200
  },
  {
    id: 'chrono',
    name: 'Chrono Hourglass',
    description: 'Rewinds the magical sand to grant +5 extra moves in current level.',
    icon: '⏳',
    cost: 350
  },
  {
    id: 'wand',
    name: 'Transmutation Wand',
    description: 'Forcibly swaps any two adjacent runes, even if they do not match!',
    icon: '🪄',
    cost: 300
  },
  {
    id: 'shuffle',
    name: 'Prismatic Swirl',
    description: 'Re-enchants the entire board, reshuffling all remaining gems into high synergy.',
    icon: '🌀',
    cost: 250
  }
];
