import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const DEFAULT_CONFIG_PATH = path.join(REPO_ROOT, 'migration', 'vue-visual-parity-fixtures.json');
const VISUAL_PARITY_ROOT = path.join(REPO_ROOT, 'migration', 'visual-parity');
const BASELINE_DIR = path.join(VISUAL_PARITY_ROOT, 'baseline');
const CURRENT_DIR = path.join(VISUAL_PARITY_ROOT, 'current');
const DIFF_DIR = path.join(VISUAL_PARITY_ROOT, 'diff');
const REPORT_JSON = path.join(REPO_ROOT, 'migration', 'vue-visual-parity-report.json');
const REPORT_MD = path.join(REPO_ROOT, 'migration', 'VUE_VISUAL_PARITY_REPORT.md');

function parseArgs(args) {
  let mode = args[0] ?? 'compare';
  if (!['capture', 'compare'].includes(mode)) {
    throw new Error(`Unknown mode: ${mode}. Expected "capture" or "compare".`);
  }

  return {
    mode,
    write: args.includes('--write'),
    startServer: args.includes('--start-server'),
    configPath: resolveArgPath(args, '--config', DEFAULT_CONFIG_PATH)
  };
}

function resolveArgPath(args, argName, defaultPath) {
  let argIndex = args.indexOf(argName);
  if (argIndex === -1 || !args[argIndex + 1]) {
    return defaultPath;
  }

  let rawPath = args[argIndex + 1];
  return path.isAbsolute(rawPath) ? rawPath : path.join(REPO_ROOT, rawPath);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, {recursive: true});
}

function ensureVisualParityDirs() {
  ensureDir(VISUAL_PARITY_ROOT);
  ensureDir(BASELINE_DIR);
  ensureDir(CURRENT_DIR);
  ensureDir(DIFF_DIR);
}

function normalizeBaseUrl(baseUrl) {
  return baseUrl.replace(/\/$/, '');
}

function fixtureUrl(baseUrl, fixture) {
  if (fixture.url) {
    return fixture.url;
  }

  let normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  let fixturePath = fixture.path ?? '/';
  return `${normalizedBaseUrl}${fixturePath.startsWith('/') ? fixturePath : `/${fixturePath}`}`;
}

async function waitForUrl(url, timeoutMs = 45000) {
  let startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      let response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Ignore while waiting for server startup.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function maybeStartServer(config, shouldStartServer) {
  if (!shouldStartServer) {
    return null;
  }

  if (!config.startCommand) {
    throw new Error('Config is missing "startCommand" but --start-server was requested.');
  }

  if (!config.baseUrl) {
    throw new Error('Config is missing "baseUrl" but --start-server was requested.');
  }

  console.log(`Starting fixture server: ${config.startCommand}`);
  let child = spawn(config.startCommand, {
    cwd: REPO_ROOT,
    shell: true,
    detached: true,
    stdio: 'pipe',
    env: {
      ...process.env,
      BROWSER: 'none'
    }
  });

  child.stdout.on('data', (data) => {
    let text = String(data).trim();
    if (text.length > 0) {
      console.log(`[server] ${text}`);
    }
  });

  child.stderr.on('data', (data) => {
    let text = String(data).trim();
    if (text.length > 0) {
      console.error(`[server] ${text}`);
    }
  });

  await waitForUrl(config.baseUrl);
  console.log(`Fixture server ready at ${config.baseUrl}`);
  return child;
}

async function stopServer(child) {
  if (!child) {
    return;
  }

  let processGroupId = typeof child.pid === 'number' ? -child.pid : null;

  let terminate = (signal) => {
    if (processGroupId != null) {
      try {
        process.kill(processGroupId, signal);
      } catch {
        // Ignore if the group is already gone.
      }
    }

    try {
      child.kill(signal);
    } catch {
      // Ignore if the process already exited.
    }
  };

  terminate('SIGTERM');
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (child.exitCode == null) {
    terminate('SIGKILL');
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  child.stdout?.destroy();
  child.stderr?.destroy();
  child.unref();
}

async function loadPngRaw(imagePath) {
  return sharp(imagePath)
    .ensureAlpha()
    .raw()
    .toBuffer({resolveWithObject: true});
}

function padRawBuffer(rawBuffer, source, targetWidth, targetHeight) {
  let output = Buffer.alloc(targetWidth * targetHeight * 4, 0);
  let sourceStride = source.width * 4;
  let targetStride = targetWidth * 4;

  for (let y = 0; y < source.height; y++) {
    let sourceOffset = y * sourceStride;
    let targetOffset = y * targetStride;
    rawBuffer.copy(output, targetOffset, sourceOffset, sourceOffset + sourceStride);
  }

  return output;
}

async function diffImages(referencePath, candidatePath, diffPath) {
  let reference = await loadPngRaw(referencePath);
  let candidate = await loadPngRaw(candidatePath);

  let width = Math.max(reference.info.width, candidate.info.width);
  let height = Math.max(reference.info.height, candidate.info.height);

  let paddedReference = padRawBuffer(reference.data, reference.info, width, height);
  let paddedCandidate = padRawBuffer(candidate.data, candidate.info, width, height);
  let diff = Buffer.alloc(width * height * 4, 0);

  let changedPixels = 0;

  for (let i = 0; i < width * height; i++) {
    let offset = i * 4;
    let rDelta = Math.abs(paddedReference[offset] - paddedCandidate[offset]);
    let gDelta = Math.abs(paddedReference[offset + 1] - paddedCandidate[offset + 1]);
    let bDelta = Math.abs(paddedReference[offset + 2] - paddedCandidate[offset + 2]);
    let aDelta = Math.abs(paddedReference[offset + 3] - paddedCandidate[offset + 3]);

    if (rDelta > 0 || gDelta > 0 || bDelta > 0 || aDelta > 0) {
      changedPixels++;
      diff[offset] = 255;
      diff[offset + 1] = 52;
      diff[offset + 2] = 52;
      diff[offset + 3] = 255;
      continue;
    }

    diff[offset] = paddedReference[offset];
    diff[offset + 1] = paddedReference[offset + 1];
    diff[offset + 2] = paddedReference[offset + 2];
    diff[offset + 3] = 110;
  }

  await sharp(diff, {
    raw: {
      width,
      height,
      channels: 4
    }
  }).png().toFile(diffPath);

  let totalPixels = width * height;
  let diffRatio = totalPixels === 0 ? 0 : changedPixels / totalPixels;
  return {
    changedPixels,
    totalPixels,
    diffRatio,
    width,
    height
  };
}

function buildMarkdownReport(report) {
  let lines = [];
  lines.push('# Vue Visual Parity Report');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`* Mode: ${report.mode}`);
  lines.push(`* Fixtures: ${report.summary.totalFixtures}`);
  lines.push(`* Passed: ${report.summary.passedFixtures}`);
  lines.push(`* Failed: ${report.summary.failedFixtures}`);
  lines.push(`* Errors: ${report.summary.erroredFixtures}`);
  lines.push('');
  lines.push('## Fixtures');
  lines.push('');
  lines.push('| Fixture | Status | Diff ratio | Threshold | Changed pixels |');
  lines.push('| --- | --- | ---: | ---: | ---: |');

  for (let fixture of report.fixtures) {
    if (fixture.error) {
      lines.push(`| \`${fixture.id}\` | error: ${fixture.error} | - | ${fixture.maxDiffRatio} | - |`);
      continue;
    }

    lines.push(`| \`${fixture.id}\` | ${fixture.status} | ${(fixture.diffRatio * 100).toFixed(4)}% | ${(fixture.maxDiffRatio * 100).toFixed(4)}% | ${fixture.changedPixels} |`);
  }

  lines.push('');
  return lines.join('\n');
}

function printSummary(report) {
  console.log(`Mode: ${report.mode}`);
  console.log(`Fixtures: ${report.summary.totalFixtures}`);
  console.log(`Passed: ${report.summary.passedFixtures}`);
  console.log(`Failed: ${report.summary.failedFixtures}`);
  console.log(`Errors: ${report.summary.erroredFixtures}`);
}

async function runCapture(browser, config) {
  let page = await browser.newPage();
  let fixtures = [];

  for (let fixture of config.fixtures ?? []) {
    let result = {
      id: fixture.id,
      maxDiffRatio: fixture.maxDiffRatio ?? 0,
      status: 'captured',
      diffRatio: 0,
      changedPixels: 0,
      totalPixels: 0,
      error: null
    };

    let baselinePath = path.join(BASELINE_DIR, `${fixture.id}.png`);
    let currentPath = path.join(CURRENT_DIR, `${fixture.id}.png`);

    try {
      let url = fixtureUrl(config.baseUrl, fixture);
      let viewport = fixture.viewport ?? {width: 1280, height: 720};
      await page.setViewportSize(viewport);
      await page.goto(url, {waitUntil: 'networkidle'});

      if (fixture.waitForSelector) {
        await page.waitForSelector(fixture.waitForSelector, {timeout: 10000});
      }

      let locator = page.locator(fixture.selector);
      await locator.waitFor({state: 'visible', timeout: 10000});
      await locator.screenshot({path: currentPath, animations: 'disabled'});
      fs.copyFileSync(currentPath, baselinePath);
      result.baselinePath = path.relative(REPO_ROOT, baselinePath);
      result.candidatePath = path.relative(REPO_ROOT, currentPath);
    } catch (error) {
      result.status = 'error';
      result.error = error instanceof Error ? error.message : String(error);
    }

    fixtures.push(result);
  }

  await page.close();

  let erroredFixtures = fixtures.filter((fixture) => fixture.status === 'error').length;
  return {
    generatedAt: new Date().toISOString(),
    mode: 'capture',
    summary: {
      totalFixtures: fixtures.length,
      passedFixtures: fixtures.length - erroredFixtures,
      failedFixtures: 0,
      erroredFixtures
    },
    fixtures
  };
}

async function runCompare(browser, config) {
  let page = await browser.newPage();
  let fixtures = [];

  for (let fixture of config.fixtures ?? []) {
    let result = {
      id: fixture.id,
      maxDiffRatio: fixture.maxDiffRatio ?? 0,
      status: 'pass',
      diffRatio: 0,
      changedPixels: 0,
      totalPixels: 0,
      error: null
    };

    let baselinePath = path.join(BASELINE_DIR, `${fixture.id}.png`);
    let currentPath = path.join(CURRENT_DIR, `${fixture.id}.png`);
    let diffPath = path.join(DIFF_DIR, `${fixture.id}.png`);

    result.baselinePath = path.relative(REPO_ROOT, baselinePath);
    result.candidatePath = path.relative(REPO_ROOT, currentPath);
    result.diffPath = path.relative(REPO_ROOT, diffPath);

    try {
      if (!fs.existsSync(baselinePath)) {
        throw new Error(`Missing baseline image at ${path.relative(REPO_ROOT, baselinePath)}. Run capture first.`);
      }

      let url = fixtureUrl(config.baseUrl, fixture);
      let viewport = fixture.viewport ?? {width: 1280, height: 720};
      await page.setViewportSize(viewport);
      await page.goto(url, {waitUntil: 'networkidle'});

      if (fixture.waitForSelector) {
        await page.waitForSelector(fixture.waitForSelector, {timeout: 10000});
      }

      let locator = page.locator(fixture.selector);
      await locator.waitFor({state: 'visible', timeout: 10000});
      await locator.screenshot({path: currentPath, animations: 'disabled'});

      let diffResult = await diffImages(baselinePath, currentPath, diffPath);
      result.diffRatio = diffResult.diffRatio;
      result.changedPixels = diffResult.changedPixels;
      result.totalPixels = diffResult.totalPixels;

      if (diffResult.diffRatio > result.maxDiffRatio) {
        result.status = 'fail';
      }
    } catch (error) {
      result.status = 'error';
      result.error = error instanceof Error ? error.message : String(error);
    }

    fixtures.push(result);
  }

  await page.close();

  let failedFixtures = fixtures.filter((fixture) => fixture.status === 'fail').length;
  let erroredFixtures = fixtures.filter((fixture) => fixture.status === 'error').length;
  let passedFixtures = fixtures.length - failedFixtures - erroredFixtures;

  return {
    generatedAt: new Date().toISOString(),
    mode: 'compare',
    summary: {
      totalFixtures: fixtures.length,
      passedFixtures,
      failedFixtures,
      erroredFixtures
    },
    fixtures
  };
}

function writeReport(report) {
  fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2));
  fs.writeFileSync(REPORT_MD, `${buildMarkdownReport(report)}\n`);
}

async function main() {
  let options = parseArgs(process.argv.slice(2));
  let config = readJson(options.configPath);

  if (!config.baseUrl) {
    throw new Error(`Config is missing "baseUrl": ${path.relative(REPO_ROOT, options.configPath)}`);
  }

  ensureVisualParityDirs();

  let server = await maybeStartServer(config, options.startServer);
  let browser;

  try {
    browser = await chromium.launch({headless: true});

    let report = options.mode === 'capture'
      ? await runCapture(browser, config)
      : await runCompare(browser, config);

    printSummary(report);

    if (options.write) {
      writeReport(report);
      console.log(`Wrote ${path.relative(REPO_ROOT, REPORT_JSON)} and ${path.relative(REPO_ROOT, REPORT_MD)}.`);
    }

    if (options.mode === 'compare' && (report.summary.failedFixtures > 0 || report.summary.erroredFixtures > 0)) {
      process.exitCode = 1;
    }
  } finally {
    if (browser) {
      await browser.close();
    }

    await stopServer(server);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
