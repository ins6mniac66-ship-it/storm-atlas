# Storm Atlas Asset Licensing And Attribution

This note tracks the current local asset boundary. It does not grant rights; verify all asset provenance before public distribution.

## Current Bundled Assets

- `assets/icon.png`
- `assets/adaptive-icon.png`
- `assets/splash-icon.png`
- `fastlane/metadata/android/en-US/images/icon.png`
- `fastlane/metadata/android/en-US/images/featureGraphic.png`
- `fastlane/metadata/android/en-US/images/phoneScreenshots/`
- `RiskOfRain2_ItemIcons/`
- `RiskOfRain2_Enemies/`
- `RiskOfRain2_Equipment/`
- `RiskOfRain2_MapThumbnails/`
- `RiskOfRain2_Shrines/`
- `RiskOfRain2_Skills/`
- `RiskOfRain2_Survivors/`

These app shell images are bundled locally in the active app.

## Game Art

The current checkout includes bundled Risk of Rain 2 art directories for item icons, enemies, equipment, maps, shrines, skills, and survivors. Keep their provenance reviewable before public source or binary distribution.

Android release builds require files named `.png` to contain real PNG data. The current bundled art set has been normalized so Android resource compilation does not receive WebP data through `.png` paths.

Current validation still expects missing optional images to render through fallback UI instead of broken image elements.

## Release Rules

- Do not add recovered image archives directly to `app/` without provenance review.
- Do not promote archive or recovered data into release-facing app content without following `docs/verified-data-policy.md`.
- If game images are bundled later, record their source, license/permission basis, and exact active app paths here.
