# Storm Atlas F-Droid Readiness Notes

This is a local readiness note, not a policy determination. Verify current F-Droid requirements before submission.

## Current App Boundary

- Expo React Native app under `/Users/ins6mniac66/Documents/ROR2 App Dev/app`.
- Offline-first runtime behavior.
- No required account or hosted backend for the current release-facing app.
- Scanner and extractor workflows are development-only and should not be presented as production app features.
- App identity is `Storm Atlas`; Android application id is `com.ins6mniac66.stormatlas`.
- Release target is `0.1.3` / Android `versionCode` 6.
- Intended license is GPL-3.0-or-later.

## Source Boundary

Keep these out of a source release:

- `node_modules/`
- `.expo/`
- Android build output
- local logs
- Playwright scratch
- `tmp/`
- `output/`
- `deliverables/`
- extractor debug archives
- recovered transcript snapshots unless deliberately documented as provenance

## Before Submission

- Decide whether generated native `android/` source is part of the release boundary.
- Produce a reproducible build path from committed source only.
- Recheck bundled assets, icon provenance, and app metadata.
- Remove or document any dependency or generated artifact that cannot be rebuilt from source.

## Main Repository Submission Path

Use official F-Droid inclusion, not a self-hosted repository, unless the release strategy changes. The app should be submitted through a merge request to `fdroiddata` after `metadata/com.ins6mniac66.stormatlas.yml` passes fdroidserver checks.

Current local decision: keep generated `android/` out of committed source and have the F-Droid build run `npm ci` plus `npx expo prebuild --platform android --no-install` before Gradle. If that fails under F-Droid buildserver constraints, revise deliberately rather than silently committing generated native output.

Required upstream metadata now lives under `fastlane/metadata/android/en-US/`:

- `short_description.txt`
- `full_description.txt`
- `images/icon.png`
- `images/featureGraphic.png`
- `images/phoneScreenshots/`
- `changelogs/6.txt`

## Review Notes

- No account, backend, ads, analytics, Firebase, Google Mobile Services, or network access are required for the release-facing app.
- Android permissions are explicitly empty in `app.json`, with internet/camera/scanner/media/audio/overlay permissions blocked.
- Game art and gameplay data must continue to follow `docs/asset-licensing.md` and `docs/verified-data-policy.md`.
- `metadata/com.ins6mniac66.stormatlas.yml` points at the public source repository and is ready for fdroidserver lint/build testing.
