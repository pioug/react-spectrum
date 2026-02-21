#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  let args = {
    sourceUrl: 'http://127.0.0.1:9003',
    includeIdRegex: '^react-aria-components-',
    outputPath: 'storybook-parity/manifest/react-story-manifest.json'
  };

  for (let i = 2; i < argv.length; i++) {
    let arg = argv[i];
    if (arg === '--source-url') {
      args.sourceUrl = argv[++i];
    } else if (arg === '--include-id-regex') {
      args.includeIdRegex = argv[++i];
    } else if (arg === '--output-path') {
      args.outputPath = argv[++i];
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
  node scripts/storybook-parity-export-manifest.mjs [options]

Options:
  --source-url <url>          Storybook base URL (default: http://127.0.0.1:9003)
  --include-id-regex <regex>  Include ids matching regex
                              (default: ^react-aria-components-)
  --output-path <file>        Output JSON path
                              (default: storybook-parity/manifest/react-story-manifest.json)
  --help, -h                  Show help
`.trim());
}

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

async function fetchCatalog(sourceUrl) {
  let candidates = ['index.json', 'stories.json'];
  let lastError;

  for (let file of candidates) {
    let url = new URL(file, ensureTrailingSlash(sourceUrl)).toString();
    try {
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return {url, json: await response.json()};
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(`Unable to fetch catalog from ${sourceUrl}: ${String(lastError)}`);
}

function extractEntries(catalogJson, includeIdRegex) {
  let entries = catalogJson?.entries;
  if (!entries || typeof entries !== 'object') {
    return [];
  }

  let regex = includeIdRegex ? new RegExp(includeIdRegex) : null;

  return Object.values(entries)
    .filter((entry) => entry && entry.type === 'story' && typeof entry.id === 'string')
    .filter((entry) => (regex ? regex.test(entry.id) : true))
    .map((entry) => ({
      id: entry.id,
      title: entry.title ?? '',
      name: entry.name ?? '',
      importPath: entry.importPath ?? '',
      tags: Array.isArray(entry.tags) ? entry.tags : []
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function writeManifest(outputPath, manifest) {
  fs.mkdirSync(path.dirname(outputPath), {recursive: true});
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
}

async function main() {
  let args = parseArgs(process.argv);
  let catalog = await fetchCatalog(args.sourceUrl);
  let entries = extractEntries(catalog.json, args.includeIdRegex);

  let manifest = {
    generatedAt: new Date().toISOString(),
    sourceUrl: args.sourceUrl,
    catalogUrl: catalog.url,
    includeIdRegex: args.includeIdRegex,
    count: entries.length,
    entries
  };

  writeManifest(args.outputPath, manifest);
  console.log(`Exported ${entries.length} entries to ${args.outputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
