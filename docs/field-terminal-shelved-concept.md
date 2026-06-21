# Field Terminal Shelved Concept

Status: shelved
Date: 2026-06-20

## Summary

Field Terminal explored a denser, terminal-inspired Storm Atlas home screen for quick use during active Risk of Rain 2 play. The strongest part of the concept was a compact run-support surface that combined lookup, build health, scanner review, and short decision prompts.

The concept is shelved because its most distinctive direction depended on details Storm Atlas should not pretend to know: exact live map state, future objectives, enemy routes, shrine outcomes, or precise tactical commands. Without reliable live game state, granular directives would be misleading and could make the app feel less trustworthy.

## Decision

Do not implement Field Terminal as a command-prediction or mission-control interface.

Do preserve the useful pieces as future UX reference:

- Fast first-screen access to lookup, build state, scanner review, and reference paths.
- Compact build-gap summaries such as low mobility, weak healing, low defense, low AoE, poor proc support, or weak boss damage.
- Reviewable scanner uncertainty with confidence, item candidates, and confirm/edit actions.
- Manual run notes or pinned reminders for things the player saw in the current run.
- Practical decision cards for common game moments such as printers, shrines, item choices, stage transitions, looping, scrapping, and Mithrix preparation.

## Why It Is Shelved

Storm Atlas is an offline-first companion. It can support player decisions from known data, selected survivor context, manually entered items, scanner-confirmed items, and transparent reference material. It should not imply live telemetry or hidden game-state awareness unless that capability exists and is validated.

The Stitch-generated Field Terminal variations included ideas such as route commands, exact objective locations, enemy predictions, sci-fi telemetry, armor classes, oxygen reserves, radiation levels, and other fictional readouts. Those patterns conflict with the app's accuracy rules and would blur the line between useful guidance and invented state.

## Product Boundary

Storm Atlas should behave like a compact run worksheet and reference tool, not an autonomous live coach.

Good:

- "You have no reliable healing items recorded."
- "This item is estimated and needs review."
- "Scanner found Bandolier at 92% confidence. Confirm or edit?"
- "Found a Blood Shrine? Check current health, healing, and stage risk."
- "Stage 4 reminder: check legendary chest, survivor mobility, and boss damage."

Avoid:

- "Route to cave in 90 seconds."
- "Teleporter is on Platform Gamma-4."
- "Blazing Golem threat detected."
- "Oxygen reserve low."
- "Run telemetry indicates 87% failure probability."

## If Revived

Revive only as a grounded home-screen refinement, not as a new app mode.

Requirements for revival:

- Keep the current app identity, navigation, and offline-first scope.
- Use existing theme, component, data-status, and mobile layout patterns.
- Make every inferred recommendation explainable from user-entered, scanner-confirmed, or verified reference data.
- Clearly label uncertain, estimated, wiki-derived, or community-tested mechanics.
- Keep Scanner production-gated until extractor recall validation passes.
- Avoid exact route, enemy, or future-event claims unless the user explicitly entered that information.

## Practical Replacement Direction

If the app needs a better first screen, design it around a "run support" surface:

- Search and quick lookup at the top.
- Current survivor and expansion filters.
- Build tracker summary from selected or scanner-confirmed items.
- Build gaps grouped by damage, mobility, healing, defense, proc chains, and utility.
- Decision cards for common moments.
- Scanner review queue with confidence and edit controls.
- Pinned run notes.
- Bottom tabs preserved as Home, Items, Build, Scanner, and Reference where production gating allows.

This keeps the best Field Terminal UX idea: fast, dense, glanceable help during play, without making claims the app cannot support.
