import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.vue']);
const SKIP_DIRS = new Set(['node_modules', 'dist']);

function discoverVuePackageDirs() {
  let packagesRoot = path.join(REPO_ROOT, 'packages');
  let result = [];

  for (let entry of fs.readdirSync(packagesRoot, {withFileTypes: true})) {
    if (!entry.isDirectory()) {
      continue;
    }

    let groupDir = path.join(packagesRoot, entry.name);

    if (entry.name.startsWith('@vue-')) {
      for (let scopedEntry of fs.readdirSync(groupDir, {withFileTypes: true})) {
        if (!scopedEntry.isDirectory()) {
          continue;
        }

        let packageDir = path.join(groupDir, scopedEntry.name);
        if (fs.existsSync(path.join(packageDir, 'package.json'))) {
          result.push(packageDir);
        }
      }
      continue;
    }

    if (entry.name.startsWith('vue-') && fs.existsSync(path.join(groupDir, 'package.json'))) {
      result.push(groupDir);
    }
  }

  return result.sort();
}

function walkFiles(dirPath, callback) {
  for (let entry of fs.readdirSync(dirPath, {withFileTypes: true})) {
    if (SKIP_DIRS.has(entry.name)) {
      continue;
    }

    let fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, callback);
      continue;
    }

    callback(fullPath);
  }
}

function rewriteSourceText(sourceText) {
  return sourceText
    .replace(/@react-types\//g, '@vue-types/')
    .replace(/@react-aria\/grid/g, '@vue-aria/grid');
}

function rewritePackageDeps(packageJson) {
  let changed = false;

  for (let section of ['dependencies', 'peerDependencies', 'devDependencies', 'optionalDependencies']) {
    let deps = packageJson[section];
    if (!deps || typeof deps !== 'object') {
      continue;
    }

    let next = {};
    for (let [name, version] of Object.entries(deps)) {
      let renamed = name.replace(/^@react-types\//u, '@vue-types/');
      if (renamed === '@react-aria/grid') {
        renamed = '@vue-aria/grid';
      }

      if (renamed !== name) {
        changed = true;
      }

      next[renamed] = version;
    }

    packageJson[section] = next;
  }

  return changed;
}

function rewriteVuePackages() {
  let packageDirs = discoverVuePackageDirs();
  let sourceFilesChanged = 0;
  let packageJsonChanged = 0;

  for (let packageDir of packageDirs) {
    walkFiles(packageDir, (filePath) => {
      if (!SOURCE_EXTENSIONS.has(path.extname(filePath))) {
        return;
      }

      let original = fs.readFileSync(filePath, 'utf8');
      let next = rewriteSourceText(original);
      if (next === original) {
        return;
      }

      fs.writeFileSync(filePath, next);
      sourceFilesChanged++;
    });

    let packageJsonPath = path.join(packageDir, 'package.json');
    let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (rewritePackageDeps(packageJson)) {
      fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
      packageJsonChanged++;
    }
  }

  return {sourceFilesChanged, packageJsonChanged};
}

function main() {
  let result = rewriteVuePackages();
  console.log(`Rewrote ${result.sourceFilesChanged} source files and ${result.packageJsonChanged} package manifests.`);
}

main();
