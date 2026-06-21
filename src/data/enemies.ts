import rawManifest from '../../RiskOfRain2_Enemies/enemies.json';
import { getContentScope, getExpansionLabel, type ContentScope } from './expansions';
import { iconSources } from './iconSources';

export type EnemyRecord = {
  name: string;
  type: string | null;
  class: string | null;
  base_health: number | null;
  scaling_health: number | null;
  base_damage: number | null;
  scaling_damage: number | null;
  base_armor: number | null;
  base_speed: number | null;
  credits_cost: number | null;
  boss_name: string | null;
  expansion: string | null;
  image_filename: string;
  file: string;
  source_url: string;
  width: number;
  height: number;
};

export type EnemyScope = ContentScope;

export const enemies: EnemyRecord[] = rawManifest as EnemyRecord[];

export function getEnemyIcon(enemy: EnemyRecord) {
  return iconSources[enemy.file] ?? null;
}

export function getEnemyScope(enemy: EnemyRecord): EnemyScope {
  return getContentScope(enemy.expansion);
}

export function getEnemyExpansionLabel(enemy: EnemyRecord) {
  return getExpansionLabel(enemy.expansion);
}

export function isBossEnemy(enemy: EnemyRecord) {
  return (enemy.type ?? '').toLowerCase().includes('boss');
}

export function isPhaseEnemy(enemy: EnemyRecord) {
  return (enemy.type ?? '').toLowerCase().includes('phase') || /\(phase \d+\)/i.test(enemy.name);
}

export function isAllyVariant(enemy: EnemyRecord) {
  return enemy.type === 'Ally' || /\(ally\)/i.test(enemy.name);
}

export function getEnemyTags(enemy: EnemyRecord) {
  return [
    enemy.type,
    enemy.class,
    enemy.boss_name,
    getEnemyExpansionLabel(enemy),
    getEnemyScope(enemy),
    isBossEnemy(enemy) ? 'boss' : null,
    isPhaseEnemy(enemy) ? 'phase variant' : null,
    isAllyVariant(enemy) ? 'ally variant' : null,
    enemy.base_speed !== null && enemy.base_speed >= 10 ? 'high speed' : null,
    enemy.base_armor !== null && enemy.base_armor >= 20 ? 'armored' : null
  ].filter((tag): tag is string => Boolean(tag));
}

export function getEnemyTacticalTips(enemy: EnemyRecord) {
  const tips: string[] = [];

  if (isBossEnemy(enemy)) {
    tips.push('Prepare burst damage and enough sustain before committing to the fight.');
  }

  if (isPhaseEnemy(enemy)) {
    tips.push('This is a separate phase record, not a duplicate enemy entry.');
  }

  if (isAllyVariant(enemy)) {
    tips.push('This is an allied variant record, so compare it against the hostile version intentionally.');
  }

  if (enemy.base_speed !== null && enemy.base_speed >= 10) {
    tips.push('Prioritize spacing and movement control; this target can close distance quickly.');
  }

  if (enemy.base_armor !== null && enemy.base_armor >= 20) {
    tips.push('Expect raw damage to feel less efficient because this target has high armor.');
  }

  if (enemy.credits_cost !== null && enemy.credits_cost >= 800) {
    tips.push('Treat this as a high-director-cost spawn that can swing stage pressure.');
  }

  if (tips.length === 0) {
    tips.push('Use the stat profile to judge spacing, time-to-kill, and whether to clear it before objective pressure builds.');
  }

  return tips;
}
