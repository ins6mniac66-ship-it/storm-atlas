# Storm Atlas

Expo React Native + TypeScript offline-first companion app for Risk of Rain 2.

Current release target: `0.1.3` / Android `versionCode` 6.

License: GPL-3.0-or-later.

The scanner is development-only by default. Production builds should keep it hidden unless extractor recall validation is completed.

## F-Droid source build

Storm Atlas is being prepared for official F-Droid inclusion as `com.ins6mniac66.stormatlas`. The release source is the Expo app source in this directory; generated native `android/` and `ios/` folders are validation output and should not be committed unless the release strategy changes.

Expected source-only validation flow:

```sh
npm ci
npm test
npm run validate:release
npm run typecheck
npm run test:extractor
npx expo install --check
npx expo prebuild --platform android --no-install
cd android
./gradlew assembleRelease
```

For F-Droid review notes, source boundaries, and the fdroiddata metadata template, see `docs/fdroid-readiness.md`, `docs/release-source-boundary.md`, and `metadata/com.ins6mniac66.stormatlas.yml`.

## Scripts

- `npm start`
- `npm run android`
- `npm run ios`
- `npm run web`
- `npm test`
- `npm run test:extractor`
- `npm run typecheck`

`npm test` validates the current catalog and fallback-safe asset state. In this checkout, item and enemy art is manifest-only unless corresponding PNGs are added and wired through `src/data/iconSources.ts`.
