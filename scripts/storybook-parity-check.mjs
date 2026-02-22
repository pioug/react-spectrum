#!/usr/bin/env node

import {spawnSync} from 'node:child_process';

function parseArgs(argv) {
  let args = {
    checklistCommand: 'yarn storybook:parity:checklists:validate',
    reactUrl: 'http://127.0.0.1:9003',
    vueUrl: 'http://127.0.0.1:6106',
    includeIdRegex: '^react-aria-components-',
    outputDir: 'artifacts/storybook-parity/catalog',
    visualOutputDir: 'artifacts/storybook-parity',
    skipChecklists: false,
    skipBehavior: false,
    skipVisual: false,
    skipStyles: false,
    styleCommand: 'node scripts/storybook-parity-style-sources.mjs',
    visualCommand: 'node scripts/storybook-parity-visual.mjs'
  };

  for (let i = 2; i < argv.length; i++) {
    let arg = argv[i];
    if (arg === '--checklist-command') {
      args.checklistCommand = argv[++i];
    } else if (arg === '--react-url') {
      args.reactUrl = argv[++i];
    } else if (arg === '--vue-url') {
      args.vueUrl = argv[++i];
    } else if (arg === '--include-id-regex') {
      args.includeIdRegex = argv[++i];
    } else if (arg === '--output-dir') {
      args.outputDir = argv[++i];
    } else if (arg === '--visual-output-dir') {
      args.visualOutputDir = argv[++i];
    } else if (arg === '--skip-checklists') {
      args.skipChecklists = true;
    } else if (arg === '--skip-behavior') {
      args.skipBehavior = true;
    } else if (arg === '--style-command') {
      args.styleCommand = argv[++i];
    } else if (arg === '--visual-command') {
      args.visualCommand = argv[++i];
    } else if (arg === '--skip-styles') {
      args.skipStyles = true;
    } else if (arg === '--skip-visual') {
      args.skipVisual = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`
Usage:
  node scripts/storybook-parity-check.mjs [options]

Options:
  --checklist-command <cmd>   Command to validate source-audit checklists first
                              (default: yarn storybook:parity:checklists:validate)
  --style-command <cmd>       Command to validate style-source parity
                              (default: node scripts/storybook-parity-style-sources.mjs)
  --visual-command <cmd>      Command to run visual parity checks
                              (default: node scripts/storybook-parity-visual.mjs)
  --react-url <url>           React Storybook base URL (default: http://127.0.0.1:9003)
  --vue-url <url>             Vue Storybook base URL (default: http://127.0.0.1:6106)
  --include-id-regex <regex>  Compare ids matching regex
                              (default: ^react-aria-components-)
  --output-dir <dir>          Catalog output directory
                              (default: artifacts/storybook-parity/catalog)
  --visual-output-dir <dir>   Visual output directory
                              (default: artifacts/storybook-parity)
  --skip-checklists           Skip checklist validation (not recommended)
  --skip-styles               Skip style-source parity validation (not recommended)
  --skip-behavior             Skip behavior tests (not recommended)
  --skip-visual               Skip visual parity checks (not recommended)
  --help, -h                  Show help
`.trim());
}

function run(command, label) {
  console.log(`[storybook-parity] ${label}`);
  let result = spawnSync(command, {
    stdio: 'inherit',
    shell: true
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function buildCatalogCommand(args) {
  let parts = [
    'node scripts/storybook-parity-catalog.mjs',
    `--react-url "${args.reactUrl}"`,
    `--vue-url "${args.vueUrl}"`,
    `--output-dir "${args.outputDir}"`
  ];

  if (args.includeIdRegex) {
    parts.push(`--include-id-regex "${args.includeIdRegex}"`);
  }

  return parts.join(' ');
}

function buildBehaviorCommand(args) {
  let parts = [
    'node scripts/storybook-parity-behavior.mjs',
    `--react-url "${args.reactUrl}"`,
    `--vue-url "${args.vueUrl}"`,
    `--output-dir "${args.outputDir}"`
  ];

  return parts.join(' ');
}

function buildVisualCommand(args) {
  let parts = [
    args.visualCommand,
    `--react-url "${args.reactUrl}"`,
    `--vue-url "${args.vueUrl}"`,
    `--output-dir "${args.visualOutputDir}"`
  ];

  if (args.includeIdRegex) {
    parts.push(`--include-id-regex "${args.includeIdRegex}"`);
  }

  return parts.join(' ');
}

function main() {
  let args = parseArgs(process.argv);

  if (!args.skipChecklists) {
    run(args.checklistCommand, `Validating source-audit checklists: ${args.checklistCommand}`);
  }

  if (!args.skipStyles) {
    run(args.styleCommand, `Validating style-source parity: ${args.styleCommand}`);
  }

  if (!args.skipBehavior) {
    run(buildBehaviorCommand(args), 'Running Storybook behavior parity checks');
  }

  run(buildCatalogCommand(args), 'Validating Storybook catalog identity');

  if (!args.skipVisual) {
    run(buildVisualCommand(args), 'Running Storybook visual zero-diff checks');
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
