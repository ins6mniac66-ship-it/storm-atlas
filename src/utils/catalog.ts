import { getItemExpansionLabel, ItemRecord, rarityRank } from '../data/items';
import type { SortMode } from '../types';

export function searchMatches(item: ItemRecord, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  return [item.name, item.id, item.effect, item.quote, getItemExpansionLabel(item), item.expansion ?? '', ...item.categories]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery);
}

export function sortItems(records: ItemRecord[], sortMode: SortMode) {
  if (sortMode === 'name') {
    return [...records].sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortMode === 'rarity') {
    return [...records].sort((a, b) => rarityRank[a.rarity] - rarityRank[b.rarity] || a.name.localeCompare(b.name));
  }

  return records;
}

export function uniqueToggle(values: string[], value: string) {
  return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
}
