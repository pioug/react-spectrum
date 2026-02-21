#!/usr/bin/env node

import {spawnSync} from 'node:child_process';

function parseArgs(argv) {
  let args = {
    behaviorCommand: 'yarn workspace vue-spectrum-starter test',
    reactUrl: 'http://127.0.0.1:9003',
    vueUrl: 'http://127.0.0.1:6106',
    includeIdRegex: '^react-aria-components-',
    outputDir: 'artifacts/storybook-parity/catalog',
    skipBehavior: false
  };

  for (let i = 2; i < argv.length; i++) {
    let arg = argv[i];
    if (arg === '--behavior-command') {
      args.behaviorCommand = argv[++i];
    } else if (arg === '--react-url') {
      args.reactUrl = argv[++i];
    } else if (arg === '--vue-url') {
      args.vueUrl = argv[++i];
    } else if (arg === '--include-id-regex') {
      args.includeIdRegex = argv[++i];
    } else if (arg === '--output-dir') {
      args.outputDir = argv[++i];
    } else if (arg === '--skip-behavior') {
      args.skipBehavior = true;
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
  --behavior-command <cmd>    Command to run behavior tests first
                              (default: yarn workspace vue-spectrum-starter test)
  --react-url <url>           React Storybook base URL (default: http://127.0.0.1:9003)
  --vue-url <url>             Vue Storybook base URL (default: http://127.0.0.1:6106)
  --include-id-regex <regex>  Compare ids matching regex
                              (default: ^react-aria-components-)
  --output-dir <dir>          Catalog output directory
                              (default: artifacts/storybook-parity/catalog)
  --skip-behavior             Skip behavior tests (not recommended)
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

function main() {
  let args = parseArgs(process.argv);

  if (!args.skipBehavior) {
    run(args.behaviorCommand, `Running behavior tests: ${args.behaviorCommand}`);
  }

  run(buildCatalogCommand(args), 'Validating Storybook catalog identity');
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
