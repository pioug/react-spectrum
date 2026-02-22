# Storybook Parity Checklists

This folder stores source-audit evidence required by `STORYBOOK_PARITY_PLAN.md`.

Each component/story group parity scope must have one checklist file that records:

- React source files reviewed
- Vue source files reviewed
- concrete behavior/style gaps found
- implementation fixes applied
- tests proving parity closure

Checklist files must follow the section template in `_TEMPLATE.md`.

Validation:

- Run `yarn storybook:parity:checklists:validate` to ensure checklist structure is complete.
- Run `yarn storybook:parity:behavior` (with React/Vue Storybook servers running) to validate baseline behavior parity scenarios.
- Run `yarn storybook:parity:visual` (with React/Vue Storybook servers running) to enforce strict visual parity (`changedPixels = 0`).

Style provenance rule:

- Vue Storybook must source shared parity styles from React story sources (`packages/react-aria-components/stories/styles.css` and `packages/react-aria-components/example/index.css`) via `starters/vue/.storybook/preview.ts`.
