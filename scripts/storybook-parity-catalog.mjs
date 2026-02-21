#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  let args = {
    reactUrl: 'http://127.0.0.1:9003',
    vueUrl: 'http://127.0.0.1:6106',
    includeIdRegex: '',
    outputDir: 'artifacts/storybook-parity/catalog'
  };

  for (let i = 2; i < argv.length; i++) {
    let arg = argv[i];
    if (arg === '--react-url') {
      args.reactUrl = argv[++i];
    } else if (arg === '--vue-url') {
      args.vueUrl = argv[++i];
    } else if (arg === '--include-id-regex') {
      args.includeIdRegex = argv[++i];
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
  // Keep options minimal and explicit so this can be used in CI without wrappers.
  console.log(`
Usage:
  node scripts/storybook-parity-catalog.mjs [options]

Options:
  --react-url <url>           React Storybook base URL (default: http://127.0.0.1:9003)
  --vue-url <url>             Vue Storybook base URL (default: http://127.0.0.1:6106)
  --include-id-regex <regex>  Only compare story ids matching regex
  --output-dir <dir>          Output directory (default: artifacts/storybook-parity/catalog)
  --help, -h                  Show help
`.trim());
}

async function fetchIndex(baseUrl) {
  let candidates = ['index.json', 'stories.json'];
  let lastError;

  for (let file of candidates) {
    let url = new URL(file, ensureTrailingSlash(baseUrl)).toString();
    try {
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
      }
      let json = await response.json();
      return {json, url};
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(`Unable to fetch Storybook catalog from ${baseUrl}: ${String(lastError)}`);
}

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

function extractStoryIds(catalog) {
  let entries = catalog?.entries;
  if (!entries || typeof entries !== 'object') {
    return [];
  }

  return Object.values(entries)
    .filter((entry) => entry && entry.type === 'story' && typeof entry.id === 'string')
    .map((entry) => entry.id)
    .sort();
}

function applyFilter(ids, includeIdRegex) {
  if (!includeIdRegex) {
    return ids;
  }

  let regex = new RegExp(includeIdRegex);
  return ids.filter((id) => regex.test(id));
}

function diffIds(referenceIds, candidateIds) {
  let candidateSet = new Set(candidateIds);
  let referenceSet = new Set(referenceIds);

  let missingInCandidate = referenceIds.filter((id) => !candidateSet.has(id));
  let extraInCandidate = candidateIds.filter((id) => !referenceSet.has(id));

  return {missingInCandidate, extraInCandidate};
}

function writeReport(report, outputDir) {
  fs.mkdirSync(outputDir, {recursive: true});
  fs.writeFileSync(path.join(outputDir, 'report.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(outputDir, 'report.md'), formatMarkdown(report));
}

function formatMarkdown(report) {
  let lines = [];
  lines.push('# Storybook Catalog Parity Report');
  lines.push('');
  lines.push(`- React catalog: ${report.react.catalogUrl}`);
  lines.push(`- Vue catalog: ${report.vue.catalogUrl}`);
  lines.push(`- Include regex: ${report.includeIdRegex || '(none)'}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- React story ids: ${report.react.storyCount}`);
  lines.push(`- Vue story ids: ${report.vue.storyCount}`);
  lines.push(`- Missing in Vue: ${report.diff.missingInVue.length}`);
  lines.push(`- Extra in Vue: ${report.diff.extraInVue.length}`);
  lines.push(`- Result: ${report.ok ? 'pass' : 'fail'}`);
  lines.push('');

  lines.push('## Missing In Vue');
  lines.push('');
  if (report.diff.missingInVue.length === 0) {
    lines.push('- none');
  } else {
    for (let id of report.diff.missingInVue) {
      lines.push(`- \`${id}\``);
    }
  }
  lines.push('');

  lines.push('## Extra In Vue');
  lines.push('');
  if (report.diff.extraInVue.length === 0) {
    lines.push('- none');
  } else {
    for (let id of report.diff.extraInVue) {
      lines.push(`- \`${id}\``);
    }
  }
  lines.push('');

  return lines.join('\n');
}

async function main() {
  let args = parseArgs(process.argv);

  let [reactCatalog, vueCatalog] = await Promise.all([
    fetchIndex(args.reactUrl),
    fetchIndex(args.vueUrl)
  ]);

  let reactStoryIds = applyFilter(extractStoryIds(reactCatalog.json), args.includeIdRegex);
  let vueStoryIds = applyFilter(extractStoryIds(vueCatalog.json), args.includeIdRegex);
  let diff = diffIds(reactStoryIds, vueStoryIds);

  let report = {
    generatedAt: new Date().toISOString(),
    includeIdRegex: args.includeIdRegex,
    react: {
      baseUrl: args.reactUrl,
      catalogUrl: reactCatalog.url,
      storyCount: reactStoryIds.length
    },
    vue: {
      baseUrl: args.vueUrl,
      catalogUrl: vueCatalog.url,
      storyCount: vueStoryIds.length
    },
    diff: {
      missingInVue: diff.missingInCandidate,
      extraInVue: diff.extraInCandidate
    },
    ok: diff.missingInCandidate.length === 0 && diff.extraInCandidate.length === 0
  };

  writeReport(report, args.outputDir);

  console.log(`React story ids: ${report.react.storyCount}`);
  console.log(`Vue story ids: ${report.vue.storyCount}`);
  console.log(`Missing in Vue: ${report.diff.missingInVue.length}`);
  console.log(`Extra in Vue: ${report.diff.extraInVue.length}`);
  console.log(`Report: ${path.join(args.outputDir, 'report.md')}`);

  if (!report.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
