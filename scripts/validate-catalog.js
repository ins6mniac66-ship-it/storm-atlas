const manifest = require('../RiskOfRain2_ItemIcons/manifest.json');
const enemyManifest = require('../RiskOfRain2_Enemies/enemies.json');
const fs = require('fs');
const path = require('path');

const expectedRarityCounts = {
  Common: 36,
  Uncommon: 42,
  Legendary: 36,
  Boss: 22,
  Lunar: 20,
  Void: 14
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function matchesSearch(item, query) {
  const normalized = query.trim().toLowerCase();
  const haystack = [
    item.name,
    item.id,
    item.effect,
    item.quote,
    ...(Array.isArray(item.categories) ? item.categories : [])
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalized);
}

assert(manifest.length === 170, `Expected 170 items, found ${manifest.length}`);

const rarityCounts = manifest.reduce((counts, item) => {
  counts[item.rarity] = (counts[item.rarity] || 0) + 1;
  return counts;
}, {});

for (const [rarity, count] of Object.entries(expectedRarityCounts)) {
  assert(rarityCounts[rarity] === count, `Expected ${count} ${rarity} items, found ${rarityCounts[rarity] || 0}`);
}

for (const item of manifest) {
  assert(typeof item.name === 'string' && item.name.length > 0, 'Item is missing a name');
  assert(typeof item.id === 'string' && item.id.length > 0, `${item.name} is missing an id`);
  assert(typeof item.effect === 'string' && item.effect.length > 0, `${item.name} is missing an effect`);
  assert(Array.isArray(item.categories), `${item.name} categories must be an array`);
  assert(typeof item.file === 'string' && item.file.endsWith('.png'), `${item.name} is missing a png file path`);
}

const iconSourceText = fs.readFileSync(path.join(__dirname, '../src/data/iconSources.ts'), 'utf8');
const missingBundledItemIcons = [];
for (const item of manifest) {
  const itemIconPath = path.join(__dirname, '..', item.file);
  if (fs.existsSync(itemIconPath)) {
    assert(iconSourceText.includes(`"${item.file}"`), `${item.name} has a bundled icon but is missing iconSources entry`);
  } else {
    missingBundledItemIcons.push(item.file);
  }
}

assert(manifest.some((item) => matchesSearch(item, 'damage')), 'Search should find damage items');
assert(manifest.some((item) => matchesSearch(item, 'heal')), 'Search should find healing items');
assert(manifest.some((item) => matchesSearch(item, 'sprint')), 'Search should find sprint items');
assert(manifest.filter((item) => item.rarity === 'Common').length === 36, 'Common filter should return 36 items');
assert(manifest.filter((item) => item.categories.includes('Utility')).length > 0, 'Utility filter should return items');

function findItemById(id) {
  return manifest.find((item) => item.id === id) || null;
}

function sanitizeBuildState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  const next = {};
  for (const [itemId, count] of Object.entries(value)) {
    if (findItemById(itemId) && Number.isInteger(count) && count > 0) {
      next[itemId] = count;
    }
  }
  return next;
}

function incrementStack(build, itemId) {
  if (!findItemById(itemId)) {
    return build;
  }
  return { ...build, [itemId]: (build[itemId] || 0) + 1 };
}

function removeStack(build, itemId) {
  const next = { ...build };
  delete next[itemId];
  return next;
}

function decrementStack(build, itemId) {
  const current = build[itemId] || 0;
  return current <= 1 ? removeStack(build, itemId) : { ...build, [itemId]: current - 1 };
}

function getItemSummaryKeys(item) {
  const categories = new Set(item.categories);
  const keys = [];
  if (categories.has('Damage')) keys.push('damage');
  if (categories.has('Healing')) keys.push('healing');
  if (categories.has('Utility')) keys.push('utility');
  if (categories.has('MobilityRelated') || categories.has('SprintRelated')) keys.push('mobility');
  if (categories.has('OnKillEffect')) keys.push('onKill');
  return keys.length ? keys : ['other'];
}

function getBuildSummary(build) {
  const counts = { damage: 0, healing: 0, utility: 0, mobility: 0, onKill: 0, other: 0 };
  for (const [itemId, count] of Object.entries(build)) {
    const item = findItemById(itemId);
    if (!item) continue;
    for (const key of getItemSummaryKeys(item)) {
      counts[key] += count;
    }
  }
  return counts;
}

let build = {};
build = incrementStack(build, 'Crowbar');
assert(build.Crowbar === 1, 'Increment should create stack count 1');
build = incrementStack(build, 'Crowbar');
assert(build.Crowbar === 2, 'Increment should increase stack count');
build = decrementStack(build, 'Crowbar');
assert(build.Crowbar === 1, 'Decrement should reduce stack count');
build = decrementStack(build, 'Crowbar');
assert(!('Crowbar' in build), 'Decrement from 1 should remove item');
assert(Object.keys(sanitizeBuildState({ Crowbar: 2, Missing: 4, Syringe: 0, Hoof: 1.5 })).join('|') === 'Crowbar', 'Sanitize should ignore unknown and invalid build ids');

const summary = getBuildSummary({
  Crowbar: 2,
  Medkit: 1,
  SprintBonus: 3,
  IgniteOnKill: 1,
  ScrapWhite: 1
});
assert(summary.damage === 3, 'Summary should count Damage stacks');
assert(summary.healing === 1, 'Summary should count Healing stacks');
assert(summary.utility === 3, 'Summary should count Utility stacks');
assert(summary.mobility === 3, 'Summary should count Mobility stacks');
assert(summary.onKill === 1, 'Summary should count On Kill stacks');
assert(summary.other === 1, 'Summary should count Other stacks');

const recipeSource = fs.readFileSync(path.join(__dirname, '../src/data/wanderingChefRecipes.ts'), 'utf8');
const recipePattern =
  /recipe\('((?:\\'|[^'])*)',\s*'((?:\\'|[^'])*)',\s*'([^']*)',\s*'((?:\\'|[^'])*)',\s*'((?:\\'|[^'])*)'/g;
const recipeIds = new Set();
const recipeKeys = new Set();
const legacyScrapNames = new Set(['White Scrap', 'Green Scrap', 'Red Scrap', 'Yellow Scrap']);
let recipeCount = 0;
let recipeMatch;

function unescapeRecipeString(value) {
  return value.replace(/\\'/g, "'");
}

function normalizeRecipeName(value) {
  return value
    .replace(/^\d+x\s+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

while ((recipeMatch = recipePattern.exec(recipeSource))) {
  recipeCount += 1;
  const [, rawId, rawResult, , rawFirst, rawSecond] = recipeMatch;
  const id = unescapeRecipeString(rawId);
  const result = unescapeRecipeString(rawResult);
  const first = unescapeRecipeString(rawFirst);
  const second = unescapeRecipeString(rawSecond);

  assert(!recipeIds.has(id), `Duplicate recipe id: ${id}`);
  recipeIds.add(id);
  for (const name of [result.replace(/^\d+x\s+/, ''), first, second]) {
    assert(!legacyScrapNames.has(name), `Recipe uses legacy scrap name: ${name}`);
  }

  const key = [
    normalizeRecipeName(result),
    [normalizeRecipeName(first), normalizeRecipeName(second)].sort().join('+')
  ].join('|');
  assert(!recipeKeys.has(key), `Duplicate recipe key: ${result} from ${first} + ${second}`);
  recipeKeys.add(key);
}

assert(recipeCount > 0, 'Expected recipe data to be parsed');

assert(enemyManifest.length === 116, `Expected 116 enemy records, found ${enemyManifest.length}`);

for (const name of ['Mithrix', 'Beetle', 'Alloy Hunter']) {
  assert(enemyManifest.some((enemy) => enemy.name === name), `Expected enemy manifest to include ${name}`);
}

for (const enemy of enemyManifest) {
  assert(typeof enemy.name === 'string' && enemy.name.length > 0, 'Enemy is missing a name');
  assert(typeof enemy.file === 'string' && enemy.file.endsWith('.png'), `${enemy.name} is missing a png file path`);
  const enemyIconPath = path.join(__dirname, '..', enemy.file);
  if (fs.existsSync(enemyIconPath)) {
    assert(iconSourceText.includes(`"${enemy.file}"`), `${enemy.name} has a bundled image but is missing iconSources entry`);
  }
}

const extractionSummaryPath = path.join(__dirname, '../docs/crafting-deck-extraction-summary.json');
if (fs.existsSync(extractionSummaryPath)) {
  const extractionSummary = JSON.parse(fs.readFileSync(extractionSummaryPath, 'utf8'));
  assert(
    extractionSummary.verified_recipes_missing_from_app === 0,
    `Crafting deck extraction has ${extractionSummary.verified_recipes_missing_from_app} verified recipes missing from app data`
  );
}

const equipmentSource = fs.readFileSync(path.join(__dirname, '../src/data/equipment.ts'), 'utf8');
const equipmentNames = Array.from(equipmentSource.matchAll(/name: (['"])((?:\\.|(?!\1).)*)\1/g)).map((match) =>
  match[2].replace(/\\'/g, "'").replace(/\\"/g, '"')
);
const equipmentRoleValues = Array.from(equipmentSource.matchAll(/role: '([^']+)'/g)).map((match) => match[1]);
const equipmentRoles = ['Burst', 'Healing', 'Utility', 'Mobility', 'Control', 'Economy', 'Risk'];

assert(equipmentNames.length >= 20, `Expected at least 20 equipment records, found ${equipmentNames.length}`);
for (const name of ['Disposable Missile Launcher', 'Foreign Fruit', 'Primordial Cube', 'Royal Capacitor', 'Recycler', 'Trophy Hunter\'s Tricorn']) {
  assert(equipmentNames.includes(name), `Expected equipment data to include ${name}`);
}

for (const role of equipmentRoles) {
  assert(equipmentRoleValues.includes(role), `Expected at least one equipment entry for role ${role}`);
}

for (const role of equipmentRoleValues) {
  assert(equipmentRoles.includes(role), `Unknown equipment role ${role}`);
}
assert(!/status: 'verified'/.test(equipmentSource), 'Equipment records should not be marked verified yet');
assert((equipmentSource.match(/status: 'wiki-derived'/g) ?? []).length === equipmentNames.length, 'Every equipment record must be wiki-derived');
assert((equipmentSource.match(/sourceUrl: wikiUrl/g) ?? []).length === equipmentNames.length, 'Every equipment record must use a wiki.gg source URL');
assert(!/encodeURIComponent/.test(equipmentSource), 'Equipment wiki URLs should preserve readable wiki slugs');
for (const expansion of Array.from(equipmentSource.matchAll(/expansion: '([^']+)'/g)).map((match) => match[1])) {
  assert(['SotV', 'SotS', 'AC'].includes(expansion), `Unknown equipment expansion ${expansion}`);
}

const shrineSource = fs.readFileSync(path.join(__dirname, '../src/data/shrines.ts'), 'utf8');
const shrineNames = Array.from(shrineSource.matchAll(/name: '([^']+)'/g)).map((match) => match[1]);
const shrineScopes = Array.from(shrineSource.matchAll(/scope: '([^']+)'/g)).map((match) => match[1]);
const shrineStatuses = Array.from(shrineSource.matchAll(/sourceStatus: '([^']+)'/g)).map((match) => match[1]);
assert(shrineNames.length >= 8, `Expected at least 8 shrine records, found ${shrineNames.length}`);
for (const name of ['Shrine of Blood', 'Shrine of Chance', 'Shrine of the Mountain', 'Halcyon Shrine', 'Shrine of Shaping']) {
  assert(shrineNames.includes(name), `Expected shrine data to include ${name}`);
}
assert(shrineScopes.length === shrineNames.length, 'Every shrine record must have a scope');
assert(shrineStatuses.length === shrineNames.length, 'Every shrine record must have sourceStatus');
assert(shrineScopes.includes('base'), 'Shrines must include base-game records');
assert(shrineScopes.includes('dlc'), 'Shrines must include expansion records');
for (const scope of shrineScopes) {
  assert(['base', 'dlc'].includes(scope), `Unknown shrine scope ${scope}`);
}
for (const status of shrineStatuses) {
  assert(['wiki-derived', 'needs-review'].includes(status), `Unknown shrine source status ${status}`);
}
assert(!/sourceStatus: 'verified'/.test(shrineSource), 'Shrine records should not be marked verified yet');

const shrineImageSourceText = fs.readFileSync(path.join(__dirname, '../src/data/shrineImageSources.ts'), 'utf8');
const shrineScreenSource = fs.readFileSync(path.join(__dirname, '../src/screens/ShrinesScreen.tsx'), 'utf8');
const shrineImageRecords = Array.from(shrineSource.matchAll(/image: '([^']+)'[\s\S]*?sourceStatus: '([^']+)'/g)).map((match) => ({
  imagePath: match[1],
  sourceStatus: match[2]
}));
for (const { imagePath, sourceStatus } of shrineImageRecords) {
  const absoluteImagePath = path.join(__dirname, '..', imagePath);
  if (fs.existsSync(absoluteImagePath) && sourceStatus !== 'needs-review') {
    assert(shrineImageSourceText.includes(imagePath), `${imagePath} exists but is missing from shrineImageSources`);
  }
}
assert(/shrineFallback/.test(shrineScreenSource), 'Shrine screen must provide fallback UI for missing optional shrine images');

console.log('Catalog validation passed.');
if (missingBundledItemIcons.length > 0) {
  console.log(`Item icons are manifest-only in this checkout; ${missingBundledItemIcons.length} entries use in-app fallback art.`);
}
console.log('Enemy images are optional in this checkout; missing enemy art uses in-app fallback initials.');
