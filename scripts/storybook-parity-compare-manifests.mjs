#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  let args = {
    reactManifest: 'storybook-parity/manifest/react-story-manifest.json',
    vueManifest: 'storybook-parity/manifest/vue-story-manifest.json',
    outputDir: 'storybook-parity/catalog'
  };

  for (let i = 2; i < argv.length; i++) {
    let arg = argv[i];
    if (arg === '--react-manifest') {
      args.reactManifest = argv[++i];
    } else if (arg === '--vue-manifest') {
      args.vueManifest = argv[++i];
    } else if (arg === '--output-dir') {
      args.outputDir = argv[++i];
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
  node scripts/storybook-parity-compare-manifests.mjs [options]

Options:
  --react-manifest <file>  React manifest JSON
                           (default: storybook-parity/manifest/react-story-manifest.json)
  --vue-manifest <file>    Vue manifest JSON
                           (default: storybook-parity/manifest/vue-story-manifest.json)
  --output-dir <dir>       Output dir for diff report
                           (default: storybook-parity/catalog)
  --help, -h               Show help
`.trim());
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function toIdSet(manifest) {
  return new Set((manifest.entries || []).map((entry) => entry.id));
}

function writeReport(report, outputDir) {
  fs.mkdirSync(outputDir, {recursive: true});
  fs.writeFileSync(path.join(outputDir, 'manifest-report.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(outputDir, 'manifest-report.md'), formatMarkdown(report));
}

function formatMarkdown(report) {
  let lines = [];
  lines.push('# Storybook Manifest Parity Report');
  lines.push('');
  lines.push(`- React manifest: \`${report.reactManifest}\``);
  lines.push(`- Vue manifest: \`${report.vueManifest}\``);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- React entries: ${report.reactCount}`);
  lines.push(`- Vue entries: ${report.vueCount}`);
  lines.push(`- Missing in Vue: ${report.missingInVue.length}`);
  lines.push(`- Extra in Vue: ${report.extraInVue.length}`);
  lines.push(`- Result: ${report.ok ? 'pass' : 'fail'}`);
  lines.push('');
  lines.push('## Missing In Vue');
  lines.push('');
  if (report.missingInVue.length === 0) {
    lines.push('- none');
  } else {
    for (let id of report.missingInVue) {
      lines.push(`- \`${id}\``);
    }
  }
  lines.push('');
  lines.push('## Extra In Vue');
  lines.push('');
  if (report.extraInVue.length === 0) {
    lines.push('- none');
  } else {
    for (let id of report.extraInVue) {
      lines.push(`- \`${id}\``);
    }
  }
  lines.push('');
  return lines.join('\n');
}

function main() {
  let args = parseArgs(process.argv);
  let react = readJson(args.reactManifest);
  let vue = readJson(args.vueManifest);

  let reactIds = [...toIdSet(react)].sort();
  let vueIds = [...toIdSet(vue)].sort();
  let vueSet = new Set(vueIds);
  let reactSet = new Set(reactIds);

  let missingInVue = reactIds.filter((id) => !vueSet.has(id));
  let extraInVue = vueIds.filter((id) => !reactSet.has(id));

  let report = {
    generatedAt: new Date().toISOString(),
    reactManifest: args.reactManifest,
    vueManifest: args.vueManifest,
    reactCount: reactIds.length,
    vueCount: vueIds.length,
    missingInVue,
    extraInVue,
    ok: missingInVue.length === 0 && extraInVue.length === 0
  };

  writeReport(report, args.outputDir);

  console.log(`React entries: ${report.reactCount}`);
  console.log(`Vue entries: ${report.vueCount}`);
  console.log(`Missing in Vue: ${report.missingInVue.length}`);
  console.log(`Extra in Vue: ${report.extraInVue.length}`);
  console.log(`Report: ${path.join(args.outputDir, 'manifest-report.md')}`);

  if (!report.ok) {
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
