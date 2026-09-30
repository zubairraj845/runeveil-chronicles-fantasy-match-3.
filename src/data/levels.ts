import { LevelConfig, GemColor } from '../types/game';

export const ALL_GEM_COLORS: GemColor[] = ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'];

export const CAMPAIGN_LEVELS: LevelConfig[] = [
  // --- REALM 1: Whispering Wilds ---
  {
    id: 1,
    realmId: 1,
    realmName: 'Whispering Wilds',
    name: 'Awakening of the Runes',
    subtitle: 'Learn the arcane resonance of 4-gem line cleavers',
    rows: 8,
    cols: 8,
    moves: 20,
    colorPalette: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst'],
    starThresholds: [2000, 3800, 6000],
    objectives: [
      { type: 'score', target: 2000, current: 0, label: 'Score 2,000 Points' }
    ],
    lore: 'The ancient monoliths of the Wilds stir. Align the elemental runes to channel their latent power.'
  },
  {
    id: 2,
    realmId: 1,
    realmName: 'Whispering Wilds',
    name: 'Amberglade Harvest',
    subtitle: 'Channel Dragonfire and Earth mana',
    rows: 8,
    cols: 8,
    moves: 22,
    colorPalette: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst'],
    starThresholds: [3500, 6000, 9000],
    objectives: [
      { type: 'collect_gems', gemColor: 'ruby', target: 16, current: 0, label: 'Gather 16 Dragonfire Rubies' },
      { type: 'collect_gems', gemColor: 'emerald', target: 16, current: 0, label: 'Gather 16 Gaia Emeralds' }
    ],
    lore: 'Sylvan sprites whisper that matching 5 runes in an L or T shape creates an explosive Elemental Bomb.'
  },
  {
    id: 3,
    realmId: 1,
    realmName: 'Whispering Wilds',
    name: 'Tangle of Brambles',
    subtitle: 'Shatter corrupting thorn roots with adjacent matches',
    rows: 8,
    cols: 8,
    moves: 24,
    colorPalette: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst'],
    starThresholds: [4500, 7500, 11000],
    objectives: [
      { type: 'clear_frost', target: 12, current: 0, label: 'Purge 12 Corrupted Tiles' }
    ],
    obstaclesLayout: [
      { row: 3, col: 2, type: 'bramble' },
      { row: 3, col: 3, type: 'bramble' },
      { row: 3, col: 4, type: 'bramble' },
      { row: 3, col: 5, type: 'bramble' },
      { row: 4, col: 2, type: 'bramble' },
      { row: 4, col: 3, type: 'bramble' },
      { row: 4, col: 4, type: 'bramble' },
      { row: 4, col: 5, type: 'bramble' },
      { row: 2, col: 3, type: 'bramble' },
      { row: 2, col: 4, type: 'bramble' },
      { row: 5, col: 3, type: 'bramble' },
      { row: 5, col: 4, type: 'bramble' }
    ],
    lore: 'Void thorns entangle the ground. Unleash Line Cleavers or adjacent matches to tear them away.'
  },

  // --- REALM 2: Crystal Caverns of Navora ---
  {
    id: 4,
    realmId: 2,
    realmName: 'Crystal Caverns',
    name: 'Glacial Mirrors',
    subtitle: 'Break double-layered ice covering the runes',
    rows: 8,
    cols: 8,
    moves: 24,
    colorPalette: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    starThresholds: [5000, 8500, 13000],
    objectives: [
      { type: 'clear_frost', target: 16, current: 0, label: 'Shatter 16 Frost Tiles' }
    ],
    obstaclesLayout: [
      { row: 1, col: 1, type: 'frost_1' }, { row: 1, col: 2, type: 'frost_1' },
      { row: 1, col: 5, type: 'frost_1' }, { row: 1, col: 6, type: 'frost_1' },
      { row: 2, col: 2, type: 'frost_2' }, { row: 2, col: 5, type: 'frost_2' },
      { row: 3, col: 3, type: 'frost_2' }, { row: 3, col: 4, type: 'frost_2' },
      { row: 4, col: 3, type: 'frost_2' }, { row: 4, col: 4, type: 'frost_2' },
      { row: 5, col: 2, type: 'frost_2' }, { row: 5, col: 5, type: 'frost_2' },
      { row: 6, col: 1, type: 'frost_1' }, { row: 6, col: 2, type: 'frost_1' },
      { row: 6, col: 5, type: 'frost_1' }, { row: 6, col: 6, type: 'frost_1' }
    ],
    lore: 'Deep within Navora, ancient frost encases magical crystals. Match runes atop frost to shatter the rime.'
  },
  {
    id: 5,
    realmId: 2,
    realmName: 'Crystal Caverns',
    name: 'The Phoenix Relic',
    subtitle: 'Guide sacred Phoenix relics safely to the bottom row',
    rows: 8,
    cols: 8,
    moves: 25,
    colorPalette: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    starThresholds: [6000, 10000, 15000],
    initialRelics: [
      { row: 0, col: 2 },
      { row: 0, col: 5 }
    ],
    objectives: [
      { type: 'collect_relics', target: 2, current: 0, label: 'Recover 2 Phoenix Feathers' },
      { type: 'score', target: 5000, current: 0, label: 'Score 5,000 Points' }
    ],
    lore: 'Holy feathers from the astral firebird lie trapped. Clear the path beneath them so they drop into your reliquary.'
  },
  {
    id: 6,
    realmId: 2,
    realmName: 'Crystal Caverns',
    name: 'Singularity Convergence',
    subtitle: 'Form 5-in-a-row to forge a Cosmic Singularity Orb',
    rows: 8,
    cols: 8,
    moves: 23,
    colorPalette: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst'],
    starThresholds: [7000, 12000, 18000],
    objectives: [
      { type: 'collect_gems', gemColor: 'amethyst', target: 20, current: 0, label: 'Gather 20 Void Amethysts' },
      { type: 'collect_gems', gemColor: 'sapphire', target: 20, current: 0, label: 'Gather 20 Ocean Sapphires' },
      { type: 'score', target: 7000, current: 0, label: 'Score 7,000 Points' }
    ],
    lore: 'Swapping a Singularity Orb with a Line Cleaver turns ALL gems of that color into line cleavers! Master this combo.'
  },

  // --- REALM 3: Dragonspire Caldera ---
  {
    id: 7,
    realmId: 3,
    realmName: 'Dragonspire Caldera',
    name: 'Trial of Cinders',
    subtitle: 'Eradicate heavy corruption in volcanic heat',
    rows: 8,
    cols: 8,
    moves: 25,
    colorPalette: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    starThresholds: [8000, 14000, 20000],
    objectives: [
      { type: 'clear_frost', target: 18, current: 0, label: 'Clear 18 Ash Rime Tiles' },
      { type: 'collect_gems', gemColor: 'ruby', target: 22, current: 0, label: 'Gather 22 Dragonfire Rubies' }
    ],
    obstaclesLayout: [
      { row: 2, col: 1, type: 'frost_2' }, { row: 2, col: 6, type: 'frost_2' },
      { row: 3, col: 2, type: 'bramble' }, { row: 3, col: 5, type: 'bramble' },
      { row: 4, col: 2, type: 'bramble' }, { row: 4, col: 5, type: 'bramble' },
      { row: 5, col: 1, type: 'frost_2' }, { row: 5, col: 6, type: 'frost_2' },
      { row: 3, col: 3, type: 'frost_1' }, { row: 3, col: 4, type: 'frost_1' },
      { row: 4, col: 3, type: 'frost_1' }, { row: 4, col: 4, type: 'frost_1' },
      { row: 1, col: 3, type: 'frost_1' }, { row: 1, col: 4, type: 'frost_1' },
      { row: 6, col: 3, type: 'frost_1' }, { row: 6, col: 4, type: 'frost_1' }
    ],
    lore: 'The obsidian caldera demands fierce sorcery. Combine Bombs with Cleavers to fire catastrophic 3x3 laser crosshairs.'
  },
  {
    id: 8,
    realmId: 3,
    realmName: 'Dragonspire Caldera',
    name: 'The Dragon Hatchery',
    subtitle: 'Drop 3 sacred Dragon Eggs while clearing obstacles',
    rows: 8,
    cols: 8,
    moves: 26,
    colorPalette: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    starThresholds: [9000, 15000, 22000],
    initialRelics: [
      { row: 0, col: 1 },
      { row: 0, col: 4 },
      { row: 0, col: 6 }
    ],
    obstaclesLayout: [
      { row: 6, col: 1, type: 'frost_2' },
      { row: 6, col: 4, type: 'frost_2' },
      { row: 6, col: 6, type: 'frost_2' },
      { row: 5, col: 2, type: 'bramble' },
      { row: 5, col: 5, type: 'bramble' }
    ],
    objectives: [
      { type: 'collect_relics', target: 3, current: 0, label: 'Retrieve 3 Dragon Eggs' }
    ],
    lore: 'Three slumbering astral dragon eggs need safe passage to the nest altar below before the lava rises.'
  },
  {
    id: 9,
    realmId: 3,
    realmName: 'Dragonspire Caldera',
    name: 'Infernal Core',
    subtitle: 'Break 20 deep frost crusts and hit 12,000 score',
    rows: 8,
    cols: 8,
    moves: 24,
    colorPalette: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst'],
    starThresholds: [12000, 18000, 26000],
    obstaclesLayout: [
      { row: 0, col: 0, type: 'frost_2' }, { row: 0, col: 7, type: 'frost_2' },
      { row: 1, col: 1, type: 'frost_2' }, { row: 1, col: 6, type: 'frost_2' },
      { row: 2, col: 2, type: 'frost_2' }, { row: 2, col: 5, type: 'frost_2' },
      { row: 3, col: 3, type: 'frost_2' }, { row: 3, col: 4, type: 'frost_2' },
      { row: 4, col: 3, type: 'frost_2' }, { row: 4, col: 4, type: 'frost_2' },
      { row: 5, col: 2, type: 'frost_2' }, { row: 5, col: 5, type: 'frost_2' },
      { row: 6, col: 1, type: 'frost_2' }, { row: 6, col: 6, type: 'frost_2' },
      { row: 7, col: 0, type: 'frost_2' }, { row: 7, col: 7, type: 'frost_2' }
    ],
    objectives: [
      { type: 'clear_frost', target: 16, current: 0, label: 'Purge 16 Calcite Tiles' },
      { type: 'score', target: 12000, current: 0, label: 'Score 12,000 Points' }
    ],
    lore: 'The molten heart of the mountain. Use your Transmutation Wand booster if you need to connect hard-to-reach corners.'
  },

  // --- REALM 4: The Astral Citadel ---
  {
    id: 10,
    realmId: 4,
    realmName: 'Astral Citadel',
    name: 'Sanctum of Starlight',
    subtitle: 'Collect 25 Celestial Diamonds and 25 Topaz Runes',
    rows: 8,
    cols: 8,
    moves: 26,
    colorPalette: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    starThresholds: [14000, 22000, 30000],
    objectives: [
      { type: 'collect_gems', gemColor: 'diamond', target: 22, current: 0, label: 'Gather 22 Celestial Diamonds' },
      { type: 'collect_gems', gemColor: 'topaz', target: 22, current: 0, label: 'Gather 22 Lightning Topaz' },
      { type: 'score', target: 12000, current: 0, label: 'Score 12,000 Points' }
    ],
    lore: 'Floating on the edge of the cosmos, the sanctuary harnesses pure solar radiation and crystalline starlight.'
  },
  {
    id: 11,
    realmId: 4,
    realmName: 'Astral Citadel',
    name: 'Void Rift Anomaly',
    subtitle: 'Extract 3 Astral Artifacts and clear 14 void rimes',
    rows: 8,
    cols: 8,
    moves: 28,
    colorPalette: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    starThresholds: [16000, 25000, 35000],
    initialRelics: [
      { row: 0, col: 2 },
      { row: 0, col: 4 },
      { row: 0, col: 6 }
    ],
    obstaclesLayout: [
      { row: 2, col: 2, type: 'frost_2' }, { row: 2, col: 4, type: 'frost_2' }, { row: 2, col: 6, type: 'frost_2' },
      { row: 4, col: 1, type: 'bramble' }, { row: 4, col: 3, type: 'bramble' }, { row: 4, col: 5, type: 'bramble' },
      { row: 6, col: 2, type: 'frost_2' }, { row: 6, col: 4, type: 'frost_2' }, { row: 6, col: 6, type: 'frost_2' }
    ],
    objectives: [
      { type: 'collect_relics', target: 3, current: 0, label: 'Extract 3 Astral Artifacts' },
      { type: 'clear_frost', target: 10, current: 0, label: 'Clear 10 Void Rimes' }
    ],
    lore: 'The dimensional barrier fluctuates. Swapping two Singularity Orbs clears the ENTIRE board in a cosmic implosion!'
  },
  {
    id: 12,
    realmId: 4,
    realmName: 'Astral Citadel',
    name: 'Ascension of the Archmage',
    subtitle: 'The ultimate arcane test: 20 Frost, 2 Relics, and 20,000 Score',
    rows: 8,
    cols: 8,
    moves: 30,
    colorPalette: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    starThresholds: [20000, 32000, 48000],
    initialRelics: [
      { row: 0, col: 0 },
      { row: 0, col: 7 }
    ],
    obstaclesLayout: [
      { row: 1, col: 0, type: 'frost_2' }, { row: 1, col: 7, type: 'frost_2' },
      { row: 3, col: 2, type: 'frost_2' }, { row: 3, col: 3, type: 'frost_2' },
      { row: 3, col: 4, type: 'frost_2' }, { row: 3, col: 5, type: 'frost_2' },
      { row: 4, col: 2, type: 'frost_2' }, { row: 4, col: 3, type: 'frost_2' },
      { row: 4, col: 4, type: 'frost_2' }, { row: 4, col: 5, type: 'frost_2' },
      { row: 6, col: 1, type: 'bramble' }, { row: 6, col: 6, type: 'bramble' }
    ],
    objectives: [
      { type: 'clear_frost', target: 16, current: 0, label: 'Purge 16 Cosmic Frost' },
      { type: 'collect_relics', target: 2, current: 0, label: 'Deliver 2 Sovereign Sigils' },
      { type: 'score', target: 20000, current: 0, label: 'Score 20,000 Points' }
    ],
    lore: 'Only the supreme Archmage can conquer the Throne of the Cosmos and claim the title of Celestial Grandmaster.'
  }
];

export const ENDLESS_MODE_CONFIG: LevelConfig = {
  id: 999,
  realmId: 99,
  realmName: 'Celestial Void',
  name: 'Endless Arcane Rush',
  subtitle: 'Race against the 90-second sandglass to rack up supreme combos!',
  rows: 8,
  cols: 8,
  moves: 999,
  timeLimit: 90,
  colorPalette: ALL_GEM_COLORS,
  starThresholds: [15000, 30000, 50000],
  objectives: [
    { type: 'score', target: 50000, current: 0, label: 'Achieve Mythic Score' }
  ],
  lore: 'Pure unbound mana. Keep cascades rolling to build massive combo score multipliers before time expires.'
};
