export type MobilityRating = 'S' | 'A' | 'B' | 'C';

export type MobilitySourceStatus = 'verified' | 'wiki-derived' | 'community-tested' | 'needs-review';

export type MobilityTag =
  | 'blink'
  | 'dash'
  | 'vertical'
  | 'momentum'
  | 'gap-crossing'
  | 'loot-while-moving'
  | 'pillar-skip'
  | 'item-dependent'
  | 'setup-dependent'
  | 'needs-review';

export type SurvivorMobilityProfile = {
  survivor: string;
  baseMoveSpeed: number;
  rating: MobilityRating;
  tags: MobilityTag[];
  routeUse: string;
  weakness: string;
  sourceStatus: MobilitySourceStatus;
};

const standardTags: MobilityTag[] = ['item-dependent'];

export const survivorMobilityProfiles: SurvivorMobilityProfile[] = [
  {
    survivor: 'Commando',
    baseMoveSpeed: 7,
    rating: 'C',
    tags: ['item-dependent'],
    routeUse: 'Tactical movement helps short dodges, but routing speed mostly comes from items.',
    weakness: 'No vertical movement or long gap-crossing skill.',
    sourceStatus: 'wiki-derived'
  },
  {
    survivor: 'Huntress',
    baseMoveSpeed: 7,
    rating: 'S',
    tags: ['blink', 'dash', 'loot-while-moving', 'gap-crossing'],
    routeUse: 'Blink tools and sprint-compatible attacks keep looting, kiting, and repositioning fast.',
    weakness: 'Low health means a bad blink can still end the route.',
    sourceStatus: 'wiki-derived'
  },
  {
    survivor: 'Bandit',
    baseMoveSpeed: 7,
    rating: 'A',
    tags: ['dash', 'vertical', 'gap-crossing'],
    routeUse: 'Smoke Bomb gives stealth, repositioning, and a useful vertical pop for short route saves.',
    weakness: 'Mobility is tied to combat timing and can be spent too early.',
    sourceStatus: 'wiki-derived'
  },
  {
    survivor: 'MUL-T',
    baseMoveSpeed: 7,
    rating: 'B',
    tags: ['dash', 'item-dependent'],
    routeUse: 'Transport Mode gives burst travel and impact control, but the large body still feels heavy.',
    weakness: 'Limited vertical control without feathers, quails, or terrain help.',
    sourceStatus: 'wiki-derived'
  },
  {
    survivor: 'Engineer',
    baseMoveSpeed: 7,
    rating: 'C',
    tags: standardTags,
    routeUse: 'Can stabilize zones well, but travel and emergency repositioning depend on item support.',
    weakness: 'No native movement skill and turret setup rewards pre-positioning over reaction.',
    sourceStatus: 'wiki-derived'
  },
  {
    survivor: 'Artificer',
    baseMoveSpeed: 7,
    rating: 'B',
    tags: ['vertical', 'pillar-skip', 'setup-dependent'],
    routeUse: 'Ion Surge gives strong vertical access and Commencement skip potential when selected.',
    weakness: 'Without Ion Surge, grounded escape and horizontal routing are weak.',
    sourceStatus: 'wiki-derived'
  },
  {
    survivor: 'Mercenary',
    baseMoveSpeed: 7,
    rating: 'S',
    tags: ['dash', 'vertical', 'gap-crossing', 'pillar-skip'],
    routeUse: 'Multiple movement skills and aerial control make stage traversal and emergency exits strong.',
    weakness: 'Mobility doubles as offense, so overcommitting can remove the exit plan.',
    sourceStatus: 'wiki-derived'
  },
  {
    survivor: 'REX',
    baseMoveSpeed: 7,
    rating: 'C',
    tags: ['momentum', 'setup-dependent', 'item-dependent'],
    routeUse: 'Bramble Volley recoil can create movement tech, but it is situational and health-state sensitive.',
    weakness: 'Routine routing still leans heavily on movement items.',
    sourceStatus: 'community-tested'
  },
  {
    survivor: 'Loader',
    baseMoveSpeed: 7,
    rating: 'S',
    tags: ['momentum', 'vertical', 'gap-crossing', 'pillar-skip', 'loot-while-moving'],
    routeUse: 'Grapple momentum and charged punches turn terrain into fast cross-map routing.',
    weakness: 'Overshooting and bad approach angles can turn speed into avoidable damage.',
    sourceStatus: 'wiki-derived'
  },
  {
    survivor: 'Acrid',
    baseMoveSpeed: 7,
    rating: 'A',
    tags: ['dash', 'vertical', 'gap-crossing', 'pillar-skip'],
    routeUse: 'Leap gives reliable vertical and gap-crossing movement while Poison handles pressure.',
    weakness: 'Leap is also a combat entry tool, so cooldown discipline matters.',
    sourceStatus: 'wiki-derived'
  },
  {
    survivor: 'Captain',
    baseMoveSpeed: 7,
    rating: 'C',
    tags: ['item-dependent'],
    routeUse: 'Strong damage and beacons help objectives, but route speed comes from items or stage tech.',
    weakness: 'No native mobility skill, and some orbital tools are restricted by stage space.',
    sourceStatus: 'wiki-derived'
  },
  {
    survivor: 'Railgunner',
    baseMoveSpeed: 7,
    rating: 'B',
    tags: ['vertical', 'momentum', 'pillar-skip', 'setup-dependent'],
    routeUse: 'Concussion Devices can launch, reposition, and support vertical skips with practice.',
    weakness: 'Scope pressure slows awareness and launch movement needs setup.',
    sourceStatus: 'wiki-derived'
  },
  {
    survivor: 'Void Fiend',
    baseMoveSpeed: 7,
    rating: 'B',
    tags: ['dash', 'vertical', 'gap-crossing'],
    routeUse: 'Trespass gives clean repositioning and survival movement across both forms.',
    weakness: 'Corruption timing changes how safely the movement window can be used.',
    sourceStatus: 'wiki-derived'
  },
  {
    survivor: 'Seeker',
    baseMoveSpeed: 7,
    rating: 'A',
    tags: ['dash', 'vertical', 'gap-crossing', 'setup-dependent'],
    routeUse: 'Sojourn gives practical repositioning, vertical access, and combat-safe movement windows.',
    weakness: 'Route value depends on managing resource and skill timing cleanly.',
    sourceStatus: 'wiki-derived'
  },
  {
    survivor: 'False Son',
    baseMoveSpeed: 7,
    rating: 'B',
    tags: ['dash', 'vertical', 'momentum', 'setup-dependent'],
    routeUse: 'Lunar spikes and mobility tools can improve route tempo once the resource loop is stable.',
    weakness: 'Can feel slow before spike economy, health scaling, or movement items come online.',
    sourceStatus: 'wiki-derived'
  },
  {
    survivor: 'CHEF',
    baseMoveSpeed: 7,
    rating: 'B',
    tags: ['dash', 'setup-dependent', 'item-dependent'],
    routeUse: 'Roll and boosted skill routing help reposition through packs and short stage gaps.',
    weakness: 'Combo sequencing can keep attention on setup instead of pure travel speed.',
    sourceStatus: 'wiki-derived'
  },
  {
    survivor: 'Drifter',
    baseMoveSpeed: 7,
    rating: 'B',
    tags: ['dash', 'setup-dependent', 'needs-review'],
    routeUse: 'Resource and object handling can support flexible movement, but current app data needs verification.',
    weakness: 'Expansion/modded status needs clear labeling before stronger routing claims.',
    sourceStatus: 'needs-review'
  },
  {
    survivor: 'Operator',
    baseMoveSpeed: 7,
    rating: 'C',
    tags: ['item-dependent', 'needs-review'],
    routeUse: 'Drone support can reduce pressure while moving, but personal route speed needs verification.',
    weakness: 'Expansion/modded status needs clear labeling before stronger routing claims.',
    sourceStatus: 'needs-review'
  },
  {
    survivor: 'Heretic',
    baseMoveSpeed: 8,
    rating: 'A',
    tags: ['vertical', 'gap-crossing', 'item-dependent'],
    routeUse: 'Higher base speed plus Strides of Heresy movement makes the transformation unusually mobile.',
    weakness: 'Requires Heresy items and has health-drain pacing risk.',
    sourceStatus: 'wiki-derived'
  }
];

export function getSurvivorMobilityProfile(name: string) {
  return survivorMobilityProfiles.find((profile) => profile.survivor === name) ?? null;
}

