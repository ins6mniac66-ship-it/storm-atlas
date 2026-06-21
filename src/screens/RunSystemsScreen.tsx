import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  combatMechanics,
  type CombatMechanic,
  type CombatMechanicCategory,
  type CombatMechanicImportance
} from '../data/combatMechanics';
import { findItemByName, type ItemRecord } from '../data/items';
import { surfaceShadow } from '../styles';
import { uniqueToggle } from '../utils/catalog';

const categoryLabels: Record<CombatMechanicCategory, string> = {
  proc: 'Proc',
  damage: 'Damage',
  scaling: 'Scaling',
  status: 'Status',
  items: 'Items',
  'survivor-tech': 'Survivor Tech',
  'run-planning': 'Run Planning'
};

const categoryIcons: Record<CombatMechanicCategory, keyof typeof Ionicons.glyphMap> = {
  proc: 'flash',
  damage: 'skull',
  scaling: 'trending-up',
  status: 'pulse',
  items: 'cube',
  'survivor-tech': 'person',
  'run-planning': 'map'
};

const importanceLabels: Record<CombatMechanicImportance, string> = {
  basic: 'Basic',
  important: 'Important',
  advanced: 'Advanced'
};

const filterOptions = ['basic', 'important', 'advanced', 'proc', 'damage', 'scaling', 'status', 'items', 'run-planning'] as const;
type RunSystemFilter = (typeof filterOptions)[number];

export function RunSystemsScreen({
  selectedMechanicId,
  onSelectedMechanicHandled,
  onOpenItem
}: {
  selectedMechanicId?: string | null;
  onSelectedMechanicHandled?: () => void;
  onOpenItem: (item: ItemRecord) => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<RunSystemFilter[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(selectedMechanicId ?? combatMechanics[0]?.id ?? null);

  useEffect(() => {
    if (!selectedMechanicId) {
      return;
    }

    setExpandedId(selectedMechanicId);
    onSelectedMechanicHandled?.();
  }, [onSelectedMechanicHandled, selectedMechanicId]);

  const filteredMechanics = useMemo(() => {
    return combatMechanics.filter((mechanic) => {
      const filterMatch =
        selectedFilters.length === 0 ||
        selectedFilters.every((filter) => mechanic.importanceLevel === filter || mechanic.category === filter);

      return filterMatch && mechanicSearchMatches(mechanic, query);
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
            placeholder="Search systems, items, survivors"
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
              onPress={() => setSelectedFilters((current) => uniqueToggle(current, filter) as RunSystemFilter[])}
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
        <Text style={screenStyles.resultCount}>{filteredMechanics.length} systems</Text>
        {hasActiveFilters ? (
          <Pressable accessibilityRole="button" onPress={clearFilters} style={screenStyles.clearButton}>
            <Ionicons name="close" size={14} color="#dbe4ee" />
            <Text style={screenStyles.clearText}>Clear</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={screenStyles.listContent}>
        {filteredMechanics.length === 0 ? (
          <View style={screenStyles.emptyPanel}>
            <Text style={screenStyles.emptyTitle}>No systems found</Text>
            <Text style={screenStyles.emptyText}>Adjust the filters or search another item, survivor, or mechanic tag.</Text>
          </View>
        ) : (
          filteredMechanics.map((mechanic) => (
            <MechanicCard
              key={mechanic.id}
              mechanic={mechanic}
              expanded={expandedId === mechanic.id}
              onPress={() => setExpandedId((current) => (current === mechanic.id ? null : mechanic.id))}
              onOpenItem={onOpenItem}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function MechanicCard({
  mechanic,
  expanded,
  onPress,
  onOpenItem
}: {
  mechanic: CombatMechanic;
  expanded: boolean;
  onPress: () => void;
  onOpenItem: (item: ItemRecord) => void;
}) {
  return (
    <View style={[screenStyles.card, expanded && screenStyles.cardExpanded]}>
      <Pressable accessibilityRole="button" onPress={onPress} style={screenStyles.cardHeader}>
        <View style={screenStyles.titleBlock}>
          <Text style={screenStyles.cardTitle}>{mechanic.title}</Text>
          <View style={screenStyles.metaRow}>
            <Badge icon={categoryIcons[mechanic.category]} label={categoryLabels[mechanic.category]} tone="blue" />
            <Badge label={importanceLabels[mechanic.importanceLevel]} tone={mechanic.importanceLevel === 'advanced' ? 'gold' : 'neutral'} />
          </View>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#8b98a5" />
      </Pressable>

      <Text style={screenStyles.shortDefinition}>{mechanic.shortDefinition}</Text>

      {mechanic.relatedItems.length > 0 ? (
        <ChipGroup label="Related" entries={mechanic.relatedItems.slice(0, 6)} onOpenItem={onOpenItem} />
      ) : null}

      <View style={screenStyles.takeawayBox}>
        <Text style={screenStyles.takeawayLabel}>Quick Takeaway</Text>
        <Text style={screenStyles.takeawayText}>{mechanic.quickTakeaway}</Text>
      </View>

      {expanded ? (
        <View style={screenStyles.expandedBody}>
          <Text style={screenStyles.detailText}>{mechanic.detailedExplanation}</Text>
          <BulletGroup title="Examples" entries={mechanic.examples} icon="radio" />
          <BulletGroup title="Common Misunderstandings" entries={mechanic.commonMisunderstandings} icon="alert-circle" />
          <BulletGroup title="Tactical Use" entries={mechanic.tacticalUse} icon="navigate-circle" />
        </View>
      ) : null}
    </View>
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

function ChipGroup({
  label,
  entries,
  onOpenItem
}: {
  label: string;
  entries: string[];
  onOpenItem?: (item: ItemRecord) => void;
}) {
  return (
    <View style={screenStyles.chipGroup}>
      <Text style={screenStyles.chipGroupLabel}>{label}</Text>
      <View style={screenStyles.chipWrap}>
        {entries.map((entry) => {
          const item = findItemByName(entry);
          const chipContent = <Text style={screenStyles.inlineChipText}>{entry}</Text>;

          return item && onOpenItem ? (
            <Pressable
              key={entry}
              accessibilityRole="button"
              onPress={() => onOpenItem(item)}
              style={[screenStyles.inlineChip, screenStyles.inlineChipLinked]}
            >
              {chipContent}
            </Pressable>
          ) : (
            <View key={entry} style={screenStyles.inlineChip}>
              {chipContent}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function BulletGroup({
  title,
  entries,
  icon
}: {
  title: string;
  entries: string[];
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={screenStyles.bulletGroup}>
      <Text style={screenStyles.bulletTitle}>{title}</Text>
      {entries.map((entry) => (
        <View key={entry} style={screenStyles.bulletRow}>
          <Ionicons name={icon} size={14} color="#55b9ff" />
          <Text style={screenStyles.bulletText}>{entry}</Text>
        </View>
      ))}
    </View>
  );
}

function mechanicSearchMatches(mechanic: CombatMechanic, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  return [
    mechanic.title,
    mechanic.shortDefinition,
    mechanic.detailedExplanation,
    mechanic.quickTakeaway,
    mechanic.category,
    mechanic.importanceLevel,
    ...mechanic.tags,
    ...mechanic.relatedItems,
    ...mechanic.relatedSurvivors,
    ...mechanic.examples,
    ...mechanic.commonMisunderstandings,
    ...mechanic.tacticalUse
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery);
}

function formatFilter(filter: RunSystemFilter) {
  if (filter === 'basic') return 'Basic';
  if (filter === 'important') return 'Important';
  if (filter === 'advanced') return 'Advanced';
  if (filter === 'proc') return 'Proc';
  if (filter === 'damage') return 'Damage';
  if (filter === 'scaling') return 'Scaling';
  if (filter === 'status') return 'Status';
  if (filter === 'run-planning') return 'Run Planning';
  return 'Items';
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
    fontSize: 13,
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
    fontWeight: '900'
  },
  listContent: {
    paddingBottom: 116,
    gap: 11
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0f1720',
    padding: 12,
    gap: 10,
    ...surfaceShadow
  },
  cardExpanded: {
    borderColor: '#335674',
    backgroundColor: '#111923'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  titleBlock: {
    flex: 1,
    gap: 7
  },
  cardTitle: {
    color: '#f3f7fb',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7
  },
  badge: {
    minHeight: 26,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263545',
    backgroundColor: '#0d131b',
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5
  },
  badgeBlue: {
    borderColor: '#26445a',
    backgroundColor: '#0d1821'
  },
  badgeGold: {
    borderColor: '#4b4322',
    backgroundColor: '#15120f'
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
  shortDefinition: {
    color: '#dbe4ee',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700'
  },
  chipGroup: {
    gap: 6
  },
  chipGroupLabel: {
    color: '#7f8c99',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  inlineChip: {
    minHeight: 26,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263545',
    backgroundColor: '#0b1118',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  inlineChipLinked: {
    borderColor: '#26445a',
    backgroundColor: '#0d1821'
  },
  inlineChipText: {
    color: '#c8d2dc',
    fontSize: 11,
    fontWeight: '800'
  },
  takeawayBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#0b1118',
    padding: 10,
    gap: 4
  },
  takeawayLabel: {
    color: '#f3d65f',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  takeawayText: {
    color: '#f3f7fb',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800'
  },
  expandedBody: {
    borderTopWidth: 1,
    borderTopColor: '#253241',
    paddingTop: 10,
    gap: 11
  },
  detailText: {
    color: '#c8d2dc',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700'
  },
  bulletGroup: {
    gap: 7
  },
  bulletTitle: {
    color: '#f0a6f6',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7
  },
  bulletText: {
    flex: 1,
    color: '#dbe4ee',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700'
  },
  emptyPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0f1720',
    padding: 18,
    gap: 6,
    ...surfaceShadow
  },
  emptyTitle: {
    color: '#f3f7fb',
    fontSize: 18,
    fontWeight: '900'
  },
  emptyText: {
    color: '#9aa7b5',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700'
  }
});
