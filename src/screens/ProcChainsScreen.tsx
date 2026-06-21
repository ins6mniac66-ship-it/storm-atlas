import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { findItemByName, getItemIcon, type ItemRecord } from '../data/items';
import { IconImage } from '../components/IconImage';
import { surfaceShadow } from '../styles';

interface ProcChainsScreenProps {
  onOpenItem: (item: ItemRecord) => void;
}

export function ProcChainsScreen({ onOpenItem }: ProcChainsScreenProps) {
  const renderItemRow = (itemName: string, customChanceText?: string) => {
    const item = findItemByName(itemName);
    if (!item) return null;
    const icon = getItemIcon(item);

    return (
      <Pressable
        key={itemName}
        onPress={() => onOpenItem(item)}
        style={({ pressed }) => [
          styles.itemRow,
          pressed && styles.itemRowPressed,
        ]}
      >
        <View style={styles.itemRowLeft}>
          <View style={styles.itemIconContainer}>
            <IconImage source={icon} size={28} label={item.name} />
          </View>
          <Text style={styles.itemRowText}>{item.name}</Text>
        </View>
        {customChanceText && (
          <View style={styles.chanceBadge}>
            <Text style={styles.chanceBadgeText}>{customChanceText}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  const exData = {
    pc: '1.00',
    desc: 'Use this as the full-value baseline: each valid hit applies item trigger chances at normal strength before downstream proc rules.',
    ukeChance: '25.0% Chance',
    atgChance: '10.0% Chance',
    chainChance: '2.0%',
    actionName: 'Valid Hit',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>✦ PROC CHAIN GUIDE ✦</Text>
        <Text style={styles.subtitle}>Optimize your on-hit effects and item synergies for maximum impact.</Text>
      </View>

      {/* Main Cascade Chain Column */}
      <View style={styles.chainColumn}>
        
        {/* Step 1: Attack Card */}
        <View style={styles.nodeCard}>
          <Text style={styles.nodeStepLabel}>1. Hit Source</Text>
          <View style={styles.actionRow}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="play-forward" size={18} color="#ff9f43" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>{exData.actionName}</Text>
              <Text style={styles.actionSubtext}>Proc Coefficient: {exData.pc}</Text>
              <Text style={styles.actionDescription}>{exData.desc}</Text>
            </View>
          </View>
        </View>

        {/* Down Arrow */}
        <View style={styles.connector}>
          <View style={styles.connectorLine} />
          <Ionicons name="chevron-down" size={20} color="#ff9f43" />
        </View>

        {/* Step 2: Primary On-Hits Card */}
        <View style={styles.nodeCard}>
          <Text style={styles.nodeStepLabel}>2. Primary On-Hits</Text>
          <View style={styles.itemsListContainer}>
            {renderItemRow('Ukulele', exData.ukeChance)}
            {renderItemRow('Tri-Tip Dagger', `${(10 * parseFloat(exData.pc)).toFixed(1)}% Chance`)}
            {renderItemRow('Sticky Bomb', `${(5 * parseFloat(exData.pc)).toFixed(1)}% Chance`)}
          </View>
        </View>

        {/* Down Arrow */}
        <View style={styles.connector}>
          <View style={styles.connectorLine} />
          <Ionicons name="chevron-down" size={20} color="#ff9f43" />
        </View>

        {/* Step 3: Secondary Cascades Card */}
        <View style={styles.nodeCard}>
          <Text style={styles.nodeStepLabel}>3. Secondary Cascades</Text>
          <View style={styles.itemsListContainer}>
            {renderItemRow('AtG Missile Mk. 1', exData.atgChance)}
          </View>
          <View style={styles.mathCalloutBox}>
            <Text style={styles.mathText}>
              Formula: 10% (AtG Base) × {exData.pc} (Proc Coefficient) = {exData.atgChance.split(' ')[0]} trigger chance.
            </Text>
          </View>
        </View>

        {/* Down Arrow */}
        <View style={styles.connector}>
          <View style={styles.connectorLine} />
          <Ionicons name="chevron-down" size={20} color="#ff9f43" />
        </View>

        {/* Step 4: Legendary Finishers */}
        <View style={styles.nodeCard}>
          <Text style={styles.nodeStepLabel}>4. Legendary Finishers & Bands</Text>
          <View style={styles.itemsListContainer}>
            {renderItemRow("Kjaro's Band", 'Trigger > 400%')}
            {renderItemRow("Runald's Band", 'Trigger > 400%')}
            {renderItemRow('Sentient Meat Hook', `${(20 * parseFloat(exData.pc)).toFixed(1)}% Chance`)}
          </View>
        </View>

      </View>

      {/* Rules Card */}
      <View style={styles.rulesCard}>
        <Text style={styles.rulesTitle}>PROC CHAIN RULES</Text>
        <Text style={styles.rulesText}>
          ✦ Proc multipliers scale on-hit items continuously.{"\n"}
          ✦ Downstream hits inherit base damage properties.{"\n"}
          ✦ Ukulele chains have a lower Proc Coefficient (0.2).
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080c11',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
    alignItems: 'stretch',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ff9f43',
    letterSpacing: 1.5,
    textShadowColor: '#ff9f4340',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#8b98a5',
    marginTop: 6,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 16,
  },
  chainColumn: {
    alignItems: 'stretch',
  },
  nodeCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ff9f4350',
    backgroundColor: '#111923',
    padding: 14,
    gap: 12,
    ...surfaceShadow,
  },
  nodeStepLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#f3f7fb',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0d131b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    padding: 10,
  },
  actionIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ff9f4340',
    backgroundColor: '#ff9f4310',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextContainer: {
    flex: 1,
    gap: 2,
  },
  actionTitle: {
    color: '#f3f7fb',
    fontSize: 14,
    fontWeight: '900',
  },
  actionSubtext: {
    color: '#8b98a5',
    fontSize: 11,
    fontWeight: '700',
  },
  actionDescription: {
    color: '#9aa7b5',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
  },
  connector: {
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#ff9f4340',
  },
  itemsListContainer: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0d131b',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  itemRowPressed: {
    borderColor: '#ff9f43',
    backgroundColor: '#ff9f4310',
  },
  itemRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemRowText: {
    color: '#f3f7fb',
    fontSize: 13,
    fontWeight: '800',
  },
  chanceBadge: {
    borderRadius: 6,
    backgroundColor: '#142517',
    borderWidth: 1,
    borderColor: '#34a853',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chanceBadgeText: {
    color: '#34a853',
    fontSize: 11,
    fontWeight: '800',
  },
  mathCalloutBox: {
    borderRadius: 6,
    backgroundColor: '#0b1118',
    borderColor: '#1d2630',
    borderWidth: 1,
    padding: 8,
  },
  mathText: {
    color: '#ffeaa7',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 15,
  },
  rulesCard: {
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    padding: 14,
    gap: 10,
    alignItems: 'center',
  },
  rulesTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ff9f43',
    letterSpacing: 1,
  },
  rulesText: {
    color: '#8b98a5',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
