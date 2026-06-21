import rawManifest from '../../RiskOfRain2_Skills/skills.json';
import { getExpansionLabel } from './expansions';
import { iconSources } from './iconSources';

export type SkillRecord = {
  name: string;
  desc: string;
  survivor: string;
  type: string;
  cooldown: string | null;
  expansion?: string | null;
  file: string;
  source_url: string;
  width: number;
  height: number;
};

export const skills: SkillRecord[] = rawManifest as SkillRecord[];

export function getSkillExpansion(skill: SkillRecord) {
  if (skill.expansion) return skill.expansion;
  if (skill.survivor === 'Drifter' || skill.survivor === 'Operator') return 'AC';
  if (skill.survivor === 'Railgunner' || skill.survivor === 'Void Fiend') return 'SotV';
  if (skill.survivor === 'Seeker' || skill.survivor === 'False Son' || skill.survivor === 'CHEF') return 'SotS';
  return null;
}

export function getSkillExpansionLabel(skill: SkillRecord) {
  return getExpansionLabel(getSkillExpansion(skill));
}

export function getSkillIcon(skill: SkillRecord) {
  return iconSources[skill.file] ?? null;
}

