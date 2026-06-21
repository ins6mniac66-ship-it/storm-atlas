import { findItemById, ItemRecord } from './items';

export type BuildState = Record<string, number>;

export type BuildSummaryBucket = {
  key: 'damage' | 'healing' | 'utility' | 'mobility' | 'onKill' | 'other';
  label: string;
  count: number;
};

export const buildSummaryGroups: Omit<BuildSummaryBucket, 'count'>[] = [
  { key: 'damage', label: 'Damage' },
  { key: 'healing', label: 'Healing' },
  { key: 'utility', label: 'Utility' },
  { key: 'mobility', label: 'Mobility' },
  { key: 'onKill', label: 'On Kill' },
  { key: 'other', label: 'Other' }
];

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

export function sanitizeBuildState(value: unknown): BuildState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  const next: BuildState = {};
  for (const [itemId, count] of Object.entries(value)) {
    if (findItemById(itemId) && isPositiveInteger(count)) {
      next[itemId] = count;
    }
  }

  return next;
}

export function incrementStack(build: BuildState, itemId: string): BuildState {
  if (!findItemById(itemId)) {
    return build;
  }

  return {
    ...build,
    [itemId]: (build[itemId] ?? 0) + 1
  };
}

export function decrementStack(build: BuildState, itemId: string): BuildState {
  const current = build[itemId] ?? 0;
  if (current <= 1) {
    return removeStack(build, itemId);
  }

  return {
    ...build,
    [itemId]: current - 1
  };
}

export function removeStack(build: BuildState, itemId: string): BuildState {
  const next = { ...build };
  delete next[itemId];
  return next;
}

export function getBuildItems(build: BuildState) {
  return Object.entries(build)
    .map(([itemId, count]) => {
      const item = findItemById(itemId);
      return item ? { item, count } : null;
    })
    .filter((entry): entry is { item: ItemRecord; count: number } => entry !== null);
}

export function getBuildTotals(build: BuildState) {
  const entries = getBuildItems(build);
  return {
    uniqueItems: entries.length,
    totalStacks: entries.reduce((sum, entry) => sum + entry.count, 0)
  };
}

export function getItemSummaryKeys(item: ItemRecord): BuildSummaryBucket['key'][] {
  const categories = new Set(item.categories);
  const keys: BuildSummaryBucket['key'][] = [];

  if (categories.has('Damage')) {
    keys.push('damage');
  }
  if (categories.has('Healing')) {
    keys.push('healing');
  }
  if (categories.has('Utility')) {
    keys.push('utility');
  }
  if (categories.has('MobilityRelated') || categories.has('SprintRelated')) {
    keys.push('mobility');
  }
  if (categories.has('OnKillEffect')) {
    keys.push('onKill');
  }

  return keys.length > 0 ? keys : ['other'];
}

export function getBuildSummary(build: BuildState): BuildSummaryBucket[] {
  const counts = Object.fromEntries(buildSummaryGroups.map((group) => [group.key, 0])) as Record<
    BuildSummaryBucket['key'],
    number
  >;

  for (const { item, count } of getBuildItems(build)) {
    for (const key of getItemSummaryKeys(item)) {
      counts[key] += count;
    }
  }

  return buildSummaryGroups.map((group) => ({
    ...group,
    count: counts[group.key]
  }));
}
