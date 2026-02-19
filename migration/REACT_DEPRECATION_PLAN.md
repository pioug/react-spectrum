# React Deprecation Plan

This plan describes how React package deprecation should proceed once Vue package ports are publish-ready.

## Current execution status (as of February 19, 2026)

* [x] Phase 1.1: Vue migration availability and guidance published in root docs.
* [x] Phase 1.2: `migration/REACT_TO_VUE_MIGRATION_GUIDE.md` is published as the replacement matrix.
* [x] Phase 1.3: React package maintenance-mode notice is published in `README.md`.
* [ ] Phase 1.4: package-level README migration matrix links are still being rolled out.
* [ ] Phase 2: soft-deprecation steps are pending.
* [ ] Phase 3: freeze-window support dates are pending.
* [ ] Phase 4: retirement-window planning is pending.

## Phase 1: Notice

1. Announce Vue package availability and migration guidance.
2. Publish and maintain `migration/REACT_TO_VUE_MIGRATION_GUIDE.md` as the primary replacement matrix.
3. Mark corresponding React packages as maintenance-only in docs.
4. Publish migration matrix links in package READMEs.

## Phase 2: Soft deprecation

1. Add npm deprecation warnings for React packages with clear Vue replacement paths.
2. Restrict React package updates to security fixes, bug fixes, and critical compatibility.
3. Route new feature requests to Vue package tracks.

## Phase 3: Freeze

1. Stop feature development on deprecated React packages.
2. Keep limited support window with defined end-of-support date.
3. Provide final migration guide updates and archived API references.
4. Keep migration completion guard enabled in CI (`yarn vue:migration:assert-complete`).

## Phase 4: Retirement

1. Archive retired package docs and changelogs.
2. Keep migration guides and compatibility notes available.
3. Maintain a rollback strategy for critical ecosystem incidents.
