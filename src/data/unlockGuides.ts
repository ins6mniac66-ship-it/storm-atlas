export interface UnlockGuideEntry {
  challengeName: string;
  requirementText: string;
  guideSteps: string[];
}

export interface SurvivorUnlockEntry {
  name: string;
  achievementName: string;
  requirementText: string;
  guideSteps: string[];
}

export const skillUnlockGuides: Record<string, UnlockGuideEntry> = {
  // Commando
  'Commando|Phase Blast': {
    challengeName: 'Commando: Rolling Thunder',
    requirementText: 'Land the killing blow on an Overloading Worm as Commando.',
    guideSteps: [
      'Loop on Drizzle until an Overloading Worm can appear.',
      'Skip drones and final-hit stealing effects when the Worm is low.',
      'Clear nearby enemies so stray proc chains are less likely.',
      'Hold Phase Round or Suppressive Fire for the final sliver.',
      'Make Commando land the actual killing blow.',
      'If a drone, ally, burn, or on-kill item finishes it, retry on the next Worm.'
    ]
  },
  'Commando|Tactical Slide': {
    challengeName: 'Commando: Godspeed',
    requirementText: 'Fully charge the first-stage teleporter before the timer hits 5:00.',
    guideSteps: [
      'Start on Drizzle and route straight toward the teleporter.',
      'Only open fast chests that are directly on the path.',
      'Activate the first-stage teleporter as early as possible.',
      'Stay inside the zone so the charge never stalls.',
      'Use burst equipment or Phase Round to end the boss quickly.',
      'The teleporter must finish charging before 5:00, not merely start before 5:00.'
    ]
  },
  'Commando|Frag Grenade': {
    challengeName: 'Commando: Incorruptible',
    requirementText: 'Clear 20 stages in a single run without picking up Lunar items.',
    guideSteps: [
      'Play on Drizzle and loop instead of ending the run early.',
      'Never pick up Lunar items or Lunar equipment.',
      'Lunar Coins are safe; Void items do not invalidate the challenge.',
      'Avoid the Bazaar unless you can ignore every Lunar pickup.',
      'Build proc damage, movement, healing, and defensive layers.',
      'Clear the twentieth stage with the run uncontaminated.'
    ]
  },

  // Huntress
  'Huntress|Flurry': {
    challengeName: 'Huntress: Finishing Touch',
    requirementText: 'Land a killing blow with every possible hit of a single Laser Glaive.',
    guideSteps: [
      'This unlock is about Laser Glaive behavior, not raw damage. The glaive has to use every possible bounce from one cast, and the killing blow must come from that same cast after the bounce chain has fully played out.',
      'Keep the default Laser Glaive equipped. Flurry is the reward, so any run attempting this challenge must still be using the normal secondary.',
      'The easiest setup is an early Drizzle or Rainstorm run where enemy health is low, density is manageable, and you can control the fight without item damage deleting the pack.',
      'Look for a small group of weak enemies such as Beetles, Lemurians, or Wisps. You want enough targets for the glaive to bounce repeatedly, but not such a chaotic group that another damage source steals the kill.',
      'Before throwing the glaive, soften the group with Strafe or careful primary fire. Do not over-damage the first target; the chain needs living targets to continue bouncing.',
      'Try to set up one target that is slightly weaker than the rest. The ideal result is that the glaive bounces through the group and the later bounce finishes that low-health enemy.',
      'Avoid items that add uncontrolled cleanup before the challenge is complete. Gasoline, Will-o-the-wisp, Ukulele, Ceremonial Dagger, drones, turrets, and similar effects can kill the target before the glaive does.',
      'Artifact of Command makes the route cleaner because you can pick mobility and survival items while skipping random on-kill or chain-damage pickups until Flurry is unlocked.',
      'Good safe pickups are movement, Tougher Times, cautious healing, and a small amount of controlled damage. Do not build so much burst that the first glaive hit kills everything instantly.',
      'When the pack is ready, stop firing, throw one Laser Glaive, and let the entire bounce sequence finish. Do not shoot, blink into enemies, or trigger equipment during the bounce chain.',
      'If the unlock does not trigger, the usual causes are too few valid bounces, another damage source taking the kill, or the target dying before every possible hit of the glaive resolved.',
      'Repeat the setup on the next small pack instead of forcing it during a teleporter swarm. Controlled enemy spacing matters more than speed for this challenge.',
      'Once Flurry unlocks, it becomes a crit-scaling primary option. It is strongest when you can build Lens-Maker\'s Glasses, Predatory Instincts, Harvester\'s Scythe, and other crit support.'
    ]
  },
  'Huntress|Phase Blink': {
    challengeName: 'Huntress: One Shot, One Kill',
    requirementText: 'Collect and carry 12 Crowbars at once as Huntress.',
    guideSteps: [
      'This is one of Huntress\'s simplest unlocks mechanically: you only need to hold 12 Crowbars at the same time. The challenge is making the run stable while committing many white items to one damage pickup.',
      'Artifact of Command is the most reliable route. Start a Huntress run with Command enabled and choose Crowbar from every white command essence until the stack reaches 12.',
      'On Drizzle, this can often be finished in the first few stages if you open most white chests, small chests, and multishop terminals. Do not rush the teleporter if you still need more white item choices nearby.',
      'Crowbar increases damage against high-health enemies, so the stack is not wasted. Huntress can use it to delete fresh targets quickly, but she still needs movement and safety because Crowbars do not help after enemies are already damaged.',
      'If you are using Command, take a few non-white support items from green or red drops when possible. Hopoo Feather, Wax Quail, Harvester\'s Scythe, Predatory Instincts, or defensive pickups can keep the run from becoming too fragile.',
      'If you are not using Command, look for Crowbar printers, white multishops, and scrappers. Scrap low-value white items and feed the printer until you reach 12 Crowbars.',
      'Do not use a 3D printer that consumes Crowbars after you begin stacking them. The requirement checks current inventory, not lifetime pickups.',
      'Do not scrap Crowbars, trade them away, or convert them through printers before the unlock triggers. You need all 12 carried at once.',
      'Count the stack carefully in the item bar or build tracker. Stop choosing Crowbars only after the twelfth one is actually in your inventory.',
      'The run does not require a special boss kill, stage, or timing window. If the unlock has not triggered, keep holding the stack and continue to the next chest or stage.',
      'Once Phase Blink unlocks, future Huntress runs get a utility option with three short charges instead of one longer Blink. It is better for fine repositioning, dodging repeated projectiles, and staying mobile while attacking.',
      'After the unlock is secured, future white items can shift back to movement, defense, crit, or proc support. You do not need to keep forcing Crowbars unless the build still wants burst.'
    ]
  },
  'Huntress|Ballista': {
    challengeName: 'Huntress: Piercing Wind',
    requirementText: 'Start and finish Rallypoint Delta or Scorched Acres without falling below 100% health.',
    guideSteps: [
      'Piercing Wind unlocks Ballista, Huntress\'s high-burst alternate Special. Ballista teleports Huntress upward and fires three powerful shots for 900% damage each, making it excellent for boss burst, Mithrix damage, and advanced Huntress builds.',
      'The challenge requirement is strict: as Huntress, start and finish either Rallypoint Delta or Scorched Acres without falling below 100% health. The stage has to begin and end cleanly. A single point of real health damage fails the attempt.',
      'Use Drizzle when the goal is Ballista. Enemies deal less damage, enemy scaling is slower, teleporter events are safer, and random chip damage is less likely to ruin the run. If the objective is the unlock rather than progression, Drizzle is the practical choice.',
      'Recommended Primary: Strafe. It is more consistent for this unlock because it has reliable targeting, steady damage, easier kiting, and fewer build requirements. Flurry can be stronger with crit, but Strafe is safer before Ballista is unlocked.',
      'Recommended Secondary: Laser Glaive. It clears Wisps, Blind Pests, and other flying enemies while Huntress keeps moving. This is the safest secondary for removing ranged threats before they can chip your health.',
      'Recommended Utility: Phase Blink if available. Three short charges give better panic escapes, more frequent repositioning, and stronger survivability than one longer Blink. Standard Blink travels farther, but Phase Blink is usually safer for this challenge.',
      'Recommended Special: Arrow Rain until Ballista is unlocked. Arrow Rain gives area denial, crowd control, and teleporter pressure reduction. It is not the reward skill, but it helps stabilize the run that earns the reward.',
      'Stages 1 and 2 are preparation stages. Before entering Stage 3, prioritize mobility, barrier generation, damage reduction, and enemy clearing. Do not prioritize healing as the main plan because healing cannot undo a failed challenge.',
      'S-tier item: Topaz Brooch. Target 4-6 stacks and stop around 8 unless the run naturally gives more. Barrier absorbs incoming damage before actual health, which makes it one of the strongest items for Piercing Wind.',
      'S-tier item: Tougher Times. Target 5-7 stacks, with 10 as a strong upper target. It blocks random projectiles and accidental chip damage. Roughly, 1 stack is about 15%, 3 is about 33%, 5 is about 43%, and 10 is about 60% block chance.',
      'S-tier item: Paul\'s Goat Hoof. Target around 4 stacks, with 3-6 as a practical range. Movement equals survivability, and a fast Huntress is much harder for ranged enemies to hit.',
      'S-tier item: Energy Drink. Target around 3 stacks, with 2-5 as a practical range. Huntress spends most dangerous fights sprinting, so sprint speed directly improves survival.',
      'S-tier item: Hopoo Feather. Target 2-3 stacks, with 2-4 as a practical range. Extra jumps help avoid projectiles, recover from bad movement, kite the teleporter, and reposition without exposing health.',
      'A-tier item: Rose Buckler. Target around 3 stacks, with 2-5 as a practical range. Armor while sprinting is excellent because Huntress can keep moving while attacking, which keeps the armor active during most dangerous moments.',
      'A-tier item: Wax Quail. Target 1-2 stacks, with 1-3 as a practical range. It gives burst movement for emergency repositioning, especially when a projectile pattern or elite threat cuts off your route.',
      'A-tier item: Backup Magazine. Target around 3 stacks, with 2-4 as a practical range. More Laser Glaives means more dead Wisps, Blind Pests, Brass Contraptions, and other ranged threats before they can touch your health.',
      'A-tier item: Lens-Maker\'s Glasses. Target around 5 stacks, with 5-10 as a practical range. Crit is not required for the challenge, but it improves damage consistency and shortens dangerous fights.',
      'Damage item: Ukulele. One copy is excellent, and 1-2 stacks are usually enough. It gives crowd clearing without needing Huntress to stand still, but do not overbuild damage at the expense of barrier and mobility.',
      'Damage item: AtG Missile Mk. 1. Target 2-3 stacks if offered. It improves boss damage and scales well, helping end the Stage 3 teleporter before the arena becomes too crowded.',
      'Damage support: Predatory Instincts and Harvester\'s Scythe. One Predatory Instincts gives most of the value if you already have crit. One Harvester\'s Scythe is useful with crit, but it is not required because healing after health loss does not save the challenge.',
      'Utility defense: Repulsion Armor Plate. Target around 3 stacks, with 2-5 as a practical range. It is excellent against Wisps, Blind Pests, Lesser Wisps, and small projectile chip damage.',
      'Utility defense: Old War Stealthkit. One stack is enough. Treat it as emergency insurance, not a primary plan. If it activates, it may save the run from a follow-up hit.',
      'Avoid prioritizing Medkit, Cautious Slug, Bustling Fungus, Leeching Seed, and Personal Shield Generator. Some can help a normal run, but this challenge is about preventing health loss, not recovering after it. Barrier from Topaz Brooch is preferred.',
      'Rallypoint Delta strategy: watch for Blind Pests, Wisps, Brass Contraptions, and Solus Probes. Stay moving, use terrain, break line of sight, avoid stationary fights, and clear ranged enemies first.',
      'Scorched Acres strategy: respect Elder Lemurians, fire elites, blind jumps, and lava-adjacent terrain. Fight in open areas, avoid cliff mistakes, respect burn damage, and keep escape routes available.',
      'Before activating the teleporter, clear nearby enemies, find cover, identify escape routes, and remove ranged threats. Starting the teleporter in a messy area is one of the easiest ways to lose full health.',
      'During teleporter activation, survival is the priority. Leaving the zone briefly is acceptable. Never trade health for teleporter speed, because one careless projectile fails the unlock.',
      'Common failure sources include Shrine of Blood, fall damage, fire elite burn, explosive barrels, Void Cradles, standing still, greedy looting, and post-boss carelessness. The challenge ends when the stage ends, not when the boss dies.',
      'Ideal Stage 3 white items: Tougher Times x6, Paul\'s Goat Hoof x4, Energy Drink x3, Backup Magazine x3, and Repulsion Armor Plate x3. This gives block, speed, skill access, and chip reduction.',
      'Ideal Stage 3 green items: Topaz Brooch x5, Hopoo Feather x2, Rose Buckler x3, Wax Quail x1, Ukulele x1, and AtG Missile Mk. 1 x2. This setup prioritizes barrier, movement, enemy clearing, safety, and consistency.',
      'Ideal Stage 3 skills: Strafe, Laser Glaive, Phase Blink, and Arrow Rain. This loadout gives reliable targeting, safe ranged cleanup, frequent repositioning, and teleporter crowd control.',
      'The exact inventory is not mandatory, but the qualities are: mobility, barrier generation, enemy clearing, safety, and consistency. Those are the qualities that unlock Ballista.'
    ]
  },

  // Bandit
  'Bandit|Blast': {
    challengeName: 'Bandit: Classic Man',
    requirementText: "Successfully use 'Lights Out' to reset your cooldowns 15 times in a row.",
    guideSteps: [
      'Find a dense swarm of weak enemies (Beetles or Lemurians).',
      'Soften each target first with primary fire or Hemorrhage.',
      'Fire Lights Out only when you are 100% sure it will secure the kill.',
      'Avoid proc items like Ukulele or gasoline that might accidentally kill your targets before you can shoot them.'
    ]
  },
  'Bandit|Serrated Shiv': {
    challengeName: 'Bandit: Sadist',
    requirementText: 'Kill a monster with 20 stacks of Hemorrhage.',
    guideSteps: [
      'Find a high-health target, like a teleporter boss or a stone titan.',
      'Equip a Backup Magazine to stack multiple Serrated Daggers.',
      'Quickly cycle behind the target to land backstabs to apply Hemorrhage stacks rapidly.',
      'Maintain the stack duration by pacing your daggers, then let the bleed execute them.'
    ]
  },
  'Bandit|Desperado': {
    challengeName: 'Bandit: B&E',
    requirementText: "Kill the final boss (Mithrix) with 'Lights Out'.",
    guideSteps: [
      'Reach Mithrix as Bandit.',
      'Avoid proc, delayed, or automatic damage near the kill.',
      'Stop attacking when final phase Mithrix is very low.',
      'Wait for stray effects, drones, and minions to stop hitting him.',
      'Land the killing blow with Lights Out.'
    ]
  },

  // MUL-T
  'MUL-T|Scrap Launcher': {
    challengeName: 'MUL-T: Pest Control',
    requirementText: 'Defeat two Beetle Queens without leaving the teleporter zone.',
    guideSteps: [
      'Activate the teleporter on a stage where Beetle Queen is the boss.',
      'If you have Artifact of Swarms or play on a late stage, multiple Beetle Queens will spawn.',
      'Stay completely within the red teleporter circle for the duration of the fight.',
      'Kill both Queens while remaining inside the boundary.'
    ]
  },
  'MUL-T|Power-Saw': {
    challengeName: 'MUL-T: Got Toish!',
    requirementText: 'Defeat an Imp Overlord with the Preon Accumulator.',
    guideSteps: [
      'Locate a Preon Accumulator equipment (Rallypoint Delta timed chest is a guaranteed spawn).',
      'Reach a stage where the Imp Overlord spawns as the teleporter boss (e.g. Scorched Acres or loop stages).',
      'Lower the Imp Overlord\'s health to a tiny fraction (under 5%).',
      'Fire the Preon Accumulator directly at the Overlord to secure the final blow.'
    ]
  },
  'MUL-T|Power Mode': {
    challengeName: 'MUL-T: Seventh Winds',
    requirementText: 'Clear Stage 7 in under 25 minutes as MUL-T.',
    guideSteps: [
      'Play on Drizzle to outrun the scaling clock.',
      'Do not spend time looting the entire stage; open 2-3 chests maximum per stage, then trigger the teleporter.',
      'Prioritize movement items (Goat Hoof, Energy Drink) to traverse map layouts instantly.',
      'Beat Stage 7\'s teleporter event before the timer passes 25:00.'
    ]
  },

  // Engineer
  'Engineer|Spider Mines': {
    challengeName: 'Engineer: 100% Calculate',
    requirementText: 'Defeat the Teleporter boss in under 5 seconds from when it spawns.',
    guideSteps: [
      'Use Artifact of Command to stack high-burst items (Crowbar, Armor-Piercing Rounds, Kjaro\'s/Runald\'s Bands).',
      'Place all your default mines in one concentrated pile directly on the teleporter activation pad.',
      'Place both turrets near the pad.',
      'Trigger the teleporter to spawn the boss instantly on top of your mine stack.',
      'The mines will detonate simultaneously, instantly deleting the boss.'
    ]
  },
  'Engineer|Thermal Harpoons': {
    challengeName: 'Engineer: Better With Friends',
    requirementText: 'Recruit 12 minions at the same time as Engineer.',
    guideSteps: [
      'Drones, turrets, and Queen\'s Gland guards all count as minions.',
      'Purchase every broken drone and turret you find on early stages.',
      'Buy a Backup Drone or use the Equipment: Beetle Gland to secure extra allies.',
      'Reach 12 active allies on the field at once to trigger the unlock.'
    ]
  },
  'Engineer|TR58 Carbonizer Turret': {
    challengeName: 'Engineer: Zero Sum',
    requirementText: 'Defeat the Teleporter boss when there are no active monsters on the stage.',
    guideSteps: [
      'Clear the stage of all random mobs before starting the teleporter.',
      'When the boss spawns, focus entirely on deleting it as fast as possible.',
      'Avoid killing mobs that the teleporter spawns unless they are directly blocking your boss damage.',
      'As soon as the boss dies, verify that no other small enemies are currently alive.'
    ]
  },

  // Artificer
  'Artificer|Plasma Bolt': {
    challengeName: 'Artificer: Orbital Bombardment',
    requirementText: 'Kill 15 enemies before touching the ground as Artificer.',
    guideSteps: [
      'Stack 2-3 Hopoo Feathers or choose the Ion Surge special skill if available.',
      'Locate a dense pack of flying enemies (like Wisps) or a swarm on the ground.',
      'Hover using your passive (ENV Suit) high above the pack.',
      'Rain down Nano-Bombs or fireballs to clear 15 enemies before drifting down.'
    ]
  },
  'Artificer|Cast Nano-Spear': {
    challengeName: 'Artificer: Chunked!',
    requirementText: 'Defeat the Teleporter boss in a single one-second window of damage.',
    guideSteps: [
      'Stack Crowbars and Preon Accumulator or high-damage bands.',
      'Soften the boss down slowly (or use a massive high-damage setup like Armor-Piercing Rounds).',
      'Wait for the boss to be at medium-low health, then coordinate a fully charged Nano-Bomb + Preon blast to wipe their remaining health instantly.'
    ]
  },
  'Artificer|Ion Surge': {
    challengeName: 'Artificer: Massacre',
    requirementText: 'Perform a multi-kill of 20 enemies as Artificer.',
    guideSteps: [
      'Locate a crowded stage (e.g. Abyssal Depths or Sky Meadow).',
      'Kite a large group of Beetles or Lemurians into a dense, tight circle.',
      'Charge a Nano-Bomb fully and unleash it directly into the center of the pack.',
      'Ensure 20+ enemies die within the same explosion window.'
    ]
  },

  // Mercenary
  'Mercenary|Rising Thunder': {
    challengeName: 'Mercenary: Demon of the Skies',
    requirementText: 'Don\'t touch the ground for 30 seconds as Mercenary.',
    guideSteps: [
      'Build 2-3 Backup Magazines to stack Whirlwind charges.',
      'Find a high-health floating boss (like a Wandering Vagrant) or a tall cliff.',
      'Use Blinding Assault, Whirlwind, and your default double jumps to cycle height.',
      'Maintain altitude by constantly slicing into the boss or wall jumping.'
    ]
  },
  'Mercenary|Focused Assault': {
    challengeName: 'Mercenary: Mastery',
    requirementText: 'As Mercenary, obliterate at the Obelisk on Monsoon.',
    guideSteps: [
      'Play on Monsoon difficulty.',
      'Prioritize items that scale melee safety: Tougher Times, Leeching Seed, Harvester\'s Scythe.',
      'Use your invulnerability frames (Eviscerate) to avoid heavy boss slam attacks.',
      'Enter the Celestial Portal on Stage 8 and obliterate at the Obelisk.'
    ]
  },
  'Mercenary|Slicing Winds': {
    challengeName: 'Mercenary: Ethereal',
    requirementText: 'Complete a Prismatic Trial without falling below 100% health.',
    guideSteps: [
      'Prismatic Trials have fixed layouts and item chests.',
      'Artifact of Glass is highly recommended if active in the current seed (kills enemies before they react).',
      'Stack shields (Personal Shield Generator) or barrier—taking damage to shields or barrier does NOT fail the challenge.',
      'Play extremely safely, keep your distance, and let equipment or primary projectile items do the work.'
    ]
  },

  // REX
  'REX|Bramble Volley': {
    challengeName: 'REX: Bushwhacked',
    requirementText: 'Complete a teleporter event while under 50% health.',
    guideSteps: [
      'Fight the teleporter boss normally until it is defeated.',
      'Let your health drop below 50% by using your self-damage skills or letting a small mob hit you.',
      'Stand in the teleporter zone to complete the charge while keeping your health under the 50% threshold.',
      'Avoid high auto-heal items (like Cautious Slug) near the end of the event.'
    ]
  },

  // Loader
  'Loader|Spiked Fist': {
    challengeName: 'Loader: Swing By',
    requirementText: 'Reach the celestial portal in under 25 minutes.',
    guideSteps: [
      'Play on Drizzle difficulty.',
      'Use Loader\'s massive grapple speed to cross stages in seconds.',
      'Trigger the teleporter within 60-90 seconds of starting each stage.',
      'Enter the celestial portal on Stage 8 before the clock passes 25:00.'
    ]
  },
  'Loader|Thunderslam': {
    challengeName: 'Loader: House of the Dying Sun',
    requirementText: 'Defeat the teleporter boss in a single punch.',
    guideSteps: [
      'Stack Crowbars and Armor-Piercing Rounds using Artifact of Command.',
      'Charge your gauntlet fully and hook onto a distant object to gain massive speed.',
      'Unleash the speed-boosted punch directly into the boss.',
      'The initial impact must deal 100% of the boss\'s health bar to trigger the challenge.'
    ]
  },

  // Acrid
  'Acrid|Ravenous Bite': {
    challengeName: 'Acrid: Easy Prey',
    requirementText: 'Land the killing blow on 50 low-health targets.',
    guideSteps: [
      'Inflict poison across a massive pack of mobs.',
      'Poison leaves enemies at 1 HP but cannot kill them directly.',
      'Follow up with a simple Leap or primary spit to clean up the 1 HP targets.',
      'Perform this sequence on 50 total enemies to secure the alternate bite.'
    ]
  },
  'Acrid|Frenzied Leap': {
    challengeName: 'Acrid: Pandemic',
    requirementText: 'Inflict Poison on 1000 total enemies.',
    guideSteps: [
      'Play a looping run where enemy density is high.',
      'Constantly spread Epidemic (your primary poison bounce skill) into crowds.',
      'This challenge tracks poison applications cumulatively across all your runs.'
    ]
  },

  // Captain
  'Captain|Beacon: Resupply': {
    challengeName: 'Captain: Worth Every Penny',
    requirementText: 'Repair a TC-280 Prototype drone.',
    guideSteps: [
      'Play on Rallypoint Delta (Stage 3).',
      'Search the map layout (often near the lower shipping container zones) for the massive, broken TC-280 Prototype drone.',
      'Accumulate the required gold to purchase/repair the drone (typically costs around $3,000 in stage scaling).',
      'Activate the drone to unlock the resupply beacon.'
    ]
  },
  'Captain|Beacon: Hack': {
    challengeName: 'Captain: Smushed',
    requirementText: 'Defeat a Beetle Queen by summoning a Supply Beacon on top of her.',
    guideSteps: [
      'Find a Beetle Queen boss during a teleporter event.',
      'Lower her health bar to a tiny sliver (under 1%).',
      'Aim your Beacon utility tool directly at her model and summon it.',
      'The physical beacon landing deals small impact damage, which must secure the kill.'
    ]
  },

  // Railgunner
  'Railgunner|HH44 Marksman': {
    challengeName: 'Railgunner: Marksman',
    requirementText: 'Achieve 30 consecutive perfect active reloads as Railgunner.',
    guideSteps: [
      'Enter an early stage and find a safe spot or keep one slow enemy alive.',
      'Fire your primary weapon (M99 or smart rounds) and watch the reload slider closely.',
      'Tap the reload button precisely in the glowing white perfect zone to trigger a perfect active reload.',
      'Perform this 30 times consecutively without failing a single reload.',
      'Avoid rushing or spamming fire; count each perfect bar calmly.'
    ]
  },
  'Railgunner|Polar Field Device': {
    challengeName: 'Railgunner: Polarizing',
    requirementText: 'Keep an enemy slowed in a Polar Field for 10 seconds.',
    guideSteps: [
      'Locate a slow, tanky enemy like a Stone Golem or Beetle Guard.',
      'Summon your Polar Field utility device directly on top of them.',
      'Avoid killing the enemy; stand near them to keep them interested in staying inside the slowed field.',
      'Verify they remain inside the blue field circle for 10 uninterrupted seconds.'
    ]
  },
  'Railgunner|Cryocharge': {
    challengeName: 'Railgunner: Trickshot',
    requirementText: 'Land 3 weak point hits in a single airborne window.',
    guideSteps: [
      'Equip a backup concussion device or use environmental geysers/launchers.',
      'Throw a Concussion Device at your feet to launch yourself high into the sky.',
      'Use the scope (M99 Sniper) mid-air to focus on a slow boss or large target (like a Stone Titan).',
      'Precisely shoot 3 weak points (squares) before your model touches the ground.',
      'Stacking attack speed or using a backup magazine can give you faster scope shots.'
    ]
  },

  // Seeker
  'Seeker|Soul Spiral': {
    challengeName: 'Seeker: Soul Spiral',
    requirementText: 'Maintain Sojourn for 15 seconds continuously.',
    guideSteps: [
      'Build a strong barrier or health recovery engine (Bustling Fungus, Leeching Seed, or Aegis).',
      'Equip several Fuel Cells or Gestures of the Drowned to maximize automatic barrier items.',
      'Activate Sojourn (Utility) to fly.',
      'Sojourn drains 25% health per second but scales in damage; use your healing or active barrier skills to out-heal the passive drain.',
      'Fly continuously for 15 seconds without letting the skill end or dying.'
    ]
  },
  'Seeker|Reprieve': {
    challengeName: 'Seeker: Reprieve',
    requirementText: 'Reach 7 stacks of Tranquility.',
    guideSteps: [
      'Tranquility is gained by successfully executing Seeker\'s Special skill Meditate or landing Palm Blasts.',
      'Coordinate your combos in a safe spot, completing Meditate sequences.',
      'Watch your buff counter and successfully stack Tranquility to 7 during a single stage.'
    ]
  },
  'Seeker|Palm Blast': {
    challengeName: 'Seeker: Palm Blast',
    requirementText: 'Defeat the False Son boss as Seeker.',
    guideSteps: [
      'Reach the Meridian Path and activate the boss portal to fight the False Son.',
      'Learn his telegraphs (especially the heavy laser swing).',
      'Defeat the boss while playing Seeker to unlock Palm Blast.'
    ]
  },

  // False Son
  'False Son|Lunar Stakes': {
    challengeName: 'False Son: Lunar Stakes',
    requirementText: 'Reach maximum spikes (15) through Growth.',
    guideSteps: [
      'Growth is False Son\'s unique mechanic that scales with your maximum health.',
      'Collect items that heavily scale your health bar: Infusion, Bison Steak, Rejuvenation Rack, Titanic Knurl.',
      'Artifact of Command makes it easy to stack Infusions and health green items.',
      'Reach a maximum of 15 Lunar Spikes held at once to trigger the unlock.'
    ]
  },
  'False Son|Meridian\'s Will': {
    challengeName: 'False Son: Meridian\'s Will',
    requirementText: 'Clear 15 stages in a single run as False Son.',
    guideSteps: [
      'Play on Drizzle difficulty to ensure high speed and low scaling.',
      'Leverage False Son\'s high health and health regen scaling.',
      'Beat 15 total stages in one run and complete the teleporter event on the 15th stage.'
    ]
  },
  'False Son|Laser Burst': {
    challengeName: 'False Son: Laser Burst',
    requirementText: 'Land the killing blow on the False Son boss with Laser of the Father.',
    guideSteps: [
      'Reach the False Son boss fight.',
      'Lower his health down to a tiny sliver (under 2%).',
      'Activate your Special skill "Laser of the Father" and fire it directly at the boss to secure the final blow.'
    ]
  },

  // CHEF
  'CHEF|Slice': {
    challengeName: 'CHEF: Slice',
    requirementText: 'Hit 10 characters with a single thrown cleaver (Dice).',
    guideSteps: [
      'Wait for a crowded stage (loop stages or dense mob layouts).',
      'Kite a large group of Beetles or Lemurians into a straight line.',
      'Throw your primary cleaver (Dice) so it rolls directly through 10+ enemies on its path.'
    ]
  },
  'CHEF|Sear': {
    challengeName: 'CHEF: Sear',
    requirementText: 'Cook 5 Lemurians at the same time.',
    guideSteps: [
      'Locate a stage with Lemurians.',
      'Gather at least 5 Lemurians into a close pack.',
      'Use your utility Roll to knock them together, then activate Sear to apply ignite to all 5 Lemurians simultaneously.'
    ]
  },
  'CHEF|Glaze': {
    challengeName: 'CHEF: Glaze',
    requirementText: 'Defeat the False Son boss with a boosted Glaze.',
    guideSteps: [
      'Reach the False Son boss fight.',
      'Soften the boss down to a tiny sliver.',
      'Activate your Special boosted skill sequence to trigger a boosted Glaze and hit him for the kill.'
    ]
  }
};

export const survivorUnlockGuides: Record<string, SurvivorUnlockEntry> = {
  MUL_T: {
    name: 'MUL-T',
    achievementName: 'Verified',
    requirementText: 'Complete the first stage 5 times.',
    guideSteps: [
      'Simply start a run, complete the Stage 1 teleporter event, and advance to Stage 2.',
      'Repeat this simple sequence 5 times across any number of separate runs.'
    ]
  },
  Bandit: {
    name: 'Bandit',
    achievementName: 'Warrior',
    requirementText: 'Reach and clear Stage 3.',
    guideSteps: [
      'Advance through Stage 1 and Stage 2.',
      'Defeat the teleporter boss on Stage 3 and activate the teleporter to advance to Stage 4.'
    ]
  },
  Engineer: {
    name: 'Engineer',
    achievementName: 'Engineering Perfection',
    requirementText: 'Complete 30 stages total.',
    guideSteps: [
      'This is a cumulative challenge across all runs.',
      'Play normal runs and clear stages; your total stage count will naturally reach 30 over time.'
    ]
  },
  Artificer: {
    name: 'Artificer',
    achievementName: 'Pause',
    requirementText: 'Free the survivor suspended in time inside the Bazaar Between Time.',
    guideSteps: [
      'Collect 10 Lunar Coins.',
      'Find a Newt Altar on any stage and pay 1 Lunar Coin to secure a Blue Portal.',
      'Complete the teleporter event and enter the Blue Portal to reach the Bazaar Between Time.',
      'Walk up to the suspended crystal figure next to the shopkeeper and pay 10 Lunar Coins to free Artificer.'
    ]
  },
  Mercenary: {
    name: 'Mercenary',
    achievementName: 'True Respite',
    requirementText: 'Obliterate yourself at the Obelisk.',
    guideSteps: [
      'Reach Stage 8 of a run (this loops back to stage 1 environment theme).',
      'Complete the Stage 8 teleporter event. A Celestial Portal (cyan color) will appear.',
      'Enter the Celestial Portal, navigate the floating platform path, and interact with the Obelisk to obliterate.'
    ]
  },
  REX: {
    name: 'REX',
    achievementName: 'Power Plant',
    requirementText: 'Repair the broken robot on Stage 4 with the Fuel Array.',
    guideSteps: [
      'At the start of Stage 1, go to the back of your escape pod and interact with the panel to acquire the Fuel Array item.',
      'The Fuel Array occupies your equipment slot and will detonate (killing you instantly) if your health drops below 50%.',
      'Play extremely safely on Drizzle. Use shield generators or high-health builds.',
      'Reach Stage 4 (Abyssal Depths variant). Navigate to the very top platform of the map where a broken REX robot sits.',
      'Interact with REX while carrying the Fuel Array to repair it and unlock REX.'
    ]
  },
  Loader: {
    name: 'Loader',
    achievementName: 'Guidance Offline',
    requirementText: 'Defeat the Alloy Worship Unit on Siren\'s Call.',
    guideSteps: [
      'Reach Stage 4 and ensure you get the Siren\'s Call map variant.',
      'Locate and destroy several small blue eggs scattered around the map.',
      'Once enough eggs are broken, the massive boss "Alloy Worship Unit" will spawn.',
      'Defeat this high-health flying boss to unlock Loader.'
    ]
  },
  Acrid: {
    name: 'Acrid',
    achievementName: '...To Be Left Alone',
    requirementText: 'Complete the Void Fields event.',
    guideSteps: [
      'Enter the Bazaar Between Time via a Blue Portal.',
      'Drop down into the dark cavern beneath the shopkeeper\'s platform to locate the green-glowing portal to the Void Fields.',
      'Activate and complete all 9 cellular vents inside the Void Fields.',
      'Void Fields deals constant passive damage outside safe zones; stack healing items or move quickly between vents.'
    ]
  },
  CHEF: {
    name: 'CHEF',
    achievementName: 'CHEF: Cooked',
    requirementText: 'Summon and reactivate CHEF inside the Gilded Coast.',
    guideSteps: [
      'Enter the Gilded Coast (either by paying at a Gold Portal or paying to enter via Bazaar Between Time).',
      'Acquire 3 specific ingredients scattered in the Gilded Coast stage (Slug, Mushroom, and Meat).',
      'Locate the kitchen/summoning platform in the Gilded Coast.',
      'Place the ingredients on the altar and activate CHEF to cook him and unlock him as a playable survivor!'
    ]
  },
  'False Son': {
    name: 'False Son',
    achievementName: 'False Son: Growth',
    requirementText: 'Defeat the False Son boss with a Halcyon Seed in your inventory.',
    guideSteps: [
      'Enter the Gilded Coast stage and defeat Aurelionite to secure a Halcyon Seed.',
      'Loop or progress to the Prime Meridian path to trigger the False Son boss fight.',
      'Ensure you are holding the Halcyon Seed in your inventory.',
      'Defeat the False Son boss; Aurelionite will summon and aid you, unlocking the False Son upon success!'
    ]
  }
};
