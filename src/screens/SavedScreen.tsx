import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { EmptyState } from '../components/EmptyState';
import { SegmentedButton } from '../components/SegmentedButton';
import { ItemRecord } from '../data/items';
import { styles } from '../styles';
import { sortModes } from '../theme';
import type { SortMode } from '../types';

export function SavedScreen({
  savedItems,
  sortMode,
  onSortModeChange,
  onBrowseItems,
  renderCatalog
}: {
  savedItems: ItemRecord[];
  sortMode: SortMode;
  onSortModeChange: (sortMode: SortMode) => void;
  onBrowseItems: () => void;
  renderCatalog: (records: ItemRecord[], empty: ReactElement) => ReactElement;
}) {
  return (
    <View style={styles.screenBody}>
      <View style={styles.savedHeader}>
        <Text style={styles.resultCount}>{savedItems.length} saved</Text>
        {savedItems.length > 0 ? (
          <SegmentedButton
            value={sortMode}
            values={sortModes}
            labels={{ manifest: 'Default', name: 'A-Z', rarity: 'Rarity' }}
            onChange={onSortModeChange}
          />
        ) : null}
      </View>
      {renderCatalog(savedItems, <EmptyState title="No saved items" actionLabel="Browse items" onAction={onBrowseItems} />)}
    </View>
  );
}
