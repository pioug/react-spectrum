#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {chromium} from 'playwright';

function parseArgs(argv) {
  let args = {
    reactUrl: 'http://127.0.0.1:9003',
    vueUrl: 'http://127.0.0.1:6106',
    includeIdRegex: '^react-aria-components-',
    outputDir: 'artifacts/storybook-parity',
    storyIds: '',
    maxStories: 0,
    viewportWidth: 1280,
    viewportHeight: 720,
    deviceScaleFactor: 1,
    failFast: true
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
    } else if (arg === '--story-ids') {
      args.storyIds = argv[++i];
    } else if (arg === '--max-stories') {
      args.maxStories = Number.parseInt(argv[++i], 10);
    } else if (arg === '--viewport-width') {
      args.viewportWidth = Number.parseInt(argv[++i], 10);
    } else if (arg === '--viewport-height') {
      args.viewportHeight = Number.parseInt(argv[++i], 10);
    } else if (arg === '--device-scale-factor') {
      args.deviceScaleFactor = Number.parseFloat(argv[++i]);
    } else if (arg === '--fail-fast') {
      args.failFast = true;
    } else if (arg === '--no-fail-fast') {
      args.failFast = false;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isFinite(args.maxStories) || args.maxStories < 0) {
    throw new Error('--max-stories must be a non-negative number.');
  }
  if (!Number.isFinite(args.viewportWidth) || args.viewportWidth <= 0) {
    throw new Error('--viewport-width must be a positive number.');
  }
  if (!Number.isFinite(args.viewportHeight) || args.viewportHeight <= 0) {
    throw new Error('--viewport-height must be a positive number.');
  }
  if (!Number.isFinite(args.deviceScaleFactor) || args.deviceScaleFactor <= 0) {
    throw new Error('--device-scale-factor must be a positive number.');
  }

  return args;
}

function printHelp() {
  console.log(`
Usage:
  node scripts/storybook-parity-visual.mjs [options]

Options:
  --react-url <url>              React Storybook base URL (default: http://127.0.0.1:9003)
  --vue-url <url>                Vue Storybook base URL (default: http://127.0.0.1:6106)
  --include-id-regex <regex>     Story id regex filter (default: ^react-aria-components-)
  --story-ids <csv>              Explicit story ids to run (default: all matching ids)
  --max-stories <n>              Limit run to first n stories (default: 0 = all)
  --viewport-width <px>          Viewport width (default: 1280)
  --viewport-height <px>         Viewport height (default: 720)
  --device-scale-factor <n>      Browser device scale factor (default: 1)
  --output-dir <dir>             Output directory (default: artifacts/storybook-parity)
  --fail-fast                    Stop on first non-zero diff (default: true)
  --no-fail-fast                 Continue through all stories
  --help, -h                     Show help
`.trim());
}

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
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

function applyRegex(ids, includeIdRegex) {
  if (!includeIdRegex) {
    return ids;
  }

  let regex = new RegExp(includeIdRegex);
  return ids.filter((id) => regex.test(id));
}

function parseStoryIds(storyIdsCsv) {
  if (!storyIdsCsv) {
    return [];
  }

  return storyIdsCsv
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function diffIds(reactIds, vueIds) {
  let vueSet = new Set(vueIds);
  let reactSet = new Set(reactIds);

  return {
    missingInVue: reactIds.filter((id) => !vueSet.has(id)),
    extraInVue: vueIds.filter((id) => !reactSet.has(id))
  };
}

function filterExplicitIds(reactIds, explicitIds) {
  if (explicitIds.length === 0) {
    return reactIds;
  }

  let explicitSet = new Set(explicitIds);
  return reactIds.filter((id) => explicitSet.has(id));
}

function toStoryUrl(baseUrl, storyId) {
  return `${ensureTrailingSlash(baseUrl)}iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`;
}

function toSafeFileName(storyId) {
  return storyId.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function ensureOutputDirectories(outputDir) {
  let directories = {
    root: outputDir,
    react: path.join(outputDir, 'react'),
    vue: path.join(outputDir, 'vue'),
    diff: path.join(outputDir, 'diff'),
    sideBySide: path.join(outputDir, 'side-by-side')
  };

  for (let directory of Object.values(directories)) {
    fs.mkdirSync(directory, {recursive: true});
  }

  return directories;
}

async function waitForStoryReady(page) {
  let root = page.locator('#storybook-root, #root').first();
  await root.waitFor({state: 'attached', timeout: 20000});

  await page.evaluate(async () => {
    let settle = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    if (document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {
        // ignore font readiness failures and continue with current render state
      }
    }

    await settle();
    await settle();
  });
}

async function captureRootOrPage(page, outputPath) {
  let root = page.locator('#storybook-root, #root').first();
  let rootIsVisible = await root.isVisible().catch(() => false);
  if (rootIsVisible) {
    await root.screenshot({path: outputPath});
    return {target: 'root'};
  }

  await page.screenshot({path: outputPath, fullPage: true});
  return {target: 'page'};
}

async function captureStory(page, storyUrl, outputPath) {
  await page.goto(storyUrl, {waitUntil: 'networkidle'});

  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
    `
  }).catch(() => {
    // ignore style injection issues in strict iframe contexts
  });

  await waitForStoryReady(page).catch(() => {
    // continue with fallback screenshot capture if the story root never becomes visible
  });

  return captureRootOrPage(page, outputPath);
}

async function readRawImage(imagePath) {
  let {data, info} = await sharp(imagePath)
    .ensureAlpha()
    .raw()
    .toBuffer({resolveWithObject: true});

  return {
    data,
    width: info.width,
    height: info.height
  };
}

function pixelIndex(width, x, y) {
  return ((y * width) + x) * 4;
}

function compareImages(reactImage, vueImage) {
  let width = Math.max(reactImage.width, vueImage.width);
  let height = Math.max(reactImage.height, vueImage.height);
  let totalPixels = width * height;
  let diffData = Buffer.alloc(totalPixels * 4);

  if (
    reactImage.width === vueImage.width
    && reactImage.height === vueImage.height
    && reactImage.data.equals(vueImage.data)
  ) {
    return {
      changedPixels: 0,
      totalPixels,
      width,
      height,
      diffData
    };
  }

  let changedPixels = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let diffOffset = pixelIndex(width, x, y);
      let reactInBounds = x < reactImage.width && y < reactImage.height;
      let vueInBounds = x < vueImage.width && y < vueImage.height;

      let reactR = 0;
      let reactG = 0;
      let reactB = 0;
      let reactA = 0;
      if (reactInBounds) {
        let reactOffset = pixelIndex(reactImage.width, x, y);
        reactR = reactImage.data[reactOffset];
        reactG = reactImage.data[reactOffset + 1];
        reactB = reactImage.data[reactOffset + 2];
        reactA = reactImage.data[reactOffset + 3];
      }

      let vueR = 0;
      let vueG = 0;
      let vueB = 0;
      let vueA = 0;
      if (vueInBounds) {
        let vueOffset = pixelIndex(vueImage.width, x, y);
        vueR = vueImage.data[vueOffset];
        vueG = vueImage.data[vueOffset + 1];
        vueB = vueImage.data[vueOffset + 2];
        vueA = vueImage.data[vueOffset + 3];
      }

      let isDifferent = reactR !== vueR || reactG !== vueG || reactB !== vueB || reactA !== vueA;
      if (isDifferent) {
        changedPixels++;
        diffData[diffOffset] = 255;
        diffData[diffOffset + 1] = 0;
        diffData[diffOffset + 2] = 0;
        diffData[diffOffset + 3] = 255;
      }
    }
  }

  return {
    changedPixels,
    totalPixels,
    width,
    height,
    diffData
  };
}

async function writeRawPng(rawData, width, height, outputPath) {
  await sharp(rawData, {
    raw: {
      width,
      height,
      channels: 4
    }
  }).png().toFile(outputPath);
}

async function writeSideBySide(reactImagePath, vueImagePath, outputPath) {
  let reactMeta = await sharp(reactImagePath).metadata();
  let vueMeta = await sharp(vueImagePath).metadata();
  let reactWidth = reactMeta.width ?? 0;
  let reactHeight = reactMeta.height ?? 0;
  let vueWidth = vueMeta.width ?? 0;
  let vueHeight = vueMeta.height ?? 0;

  let separatorWidth = 8;
  let combinedWidth = reactWidth + separatorWidth + vueWidth;
  let combinedHeight = Math.max(reactHeight, vueHeight);

  await sharp({
    create: {
      width: combinedWidth,
      height: combinedHeight,
      channels: 4,
      background: {r: 255, g: 255, b: 255, alpha: 1}
    }
  })
    .composite([
      {input: reactImagePath, top: 0, left: 0},
      {
        input: {
          create: {
            width: separatorWidth,
            height: combinedHeight,
            channels: 4,
            background: {r: 230, g: 230, b: 230, alpha: 1}
          }
        },
        top: 0,
        left: reactWidth
      },
      {input: vueImagePath, top: 0, left: reactWidth + separatorWidth}
    ])
    .png()
    .toFile(outputPath);
}

function relativePath(root, target) {
  return path.relative(root, target).split(path.sep).join('/');
}

function formatMarkdown(report) {
  let lines = [];
  lines.push('# Storybook Visual Parity Report');
  lines.push('');
  lines.push('## Mapping');
  lines.push('');
  lines.push(`- Mapping mode: ${report.mapping.mode}`);
  lines.push(`- Deterministic mapping: ${report.mapping.deterministic ? 'yes' : 'no'}`);
  lines.push('');
  lines.push('## Inputs');
  lines.push('');
  lines.push(`- React catalog: ${report.react.catalogUrl}`);
  lines.push(`- Vue catalog: ${report.vue.catalogUrl}`);
  lines.push(`- Include regex: ${report.includeIdRegex || '(none)'}`);
  lines.push(`- Explicit story ids: ${report.explicitStoryIds.length === 0 ? '(none)' : report.explicitStoryIds.join(', ')}`);
  lines.push(`- Viewport: ${report.options.viewportWidth}x${report.options.viewportHeight} @ ${report.options.deviceScaleFactor}x`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- React story ids: ${report.react.storyCount}`);
  lines.push(`- Vue story ids: ${report.vue.storyCount}`);
  lines.push(`- Stories compared: ${report.summary.total}`);
  lines.push(`- Passed: ${report.summary.passed}`);
  lines.push(`- Failed: ${report.summary.failed}`);
  lines.push(`- Changed pixels (sum): ${report.summary.changedPixels}`);
  lines.push(`- Result: ${report.ok ? 'pass' : 'fail'}`);
  lines.push('');
  lines.push('## Catalog Differences');
  lines.push('');
  lines.push(`- Missing in Vue: ${report.diff.missingInVue.length}`);
  lines.push(`- Extra in Vue: ${report.diff.extraInVue.length}`);
  lines.push('');

  if (report.diff.missingInVue.length > 0) {
    lines.push('### Missing In Vue');
    lines.push('');
    for (let id of report.diff.missingInVue) {
      lines.push(`- \`${id}\``);
    }
    lines.push('');
  }

  if (report.diff.extraInVue.length > 0) {
    lines.push('### Extra In Vue');
    lines.push('');
    for (let id of report.diff.extraInVue) {
      lines.push(`- \`${id}\``);
    }
    lines.push('');
  }

  lines.push('## Story Results');
  lines.push('');
  if (report.stories.length === 0) {
    lines.push('- none');
  } else {
    for (let story of report.stories) {
      let changedSummary = story.changedPixels == null ? 'capture-error' : `changedPixels=${story.changedPixels}`;
      lines.push(`- ${story.ok ? 'PASS' : 'FAIL'} \`${story.id}\` ${changedSummary}`);
      if (!story.ok) {
        if (story.error) {
          lines.push(`  - Error: ${story.error}`);
        }
        lines.push(`  - React: \`${story.reactImage}\``);
        lines.push(`  - Vue: \`${story.vueImage}\``);
        lines.push(`  - Side by side: \`${story.sideBySideImage}\``);
        lines.push(`  - Diff: \`${story.diffImage}\``);
      }
    }
  }
  lines.push('');

  return lines.join('\n');
}

async function writeReport(report, outputDir) {
  fs.mkdirSync(outputDir, {recursive: true});
  fs.writeFileSync(path.join(outputDir, 'report.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(outputDir, 'report.md'), formatMarkdown(report));
}

async function main() {
  let args = parseArgs(process.argv);
  let explicitStoryIds = parseStoryIds(args.storyIds);

  let [reactCatalog, vueCatalog] = await Promise.all([
    fetchIndex(args.reactUrl),
    fetchIndex(args.vueUrl)
  ]);

  let reactStoryIds = applyRegex(extractStoryIds(reactCatalog.json), args.includeIdRegex);
  let vueStoryIds = applyRegex(extractStoryIds(vueCatalog.json), args.includeIdRegex);
  let diff = diffIds(reactStoryIds, vueStoryIds);
  let idCatalogMatches = diff.missingInVue.length === 0 && diff.extraInVue.length === 0;

  let report = {
    generatedAt: new Date().toISOString(),
    includeIdRegex: args.includeIdRegex,
    explicitStoryIds,
    mapping: {
      mode: 'identity',
      deterministic: true
    },
    options: {
      maxStories: args.maxStories,
      failFast: args.failFast,
      viewportWidth: args.viewportWidth,
      viewportHeight: args.viewportHeight,
      deviceScaleFactor: args.deviceScaleFactor
    },
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
    diff,
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      changedPixels: 0
    },
    stories: [],
    ok: false
  };

  if (!idCatalogMatches) {
    await writeReport(report, args.outputDir);
    console.error('Story id parity failed: React and Vue catalogs differ.');
    console.error(`Missing in Vue: ${diff.missingInVue.length}`);
    console.error(`Extra in Vue: ${diff.extraInVue.length}`);
    console.error(`Report: ${path.join(args.outputDir, 'report.md')}`);
    process.exit(1);
  }

  let filteredStoryIds = filterExplicitIds(reactStoryIds, explicitStoryIds);
  if (args.maxStories > 0) {
    filteredStoryIds = filteredStoryIds.slice(0, args.maxStories);
  }

  let directories = ensureOutputDirectories(args.outputDir);

  let browser = await chromium.launch();
  let context = await browser.newContext({
    viewport: {
      width: args.viewportWidth,
      height: args.viewportHeight
    },
    deviceScaleFactor: args.deviceScaleFactor
  });
  let reactPage = await context.newPage();
  let vuePage = await context.newPage();

  try {
    for (let index = 0; index < filteredStoryIds.length; index++) {
      let id = filteredStoryIds[index];
      let fileName = `${toSafeFileName(id)}.png`;
      let reactImagePath = path.join(directories.react, fileName);
      let vueImagePath = path.join(directories.vue, fileName);
      let diffImagePath = path.join(directories.diff, fileName);
      let sideBySideImagePath = path.join(directories.sideBySide, fileName);
      let reactStoryUrl = toStoryUrl(args.reactUrl, id);
      let vueStoryUrl = toStoryUrl(args.vueUrl, id);

      process.stdout.write(`[${index + 1}/${filteredStoryIds.length}] ${id}\n`);

      let reactCaptureTarget = 'none';
      let vueCaptureTarget = 'none';

      try {
        let reactCapture = await captureStory(reactPage, reactStoryUrl, reactImagePath);
        let vueCapture = await captureStory(vuePage, vueStoryUrl, vueImagePath);
        reactCaptureTarget = reactCapture.target;
        vueCaptureTarget = vueCapture.target;

        await writeSideBySide(reactImagePath, vueImagePath, sideBySideImagePath);

        let reactImage = await readRawImage(reactImagePath);
        let vueImage = await readRawImage(vueImagePath);
        let comparison = compareImages(reactImage, vueImage);

        await writeRawPng(comparison.diffData, comparison.width, comparison.height, diffImagePath);

        let storyResult = {
          id,
          reactUrl: reactStoryUrl,
          vueUrl: vueStoryUrl,
          reactImage: relativePath(args.outputDir, reactImagePath),
          vueImage: relativePath(args.outputDir, vueImagePath),
          sideBySideImage: relativePath(args.outputDir, sideBySideImagePath),
          diffImage: relativePath(args.outputDir, diffImagePath),
          changedPixels: comparison.changedPixels,
          totalPixels: comparison.totalPixels,
          changedRatio: comparison.totalPixels === 0 ? 0 : comparison.changedPixels / comparison.totalPixels,
          capture: {
            react: reactCaptureTarget,
            vue: vueCaptureTarget
          },
          dimensions: {
            react: {
              width: reactImage.width,
              height: reactImage.height
            },
            vue: {
              width: vueImage.width,
              height: vueImage.height
            },
            compared: {
              width: comparison.width,
              height: comparison.height
            }
          },
          ok: comparison.changedPixels === 0
        };

        report.stories.push(storyResult);
        report.summary.total++;
        report.summary.changedPixels += comparison.changedPixels;
        if (storyResult.ok) {
          report.summary.passed++;
        } else {
          report.summary.failed++;
          process.stdout.write(`  -> fail changedPixels=${comparison.changedPixels}\n`);
          if (args.failFast) {
            break;
          }
        }
      } catch (error) {
        let message = error instanceof Error ? error.message : String(error);
        let storyResult = {
          id,
          reactUrl: reactStoryUrl,
          vueUrl: vueStoryUrl,
          reactImage: relativePath(args.outputDir, reactImagePath),
          vueImage: relativePath(args.outputDir, vueImagePath),
          sideBySideImage: relativePath(args.outputDir, sideBySideImagePath),
          diffImage: relativePath(args.outputDir, diffImagePath),
          changedPixels: null,
          totalPixels: null,
          changedRatio: null,
          capture: {
            react: reactCaptureTarget,
            vue: vueCaptureTarget
          },
          dimensions: null,
          error: message,
          ok: false
        };

        report.stories.push(storyResult);
        report.summary.total++;
        report.summary.failed++;
        process.stdout.write(`  -> error ${message}\n`);
        if (args.failFast) {
          break;
        }
      }
    }
  } finally {
    await context.close();
    await browser.close();
  }

  report.ok = report.diff.missingInVue.length === 0 && report.diff.extraInVue.length === 0 && report.summary.failed === 0;
  await writeReport(report, args.outputDir);

  console.log(`React story ids: ${report.react.storyCount}`);
  console.log(`Vue story ids: ${report.vue.storyCount}`);
  console.log(`Stories compared: ${report.summary.total}`);
  console.log(`Failed visual diffs: ${report.summary.failed}`);
  console.log(`Changed pixels (sum): ${report.summary.changedPixels}`);
  console.log(`Report: ${path.join(args.outputDir, 'report.md')}`);

  if (!report.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
