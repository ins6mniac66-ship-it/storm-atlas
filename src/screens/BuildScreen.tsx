import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { EmptyState } from '../components/EmptyState';
import { IconImage } from '../components/IconImage';
import { StackStepper } from '../components/StackStepper';
import { BuildSummaryBucket } from '../data/buildState';
import { getItemIcon, ItemRecord } from '../data/items';
import { styles } from '../styles';
import { rarityColors } from '../theme';

export function BuildScreen({
  buildItems,
  totalStacks,
  uniqueItems,
  summary,
  clearBuildArmed,
  onClearBuild,
  onBrowseItems,
  onOpenItem,
  onIncrementItem,
  onDecrementItem,
  onRemoveItem
}: {
  buildItems: { item: ItemRecord; count: number }[];
  totalStacks: number;
  uniqueItems: number;
  summary: BuildSummaryBucket[];
  clearBuildArmed: boolean;
  onClearBuild: () => void;
  onBrowseItems: () => void;
  onOpenItem: (item: ItemRecord) => void;
  onIncrementItem: (id: string) => void;
  onDecrementItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
}) {
  if (buildItems.length === 0) {
    return (
      <View style={styles.screenBody}>
        <EmptyState title="No build items" actionLabel="Browse items" onAction={onBrowseItems} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.buildContent} showsVerticalScrollIndicator={false}>
      <View style={styles.buildHero}>
        <View>
          <Text style={styles.buildTitle}>Active Build</Text>
          <Text style={styles.buildSubtitle}>
            {totalStacks} stacks across {uniqueItems} items
          </Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onClearBuild} style={[styles.clearBuildButton, clearBuildArmed && styles.clearBuildButtonArmed]}>
          <Ionicons name={clearBuildArmed ? 'warning' : 'trash-outline'} size={16} color={clearBuildArmed ? '#0b0f14' : '#ff8791'} />
          <Text style={[styles.clearBuildText, clearBuildArmed && styles.clearBuildTextArmed]}>
            {clearBuildArmed ? 'Confirm' : 'Clear'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.summaryGrid}>
        {summary.map((bucket) => (
          <View key={bucket.key} style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{bucket.count}</Text>
            <Text style={styles.summaryLabel}>{bucket.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buildList}>
        {buildItems.map(({ item, count }) => (
          <View key={item.id} style={[styles.buildRow, { borderColor: `${rarityColors[item.rarity]}4d` }]}>
            <Pressable accessibilityRole="button" onPress={() => onOpenItem(item)} style={styles.buildItemInfo}>
              <View style={styles.buildItemIcon}>
                <IconImage source={getItemIcon(item)} size={42} label={item.name} />
              </View>
              <View style={styles.buildItemText}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.rarityLabel, { color: rarityColors[item.rarity] }]}>{item.rarity}</Text>
              </View>
            </Pressable>
            <StackStepper
              count={count}
              onDecrement={() => onDecrementItem(item.id)}
              onIncrement={() => onIncrementItem(item.id)}
              onRemove={() => onRemoveItem(item.id)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
