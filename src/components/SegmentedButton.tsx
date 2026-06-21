import { Pressable, Text, View } from 'react-native';

import { styles } from '../styles';

export function SegmentedButton<T extends string>({
  value,
  values,
  labels,
  onChange
}: {
  value: T;
  values: readonly T[];
  labels: Record<T, string>;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.segmented}>
      {values.map((entry) => (
        <Pressable
          accessibilityRole="button"
          key={entry}
          onPress={() => onChange(entry)}
          style={[styles.segmentedButton, value === entry && styles.segmentedButtonActive]}
        >
          <Text style={[styles.segmentedText, value === entry && styles.segmentedTextActive]}>{labels[entry]}</Text>
        </Pressable>
      ))}
    </View>
  );
}
