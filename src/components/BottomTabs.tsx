import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';

import { styles } from '../styles';
import type { Tab } from '../types';

const tabs: { tab: Tab; icon: keyof typeof Ionicons.glyphMap; label: string; developmentOnly?: boolean }[] = [
  { tab: 'items', icon: 'albums', label: 'Items' },
  { tab: 'saved', icon: 'star', label: 'Saved' },
  { tab: 'build', icon: 'construct', label: 'Build' },
  { tab: 'scanner', icon: 'scan', label: 'Scanner', developmentOnly: true },
  { tab: 'reference', icon: 'library', label: 'Reference' }
];

export function BottomTabs({
  activeTab,
  enableScanner,
  onTabPress
}: {
  activeTab: Tab;
  enableScanner: boolean;
  onTabPress: (tab: Tab) => void;
}) {
  const { width } = useWindowDimensions();
  const showLabels = width >= 560;
  const visibleTabs = tabs.filter((tab) => enableScanner || !tab.developmentOnly);

  return (
    <View style={styles.tabBar}>
      {visibleTabs.map((tab) => (
        <TabButton
          key={tab.tab}
          {...tab}
          active={activeTab === tab.tab}
          showLabel={showLabels}
          onPress={() => onTabPress(tab.tab)}
        />
      ))}
    </View>
  );
}

function TabButton({
  icon,
  label,
  active,
  showLabel,
  onPress
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  showLabel: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.tabButton, !showLabel && styles.tabButtonCompact, active && styles.tabButtonActive]}
    >
      <Ionicons name={active ? icon : (`${icon}-outline` as keyof typeof Ionicons.glyphMap)} size={22} color={active ? '#55b9ff' : '#8b98a5'} />
      {showLabel ? <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text> : null}
    </Pressable>
  );
}
