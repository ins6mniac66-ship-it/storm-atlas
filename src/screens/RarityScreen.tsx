import { Pressable, ScrollView, Text, View } from 'react-native';

import { IconImage } from '../components/IconImage';
import { getItemIcon, ItemRecord, items, rarities } from '../data/items';
import { styles } from '../styles';
import { rarityColors } from '../theme';

export function RarityScreen({ onOpenItem }: { onOpenItem: (item: ItemRecord) => void }) {
  return (
    <ScrollView contentContainerStyle={styles.rarityContent} showsVerticalScrollIndicator={false}>
      {rarities.map((rarity) => {
        const rarityItems = items.filter((item) => item.rarity === rarity);
        return (
          <View key={rarity} style={styles.rarityGroup}>
            <View style={[styles.rarityHeader, { borderColor: `${rarityColors[rarity]}3d` }]}>
              <View style={[styles.rarityDot, { backgroundColor: rarityColors[rarity] }]} />
              <Text style={styles.rarityTitle}>{rarity}</Text>
              <Text style={[styles.rarityCount, { color: rarityColors[rarity] }]}>{rarityItems.length}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedRow}>
              {rarityItems.map((item) => (
                <Pressable key={item.id} accessibilityRole="button" onPress={() => onOpenItem(item)} style={styles.iconTile}>
                  <IconImage source={getItemIcon(item)} size={54} label={item.name} />
                  <Text style={styles.iconTileLabel} numberOfLines={2}>
                    {item.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
}
