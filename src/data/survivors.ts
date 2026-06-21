import rawManifest from '../../RiskOfRain2_Survivors/survivors.json';
import { getContentScope, getExpansionLabel, isBaseGame, type ContentScope } from './expansions';
import { iconSources } from './iconSources';

export type SurvivorRecord = {
  name: string;
  description: string;
  base_health: string | null;
  base_damage: string | null;
  base_speed: string | null;
  base_armor: string | null;
  expansion: string | null;
  unlock: string | null;
  file: string;
  source_url: string;
  width: number;
  height: number;
};

export const survivors: SurvivorRecord[] = rawManifest as SurvivorRecord[];

export function getSurvivorIcon(survivor: SurvivorRecord) {
  return iconSources[survivor.file] ?? null;
}

export function getSurvivorScope(survivor: SurvivorRecord): ContentScope {
  return getContentScope(survivor.expansion);
}

export function getSurvivorExpansionLabel(survivor: SurvivorRecord) {
  return getExpansionLabel(survivor.expansion);
}

export function isBaseGameSurvivor(survivor: SurvivorRecord) {
  return isBaseGame(survivor.expansion);
}
