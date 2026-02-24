#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {globSync} from 'glob';

const repoRoot = process.cwd();

function parseArgs(argv) {
  let args = {
    reactStoriesGlob: 'packages/react-aria-components/stories/*.stories.tsx',
    vueStoriesGlob: 'packages/@vue-spectrum/components/stories/*.stories.ts',
    vuePreviewFile: 'starters/vue/.storybook/preview.ts',
    outputDir: 'storybook-parity/catalog'
  };

  for (let i = 2; i < argv.length; i++) {
    let arg = argv[i];
    if (arg === '--react-stories-glob') {
      args.reactStoriesGlob = argv[++i];
    } else if (arg === '--vue-stories-glob') {
      args.vueStoriesGlob = argv[++i];
    } else if (arg === '--vue-preview-file') {
      args.vuePreviewFile = argv[++i];
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
  node scripts/storybook-parity-style-sources.mjs [options]

Options:
  --react-stories-glob <glob>  React stories glob
                               (default: packages/react-aria-components/stories/*.stories.tsx)
  --vue-stories-glob <glob>    Vue stories glob
                               (default: packages/@vue-spectrum/components/stories/*.stories.ts)
  --vue-preview-file <file>    Vue Storybook preview file
                               (default: starters/vue/.storybook/preview.ts)
  --output-dir <dir>           Output directory
                               (default: storybook-parity/catalog)
  --help, -h                   Show help
`.trim());
}

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/');
}

function isPackageImport(specifier) {
  return !specifier.startsWith('.') && !specifier.startsWith('/') && !specifier.startsWith('file:');
}

function resolveImport(fromFile, importPath) {
  if (isPackageImport(importPath)) {
    return `pkg:${importPath}`;
  }

  return path.resolve(path.dirname(fromFile), importPath);
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function parseCssImports(filePath) {
  let source = read(filePath);
  let matches = [];
  let regex = /import\s+(?:[^'"`;]+?\s+from\s+)?['"]([^'"]+\.css)['"]/g;
  let match = null;

  while ((match = regex.exec(source))) {
    matches.push({
      specifier: match[1],
      resolved: resolveImport(filePath, match[1])
    });
  }

  return matches;
}

function storyKey(filePath) {
  return path.basename(filePath).replace(/\.stories\.(tsx|ts)$/, '').toLowerCase();
}

function sortUnique(values) {
  return [...new Set(values)].sort();
}

function toRel(absPath) {
  if (absPath.startsWith('pkg:')) {
    return absPath.slice(4);
  }

  return normalizePath(path.relative(repoRoot, absPath));
}

function mapStoryImports(files) {
  let out = new Map();
  for (let file of files) {
    out.set(storyKey(file), parseCssImports(file));
  }
  return out;
}

function formatMarkdown(report) {
  let lines = [];
  lines.push('# Storybook Style Source Parity Report');
  lines.push('');
  lines.push(`- React story files: ${report.reactStoryCount}`);
  lines.push(`- Vue story files: ${report.vueStoryCount}`);
  lines.push(`- React CSS imports: ${report.reactCssImportCount}`);
  lines.push(`- Vue global CSS imports: ${report.vueGlobalImportCount}`);
  lines.push(`- Vue story CSS imports: ${report.vueStoryImportCount}`);
  lines.push(`- Missing ports: ${report.missing.length}`);
  lines.push(`- Result: ${report.ok ? 'pass' : 'fail'}`);
  lines.push('');

  lines.push('## Vue Global Style Sources');
  lines.push('');
  for (let cssPath of report.vueGlobalStyleSources) {
    lines.push(`- \`${cssPath}\``);
  }
  lines.push('');

  lines.push('## Missing Style Ports');
  lines.push('');
  if (report.missing.length === 0) {
    lines.push('- none');
  } else {
    for (let row of report.missing) {
      lines.push(`- \`${row.story}\`: \`${row.css}\``);
    }
  }
  lines.push('');

  lines.push('## Coverage by Story');
  lines.push('');
  for (let row of report.coverage) {
    lines.push(`- \`${row.story}\``);
    lines.push(`  - react imports: ${row.reactImports.length}`);
    lines.push(`  - covered by vue: ${row.coveredCount}`);
    lines.push(`  - missing: ${row.missingCount}`);
  }
  lines.push('');

  return lines.join('\n');
}

function writeReport(outputDir, report) {
  fs.mkdirSync(outputDir, {recursive: true});
  fs.writeFileSync(path.join(outputDir, 'style-source-report.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(outputDir, 'style-source-report.md'), formatMarkdown(report));
}

function main() {
  let args = parseArgs(process.argv);
  let reactStories = globSync(args.reactStoriesGlob).sort();
  let vueStories = globSync(args.vueStoriesGlob).sort();

  if (reactStories.length === 0) {
    throw new Error(`No React stories found for glob: ${args.reactStoriesGlob}`);
  }

  if (vueStories.length === 0) {
    throw new Error(`No Vue stories found for glob: ${args.vueStoriesGlob}`);
  }

  let reactStoryImports = mapStoryImports(reactStories);
  let vueStoryImports = mapStoryImports(vueStories);
  let vueGlobalImports = parseCssImports(args.vuePreviewFile);

  let vueGlobalSet = new Set(vueGlobalImports.map((item) => normalizePath(item.resolved)));
  let vueStorySetByKey = new Map();
  for (let [key, imports] of vueStoryImports.entries()) {
    vueStorySetByKey.set(key, new Set(imports.map((item) => normalizePath(item.resolved))));
  }

  let coverage = [];
  let missing = [];
  let reactCssImportCount = 0;
  let vueStoryImportCount = 0;
  for (let imports of vueStoryImports.values()) {
    vueStoryImportCount += imports.length;
  }

  for (let [key, imports] of reactStoryImports.entries()) {
    let vueStorySet = vueStorySetByKey.get(key) || new Set();
    let localMissing = [];
    reactCssImportCount += imports.length;

    for (let item of imports) {
      let normalized = normalizePath(item.resolved);
      let covered = vueGlobalSet.has(normalized) || vueStorySet.has(normalized);
      if (!covered) {
        localMissing.push(normalized);
        missing.push({
          story: key,
          css: toRel(normalized)
        });
      }
    }

    coverage.push({
      story: key,
      reactImports: sortUnique(imports.map((item) => toRel(normalizePath(item.resolved)))),
      coveredCount: imports.length - localMissing.length,
      missingCount: localMissing.length
    });
  }

  coverage.sort((a, b) => a.story.localeCompare(b.story));
  missing.sort((a, b) => {
    let storyCmp = a.story.localeCompare(b.story);
    return storyCmp !== 0 ? storyCmp : a.css.localeCompare(b.css);
  });

  let report = {
    reactStoriesGlob: args.reactStoriesGlob,
    vueStoriesGlob: args.vueStoriesGlob,
    vuePreviewFile: args.vuePreviewFile,
    reactStoryCount: reactStories.length,
    vueStoryCount: vueStories.length,
    reactCssImportCount,
    vueGlobalImportCount: vueGlobalImports.length,
    vueStoryImportCount,
    vueGlobalStyleSources: sortUnique(vueGlobalImports.map((item) => toRel(normalizePath(item.resolved)))),
    missing,
    coverage,
    ok: missing.length === 0
  };

  writeReport(args.outputDir, report);

  console.log(`React stories: ${report.reactStoryCount}`);
  console.log(`Vue stories: ${report.vueStoryCount}`);
  console.log(`React CSS imports: ${report.reactCssImportCount}`);
  console.log(`Vue global CSS imports: ${report.vueGlobalImportCount}`);
  console.log(`Vue story CSS imports: ${report.vueStoryImportCount}`);
  console.log(`Missing style ports: ${report.missing.length}`);
  console.log(`Report: ${path.join(args.outputDir, 'style-source-report.md')}`);

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
