import { useMemo, useState } from 'react';
import { ContentScope } from '../data/expansions';
import { getItemScope, ItemRecord, items, Rarity } from '../data/items';
import type { SortMode, ViewMode } from '../types';
import { searchMatches, sortItems } from '../utils/catalog';

export function useCatalog() {
  const [query, setQuery] = useState('');
  const [selectedRarities, setSelectedRarities] = useState<Rarity[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [contentScope, setContentScope] = useState<ContentScope>('base');
  const [sortMode, setSortMode] = useState<SortMode>('manifest');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const hasActiveFilters =
    contentScope !== 'base' || query.trim().length > 0 || selectedRarities.length > 0 || selectedCategories.length > 0;
  const activeFilterCount =
    selectedRarities.length + selectedCategories.length + (contentScope !== 'base' ? 1 : 0) + (query.trim() ? 1 : 0);

  const filteredItems = useMemo(() => {
    const records = items.filter((item) => {
      const rarityMatch = selectedRarities.length === 0 || selectedRarities.includes(item.rarity);
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.every((category) => item.categories.includes(category));
      const scopeMatch = getItemScope(item) === contentScope;
      return scopeMatch && rarityMatch && categoryMatch && searchMatches(item, query);
    });

    return sortItems(records, sortMode);
  }, [contentScope, query, selectedCategories, selectedRarities, sortMode]);

  function clearFilters() {
    setQuery('');
    setSelectedRarities([]);
    setSelectedCategories([]);
    setContentScope('base');
  }

  return {
    query,
    setQuery,
    selectedRarities,
    setSelectedRarities,
    selectedCategories,
    setSelectedCategories,
    contentScope,
    setContentScope,
    sortMode,
    setSortMode,
    viewMode,
    setViewMode,
    filteredItems,
    hasActiveFilters,
    activeFilterCount,
    clearFilters
  };
}
