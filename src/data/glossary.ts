import { categories as itemCategories } from './items';

export type GlossaryCategory =
  | 'RUN_FLOW'
  | 'DAMAGE_COMBAT'
  | 'PROC_ITEM_TRIGGERING'
  | 'DEFENSE_SURVIVAL'
  | 'SCALING_DIFFICULTY'
  | 'ITEMS_EQUIPMENT'
  | 'ECONOMY_INTERACTABLES'
  | 'STATUS_EFFECTS'
  | 'ARTIFACTS_UNLOCKS'
  | 'ADVANCED_SYSTEMS';

export type GlossaryDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface GlossaryEntry {
  id: string;
  term: string;
  category: GlossaryCategory;
  difficulty: GlossaryDifficulty;
  shortDefinition: string;
  plainEnglish: string;
  whyItMatters: string;
  playerAction: string;
  relatedItems: string[];
  relatedSurvivors: string[];
  relatedMechanics: string[];
  tags: string[];
  statRows?: string[];
}

export const itemCategoryGlossaryEntries: GlossaryEntry[] = [
  {
    id: 'bosses',
    term: 'Bosses',
    category: 'DAMAGE_COMBAT',
    difficulty: 'BEGINNER',
    shortDefinition: 'Large enemies with boss health bars, boss rewards, or special boss-event roles.',
    plainEnglish:
      'Bosses are the durable priority enemies used for teleporter fights, hidden encounters, final routes, and some special events. They have much higher base stats than normal monsters.',
    whyItMatters:
      'Boss damage, single-target damage, mobility, and defense decide whether boss events end quickly or consume too much time.',
    playerAction:
      'Check boss health and armor when a run feels slow. If bosses take too long, add single-target damage, bleed, bands, missiles, or other focused pressure.',
    relatedItems: ['Armor-Piercing Rounds', 'AtG Missile Mk. 1', "Kjaro's Band", "Runald's Band"],
    relatedSurvivors: ['Artificer', 'Loader', 'Railgunner', 'Bandit'],
    relatedMechanics: ['Teleporter Event', 'Boss Damage', 'Single-Target Damage', 'Shrine of the Mountain'],
    tags: ['boss', 'bosses', 'boss-stats', 'combat'],
    statRows: [
      'Alloy Worship Unit - HP 2500 (+750), Damage 15 (+3), Armor 30, Speed 7',
      'Artifact Reliquary - HP 100000 (+30000), Damage 10 (+2), Armor 100000, Speed 0',
      'Aurelionite - HP 2100 (+630), Damage 40 (+8), Armor 20, Speed 5',
      'Beetle Queen - HP 2100 (+630), Damage 25 (+5), Armor 20, Speed 6',
      'Clay Dunestrider - HP 2100 (+630), Damage 20 (+4), Armor 20, Speed 9',
      'Grandparent - HP 3625 (+1088), Damage 26 (+5.2), Armor 20, Speed 0',
      'Grovetender - HP 2800 (+840), Damage 23 (+4.6), Armor 20, Speed 10',
      'Imp Overlord - HP 2800 (+840), Damage 16 (+3.2), Armor 20, Speed 13',
      'Magma Worm - HP 2400 (+720), Damage 10 (+2), Armor 15, Speed 20',
      'Mithrix - HP 1000 (+300), Damage 16 (+3.2), Armor 20, Speed 15',
      'Overloading Worm - HP 12000 (+3600), Damage 50 (+10), Armor 15, Speed 20',
      'Scavenger - HP 3800 (+1140), Damage 4 (+0.8), Armor 20, Speed 3',
      'Solus Control Unit - HP 2500 (+750), Damage 15 (+3), Armor 20, Speed 7',
      'Stone Titan - HP 2100 (+630), Damage 40 (+8), Armor 20, Speed 5',
      'Twisted Scavenger - HP 3230 (+969), Damage 4 (+0.8), Armor 20, Speed 3',
      'Wandering Vagrant - HP 2100 (+630), Damage 6.5 (+1.3), Armor 15, Speed 6'
    ]
  },
  {
    id: 'item-tag-damage',
    term: 'Damage',
    category: 'ITEMS_EQUIPMENT',
    difficulty: 'BEGINNER',
    shortDefinition: 'Items that directly improve how quickly you kill enemies or bosses.',
    plainEnglish: 'Damage tags mark items that add damage, multiply damage, improve critical hits, or help attacks hit harder.',
    whyItMatters: 'A run without enough damage falls behind enemy scaling and makes teleporter events drag on.',
    playerAction: 'Keep a steady base of damage items, especially before bosses and stage transitions.',
    relatedItems: ['Armor-Piercing Rounds', "Lens-Maker's Glasses", 'Tri-Tip Dagger', 'AtG Missile Mk. 1'],
    relatedSurvivors: [],
    relatedMechanics: ['Proc', 'On-Hit Effect', 'Boss Damage'],
    tags: ['item-tag', 'category', 'damage']
  },
  {
    id: 'item-tag-healing',
    term: 'Healing',
    category: 'ITEMS_EQUIPMENT',
    difficulty: 'BEGINNER',
    shortDefinition: 'Items that restore health or make recovery easier.',
    plainEnglish: 'Healing tags mark items that refill health directly, improve regeneration, or reward kills and combat actions with recovery.',
    whyItMatters: 'Healing helps recover from chip damage, but it does not replace movement, armor, and killing threats quickly.',
    playerAction: 'Take enough healing to recover between mistakes, then balance it with damage and mobility.',
    relatedItems: ['Bison Steak', 'Medkit', 'Leeching Seed', "Harvester's Scythe"],
    relatedSurvivors: [],
    relatedMechanics: ['Health', 'Barrier', 'Damage Reduction'],
    tags: ['item-tag', 'category', 'healing']
  },
  {
    id: 'item-tag-utility',
    term: 'Utility',
    category: 'ITEMS_EQUIPMENT',
    difficulty: 'BEGINNER',
    shortDefinition: 'Items that improve control, consistency, cooldowns, or run quality without being pure damage or healing.',
    plainEnglish: 'Utility tags cover support effects like extra skill charges, crowd control, cooldown help, economy support, and other build helpers.',
    whyItMatters: 'Utility often makes a build smoother and safer even when it does not raise raw damage numbers.',
    playerAction: 'Use utility to patch what your survivor lacks, such as skill charges, crowd control, or safer routing.',
    relatedItems: ['Backup Magazine', 'Bandolier', 'Fuel Cell', 'Wax Quail'],
    relatedSurvivors: [],
    relatedMechanics: ['Cooldown', 'Skill Charge', 'Mobility'],
    tags: ['item-tag', 'category', 'utility']
  },
  {
    id: 'item-tag-technology',
    term: 'Technology',
    category: 'ITEMS_EQUIPMENT',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'A catalog tag for items tied to devices, drones, equipment behavior, or mechanical effects.',
    plainEnglish: 'Technology is a data tag used by the item catalog for gear-like effects rather than a single in-game stat.',
    whyItMatters: 'It helps group items that affect equipment, deployables, drones, or other mechanical systems.',
    playerAction: 'Use it as a browse and filtering hint, then read the item detail for the exact rule.',
    relatedItems: ['Backup Magazine', 'Fuel Cell', 'Spare Drone Parts', 'The Back-up'],
    relatedSurvivors: ['Captain', 'Engineer'],
    relatedMechanics: ['Equipment Cooldown', 'Drones', 'Skill Charge'],
    tags: ['item-tag', 'category', 'technology']
  },
  {
    id: 'item-tag-ai-blacklist',
    term: 'AIBlacklist',
    category: 'ADVANCED_SYSTEMS',
    difficulty: 'ADVANCED',
    shortDefinition: 'A catalog/internal tag indicating items that should not be assigned to AI-controlled enemies or allies.',
    plainEnglish: 'AIBlacklist is not a player-facing build role. It is a data label from the game catalog that prevents certain items from being used by AI units.',
    whyItMatters: 'Seeing it in the app means the item has an internal restriction, not that the item is bad for the player.',
    playerAction: 'Treat it as technical context. For build decisions, rely on the item effect and practical tags like Damage, Healing, or Utility.',
    relatedItems: ['Armor-Piercing Rounds'],
    relatedSurvivors: [],
    relatedMechanics: ['Item Tags', 'AI Item Rules'],
    tags: ['item-tag', 'category', 'ai-blacklist', 'aiblacklist']
  }
];

function normalizeGlossaryLookupValue(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '');
}

function formatItemCategoryTerm(category: string) {
  return category.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/Related$/, ' Related');
}

function createItemCategoryFallbackEntry(category: string): GlossaryEntry {
  const readableTerm = formatItemCategoryTerm(category);

  return {
    id: `item-tag-${category.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}`,
    term: category,
    category: category.endsWith('Blacklist') || category === 'CannotSteal' ? 'ADVANCED_SYSTEMS' : 'ITEMS_EQUIPMENT',
    difficulty: category.endsWith('Blacklist') || category === 'CannotSteal' ? 'ADVANCED' : 'INTERMEDIATE',
    shortDefinition: `A catalog tag for ${readableTerm.toLowerCase()} item behavior.`,
    plainEnglish:
      'This is a source-data tag used by the item catalog. It groups items by behavior, restrictions, or systems they interact with.',
    whyItMatters:
      'The tag helps search and filtering, but it is not always a direct player-facing stat or build recommendation.',
    playerAction: 'Use it as a quick browse hint, then check the item effect for the exact rule.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Item Tags'],
    tags: ['item-tag', 'category', category.toLowerCase()]
  };
}

export const glossaryEntries: GlossaryEntry[] = [
  {
    id: 'proc',
    term: 'Proc',
    category: 'PROC_ITEM_TRIGGERING',
    difficulty: 'BEGINNER',
    shortDefinition: 'A triggered effect from an attack, item, or damage event.',
    plainEnglish:
      'A proc is when something activates. If an item has a chance to fire a missile, apply bleed, chain lightning, or trigger another effect, that activation is usually called a proc.',
    whyItMatters:
      'Many strong Risk of Rain 2 builds deal a large part of their damage through triggered item effects instead of only direct survivor damage.',
    playerAction:
      'On fast-hitting survivors, prioritize items that trigger on hit. On slower burst survivors, do not assume every proc item will perform equally well.',
    relatedItems: ['Tri-Tip Dagger', 'Ukulele', 'AtG Missile Mk. 1', 'Sticky Bomb'],
    relatedSurvivors: ['Commando', 'MUL-T', 'Huntress', 'Captain'],
    relatedMechanics: ['Proc Coefficient', 'On-Hit Effect', 'Proc Chain', 'Attack Speed'],
    tags: ['proc', 'on-hit', 'damage', 'item-trigger']
  },
  {
    id: 'proc-coefficient',
    term: 'Proc Coefficient',
    category: 'PROC_ITEM_TRIGGERING',
    difficulty: 'ADVANCED',
    shortDefinition: 'A hidden multiplier that changes how strongly an attack triggers item effects.',
    plainEnglish:
      'Not every attack triggers item effects at full strength. Proc coefficient adjusts how likely or how strongly certain effects happen from that attack.',
    whyItMatters:
      'A skill can look good for procs because it hits often, but a low proc coefficient can reduce the value of bleed, missiles, chain lightning, and similar effects.',
    playerAction:
      "When building around on-hit effects, check whether the survivor's main attacks have strong proc behavior before overcommitting to proc items.",
    relatedItems: ['Tri-Tip Dagger', 'Ukulele', 'AtG Missile Mk. 1', 'Polylute', 'Plasma Shrimp'],
    relatedSurvivors: ['Commando', 'MUL-T', 'Huntress', 'Captain'],
    relatedMechanics: ['Proc', 'On-Hit Effect', 'Proc Chain'],
    tags: ['proc', 'hidden-stat', 'advanced', 'trigger-chance']
  },
  {
    id: 'on-hit-effect',
    term: 'On-Hit Effect',
    category: 'PROC_ITEM_TRIGGERING',
    difficulty: 'BEGINNER',
    shortDefinition: 'An effect that can activate when an attack hits an enemy.',
    plainEnglish:
      'On-hit effects are item effects that care about attacks connecting with enemies. Examples include bleed, missiles, lightning, and other bonus damage effects.',
    whyItMatters: 'On-hit items scale well with attack speed, multi-hit skills, and proc chains.',
    playerAction:
      'Use on-hit items heavily on survivors who attack quickly or hit many times. Be more selective on survivors with slow, single-hit attacks.',
    relatedItems: ['Tri-Tip Dagger', 'Ukulele', 'AtG Missile Mk. 1', 'Sticky Bomb'],
    relatedSurvivors: ['Commando', 'MUL-T', 'Huntress'],
    relatedMechanics: ['Proc', 'Proc Coefficient', 'Attack Speed'],
    tags: ['on-hit', 'proc', 'damage']
  },
  {
    id: 'proc-chain',
    term: 'Proc Chain',
    category: 'PROC_ITEM_TRIGGERING',
    difficulty: 'ADVANCED',
    shortDefinition: 'A chain reaction where one triggered effect causes more damage events or triggers.',
    plainEnglish:
      'A proc chain happens when one effect leads into another. An attack may trigger lightning, the lightning may hit more enemies, and those hits may help trigger more effects.',
    whyItMatters:
      'Proc chains are one reason some item combinations become much stronger than their descriptions suggest.',
    playerAction:
      'Combine attack speed, on-hit items, chain effects, and area damage to create builds that clear groups without aiming at every enemy.',
    relatedItems: ['Ukulele', 'AtG Missile Mk. 1', 'Polylute', 'Sentient Meat Hook', 'Ceremonial Dagger'],
    relatedSurvivors: ['Commando', 'MUL-T', 'Huntress'],
    relatedMechanics: ['Proc', 'Proc Coefficient', 'On-Hit Effect'],
    tags: ['proc', 'chain', 'scaling', 'aoe']
  },
  {
    id: 'attack-speed',
    term: 'Attack Speed',
    category: 'DAMAGE_COMBAT',
    difficulty: 'BEGINNER',
    shortDefinition: 'How quickly a survivor performs certain attacks.',
    plainEnglish: 'Attack speed makes many primary attacks and repeated-hit skills fire faster.',
    whyItMatters: 'More attack speed often means more hits, more damage events, and more chances to trigger on-hit effects.',
    playerAction:
      'Prioritize attack speed on survivors who fire often or rely on repeated hits. Value it less on builds dominated by cooldowns or single burst hits.',
    relatedItems: ["Soldier's Syringe", 'Predatory Instincts', 'War Horn'],
    relatedSurvivors: ['Commando', 'MUL-T', 'Huntress'],
    relatedMechanics: ['Proc', 'On-Hit Effect', 'Proc Coefficient'],
    tags: ['damage', 'speed', 'proc', 'scaling']
  },
  {
    id: 'cooldown',
    term: 'Cooldown',
    category: 'DAMAGE_COMBAT',
    difficulty: 'BEGINNER',
    shortDefinition: 'The wait time before a skill or equipment can be used again.',
    plainEnglish: 'After using certain skills or equipment, you must wait before using them again.',
    whyItMatters: 'Cooldowns control your burst damage, mobility, defense, and escape options.',
    playerAction:
      'Do not spend every cooldown immediately. Keep mobility or defensive skills available when entering dangerous fights.',
    relatedItems: ['Backup Magazine', 'Bandolier', 'Alien Head', 'Brainstalks'],
    relatedSurvivors: ['Artificer', 'Loader', 'Bandit', 'Acrid'],
    relatedMechanics: ['Skill Charge', 'Equipment Cooldown'],
    tags: ['skills', 'timing', 'cooldown']
  },
  {
    id: 'skill-charge',
    term: 'Skill Charge',
    category: 'DAMAGE_COMBAT',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'A stored extra use of a skill.',
    plainEnglish: 'Some skills can hold multiple charges, letting you use them several times before waiting for recharge.',
    whyItMatters:
      'Extra charges can turn a good skill into a core build engine, especially for mobility, burst damage, or utility.',
    playerAction: 'Value extra charges when your survivor has a powerful secondary, utility, or movement skill.',
    relatedItems: ['Backup Magazine', 'Hardlight Afterburner'],
    relatedSurvivors: ['Loader', 'Huntress', 'Artificer', 'Bandit'],
    relatedMechanics: ['Cooldown'],
    tags: ['skills', 'charges', 'cooldown']
  },
  {
    id: 'stacking',
    term: 'Stacking',
    category: 'ITEMS_EQUIPMENT',
    difficulty: 'BEGINNER',
    shortDefinition: 'How multiple copies of the same item improve its effect.',
    plainEnglish: 'Most items get stronger when you collect more copies, but each item stacks differently.',
    whyItMatters:
      'Some items are excellent with one copy, some need several, and some become inefficient after a certain point.',
    playerAction: 'Before using a printer or Artifact of Command, check whether the item is actually worth stacking.',
    relatedItems: ["Soldier's Syringe", "Lens-Maker's Glasses", 'Tougher Times', 'Tri-Tip Dagger'],
    relatedSurvivors: [],
    relatedMechanics: ['Diminishing Returns', 'Item Tier', 'Printer'],
    tags: ['items', 'scaling', 'stacks']
  },
  {
    id: 'diminishing-returns',
    term: 'Diminishing Returns',
    category: 'ITEMS_EQUIPMENT',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'When extra stacks keep helping but each additional stack matters less.',
    plainEnglish:
      'Some items become less efficient as you stack more of them. The item still improves, but each copy gives less practical value than earlier copies.',
    whyItMatters:
      'Overstacking one item can leave your build weak in other areas like mobility, defense, or boss damage.',
    playerAction: 'Once an item has solved its job, diversify. Do not let one shiny printer turn your build into a glass accordion.',
    relatedItems: ['Tougher Times', "Lens-Maker's Glasses", 'Repulsion Armor Plate'],
    relatedSurvivors: [],
    relatedMechanics: ['Stacking', 'Item Tier', 'Printer'],
    tags: ['items', 'efficiency', 'scaling']
  },
  {
    id: 'armor',
    term: 'Armor',
    category: 'DEFENSE_SURVIVAL',
    difficulty: 'BEGINNER',
    shortDefinition: 'A defensive stat that reduces incoming damage.',
    plainEnglish: 'Armor makes hits hurt less. Positive armor reduces damage taken, while negative armor makes damage worse.',
    whyItMatters:
      'Armor helps against repeated incoming damage and can be more reliable than healing once enemies start hitting hard.',
    playerAction: 'Do not build only healing. Mix defense, movement, damage prevention, and positioning.',
    relatedItems: ['Repulsion Armor Plate', 'Rose Buckler', 'Oddly-shaped Opal'],
    relatedSurvivors: ['Loader', 'MUL-T'],
    relatedMechanics: ['Damage Reduction', 'One-Shot Protection'],
    tags: ['defense', 'survival', 'damage-reduction']
  },
  {
    id: 'barrier',
    term: 'Barrier',
    category: 'DEFENSE_SURVIVAL',
    difficulty: 'BEGINNER',
    shortDefinition: 'Temporary bonus health layered over your normal health.',
    plainEnglish: 'Barrier is a temporary yellow health layer that absorbs damage before your normal health is affected.',
    whyItMatters:
      'Barrier can let aggressive builds stay in fights longer, especially when you generate it repeatedly.',
    playerAction: 'Use barrier as a temporary combat buffer, not as permanent safety. It fades, so keep moving.',
    relatedItems: ['Topaz Brooch', 'Aegis'],
    relatedSurvivors: [],
    relatedMechanics: ['Health', 'Shield', 'Healing', 'One-Shot Protection'],
    tags: ['defense', 'barrier', 'survival']
  },
  {
    id: 'shield',
    term: 'Shield',
    category: 'DEFENSE_SURVIVAL',
    difficulty: 'BEGINNER',
    shortDefinition: 'A rechargeable health layer that returns after avoiding damage.',
    plainEnglish: 'Shield increases your total health pool, but it has to recharge after you stop taking damage.',
    whyItMatters:
      'Shield can help you survive burst damage, but it does not behave like normal health and can complicate healing-based builds.',
    playerAction:
      'Treat shield as a defensive layer with tradeoffs. Do not assume it is always better than health, armor, or mobility.',
    relatedItems: ['Personal Shield Generator', 'Transcendence'],
    relatedSurvivors: [],
    relatedMechanics: ['Health', 'Barrier', 'Healing', 'One-Shot Protection'],
    tags: ['defense', 'shield', 'survival']
  },
  {
    id: 'one-shot-protection',
    term: 'One-Shot Protection',
    category: 'DEFENSE_SURVIVAL',
    difficulty: 'ADVANCED',
    shortDefinition: 'A survival mechanic that can prevent a single huge hit from instantly killing you.',
    plainEnglish:
      'When your health state qualifies, a single large hit may be prevented from taking your entire health bar at once.',
    whyItMatters:
      'One-shot protection helps against burst damage, but it does not save you from rapid follow-up hits, damage-over-time, or bad positioning.',
    playerAction:
      'Do not rely on one-shot protection as your main defense. Keep your health high, avoid burst attacks, and build actual survival layers.',
    relatedItems: ['Shaped Glass', 'Personal Shield Generator', 'Transcendence', 'Warped Echo'],
    relatedSurvivors: [],
    relatedMechanics: ['Health', 'Shield', 'Barrier', 'Armor'],
    tags: ['hidden-system', 'defense', 'survival', 'burst-damage']
  },
  {
    id: 'difficulty-scaling',
    term: 'Difficulty Scaling',
    category: 'SCALING_DIFFICULTY',
    difficulty: 'BEGINNER',
    shortDefinition: 'The system that makes enemies stronger as time passes.',
    plainEnglish:
      'Risk of Rain 2 gets harder over time. The longer you spend in a run, the more dangerous the enemy side becomes.',
    whyItMatters:
      'You are always trading time for loot. Slow looting can make the run harder than the items are worth.',
    playerAction:
      'Loot with purpose. Get enough items to stay ahead, then move to the teleporter instead of vacuuming every corner forever.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Director', 'Enemy Level', 'Teleporter Event', 'Looping'],
    tags: ['difficulty', 'time', 'scaling', 'run-flow']
  },
  {
    id: 'director',
    term: 'Director',
    category: 'ADVANCED_SYSTEMS',
    difficulty: 'ADVANCED',
    shortDefinition: 'The hidden system that controls enemy pressure and some map setup behavior.',
    plainEnglish: "The director is the game's invisible budget manager. It decides what the run can afford to throw at you.",
    whyItMatters:
      'As time passes and difficulty rises, the director can spend more on dangerous enemies, elites, and pressure patterns.',
    playerAction:
      'When the map starts spawning harder threats, stop playing greedy. Prioritize mobility, damage, and teleporter progress.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Difficulty Scaling', 'Enemy Level', 'Teleporter Event'],
    tags: ['hidden-system', 'enemy-spawns', 'difficulty']
  },
  {
    id: 'teleporter-event',
    term: 'Teleporter Event',
    category: 'RUN_FLOW',
    difficulty: 'BEGINNER',
    shortDefinition: 'The main stage objective where you fight the boss and charge the teleporter.',
    plainEnglish: 'Activating the teleporter starts the boss event. You survive the fight while the teleporter charges.',
    whyItMatters:
      'The teleporter controls your stage pacing. Waiting too long before starting it gives difficulty more time to climb.',
    playerAction: 'Start the teleporter when your build is ready enough, not when the map is perfectly empty.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Difficulty Scaling', 'Boss', 'Stage', 'Looping'],
    tags: ['run-flow', 'boss', 'teleporter']
  },
  {
    id: 'looping',
    term: 'Looping',
    category: 'RUN_FLOW',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'Continuing the run through more stages instead of ending it on the normal final path.',
    plainEnglish:
      'Looping sends the run back through more environments at higher difficulty, letting your item build grow further.',
    whyItMatters: 'Looping can make your build absurdly strong, but enemies keep scaling too.',
    playerAction: 'Loop when your build has damage, mobility, and survivability. Do not loop just because the portal offers it.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Difficulty Scaling', 'Stage', 'Item Scaling'],
    tags: ['run-flow', 'scaling', 'stages']
  },
  {
    id: 'equipment',
    term: 'Equipment',
    category: 'ITEMS_EQUIPMENT',
    difficulty: 'BEGINNER',
    shortDefinition: 'An active-use item with a cooldown.',
    plainEnglish:
      'Equipment is an item you activate manually. It usually gives burst damage, healing, utility, mobility, or another powerful effect.',
    whyItMatters: 'Good equipment can solve a missing part of your build better than another passive item.',
    playerAction:
      'Pick equipment based on what your build lacks. Boss damage, healing, crowd control, and mobility are all valid reasons to swap.',
    relatedItems: ['Disposable Missile Launcher', 'Preon Accumulator', 'Royal Capacitor', 'Foreign Fruit'],
    relatedSurvivors: [],
    relatedMechanics: ['Equipment Cooldown', 'Fuel Cell', 'Gesture of the Drowned'],
    tags: ['equipment', 'active-item', 'cooldown']
  },
  {
    id: 'scrapping',
    term: 'Scrapping',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'BEGINNER',
    shortDefinition: 'Turning unwanted items into scrap of the same tier.',
    plainEnglish: 'Scrappers let you remove items from your inventory and convert them into scrap.',
    whyItMatters:
      'Scrap gives you control over printers and some trade interactions. It also lets you remove items that do not help your survivor.',
    playerAction:
      'Scrap low-value or off-plan items before using printers. Do not accidentally scrap your only mobility, defense, or core damage engine.',
    relatedItems: ['Item Scrap, White', 'Item Scrap, Green', 'Item Scrap, Red', 'Item Scrap, Yellow'],
    relatedSurvivors: [],
    relatedMechanics: ['Printer', 'Cauldron', 'Item Tier'],
    tags: ['economy', 'scrap', 'items']
  },
  {
    id: 'printer',
    term: 'Printer',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'BEGINNER',
    shortDefinition: 'An interactable that trades items or scrap for copies of a specific item.',
    plainEnglish: 'A printer converts your inventory toward one item. It can be run-saving or run-ruining.',
    whyItMatters:
      'Printers let you force powerful stacks, but careless printing can delete important parts of your build.',
    playerAction:
      'Use printers when the output item solves a real problem. Scrap weak items first so the printer consumes scrap instead of your best pieces.',
    relatedItems: ["Soldier's Syringe", 'Tri-Tip Dagger', "Lens-Maker's Glasses", 'Tougher Times'],
    relatedSurvivors: [],
    relatedMechanics: ['Scrapping', 'Stacking', 'Item Tier'],
    tags: ['economy', 'printer', 'items', 'build-planning']
  },
  {
    id: 'artifact',
    term: 'Artifact',
    category: 'ARTIFACTS_UNLOCKS',
    difficulty: 'BEGINNER',
    shortDefinition: 'A run modifier that changes game rules.',
    plainEnglish:
      'Artifacts are optional modifiers that change how a run works. Some give more control, while others make the run much harder.',
    whyItMatters:
      'Artifacts can completely change item choice, enemy behavior, loot flow, challenge runs, and build testing.',
    playerAction:
      'Use artifacts deliberately. Artifact of Command is useful for testing builds, while difficulty artifacts are better treated as challenge settings.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Artifact Code', 'Challenge Unlock', 'Run Modifier'],
    tags: ['artifacts', 'run-modifier', 'unlock']
  },
  {
    id: 'challenge-unlock',
    term: 'Challenge Unlock',
    category: 'ARTIFACTS_UNLOCKS',
    difficulty: 'BEGINNER',
    shortDefinition: 'A task that permanently unlocks new content.',
    plainEnglish:
      'Some survivors, skills, items, equipment, skins, and artifacts are locked until you complete specific challenges.',
    whyItMatters:
      'If something is missing from your runs, it may not be available yet because the challenge is incomplete.',
    playerAction: 'Use an unlock tracker to identify missing content, then plan runs around the easiest challenge setup.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Artifact', 'Item', 'Equipment', 'Survivor'],
    tags: ['unlock', 'challenge', 'progression']
  }
];

export const statusEffectGlossaryEntries: GlossaryEntry[] = [
  {
    id: 'bleed',
    term: 'Bleed',
    category: 'STATUS_EFFECTS',
    difficulty: 'BEGINNER',
    shortDefinition: 'A stackable damage-over-time debuff.',
    plainEnglish:
      'Bleed makes a target take damage over time after being hit. Multiple bleed stacks can build up on the same target.',
    whyItMatters:
      'Bleed is one of the easiest and most important damage-over-time effects to build around. It works especially well with fast hits, high proc rates, and crit-based bleed setups.',
    playerAction:
      'Prioritize bleed on survivors who hit quickly or trigger many item effects. If you are using Death Mark, bleed is one of the easiest debuffs to include.',
    relatedItems: ['Tri-Tip Dagger', 'Shatterspleen', 'Noxious Thorn', 'Sawmerang'],
    relatedSurvivors: ['Commando', 'MUL-T', 'Huntress', 'Bandit'],
    relatedMechanics: ['Proc', 'Proc Coefficient', 'On-Hit Effect', 'Death Mark'],
    tags: ['status-effect', 'debuff', 'dot', 'bleed', 'proc', 'base-game']
  },
  {
    id: 'burn',
    term: 'Burn',
    category: 'STATUS_EFFECTS',
    difficulty: 'BEGINNER',
    shortDefinition: 'A stackable fire damage-over-time debuff that can disable health regeneration.',
    plainEnglish: 'Burn deals fire damage over time. It can come from enemies, elites, survivor skills, and items.',
    whyItMatters:
      'Burn is dangerous when enemies apply it to you, but useful when your build spreads it to groups. It is also relevant for Death Mark because it counts as a debuff.',
    playerAction:
      'Use burn for group clearing and debuff stacking. When enemies burn you, reposition quickly instead of trying to facetank through it.',
    relatedItems: ['Gasoline', 'Molten Perforator', 'Molotov (6-Pack)', "Ifrit's Distinction"],
    relatedSurvivors: ['Artificer'],
    relatedMechanics: ['Damage Over Time', 'Death Mark', 'Ignite'],
    tags: ['status-effect', 'debuff', 'dot', 'fire', 'burn', 'base-game']
  },
  {
    id: 'blight',
    term: 'Blight',
    category: 'STATUS_EFFECTS',
    difficulty: 'INTERMEDIATE',
    shortDefinition: "Acrid's alternate stackable damage-over-time effect.",
    plainEnglish:
      "Blight replaces Acrid's Poison when using the Blight passive. Unlike Poison, Blight stacks and deals damage over time based on Acrid's damage.",
    whyItMatters:
      "Blight can stack for direct damage, but it changes Acrid's identity from percent-health pressure to stack-based damage.",
    playerAction: 'Use Blight if you want Acrid to focus more on stacking damage. Use Poison if you want safer percent-health boss pressure.',
    relatedItems: [],
    relatedSurvivors: ['Acrid'],
    relatedMechanics: ['Poison', 'Damage Over Time', 'Death Mark'],
    tags: ['status-effect', 'debuff', 'dot', 'blight', 'acrid', 'base-game']
  },
  {
    id: 'poison',
    term: 'Poison',
    category: 'STATUS_EFFECTS',
    difficulty: 'BEGINNER',
    shortDefinition: "Acrid's percent-health damage-over-time debuff.",
    plainEnglish:
      "Poison is Acrid's main damage-over-time effect. It is especially good against high-health enemies because it scales against the victim instead of relying only on normal hit damage.",
    whyItMatters:
      "Poison lets Acrid pressure bosses and tanky targets safely over time. It is one of Acrid's main reasons to exist.",
    playerAction: 'Apply Poison, keep moving, and let the effect work. Do not stand still trying to force every kill manually.',
    relatedItems: [],
    relatedSurvivors: ['Acrid'],
    relatedMechanics: ['Blight', 'Damage Over Time', 'Death Mark'],
    tags: ['status-effect', 'debuff', 'dot', 'poison', 'acrid', 'base-game']
  },
  {
    id: 'collapse',
    term: 'Collapse',
    category: 'STATUS_EFFECTS',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'A delayed burst damage debuff from Survivors of the Void.',
    plainEnglish: 'Collapse stacks on a target, waits briefly, then detonates for damage based on the number of stacks.',
    whyItMatters:
      'Collapse behaves differently from bleed. Instead of steady damage over time, it creates delayed burst damage.',
    playerAction:
      'Use Collapse when you want delayed burst from repeated hits. Be careful when Voidtouched enemies apply it to you, because the delayed burst can catch you after you think you escaped.',
    relatedItems: ['Needletick'],
    relatedSurvivors: [],
    relatedMechanics: ['Proc', 'Proc Coefficient', 'Voidtouched', 'Damage Over Time'],
    tags: ['status-effect', 'debuff', 'delayed-damage', 'collapse', 'sotv']
  },
  {
    id: 'slow',
    term: 'Slow',
    category: 'STATUS_EFFECTS',
    difficulty: 'BEGINNER',
    shortDefinition: 'A movement-speed reduction debuff.',
    plainEnglish:
      'Slow reduces how fast a target can move. Some slows are mild, while others are severe enough to make enemies easy targets.',
    whyItMatters:
      'Slowing enemies helps with aim, spacing, crowd control, and Death Mark setup. Being slowed as the player is dangerous because mobility is one of your strongest defenses.',
    playerAction:
      'Use slow to control enemies, but treat player slow as an emergency. If you are slowed, stop greeding for loot and get out of danger.',
    relatedItems: ['Chronobauble', "Runald's Band", 'Frost Relic', 'Tentabauble'],
    relatedSurvivors: ['Huntress', 'Engineer', 'Void Fiend'],
    relatedMechanics: ['Crowd Control', 'Death Mark', 'Mobility'],
    tags: ['status-effect', 'debuff', 'slow', 'crowd-control', 'base-game']
  },
  {
    id: 'root',
    term: 'Root',
    category: 'STATUS_EFFECTS',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'A movement-lock debuff that can reduce movement speed to zero.',
    plainEnglish: 'Root prevents movement for a short duration. Some effects fully lock a target in place.',
    whyItMatters:
      'Root is powerful crowd control against enemies, but extremely dangerous when applied to the player because RoR2 survival depends heavily on movement.',
    playerAction:
      'Use root to hold enemies in damage zones. If rooted as the player, prioritize defensive skills, invulnerability windows, or immediate threat removal.',
    relatedItems: ['Tentabauble', 'Hooks of Heresy'],
    relatedSurvivors: ['REX'],
    relatedMechanics: ['Slow', 'Nullified', 'Crowd Control'],
    tags: ['status-effect', 'debuff', 'root', 'crowd-control', 'sotv', 'lunar']
  },
  {
    id: 'cripple',
    term: 'Cripple',
    category: 'STATUS_EFFECTS',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'A debuff that reduces armor and movement speed.',
    plainEnglish: 'Cripple makes a target slower and easier to damage by reducing armor.',
    whyItMatters:
      'Cripple is strong against enemies because it improves damage and control at the same time. It is dangerous on players because it damages both survivability and mobility.',
    playerAction:
      'Use Cripple when you want enemies to take more damage and have less ability to chase or escape. Avoid standing in Effigy of Grief unless you intentionally placed it for a plan.',
    relatedItems: ['Effigy of Grief', 'Shared Design'],
    relatedSurvivors: [],
    relatedMechanics: ['Armor', 'Slow', 'Death Mark'],
    tags: ['status-effect', 'debuff', 'armor-reduction', 'slow', 'lunar', 'base-game']
  },
  {
    id: 'death-mark-status',
    term: 'Death Mark',
    category: 'STATUS_EFFECTS',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'A debuff that increases damage taken after enough other debuffs are applied.',
    plainEnglish: 'Death Mark activates when an enemy has enough debuffs. Once marked, that enemy takes increased damage from all sources.',
    whyItMatters:
      'Death Mark turns debuff stacking into a damage multiplier. It rewards builds that can apply several different negative effects reliably.',
    playerAction:
      'Only value Death Mark highly if your build can apply multiple debuffs consistently. Bleed, slow, burn, collapse, poison, cripple, and armor reduction can all help build toward it.',
    relatedItems: ['Death Mark', 'Tri-Tip Dagger', 'Gasoline', 'Chronobauble', "Runald's Band"],
    relatedSurvivors: ['Acrid', 'REX', 'Artificer', 'Bandit'],
    relatedMechanics: ['Debuff', 'Bleed', 'Burn', 'Slow', 'Poison'],
    tags: ['status-effect', 'debuff', 'damage-amp', 'death-mark', 'base-game']
  },
  {
    id: 'healing-disabled',
    term: 'Healing Disabled',
    category: 'STATUS_EFFECTS',
    difficulty: 'ADVANCED',
    shortDefinition: 'A debuff that prevents healing and regeneration.',
    plainEnglish: 'Healing Disabled stops healing effects from restoring health. It is commonly associated with Malachite enemies.',
    whyItMatters: 'Healing Disabled is lethal because it turns sustain builds off at the exact moment you probably need them.',
    playerAction:
      'When hit by Malachite-style healing block, disengage immediately. Do not rely on leeching, regeneration, or healing items until the effect is gone.',
    relatedItems: ["N'kuhana's Retort", 'Wake of Vultures', 'Blast Shower', "Ben's Raincoat"],
    relatedSurvivors: [],
    relatedMechanics: ['Healing', 'Regeneration', 'Malachite', 'Cleanse'],
    tags: ['status-effect', 'debuff', 'healing-block', 'malachite', 'base-game']
  },
  {
    id: 'hemorrhage',
    term: 'Hemorrhage',
    category: 'STATUS_EFFECTS',
    difficulty: 'INTERMEDIATE',
    shortDefinition: "Bandit's heavy damage-over-time debuff from Serrated skills.",
    plainEnglish:
      "Hemorrhage is a powerful bleeding-style effect applied by Bandit's Serrated Dagger or Serrated Shiv on critical hits.",
    whyItMatters: 'Hemorrhage gives Bandit strong damage over time, especially when he can consistently crit from behind.',
    playerAction:
      'As Bandit, use positioning and backstabs to apply Hemorrhage reliably. Treat it as a major part of your single-target damage plan.',
    relatedItems: ["Lens-Maker's Glasses", 'Predatory Instincts', 'Shatterspleen'],
    relatedSurvivors: ['Bandit'],
    relatedMechanics: ['Crit', 'Bleed', 'Damage Over Time'],
    tags: ['status-effect', 'debuff', 'dot', 'hemorrhage', 'bandit', 'base-game']
  },
  {
    id: 'expose',
    term: 'Expose',
    category: 'STATUS_EFFECTS',
    difficulty: 'INTERMEDIATE',
    shortDefinition: "Mercenary's debuff that rewards follow-up hits with damage and cooldown reduction.",
    plainEnglish: "Expose marks enemies. Hitting exposed enemies deals bonus damage and reduces Mercenary's cooldowns.",
    whyItMatters:
      "Expose is central to Mercenary's rhythm. It turns clean follow-up hits into more damage and more skill uptime.",
    playerAction: 'As Mercenary, build your combos around applying Expose and then immediately consuming it with another hit.',
    relatedItems: [],
    relatedSurvivors: ['Mercenary'],
    relatedMechanics: ['Cooldown', 'Skill Combo', 'Melee'],
    tags: ['status-effect', 'debuff', 'cooldown', 'mercenary', 'base-game']
  },
  {
    id: 'lunar-ruin',
    term: 'Lunar Ruin',
    category: 'STATUS_EFFECTS',
    difficulty: 'ADVANCED',
    shortDefinition: 'A Seekers of the Storm debuff that increases damage taken and reduces healing.',
    plainEnglish:
      'Lunar Ruin makes the victim take more damage and receive less healing. It stacks, so repeated applications become increasingly dangerous.',
    whyItMatters:
      'This is a high-threat debuff because it attacks both sides of survival: incoming damage gets worse and recovery gets weaker.',
    playerAction: 'If Lunar Ruin is on you, stop trading hits. Break line of sight, dodge, and let the effect drop before re-engaging.',
    relatedItems: [],
    relatedSurvivors: ['False Son'],
    relatedMechanics: ['Healing', 'Damage Taken', 'Seekers of the Storm'],
    tags: ['status-effect', 'debuff', 'damage-taken', 'healing-reduction', 'sots']
  },
  {
    id: 'nullified',
    term: 'Nullified',
    category: 'STATUS_EFFECTS',
    difficulty: 'ADVANCED',
    shortDefinition: 'A Void debuff that locks movement.',
    plainEnglish: 'Nullified reduces movement speed to zero, usually after enough Nullify stacks are applied.',
    whyItMatters: 'Being locked in place is extremely dangerous in RoR2 because most survival comes from constant motion.',
    playerAction:
      'Respect Void enemies that can apply Nullify stacks. If you are close to being rooted, disengage before the full lock happens.',
    relatedItems: ['Tentabauble'],
    relatedSurvivors: [],
    relatedMechanics: ['Nullify Stack', 'Root', 'Void Enemies'],
    tags: ['status-effect', 'debuff', 'root', 'void', 'sotv']
  },
  {
    id: 'permanent-armor-reduction',
    term: 'Permanent Armor Reduction',
    category: 'STATUS_EFFECTS',
    difficulty: 'ADVANCED',
    shortDefinition: 'A stackable armor reduction effect that lasts for the stage or until death.',
    plainEnglish: 'Permanent Armor Reduction lowers armor repeatedly, making the target take more damage over time.',
    whyItMatters: 'This is strong for long fights because repeated hits keep stripping armor away.',
    playerAction:
      'Use armor reduction to improve team damage against bosses and tanky enemies. Be careful around enemies or effects that can apply similar long-lasting defense loss to you.',
    relatedItems: ['Symbiotic Scorpion'],
    relatedSurvivors: [],
    relatedMechanics: ['Armor', 'Damage Amplification', 'Boss Damage'],
    tags: ['status-effect', 'debuff', 'armor-reduction', 'sotv']
  },
  {
    id: 'void-fog',
    term: 'Void Fog',
    category: 'STATUS_EFFECTS',
    difficulty: 'ADVANCED',
    shortDefinition: 'An environmental Void damage effect that ramps through repeated ticks.',
    plainEnglish:
      'Void Fog damages characters over time when they remain outside safe areas or inside certain Void zones.',
    whyItMatters:
      'Void Fog is not a normal enemy hit. It can kill through greedy pathing, bad positioning, or slow objective play.',
    playerAction: 'Treat Void Fog as a positioning timer. Get back to safety quickly instead of trying to outheal it.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Void Fields', 'Void Locus', 'Simulacrum', 'Positioning'],
    tags: ['status-effect', 'environmental', 'void', 'sotv']
  }
];

export const economyInteractableGlossaryEntries: GlossaryEntry[] = [
  {
    id: 'chest',
    term: 'Chest',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'BEGINNER',
    shortDefinition: 'A paid loot container that gives an item.',
    plainEnglish: 'Chests are the basic way to turn gold into items during a stage.',
    whyItMatters:
      'Opening enough chests keeps your build ahead of the difficulty timer, but clearing every chest can waste time.',
    playerAction: 'Open chests along your route. Do not full-clear huge maps unless the item density is worth the time.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Gold', 'Difficulty Scaling', 'Loot Routing', 'Teleporter Event'],
    tags: ['economy', 'loot', 'chest', 'gold', 'base-game']
  },
  {
    id: 'large-chest',
    term: 'Large Chest',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'BEGINNER',
    shortDefinition: 'A more expensive chest with better item potential.',
    plainEnglish: 'Large chests cost more than normal chests but can give higher-value rewards.',
    whyItMatters:
      'Large chests are better when you have extra gold or need stronger item quality, but they can slow your stage pacing.',
    playerAction:
      'Open large chests when they are convenient or when you already have enough gold. Do not delay the teleporter too long for one far-away chest.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Gold', 'Loot Routing', 'Difficulty Scaling'],
    tags: ['economy', 'loot', 'chest', 'gold', 'base-game']
  },
  {
    id: 'multishop-terminal',
    term: 'Multishop Terminal',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'BEGINNER',
    shortDefinition: 'A shop-style interactable that lets you choose one visible item.',
    plainEnglish: 'Multishops show multiple possible rewards, but buying one usually locks the others.',
    whyItMatters:
      'Multishops give more control than normal chests because you can choose the item that fits your build.',
    playerAction:
      'Check every option before buying. Pick the item that solves your current build problem, not just the rarest-looking one.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Item Choice', 'Build Planning', 'Gold'],
    tags: ['economy', 'loot', 'choice', 'shop', 'base-game']
  },
  {
    id: 'adaptive-chest',
    term: 'Adaptive Chest',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'A timing-based chest that cycles through possible rewards.',
    plainEnglish: 'Adaptive Chests cycle through items. You interact at the right time to select the item you want.',
    whyItMatters: 'They give strong control if you can time the selection, especially when a key item appears.',
    playerAction: 'Pause and watch the cycle before selecting. Do not panic-click unless the area is unsafe.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Item Choice', 'Loot Routing', 'Build Planning'],
    tags: ['economy', 'loot', 'choice', 'timing', 'base-game']
  },
  {
    id: 'barrel',
    term: 'Barrel',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'BEGINNER',
    shortDefinition: 'A small interactable that gives gold.',
    plainEnglish: 'Barrels give small amounts of money and are useful early when every purchase matters.',
    whyItMatters: 'Barrels help you afford early chests without fighting as many enemies.',
    playerAction: 'Tap barrels along your path, but do not wander across the whole map for them.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Gold', 'Loot Routing', 'Early Game'],
    tags: ['economy', 'gold', 'routing', 'base-game']
  },
  {
    id: 'scrapper',
    term: 'Scrapper',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'BEGINNER',
    shortDefinition: 'An interactable that converts unwanted items into scrap.',
    plainEnglish:
      'Scrappers let you turn items into scrap of the same tier. Scrap is then consumed first by compatible printers and cauldrons.',
    whyItMatters:
      'Scrapping gives you control. It removes weak items and protects stronger items from being consumed by printers.',
    playerAction:
      'Scrap items that do not support your survivor or build plan. Keep at least one mobility, defense, and damage engine before getting aggressive with scrapping.',
    relatedItems: ['Item Scrap, White', 'Item Scrap, Green', 'Item Scrap, Red', 'Item Scrap, Yellow'],
    relatedSurvivors: [],
    relatedMechanics: ['Printer', 'Cauldron', 'Item Tier', 'Build Planning'],
    tags: ['economy', 'scrap', 'printer', 'items', 'base-game']
  },
  {
    id: 'printer-3d',
    term: '3D Printer',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'BEGINNER',
    shortDefinition: 'An interactable that converts items or scrap into a displayed item.',
    plainEnglish: 'A 3D Printer trades items of the same tier for copies of the item shown on the printer.',
    whyItMatters:
      'Printers can turn a scattered build into a focused one, but they can also eat important items if you are careless.',
    playerAction:
      'Use printers when the item solves a real problem. Scrap weak items first so the printer consumes scrap instead of valuable inventory pieces.',
    relatedItems: ['Item Scrap, White', 'Item Scrap, Green', 'Regenerating Scrap'],
    relatedSurvivors: [],
    relatedMechanics: ['Scrapper', 'Stacking', 'Item Tier', 'Diminishing Returns'],
    tags: ['economy', 'printer', 'items', 'scrap', 'base-game']
  },
  {
    id: 'cauldron',
    term: 'Cauldron',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'An interactable that converts lower-tier items into higher-tier rewards.',
    plainEnglish:
      'Cauldrons trade items of one tier for another item, usually letting you convert multiple lower-tier items into a stronger reward.',
    whyItMatters: 'Cauldrons can upgrade weak inventory pieces into powerful items, especially when you have scrap ready.',
    playerAction:
      'Use cauldrons when the output is worth the cost. Avoid feeding away critical items unless scrap will be consumed first.',
    relatedItems: ['Item Scrap, White', 'Item Scrap, Green', 'Item Scrap, Red', 'Regenerating Scrap'],
    relatedSurvivors: [],
    relatedMechanics: ['Scrapper', 'Printer', 'Item Tier', 'Bazaar Between Time'],
    tags: ['economy', 'cauldron', 'items', 'scrap', 'base-game']
  },
  {
    id: 'cleansing-pool',
    term: 'Cleansing Pool',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'An interactable that converts lunar items into Pearls.',
    plainEnglish: 'A Cleansing Pool takes a lunar item or lunar equipment and converts it into a Pearl or Irradiant Pearl.',
    whyItMatters: 'This gives you a way to remove risky lunar items and turn them into stat value.',
    playerAction:
      'Use Cleansing Pools when a lunar item is hurting your build or when you want to cash out lunar risk into safer stats.',
    relatedItems: ['Pearl', 'Irradiant Pearl', 'Lunar Items', 'Lunar Equipment'],
    relatedSurvivors: ['MUL-T'],
    relatedMechanics: ['Lunar Items', 'Item Trade', 'Risk Reward'],
    tags: ['economy', 'lunar', 'cleansing-pool', 'pearl', 'hidden-realms']
  },
  {
    id: 'shrine-of-chance',
    term: 'Shrine of Chance',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'BEGINNER',
    shortDefinition: 'A shrine that costs gold and may reward an item or equipment.',
    plainEnglish: 'Shrine of Chance is gambling with stage money. It can pay out, fail, or become expensive after repeated use.',
    whyItMatters: 'It can provide extra items, but bad luck can drain gold and slow your stage tempo.',
    playerAction:
      'Use it when you have spare gold or limited chest options nearby. Stop feeding it if the stage timer is already getting ugly.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Gold', 'Loot Routing', 'Difficulty Scaling', 'RNG'],
    tags: ['economy', 'shrine', 'gold', 'rng', 'base-game']
  },
  {
    id: 'shrine-of-blood',
    term: 'Shrine of Blood',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'BEGINNER',
    shortDefinition: 'A shrine that trades health for gold.',
    plainEnglish: 'Shrine of Blood takes a percentage of your current health and gives gold in return.',
    whyItMatters: 'It can accelerate early looting, but it can also leave you vulnerable if enemies are nearby.',
    playerAction:
      'Use it when the area is safe or when you have healing ready. Do not activate it in the middle of enemy pressure unless you know exactly why.',
    relatedItems: ['Foreign Fruit', 'Medkit', 'Cautious Slug', 'Bustling Fungus'],
    relatedSurvivors: ['REX'],
    relatedMechanics: ['Health', 'Gold', 'Healing', 'Risk Reward'],
    tags: ['economy', 'shrine', 'health-cost', 'gold', 'base-game']
  },
  {
    id: 'shrine-of-combat',
    term: 'Shrine of Combat',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'BEGINNER',
    shortDefinition: 'A shrine that spawns enemies for extra gold and loot pacing.',
    plainEnglish: 'Shrine of Combat summons a group of enemies. Killing them gives gold like normal combat.',
    whyItMatters: 'It can speed up money gain when enemy spawns are slow, but it adds danger.',
    playerAction:
      'Use it when you need gold and your build can safely clear the spawned enemies. Avoid it if you are already behind or low on health.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Gold', 'Enemy Spawns', 'Director', 'Difficulty Scaling'],
    tags: ['economy', 'shrine', 'combat', 'gold', 'base-game']
  },
  {
    id: 'shrine-of-the-mountain',
    term: 'Shrine of the Mountain',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'A shrine that makes the teleporter boss harder for extra rewards.',
    plainEnglish: 'Shrine of the Mountain increases teleporter boss difficulty and adds extra item rewards after the event.',
    whyItMatters: 'It is one of the clearest risk-reward choices in a stage. More loot, more danger.',
    playerAction:
      'Activate it when your build can handle a harder boss. Skip it when your single-target damage, mobility, or defense is weak.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Teleporter Event', 'Boss', 'Risk Reward', 'Difficulty Scaling'],
    tags: ['economy', 'shrine', 'boss', 'reward', 'base-game']
  },
  {
    id: 'shrine-of-the-woods',
    term: 'Shrine of the Woods',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'BEGINNER',
    shortDefinition: 'A shrine that creates a healing zone.',
    plainEnglish: 'Shrine of the Woods spends gold to create or improve a healing area.',
    whyItMatters:
      'It can help during early fights or teleporter events, but stationary healing is less reliable once enemies become dangerous.',
    playerAction: 'Use it if you are fighting nearby and need sustain. Do not rely on it as your main survival plan in later stages.',
    relatedItems: ['Bustling Fungus', 'Rejuvenation Rack'],
    relatedSurvivors: ['Engineer'],
    relatedMechanics: ['Healing', 'Positioning', 'Teleporter Event'],
    tags: ['economy', 'shrine', 'healing', 'base-game']
  },
  {
    id: 'shrine-of-order',
    term: 'Shrine of Order',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'ADVANCED',
    shortDefinition: 'A rare shrine that reorganizes your items into random stacks by tier.',
    plainEnglish: 'Shrine of Order rerolls your inventory by item tier, turning each tier into large stacks of selected items.',
    whyItMatters: 'It can create a broken build or completely ruin one. It is chaos with a receipt.',
    playerAction:
      'Use it only when your current build is already doomed, you are intentionally gambling, or you are doing a specific challenge/fun run.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Stacking', 'Item Tier', 'Risk Reward', 'RNG'],
    tags: ['economy', 'shrine', 'rng', 'high-risk', 'base-game']
  },
  {
    id: 'shrine-of-shaping',
    term: 'Shrine of Shaping',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'A Seekers of the Storm shrine tied to item shaping behavior.',
    plainEnglish: 'Shrine of Shaping is an expansion shrine that changes item reward behavior through a special interactable rule.',
    whyItMatters: 'Expansion-specific shrines should be clearly tagged so players know why they are not seeing them in base-game runs.',
    playerAction: 'Show this entry only when Seekers of the Storm content is enabled in your app filters.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['DLC Toggle', 'Item Choice', 'Expansion Content'],
    tags: ['economy', 'shrine', 'sots', 'dlc', 'seekers-of-the-storm']
  },
  {
    id: 'newt-altar',
    term: 'Newt Altar',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'BEGINNER',
    shortDefinition: 'A hidden altar that opens a Blue Portal after the teleporter event.',
    plainEnglish:
      'Newt Altars are hidden on standard stages. Spending a lunar coin on one causes a Blue Portal to appear after the teleporter event.',
    whyItMatters: 'Blue Portals give access to the Bazaar Between Time, where players can buy lunar items and use cauldrons.',
    playerAction:
      'Use Newt Altars when you want lunar items, cauldron trades, or a route break. Learn common altar locations for faster stage routing.',
    relatedItems: ['Lunar Coin', 'Lunar Items'],
    relatedSurvivors: [],
    relatedMechanics: ['Bazaar Between Time', 'Blue Portal', 'Cauldron', 'Lunar Items'],
    tags: ['economy', 'lunar', 'newt-altar', 'blue-portal', 'base-game']
  },
  {
    id: 'lunar-pod',
    term: 'Lunar Pod',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'A lunar coin interactable that gives a lunar item or equipment.',
    plainEnglish: 'Lunar Pods cost lunar coins and drop lunar items or lunar equipment.',
    whyItMatters: 'Lunar items are powerful but often come with serious tradeoffs.',
    playerAction: 'Open Lunar Pods when your build can handle lunar downside or when you are hunting a specific lunar strategy.',
    relatedItems: ['Lunar Coin', 'Gesture of the Drowned', 'Shaped Glass', 'Transcendence'],
    relatedSurvivors: [],
    relatedMechanics: ['Lunar Items', 'Risk Reward', 'Cleansing Pool'],
    tags: ['economy', 'lunar', 'lunar-pod', 'risk-reward', 'base-game']
  },
  {
    id: 'void-cradle',
    term: 'Void Cradle',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'A Void interactable that costs health and gives a Void item.',
    plainEnglish: 'Void Cradles trade part of your health for a Void item.',
    whyItMatters: 'Void items can be very strong, but the health cost can get you killed if the area is unsafe.',
    playerAction:
      'Clear nearby enemies first. Open Void Cradles when you can survive the health loss and deal with any resulting pressure.',
    relatedItems: ['Void Items', 'Needletick', 'Plasma Shrimp', 'Weeping Fungus'],
    relatedSurvivors: [],
    relatedMechanics: ['Void Items', 'Health Cost', 'Risk Reward', 'Corruption'],
    tags: ['economy', 'void', 'void-cradle', 'health-cost', 'sotv']
  },
  {
    id: 'void-potential',
    term: 'Void Potential',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'A Void reward container that offers a choice of Void items.',
    plainEnglish: 'Void Potentials let you choose from multiple Void rewards instead of taking a random one.',
    whyItMatters: 'Choice makes Void rewards much safer because you can avoid corrupting items that your build needs.',
    playerAction: 'Pick the Void item that improves your build without breaking a core item stack.',
    relatedItems: ['Void Items'],
    relatedSurvivors: [],
    relatedMechanics: ['Void Items', 'Item Choice', 'Corruption', 'DLC Toggle'],
    tags: ['economy', 'void', 'choice', 'sotv']
  },
  {
    id: 'radio-scanner',
    term: 'Radio Scanner',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'BEGINNER',
    shortDefinition: 'An interactable used to unlock environment logs.',
    plainEnglish: 'Radio Scanners are logbook interactables tied to environment discovery.',
    whyItMatters: 'They matter for completion tracking rather than immediate combat power.',
    playerAction: 'Use them when you see them. In your app, track which environment logs the player has collected.',
    relatedItems: [],
    relatedSurvivors: [],
    relatedMechanics: ['Logbook', 'Unlock Tracker', 'Environment'],
    tags: ['interactable', 'logbook', 'completion', 'base-game']
  },
  {
    id: 'altar-of-gold',
    term: 'Altar of Gold',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'INTERMEDIATE',
    shortDefinition: 'A gold-cost altar that opens access to the Gilded Coast.',
    plainEnglish: 'The Altar of Gold creates a Gold Portal after the teleporter event, leading to the Gilded Coast.',
    whyItMatters: 'This opens a special route and gives access to Aurelionite-related rewards.',
    playerAction:
      'Use it when you can afford the cost and want the special stage route. Do not spend all your gold if you still need basic stage items.',
    relatedItems: ['Halcyon Seed'],
    relatedSurvivors: [],
    relatedMechanics: ['Gold Portal', 'Gilded Coast', 'Aurelionite', 'Route Choice'],
    tags: ['economy', 'gold', 'altar', 'special-stage', 'base-game']
  },
  {
    id: 'drone',
    term: 'Drone',
    category: 'ECONOMY_INTERACTABLES',
    difficulty: 'BEGINNER',
    shortDefinition: 'A repairable ally that follows the player and provides support.',
    plainEnglish:
      'Drones can be repaired with gold and then follow you as allies. Different drones provide damage, healing, missiles, equipment effects, or other utility.',
    whyItMatters: 'Drones add extra pressure and utility, but they can die and become less reliable as the run gets harder.',
    playerAction:
      'Repair useful drones when you have spare gold. Prioritize healing or strong damage drones over low-value spending when time is tight.',
    relatedItems: ['Spare Drone Parts', 'The Back-up'],
    relatedSurvivors: ['Captain'],
    relatedMechanics: ['Gold', 'Allies', 'Summons'],
    tags: ['economy', 'drone', 'ally', 'gold', 'base-game']
  }
];

export const allGlossaryEntries: GlossaryEntry[] = [
  ...glossaryEntries,
  ...statusEffectGlossaryEntries,
  ...economyInteractableGlossaryEntries,
  ...itemCategoryGlossaryEntries,
  ...itemCategories
    .filter(
      (category) =>
        !itemCategoryGlossaryEntries.some(
          (entry) => normalizeGlossaryLookupValue(entry.term) === normalizeGlossaryLookupValue(category)
        )
    )
    .map(createItemCategoryFallbackEntry)
];

export function findGlossaryEntryByTerm(term: string) {
  const normalizedTerm = normalizeGlossaryLookupValue(term);
  return allGlossaryEntries.find((entry) => normalizeGlossaryLookupValue(entry.term) === normalizedTerm) ?? null;
}
