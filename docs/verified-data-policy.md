# Storm Atlas Verified Data Policy

This policy governs the retention, quarantine, and validation of data within the Storm Atlas repository boundary to guarantee high credibility, robust mobile performance, and complete transparency.

---

## 1. Verified App Data (Active & Safe)

Verified data is content that has been actively reconciled against game code, trusted/current sources, or fully validated schemas, and is bundled directly into the active app boundary.

### Current Verified Datasets
- **Passive Item Manifest**: Located in `RiskOfRain2_ItemIcons/manifest.json`. This checkout currently uses in-app fallback art unless matching PNGs are present and wired through `src/data/iconSources.ts`.
- **Wandering CHEF Recipe Book**: Found in `src/data/wanderingChefRecipes.ts`. Represents the 55 fully verified recipes extracted and reconciled against the game.
- **Equipment Reference**: Found in `src/data/equipment.ts`. Current entries are release-facing but marked `wiki-derived`; do not upgrade them to `verified` without a separate reconciliation pass.
- **Reference Databases**: `src/data/mechanics/`, `src/data/combatMechanics.ts`, `src/data/combatGlossary.ts`, etc., including clearly defined `wiki-derived`, `estimated`, or `verified` badges for transparency.
- **Active App Assets**: Enemy, survivor, skill, and map manifests actively referenced by React Native components. Missing optional image files must render through explicit fallback UI rather than broken images.

---

## 2. Quarantined Archive Data (Restricted)

Older data copies, unverified gameplay dumps, recovered source snapshots, and unresolved assets must be treated as **quarantined**. They reside outside the active app code boundary, including `_recovery_from_transcripts/` and `_temp_extract/`.

### Quarantined Assets & Datasets
- `RiskOfRain2_Artifacts/artifacts.json` (20 artifact records)
- `RiskOfRain2_Interactables/interactables.json` (87 interactable records)
- `RiskOfRain2_Environments/environments.json` (50 environment records)
- `RiskOfRain2_Lore/lore.json` (366 lore entries)
- `RiskOfRain2_Secrets/secrets.json` (6 secret records)
- `RiskOfRain2_All_ItemIcons/puzzles.json` (8 puzzle records)
- `src-data/item_metadata.json` (185 raw metadata records)
- `RiskOfRain2_All_ItemIcons/manifest.json` (223 broader icon/category records)

### Policy
- **No direct imports**: These files **must not** be copied directly into the active app directory.
- **Single-dataset reconciliation**: Datasets must be reconciled individually, one by one, verifying the accuracy of every single record against a trusted up-to-date catalog before promotion to verified app data.
- **Required validation**: Any import requires schemas matching current React Native typescript definitions and source/DLC/expansion labels.

---

## 3. Generated & Debug Artifacts (Ignored)

These are ephemeral developer aids, local logs, and debugging output. They **must never** be committed to the repository.

### Excluded Artifacts (Ignored via `.gitignore`)
- `node_modules/` (Local dependencies)
- `.expo/`, `.expo-web-*.log`, `*.log` (Expo logs and cache)
- `android/build/`, `android/app/build/`, `android/app/.cxx/` (Android build outputs)
- `.playwright-cli/`, `.playwright-mcp/` (Playwright scratch)
- `docs/extractor-debug-archive/` (Extractor debug cell crops, grid crops, and match reports)
- `docs/crafting-deck-unresolved-review.md` and `docs/crafting-deck-unresolved-contact-sheet.html` (Unresolved recipe review assets)
- `archive-*/` (Temporary copy archives)

---

## 4. Required Validation Checklist for Promotion

Before any quarantined or new dataset is promoted to **Verified App Data**:
1. **Schema Check**: Define a TypeScript interface in `src/types.ts` and validate that every entry conforms strictly to the schema.
2. **Catalog Mapping**: Reconcile all IDs against `RiskOfRain2_ItemIcons/manifest.json` or other active game manifests. No unresolved rows or placeholder IDs allowed.
3. **Expansion Tagging**: Tag each item with its correct content source (`Base Game`, `SotV` for Survivors of the Void, `Seekers` for Seekers of the Storm) so that frontend filters can hide/show them.
4. **Validation Test Run**: Add catalog-specific integrity assertions in `tests/` and run `npm test` to ensure zero regression.

## 5. Development-Only Extraction Scope

Scanner, screenshot import, image scanning, and theorycrafting LLM extraction are retained as development workflows. They are not production app features for the first public release.

Current extractor validation demonstrates that accepted results avoid malformed items, accepted wrong IDs, and count mismatches. It does not prove complete recall or production-grade screenshot accuracy.

Before Scanner can become a production feature, add an Extractor Recall Validation milestone with a benchmark dataset, measured precision, measured recall, rejected-cell rate, and explicit acceptance thresholds.
