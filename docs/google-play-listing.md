# Storm Atlas Google Play Listing Draft

This is a local draft for release copy. Google Play policy was spot-checked against official Help Center pages on 2026-06-19, but final Play Console submission fields should still be verified in the live console.

## App Name

Storm Atlas

## Short Description

Offline-first Risk of Rain 2 item lookup, build tracking, and run reference.

## Full Description

Storm Atlas is a mobile companion for Risk of Rain 2 players who want fast reference during active runs.

Use it to search item effects, filter by rarity and role, save favorites, track build stacks, compare survivor notes, and check compact mechanics references without depending on a live service.

Current release-facing areas include:

- Item lookup and filtering
- Favorites and saved item review
- Build stack tracking
- Equipment cooldown and role reference
- Survivor planning notes
- Bestiary records
- Map and realm notes
- Shrine, recipe, rarity, glossary, and combat-system references

Scanner, screenshot import, AI candidate review, and extractor calibration are development workflows and should not be advertised in production store copy until the extractor recall milestone is complete.

## Data Safety Notes

- Offline-first app behavior.
- No user account required for the current app baseline.
- No live scanner service should be exposed in the first public release.
- Google Play still requires a Data safety form and privacy policy even for apps that do not collect user data.
- Review declared permissions and bundled third-party SDK behavior before submitting the Data safety form.

## Current Play Policy Checks

- New Android phone/tablet apps and updates submitted after August 31, 2025 must target Android 15 / API level 35 or higher.
- Apps that request Android 13+ broad photo/video permissions must justify them when the system picker is not enough; this release blocks broad media permissions and relies on production-hidden scanner workflows.
- Sensitive internet/camera/scanner/media/audio/overlay permissions must stay absent from the release-facing manifest unless the product scope changes and Play Console declarations are updated.

Official references checked:

- https://support.google.com/googleplay/android-developer/answer/11926878
- https://support.google.com/googleplay/android-developer/answer/10787469
- https://support.google.com/googleplay/android-developer/answer/16558241

## Release Checklist

- Confirm production builds hide the Scanner tab.
- Confirm listing screenshots do not show scanner, screenshot import, AI analysis, or development debug UI.
- Confirm version name `0.1.3`, Android version code `6`, app name `Storm Atlas`, and package `com.ins6mniac66.stormatlas`.
- Confirm Android manifest does not request internet/camera/scanner/media/microphone/overlay permissions for the release-facing build.
- Confirm generated native build target SDK satisfies the current Google Play target API requirement before uploading.
- Confirm `fastlane/metadata/android/en-US/changelogs/6.txt` matches the shipped user-facing changes.
