import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { IconImage } from '../components/IconImage';
import {
  equipment,
  equipmentRoles,
  getEquipmentIcon,
  equipmentSearchMatches,
  getEquipmentExpansionLabel,
  getEquipmentScope,
  type EquipmentRecord,
  type EquipmentRole
} from '../data/equipment';
import type { ContentScope } from '../data/expansions';
import { surfaceShadow } from '../styles';
import { uniqueToggle } from '../utils/catalog';

type ScopeFilter = ContentScope | 'all';

const roleColors: Record<EquipmentRole, string> = {
  Burst: '#ff6b6b',
  Healing: '#80e6a2',
  Utility: '#55b9ff',
  Mobility: '#f3d65f',
  Control: '#c77dff',
  Economy: '#f4a261',
  Risk: '#ff8fab'
};

const scopeOptions: ScopeFilter[] = ['all', 'base', 'expansion'];

export function EquipmentScreen() {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<ScopeFilter>('all');
  const [selectedRoles, setSelectedRoles] = useState<EquipmentRole[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(equipment[0]?.id ?? null);

  const filteredEquipment = useMemo(() => {
    return equipment.filter((entry) => {
      const scopeMatch = scope === 'all' || getEquipmentScope(entry) === scope;
      const roleMatch = selectedRoles.length === 0 || selectedRoles.includes(entry.role);
      return scopeMatch && roleMatch && equipmentSearchMatches(entry, query);
    });
  }, [query, scope, selectedRoles]);

  const hasActiveFilters = query.trim().length > 0 || scope !== 'all' || selectedRoles.length > 0;

  function clearFilters() {
    setQuery('');
    setScope('all');
    setSelectedRoles([]);
  }

  return (
    <View style={screenStyles.body}>
      <View style={screenStyles.controls}>
        <View style={screenStyles.heroPanel}>
          <View style={screenStyles.heroIcon}>
            <Ionicons name="flash" size={22} color="#f3d65f" />
          </View>
          <View style={screenStyles.heroCopy}>
            <Text style={screenStyles.heroTitle}>Equipment</Text>
            <Text style={screenStyles.heroText}>
              Active-use tools for burst, sustain, routing, crowd control, and economy decisions.
            </Text>
          </View>
          <View style={screenStyles.countPill}>
            <Text style={screenStyles.countValue}>{equipment.length}</Text>
            <Text style={screenStyles.countLabel}>Entries</Text>
          </View>
        </View>

        <View style={screenStyles.searchRow}>
          <Ionicons name="search" size={18} color="#8b98a5" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search equipment, role, effect"
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
          {scopeOptions.map((option) => (
            <Pressable
              key={option}
              accessibilityRole="button"
              onPress={() => setScope(option)}
              style={[screenStyles.filterChip, scope === option && screenStyles.filterChipActive]}
            >
              <Text style={[screenStyles.filterText, scope === option && screenStyles.filterTextActive]}>
                {formatScope(option)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={screenStyles.filterRow}>
          {equipmentRoles.map((role) => (
            <Pressable
              key={role}
              accessibilityRole="button"
              onPress={() => setSelectedRoles((current) => uniqueToggle(current, role) as EquipmentRole[])}
              style={[
                screenStyles.roleChip,
                selectedRoles.includes(role) && { borderColor: roleColors[role], backgroundColor: `${roleColors[role]}1a` }
              ]}
            >
              <Text style={[screenStyles.roleText, selectedRoles.includes(role) && { color: roleColors[role] }]}>{role}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={screenStyles.resultsHeader}>
        <Text style={screenStyles.resultCount}>{filteredEquipment.length} equipment records</Text>
        {hasActiveFilters ? (
          <Pressable accessibilityRole="button" onPress={clearFilters} style={screenStyles.clearButton}>
            <Ionicons name="close" size={14} color="#dbe4ee" />
            <Text style={screenStyles.clearText}>Clear</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={screenStyles.listContent}>
        {filteredEquipment.length === 0 ? (
          <View style={screenStyles.emptyPanel}>
            <Text style={screenStyles.emptyTitle}>No equipment found</Text>
            <Text style={screenStyles.emptyText}>Adjust source, role, or search terms.</Text>
          </View>
        ) : null}

        {filteredEquipment.map((entry) => (
          <EquipmentCard
            key={entry.id}
            entry={entry}
            expanded={expandedId === entry.id}
            onPress={() => setExpandedId((current) => (current === entry.id ? null : entry.id))}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function EquipmentCard({ entry, expanded, onPress }: { entry: EquipmentRecord; expanded: boolean; onPress: () => void }) {
  const roleColor = roleColors[entry.role];
  const icon = getEquipmentIcon(entry);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[screenStyles.card, expanded && screenStyles.cardExpanded]}>
      <View style={screenStyles.cardHeader}>
        <View style={[screenStyles.initialFrame, { borderColor: `${roleColor}66`, backgroundColor: `${roleColor}14` }]}>
          {icon ? <IconImage source={icon} size={42} label={entry.name} /> : <Text style={[screenStyles.initialText, { color: roleColor }]}>{initials(entry.name)}</Text>}
        </View>
        <View style={screenStyles.titleBlock}>
          <Text style={screenStyles.cardTitle}>{entry.name}</Text>
          <View style={screenStyles.metaRow}>
            <Badge icon="timer" label={entry.cooldown} tone="neutral" />
            <Badge label={entry.role} tone="role" color={roleColor} />
            <Badge label={getEquipmentExpansionLabel(entry)} tone={entry.expansion ? 'gold' : 'neutral'} />
          </View>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#8b98a5" />
      </View>

      <Text style={screenStyles.effectText}>{entry.effect}</Text>

      <View style={screenStyles.runBox}>
        <Text style={screenStyles.runLabel}>Run Use</Text>
        <Text style={screenStyles.runText}>{entry.runUse}</Text>
      </View>

      {expanded ? (
        <View style={screenStyles.expandedBody}>
          {entry.caution ? (
            <View style={screenStyles.cautionBox}>
              <Ionicons name="warning" size={15} color="#f3d65f" />
              <Text style={screenStyles.cautionText}>{entry.caution}</Text>
            </View>
          ) : null}
          <View style={screenStyles.sourceRow}>
            <Badge label={entry.status} tone="blue" />
            <Text style={screenStyles.sourceText} numberOfLines={1}>
              {entry.sourceUrl.replace('https://', '')}
            </Text>
          </View>
        </View>
      ) : null}
    </Pressable>
  );
}

function Badge({
  icon,
  label,
  tone,
  color
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  tone: 'blue' | 'gold' | 'neutral' | 'role';
  color?: string;
}) {
  const borderColor = tone === 'role' && color ? `${color}66` : tone === 'gold' ? '#5e4e1f' : tone === 'blue' ? '#24455c' : '#2a3644';
  const textColor = tone === 'role' && color ? color : tone === 'gold' ? '#f3d65f' : tone === 'blue' ? '#55b9ff' : '#a8b4c0';

  return (
    <View style={[screenStyles.badge, { borderColor }]}>
      {icon ? <Ionicons name={icon} size={12} color={textColor} /> : null}
      <Text style={[screenStyles.badgeText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

function formatScope(scope: ScopeFilter) {
  if (scope === 'all') return 'All Sources';
  if (scope === 'base') return 'Base Game';
  return 'Expansions';
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

const screenStyles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16
  },
  controls: {
    gap: 11,
    paddingTop: 14,
    paddingBottom: 8
  },
  heroPanel: {
    minHeight: 88,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#273648',
    backgroundColor: '#101720',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    ...surfaceShadow
  },
  heroIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#231d10',
    borderWidth: 1,
    borderColor: '#5e4e1f',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroCopy: {
    flex: 1,
    minWidth: 0
  },
  heroTitle: {
    color: '#f3f7fb',
    fontSize: 18,
    fontWeight: '900'
  },
  heroText: {
    color: '#9aa7b5',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
    fontWeight: '700'
  },
  countPill: {
    minWidth: 58,
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2f445b',
    backgroundColor: '#121f2c',
    alignItems: 'center',
    justifyContent: 'center'
  },
  countValue: {
    color: '#55b9ff',
    fontSize: 17,
    fontWeight: '900'
  },
  countLabel: {
    color: '#7f8c99',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  searchRow: {
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#121a24',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 13
  },
  searchInput: {
    color: '#f3f7fb',
    flex: 1,
    fontSize: 15,
    paddingVertical: 0
  },
  filterRow: {
    gap: 8,
    paddingRight: 16
  },
  filterChip: {
    height: 34,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    paddingHorizontal: 11
  },
  filterChipActive: {
    backgroundColor: '#1a2634',
    borderColor: '#55b9ff'
  },
  filterText: {
    color: '#a8b4c0',
    fontSize: 12,
    fontWeight: '800'
  },
  filterTextActive: {
    color: '#f3f7fb'
  },
  roleChip: {
    height: 34,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    paddingHorizontal: 11
  },
  roleText: {
    color: '#a8b4c0',
    fontSize: 12,
    fontWeight: '900'
  },
  resultsHeader: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  resultCount: {
    color: '#7f8c99',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  clearButton: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a3644',
    paddingHorizontal: 9
  },
  clearText: {
    color: '#dbe4ee',
    fontSize: 11,
    fontWeight: '900'
  },
  listContent: {
    gap: 10,
    paddingBottom: 32
  },
  emptyPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    padding: 14
  },
  emptyTitle: {
    color: '#f3f7fb',
    fontSize: 15,
    fontWeight: '900'
  },
  emptyText: {
    color: '#9aa7b5',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    padding: 12,
    gap: 10
  },
  cardExpanded: {
    borderColor: '#35506a',
    backgroundColor: '#121c27'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  initialFrame: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  initialText: {
    fontSize: 14,
    fontWeight: '900'
  },
  titleBlock: {
    flex: 1,
    minWidth: 0
  },
  cardTitle: {
    color: '#f3f7fb',
    fontSize: 16,
    fontWeight: '900'
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 7
  },
  badge: {
    minHeight: 24,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0d141d'
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  effectText: {
    color: '#dbe4ee',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700'
  },
  runBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#213041',
    backgroundColor: '#0d141d',
    padding: 10
  },
  runLabel: {
    color: '#55b9ff',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  runText: {
    color: '#a8b4c0',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700'
  },
  expandedBody: {
    gap: 9
  },
  cautionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5e4e1f',
    backgroundColor: '#1c170d',
    padding: 10
  },
  cautionText: {
    color: '#e8dca4',
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700'
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  sourceText: {
    color: '#687481',
    flex: 1,
    fontSize: 10,
    fontWeight: '700'
  }
});
