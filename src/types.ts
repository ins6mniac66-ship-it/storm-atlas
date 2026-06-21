export type Tab =
  | 'items'
  | 'saved'
  | 'build'
  | 'scanner'
  | 'reference';

export type ReferenceSubScreen =
  | 'glossary'
  | 'survivors'
  | 'bestiary'
  | 'maps'
  | 'recipes'
  | 'equipment'
  | 'shrines'
  | 'run-systems'
  | 'rarity'
  | 'proc-chains'
  | 'mechanics';

export type SortMode = 'manifest' | 'name' | 'rarity';
export type ViewMode = 'list' | 'grid';
