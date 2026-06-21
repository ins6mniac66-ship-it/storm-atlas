import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { IconImage } from '../components/IconImage';
import type { BuildState } from '../data/buildState';
import { chefRecipeCategories, chefRecipes, type ChefRecipe, type ChefRecipeCategory } from '../data/wanderingChefRecipes';
import { findItemById, findItemByName, getItemExpansionLabel, getItemIcon, type ItemRecord } from '../data/items';
import { surfaceShadow } from '../styles';
import { rarityColors } from '../theme';
import { uniqueToggle } from '../utils/catalog';

export function RecipesScreen({ buildState, onOpenItem }: { buildState: BuildState; onOpenItem: (item: ItemRecord) => void }) {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ChefRecipeCategory[]>([]);
  const buildItemNames = useMemo(() => {
    return new Set(
      Object.entries(buildState)
        .filter(([, count]) => count > 0)
        .map(([itemId]) => findItemById(itemId)?.name)
        .filter((name): name is string => typeof name === 'string')
    );
  }, [buildState]);

  const filteredRecipes = useMemo(() => {
    return chefRecipes.filter((recipe) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(recipe.category);
      return categoryMatch && recipeSearchMatches(recipe, query);
    });
  }, [query, selectedCategories]);

  const readyCount = useMemo(() => {
    return chefRecipes.filter((recipe) => recipe.ingredients.every((ingredient) => buildItemNames.has(ingredient))).length;
  }, [buildItemNames]);

  const hasActiveFilters = query.trim().length > 0 || selectedCategories.length > 0;

  function clearFilters() {
    setQuery('');
    setSelectedCategories([]);
  }

  return (
    <View style={screenStyles.body}>
      <View style={screenStyles.controls}>
        <View style={screenStyles.heroPanel}>
          <View style={screenStyles.heroIcon}>
            <Ionicons name="restaurant" size={22} color="#f3d65f" />
          </View>
          <View style={screenStyles.heroTextBlock}>
            <Text style={screenStyles.heroTitle}>Wandering CHEF Recipes</Text>
            <Text style={screenStyles.heroText}>
              Combine two compatible items at Wandering CHEF in Computational Exchange. Used ingredients are consumed.
            </Text>
          </View>
          <View style={screenStyles.readyPill}>
            <Text style={screenStyles.readyValue}>{readyCount}</Text>
            <Text style={screenStyles.readyLabel}>Ready</Text>
          </View>
        </View>

        <View style={screenStyles.searchRow}>
          <Ionicons name="search" size={18} color="#8b98a5" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search result or ingredient"
            placeholderTextColor="#687481"
            style={screenStyles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query ? (
            <Pressable accessibilityRole="button" onPress={() => setQuery('')} hitSlop={12}>
              <Ionicons name="close-circle" size={18} color="#8b98a5" />
            </Pressable>
          ) : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={screenStyles.filterRow}>
          {chefRecipeCategories.map((category) => (
            <Pressable
              key={category}
              accessibilityRole="button"
              onPress={() => setSelectedCategories((current) => uniqueToggle(current, category) as ChefRecipeCategory[])}
              style={[screenStyles.filterChip, selectedCategories.includes(category) && screenStyles.filterChipActive]}
            >
              <Text style={[screenStyles.filterText, selectedCategories.includes(category) && screenStyles.filterTextActive]}>
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={screenStyles.resultsHeader}>
        <Text style={screenStyles.resultCount}>{filteredRecipes.length} recipes</Text>
        {hasActiveFilters ? (
          <Pressable accessibilityRole="button" onPress={clearFilters} style={screenStyles.clearButton}>
            <Ionicons name="close" size={14} color="#dbe4ee" />
            <Text style={screenStyles.clearText}>Clear</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={screenStyles.listContent}>
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} buildItemNames={buildItemNames} onOpenItem={onOpenItem} />
        ))}
      </ScrollView>
    </View>
  );
}

function RecipeCard({
  recipe,
  buildItemNames,
  onOpenItem
}: {
  recipe: ChefRecipe;
  buildItemNames: Set<string>;
  onOpenItem: (item: ItemRecord) => void;
}) {
  const owned = recipe.ingredients.filter((ingredient) => buildItemNames.has(ingredient)).length;
  const ready = owned === recipe.ingredients.length;
  const resultItem = findRecipeItem(recipe.result);
  const accentColor = resultItem ? rarityColors[resultItem.rarity] : getCategoryColor(recipe.category);

  return (
    <View style={[screenStyles.card, { borderColor: accentColor }, ready && screenStyles.cardReady]}>
      <View style={screenStyles.cardTopRow}>
        <View style={screenStyles.resultBlock}>
          <Text style={screenStyles.resultName}>{recipe.result}</Text>
          <View style={screenStyles.metaRow}>
            <View style={[screenStyles.categoryBadge, { borderColor: accentColor }]}>
              <Text style={[screenStyles.categoryText, { color: accentColor }]}>{recipe.category}</Text>
            </View>
            {resultItem ? (
              <View style={screenStyles.expansionBadge}>
                <Text style={screenStyles.expansionText}>{getItemExpansionLabel(resultItem)}</Text>
              </View>
            ) : null}
            <View style={[screenStyles.statusBadge, ready && screenStyles.statusBadgeReady]}>
              <Ionicons name={ready ? 'checkmark-circle' : 'ellipse-outline'} size={13} color={ready ? '#80e6a2' : '#8b98a5'} />
              <Text style={[screenStyles.statusText, ready && screenStyles.statusTextReady]}>
                {ready ? 'Ready' : `${owned}/2`}
              </Text>
            </View>
          </View>
        </View>
        <RecipeItemButton name={recipe.result} item={resultItem} owned={false} size="large" onOpenItem={onOpenItem} />
      </View>

      <View style={screenStyles.recipeEquation}>
        <RecipeItemButton name={recipe.ingredients[0]} item={findRecipeItem(recipe.ingredients[0])} owned={buildItemNames.has(recipe.ingredients[0])} onOpenItem={onOpenItem} />
        <View style={screenStyles.operatorBox}>
          <Ionicons name="add" size={15} color="#a8b4c0" />
        </View>
        <RecipeItemButton name={recipe.ingredients[1]} item={findRecipeItem(recipe.ingredients[1])} owned={buildItemNames.has(recipe.ingredients[1])} onOpenItem={onOpenItem} />
        <View style={screenStyles.operatorBox}>
          <Ionicons name="arrow-forward" size={15} color="#a8b4c0" />
        </View>
        <RecipeItemButton name={recipe.result} item={resultItem} owned={false} onOpenItem={onOpenItem} />
      </View>

      {recipe.notes ? <Text style={screenStyles.noteText}>{recipe.notes}</Text> : null}
    </View>
  );
}

function RecipeItemButton({
  name,
  item,
  owned,
  size = 'normal',
  onOpenItem
}: {
  name: string;
  item: ItemRecord | null;
  owned: boolean;
  size?: 'normal' | 'large';
  onOpenItem: (item: ItemRecord) => void;
}) {
  const iconSize = size === 'large' ? 42 : 34;
  const swatchColor = item ? rarityColors[item.rarity] : '#3a4654';
  const content = (
    <>
      <View style={[screenStyles.recipeIconFrame, { borderColor: swatchColor }, owned && screenStyles.recipeIconOwned]}>
        <IconImage source={item ? getItemIcon(item) : null} size={iconSize} label={name} />
        {owned ? (
          <View style={screenStyles.ownedCheck}>
            <Ionicons name="checkmark" size={10} color="#07120b" />
          </View>
        ) : null}
      </View>
      {size === 'normal' ? <Text style={screenStyles.recipeItemLabel} numberOfLines={2}>{name}</Text> : null}
    </>
  );

  return item ? (
    <Pressable
      accessibilityRole="button"
      onPress={() => onOpenItem(item)}
      style={[size === 'large' ? screenStyles.resultIconButton : screenStyles.recipeItemButton, owned && screenStyles.recipeItemOwned]}
    >
      {content}
    </Pressable>
  ) : (
    <View style={[size === 'large' ? screenStyles.resultIconButton : screenStyles.recipeItemButton, owned && screenStyles.recipeItemOwned]}>
      {content}
    </View>
  );
}

function recipeSearchMatches(recipe: ChefRecipe, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return [recipe.result, recipe.category, recipe.notes ?? '', ...recipe.ingredients].join(' ').toLowerCase().includes(normalized);
}

function findRecipeItem(name: string) {
  return findItemByName(name.replace(/^\d+x\s+/i, ''));
}

function getCategoryColor(category: ChefRecipeCategory) {
  switch (category) {
    case 'Common':
      return rarityColors.Common;
    case 'Uncommon':
      return rarityColors.Uncommon;
    case 'Legendary':
      return rarityColors.Legendary;
    case 'Boss':
      return rarityColors.Boss;
    case 'Elite Aspect':
      return rarityColors.Lunar;
    case 'Equipment':
      return '#f4a261';
    case 'Route':
      return '#55b9ff';
    case 'Meal':
      return '#f3d65f';
    case 'Repair':
      return '#9aa7b5';
    default:
      return '#9aa7b5';
  }
}

const screenStyles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16
  },
  controls: {
    gap: 11,
    paddingTop: 14,
    paddingBottom: 10
  },
  heroPanel: {
    minHeight: 88,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3c3420',
    backgroundColor: '#111923',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 13,
    ...surfaceShadow
  },
  heroIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5c4b1f',
    backgroundColor: '#211b10',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroTextBlock: {
    flex: 1,
    minWidth: 0
  },
  heroTitle: {
    color: '#f3f7fb',
    fontSize: 18,
    fontWeight: '900'
  },
  heroText: {
    color: '#9aa7b5',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    marginTop: 3
  },
  readyPill: {
    minWidth: 58,
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#264b35',
    backgroundColor: '#122219',
    alignItems: 'center',
    justifyContent: 'center'
  },
  readyValue: {
    color: '#80e6a2',
    fontSize: 17,
    fontWeight: '900'
  },
  readyLabel: {
    color: '#8fcfa5',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  searchRow: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#121a24',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 13,
    ...surfaceShadow
  },
  searchInput: {
    color: '#f3f7fb',
    flex: 1,
    fontSize: 16,
    paddingVertical: 0
  },
  filterRow: {
    gap: 8,
    paddingRight: 16
  },
  filterChip: {
    height: 34,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    paddingHorizontal: 11
  },
  filterChipActive: {
    backgroundColor: '#1a2634',
    borderColor: '#55b9ff'
  },
  filterText: {
    color: '#a8b4c0',
    fontSize: 12,
    fontWeight: '800'
  },
  filterTextActive: {
    color: '#f3f7fb'
  },
  resultsHeader: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  resultCount: {
    color: '#9aa7b5',
    fontSize: 13,
    fontWeight: '700'
  },
  clearButton: {
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#111923',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 9
  },
  clearText: {
    color: '#dbe4ee',
    fontSize: 12,
    fontWeight: '900'
  },
  listContent: {
    paddingBottom: 116,
    gap: 11
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#111923',
    padding: 13,
    gap: 12,
    ...surfaceShadow
  },
  cardReady: {
    borderColor: '#2f6b43'
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  resultBlock: {
    flex: 1,
    minWidth: 0,
    gap: 7
  },
  resultName: {
    color: '#f3f7fb',
    fontSize: 16,
    fontWeight: '900'
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7
  },
  categoryBadge: {
    minHeight: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2e4358',
    backgroundColor: '#101a26',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '900'
  },
  expansionBadge: {
    minHeight: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#0d141d',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  expansionText: {
    color: '#a8b4c0',
    fontSize: 11,
    fontWeight: '900'
  },
  statusBadge: {
    minHeight: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0d141d',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8
  },
  statusBadgeReady: {
    borderColor: '#2f6b43',
    backgroundColor: '#102017'
  },
  statusText: {
    color: '#9aa7b5',
    fontSize: 11,
    fontWeight: '900'
  },
  statusTextReady: {
    color: '#80e6a2'
  },
  recipeEquation: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    paddingTop: 2
  },
  operatorBox: {
    width: 26,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0d141d',
    alignItems: 'center',
    justifyContent: 'center'
  },
  recipeItemButton: {
    width: 78,
    minHeight: 78,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#26445a',
    backgroundColor: '#0d1821',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
    padding: 6
  },
  recipeItemOwned: {
    borderColor: '#2f6b43',
    backgroundColor: '#102017'
  },
  resultIconButton: {
    width: 52,
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#26445a',
    backgroundColor: '#0d1821',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4
  },
  recipeIconFrame: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#080c11',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  recipeIconOwned: {
    backgroundColor: '#102017'
  },
  ownedCheck: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#80e6a2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  recipeItemLabel: {
    color: '#dbe4ee',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
    textAlign: 'center'
  },
  noteText: {
    color: '#9aa7b5',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700'
  }
});
