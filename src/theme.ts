import type { Rarity } from './data/items';

export const rarityColors: Record<Rarity, string> = {
  Common: '#e6edf3',
  Uncommon: '#48d26f',
  Legendary: '#ff5c6a',
  Boss: '#ffd166',
  Lunar: '#55b9ff',
  Void: '#c77dff'
};

export const sortModes = ['manifest', 'name', 'rarity'] as const;
export const backExitWindowMs = 2000;
