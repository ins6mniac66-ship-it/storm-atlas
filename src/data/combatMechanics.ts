export type CombatMechanicCategory =
  | 'proc'
  | 'damage'
  | 'scaling'
  | 'status'
  | 'items'
  | 'survivor-tech'
  | 'run-planning';

export type CombatMechanicImportance = 'basic' | 'important' | 'advanced';
export type CombatMechanicSourceStatus = 'wiki-derived' | 'community-tested' | 'needs-review';

export interface CombatMechanic {
  id: string;
  title: string;
  shortDefinition: string;
  detailedExplanation: string;
  category: CombatMechanicCategory;
  importanceLevel: CombatMechanicImportance;
  sourceStatus?: CombatMechanicSourceStatus;
  relatedItems: string[];
  relatedSurvivors: string[];
  tags: string[];
  examples: string[];
  commonMisunderstandings: string[];
  tacticalUse: string[];
  quickTakeaway: string;
}

export const combatMechanics: CombatMechanic[] = [
  {
    id: 'defeat-screen-review',
    title: 'Defeat Screen Review',
    shortDefinition: 'Use the run-end screen to turn a death into a clear next-run adjustment.',
    detailedExplanation:
      'The defeat screen is useful because it shows the survivor, difficulty, time alive, enemy that landed the killing blow, damage taken, stage count, and item package. Read it as a run diagnosis instead of a score page. The killer tells you the final threat, the time and stages show whether you were falling behind tempo, and the item grid shows whether the build had enough mobility, defense, crowd clear, and boss damage for that point in the run.',
    category: 'run-planning',
    importanceLevel: 'basic',
    relatedItems: [
      "Paul's Goat Hoof",
      'Energy Drink',
      'Tougher Times',
      'Repulsion Armor Plate',
      'Ukulele',
      'AtG Missile Mk. 1'
    ],
    relatedSurvivors: ['Huntress'],
    tags: ['defeat', 'run review', 'death recap', 'items collected', 'killed by', 'tempo', 'screenshot'],
    examples: [
      'Identify the survivor class and difficulty first so the review is grounded in the actual run context.',
      'Read the Items Collected grid by role: movement, defense, healing, crowd clear, boss damage, utility, and risky greed.',
      'High kills with only a few stages completed can mean you fought well but spent too long looting or kiting.',
      'Damage Taken matters more than score: if it is high for a fragile survivor, add movement, armor, blocks, or safer routing before more greed.'
    ],
    commonMisunderstandings: [
      'Killed By is not always the whole cause; it is the last hit, not every mistake that led to the death.',
      'A high item count does not guarantee a good build if the items do not solve mobility, defense, crowd clear, or boss damage.',
      'A defeat screen with no unlocks is still useful because it tells you what the next run should fix.'
    ],
    tacticalUse: [
      'Start with Class and Killed By: ask whether that enemy punishes your survivor weakness.',
      'Check Time Alive against Stages Completed: if time is high and stage count is low, route faster or stop over-looting.',
      'Scan Items Collected by role: mobility, defense, healing, crowd clear, single-target damage, and utility.',
      'Check the Unlocked section separately from the death review so new unlocks are not missed after a failed run.',
      'Write one next-run adjustment, such as add movement earlier, pick up more defensive buffer, improve crowd clear, or stop taking extra boss risk when damage is behind.'
    ],
    quickTakeaway:
      'Read the end screen as a diagnosis: last-hit enemy, stage tempo, damage taken, and item roles tell you what to change next run.'
  },
  {
    id: 'commencement-prep',
    title: 'Commencement Prep',
    shortDefinition: 'A final-stage checklist for Mithrix, pillars, scrapping, and mobility routing.',
    detailedExplanation:
      'Commencement prep is the set of decisions you make before and during the moon route. The goal is to enter Mithrix with a build that can survive item steal, enough damage to end phases cleanly, and a realistic movement plan. That means scrapping off-plan items when possible, judging whether Shrine of the Mountain or extra greed is safe before leaving earlier stages, saving mobility cooldowns for pillar skip attempts, and abandoning the skip quickly if it is slower than doing pillars.',
    category: 'run-planning',
    importanceLevel: 'important',
    relatedItems: [
      'Item Scrap, White',
      'Item Scrap, Green',
      'Item Scrap, Red',
      'Hopoo Feather',
      "Paul's Goat Hoof",
      'Wax Quail'
    ],
    relatedSurvivors: ['Loader', 'Artificer', 'Mercenary', 'Railgunner', 'Acrid', 'Captain', 'Engineer'],
    tags: ['commencement', 'mithrix', 'item steal', 'scrapper', 'pillar skip', 'shrine of the mountain', 'co-op'],
    examples: [
      'Scrap weak or dangerous off-plan items before Mithrix if you find a scrapper.',
      'Start pillars instead of forcing a bad pillar skip angle for several minutes.',
      'In co-op, start the teleporter only when the team is done looting or clearly ready.'
    ],
    commonMisunderstandings: [
      'Reaching Commencement does not mean the run is automatically ready for Mithrix.',
      'Pillar skip is a time save only when it works quickly.',
      'Extra Shrine of the Mountain rewards are not worth it if boss damage or survival is behind.'
    ],
    tacticalUse: [
      'Before leaving Stage 5, decide whether the build needs a loop, a scrapper, or more boss damage.',
      'Keep mobility cooldowns ready when attempting vertical skips on Commencement.',
      'Scrap items that hurt the plan or become dangerous when Mithrix steals them, but keep core damage, defense, and mobility.',
      'Confirm co-op readiness before starting teleporter events or leaving through a portal.'
    ],
    quickTakeaway: 'Enter Commencement with boss damage, mobility, and a clean inventory plan; do pillars if the skip is failing.'
  },
  {
    id: 'pillar-skip',
    title: 'Pillar Skip',
    shortDefinition: 'A Commencement route skip that reaches Mithrix without fully charging the moon pillars.',
    detailedExplanation:
      'Pillar skip is a late-run movement tactic on Commencement. Instead of completing the normal pillar events to reach the final arena, high-mobility survivors can use vertical movement, cooldown timing, and map geometry to climb or launch toward Mithrix directly. It saves time when executed cleanly, but a bad attempt can waste more time than simply doing pillars.',
    category: 'run-planning',
    importanceLevel: 'advanced',
    relatedItems: ['Hopoo Feather', "Paul's Goat Hoof", 'Energy Drink', 'Wax Quail', 'Hardlight Afterburner'],
    relatedSurvivors: ['Loader', 'Artificer', 'Mercenary', 'Railgunner', 'Acrid'],
    tags: ['commencement', 'mithrix', 'pillar skip', 'mobility', 'vertical', 'route skip', 'commencement prep'],
    examples: [
      'Loader can combine grapple momentum with charged gauntlet movement.',
      'Artificer with Ion Surge can create strong vertical lift before hovering.',
      'Railgunner can use Concussion Device knockback to gain height.'
    ],
    commonMisunderstandings: [
      'Pillar skip is not required to beat Mithrix.',
      'A failed skip attempt can be slower than charging pillars normally.',
      'Movement items help, but survivor kit and launch angle still matter.'
    ],
    tacticalUse: [
      'Attempt it when your survivor has strong vertical mobility and your cooldowns are ready.',
      'Abort quickly if the angle or height is not working; start pillars instead of forcing the skip.',
      'Treat the skip as part of Commencement prep: enter with mobility cooldowns ready and a fallback plan.',
      'Use it when the run is strong enough for Mithrix and time is more valuable than pillar rewards.'
    ],
    quickTakeaway: 'Use pillar skip with strong vertical mobility; abandon it fast if the route is not working.'
  },
  {
    id: 'proc',
    title: 'Proc',
    shortDefinition: 'A proc is a triggered effect, usually from an item activating when you hit an enemy.',
    detailedExplanation:
      'Players use proc to describe item effects that can activate from hits. Many damage, status, and chain-damage items depend on proc behavior. Actual trigger reliability depends on the item chance, the attack proc coefficient, and how often the survivor lands valid hits.',
    category: 'proc',
    importanceLevel: 'basic',
    relatedItems: ['Tri-Tip Dagger', 'Ukulele', 'AtG Missile Mk. 1', 'Sticky Bomb', 'Stun Grenade'],
    relatedSurvivors: ['Commando', 'MUL-T', 'Engineer', 'Captain'],
    tags: ['trigger', 'on-hit', 'item chance', 'hit frequency'],
    examples: [
      'Commando turns repeated hits into frequent item rolls.',
      'A single heavy hit may roll fewer procs than a steady stream of attacks.',
      'Ukulele and AtG Missile Mk. 1 are useful because one hit can become extra damage pressure.'
    ],
    commonMisunderstandings: [
      'Proc chance is not only the item text.',
      'Every hit does not always roll at full listed value.',
      'More hits are strongest when the skill has a useful proc coefficient.'
    ],
    tacticalUse: [
      'Favor proc items on survivors with reliable hit frequency.',
      'Pair attack speed with on-hit items when it creates more valid hit checks.',
      'Use proc items to turn weak base damage uptime into scaling pressure.'
    ],
    quickTakeaway: 'Proc builds reward survivors that hit often and roll item effects reliably.'
  },
  {
    id: 'electric-damage',
    title: 'Electric Damage',
    shortDefinition:
      'Electric damage covers chain lightning, lightning strikes, zaps, shocks, and electric item triggers that convert frequent hits into extra pressure.',
    detailedExplanation:
      'Electric damage is best treated as a build direction inside the damage and proc systems, not as a separate app section. Ukulele, Unstable Tesla Coil, Genesis Loop, Charged Perforator, Polylute, Royal Capacitor, and related survivor skills create extra damage through chain hits, lightning strikes, zaps, shock effects, or electric bursts. These effects are strongest when the build can land frequent valid hits, group enemies, or convert a single proc into wider area pressure.',
    category: 'damage',
    importanceLevel: 'important',
    relatedItems: [
      'Ukulele',
      'Unstable Tesla Coil',
      'Genesis Loop',
      'Charged Perforator',
      'Polylute',
      'Royal Capacitor'
    ],
    relatedSurvivors: ['Loader', 'Captain', 'False Son'],
    tags: ['electric', 'lightning', 'chain lightning', 'zap', 'shock', 'proc', 'aoe', 'on-hit'],
    examples: [
      'Ukulele turns repeated hits into chain lightning that helps clear grouped enemies.',
      'Charged Perforator and Royal Capacitor add high-value lightning strikes for burst or boss pressure.',
      'Loader and Captain have electric or shock-flavored skills that can support the same item direction.'
    ],
    commonMisunderstandings: [
      'Electric is not a separate rarity or build screen requirement; it is a damage/proc package.',
      'Names containing Thunder do not always mean the effect deals electric damage.',
      'Lightning items still depend on hit frequency, proc behavior, cooldowns, and enemy grouping.'
    ],
    tacticalUse: [
      'Use electric items when the survivor can hit often enough to roll procs reliably.',
      'Pair chain lightning with crowd control, grouping, or AoE so the extra hits matter.',
      'Add single-target lightning sources when boss damage is the run weakness.',
      'Treat electric as part of the broader damage plan instead of forcing it over core survivability or mobility.'
    ],
    quickTakeaway: 'Electric belongs under damage/proc planning: use it to turn frequent hits and grouped enemies into wider pressure.'
  },
  {
    id: 'proc-coefficient',
    title: 'Proc Coefficient',
    shortDefinition: 'A proc coefficient is a multiplier that changes how likely an attack is to trigger on-hit effects.',
    detailedExplanation:
      'A skill with a 1.0 proc coefficient applies item trigger chances normally. A lower coefficient reduces activation chance. Fast multi-hit attacks, beams, and damage-over-time effects may use lower coefficients so they do not trigger items at full value on every tick.',
    category: 'proc',
    importanceLevel: 'advanced',
    relatedItems: ['Tri-Tip Dagger', 'Ukulele', 'AtG Missile Mk. 1', 'Sticky Bomb', 'Plasma Shrimp', 'Needletick'],
    relatedSurvivors: ['Commando', 'Huntress', 'MUL-T', 'Engineer', 'Acrid'],
    tags: ['coefficient', 'proc chance', 'on-hit', 'multi-hit', 'dot'],
    examples: [
      'A 1.0 coefficient attack rolls a 10% item at 10%.',
      'A low coefficient tick rolls the same item at a reduced effective chance.',
      'Fast skills can still be excellent if total hit volume compensates.'
    ],
    commonMisunderstandings: [
      'Fast attacks are not automatically full-value proc engines.',
      'Damage-over-time ticks do not always behave like normal attacks.',
      'Item chance and skill coefficient are separate pieces of the roll.'
    ],
    tacticalUse: [
      'Check whether a survivor gets real value from on-hit pickups before overcommitting.',
      'Prioritize reliable proc skills when building bleed, missiles, or chain damage.',
      'Value attack speed most when it increases full or useful coefficient hit checks.'
    ],
    quickTakeaway: 'Low proc coefficient skills trigger on-hit items less reliably.'
  },
  {
    id: 'on-hit-effects',
    title: 'On-Hit Effects',
    shortDefinition: 'On-hit effects are item effects that can trigger when your attack connects with an enemy.',
    detailedExplanation:
      'On-hit effects convert basic combat uptime into extra damage, status, control, or chained hits. They are strongest when the survivor can land many valid attacks without giving up positioning or objective tempo.',
    category: 'items',
    importanceLevel: 'important',
    relatedItems: ['Tri-Tip Dagger', 'Ukulele', 'AtG Missile Mk. 1', 'Sticky Bomb', 'Stun Grenade', 'Plasma Shrimp', 'Needletick'],
    relatedSurvivors: ['Commando', 'MUL-T', 'Engineer', 'Captain', 'Operator'],
    tags: ['on-hit', 'item synergy', 'trigger', 'attack speed'],
    examples: [
      'Tri-Tip Dagger adds bleed pressure from repeated hits.',
      'Ukulele helps a single target hit spread pressure into nearby enemies.',
      'AtG Missile Mk. 1 gives sustained attackers surprise burst spikes.'
    ],
    commonMisunderstandings: [
      'On-hit does not mean every item activates on every hit.',
      'A strong on-hit item can feel weak if the survivor has poor hit uptime.',
      'Some effects care more about hit count than raw damage per hit.'
    ],
    tacticalUse: [
      'Use on-hit items to fix weak boss damage on rapid-fire survivors.',
      'Add chain or AoE on-hit items when your kit lacks crowd control.',
      'Protect your ability to keep firing; dead time lowers proc value.'
    ],
    quickTakeaway: 'On-hit items turn consistent contact into extra run scaling.'
  },
  {
    id: 'proc-chains',
    title: 'Proc Chains',
    shortDefinition: 'Proc chains happen when one triggered effect creates more damage events that can lead to more effects.',
    detailedExplanation:
      'Some item effects create follow-up hits, missiles, lightning, or explosions. Those follow-up events can add extra pressure and sometimes feed more item value. Proc chains are why a few good items can turn one target hit into screen-wide damage.',
    category: 'proc',
    importanceLevel: 'advanced',
    relatedItems: ['Ukulele', 'AtG Missile Mk. 1', 'Will-o-the-wisp', 'Ceremonial Dagger', 'Plasma Shrimp'],
    relatedSurvivors: ['Commando', 'MUL-T', 'Engineer', 'Acrid'],
    tags: ['chain', 'follow-up damage', 'screen clear', 'proc engine'],
    examples: [
      'Ukulele can spread damage from a single enemy into a nearby pack.',
      'AtG missiles can turn steady hits into burst windows.',
      'Kill-triggered effects become stronger once packs start dying together.'
    ],
    commonMisunderstandings: [
      'A proc chain is not guaranteed just because one item activates.',
      'Proc chains still need enough base hits or kills to start.',
      'Crowd clear and boss damage often need different chain pieces.'
    ],
    tacticalUse: [
      'Start chains with reliable hits, then add items that spread or finish damage.',
      'Pick chain damage when your survivor already handles single targets.',
      'Use proc chains to keep stage tempo when enemy density rises.'
    ],
    quickTakeaway: 'Proc chains convert one good hit into wider damage momentum.'
  },
  {
    id: 'attack-speed-scaling',
    title: 'Attack Speed Scaling',
    shortDefinition: 'Attack speed increases how often many skills fire, hit, and roll item effects.',
    detailedExplanation:
      'Attack speed often improves both damage uptime and proc opportunity count. It is especially valuable on survivors whose primary attacks are safe, accurate, and item-friendly. It matters less when cooldowns, charge times, reload rhythm, or positioning are the real bottleneck.',
    category: 'scaling',
    importanceLevel: 'important',
    relatedItems: ['Soldier\'s Syringe', 'Predatory Instincts', 'War Horn', 'Mochas'],
    relatedSurvivors: ['Commando', 'MUL-T', 'Huntress', 'Captain'],
    tags: ['attack speed', 'scaling', 'hit frequency', 'uptime'],
    examples: [
      'Commando gets more primary shots and more item checks.',
      'MUL-T can turn weapon uptime into heavy proc pressure.',
      'Burst survivors may still prefer damage or cooldown help first.'
    ],
    commonMisunderstandings: [
      'Attack speed is not equally valuable on every survivor.',
      'More firing does not help if you cannot safely maintain line of sight.',
      'Cooldown-limited skills may not scale cleanly with attack speed.'
    ],
    tacticalUse: [
      'Stack attack speed when your main damage button stays active often.',
      'Pair it with bleed, crit, missiles, or other on-hit effects.',
      'Balance it with movement so faster firing does not trap you in bad positions.'
    ],
    quickTakeaway: 'Attack speed is best when it creates more safe hits and proc rolls.'
  },
  {
    id: 'critical-chance',
    title: 'Critical Chance',
    shortDefinition: 'Critical chance gives attacks a chance to deal critical damage and unlock crit-based item value.',
    detailedExplanation:
      'Crit increases damage consistency and can activate or amplify items that care about critical hits. It is a simple scaling lane for many survivors because it improves both regular attacks and burst windows when you can keep landing hits.',
    category: 'damage',
    importanceLevel: 'important',
    relatedItems: ['Lens-Maker\'s Glasses', 'Predatory Instincts', 'Harvester\'s Scythe', 'Shatterspleen'],
    relatedSurvivors: ['Commando', 'Huntress', 'Bandit', 'Railgunner'],
    tags: ['crit', 'damage', 'scaling', 'burst'],
    examples: [
      'Lens-Maker\'s Glasses makes frequent attacks more threatening.',
      'Predatory Instincts rewards crit builds with more attack speed.',
      'Bandit can plan around guaranteed backstab crits.'
    ],
    commonMisunderstandings: [
      'Crit chance is not the same thing as raw damage every time.',
      'Crit items need enough hit uptime or burst accuracy to matter.',
      'Some survivors have special crit rules that change item priority.'
    ],
    tacticalUse: [
      'Use crit to smooth damage when your build already lands steady hits.',
      'Combine crit with attack speed and on-hit effects for scaling loops.',
      'Prioritize crit differently on survivors with built-in crit access.'
    ],
    quickTakeaway: 'Crit is a flexible damage lane that gets better with reliable hit uptime.'
  },
  {
    id: 'bleed-stacking',
    title: 'Bleed Stacking',
    shortDefinition: 'Bleed stacking adds repeated damage-over-time pressure from multiple bleed applications.',
    detailedExplanation:
      'Bleed rewards frequent applications. Rapid attacks can stack bleed quickly, giving strong boss and elite pressure even when each individual hit is modest. Bleed is less helpful when enemies die before the damage-over-time can pay off.',
    category: 'status',
    importanceLevel: 'important',
    relatedItems: ['Tri-Tip Dagger', 'Needletick', 'Shatterspleen'],
    relatedSurvivors: ['Commando', 'Bandit', 'MUL-T', 'Acrid'],
    tags: ['bleed', 'status', 'dot', 'boss damage', 'stacking'],
    examples: [
      'Commando can stack bleed through steady primary fire.',
      'Bandit can combine bleed pressure with burst finishers.',
      'Long boss fights give bleed more time to pay off.'
    ],
    commonMisunderstandings: [
      'Bleed is not instant burst.',
      'Bleed needs repeated applications to become a major damage source.',
      'Low uptime makes bleed items feel inconsistent.'
    ],
    tacticalUse: [
      'Pick bleed when your survivor can apply many hits to durable targets.',
      'Use bleed to improve boss damage without relying only on burst items.',
      'Add crowd clear separately if bleed is only helping single targets.'
    ],
    quickTakeaway: 'Bleed is sustained pressure for survivors that can keep applying hits.'
  },
  {
    id: 'aoe-chain-damage',
    title: 'AoE / Chain Damage',
    shortDefinition: 'AoE and chain damage spread pressure across groups instead of only damaging the first target.',
    detailedExplanation:
      'Area and chain effects solve enemy density. They prevent runs from stalling when small enemies, flying packs, or elites crowd the screen. These effects are often the missing piece for survivors with strong single-target kits.',
    category: 'damage',
    importanceLevel: 'important',
    relatedItems: ['Ukulele', 'Will-o-the-wisp', 'Gasoline', 'Brilliant Behemoth', 'Ceremonial Dagger'],
    relatedSurvivors: ['Commando', 'Huntress', 'Loader', 'Railgunner', 'Acrid'],
    tags: ['aoe', 'chain', 'crowd clear', 'splash', 'density'],
    examples: [
      'Ukulele jumps damage between nearby enemies.',
      'Gasoline helps early packs collapse after the first kill.',
      'Will-o-the-wisp turns kills into area explosions.'
    ],
    commonMisunderstandings: [
      'High boss damage does not automatically clear crowds.',
      'AoE still needs a hit or kill condition to start.',
      'Chain damage can underperform when enemies are too spread out.'
    ],
    tacticalUse: [
      'Add AoE when enemy packs are slowing stage tempo.',
      'Use chain damage to protect survivors with narrow primary attacks.',
      'Balance AoE with single-target damage before bosses become the wall.'
    ],
    quickTakeaway: 'AoE and chain damage keep enemy density from overwhelming the run.'
  },
  {
    id: 'single-target-damage',
    title: 'Single-Target Damage',
    shortDefinition: 'Single-target damage is focused pressure against bosses, elites, and priority threats.',
    detailedExplanation:
      'Single-target damage decides whether durable enemies leave the field quickly. It can come from raw damage, crit, bleed, missiles, bands, or survivor burst. It matters most when the run can clear crowds but bosses take too long.',
    category: 'damage',
    importanceLevel: 'basic',
    relatedItems: ['AtG Missile Mk. 1', 'Runald\'s Band', 'Kjaro\'s Band', 'Crowbar', 'Armor-Piercing Rounds'],
    relatedSurvivors: ['Railgunner', 'Loader', 'Bandit', 'Commando', 'Artificer'],
    tags: ['boss damage', 'elite damage', 'burst', 'priority target'],
    examples: [
      'Bands reward heavy hits with large burst damage.',
      'Crowbar improves first-hit damage against healthy targets.',
      'AtG missiles can add burst to survivors with steady hits.'
    ],
    commonMisunderstandings: [
      'Crowd clear items do not always fix boss damage.',
      'Raw burst can miss value if it lands on low-priority targets.',
      'Single-target plans still need survival and positioning support.'
    ],
    tacticalUse: [
      'Watch boss kill time as a signal for whether this lane is weak.',
      'Pair burst items with skills that can reliably trigger them.',
      'Use focused damage to remove elites before they control the fight.'
    ],
    quickTakeaway: 'Single-target damage keeps bosses and elites from becoming time sinks.'
  },
  {
    id: 'crowd-clear',
    title: 'Crowd Clear',
    shortDefinition: 'Crowd clear is your ability to remove groups quickly enough to keep moving and stay safe.',
    detailedExplanation:
      'Crowd clear is a run-planning requirement, not just a damage number. When density rises, weak clear forces you to kite longer, lose objective tempo, and expose yourself to more projectiles. Good clear can come from AoE skills, chain items, kill effects, or status spread.',
    category: 'run-planning',
    importanceLevel: 'basic',
    relatedItems: ['Gasoline', 'Ukulele', 'Will-o-the-wisp', 'Ceremonial Dagger', 'Brilliant Behemoth'],
    relatedSurvivors: ['Commando', 'Huntress', 'Railgunner', 'Mercenary', 'Acrid'],
    tags: ['crowd clear', 'tempo', 'aoe', 'chain', 'run planning'],
    examples: [
      'Commando often needs items to cover early group clear.',
      'Huntress can move well but still benefits from faster pack deletion.',
      'Railgunner needs ways to stop small enemies from stealing attention.'
    ],
    commonMisunderstandings: [
      'Surviving a crowd is not the same as clearing it efficiently.',
      'Boss damage does not solve swarms by itself.',
      'Mobility buys time but does not replace actual group damage forever.'
    ],
    tacticalUse: [
      'Treat slow pack kills as a build warning sign.',
      'Add chain or AoE items before enemy density controls the stage.',
      'Use crowd clear to preserve objective tempo and reduce incoming attacks.'
    ],
    quickTakeaway: 'Crowd clear protects your time, space, and stage tempo.'
  },
  {
    id: 'bazaar-halcyon-specks',
    title: 'Bazaar Halcyon Specks',
    shortDefinition:
      'The three shootable gold crystals in the Bazaar Between Time are Halcyon Specks that open the green portal route.',
    detailedExplanation:
      'In the Bazaar Between Time, three gold Halcyon Specks can appear as destructible crystals. Shoot all three before leaving the Bazaar to open a green portal. That portal sends the run onto the Path of the Colossus route tied to Seekers of the Storm and the False Son path. The normal blue portal continues the regular route, so use the green portal after breaking the specks if that is the goal.',
    category: 'run-planning',
    importanceLevel: 'important',
    relatedItems: [],
    relatedSurvivors: ['False Son', 'Seeker', 'CHEF'],
    tags: ['bazaar', 'halcyon specks', 'green portal', 'path of the colossus', 'false son', 'seekers of the storm'],
    examples: [
      'If you see three gold crystals in the Bazaar, shoot each one before using a portal.',
      'After the third crystal breaks, look for the green portal instead of defaulting to the blue portal.',
      'Use this route when you are intentionally chasing Path of the Colossus or False Son content.'
    ],
    commonMisunderstandings: [
      'They are not Lunar Seers; Lunar Seers are the paid stage-choice selectors.',
      'Breaking the crystals is only useful if you actually leave through the green portal.',
      'The blue portal does not keep you on the Path of the Colossus route.'
    ],
    tacticalUse: [
      'Check the Bazaar before spending coins or leaving if you are route hunting.',
      'Break all three crystals before interacting with your exit portal.',
      'Ignore them when your run plan is a normal Mithrix, loop, Void, or obliteration route.'
    ],
    quickTakeaway: 'Shoot all three Bazaar gold crystals, then take the green portal for the Path of the Colossus route.'
  },
  {
    id: 'chef-wok-recipe',
    title: 'CHEF Wok Recipe',
    shortDefinition:
      'Unlock CHEF by reaching the Reformed Altar and feeding the wok Bison Steak, Cautious Slug, and Infusion.',
    detailedExplanation:
      'CHEF is unlocked through the Order Up! challenge in Seekers of the Storm. Bring Bison Steak, Cautious Slug, and Infusion to the Reformed Altar on the Path of the Colossus route, then interact with the wok near the inactive CHEF. Artifact of Command makes this much easier because you can choose the exact items. If you cannot finish the recipe in one attempt, the ingredients you add to the wok can carry across runs.',
    category: 'run-planning',
    importanceLevel: 'important',
    relatedItems: ['Bison Steak', 'Cautious Slug', 'Infusion'],
    relatedSurvivors: ['CHEF'],
    tags: ['chef', 'unlock', 'order up', 'wok', 'recipe', 'reformed altar', 'path of the colossus', 'bison steak', 'cautious slug', 'infusion'],
    examples: [
      'Use Artifact of Command and pick Bison Steak, Cautious Slug, and Infusion before entering the route.',
      'Reach the Path of the Colossus through a green portal, then look for CHEF and the wok on Reformed Altar.',
      'Put each required item into the wok to complete the Order Up! unlock.'
    ],
    commonMisunderstandings: [
      'You do not craft CHEF from the item detail page; the recipe happens at the wok in Reformed Altar.',
      'The ingredients are specific item pickups, not item categories.',
      'The regular Bazaar exit route is not enough if you need the Path of the Colossus stages.'
    ],
    tacticalUse: [
      'Run Artifact of Command if you want the cleanest unlock route.',
      'Avoid losing the required ingredients to printers, scrappers, or other item conversion before the wok.',
      'Pair this with the Bazaar Halcyon Specks route if you are using the Bazaar green portal method.'
    ],
    quickTakeaway: 'Get Bison Steak, Cautious Slug, and Infusion, reach Reformed Altar, then feed all three to CHEF\'s wok.'
  }
];

export const mechanicCategories: CombatMechanicCategory[] = [
  'proc',
  'damage',
  'scaling',
  'status',
  'items',
  'survivor-tech',
  'run-planning'
];

export const mechanicImportanceLevels: CombatMechanicImportance[] = ['basic', 'important', 'advanced'];

export function findCombatMechanicById(id: string) {
  return combatMechanics.find((mechanic) => mechanic.id === id) ?? null;
}
