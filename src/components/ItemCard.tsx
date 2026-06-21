import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { getItemExpansionLabel, getItemIcon, getItemScope, ItemRecord } from '../data/items';
import { styles } from '../styles';
import { rarityColors } from '../theme';
import type { ViewMode } from '../types';
import { IconImage } from './IconImage';
import { LinkedGlossaryText } from './LinkedGlossaryText';

export const ItemCard = React.memo(function ItemCard({
  item,
  viewMode,
  width,
  isFavorite,
  stackCount,
  onPress,
  onFavoritePress,
  onBuildAddPress,
  onBuildDecrementPress,
  onCategoryPress,
  onOpenGlossaryEntry
}: {
  item: ItemRecord;
  viewMode: ViewMode;
  width: number;
  isFavorite: boolean;
  stackCount: number;
  onPress: () => void;
  onFavoritePress: () => void;
  onBuildAddPress: () => void;
  onBuildDecrementPress: () => void;
  onCategoryPress?: (category: string) => void;
  onOpenGlossaryEntry: (term: string) => void;
}) {
  const icon = getItemIcon(item);
  const rarityColor = rarityColors[item.rarity];
  const isGrid = viewMode === 'grid';
  const visibleCategories = item.categories.slice(0, isGrid ? 2 : 3);
  const extraCategoryCount = Math.max(item.categories.length - visibleCategories.length, 0);
  const expansionLabel = getItemExpansionLabel(item);

  return (
    <View
      style={[styles.itemCard, isGrid ? styles.gridCard : styles.listCard, { width, borderColor: `${rarityColor}55` }]}
    >
      <View style={[styles.rarityStrip, { backgroundColor: rarityColor }]} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${item.name} details`}
        onPress={onPress}
        style={[styles.cardIconFrame, isGrid ? styles.gridIconFrame : styles.listIconFrame]}
      >
        <IconImage source={icon} size={isGrid ? 58 : 46} label={item.name} />
      </Pressable>
      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${item.name} details`}
            onPress={onPress}
            style={styles.cardTitleArea}
          >
            <Text style={styles.itemName} numberOfLines={isGrid ? 2 : 1}>
              {item.name}
            </Text>
            <View style={[styles.rarityBadge, { borderColor: `${rarityColor}66`, backgroundColor: `${rarityColor}18` }]}>
              <Text style={[styles.rarityLabel, { color: rarityColor }]} numberOfLines={1}>
                {item.rarity}
              </Text>
            </View>
            {getItemScope(item) === 'expansion' ? (
              <View style={styles.metadataPill}>
                <Text style={styles.metadataPillText} numberOfLines={1}>
                  {expansionLabel}
                </Text>
              </View>
            ) : null}
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={`Open ${item.name} details`} onPress={onPress} hitSlop={10} style={styles.detailsButton}>
            <Ionicons name="chevron-forward" size={18} color="#9aa7b5" />
          </Pressable>
        </View>
        <LinkedGlossaryText
          text={item.quote}
          style={styles.itemQuote}
          linkStyle={styles.inlineGlossaryLink}
          numberOfLines={isGrid ? 2 : 2}
          onOpenGlossaryEntry={onOpenGlossaryEntry}
        />
        <View style={styles.cardFooterRow}>
          <View style={styles.cardMetaRow}>
            {visibleCategories.map((category) => (
              <Pressable
                key={category}
                accessibilityRole="link"
                accessibilityLabel={`Open ${category} glossary entry`}
                onPress={() => onCategoryPress?.(category)}
                disabled={!onCategoryPress}
                style={styles.metadataPill}
              >
                <Text style={styles.metadataPillText} numberOfLines={1}>
                  {category}
                </Text>
              </Pressable>
            ))}
            {extraCategoryCount > 0 ? (
              <Text style={styles.metadataMoreText} numberOfLines={1}>
                +{extraCategoryCount}
              </Text>
            ) : null}
          </View>
          <View style={styles.cardActions}>
            {stackCount > 0 ? (
              <>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove one ${item.name} from build`}
                  onPress={onBuildDecrementPress}
                  hitSlop={10}
                  style={styles.buildSubtractButton}
                >
                  <Ionicons name="remove" size={18} color="#dbe4ee" />
                </Pressable>
                <View style={styles.stackBadge}>
                  <Text style={styles.stackBadgeText}>x{stackCount}</Text>
                </View>
              </>
            ) : null}
            <Pressable accessibilityRole="button" accessibilityLabel={`Add ${item.name} to build`} onPress={onBuildAddPress} hitSlop={10} style={styles.buildAddButton}>
              <Ionicons name="add" size={19} color="#071019" />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={isFavorite ? `Unsave ${item.name}` : `Save ${item.name}`} onPress={onFavoritePress} hitSlop={10} style={styles.favoriteButton}>
              <Ionicons name={isFavorite ? 'star' : 'star-outline'} size={20} color={isFavorite ? '#ffd166' : '#8b98a5'} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}, (prev, next) => {
  return (
    prev.item.id === next.item.id &&
    prev.viewMode === next.viewMode &&
    prev.width === next.width &&
    prev.isFavorite === next.isFavorite &&
    prev.stackCount === next.stackCount
  );
});
