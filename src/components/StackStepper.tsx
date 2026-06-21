import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { styles } from '../styles';

export function StackStepper({
  count,
  onDecrement,
  onIncrement,
  onRemove,
  variant = 'row'
}: {
  count: number;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove?: () => void;
  variant?: 'row' | 'detail';
}) {
  return (
    <View style={variant === 'detail' ? styles.detailStepper : styles.stackStepper}>
      <Pressable accessibilityRole="button" onPress={onDecrement} style={styles.stackButton}>
        <Ionicons name="remove" size={variant === 'detail' ? 18 : 17} color="#dbe4ee" />
      </Pressable>
      <Text style={variant === 'detail' ? styles.detailStackCount : styles.stackCountText}>x{count}</Text>
      <Pressable accessibilityRole="button" onPress={onIncrement} style={styles.stackButtonPrimary}>
        <Ionicons name="add" size={variant === 'detail' ? 18 : 17} color="#061018" />
      </Pressable>
      {onRemove ? (
        <Pressable accessibilityRole="button" onPress={onRemove} style={styles.removeButton}>
          <Ionicons name="close" size={16} color="#ff8791" />
        </Pressable>
      ) : null}
    </View>
  );
}
