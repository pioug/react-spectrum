# React Deprecation Plan

This plan describes how React package deprecation should proceed once Vue package ports are publish-ready.

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

## Phase 4: Retirement

1. Archive retired package docs and changelogs.
2. Keep migration guides and compatibility notes available.
3. Maintain a rollback strategy for critical ecosystem incidents.
