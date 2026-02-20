# Vue Visual Parity Baseline

This folder stores baseline screenshot fixtures used by:

- `yarn vue:parity:visual:coverage:assert`
- `yarn vue:parity:visual:capture`
- `yarn vue:parity:visual:compare`

## Contents

- `baseline/`: committed baseline PNGs used for parity comparison.
- `current/`: generated screenshots from the latest comparison run (gitignored).
- `diff/`: generated pixel-diff images (gitignored).

## Updating baseline intentionally

1. Make visual changes intentionally.
2. Run `yarn vue:parity:visual:coverage:assert` to confirm all Vue UI packages remain covered by fixtures.
3. Run `yarn vue:parity:visual:capture`.
4. Verify `migration/VUE_VISUAL_PARITY_REPORT.md` and changed baseline images.
5. Commit updated `baseline/*.png` files with the related visual change.

## Fixture source

The fixture matrix is configured in `migration/vue-visual-parity-fixtures.json` and rendered from `starters/vue/parity.html`.
Package-level coverage assertions are defined in `scripts/vue-visual-coverage-assert.mjs`.
