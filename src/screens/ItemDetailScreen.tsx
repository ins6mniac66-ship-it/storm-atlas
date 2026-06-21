import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';

import { IconImage } from '../components/IconImage';
import { LinkedGlossaryText } from '../components/LinkedGlossaryText';
import { StackStepper } from '../components/StackStepper';
import { getItemIcon, getRelatedItems, ItemRecord } from '../data/items';
import { getCuratedSynergies } from '../data/itemSynergies';
import { itemScalingDataExamples, stackTypeLabels } from '../data/mechanics';
import { TrustBadge, SafetyWarning } from './MechanicsScreen';
import { styles } from '../styles';
import { rarityColors } from '../theme';

export function ItemDetailScreen({
  item,
  isFavorite,
  stackCount,
  onBack,
  onToggleFavorite,
  onIncrementItem,
  onDecrementItem,
  showSynergyPrompt,
  onDismissSynergyPrompt,
  onAddSynergyItem,
  onOpenItem,
  onOpenGlossaryEntry
}: {
  item: ItemRecord;
  isFavorite: boolean;
  stackCount: number;
  onBack: () => void;
  onToggleFavorite: () => void;
  onIncrementItem: () => void;
  onDecrementItem: () => void;
  showSynergyPrompt: boolean;
  onDismissSynergyPrompt: () => void;
  onAddSynergyItem: (itemId: string) => void;
  onOpenItem: (item: ItemRecord) => void;
  onOpenGlossaryEntry: (term: string) => void;
}) {
  const relatedItems = getRelatedItems(item);
  const curatedSynergies = getCuratedSynergies(item.id);
  const icon = getItemIcon(item);
  const scalingData = itemScalingDataExamples.find(
    (s) => s.itemId.toLowerCase() === item.id.toLowerCase()
  );

  return (
    <View style={styles.detailScreen}>
      <View style={styles.detailHeader}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.headerIconButton}>
          <Ionicons name="chevron-back" size={24} color="#dbe4ee" />
        </Pressable>
        <Text style={styles.detailHeaderTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Pressable accessibilityRole="button" onPress={onToggleFavorite} style={styles.headerIconButton}>
          <Ionicons name={isFavorite ? 'star' : 'star-outline'} size={22} color={isFavorite ? '#ffd166' : '#dbe4ee'} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.detailHero, { borderColor: `${rarityColors[item.rarity]}66` }]}>
          <View style={[styles.detailHeroGlow, { backgroundColor: `${rarityColors[item.rarity]}16` }]} />
          <View style={styles.detailIconWrap}>
            <IconImage source={icon} size={108} label={item.name} />
          </View>
          <View style={styles.detailHeroText}>
            <Text style={styles.detailName}>{item.name}</Text>
            <Text style={[styles.detailRarity, { color: rarityColors[item.rarity] }]}>{item.rarity}</Text>
            <Text style={styles.detailQuote}>{item.quote}</Text>
          </View>
        </View>

        <View style={styles.detailBuildPanel}>
          <View>
            <Text style={styles.sectionTitle}>Build Stack</Text>
            <Text style={styles.buildPanelMeta}>{stackCount > 0 ? `${stackCount} in active build` : 'Not in active build'}</Text>
          </View>
          <StackStepper count={stackCount} onDecrement={onDecrementItem} onIncrement={onIncrementItem} variant="detail" />
        </View>

        {showSynergyPrompt ? (
          <View style={styles.synergyPromptCard}>
            <View style={styles.synergyPromptHeader}>
              <View style={styles.synergyPromptTitleWrap}>
                <Text style={styles.sectionTitle}>Common synergies</Text>
                <Text style={styles.synergyPromptMeta}>
                  {curatedSynergies.length > 0 ? 'Add next for this build' : 'No curated synergies yet'}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Dismiss common synergies"
                onPress={onDismissSynergyPrompt}
                style={styles.synergyDismissButton}
              >
                <Ionicons name="close" size={18} color="#dbe4ee" />
              </Pressable>
            </View>
            {curatedSynergies.length > 0 ? (
              <View style={styles.synergySuggestionList}>
                {curatedSynergies.map(({ item: synergyItem, reason }) => (
                  <View key={synergyItem.id} style={styles.synergySuggestionRow}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => onOpenItem(synergyItem)}
                      style={styles.synergySuggestionInfo}
                    >
                      <IconImage source={getItemIcon(synergyItem)} size={40} label={synergyItem.name} />
                      <View style={styles.synergySuggestionText}>
                        <Text style={styles.synergySuggestionName} numberOfLines={1}>
                          {synergyItem.name}
                        </Text>
                        <Text style={styles.synergySuggestionReason} numberOfLines={1}>
                          {reason}
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Add ${synergyItem.name} to build`}
                      onPress={() => onAddSynergyItem(synergyItem.id)}
                      style={styles.synergyAddButton}
                    >
                      <Ionicons name="add" size={20} color="#0b0f14" />
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Effect</Text>
          <LinkedGlossaryText
            text={item.effect}
            style={styles.effectText}
            linkStyle={styles.inlineGlossaryLink}
            onOpenGlossaryEntry={onOpenGlossaryEntry}
          />
        </View>

        {scalingData ? (
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Stacking Math</Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ color: '#8b98a5', fontSize: 13, fontWeight: '800' }}>Stack Type:</Text>
                <View style={{ backgroundColor: '#1c2938', borderColor: '#55b9ff', borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                  <Text style={{ color: '#55b9ff', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}>
                    {stackTypeLabels[scalingData.stackType]}
                  </Text>
                </View>
              </View>
              <TrustBadge status={scalingData.sourceStatus} />
            </View>

            <SafetyWarning status={scalingData.sourceStatus} />

            <View style={{ backgroundColor: '#0b1118', borderWidth: 1, borderColor: '#2b3948', borderRadius: 8, padding: 12, gap: 8 }}>
              {scalingData.formula && (
                <View style={{ gap: 2 }}>
                  <Text style={{ fontWeight: '900', color: '#55b9ff', fontSize: 11, textTransform: 'uppercase' }}>Formula</Text>
                  <Text style={{ color: '#f3f7fb', fontSize: 13, fontFamily: 'monospace', backgroundColor: '#0a0f15', padding: 6, borderRadius: 4, overflow: 'hidden', fontWeight: '700' }}>
                    {scalingData.formula}
                  </Text>
                </View>
              )}

              <View style={{ gap: 2 }}>
                <Text style={{ fontWeight: '900', color: '#f3d65f', fontSize: 11, textTransform: 'uppercase' }}>Practical Meaning</Text>
                <Text style={{ color: '#dbe4ee', fontSize: 13, fontWeight: '700', lineHeight: 18 }}>
                  {scalingData.practicalMeaning}
                </Text>
              </View>

              {(scalingData.commonMistake || (scalingData.commonMistakes && scalingData.commonMistakes.length > 0)) && (
                <View style={{ gap: 4, borderTopWidth: 1, borderTopColor: '#1d2630', paddingTop: 6, marginTop: 4 }}>
                  <Text style={{ fontWeight: '900', color: '#ff7675', fontSize: 11, textTransform: 'uppercase' }}>Common Pitfalls</Text>
                  {scalingData.commonMistake && (
                    <Text style={{ color: '#e2bbc0', fontSize: 12, fontWeight: '700', lineHeight: 16 }}>
                      • {scalingData.commonMistake}
                    </Text>
                  )}
                  {scalingData.commonMistakes?.map((mistake, index) => (
                    <Text key={index} style={{ color: '#e2bbc0', fontSize: 12, fontWeight: '700', lineHeight: 16 }}>
                      • {mistake}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        ) : null}

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoryWrap}>
            {item.categories.map((category) => (
              <Pressable
                key={category}
                accessibilityRole="link"
                accessibilityLabel={`Open ${category} glossary entry`}
                onPress={() => onOpenGlossaryEntry(category)}
                style={styles.staticChip}
              >
                <Text style={styles.staticChipText}>{category}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>ID</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {item.id}
            </Text>
          </View>
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(item.source_url)} style={styles.sourceButton}>
            <Ionicons name="open-outline" size={18} color="#0b0f14" />
            <Text style={styles.sourceButtonText}>Source</Text>
          </Pressable>
        </View>

        {relatedItems.length > 0 ? (
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Related</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedRow}>
              {relatedItems.map((related) => (
                <Pressable key={related.id} accessibilityRole="button" onPress={() => onOpenItem(related)} style={styles.iconTile}>
                  <IconImage source={getItemIcon(related)} size={54} label={related.name} />
                  <Text style={styles.iconTileLabel} numberOfLines={2}>
                    {related.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
