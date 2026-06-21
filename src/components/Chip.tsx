import { Pressable, Text } from 'react-native';

import { styles } from '../styles';

export function Chip({
  label,
  active,
  onPress,
  color
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive, active && color ? { borderColor: color } : null]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}
