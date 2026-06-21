const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const items = require('../RiskOfRain2_ItemIcons/manifest.json');
const baseItems = items.filter((item) => !item.expansion || item.expansion.toLowerCase() === 'base');
const expansionItems = items.filter((item) => item.expansion && item.expansion.toLowerCase() !== 'base');

assert(baseItems.length > 0, 'Expected base-game items in manifest');
assert(expansionItems.length > 0, 'Expected expansion items in manifest');

const useCatalog = read('src/hooks/useCatalog.ts');
assert(/useState<ContentScope>\('base'\)/.test(useCatalog), 'Item catalog should default to base-game scope');
assert(/getItemScope\(item\)\s*===\s*contentScope/.test(useCatalog), 'Item content scope filter must not mix base and expansion items');
assert(!/contentScope\s*===\s*'expansion'\s*\|\|/.test(useCatalog), 'Expansion filter must not include base-game items via broad OR logic');

const survivorsScreen = read('src/screens/SurvivorsScreen.tsx');
assert(/getSurvivorScope\(survivor\)\s*===\s*contentScope/.test(survivorsScreen), 'Survivor content scope filter must not mix base and expansion survivors');
assert(!/contentScope\s*===\s*'expansion'\s*\|\|/.test(survivorsScreen), 'Survivor expansion filter must not include base-game survivors via broad OR logic');
assert(!/remoteUri=/.test(survivorsScreen), 'Survivor screen must not load remote wiki images in the offline-first release UI');
assert(!/uri:\s*remoteUri/.test(survivorsScreen), 'Survivor image fallback must stay local/offline-only');

const itemsScreen = read('src/screens/ItemsScreen.tsx');
assert(/labels=\{\{\s*base:\s*'Base Game',\s*expansion:\s*'Expansions'\s*\}\}/.test(itemsScreen), 'Item scope labels should clearly split base game and expansions');

const referenceScreen = read('src/screens/ReferenceScreen.tsx');
assert(/id:\s*'equipment'[\s\S]*title:\s*'Equipment'/.test(referenceScreen), 'Reference screen must include Equipment tile');
assert(/subtitle:\s*'Cooldowns, roles, and swap decisions'/.test(referenceScreen), 'Equipment tile must describe cooldown/role use');

const appSource = read('App.tsx');
assert(/import \{ EquipmentScreen \} from '\.\/src\/screens\/EquipmentScreen'/.test(appSource), 'App must import EquipmentScreen');
assert(/referenceSubScreen === 'equipment'[\s\S]*<EquipmentScreen \/>/.test(appSource), 'App must route reference equipment to EquipmentScreen');
assert(/if \(activeTab === 'scanner'\)/.test(appSource), 'App must handle scanner route explicitly');
assert(/if \(!enableScanner\)\s*{\s*return null;\s*}/.test(appSource), 'Production scanner route must return null when disabled');

const equipmentScreen = read('src/screens/EquipmentScreen.tsx');
for (const text of ['All Sources', 'Base Game', 'Expansions', 'Run Use']) {
  assert(equipmentScreen.includes(text), `Equipment screen is missing ${text}`);
}
assert(/Badge label=\{entry\.status\}/.test(equipmentScreen), 'Equipment screen must show source/status treatment');
assert(/scopeOptions:\s*ScopeFilter\[\]\s*=\s*\['all',\s*'base',\s*'expansion'\]/.test(equipmentScreen), 'Equipment screen must expose all/base/expansion filters');
assert(/equipmentRoles\.map/.test(equipmentScreen), 'Equipment screen must expose role filters');
assert(/equipmentSearchMatches\(entry,\s*query\)/.test(equipmentScreen), 'Equipment screen must use equipment search');

const shrinesScreen = read('src/screens/ShrinesScreen.tsx');
assert(/shrineImageSources\[shrine\.image\]/.test(shrinesScreen), 'Shrine screen must check optional image source map');
assert(/shrineFallback/.test(shrinesScreen), 'Shrine screen must render fallback UI when shrine art is absent');
assert(/formatSourceStatus\(shrine\.sourceStatus\)/.test(shrinesScreen), 'Shrine screen must show source/status treatment');

const mechanicsScreen = read('src/screens/MechanicsScreen.tsx');
assert(/formatMechanicSourceStatus\(mechanic\)/.test(mechanicsScreen), 'Mechanics screen must show source/status treatment');
assert(/mechanic\.sourceStatus \?\? 'wiki-derived'/.test(mechanicsScreen), 'Mechanics screen must default untagged mechanics to wiki-derived status');

const bottomTabs = read('src/components/BottomTabs.tsx');
assert(/developmentOnly:\s*true/.test(bottomTabs), 'Scanner tab must be development-only');
assert(/visibleTabs\s*=\s*tabs\.filter\(\(tab\)\s*=>\s*enableScanner\s*\|\|\s*!tab\.developmentOnly\)/.test(bottomTabs), 'Bottom tabs must hide development-only tabs in production');

const persistedData = read('src/hooks/usePersistedData.ts');
assert(/favoritesHydrated/.test(persistedData), 'Persisted favorites must track successful hydration before writing');
assert(/buildHydrated/.test(persistedData), 'Persisted build state must track successful hydration before writing');
assert(/JSON\.parse\(favoritesValue\)[\s\S]*catch\s*\{[\s\S]*setFavoritesHydrated\(false\)/.test(persistedData), 'Malformed favorites JSON must not be treated as safely hydrated');
assert(/JSON\.parse\(buildValue\)[\s\S]*catch\s*\{[\s\S]*setBuildHydrated\(false\)/.test(persistedData), 'Malformed build JSON must not be treated as safely hydrated');
assert(/isHydrated && favoritesHydrated/.test(persistedData), 'Favorites storage writes must wait for valid favorites hydration');
assert(/isHydrated && buildHydrated/.test(persistedData), 'Build storage writes must wait for valid build hydration');

const scannerScreen = read('src/screens/ScannerScreen.tsx');
assert(/function getExtractedItemStatus/.test(scannerScreen), 'Scanner imports must share extractor confidence handling');
assert(/item\.confidence < 0\.73 \|\| item\.decision\?\.includes\('rejected'\)/.test(scannerScreen), 'Scanner must keep low-confidence or rejected extractor items reviewable');
const scannerStatusUsages = scannerScreen.match(/status:\s*getExtractedItemStatus\(item\)/g) || [];
assert(scannerStatusUsages.length >= 2, 'Screenshot and JSON scanner item imports must both use shared confidence handling');

const releaseWebsite = read('src/screens/ReleaseWebsiteScreen.tsx');
assert(/if \(!contactEmail\)\s*{\s*return;/.test(releaseWebsite), 'Release email action must no-op when no contact email is configured');
assert(/disabled=\{!contactEmail\}/.test(releaseWebsite), 'Release email button must be disabled without a configured contact email');

console.log(`UI validation passed. Base items: ${baseItems.length}. Expansion items: ${expansionItems.length}.`);
