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

function walkFiles(relativeDir, predicate, results = []) {
  const absoluteDir = path.join(root, relativeDir);
  if (!fs.existsSync(absoluteDir)) {
    return results;
  }

  for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(relativePath, predicate, results);
    } else if (predicate(relativePath)) {
      results.push(relativePath);
    }
  }

  return results;
}

function isPng(relativePath) {
  const signature = fs.readFileSync(path.join(root, relativePath)).subarray(0, 8);
  return signature.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
}

const packageJson = require('../package.json');
const appJson = require('../app.json');

assert(packageJson.version === '0.1.3', `Expected package version 0.1.3, found ${packageJson.version}`);
assert(packageJson.license === 'GPL-3.0-or-later', `Expected GPL-3.0-or-later license, found ${packageJson.license}`);
const packageLock = require('../package-lock.json');
assert(packageLock.packages?.['']?.license === 'GPL-3.0-or-later', 'package-lock root license must match package.json');
assert(appJson.expo.name === 'Storm Atlas', `Expected app name Storm Atlas, found ${appJson.expo.name}`);
assert(appJson.expo.version === packageJson.version, 'app.json and package.json versions must match');
assert(appJson.expo.android.package === 'com.ins6mniac66.stormatlas', 'Android package changed unexpectedly');
assert(appJson.expo.android.versionCode === 6, `Expected Android versionCode 6, found ${appJson.expo.android.versionCode}`);
assert(Array.isArray(appJson.expo.android.permissions), 'Android permissions must be explicit');
assert(appJson.expo.android.permissions.length === 0, 'Release-facing Android permissions should stay empty unless deliberately added');
assert(appJson.expo.web?.favicon === './assets/icon.png', 'Web export must include a favicon to avoid production 404 noise');
const buildPropertiesPlugin = appJson.expo.plugins?.find((plugin) => Array.isArray(plugin) && plugin[0] === 'expo-build-properties');
assert(buildPropertiesPlugin, 'expo-build-properties plugin is required to lock Android SDK release settings');
assert(buildPropertiesPlugin[1]?.android?.compileSdkVersion === 35, 'Android compileSdkVersion must stay at 35 for this release');
assert(buildPropertiesPlugin[1]?.android?.targetSdkVersion === 35, 'Android targetSdkVersion must stay at 35 for current Google Play submissions');
for (const permission of [
  'android.permission.INTERNET',
  'android.permission.CAMERA',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.READ_MEDIA_IMAGES',
  'android.permission.READ_MEDIA_VIDEO',
  'android.permission.RECORD_AUDIO',
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.VIBRATE'
]) {
  assert(appJson.expo.android.blockedPermissions?.includes(permission), `Android blockedPermissions is missing ${permission}`);
}

const releaseConfig = read('src/config/release.ts');
assert(/enableScanner:\s*__DEV__/.test(releaseConfig), 'Scanner must stay development-only via __DEV__');
assert(/betaSignupUrl:\s*''/.test(releaseConfig), 'Beta signup URL must remain empty until a real destination exists');

const bottomTabs = read('src/components/BottomTabs.tsx');
assert(/tab:\s*'scanner'[\s\S]*developmentOnly:\s*true/.test(bottomTabs), 'Scanner tab must be marked development-only');
assert(/visibleTabs\s*=\s*tabs\.filter\(\(tab\)\s*=>\s*enableScanner\s*\|\|\s*!tab\.developmentOnly\)/.test(bottomTabs), 'Bottom tabs must filter development-only tabs when Scanner is disabled');

const appSource = read('App.tsx');
assert(/tab === 'scanner' && !enableScanner \? 'items' : tab/.test(appSource), 'Scanner navigation must redirect when Scanner is disabled');
assert(/if \(!enableScanner\)\s*{\s*return null;\s*}/.test(appSource), 'Scanner screen must not render when Scanner is disabled');

const releaseDocs = [
  'LICENSE',
  'README.md',
  'docs/google-play-listing.md',
  'docs/fdroid-readiness.md',
  'docs/asset-licensing.md',
  'docs/development-design-doc.md',
  'docs/verified-data-policy.md',
  'docs/release-source-boundary.md',
  'metadata/com.ins6mniac66.stormatlas.yml'
];

for (const relativePath of releaseDocs) {
  assert(fs.existsSync(path.join(root, relativePath)), `${relativePath} is missing`);
}

const googlePlay = read('docs/google-play-listing.md');
assert(!/Screenshot Scanner|Scanner Terminal|Top AI Candidates/.test(googlePlay), 'Google Play draft must not advertise development scanner UI');
assert(/Scanner, screenshot import, AI candidate review, and extractor calibration are development workflows/.test(googlePlay), 'Google Play draft must explicitly exclude scanner workflows');
assert(/Data safety form and privacy policy/.test(googlePlay), 'Google Play draft must mention Data safety and privacy policy requirements');
assert(/Android 15 \/ API level 35/.test(googlePlay), 'Google Play draft must mention the current target API requirement');

const fdroid = read('docs/fdroid-readiness.md');
assert(/Scanner and extractor workflows are development-only/.test(fdroid), 'F-Droid notes must keep scanner workflows development-only');
assert(/GPL-3\.0-or-later/.test(fdroid), 'F-Droid notes must record the GPL-3.0-or-later license decision');
assert(/TODO_PUBLIC_REPO_URL/.test(read('metadata/com.ins6mniac66.stormatlas.yml')), 'F-Droid metadata template must keep an obvious public repo placeholder until publication');
assert(fs.existsSync(path.join(root, 'metadata/com.ins6mniac66.stormatlas.yml')), 'F-Droid metadata filename must match the Storm Atlas application id');

const sourceBoundary = read('docs/release-source-boundary.md');
assert(/Include In Release Source/.test(sourceBoundary), 'Source boundary doc must list included release source');
assert(/Exclude From Release Source/.test(sourceBoundary), 'Source boundary doc must list excluded generated artifacts');
assert(/Defer the Expo 56 \/ React Native 0\.86 migration/.test(sourceBoundary), 'Source boundary doc must record the major SDK migration decision');
assert(/android\.targetSdkVersion=35/.test(sourceBoundary), 'Source boundary doc must mention target SDK 35 validation');
assert(/GPL-3\.0-or-later/.test(sourceBoundary), 'Source boundary doc must record the release license');

const readme = read('README.md');
assert(/F-Droid source build/.test(readme), 'README must document the F-Droid source build flow');
assert(/npx expo prebuild --platform android --no-install/.test(readme), 'README must document the source-only Expo prebuild command');

const ignored = read('.gitignore');
for (const pattern of ['node_modules/', '.expo/', '.DS_Store', 'android/app/build/', '.playwright-cli/', 'docs/extractor-debug-archive/', 'deliverables/']) {
  assert(ignored.includes(pattern), `.gitignore is missing ${pattern}`);
}

const fastlaneFiles = [
  'fastlane/metadata/android/en-US/short_description.txt',
  'fastlane/metadata/android/en-US/full_description.txt',
  'fastlane/metadata/android/en-US/images/icon.png',
  'fastlane/metadata/android/en-US/images/featureGraphic.png',
  'fastlane/metadata/android/en-US/images/phoneScreenshots/1.png',
  'fastlane/metadata/android/en-US/images/phoneScreenshots/2.png',
  'fastlane/metadata/android/en-US/images/phoneScreenshots/3.png'
];
for (const relativePath of fastlaneFiles) {
  assert(fs.existsSync(path.join(root, relativePath)), `${relativePath} is missing`);
}

const shortDescription = read('fastlane/metadata/android/en-US/short_description.txt').trim();
assert(shortDescription.length > 0 && shortDescription.length < 80, 'Fastlane short description must be present and under 80 characters');

const fullDescription = read('fastlane/metadata/android/en-US/full_description.txt');
assert(/offline-first companion/.test(fullDescription), 'Fastlane full description must explain the offline-first companion purpose');
assert(/without an account, network service, ads, analytics, or sensitive Android permissions/.test(fullDescription), 'Fastlane full description must state the no-account/no-tracking posture');
assert(/Scanner and screenshot extraction workflows are development-only/.test(fullDescription), 'Fastlane full description must not present Scanner as production functionality');

const screenshotDir = path.join(root, 'fastlane/metadata/android/en-US/images/phoneScreenshots');
assert(fs.existsSync(screenshotDir), 'Fastlane phone screenshots directory is missing');

const bundledArtDirs = [
  'RiskOfRain2_ItemIcons',
  'RiskOfRain2_Enemies',
  'RiskOfRain2_Equipment',
  'RiskOfRain2_MapThumbnails',
  'RiskOfRain2_Shrines',
  'RiskOfRain2_Skills',
  'RiskOfRain2_Survivors'
];
for (const relativeDir of bundledArtDirs) {
  const mislabeledPng = walkFiles(relativeDir, (relativePath) => relativePath.endsWith('.png') && !isPng(relativePath));
  assert(mislabeledPng.length === 0, `${relativeDir} contains non-PNG data in .png files: ${mislabeledPng.slice(0, 5).join(', ')}`);
}

const changelogPath = 'fastlane/metadata/android/en-US/changelogs/6.txt';
assert(fs.existsSync(path.join(root, changelogPath)), `${changelogPath} is missing`);
const changelog = read(changelogPath);
assert(/Storm Atlas 0\.1\.3/.test(changelog), 'Version 6 changelog must identify Storm Atlas 0.1.3');
assert(/Equipment reference/.test(changelog), 'Version 6 changelog must mention the Equipment reference');
assert(!/Scanner screenshot|AI candidate|debug/i.test(changelog), 'Version 6 changelog must not advertise development scanner/debug workflows');

console.log('Release validation passed.');
