# Vue Visual Parity Artifacts

This folder stores baseline screenshot fixtures used by:

- `yarn vue:parity:visual:coverage:assert`
- `yarn vue:parity:visual:capture:react`
- `yarn vue:parity:visual:compare`

## Contents

- `react-reference/`: committed React reference PNGs used for parity comparison.
- `vue-current/`: generated Vue screenshots from the latest comparison run (gitignored).
- `diff/`: generated pixel-diff images (gitignored).

## Updating baseline intentionally

1. Make visual changes intentionally.
2. Run `yarn vue:parity:visual:coverage:assert` to confirm all Vue UI packages remain covered by fixtures.
3. Run `yarn vue:parity:visual:capture:react`.
4. Verify `migration/VUE_VISUAL_PARITY_REPORT.md` and changed baseline images.
5. Commit updated `react-reference/*.png` files with the related visual change.

## Fixture source

The fixture matrix is configured in `migration/vue-visual-parity-fixtures.json`, rendered from `starters/react-parity/parity.html` for React references, and rendered from `starters/vue/parity.html` for Vue candidates.
Package-level coverage assertions are defined in `scripts/vue-visual-coverage-assert.mjs`.
Extended scenario buckets (state matrix, RTL, forced-colors, overlay placements, async/virtualized/dnd, and s2) are tracked in `migration/VUE_VISUAL_PARITY_BACKLOG.md`.
