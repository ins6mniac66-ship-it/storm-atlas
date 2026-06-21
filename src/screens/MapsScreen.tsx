import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  artifactMechanics,
  maps,
  mapTiers,
  type ArtifactMechanic,
  type MapRecord,
  type MapRouteType,
  type MapScope,
  type MapTier
} from '../data/maps';
import { mapThumbnailSources } from '../data/mapThumbnailSources';
import { surfaceShadow } from '../styles';
import { uniqueToggle } from '../utils/catalog';

const tierLabels: Record<MapTier, string> = {
  'Stage 1': 'Stage 1',
  'Stage 2': 'Stage 2',
  'Stage 3': 'Stage 3',
  'Stage 4': 'Stage 4',
  'Stage 5': 'Stage 5',
  Final: 'Final',
  'Hidden Realm': 'Hidden'
};

const scopeLabels: Record<MapScope, string> = {
  base: 'Base Game',
  dlc: 'Expansion'
};

type MapFilter = MapTier | MapScope | 'artifact';
type MapViewMode = 'route' | 'list';
type RouteSlot = 'stage1' | 'stage2' | 'stage3' | 'stage4' | 'stage5' | 'final' | 'hidden' | 'sotv' | 'sots' | 'ac' | 'loop';
type RouteSelections = Partial<Record<RouteSlot, string>>;
type RouteConclusion =
  | 'mithrix'
  | 'loop'
  | 'obliterate'
  | 'voidling'
  | 'false-son'
  | 'solus-heart'
  | 'artifact-trial'
  | 'legendary-reward'
  | 'huntress-ballista'
  | 'huntress-phase-blink'
  | 'huntress-flurry';
type RouteFilter =
  | 'base'
  | 'sotv'
  | 'sots'
  | 'ac'
  | 'unlocks'
  | 'legendary'
  | 'hidden'
  | 'final'
  | 'loop'
  | 'alternate';
const filterOptions: MapFilter[] = ['base', 'dlc', ...mapTiers, 'artifact'];

const routeFilterOptions: { id: RouteFilter; label: string }[] = [
  { id: 'base', label: 'Base' },
  { id: 'sotv', label: 'SotV' },
  { id: 'sots', label: 'SotS' },
  { id: 'ac', label: 'AC' },
  { id: 'unlocks', label: 'Unlocks' },
  { id: 'legendary', label: 'Legendary reward' },
  { id: 'hidden', label: 'Hidden route' },
  { id: 'final', label: 'Final route' },
  { id: 'loop', label: 'Loop route' },
  { id: 'alternate', label: 'Alternate ending' }
];

const routeStageGroups: { title: string; subtitle: string; note: string; tier: MapTier; mapIds: string[] }[] = [
  {
    title: 'Stage 1 Pool',
    subtitle: 'Run start',
    note: 'One Stage 1 environment appears at run start. DLC stage-pool maps join this random tier roll when enabled.',
    tier: 'Stage 1',
    mapIds: ['titanic-plains', 'distant-roost', 'verdant-falls', 'siphoned-forest', 'shattered-abodes']
  },
  {
    title: 'Stage 2 Pool',
    subtitle: 'Early setup',
    note: 'After the teleporter, the run rolls a Stage 2 map from this tier pool.',
    tier: 'Stage 2',
    mapIds: ['abandoned-aqueduct', 'wetland-aspect', 'aphelian-sanctuary', 'pretenders-precipice']
  },
  {
    title: 'Stage 3 Pool',
    subtitle: 'Unlock check',
    note: 'Huntress Ballista and Piercing Wind only care about Rallypoint Delta or Scorched Acres.',
    tier: 'Stage 3',
    mapIds: ['rallypoint-delta', 'scorched-acres', 'sulfur-pools', 'iron-alluvium']
  },
  {
    title: 'Stage 4 Pool',
    subtitle: 'High-value rewards',
    note: 'Stage 4 is where the strongest map-specific legendary rewards start to matter.',
    tier: 'Stage 4',
    mapIds: ['abyssal-depths', 'sirens-call', 'sundered-grove', 'repurposed-crater']
  }
];

const routeStageSlots: RouteSlot[] = ['stage1', 'stage2', 'stage3', 'stage4'];
const routeSlotLabels: Record<RouteSlot, string> = {
  stage1: 'Stage 1',
  stage2: 'Stage 2',
  stage3: 'Stage 3',
  stage4: 'Stage 4',
  stage5: 'Stage 5',
  final: 'Final',
  hidden: 'Hidden',
  sotv: 'SotV',
  sots: 'SotS',
  ac: 'AC',
  loop: 'Loop'
};

const routeStageFiveMapIds = ['sky-meadow', 'helminth-hatchery'];
const routeFinalMapIds = ['commencement'];
const routeHiddenMapIds = ['bazaar-between-time', 'bulwarks-ambry', 'void-fields', 'gilded-coast'];
const routeVoidMapIds = ['void-locus', 'the-planetarium'];
const routeSotsMapIds = ['reformed-altar', 'treeborn-colony', 'prime-meridian'];
const routeAcMapIds = [
  'access-node',
  'encrypted-portal',
  'conduit-canyon',
  'solutional-haunt',
  'computational-exchange',
  'neural-sanctum'
];
const routeLoopVariantMapIds = ['disturbed-impact', 'viscous-falls', 'iron-auroras'];

const tierAccentColors: Record<MapTier, string> = {
  'Stage 1': '#4fce83',
  'Stage 2': '#55b9ff',
  'Stage 3': '#f4b84d',
  'Stage 4': '#ee6a5f',
  'Stage 5': '#b48cff',
  Final: '#f3d65f',
  'Hidden Realm': '#50d6c7'
};

const routeTypeLabels: Record<MapRouteType, string> = {
  normal: 'Normal route',
  hidden: 'Hidden',
  final: 'Final',
  loop: 'Loop',
  special: 'Special'
};

const routeConclusionOptions: { id: RouteConclusion; label: string; route: string; filters: RouteFilter[] }[] = [
  { id: 'mithrix', label: 'Mithrix', route: 'Sky Meadow -> Commencement', filters: ['base', 'final'] },
  { id: 'loop', label: 'Loop', route: 'Sky Meadow -> Stage 1 pool', filters: ['loop'] },
  { id: 'obliterate', label: 'Obliterate', route: 'Loop -> Celestial Portal', filters: ['loop', 'hidden'] },
  { id: 'voidling', label: 'Voidling', route: 'Void Locus -> Planetarium', filters: ['sotv', 'alternate'] },
  { id: 'false-son', label: 'False Son', route: 'Path of the Colossus', filters: ['sots', 'alternate'] },
  { id: 'solus-heart', label: 'Solus Heart', route: 'Access Node -> Neural Sanctum', filters: ['ac', 'hidden', 'alternate'] },
  { id: 'artifact-trial', label: 'Artifact Trial', route: 'Sky Meadow -> Bulwark Ambry', filters: ['hidden'] },
  { id: 'legendary-reward', label: 'Legendary Reward', route: 'Stage 4 reward maps', filters: ['legendary'] },
  { id: 'huntress-ballista', label: 'Huntress Ballista', route: 'Rallypoint / Scorched flawless', filters: ['unlocks'] },
  { id: 'huntress-phase-blink', label: 'Huntress Phase Blink', route: 'Hold 12 Crowbars', filters: ['unlocks'] },
  { id: 'huntress-flurry', label: 'Huntress Flurry', route: 'Full Laser Glaive kill', filters: ['unlocks'] }
];

export function MapsScreen() {
  const [viewMode, setViewMode] = useState<MapViewMode>('route');
  const [query, setQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<MapFilter[]>(['base']);
  const [selectedRouteFilters, setSelectedRouteFilters] = useState<RouteFilter[]>([]);
  const [selectedConclusions, setSelectedConclusions] = useState<RouteConclusion[]>([]);
  const [routeSelections, setRouteSelections] = useState<RouteSelections>({});
  const [expandedMapId, setExpandedMapId] = useState<string | null>(null);
  const [expandedArtifactId, setExpandedArtifactId] = useState<string | null>(null);

  const filteredMaps = useMemo(() => {
    return maps.filter((map) => {
      const activeFilters = selectedFilters.filter((filter) => filter !== 'artifact');
      const filterMatch =
        activeFilters.length === 0 ||
        activeFilters.every((filter) => map.scope === filter || map.tier === filter);

      return filterMatch && mapSearchMatches(map, query);
    });
  }, [query, selectedFilters]);

  const filteredArtifacts = useMemo(() => {
    if (selectedFilters.length > 0 && !selectedFilters.includes('artifact')) {
      return [];
    }

    return artifactMechanics.filter((artifact) => artifactSearchMatches(artifact, query));
  }, [query, selectedFilters]);

  const hasActiveFilters = query.trim().length > 0 || selectedFilters.length > 0;
  const resultCount = filteredMaps.length + filteredArtifacts.length;

  function clearFilters() {
    setQuery('');
    setSelectedFilters([]);
  }

  return (
    <View style={screenStyles.body}>
      <View style={screenStyles.viewToggle}>
        <SegmentButton label="Route" active={viewMode === 'route'} onPress={() => setViewMode('route')} />
        <SegmentButton label="List" active={viewMode === 'list'} onPress={() => setViewMode('list')} />
      </View>

      {viewMode === 'route' ? (
        <RouteView
          query={query}
          selectedFilters={selectedRouteFilters}
          selectedConclusions={selectedConclusions}
          onQueryChange={setQuery}
          onToggleFilter={(filter) => setSelectedRouteFilters((current) => uniqueToggle(current, filter) as RouteFilter[])}
          onToggleConclusion={(conclusion) => setSelectedConclusions((current) => uniqueToggle(current, conclusion) as RouteConclusion[])}
          onClear={() => {
            setQuery('');
            setSelectedRouteFilters([]);
            setSelectedConclusions([]);
          }}
          expandedMapId={expandedMapId}
          onToggleMap={(id) => setExpandedMapId((current) => (current === id ? null : id))}
          selections={routeSelections}
          onSelectRouteMap={(slot, id) => setRouteSelections((current) => ({ ...current, [slot]: current[slot] === id ? undefined : id }))}
          onClearRoute={() => setRouteSelections({})}
        />
      ) : (
        <>
      <View style={screenStyles.controls}>
        <View style={screenStyles.searchRow}>
          <Ionicons name="search" size={18} color="#8b98a5" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search maps, secrets, portals, artifacts"
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
              onPress={() => setSelectedFilters((current) => toggleMapFilter(current, filter))}
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
        <Text style={screenStyles.resultCount}>{resultCount} entries</Text>
        {hasActiveFilters ? (
          <Pressable accessibilityRole="button" onPress={clearFilters} style={screenStyles.clearButton}>
            <Ionicons name="close" size={14} color="#dbe4ee" />
            <Text style={screenStyles.clearText}>Clear</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={screenStyles.listContent}>
        {resultCount === 0 ? (
          <View style={screenStyles.emptyPanel}>
            <Text style={screenStyles.emptyTitle}>No map entries found</Text>
            <Text style={screenStyles.emptyText}>Adjust filters or search another secret, stage, portal, or artifact.</Text>
          </View>
        ) : null}

        {filteredMaps.map((map) => (
          <MapCard
            key={map.id}
            map={map}
            expanded={expandedMapId === map.id}
            onPress={() => setExpandedMapId((current) => (current === map.id ? null : map.id))}
          />
        ))}

        {filteredArtifacts.length > 0 ? (
          <View style={screenStyles.sectionBreak}>
            <Text style={screenStyles.sectionTitle}>Artifact Mechanics</Text>
          </View>
        ) : null}

        {filteredArtifacts.map((artifact) => (
          <ArtifactCard
            key={artifact.id}
            artifact={artifact}
            expanded={expandedArtifactId === artifact.id}
            onPress={() => setExpandedArtifactId((current) => (current === artifact.id ? null : artifact.id))}
          />
        ))}
      </ScrollView>
        </>
      )}
    </View>
  );
}

function SegmentButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[screenStyles.viewToggleButton, active && screenStyles.viewToggleButtonActive]}
    >
      <Text style={[screenStyles.viewToggleText, active && screenStyles.viewToggleTextActive]}>{label}</Text>
    </Pressable>
  );
}

function RouteView({
  query,
  selectedFilters,
  selectedConclusions,
  onQueryChange,
  onToggleFilter,
  onToggleConclusion,
  onClear,
  expandedMapId,
  onToggleMap,
  selections,
  onSelectRouteMap,
  onClearRoute
}: {
  query: string;
  selectedFilters: RouteFilter[];
  selectedConclusions: RouteConclusion[];
  onQueryChange: (query: string) => void;
  onToggleFilter: (filter: RouteFilter) => void;
  onToggleConclusion: (conclusion: RouteConclusion) => void;
  onClear: () => void;
  expandedMapId: string | null;
  onToggleMap: (id: string) => void;
  selections: RouteSelections;
  onSelectRouteMap: (slot: RouteSlot, id: string) => void;
  onClearRoute: () => void;
}) {
  const routeMatches = (map: MapRecord) => routeMapMatches(map, query, selectedFilters, selectedConclusions);
  const stageFiveMaps = mapIdsToMaps(routeStageFiveMapIds).filter(routeMatches);
  const finalMaps = mapIdsToMaps(routeFinalMapIds).filter(routeMatches);
  const hiddenMaps = mapIdsToMaps(routeHiddenMapIds).filter(routeMatches);
  const voidMaps = mapIdsToMaps(routeVoidMapIds).filter(routeMatches);
  const sotsMaps = mapIdsToMaps(routeSotsMapIds).filter(routeMatches);
  const acMaps = mapIdsToMaps(routeAcMapIds).filter(routeMatches);
  const loopVariantMaps = mapIdsToMaps(routeLoopVariantMapIds).filter(routeMatches);
  const showLoop = routeLoopMatches(query, selectedFilters, selectedConclusions);
  const shownMapCount =
    routeStageGroups.reduce((count, stage) => {
      return count + mapIdsToMaps(stage.mapIds).filter(routeMatches).length;
    }, 0) +
    stageFiveMaps.length +
    finalMaps.length +
    hiddenMaps.length +
    voidMaps.length +
    sotsMaps.length +
    acMaps.length +
    loopVariantMaps.length +
    (showLoop ? 1 : 0);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={screenStyles.routeContent}>
      <View style={screenStyles.routeIntro}>
        <Text style={screenStyles.routeIntroTitle}>Run Route</Text>
        <Text style={screenStyles.routeIntroText}>
          Runs normally progress Stage 1 to Stage 5, with each tier rolling an eligible scene from its enabled pool. Hidden realms
          and DLC branches are optional side routes; Sky Meadow's Primordial Teleporter controls Commencement vs loop.
        </Text>
      </View>

      <CurrentRoutePlanner
        selections={selections}
        selectedConclusions={selectedConclusions}
        onToggleConclusion={onToggleConclusion}
        onClearRoute={onClearRoute}
      />

      <RouteMindMap />

      <View style={screenStyles.controls}>
        <View style={screenStyles.searchRow}>
          <Ionicons name="search" size={18} color="#8b98a5" />
          <TextInput
            value={query}
            onChangeText={onQueryChange}
            placeholder="Search maps, unlocks, rewards, route roles"
            placeholderTextColor="#687481"
            style={screenStyles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query ? (
            <Pressable accessibilityRole="button" onPress={() => onQueryChange('')} hitSlop={12}>
              <Ionicons name="close-circle" size={18} color="#8b98a5" />
            </Pressable>
          ) : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={screenStyles.filterRow}>
          {routeFilterOptions.map((filter) => (
            <Pressable
              key={filter.id}
              accessibilityRole="button"
              onPress={() => onToggleFilter(filter.id)}
              style={[screenStyles.filterChip, selectedFilters.includes(filter.id) && screenStyles.filterChipActive]}
            >
              <Text style={[screenStyles.filterText, selectedFilters.includes(filter.id) && screenStyles.filterTextActive]}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={screenStyles.resultsHeader}>
        <Text style={screenStyles.resultCount}>{shownMapCount} route cards</Text>
        {query.trim().length > 0 || selectedFilters.length > 0 || selectedConclusions.length > 0 ? (
          <Pressable accessibilityRole="button" onPress={onClear} style={screenStyles.clearButton}>
            <Ionicons name="close" size={14} color="#dbe4ee" />
            <Text style={screenStyles.clearText}>Clear</Text>
          </Pressable>
        ) : null}
      </View>

      {routeStageGroups.map((stage, index) => {
        const slot = routeStageSlots[index] ?? 'stage1';
        return (
          <View key={stage.title} style={screenStyles.routeStageWrap}>
            <RouteStageSection
              slot={slot}
              title={stage.title}
              subtitle={stage.subtitle}
              note={stage.note}
              tier={stage.tier}
              maps={mapIdsToMaps(stage.mapIds).filter(routeMatches)}
              expandedMapId={expandedMapId}
              onToggleMap={onToggleMap}
              selectedMapId={selections[slot]}
              onSelectMap={(id) => onSelectRouteMap(slot, id)}
            />
            {index < routeStageGroups.length - 1 ? <RouteConnector /> : null}
          </View>
        );
      })}

      <RouteStageSection
        slot="stage5"
        title="Stage 5 Decision Point"
        subtitle="Final or loop"
        note="Sky Meadow is the main base-game decision point. Align the Primordial Teleporter for Commencement, or re-align it to loop back to Stage 1."
        tier="Stage 5"
        maps={stageFiveMaps}
        expandedMapId={expandedMapId}
        onToggleMap={onToggleMap}
        selectedMapId={selections.stage5}
        onSelectMap={(id) => onSelectRouteMap('stage5', id)}
      />

      <View style={screenStyles.routeFork}>
        <Text style={screenStyles.routeForkLabel}>Normal Final Route / Loop Route</Text>
        <Text style={screenStyles.routeStageNote}>Looping sends the run back to the Stage 1 pool. Loop-only variants appear after that reset.</Text>
        <View style={screenStyles.routeForkGrid}>
          {finalMaps.map((map) => (
            <RouteMapCard
              key={map.id}
              map={map}
              expanded={expandedMapId === map.id}
              selected={selections.final === map.id}
              onPress={() => onToggleMap(map.id)}
              onSelect={() => onSelectRouteMap('final', map.id)}
            />
          ))}
          {showLoop ? <LoopCard /> : null}
          {loopVariantMaps.map((map) => (
            <RouteMapCard
              key={map.id}
              map={map}
              expanded={expandedMapId === map.id}
              selected={selections.loop === map.id}
              onPress={() => onToggleMap(map.id)}
              onSelect={() => onSelectRouteMap('loop', map.id)}
            />
          ))}
        </View>
      </View>

      <RouteStageSection
        slot="hidden"
        title="Hidden Realms"
        subtitle="Optional side routes"
        note="These are side branches from portals, altars, or Sky Meadow artifacts. They do not replace normal stage-pool rolls."
        tier="Hidden Realm"
        maps={hiddenMaps}
        expandedMapId={expandedMapId}
        onToggleMap={onToggleMap}
        selectedMapId={selections.hidden}
        onSelectMap={(id) => onSelectRouteMap('hidden', id)}
      />

      <View style={screenStyles.optionalRoute}>
        <View style={screenStyles.optionalHeader}>
          <Ionicons name="git-branch" size={15} color="#50d6c7" />
          <Text style={screenStyles.optionalTitle}>Survivors of the Void Alternate Route</Text>
        </View>
        <Text style={screenStyles.routeStageNote}>Void Locus leads to The Planetarium for the SotV alternate ending route.</Text>
        {voidMaps.map((map, index) => (
          <View key={map.id}>
            <RouteMapCard
              map={map}
              expanded={expandedMapId === map.id}
              selected={selections.sotv === map.id}
              onPress={() => onToggleMap(map.id)}
              onSelect={() => onSelectRouteMap('sotv', map.id)}
            />
            {index < voidMaps.length - 1 ? <RouteConnector muted /> : null}
          </View>
        ))}
      </View>

      <View style={[screenStyles.optionalRoute, screenStyles.sotsRoute]}>
        <View style={screenStyles.optionalHeader}>
          <Ionicons name="git-branch" size={15} color="#f3d65f" />
          <Text style={[screenStyles.optionalTitle, screenStyles.sotsTitle]}>Path of the Colossus / False Son</Text>
        </View>
        <Text style={screenStyles.routeStageNote}>
          Seekers of the Storm content is a special branch. Reformed Altar to Treeborn Colony to Prime Meridian should not be read as normal stage-pool replacement.
        </Text>
        {sotsMaps.map((map, index) => (
          <View key={map.id}>
            <RouteMapCard
              map={map}
              expanded={expandedMapId === map.id}
              selected={selections.sots === map.id}
              onPress={() => onToggleMap(map.id)}
              onSelect={() => onSelectRouteMap('sots', map.id)}
            />
            {index < sotsMaps.length - 1 ? <RouteConnector muted /> : null}
          </View>
        ))}
      </View>

      <View style={[screenStyles.optionalRoute, screenStyles.acRoute]}>
        <View style={screenStyles.optionalHeader}>
          <Ionicons name="git-branch" size={15} color="#8ed9e6" />
          <Text style={[screenStyles.optionalTitle, screenStyles.acTitle]}>Alloyed Hidden Path / Solus Heart</Text>
        </View>
        <Text style={screenStyles.routeStageNote}>
          Access Node on Stage 3 opens the Encrypted Portal chain. This is an optional hidden route branch, ending at Neural Sanctum / Solus Heart.
        </Text>
        {acMaps.map((map, index) => (
          <View key={map.id}>
            <RouteMapCard
              map={map}
              expanded={expandedMapId === map.id}
              selected={selections.ac === map.id}
              onPress={() => onToggleMap(map.id)}
              onSelect={() => onSelectRouteMap('ac', map.id)}
            />
            {index < acMaps.length - 1 ? <RouteConnector muted /> : null}
          </View>
        ))}
      </View>

      {shownMapCount === 0 ? (
        <View style={screenStyles.emptyPanel}>
          <Text style={screenStyles.emptyTitle}>No route cards found</Text>
          <Text style={screenStyles.emptyText}>Clear a chip or search another map, unlock, reward, route role, or tag.</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

function RouteMindMap() {
  return (
    <View style={screenStyles.mindMap}>
      <View style={screenStyles.mindMapRoot}>
        <Ionicons name="map" size={16} color="#f3f7fb" />
        <Text style={screenStyles.mindMapRootText}>Risk of Rain 2 Run Route</Text>
      </View>

      <MindMapBranch
        accent="#4fce83"
        title="Normal Stage Pools"
        rows={[
          'Stage 1 -> Stage 2 -> Stage 3 -> Stage 4 -> Stage 5',
          'Each tier rolls an eligible scene or variant from its pool',
          'Looping returns to Stage 1 and can show loop variants'
        ]}
      />
      <MindMapBranch
        accent="#f3d65f"
        title="Sky Meadow Decision"
        rows={[
          'Primordial Teleporter aligned -> Commencement',
          'Primordial Teleporter re-aligned -> loop',
          'Artifact Portal -> Bulwark Ambry'
        ]}
      />
      <MindMapBranch
        accent="#50d6c7"
        title="Hidden Realms"
        rows={['Bazaar Between Time', 'Void Fields', "Bulwark's Ambry", 'Gilded Coast']}
      />
      <MindMapBranch
        accent="#b48cff"
        title="Alternate Endings"
        rows={['SotV: Void Locus -> The Planetarium', 'SotS: Reformed Altar -> Treeborn Colony -> Prime Meridian', 'AC: Access Node -> Encrypted Portal -> Neural Sanctum']}
      />
      <MindMapBranch
        accent="#55b9ff"
        title="Live-Run Checks"
        rows={['Huntress Ballista: Rallypoint Delta or Scorched Acres flawless stage', 'Huntress Phase Blink: hold 12 Crowbars', 'Huntress Flurry: kill with every Laser Glaive hit']}
      />
    </View>
  );
}

function CurrentRoutePlanner({
  selections,
  selectedConclusions,
  onToggleConclusion,
  onClearRoute
}: {
  selections: RouteSelections;
  selectedConclusions: RouteConclusion[];
  onToggleConclusion: (conclusion: RouteConclusion) => void;
  onClearRoute: () => void;
}) {
  const selectedEntries = (Object.entries(selections) as [RouteSlot, string | undefined][])
    .map(([slot, id]) => {
      const map = id ? findMapById(id) : null;
      return map ? { slot, map } : null;
    })
    .filter((entry): entry is { slot: RouteSlot; map: MapRecord } => entry !== null);
  const selectedCount = selectedEntries.length;
  const nextSlot = getNextRouteSlot(selections);
  const latestMap = selectedEntries[selectedEntries.length - 1]?.map ?? null;
  const routeGates = getConclusionRouteGates(selectedConclusions, selections);

  return (
    <View style={screenStyles.plannerPanel}>
      <View style={screenStyles.plannerHeader}>
        <View style={screenStyles.plannerTitleBlock}>
          <Text style={screenStyles.plannerTitle}>Current Run</Text>
          <Text style={screenStyles.plannerSubtitle}>
            {selectedConclusions.length > 0
              ? `${selectedConclusions.length} conclusion${selectedConclusions.length === 1 ? '' : 's'} selected. Next: ${routeSlotLabels[nextSlot]}`
              : 'Start by choosing possible conclusions, then select maps as they appear.'}
          </Text>
        </View>
        {selectedCount > 0 ? (
          <Pressable accessibilityRole="button" onPress={onClearRoute} style={screenStyles.plannerClearButton}>
            <Ionicons name="refresh" size={14} color="#dbe4ee" />
            <Text style={screenStyles.plannerClearText}>Reset</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={screenStyles.conclusionGrid}>
        {routeConclusionOptions.map((conclusion) => {
          const active = selectedConclusions.includes(conclusion.id);
          return (
            <Pressable
              key={conclusion.id}
              accessibilityRole="button"
              onPress={() => onToggleConclusion(conclusion.id)}
              style={[screenStyles.conclusionCard, active && screenStyles.conclusionCardActive]}
            >
              <View style={screenStyles.conclusionCardTop}>
                <Ionicons name={active ? 'checkmark-circle' : 'ellipse-outline'} size={15} color={active ? '#0b1118' : '#9aa7b5'} />
                <Text style={[screenStyles.conclusionTitle, active && screenStyles.conclusionTitleActive]}>{conclusion.label}</Text>
              </View>
              <Text style={[screenStyles.conclusionRoute, active && screenStyles.conclusionRouteActive]}>{conclusion.route}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={screenStyles.plannerPath}>
        {(['stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'final'] as RouteSlot[]).map((slot) => {
          const map = selections[slot] ? findMapById(selections[slot] as string) ?? null : null;
          return <PlannerStep key={slot} label={routeSlotLabels[slot]} map={map} active={slot === nextSlot} />;
        })}
      </View>

      <View style={screenStyles.routeGatePanel}>
        <Text style={screenStyles.routeGateTitle}>Route Gates</Text>
        {routeGates.map((gate) => (
          <View key={gate.label} style={screenStyles.routeGateRow}>
            <Ionicons name={gate.done ? 'checkmark-circle' : 'radio-button-off'} size={15} color={gate.done ? '#4fce83' : '#8b98a5'} />
            <View style={screenStyles.routeGateTextBlock}>
              <Text style={screenStyles.routeGateLabel}>{gate.label}</Text>
              <Text style={screenStyles.routeGateText}>{gate.detail}</Text>
            </View>
          </View>
        ))}
      </View>

      {latestMap ? (
        <View style={screenStyles.plannerTipBox}>
          <Text style={screenStyles.plannerTipLabel}>Last Selection</Text>
          <Text style={screenStyles.plannerTipTitle}>{latestMap.name}</Text>
          <Text style={screenStyles.plannerTipText}>{latestMap.routingTip}</Text>
        </View>
      ) : null}
    </View>
  );
}

function getConclusionRouteGates(conclusions: RouteConclusion[], selections: RouteSelections) {
  const activeConclusions = conclusions.length > 0 ? conclusions : routeConclusionOptions.map((option) => option.id);
  const gates: { label: string; detail: string; done: boolean }[] = [];

  if (activeConclusions.some((conclusion) => conclusion === 'mithrix' || conclusion === 'loop' || conclusion === 'obliterate')) {
    gates.push({
      label: 'Reach Sky Meadow',
      detail: 'Normal progression reaches the main final/loop decision at Stage 5.',
      done: selections.stage5 === 'sky-meadow'
    });
  }

  if (activeConclusions.includes('mithrix')) {
    gates.push({
      label: 'Align Primordial Teleporter',
      detail: 'Send the run to Commencement for the Mithrix ending.',
      done: selections.final === 'commencement'
    });
  }

  if (activeConclusions.some((conclusion) => conclusion === 'loop' || conclusion === 'obliterate')) {
    gates.push({
      label: 'Re-align Primordial Teleporter',
      detail: 'Looping returns to the Stage 1 pool and opens loop-only route variants.',
      done: Boolean(selections.loop)
    });
  }

  if (activeConclusions.includes('voidling')) {
    gates.push({
      label: 'Enter Void Route',
      detail: 'Route through Void Locus, then finish at The Planetarium.',
      done: selections.sotv === 'the-planetarium'
    });
  }

  if (activeConclusions.includes('false-son')) {
    gates.push({
      label: 'Follow Path of the Colossus',
      detail: 'Use Reformed Altar and Treeborn Colony to reach Prime Meridian.',
      done: selections.sots === 'prime-meridian'
    });
  }

  if (activeConclusions.includes('solus-heart')) {
    gates.push({
      label: 'Find Access Node',
      detail: 'Stage 3 Access Node starts the Encrypted Portal chain toward Neural Sanctum.',
      done: selections.ac === 'neural-sanctum'
    });
  }

  if (activeConclusions.includes('artifact-trial')) {
    gates.push({
      label: 'Use Compound Generator',
      detail: 'Enter an artifact code under Sky Meadow to open Bulwark Ambry.',
      done: selections.hidden === 'bulwarks-ambry'
    });
  }

  if (activeConclusions.includes('legendary-reward')) {
    gates.push({
      label: 'Roll A Stage 4 Reward Map',
      detail: 'Abyssal Depths, Siren\'s Call, and Sundered Grove carry the common legendary reward checks.',
      done: ['abyssal-depths', 'sirens-call', 'sundered-grove'].includes(selections.stage4 ?? '')
    });
  }

  if (activeConclusions.includes('huntress-ballista')) {
    gates.push({
      label: 'Piercing Wind Map Roll',
      detail: 'Start and finish Rallypoint Delta or Scorched Acres without falling below full health.',
      done: ['rallypoint-delta', 'scorched-acres'].includes(selections.stage3 ?? '')
    });
  }

  if (activeConclusions.includes('huntress-phase-blink')) {
    gates.push({
      label: 'Collect 12 Crowbars',
      detail: 'Route for Command/Sacrifice-friendly runs or prioritize shops, printers, and item choice sources until Huntress is holding 12 Crowbars.',
      done: false
    });
  }

  if (activeConclusions.includes('huntress-flurry')) {
    gates.push({
      label: 'Laser Glaive Finishing Touch',
      detail: 'Find a safe low-health target chain and land the killing blow with every possible hit from one Laser Glaive cast.',
      done: false
    });
  }

  return gates;
}

function PlannerStep({ label, map, active }: { label: string; map: MapRecord | null; active: boolean }) {
  return (
    <View style={[screenStyles.plannerStep, active && !map && screenStyles.plannerStepActive, map && screenStyles.plannerStepDone]}>
      <Text style={screenStyles.plannerStepLabel}>{label}</Text>
      <Text style={[screenStyles.plannerStepValue, map && screenStyles.plannerStepValueDone]} numberOfLines={2}>
        {map?.name ?? (active ? 'Select next' : 'Pending')}
      </Text>
    </View>
  );
}

function getNextRouteSlot(selections: RouteSelections): RouteSlot {
  for (const slot of ['stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'final'] as RouteSlot[]) {
    if (!selections[slot]) {
      return slot;
    }
  }

  return 'hidden';
}

function MindMapBranch({ accent, title, rows }: { accent: string; title: string; rows: string[] }) {
  return (
    <View style={screenStyles.mindMapBranch}>
      <View style={[screenStyles.mindMapLine, { backgroundColor: accent }]} />
      <View style={screenStyles.mindMapBranchBody}>
        <View style={screenStyles.mindMapBranchHeader}>
          <View style={[screenStyles.mindMapDot, { backgroundColor: accent }]} />
          <Text style={screenStyles.mindMapBranchTitle}>{title}</Text>
        </View>
        {rows.map((row) => (
          <View key={row} style={screenStyles.mindMapLeaf}>
            <Ionicons name="return-down-forward" size={13} color={accent} />
            <Text style={screenStyles.mindMapLeafText}>{row}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function RouteStageSection({
  slot,
  title,
  subtitle,
  note,
  tier,
  maps: stageMaps,
  expandedMapId,
  onToggleMap,
  selectedMapId,
  onSelectMap
}: {
  slot: RouteSlot;
  title: string;
  subtitle: string;
  note: string;
  tier: MapTier;
  maps: MapRecord[];
  expandedMapId: string | null;
  onToggleMap: (id: string) => void;
  selectedMapId?: string;
  onSelectMap: (id: string) => void;
}) {
  return (
    <View style={screenStyles.routeStage}>
      <View style={[screenStyles.routeStageStripe, { backgroundColor: tierAccentColors[tier] }]} />
      <View style={screenStyles.routeStageHeader}>
        <Text style={screenStyles.routeStageTitle}>{title}</Text>
        <Text style={screenStyles.routeStageSubtitle}>{selectedMapId ? `Selected ${routeSlotLabels[slot]}` : subtitle}</Text>
      </View>
      <Text style={screenStyles.routeStageNote}>{note}</Text>
      <View style={screenStyles.routeCardGrid}>
        {stageMaps.map((map) => (
          <RouteMapCard
            key={map.id}
            map={map}
            expanded={expandedMapId === map.id}
            selected={selectedMapId === map.id}
            onPress={() => onToggleMap(map.id)}
            onSelect={() => onSelectMap(map.id)}
          />
        ))}
      </View>
    </View>
  );
}

function RouteMapCard({
  map,
  expanded,
  selected,
  onPress,
  onSelect
}: {
  map: MapRecord;
  expanded: boolean;
  selected?: boolean;
  onPress: () => void;
  onSelect?: () => void;
}) {
  const routeType = map.routeType ?? (map.tier === 'Final' ? 'final' : map.tier === 'Hidden Realm' ? 'hidden' : 'normal');
  const accentColor = tierAccentColors[map.tier];
  const isHidden = routeType === 'hidden';
  const isFinal = routeType === 'final';
  const isLoop = routeType === 'loop';
  const isSpecial = routeType === 'special';
  const expansionBadge = getExpansionBadge(map.expansion);
  const thumbnailSource = getMapThumbnailSource(map);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        screenStyles.routeCard,
        isHidden && screenStyles.routeCardHidden,
        isFinal && screenStyles.routeCardFinal,
        isLoop && screenStyles.routeCardLoop,
        isSpecial && screenStyles.routeCardSpecial,
        selected && screenStyles.routeCardSelected,
        expanded && screenStyles.routeCardExpanded
      ]}
    >
      <View style={[screenStyles.routeAccent, { backgroundColor: accentColor }]} />
      {thumbnailSource ? <Image source={thumbnailSource} style={screenStyles.routeThumbnail} /> : null}
      <View style={screenStyles.routeCardBody}>
        <View style={screenStyles.routeCardTop}>
          <Text style={screenStyles.routeMapName}>{map.name}</Text>
          {expansionBadge ? (
            <View style={[screenStyles.expansionBadge, expansionBadge.style]}>
              <Text style={[screenStyles.expansionBadgeText, expansionBadge.textStyle]}>{expansionBadge.label}</Text>
            </View>
          ) : null}
        </View>
        {map.routeRole ? <Text style={screenStyles.routeRole}>{map.routeRole}</Text> : null}
        {routeType !== 'normal' ? <Text style={screenStyles.routeTypeText}>{routeTypeLabels[routeType]}</Text> : null}
        {onSelect ? (
          <Pressable accessibilityRole="button" onPress={onSelect} style={[screenStyles.selectRouteButton, selected && screenStyles.selectRouteButtonActive]}>
            <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} size={14} color={selected ? '#0b1118' : '#9aa7b5'} />
            <Text style={[screenStyles.selectRouteText, selected && screenStyles.selectRouteTextActive]}>
              {selected ? 'Selected' : 'Select'}
            </Text>
          </Pressable>
        ) : null}

        {expanded ? (
          <View style={screenStyles.routeExpanded}>
            <Text style={screenStyles.routeExpandedLabel}>Layout</Text>
            <Text style={screenStyles.routeExpandedText}>{map.layout}</Text>
            <Text style={screenStyles.routeExpandedLabel}>Routing Tip</Text>
            <Text style={screenStyles.routeExpandedText}>{map.routingTip}</Text>
            {map.secrets.length > 0 ? (
              <>
                <Text style={screenStyles.routeExpandedLabel}>Secrets / Rewards</Text>
                {map.secrets.map((secret) => (
                  <Text key={secret} style={screenStyles.routeExpandedText}>- {secret}</Text>
                ))}
              </>
            ) : null}
            {map.mechanics.length > 0 ? (
              <>
                <Text style={screenStyles.routeExpandedLabel}>Mechanics</Text>
                {map.mechanics.map((mechanic) => (
                  <Text key={mechanic} style={screenStyles.routeExpandedText}>- {mechanic}</Text>
                ))}
              </>
            ) : null}
            {map.unlockRelevance ? (
              <>
                <Text style={screenStyles.routeExpandedLabel}>Unlock Relevance</Text>
                <Text style={screenStyles.routeExpandedText}>{map.unlockRelevance}</Text>
              </>
            ) : null}
            <TagWrap tags={map.tags.slice(0, 4)} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

function LoopCard() {
  return (
    <View style={[screenStyles.routeCard, screenStyles.routeCardLoop]}>
      <View style={[screenStyles.routeAccent, { backgroundColor: '#8b98a5' }]} />
      <View style={screenStyles.routeCardBody}>
        <View style={screenStyles.routeCardTop}>
          <Text style={screenStyles.routeMapName}>Loop</Text>
        </View>
        <Text style={screenStyles.routeRole}>Back to Stage 1 pool</Text>
        <Text style={screenStyles.routeTypeText}>Loop route</Text>
      </View>
    </View>
  );
}

function RouteConnector({ muted = false }: { muted?: boolean }) {
  return (
    <View style={screenStyles.routeConnector}>
      <View style={[screenStyles.routeConnectorLine, muted && screenStyles.routeConnectorLineMuted]} />
      <Ionicons name="arrow-down" size={16} color={muted ? '#607181' : '#8b98a5'} />
      <View style={[screenStyles.routeConnectorLine, muted && screenStyles.routeConnectorLineMuted]} />
    </View>
  );
}

function MapCard({ map, expanded, onPress }: { map: MapRecord; expanded: boolean; onPress: () => void }) {
  const thumbnailSource = getMapThumbnailSource(map);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[screenStyles.card, expanded && screenStyles.cardExpanded]}>
      {thumbnailSource ? <Image source={thumbnailSource} style={screenStyles.mapThumbnail} /> : null}
      <View style={screenStyles.cardHeader}>
        <View style={screenStyles.titleBlock}>
          <Text style={screenStyles.cardTitle}>{map.name}</Text>
          <View style={screenStyles.metaRow}>
            <Badge icon="map" label={tierLabels[map.tier]} tone="blue" />
            <Badge label={scopeLabels[map.scope]} tone={map.scope === 'dlc' ? 'gold' : 'neutral'} />
          </View>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#8b98a5" />
      </View>

      <Text style={screenStyles.subtitle}>{map.subtitle}</Text>
      <Text style={screenStyles.summary}>{map.layout}</Text>

      <View style={screenStyles.tipBox}>
        <Text style={screenStyles.tipLabel}>Route</Text>
        <Text style={screenStyles.tipText}>{map.routingTip}</Text>
      </View>

      {expanded ? (
        <View style={screenStyles.expandedBody}>
          <BulletGroup title="Secrets" entries={map.secrets} icon="key" />
          <BulletGroup title="Map Mechanics" entries={map.mechanics} icon="git-branch" />
          <TagWrap tags={map.tags} />
        </View>
      ) : null}
    </Pressable>
  );
}

function getMapThumbnailSource(map: MapRecord) {
  return mapThumbnailSources[map.thumbnail];
}

function ArtifactCard({
  artifact,
  expanded,
  onPress
}: {
  artifact: ArtifactMechanic;
  expanded: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[screenStyles.card, expanded && screenStyles.cardExpanded]}>
      <View style={screenStyles.cardHeader}>
        <View style={screenStyles.titleBlock}>
          <Text style={screenStyles.cardTitle}>Artifact of {artifact.name}</Text>
          <View style={screenStyles.metaRow}>
            <Badge icon="shapes" label="Artifact" tone="blue" />
            <Badge label={`${artifact.risk} risk`} tone={artifact.risk === 'high' ? 'gold' : 'neutral'} />
          </View>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#8b98a5" />
      </View>

      <Text style={screenStyles.summary}>{artifact.effect}</Text>
      <View style={screenStyles.codeGrid}>
        {artifact.code.map((line, index) => (
          <Text key={`${artifact.id}-${line}-${index}`} style={screenStyles.codeLine}>
            {line}
          </Text>
        ))}
      </View>

      {expanded ? (
        <View style={screenStyles.expandedBody}>
          <View style={screenStyles.tipBox}>
            <Text style={screenStyles.tipLabel}>How To Use</Text>
            <Text style={screenStyles.tipText}>{artifact.route}</Text>
          </View>
          <TagWrap tags={artifact.tags} />
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

function BulletGroup({ title, entries, icon }: { title: string; entries: string[]; icon: keyof typeof Ionicons.glyphMap }) {
  if (entries.length === 0) {
    return null;
  }

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

function mapSearchMatches(map: MapRecord, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  return [
    map.name,
    map.tier,
    map.subtitle,
    map.scope,
    map.expansion ?? '',
    map.routeRole ?? '',
    map.routeType ?? '',
    map.layout,
    map.routingTip,
    map.unlockRelevance ?? '',
    ...map.secrets,
    ...map.mechanics,
    ...map.tags
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery);
}

function routeMapMatches(map: MapRecord, query: string, filters: RouteFilter[], conclusions: RouteConclusion[]) {
  if (!mapSearchMatches(map, query)) {
    return false;
  }

  const filterMatch = filters.every((filter) => {
    if (filter === 'base') return map.expansion === 'base';
    if (filter === 'sotv') return map.expansion === 'SotV';
    if (filter === 'sots') return map.expansion === 'SotS';
    if (filter === 'ac') return map.expansion === 'AC';
    if (filter === 'unlocks') return routeText(map).includes('unlock') || routeText(map).includes('huntress') || Boolean(map.unlockRelevance);
    if (filter === 'legendary') return routeText(map).includes('legendary');
    if (filter === 'hidden') return map.routeType === 'hidden' || map.tier === 'Hidden Realm';
    if (filter === 'final') return map.routeType === 'final' || routeText(map).includes('final route');
    if (filter === 'loop') return routeText(map).includes('loop');
    if (filter === 'alternate') return routeText(map).includes('alternate') || routeText(map).includes('true final') || routeText(map).includes('false son') || routeText(map).includes('solus heart');
    return true;
  });

  return filterMatch && conclusionRouteMatches(map, conclusions);
}

function routeLoopMatches(query: string, filters: RouteFilter[], conclusions: RouteConclusion[] = []) {
  const haystack = 'loop route re-aligning primordial teleporter sky meadow back to stage 1 pool optional branch'.toLowerCase();
  const normalizedQuery = query.trim().toLowerCase();
  const queryMatch = !normalizedQuery || haystack.includes(normalizedQuery);
  const filterMatch = filters.every((filter) => filter === 'loop' || filter === 'base');
  const conclusionMatch = conclusions.length === 0 || conclusions.some((conclusion) => conclusion === 'loop' || conclusion === 'obliterate');
  return queryMatch && filterMatch && conclusionMatch;
}

function conclusionRouteMatches(map: MapRecord, conclusions: RouteConclusion[]) {
  if (conclusions.length === 0) {
    return true;
  }

  const commonNormalStage = map.routeType === 'normal' && ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4'].includes(map.tier);
  if (commonNormalStage) {
    return true;
  }

  return conclusions.some((conclusion) => {
    if (conclusion === 'mithrix') {
      return ['sky-meadow', 'commencement', 'bazaar-between-time', 'bulwarks-ambry'].includes(map.id);
    }
    if (conclusion === 'loop') {
      return map.id === 'sky-meadow' || map.routeType === 'loop';
    }
    if (conclusion === 'obliterate') {
      return map.id === 'sky-meadow' || map.routeType === 'loop' || ['bazaar-between-time', 'gilded-coast'].includes(map.id);
    }
    if (conclusion === 'voidling') {
      return map.expansion === 'SotV' || ['bazaar-between-time', 'void-fields'].includes(map.id);
    }
    if (conclusion === 'false-son') {
      return map.expansion === 'SotS';
    }
    if (conclusion === 'solus-heart') {
      return map.expansion === 'AC';
    }
    if (conclusion === 'artifact-trial') {
      return ['sky-meadow', 'bulwarks-ambry'].includes(map.id);
    }
    if (conclusion === 'legendary-reward') {
      return routeText(map).includes('legendary') || map.tier === 'Stage 4';
    }
    if (conclusion === 'huntress-ballista') {
      return ['rallypoint-delta', 'scorched-acres'].includes(map.id);
    }
    if (conclusion === 'huntress-phase-blink') {
      return ['bazaar-between-time', 'bulwarks-ambry'].includes(map.id) || routeText(map).includes('artifact');
    }
    if (conclusion === 'huntress-flurry') {
      return map.routeType === 'normal' || ['bazaar-between-time', 'bulwarks-ambry'].includes(map.id);
    }
    return true;
  });
}

function routeText(map: MapRecord) {
  return [
    map.name,
    map.tier,
    map.subtitle,
    map.scope,
    map.expansion ?? '',
    map.routeRole ?? '',
    map.routeType ?? '',
    map.layout,
    map.routingTip,
    map.unlockRelevance ?? '',
    ...map.secrets,
    ...map.mechanics,
    ...map.tags
  ]
    .join(' ')
    .toLowerCase();
}

function getExpansionBadge(expansion: MapRecord['expansion']) {
  if (!expansion || expansion === 'base') {
    return null;
  }

  if (expansion === 'SotV') {
    return { label: 'SotV', style: screenStyles.sotvBadge, textStyle: screenStyles.sotvBadgeText };
  }

  if (expansion === 'SotS') {
    return { label: 'SotS', style: screenStyles.sotsBadge, textStyle: screenStyles.sotsBadgeText };
  }

  return { label: 'AC', style: screenStyles.acBadge, textStyle: screenStyles.acBadgeText };
}

function findMapById(id: string) {
  return maps.find((map) => map.id === id);
}

function mapIdsToMaps(ids: string[]) {
  return ids.reduce<MapRecord[]>((records, id) => {
    const map = findMapById(id);
    if (map) {
      records.push(map);
    }
    return records;
  }, []);
}

function artifactSearchMatches(artifact: ArtifactMechanic, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  return [artifact.name, artifact.effect, artifact.route, artifact.risk, ...artifact.code, ...artifact.tags]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery);
}

function formatFilter(filter: MapFilter) {
  if (filter === 'base') return 'Base';
  if (filter === 'dlc') return 'Expansions';
  if (filter === 'artifact') return 'Artifacts';
  return tierLabels[filter];
}

function toggleMapFilter(current: MapFilter[], filter: MapFilter): MapFilter[] {
  if (filter === 'base' || filter === 'dlc') {
    return current.includes(filter) ? [] : [filter, ...current.filter((entry) => entry !== 'base' && entry !== 'dlc')];
  }

  return uniqueToggle(current, filter) as MapFilter[];
}

const screenStyles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16
  },
  viewToggle: {
    flexDirection: 'row',
    height: 38,
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#101720',
    overflow: 'hidden'
  },
  viewToggleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewToggleButtonActive: {
    backgroundColor: '#e7eef7'
  },
  viewToggleText: {
    color: '#a8b4c0',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  viewToggleTextActive: {
    color: '#0b1118'
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
    overflow: 'hidden',
    padding: 13,
    ...surfaceShadow
  },
  mapThumbnail: {
    width: '100%',
    height: 132,
    borderRadius: 7,
    backgroundColor: '#0b1118',
    resizeMode: 'cover'
  },
  cardExpanded: {
    borderColor: '#31516d',
    backgroundColor: '#111b27'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10
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
  summary: {
    color: '#c2ccd6',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600'
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
  sectionBreak: {
    paddingTop: 8
  },
  sectionTitle: {
    color: '#f3f7fb',
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  codeGrid: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a3847',
    backgroundColor: '#0b1118',
    gap: 3,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  codeLine: {
    color: '#f3d65f',
    fontSize: 12,
    fontWeight: '900'
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
  },
  routeContent: {
    gap: 12,
    paddingTop: 12,
    paddingBottom: 18
  },
  routeIntro: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    gap: 4,
    padding: 12,
    ...surfaceShadow
  },
  routeIntroTitle: {
    color: '#f3f7fb',
    fontSize: 17,
    fontWeight: '900'
  },
  routeIntroText: {
    color: '#9aa7b5',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700'
  },
  plannerPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#31516d',
    backgroundColor: '#101923',
    gap: 10,
    padding: 12,
    ...surfaceShadow
  },
  plannerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10
  },
  plannerTitleBlock: {
    flex: 1,
    minWidth: 0,
    gap: 3
  },
  plannerTitle: {
    color: '#f3f7fb',
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  plannerSubtitle: {
    color: '#9aa7b5',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17
  },
  plannerClearButton: {
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#111923',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9
  },
  plannerClearText: {
    color: '#dbe4ee',
    fontSize: 12,
    fontWeight: '800'
  },
  conclusionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  conclusionCard: {
    flexGrow: 1,
    flexBasis: '47%',
    minHeight: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0f161f',
    gap: 5,
    padding: 9
  },
  conclusionCardActive: {
    borderColor: '#4fce83',
    backgroundColor: '#4fce83'
  },
  conclusionCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  conclusionTitle: {
    color: '#e7eef7',
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  conclusionTitleActive: {
    color: '#0b1118'
  },
  conclusionRoute: {
    color: '#9aa7b5',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15
  },
  conclusionRouteActive: {
    color: '#0b1118'
  },
  plannerPath: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7
  },
  plannerStep: {
    flexGrow: 1,
    flexBasis: '30%',
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0f161f',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 7
  },
  plannerStepActive: {
    borderColor: '#55b9ff',
    backgroundColor: '#122131'
  },
  plannerStepDone: {
    borderColor: '#34634d',
    backgroundColor: '#102019'
  },
  plannerStepLabel: {
    color: '#7f8c99',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  plannerStepValue: {
    color: '#a8b4c0',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 15
  },
  plannerStepValueDone: {
    color: '#dff7e8'
  },
  routeGatePanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0f161f',
    gap: 8,
    padding: 10
  },
  routeGateTitle: {
    color: '#f3f7fb',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  routeGateRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7
  },
  routeGateTextBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2
  },
  routeGateLabel: {
    color: '#e7eef7',
    fontSize: 12,
    fontWeight: '900'
  },
  routeGateText: {
    color: '#9aa7b5',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15
  },
  plannerTipBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#29445a',
    backgroundColor: '#122131',
    gap: 4,
    padding: 10
  },
  plannerTipLabel: {
    color: '#55b9ff',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  plannerTipTitle: {
    color: '#f3f7fb',
    fontSize: 13,
    fontWeight: '900'
  },
  plannerTipText: {
    color: '#dbe4ee',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17
  },
  mindMap: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0f161f',
    gap: 10,
    padding: 12,
    ...surfaceShadow
  },
  mindMapRoot: {
    minHeight: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#344250',
    backgroundColor: '#151f2a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10
  },
  mindMapRootText: {
    color: '#f3f7fb',
    flex: 1,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  mindMapBranch: {
    flexDirection: 'row',
    gap: 9
  },
  mindMapLine: {
    borderRadius: 2,
    width: 3
  },
  mindMapBranchBody: {
    flex: 1,
    minWidth: 0,
    gap: 7
  },
  mindMapBranchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7
  },
  mindMapDot: {
    width: 9,
    height: 9,
    borderRadius: 5
  },
  mindMapBranchTitle: {
    color: '#e7eef7',
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  mindMapLeaf: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingLeft: 2
  },
  mindMapLeafText: {
    color: '#a8b4c0',
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17
  },
  routeStageWrap: {
    gap: 8
  },
  routeStage: {
    position: 'relative',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1f2c38',
    backgroundColor: '#0f161f',
    gap: 10,
    overflow: 'hidden',
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 10,
    paddingTop: 10,
    ...surfaceShadow
  },
  routeStageStripe: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4
  },
  routeStageHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8
  },
  routeStageTitle: {
    color: '#f3f7fb',
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  routeStageSubtitle: {
    color: '#7f8c99',
    flexShrink: 1,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'right',
    textTransform: 'uppercase'
  },
  routeStageNote: {
    color: '#a8b4c0',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17
  },
  routeCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  routeCard: {
    position: 'relative',
    flexGrow: 1,
    flexBasis: '47%',
    minHeight: 78,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    overflow: 'hidden'
  },
  routeCardHidden: {
    borderStyle: 'dashed',
    borderColor: '#3a7771'
  },
  routeCardFinal: {
    borderWidth: 2,
    borderColor: '#8d7a36',
    backgroundColor: '#151715'
  },
  routeCardLoop: {
    borderStyle: 'dotted',
    borderColor: '#465563'
  },
  routeCardSpecial: {
    borderStyle: 'dashed',
    borderColor: '#8d7a36'
  },
  routeCardSelected: {
    borderColor: '#4fce83',
    backgroundColor: '#102019'
  },
  routeCardExpanded: {
    flexBasis: '100%',
    borderColor: '#55b9ff',
    backgroundColor: '#111b27'
  },
  routeAccent: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 5
  },
  routeCardBody: {
    gap: 5,
    paddingBottom: 10,
    paddingLeft: 13,
    paddingRight: 9,
    paddingTop: 10
  },
  routeThumbnail: {
    width: '100%',
    height: 76,
    backgroundColor: '#0b1118',
    resizeMode: 'cover'
  },
  routeCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6
  },
  routeMapName: {
    color: '#f3f7fb',
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 18
  },
  routeRole: {
    color: '#a8b4c0',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 15
  },
  routeTypeText: {
    color: '#7f8c99',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  selectRouteButton: {
    alignSelf: 'flex-start',
    minHeight: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a3847',
    backgroundColor: '#151f2a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
    paddingHorizontal: 8
  },
  selectRouteButtonActive: {
    borderColor: '#4fce83',
    backgroundColor: '#4fce83'
  },
  selectRouteText: {
    color: '#a8b4c0',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  selectRouteTextActive: {
    color: '#0b1118'
  },
  expansionBadge: {
    minHeight: 20,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 6
  },
  expansionBadgeText: {
    fontSize: 10,
    fontWeight: '900'
  },
  sotvBadge: {
    borderColor: '#735ecb',
    backgroundColor: '#201a35'
  },
  sotvBadgeText: {
    color: '#c9b8ff'
  },
  sotsBadge: {
    borderColor: '#96752f',
    backgroundColor: '#2b2411'
  },
  sotsBadgeText: {
    color: '#f3d65f'
  },
  acBadge: {
    borderColor: '#4f7f8c',
    backgroundColor: '#16252b'
  },
  acBadgeText: {
    color: '#a9edf6'
  },
  routeExpanded: {
    gap: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#253241',
    paddingTop: 9
  },
  routeExpandedLabel: {
    color: '#55b9ff',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  routeExpandedText: {
    color: '#dbe4ee',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17
  },
  routeConnector: {
    height: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6
  },
  routeConnectorLine: {
    width: 46,
    borderTopWidth: 1,
    borderTopColor: '#344250'
  },
  routeConnectorLineMuted: {
    borderStyle: 'dashed',
    borderTopColor: '#263542'
  },
  routeFork: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#332f1f',
    backgroundColor: '#121715',
    gap: 9,
    padding: 10,
    ...surfaceShadow
  },
  routeForkLabel: {
    color: '#f3d65f',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  routeForkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  optionalRoute: {
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#2f6a66',
    backgroundColor: '#0d1a1d',
    gap: 8,
    padding: 10,
    ...surfaceShadow
  },
  optionalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  optionalTitle: {
    color: '#b8f4ee',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  sotsRoute: {
    borderColor: '#6d5e28',
    backgroundColor: '#17160e'
  },
  sotsTitle: {
    color: '#f3d65f'
  },
  acRoute: {
    borderColor: '#3f6f7b',
    backgroundColor: '#0f1b20'
  },
  acTitle: {
    color: '#a9edf6'
  }
});
