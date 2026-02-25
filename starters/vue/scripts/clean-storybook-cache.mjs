import {rmSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(scriptDir, '..');
const monorepoRoot = resolve(workspaceRoot, '..', '..');

const cacheDirs = [
  resolve(workspaceRoot, 'node_modules/.cache/storybook'),
  resolve(monorepoRoot, 'node_modules/.cache/storybook')
];

for (let cacheDir of cacheDirs) {
  rmSync(cacheDir, {recursive: true, force: true});
}
