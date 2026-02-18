import {execSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const STATUS_FILE = path.join(REPO_ROOT, 'migration', 'vue-migration-status.json');
const TRACKER_FILE = path.join(REPO_ROOT, 'VUE_MIGRATION_TRACKER.md');

const STATUS_ORDER = ['in_progress', 'ported', 'planned', 'blocked', 'not_started'];
const ACTIVE_STATUSES = new Set(['in_progress', 'ported']);
const VALID_STATUSES = new Set(STATUS_ORDER);

const SCOPED_PACKAGE_ROOTS = [
  'packages/@react-aria',
  'packages/@react-spectrum',
  'packages/@react-stately'
];

const SINGLE_PACKAGE_PATHS = [
  'packages/react-aria/package.json',
  'packages/react-stately/package.json',
  'packages/react-aria-components/package.json',
  'packages/tailwindcss-react-aria-components/package.json'
];

function parseArgs(args) {
  let command = args[0] ?? 'report';
  let write = args.includes('--write');
  return {command, write};
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function discoverSourcePackages() {
  let packages = [];

  for (let root of SCOPED_PACKAGE_ROOTS) {
    let rootPath = path.join(REPO_ROOT, root);
    if (!fs.existsSync(rootPath)) {
      continue;
    }

    for (let entry of fs.readdirSync(rootPath).sort()) {
      let packageJsonPath = path.join(rootPath, entry, 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        continue;
      }

      let pkg = readJson(packageJsonPath);
      packages.push({
        sourcePackage: pkg.name,
        sourcePath: path.dirname(path.relative(REPO_ROOT, packageJsonPath))
      });
    }
  }

  for (let packageJsonRelPath of SINGLE_PACKAGE_PATHS) {
    let packageJsonPath = path.join(REPO_ROOT, packageJsonRelPath);
    if (!fs.existsSync(packageJsonPath)) {
      continue;
    }

    let pkg = readJson(packageJsonPath);
    packages.push({
      sourcePackage: pkg.name,
      sourcePath: path.dirname(packageJsonRelPath)
    });
  }

  return packages
    .sort((a, b) => a.sourcePackage.localeCompare(b.sourcePackage))
    .filter((pkg, index, all) => index === 0 || pkg.sourcePackage !== all[index - 1].sourcePackage);
}

function deriveTargetPackage(sourcePackage) {
  if (sourcePackage.startsWith('@react-spectrum/')) {
    return sourcePackage.replace('@react-spectrum/', '@vue-spectrum/');
  }

  if (sourcePackage.startsWith('@react-aria/')) {
    return sourcePackage.replace('@react-aria/', '@vue-aria/');
  }

  if (sourcePackage.startsWith('@react-stately/')) {
    return sourcePackage.replace('@react-stately/', '@vue-stately/');
  }

  if (sourcePackage === 'react-aria-components') {
    return '@vue-spectrum/components';
  }

  if (sourcePackage === 'react-aria') {
    return 'vue-aria';
  }

  if (sourcePackage === 'react-stately') {
    return 'vue-stately';
  }

  if (sourcePackage === 'tailwindcss-react-aria-components') {
    return 'tailwindcss-vue-aria-components';
  }

  return sourcePackage;
}

function deriveTargetPath(targetPackage) {
  if (targetPackage.startsWith('@')) {
    let [scope, name] = targetPackage.split('/');
    return path.posix.join('packages', scope, name);
  }

  return path.posix.join('packages', targetPackage);
}

function validateAcceptanceTests(sourcePackage, status, acceptanceTests) {
  if (!Array.isArray(acceptanceTests)) {
    throw new Error(`Expected acceptanceTests to be an array for ${sourcePackage}.`);
  }

  for (let [index, test] of acceptanceTests.entries()) {
    if (!test || typeof test !== 'object') {
      throw new Error(`Expected acceptanceTests[${index}] to be an object for ${sourcePackage}.`);
    }

    if (typeof test.name !== 'string' || test.name.trim().length === 0) {
      throw new Error(`Expected acceptanceTests[${index}].name to be a non-empty string for ${sourcePackage}.`);
    }

    if (typeof test.command !== 'string' || test.command.trim().length === 0) {
      throw new Error(`Expected acceptanceTests[${index}].command to be a non-empty string for ${sourcePackage}.`);
    }
  }

  if (ACTIVE_STATUSES.has(status) && acceptanceTests.length === 0) {
    throw new Error(`Packages with status "${status}" must define acceptanceTests (${sourcePackage}).`);
  }
}

function buildTrackerEntries(sourcePackages, statusConfig) {
  let overrides = statusConfig.ports ?? {};
  let sourceNames = new Set(sourcePackages.map(pkg => pkg.sourcePackage));

  for (let sourcePackage of Object.keys(overrides)) {
    if (!sourceNames.has(sourcePackage)) {
      throw new Error(`Unknown source package in migration status file: ${sourcePackage}`);
    }
  }

  let entries = sourcePackages.map((pkg) => {
    let override = overrides[pkg.sourcePackage] ?? {};
    let status = override.status ?? 'not_started';

    if (!VALID_STATUSES.has(status)) {
      throw new Error(`Invalid status "${status}" for ${pkg.sourcePackage}.`);
    }

    let targetPackage = override.targetPackage ?? deriveTargetPackage(pkg.sourcePackage);
    let targetPath = override.targetPath ?? deriveTargetPath(targetPackage);
    let notes = override.notes ?? '';
    let acceptanceTests = override.acceptanceTests ?? [];

    validateAcceptanceTests(pkg.sourcePackage, status, acceptanceTests);

    return {
      sourcePackage: pkg.sourcePackage,
      sourcePath: pkg.sourcePath,
      targetPackage,
      targetPath,
      status,
      notes,
      acceptanceTests
    };
  });

  entries.sort((a, b) => {
    let statusRank = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
    if (statusRank !== 0) {
      return statusRank;
    }

    return a.sourcePackage.localeCompare(b.sourcePackage);
  });

  return entries;
}

function buildMarkdown(entries) {
  let today = new Date().toISOString().slice(0, 10);
  let counts = new Map(STATUS_ORDER.map(status => [status, 0]));

  for (let entry of entries) {
    counts.set(entry.status, (counts.get(entry.status) ?? 0) + 1);
  }

  let lines = [];
  lines.push('# Vue Migration Tracker');
  lines.push('');
  lines.push(`Generated: ${today}`);
  lines.push('');
  lines.push(`Tracked source packages: ${entries.length}`);
  lines.push('');
  lines.push('## Commands');
  lines.push('');
  lines.push('* `yarn vue:migration:report` regenerates this file.');
  lines.push('* `yarn vue:migration:test` runs acceptance tests for all `in_progress` and `ported` packages.');
  lines.push('');
  lines.push('## Status summary');
  lines.push('');
  lines.push('| Status | Count |');
  lines.push('| --- | ---: |');

  for (let status of STATUS_ORDER) {
    lines.push(`| ${status} | ${counts.get(status)} |`);
  }

  lines.push('');
  lines.push('## Package tracker');
  lines.push('');
  lines.push('| Source package | Source path | Target package | Target path | Status | Acceptance tests | Notes |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- |');

  for (let entry of entries) {
    let testSummary = entry.acceptanceTests.length === 0
      ? '-'
      : entry.acceptanceTests.map(test => test.name).join('<br/>');
    let notes = entry.notes && entry.notes.length > 0 ? entry.notes : '-';
    lines.push(`| \`${entry.sourcePackage}\` | \`${entry.sourcePath}\` | \`${entry.targetPackage}\` | \`${entry.targetPath}\` | ${entry.status} | ${testSummary} | ${notes} |`);
  }

  lines.push('');

  return lines.join('\n');
}

function writeTracker(entries) {
  let markdown = buildMarkdown(entries);
  fs.writeFileSync(TRACKER_FILE, markdown);
}

function runAcceptanceTests(entries) {
  let activeEntries = entries.filter(entry => ACTIVE_STATUSES.has(entry.status));
  if (activeEntries.length === 0) {
    console.log('No in_progress or ported packages found. Nothing to verify.');
    return;
  }

  let hasFailure = false;
  let commandResults = new Map();

  for (let entry of activeEntries) {
    console.log(`\n=== ${entry.sourcePackage} -> ${entry.targetPackage} (${entry.status}) ===`);

    let packageJsonPath = path.join(REPO_ROOT, entry.targetPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.error(`Missing target package: ${packageJsonPath}`);
      hasFailure = true;
      continue;
    }

    for (let test of entry.acceptanceTests) {
      console.log(`\n[ACCEPTANCE] ${test.name}`);
      console.log(`$ ${test.command}`);

      if (commandResults.has(test.command)) {
        let passed = commandResults.get(test.command);
        console.log(`Skipping duplicate command (already ${passed ? 'passed' : 'failed'} earlier).`);
        if (!passed) {
          hasFailure = true;
        }
        continue;
      }

      try {
        execSync(test.command, {
          cwd: REPO_ROOT,
          stdio: 'inherit'
        });
        commandResults.set(test.command, true);
      } catch {
        hasFailure = true;
        commandResults.set(test.command, false);
      }
    }
  }

  if (hasFailure) {
    process.exitCode = 1;
    return;
  }

  console.log('\nAll active migration acceptance tests passed.');
}

function main() {
  let {command, write} = parseArgs(process.argv.slice(2));
  let statusConfig = readJson(STATUS_FILE);
  let sourcePackages = discoverSourcePackages();
  let entries = buildTrackerEntries(sourcePackages, statusConfig);

  if (command === 'report') {
    if (write) {
      writeTracker(entries);
      console.log(`Wrote ${path.relative(REPO_ROOT, TRACKER_FILE)} (${entries.length} packages).`);
      return;
    }

    process.stdout.write(buildMarkdown(entries));
    return;
  }

  if (command === 'verify') {
    runAcceptanceTests(entries);
    return;
  }

  console.error(`Unknown command: ${command}`);
  console.error('Usage: node scripts/vue-migration-tracker.mjs [report|verify] [--write]');
  process.exitCode = 1;
}

main();
