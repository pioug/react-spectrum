# Vue Visual Parity Baseline

This folder stores baseline screenshot fixtures used by:

- `yarn vue:parity:visual:capture`
- `yarn vue:parity:visual:compare`

## Contents

- `baseline/`: committed baseline PNGs used for parity comparison.
- `current/`: generated screenshots from the latest comparison run (gitignored).
- `diff/`: generated pixel-diff images (gitignored).

## Updating baseline intentionally

1. Make visual changes intentionally.
2. Run `yarn vue:parity:visual:capture`.
3. Verify `migration/VUE_VISUAL_PARITY_REPORT.md` and changed baseline images.
4. Commit updated `baseline/*.png` files with the related visual change.

## Fixture source

The fixture matrix is configured in `migration/vue-visual-parity-fixtures.json` and rendered from `starters/vue/parity.html`.
