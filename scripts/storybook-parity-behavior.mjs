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
      let groupCount = await page.locator('[role="group"]').count();
      let separatorCount = await page.locator('[role="separator"]').count();
      let topLevelMenuCount = await page.evaluate(() => {
        let menus = Array.from(document.querySelectorAll('[role="menu"]'));
        return menus.filter((menu) => !menu.parentElement?.closest('[role="menu"]')).length;
      });
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
        groupCount,
        initialAriaChecked,
        initialRole,
        itemCount,
        separatorCount,
        topLevelMenuCount
      };
    }
  },
  {
    id: 'react-aria-components-menu--submenu-example',
    async run(page) {
      let ensureMenuOpen = async () => {
        let firstControl = null;
        let timeoutAt = Date.now() + 10000;
        while (!firstControl && Date.now() < timeoutAt) {
          firstControl = await firstVisibleLocator(page, [
            '[role^="menuitem"]',
            'button[aria-label="Menu"]',
            'button'
          ]);

          if (!firstControl) {
            await page.waitForTimeout(200);
          }
        }

        if (!firstControl) {
          throw new Error('Unable to find a visible menu trigger button or rendered menu items.');
        }

        let items = page.locator('[role^="menuitem"]');
        let itemCount = await items.count();

        if (itemCount === 0) {
          let trigger = await firstVisibleLocator(page, [
            'button[aria-label="Menu"]',
            'button[aria-haspopup="menu"]',
            'button'
          ]);

          if (!trigger) {
            throw new Error('Unable to find a submenu trigger button or rendered menu items.');
          }

          await trigger.click();
        }

        await page.waitForSelector('[role^="menuitem"]', {timeout: 10000});
      };

      await ensureMenuOpen();

      let submenuTrigger = page.locator('[role^="menuitem"][aria-haspopup="menu"]').first();
      if (await submenuTrigger.count() === 0) {
        throw new Error('Unable to find submenu trigger item.');
      }

      let initialExpanded = await submenuTrigger.getAttribute('aria-expanded');
      await submenuTrigger.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(120);
      let afterArrowRightExpanded = await submenuTrigger.getAttribute('aria-expanded').catch(() => null);
      let afterArrowRightFocusedText = await page.evaluate(() => {
        let element = document.activeElement;
        return element ? element.textContent?.trim() ?? '' : null;
      });
      let submenuItemCountAfterArrowRight = await page.locator('[role^="menuitem"]', {hasText: 'Submenu '}).count();
      await page.keyboard.press('Escape');
      await page.waitForTimeout(120);
      let afterEscapeExpanded = await submenuTrigger.getAttribute('aria-expanded').catch(() => null);
      let afterEscapeFocusedText = await page.evaluate(() => {
        let element = document.activeElement;
        return element ? element.textContent?.trim() ?? '' : null;
      });
      let submenuItemCountAfterEscape = await page.locator('[role^="menuitem"]', {hasText: 'Submenu '}).count();
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(120);
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(120);
      let afterArrowLeftExpanded = await submenuTrigger.getAttribute('aria-expanded').catch(() => null);
      let afterArrowLeftFocusedText = await page.evaluate(() => {
        let element = document.activeElement;
        return element ? element.textContent?.trim() ?? '' : null;
      });
      let submenuItemCountAfterArrowLeft = await page.locator('[role^="menuitem"]', {hasText: 'Submenu '}).count();

      let storyUrl = page.url();
      await page.goto(storyUrl, {waitUntil: 'domcontentloaded'});
      await ensureMenuOpen();
      let enterTrigger = page.locator('[role^="menuitem"][aria-haspopup="menu"]').first();
      await enterTrigger.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(100);
      let afterEnterExpanded = await enterTrigger.getAttribute('aria-expanded').catch(() => null);
      let submenuItems = page.locator('[role^="menuitem"]', {hasText: 'Submenu '});
      let submenuItemCount = await submenuItems.count();

      await page.goto(storyUrl, {waitUntil: 'domcontentloaded'});
      await ensureMenuOpen();
      let hoverTrigger = page.locator('[role^="menuitem"][aria-haspopup="menu"]').first();
      await hoverTrigger.hover();
      await page.waitForTimeout(80);
      let hoverExpandedEarly = await hoverTrigger.getAttribute('aria-expanded');
      await page.waitForTimeout(180);
      let hoverExpandedLate = await hoverTrigger.getAttribute('aria-expanded');
      let hoverSiblingItem = page.locator('[role^="menuitem"]:not([aria-haspopup="menu"])').first();
      await hoverSiblingItem.hover();
      await page.waitForTimeout(260);
      let hoverExpandedAfterLeave = await hoverTrigger.getAttribute('aria-expanded');
      let submenuItemCountAfterHoverLeave = await page.locator('[role^="menuitem"]', {hasText: 'Submenu '}).count();

      return {
        afterArrowLeftExpanded,
        afterArrowLeftFocusedText,
        afterArrowRightExpanded,
        afterArrowRightFocusedText,
        afterEnterExpanded,
        afterEscapeExpanded,
        afterEscapeFocusedText,
        hoverExpandedAfterLeave,
        hoverExpandedEarly,
        hoverExpandedLate,
        initialExpanded,
        submenuItemCountAfterArrowLeft,
        submenuItemCountAfterEscape,
        submenuItemCountAfterArrowRight,
        submenuItemCountAfterHoverLeave,
        submenuItemCount
      };
    }
  },
  {
    id: 'react-aria-components-menu--submenu-sections-example',
    async run(page) {
      let ensureMenuOpen = async () => {
        let firstControl = null;
        let timeoutAt = Date.now() + 10000;
        while (!firstControl && Date.now() < timeoutAt) {
          firstControl = await firstVisibleLocator(page, [
            '[role^="menuitem"]',
            'button[aria-label="Menu"]',
            'button'
          ]);

          if (!firstControl) {
            await page.waitForTimeout(200);
          }
        }

        if (!firstControl) {
          throw new Error('Unable to find a visible menu trigger button or rendered menu items.');
        }

        let items = page.locator('[role^="menuitem"]');
        let itemCount = await items.count();

        if (itemCount === 0) {
          let trigger = await firstVisibleLocator(page, [
            'button[aria-label="Menu"]',
            'button[aria-haspopup="menu"]',
            'button'
          ]);

          if (!trigger) {
            throw new Error('Unable to find a submenu sections trigger button or rendered menu items.');
          }

          await trigger.click();
        }

        await page.waitForSelector('[role^="menuitem"]', {timeout: 10000});
      };

      await ensureMenuOpen();
      let submenuTrigger = page.locator('[role^="menuitem"][aria-haspopup="menu"]').first();
      if (await submenuTrigger.count() === 0) {
        throw new Error('Unable to find submenu trigger item for submenu sections scenario.');
      }

      await submenuTrigger.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(120);

      let groupCount = await page.locator('[role="group"]').count();
      let separatorCount = await page.locator('[role="separator"]').count();
      let submenuItemCount = await page.locator('[role^="menuitem"]', {hasText: 'Submenu '}).count();
      let submenuSection1HeadingCount = await page.locator('text=Submenu Section 1').count();
      let submenuSection2HeadingCount = await page.locator('text=Submenu Section 2').count();

      return {
        groupCount,
        separatorCount,
        submenuItemCount,
        submenuSection1HeadingCount,
        submenuSection2HeadingCount
      };
    }
  },
  {
    id: 'react-aria-components-menu--virtualized-example',
    async run(page) {
      let trigger = await firstVisibleLocator(page, [
        'button[aria-label="Menu"]',
        'button:has-text("Menu")',
        'button'
      ]);

      if (!trigger) {
        throw new Error('Unable to find virtualized menu trigger button.');
      }

      await trigger.click();
      await page.waitForSelector('[role^="menuitem"]', {timeout: 10000});

      let items = page.locator('[role^="menuitem"]');
      let initialCount = await items.count();
      let initialFirstText = (await items.first().textContent() ?? '').trim();
      let initialLastText = (await items.last().textContent() ?? '').trim();

      let menu = page.locator('[role="menu"]').first();
      await menu.evaluate((element) => {
        element.scrollTop = element.scrollHeight / 2;
      });
      await page.waitForTimeout(200);

      let scrolledItems = page.locator('[role^="menuitem"]');
      let afterScrollCount = await scrolledItems.count();
      let afterScrollFirstText = (await scrolledItems.first().textContent() ?? '').trim();

      return {
        afterScrollCountVirtualized: afterScrollCount > 0 && afterScrollCount < 100,
        initialCountVirtualized: initialCount > 0 && initialCount < 100,
        initialFirstText,
        initialLastTextStartsWithObject: initialLastText.startsWith('Object '),
        windowChangedAfterScroll: afterScrollFirstText !== initialFirstText
      };
    }
  },
  {
    id: 'react-aria-components-menu--menu-custom-render',
    async run(page) {
      let trigger = await firstVisibleLocator(page, [
        'button[aria-label="Menu"]',
        'button:has-text("Menu")',
        'button'
      ]);

      if (!trigger) {
        throw new Error('Unable to find custom-render menu trigger button.');
      }

      await trigger.click();
      await page.waitForSelector('[role^="menuitem"]', {timeout: 10000});

      let item = page.locator('[role^="menuitem"]').first();
      let itemTagName = await item.evaluate((element) => element.tagName);
      let itemHref = await item.getAttribute('href');
      await item.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(100);
      let afterEnterItemCount = await page.locator('[role^="menuitem"]').count();

      return {
        afterEnterItemCount,
        itemHref,
        itemTagName
      };
    }
  },
  {
    id: 'react-aria-components-tabs--tabs-example',
    async run(page) {
      await page.waitForSelector('[role="tab"]', {timeout: 10000});
      let tabs = page.locator('[role="tab"]');
      let tabCount = await tabs.count();
      if (tabCount === 0) {
        throw new Error('Unable to find tabs.');
      }

      let selectedTab = page.locator('[role="tab"][aria-selected="true"]').first();
      let initialSelectedText = (await selectedTab.textContent() ?? '').trim();
      await selectedTab.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(100);

      let selectedAfterArrow = page.locator('[role="tab"][aria-selected="true"]').first();
      let afterArrowSelectedText = (await selectedAfterArrow.textContent() ?? '').trim();
      let panelText = (await page.locator('[role="tabpanel"]').first().innerText()).replace(/\s+/g, ' ').trim();

      return {
        afterArrowSelectedText,
        initialSelectedText,
        panelText,
        tabCount
      };
    }
  },
  {
    id: 'react-aria-components-tabs--tabs-render-props',
    async run(page) {
      await page.waitForSelector('[role="tablist"]', {timeout: 10000});

      let tablist = page.locator('[role="tablist"]').first();
      let tabCount = await tablist.locator('[role="tab"]').count();
      let initialOrientation = await tablist.getAttribute('aria-orientation');
      let panelTextBeforeToggle = (await page.locator('[role="tabpanel"]').first().innerText()).replace(/\s+/g, ' ').trim();

      let toggleButton = await firstVisibleLocator(page, [
        'button:has-text("Change Orientation")',
        'button'
      ]);

      if (!toggleButton) {
        throw new Error('Unable to find tabs render props orientation toggle button.');
      }

      await toggleButton.click();
      await page.waitForTimeout(100);

      let toggledTablist = page.locator('[role="tablist"]').first();
      let afterToggleOrientation = await toggledTablist.getAttribute('aria-orientation');
      let panelTextAfterToggle = (await page.locator('[role="tabpanel"]').first().innerText()).replace(/\s+/g, ' ').trim();

      return {
        afterToggleOrientation,
        initialOrientation,
        panelTextAfterToggle,
        panelTextBeforeToggle,
        tabCount
      };
    }
  },
  {
    id: 'react-aria-components-tabs--nested-tabs',
    async run(page) {
      await page.waitForSelector('[role="tablist"]', {timeout: 10000});

      let tabListCountInitial = await page.locator('[role="tablist"]').count();
      let totalTabCountInitial = await page.locator('[role="tab"]').count();
      let selectedTabsInitial = await page.locator('[role="tab"][aria-selected="true"]').allTextContents();
      let selectedTabsInitialText = selectedTabsInitial.map((text) => text.trim()).join('|');

      let outerTabList = page.locator('[role="tablist"]').first();
      let barTab = outerTabList.locator('[role="tab"]').filter({hasText: /^Bar$/}).first();
      if (await barTab.count() === 0) {
        throw new Error('Unable to find outer "Bar" tab in nested tabs story.');
      }

      await barTab.click();
      await page.waitForTimeout(100);

      let tabListCountAfterBar = await page.locator('[role="tablist"]').count();
      let totalTabCountAfterBar = await page.locator('[role="tab"]').count();
      let selectedTabsAfterBar = await page.locator('[role="tab"][aria-selected="true"]').allTextContents();
      let selectedTabsAfterBarText = selectedTabsAfterBar.map((text) => text.trim()).join('|');
      let panelTextAfterBar = (await page.locator('[role="tabpanel"]').first().innerText()).replace(/\s+/g, ' ').trim();

      return {
        panelTextAfterBar,
        selectedTabsAfterBarText,
        selectedTabsInitialText,
        tabListCountAfterBar,
        tabListCountInitial,
        totalTabCountAfterBar,
        totalTabCountInitial
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
