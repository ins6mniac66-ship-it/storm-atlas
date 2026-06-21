import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ItemRecord } from '../data/items';

type Row = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
};

export function ScreenScaffold({
  title,
  subtitle,
  rows,
  emptyText = 'Recovered screen shell is active. Full source data is still being restored.',
}: {
  title: string;
  subtitle?: string;
  rows?: Row[];
  emptyText?: string;
}) {
  const records = rows ?? [];

  return (
    <View style={local.screen}>
      <Text style={local.title}>{title}</Text>
      {subtitle ? <Text style={local.subtitle}>{subtitle}</Text> : null}
      {records.length === 0 ? (
        <View style={local.emptyBox}>
          <Text style={local.emptyText}>{emptyText}</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          contentContainerStyle={local.list}
          renderItem={({ item }) => (
            <View style={local.row}>
              <Text style={local.rowTitle}>{item.title}</Text>
              {item.subtitle ? <Text style={local.rowSubtitle}>{item.subtitle}</Text> : null}
              {item.meta ? <Text style={local.meta}>{item.meta}</Text> : null}
            </View>
          )}
        />
      )}
    </View>
  );
}

export function itemRows(items: ItemRecord[]) {
  return items.map((item) => ({
    id: item.id,
    title: item.name,
    subtitle: item.effect || item.quote,
    meta: item.rarity,
  }));
}

export function SimpleBackButton({ label = 'Back', onPress }: { label?: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={local.backButton}>
      <Text style={local.backButtonText}>{label}</Text>
    </Pressable>
  );
}

const local = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: '#080c11',
  },
  title: {
    color: '#f3f7fb',
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    color: '#9aa7b5',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  emptyBox: {
    borderColor: '#253241',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 14,
  },
  emptyText: {
    color: '#a8b4c0',
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    gap: 10,
    paddingTop: 14,
    paddingBottom: 24,
  },
  row: {
    backgroundColor: '#111923',
    borderColor: '#253241',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  rowTitle: {
    color: '#f3f7fb',
    fontSize: 15,
    fontWeight: '900',
  },
  rowSubtitle: {
    color: '#a8b4c0',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
  },
  meta: {
    color: '#55b9ff',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  backButton: {
    alignSelf: 'flex-start',
    borderColor: '#35506a',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#55b9ff',
    fontSize: 13,
    fontWeight: '900',
  },
});
