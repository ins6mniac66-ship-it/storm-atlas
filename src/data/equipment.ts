import { getContentScope, getExpansionLabel, type ContentScope } from './expansions';
import { equipmentIconSources } from './equipmentIconSources';

export type EquipmentStatus = 'wiki-derived' | 'needs-review';
export type EquipmentRole = 'Burst' | 'Healing' | 'Utility' | 'Mobility' | 'Control' | 'Economy' | 'Risk';

export type EquipmentRecord = {
  id: string;
  name: string;
  cooldown: string;
  role: EquipmentRole;
  expansion?: string;
  effect: string;
  runUse: string;
  caution?: string;
  status: EquipmentStatus;
  sourceUrl: string;
};

function wikiUrl(name: string) {
  return `https://riskofrain2.wiki.gg/wiki/${name.replace(/ /g, '_').replace(/'/g, '%27')}`;
}

export const equipment: EquipmentRecord[] = [
  {
    id: 'disposable-missile-launcher',
    name: 'Disposable Missile Launcher',
    cooldown: '45s',
    role: 'Burst',
    effect: 'Fire 12 missiles for repeated 300% damage hits.',
    runUse: 'Reliable boss and elite burst, especially with missile or equipment cooldown support.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Disposable Missile Launcher')
  },
  {
    id: 'foreign-fruit',
    name: 'Foreign Fruit',
    cooldown: '45s',
    role: 'Healing',
    effect: 'Instantly heal for 50% of maximum health.',
    runUse: 'Simple panic heal when the build lacks sustain or safer defensive tools.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Foreign Fruit')
  },
  {
    id: 'primordial-cube',
    name: 'Primordial Cube',
    cooldown: '60s',
    role: 'Control',
    effect: 'Launch a slow black hole that pulls enemies together.',
    runUse: 'Group enemies before area damage, proc chains, bands, or teleporter burst windows.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Primordial Cube')
  },
  {
    id: 'ocular-hud',
    name: 'Ocular HUD',
    cooldown: '60s',
    role: 'Burst',
    effect: 'Gain guaranteed critical strikes for a short window.',
    runUse: 'Best when the build has strong single-target damage, bands, bleed, or crit scaling.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Ocular HUD')
  },
  {
    id: 'the-backup',
    name: 'The Back-up',
    cooldown: '100s',
    role: 'Utility',
    effect: 'Call temporary Strike Drones to fight with you.',
    runUse: 'Adds disposable pressure for teleporter events and early boss fights.',
    caution: 'Falls off if drone damage cannot keep pace with scaling.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('The Back-up')
  },
  {
    id: 'preon-accumulator',
    name: 'Preon Accumulator',
    cooldown: '140s',
    role: 'Burst',
    effect: 'Fire a high-damage preon tendril projectile with a large explosion.',
    runUse: 'Stage-one boss deletion route when you can get the Rallypoint Delta timed chest.',
    caution: 'Long cooldown and travel time make missed shots expensive.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Preon Accumulator')
  },
  {
    id: 'milky-chrysalis',
    name: 'Milky Chrysalis',
    cooldown: '60s',
    role: 'Mobility',
    effect: 'Gain temporary flight and movement speed.',
    runUse: 'Strong vertical routing, pillar skips, emergency repositioning, and Commencement movement.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Milky Chrysalis')
  },
  {
    id: 'royal-capacitor',
    name: 'Royal Capacitor',
    cooldown: '20s',
    role: 'Burst',
    effect: 'Call lightning on a targeted monster for 3000% damage and nearby stun.',
    runUse: 'Fast boss/elite burst that scales well with Crowbar, Fuel Cell, Soulbound Catalyst, and Gesture loops.',
    caution: 'Can target unwanted enemies if aim/line of sight is poor.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Royal Capacitor')
  },
  {
    id: 'eccentric-vase',
    name: 'Eccentric Vase',
    cooldown: '45s',
    role: 'Mobility',
    effect: 'Create a long quantum tunnel between two positions.',
    runUse: 'Route skips, Commencement pillar skip setups, and team repositioning.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Eccentric Vase')
  },
  {
    id: 'blast-shower',
    name: 'Blast Shower',
    cooldown: '20s',
    role: 'Utility',
    effect: 'Cleanse negative effects and nearby projectiles.',
    runUse: 'Removes dangerous debuffs and can reset band cooldowns for burst builds.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Blast Shower')
  },
  {
    id: 'volcanic-egg',
    name: 'Volcanic Egg',
    cooldown: '30s',
    role: 'Mobility',
    effect: 'Transform into a fast fireball that damages enemies.',
    runUse: 'Emergency escape, map traversal, and short invulnerable reposition windows.',
    caution: 'Hard to steer precisely in tight spaces.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Volcanic Egg')
  },
  {
    id: 'jade-elephant',
    name: 'Jade Elephant',
    cooldown: '45s',
    role: 'Utility',
    effect: 'Gain a large temporary armor boost.',
    runUse: 'Safe teleporter holds, Mithrix damage windows, and high-pressure elite packs.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Jade Elephant')
  },
  {
    id: 'sawmerang',
    name: 'Sawmerang',
    cooldown: '45s',
    role: 'Burst',
    effect: 'Throw three large saw blades that damage and bleed enemies.',
    runUse: 'Line up clustered enemies or large bosses for repeated hits.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Sawmerang')
  },
  {
    id: 'recycler',
    name: 'Recycler',
    cooldown: '45s',
    role: 'Economy',
    effect: 'Reroll an item or equipment into another option of the same tier.',
    runUse: 'One of the strongest macro tools for fixing bad item drops before committing to a build.',
    caution: 'Can destroy a usable item if you reroll without a clear plan.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Recycler')
  },
  {
    id: 'super-massive-leech',
    name: 'Super Massive Leech',
    cooldown: '60s',
    role: 'Healing',
    effect: 'Temporarily heal from damage dealt.',
    runUse: 'Best when you can deal many hits during the active window.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Super Massive Leech')
  },
  {
    id: 'gorags-opus',
    name: "Gorag's Opus",
    cooldown: '45s',
    role: 'Utility',
    effect: 'Frenzy allied characters for a temporary combat boost.',
    runUse: 'Stronger with drones, minions, Engineer turrets, Beetle Guard allies, or co-op groups.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl("Gorag's Opus")
  },
  {
    id: 'forgive-me-please',
    name: 'Forgive Me Please',
    cooldown: '45s',
    role: 'Utility',
    effect: 'Throw a doll that repeatedly triggers on-kill effects.',
    runUse: 'Build-around equipment for Gasoline, Will-o-the-wisp, Monster Tooth, ceremonial effects, and other on-kill chains.',
    caution: 'Weak without enough on-kill items.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Forgive Me Please')
  },
  {
    id: 'radar-scanner',
    name: 'Radar Scanner',
    cooldown: '45s',
    role: 'Utility',
    effect: 'Reveal interactables in a large area.',
    runUse: 'Good routing tool when you need chests, equipment barrels, shops, printers, or the Rallypoint timed chest.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Radar Scanner')
  },
  {
    id: 'gnarled-woodsprite',
    name: 'Gnarled Woodsprite',
    cooldown: '15s',
    role: 'Healing',
    effect: 'Send a healing woodsprite to an ally, or keep passive regeneration while held.',
    runUse: 'Early sustain and co-op support when direct healing items are scarce.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Gnarled Woodsprite')
  },
  {
    id: 'crowdfunder',
    name: 'The Crowdfunder',
    cooldown: 'Toggle',
    role: 'Burst',
    expansion: 'SotV',
    effect: 'Spend gold continuously to fire bullets.',
    runUse: 'Converts excess gold into damage after your shopping route is done.',
    caution: 'Can drain money before you finish buying chests, shrines, or shops.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('The Crowdfunder')
  },
  {
    id: 'fuel-array',
    name: 'Fuel Array',
    cooldown: 'Passive',
    role: 'Risk',
    effect: 'Quest equipment used to unlock REX; explodes if your health drops too low.',
    runUse: 'Carry from the escape pod to Abyssal Depths only when you are intentionally doing the REX unlock route.',
    caution: 'Can instantly kill the run if you take too much damage.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Fuel Array')
  },
  {
    id: 'effigy-of-grief',
    name: 'Effigy of Grief',
    cooldown: 'Deployable',
    role: 'Risk',
    effect: 'Place a field that slows and reduces armor for everything inside.',
    runUse: 'Niche control tool when you can force enemies to fight inside its field.',
    caution: 'The field can punish you and allies too.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Effigy of Grief')
  },
  {
    id: 'glowing-meteorite',
    name: 'Glowing Meteorite',
    cooldown: '140s',
    role: 'Risk',
    effect: 'Call down meteors across the stage.',
    runUse: 'High-risk damage when you can survive or avoid the meteor storm.',
    caution: 'Can hit players and allies.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Glowing Meteorite')
  },
  {
    id: 'helfire-tincture',
    name: 'Helfire Tincture',
    cooldown: '45s',
    role: 'Risk',
    effect: 'Ignite everything nearby, including yourself.',
    runUse: 'Build-around damage aura when you have healing, Razorwire-style payoffs, or strong mitigation.',
    caution: 'Self-damage can kill underbuilt runs quickly.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Helfire Tincture')
  },
  {
    id: 'spinel-tonic',
    name: 'Spinel Tonic',
    cooldown: '60s',
    role: 'Risk',
    effect: 'Gain a large temporary stat boost with a chance to receive Tonic Affliction afterward.',
    runUse: 'Powerful tempo equipment when you have enough cooldown reduction to keep uptime high.',
    caution: 'Afflictions permanently reduce stats unless you manage uptime.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Spinel Tonic')
  },
  {
    id: 'trophy-hunters-tricorn',
    name: "Trophy Hunter's Tricorn",
    cooldown: 'One use',
    role: 'Economy',
    expansion: 'SotV',
    effect: 'Execute a boss and convert its reward into the corresponding boss item.',
    runUse: 'Target a specific boss drop instead of leaving boss-item rewards to chance.',
    caution: 'Consumed after use.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl("Trophy Hunter's Tricorn")
  },
  {
    id: 'executive-card',
    name: 'Executive Card',
    cooldown: 'Passive',
    role: 'Economy',
    expansion: 'SotV',
    effect: 'Discounts multishop purchases and keeps shops open after purchase.',
    runUse: 'Excellent economy equipment for stages with many shops and multishops.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Executive Card')
  },
  {
    id: 'molotov-6-pack',
    name: 'Molotov (6-Pack)',
    cooldown: '45s',
    role: 'Burst',
    expansion: 'SotV',
    effect: 'Throw several molotovs that ignite enemies and leave burning areas.',
    runUse: 'Area denial and ignition support for clustered enemies or teleporter holds.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Molotov (6-Pack)')
  },
  {
    id: 'goobo-jr',
    name: 'Goobo Jr.',
    cooldown: '100s',
    role: 'Utility',
    expansion: 'SotV',
    effect: 'Spawn a temporary gummy clone of yourself.',
    runUse: 'Adds temporary pressure and distraction, especially when your survivor has strong baseline attacks.',
    status: 'wiki-derived',
    sourceUrl: wikiUrl('Goobo Jr.')
  }
];

export const equipmentRoles: EquipmentRole[] = ['Burst', 'Healing', 'Utility', 'Mobility', 'Control', 'Economy', 'Risk'];

export function getEquipmentScope(entry: EquipmentRecord): ContentScope {
  return getContentScope(entry.expansion);
}

export function getEquipmentExpansionLabel(entry: EquipmentRecord) {
  return getExpansionLabel(entry.expansion);
}

export function getEquipmentIcon(entry: EquipmentRecord) {
  return equipmentIconSources[entry.id] ?? null;
}

export function equipmentSearchMatches(entry: EquipmentRecord, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return [
    entry.name,
    entry.cooldown,
    entry.role,
    entry.effect,
    entry.runUse,
    entry.caution ?? '',
    entry.status,
    getEquipmentExpansionLabel(entry)
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalized);
}
