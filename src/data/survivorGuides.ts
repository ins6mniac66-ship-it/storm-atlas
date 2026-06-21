import { findItemById, type ItemRecord } from './items';

export type SurvivorItemGuide = {
  label: string;
  itemIds: string[];
  reason: string;
};

export type SurvivorLoadoutNote = {
  slot: 'Primary' | 'Secondary' | 'Utility' | 'Special';
  skill: string;
  note: string;
  status: string;
};

export type SurvivorAdaptationRule = {
  problem: string;
  picks: string;
  rule: string;
};

export type SurvivorEquipmentPick = {
  name: string;
  when: string;
  status: string;
};

export type SurvivorUnlockRouteStage = {
  stage: string;
  priorities: string[];
  itemIds?: string[];
  avoid?: string[];
};

export type SurvivorUnlockRoute = {
  id: string;
  title: string;
  goal: string;
  requirement: string;
  coreRule: string;
  stagePlan: SurvivorUnlockRouteStage[];
  equipmentPlan: string[];
  commencementScript: string[];
  finalScript: string[];
  cleanBuildTarget: string[];
  avoidItemIds: string[];
};

export type SurvivorGuide = {
  survivor: string;
  buildName?: string;
  tags?: string[];
  summary: string;
  quickRules?: string[];
  buildPlan: string[];
  itemGuide: SurvivorItemGuide[];
  loadout?: SurvivorLoadoutNote[];
  adaptationRules?: SurvivorAdaptationRule[];
  equipmentPicks?: SurvivorEquipmentPick[];
  exclusions?: string[];
  sourceNote?: string;
  avoidNotes: string[];
  unlockRoutes?: SurvivorUnlockRoute[];
};

export const survivorGuides: SurvivorGuide[] = [
  {
    survivor: 'Commando',
    buildName: 'Default Proc Runner',
    tags: ['Base Only', 'Default Skills', 'Beginner', 'Mobile Kite', 'Community-Tested'],
    summary:
      'Default-access Commando build focused on steady mid-range damage, constant movement, on-hit item scaling, and stun safety.',
    quickRules: [
      'Always be firing so attack speed, crit, bleed, and on-hit items have time to work.',
      'Circle enemy packs instead of backpedaling in one long line.',
      'Save Tactical Dive for the hit that matters: golems, wisps, beetle guards, bosses, and bad teleporter pressure.',
      'Use Suppressive Fire to stun or interrupt dangerous enemies before they finish an attack.',
      'Low damage means add hit frequency or on-hit. Dying means add mobility or sustain.'
    ],
    buildPlan: [
      'Survive long enough for attack speed, crit, bleed, and area items to snowball.',
      'Build the first damage layer around constant hits: Soldier\'s Syringe, Lens-Maker\'s Glasses, Tri-Tip Dagger, and Sticky Bomb.',
      'Add simple sustain when chip damage is ending runs before the build has time to scale.',
      'Patch movement with sprint speed and extra jump options so Commando can keep firing while repositioning.',
      'Use area damage, boss damage, or a simple damage equipment only after the basic survival loop is stable.'
    ],
    itemGuide: [
      {
        label: 'Damage / on-hit priority',
        itemIds: ['Syringe', 'CritGlasses', 'BleedOnHit', 'IgniteOnKill', 'StickyBomb'],
        reason: 'Repeated bullets make attack speed, crit chance, bleed, and simple on-hit damage the cleanest beginner scaling route.'
      },
      {
        label: 'Defensive / sustain priority',
        itemIds: ['Medkit', 'HealWhileSafe', 'Tooth', 'BarrierOnKill'],
        reason: 'These picks recover from chip damage or reward safe pack clearing without requiring alternate skills or DLC systems.'
      },
      {
        label: 'Mobility priority',
        itemIds: ['SprintBonus', 'Feather', 'JumpBoost'],
        reason: 'Sprint speed and vertical control make it easier to kite teleporter pressure while keeping damage uptime.'
      },
      {
        label: 'Boss and crowd fixes',
        itemIds: ['BossDamageBonus', 'Missile', 'ChainLightning'],
        reason: 'Use these as practical fixes when teleporter bosses live too long or packs start overwhelming single-target fire.'
      },
      {
        label: 'Default-only exclusions to verify before recommending',
        itemIds: ['Bear', 'Hoof'],
        reason: 'Strong base-game items, but this prototype treats challenge-unlocked options as excluded until the player confirms access.'
      }
    ],
    loadout: [
      {
        slot: 'Primary',
        skill: 'Double Tap',
        note: 'Main damage stream. Keep pressure on enemies while moving.',
        status: 'default / wiki-derived'
      },
      {
        slot: 'Secondary',
        skill: 'Phase Round',
        note: 'Fire through lined-up enemies or tougher targets.',
        status: 'default / wiki-derived'
      },
      {
        slot: 'Utility',
        skill: 'Tactical Dive',
        note: 'Emergency dodge, gap maker, and fall-damage safety tool.',
        status: 'default / wiki-derived'
      },
      {
        slot: 'Special',
        skill: 'Suppressive Fire',
        note: 'Stun dangerous enemies and interrupt attacks.',
        status: 'default / wiki-derived'
      }
    ],
    adaptationRules: [
      {
        problem: 'Damage is missing',
        picks: 'Soldier\'s Syringe -> Lens-Maker\'s Glasses -> Tri-Tip Dagger -> Gasoline',
        rule: 'Add hit frequency first, then crit or bleed, then area cleanup.'
      },
      {
        problem: 'Healing is missing',
        picks: 'Medkit / Cautious Slug / Monster Tooth',
        rule: 'If small mistakes are ending the run, add recovery before chasing more damage.'
      },
      {
        problem: 'Mobility is missing',
        picks: 'Energy Drink / Hopoo Feather / Wax Quail',
        rule: 'If teleporter pressure boxes you in, prioritize movement before another damage item.'
      },
      {
        problem: 'Boss pressure is the wall',
        picks: 'Armor-Piercing Rounds / Disposable Missile Launcher',
        rule: 'Take direct boss damage or simple burst equipment when teleporter bosses are dragging fights out.'
      },
      {
        problem: 'Crowds are the wall',
        picks: 'Gasoline / Ukulele / Primordial Cube',
        rule: 'Add area damage or grouping when small enemies overwhelm your single-target fire.'
      }
    ],
    equipmentPicks: [
      {
        name: 'Disposable Missile Launcher',
        when: 'Simple boss and elite burst when damage feels low.',
        status: 'wiki-derived / base equipment'
      },
      {
        name: 'Primordial Cube',
        when: 'Use if crowds are the problem; group enemies, then fire into the pack.',
        status: 'wiki-derived / base equipment'
      },
      {
        name: 'Foreign Fruit',
        when: 'Take when survival is the problem and the build lacks sustain.',
        status: 'wiki-derived / base equipment'
      }
    ],
    exclusions: ['DLC items', 'Void items', 'Lunar items', 'Boss items', 'Alternate skills', 'Late unlock strategies', 'Artifact of Command assumptions'],
    sourceNote:
      'Default-access prototype. Item effects are local-catalog backed; challenge-unlock availability should stay visible before marking the whole route fully verified.',
    avoidNotes: [
      'Do not skip mobility just because Commando is simple; he needs spacing to keep firing safely.',
      'Do not rely only on single-target fire after the first stages. Add area damage before enemy density spikes.',
      'Do not assume challenge-unlocked items are available in this default-only screen unless the player enables them.'
    ]
  },
  {
    survivor: 'Huntress',
    summary:
      'Huntress is a mobile kiting survivor who uses movement, homing attacks, and item damage to clear while avoiding direct trades.',
    buildPlan: [
      'Keep moving through fights and use mobility to maintain safe angles instead of holding one position.',
      'Build damage items that reward frequent hits and quick target swaps.',
      'Add crowd cleanup early because homing attacks help aim but do not replace area damage at high density.',
      'Use mobility and defense to protect the low-health profile during teleporter pressure and elite waves.'
    ],
    itemGuide: [
      {
        label: 'Mobile damage uptime',
        itemIds: ['Syringe', 'BleedOnHit', 'Missile', 'ChainLightning', 'StickyBomb'],
        reason: 'Huntress can keep attacking while repositioning, so on-hit items convert safe movement into real damage uptime.'
      },
      {
        label: 'Crowd clear support',
        itemIds: ['IgniteOnKill', 'ExplodeOnDeath', 'Behemoth', 'Dagger'],
        reason: 'Area and on-kill damage help Huntress clear packs before mobility has to cover too many threats at once.'
      },
      {
        label: 'Mobility and vertical control',
        itemIds: ['Hoof', 'SprintBonus', 'Feather', 'JumpBoost', 'SprintOutOfCombat'],
        reason: 'Extra movement expands Huntress routing options and makes it easier to keep attacking from safer positions.'
      },
      {
        label: 'Burst windows',
        itemIds: ['Crowbar', 'FireRing', 'IceRing', 'BossDamageBonus'],
        reason: 'Burst items help Huntress delete priority enemies and speed up boss phases before long fights expose her fragility.'
      },
      {
        label: 'Fragility buffer',
        itemIds: ['Bear', 'ArmorPlate', 'BarrierOnKill', 'ExtraLife'],
        reason: 'Defensive layers reduce the chance that one bad blink, elite hit, or projectile ends a run.'
      }
    ],
    avoidNotes: [
      'Do not confuse mobility with durability. Huntress still needs defense or clean spacing.',
      'Do not let homing attacks replace target priority; dangerous elites and ranged threats still need focus.',
      'Avoid standing inside teleporter pressure without enough area damage or escape room.'
    ]
  },
  {
    survivor: 'Bandit',
    summary:
      'Bandit is a burst and execution survivor who rewards clean positioning, critical hits, and fast conversion of low-health targets.',
    buildPlan: [
      'Use positioning and stealth windows to create safe burst angles instead of taking extended front-line trades.',
      'Stack crit and bleed support so backstab pressure and damage-over-time effects carry single-target fights.',
      'Add kill-chain items because Bandit can start executions, but item damage helps the chain spread through packs.',
      'Use mobility and cooldown support to reset spacing after burst windows.',
      'For the Desperado unlock route, treat bleed, bands, on-kill cleanup, and proc damage as risky final-hit stealers rather than normal build priorities.'
    ],
    itemGuide: [
      {
        label: 'Burst and opener damage',
        itemIds: ['Crowbar', 'FireRing', 'IceRing', 'BossDamageBonus', 'NearbyDamageBonus'],
        reason: 'Bandit benefits from high-value opening hits that remove priority targets before fights become crowded.'
      },
      {
        label: 'Crit and bleed pressure',
        itemIds: ['CritGlasses', 'BleedOnHit', 'BleedOnHitAndExplode', 'DeathMark'],
        reason: 'Crit and bleed support Bandit\'s backstab plan and make single-target pressure continue after the first hit.'
      },
      {
        label: 'Kill-chain cleanup',
        itemIds: ['IgniteOnKill', 'ExplodeOnDeath', 'Dagger', 'LaserTurbine'],
        reason: 'On-kill damage helps Bandit turn one execution or low-health target into broader pack control.'
      },
      {
        label: 'Cooldown and reload support',
        itemIds: ['SecondarySkillMagazine', 'Bandolier', 'AlienHead', 'KillEliteFrenzy'],
        reason: 'More skill access gives Bandit additional burst attempts, safer exits, and better recovery after missed windows.'
      },
      {
        label: 'Escape and spacing',
        itemIds: ['Hoof', 'SprintBonus', 'Feather', 'Phasing'],
        reason: 'Movement and emergency stealth support keep Bandit from being trapped after committing to close-range damage.'
      }
    ],
    avoidNotes: [
      'Do not chase backstab angles so hard that you lose track of elite packs or projectiles.',
      'Do not build only burst. Bandit still needs cleanup when enemies survive the first damage window.',
      'Avoid spending all mobility to enter a fight without a clear exit route.',
      'For Desperado attempts, avoid delayed, automatic, or proc-based damage near Mithrix because any stray hit can steal the Lights Out kill.'
    ],
    unlockRoutes: [
      {
        id: 'desperado',
        title: 'Desperado Unlock Route',
        goal: "Unlock Bandit's alternate Special, Desperado.",
        requirement: "Kill Mithrix's final phase with Lights Out.",
        coreRule:
          'Avoid items and equipment that can deal delayed, automatic, or proc-based damage near the final hit.',
        stagePlan: [
          {
            stage: 'Stage 1',
            priorities: [
              'Armor-Piercing Rounds x3.',
              'Tougher Times x2.',
              "Paul's Goat Hoof x1 and Energy Drink x1.",
              'Hopoo Feather x1 if available.',
              'Wax Quail x1 if available.',
              'Take Eccentric Vase if found. Otherwise take Recycler, Jade Elephant, or Ocular HUD.'
            ],
            itemIds: ['BossDamageBonus', 'Bear', 'Hoof', 'SprintBonus', 'Feather', 'JumpBoost']
          },
          {
            stage: 'Stage 2',
            priorities: [
              'Armor-Piercing Rounds to x5.',
              'Tougher Times to x5.',
              "Goat Hoof and Energy Drink to x3 total.",
              'Hopoo Feather x1-2 and Wax Quail x1-2.',
              "Harvester's Scythe x1 and Predatory Instincts x1.",
              'Keep Eccentric Vase if the plan is to skip Commencement pillars.'
            ],
            itemIds: [
              'BossDamageBonus',
              'Bear',
              'Hoof',
              'SprintBonus',
              'Feather',
              'JumpBoost',
              'HealOnCrit',
              'AttackSpeedOnCrit'
            ]
          },
          {
            stage: 'Stage 3',
            priorities: [
              'Armor-Piercing Rounds to x7-10.',
              'Tougher Times to x7.',
              'Add healing only if needed: Medkit, Cautious Slug, or Repulsion Armor Plate.',
              'Hopoo Feather to x2-3 and Wax Quail to x2.',
              'Rose Buckler x1 and Old War Stealthkit x1.'
            ],
            itemIds: [
              'BossDamageBonus',
              'Bear',
              'Medkit',
              'HealWhileSafe',
              'ArmorPlate',
              'Feather',
              'JumpBoost',
              'SprintArmor',
              'Phasing'
            ],
            avoid: [
              'Ukulele',
              'AtG Missile Mk. 1',
              'Tri-Tip Dagger',
              'Sticky Bomb',
              'Gasoline',
              "Kjaro's Band",
              "Runald's Band"
            ]
          },
          {
            stage: 'Stage 4 / Sky Meadow',
            priorities: [
              'Armor-Piercing Rounds to x10+.',
              'Tougher Times to x7-10.',
              'Add movement if routing or dodging feels bad.',
              'Add healing only if survival feels shaky.',
              "Red priority: Dio's Best Friend, Alien Head, Hardlight Afterburner, Laser Scope, Rejuvenation Rack, then Ben's Raincoat."
            ],
            itemIds: [
              'BossDamageBonus',
              'Bear',
              'Feather',
              'JumpBoost',
              'ExtraLife',
              'AlienHead',
              'UtilitySkillMagazine',
              'CritDamage',
              'IncreaseHealing',
              'ImmuneToDebuff'
            ],
            avoid: [
              'Brilliant Behemoth',
              'Unstable Tesla Coil',
              'Sentient Meat Hook',
              'Ceremonial Dagger',
              'Frost Relic',
              'Happiest Mask',
              'Resonance Disc'
            ]
          }
        ],
        equipmentPlan: [
          'Best routing: Eccentric Vase to skip the Commencement pillar section and reach Mithrix faster.',
          'Best final shot: Ocular HUD if swapping before Mithrix is possible.',
          'Best safety: Jade Elephant if Mithrix keeps deleting you.',
          'Best item control: Recycler before Commencement, then swap to Eccentric Vase or Ocular HUD if possible.'
        ],
        commencementScript: [
          'Enter Commencement with Eccentric Vase equipped.',
          "Move toward the pillar area and aim the Vase toward Mithrix's arena or upper platform.",
          'Fire the tunnel and ride it to the arena side.',
          'Avoid bad exits that launch you into fall damage.',
          'Start Mithrix after the skip is stable.'
        ],
        finalScript: [
          'Let Mithrix finish stealing items.',
          'Play safe and chip him down.',
          'Stop attacking when he is very low.',
          'Wait for any stray effects to finish.',
          'Make sure drones and minions are not hitting him.',
          'Aim carefully and kill with Lights Out.'
        ],
        cleanBuildTarget: [
          'White: Armor-Piercing Rounds x10+, Tougher Times x7-10, Goat Hoof / Energy Drink x5 total, healing as needed.',
          "Green: Hopoo Feather x2-3, Wax Quail x2, Harvester's Scythe x1, Predatory Instincts x1, Rose Buckler x1, Old War Stealthkit x1.",
          "Red: Dio's Best Friend, Alien Head, Hardlight Afterburner, Laser Scope.",
          'Equipment: Eccentric Vase for the Commencement skip, or Ocular HUD if swapping before Mithrix.'
        ],
        avoidItemIds: [
          'ChainLightning',
          'Missile',
          'BleedOnHit',
          'StickyBomb',
          'IgniteOnKill',
          'FireRing',
          'IceRing',
          'Behemoth',
          'ShockNearby',
          'BounceNearby',
          'Dagger',
          'Icicle',
          'GhostOnKill',
          'LaserTurbine'
        ]
      }
    ]
  },
  {
    survivor: 'MUL-T',
    summary:
      'MUL-T is a durable multi-tool survivor who scales through sustained fire, proc items, and flexible damage routing.',
    buildPlan: [
      'Lean into sustained pressure and item triggers while using durability to hold space longer than fragile survivors can.',
      'Prioritize attack speed, bleed, and on-hit damage when using rapid-fire tools.',
      'Add movement because high durability does not solve slow repositioning or vertical routing.',
      'Use defensive and boss-damage items to turn long fights into controlled pressure instead of attrition.'
    ],
    itemGuide: [
      {
        label: 'Sustained proc pressure',
        itemIds: ['Syringe', 'BleedOnHit', 'Missile', 'StickyBomb', 'ChainLightning'],
        reason: 'MUL-T can apply many hits over time, making on-hit and proc items a stable damage foundation.'
      },
      {
        label: 'Durability stack',
        itemIds: ['FlatHealth', 'Bear', 'ArmorPlate', 'PersonalShield', 'BarrierOnKill'],
        reason: 'Extra health, block, armor, and barrier reinforce MUL-T\'s ability to stay active inside longer fights.'
      },
      {
        label: 'Mobility correction',
        itemIds: ['Hoof', 'SprintBonus', 'Feather', 'JumpBoost', 'SprintArmor'],
        reason: 'Movement items patch slow repositioning, improve stage routing, and help MUL-T avoid being surrounded.'
      },
      {
        label: 'Crowd and boss conversion',
        itemIds: ['IgniteOnKill', 'ExplodeOnDeath', 'BossDamageBonus', 'FireballsOnHit'],
        reason: 'Area and boss damage convert sustained fire into faster clears and stronger teleporter phases.'
      },
      {
        label: 'Equipment leverage',
        itemIds: ['EquipmentMagazine', 'EnergizedOnEquipmentUse', 'Talisman', 'AutoCastEquipment'],
        reason: 'Equipment support fits MUL-T\'s flexible kit and can add burst, utility, or safety depending on the run.'
      }
    ],
    avoidNotes: [
      'Do not treat high base durability as permission to ignore mobility.',
      'Do not split item priorities too widely before the main damage plan is working.',
      'Avoid standing still in dense elite packs just because MUL-T can absorb more hits than most survivors.'
    ]
  },
  {
    survivor: 'Engineer',
    summary:
      'Engineer is a setup survivor who converts turret uptime, defensive zones, and area control into stable fights.',
    buildPlan: [
      'Create defensible positions before pressure peaks, then let turrets and item effects multiply your control.',
      'Prioritize items that turrets can use well, especially attack speed, bleed, on-hit damage, and stationary healing.',
      'Add mobility for repositioning between setup windows because strong zones do not cover every stage route.',
      'Use area and defensive items to keep turret positions alive during teleporter and boss pressure.'
    ],
    itemGuide: [
      {
        label: 'Turret damage scaling',
        itemIds: ['Syringe', 'BleedOnHit', 'Missile', 'StickyBomb', 'ChainLightning'],
        reason: 'Engineer turrets multiply many item effects, so on-hit and attack-speed items produce strong sustained pressure.'
      },
      {
        label: 'Stationary sustain',
        itemIds: ['Mushroom', 'TPHealingNova', 'Plant', 'IncreaseHealing'],
        reason: 'Healing zones and recovery items support turret positions and make controlled holdouts much safer.'
      },
      {
        label: 'Defensive setup',
        itemIds: ['Bear', 'ArmorPlate', 'BarrierOnKill', 'PersonalShield', 'ExtraLife'],
        reason: 'Defense buys time for turrets, mines, and item damage to stabilize fights before the position collapses.'
      },
      {
        label: 'Area denial',
        itemIds: ['IgniteOnKill', 'ExplodeOnDeath', 'Behemoth', 'ShockNearby'],
        reason: 'Area damage helps Engineer punish grouped enemies that push into turret zones.'
      },
      {
        label: 'Repositioning tools',
        itemIds: ['Hoof', 'SprintBonus', 'Feather', 'JumpBoost'],
        reason: 'Movement lets Engineer leave bad setups, reach better terrain, and keep pace between stages.'
      }
    ],
    avoidNotes: [
      'Do not rely on one turret position after enemy pressure or terrain makes it unsafe.',
      'Do not skip personal mobility; turrets do not solve routing or emergency repositioning.',
      'Avoid overbuilding stationary healing before the build has enough damage to end fights.'
    ]
  },
  {
    survivor: 'Artificer',
    summary:
      'Artificer is a cooldown-based burst survivor who controls space with high-impact skills, freeze windows, and priority-target damage.',
    buildPlan: [
      'Play around cooldown cycles and commit burst when enemies are grouped, frozen, or exposed.',
      'Prioritize burst damage, cooldown support, and bands because individual high-damage hits matter more than raw hit count.',
      'Add movement and defensive layers so cooldown downtime does not become a forced damage trade.',
      'Use area damage to extend burst windows into full pack clears.'
    ],
    itemGuide: [
      {
        label: 'Burst amplification',
        itemIds: ['Crowbar', 'FireRing', 'IceRing', 'BossDamageBonus', 'NearbyDamageBonus'],
        reason: 'Artificer uses fewer, heavier hits, so burst multipliers and bands can turn clean skill windows into kills.'
      },
      {
        label: 'Cooldown access',
        itemIds: ['SecondarySkillMagazine', 'Bandolier', 'AlienHead', 'KillEliteFrenzy'],
        reason: 'More skill uptime reduces vulnerable gaps and lets Artificer keep control tools available.'
      },
      {
        label: 'Area burst cleanup',
        itemIds: ['IgniteOnKill', 'ExplodeOnDeath', 'Behemoth', 'FireballsOnHit'],
        reason: 'Area damage helps Artificer convert one frozen or grouped target into broader pack removal.'
      },
      {
        label: 'Mobility and air control',
        itemIds: ['Hoof', 'SprintBonus', 'Feather', 'JumpBoost', 'SprintOutOfCombat'],
        reason: 'Movement expands Artificer\'s spacing options and reduces danger during cooldown downtime.'
      },
      {
        label: 'Safety layer',
        itemIds: ['Bear', 'ArmorPlate', 'BarrierOnKill', 'ExtraLife'],
        reason: 'Defensive items protect Artificer when burst windows miss, enemies survive, or ranged pressure catches her between skills.'
      }
    ],
    avoidNotes: [
      'Do not build as if every item needs fast hit count; Artificer values burst and cooldowns heavily.',
      'Do not spend all control tools on low-value enemies before elites or bosses enter range.',
      'Avoid floating or repositioning without a plan for ranged pressure and cooldown recovery.'
    ]
  },
  {
    survivor: 'Mercenary',
    summary:
      'Mercenary is a close-range combo survivor who depends on mobility, cooldown rhythm, and clean target selection.',
    buildPlan: [
      'Use movement skills to enter, apply pressure, and leave before enemy groups can collapse on the same position.',
      'Build cooldown support and attack-speed scaling so combo windows happen more often and recover faster.',
      'Add defense because close-range uptime exposes Mercenary to chip damage, elites, and boss area attacks.',
      'Use area damage and on-kill effects to make melee pressure scale against packs, not only single targets.'
    ],
    itemGuide: [
      {
        label: 'Combo uptime',
        itemIds: ['Syringe', 'SecondarySkillMagazine', 'Bandolier', 'AlienHead', 'UtilitySkillMagazine'],
        reason: 'Mercenary needs frequent skill access and faster attacks to keep pressure active without being trapped.'
      },
      {
        label: 'Close-range damage',
        itemIds: ['NearbyDamageBonus', 'BleedOnHit', 'Missile', 'StickyBomb', 'FireRing'],
        reason: 'Melee uptime benefits from nearby damage and on-hit effects that reward repeated committed attacks.'
      },
      {
        label: 'Mobility extension',
        itemIds: ['Hoof', 'SprintBonus', 'Feather', 'JumpBoost', 'SprintArmor'],
        reason: 'Extra movement improves approach angles, escape quality, and vertical recovery between combo windows.'
      },
      {
        label: 'Survival in melee',
        itemIds: ['Bear', 'ArmorPlate', 'BarrierOnKill', 'Medkit', 'ExtraLife'],
        reason: 'Mitigation and recovery reduce the cost of fighting inside enemy threat ranges.'
      },
      {
        label: 'Pack conversion',
        itemIds: ['IgniteOnKill', 'ExplodeOnDeath', 'Dagger', 'ShockNearby'],
        reason: 'On-kill and area damage help Mercenary turn melee picks into wider crowd control.'
      }
    ],
    avoidNotes: [
      'Do not use every mobility skill to enter unless another tool is ready for the exit.',
      'Do not build only single-target melee damage once enemy density starts rising.',
      'Avoid staying inside boss area attacks just to finish a combo sequence.'
    ]
  },
  {
    survivor: 'Loader',
    summary:
      'Loader is a high-impact brawler who uses mobility, barrier, and burst damage to delete targets before fights become extended trades.',
    buildPlan: [
      'Use grapples and charged hits to choose engagements, remove priority targets, and leave before pressure stacks.',
      'Prioritize burst multipliers because Loader gets high value from fewer heavy hits.',
      'Add mobility and cooldown support to improve routing, pillar skips, and repeat engage windows.',
      'Use defensive layers as backup, but keep the main plan focused on controlled burst and repositioning.'
    ],
    itemGuide: [
      {
        label: 'Heavy-hit burst',
        itemIds: ['Crowbar', 'NearbyDamageBonus', 'FireRing', 'IceRing', 'BossDamageBonus'],
        reason: 'Loader turns large individual hits into major burst, making damage multipliers and bands especially valuable.'
      },
      {
        label: 'Mobility and routing',
        itemIds: ['Hoof', 'SprintBonus', 'Feather', 'JumpBoost', 'FallBoots'],
        reason: 'Movement improves Loader\'s engagement angles, vertical routing, and recovery after high-speed impacts.'
      },
      {
        label: 'Cooldown and charge access',
        itemIds: ['SecondarySkillMagazine', 'Bandolier', 'AlienHead', 'UtilitySkillMagazine'],
        reason: 'More skill availability means more grapples, more burst windows, and safer repositioning.'
      },
      {
        label: 'Barrier and close-range safety',
        itemIds: ['Bear', 'ArmorPlate', 'BarrierOnKill', 'ExtraLife'],
        reason: 'Loader creates barrier through combat, but extra mitigation protects against bad entries and elite burst.'
      },
      {
        label: 'Cleanup support',
        itemIds: ['IgniteOnKill', 'ExplodeOnDeath', 'Behemoth', 'Dagger'],
        reason: 'Area and kill-chain items help Loader convert single-target impact into pack clearing.'
      }
    ],
    avoidNotes: [
      'Do not overbuild low-impact attack-speed plans before burst and mobility are covered.',
      'Do not enter dense packs without a clear path out after the charged hit lands.',
      'Avoid treating barrier as permanent safety against elite burst or boss mechanics.'
    ]
  },
  {
    survivor: 'Captain',
    summary:
      'Captain is a controlled-fire survivor who combines strong primary damage, utility beacons, and item support to stabilize fights.',
    buildPlan: [
      'Use the primary fire to control lanes and focus priority targets while item effects add wider coverage.',
      'Build attack speed, proc effects, and crit so sustained shotgun pressure scales through the run.',
      'Add mobility because Captain has limited escape options without item support.',
      'Use defensive and equipment support to reinforce teleporter holds and long boss phases.'
    ],
    itemGuide: [
      {
        label: 'Primary-fire scaling',
        itemIds: ['Syringe', 'BleedOnHit', 'Missile', 'StickyBomb', 'ChainLightning'],
        reason: 'Captain can apply repeated hits through focused fire, making proc items a strong scaling route.'
      },
      {
        label: 'Crit and sustained pressure',
        itemIds: ['CritGlasses', 'AttackSpeedOnCrit', 'HealOnCrit', 'Clover'],
        reason: 'Crit support improves Captain\'s direct damage while adding sustain and attack-speed payoff.'
      },
      {
        label: 'Mobility patch',
        itemIds: ['Hoof', 'SprintBonus', 'Feather', 'JumpBoost', 'SprintOutOfCombat'],
        reason: 'Movement items cover Captain\'s limited escape profile and improve stage routing.'
      },
      {
        label: 'Holdout defense',
        itemIds: ['Bear', 'ArmorPlate', 'BarrierOnKill', 'TPHealingNova', 'ExtraLife'],
        reason: 'Defensive items help Captain hold teleporter zones and survive pressure when escape tools are limited.'
      },
      {
        label: 'Equipment and boss utility',
        itemIds: ['EquipmentMagazine', 'EnergizedOnEquipmentUse', 'Talisman', 'BossDamageBonus'],
        reason: 'Equipment and boss-damage support strengthen Captain\'s controlled fight plan during major encounters.'
      }
    ],
    avoidNotes: [
      'Do not ignore mobility; Captain can lose runs to bad positioning even with strong damage.',
      'Do not rely on beacons alone to solve sustained enemy pressure.',
      'Avoid spreading fire across too many targets when dangerous elites or bosses need focused damage.'
    ]
  },
  {
    survivor: 'Acrid',
    summary:
      'Acrid wins by spreading Poison or Blight, staying mobile, and using item damage to finish enemies that the damage-over-time leaves alive.',
    buildPlan: [
      'Open fights by infecting groups, then keep moving while damage-over-time drains high-health targets.',
      'Use melee skills as controlled entries or finishers, not as a reason to stand inside every enemy pack.',
      'Build item damage, area cleanup, mobility, and defense so Poison creates kills instead of only lowering health bars.',
      'Death Mark becomes strong when your build can combine Poison with bleed, slow, burn, armor reduction, or other debuffs.'
    ],
    itemGuide: [
      {
        label: 'Core damage finishers',
        itemIds: ['BleedOnHit', 'Missile', 'ChainLightning', 'IgniteOnKill', 'ExplodeOnDeath'],
        reason: 'Poison weakens enemies but often needs item damage, explosions, or chain hits to secure kills and clear packs.'
      },
      {
        label: 'Death Mark setup',
        itemIds: ['DeathMark', 'SlowOnHit', 'BleedOnHit', 'ArmorReductionOnHit', 'FireballsOnHit'],
        reason: 'Acrid already brings a major debuff, so added bleed, slow, burn, and armor reduction make Death Mark easier to activate.'
      },
      {
        label: 'Mobility and spacing',
        itemIds: ['Hoof', 'SprintOutOfCombat', 'Feather', 'ExtraLife'],
        reason: 'Acrid survives by choosing when to enter melee and when to kite while damage-over-time keeps working.'
      },
      {
        label: 'Defense and recovery',
        itemIds: ['Bear', 'ArmorPlate', 'BarrierOnKill', 'Medkit'],
        reason: 'Defensive layers keep Acrid alive through melee entries, boss pressure, and mistakes while waiting for poison damage.'
      },
      {
        label: 'Skill uptime',
        itemIds: ['SecondarySkillMagazine', 'Bandolier', 'AlienHead'],
        reason: 'More uptime helps Acrid reapply damage-over-time, escape bad positions, and keep pressure on tanky enemies.'
      }
    ],
    avoidNotes: [
      'Do not build only healing; Acrid still needs movement, finishers, and damage conversion.',
      'Do not assume Poison will kill everything by itself. Plan how enemies actually die.',
      'Be careful with slow melee overcommitment on elite packs and bosses.'
    ]
  },
  {
    survivor: 'REX',
    summary:
      'REX is a health-management survivor: spend health for strong skills, then stabilize with healing, armor, mobility, and crowd control.',
    buildPlan: [
      'Treat health as a resource, not a cushion. Use self-damage skills when you have space, healing, or a clear payoff.',
      'Prioritize sustain and mitigation early so your strongest skills do not put you into one-shot range.',
      'Use roots and knockback to control enemy packs before they surround you.',
      'Once survival is stable, add Death Mark setup and area damage so your debuffs convert into faster clears.'
    ],
    itemGuide: [
      {
        label: 'Healing engine',
        itemIds: ['Medkit', 'HealWhileSafe', 'Seed', 'HealOnCrit', 'IncreaseHealing'],
        reason:
          'REX spends health to create value, so reliable healing gives you more freedom to use the kit instead of playing scared.'
      },
      {
        label: 'Damage prevention',
        itemIds: ['Bear', 'ArmorPlate', 'BarrierOnKill', 'BarrierOnOverHeal', 'ExtraLife'],
        reason:
          'Mitigation and barrier reduce the risk of self-damage plus enemy hits pushing you below a safe health threshold.'
      },
      {
        label: 'Mobility and positioning',
        itemIds: ['Hoof', 'SprintBonus', 'Feather', 'SprintOutOfCombat'],
        reason:
          'REX needs help repositioning after roots, setup windows, and health-spending attacks. Movement keeps the healing plan alive.'
      },
      {
        label: 'Debuff and Death Mark support',
        itemIds: ['DeathMark', 'SlowOnHit', 'BleedOnHit', 'ArmorReductionOnHit', 'IgniteOnKill'],
        reason:
          'REX already plays well with debuff-heavy combat, so added slow, bleed, burn, and armor reduction can turn Death Mark into real damage.'
      },
      {
        label: 'Area cleanup',
        itemIds: ['ChainLightning', 'Missile', 'ExplodeOnDeath', 'FireballsOnHit'],
        reason:
          'Crowd-control skills buy time, but area item damage helps finish grouped enemies before the fight drags on.'
      }
    ],
    avoidNotes: [
      'Do not spend health just because a skill is available. Spend it when the result improves the fight.',
      'Do not rely on healing alone. Armor, block, barrier, and movement prevent bad health states before healing matters.',
      'Avoid standing still inside your own setup windows once elites and ranged enemies are active.'
    ]
  },
  {
    survivor: 'Railgunner',
    summary:
      'Railgunner is a precision burst survivor who turns weak-point aim, reload timing, and high-damage shots into controlled boss and elite deletion.',
    buildPlan: [
      'Prioritize clean sightlines and target selection so heavy shots remove high-value threats before packs collapse.',
      'Build burst multipliers, crit damage, and bands because Railgunner gets high value from fewer decisive hits.',
      'Add mobility early so scoped pressure does not leave you trapped by flankers, flyers, or teleporter spawns.',
      'Use area damage and proc support to cover smaller enemies that do not justify full burst windows.'
    ],
    itemGuide: [
      {
        label: 'Precision burst',
        itemIds: ['Crowbar', 'FragileDamageBonus', 'CritDamage', 'BossDamageBonus', 'MeteorAttackOnHighDamage'],
        reason: 'Railgunner turns high-damage openings into priority kills, so burst multipliers and crit-damage scaling are central.'
      },
      {
        label: 'Band and boss windows',
        itemIds: ['FireRing', 'IceRing', 'ElementalRingVoid', 'LightningStrikeOnHit'],
        reason: 'Large single hits trigger major burst windows that help Railgunner shorten boss and elite fights.'
      },
      {
        label: 'Scope safety and routing',
        itemIds: ['Hoof', 'SprintBonus', 'Feather', 'JumpBoost', 'SprintOutOfCombat'],
        reason: 'Movement gives Railgunner safer angles, cleaner retreats, and better access to vertical positions.'
      },
      {
        label: 'Crowd correction',
        itemIds: ['IgniteOnKill', 'ExplodeOnDeath', 'ExplodeOnDeathVoid', 'Behemoth', 'Dagger'],
        reason: 'Area and on-kill damage keep smaller enemies from draining time between priority shots.'
      },
      {
        label: 'Emergency buffer',
        itemIds: ['Bear', 'OutOfCombatArmor', 'ArmorPlate', 'ExtraLife'],
        reason: 'Defensive buffers protect Railgunner when scoped positioning or reload timing creates a vulnerable window.'
      }
    ],
    avoidNotes: [
      'Do not spend every burst shot on low-priority enemies while elites or bosses are active.',
      'Do not skip mobility; precision damage still fails when enemies control your position.',
      'Avoid overbuilding rapid-hit proc items before burst, bands, and movement are covered.'
    ]
  },
  {
    survivor: 'Void Fiend',
    summary:
      'Void Fiend is a stance-management survivor who balances controlled sustain with corrupted burst and aggressive repositioning.',
    buildPlan: [
      'Track corruption state before committing so the form swap happens during a useful damage or escape window.',
      'Build healing and mitigation carefully because recovery affects how safely you can manage pressure and corruption.',
      'Add movement to control when corrupted aggression starts and when controlled form needs space.',
      'Use proc and area items to make both forms clear packs without relying only on raw beam damage.'
    ],
    itemGuide: [
      {
        label: 'Form-stable sustain',
        itemIds: ['HealWhileSafe', 'Medkit', 'HealingPotion', 'Seed', 'ImmuneToDebuff'],
        reason: 'Reliable recovery gives Void Fiend more control over dangerous health states and longer fights.'
      },
      {
        label: 'Corrupted damage payoff',
        itemIds: ['Syringe', 'BleedOnHit', 'BleedOnHitVoid', 'MissileVoid', 'ChainLightningVoid'],
        reason: 'Attack-speed and proc items help corrupted pressure convert into real kills instead of only short damage spikes.'
      },
      {
        label: 'Area conversion',
        itemIds: ['IgniteOnKill', 'ExplodeOnDeath', 'ExplodeOnDeathVoid', 'Behemoth', 'FireballsOnHit'],
        reason: 'Area damage helps both forms clear groups when beam pressure is split across too many targets.'
      },
      {
        label: 'Mobility control',
        itemIds: ['Hoof', 'AttackSpeedAndMoveSpeed', 'Feather', 'JumpBoost', 'MushroomVoid'],
        reason: 'Movement improves form timing, escape quality, and the ability to choose when corrupted aggression is safe.'
      },
      {
        label: 'Damage prevention',
        itemIds: ['Bear', 'BearVoid', 'ArmorPlate', 'OutOfCombatArmor', 'ExtraLifeVoid'],
        reason: 'Block and mitigation reduce the risk of entering a bad form state while already under lethal pressure.'
      }
    ],
    avoidNotes: [
      'Do not treat corruption as automatically safe damage; time it around positioning and enemy pressure.',
      'Do not overstack healing without enough damage conversion to end fights.',
      'Avoid committing corrupted form into dense ranged pressure without an exit route.'
    ]
  },
  {
    survivor: 'Seeker',
    summary:
      'Seeker is a support-leaning brawler who stabilizes fights through healing windows, team value, and controlled close-range pressure.',
    buildPlan: [
      'Use sustain and setup windows to keep fights controlled before committing to close-range pressure.',
      'Build healing, barrier, and mitigation so support value stays active during teleporter and boss pressure.',
      'Add damage and area conversion after survival is stable, especially for solo pace.',
      'Use mobility to keep healing windows and offensive entries from becoming stationary traps.'
    ],
    itemGuide: [
      {
        label: 'Healing output',
        itemIds: ['Medkit', 'Seed', 'HealOnCrit', 'IncreaseHealing', 'BarrierOnOverHeal'],
        reason: 'Healing and overheal scaling reinforce Seeker\'s stabilizing role and make recovery windows more valuable.'
      },
      {
        label: 'Barrier and mitigation',
        itemIds: ['Bear', 'ArmorPlate', 'BarrierOnKill', 'BarrierOnCooldown', 'ImmuneToDebuff'],
        reason: 'Mitigation keeps Seeker active when support windows require staying near danger.'
      },
      {
        label: 'Close-range pressure',
        itemIds: ['NearbyDamageBonus', 'Syringe', 'BleedOnHit', 'Missile', 'PrimarySkillShuriken'],
        reason: 'Melee and repeated pressure need item damage to scale beyond raw kit output.'
      },
      {
        label: 'Team and holdout value',
        itemIds: ['Mushroom', 'TPHealingNova', 'WardOnLevel', 'Plant'],
        reason: 'Holdout and zone tools strengthen Seeker\'s ability to stabilize objectives and group fights.'
      },
      {
        label: 'Mobility and recovery',
        itemIds: ['Hoof', 'SprintBonus', 'Feather', 'JumpBoost', 'MushroomVoid'],
        reason: 'Movement lets Seeker enter, support, and leave without turning every fight into a stationary trade.'
      }
    ],
    avoidNotes: [
      'Do not build only sustain; Seeker still needs damage to keep stage tempo under control.',
      'Do not hold support windows until after the fight has already collapsed.',
      'Avoid standing still for healing value when ranged enemies or elites have clear angles.'
    ]
  },
  {
    survivor: 'False Son',
    summary:
      'False Son is a heavy melee survivor who converts durability, lunar resource pressure, and burst windows into close-range control.',
    buildPlan: [
      'Use armor, health, and controlled entries to survive the approach before committing to heavy melee pressure.',
      'Prioritize burst, cooldown access, and close-range damage so each engage creates a clear payoff.',
      'Add mobility because high durability does not solve bad vertical routing or long ranged pressure.',
      'Use area and on-kill damage to convert single-target melee hits into pack control.'
    ],
    itemGuide: [
      {
        label: 'Heavy melee burst',
        itemIds: ['NearbyDamageBonus', 'Crowbar', 'FireRing', 'IceRing', 'BossDamageBonus'],
        reason: 'False Son benefits from high-impact close-range hits that remove priority targets during engage windows.'
      },
      {
        label: 'Durability core',
        itemIds: ['FlatHealth', 'Bear', 'ArmorPlate', 'OutOfCombatArmor', 'DelayedDamage'],
        reason: 'Health, block, armor, and delayed damage help False Son stay functional while closing distance.'
      },
      {
        label: 'Cooldown and skill pressure',
        itemIds: ['SecondarySkillMagazine', 'Bandolier', 'AlienHead', 'UtilitySkillMagazine'],
        reason: 'More skill access gives False Son additional engage, burst, and recovery windows.'
      },
      {
        label: 'Mobility patch',
        itemIds: ['Hoof', 'AttackSpeedAndMoveSpeed', 'Feather', 'JumpBoost', 'TeleportOnLowHealth'],
        reason: 'Movement items keep False Son from being kited or trapped after a melee commitment.'
      },
      {
        label: 'Pack conversion',
        itemIds: ['IgniteOnKill', 'ExplodeOnDeath', 'Behemoth', 'ShockNearby', 'FireballsOnHit'],
        reason: 'Area damage lets close-range kills spread into the enemy pack instead of forcing one target at a time.'
      }
    ],
    avoidNotes: [
      'Do not assume durability replaces positioning; ranged elites can still punish slow approaches.',
      'Do not overbuild melee burst without mobility to reach the targets that matter.',
      'Avoid spending all cooldowns to enter if the fight still needs a disengage option.'
    ]
  },
  {
    survivor: 'CHEF',
    summary:
      'CHEF is a combo and status survivor who uses setup effects, boosted skills, and area control to turn grouped enemies into value.',
    buildPlan: [
      'Build around setup-and-payoff timing so boosted skills land when enemies are grouped or already controlled.',
      'Prioritize burn, debuffs, and area damage because CHEF wants status pressure to become pack cleanup.',
      'Add cooldown support so combo windows are available more often and mistakes recover faster.',
      'Use mobility and defense to avoid being locked in place while preparing boosted actions.'
    ],
    itemGuide: [
      {
        label: 'Burn and status pressure',
        itemIds: ['IgniteOnKill', 'StrengthenBurn', 'DeathMark', 'SlowOnHit', 'TriggerEnemyDebuffs'],
        reason: 'CHEF benefits from status layering that turns setup effects into stronger damage windows.'
      },
      {
        label: 'Combo uptime',
        itemIds: ['SecondarySkillMagazine', 'Bandolier', 'AlienHead', 'UtilitySkillMagazine'],
        reason: 'Cooldown and charge support make boosted actions and recovery windows available more reliably.'
      },
      {
        label: 'Area cleanup',
        itemIds: ['ExplodeOnDeath', 'ExplodeOnDeathVoid', 'Behemoth', 'FireballsOnHit', 'ShockNearby'],
        reason: 'Area damage helps CHEF convert grouped or controlled enemies into stage tempo.'
      },
      {
        label: 'Close-range safety',
        itemIds: ['Bear', 'ArmorPlate', 'BarrierOnKill', 'HealingPotion', 'ExtraLife'],
        reason: 'Defensive layers protect CHEF while setting up combos near active enemy pressure.'
      },
      {
        label: 'Movement and spacing',
        itemIds: ['Hoof', 'AttackSpeedAndMoveSpeed', 'Feather', 'JumpBoost', 'SprintOutOfCombat'],
        reason: 'Movement keeps combo setup from becoming a stationary trade and improves routing between fights.'
      }
    ],
    avoidNotes: [
      'Do not fire boosted skills into scattered enemies when a grouped setup would produce more value.',
      'Do not build only status effects without enough direct or area damage to finish targets.',
      'Avoid standing in unsafe lanes while waiting for the next combo piece.'
    ]
  },
  {
    survivor: 'Drifter',
    summary:
      'Drifter is a scrap-and-resource survivor who turns item flow, close-range pressure, and utility generation into flexible run control.',
    buildPlan: [
      'Use resource generation to shape the run, but keep a clear damage and survival package before getting greedy.',
      'Build mobility and defense early so close-range pickups and resource actions do not become forced damage trades.',
      'Add on-hit, area, and kill-chain damage so generated resources translate into faster clears.',
      'Use cooldown and utility support when the run depends on more frequent salvage or control windows.'
    ],
    itemGuide: [
      {
        label: 'Resource tempo',
        itemIds: ['BonusGoldPackOnKill', 'FreeChest', 'LowerPricedChests', 'RegeneratingScrap', 'ItemDropChanceOnKill'],
        reason: 'Economy and scrap tools amplify Drifter\'s resource identity and create more chances to shape the build.'
      },
      {
        label: 'Close-range durability',
        itemIds: ['Bear', 'ArmorPlate', 'BarrierOnKill', 'HealingPotion', 'ExtraLife'],
        reason: 'Drifter needs mitigation to safely collect value and fight near enemies without losing tempo to damage.'
      },
      {
        label: 'Practical damage engine',
        itemIds: ['Syringe', 'BleedOnHit', 'Missile', 'ChainLightning', 'PrimarySkillShuriken'],
        reason: 'Reliable damage items keep the run moving while resource tools come online.'
      },
      {
        label: 'Pack cleanup',
        itemIds: ['IgniteOnKill', 'ExplodeOnDeath', 'Dagger', 'Behemoth', 'LaserTurbine'],
        reason: 'On-kill and area damage help Drifter turn generated advantages into faster stage clears.'
      },
      {
        label: 'Mobility and pickup control',
        itemIds: ['Hoof', 'AttackSpeedAndMoveSpeed', 'Feather', 'JumpBoost', 'SpeedOnPickup'],
        reason: 'Movement improves pickup safety, stage routing, and the ability to disengage after resource actions.'
      }
    ],
    avoidNotes: [
      'Do not chase resource value before the build has damage, movement, and defense covered.',
      'Do not treat generated items as automatically useful; keep scrapping and routing decisions intentional.',
      'Avoid close-range collection paths that run through elite or boss pressure without mitigation.'
    ]
  },
  {
    survivor: 'Operator',
    summary:
      'Operator is a drone-tech survivor who scales through allied pressure, equipment leverage, and coordinated damage support.',
    buildPlan: [
      'Use drones and tech pressure to widen threat coverage while keeping your own positioning safe.',
      'Prioritize drone, equipment, and technology items when they add reliable damage or utility to the whole package.',
      'Add personal mobility and defense because drone support does not prevent direct pressure on you.',
      'Use area damage and proc items to make both personal fire and allied pressure clear packs faster.'
    ],
    itemGuide: [
      {
        label: 'Drone package',
        itemIds: ['DroneWeapons', 'DronesDropDynamite', 'RoboBallBuddy', 'CaptainDefenseMatrix', 'EquipmentMagazine'],
        reason: 'Drone and technology items reinforce Operator\'s allied-pressure identity and improve fight coverage.'
      },
      {
        label: 'Equipment control',
        itemIds: ['EquipmentMagazine', 'EnergizedOnEquipmentUse', 'Talisman', 'AutoCastEquipment', 'RandomEquipmentTrigger'],
        reason: 'Equipment support gives Operator repeatable utility and burst that can be layered with drone pressure.'
      },
      {
        label: 'Personal damage scaling',
        itemIds: ['Syringe', 'BleedOnHit', 'Missile', 'ChainLightning', 'MoreMissile'],
        reason: 'Operator still needs a direct damage engine so the run does not depend only on allied units.'
      },
      {
        label: 'Mobility and survival',
        itemIds: ['Hoof', 'AttackSpeedAndMoveSpeed', 'Feather', 'Bear', 'ArmorPlate'],
        reason: 'Movement and mitigation keep Operator alive when enemies bypass drones or pressure objectives.'
      },
      {
        label: 'Area coverage',
        itemIds: ['IgniteOnKill', 'ExplodeOnDeath', 'Behemoth', 'ShockNearby', 'StunAndPierce'],
        reason: 'Area effects help personal fire and drone pressure control enemy density.'
      }
    ],
    avoidNotes: [
      'Do not assume drones will hold every angle; keep personal escape and defense online.',
      'Do not overbuild equipment loops without enough damage to clear normal stages.',
      'Avoid letting allied pressure split focus while priority elites or bosses remain active.'
    ]
  },
  {
    survivor: 'Heretic',
    summary:
      'Heretic is an item-driven transformation who trades normal survivor rules for high power, health drain, and Heresy skill management.',
    buildPlan: [
      'Treat the transformation as a commitment: solve health drain, mobility, and damage conversion before leaning into greed.',
      'Prioritize healing and mitigation because Heretic loses health over time and cannot play like a normal durable survivor.',
      'Use Heresy and cooldown support to keep the replacement skill package active and controllable.',
      'Add area and boss damage so the powerful kit ends fights before health drain and scaling become the main threat.'
    ],
    itemGuide: [
      {
        label: 'Transformation pieces',
        itemIds: ['LunarPrimaryReplacement', 'LunarSecondaryReplacement', 'LunarUtilityReplacement', 'LunarSpecialReplacement'],
        reason: 'Heretic only exists through the Heresy item set, so the guide starts with the pieces that create the survivor.'
      },
      {
        label: 'Health-drain recovery',
        itemIds: ['HealWhileSafe', 'Medkit', 'Seed', 'HealOnCrit', 'IncreaseHealing'],
        reason: 'Reliable healing offsets the transformation\'s health drain and keeps long fights from becoming a timer.'
      },
      {
        label: 'Mitigation and insurance',
        itemIds: ['Bear', 'BearVoid', 'ArmorPlate', 'BarrierOnKill', 'ExtraLife'],
        reason: 'Block, armor, barrier, and revive support protect Heretic when health drain overlaps with enemy burst.'
      },
      {
        label: 'Cooldown and burst control',
        itemIds: ['AlienHead', 'Bandolier', 'LunarBadLuck', 'HalfAttackSpeedHalfCooldowns'],
        reason: 'Cooldown access makes the replacement kit more available, but lunar cooldown choices should be weighed against their tradeoffs.'
      },
      {
        label: 'Fight-ending damage',
        itemIds: ['Crowbar', 'BossDamageBonus', 'FireRing', 'IceRing', 'Behemoth'],
        reason: 'Burst and area damage help Heretic end dangerous fights before health drain and scaling overtake the recovery plan.'
      }
    ],
    avoidNotes: [
      'Do not transform without a recovery plan; health drain turns weak sustain into a major liability.',
      'Do not stack lunar tradeoff items blindly just because Heretic already uses lunar pieces.',
      'Avoid long, passive fights where health drain continues but enemy pressure is not being removed.'
    ]
  }
];

export function getSurvivorGuide(name: string) {
  return survivorGuides.find((guide) => guide.survivor === name) ?? null;
}

export function resolveGuideItems(itemIds: string[]) {
  return itemIds.map(findItemById).filter((item): item is ItemRecord => item !== null);
}
