import rawManifest from '../../RiskOfRain2_ItemIcons/manifest.json';
import { getContentScope, getExpansionLabel, isBaseGame, type ContentScope } from './expansions';
import { iconSources } from './iconSources';

export type Rarity = 'Common' | 'Uncommon' | 'Legendary' | 'Boss' | 'Lunar' | 'Void';

export type ItemRecord = {
  name: string;
  rarity: Rarity;
  id: string;
  effect: string;
  quote: string;
  categories: string[];
  expansion?: string;
  file: string;
  source_url: string;
  width: number;
  height: number;
};

const rarityOrder: Rarity[] = ['Common', 'Uncommon', 'Legendary', 'Boss', 'Lunar', 'Void'];

function isRarity(value: string): value is Rarity {
  return rarityOrder.includes(value as Rarity);
}

function normalizeItem(value: unknown): ItemRecord | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Partial<ItemRecord>;
  if (
    typeof candidate.name !== 'string' ||
    typeof candidate.rarity !== 'string' ||
    !isRarity(candidate.rarity) ||
    typeof candidate.id !== 'string' ||
    typeof candidate.effect !== 'string' ||
    typeof candidate.quote !== 'string' ||
    typeof candidate.file !== 'string' ||
    typeof candidate.source_url !== 'string' ||
    typeof candidate.width !== 'number' ||
    typeof candidate.height !== 'number' ||
    !Array.isArray(candidate.categories)
  ) {
    return null;
  }

  return {
    name: candidate.name,
    rarity: candidate.rarity,
    id: candidate.id,
    effect: candidate.effect,
    quote: candidate.quote,
    categories: candidate.categories.filter((category): category is string => typeof category === 'string'),
    expansion: typeof candidate.expansion === 'string' ? candidate.expansion : undefined,
    file: candidate.file,
    source_url: candidate.source_url,
    width: candidate.width,
    height: candidate.height
  };
}

export const items: ItemRecord[] = (rawManifest as unknown[])
  .map(normalizeItem)
  .filter((item): item is ItemRecord => item !== null);

export const rarities: Rarity[] = rarityOrder.filter((rarity) => items.some((item) => item.rarity === rarity));

export const categories: string[] = Array.from(new Set(items.flatMap((item) => item.categories))).sort((a, b) =>
  a.localeCompare(b)
);

export const rarityRank = Object.fromEntries(rarityOrder.map((rarity, index) => [rarity, index])) as Record<Rarity, number>;

export function getItemIcon(item: ItemRecord) {
  return iconSources[item.file] ?? null;
}

export function getItemScope(item: ItemRecord): ContentScope {
  return getContentScope(item.expansion);
}

export function getItemExpansionLabel(item: ItemRecord) {
  return getExpansionLabel(item.expansion);
}

export function isBaseGameItem(item: ItemRecord) {
  return isBaseGame(item.expansion);
}

export function findItemById(id: string) {
  const normId = normalizeLookupValue(id);
  return items.find((item) => normalizeLookupValue(item.id) === normId) ?? null;
}

function normalizeLookupValue(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '');
}

export function findItemByName(name: string) {
  const normalizedName = normalizeLookupValue(name);
  return items.find((item) => normalizeLookupValue(item.name) === normalizedName) ?? null;
}

export function getRelatedItems(item: ItemRecord, limit = 8) {
  const categorySet = new Set(item.categories);
  return items
    .filter((candidate) => candidate.id !== item.id)
    .map((candidate) => ({
      item: candidate,
      score: candidate.categories.filter((category) => categorySet.has(category)).length
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || rarityRank[a.item.rarity] - rarityRank[b.item.rarity] || a.item.name.localeCompare(b.item.name))
    .slice(0, limit)
    .map(({ item: related }) => related);
}
