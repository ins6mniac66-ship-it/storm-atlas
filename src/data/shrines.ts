export type ShrineCategory = 'reward' | 'risk' | 'combat' | 'utility' | 'healing';
export type ShrineScope = 'base' | 'dlc';
export type ShrineSourceStatus = 'wiki-derived' | 'needs-review';

export interface ShrineRecord {
  id: string;
  name: string;
  category: ShrineCategory;
  scope: ShrineScope;
  image: string;
  summary: string;
  cost: string;
  result: string;
  runTip: string;
  sourceStatus: ShrineSourceStatus;
  tags: string[];
}

export const shrineCategories: ShrineCategory[] = ['reward', 'risk', 'combat', 'utility', 'healing'];

export const shrines: ShrineRecord[] = [
  {
    id: 'shrine-of-blood',
    name: 'Shrine of Blood',
    category: 'risk',
    scope: 'base',
    image: 'RiskOfRain2_Shrines/shrine-of-blood.png',
    summary: 'Trades a percentage of current health for gold.',
    cost: 'Health',
    result: 'Immediate gold payout scaled by stage and difficulty.',
    runTip: 'Use early when the area is clear or when healing is available; avoid tapping it while exposed.',
    sourceStatus: 'wiki-derived',
    tags: ['gold', 'health', 'economy', 'risk']
  },
  {
    id: 'shrine-of-chance',
    name: 'Shrine of Chance',
    category: 'reward',
    scope: 'base',
    image: 'RiskOfRain2_Shrines/shrine-of-chance.png',
    summary: 'Pay gold for a chance to receive an item.',
    cost: 'Gold',
    result: 'Can fail or drop rewards across multiple uses before it is exhausted.',
    runTip: 'Good when you have spare gold after routing chests; do not let repeated failures stall stage tempo.',
    sourceStatus: 'wiki-derived',
    tags: ['gold', 'item', 'chance', 'economy']
  },
  {
    id: 'shrine-of-combat',
    name: 'Shrine of Combat',
    category: 'combat',
    scope: 'base',
    image: 'RiskOfRain2_Shrines/shrine-of-combat.png',
    summary: 'Summons a wave of enemies around the shrine.',
    cost: 'Fight',
    result: 'Extra enemies for gold, item synergies, and kill-trigger value.',
    runTip: 'Trigger when you can control the space and want more income; risky before teleporter or with weak AoE.',
    sourceStatus: 'wiki-derived',
    tags: ['enemy', 'gold', 'combat', 'spawn']
  },
  {
    id: 'shrine-of-order',
    name: 'Shrine of Order',
    category: 'utility',
    scope: 'base',
    image: 'RiskOfRain2_Shrines/shrine-of-order.png',
    summary: 'Rerolls each item rarity into fewer item types while preserving stack counts by rarity.',
    cost: 'Lunar coins',
    result: 'Can create a focused build or destroy key item variety.',
    runTip: 'Use only when you accept high variance; it is strongest when your build can survive a bad reroll.',
    sourceStatus: 'wiki-derived',
    tags: ['lunar', 'reroll', 'items', 'variance']
  },
  {
    id: 'shrine-of-the-mountain',
    name: 'Shrine of the Mountain',
    category: 'risk',
    scope: 'base',
    image: 'RiskOfRain2_Shrines/shrine-of-the-mountain.png',
    summary: 'Adds teleporter boss difficulty in exchange for extra boss rewards.',
    cost: 'Harder boss event',
    result: 'More boss enemies or boss pressure, with additional item rewards if cleared.',
    runTip: 'Hit it when your build already handles bosses; skip when single-target damage is behind.',
    sourceStatus: 'wiki-derived',
    tags: ['teleporter', 'boss', 'reward', 'risk']
  },
  {
    id: 'shrine-of-the-woods',
    name: 'Shrine of the Woods',
    category: 'healing',
    scope: 'base',
    image: 'RiskOfRain2_Shrines/shrine-of-the-woods.png',
    summary: 'Creates a healing zone after activation.',
    cost: 'Gold',
    result: 'Area healing around the shrine for a limited zone.',
    runTip: 'Useful during teleporter fights if it is near the objective; low value when it pulls you off route.',
    sourceStatus: 'wiki-derived',
    tags: ['healing', 'gold', 'zone', 'survival']
  },
  {
    id: 'halcyon-shrine',
    name: 'Halcyon Shrine',
    category: 'reward',
    scope: 'dlc',
    image: 'RiskOfRain2_Shrines/halcyon-shrine.png',
    summary: 'DLC shrine encounter tied to the Seekers of the Storm content set.',
    cost: 'Gold and encounter pressure',
    result: 'Charges through payment and combat, then pays out rewards when completed.',
    runTip: 'Track separately from the base-game set so beginner reference screens do not mix DLC routing by default.',
    sourceStatus: 'needs-review',
    tags: ['dlc', 'seekers of the storm', 'gold', 'encounter']
  },
  {
    id: 'shrine-of-shaping',
    name: 'Shrine of Shaping',
    category: 'utility',
    scope: 'dlc',
    image: 'RiskOfRain2_Shrines/shrine-of-shaping.png',
    summary: 'DLC shrine-type interactable associated with run-shaping choices.',
    cost: 'Run choice',
    result: 'Changes the run through a shrine-specific modifier or selection.',
    runTip: 'Keep it in the DLC bucket until the app expands beyond base-game-first guidance.',
    sourceStatus: 'needs-review',
    tags: ['dlc', 'run modifier', 'choice']
  }
];
