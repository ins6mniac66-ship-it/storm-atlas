# Storm Atlas v0.1.3 Source Boundary

This file defines the intended source boundary for the v0.1.3 / versionCode 6 release prep pass.

## Include In Release Source

- `App.tsx`, `index.js`, `app.json`, `package.json`, `package-lock.json`, `tsconfig.json`, `babel.config.js`, and `eas.json`
- `src/`
- `scripts/`
- `tests/`
- `docs/`
- `assets/`
- `RiskOfRain2_ItemIcons/manifest.json`
- `RiskOfRain2_ItemIcons/**/*.png`
- `RiskOfRain2_Enemies/enemies.json`
- `RiskOfRain2_Enemies/**/*.png`
- `RiskOfRain2_Equipment/equipment.json`
- `RiskOfRain2_Equipment/**/*.png`
- `RiskOfRain2_MapThumbnails/`
- `RiskOfRain2_Shrines/`
- `RiskOfRain2_Skills/skills.json`
- `RiskOfRain2_Skills/**/*.png`
- `RiskOfRain2_Survivors/survivors.json`
- `RiskOfRain2_Survivors/**/*.png`
- `fastlane/metadata/android/en-US/`
- `metadata/com.ins6mniac66.stormatlas.yml` after replacing the placeholder public repo URL

## Exclude From Release Source

- `node_modules/`
- `.expo/`
- `android/` and `ios/` generated native output
- Android build outputs, APKs, AABs, logs, `.DS_Store`, and local temp files
- `.playwright-cli/`, `.playwright-mcp/`, and `output/`
- `deliverables/`
- extractor debug archives
- recovered transcript snapshots and temporary extracted archives outside `app/`

## Current Release Decisions

- Release source is licensed as GPL-3.0-or-later.
- Treat generated Android as validation output for this release. Regenerate with `npx expo prebuild --platform android --no-install` when native validation is needed.
- Keep Scanner and screenshot extraction development-only until the extractor recall milestone has measured precision, recall, false positives, false negatives, rejected-cell rate, and acceptance thresholds.
- Keep Expo SDK 52 for v0.1.3. `npx expo install --check` passes for this SDK line, and Android target SDK 35 is locked through `expo-build-properties`.
- Defer the Expo 56 / React Native 0.86 migration to a dedicated follow-up. `npm audit` reports remaining build-tool advisories, but npm's available fixes require major framework upgrades and should not be forced into the release patch with `npm audit fix --force`.
- The draft fdroiddata metadata intentionally uses `TODO_PUBLIC_REPO_URL` until the public Git host is selected and tagged with `v0.1.3`.

## Pre-Commit Evidence

Run from `app/` before creating a release commit:

```sh
npm test
npm run validate:release
npm run typecheck
npm run test:extractor
npx expo install --check
```

For native validation, also regenerate Android, confirm `android.targetSdkVersion=35`, run `./gradlew assembleRelease`, inspect APK metadata and merged permissions, then remove the generated `android/` tree before committing source.
