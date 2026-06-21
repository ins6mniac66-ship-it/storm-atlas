import { findItemById, type ItemRecord } from './items';

export type ItemSynergyEntry = {
  itemId: string;
  reason: string;
  priority?: number;
};

export type CuratedItemSynergy = {
  item: ItemRecord;
  reason: string;
};

const commonItemSynergies: Record<string, ItemSynergyEntry[]> = {
  FragileDamageBonus: [
    { itemId: 'CritGlasses', reason: 'More reliable damage scaling.', priority: 40 },
    { itemId: 'Syringe', reason: 'More hits to benefit from flat damage boosts.', priority: 30 },
    { itemId: 'Crowbar', reason: 'Stronger burst and opening damage.', priority: 20 },
    { itemId: 'ArmorPlate', reason: 'Helps avoid losing the watch from chip damage.', priority: 10 }
  ],
  Crowbar: [
    { itemId: 'BossDamageBonus', reason: 'Stronger boss burst.', priority: 40 },
    { itemId: 'CritGlasses', reason: 'Multiplies opening hits.', priority: 30 },
    { itemId: 'StickyBomb', reason: 'Adds proc burst to early hits.', priority: 20 },
    { itemId: 'Syringe', reason: 'More chances to apply opening pressure.', priority: 10 }
  ],
  CritGlasses: [
    { itemId: 'Syringe', reason: 'More attacks means more crit rolls.', priority: 40 },
    { itemId: 'BleedOnHit', reason: 'Crit and on-hit builds both reward frequent hits.', priority: 30 },
    { itemId: 'StickyBomb', reason: 'More hits means more proc chances.', priority: 20 },
    { itemId: 'AttackSpeedAndMoveSpeed', reason: 'Attack speed plus mobility support.', priority: 10 }
  ],
  Syringe: [
    { itemId: 'CritGlasses', reason: 'More frequent crit opportunities.', priority: 40 },
    { itemId: 'BleedOnHit', reason: 'Faster bleed stacking.', priority: 30 },
    { itemId: 'StickyBomb', reason: 'More proc rolls.', priority: 20 },
    { itemId: 'StunChanceOnHit', reason: 'More stun chances.', priority: 10 }
  ],
  BleedOnHit: [
    { itemId: 'Syringe', reason: 'Stacks bleed faster.', priority: 40 },
    { itemId: 'CritGlasses', reason: 'Supports hit-focused damage builds.', priority: 30 },
    { itemId: 'StickyBomb', reason: 'Adds more on-hit pressure.', priority: 20 },
    { itemId: 'StunChanceOnHit', reason: 'More hit-trigger utility.', priority: 10 }
  ],
  IgniteOnKill: [
    { itemId: 'Tooth', reason: 'Both reward kills in dense fights.', priority: 40 },
    { itemId: 'BarrierOnKill', reason: 'Turns kills into defense.', priority: 30 },
    { itemId: 'IncreaseDamageOnMultiKill', reason: 'Kill chains keep damage rolling.', priority: 20 },
    { itemId: 'Firework', reason: 'Adds stage-clear pressure from interactables.', priority: 10 }
  ],
  BarrierOnKill: [
    { itemId: 'IgniteOnKill', reason: 'Kill chains help maintain barrier.', priority: 40 },
    { itemId: 'Tooth', reason: 'Kill rewards stack survival value.', priority: 30 },
    { itemId: 'IncreaseDamageOnMultiKill', reason: 'Rewards continuous cleanup.', priority: 20 },
    { itemId: 'Crowbar', reason: 'Helps start kill chains faster.', priority: 10 }
  ],
  SprintBonus: [
    { itemId: 'Hoof', reason: 'General movement speed stack.', priority: 40 },
    { itemId: 'AttackSpeedAndMoveSpeed', reason: 'Mixed speed and attack value.', priority: 30 },
    { itemId: 'SpeedBoostPickup', reason: 'More movement utility.', priority: 20 },
    { itemId: 'NearbyDamageBonus', reason: 'Helps melee and close-range positioning.', priority: 10 }
  ],
  Mushroom: [
    { itemId: 'Medkit', reason: 'Extra recovery layer.', priority: 40 },
    { itemId: 'FlatHealth', reason: 'Larger health pool improves healing value.', priority: 30 },
    { itemId: 'ArmorPlate', reason: 'Reduces chip while holding position.', priority: 20 },
    { itemId: 'PersonalShield', reason: 'Extra buffer for stationary setups.', priority: 10 }
  ],
  SecondarySkillMagazine: [
    { itemId: 'Syringe', reason: 'Supports skill-and-hit tempo.', priority: 40 },
    { itemId: 'CritGlasses', reason: 'Stronger repeated damage windows.', priority: 30 },
    { itemId: 'AttackSpeedAndMoveSpeed', reason: 'Keeps combat flow smoother.', priority: 20 },
    { itemId: 'Crowbar', reason: 'Extra skill uses can front-load burst.', priority: 10 }
  ]
};

export function getCuratedSynergies(itemId: string, limit = 4): CuratedItemSynergy[] {
  return (commonItemSynergies[itemId] ?? [])
    .slice()
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .map((entry) => {
      const item = findItemById(entry.itemId);
      return item ? { item, reason: entry.reason } : null;
    })
    .filter((entry): entry is CuratedItemSynergy => entry !== null)
    .slice(0, limit);
}
