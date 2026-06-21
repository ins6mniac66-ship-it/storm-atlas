export type ContentScope = 'base' | 'expansion';

const expansionLabels: Record<string, string> = {
  SotV: 'Survivors of the Void',
  SotS: 'Seekers of the Storm',
  AC: 'Alloyed Collective'
};

export function getExpansionLabel(expansion?: string | null) {
  if (isBaseGame(expansion)) return 'Base Game';
  const key = expansion as string;
  return expansionLabels[key] ?? key;
}

export function getContentScope(expansion?: string | null): ContentScope {
  return isBaseGame(expansion) ? 'base' : 'expansion';
}

export function isBaseGame(expansion?: string | null) {
  return !expansion || expansion.toLowerCase() === 'base';
}
