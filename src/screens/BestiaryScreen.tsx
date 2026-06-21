import { Ionicons } from '@expo/vector-icons';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';

import {
  enemies,
  getEnemyExpansionLabel,
  getEnemyIcon,
  getEnemyScope,
  getEnemyTacticalTips,
  getEnemyTags,
  isAllyVariant,
  isBossEnemy,
  isPhaseEnemy,
  type EnemyRecord,
  type EnemyScope
} from '../data/enemies';
import { surfaceShadow } from '../styles';
import { uniqueToggle } from '../utils/catalog';

const typeLabels: Record<string, string> = {
  Normal: 'Normal',
  Boss: 'Boss',
  'Special Boss': 'Special Boss',
  Drone: 'Drone',
  Ally: 'Ally',
  Turret: 'Turret'
};

type EnemyFilter = EnemyScope | 'boss' | 'phase' | 'Normal' | 'Boss' | 'Special Boss' | 'Drone' | 'Ally' | 'Turret';
const filterOptions: EnemyFilter[] = ['base', 'expansion', 'boss', 'phase', 'Normal', 'Boss', 'Special Boss', 'Drone', 'Ally', 'Turret'];

export function BestiaryScreen() {
  const [query, setQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<EnemyFilter[]>(['base']);
  const [expandedEnemyName, setExpandedEnemyName] = useState<string | null>(enemies[0]?.name ?? null);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    const styleId = 'run-atlas-bestiary-image-fix';
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = '.css-accessibilityImage-9pa8cd { opacity: 1 !important; }';
    document.head.appendChild(style);
  }, []);

  const filteredEnemies = useMemo(() => {
    return enemies.filter((enemy) => {
      const filterMatch =
        selectedFilters.length === 0 ||
        selectedFilters.every((filter) => {
          if (filter === 'base') return getEnemyScope(enemy) === 'base';
          if (filter === 'expansion') return getEnemyScope(enemy) === 'expansion';
          if (filter === 'boss') return isBossEnemy(enemy);
          if (filter === 'phase') return isPhaseEnemy(enemy);
          return enemy.type === filter;
        });

      return filterMatch && enemySearchMatches(enemy, query);
    });
  }, [query, selectedFilters]);

  const hasActiveFilters = query.trim().length > 0 || selectedFilters.length > 0;

  function clearFilters() {
    setQuery('');
    setSelectedFilters([]);
  }

  return (
    <View style={screenStyles.body}>
      <View style={screenStyles.controls}>
        <View style={screenStyles.searchRow}>
          <Ionicons name="search" size={18} color="#8b98a5" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search enemies, bosses, drones, classes"
            placeholderTextColor="#687481"
            style={screenStyles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query ? (
            <Pressable accessibilityRole="button" onPress={() => setQuery('')} hitSlop={12}>
              <Ionicons name="close-circle" size={18} color="#8b98a5" />
            </Pressable>
          ) : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={screenStyles.filterRow}>
          {filterOptions.map((filter) => (
            <Pressable
              key={filter}
              accessibilityRole="button"
              onPress={() => setSelectedFilters((current) => toggleEnemyFilter(current, filter))}
              style={[screenStyles.filterChip, selectedFilters.includes(filter) && screenStyles.filterChipActive]}
            >
              <Text style={[screenStyles.filterText, selectedFilters.includes(filter) && screenStyles.filterTextActive]}>
                {formatFilter(filter)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={screenStyles.resultsHeader}>
        <Text style={screenStyles.resultCount}>{filteredEnemies.length} records</Text>
        {hasActiveFilters ? (
          <Pressable accessibilityRole="button" onPress={clearFilters} style={screenStyles.clearButton}>
            <Ionicons name="close" size={14} color="#dbe4ee" />
            <Text style={screenStyles.clearText}>Clear</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={screenStyles.listContent}>
        {filteredEnemies.length === 0 ? (
          <View style={screenStyles.emptyPanel}>
            <Text style={screenStyles.emptyTitle}>No bestiary records found</Text>
            <Text style={screenStyles.emptyText}>Adjust filters or search another enemy, boss, class, or expansion.</Text>
          </View>
        ) : null}

        {filteredEnemies.map((enemy) => (
          <EnemyCard
            key={enemy.name}
            enemy={enemy}
            expanded={expandedEnemyName === enemy.name}
            onPress={() => setExpandedEnemyName((current) => (current === enemy.name ? null : enemy.name))}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function EnemyCard({ enemy, expanded, onPress }: { enemy: EnemyRecord; expanded: boolean; onPress: () => void }) {
  const icon = getEnemyIcon(enemy);
  const tags = getEnemyTags(enemy);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[screenStyles.card, expanded && screenStyles.cardExpanded]}>
      <View style={screenStyles.cardHeader}>
        <View style={screenStyles.portraitFrame}>
          {icon ? (
            <Image source={icon} style={screenStyles.portrait} resizeMode="contain" />
          ) : (
            <View style={screenStyles.portraitFallback}>
              <Text style={screenStyles.portraitFallbackText}>{enemy.name.slice(0, 2).toUpperCase()}</Text>
            </View>
          )}
        </View>

        <View style={screenStyles.titleBlock}>
          <Text style={screenStyles.cardTitle}>{enemy.name}</Text>
          <View style={screenStyles.metaRow}>
            <Badge icon={isBossEnemy(enemy) ? 'skull' : 'bug'} label={enemy.type ?? 'Unknown'} tone="blue" />
            <Badge label={getEnemyExpansionLabel(enemy)} tone={enemy.expansion ? 'gold' : 'neutral'} />
            {isPhaseEnemy(enemy) ? <Badge label="Phase Variant" tone="gold" /> : null}
            {isAllyVariant(enemy) ? <Badge label="Ally Variant" tone="neutral" /> : null}
            {enemy.class ? <Badge label={enemy.class} tone="neutral" /> : null}
          </View>
        </View>

        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#8b98a5" />
      </View>

      {enemy.boss_name ? <Text style={screenStyles.subtitle}>{enemy.boss_name}</Text> : null}

      <View style={screenStyles.statGrid}>
        <StatCell label="Health" value={formatScalingStat(enemy.base_health, enemy.scaling_health)} />
        <StatCell label="Damage" value={formatScalingStat(enemy.base_damage, enemy.scaling_damage)} />
        <StatCell label="Armor" value={formatNumber(enemy.base_armor)} />
        <StatCell label="Speed" value={formatNumber(enemy.base_speed)} />
        {enemy.credits_cost !== null ? <StatCell label="Credits" value={formatNumber(enemy.credits_cost)} /> : null}
      </View>

      <View style={screenStyles.tipBox}>
        <Text style={screenStyles.tipLabel}>Run Read</Text>
        <Text style={screenStyles.tipText}>{getEnemyTacticalTips(enemy)[0]}</Text>
      </View>

      {expanded ? (
        <View style={screenStyles.expandedBody}>
          <BulletGroup title="Tactical Notes" entries={getEnemyTacticalTips(enemy)} icon="navigate-circle" />
          <TagWrap tags={tags} />
        </View>
      ) : null}
    </Pressable>
  );
}

function Badge({
  icon,
  label,
  tone
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  tone: 'blue' | 'gold' | 'neutral';
}) {
  return (
    <View style={[screenStyles.badge, tone === 'blue' && screenStyles.badgeBlue, tone === 'gold' && screenStyles.badgeGold]}>
      {icon ? <Ionicons name={icon} size={12} color={tone === 'gold' ? '#f3d65f' : '#55b9ff'} /> : null}
      <Text style={[screenStyles.badgeText, tone === 'gold' && screenStyles.badgeTextGold]}>{label}</Text>
    </View>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={screenStyles.statCell}>
      <Text style={screenStyles.statLabel}>{label}</Text>
      <Text style={screenStyles.statValue}>{value}</Text>
    </View>
  );
}

function BulletGroup({ title, entries, icon }: { title: string; entries: string[]; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={screenStyles.bulletGroup}>
      <Text style={screenStyles.bulletTitle}>{title}</Text>
      {entries.map((entry) => (
        <View key={entry} style={screenStyles.bulletRow}>
          <Ionicons name={icon} size={15} color="#55b9ff" />
          <Text style={screenStyles.bulletText}>{entry}</Text>
        </View>
      ))}
    </View>
  );
}

function TagWrap({ tags }: { tags: string[] }) {
  return (
    <View style={screenStyles.tagWrap}>
      {tags.map((tag) => (
        <View key={tag} style={screenStyles.inlineChip}>
          <Text style={screenStyles.inlineChipText}>{tag}</Text>
        </View>
      ))}
    </View>
  );
}

function enemySearchMatches(enemy: EnemyRecord, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  return [
    enemy.name,
    enemy.type ?? '',
    enemy.class ?? '',
    enemy.boss_name ?? '',
    getEnemyExpansionLabel(enemy),
    ...getEnemyTags(enemy)
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery);
}

function formatFilter(filter: EnemyFilter) {
  if (filter === 'base') return 'Base';
  if (filter === 'expansion') return 'Expansions';
  if (filter === 'boss') return 'Bosses';
  if (filter === 'phase') return 'Phases';
  return typeLabels[filter] ?? filter;
}

function toggleEnemyFilter(current: EnemyFilter[], filter: EnemyFilter): EnemyFilter[] {
  if (filter === 'base' || filter === 'expansion') {
    return current.includes(filter) ? [] : [filter, ...current.filter((entry) => entry !== 'base' && entry !== 'expansion')];
  }

  return uniqueToggle(current, filter) as EnemyFilter[];
}

function formatNumber(value: number | null) {
  return value === null ? 'Unknown' : Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatScalingStat(base: number | null, scaling: number | null) {
  if (base === null && scaling === null) {
    return 'Unknown';
  }

  if (scaling === null) {
    return formatNumber(base);
  }

  return `${formatNumber(base)} + ${formatNumber(scaling)}/lvl`;
}

const screenStyles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16
  },
  controls: {
    gap: 11,
    paddingTop: 14,
    paddingBottom: 10
  },
  searchRow: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#121a24',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 13,
    ...surfaceShadow
  },
  searchInput: {
    color: '#f3f7fb',
    flex: 1,
    fontSize: 16,
    paddingVertical: 0
  },
  filterRow: {
    gap: 8,
    paddingRight: 16
  },
  filterChip: {
    height: 36,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    paddingHorizontal: 12
  },
  filterChipActive: {
    borderColor: '#55b9ff',
    backgroundColor: '#1a2634'
  },
  filterText: {
    color: '#a8b4c0',
    fontSize: 12,
    fontWeight: '800'
  },
  filterTextActive: {
    color: '#f3f7fb'
  },
  resultsHeader: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  resultCount: {
    color: '#9aa7b5',
    fontSize: 13,
    fontWeight: '700'
  },
  clearButton: {
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#111923',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 9
  },
  clearText: {
    color: '#dbe4ee',
    fontSize: 12,
    fontWeight: '800'
  },
  listContent: {
    gap: 10,
    paddingBottom: 18
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1f2c38',
    backgroundColor: '#101720',
    gap: 10,
    padding: 13,
    ...surfaceShadow
  },
  cardExpanded: {
    borderColor: '#31516d',
    backgroundColor: '#111b27'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  portraitFrame: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a3847',
    backgroundColor: '#0b1118',
    alignItems: 'center',
    justifyContent: 'center'
  },
  portrait: {
    width: 48,
    height: 48,
    opacity: 1
  },
  portraitFallback: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  portraitFallbackText: {
    color: '#55b9ff',
    fontSize: 14,
    fontWeight: '900'
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    gap: 7
  },
  cardTitle: {
    color: '#f3f7fb',
    fontSize: 18,
    fontWeight: '900'
  },
  subtitle: {
    color: '#8ea4b8',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  badge: {
    minHeight: 24,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#2a3847',
    backgroundColor: '#151f2a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8
  },
  badgeBlue: {
    borderColor: '#2c5f81',
    backgroundColor: '#13283a'
  },
  badgeGold: {
    borderColor: '#6d5e28',
    backgroundColor: '#282414'
  },
  badgeText: {
    color: '#dbe4ee',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  badgeTextGold: {
    color: '#f3d65f'
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  statCell: {
    minWidth: 92,
    flexGrow: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263544',
    backgroundColor: '#0d141d',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  statLabel: {
    color: '#8ea4b8',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  statValue: {
    color: '#f3f7fb',
    fontSize: 13,
    fontWeight: '900'
  },
  tipBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#29445a',
    backgroundColor: '#122131',
    gap: 5,
    padding: 11
  },
  tipLabel: {
    color: '#55b9ff',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  tipText: {
    color: '#e7eef7',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700'
  },
  expandedBody: {
    gap: 10
  },
  bulletGroup: {
    gap: 7
  },
  bulletTitle: {
    color: '#f3f7fb',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7
  },
  bulletText: {
    color: '#c2ccd6',
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600'
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  inlineChip: {
    minHeight: 26,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#2a3847',
    backgroundColor: '#151f2a',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  inlineChipText: {
    color: '#a8b4c0',
    fontSize: 11,
    fontWeight: '800'
  },
  emptyPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    gap: 6,
    padding: 16
  },
  emptyTitle: {
    color: '#f3f7fb',
    fontSize: 17,
    fontWeight: '900'
  },
  emptyText: {
    color: '#9aa7b5',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600'
  }
});
