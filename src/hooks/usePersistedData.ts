import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BuildState, decrementStack, getBuildItems, getBuildSummary, getBuildTotals, incrementStack, removeStack, sanitizeBuildState } from '../data/buildState';
import { findItemById, ItemRecord } from '../data/items';
import type { SortMode } from '../types';
import { sortItems, uniqueToggle } from '../utils/catalog';

const favoriteStorageKey = 'ror2-item-browser:favorites';
const buildStorageKey = 'ror2-item-browser:active-build';

export function usePersistedData() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [favoritesHydrated, setFavoritesHydrated] = useState(false);
  const [buildHydrated, setBuildHydrated] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [buildState, setBuildState] = useState<BuildState>({});
  const [clearBuildArmed, setClearBuildArmed] = useState(false);
  const [synergyPromptItemId, setSynergyPromptItemId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.multiGet([favoriteStorageKey, buildStorageKey])
      .then((entries) => {
        const values = Object.fromEntries(entries as readonly (readonly [string, string | null])[]);
        const favoritesValue = values[favoriteStorageKey];
        const buildValue = values[buildStorageKey];

        if (favoritesValue) {
          try {
            const parsedFavorites = JSON.parse(favoritesValue);
            if (Array.isArray(parsedFavorites)) {
              setFavoriteIds(parsedFavorites.filter((entry): entry is string => typeof entry === 'string'));
            }
            setFavoritesHydrated(true);
          } catch {
            setFavoritesHydrated(false);
          }
        } else {
          setFavoritesHydrated(true);
        }

        if (buildValue) {
          try {
            setBuildState(sanitizeBuildState(JSON.parse(buildValue)));
            setBuildHydrated(true);
          } catch {
            setBuildHydrated(false);
          }
        } else {
          setBuildHydrated(true);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        setIsHydrated(true);
      });
  }, []);

  useEffect(() => {
    if (isHydrated && favoritesHydrated) {
      AsyncStorage.setItem(favoriteStorageKey, JSON.stringify(favoriteIds)).catch(() => undefined);
    }
  }, [favoriteIds, favoritesHydrated, isHydrated]);

  useEffect(() => {
    if (isHydrated && buildHydrated) {
      AsyncStorage.setItem(buildStorageKey, JSON.stringify(buildState)).catch(() => undefined);
    }
  }, [buildState, buildHydrated, isHydrated]);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((current) => uniqueToggle(current, id));
  }, []);

  const incrementBuildItem = useCallback((id: string) => {
    setBuildState((current) => incrementStack(current, id));
    setSynergyPromptItemId(id);
    setClearBuildArmed(false);
  }, []);

  const addSynergyBuildItem = useCallback((id: string) => {
    setBuildState((current) => incrementStack(current, id));
    setClearBuildArmed(false);
  }, []);

  const decrementBuildItem = useCallback((id: string) => {
    setBuildState((current) => decrementStack(current, id));
    setSynergyPromptItemId(null);
    setClearBuildArmed(false);
  }, []);

  const removeBuildItem = useCallback((id: string) => {
    setBuildState((current) => removeStack(current, id));
    setSynergyPromptItemId(null);
    setClearBuildArmed(false);
  }, []);

  const clearBuild = useCallback(() => {
    if (!clearBuildArmed) {
      setClearBuildArmed(true);
      return;
    }

    setBuildState({});
    setClearBuildArmed(false);
  }, [clearBuildArmed]);

  const savedItems = useCallback((sortMode: SortMode) => {
    const saved = favoriteIds.map(findItemById).filter((item): item is ItemRecord => item !== null);
    return sortItems(saved, sortMode);
  }, [favoriteIds]);

  const buildItems = useMemo(() => getBuildItems(buildState), [buildState]);
  const buildTotals = useMemo(() => getBuildTotals(buildState), [buildState]);
  const buildSummary = useMemo(() => getBuildSummary(buildState), [buildState]);

  const importBuildState = useCallback((state: BuildState) => {
    setBuildState((current) => {
      const merged = { ...current };
      for (const [id, count] of Object.entries(state)) {
        merged[id] = (merged[id] ?? 0) + count;
      }
      return sanitizeBuildState(merged);
    });
  }, []);

  return {
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
  };
}
