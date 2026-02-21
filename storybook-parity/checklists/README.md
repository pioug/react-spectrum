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
