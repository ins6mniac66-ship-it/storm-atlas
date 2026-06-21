import { useState, type ReactElement } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Chip } from '../components/Chip';
import { EmptyState } from '../components/EmptyState';
import { ItemCard } from '../components/ItemCard';
import { SegmentedButton } from '../components/SegmentedButton';
import { ContentScope } from '../data/expansions';
import { ItemRecord, Rarity, categories, rarities } from '../data/items';
import { styles } from '../styles';
import { rarityColors, sortModes } from '../theme';
import type { SortMode, ViewMode } from '../types';
import { uniqueToggle } from '../utils/catalog';

export function ItemsScreen({
  query,
  onQueryChange,
  selectedRarities,
  onSelectedRaritiesChange,
  selectedCategories,
  onSelectedCategoriesChange,
  contentScope,
  onContentScopeChange,
  sortMode,
  onSortModeChange,
  viewMode,
  onViewModeChange,
  filteredItems,
  hasActiveFilters,
  clearFilters,
  renderCatalog,
  renderItemCard
}: {
  query: string;
  onQueryChange: (query: string) => void;
  selectedRarities: Rarity[];
  onSelectedRaritiesChange: (updater: (current: Rarity[]) => Rarity[]) => void;
  selectedCategories: string[];
  onSelectedCategoriesChange: (updater: (current: string[]) => string[]) => void;
  contentScope: ContentScope;
  onContentScopeChange: (scope: ContentScope) => void;
  sortMode: SortMode;
  onSortModeChange: (sortMode: SortMode) => void;
  viewMode: ViewMode;
  onViewModeChange: (updater: (current: ViewMode) => ViewMode) => void;
  filteredItems: ItemRecord[];
  hasActiveFilters: boolean;
  clearFilters: () => void;
  renderCatalog: (records: ItemRecord[], empty: ReactElement) => ReactElement;
  renderItemCard: (item: ItemRecord) => ReactElement;
}) {
  return (
    <View style={styles.screenBody}>
      <CatalogControls
        query={query}
        onQueryChange={onQueryChange}
        selectedRarities={selectedRarities}
        onSelectedRaritiesChange={onSelectedRaritiesChange}
        selectedCategories={selectedCategories}
        onSelectedCategoriesChange={onSelectedCategoriesChange}
        contentScope={contentScope}
        onContentScopeChange={onContentScopeChange}
        sortMode={sortMode}
        onSortModeChange={onSortModeChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />
      <View style={styles.resultsHeader}>
        <Text style={styles.resultCount}>{filteredItems.length} items</Text>
        {hasActiveFilters ? (
          <Pressable accessibilityRole="button" onPress={clearFilters} style={styles.clearInlineButton}>
            <Ionicons name="close" size={14} color="#dbe4ee" />
            <Text style={styles.clearInlineText}>Clear</Text>
          </Pressable>
        ) : null}
      </View>
      {renderCatalog(
        filteredItems,
        <EmptyState title="No items found" actionLabel={hasActiveFilters ? 'Clear filters' : undefined} onAction={clearFilters} />
      )}
    </View>
  );
}

export function CatalogControls({
  query,
  onQueryChange,
  selectedRarities,
  onSelectedRaritiesChange,
  selectedCategories,
  onSelectedCategoriesChange,
  contentScope,
  onContentScopeChange,
  sortMode,
  onSortModeChange,
  viewMode,
  onViewModeChange
}: {
  query: string;
  onQueryChange: (query: string) => void;
  selectedRarities: Rarity[];
  onSelectedRaritiesChange: (updater: (current: Rarity[]) => Rarity[]) => void;
  selectedCategories: string[];
  onSelectedCategoriesChange: (updater: (current: string[]) => string[]) => void;
  contentScope: ContentScope;
  onContentScopeChange: (scope: ContentScope) => void;
  sortMode: SortMode;
  onSortModeChange: (sortMode: SortMode) => void;
  viewMode: ViewMode;
  onViewModeChange: (updater: (current: ViewMode) => ViewMode) => void;
}) {
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

  return (
    <View style={styles.controls}>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#8b98a5" />
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search"
          placeholderTextColor="#687481"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query ? (
          <Pressable accessibilityRole="button" onPress={() => onQueryChange('')} hitSlop={12}>
            <Ionicons name="close-circle" size={18} color="#8b98a5" />
          </Pressable>
        ) : null}
      </View>

      <RarityFilters selectedRarities={selectedRarities} onSelectedRaritiesChange={onSelectedRaritiesChange} />

      <SegmentedButton
        value={contentScope}
        values={['base', 'expansion']}
        labels={{ base: 'Base Game', expansion: 'Expansions' }}
        onChange={onContentScopeChange}
      />

      <SelectedFilterChips selectedCategories={selectedCategories} onSelectedCategoriesChange={onSelectedCategoriesChange} />

      <AdvancedFiltersDrawer
        open={advancedFiltersOpen}
        onToggleOpen={() => setAdvancedFiltersOpen((current) => !current)}
        selectedCategories={selectedCategories}
        onSelectedCategoriesChange={onSelectedCategoriesChange}
      />

      <View style={styles.controlFooter}>
        <SegmentedButton
          value={sortMode}
          values={sortModes}
          labels={{ manifest: 'Default', name: 'A-Z', rarity: 'Rarity' }}
          onChange={onSortModeChange}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => onViewModeChange((current) => (current === 'list' ? 'grid' : 'list'))}
          style={styles.iconToggle}
        >
          <Ionicons name={viewMode === 'grid' ? 'list' : 'grid'} size={20} color="#dbe4ee" />
        </Pressable>
      </View>
    </View>
  );
}

function RarityFilters({
  selectedRarities,
  onSelectedRaritiesChange
}: {
  selectedRarities: Rarity[];
  onSelectedRaritiesChange: (updater: (current: Rarity[]) => Rarity[]) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
      <Chip label="All" active={selectedRarities.length === 0} onPress={() => onSelectedRaritiesChange(() => [])} />
      {rarities.map((rarity) => (
        <Chip
          key={rarity}
          label={rarity}
          active={selectedRarities.includes(rarity)}
          color={rarityColors[rarity]}
          onPress={() => onSelectedRaritiesChange((current) => uniqueToggle(current, rarity) as Rarity[])}
        />
      ))}
    </ScrollView>
  );
}

function SelectedFilterChips({
  selectedCategories,
  onSelectedCategoriesChange
}: {
  selectedCategories: string[];
  onSelectedCategoriesChange: (updater: (current: string[]) => string[]) => void;
}) {
  if (selectedCategories.length === 0) {
    return null;
  }

  return (
    <View style={styles.selectedFilterRow}>
      {selectedCategories.map((category) => (
        <Pressable
          accessibilityRole="button"
          key={category}
          onPress={() => onSelectedCategoriesChange((current) => current.filter((entry) => entry !== category))}
          style={styles.selectedFilterChip}
        >
          <Text style={styles.selectedFilterChipText} numberOfLines={1}>
            {category} ×
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function AdvancedFiltersDrawer({
  open,
  onToggleOpen,
  selectedCategories,
  onSelectedCategoriesChange
}: {
  open: boolean;
  onToggleOpen: () => void;
  selectedCategories: string[];
  onSelectedCategoriesChange: (updater: (current: string[]) => string[]) => void;
}) {
  return (
    <View style={styles.advancedFilters}>
      <Pressable accessibilityRole="button" onPress={onToggleOpen} style={styles.advancedFiltersToggle}>
        <Text style={styles.advancedFiltersToggleText}>Advanced Filters</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={17} color="#dbe4ee" />
      </Pressable>
      {open ? (
        <View style={styles.advancedFilterGrid}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              active={selectedCategories.includes(category)}
              onPress={() => onSelectedCategoriesChange((current) => uniqueToggle(current, category))}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function CatalogList({
  records,
  viewMode,
  gridColumns,
  renderItemCard,
  empty
}: {
  records: ItemRecord[];
  viewMode: ViewMode;
  gridColumns: number;
  renderItemCard: (item: ItemRecord) => ReactElement;
  empty: ReactElement;
}) {
  if (records.length === 0) {
    return empty;
  }

  return (
    <FlatList
      key={viewMode === 'grid' ? `grid-${gridColumns}` : 'list'}
      data={records}
      keyExtractor={(item) => item.id}
      numColumns={viewMode === 'grid' ? gridColumns : 1}
      columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => renderItemCard(item)}
      showsVerticalScrollIndicator={false}
      initialNumToRender={12}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
    />
  );
}

export { ItemCard };
