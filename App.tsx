import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Platform, Pressable, StatusBar, Text, ToastAndroid, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { BottomTabs } from './src/components/BottomTabs';
import { releaseConfig } from './src/config/release';
import { ItemCard } from './src/components/ItemCard';
import { categories, findItemById, ItemRecord, items, rarities, Rarity } from './src/data/items';
import { combatMechanics } from './src/data/combatMechanics';
import { enemies } from './src/data/enemies';
import { equipment } from './src/data/equipment';
import { allGlossaryEntries, findGlossaryEntryByTerm } from './src/data/glossary';
import { artifactMechanics, maps } from './src/data/maps';
import { shrines } from './src/data/shrines';
import { survivors as survivorRecords } from './src/data/survivors';
import { chefRecipes } from './src/data/wanderingChefRecipes';
import { useCatalog } from './src/hooks/useCatalog';
import { usePersistedData } from './src/hooks/usePersistedData';
import { BestiaryScreen } from './src/screens/BestiaryScreen';
import { BuildScreen } from './src/screens/BuildScreen';
import { EquipmentScreen } from './src/screens/EquipmentScreen';
import { GlossaryScreen } from './src/screens/GlossaryScreen';
import { CatalogList, ItemsScreen } from './src/screens/ItemsScreen';
import { ItemDetailScreen } from './src/screens/ItemDetailScreen';
import { MapsScreen } from './src/screens/MapsScreen';
import { RarityScreen } from './src/screens/RarityScreen';
import { RecipesScreen } from './src/screens/RecipesScreen';
import { RunSystemsScreen } from './src/screens/RunSystemsScreen';
import { SavedScreen } from './src/screens/SavedScreen';
import { ShrinesScreen } from './src/screens/ShrinesScreen';
import { SurvivorsScreen } from './src/screens/SurvivorsScreen';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { ReferenceScreen } from './src/screens/ReferenceScreen';
import { MechanicsScreen } from './src/screens/MechanicsScreen';
import { ProcChainsScreen } from './src/screens/ProcChainsScreen';
import { styles } from './src/styles';
import { backExitWindowMs } from './src/theme';
import type { Tab, ReferenceSubScreen } from './src/types';

export default function App() {
  const { width } = useWindowDimensions();
  const enableScanner = releaseConfig.enableScanner;
  const [activeTab, setActiveTab] = useState<Tab>('items');
  const [referenceSubScreen, setReferenceSubScreen] = useState<ReferenceSubScreen | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedMechanicId, setSelectedMechanicId] = useState<string | null>(null);
  const [selectedGlossaryEntryId, setSelectedGlossaryEntryId] = useState<string | null>(null);
  const [lastBackPressAt, setLastBackPressAt] = useState(0);

  const {
    query,
    setQuery,
    selectedRarities,
    setSelectedRarities,
    selectedCategories,
    setSelectedCategories,
    contentScope,
    setContentScope,
    sortMode,
    setSortMode,
    viewMode,
    setViewMode,
    filteredItems,
    hasActiveFilters,
    activeFilterCount,
    clearFilters,
  } = useCatalog();

  const {
    isHydrated,
    favoriteIds,
    toggleFavorite,
    savedItems,
    buildState,
    buildItems,
    buildTotals,
    buildSummary,
    incrementBuildItem,
    addSynergyBuildItem,
    decrementBuildItem,
    removeBuildItem,
    clearBuild,
    clearBuildArmed,
    synergyPromptItemId,
    setSynergyPromptItemId,
    importBuildState,
  } = usePersistedData();

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (selectedItemId) {
        setSelectedItemId(null);
        return true;
      }

      if (activeTab === 'reference' && referenceSubScreen) {
        setReferenceSubScreen(null);
        return true;
      }

      const now = Date.now();
      if (now - lastBackPressAt <= backExitWindowMs) {
        BackHandler.exitApp();
        return true;
      }

      setLastBackPressAt(now);
      ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      return true;
    });

    return () => subscription.remove();
  }, [lastBackPressAt, selectedItemId, activeTab, referenceSubScreen]);

  const selectedItem = selectedItemId ? findItemById(selectedItemId) : null;
  const contentWidth = Math.max(width - 32, 280);
  const gridColumns = width >= 720 ? 3 : 2;
  const cardGap = 10;
  const cardWidth = viewMode === 'grid' ? (contentWidth - cardGap * (gridColumns - 1)) / gridColumns : contentWidth;

  const openItem = useCallback((item: ItemRecord) => {
    setSelectedItemId(item.id);
    setSynergyPromptItemId(null);
  }, [setSynergyPromptItemId]);

  const openMechanic = useCallback((id: string) => {
    setSelectedMechanicId(id);
    setActiveTab('reference');
    setReferenceSubScreen('run-systems');
  }, []);

  const openGlossaryEntry = useCallback((term: string) => {
    const entry = findGlossaryEntryByTerm(term);
    if (!entry) {
      return;
    }

    setSelectedGlossaryEntryId(entry.id);
    setSelectedItemId(null);
    setActiveTab('reference');
    setReferenceSubScreen('glossary');
  }, []);

  const renderItemCard = useCallback((item: ItemRecord) => {
    return (
      <ItemCard
        item={item}
        viewMode={viewMode}
        width={cardWidth}
        isFavorite={favoriteIds.includes(item.id)}
        stackCount={buildState[item.id] ?? 0}
        onPress={() => openItem(item)}
        onFavoritePress={() => toggleFavorite(item.id)}
        onBuildAddPress={() => incrementBuildItem(item.id)}
        onBuildDecrementPress={() => decrementBuildItem(item.id)}
        onCategoryPress={openGlossaryEntry}
        onOpenGlossaryEntry={openGlossaryEntry}
      />
    );
  }, [
    viewMode, cardWidth, favoriteIds, buildState,
    openItem, toggleFavorite, incrementBuildItem, decrementBuildItem, openGlossaryEntry
  ]);

  const setReachableTab = useCallback((tab: Tab) => {
    setActiveTab(tab === 'scanner' && !enableScanner ? 'items' : tab);
  }, [enableScanner]);

  function renderCatalog(records: ItemRecord[], empty: React.ReactElement) {
    return (
      <CatalogList
        records={records}
        viewMode={viewMode}
        gridColumns={gridColumns}
        renderItemCard={renderItemCard}
        empty={empty}
      />
    );
  }

  function renderActiveTab() {
    if (activeTab === 'items') {
      return (
        <ItemsScreen
          query={query}
          onQueryChange={setQuery}
          selectedRarities={selectedRarities}
          onSelectedRaritiesChange={setSelectedRarities}
          selectedCategories={selectedCategories}
          onSelectedCategoriesChange={setSelectedCategories}
          contentScope={contentScope}
          onContentScopeChange={setContentScope}
          sortMode={sortMode}
          onSortModeChange={setSortMode}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filteredItems={filteredItems}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          renderCatalog={renderCatalog}
          renderItemCard={renderItemCard}
        />
      );
    }

    if (activeTab === 'reference') {
      if (referenceSubScreen === 'rarity') {
        return <RarityScreen onOpenItem={openItem} />;
      }

      if (referenceSubScreen === 'glossary') {
        return (
          <GlossaryScreen
            selectedEntryId={selectedGlossaryEntryId}
            onSelectedEntryHandled={() => setSelectedGlossaryEntryId(null)}
            onOpenItem={openItem}
          />
        );
      }

      if (referenceSubScreen === 'survivors') {
        return <SurvivorsScreen onOpenMechanic={openMechanic} onOpenItem={openItem} />;
      }

      if (referenceSubScreen === 'bestiary') {
        return <BestiaryScreen />;
      }

      if (referenceSubScreen === 'maps') {
        return <MapsScreen />;
      }

      if (referenceSubScreen === 'recipes') {
        return <RecipesScreen buildState={buildState} onOpenItem={openItem} />;
      }

      if (referenceSubScreen === 'equipment') {
        return <EquipmentScreen />;
      }

      if (referenceSubScreen === 'shrines') {
        return <ShrinesScreen />;
      }

      if (referenceSubScreen === 'run-systems') {
        return (
          <RunSystemsScreen
            selectedMechanicId={selectedMechanicId}
            onSelectedMechanicHandled={() => setSelectedMechanicId(null)}
            onOpenItem={openItem}
          />
        );
      }

      if (referenceSubScreen === 'mechanics') {
        return <MechanicsScreen onOpenItem={openItem} />;
      }

      if (referenceSubScreen === 'proc-chains') {
        return <ProcChainsScreen onOpenItem={openItem} />;
      }

      return <ReferenceScreen onSelectSubScreen={setReferenceSubScreen} />;
    }

    if (activeTab === 'saved') {
      return (
        <SavedScreen
          savedItems={savedItems(sortMode)}
          sortMode={sortMode}
          onSortModeChange={setSortMode}
          onBrowseItems={() => setReachableTab('items')}
          renderCatalog={renderCatalog}
        />
      );
    }

    if (activeTab === 'scanner') {
      if (!enableScanner) {
        return null;
      }

      return (
        <ScannerScreen
          onImportBuild={importBuildState}
          onNavigateToBuild={() => setReachableTab('build')}
        />
      );
    }

    return (
      <BuildScreen
        buildItems={buildItems}
        totalStacks={buildTotals.totalStacks}
        uniqueItems={buildTotals.uniqueItems}
        summary={buildSummary}
        clearBuildArmed={clearBuildArmed}
        onClearBuild={clearBuild}
        onBrowseItems={() => setReachableTab('items')}
        onOpenItem={openItem}
        onIncrementItem={incrementBuildItem}
        onDecrementItem={decrementBuildItem}
        onRemoveItem={removeBuildItem}
      />
    );
  }

  if (!isHydrated) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.app, { justifyContent: 'center', alignItems: 'center' }]}>
          <StatusBar barStyle="light-content" />
          <ActivityIndicator size="large" color="#dbe4ee" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.app}>
        <StatusBar barStyle="light-content" />
        {selectedItem ? (
          <ItemDetailScreen
            item={selectedItem}
            isFavorite={favoriteIds.includes(selectedItem.id)}
            stackCount={buildState[selectedItem.id] ?? 0}
            onBack={() => setSelectedItemId(null)}
            onToggleFavorite={() => toggleFavorite(selectedItem.id)}
            onIncrementItem={() => incrementBuildItem(selectedItem.id)}
            onDecrementItem={() => decrementBuildItem(selectedItem.id)}
            showSynergyPrompt={synergyPromptItemId === selectedItem.id}
            onDismissSynergyPrompt={() => setSynergyPromptItemId(null)}
            onAddSynergyItem={addSynergyBuildItem}
            onOpenItem={openItem}
            onOpenGlossaryEntry={openGlossaryEntry}
          />
        ) : (
          <>
            {activeTab === 'reference' && referenceSubScreen ? (
              <View style={styles.appHeader}>
                <View style={styles.appHeaderTop}>
                  <Pressable
                    onPress={() => setReferenceSubScreen(null)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 }}
                  >
                    <Ionicons name="arrow-back" size={22} color="#55b9ff" />
                    <Text style={{ color: '#55b9ff', fontSize: 16, fontWeight: '800' }}>
                      Back to Reference
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              Platform.OS !== 'android' && activeTab !== 'items' && (
                <View style={styles.appHeader}>
                  <View style={styles.appHeaderTop}>
                    <View>
                      <TextBlock title="Storm Atlas" subtitle="Items, survivors, builds, and run prep" />
                    </View>
                    {activeFilterCount > 0 ? (
                      <View style={styles.filterCountBadge}>
                        <TextBlock count={activeFilterCount} />
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.headerStats}>
                    <HeaderStat value={items.length} label="Items" />
                    <HeaderStat
                      value={
                        activeTab === 'reference' && referenceSubScreen === 'survivors'
                          ? survivorRecords.length
                          : activeTab === 'reference' && referenceSubScreen === 'bestiary'
                            ? enemies.length
                            : activeTab === 'reference' && referenceSubScreen === 'maps'
                              ? maps.length + artifactMechanics.length
                              : activeTab === 'reference' && referenceSubScreen === 'glossary'
                                ? allGlossaryEntries.length
                                : activeTab === 'reference' && referenceSubScreen === 'recipes'
                                ? chefRecipes.length
                                  : activeTab === 'reference' && referenceSubScreen === 'equipment'
                                    ? equipment.length
                                    : activeTab === 'reference' && referenceSubScreen === 'shrines'
                                    ? shrines.filter((shrine) => shrine.scope === 'base').length
                                    : activeTab === 'reference' && referenceSubScreen === 'run-systems'
                                      ? combatMechanics.length
                                      : activeTab === 'reference' && referenceSubScreen === 'mechanics'
                                        ? 6
                                        : rarities.length
                      }
                      label={
                        activeTab === 'reference' && referenceSubScreen === 'survivors'
                          ? 'Survivors'
                          : activeTab === 'reference' && referenceSubScreen === 'bestiary'
                            ? 'Bestiary'
                            : activeTab === 'reference' && referenceSubScreen === 'maps'
                              ? 'Map Notes'
                              : activeTab === 'reference' && referenceSubScreen === 'glossary'
                                ? 'Terms'
                                : activeTab === 'reference' && referenceSubScreen === 'recipes'
                                 ? 'Recipes'
                                  : activeTab === 'reference' && referenceSubScreen === 'equipment'
                                    ? 'Equipment'
                                    : activeTab === 'reference' && referenceSubScreen === 'shrines'
                                    ? 'Shrines'
                                    : activeTab === 'reference' && referenceSubScreen === 'run-systems'
                                      ? 'Systems'
                                      : activeTab === 'reference' && referenceSubScreen === 'mechanics'
                                        ? 'Math Topics'
                                        : 'Rarities'
                      }
                    />
                    <HeaderStat value={categories.length} label="Tags" />
                  </View>
                </View>
              )
            )}
            <View style={styles.tabContent}>{renderActiveTab()}</View>
            <BottomTabs activeTab={activeTab} enableScanner={enableScanner} onTabPress={setReachableTab} />
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function TextBlock({ title, subtitle, count }: { title?: string; subtitle?: string; count?: number }) {
  if (typeof count === 'number') {
    return <Text style={styles.filterCountText}>{count}</Text>;
  }

  return (
    <>
      <Text style={styles.appTitle}>{title}</Text>
      <Text style={styles.appSubtitle}>{subtitle}</Text>
    </>
  );
}

function HeaderStat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
