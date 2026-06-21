export type StatDefinition = {
  key: 'health' | 'damage' | 'speed' | 'armor';
  label: string;
  shortLabel: string;
  definition: string;
  practicalNote: string;
};

export type StatusEffectDefinition = {
  name: string;
  type: 'Damage over time' | 'Control' | 'Debuff' | 'Survivor mechanic' | 'Defensive';
  definition: string;
  practicalNote: string;
  examples: string[];
};

export const statDefinitions: StatDefinition[] = [
  {
    key: 'health',
    label: 'Base Health',
    shortLabel: 'Health',
    definition: 'Starting maximum HP before level scaling, items, shields, barrier, or temporary effects.',
    practicalNote: 'Higher health gives more room for mistakes, but healing, block, armor, and movement often matter more than raw HP alone.'
  },
  {
    key: 'damage',
    label: 'Base Damage',
    shortLabel: 'Damage',
    definition: 'The survivor damage stat that skill percentages scale from. A 300% skill deals three times this value before other modifiers.',
    practicalNote: 'Skill text usually shows damage as a percent, so base damage explains why the same percent can hit harder or softer across survivors.'
  },
  {
    key: 'speed',
    label: 'Base Speed',
    shortLabel: 'Speed',
    definition: 'Default movement speed before sprinting, items, slows, buffs, or survivor-specific movement skills.',
    practicalNote: 'Speed is both offense and defense: it improves dodging, looting pace, stage routing, and teleporter safety.'
  },
  {
    key: 'armor',
    label: 'Base Armor',
    shortLabel: 'Armor',
    definition: 'Damage reduction or vulnerability applied before the hit reaches health. Positive armor reduces incoming damage; negative armor increases it.',
    practicalNote: 'Armor is strongest when stacked with good movement and healing because it reduces the damage you need to recover from.'
  }
];

export const statusEffectDefinitions: StatusEffectDefinition[] = [
  {
    name: 'Bleed',
    type: 'Damage over time',
    definition: 'A stacking damage-over-time debuff commonly applied by Tri-Tip Dagger and some survivor skills.',
    practicalNote: 'Fast hits and multi-hit skills apply it best. Stacked bleed can delete bosses if you can keep attacking safely.',
    examples: ['Tri-Tip Dagger', 'Bandit alternate skills', 'High attack speed builds']
  },
  {
    name: 'Burn / Ignite',
    type: 'Damage over time',
    definition: 'Fire damage over time applied by items, elites, and certain skills.',
    practicalNote: 'Ignition Tank-style effects make burn builds much stronger, while burning enemies can also matter for unlocks and synergies.',
    examples: ['Gasoline', 'Molotov-style fire effects', 'Fire elite attacks']
  },
  {
    name: 'Poison',
    type: 'Damage over time',
    definition: 'Acrid-style damage over time that weakens enemies heavily but generally does not finish them by itself.',
    practicalNote: 'Use poison to soften crowds and bosses, then secure kills with direct damage or proc chains.',
    examples: ['Acrid poison skills', 'Death Mark setup']
  },
  {
    name: 'Blight',
    type: 'Damage over time',
    definition: 'A stacking Acrid damage-over-time alternative focused on repeated applications.',
    practicalNote: 'Blight rewards aggressive reapplication more than passive spreading.',
    examples: ['Acrid alternate passive', 'Repeated poison-style hits']
  },
  {
    name: 'Slow',
    type: 'Debuff',
    definition: 'Reduces movement speed, making enemies easier to kite, group, or keep inside damage zones.',
    practicalNote: 'Slow is useful control and also helps enable Death Mark because it counts as a distinct debuff.',
    examples: ['Chronobauble', 'Railgunner Polar Field Device', 'Void Fiend Drown']
  },
  {
    name: 'Stun',
    type: 'Control',
    definition: 'Temporarily interrupts many enemies and prevents action for a short duration.',
    practicalNote: 'Great against normal threats, but bosses and some elites resist or ignore stun.',
    examples: ['Stun Grenade', 'Seeker and CHEF skills', 'Drifter utility effects']
  },
  {
    name: 'Freeze',
    type: 'Control',
    definition: 'Locks a target in place and can execute low-health enemies depending on the source.',
    practicalNote: 'Freeze is strong safety and burst setup, especially on priority targets.',
    examples: ['Artificer Snapfreeze', 'Railgunner cryo skills', 'Frost-style effects']
  },
  {
    name: 'Root',
    type: 'Control',
    definition: 'Prevents movement while often allowing some enemies to keep attacking.',
    practicalNote: 'Treat root as positioning control, not full safety. Ranged enemies may still be dangerous.',
    examples: ['Hooks of Heresy', 'Plant and void control effects']
  },
  {
    name: 'Weaken',
    type: 'Debuff',
    definition: 'Reduces enemy threat by lowering output or combat effectiveness depending on the source.',
    practicalNote: 'Useful on durable threats because it buys time without requiring a kill.',
    examples: ['Rex weaken effects', 'Death Mark setup']
  },
  {
    name: 'Armor Reduction',
    type: 'Debuff',
    definition: 'Lowers target armor, increasing damage dealt by follow-up hits.',
    practicalNote: 'Best when applied before large burst windows or during boss fights.',
    examples: ['Shattering Justice', 'Piercing armor effects']
  },
  {
    name: 'Death Mark',
    type: 'Debuff',
    definition: 'A damage-amplifying mark applied when an enemy has enough different debuffs at once.',
    practicalNote: 'Build around unique debuff types, not just many stacks of the same debuff.',
    examples: ['Death Mark', 'Bleed + slow + burn + poison setups']
  },
  {
    name: 'Barrier',
    type: 'Defensive',
    definition: 'Temporary extra protection layered over health that decays over time.',
    practicalNote: 'Barrier is strongest when you are frequently triggering it during combat, not saving it for later.',
    examples: ['Topaz Brooch', 'Aegis', 'Seeker barrier skills']
  }
];
