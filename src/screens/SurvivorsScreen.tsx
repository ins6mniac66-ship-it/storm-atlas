import { Ionicons } from '@expo/vector-icons';
import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { IconImage } from '../components/IconImage';
import { statDefinitions, statusEffectDefinitions, type StatDefinition } from '../data/combatGlossary';
import { combatMechanics, type CombatMechanic } from '../data/combatMechanics';
import { findItemByName, getItemIcon, type ItemRecord, type Rarity } from '../data/items';
import { getSkillExpansion, getSkillExpansionLabel, getSkillIcon, skills, type SkillRecord } from '../data/skills';
import { getSurvivorMobilityProfile, type SurvivorMobilityProfile } from '../data/survivorMobility';
import {
  getSurvivorGuide,
  resolveGuideItems,
  type SurvivorGuide,
  type SurvivorItemGuide,
  type SurvivorUnlockRoute
} from '../data/survivorGuides';
import {
  getSurvivorExpansionLabel,
  getSurvivorIcon,
  getSurvivorScope,
  survivors,
  type SurvivorRecord
} from '../data/survivors';
import { skillUnlockGuides as newSkillUnlockGuides, survivorUnlockGuides, type UnlockGuideEntry } from '../data/unlockGuides';
import { surfaceShadow } from '../styles';

const skillOrder = ['Passive', 'Primary', 'Secondary', 'Utility', 'Special'];
const loadoutRows = ['Primary', 'Secondary', 'Utility', 'Special', 'Skin'];
const guideRarityOrder: Rarity[] = ['Common', 'Uncommon', 'Legendary', 'Boss', 'Lunar', 'Void'];
type SurvivorPanel = 'overview' | 'guide' | 'unlocks' | 'stats' | 'skills' | 'loadout' | 'effects';

type SkinOption = {
  name: string;
  description: string;
  unlockNote: string;
};

type SurvivorTacticalProfile = {
  risks: string[];
  support: string[];
  notes: string[];
};

const skinOptions: SkinOption[] = [
  {
    name: 'Default',
    description: 'The survivor default appearance.',
    unlockNote: 'Requirement: available by default when the survivor is unlocked.'
  },
  {
    name: 'Mastery',
    description: 'The alternate mastery skin for this survivor.',
    unlockNote: 'Requirement: complete the survivor Mastery challenge, usually by beating the game or obliterating on Monsoon with that survivor.'
  }
];

const survivorTacticalProfiles: Record<string, SurvivorTacticalProfile> = {
  Commando: {
    risks: ['Weak AoE', 'Needs Proc Scaling', 'Limited Escape', 'Low Burst'],
    support: ['Attack Speed', 'Crit', 'Bleed', 'Chain Damage', 'Mobility', 'Commencement Prep'],
    notes: [
      'Base kit favors sustained single-target pressure over early crowd clearing.',
      'Relies heavily on proc chains, attack speed, and bleed scaling.',
      'Flying enemy groups become dangerous without AoE or chain damage support.'
    ]
  },
  Huntress: {
    risks: ['Low Health', 'Target Drift', 'Item-Dependent Burst'],
    support: ['Mobility', 'Crit', 'Crowbars', 'AoE', 'Cooldown Safety'],
    notes: [
      'Low base health rewards constant movement and clean spacing.',
      'Auto-targeting can delay priority focus when elites or bosses enter mixed groups.',
      'Damage curve improves sharply once burst and area support are online.'
    ]
  },
  Bandit: {
    risks: ['Positioning Risk', 'Reset Reliance', 'Burst Timing'],
    support: ['Backup Mags', 'Crit Setup', 'Bleed', 'Mobility', 'Execute Windows'],
    notes: [
      'Backstab value depends on controlled angles rather than direct front-line pressure.',
      'Cooldown resets reward planned kill sequencing during crowded fights.',
      'Reload rhythm and finisher timing determine boss uptime.'
    ]
  },
  'MUL-T': {
    risks: ['Large Hitbox', 'Mode Commitment', 'Build Drift'],
    support: ['Armor', 'Attack Speed', 'On-Hit', 'Equipment Support', 'Mobility', 'Commencement Prep'],
    notes: [
      'Large profile increases exposure during dense projectile patterns.',
      'Weapon and equipment choices should define a clear run plan early.',
      'Durability is strongest when paired with focused damage scaling.'
    ]
  },
  Engineer: {
    risks: ['Static Setup', 'Low Mobility', 'Turret Dependency'],
    support: ['Bustling Fungus', 'Defense', 'On-Hit', 'Area Control', 'Cooldowns', 'Commencement Prep'],
    notes: [
      'Turret placement controls most of the survivor damage floor.',
      'Low personal mobility makes pre-positioning more important than reaction speed.',
      'Item value should be evaluated through both Engineer and turret behavior.'
    ]
  },
  Artificer: {
    risks: ['Cooldown Windows', 'Grounded Mobility', 'Swarm Pressure'],
    support: ['Cooldowns', 'Crowbars', 'Bands', 'Freeze Control', 'Mobility', 'Pillar Skip'],
    notes: [
      'Burst windows are high value but expose downtime after missed casts.',
      'Grounded escape options are limited without mobility support.',
      'Freeze and burst timing stabilize crowded fights before enemies close distance.'
    ]
  },
  Mercenary: {
    risks: ['Melee Exposure', 'Execution Demand', 'Flying Targets'],
    support: ['Cooldowns', 'Mobility', 'Defense', 'Bands', 'AoE', 'Pillar Skip'],
    notes: [
      'Melee range increases exposure to elite auras and boss contact damage.',
      'Survivability depends on clean invulnerability timing and target routing.',
      'Flying or distant enemies can slow stage tempo without ranged item support.'
    ]
  },
  REX: {
    risks: ['Self-Damage', 'Healing Reliance', 'Rooted Windows'],
    support: ['Healing', 'Armor', 'Mobility', 'Crowd Control', 'Health Buffer'],
    notes: [
      'Self-damage skills require active health-state management.',
      'Healing and mitigation stabilize the kit more than raw damage stacking alone.',
      'Rooted setup windows should be used before enemy density peaks.'
    ]
  },
  Loader: {
    risks: ['Momentum Risk', 'Range Gaps', 'Overcommit Burst'],
    support: ['Bands', 'Crowbars', 'Mobility Control', 'Defense', 'AoE', 'Pillar Skip'],
    notes: [
      'High mobility creates strong engage options but can overshoot safe positions.',
      'Long-range and flying targets can reduce clear tempo.',
      'Burst planning matters when a punch does not immediately remove the threat.'
    ]
  },
  Acrid: {
    risks: ['Needs Finishers', 'Melee Exposure', 'Long Boss Fights'],
    support: ['Proc Chains', 'AoE', 'Mobility', 'Defense', 'Death Mark', 'Pillar Skip'],
    notes: [
      'Poison weakens targets but usually needs direct damage to secure kills.',
      'Melee skills should be treated as controlled entries, not default positioning.',
      'Boss pressure improves with proc chains and dedicated finisher damage.'
    ]
  },
  Captain: {
    risks: ['Low Mobility', 'Probe Restrictions', 'Beacon Commitment'],
    support: ['Movement Speed', 'Cooldowns', 'Defense', 'On-Hit', 'Boss Damage', 'Commencement Prep'],
    notes: [
      'No reliable mobility skill makes speed support a priority.',
      'Orbital probe value changes heavily by stage and interior space.',
      'Beacon placement should match the stage objective before pressure spikes.'
    ]
  },
  Railgunner: {
    risks: ['Scope Tunnel', 'Weak-Point Reliance', 'Crowd Pressure'],
    support: ['Crowbars', 'Bands', 'AoE', 'Mobility', 'Backup Control', 'Pillar Skip'],
    notes: [
      'Scope windows narrow awareness and require safe spacing before firing.',
      'Damage output depends on consistent weak-point accuracy.',
      'Crowds need piercing lanes, burst timing, or item-based area support.'
    ]
  },
  'Void Fiend': {
    risks: ['Corruption Timing', 'Healing Conflict', 'Mode Volatility'],
    support: ['Corruption Control', 'Mobility', 'Defense', 'Burst Windows', 'Healing Discipline'],
    notes: [
      'Corruption state changes alter the safe distance and pressure pattern.',
      'Healing choices can interfere with desired corruption timing.',
      'Run stability improves when aggressive windows are planned instead of forced.'
    ]
  },
  Seeker: {
    risks: ['Resource Tracking', 'Position Dependency', 'Mixed Role Timing'],
    support: ['Barrier', 'Healing', 'Cooldowns', 'Mobility', 'Team Utility'],
    notes: [
      'Resource rhythm adds an extra decision layer during combat pressure.',
      'Some value depends on staying near allies or enemies at the right moment.',
      'Skill identity should be read as healing, shielding, or burst before engagement.'
    ]
  },
  'False Son': {
    risks: ['Spike Economy', 'Commit Windows', 'Scaling Dependency'],
    support: ['Health', 'Armor', 'Cooldowns', 'Burst Damage', 'Mobility'],
    notes: [
      'Lunar spike resources should be treated as a combat budget.',
      'Large skill windows require planned entry and exit paths.',
      'Health and armor scaling stabilize longer fights.'
    ]
  },
  CHEF: {
    risks: ['Combo Sequencing', 'Boost Timing', 'Range Pressure'],
    support: ['Cooldowns', 'Ignite Support', 'Mobility', 'AoE', 'Defense'],
    notes: [
      'Combo order determines how much value each boosted skill returns.',
      'Boosted casts lose value when fired into empty space or poor timing.',
      'Shorter effective range requires stronger movement and spacing support.'
    ]
  },
  Drifter: {
    risks: ['Junk Economy', 'Object Handling', 'Resource Dry-Out'],
    support: ['Cooldowns', 'Mobility', 'Defense', 'Burst Setup', 'Crowd Control'],
    notes: [
      'Junk should be managed as a second resource, not spent on cooldown.',
      'Held-object decisions can split attention during pressure.',
      'Special casts need setup to avoid resource starvation.'
    ]
  },
  Operator: {
    risks: ['Drone Attention', 'Setup Damage', 'Pre-Planned Defense'],
    support: ['Drone Scaling', 'Cooldowns', 'Defense', 'Mobility', 'On-Hit'],
    notes: [
      'Drone commands add a parallel timing layer during active combat.',
      'Some damage requires setup before it becomes immediate pressure.',
      'Defensive tools are strongest when prepared before the dangerous hit lands.'
    ]
  },
  Heretic: {
    risks: ['Transformation Route', 'Health Drain', 'Kit Disruption'],
    support: ['Healing', 'Mobility', 'Cooldowns', 'Defense', 'Heresy Items'],
    notes: [
      'Heretic requires item-driven transformation rather than normal survivor selection.',
      'Health drain makes recovery and pacing part of baseline survival.',
      'Skill behavior differs sharply from standard survivor assumptions.'
    ]
  }
};

export function SurvivorsScreen({
  onOpenMechanic,
  onOpenItem
}: {
  onOpenMechanic?: (id: string) => void;
  onOpenItem: (item: ItemRecord) => void;
}) {
  const [selectedName, setSelectedName] = useState(survivors[0]?.name ?? '');
  const [contentScope, setContentScope] = useState<'base' | 'expansion'>('base');
  const [activePanel, setActivePanel] = useState<SurvivorPanel>('overview');
  const [selectedLoadoutSlot, setSelectedLoadoutSlot] = useState('Primary');

  const visibleSurvivors = useMemo(
    () => survivors.filter((survivor) => getSurvivorScope(survivor) === contentScope),
    [contentScope]
  );
  const selectedSurvivor =
    visibleSurvivors.find((survivor) => survivor.name === selectedName) ?? visibleSurvivors[0] ?? survivors[0];
  const selectedGuide = selectedSurvivor ? getSurvivorGuide(selectedSurvivor.name) : null;
  const survivorSkills = useMemo(
    () => skills.filter((skill) => skill.survivor === selectedSurvivor?.name),
    [selectedSurvivor?.name]
  );
  const groupedSkills = useMemo(() => groupSkillsByType(survivorSkills), [survivorSkills]);
  const hasUnlockGuides = selectedSurvivor
    ? Boolean(survivorUnlockGuides[selectedSurvivor.name]) || getSkillUnlockEntries(groupedSkills).length > 0
    : false;

  if (!selectedSurvivor) {
    return (
      <View style={screenStyles.empty}>
        <Text style={screenStyles.emptyTitle}>No survivor data found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={screenStyles.body} contentContainerStyle={screenStyles.content}>
      <View style={screenStyles.selectorPanel}>
        <View style={screenStyles.selectorHeader}>
          <Text style={screenStyles.panelLabel}>Survivor Select</Text>
          <Text style={screenStyles.selectorCount}>{visibleSurvivors.length} entries</Text>
        </View>
        <View style={screenStyles.scopeToggleRow}>
          <ScopeButton label="Base Game" active={contentScope === 'base'} onPress={() => setContentScope('base')} />
          <ScopeButton label="Expansions" active={contentScope === 'expansion'} onPress={() => setContentScope('expansion')} />
        </View>
        <View style={screenStyles.survivorGrid}>
          {visibleSurvivors.map((survivor) => (
            <SurvivorPortrait
              key={survivor.name}
              survivor={survivor}
              active={survivor.name === selectedSurvivor.name}
              onPress={() => {
                setSelectedName(survivor.name);
                if (activePanel === 'guide' && !getSurvivorGuide(survivor.name)) {
                  setActivePanel('overview');
                }
                if (activePanel === 'unlocks' && !hasUnlockContent(survivor.name)) {
                  setActivePanel('overview');
                }
              }}
            />
          ))}
        </View>
      </View>

      <View style={screenStyles.heroPanel}>
        <View style={screenStyles.heroTop}>
          <View style={screenStyles.heroPortrait}>
            <GameIcon
              source={getSurvivorIcon(selectedSurvivor)}
              label={selectedSurvivor.name}
              imageStyle={screenStyles.heroImage}
              fallbackStyle={screenStyles.heroFallback}
            />
          </View>
          <View style={screenStyles.heroCopy}>
            <Text style={screenStyles.survivorName}>{selectedSurvivor.name}</Text>
            <Text style={screenStyles.description}>{selectedSurvivor.description}</Text>
            <View style={screenStyles.metaRow}>
              <MetaPill icon="sparkles" label={getSurvivorExpansionLabel(selectedSurvivor)} />
              <MetaPill icon={selectedSurvivor.unlock ? 'lock-open' : 'checkmark-circle'} label={selectedSurvivor.unlock ? `Unlock: ${selectedSurvivor.unlock}` : 'Unlocked'} />
            </View>
          </View>
        </View>

        <View style={screenStyles.statsGrid}>
          {statDefinitions.map((definition) => (
            <StatCell
              key={definition.key}
              label={definition.shortLabel}
              value={getSurvivorStatValue(selectedSurvivor, definition)}
            />
          ))}
        </View>
      </View>

      <View style={screenStyles.tabStrip}>
        <PanelButton label="Overview" active={activePanel === 'overview'} onPress={() => setActivePanel('overview')} />
        <PanelButton label="Guide" active={activePanel === 'guide'} onPress={() => setActivePanel('guide')} disabled={!selectedGuide} />
        <PanelButton label="Unlocks" active={activePanel === 'unlocks'} onPress={() => setActivePanel('unlocks')} disabled={!hasUnlockGuides} />
        <PanelButton label="Stats" active={activePanel === 'stats'} onPress={() => setActivePanel('stats')} />
        <PanelButton label="Skills" active={activePanel === 'skills'} onPress={() => setActivePanel('skills')} />
        <PanelButton label="Loadout" active={activePanel === 'loadout'} onPress={() => setActivePanel('loadout')} />
        <PanelButton label="Effects" active={activePanel === 'effects'} onPress={() => setActivePanel('effects')} />
      </View>

      {activePanel === 'overview' ? (
        <OverviewPanel survivor={selectedSurvivor} skillsByType={groupedSkills} onOpenMechanic={onOpenMechanic} />
      ) : null}
      {activePanel === 'guide' ? (
        <GuidePanel guide={selectedGuide} survivorName={selectedSurvivor.name} onOpenItem={onOpenItem} />
      ) : null}
      {activePanel === 'unlocks' ? <UnlocksPanel survivor={selectedSurvivor} skillsByType={groupedSkills} /> : null}
      {activePanel === 'stats' ? <StatsPanel survivor={selectedSurvivor} /> : null}
      {activePanel === 'skills' ? <SkillsPanel skillsByType={groupedSkills} /> : null}
      {activePanel === 'loadout' ? (
        <LoadoutPanel
          skillsByType={groupedSkills}
          selectedSlot={selectedLoadoutSlot}
          onSelectedSlotChange={setSelectedLoadoutSlot}
        />
      ) : null}
      {activePanel === 'effects' ? <EffectsPanel /> : null}
    </ScrollView>
  );
}

function SurvivorPortrait({ survivor, active, onPress }: { survivor: SurvivorRecord; active: boolean; onPress: () => void }) {
  const icon = getSurvivorIcon(survivor);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={survivor.name}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[screenStyles.portraitButton, active && screenStyles.portraitButtonActive]}
    >
      <GameIcon
        source={icon}
        label={survivor.name}
        imageStyle={screenStyles.portraitImage}
        fallbackStyle={screenStyles.portraitFallback}
      />
    </Pressable>
  );
}

function OverviewPanel({
  survivor,
  skillsByType,
  onOpenMechanic
}: {
  survivor: SurvivorRecord;
  skillsByType: Record<string, SkillRecord[]>;
  onOpenMechanic?: (id: string) => void;
}) {
  const tacticalProfile = getSurvivorTacticalProfile(survivor.name);
  const mobilityProfile = getSurvivorMobilityProfile(survivor.name);
  const relatedMechanics = getRelatedMechanicsForSurvivor(survivor.name);
  const notes = [
    `${survivor.name} has ${Object.values(skillsByType).flat().length} documented skills across ${Object.keys(skillsByType).length} slots.`,
    survivor.unlock ? `Unlock route: ${survivor.unlock}.` : 'Available from the start.',
    survivor.expansion ? `Expansion content: ${getSurvivorExpansionLabel(survivor)}.` : 'Base-game survivor entry.'
  ];

  return (
    <View style={screenStyles.detailPanel}>
      <Text style={screenStyles.panelTitle}>Overview</Text>
      {notes.map((note) => (
        <View key={note} style={screenStyles.noteRow}>
          <Ionicons name="chevron-forward" size={16} color="#55b9ff" />
          <Text style={screenStyles.noteText}>{note}</Text>
        </View>
      ))}

      <View style={screenStyles.operationalPanel}>
        <Text style={screenStyles.operationalTitle}>Operational Risks</Text>
        <TacticalChipGroup label="Operational Risks" chips={tacticalProfile.risks} tone="risk" />
        <TacticalChipGroup label="Recommended Support" chips={tacticalProfile.support} tone="support" />
        {mobilityProfile ? <MobilityBrief profile={mobilityProfile} /> : null}
        {relatedMechanics.length > 0 ? (
          <MechanicChipGroup mechanics={relatedMechanics} onOpenMechanic={onOpenMechanic} />
        ) : null}
        <View style={screenStyles.fieldNotesPanel}>
          <Text style={screenStyles.fieldNotesTitle}>Field Notes</Text>
          {tacticalProfile.notes.map((note) => (
            <View key={note} style={screenStyles.fieldNoteRow}>
              <Ionicons name="radio" size={14} color="#55b9ff" />
              <Text style={screenStyles.fieldNoteText}>{note}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function MobilityBrief({ profile }: { profile: SurvivorMobilityProfile }) {
  return (
    <View style={screenStyles.mobilityPanel}>
      <View style={screenStyles.mobilityHeader}>
        <View>
          <Text style={screenStyles.tacticalGroupLabel}>Mobility Profile</Text>
          <Text style={screenStyles.mobilityTitle}>Rating {profile.rating} · Base {profile.baseMoveSpeed} m/s</Text>
        </View>
        <Text style={screenStyles.mobilityStatus}>{formatSourceStatus(profile.sourceStatus)}</Text>
      </View>
      <View style={screenStyles.tacticalChipRow}>
        {profile.tags.map((tag) => (
          <View key={tag} style={[screenStyles.tacticalChip, screenStyles.mobilityChip]}>
            <Text style={[screenStyles.tacticalChipText, screenStyles.mobilityChipText]}>{formatMobilityTag(tag)}</Text>
          </View>
        ))}
      </View>
      <Text style={screenStyles.mobilityText}>{profile.routeUse}</Text>
      <Text style={screenStyles.mobilityWeakness}>{profile.weakness}</Text>
    </View>
  );
}

function MechanicChipGroup({
  mechanics,
  onOpenMechanic
}: {
  mechanics: CombatMechanic[];
  onOpenMechanic?: (id: string) => void;
}) {
  return (
    <View style={screenStyles.tacticalGroup}>
      <Text style={screenStyles.tacticalGroupLabel}>Related Run Systems</Text>
      <View style={screenStyles.tacticalChipRow}>
        {mechanics.map((mechanic) => (
          <Pressable
            key={mechanic.id}
            accessibilityRole="button"
            onPress={() => onOpenMechanic?.(mechanic.id)}
            style={[screenStyles.tacticalChip, screenStyles.mechanicChip]}
          >
            <Text style={[screenStyles.tacticalChipText, screenStyles.mechanicChipText]}>{mechanic.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function TacticalChipGroup({
  label,
  chips,
  tone
}: {
  label: string;
  chips: string[];
  tone: 'risk' | 'support';
}) {
  return (
    <View style={screenStyles.tacticalGroup}>
      <Text style={screenStyles.tacticalGroupLabel}>{label}</Text>
      <View style={screenStyles.tacticalChipRow}>
        {chips.map((chip) => (
          <View key={chip} style={[screenStyles.tacticalChip, tone === 'support' && screenStyles.tacticalChipSupport]}>
            <Text style={[screenStyles.tacticalChipText, tone === 'support' && screenStyles.tacticalChipTextSupport]}>
              {chip}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SkillsPanel({ skillsByType }: { skillsByType: Record<string, SkillRecord[]> }) {
  return (
    <View style={screenStyles.detailPanel}>
      <Text style={screenStyles.panelTitle}>Skills</Text>
      {orderedSkillTypes(skillsByType).map((type) => (
        <View key={type} style={screenStyles.skillGroup}>
          <Text style={screenStyles.skillGroupTitle}>{type}</Text>
          {(skillsByType[type] ?? []).map((skill, index) => (
            <SkillCard key={`${skill.type}-${skill.name}`} skill={skill} unlockNote={getSkillUnlockNote(skill, index)} />
          ))}
        </View>
      ))}
    </View>
  );
}

function UnlocksPanel({
  survivor,
  skillsByType
}: {
  survivor: SurvivorRecord;
  skillsByType: Record<string, SkillRecord[]>;
}) {
  const survivorUnlock = survivorUnlockGuides[survivor.name];
  const skillUnlocks = getSkillUnlockEntries(skillsByType);
  const unlockTabs = [
    ...(survivorUnlock ? [{ id: 'survivor', label: survivor.name, type: 'survivor' as const }] : []),
    ...skillUnlocks.map(({ skill }) => ({
      id: `${skill.survivor}|${skill.name}`,
      label: skill.name,
      type: 'skill' as const
    }))
  ];
  const [selectedUnlockId, setSelectedUnlockId] = useState(unlockTabs[0]?.id ?? '');
  const activeUnlockId = unlockTabs.some((tab) => tab.id === selectedUnlockId) ? selectedUnlockId : unlockTabs[0]?.id;
  const selectedSkillUnlock = skillUnlocks.find(({ skill }) => `${skill.survivor}|${skill.name}` === activeUnlockId);

  return (
    <View style={screenStyles.detailPanel}>
      <Text style={screenStyles.panelTitle}>{survivor.name} Unlock Guides</Text>
      <Text style={screenStyles.unlocksIntro}>
        Full unlock routes for this survivor and their alternate abilities.
      </Text>

      {unlockTabs.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={screenStyles.unlockTabStrip}>
          {unlockTabs.map((tab) => {
            const active = tab.id === activeUnlockId;
            return (
              <Pressable
                key={tab.id}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                onPress={() => setSelectedUnlockId(tab.id)}
                style={[screenStyles.unlockTab, active && screenStyles.unlockTabActive]}
              >
                <Text style={[screenStyles.unlockTabKicker, active && screenStyles.unlockTabKickerActive]}>
                  {tab.type === 'survivor' ? 'Survivor' : 'Ability'}
                </Text>
                <Text numberOfLines={1} style={[screenStyles.unlockTabText, active && screenStyles.unlockTabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}

      {survivorUnlock && activeUnlockId === 'survivor' ? (
        <View style={screenStyles.fullUnlockCard}>
          <View style={screenStyles.fullUnlockHeader}>
            <Ionicons name="lock-open" size={18} color="#f3d65f" />
            <View style={screenStyles.fullUnlockHeaderCopy}>
              <Text style={screenStyles.fullUnlockTitle}>Survivor Unlock</Text>
              <Text style={screenStyles.fullUnlockName}>{survivorUnlock.achievementName}</Text>
            </View>
          </View>
          <Text style={screenStyles.fullUnlockRequirement}>Requirement: {survivorUnlock.requirementText}</Text>
          <GuideStepList steps={survivorUnlock.guideSteps} accentColor="#f3d65f" />
        </View>
      ) : null}

      {selectedSkillUnlock ? (
        <SkillUnlockGuideCard
          key={`${selectedSkillUnlock.skill.survivor}|${selectedSkillUnlock.skill.name}`}
          skill={selectedSkillUnlock.skill}
          entry={selectedSkillUnlock.entry}
        />
      ) : null}

      {!survivorUnlock && skillUnlocks.length === 0 ? (
        <Text style={screenStyles.definitionNote}>No unlock guides are written for {survivor.name} yet.</Text>
      ) : null}
    </View>
  );
}

function SkillUnlockGuideCard({ skill, entry }: { skill: SkillRecord; entry: UnlockGuideEntry }) {
  if (skill.survivor === 'Huntress' && skill.name === 'Flurry') {
    return <FlurryMissionBrief entry={entry} />;
  }

  if (skill.survivor === 'Huntress' && skill.name === 'Phase Blink') {
    return <PhaseBlinkMissionBrief entry={entry} />;
  }

  if (skill.survivor === 'Huntress' && skill.name === 'Ballista') {
    return <BallistaMissionBrief entry={entry} />;
  }

  if (skill.survivor === 'Commando') {
    return <CommandoMissionBrief skillName={skill.name} entry={entry} />;
  }

  if (baseMissionSurvivors.includes(skill.survivor)) {
    return <BaseSurvivorMissionBrief skill={skill} entry={entry} />;
  }

  return (
    <View style={screenStyles.fullUnlockCard}>
      <View style={screenStyles.fullUnlockHeader}>
        <View style={screenStyles.unlockSkillIconFrame}>
          <GameIcon
            source={getSkillIcon(skill)}
            label={skill.name}
            imageStyle={screenStyles.unlockSkillIcon}
            fallbackStyle={screenStyles.skillFallback}
          />
        </View>
        <View style={screenStyles.fullUnlockHeaderCopy}>
          <Text style={screenStyles.fullUnlockTitle}>{skill.type} Unlock</Text>
          <Text style={screenStyles.fullUnlockName}>{skill.name}</Text>
          <Text style={screenStyles.fullUnlockChallenge}>{entry.challengeName}</Text>
        </View>
      </View>
      <Text style={screenStyles.fullUnlockRequirement}>Requirement: {entry.requirementText}</Text>
      <GuideStepList steps={entry.guideSteps} accentColor="#55b9ff" />
    </View>
  );
}

type MissionItemTarget = {
  name: string;
  target: string;
  role: string;
  summary: string;
  detail: string;
};

const ballistaCoreItems: MissionItemTarget[] = [
  {
    name: 'Topaz Brooch',
    target: 'x4-6',
    role: 'Barrier',
    summary: 'Best item for this challenge.',
    detail: 'Barrier protects actual health, which is exactly what Piercing Wind checks. Stop around x8 unless the run gives more naturally.'
  },
  {
    name: 'Tougher Times',
    target: 'x5-7',
    role: 'Block',
    summary: 'Protects against random chip damage.',
    detail: 'Blocks stray projectiles and accidental hits. Around x10 is a strong upper target if Command makes it easy.'
  },
  {
    name: "Paul's Goat Hoof",
    target: 'x3-6',
    role: 'Speed',
    summary: 'Makes Huntress harder to hit.',
    detail: 'Movement is prevention. Faster rotations and wider kiting lines reduce the number of hits you need to dodge.'
  },
  {
    name: 'Energy Drink',
    target: 'x2-5',
    role: 'Sprint Speed',
    summary: 'Strong because Huntress fights while moving.',
    detail: 'Sprint speed keeps safe distance during teleporter pressure and helps break projectile lines before they connect.'
  },
  {
    name: 'Hopoo Feather',
    target: 'x2-3',
    role: 'Air Control',
    summary: 'Helps dodge projectiles and bad terrain.',
    detail: 'Extra jumps make Rallypoint sightlines and Scorched Acres vertical terrain much safer.'
  }
];

const flurryCoreItems: MissionItemTarget[] = [
  {
    name: 'Crowbar',
    target: 'x2-4',
    role: 'Burst',
    summary: 'Helps Laser Glaive kill fresh enemies.',
    detail: 'Crowbars help the glaive secure kills before the bounce chain loses value. Do not overbuild so hard that the first hit ruins the setup.'
  },
  {
    name: 'Backup Magazine',
    target: 'x1-3',
    role: 'Retry Tool',
    summary: 'More Laser Glaive attempts.',
    detail: 'Extra glaive charges make failed setups less costly and let you try again without waiting on the secondary cooldown.'
  },
  {
    name: "Paul's Goat Hoof",
    target: 'x2-4',
    role: 'Spacing',
    summary: 'Keeps Huntress safe while arranging a pack.',
    detail: 'Movement lets you kite enemies into a clean group without taking unnecessary hits or panic-firing into the setup.'
  },
  {
    name: 'Energy Drink',
    target: 'x1-3',
    role: 'Sprint Control',
    summary: 'Helps kite without breaking the setup.',
    detail: 'Sprint speed gives enough room to stop attacking and let the glaive resolve cleanly.'
  },
  {
    name: 'Tougher Times',
    target: 'x2-5',
    role: 'Safety',
    summary: 'Blocks mistakes while waiting for the right pack.',
    detail: 'This is not required for the unlock condition, but it helps keep the attempt stable while enemies group up.'
  }
];

const phaseBlinkCoreItems: MissionItemTarget[] = [
  {
    name: 'Crowbar',
    target: 'x12',
    role: 'Requirement',
    summary: 'Carry 12 at the same time.',
    detail: 'Do not scrap, print, or trade Crowbars away before the unlock triggers. The challenge checks current inventory.'
  },
  {
    name: 'Topaz Brooch',
    target: 'x1-3',
    role: 'Safety',
    summary: 'Adds barrier while whites are locked into Crowbars.',
    detail: 'Barrier keeps the run stable while most white item choices are committed to the unlock requirement.'
  },
  {
    name: "Paul's Goat Hoof",
    target: 'x2-4',
    role: 'Speed',
    summary: 'Keeps routing fast and safe.',
    detail: 'Move quickly between white item sources, shops, and printers without letting enemy pressure pin you down.'
  },
  {
    name: 'Energy Drink',
    target: 'x1-3',
    role: 'Sprint Speed',
    summary: 'Helps Huntress kite while stacking Crowbars.',
    detail: 'Sprint speed is a low-maintenance survival layer while the build is narrow.'
  },
  {
    name: 'Hopoo Feather',
    target: 'x1-2',
    role: 'Escape',
    summary: 'Adds vertical safety.',
    detail: 'Extra jumps help compensate for spending so many item picks on Crowbars instead of normal defense.'
  }
];

type CommandoUnlockBrief = {
  title: string;
  reward: string;
  routeRows: Array<[string, string]>;
  loadout: Array<[string, string, string]>;
  winSteps: string[];
  items: MissionItemTarget[];
  equipment: Array<[string, string]>;
  failStates: string[];
  bestSetup: Array<[string, string]>;
};

const commandoUnlockBriefs: Record<string, CommandoUnlockBrief> = {
  'Phase Blast': {
    title: 'PHASE BLAST',
    reward: 'Secondary upgrade • two close-range blasts • 8x200% total damage',
    routeRows: [
      ['Difficulty', 'Drizzle'],
      ['Main Goal', 'Find an Overloading Worm'],
      ['Best Method', 'Loop until Worm boss spawns'],
      ['Main Rule', 'Commando must land the final hit.'],
      ['Key Warning', 'Drones and proc chains can steal it.']
    ],
    loadout: [
      ['Primary', 'Double Tap', 'Controlled chip damage'],
      ['Secondary', 'Phase Round', 'Final-hit tool'],
      ['Utility', 'Tactical Dive', 'Keep spacing'],
      ['Special', 'Suppressive Fire', 'Backup finisher']
    ],
    winSteps: [
      'Start Drizzle as Commando.',
      'Loop until Worms can spawn.',
      'Avoid buying drones late.',
      'Clear nearby enemies first.',
      'Lower the Worm carefully.',
      'Fire the final Commando hit.'
    ],
    items: [
      {
        name: "Paul's Goat Hoof",
        target: 'x3-6',
        role: 'Spacing',
        summary: 'Keeps you close without getting trapped.',
        detail: 'Overloading Worm fights are messy. Speed lets Commando chase segments, dodge lightning, and line up the final shot.'
      },
      {
        name: 'Energy Drink',
        target: 'x2-4',
        role: 'Sprint Speed',
        summary: 'Improves Worm tracking.',
        detail: 'Sprint speed helps you reposition between Worm dives while keeping the final-hit setup under control.'
      },
      {
        name: 'Tougher Times',
        target: 'x3-7',
        role: 'Safety',
        summary: 'Blocks stray burst damage.',
        detail: 'The route can run long, so block chance protects the attempt while you wait for the right boss spawn.'
      },
      {
        name: 'AtG Missile Mk. 1',
        target: 'x1-2',
        role: 'Boss Damage',
        summary: 'Speeds up the Worm fight.',
        detail: 'A small amount of proc damage helps shorten the boss. Stop before uncontrolled missiles become final-hit stealers.'
      },
      {
        name: 'Lens-Maker\'s Glasses',
        target: 'x5-10',
        role: 'Burst',
        summary: 'Makes Commando shots matter.',
        detail: 'Crit helps the controlled final-hit window because the damage still comes from Commando attacks.'
      },
      {
        name: 'Topaz Brooch',
        target: 'x2-5',
        role: 'Barrier',
        summary: 'Keeps the long route stable.',
        detail: 'Barrier protects against adds and elite chip damage while you wait for the Overloading Worm opportunity.'
      }
    ],
    equipment: [
      ['Best', 'Trophy Hunter\'s Tricorn if it can force the Worm reward window'],
      ['Backup', 'Royal Capacitor for controlled boss burst'],
      ['Avoid', 'Disposable Missile Launcher near the final hit']
    ],
    failStates: ['Drone final hit', 'Ally final hit', 'Burn tick kill', 'Missile proc kill', 'On-kill cleanup', 'Killing the wrong Worm type'],
    bestSetup: [
      ['Difficulty', 'Drizzle'],
      ['Route', 'Loop until Overloading Worm appears'],
      ['Skills', 'Default kit until Phase Blast unlocks'],
      ['Items', 'Movement, defense, light boss damage'],
      ['Equipment', 'Royal Capacitor or no damage equipment at final hit']
    ]
  },
  'Tactical Slide': {
    title: 'TACTICAL SLIDE',
    reward: 'Utility upgrade • ground slide • fire while sliding',
    routeRows: [
      ['Difficulty', 'Drizzle'],
      ['Main Goal', 'Full teleporter charge before 5:00'],
      ['Best Method', 'Rush teleporter immediately'],
      ['Main Rule', 'Stay in the zone.'],
      ['Key Warning', 'Starting before 5:00 is not enough.']
    ],
    loadout: [
      ['Primary', 'Double Tap', 'Steady early damage'],
      ['Secondary', 'Phase Round', 'Boss burst'],
      ['Utility', 'Tactical Dive', 'Route speed'],
      ['Special', 'Suppressive Fire', 'Boss control']
    ],
    winSteps: [
      'Start Drizzle.',
      'Look for the teleporter first.',
      'Take only path chests.',
      'Activate immediately.',
      'Stay in the charge zone.',
      'Finish charge before 5:00.'
    ],
    items: [
      {
        name: "Paul's Goat Hoof",
        target: 'x1-3',
        role: 'Routing',
        summary: 'Gets you to the teleporter faster.',
        detail: 'Speed is the best pickup if it appears directly on your route. Do not detour far for it.'
      },
      {
        name: 'Energy Drink',
        target: 'x1-2',
        role: 'Sprint Speed',
        summary: 'Improves first-stage pathing.',
        detail: 'Sprint speed shortens the search and helps reposition inside the teleporter zone.'
      },
      {
        name: 'Soldier\'s Syringe',
        target: 'x1-3',
        role: 'DPS',
        summary: 'Raises early boss damage.',
        detail: 'Attack speed makes Double Tap and Suppressive Fire clean up the first boss faster.'
      },
      {
        name: 'Lens-Maker\'s Glasses',
        target: 'x1-5',
        role: 'Burst',
        summary: 'Speeds up the boss if found early.',
        detail: 'Take crit from quick chests or multishops, but do not delay the teleporter hunt for a perfect build.'
      },
      {
        name: 'Sticky Bomb',
        target: 'x1-3',
        role: 'Burst',
        summary: 'Cheap early damage boost.',
        detail: 'Commando hits often enough to trigger Sticky Bomb during the first teleporter fight.'
      }
    ],
    equipment: [
      ['Best', 'Preon Accumulator if Rallypoint timed chest route is not needed here'],
      ['Backup', 'Royal Capacitor for instant boss damage'],
      ['Avoid', 'Radar Scanner if it delays teleporter activation']
    ],
    failStates: ['Looting too long', 'Leaving charge zone', 'Boss kited out of zone', 'Teleporter finishes after 5:00', 'Searching every chest', 'Starting on a hard layout'],
    bestSetup: [
      ['Difficulty', 'Drizzle'],
      ['Route', 'Teleporter first, loot second'],
      ['Skills', 'Default Commando kit'],
      ['Items', 'One speed item plus quick damage'],
      ['Equipment', 'Royal Capacitor or Preon if found immediately']
    ]
  },
  'Frag Grenade': {
    title: 'FRAG GRENADE',
    reward: 'Special upgrade • 700% grenade • stores 2 charges',
    routeRows: [
      ['Difficulty', 'Drizzle'],
      ['Main Goal', 'Clear 20 stages'],
      ['Best Method', 'Loop safely and avoid Lunar pickups'],
      ['Main Rule', 'No Lunar items or Lunar equipment.'],
      ['Key Warning', 'Lunar Coins are safe; pickups are not.']
    ],
    loadout: [
      ['Primary', 'Double Tap', 'Proc engine'],
      ['Secondary', 'Phase Blast / Phase Round', 'Close burst or pierce'],
      ['Utility', 'Tactical Slide if unlocked', 'Mobile firing'],
      ['Special', 'Suppressive Fire', 'Until grenade unlocks']
    ],
    winSteps: [
      'Start Drizzle.',
      'Never take Lunar pickups.',
      'Build proc damage.',
      'Add movement and healing.',
      'Loop instead of ending.',
      'Clear Stage 20 clean.'
    ],
    items: [
      {
        name: 'Soldier\'s Syringe',
        target: 'x5-10',
        role: 'Proc Rate',
        summary: 'Turns Commando into a stronger proc engine.',
        detail: 'Attack speed keeps damage scaling through a long 20-stage run.'
      },
      {
        name: 'Tri-Tip Dagger',
        target: 'x5-10',
        role: 'Bleed',
        summary: 'Adds reliable single-target scaling.',
        detail: 'Bleed helps Commando handle bosses and elites without needing Lunar damage sources.'
      },
      {
        name: 'Ukulele',
        target: 'x1-3',
        role: 'AoE',
        summary: 'Fixes Commando crowd pressure.',
        detail: 'Chain lightning covers Commando\'s weak area damage across repeated loops.'
      },
      {
        name: 'AtG Missile Mk. 1',
        target: 'x2-5',
        role: 'Boss Damage',
        summary: 'Scales well with frequent hits.',
        detail: 'Missiles give late-run burst without creating Lunar contamination risk.'
      },
      {
        name: 'Harvester\'s Scythe',
        target: 'x1-3',
        role: 'Sustain',
        summary: 'Converts crit into healing.',
        detail: 'Long-run safety matters more than speed once the route reaches later loops.'
      },
      {
        name: 'Hopoo Feather',
        target: 'x2-4',
        role: 'Mobility',
        summary: 'Adds vertical escape.',
        detail: 'Extra jumps help with late-stage projectile density, terrain mistakes, and Mithrix-route detours you choose to skip.'
      },
      {
        name: 'Tougher Times',
        target: 'x5-10',
        role: 'Defense',
        summary: 'Protects the long attempt.',
        detail: 'Block chance is valuable because a 20-stage route gives many chances for a random mistake.'
      }
    ],
    equipment: [
      ['Best', 'Royal Capacitor for clean elite and boss burst'],
      ['Backup', 'Disposable Missile Launcher for ranged cleanup'],
      ['Avoid', 'All Lunar equipment']
    ],
    failStates: ['Picking Lunar item', 'Picking Lunar equipment', 'Blind Bazaar shopping', 'Gesture of the Drowned', 'Shaped Glass', 'Ending before Stage 20', 'Assuming Lunar Coins fail it'],
    bestSetup: [
      ['Difficulty', 'Drizzle'],
      ['Route', 'Loop to Stage 20'],
      ['Skills', 'Best unlocked Commando mobility and burst'],
      ['Items', 'Proc damage, AoE, sustain, defense'],
      ['Equipment', 'Non-Lunar burst equipment only']
    ]
  }
};

const baseMissionSurvivors = ['Bandit', 'MUL-T', 'Engineer', 'Artificer', 'Mercenary', 'REX', 'Loader', 'Acrid', 'Captain'];

const survivorItemPlans: Record<string, MissionItemTarget[]> = {
  Bandit: [
    {
      name: 'Backup Magazine',
      target: 'x2-4',
      role: 'Skill Access',
      summary: 'More secondary attempts.',
      detail: 'Extra dagger charges make Hemorrhage setup and controlled kill windows easier to repeat.'
    },
    {
      name: 'Crowbar',
      target: 'x2-5',
      role: 'Burst',
      summary: 'Improves planned finishers.',
      detail: 'Bandit wants clean, intentional burst when the unlock depends on a specific kill source.'
    },
    {
      name: 'Lens-Maker\'s Glasses',
      target: 'x5-10',
      role: 'Crit',
      summary: 'Pairs with backstab and burst damage.',
      detail: 'Crit scaling helps Bandit finish priority targets without needing uncontrolled item chains.'
    },
    {
      name: "Paul's Goat Hoof",
      target: 'x3-6',
      role: 'Positioning',
      summary: 'Makes backstab angles safer.',
      detail: 'Speed lets Bandit set up rear hits, disengage, and reset the fight before the unlock window.'
    },
    {
      name: 'Tougher Times',
      target: 'x3-7',
      role: 'Safety',
      summary: 'Protects risky close-range setups.',
      detail: 'Block chance helps while you hold damage and wait for the exact finishing moment.'
    }
  ],
  'MUL-T': [
    {
      name: "Paul's Goat Hoof",
      target: 'x3-6',
      role: 'Routing',
      summary: 'Helps a heavy survivor keep pace.',
      detail: 'MUL-T unlock routes often care about staying in a zone, reaching a timed chest, or beating a stage clock.'
    },
    {
      name: 'Energy Drink',
      target: 'x2-5',
      role: 'Speed',
      summary: 'Improves stage timing.',
      detail: 'Sprint speed keeps the run under timed requirements and makes teleporter positioning less clumsy.'
    },
    {
      name: 'Armor-Piercing Rounds',
      target: 'x2-5',
      role: 'Boss Damage',
      summary: 'Shortens teleporter boss windows.',
      detail: 'Several MUL-T unlocks revolve around killing specific bosses under controlled conditions.'
    },
    {
      name: 'Soldier\'s Syringe',
      target: 'x3-7',
      role: 'DPS',
      summary: 'Smooths primary damage output.',
      detail: 'Attack speed helps Auto-Nailgun and other primary choices convert uptime into faster boss kills.'
    },
    {
      name: 'Hopoo Feather',
      target: 'x1-3',
      role: 'Mobility',
      summary: 'Fixes awkward terrain.',
      detail: 'Extra jumps help a large survivor stay inside teleporter zones and reach key routing points.'
    }
  ],
  Engineer: [
    {
      name: 'Bustling Fungus',
      target: 'x3-7',
      role: 'Turret Sustain',
      summary: 'Keeps turret setups alive.',
      detail: 'Stationary turret plans benefit heavily from Fungus healing fields during boss and minion setups.'
    },
    {
      name: 'Backup Magazine',
      target: 'x2-5',
      role: 'Mine Setup',
      summary: 'Adds more setup tools.',
      detail: 'Extra secondary charges improve mine stacking and controlled burst attempts.'
    },
    {
      name: 'Armor-Piercing Rounds',
      target: 'x3-7',
      role: 'Boss Burst',
      summary: 'Boosts teleporter boss damage.',
      detail: 'Engineer unlocks often hinge on deleting or controlling the teleporter boss cleanly.'
    },
    {
      name: 'Queen\'s Gland',
      target: 'x1',
      role: 'Minion Count',
      summary: 'Adds a durable ally.',
      detail: 'This is especially useful for routes that count active minions alongside drones and turrets.'
    },
    {
      name: 'Tougher Times',
      target: 'x4-8',
      role: 'Defense',
      summary: 'Protects stationary play.',
      detail: 'Block chance reduces random chip while you stand near a prepared turret or mine setup.'
    }
  ],
  Artificer: [
    {
      name: 'Crowbar',
      target: 'x3-7',
      role: 'Burst',
      summary: 'Amplifies opening hits.',
      detail: 'Artificer unlocks often want a large damage window or a fast multi-kill.'
    },
    {
      name: 'Backup Magazine',
      target: 'x2-5',
      role: 'Secondary Charges',
      summary: 'More Nano-Bomb or Nano-Spear attempts.',
      detail: 'Extra charges make aerial kills, burst windows, and pack clears easier to line up.'
    },
    {
      name: 'Hopoo Feather',
      target: 'x2-4',
      role: 'Air Time',
      summary: 'Supports airborne objectives.',
      detail: 'Extra jumps pair with ENV Suit and Ion Surge routes that require staying off the ground.'
    },
    {
      name: 'Armor-Piercing Rounds',
      target: 'x2-5',
      role: 'Boss Damage',
      summary: 'Improves one-window boss kills.',
      detail: 'Boss-focused damage helps Chunked-style burst attempts finish inside the required window.'
    },
    {
      name: "Paul's Goat Hoof",
      target: 'x2-5',
      role: 'Kiting',
      summary: 'Helps gather packs safely.',
      detail: 'Speed lets Artificer group enemies for multi-kills without getting pinned.'
    }
  ],
  Mercenary: [
    {
      name: 'Backup Magazine',
      target: 'x2-5',
      role: 'Air Control',
      summary: 'More secondary mobility.',
      detail: 'Extra Whirlwind or Rising Thunder charges help maintain altitude and recover from bad spacing.'
    },
    {
      name: 'Hopoo Feather',
      target: 'x2-4',
      role: 'Air Time',
      summary: 'Extends aerial routes.',
      detail: 'Extra jumps are core support for Demon of the Skies and safer Prismatic Trial movement.'
    },
    {
      name: 'Tougher Times',
      target: 'x5-10',
      role: 'Safety',
      summary: 'Protects close-range mistakes.',
      detail: 'Melee routes create many contact-risk moments, and block chance keeps attempts alive.'
    },
    {
      name: 'Harvester\'s Scythe',
      target: 'x1-3',
      role: 'Sustain',
      summary: 'Rewards crit in melee fights.',
      detail: 'Healing support matters for normal runs, though no-hit objectives still need prevention first.'
    },
    {
      name: 'Lens-Maker\'s Glasses',
      target: 'x5-10',
      role: 'Damage',
      summary: 'Makes short punish windows count.',
      detail: 'Crit boosts Mercenary damage when invulnerability and dash timing create brief attack openings.'
    }
  ],
  REX: [
    {
      name: 'Medkit',
      target: 'x2-5',
      role: 'Recovery',
      summary: 'Offsets self-damage.',
      detail: 'REX unlock routing often plays around health thresholds, so delayed healing gives room to stabilize.'
    },
    {
      name: 'Cautious Slug',
      target: 'x2-5',
      role: 'Recovery',
      summary: 'Good before the final threshold setup.',
      detail: 'Slug is strong for the run, but avoid letting it heal you above the required health threshold at the end.'
    },
    {
      name: 'Tougher Times',
      target: 'x4-8',
      role: 'Defense',
      summary: 'Blocks accidental hits.',
      detail: 'Block chance makes low-health teleporter charging less likely to collapse.'
    },
    {
      name: "Paul's Goat Hoof",
      target: 'x2-5',
      role: 'Spacing',
      summary: 'Keeps threshold play safer.',
      detail: 'Movement lets REX stay in the teleporter zone while avoiding hits that would kill the attempt.'
    },
    {
      name: 'Topaz Brooch',
      target: 'x2-5',
      role: 'Barrier',
      summary: 'Adds protection without overhealing.',
      detail: 'Barrier can protect a low-health setup while preserving the health threshold.'
    }
  ],
  Loader: [
    {
      name: 'Crowbar',
      target: 'x5-10',
      role: 'Punch Burst',
      summary: 'Best single-hit damage support.',
      detail: 'Loader unlocks often ask for speed or a single huge hit; Crowbar makes that hit decisive.'
    },
    {
      name: 'Armor-Piercing Rounds',
      target: 'x3-7',
      role: 'Boss Damage',
      summary: 'Boosts teleporter boss punches.',
      detail: 'Boss damage is ideal for House of the Dying Sun and any route that ends in a boss burst.'
    },
    {
      name: 'Focus Crystal',
      target: 'x3-7',
      role: 'Melee Damage',
      summary: 'Amplifies close-range impact.',
      detail: 'Loader naturally fights close, so Focus Crystal supports punch-based unlock attempts.'
    },
    {
      name: "Paul's Goat Hoof",
      target: 'x2-5',
      role: 'Speed',
      summary: 'Improves route timing.',
      detail: 'Speed stacks with Loader movement to make timed portal routes far more forgiving.'
    },
    {
      name: 'Hopoo Feather',
      target: 'x1-3',
      role: 'Recovery',
      summary: 'Adds air correction.',
      detail: 'Extra jumps help recover from missed grapples or bad momentum during fast routing.'
    }
  ],
  Acrid: [
    {
      name: 'Backup Magazine',
      target: 'x2-5',
      role: 'Poison Access',
      summary: 'More secondary applications.',
      detail: 'Extra Neurotoxin or bite windows help spread poison and clean low-health enemies.'
    },
    {
      name: 'Gasoline',
      target: 'x1-3',
      role: 'Cleanup',
      summary: 'Turns kills into pack damage.',
      detail: 'Use with care: it helps cumulative poison routes, but can steal specific killing blows.'
    },
    {
      name: 'Ukulele',
      target: 'x1-3',
      role: 'Spread',
      summary: 'Improves pack pressure.',
      detail: 'Chain damage helps clear enemies after poison has reduced them.'
    },
    {
      name: 'Tri-Tip Dagger',
      target: 'x5-10',
      role: 'Bleed',
      summary: 'Adds true killing pressure.',
      detail: 'Poison alone cannot kill, so bleed gives Acrid a way to finish softened targets faster.'
    },
    {
      name: 'Tougher Times',
      target: 'x4-8',
      role: 'Safety',
      summary: 'Protects melee cleanup.',
      detail: 'Block chance helps when Acrid dives into a pack to finish poisoned enemies.'
    }
  ],
  Captain: [
    {
      name: 'Armor-Piercing Rounds',
      target: 'x3-7',
      role: 'Boss Damage',
      summary: 'Helps controlled boss finishers.',
      detail: 'Captain beacon unlocks often require lowering a boss into an exact finishing window.'
    },
    {
      name: 'Crowbar',
      target: 'x2-6',
      role: 'Burst',
      summary: 'Makes the first hit stronger.',
      detail: 'Use burst carefully so the planned beacon or drone interaction still gets the unlock credit.'
    },
    {
      name: "Paul's Goat Hoof",
      target: 'x3-6',
      role: 'Routing',
      summary: 'Improves large-map searches.',
      detail: 'Speed helps find Rallypoint drone spawns, teleporter bosses, and clean beacon positions.'
    },
    {
      name: 'Energy Drink',
      target: 'x2-5',
      role: 'Sprint Speed',
      summary: 'Shortens search time.',
      detail: 'Captain has no natural mobility skill, so sprint speed is a practical route fixer.'
    },
    {
      name: 'Tougher Times',
      target: 'x4-8',
      role: 'Safety',
      summary: 'Protects setup windows.',
      detail: 'Block chance keeps Captain alive while saving damage or gold for the unlock interaction.'
    }
  ]
};

const survivorDefaultLoadouts: Record<string, Array<[string, string, string]>> = {
  Bandit: [
    ['Primary', 'Burst', 'Controlled damage'],
    ['Secondary', 'Serrated Dagger', 'Bleed setup'],
    ['Utility', 'Smoke Bomb', 'Reposition'],
    ['Special', 'Lights Out', 'Finisher reset']
  ],
  'MUL-T': [
    ['Primary', 'Auto-Nailgun', 'Sustained DPS'],
    ['Alt Primary', 'Rebar Puncher', 'Controlled burst'],
    ['Utility', 'Transport Mode', 'Zone control'],
    ['Special', 'Retool', 'Equipment routing']
  ],
  Engineer: [
    ['Primary', 'Bouncing Grenades', 'Safe poke'],
    ['Secondary', 'Pressure Mines', 'Setup burst'],
    ['Utility', 'Bubble Shield', 'Hold ground'],
    ['Special', 'Gauss Turrets', 'Stable damage']
  ],
  Artificer: [
    ['Primary', 'Flame Bolt', 'Steady ranged damage'],
    ['Secondary', 'Nano-Bomb', 'Burst setup'],
    ['Utility', 'Snapfreeze', 'Control'],
    ['Special', 'Flamethrower', 'Close burst']
  ],
  Mercenary: [
    ['Primary', 'Laser Sword', 'Melee uptime'],
    ['Secondary', 'Whirlwind', 'Air control'],
    ['Utility', 'Blinding Assault', 'Dash reset'],
    ['Special', 'Eviscerate', 'Invuln window']
  ],
  REX: [
    ['Primary', 'DIRECTIVE: Inject', 'Self-sustain'],
    ['Secondary', 'Seed Barrage', 'Health trade'],
    ['Utility', 'DIRECTIVE: Disperse', 'Spacing'],
    ['Special', 'Tangling Growth', 'Control']
  ],
  Loader: [
    ['Primary', 'Knuckleboom', 'Close burst'],
    ['Secondary', 'Grapple Fist', 'Momentum'],
    ['Utility', 'Charged Gauntlet', 'Punch finisher'],
    ['Special', 'M551 Pylon', 'Area support']
  ],
  Acrid: [
    ['Primary', 'Vicious Wounds', 'Melee cleanup'],
    ['Secondary', 'Neurotoxin', 'Poison spread'],
    ['Utility', 'Caustic Leap', 'Engage/escape'],
    ['Special', 'Epidemic', 'Pack poison']
  ],
  Captain: [
    ['Primary', 'Vulcan Shotgun', 'Controlled damage'],
    ['Secondary', 'Power Tazer', 'Lock target'],
    ['Utility', 'Orbital Probe', 'Burst support'],
    ['Special', 'Supply Beacon', 'Unlock tool']
  ]
};

function BaseSurvivorMissionBrief({ skill, entry }: { skill: SkillRecord; entry: UnlockGuideEntry }) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const requirement = entry.requirementText;
  const routeRows = buildBaseRouteRows(skill, entry);
  const failStates = buildBaseFailStates(entry);
  const items = survivorItemPlans[skill.survivor] ?? survivorItemPlans.Bandit ?? [];
  const loadout = survivorDefaultLoadouts[skill.survivor] ?? [
    ['Primary', 'Default primary', 'Consistent damage'],
    ['Secondary', 'Default secondary', 'Unlock setup'],
    ['Utility', 'Default utility', 'Survival'],
    ['Special', 'Default special', 'Finish condition']
  ];

  return (
    <View style={screenStyles.missionStack}>
      <MissionHero
        title={skill.name.toUpperCase()}
        subtitle={entry.challengeName}
        text={requirement}
        reward={`${skill.type} unlock • ${skill.name}`}
      />
      <MissionInfoCard label="FASTEST UNLOCK ROUTE" rows={routeRows} />
      <MissionLoadoutGrid entries={loadout} />
      <View style={screenStyles.missionCard}>
        <Text style={screenStyles.missionSectionTitle}>HOW YOU WIN</Text>
        <GuideStepList accentColor="#55b9ff" steps={entry.guideSteps.slice(0, 6)} />
      </View>
      <MissionItemTargets items={items} expandedItem={expandedItem} onExpandedItemChange={setExpandedItem} />
      <View style={screenStyles.missionCard}>
        <Text style={screenStyles.missionSectionTitle}>EQUIPMENT PICK</Text>
        <MissionRows rows={buildBaseEquipmentRows(skill, entry)} />
      </View>
      <MissionDanger labels={failStates} />
      <MissionBestSetup rows={buildBaseBestSetup(skill, entry)} />
      <MissionAdvanced open={advancedOpen} onToggle={() => setAdvancedOpen(!advancedOpen)} steps={entry.guideSteps} />
    </View>
  );
}

function buildBaseRouteRows(skill: SkillRecord, entry: UnlockGuideEntry): Array<[string, string]> {
  const text = `${entry.challengeName} ${entry.requirementText}`.toLowerCase();
  const difficulty = text.includes('monsoon') ? 'Monsoon' : text.includes('prismatic') ? 'Current Trial' : 'Drizzle';
  const method = text.includes('25 minutes') || text.includes('under 25') ? 'Speed route' : text.includes('teleporter') ? 'Teleporter setup' : text.includes('final boss') || text.includes('mithrix') ? 'Final boss setup' : 'Controlled unlock run';
  const warning = text.includes('killing blow') || text.includes('lights out') || text.includes('beacon') ? 'Final hit source matters.' : text.includes('100% health') ? 'Prevent real health damage.' : text.includes('under 50%') ? 'Hold the health threshold.' : 'Do not rush the setup.';

  return [
    ['Difficulty', difficulty],
    ['Main Goal', entry.requirementText],
    ['Best Method', method],
    ['Main Rule', warning],
    ['Reward', `${skill.type}: ${skill.name}`]
  ];
}

function buildBaseEquipmentRows(skill: SkillRecord, entry: UnlockGuideEntry): Array<[string, string]> {
  const text = `${skill.survivor} ${entry.challengeName} ${entry.requirementText}`.toLowerCase();
  if (text.includes('preon')) {
    return [
      ['Best', 'Preon Accumulator'],
      ['Backup', 'Radar Scanner to find equipment sources'],
      ['Avoid', 'Spending Preon before the final hit']
    ];
  }
  if (text.includes('beacon') || text.includes('tc-280')) {
    return [
      ['Best', 'Captain Supply Beacon'],
      ['Backup', 'Radar Scanner for routing'],
      ['Avoid', 'Damage equipment that steals the planned kill']
    ];
  }
  if (text.includes('20 enemies') || text.includes('15 enemies') || text.includes('multi-kill')) {
    return [
      ['Best', 'Primordial Cube'],
      ['Backup', 'Disposable Missile Launcher'],
      ['Avoid', 'Using equipment before the pack is grouped']
    ];
  }
  if (text.includes('25 minutes') || text.includes('stage 7')) {
    return [
      ['Best', 'Radar Scanner'],
      ['Backup', 'Royal Capacitor for fast bosses'],
      ['Avoid', 'Equipment routes that slow stage exits']
    ];
  }
  return [
    ['Best', 'Royal Capacitor for controlled burst'],
    ['Backup', 'Disposable Missile Launcher for cleanup'],
    ['Avoid', 'Automatic damage near exact final-hit checks']
  ];
}

function buildBaseFailStates(entry: UnlockGuideEntry) {
  const text = `${entry.challengeName} ${entry.requirementText}`.toLowerCase();
  const labels = ['Over-looting', 'Bad target setup', 'Uncontrolled proc damage'];
  if (text.includes('killing blow') || text.includes('lights out') || text.includes('beacon')) labels.push('Wrong final hit', 'Drones stealing kill');
  if (text.includes('teleporter')) labels.push('Leaving required zone', 'Messy teleporter start');
  if (text.includes('25 minutes') || text.includes('under 25')) labels.push('Full-clearing stages', 'Slow boss fights');
  if (text.includes('100% health')) labels.push('Real health damage', 'Fall damage', 'Burn ticks');
  if (text.includes('under 50%')) labels.push('Healing above threshold', 'Dying while low');
  if (text.includes('monsoon')) labels.push('Weak defense', 'Late-stage greed');
  if (text.includes('prismatic')) labels.push('Unscouted trial seed', 'Shield misunderstanding');
  return [...new Set(labels)].slice(0, 8);
}

function buildBaseBestSetup(skill: SkillRecord, entry: UnlockGuideEntry): Array<[string, string]> {
  return [
    ['Survivor', skill.survivor],
    ['Unlock', entry.challengeName],
    ['Reward Skill', skill.name],
    ['Core Plan', entry.guideSteps[0] ?? entry.requirementText],
    ['Item Focus', 'Mobility, controlled damage, and survivor-specific safety']
  ];
}

function CommandoMissionBrief({ skillName, entry }: { skillName: string; entry: UnlockGuideEntry }) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const brief = commandoUnlockBriefs[skillName];

  if (!brief) {
    return (
      <View style={screenStyles.fullUnlockCard}>
        <Text style={screenStyles.fullUnlockRequirement}>Requirement: {entry.requirementText}</Text>
        <GuideStepList steps={entry.guideSteps} accentColor="#55b9ff" />
      </View>
    );
  }

  return (
    <View style={screenStyles.missionStack}>
      <MissionHero title={brief.title} subtitle={entry.challengeName} text={entry.requirementText} reward={brief.reward} />
      <MissionInfoCard label="FASTEST UNLOCK ROUTE" rows={brief.routeRows} />
      <MissionLoadoutGrid entries={brief.loadout} />
      <View style={screenStyles.missionCard}>
        <Text style={screenStyles.missionSectionTitle}>HOW YOU WIN</Text>
        <GuideStepList accentColor="#55b9ff" steps={brief.winSteps} />
      </View>
      <MissionItemTargets items={brief.items} expandedItem={expandedItem} onExpandedItemChange={setExpandedItem} />
      <View style={screenStyles.missionCard}>
        <Text style={screenStyles.missionSectionTitle}>EQUIPMENT PICK</Text>
        <MissionRows rows={brief.equipment} />
      </View>
      <MissionDanger labels={brief.failStates} />
      <MissionBestSetup rows={brief.bestSetup} />
      <MissionAdvanced open={advancedOpen} onToggle={() => setAdvancedOpen(!advancedOpen)} steps={entry.guideSteps} />
    </View>
  );
}

function FlurryMissionBrief({ entry }: { entry: UnlockGuideEntry }) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <View style={screenStyles.missionStack}>
      <MissionHero
        title="FLURRY"
        subtitle={entry.challengeName}
        text="Land a killing blow with every possible hit of a single Laser Glaive."
        reward="Primary upgrade • 3 seeking arrows • crits fire 6 arrows"
      />
      <MissionInfoCard
        label="FASTEST UNLOCK ROUTE"
        rows={[
          ['Difficulty', 'Drizzle'],
          ['Goal', 'Set up 7 weak enemies'],
          ['Best Targets', 'Beetles / Wisps / Lemurians'],
          ['Main Rule', 'One Laser Glaive must get every kill.']
        ]}
      />
      <MissionLoadoutGrid
        entries={[
          ['Primary', 'Strafe', 'Controlled damage'],
          ['Secondary', 'Laser Glaive', 'Required skill'],
          ['Utility', 'Blink / Phase Blink', 'Safe repositioning'],
          ['Special', 'Arrow Rain', 'Use carefully']
        ]}
      />
      <View style={screenStyles.missionCard}>
        <Text style={screenStyles.missionSectionTitle}>HOW YOU WIN</Text>
        <GuideStepList
          accentColor="#55b9ff"
          steps={[
            'Find a small weak enemy pack.',
            'Stop using random damage effects.',
            'Weaken enemies with Strafe.',
            'Let them group naturally.',
            'Throw one Laser Glaive.',
            'Do not attack until it finishes.'
          ]}
        />
      </View>
      <MissionItemTargets items={flurryCoreItems} expandedItem={expandedItem} onExpandedItemChange={setExpandedItem} />
      <View style={screenStyles.missionCard}>
        <Text style={screenStyles.missionSectionTitle}>EQUIPMENT PICK</Text>
        <MissionRows
          rows={[
            ['Primordial Cube', 'Groups enemies without stealing kills'],
            ['Backup Picks', 'Radar Scanner / Eccentric Vase'],
            ['Avoid', 'Royal Capacitor, Preon, Missile Launcher, Forgive Me Please']
          ]}
        />
        <Text style={screenStyles.missionItemText}>
          Do not use damage equipment during the glaive attempt. The killing blows must come from Laser Glaive.
        </Text>
      </View>
      <MissionDanger labels={['Gasoline', "Will-o'-the-wisp", 'Ukulele', 'Drones', 'Turrets', 'Damage equipment', 'Continuing to shoot', 'Enemy pack too small']} />
      <MissionBestSetup
        rows={[
          ['Enemy Pack', '7 weak enemies'],
          ['Best Enemy Types', 'Beetles / Wisps / Lemurians'],
          ['Best Stage Timing', 'Early run'],
          ['Best Item Plan', 'Crowbar x2-4, Backup Magazine x1-3, movement, no on-kill damage']
        ]}
      />
      <MissionAdvanced open={advancedOpen} onToggle={() => setAdvancedOpen(!advancedOpen)} steps={entry.guideSteps} />
    </View>
  );
}

function PhaseBlinkMissionBrief({ entry }: { entry: UnlockGuideEntry }) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <View style={screenStyles.missionStack}>
      <MissionHero
        title="PHASE BLINK"
        subtitle={entry.challengeName}
        text="Collect and carry 12 Crowbars at once as Huntress."
        reward="Utility upgrade • 3 short blink charges • safer repositioning"
      />
      <MissionInfoCard
        label="FASTEST UNLOCK ROUTE"
        rows={[
          ['Difficulty', 'Drizzle'],
          ['Best Method', 'Artifact of Command'],
          ['Goal', 'Choose Crowbar from white drops'],
          ['Main Rule', 'Hold 12 Crowbars at once.']
        ]}
      />
      <MissionLoadoutGrid
        entries={[
          ['Primary', 'Strafe', 'Reliable targeting'],
          ['Secondary', 'Laser Glaive', 'Crowd clear'],
          ['Utility', 'Blink', 'Default movement'],
          ['Special', 'Arrow Rain', 'Crowd control']
        ]}
      />
      <View style={screenStyles.missionCard}>
        <Text style={screenStyles.missionSectionTitle}>HOW YOU WIN</Text>
        <GuideStepList
          accentColor="#55b9ff"
          steps={[
            'Start Huntress on Drizzle.',
            'Use Artifact of Command if available.',
            'Pick Crowbar from white items.',
            'Keep every Crowbar.',
            'Reach 12 Crowbars carried.',
            'Stop forcing Crowbars after unlock.'
          ]}
        />
      </View>
      <MissionItemTargets items={phaseBlinkCoreItems} expandedItem={expandedItem} onExpandedItemChange={setExpandedItem} />
      <View style={screenStyles.missionCard}>
        <Text style={screenStyles.missionSectionTitle}>EQUIPMENT PICK</Text>
        <MissionRows
          rows={[
            ['Radar Scanner', 'Finds chests, shops, and printers faster'],
            ['Backup Picks', 'Royal Capacitor / Disposable Missile Launcher / Primordial Cube'],
            ['Avoid', 'Equipment that slows routing']
          ]}
        />
      </View>
      <View style={screenStyles.missionCard}>
        <Text style={screenStyles.missionSectionTitle}>ALT ROUTES</Text>
        <MissionBullets title="Command Route" bullets={['Pick Crowbar from every white command essence.']} />
        <MissionBullets title="Printer Route" bullets={['Find a Crowbar 3D Printer and feed low-value white items.']} />
        <MissionBullets title="Shrine of Order Route" bullets={['Possible, but risky and random.']} />
      </View>
      <MissionDanger labels={['Scrapping Crowbars', 'Using a printer that consumes Crowbars', 'Trading white items blindly', 'Leaving Crowbar multishops behind', 'Rushing teleporter too early', 'Forgetting current Crowbar count']} />
      <MissionBestSetup
        rows={[
          ['Difficulty', 'Drizzle'],
          ['Artifact', 'Command'],
          ['White Item Plan', 'Crowbar x12'],
          ['Green Support', "Hopoo Feather, Wax Quail, Harvester's Scythe, Predatory Instincts"],
          ['Equipment', 'Radar Scanner']
        ]}
      />
      <MissionAdvanced open={advancedOpen} onToggle={() => setAdvancedOpen(!advancedOpen)} steps={entry.guideSteps} />
    </View>
  );
}

function MissionHero({ title, subtitle, text, reward }: { title: string; subtitle: string; text: string; reward: string }) {
  return (
    <View style={screenStyles.missionHeroCard}>
      <Text style={screenStyles.missionEyebrow}>MISSION FILE</Text>
      <Text style={screenStyles.missionHeroTitle}>{title}</Text>
      <Text style={screenStyles.missionHeroSub}>{subtitle}</Text>
      <Text style={screenStyles.missionHeroText}>{text}</Text>
      <View style={screenStyles.missionRewardBox}>
        <Text style={screenStyles.missionRewardLabel}>Reward</Text>
        <Text style={screenStyles.missionRewardText}>{reward}</Text>
      </View>
    </View>
  );
}

function MissionLoadoutGrid({ entries }: { entries: Array<[string, string, string]> }) {
  return (
    <View style={screenStyles.missionCard}>
      <Text style={screenStyles.missionSectionTitle}>LOADOUT CONFIG</Text>
      <View style={screenStyles.loadoutBriefGrid}>
        {entries.map(([slot, name, note]) => (
          <LoadoutBrief key={`${slot}-${name}`} slot={slot} name={name} note={note} />
        ))}
      </View>
    </View>
  );
}

function MissionItemTargets({
  items,
  expandedItem,
  onExpandedItemChange
}: {
  items: MissionItemTarget[];
  expandedItem: string | null;
  onExpandedItemChange: (item: string | null) => void;
}) {
  return (
    <View style={screenStyles.missionCard}>
      <Text style={screenStyles.missionSectionTitle}>SUPPLY PRIORITY</Text>
      <View style={screenStyles.itemTargetList}>
        {items.map((item) => (
          <MissionItemCard
            key={item.name}
            item={item}
            expanded={expandedItem === item.name}
            onPress={() => onExpandedItemChange(expandedItem === item.name ? null : item.name)}
          />
        ))}
      </View>
    </View>
  );
}

function MissionDanger({ labels }: { labels: string[] }) {
  return (
    <View style={[screenStyles.missionCard, screenStyles.dangerCard]}>
      <Text style={screenStyles.dangerTitle}>FAIL STATES</Text>
      <Text style={screenStyles.dangerSubtitle}>Avoid these before the unlock:</Text>
      <PlainChipGrid labels={labels} />
    </View>
  );
}

function MissionBestSetup({ rows }: { rows: Array<[string, string]> }) {
  return <MissionInfoCard label="BEST SETUP" rows={rows} />;
}

function MissionRows({ rows }: { rows: Array<[string, string]> }) {
  return (
    <>
      {rows.map(([key, value]) => (
        <View key={key} style={screenStyles.missionInfoRow}>
          <Text style={screenStyles.missionInfoKey}>{key}</Text>
          <Text style={screenStyles.missionInfoValue}>{value}</Text>
        </View>
      ))}
    </>
  );
}

function MissionAdvanced({ open, onToggle, steps }: { open: boolean; onToggle: () => void; steps: string[] }) {
  return (
    <View style={screenStyles.missionCard}>
      <Pressable accessibilityRole="button" onPress={onToggle} style={screenStyles.advancedToggle}>
        <Text style={screenStyles.missionSectionTitle}>FIELD NOTES</Text>
        <Ionicons name={open ? 'chevron-up-circle' : 'chevron-down-circle'} size={18} color="#55b9ff" />
      </Pressable>
      {open ? <GuideStepList accentColor="#55b9ff" steps={steps} /> : null}
    </View>
  );
}

function BallistaMissionBrief({ entry }: { entry: UnlockGuideEntry }) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<'rallypoint' | 'scorched'>('rallypoint');
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <View style={screenStyles.missionStack}>
      <View style={screenStyles.missionHeroCard}>
        <Text style={screenStyles.missionEyebrow}>MISSION FILE</Text>
        <Text style={screenStyles.missionHeroTitle}>BALLISTA</Text>
        <Text style={screenStyles.missionHeroSub}>{entry.challengeName}</Text>
        <Text style={screenStyles.missionHeroText}>
          Start and finish Rallypoint Delta or Scorched Acres without falling below 100% health.
        </Text>
        <View style={screenStyles.missionRewardBox}>
          <Text style={screenStyles.missionRewardLabel}>Reward</Text>
          <Text style={screenStyles.missionRewardText}>3 high-damage shots • 900% each • strong boss burst</Text>
        </View>
        <View style={screenStyles.missionJumpRow}>
          {['Quick Route', 'Item Plan', 'Threats'].map((label) => (
            <View key={label} style={screenStyles.missionJumpChip}>
              <Text style={screenStyles.missionJumpText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <MissionInfoCard
        label="FASTEST UNLOCK ROUTE"
        rows={[
          ['Difficulty', 'Drizzle'],
          ['Goal', 'Reach Stage 3 safely'],
          ['Target Stages', 'Rallypoint Delta / Scorched Acres'],
          ['Main Rule', 'Do not let real health drop below full.']
        ]}
      />

      <View style={screenStyles.missionCard}>
        <Text style={screenStyles.missionSectionTitle}>LOADOUT CONFIG</Text>
        <View style={screenStyles.loadoutBriefGrid}>
          <LoadoutBrief slot="Primary" name="Strafe" note="Reliable targeting" />
          <LoadoutBrief slot="Secondary" name="Laser Glaive" note="Clears flyers" />
          <LoadoutBrief slot="Utility" name="Phase Blink" note="3 escape charges" />
          <LoadoutBrief slot="Special" name="Arrow Rain" note="Crowd control" />
        </View>
      </View>

      <View style={screenStyles.missionCard}>
        <Text style={screenStyles.missionSectionTitle}>HOW YOU WIN</Text>
        <GuideStepList
          accentColor="#55b9ff"
          steps={[
            'Build mobility before Stage 3.',
            'Stack barrier and block items.',
            'Enter Rallypoint Delta or Scorched Acres.',
            'Avoid all real health damage.',
            'Finish the teleporter.',
            'Leave the stage safely.'
          ]}
        />
      </View>

      <View style={screenStyles.missionCard}>
        <Text style={screenStyles.missionSectionTitle}>SUPPLY PRIORITY</Text>
        <View style={screenStyles.itemTargetList}>
          {ballistaCoreItems.map((item) => (
            <MissionItemCard
              key={item.name}
              item={item}
              expanded={expandedItem === item.name}
              onPress={() => setExpandedItem(expandedItem === item.name ? null : item.name)}
            />
          ))}
        </View>
      </View>

      <View style={[screenStyles.missionCard, screenStyles.dangerCard]}>
        <Text style={screenStyles.dangerTitle}>FAIL STATES</Text>
        <Text style={screenStyles.dangerSubtitle}>Avoid these on Stage 3:</Text>
        <PlainChipGrid
          labels={[
            'Shrine of Blood',
            'Void Cradles',
            'Fall damage',
            'Fire elite burn',
            'Explosive barrels',
            'Greedy looting',
            'Standing still'
          ]}
        />
      </View>

      <View style={screenStyles.missionCard}>
        <Text style={screenStyles.missionSectionTitle}>ENVIRONMENT SCAN</Text>
        <View style={screenStyles.mapTabRow}>
          <MapTab label="Rallypoint Delta" active={selectedMap === 'rallypoint'} onPress={() => setSelectedMap('rallypoint')} />
          <MapTab label="Scorched Acres" active={selectedMap === 'scorched'} onPress={() => setSelectedMap('scorched')} />
        </View>
        {selectedMap === 'rallypoint' ? (
          <MapBrief
            threats={['Blind Pests', 'Wisps', 'Brass Contraptions', 'Solus Probes']}
            safePlay={['Use containers and terrain.', 'Break line of sight.', 'Clear flyers before teleporter.']}
          />
        ) : (
          <MapBrief
            threats={['Fire elites', 'Elder Lemurians', 'Vertical gaps', 'Tight terrain']}
            safePlay={['Avoid blind blinks.', 'Fight in open space.', 'Do not kite near cliffs.']}
          />
        )}
      </View>

      <View style={screenStyles.missionCard}>
        <Text style={screenStyles.missionSectionTitle}>TELEPORTER PROTOCOL</Text>
        <MissionBullets
          title="Before starting"
          bullets={['Clear ranged enemies.', 'Find cover.', 'Plan escape routes.']}
        />
        <MissionBullets
          title="During event"
          bullets={['Do not greed the charge.', 'Leave the zone if needed.', 'Survival beats speed.']}
        />
      </View>

      <View style={screenStyles.missionCard}>
        <Text style={screenStyles.missionSectionTitle}>PRIORITY STACKS</Text>
        <PriorityGroup title="Core Defense" rows={[['Topaz Brooch', 'x4-6'], ['Tougher Times', 'x5-7'], ['Repulsion Plate', 'x2-3']]} />
        <PriorityGroup title="Mobility" rows={[['Goat Hoof', 'x3-6'], ['Energy Drink', 'x2-5'], ['Hopoo Feather', 'x2-3'], ['Wax Quail', 'x1-2']]} />
        <PriorityGroup title="Damage" rows={[['Ukulele', 'x1'], ['AtG Missile', 'x1-3'], ['Lens Glasses', 'x5+'], ['Backup Magazine', 'x2-3']]} />
      </View>

      <View style={screenStyles.missionCard}>
        <Pressable accessibilityRole="button" onPress={() => setAdvancedOpen(!advancedOpen)} style={screenStyles.advancedToggle}>
          <Text style={screenStyles.missionSectionTitle}>FIELD NOTES</Text>
          <Ionicons name={advancedOpen ? 'chevron-up-circle' : 'chevron-down-circle'} size={18} color="#55b9ff" />
        </Pressable>
        {advancedOpen ? (
          <GuideStepList
            accentColor="#55b9ff"
            steps={[
              'Healing does not save the run because the unlock fails the moment real health drops below full.',
              'Barrier is better than healing because it can absorb hits before actual health is touched.',
              'Strafe is safer than Flurry for the attempt because it gives reliable targeting without needing crit setup.',
              'Phase Blink is preferred because three short charges give more panic escapes than one long Blink.',
              'Tougher Times block values scale well: roughly 1 stack is 15%, 3 is 33%, 5 is 43%, and 10 is 60%.',
              'The stage is not safe after the teleporter boss dies. Keep playing carefully until the stage transition completes.'
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}

function MissionInfoCard({ label, rows }: { label: string; rows: Array<[string, string]> }) {
  return (
    <View style={screenStyles.missionCard}>
      <Text style={screenStyles.missionSectionTitle}>{label}</Text>
      {rows.map(([key, value]) => (
        <View key={key} style={screenStyles.missionInfoRow}>
          <Text style={screenStyles.missionInfoKey}>{key}</Text>
          <Text style={screenStyles.missionInfoValue}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

function LoadoutBrief({ slot, name, note }: { slot: string; name: string; note: string }) {
  return (
    <View style={screenStyles.loadoutBriefCard}>
      <Text style={screenStyles.loadoutBriefSlot}>{slot}</Text>
      <Text style={screenStyles.loadoutBriefName}>{name}</Text>
      <Text style={screenStyles.loadoutBriefNote}>{note}</Text>
    </View>
  );
}

function MissionItemCard({ item, expanded, onPress }: { item: MissionItemTarget; expanded: boolean; onPress: () => void }) {
  const catalogItem = findItemByName(item.name);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={screenStyles.missionItemCard}>
      <View style={screenStyles.missionItemTop}>
        {catalogItem ? <IconImage source={getItemIcon(catalogItem)} size={34} label={catalogItem.name} /> : null}
        <View style={screenStyles.missionItemCopy}>
          <Text style={screenStyles.missionItemName}>{item.name}</Text>
          <Text style={screenStyles.missionItemMeta}>Target: {item.target} • Role: {item.role}</Text>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color="#55b9ff" />
      </View>
      {expanded ? (
        <View style={screenStyles.missionItemDetail}>
          <Text style={screenStyles.missionItemSummary}>{item.summary}</Text>
          <Text style={screenStyles.missionItemText}>{item.detail}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

function MapTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[screenStyles.mapTab, active && screenStyles.mapTabActive]}>
      <Text style={[screenStyles.mapTabText, active && screenStyles.mapTabTextActive]}>{label}</Text>
    </Pressable>
  );
}

function MapBrief({ threats, safePlay }: { threats: string[]; safePlay: string[] }) {
  return (
    <View style={screenStyles.mapBriefGrid}>
      <MissionBullets title="Main Threats" bullets={threats} />
      <MissionBullets title="Safe Play" bullets={safePlay} />
    </View>
  );
}

function MissionBullets({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <View style={screenStyles.missionBulletBlock}>
      <Text style={screenStyles.missionBulletTitle}>{title}</Text>
      {bullets.map((bullet) => (
        <View key={bullet} style={screenStyles.missionBulletRow}>
          <Ionicons name="chevron-forward" size={13} color="#55b9ff" />
          <Text style={screenStyles.missionBulletText}>{bullet}</Text>
        </View>
      ))}
    </View>
  );
}

function PriorityGroup({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <View style={screenStyles.priorityGroup}>
      <Text style={screenStyles.priorityTitle}>{title}</Text>
      {rows.map(([name, count]) => (
        <View key={name} style={screenStyles.priorityRow}>
          <Text style={screenStyles.priorityName}>{name}</Text>
          <Text style={screenStyles.priorityCount}>{count}</Text>
        </View>
      ))}
    </View>
  );
}

function GuideStepList({ steps, accentColor }: { steps: string[]; accentColor: string }) {
  return (
    <View style={screenStyles.fullUnlockSteps}>
      {steps.map((step, index) => (
        <View key={`${index}-${step}`} style={screenStyles.fullUnlockStepRow}>
          <Text style={[screenStyles.fullUnlockStepNum, { color: accentColor }]}>{index + 1}.</Text>
          <Text style={screenStyles.fullUnlockStepText}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

function StatsPanel({ survivor }: { survivor: SurvivorRecord }) {
  return (
    <View style={screenStyles.detailPanel}>
      <Text style={screenStyles.panelTitle}>Basic Stats</Text>
      {statDefinitions.map((definition) => (
        <View key={definition.key} style={screenStyles.definitionCard}>
          <View style={screenStyles.definitionHeader}>
            <Text style={screenStyles.definitionTitle}>{definition.label}</Text>
            <Text style={screenStyles.definitionValue}>{getSurvivorStatValue(survivor, definition)}</Text>
          </View>
          <Text style={screenStyles.definitionText}>{definition.definition}</Text>
          <Text style={screenStyles.definitionNote}>{definition.practicalNote}</Text>
        </View>
      ))}
    </View>
  );
}

function EffectsPanel() {
  return (
    <View style={screenStyles.detailPanel}>
      <Text style={screenStyles.panelTitle}>Status Effects</Text>
      {statusEffectDefinitions.map((effect) => (
        <View key={effect.name} style={screenStyles.definitionCard}>
          <View style={screenStyles.definitionHeader}>
            <Text style={screenStyles.definitionTitle}>{effect.name}</Text>
            <Text style={screenStyles.effectType}>{effect.type}</Text>
          </View>
          <Text style={screenStyles.definitionText}>{effect.definition}</Text>
          <Text style={screenStyles.definitionNote}>{effect.practicalNote}</Text>
          <View style={screenStyles.exampleRow}>
            {effect.examples.map((example) => (
              <View key={example} style={screenStyles.examplePill}>
                <Text style={screenStyles.exampleText}>{example}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function GuidePanel({
  guide,
  survivorName,
  onOpenItem
}: {
  guide: SurvivorGuide | null;
  survivorName: string;
  onOpenItem: (item: ItemRecord) => void;
}) {
  if (!guide) {
    return (
      <View style={screenStyles.detailPanel}>
        <Text style={screenStyles.panelTitle}>Guide</Text>
        <Text style={screenStyles.definitionNote}>No item guide is written for {survivorName} yet.</Text>
      </View>
    );
  }

  return (
    <View style={screenStyles.detailPanel}>
      <Text style={screenStyles.panelTitle}>{guide.survivor} Build Guide</Text>
      {guide.buildName ? <Text style={screenStyles.guideBuildName}>{guide.buildName}</Text> : null}
      {guide.tags && guide.tags.length > 0 ? <PlainChipGrid labels={guide.tags} /> : null}
      <Text style={screenStyles.guideSummary}>{guide.summary}</Text>

      {guide.quickRules && guide.quickRules.length > 0 ? (
        <View style={screenStyles.guideSection}>
          <Text style={screenStyles.guideSectionTitle}>Quick Plan</Text>
          {guide.quickRules.map((note) => (
            <View key={note} style={screenStyles.fieldNoteRow}>
              <Ionicons name="radio-button-on" size={14} color="#64d987" />
              <Text style={screenStyles.fieldNoteText}>{note}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={screenStyles.guideSection}>
        <Text style={screenStyles.guideSectionTitle}>Build Plan</Text>
        {guide.buildPlan.map((note) => (
          <View key={note} style={screenStyles.fieldNoteRow}>
            <Ionicons name="navigate-circle" size={14} color="#55b9ff" />
            <Text style={screenStyles.fieldNoteText}>{note}</Text>
          </View>
        ))}
      </View>

      <View style={screenStyles.guideSection}>
        <Text style={screenStyles.guideSectionTitle}>Item Guide</Text>
        {guide.itemGuide.map((group) => (
          <GuideItemGroup key={group.label} group={group} onOpenItem={onOpenItem} />
        ))}
      </View>

      {guide.loadout && guide.loadout.length > 0 ? (
        <View style={screenStyles.guideSection}>
          <Text style={screenStyles.guideSectionTitle}>Default Loadout</Text>
          {guide.loadout.map((entry) => (
            <View key={`${entry.slot}-${entry.skill}`} style={screenStyles.guideInfoCard}>
              <View style={screenStyles.guideInfoHeader}>
                <Text style={screenStyles.guideInfoKicker}>{entry.slot}</Text>
                <Text style={screenStyles.guideInfoStatus}>{entry.status}</Text>
              </View>
              <Text style={screenStyles.guideInfoTitle}>{entry.skill}</Text>
              <Text style={screenStyles.guideInfoText}>{entry.note}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {guide.adaptationRules && guide.adaptationRules.length > 0 ? (
        <View style={screenStyles.guideSection}>
          <Text style={screenStyles.guideSectionTitle}>Run Adaptation</Text>
          {guide.adaptationRules.map((entry) => (
            <View key={entry.problem} style={screenStyles.guideInfoCard}>
              <View style={screenStyles.guideInfoHeader}>
                <Text style={screenStyles.guideInfoKicker}>{entry.problem}</Text>
              </View>
              <Text style={screenStyles.guideInfoTitle}>{entry.picks}</Text>
              <Text style={screenStyles.guideInfoText}>{entry.rule}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {guide.equipmentPicks && guide.equipmentPicks.length > 0 ? (
        <View style={screenStyles.guideSection}>
          <Text style={screenStyles.guideSectionTitle}>Equipment Picks</Text>
          {guide.equipmentPicks.map((entry) => (
            <View key={entry.name} style={screenStyles.guideInfoCard}>
              <View style={screenStyles.guideInfoHeader}>
                <Text style={screenStyles.guideInfoKicker}>Equipment</Text>
                <Text style={screenStyles.guideInfoStatus}>{entry.status}</Text>
              </View>
              <Text style={screenStyles.guideInfoTitle}>{entry.name}</Text>
              <Text style={screenStyles.guideInfoText}>{entry.when}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {guide.unlockRoutes && guide.unlockRoutes.length > 0 ? (
        <UnlockRoutesSection routes={guide.unlockRoutes} onOpenItem={onOpenItem} />
      ) : null}

      {guide.exclusions && guide.exclusions.length > 0 ? (
        <View style={screenStyles.guideSection}>
          <Text style={screenStyles.guideSectionTitle}>Excluded</Text>
          <PlainChipGrid labels={guide.exclusions} />
          {guide.sourceNote ? <Text style={screenStyles.definitionNote}>{guide.sourceNote}</Text> : null}
        </View>
      ) : null}

      <View style={screenStyles.warningPanel}>
        <Text style={screenStyles.warningTitle}>Do Not Overbuild</Text>
        {guide.avoidNotes.map((note) => (
          <View key={note} style={screenStyles.fieldNoteRow}>
            <Ionicons name="alert-circle" size={14} color="#f3d65f" />
            <Text style={screenStyles.fieldNoteText}>{note}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function UnlockRoutesSection({
  routes,
  onOpenItem
}: {
  routes: SurvivorUnlockRoute[];
  onOpenItem: (item: ItemRecord) => void;
}) {
  return (
    <View style={screenStyles.guideSection}>
      <Text style={screenStyles.guideSectionTitle}>Unlock Routes</Text>
      {routes.map((route) => (
        <UnlockRouteCard key={route.id} route={route} onOpenItem={onOpenItem} />
      ))}
    </View>
  );
}

function UnlockRouteCard({
  route,
  onOpenItem
}: {
  route: SurvivorUnlockRoute;
  onOpenItem: (item: ItemRecord) => void;
}) {
  const avoidItems = resolveGuideItems(route.avoidItemIds);

  return (
    <View style={screenStyles.unlockRouteCard}>
      <View style={screenStyles.unlockRouteHeader}>
        <Ionicons name="trophy" size={16} color="#f3d65f" />
        <Text style={screenStyles.unlockRouteTitle}>{route.title}</Text>
      </View>
      <Text style={screenStyles.unlockRouteText}>{route.goal}</Text>
      <Text style={screenStyles.unlockRouteMeta}>Requirement: {route.requirement}</Text>
      <View style={screenStyles.unlockRuleBox}>
        <Ionicons name="alert-circle" size={15} color="#f3d65f" />
        <Text style={screenStyles.unlockRuleText}>{route.coreRule}</Text>
      </View>

      <Text style={screenStyles.unlockRouteSubTitle}>Command Pickup Order</Text>
      {route.stagePlan.map((stage) => (
        <View key={stage.stage} style={screenStyles.unlockStageCard}>
          <Text style={screenStyles.unlockStageTitle}>{stage.stage}</Text>
          <RouteTextList notes={stage.priorities} icon="navigate-circle" iconColor="#55b9ff" />
          {stage.itemIds && stage.itemIds.length > 0 ? (
            <RarityIconGroups itemIds={stage.itemIds} onOpenItem={onOpenItem} />
          ) : null}
          {stage.avoid && stage.avoid.length > 0 ? (
            <View style={screenStyles.unlockAvoidBox}>
              <Text style={screenStyles.unlockAvoidTitle}>Avoid</Text>
              <PlainChipGrid labels={stage.avoid} />
            </View>
          ) : null}
        </View>
      ))}

      <RouteSection title="Avoid Proc Damage Items">
        <RarityIconGroups itemIds={route.avoidItemIds} onOpenItem={onOpenItem} tone="danger" />
        {avoidItems.length === 0 ? (
          <Text style={screenStyles.definitionNote}>No matching avoid items were found in the local catalog.</Text>
        ) : null}
      </RouteSection>

      <RouteSection title="Equipment Plan">
        <RouteTextList notes={route.equipmentPlan} icon="flash" iconColor="#f3d65f" />
      </RouteSection>

      <RouteSection title="Commencement Vase Script">
        <RouteTextList notes={route.commencementScript} icon="arrow-forward-circle" iconColor="#55b9ff" />
      </RouteSection>

      <RouteSection title="Mithrix Final Phase">
        <RouteTextList notes={route.finalScript} icon="radio-button-on" iconColor="#f2554f" />
      </RouteSection>

      <RouteSection title="Clean Final Build Target">
        <RouteTextList notes={route.cleanBuildTarget} icon="checkmark-circle" iconColor="#64d987" />
      </RouteSection>
    </View>
  );
}

function RouteSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={screenStyles.unlockRouteBlock}>
      <Text style={screenStyles.unlockRouteSubTitle}>{title}</Text>
      {children}
    </View>
  );
}

function RouteTextList({
  notes,
  icon,
  iconColor
}: {
  notes: string[];
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}) {
  return (
    <View style={screenStyles.unlockRouteList}>
      {notes.map((note) => (
        <View key={note} style={screenStyles.fieldNoteRow}>
          <Ionicons name={icon} size={14} color={iconColor} />
          <Text style={screenStyles.fieldNoteText}>{note}</Text>
        </View>
      ))}
    </View>
  );
}

function RarityIconGroups({
  itemIds,
  onOpenItem,
  tone
}: {
  itemIds: string[];
  onOpenItem: (item: ItemRecord) => void;
  tone?: 'danger';
}) {
  const guideItems = resolveGuideItems(itemIds);
  const groups = guideRarityOrder
    .map((rarity) => ({
      rarity,
      items: guideItems.filter((item) => item.rarity === rarity)
    }))
    .filter((group) => group.items.length > 0);

  return (
    <View style={screenStyles.rarityIconGroups}>
      {groups.map((group) => (
        <View key={group.rarity} style={screenStyles.rarityIconGroup}>
          <Text style={[screenStyles.rarityIconGroupTitle, tone === 'danger' && screenStyles.rarityIconGroupTitleDanger]}>
            {group.rarity}
          </Text>
          <View style={screenStyles.rarityIconGrid}>
            {group.items.map((item) => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => onOpenItem(item)}
                style={[screenStyles.rarityIconTile, tone === 'danger' && screenStyles.rarityIconTileDanger]}
              >
                <IconImage source={getItemIcon(item)} size={34} label={item.name} />
                <Text numberOfLines={2} style={screenStyles.rarityIconName}>
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function PlainChipGrid({ labels }: { labels: string[] }) {
  return (
    <View style={screenStyles.guideItemGrid}>
      {labels.map((label) => (
        <View key={label} style={screenStyles.plainRouteChip}>
          <Text style={screenStyles.plainRouteChipText}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

function GuideItemGroup({
  group,
  onOpenItem
}: {
  group: SurvivorItemGuide;
  onOpenItem: (item: ItemRecord) => void;
}) {
  const guideItems = resolveGuideItems(group.itemIds);

  return (
    <View style={screenStyles.guideItemGroup}>
      <Text style={screenStyles.guideItemTitle}>{group.label}</Text>
      <Text style={screenStyles.guideItemReason}>{group.reason}</Text>
      <View style={screenStyles.guideItemGrid}>
        {guideItems.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            onPress={() => onOpenItem(item)}
            style={screenStyles.guideItemPill}
          >
            <Text style={screenStyles.guideItemName}>{item.name}</Text>
            <Text style={screenStyles.guideItemRarity}>{item.rarity}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function LoadoutPanel({
  skillsByType,
  selectedSlot,
  onSelectedSlotChange
}: {
  skillsByType: Record<string, SkillRecord[]>;
  selectedSlot: string;
  onSelectedSlotChange: (slot: string) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<LoadoutSelection>({ slot: selectedSlot, index: 0 });
  const selectedSkills = skillsByType[selectedOption.slot] ?? [];
  const selectedSkill = selectedSkills[selectedOption.index];
  const selectedSkin = selectedOption.slot === 'Skin' ? skinOptions[selectedOption.index] ?? skinOptions[0] : null;
  const selectedTitle = selectedSkill?.name ?? selectedSkin?.name ?? 'Loadout Option';
  const selectedDescription =
    selectedSkill?.desc ??
    selectedSkin?.description ??
    'No local data is available for this loadout option.';
  const selectedRequirement = selectedSkill
    ? getSkillUnlockNote(selectedSkill, selectedOption.index)
    : selectedSkin?.unlockNote ?? 'No unlock data available.';
  const selectedStatus = selectedOption.index === 0 ? 'Equipped' : 'Challenge';

  return (
    <View style={[screenStyles.detailPanel, screenStyles.loadoutPanel]}>
      <View style={screenStyles.loadoutHeader}>
        <Text style={screenStyles.panelTitle}>Loadout</Text>
        <Text style={screenStyles.loadoutHeaderBadge}>{selectedSlot}</Text>
      </View>

      <View style={screenStyles.loadoutMatrix}>
        {loadoutRows.map((slot) => (
          <View key={slot} style={screenStyles.loadoutMatrixRow}>
            <Pressable
              onPress={() => {
                onSelectedSlotChange(slot);
                setSelectedOption({ slot, index: 0 });
              }}
              style={[screenStyles.loadoutRowLabel, selectedOption.slot === slot && screenStyles.loadoutRowLabelActive]}
            >
              <Text
                style={[
                  screenStyles.loadoutRowLabelText,
                  selectedOption.slot === slot && screenStyles.loadoutRowLabelTextActive
                ]}
              >
                {slot}
              </Text>
            </Pressable>
            <View style={screenStyles.loadoutTileRow}>
              {slot === 'Skin' ? (
                skinOptions.map((skin, index) => (
                  <LoadoutSkinTile
                    key={skin.name}
                    skin={skin}
                    active={selectedOption.slot === slot && selectedOption.index === index}
                    onPress={() => {
                      onSelectedSlotChange(slot);
                      setSelectedOption({ slot, index });
                    }}
                  />
                ))
              ) : (
                (skillsByType[slot] ?? []).map((skill, index) => (
                  <LoadoutSkillTile
                    key={`${slot}-${skill.name}`}
                    skill={skill}
                    active={selectedOption.slot === slot && selectedOption.index === index}
                    onPress={() => {
                      onSelectedSlotChange(slot);
                      setSelectedOption({ slot, index });
                    }}
                  />
                ))
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={screenStyles.loadoutDetailPanel}>
        <View style={screenStyles.loadoutDetailHeader}>
          <Text style={screenStyles.loadoutDetailTitle}>{selectedTitle}</Text>
          <Text style={screenStyles.loadoutDetailBadge}>{selectedStatus}</Text>
        </View>
        <Text style={screenStyles.loadoutDetailSlot}>{selectedOption.slot}</Text>
        <Text style={screenStyles.loadoutDetailText}>{cleanMarkup(selectedDescription)}</Text>
        <View style={screenStyles.requirementBox}>
          <Ionicons name={selectedOption.index === 0 ? 'checkmark-circle' : 'trophy'} size={16} color="#f3d65f" />
          <Text style={screenStyles.requirementText}>{selectedRequirement}</Text>
        </View>
      </View>
    </View>
  );
}

type LoadoutSelection = {
  slot: string;
  index: number;
};

function LoadoutSkillTile({
  skill,
  active,
  onPress
}: {
  skill: SkillRecord;
  active: boolean;
  onPress: () => void;
}) {
  const icon = getSkillIcon(skill);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={skill.name}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[screenStyles.loadoutTile, active && screenStyles.loadoutTileActive]}
    >
      <GameIcon
        source={icon}
        label={skill.name}
        imageStyle={screenStyles.loadoutTileIcon}
        fallbackStyle={screenStyles.loadoutTileFallback}
      />
      {!active && <View style={screenStyles.loadoutTileInset} />}
      {active ? null : <View style={screenStyles.loadoutTileDim} />}
      {skill.name && active ? <View style={screenStyles.loadoutTileGlow} /> : null}
      {active ? <View style={screenStyles.loadoutTileDiamond} /> : null}
    </Pressable>
  );
}

function LoadoutSkinTile({ skin, active, onPress }: { skin: SkinOption; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={skin.name}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[screenStyles.loadoutTile, active && screenStyles.loadoutTileActive]}
    >
      <View style={screenStyles.skinSwatch}>
        <View style={screenStyles.skinSwatchA} />
        <View style={screenStyles.skinSwatchB} />
      </View>
      <Text style={screenStyles.skinTileText}>{skin.name}</Text>
      {!active && <View style={screenStyles.loadoutTileInset} />}
      {active ? <View style={screenStyles.loadoutTileDiamond} /> : null}
    </Pressable>
  );
}

function SkillCard({
  skill,
  compact = false,
  unlockNote
}: {
  skill: SkillRecord;
  compact?: boolean;
  unlockNote?: string;
}) {
  const icon = getSkillIcon(skill);

  return (
    <View style={[screenStyles.skillCard, compact && screenStyles.skillCardCompact]}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={screenStyles.skillIconFrame}>
          <GameIcon
            source={icon}
            label={skill.name}
            imageStyle={screenStyles.skillIcon}
            fallbackStyle={screenStyles.skillFallback}
          />
        </View>
        <View style={screenStyles.skillCopy}>
          <View style={screenStyles.skillTitleRow}>
            <Text style={screenStyles.skillName}>{skill.name}</Text>
            {skill.cooldown ? <Text style={screenStyles.cooldown}>{skill.cooldown}</Text> : null}
          </View>
          <Text style={screenStyles.skillDesc}>{cleanMarkup(skill.desc)}</Text>
          {getSkillExpansion(skill) ? <Text style={screenStyles.skillExpansion}>{getSkillExpansionLabel(skill)}</Text> : null}
          {unlockNote ? <Text style={screenStyles.skillUnlockNote}>{unlockNote}</Text> : null}
        </View>
      </View>
    </View>
  );
}

function GameIcon({
  source,
  label,
  imageStyle,
  fallbackStyle
}: {
  source: ImageSourcePropType | null;
  label: string;
  imageStyle: object;
  fallbackStyle: object;
}) {
  if (!source) {
    return (
      <View style={fallbackStyle}>
        <Text style={screenStyles.iconFallbackText}>{label.slice(0, 2).toUpperCase()}</Text>
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={imageStyle}
      resizeMode="contain"
    />
  );
}

function PanelButton({
  label,
  active,
  disabled,
  onPress
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[screenStyles.panelButton, active && screenStyles.panelButtonActive, disabled && screenStyles.panelButtonDisabled]}
    >
      <Text
        style={[
          screenStyles.panelButtonText,
          active && screenStyles.panelButtonTextActive,
          disabled && screenStyles.panelButtonTextDisabled
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={screenStyles.statCell}>
      <Text style={screenStyles.statNumber}>{value}</Text>
      <Text style={screenStyles.statName}>{label}</Text>
    </View>
  );
}

function MetaPill({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={screenStyles.metaPill}>
      <Ionicons name={icon} size={14} color="#55b9ff" />
      <Text style={screenStyles.metaText}>{label}</Text>
    </View>
  );
}

function ScopeButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[screenStyles.scopeButton, active && screenStyles.scopeButtonActive]}
    >
      <Text style={[screenStyles.scopeButtonText, active && screenStyles.scopeButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

function groupSkillsByType(records: SkillRecord[]) {
  return records.reduce<Record<string, SkillRecord[]>>((groups, skill) => {
    groups[skill.type] = [...(groups[skill.type] ?? []), skill];
    return groups;
  }, {});
}

function orderedSkillTypes(groups: Record<string, SkillRecord[]>) {
  return Object.keys(groups).sort((a, b) => {
    const aIndex = skillOrder.indexOf(a);
    const bIndex = skillOrder.indexOf(b);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });
}

function getSkillUnlockEntries(groups: Record<string, SkillRecord[]>) {
  return orderedSkillTypes(groups).flatMap((type) =>
    (groups[type] ?? []).flatMap((skill, index) => {
      if (skill.survivor === 'Captain' && skill.name === 'Orbital Supply Beacon') {
        return ['Beacon: Resupply', 'Beacon: Hack'].flatMap((beaconName) => {
          const entry = newSkillUnlockGuides[`${skill.survivor}|${beaconName}`];
          return entry ? [{ skill: { ...skill, name: beaconName }, entry }] : [];
        });
      }
      if (index === 0) return [];
      const entry = newSkillUnlockGuides[`${skill.survivor}|${skill.name}`];
      return entry ? [{ skill, entry }] : [];
    })
  );
}

function hasUnlockContent(survivorName: string) {
  if (survivorUnlockGuides[survivorName]) return true;
  return Object.keys(newSkillUnlockGuides).some((key) => key.startsWith(`${survivorName}|`));
}

function cleanMarkup(value: string) {
  return value.replace(/\{\{Keyword\|[^|}]+\|[^|}]+\|([^}]+)\}\}/g, '$1').replace(/\{\{Keyword\|[^|}]+\|([^}]+)\}\}/g, '$1');
}

function getSurvivorStatValue(survivor: SurvivorRecord, definition: StatDefinition) {
  if (definition.key === 'health') return survivor.base_health ?? 'N/A';
  if (definition.key === 'damage') return survivor.base_damage ?? 'N/A';
  if (definition.key === 'speed') return survivor.base_speed ?? 'N/A';
  return survivor.base_armor ?? 'N/A';
}

function getSkillUnlockNote(skill: SkillRecord, index: number) {
  if (index === 0) {
    return 'Requirement: available by default when the survivor is unlocked.';
  }

  const key = `${skill.survivor}|${skill.name}`;
  const entry = newSkillUnlockGuides[key];
  if (entry) {
    return `Requirement: ${entry.challengeName} - ${entry.requirementText}`;
  }

  return (
    `Requirement: alternate ${skill.type.toLowerCase()} skill for ${skill.survivor}. Exact challenge text is not present in the local skill manifest yet.`
  );
}

function getSurvivorTacticalProfile(name: string): SurvivorTacticalProfile {
  return (
    survivorTacticalProfiles[name] ?? {
      risks: ['Survivability Gap', 'Unclear Crowd Tool', 'Escape Dependency'],
      support: ['Mobility', 'Recovery', 'Area Damage', 'Defense'],
      notes: [
        'Identify which skill handles crowds and which handles bosses before committing items.',
        'Prioritize movement and recovery if the kit lacks a clean escape.',
        'Avoid damage-only item paths until the survival plan is stable.'
      ]
    }
  );
}

function getRelatedMechanicsForSurvivor(name: string) {
  return combatMechanics.filter((mechanic) => mechanic.relatedSurvivors.includes(name)).slice(0, 6);
}

function formatMobilityTag(tag: string) {
  return tag
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatSourceStatus(status: string) {
  return status
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

const screenStyles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16
  },
  survivorUnlockCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#392c10',
    backgroundColor: '#1b1404',
    padding: 12,
    marginTop: 12,
  },
  survivorUnlockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  survivorUnlockTitle: {
    color: '#f3d65f',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  survivorUnlockSub: {
    color: '#dbe4ee',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  survivorUnlockText: {
    color: '#b0bec5',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 16,
  },
  survivorUnlockSteps: {
    gap: 6,
  },
  survivorUnlockStepRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  survivorUnlockStepNum: {
    color: '#f3d65f',
    fontSize: 12,
    fontWeight: '900',
    width: 14,
  },
  survivorUnlockStepText: {
    color: '#e0e0e0',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    lineHeight: 16,
  },
  content: {
    gap: 12,
    paddingTop: 14,
    paddingBottom: 116
  },
  selectorPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0f1720',
    padding: 12,
    ...surfaceShadow
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  panelLabel: {
    color: '#f3f7fb',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  selectorCount: {
    color: '#7f8c99',
    fontSize: 12,
    fontWeight: '800'
  },
  scopeToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10
  },
  scopeButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263443',
    backgroundColor: '#121d28',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  scopeButtonActive: {
    borderColor: '#55b9ff',
    backgroundColor: '#14314a'
  },
  scopeButtonText: {
    color: '#91a0ae',
    fontSize: 12,
    fontWeight: '900'
  },
  scopeButtonTextActive: {
    color: '#dbe4ee'
  },
  survivorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  portraitButton: {
    width: 54,
    height: 54,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263545',
    backgroundColor: '#080c11',
    alignItems: 'center',
    justifyContent: 'center'
  },
  portraitButtonActive: {
    borderColor: '#f3d65f',
    backgroundColor: '#182231'
  },
  portraitImage: {
    width: 44,
    height: 44
  },
  portraitFallback: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111923'
  },
  heroPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#111923',
    padding: 14,
    gap: 14,
    ...surfaceShadow
  },
  heroTop: {
    flexDirection: 'row',
    gap: 13
  },
  heroPortrait: {
    width: 96,
    height: 96,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334559',
    backgroundColor: '#080c11',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroImage: {
    width: 82,
    height: 82
  },
  heroFallback: {
    width: 82,
    height: 82,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111923'
  },
  heroCopy: {
    flex: 1,
    gap: 7
  },
  survivorName: {
    color: '#f3f7fb',
    fontSize: 26,
    fontWeight: '900'
  },
  description: {
    color: '#c8d2dc',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700'
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7
  },
  metaPill: {
    minHeight: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263545',
    backgroundColor: '#0d131b',
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  metaText: {
    color: '#dbe4ee',
    fontSize: 12,
    fontWeight: '900'
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8
  },
  statCell: {
    flex: 1,
    minHeight: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263545',
    backgroundColor: '#0d131b',
    justifyContent: 'center',
    paddingHorizontal: 9
  },
  statNumber: {
    color: '#f3f7fb',
    fontSize: 17,
    fontWeight: '900'
  },
  statName: {
    color: '#7f8c99',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  tabStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#101720',
    overflow: 'hidden'
  },
  panelButton: {
    flexGrow: 1,
    flexBasis: '20%',
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center'
  },
  panelButtonActive: {
    backgroundColor: '#d76ede'
  },
  panelButtonDisabled: {
    opacity: 0.45
  },
  panelButtonText: {
    color: '#a8b4c0',
    fontSize: 12,
    fontWeight: '900'
  },
  panelButtonTextActive: {
    color: '#0b0f14'
  },
  panelButtonTextDisabled: {
    color: '#687481'
  },
  detailPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0f1720',
    padding: 13,
    gap: 12,
    ...surfaceShadow
  },
  panelTitle: {
    color: '#f3f7fb',
    fontSize: 19,
    fontWeight: '900'
  },
  unlocksIntro: {
    color: '#9aa7b5',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700'
  },
  unlockTabStrip: {
    gap: 8,
    paddingRight: 4
  },
  unlockTab: {
    minWidth: 118,
    maxWidth: 158,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263545',
    backgroundColor: '#0b1118',
    paddingHorizontal: 11,
    paddingVertical: 9,
    gap: 3
  },
  unlockTabActive: {
    borderColor: '#55b9ff',
    backgroundColor: '#14314a'
  },
  unlockTabKicker: {
    color: '#7f8c99',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  unlockTabKickerActive: {
    color: '#f3d65f'
  },
  unlockTabText: {
    color: '#dbe4ee',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '900'
  },
  unlockTabTextActive: {
    color: '#f3f7fb'
  },
  fullUnlockCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#0b1118',
    padding: 12,
    gap: 10
  },
  fullUnlockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  fullUnlockHeaderCopy: {
    flex: 1,
    gap: 3
  },
  fullUnlockTitle: {
    color: '#55b9ff',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  fullUnlockName: {
    color: '#f3f7fb',
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '900'
  },
  fullUnlockChallenge: {
    color: '#f3d65f',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800'
  },
  fullUnlockRequirement: {
    color: '#c8d2dc',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800'
  },
  fullUnlockSteps: {
    gap: 9
  },
  fullUnlockStepRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start'
  },
  fullUnlockStepNum: {
    width: 22,
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '900',
    textAlign: 'right'
  },
  fullUnlockStepText: {
    flex: 1,
    color: '#dbe4ee',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700'
  },
  unlockSkillIconFrame: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334559',
    backgroundColor: '#080c11',
    alignItems: 'center',
    justifyContent: 'center'
  },
  unlockSkillIcon: {
    width: 42,
    height: 42
  },
  missionStack: {
    gap: 10
  },
  missionHeroCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4b4322',
    backgroundColor: '#15120f',
    padding: 12,
    gap: 8
  },
  missionEyebrow: {
    color: '#f3d65f',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  missionHeroTitle: {
    color: '#f3f7fb',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900'
  },
  missionHeroSub: {
    color: '#f3d65f',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900'
  },
  missionHeroText: {
    color: '#dbe4ee',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800'
  },
  missionRewardBox: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4b4322',
    backgroundColor: '#0f0c08',
    padding: 9,
    gap: 3
  },
  missionRewardLabel: {
    color: '#9aa7b5',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  missionRewardText: {
    color: '#f3f7fb',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800'
  },
  missionJumpRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7
  },
  missionJumpChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#5a4f27',
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: '#221a0b'
  },
  missionJumpText: {
    color: '#f3d65f',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  missionCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#0b1118',
    padding: 11,
    gap: 9
  },
  missionSectionTitle: {
    color: '#55b9ff',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  missionInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#1d2630',
    paddingTop: 7
  },
  missionInfoKey: {
    color: '#9aa7b5',
    fontSize: 12,
    fontWeight: '800'
  },
  missionInfoValue: {
    flex: 1,
    color: '#f3f7fb',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    textAlign: 'right'
  },
  loadoutBriefGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  loadoutBriefCard: {
    width: '48%',
    minHeight: 76,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0f1720',
    padding: 9,
    gap: 4
  },
  loadoutBriefSlot: {
    color: '#9aa7b5',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  loadoutBriefName: {
    color: '#f3f7fb',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '900'
  },
  loadoutBriefNote: {
    color: '#c8d2dc',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700'
  },
  itemTargetList: {
    gap: 7
  },
  missionItemCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0f1720',
    padding: 9,
    gap: 8
  },
  missionItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9
  },
  missionItemCopy: {
    flex: 1,
    gap: 2
  },
  missionItemName: {
    color: '#f3f7fb',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '900'
  },
  missionItemMeta: {
    color: '#55b9ff',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800'
  },
  missionItemDetail: {
    borderTopWidth: 1,
    borderTopColor: '#253241',
    paddingTop: 8,
    gap: 4
  },
  missionItemSummary: {
    color: '#f3d65f',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900'
  },
  missionItemText: {
    color: '#c8d2dc',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700'
  },
  dangerCard: {
    borderColor: '#5b2f2f',
    backgroundColor: '#1c1010'
  },
  dangerTitle: {
    color: '#f2554f',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  dangerSubtitle: {
    color: '#f0b7b4',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800'
  },
  mapTabRow: {
    flexDirection: 'row',
    gap: 8
  },
  mapTab: {
    flex: 1,
    minHeight: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0f1720',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  mapTabActive: {
    borderColor: '#55b9ff',
    backgroundColor: '#0d1821'
  },
  mapTabText: {
    color: '#9aa7b5',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center'
  },
  mapTabTextActive: {
    color: '#55b9ff'
  },
  mapBriefGrid: {
    gap: 9
  },
  missionBulletBlock: {
    gap: 6
  },
  missionBulletTitle: {
    color: '#f3f7fb',
    fontSize: 12,
    fontWeight: '900'
  },
  missionBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6
  },
  missionBulletText: {
    flex: 1,
    color: '#c8d2dc',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700'
  },
  priorityGroup: {
    gap: 5
  },
  priorityTitle: {
    color: '#f3d65f',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#1d2630',
    paddingTop: 5
  },
  priorityName: {
    color: '#dbe4ee',
    fontSize: 12,
    fontWeight: '800'
  },
  priorityCount: {
    color: '#55b9ff',
    fontSize: 12,
    fontWeight: '900'
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  noteRow: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'flex-start'
  },
  noteText: {
    flex: 1,
    color: '#c8d2dc',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700'
  },
  operationalPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#0b1118',
    padding: 11,
    gap: 11
  },
  operationalTitle: {
    color: '#f3f7fb',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  tacticalGroup: {
    gap: 7
  },
  tacticalGroupLabel: {
    color: '#7f8c99',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  tacticalChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7
  },
  tacticalChip: {
    minHeight: 29,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4b4322',
    backgroundColor: '#15120f',
    justifyContent: 'center',
    paddingHorizontal: 9
  },
  tacticalChipSupport: {
    borderColor: '#26445a',
    backgroundColor: '#0d1821'
  },
  tacticalChipText: {
    color: '#f3d65f',
    fontSize: 12,
    fontWeight: '900'
  },
  tacticalChipTextSupport: {
    color: '#55b9ff'
  },
  mobilityPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#26445a',
    backgroundColor: '#0d1821',
    padding: 10,
    gap: 8
  },
  mobilityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10
  },
  mobilityTitle: {
    color: '#f3f7fb',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900'
  },
  mobilityStatus: {
    color: '#f3d65f',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '900',
    textAlign: 'right',
    textTransform: 'uppercase'
  },
  mobilityChip: {
    borderColor: '#28556a',
    backgroundColor: '#07131b'
  },
  mobilityChipText: {
    color: '#8de8ff',
    fontSize: 11
  },
  mobilityText: {
    color: '#dbe4ee',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800'
  },
  mobilityWeakness: {
    color: '#f0b7b4',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800'
  },
  mechanicChip: {
    borderColor: '#26445a',
    backgroundColor: '#0d1821'
  },
  mechanicChipText: {
    color: '#55b9ff'
  },
  fieldNotesPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0f1720',
    padding: 10,
    gap: 7
  },
  fieldNotesTitle: {
    color: '#dbe4ee',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  fieldNoteRow: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'flex-start'
  },
  fieldNoteText: {
    flex: 1,
    color: '#c8d2dc',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700'
  },
  skillGroup: {
    gap: 8
  },
  skillGroupTitle: {
    color: '#f0a6f6',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  definitionCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#0b1118',
    padding: 11,
    gap: 7
  },
  definitionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  definitionTitle: {
    flex: 1,
    color: '#f3f7fb',
    fontSize: 16,
    fontWeight: '900'
  },
  definitionValue: {
    color: '#f3d65f',
    fontSize: 15,
    fontWeight: '900'
  },
  definitionText: {
    color: '#dbe4ee',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700'
  },
  definitionNote: {
    color: '#9aa7b5',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700'
  },
  effectType: {
    color: '#55b9ff',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  guideSummary: {
    color: '#dbe4ee',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800'
  },
  guideBuildName: {
    color: '#f3f7fb',
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900'
  },
  guideSection: {
    gap: 9
  },
  guideSectionTitle: {
    color: '#f0a6f6',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  guideItemGroup: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#0b1118',
    padding: 10,
    gap: 8
  },
  guideItemTitle: {
    color: '#f3f7fb',
    fontSize: 15,
    fontWeight: '900'
  },
  guideItemReason: {
    color: '#9aa7b5',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700'
  },
  guideItemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7
  },
  guideItemPill: {
    maxWidth: '100%',
    minHeight: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#26445a',
    backgroundColor: '#0d1821',
    justifyContent: 'center',
    paddingHorizontal: 9
  },
  guideItemPillDanger: {
    borderColor: '#5b2f2f',
    backgroundColor: '#1c1010'
  },
  guideItemName: {
    color: '#dbe4ee',
    fontSize: 12,
    fontWeight: '900'
  },
  guideItemRarity: {
    color: '#55b9ff',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginTop: 1
  },
  guideItemRarityDanger: {
    color: '#f2554f'
  },
  guideInfoCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#0b1118',
    padding: 10,
    gap: 6
  },
  guideInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
  },
  guideInfoKicker: {
    color: '#55b9ff',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  guideInfoStatus: {
    flexShrink: 1,
    color: '#9aa7b5',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'right',
    textTransform: 'uppercase'
  },
  guideInfoTitle: {
    color: '#f3f7fb',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900'
  },
  guideInfoText: {
    color: '#9aa7b5',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700'
  },
  unlockRouteCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#35475b',
    backgroundColor: '#091018',
    padding: 11,
    gap: 11
  },
  unlockRouteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  unlockRouteTitle: {
    flex: 1,
    color: '#f3f7fb',
    fontSize: 16,
    fontWeight: '900'
  },
  unlockRouteText: {
    color: '#dbe4ee',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '800'
  },
  unlockRouteMeta: {
    color: '#9aa7b5',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800'
  },
  unlockRuleBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4b4322',
    backgroundColor: '#15120f',
    padding: 9,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start'
  },
  unlockRuleText: {
    flex: 1,
    color: '#f3d65f',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800'
  },
  unlockRouteSubTitle: {
    color: '#55b9ff',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  unlockStageCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#0b1118',
    padding: 10,
    gap: 8
  },
  unlockStageTitle: {
    color: '#f3f7fb',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  unlockRouteBlock: {
    gap: 8
  },
  unlockRouteList: {
    gap: 7
  },
  rarityIconGroups: {
    gap: 9
  },
  rarityIconGroup: {
    gap: 6
  },
  rarityIconGroupTitle: {
    color: '#55b9ff',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  rarityIconGroupTitleDanger: {
    color: '#f2554f'
  },
  rarityIconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7
  },
  rarityIconTile: {
    width: 82,
    minHeight: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#26445a',
    backgroundColor: '#0d1821',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 7,
    gap: 5
  },
  rarityIconTileDanger: {
    borderColor: '#5b2f2f',
    backgroundColor: '#1c1010'
  },
  rarityIconName: {
    alignSelf: 'stretch',
    color: '#dbe4ee',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '900',
    textAlign: 'center'
  },
  unlockAvoidBox: {
    gap: 7
  },
  unlockAvoidTitle: {
    color: '#f2554f',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  plainRouteChip: {
    maxWidth: '100%',
    minHeight: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5b2f2f',
    backgroundColor: '#1c1010',
    justifyContent: 'center',
    paddingHorizontal: 9
  },
  plainRouteChipText: {
    color: '#f0b7b4',
    fontSize: 12,
    fontWeight: '900'
  },
  warningPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4b4322',
    backgroundColor: '#15120f',
    padding: 10,
    gap: 8
  },
  warningTitle: {
    color: '#f3d65f',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  exampleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2
  },
  examplePill: {
    minHeight: 26,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263545',
    backgroundColor: '#111923',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  exampleText: {
    color: '#c8d2dc',
    fontSize: 11,
    fontWeight: '800'
  },
  skillCard: {
    minHeight: 86,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#0b1118',
    padding: 10,
    flexDirection: 'row',
    gap: 10
  },
  skillCardCompact: {
    flex: 1
  },
  skillIconFrame: {
    width: 58,
    height: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334559',
    backgroundColor: '#080c11',
    alignItems: 'center',
    justifyContent: 'center'
  },
  skillIcon: {
    width: 50,
    height: 50
  },
  skillFallback: {
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111923'
  },
  skillCopy: {
    flex: 1,
    gap: 5
  },
  skillTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
  },
  skillName: {
    flex: 1,
    color: '#f0a6f6',
    fontSize: 16,
    fontWeight: '900'
  },
  cooldown: {
    color: '#55b9ff',
    fontSize: 11,
    fontWeight: '900'
  },
  skillDesc: {
    color: '#dbe4ee',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700'
  },
  skillExpansion: {
    color: '#f3d65f',
    fontSize: 11,
    fontWeight: '900'
  },
  skillUnlockNote: {
    color: '#9aa7b5',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
    marginTop: 2
  },
  loadoutPanel: {
    backgroundColor: '#090d12',
    borderColor: '#5a6674'
  },
  loadoutHeader: {
    minHeight: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#5a6674',
    backgroundColor: '#05080c',
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  loadoutHeaderBadge: {
    color: '#f3d65f',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  loadoutMatrix: {
    gap: 9,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#202832',
    backgroundColor: '#05080c',
    padding: 10
  },
  loadoutMatrixRow: {
    minHeight: 74,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'stretch'
  },
  loadoutRowLabel: {
    width: 104,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#302a27',
    backgroundColor: '#1a1413',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  loadoutRowLabelActive: {
    borderColor: '#d2453f',
    backgroundColor: '#291514'
  },
  loadoutRowLabelText: {
    color: '#f2554f',
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  loadoutRowLabelTextActive: {
    color: '#f3f7fb'
  },
  loadoutTileRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  loadoutTile: {
    width: 64,
    height: 64,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#5a6674',
    backgroundColor: '#05080c',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible'
  },
  loadoutTileActive: {
    borderColor: '#f3f7fb',
    borderWidth: 2,
    backgroundColor: '#0d1920'
  },
  loadoutTileIcon: {
    width: 54,
    height: 54
  },
  loadoutTileFallback: {
    width: 54,
    height: 54,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111923'
  },
  iconFallbackText: {
    color: '#f3f7fb',
    fontSize: 12,
    fontWeight: '900'
  },
  loadoutTileInset: {
    position: 'absolute',
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
    borderWidth: 1,
    borderColor: '#111923'
  },
  loadoutTileDim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.18)'
  },
  loadoutTileGlow: {
    position: 'absolute',
    top: 3,
    right: 3,
    bottom: 3,
    left: 3,
    borderWidth: 1,
    borderColor: '#55f5ff'
  },
  loadoutTileDiamond: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#f3d65f',
    borderWidth: 1,
    borderColor: '#080c11',
    position: 'absolute',
    bottom: -5,
    transform: [{ rotate: '45deg' }]
  },
  skinSwatch: {
    width: 46,
    height: 38,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334559',
    flexDirection: 'row'
  },
  skinSwatchA: {
    flex: 1,
    backgroundColor: '#6b6624'
  },
  skinSwatchB: {
    flex: 1,
    backgroundColor: '#39c7c2'
  },
  skinTileText: {
    color: '#dbe4ee',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 3
  },
  loadoutDetailPanel: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#5a6674',
    backgroundColor: '#05080c',
    padding: 12,
    gap: 7
  },
  loadoutDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  loadoutDetailTitle: {
    flex: 1,
    color: '#f3f7fb',
    fontSize: 17,
    fontWeight: '900'
  },
  loadoutDetailBadge: {
    color: '#f3d65f',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  loadoutDetailSlot: {
    color: '#f2554f',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  loadoutDetailText: {
    color: '#dbe4ee',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700'
  },
  requirementBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4b4322',
    backgroundColor: '#15120f',
    padding: 10,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start'
  },
  requirementText: {
    flex: 1,
    color: '#c8d2dc',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700'
  },
  unlockGuideBox: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#26445a',
    backgroundColor: '#0d1821',
    padding: 10,
    gap: 8
  },
  unlockGuideTitle: {
    color: '#55b9ff',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  unlockGuideRow: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'flex-start'
  },
  unlockGuideText: {
    flex: 1,
    color: '#dbe4ee',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700'
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyTitle: {
    color: '#f3f7fb',
    fontSize: 18,
    fontWeight: '900'
  }
});
