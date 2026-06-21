# ROR2 Companion App Suggestions

This file tracks suggested next features and completed work for the Risk of Rain 2 mobile item browser plus screenshot-extractor workflow. Incomplete work stays at the top.

## Next Release Roadmap: v0.1.3 / versionCode 6

Goal: ship a conservative offline-first Storm Atlas release with verified reference content, scanner workflows kept development-only, and a clean source/artifact boundary.

### 1. Freeze Release Scope

- [x] Confirm `app.json` and `package.json` still agree on `0.1.3`.
- [x] Confirm Android identity remains `com.ins6mniac66.stormatlas` and visible app name remains `Storm Atlas`.
- [x] Keep Scanner hidden from production via `src/config/release.ts` unless extractor recall validation is completed.
- [x] Add `npm run validate:release` for release identity, Scanner gating, release docs, blocked Android permissions, and artifact-boundary checks.
- [x] Treat shrine imagery, survivor mobility notes, mechanics data, and recipe content as release-facing only after they satisfy `docs/verified-data-policy.md`.
- [x] Defer public DLC/expanded-catalog promotion unless every surfaced entry has source and expansion labels.

### 2. Clean Source Boundary

- [x] Review the dirty working tree and separate intentional app/source changes from generated Android output and local artifacts.
- [x] Finalize `.gitignore` coverage for Expo caches, Android build output, logs, Playwright scratch, generated extractor output, and local deliverables.
- [x] Treat `android/` as generated validation output for this release and keep it out of source control.
- [x] Keep `node_modules`, `.expo`, debug screenshots, extractor reports, and build outputs out of the release commit.
- [x] Remove or quarantine any active-app imports that came directly from recovered/archive material without validation.

### 3. Data And Content Audit

- [x] Run catalog validation and fix manifest, fallback-safe asset, and lookup failures.
- [x] Audit new shrine data and `RiskOfRain2_Shrines/` assets for active references, licensing notes, and expansion/source labeling.
- [x] Audit survivor mobility records marked `needs-review` so they either stay visibly labeled or are verified before release.
- [x] Spot-check mechanics screens for visible `verified`, `wiki-derived`, `estimated`, and `needs-review` status treatment.
- [x] Confirm Google Play and F-Droid docs do not advertise scanner, screenshot import, AI analysis, or any development-only workflow.

### 4. Mobile UX Release Polish

- [x] Smoke-test the first screen for dense item lookup, favorites, build tracking, and reference navigation.
- [x] Check Reference sub-screens for back behavior, long text wrapping, and bottom-tab crowding at mobile dimensions.
- [x] Add static UI validation for item base/expansion split, Equipment reference routing, and production Scanner gating while Browser plugin QA is unavailable.
- [x] Check Shrines, Survivors, Recipes, Mechanics, Maps, and Build screens for touch target size and clipped labels.
- [x] Confirm production web export has no visible Scanner tab and no broken Scanner-only navigation path.
- [x] Verify offline app startup with bundled item, map, and shrine assets.

### 5. Validation Gate

- [x] Run `npm test`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run test:extractor` to preserve development scanner safeguards, even though Scanner remains production-hidden.
- [x] Regenerate Android from Expo config for validation and confirm package name, version name, version code, app name, target SDK 35, and blocked permission removal markers.
- [x] Build an Android release artifact and confirm package name, version name, version code, and final merged permissions. `./gradlew assembleRelease` passed on 2026-06-19; the APK metadata reported `com.ins6mniac66.stormatlas`, `0.1.3`, version code `6`, and output file `app-release.apk`.
- [x] Lock Android target SDK 35 through Expo config so current Google Play target API requirements are met by regenerated native builds.
- [x] Decide whether to run a dedicated Expo 56 / React Native 0.86 migration to clear remaining npm audit advisories.

### 6. Release Packaging

- [x] Update `fastlane/metadata/android/en-US/changelogs/6.txt` to match only shipped user-facing changes.
- [x] Recheck `docs/google-play-listing.md`, `docs/fdroid-readiness.md`, and `docs/asset-licensing.md` against the current source boundary.
- [ ] Create a deliberate release commit after validation passes.
- [ ] Tag the release as `v0.1.3` only after the release commit is clean and reproducible.
- [x] Archive the exact validation commands and current Android artifact status in the release notes or development doc.

## Future Milestone: Extractor Recall Validation

- [ ] Build a benchmark dataset of representative end-screen screenshots.
- [ ] Report precision, recall, false positives, false negatives, and rejected-cell rate.
- [ ] Define production acceptance thresholds before Scanner is enabled in release builds.
- [ ] Keep Scanner development-only until this milestone passes.

## High Priority Suggestions

### Repo Baseline

- [x] Finalize `.gitignore` for Expo, Android build output, Playwright scratch, logs, temp output, and `node_modules`.
- [x] Decide whether `deliverables/` release artifacts should be tracked or kept outside Git.
- [x] Create the first-commit source/artifact boundary.

### Screenshot Extraction Accuracy

- [ ] Build a small labeled screenshot fixture set.
- [ ] Tune CLIP/template thresholds against multiple real screenshots.
- [ ] Track false positives, false negatives, and rejected-cell rate.
- [ ] Add an optional `unknown_items` or `rejected_items` debug section.
- [ ] Add count-specific debug crops.
- [ ] Test hard stack counts: `x16`, `x49`, `x10`, `x17`, `x2`.

### Debug Review UX

- [ ] Generate an HTML debug report with each cell image inline.
- [ ] Show top 3 CLIP and template candidates per cell.
- [ ] Visually mark accepted, rejected, and low-confidence cells.
- [ ] Add `--debug-html` for browser-friendly review.

### App Integration

- [x] Add a screen for importing or selecting a screenshot.
- [x] Show extracted items and counts inside the app.
- [x] Add a review queue for rejected/ambiguous cells.
- [x] Let users correct extracted items.
- [ ] Verify local `server.py` scanner API end to end on device/emulator.
- [ ] Save corrections for future calibration.

## Medium Priority Suggestions

### Catalog Maintenance

- [ ] Add a manifest validation command for the expanded icon set.
- [ ] Detect missing icon files before extraction.
- [x] Add a conservative Equipment reference section with role/source filters and visible wiki-derived status.
- [ ] Decide whether artifacts and modded items should be supported.
- [ ] Add expansion/source filters in the app if full catalog support becomes user-facing.

### Testing

- [ ] Add unit tests for item normalization and ID lookup.
- [ ] Add extractor tests for crop, split, OCR, aggregation, and confidence filtering.
- [ ] Add fixture expected JSON files.
- [ ] Add a command that reports precision/recall for labeled screenshots.

### Performance

- [ ] Cache CLIP reference embeddings to disk.
- [ ] Reuse a loaded matcher across batch runs.
- [ ] Add batch screenshot processing.
- [ ] Avoid loading CLIP when using app-only catalog browsing.

## Low Priority Suggestions

### Shelved Concepts

- [ ] Keep `docs/field-terminal-shelved-concept.md` as reference only; do not implement the speculative mission-control version without validated live-state inputs.

### Browser/App Polish

- [ ] Add richer item detail pages.
- [ ] Add advanced search by category, rarity, expansion, and keyword.
- [ ] Add build/loadout notes tied to selected items.
- [ ] Add favorites or pinned items.

### Survivor Dashboard

- [ ] Use `docs/survivor-dashboard-second-pass.md` as the reference for the next survivor overview redesign.
- [ ] Evaluate future tab taxonomy after the tactical overview content model is stable.
- [ ] Improve survivor selector scan states with grouping, active glow, and clearer source/category accents.
- [ ] Split survivor pages into tactical dashboard modules instead of equal-weight full-width sections.

### Export And Sharing

- [ ] Export extracted run items as JSON.
- [ ] Export extracted run items as CSV.
- [ ] Generate a shareable run summary image or report.
- [ ] Add import/export for saved builds.

## Completed So Far

### App Foundation

- [x] Created a mobile-first Expo/React Native Risk of Rain 2 item browser.
- [x] Added core app files: `App.tsx`, `index.js`, `app.json`, TypeScript config, Expo config, and Android project files.
- [x] Added app run scripts for Expo, Android, iOS, web, typecheck, and catalog validation.
- [x] Built Android output and saved release APK under `deliverables/`.
- [x] Added generated PDFs/HTML previews under `output/` and `tmp/`.

### Item Catalog

- [x] Added local Risk of Rain 2 base-game item icon library.
- [x] Added base-game manifest with item names, rarities, IDs, descriptions, categories, icon files, and source URLs.
- [x] Added TypeScript item data normalization in `src/data/items.ts`.
- [x] Added static icon source mapping in `src/data/iconSources.ts`.
- [x] Added build-state data in `src/data/buildState.ts`.
- [x] Added `scripts/validate-catalog.js` to validate manifest count, rarity counts, fields, and representative lookup behavior.

### Expanded Icon Coverage

- [x] Updated the icon downloader to support `--include-expansions`.
- [x] Generated `RiskOfRain2_ItemIcons/` with 170 passive item icons.
- [x] Included Base, Survivors of the Void, Seekers of the Storm, and AC expansion metadata.
- [x] Updated extractor default manifest selection to prefer the full icon set when present.

### Screenshot Extractor

- [x] Created `ror2_run_item_extractor.py`.
- [x] Added OpenCV screenshot loading and optional downscaling.
- [x] Added proportional crop for the end-screen `Items Collected` grid.
- [x] Added fixed-grid cell extraction and empty-cell filtering.
- [x] Added local item matching with template fallback.
- [x] Added CLIP matching support and installed local CLIP/Torch dependencies.
- [x] Added conservative `--method auto` hybrid matching.
- [x] Added top-2 margin and CLIP/template agreement checks.
- [x] Added stack-count OCR with Tesseract and `xN` overlay filtering.
- [x] Added class-name OCR; confirmed `Mercenary` on the test screenshot.
- [x] Added JSON output in the requested `{ class, items }` format.
- [x] Added duplicate item aggregation and confidence filtering.

### Debugging And Validation

- [x] Added `--debug-dir`.
- [x] Saved `grid_crop.png`.
- [x] Saved per-cell crops as `cell_XX.png`.
- [x] Added `match_report.csv` with per-cell CLIP/template IDs, scores, margins, decision, count, and confidence.
- [x] Ran the extractor against the saved end-screen screenshot.
- [x] Verified the crop and class OCR path.
- [x] Confirmed hybrid mode filters ambiguous cells instead of guessing.

### Documentation

- [x] Added `requirements-ror2-extractor.txt`.
- [x] Updated `README.md` with app commands and extractor usage.
- [x] Created this suggestions tracker.
- [x] Converted roadmap items to Markdown checkboxes.
