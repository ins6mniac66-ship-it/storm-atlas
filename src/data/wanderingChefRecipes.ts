export type ChefRecipeCategory =
  | 'Route'
  | 'Meal'
  | 'Common'
  | 'Uncommon'
  | 'Legendary'
  | 'Equipment'
  | 'Boss'
  | 'Elite Aspect'
  | 'Repair';

export type ChefRecipe = {
  id: string;
  result: string;
  category: ChefRecipeCategory;
  ingredients: [string, string];
  notes?: string;
};

function recipe(id: string, result: string, category: ChefRecipeCategory, first: string, second: string, notes?: string): ChefRecipe {
  return {
    id,
    result,
    category,
    ingredients: [first, second],
    notes
  };
}

export const chefRecipes: ChefRecipe[] = [
  recipe('exposed-cerebellum-sentry-key', 'Exposed Cerebellum', 'Route', 'Encrypted Cerebellum', 'Sentry Key', 'Use on SPEX to open Neural Sanctum.'),
  recipe('exposed-cerebellum-encrusted-key', 'Exposed Cerebellum', 'Route', 'Encrypted Cerebellum', 'Encrusted Key', 'Use on SPEX to open Neural Sanctum.'),
  recipe('exposed-cerebellum-rusted-key', 'Exposed Cerebellum', 'Route', 'Encrypted Cerebellum', 'Rusted Key', 'Use on SPEX to open Neural Sanctum.'),
  recipe('exposed-cerebellum-empathy-cores', 'Exposed Cerebellum', 'Route', 'Encrypted Cerebellum', 'Empathy Cores', 'Use on SPEX to open Neural Sanctum.'),
  recipe('exposed-cerebellum-orphaned-core', 'Exposed Cerebellum', 'Route', 'Encrypted Cerebellum', 'Orphaned Core', 'Use on SPEX to open Neural Sanctum.'),
  recipe('exposed-cerebellum-prison-matrix', 'Exposed Cerebellum', 'Route', 'Encrypted Cerebellum', 'Prison Matrix', 'Save Prison Matrix if you still need Drifter.'),

  recipe('seared-steak-bison-steak', 'Seared Steak', 'Meal', 'Bison Steak', 'Bison Steak'),
  recipe('seared-steak-mocha', 'Seared Steak', 'Meal', 'Bison Steak', 'Mocha'),
  recipe('seared-steak-cautious-slug', 'Seared Steak', 'Meal', 'Bison Steak', 'Cautious Slug'),
  recipe('seared-steak-eclipse-lite', 'Seared Steak', 'Meal', 'Bison Steak', 'Eclipse Lite'),
  recipe('seared-steak-bustling-fungus', 'Seared Steak', 'Meal', 'Bison Steak', 'Bustling Fungus'),
  recipe('seared-steak-power-elixir', 'Seared Steak', 'Meal', 'Bison Steak', 'Power Elixir'),
  recipe('seared-steak-elusive-antlers', 'Seared Steak', 'Meal', 'Bison Steak', 'Elusive Antlers'),
  recipe('seared-steak-energy-drink', 'Seared Steak', 'Meal', 'Bison Steak', 'Energy Drink'),
  recipe('seared-steak-monster-tooth', 'Seared Steak', 'Meal', 'Bison Steak', 'Monster Tooth'),
  recipe('quick-fix-bison-steak', 'Quick Fix', 'Meal', 'Item Scrap, White', 'Bison Steak'),
  recipe('quick-fix-mocha', 'Quick Fix', 'Meal', 'Item Scrap, White', 'Mocha'),
  recipe('quick-fix-cautious-slug', 'Quick Fix', 'Meal', 'Item Scrap, White', 'Cautious Slug'),
  recipe('quick-fix-eclipse-lite', 'Quick Fix', 'Meal', 'Item Scrap, White', 'Eclipse Lite'),
  recipe('quick-fix-bustling-fungus', 'Quick Fix', 'Meal', 'Item Scrap, White', 'Bustling Fungus'),
  recipe('quick-fix-power-elixir', 'Quick Fix', 'Meal', 'Item Scrap, White', 'Power Elixir'),
  recipe('quick-fix-elusive-antlers', 'Quick Fix', 'Meal', 'Item Scrap, White', 'Elusive Antlers'),
  recipe('quick-fix-energy-drink', 'Quick Fix', 'Meal', 'Item Scrap, White', 'Energy Drink'),
  recipe('quick-fix-monster-tooth', 'Quick Fix', 'Meal', 'Item Scrap, White', 'Monster Tooth'),
  recipe('hearty-stew-lepton-daisy', 'Hearty Stew', 'Meal', 'Lepton Daisy', 'Lepton Daisy'),
  recipe('hearty-stew-squid-polyp', 'Hearty Stew', 'Meal', 'Lepton Daisy', 'Squid Polyp'),
  recipe('hearty-stew-leeching-seed', 'Hearty Stew', 'Meal', 'Lepton Daisy', 'Leeching Seed'),
  recipe('hearty-stew-noxious-thorn', 'Hearty Stew', 'Meal', 'Lepton Daisy', 'Noxious Thorn'),
  recipe('sauteed-worms', 'Sauteed Worms', 'Meal', 'Molten Perforator', 'Charged Perforator'),
  recipe('ultimate-meal-57-leaf-clover', 'Ultimate Meal', 'Meal', '57 Leaf Clover', '57 Leaf Clover'),
  recipe('ultimate-meal-alien-head', 'Ultimate Meal', 'Meal', '57 Leaf Clover', 'Alien Head'),
  recipe('ultimate-meal-growth-nectar', 'Ultimate Meal', 'Meal', '57 Leaf Clover', 'Growth Nectar'),
  recipe('ultimate-meal-wake-of-vultures', 'Ultimate Meal', 'Meal', '57 Leaf Clover', 'Wake of Vultures'),
  recipe('ultimate-meal-rejuvenation-rack', 'Ultimate Meal', 'Meal', '57 Leaf Clover', 'Rejuvenation Rack'),
  recipe('ultimate-meal-symbiotic-scorpion', 'Ultimate Meal', 'Meal', '57 Leaf Clover', 'Symbiotic Scorpion'),
  recipe('ultimate-meal-brainstalks', 'Ultimate Meal', 'Meal', '57 Leaf Clover', 'Brainstalks'),
  recipe('ultimate-meal-bottled-chaos', 'Ultimate Meal', 'Meal', '57 Leaf Clover', 'Bottled Chaos'),
  recipe('ultimate-meal-interstellar-desk-plant', 'Ultimate Meal', 'Meal', '57 Leaf Clover', 'Interstellar Desk Plant'),

  recipe('two-bison-steak-infusion', '2x Bison Steak', 'Common', 'Item Scrap, White', 'Infusion'),
  recipe('two-lens-maker-glasses-predatory-instincts', '2x Lens-Maker\'s Glasses', 'Common', 'Item Scrap, White', 'Predatory Instincts'),
  recipe('two-lens-maker-glasses-harvesters-scythe', '2x Lens-Maker\'s Glasses', 'Common', 'Item Scrap, White', 'Harvester\'s Scythe'),
  recipe('four-lens-maker-glasses', '4x Lens-Maker\'s Glasses', 'Common', 'Item Scrap, White', 'Laser Scope'),
  recipe('four-pauls-goat-hoof', '4x Paul\'s Goat Hoof', 'Common', 'Item Scrap, White', 'Hardlight Afterburner'),
  recipe('two-personal-shield-generator', '2x Personal Shield Generator', 'Common', 'Item Scrap, White', 'Kinetic Dampener'),
  recipe('four-personal-shield-generator', '4x Personal Shield Generator', 'Common', 'Item Scrap, White', 'Transcendence'),
  recipe('four-bustling-fungus', '4x Bustling Fungus', 'Common', 'Item Scrap, White', 'Interstellar Desk Plant'),
  recipe('four-topaz-brooch', '4x Topaz Brooch', 'Common', 'Item Scrap, White', 'Ben\'s Raincoat'),
  recipe('power-elixir-energy-drink', 'Power Elixir', 'Common', 'Empty Bottle', 'Energy Drink'),
  recipe('power-elixir-eclipse-lite', 'Power Elixir', 'Common', 'Empty Bottle', 'Eclipse Lite'),
  recipe('four-power-elixir', '4x Power Elixir', 'Common', 'Empty Bottle', 'Bottled Chaos'),
  recipe('two-white-scrap', '2x Item Scrap, White', 'Common', 'Item Scrap, White', 'Item Scrap, Green'),
  recipe('four-white-scrap-red', '4x Item Scrap, White', 'Common', 'Item Scrap, White', 'Item Scrap, Red'),
  recipe('four-white-scrap-yellow', '4x Item Scrap, White', 'Common', 'Item Scrap, White', 'Item Scrap, Yellow'),

  recipe('atg-missile', 'AtG Missile Mk. 1', 'Uncommon', 'Bundle of Fireworks', 'Sticky Bomb'),
  recipe('two-atg-missile', '2x AtG Missile Mk. 1', 'Uncommon', 'Pocket ICBM', 'Item Scrap, Green'),
  recipe('old-guillotine', 'Old Guillotine', 'Uncommon', 'Crowbar', 'Armor-Piercing Rounds'),
  recipe('two-old-guillotine', '2x Old Guillotine', 'Uncommon', 'Wake of Vultures', 'Item Scrap, Green'),
  recipe('will-o-the-wisp', 'Will-o\'-the-wisp', 'Uncommon', 'Gasoline', 'Sticky Bomb'),
  recipe('kjaros-band', 'Kjaro\'s Band', 'Uncommon', 'Runald\'s Band', 'Gasoline'),
  recipe('runalds-band', 'Runald\'s Band', 'Uncommon', 'Kjaro\'s Band', 'Stun Grenade'),
  recipe('breaching-fin', 'Breaching Fin', 'Uncommon', 'Paul\'s Goat Hoof', 'Stun Grenade'),
  recipe('shipping-request-form', 'Shipping Request Form', 'Uncommon', 'Bundle of Fireworks', 'Rusted Key'),
  recipe('sale-star', 'Sale Star', 'Uncommon', 'Shipping Request Form', 'Ghor\'s Tome'),
  recipe('ghors-tome-roll-of-pennies', 'Ghor\'s Tome', 'Uncommon', 'Roll of Pennies', 'Monster Tooth'),
  recipe('kinetic-dampener', 'Kinetic Dampener', 'Uncommon', 'Personal Shield Generator', 'Rose Buckler'),
  recipe('red-whip', 'Red Whip', 'Uncommon', 'Cautious Slug', 'Energy Drink'),
  recipe('unstable-transmitter', 'Unstable Transmitter', 'Uncommon', 'Warped Echo', 'Cautious Slug'),
  recipe('ignition-tank', 'Ignition Tank', 'Uncommon', 'Gasoline', 'Gasoline'),
  recipe('predatory-instincts-soldiers-syringe', 'Predatory Instincts', 'Uncommon', 'Soldier\'s Syringe', 'Lens-Maker\'s Glasses'),
  recipe('noxious-thorn', 'Noxious Thorn', 'Uncommon', 'Tri-Tip Dagger', 'Bolstering Lantern'),
  recipe('harvesters-scythe-monster-tooth', 'Harvester\'s Scythe', 'Uncommon', 'Monster Tooth', 'Lens-Maker\'s Glasses'),
  recipe('harvesters-scythe-hikers-boots', 'Harvester\'s Scythe', 'Uncommon', 'Monster Tooth', 'Hiker\'s Boots'),
  recipe('faraday-spur', 'Faraday Spur', 'Uncommon', 'Wax Quail', 'Luminous Shot'),
  recipe('box-of-dynamite', 'Box of Dynamite', 'Uncommon', 'Warbanner', 'Sticky Bomb'),
  recipe('regenerating-scrap', 'Regenerating Scrap', 'Uncommon', 'Item Scrap, Green', 'Item Scrap, Green'),
  recipe('two-green-scrap-red', '2x Item Scrap, Green', 'Uncommon', 'Item Scrap, Red', 'Item Scrap, Green'),
  recipe('two-green-scrap-yellow', '2x Item Scrap, Green', 'Uncommon', 'Item Scrap, Yellow', 'Item Scrap, Green'),
  recipe('red-scrap-regenerating-scrap', 'Item Scrap, Red', 'Legendary', 'Regenerating Scrap', 'Regenerating Scrap'),

  recipe('alien-head-infusion', 'Alien Head', 'Legendary', 'Death Mark', 'Infusion'),
  recipe('alien-head-seed-of-life', 'Alien Head', 'Legendary', 'Death Mark', 'Seed of Life'),
  recipe('laser-scope', 'Laser Scope', 'Legendary', 'Harvester\'s Scythe', 'Predatory Instincts'),
  recipe('sentient-meat-hook', 'Sentient Meat Hook', 'Legendary', 'Primordial Cube', 'Ukulele'),
  recipe('growth-nectar', 'Growth Nectar', 'Legendary', 'Noxious Thorn', 'Death Mark'),
  recipe('spare-drone-parts', 'Spare Drone Parts', 'Legendary', 'The Backup', 'Box of Dynamite'),
  recipe('headstompers-wax-quail', 'H3AD-5T v2', 'Legendary', 'Hopoo Feather', 'Wax Quail'),
  recipe('headstompers-faraday-spur', 'H3AD-5T v2', 'Legendary', 'Hopoo Feather', 'Faraday Spur'),
  recipe('headstompers-wax-quail-faraday-spur', 'H3AD-5T v2', 'Legendary', 'Wax Quail', 'Faraday Spur'),
  recipe('rejuvenation-rack', 'Rejuvenation Rack', 'Legendary', 'Harvester\'s Scythe', 'Consumed Trophy Hunter\'s Tricorn'),
  recipe('brainstalks', 'Brainstalks', 'Legendary', 'Bandolier', 'Old Guillotine'),
  recipe('pocket-icbm', 'Pocket ICBM', 'Legendary', 'AtG Missile Mk. 1', 'Disposable Missile Launcher'),
  recipe('runic-lens', 'Runic Lens', 'Legendary', 'AtG Missile Mk. 1', 'Luminous Shot'),
  recipe('sonorous-whispers', 'Sonorous Whispers', 'Legendary', 'Sale Star', 'Regenerating Scrap'),
  recipe('unstable-tesla-coil', 'Unstable Tesla Coil', 'Legendary', 'Ukulele', 'Razorwire'),
  recipe('hardlight-afterburner', 'Hardlight Afterburner', 'Legendary', 'Hopoo Feather', 'Ignition Tank'),
  recipe('electric-boomerang', 'Electric Boomerang', 'Legendary', 'Ukulele', 'Shuriken'),
  recipe('wake-of-vultures-growth-nectar', 'Wake of Vultures', 'Legendary', 'Wake of Vultures', 'Growth Nectar'),

  recipe('blast-shower', 'Blast Shower', 'Equipment', 'Fuel Cell', 'Ben\'s Raincoat'),
  recipe('volcanic-egg', 'Volcanic Egg', 'Equipment', 'Gasoline', 'Paul\'s Goat Hoof'),
  recipe('sawmerang', 'Sawmerang', 'Equipment', 'Shuriken', 'Tri-Tip Dagger'),
  recipe('recycler', 'Recycler', 'Equipment', 'Fuel Cell', 'Bottled Chaos'),
  recipe('disposable-missile-launcher', 'Disposable Missile Launcher', 'Equipment', 'Fuel Cell', 'AtG Missile Mk. 1'),
  recipe('molotov-6-pack', 'Molotov 6-Pack', 'Equipment', 'Gasoline', 'Fuel Cell'),
  recipe('executive-card', 'Executive Card', 'Equipment', 'Sale Star', 'Shipping Request Form'),
  recipe('trophy-hunters-tricorn', 'Trophy Hunter\'s Tricorn', 'Equipment', 'Consumed Trophy Hunter\'s Tricorn', 'Armor-Piercing Rounds'),

  recipe('genesis-loop', 'Genesis Loop', 'Boss', 'Old War Stealthkit', 'Runald\'s Band'),
  recipe('titanic-knurl', 'Titanic Knurl', 'Boss', 'Infusion', 'Leeching Seed'),
  recipe('queens-gland', 'Queen\'s Gland', 'Boss', 'Infusion', 'Squid Polyp'),
  recipe('planula', 'Planula', 'Boss', 'Razorwire', 'Leeching Seed'),
  recipe('molten-perforator', 'Molten Perforator', 'Boss', 'AtG Missile Mk. 1', 'Kjaro\'s Band'),
  recipe('charged-perforator', 'Charged Perforator', 'Boss', 'AtG Missile Mk. 1', 'Royal Capacitor'),
  recipe('charged-perforator-unstable-tesla-coil', 'Charged Perforator', 'Boss', 'Unstable Tesla Coil', 'AtG Missile Mk. 1'),
  recipe('halcyon-seed', 'Halcyon Seed', 'Boss', 'Titanic Knurl', 'Aurelionite\'s Blessing'),
  recipe('mired-urn', 'Mired Urn', 'Boss', 'Death Mark', 'Lepton Daisy'),
  recipe('little-disciple', 'Little Disciple', 'Boss', 'Will-o\'-the-wisp', 'Rose Buckler'),
  recipe('shatterspleen', 'Shatterspleen', 'Boss', 'Will-o\'-the-wisp', 'Noxious Thorn'),
  recipe('empathy-cores', 'Empathy Cores', 'Boss', 'Sentry Key', 'Box of Dynamite'),
  recipe('defense-nucleus', 'Defense Nucleus', 'Boss', 'Squid Polyp', 'Old Guillotine'),

  recipe('aurelionites-blessing', 'Aurelionite\'s Blessing', 'Elite Aspect', 'Wake of Vultures', 'Growth Nectar'),
  recipe('his-reassurance', 'His Reassurance', 'Elite Aspect', 'Wake of Vultures', 'Interstellar Desk Plant'),
  recipe('his-spiteful-boon', 'His Spiteful Boon', 'Elite Aspect', 'Wake of Vultures', 'Beads of Fealty'),
  recipe('of-one-mind', 'Of One Mind', 'Elite Aspect', 'Wake of Vultures', 'Sentry Key')
];

export const chefRecipeCategories: ChefRecipeCategory[] = [
  'Route',
  'Meal',
  'Common',
  'Uncommon',
  'Legendary',
  'Equipment',
  'Boss',
  'Elite Aspect',
  'Repair'
];
