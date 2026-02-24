# Storybook Parity Checklists (Deprecated)

Manual checklist files were removed.

Reason:

- They drifted from actual Storybook parity and created false confidence.

Current policy:

- Do not use manual per-component checklists as a parity gate.
- Treat parity as evidence from Storybook structure and rendered output.
- `yarn storybook:parity:checklists:validate` is now a no-op for backward compatibility.
