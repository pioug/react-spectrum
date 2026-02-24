#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DEBUG = process.env.STORYBOOK_PARITY_DEBUG === '1';
const CDP_SESSION_TIMEOUT_MS = 10000;
const CDP_SCREENSHOT_TIMEOUT_MS = 90000;
const webFontsSettledOrigins = new Set();
const deterministicMocksInstalledPages = new WeakSet();
const STORY_MAX_CHANGED_PIXELS = new Map([
  ['react-aria-components-autocomplete--autocomplete-with-async-list-box', 30],
  ['react-aria-components-tree--tree-section-dynamic', 2]
]);

const SWAPI_FIXTURE_RESULTS = [
  {name: 'Luke Skywalker'},
  {name: 'C-3PO'},
  {name: 'R2-D2'},
  {name: 'Darth Vader'},
  {name: 'Leia Organa'},
  {name: 'Owen Lars'},
  {name: 'Beru Whitesun lars'},
  {name: 'R5-D4'}
];

function toSolidSvgDataUri(fill) {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640"><rect width="100%" height="100%" fill="${fill}" /></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const UNSPLASH_FIXTURE_ITEMS = [
  {id: 'fixture-1', user: {name: 'Jeremy Goodmaker'}, urls: {regular: toSolidSvgDataUri('#11152f')}, description: 'Night sky', alt_description: 'Night sky', width: 960, height: 640},
  {id: 'fixture-2', user: {name: 'Bennie Bates'}, urls: {regular: toSolidSvgDataUri('#21351d')}, description: 'Green leaves', alt_description: 'Green leaves', width: 960, height: 640},
  {id: 'fixture-3', user: {name: 'Antoine LE'}, urls: {regular: toSolidSvgDataUri('#2f4d1f')}, description: 'Garden flowers', alt_description: 'Garden flowers', width: 960, height: 640},
  {id: 'fixture-4', user: {name: 'Ari Snow'}, urls: {regular: toSolidSvgDataUri('#6f8fe8')}, description: 'Snow field', alt_description: 'Snow field', width: 960, height: 640},
  {id: 'fixture-5', user: {name: 'Mira Ice'}, urls: {regular: toSolidSvgDataUri('#a8b4df')}, description: 'Cold horizon', alt_description: 'Cold horizon', width: 960, height: 640},
  {id: 'fixture-6', user: {name: 'Noah Moon'}, urls: {regular: toSolidSvgDataUri('#182349')}, description: 'Moonlight', alt_description: 'Moonlight', width: 960, height: 640},
  {id: 'fixture-7', user: {name: 'Kai Forest'}, urls: {regular: toSolidSvgDataUri('#2a5e43')}, description: 'Forest', alt_description: 'Forest', width: 960, height: 640},
  {id: 'fixture-8', user: {name: 'Lia Peak'}, urls: {regular: toSolidSvgDataUri('#375b8a')}, description: 'Mountain', alt_description: 'Mountain', width: 960, height: 640},
  {id: 'fixture-9', user: {name: 'Ian River'}, urls: {regular: toSolidSvgDataUri('#264a68')}, description: 'River', alt_description: 'River', width: 960, height: 640}
];

// Some Storybook Vue stories keep `document.fonts.ready` pending indefinitely.
// Playwright screenshot waits on fonts by default, which can hang captures.
if (process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY == null) {
  process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = '1';
}

function logDebug(message) {
  if (DEBUG) {
    process.stdout.write(`[debug] ${message}\n`);
  }
}

function withTimeout(promise, timeoutMs, label) {
  let timer = null;
  let wrappedPromise = Promise.resolve(promise);

  // Avoid unhandled rejection noise if this promise settles after timeout.
  wrappedPromise.catch(() => {
    // no-op
  });

  let timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label} (timeout ${timeoutMs}ms)`));
    }, timeoutMs);
  });

  return Promise.race([wrappedPromise, timeoutPromise]).finally(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });
}

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

function getMaxChangedPixels(storyId) {
  return STORY_MAX_CHANGED_PIXELS.get(storyId) ?? 0;
}

function buildJsonHeaders() {
  return {
    'access-control-allow-origin': '*',
    'cache-control': 'no-store',
    'content-type': 'application/json; charset=utf-8'
  };
}

function toSwapiFixtureResponse(urlString) {
  let searchText = '';
  try {
    let parsed = new URL(urlString);
    searchText = (parsed.searchParams.get('search') ?? '').trim().toLowerCase();
  } catch {
    // ignore malformed URL and return unfiltered fixture payload
  }

  let results = SWAPI_FIXTURE_RESULTS;
  if (searchText) {
    results = SWAPI_FIXTURE_RESULTS.filter((item) => item.name.toLowerCase().includes(searchText));
  }

  return {
    count: results.length,
    next: null,
    previous: null,
    results
  };
}

function toUnsplashFixtureResponse(urlString) {
  let page = 1;
  try {
    let parsed = new URL(urlString);
    page = Number.parseInt(parsed.searchParams.get('page') ?? '1', 10);
  } catch {
    // ignore malformed URL and use first page fixture
  }

  if (!Number.isFinite(page) || page <= 1) {
    return UNSPLASH_FIXTURE_ITEMS;
  }

  return [];
}

async function setupDeterministicNetworkMocks(page) {
  if (deterministicMocksInstalledPages.has(page)) {
    return;
  }

  deterministicMocksInstalledPages.add(page);

  await page.route(/https?:\/\/swapi\.py4e\.com\/api\/people\/?.*/i, async (route) => {
    let payload = toSwapiFixtureResponse(route.request().url());
    await route.fulfill({
      status: 200,
      headers: buildJsonHeaders(),
      body: JSON.stringify(payload)
    });
  });

  await page.route(/https?:\/\/api\.unsplash\.com\/topics\/nature\/photos\?.*/i, async (route) => {
    let payload = toUnsplashFixtureResponse(route.request().url());
    await route.fulfill({
      status: 200,
      headers: buildJsonHeaders(),
      body: JSON.stringify(payload)
    });
  });
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
  let storyUrl = `${ensureTrailingSlash(baseUrl)}iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`;

  // Keep this story in deterministic loading state so React/Vue capture the same frame.
  if (isAutocompleteWithAsyncListBoxStory(storyId)) {
    storyUrl += '&args=delay:5000';
  }

  return storyUrl;
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
  await page.waitForFunction(() => {
    let isVisible = (element) => {
      if (!(element instanceof Element)) {
        return false;
      }

      let style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return false;
      }

      let rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    let storybookRoot = document.querySelector('#storybook-root');
    let fallbackRoot = document.querySelector('#root');
    let root = storybookRoot instanceof HTMLElement
      ? storybookRoot
      : (fallbackRoot instanceof HTMLElement ? fallbackRoot : null);
    if (!(root instanceof HTMLElement)) {
      return false;
    }

    let rect = root.getBoundingClientRect();
    let style = window.getComputedStyle(root);
    return (
      rect.width > 0
      && rect.height > 0
      && style.display !== 'none'
      && style.visibility !== 'hidden'
    );
  }, {timeout: 60000});

  await page.waitForFunction(() => {
    let isVisible = (element) => {
      if (!(element instanceof Element)) {
        return false;
      }

      let style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return false;
      }

      let rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    let body = document.body;
    if (!(body instanceof HTMLElement)) {
      return false;
    }

    let storybookRoot = document.querySelector('#storybook-root');
    let fallbackRoot = document.querySelector('#root');
    let root = storybookRoot instanceof HTMLElement
      ? storybookRoot
      : (fallbackRoot instanceof HTMLElement ? fallbackRoot : null);
    if (!(root instanceof HTMLElement)) {
      return false;
    }

    let preparingVisible = body.classList.contains('sb-show-preparing-story')
      || Array.from(document.querySelectorAll('.sb-preparing-story'))
        .some((element) => isVisible(element));
    if (!preparingVisible) {
      return true;
    }

    // Some Vite/Vue stories keep "preparing" markers set after mount.
    // Continue once real story content is visibly rendered.
    let hasStoryContent = root.querySelector(
      '[role],button,input,select,textarea,img,svg,canvas,[data-vac],.react-aria-GridListItem,.react-aria-ListBoxItem'
    ) != null;
    if (hasStoryContent) {
      return true;
    }

    return Array.from(root.children).some((element) => isVisible(element));
  }, {timeout: 8000}).catch(() => {
    // continue with current render state if Storybook shell markers never settle
  });

  await page.evaluate(async () => {
    let settle = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    await settle();
    await settle();
  });
  // Give Storybook render effects and stylesheet application one extra beat.
  await page.waitForTimeout(500);
}

function isAsyncGridListStory(storyId) {
  return storyId.includes('gridlist--async-grid-list');
}

function isVirtualizedGridListGridStory(storyId) {
  return storyId.includes('gridlist--virtualized-grid-list-grid');
}

function isAutocompleteAsyncLoadingStory(storyId) {
  return storyId.includes('autocomplete--autocomplete-async-loading-example');
}

function isAutocompleteWithAsyncListBoxStory(storyId) {
  return storyId.includes('autocomplete--autocomplete-with-async-list-box');
}

async function waitForWebFontsClassSettledOncePerOrigin(page, storyUrl, timeoutMs = 5000) {
  let origin;
  try {
    origin = new URL(storyUrl).origin;
  } catch {
    return;
  }

  if (!origin || webFontsSettledOrigins.has(origin)) {
    return;
  }

  await page.evaluate(async (maxWaitMs) => {
    let html = document.documentElement;
    if (!(html instanceof HTMLElement)) {
      return;
    }

    let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let settle = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    let endTime = performance.now() + maxWaitMs;
    while (performance.now() < endTime) {
      let hasTypekitClass = html.classList.contains('wf-loading')
        || html.classList.contains('wf-active')
        || html.classList.contains('wf-inactive');

      if (!hasTypekitClass) {
        break;
      }

      if (html.classList.contains('wf-active') || html.classList.contains('wf-inactive')) {
        break;
      }

      if (!html.classList.contains('wf-loading')) {
        break;
      }

      await delay(50);
    }

    await settle();
    await settle();
  }, timeoutMs).catch(() => {
    // continue even if typekit class probing is unavailable in this frame
  });

  webFontsSettledOrigins.add(origin);
}

async function waitForAsyncGridListSettled(page, storyId) {
  if (!isAsyncGridListStory(storyId)) {
    return;
  }

  await page.evaluate(async () => {
    let root = document.querySelector('#storybook-root') || document.querySelector('#root');
    if (!(root instanceof HTMLElement)) {
      return;
    }

    let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let settle = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    let isVisible = (element) => {
      if (!(element instanceof Element)) {
        return false;
      }

      let style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return false;
      }

      let rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };
    let hasVisibleLoadingIndicator = () => {
      let loadingSelectors = [
        '[aria-label="loading"]',
        '.react-aria-GridListLoadingIndicator',
        '[class*="LoadingIndicator"]'
      ];

      return loadingSelectors.some((selector) => (
        Array.from(root.querySelectorAll(selector)).some((element) => isVisible(element))
      ));
    };
    let hasRenderableContent = () => {
      let hasItems = root.querySelector('[role="row"], [role="option"], .react-aria-GridListItem') != null;
      let hasNoResults = root.textContent?.includes('No results');
      return hasItems || hasNoResults;
    };
    let hasLoadedVisibleImages = () => {
      let visibleImages = Array.from(root.querySelectorAll('img'))
        .filter((image) => isVisible(image));
      if (visibleImages.length === 0) {
        return true;
      }

      return visibleImages.every((image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0);
    };

    let endTime = performance.now() + 20000;
    while (performance.now() < endTime) {
      if (!hasVisibleLoadingIndicator() && hasRenderableContent() && hasLoadedVisibleImages()) {
        break;
      }
      await delay(60);
    }

    await settle();
    await settle();
  });
}

async function waitForAutocompleteAsyncSettled(page, storyId) {
  if (!isAutocompleteAsyncLoadingStory(storyId)) {
    return;
  }

  await page.evaluate(async () => {
    let root = document.querySelector('#storybook-root') || document.querySelector('#root');
    if (!(root instanceof HTMLElement)) {
      return;
    }

    let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let settle = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    let endTime = performance.now() + 10000;
    while (performance.now() < endTime) {
      let optionCount = root.querySelectorAll('[role="option"], .react-aria-ListBoxItem').length;
      let hasLoadingText = Array.from(root.querySelectorAll('[role="option"], .react-aria-ListBoxItem'))
        .some((element) => element.textContent?.trim() === 'Loading');

      if (optionCount > 0 && !hasLoadingText) {
        break;
      }

      await delay(60);
    }

    await settle();
    await settle();
  });
}

async function freezeSvgAnimations(page, storyId) {
  let forceStaticProgressbar = isAutocompleteWithAsyncListBoxStory(storyId);

  await page.evaluate((shouldForceStaticProgressbar) => {
    for (let svg of document.querySelectorAll('svg')) {
      if (!(svg instanceof SVGSVGElement) || typeof svg.pauseAnimations !== 'function') {
        continue;
      }

      try {
        svg.pauseAnimations();
        if (typeof svg.setCurrentTime === 'function') {
          svg.setCurrentTime(0);
        }
      } catch {
        // continue even if a specific SVG animation cannot be paused
      }
    }

    if (shouldForceStaticProgressbar) {
      let progressbar = document.querySelector('[role="progressbar"]');
      if (progressbar instanceof Element) {
        // Remove SMIL animation nodes and transient transforms so the spinner
        // renders at a deterministic frame in both Storybooks.
        for (let animatedNode of progressbar.querySelectorAll('animate, animateTransform')) {
          animatedNode.remove();
        }
        for (let transformedNode of progressbar.querySelectorAll('[transform]')) {
          if (transformedNode instanceof SVGElement) {
            transformedNode.removeAttribute('transform');
          }
        }
      }
    }
  }, forceStaticProgressbar).catch(() => {
    // continue if animation stabilization is unavailable in this document context
  });
}

async function waitForProgressbarSvgReady(page, storyId) {
  if (!isAutocompleteWithAsyncListBoxStory(storyId)) {
    return;
  }

  await page.waitForFunction(() => {
    return Boolean(document.querySelector('[role="progressbar"] svg animateTransform'));
  }, {timeout: 4000}).catch(() => {
    // continue even if the progress indicator is not present in this frame
  });
}

async function waitForFontsSettled(page, timeoutMs = 3000) {
  await page.evaluate(async (maxWaitMs) => {
    if (!('fonts' in document) || !document.fonts) {
      return;
    }

    let readyPromise = document.fonts.status === 'loaded'
      ? Promise.resolve()
      : Promise.resolve(document.fonts.ready).catch(() => {});
    let timeoutPromise = new Promise((resolve) => setTimeout(resolve, maxWaitMs));
    await Promise.race([readyPromise, timeoutPromise]);

    // Allow paint to settle after late font swaps.
    let settle = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await settle();
  }, timeoutMs).catch(() => {
    // continue if document font readiness APIs are unavailable in this context
  });
}

async function waitForLayoutStability(page, timeoutMs = 3500) {
  await page.evaluate(async (maxWaitMs) => {
    let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let settle = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    let getRectSignature = () => {
      let root = document.querySelector('#storybook-root') || document.querySelector('#root');
      if (!(root instanceof HTMLElement)) {
        return '';
      }

      let storyRoot = root.querySelector('.react-spectrum-story');
      let target = storyRoot?.querySelector(':scope > div > div')
        || storyRoot?.querySelector(':scope > div')
        || root.querySelector('[data-rac]')
        || root.querySelector('[role]');
      if (!(target instanceof Element)) {
        return '';
      }

      let rect = target.getBoundingClientRect();
      let style = window.getComputedStyle(target);
      let textProbe = root.querySelector('.react-aria-Label, .react-aria-Text, [role="menuitemcheckbox"], [role="option"], [role="columnheader"]');
      let textProbeRect = textProbe instanceof Element ? textProbe.getBoundingClientRect() : null;

      return [
        Math.round(rect.x * 1000),
        Math.round(rect.y * 1000),
        Math.round(rect.width * 1000),
        Math.round(rect.height * 1000),
        style.fontFamily,
        style.fontSize,
        textProbeRect ? Math.round(textProbeRect.width * 1000) : -1
      ].join('|');
    };

    let previousSignature = getRectSignature();
    let stableSamples = 0;
    let endTime = performance.now() + maxWaitMs;

    while (performance.now() < endTime) {
      await delay(120);
      await settle();
      let nextSignature = getRectSignature();
      if (nextSignature && nextSignature === previousSignature) {
        stableSamples++;
        if (stableSamples >= 4) {
          break;
        }
      } else {
        previousSignature = nextSignature;
        stableSamples = 0;
      }
    }

    await settle();
  }, timeoutMs).catch(() => {
    // continue with capture if layout stability probing is unavailable
  });
}

async function captureWithCdp(page, outputPath, clip = null) {
  let cdp = null;

  try {
    logDebug(`capture:cdp:session:start url=${page.url()} path=${outputPath}`);
    cdp = await withTimeout(
      page.context().newCDPSession(page),
      CDP_SESSION_TIMEOUT_MS,
      `CDP session init failed for ${outputPath}`
    );
    logDebug(`capture:cdp:session:done url=${page.url()} path=${outputPath}`);

    let effectiveClip = clip;
    if (!effectiveClip) {
      let viewport = page.viewportSize();
      if (viewport && viewport.width > 0 && viewport.height > 0) {
        effectiveClip = {x: 0, y: 0, width: viewport.width, height: viewport.height};
      } else {
        effectiveClip = await page.evaluate(() => ({
          x: 0,
          y: 0,
          width: Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1),
          height: Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1)
        }));
      }
    }

    let options = {
      format: 'png',
      fromSurface: true
    };

    if (effectiveClip) {
      options.clip = {
        x: effectiveClip.x,
        y: effectiveClip.y,
        width: effectiveClip.width,
        height: effectiveClip.height,
        scale: 1
      };
      options.captureBeyondViewport = true;
    }

    logDebug(`capture:cdp:screenshot:start url=${page.url()} path=${outputPath} timeout=${CDP_SCREENSHOT_TIMEOUT_MS}`);
    let screenshot = await withTimeout(
      cdp.send('Page.captureScreenshot', options),
      CDP_SCREENSHOT_TIMEOUT_MS,
      `CDP screenshot failed for ${outputPath}`
    );
    logDebug(`capture:cdp:screenshot:done url=${page.url()} path=${outputPath}`);

    fs.writeFileSync(outputPath, Buffer.from(screenshot.data, 'base64'));
  } finally {
    if (cdp) {
      void cdp.detach().catch(() => {
        // ignore session detach failures
      });
    }
  }
}

async function captureRootOrPage(page, outputPath) {
  try {
    await withTimeout(
      page.screenshot({
        path: outputPath,
        animations: 'disabled',
        caret: 'hide',
        scale: 'css'
      }),
      30000,
      `Playwright screenshot failed for ${outputPath}`
    );
    return {target: 'page'};
  } catch (error) {
    logDebug(`capture:playwright:fallback-to-cdp url=${page.url()} path=${outputPath} reason=${String(error)}`);
    await withTimeout(
      captureWithCdp(page, outputPath),
      CDP_SESSION_TIMEOUT_MS + CDP_SCREENSHOT_TIMEOUT_MS + 15000,
      `CDP capture fallback timed out for ${outputPath}`
    );
    return {target: 'page-cdp-fallback'};
  }
}

async function captureStory(page, storyId, storyUrl, outputPath) {
  logDebug(`capture:start url=${storyUrl}`);
  await withTimeout(
    setupDeterministicNetworkMocks(page),
    5000,
    `Request mocking setup failed for ${storyId}`
  ).catch(() => {
    // continue with live requests if route setup fails
  });

  // Storybook dev servers keep background requests and websockets alive.
  // Waiting for "networkidle" can hang indefinitely, so wait for DOM readiness
  // and rely on waitForStoryReady below for deterministic render stabilization.
  await page.goto(storyUrl, {waitUntil: 'domcontentloaded'});
  logDebug(`capture:goto:done url=${storyUrl}`);

  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: geometricPrecision !important;
      }
    `
  }).catch(() => {
    // ignore style injection issues in strict iframe contexts
  });
  logDebug(`capture:style-tag:done url=${storyUrl}`);
  await withTimeout(
    waitForWebFontsClassSettledOncePerOrigin(page, storyUrl),
    7000,
    `Typekit class settle wait failed for ${storyId}`
  ).catch(() => {
    // continue with story capture if webfont class probing times out
  });

  if (isVirtualizedGridListGridStory(storyId)) {
    // This story can remain in Storybook's "preparing" shell state even after
    // visible content is rendered; use a deterministic settle delay instead.
    await page.waitForTimeout(2000);
    await page.evaluate(async () => {
      let settle = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await settle();
      await settle();
    });
  } else {
    await withTimeout(
      waitForStoryReady(page),
      70000,
      `Story readiness wait failed for ${storyId}`
    ).catch(() => {
      // continue with fallback screenshot capture if the story root never becomes visible
    });
  }
  logDebug(`capture:ready:done url=${storyUrl}`);
  await withTimeout(
    waitForAsyncGridListSettled(page, storyId),
    25000,
    `Async grid list settle wait failed for ${storyId}`
  ).catch(() => {
    // continue with fallback screenshot capture if async data never settles
  });
  await withTimeout(
    waitForAutocompleteAsyncSettled(page, storyId),
    12000,
    `Autocomplete async settle wait failed for ${storyId}`
  ).catch(() => {
    // continue with fallback screenshot capture if async data never settles
  });
  await withTimeout(
    waitForProgressbarSvgReady(page, storyId),
    6000,
    `Progressbar SVG settle wait failed for ${storyId}`
  ).catch(() => {
    // continue with capture if loading indicator animation setup is delayed
  });
  await withTimeout(
    waitForFontsSettled(page),
    4000,
    `Font settle wait failed for ${storyId}`
  ).catch(() => {
    // continue with capture if fonts remain in transient loading state
  });
  await withTimeout(
    waitForLayoutStability(page),
    5000,
    `Layout stability wait failed for ${storyId}`
  ).catch(() => {
    // continue with capture if layout stability probing times out
  });
  await withTimeout(
    freezeSvgAnimations(page, storyId),
    3000,
    `SVG animation stabilization failed for ${storyId}`
  ).catch(() => {
    // continue with capture if SVG animation stabilization fails
  });
  logDebug(`capture:async-ready:done url=${storyUrl}`);

  let capture = await captureRootOrPage(page, outputPath);
  logDebug(`capture:screenshot:done url=${storyUrl} target=${capture.target} path=${outputPath}`);
  return capture;
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
      let changedSummary = story.changedPixels == null
        ? 'capture-error'
        : `changedPixels=${story.changedPixels} maxChangedPixels=${story.maxChangedPixels}`;
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

  let {chromium} = await import('playwright');
  let browser = await chromium.launch();
  let context = await browser.newContext({
    viewport: {
      width: args.viewportWidth,
      height: args.viewportHeight
    },
    deviceScaleFactor: args.deviceScaleFactor
  });

  try {
    for (let index = 0; index < filteredStoryIds.length; index++) {
      let id = filteredStoryIds[index];
      let maxChangedPixels = getMaxChangedPixels(id);
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
      let storyPage = await context.newPage();

      try {
        logDebug(`story:${id}:react:capture:start`);
        let reactCapture = await withTimeout(
          captureStory(storyPage, id, reactStoryUrl, reactImagePath),
          240000,
          `React capture failed for ${id}`
        );
        logDebug(`story:${id}:react:capture:done`);
        logDebug(`story:${id}:vue:capture:start`);
        let vueCapture = await withTimeout(
          captureStory(storyPage, id, vueStoryUrl, vueImagePath),
          240000,
          `Vue capture failed for ${id}`
        );
        logDebug(`story:${id}:vue:capture:done`);
        reactCaptureTarget = reactCapture.target;
        vueCaptureTarget = vueCapture.target;

        logDebug(`story:${id}:side-by-side:start`);
        await withTimeout(
          writeSideBySide(reactImagePath, vueImagePath, sideBySideImagePath),
          30000,
          `Side-by-side compose failed for ${id}`
        );
        logDebug(`story:${id}:side-by-side:done`);

        logDebug(`story:${id}:read-react:start`);
        let reactImage = await withTimeout(
          readRawImage(reactImagePath),
          10000,
          `React image read failed for ${id}`
        );
        logDebug(`story:${id}:read-react:done ${reactImage.width}x${reactImage.height}`);
        logDebug(`story:${id}:read-vue:start`);
        let vueImage = await withTimeout(
          readRawImage(vueImagePath),
          10000,
          `Vue image read failed for ${id}`
        );
        logDebug(`story:${id}:read-vue:done ${vueImage.width}x${vueImage.height}`);
        logDebug(`story:${id}:compare:start`);
        let comparison = compareImages(reactImage, vueImage);
        logDebug(`story:${id}:compare:done changedPixels=${comparison.changedPixels}`);

        logDebug(`story:${id}:diff-write:start`);
        await withTimeout(
          writeRawPng(comparison.diffData, comparison.width, comparison.height, diffImagePath),
          30000,
          `Diff image write failed for ${id}`
        );
        logDebug(`story:${id}:diff-write:done`);

        let storyResult = {
          id,
          maxChangedPixels,
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
          ok: comparison.changedPixels <= maxChangedPixels
        };

        report.stories.push(storyResult);
        report.summary.total++;
        report.summary.changedPixels += comparison.changedPixels;
        if (storyResult.ok) {
          report.summary.passed++;
        } else {
          report.summary.failed++;
          process.stdout.write(`  -> fail changedPixels=${comparison.changedPixels} maxChangedPixels=${maxChangedPixels}\n`);
          if (args.failFast) {
            break;
          }
        }
      } catch (error) {
        let message = error instanceof Error ? error.message : String(error);
        let storyResult = {
          id,
          maxChangedPixels,
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
      } finally {
        await withTimeout(storyPage.close().catch(() => {}), 10000, `Story page close failed for ${id}`).catch(() => {});
      }
    }
  } finally {
    await withTimeout(context.close().catch(() => {}), 10000, 'Context close failed').catch(() => {});
    await withTimeout(browser.close().catch(() => {}), 10000, 'Browser close failed').catch(() => {});
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
