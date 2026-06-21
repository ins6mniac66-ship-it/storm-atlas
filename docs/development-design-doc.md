# Storm Atlas Development Design Doc

Storm Atlas is an offline-first Expo React Native + TypeScript companion app for Risk of Rain 2. The active app root is `/Users/ins6mniac66/Documents/ROR2 App Dev/app`.

## Current Scope

- Keep the first screen focused on fast item lookup, filtering, favorites, and build tracking.
- Keep reference areas compact and practical for active play: survivors, bestiary, maps, recipes, equipment, shrines, run systems, hidden mechanics, proc chains, glossary, and rarity notes.
- Keep Scanner as a development-only workflow until extractor recall validation exists.
- Treat recovered transcript files and temporary extracts as quarantined source material, not active app data.

## Release Baseline

- App identity: Storm Atlas
- Android package: `com.ins6mniac66.stormatlas`
- Current target: `0.1.3`
- Android version code: `6`
- Android compile/target SDK: `35`
- Production scanner visibility is controlled by `src/config/release.ts`.
- Android release permissions are intentionally narrow; internet/camera/scanner/media/audio/overlay permissions are blocked in `app.json`.

## Data Rules

- Follow `docs/verified-data-policy.md` before promoting gameplay data.
- Do not silently mix base-game and expansion content; preserve source and expansion labels.
- Missing optional image assets must render through fallback UI instead of broken images.
- Do not promote recovered archive records without schema checks, source/status labels, and catalog validation.

## Validation

Run from `app/` after meaningful code changes:

```sh
npm test
npm run validate:release
npm run typecheck
npm run test:extractor
```

`npm run test:extractor` may skip on machines without optional scanner dependencies such as OpenCV.

## Current Validation Notes

- `npx expo export --platform web --output-dir /tmp/storm-atlas-web-export` completed successfully on 2026-06-19 after the Equipment reference was added.
- The production web bundle includes the Equipment reference content and keeps Scanner production-gated.
- `npm test && npm run validate:release && npm run typecheck && npm run test:extractor && npx expo install --check` passed on 2026-06-19 after the Equipment reference, Play policy notes, target SDK 35 config, and versionCode 6 changelog were added. Extractor tests skipped one optional OpenCV-dependent case on this machine.
- `npm test` now runs both catalog validation and `scripts/validate-ui.js`; UI validation confirms the item scope filter keeps Base Game and Expansions separate, the Equipment reference route is reachable, and production Scanner gating remains wired through the app shell.
- Data/status validation now covers shrine source statuses, fallback-safe missing shrine art, base/DLC shrine separation, survivor base/expansion separation, Equipment source/status filters, and conservative `wiki-derived` treatment for the Mechanics list.
- Browser-rendered mobile QA was completed against a production web export at 390x844 using Playwright. Screenshots were captured under `output/playwright/screenshots/` for Items, item expansions, Reference, Equipment, Shrines, Survivors base/expansion, Mechanics, Build, Recipes, and Maps. Checks confirmed no Scanner text in production, no horizontal overflow on checked screens, no console/page errors, and no remote wiki image requests from survivor art.
- The web export now includes `favicon.ico` through `app.json` web favicon config, avoiding production 404 noise during browser QA.
- `docs/release-source-boundary.md` records the intended v0.1.3 source boundary, generated-output exclusions, and the decision to defer the Expo 56 / React Native 0.86 audit migration to a dedicated follow-up.
- `npx expo prebuild --platform android --no-install` completed successfully on 2026-06-19 and generated Android metadata for `com.ins6mniac66.stormatlas`, version name `0.1.3`, version code `6`, and app name `Storm Atlas`.
- `expo-build-properties` generated `android.compileSdkVersion=35` and `android.targetSdkVersion=35`.
- `./gradlew assembleRelease` completed successfully from the generated Android project on 2026-06-19. The generated APK metadata reported application ID `com.ins6mniac66.stormatlas`, version name `0.1.3`, version code `6`, and output file `app-release.apk`.
- Final merged Android permissions should not include internet/camera/scanner/media/audio/overlay permissions; the generated Android build may still declare the app-local `com.ins6mniac66.stormatlas.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`.
- `npx expo install --check` reports dependencies are aligned for Expo SDK 52. `npm audit` still reports build-tool advisories whose available npm fixes require major upgrades to Expo 56 and React Native 0.86; do not force those with `npm audit fix --force` without a dedicated SDK migration pass.
