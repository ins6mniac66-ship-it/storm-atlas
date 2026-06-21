export type SourceStatus = 'verified' | 'wiki-derived' | 'estimated' | 'needs-review' | 'community-tested';

export type StackType = 'linear' | 'hyperbolic' | 'chance' | 'duration' | 'special';

export type ItemScalingDataExample = {
  itemId: string;
  stackType: StackType;
  sourceStatus: SourceStatus;
  formula?: string;
  practicalMeaning: string;
  commonMistake?: string;
  commonMistakes?: string[];
};

export const stackTypeLabels: Record<StackType, string> = {
  linear: 'Linear',
  hyperbolic: 'Hyperbolic',
  chance: 'Chance',
  duration: 'Duration',
  special: 'Special'
};

export const itemScalingDataExamples: ItemScalingDataExample[] = [];
