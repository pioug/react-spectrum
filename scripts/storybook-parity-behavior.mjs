#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

function parseArgs(argv) {
  let args = {
    reactUrl: 'http://127.0.0.1:9003',
    vueUrl: 'http://127.0.0.1:6106',
    scenarioIds: '',
    outputDir: 'storybook-parity/catalog'
  };

  for (let i = 2; i < argv.length; i++) {
    let arg = argv[i];
    if (arg === '--react-url') {
      args.reactUrl = argv[++i];
    } else if (arg === '--vue-url') {
      args.vueUrl = argv[++i];
    } else if (arg === '--scenario-ids') {
      args.scenarioIds = argv[++i];
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
  node scripts/storybook-parity-behavior.mjs [options]

Options:
  --react-url <url>           React Storybook base URL (default: http://127.0.0.1:9003)
  --vue-url <url>             Vue Storybook base URL (default: http://127.0.0.1:6106)
  --scenario-ids <csv>        Limit to scenario ids (default: all)
  --output-dir <dir>          Output directory (default: storybook-parity/catalog)
  --help, -h                  Show help
`.trim());
}

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

function storyUrl(baseUrl, storyId) {
  return `${ensureTrailingSlash(baseUrl)}iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`;
}

async function firstVisibleLocator(page, selectors) {
  for (let selector of selectors) {
    let locator = page.locator(selector).first();
    if (await locator.count() === 0) {
      continue;
    }

    if (await locator.isVisible().catch(() => false)) {
      return locator;
    }
  }

  return null;
}

function checkedExtractorScript() {
  return (el) => {
    if (el instanceof HTMLInputElement) {
      return el.checked;
    }

    let ariaChecked = el.getAttribute('aria-checked');
    return ariaChecked === 'true';
  };
}

let scenarios = [
  {
    id: 'react-aria-components-checkbox--checkbox-example',
    async run(page) {
      let control = await firstVisibleLocator(page, ['[role="checkbox"]', 'input[type="checkbox"]']);
      if (!control) {
        throw new Error('Unable to find checkbox control.');
      }

      let readChecked = async () => control.evaluate(checkedExtractorScript());

      let initial = await readChecked();
      await control.focus();
      await page.keyboard.press('Space');
      let afterFirstSpace = await readChecked();
      await page.keyboard.press('Space');
      let afterSecondSpace = await readChecked();

      return {
        afterFirstSpace,
        afterSecondSpace,
        initial,
        role: await control.getAttribute('role')
      };
    }
  },
  {
    id: 'react-aria-components-switch--switch-example',
    async run(page) {
      let control = await firstVisibleLocator(page, ['[role="switch"]', 'input[role="switch"]', 'input[type="checkbox"]']);
      if (!control) {
        throw new Error('Unable to find switch control.');
      }

      let readChecked = async () => control.evaluate(checkedExtractorScript());

      let initial = await readChecked();
      await control.focus();
      await page.keyboard.press('Space');
      let afterFirstSpace = await readChecked();
      await page.keyboard.press('Space');
      let afterSecondSpace = await readChecked();

      return {
        afterFirstSpace,
        afterSecondSpace,
        initial,
        role: await control.getAttribute('role')
      };
    }
  },
  {
    id: 'react-aria-components-searchfield--search-field-example',
    async run(page) {
      let input = await firstVisibleLocator(page, ['input[type="search"]', 'input[type="text"]']);
      if (!input) {
        throw new Error('Unable to find search input.');
      }

      await input.fill('parity-query');
      let afterType = await input.inputValue();

      let clearButton = await firstVisibleLocator(page, [
        'button[aria-label*="clear" i]',
        'button:has-text("✕")',
        'button:has-text("Clear")'
      ]);

      if (clearButton) {
        await clearButton.click();
      } else {
        await input.press('Control+A');
        await input.press('Backspace');
      }

      let afterClear = await input.inputValue();

      return {
        afterClear,
        afterType,
        usedClearButton: Boolean(clearButton)
      };
    }
  },
  {
    id: 'react-aria-components-textfield--textfield-example',
    async run(page) {
      let input = await firstVisibleLocator(page, ['input:not([type])', 'input[type="text"]', 'input[type="email"]', 'textarea']);
      if (!input) {
        throw new Error('Unable to find textfield input.');
      }

      await input.fill('hello parity');
      let afterType = await input.inputValue();
      await input.press('Control+A');
      await input.press('Backspace');
      let afterClear = await input.inputValue();

      return {
        afterClear,
        afterType
      };
    }
  },
  {
    id: 'react-aria-components-listbox--list-box-example',
    async run(page) {
      let options = page.locator('[role="option"]');
      let optionCount = await options.count();
      if (optionCount === 0) {
        throw new Error('Unable to find listbox options.');
      }

      let firstOption = options.first();
      let readSelected = async () => firstOption.evaluate((el) => el.getAttribute('aria-selected') === 'true');

      let initialSelected = await readSelected();
      await firstOption.focus();
      await page.keyboard.press('Enter');
      let afterEnter = await readSelected();

      return {
        afterEnter,
        initialSelected,
        optionCount
      };
    }
  },
  {
    id: 'react-aria-components-menu--menu-example',
    async run(page) {
      let items = page.locator('[role^="menuitem"]');
      let itemCount = await items.count();

      if (itemCount === 0) {
        let trigger = await firstVisibleLocator(page, [
          'button[aria-label="Menu"]',
          'button[aria-haspopup="menu"]',
          'button'
        ]);

        if (!trigger) {
          throw new Error('Unable to find a menu trigger or rendered menu items.');
        }

        await trigger.click();
        await page.waitForSelector('[role^="menuitem"]', {timeout: 10000});
        itemCount = await page.locator('[role^="menuitem"]').count();
      }

      if (itemCount === 0) {
        throw new Error('Unable to find menu items.');
      }

      let firstItem = page.locator('[role^="menuitem"]').first();
      let initialRole = await firstItem.getAttribute('role');
      let initialAriaChecked = await firstItem.getAttribute('aria-checked');
      await firstItem.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(50);

      let currentFirstItem = page.locator('[role^="menuitem"]').first();
      let afterEnterRole = await currentFirstItem.getAttribute('role').catch(() => null);
      let afterEnterAriaChecked = await currentFirstItem.getAttribute('aria-checked').catch(() => null);
      let afterEnterItemCount = await page.locator('[role^="menuitem"]').count();

      return {
        afterEnterAriaChecked,
        afterEnterItemCount,
        afterEnterRole,
        initialAriaChecked,
        initialRole,
        itemCount
      };
    }
  }
];

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function diffObject(a, b) {
  let keys = new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})]);
  let out = {};
  for (let key of keys) {
    if (!deepEqual(a?.[key], b?.[key])) {
      out[key] = {
        react: a?.[key],
        vue: b?.[key]
      };
    }
  }
  return out;
}

function selectScenarios(allScenarios, scenarioIds) {
  if (!scenarioIds) {
    return allScenarios;
  }

  let allowed = new Set(scenarioIds.split(',').map((id) => id.trim()).filter(Boolean));
  let selected = allScenarios.filter((scenario) => allowed.has(scenario.id));

  if (selected.length === 0) {
    throw new Error(`No scenarios matched --scenario-ids="${scenarioIds}"`);
  }

  return selected;
}

async function runScenario(browser, baseUrl, scenario) {
  let page = await browser.newPage();
  try {
    await page.goto(storyUrl(baseUrl, scenario.id), {waitUntil: 'domcontentloaded'});
    await page.waitForSelector('#storybook-root, #root, body');
    return await scenario.run(page);
  } finally {
    await page.close();
  }
}

function writeReport(report, outputDir) {
  fs.mkdirSync(outputDir, {recursive: true});
  fs.writeFileSync(path.join(outputDir, 'behavior-report.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(outputDir, 'behavior-report.md'), formatMarkdown(report));
}

function formatMarkdown(report) {
  let lines = [];
  lines.push('# Storybook Behavior Parity Report');
  lines.push('');
  lines.push(`- React URL: ${report.reactUrl}`);
  lines.push(`- Vue URL: ${report.vueUrl}`);
  lines.push(`- Scenarios: ${report.totalScenarios}`);
  lines.push(`- Passing: ${report.passingScenarios}`);
  lines.push(`- Failing: ${report.failingScenarios}`);
  lines.push(`- Result: ${report.ok ? 'pass' : 'fail'}`);
  lines.push('');
  lines.push('## Scenario Results');
  lines.push('');

  for (let result of report.results) {
    lines.push(`- ${result.ok ? 'PASS' : 'FAIL'} \`${result.id}\``);
    if (!result.ok) {
      for (let key of Object.keys(result.diff)) {
        let value = result.diff[key];
        lines.push(`  - ${key}: react=${JSON.stringify(value.react)} vue=${JSON.stringify(value.vue)}`);
      }
      if (result.error) {
        lines.push(`  - error: ${result.error}`);
      }
    }
  }

  lines.push('');
  return lines.join('\n');
}

async function main() {
  let args = parseArgs(process.argv);
  let selectedScenarios = selectScenarios(scenarios, args.scenarioIds);
  let browser = await chromium.launch({headless: true});

  try {
    let results = [];
    for (let scenario of selectedScenarios) {
      let result = {
        id: scenario.id,
        ok: false,
        react: null,
        vue: null,
        diff: {},
        error: null
      };

      try {
        result.react = await runScenario(browser, args.reactUrl, scenario);
        result.vue = await runScenario(browser, args.vueUrl, scenario);
        result.diff = diffObject(result.react, result.vue);
        result.ok = Object.keys(result.diff).length === 0;
      } catch (error) {
        result.error = error instanceof Error ? error.message : String(error);
      }

      results.push(result);
    }

    let report = {
      generatedAt: new Date().toISOString(),
      reactUrl: args.reactUrl,
      vueUrl: args.vueUrl,
      totalScenarios: results.length,
      passingScenarios: results.filter((r) => r.ok).length,
      failingScenarios: results.filter((r) => !r.ok).length,
      ok: results.every((r) => r.ok),
      results
    };

    writeReport(report, args.outputDir);

    console.log(`Behavior scenarios: ${report.totalScenarios}`);
    console.log(`Passing: ${report.passingScenarios}`);
    console.log(`Failing: ${report.failingScenarios}`);
    console.log(`Report: ${path.join(args.outputDir, 'behavior-report.md')}`);

    if (!report.ok) {
      process.exit(1);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
