import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { shrineCategories, shrines, type ShrineCategory, type ShrineRecord, type ShrineScope } from '../data/shrines';
import { shrineImageSources } from '../data/shrineImageSources';
import { surfaceShadow } from '../styles';
import { uniqueToggle } from '../utils/catalog';

const categoryLabels: Record<ShrineCategory, string> = {
  reward: 'Reward',
  risk: 'Risk',
  combat: 'Combat',
  utility: 'Utility',
  healing: 'Healing'
};

const categoryIcons: Record<ShrineCategory, keyof typeof Ionicons.glyphMap> = {
  reward: 'gift',
  risk: 'warning',
  combat: 'skull',
  utility: 'shuffle',
  healing: 'medkit'
};

const scopeLabels: Record<ShrineScope, string> = {
  base: 'Base Game',
  dlc: 'Expansion'
};

type ShrineFilter = ShrineCategory | ShrineScope;
const filterOptions: ShrineFilter[] = ['base', ...shrineCategories, 'dlc'];

export function ShrinesScreen() {
  const [query, setQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<ShrineFilter[]>(['base']);
  const [expandedId, setExpandedId] = useState<string | null>(shrines[0]?.id ?? null);

  const filteredShrines = useMemo(() => {
    return shrines.filter((shrine) => {
      const filterMatch =
        selectedFilters.length === 0 ||
        selectedFilters.every((filter) => shrine.category === filter || shrine.scope === filter);

      return filterMatch && shrineSearchMatches(shrine, query);
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
            placeholder="Search shrines, costs, rewards"
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
              onPress={() => setSelectedFilters((current) => toggleShrineFilter(current, filter))}
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
        <Text style={screenStyles.resultCount}>{filteredShrines.length} shrines</Text>
        {hasActiveFilters ? (
          <Pressable accessibilityRole="button" onPress={clearFilters} style={screenStyles.clearButton}>
            <Ionicons name="close" size={14} color="#dbe4ee" />
            <Text style={screenStyles.clearText}>Clear</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={screenStyles.listContent}>
        {filteredShrines.length === 0 ? (
          <View style={screenStyles.emptyPanel}>
            <Text style={screenStyles.emptyTitle}>No shrines found</Text>
            <Text style={screenStyles.emptyText}>Adjust the filters or search another shrine name, cost, or effect.</Text>
          </View>
        ) : (
          filteredShrines.map((shrine) => (
            <ShrineCard
              key={shrine.id}
              shrine={shrine}
              expanded={expandedId === shrine.id}
              onPress={() => setExpandedId((current) => (current === shrine.id ? null : shrine.id))}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function ShrineCard({ shrine, expanded, onPress }: { shrine: ShrineRecord; expanded: boolean; onPress: () => void }) {
  const imageSource = shrineImageSources[shrine.image];

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[screenStyles.card, expanded && screenStyles.cardExpanded]}>
      <View style={screenStyles.cardHeader}>
        {imageSource ? (
          <View style={screenStyles.shrineImageFrame}>
            <Image source={imageSource} style={screenStyles.shrineImage} resizeMode="cover" />
          </View>
        ) : (
          <View style={screenStyles.shrineImageFrame}>
            <View style={screenStyles.shrineFallback}>
              <Ionicons name={categoryIcons[shrine.category]} size={18} color="#55b9ff" />
              <Text style={screenStyles.shrineFallbackText}>{initials(shrine.name)}</Text>
            </View>
          </View>
        )}
        <View style={screenStyles.titleBlock}>
          <Text style={screenStyles.cardTitle}>{shrine.name}</Text>
          <View style={screenStyles.metaRow}>
            <Badge icon={categoryIcons[shrine.category]} label={categoryLabels[shrine.category]} tone="blue" />
            <Badge label={scopeLabels[shrine.scope]} tone={shrine.scope === 'dlc' ? 'gold' : 'neutral'} />
            <Badge label={formatSourceStatus(shrine.sourceStatus)} tone={shrine.sourceStatus === 'needs-review' ? 'gold' : 'blue'} />
          </View>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#8b98a5" />
      </View>

      <Text style={screenStyles.summary}>{shrine.summary}</Text>

      <View style={screenStyles.factGrid}>
        <Fact label="Cost" value={shrine.cost} />
        <Fact label="Result" value={shrine.result} />
      </View>

      {expanded ? (
        <View style={screenStyles.expandedBody}>
          <View style={screenStyles.tipBox}>
            <Text style={screenStyles.tipLabel}>Run Tip</Text>
            <Text style={screenStyles.tipText}>{shrine.runTip}</Text>
          </View>
          <View style={screenStyles.tagWrap}>
            {shrine.tags.map((tag) => (
              <View key={tag} style={screenStyles.inlineChip}>
                <Text style={screenStyles.inlineChipText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </Pressable>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={screenStyles.factBox}>
      <Text style={screenStyles.factLabel}>{label}</Text>
      <Text style={screenStyles.factText}>{value}</Text>
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

function shrineSearchMatches(shrine: ShrineRecord, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  return [
    shrine.name,
    shrine.category,
    shrine.scope,
    shrine.summary,
    shrine.cost,
    shrine.result,
    shrine.runTip,
    ...shrine.tags
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery);
}

function formatFilter(filter: ShrineFilter) {
  if (filter === 'base') return 'Base';
  if (filter === 'dlc') return 'Expansions';
  return categoryLabels[filter];
}

function formatSourceStatus(status: ShrineRecord['sourceStatus']) {
  return status.replace(/-/g, ' ');
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((part) => part !== 'of' && part !== 'the')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function toggleShrineFilter(current: ShrineFilter[], filter: ShrineFilter): ShrineFilter[] {
  if (filter === 'base' || filter === 'dlc') {
    return current.includes(filter) ? [] : [filter, ...current.filter((entry) => entry !== 'base' && entry !== 'dlc')];
  }

  return uniqueToggle(current, filter) as ShrineFilter[];
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
  shrineImageFrame: {
    width: 74,
    height: 96,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#0b1118',
    overflow: 'hidden'
  },
  shrineImage: {
    width: '100%',
    height: '100%'
  },
  shrineFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: '#111b26'
  },
  shrineFallbackText: {
    color: '#dbe4ee',
    fontSize: 12,
    fontWeight: '900'
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
  summary: {
    color: '#dbe4ee',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700'
  },
  factGrid: {
    gap: 8
  },
  factBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#0b1118',
    padding: 10,
    gap: 4
  },
  factLabel: {
    color: '#7f8c99',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  factText: {
    color: '#f3f7fb',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800'
  },
  expandedBody: {
    borderTopWidth: 1,
    borderTopColor: '#253241',
    paddingTop: 10,
    gap: 10
  },
  tipBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#0b1118',
    padding: 10,
    gap: 4
  },
  tipLabel: {
    color: '#f3d65f',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  tipText: {
    color: '#f3f7fb',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800'
  },
  tagWrap: {
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
    color: '#dbe4ee',
    fontSize: 18,
    fontWeight: '900'
  },
  emptyText: {
    color: '#9aa7b5',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700'
  }
});
