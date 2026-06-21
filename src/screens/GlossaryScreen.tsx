import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  allGlossaryEntries,
  type GlossaryCategory,
  type GlossaryDifficulty,
  type GlossaryEntry
} from '../data/glossary';
import { findItemByName, type ItemRecord } from '../data/items';
import { surfaceShadow } from '../styles';
import { uniqueToggle } from '../utils/catalog';

const categoryLabels: Record<GlossaryCategory, string> = {
  RUN_FLOW: 'Run Flow',
  DAMAGE_COMBAT: 'Damage',
  PROC_ITEM_TRIGGERING: 'Proc',
  DEFENSE_SURVIVAL: 'Defense',
  SCALING_DIFFICULTY: 'Scaling',
  ITEMS_EQUIPMENT: 'Items',
  ECONOMY_INTERACTABLES: 'Economy',
  STATUS_EFFECTS: 'Status',
  ARTIFACTS_UNLOCKS: 'Unlocks',
  ADVANCED_SYSTEMS: 'Advanced'
};

const difficultyLabels: Record<GlossaryDifficulty, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced'
};

const filterOptions = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'STATUS_EFFECTS',
  'ECONOMY_INTERACTABLES',
  'PROC_ITEM_TRIGGERING',
  'DEFENSE_SURVIVAL',
  'RUN_FLOW',
  'ITEMS_EQUIPMENT'
] as const;
type GlossaryFilter = (typeof filterOptions)[number];

export function GlossaryScreen({
  selectedEntryId,
  onSelectedEntryHandled,
  onOpenItem
}: {
  selectedEntryId?: string | null;
  onSelectedEntryHandled?: () => void;
  onOpenItem: (item: ItemRecord) => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<GlossaryFilter[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(allGlossaryEntries[0]?.id ?? null);

  useEffect(() => {
    if (!selectedEntryId) {
      return;
    }

    const entry = allGlossaryEntries.find((candidate) => candidate.id === selectedEntryId);
    if (!entry) {
      onSelectedEntryHandled?.();
      return;
    }

    setQuery('');
    setSelectedFilters([]);
    setExpandedId(entry.id);
    onSelectedEntryHandled?.();
  }, [onSelectedEntryHandled, selectedEntryId]);

  const filteredEntries = useMemo(() => {
    return allGlossaryEntries.filter((entry) => {
      const filterMatch =
        selectedFilters.length === 0 ||
        selectedFilters.every((filter) => entry.difficulty === filter || entry.category === filter);

      return filterMatch && glossarySearchMatches(entry, query);
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
            placeholder="Search glossary terms, items, mechanics"
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
              onPress={() => setSelectedFilters((current) => uniqueToggle(current, filter) as GlossaryFilter[])}
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
        <Text style={screenStyles.resultCount}>{filteredEntries.length} terms</Text>
        {hasActiveFilters ? (
          <Pressable accessibilityRole="button" onPress={clearFilters} style={screenStyles.clearButton}>
            <Ionicons name="close" size={14} color="#dbe4ee" />
            <Text style={screenStyles.clearText}>Clear</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={screenStyles.listContent}>
        {filteredEntries.length === 0 ? (
          <View style={screenStyles.emptyPanel}>
            <Text style={screenStyles.emptyTitle}>No glossary terms found</Text>
            <Text style={screenStyles.emptyText}>Try another mechanic, item, survivor, or difficulty filter.</Text>
          </View>
        ) : (
          filteredEntries.map((entry) => (
            <GlossaryCard
              key={entry.id}
              entry={entry}
              expanded={expandedId === entry.id}
              onPress={() => setExpandedId((current) => (current === entry.id ? null : entry.id))}
              onOpenItem={onOpenItem}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function GlossaryCard({
  entry,
  expanded,
  onPress,
  onOpenItem
}: {
  entry: GlossaryEntry;
  expanded: boolean;
  onPress: () => void;
  onOpenItem: (item: ItemRecord) => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[screenStyles.card, expanded && screenStyles.cardExpanded]}>
      <View style={screenStyles.cardHeader}>
        <View style={screenStyles.titleBlock}>
          <Text style={screenStyles.cardTitle}>{entry.term}</Text>
          <View style={screenStyles.metaRow}>
            <Badge label={categoryLabels[entry.category]} tone="blue" />
            <Badge label={difficultyLabels[entry.difficulty]} tone={entry.difficulty === 'ADVANCED' ? 'gold' : 'neutral'} />
          </View>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#8b98a5" />
      </View>

      <Text style={screenStyles.shortDefinition}>{entry.shortDefinition}</Text>

      {expanded ? (
        <View style={screenStyles.expandedBody}>
          <InfoBlock title="Plain English" body={entry.plainEnglish} />
          <InfoBlock title="Why It Matters" body={entry.whyItMatters} />
          <InfoBlock title="What To Do" body={entry.playerAction} highlight />
          <StatBlock rows={entry.statRows} />
          <RelatedBlock entry={entry} onOpenItem={onOpenItem} />
        </View>
      ) : null}
    </Pressable>
  );
}

function StatBlock({ rows }: { rows?: string[] }) {
  if (!rows?.length) {
    return null;
  }

  return (
    <View style={screenStyles.statBlock}>
      <Text style={screenStyles.sectionTitle}>Base Boss Stats</Text>
      <View style={screenStyles.statRows}>
        {rows.map((row) => (
          <Text key={row} style={screenStyles.statRowText}>
            {row}
          </Text>
        ))}
      </View>
    </View>
  );
}

function InfoBlock({ title, body, highlight }: { title: string; body: string; highlight?: boolean }) {
  return (
    <View style={[screenStyles.infoBlock, highlight && screenStyles.infoBlockHighlight]}>
      <Text style={[screenStyles.sectionTitle, highlight && screenStyles.sectionTitleHighlight]}>{title}</Text>
      <Text style={screenStyles.detailText}>{body}</Text>
    </View>
  );
}

function RelatedBlock({ entry, onOpenItem }: { entry: GlossaryEntry; onOpenItem: (item: ItemRecord) => void }) {
  return (
    <View style={screenStyles.relatedPanel}>
      <Text style={screenStyles.relatedTitle}>Related</Text>
      <ChipGroup label="Items" entries={entry.relatedItems} onOpenItem={onOpenItem} />
      <ChipGroup label="Survivors" entries={entry.relatedSurvivors} />
      <ChipGroup label="Mechanics" entries={entry.relatedMechanics} />
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
  if (entries.length === 0) {
    return null;
  }

  return (
    <View style={screenStyles.chipGroup}>
      <Text style={screenStyles.chipGroupLabel}>{label}</Text>
      <View style={screenStyles.chipWrap}>
        {entries.map((entry) => {
          const item = label === 'Items' ? findItemByName(entry) : null;
          const chipContent = <Text style={screenStyles.inlineChipText}>{entry}</Text>;

          return item && onOpenItem ? (
            <Pressable
              key={`${label}:${entry}`}
              accessibilityRole="button"
              onPress={() => onOpenItem(item)}
              style={[screenStyles.inlineChip, screenStyles.inlineChipLinked]}
            >
              {chipContent}
            </Pressable>
          ) : (
            <View key={`${label}:${entry}`} style={screenStyles.inlineChip}>
              {chipContent}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function Badge({ label, tone }: { label: string; tone: 'blue' | 'gold' | 'neutral' }) {
  return (
    <View style={[screenStyles.badge, tone === 'blue' && screenStyles.badgeBlue, tone === 'gold' && screenStyles.badgeGold]}>
      <Text style={[screenStyles.badgeText, tone === 'gold' && screenStyles.badgeTextGold]}>{label}</Text>
    </View>
  );
}

function glossarySearchMatches(entry: GlossaryEntry, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  return [
    entry.term,
    entry.category,
    entry.difficulty,
    entry.shortDefinition,
    entry.plainEnglish,
    entry.whyItMatters,
    entry.playerAction,
    ...entry.relatedItems,
    ...entry.relatedSurvivors,
    ...entry.relatedMechanics,
    ...entry.tags
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery);
}

function formatFilter(filter: GlossaryFilter) {
  if (filter === 'BEGINNER') return 'Beginner';
  if (filter === 'INTERMEDIATE') return 'Intermediate';
  if (filter === 'ADVANCED') return 'Advanced';
  return categoryLabels[filter];
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
    justifyContent: 'center'
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
  expandedBody: {
    borderTopWidth: 1,
    borderTopColor: '#253241',
    paddingTop: 10,
    gap: 10
  },
  infoBlock: {
    gap: 4
  },
  infoBlockHighlight: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#0b1118',
    padding: 10
  },
  sectionTitle: {
    color: '#f0a6f6',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  sectionTitleHighlight: {
    color: '#f3d65f'
  },
  detailText: {
    color: '#c8d2dc',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700'
  },
  statBlock: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#0b1118',
    padding: 10,
    gap: 8
  },
  statRows: {
    gap: 5
  },
  statRowText: {
    color: '#c8d2dc',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700'
  },
  relatedPanel: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#253241',
    paddingTop: 10
  },
  relatedTitle: {
    color: '#f3f7fb',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase'
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
