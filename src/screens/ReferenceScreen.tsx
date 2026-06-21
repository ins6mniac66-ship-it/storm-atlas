import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ReferenceSubScreen } from '../types';

interface ReferenceScreenProps {
  onSelectSubScreen: (subScreen: ReferenceSubScreen) => void;
}

interface ReferenceItem {
  id: ReferenceSubScreen;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const referenceItems: ReferenceItem[] = [
  {
    id: 'survivors',
    title: 'Survivors',
    subtitle: 'Detailed loadouts & tactical guides',
    icon: 'person',
    color: '#55b9ff',
  },
  {
    id: 'bestiary',
    title: 'Bestiary',
    subtitle: 'Enemy logs, health, and behaviors',
    icon: 'skull',
    color: '#ff6b6b',
  },
  {
    id: 'maps',
    title: 'Maps & Realms',
    subtitle: 'Stage notes, secrets, and variants',
    icon: 'map',
    color: '#4ecdc4',
  },
  {
    id: 'recipes',
    title: 'Wandering Chef',
    subtitle: 'Cookbook recipes and stack yields',
    icon: 'restaurant',
    color: '#ffbe0b',
  },
  {
    id: 'equipment',
    title: 'Equipment',
    subtitle: 'Cooldowns, roles, and swap decisions',
    icon: 'flash',
    color: '#f4a261',
  },
  {
    id: 'shrines',
    title: 'Shrines & Altars',
    subtitle: 'Costs, mechanics, and drop pools',
    icon: 'trail-sign',
    color: '#a29bfe',
  },
  {
    id: 'run-systems',
    title: 'Combat Systems',
    subtitle: 'Status effects, damage, and scaling',
    icon: 'pulse',
    color: '#fd79a8',
  },
  {
    id: 'mechanics',
    title: 'Hidden Mechanics',
    subtitle: 'Proc multipliers, stacking, & damage math',
    icon: 'calculator',
    color: '#ff7675',
  },
  {
    id: 'proc-chains',
    title: 'Proc Chains',
    subtitle: 'Visual cascade pathways & trigger math',
    icon: 'git-network',
    color: '#ff9f43',
  },
  {
    id: 'glossary',
    title: 'Glossary & Terms',
    subtitle: 'In-game mechanics & keyword lookup',
    icon: 'book',
    color: '#ffeaa7',
  },
  {
    id: 'rarity',
    title: 'Rarities',
    subtitle: 'Item categories and drop chances',
    icon: 'layers',
    color: '#81ecec',
  },
];

export function ReferenceScreen({ onSelectSubScreen }: ReferenceScreenProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Reference</Text>
        <Text style={styles.subtitle}>Tactical logs, mechanical formulas, and realm mappings</Text>
      </View>

      <View style={styles.grid}>
        {referenceItems.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.card,
              { borderLeftColor: item.color },
              pressed && styles.cardPressed,
            ]}
            onPress={() => onSelectSubScreen(item.id)}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <Ionicons name="chevron-forward" size={16} color="#45505e" />
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </Pressable>
        ))}
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#f3f7fb',
  },
  subtitle: {
    fontSize: 13,
    color: '#9aa7b5',
    marginTop: 4,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#111923',
    borderColor: '#1d2630',
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 10,
    padding: 14,
    minHeight: 115,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    backgroundColor: '#172232',
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f3f7fb',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#7f8c99',
    lineHeight: 14,
    fontWeight: '600',
  },
});
