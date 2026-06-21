import { Image, ImageSourcePropType, Text, View } from 'react-native';

import { styles } from '../styles';

export function IconImage({ source, size, label }: { source: ImageSourcePropType | null; size: number; label: string }) {
  if (!source) {
    return (
      <View style={[styles.iconFallback, { width: size, height: size }]}>
        <Text style={styles.iconFallbackText}>{label.slice(0, 2).toUpperCase()}</Text>
      </View>
    );
  }

  return <Image source={source} style={{ width: size, height: size, resizeMode: 'contain' }} />;
}
