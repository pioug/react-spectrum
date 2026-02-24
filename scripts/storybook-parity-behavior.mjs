#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const deterministicMocksInstalledPages = new WeakSet();
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

function normalizeText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
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
}

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
    let locator = page.locator(selector);
    let count = await locator.count();
    if (count === 0) {
      continue;
    }

    for (let index = 0; index < count; index++) {
      let candidate = locator.nth(index);
      if (await candidate.isVisible().catch(() => false)) {
        return candidate;
      }
    }
  }

  return null;
}

async function waitForFirstVisibleLocator(page, selectors, timeout = 10000) {
  let timeoutAt = Date.now() + timeout;
  while (Date.now() < timeoutAt) {
    let locator = await firstVisibleLocator(page, selectors);
    if (locator) {
      return locator;
    }

    await page.waitForTimeout(200);
  }

  return null;
}

async function clickNearestComboboxTrigger(input, page) {
  let clicked = await input.evaluate((element) => {
    let node = element;
    while (node && node !== document.body) {
      let parent = node.parentElement;
      if (!parent) {
        break;
      }

      let candidate = parent.querySelector('button[aria-haspopup="listbox"]');
      if (candidate instanceof HTMLButtonElement) {
        candidate.click();
        return true;
      }

      node = parent;
    }

    return false;
  });

  if (clicked) {
    return true;
  }

  let fallback = await waitForFirstVisibleLocator(page, [
    'button[aria-haspopup="listbox"]',
    'button:has-text("▼")',
    'button:has-text("▾")'
  ], 5000);

  if (!fallback) {
    return false;
  }

  await fallback.click();
  return true;
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
    id: 'react-aria-components-button--button-example',
    async run(page) {
      let button = await firstVisibleLocator(page, [
        '[data-testid="button-example"]',
        'button',
        '[role="button"]'
      ]);

      if (!button) {
        throw new Error('Unable to find button example control.');
      }

      let readState = async () => ({
        dataFocusVisible: await button.getAttribute('data-focus-visible'),
        dataHovered: await button.getAttribute('data-hovered'),
        dataPressed: await button.getAttribute('data-pressed')
      });

      let initialState = await readState();
      let box = await button.boundingBox();
      if (box) {
        await page.mouse.move(box.x + Math.max(1, Math.floor(box.width / 2)), box.y + Math.max(1, Math.floor(box.height / 2)));
      }
      await page.waitForTimeout(40);
      let stateAfterHover = await readState();
      await page.keyboard.press('Tab');
      await page.waitForTimeout(40);
      let stateAfterKeyboardFocus = await readState();
      await page.keyboard.down('Space');
      await page.waitForTimeout(40);
      let stateDuringSpacePress = await readState();
      await page.keyboard.up('Space');
      await page.waitForTimeout(40);
      let stateAfterSpaceRelease = await readState();

      return {
        focusVisibleAfterKeyboard: stateAfterKeyboardFocus.dataFocusVisible === 'true',
        hoveredAfterHover: stateAfterHover.dataHovered === 'true',
        hoveredAfterSpaceRelease: stateAfterSpaceRelease.dataHovered === 'true',
        initialHovered: initialState.dataHovered === 'true',
        initialPressed: initialState.dataPressed === 'true',
        pressedDuringSpacePress: stateDuringSpacePress.dataPressed === 'true',
        role: await button.getAttribute('role'),
        tagName: await button.evaluate((element) => element.tagName),
        text: (await button.innerText()).replace(/\s+/g, ' ').trim()
      };
    }
  },
  {
    id: 'react-aria-components-button--pending-button',
    async run(page) {
      let button = await waitForFirstVisibleLocator(page, [
        'button',
        '[role="button"]'
      ], 10000);

      if (!button) {
        throw new Error('Unable to find pending button.');
      }

      await button.click();
      await page.waitForTimeout(120);

      let ariaDisabled = await button.getAttribute('aria-disabled');
      let disabled = await button.getAttribute('disabled');
      let buttonTextAfterPress = (await button.innerText()).replace(/\s+/g, ' ').trim();

      return {
        ariaDisabled,
        buttonTextAfterPress,
        disabled,
      };
    }
  },
  {
    id: 'react-aria-components-button--pending-button-tooltip',
    async run(page) {
      let button = await waitForFirstVisibleLocator(page, [
        'button',
        '[role="button"]'
      ], 10000);

      if (!button) {
        throw new Error('Unable to find pending tooltip button.');
      }

      await button.hover();
      await page.waitForTimeout(220);

      let tooltipVisibleBeforePress = await page.locator('text=Tooltip should appear on hover').count();

      await button.click();
      await page.waitForTimeout(120);
      await button.hover();
      await page.waitForTimeout(220);
      let tooltipVisibleAfterPress = await page.locator('text=Tooltip should appear on hover').count();

      return {
        tooltipVisibleAfterPress,
        tooltipVisibleBeforePress
      };
    }
  },
  {
    id: 'react-aria-components-button--ripple-button-example',
    async run(page) {
      let button = await firstVisibleLocator(page, [
        '[data-testid="button-example"]',
        'button:has-text("Press me")',
        '[role="button"]:has-text("Press me")'
      ]);

      if (!button) {
        throw new Error('Unable to find ripple button.');
      }

      let beforeSpanCount = await button.locator('span').count();
      let box = await button.boundingBox();
      if (!box) {
        throw new Error('Unable to determine ripple button bounding box.');
      }

      await button.click({
        position: {
          x: Math.max(1, Math.floor(box.width / 2)),
          y: Math.max(1, Math.floor(box.height / 2))
        }
      });

      await page.waitForTimeout(80);

      let spans = button.locator('span');
      let afterSpanCount = await spans.count();
      let firstSpanStyle = afterSpanCount > 0
        ? await spans.first().getAttribute('style')
        : null;

      return {
        afterSpanCount,
        beforeSpanCount,
        firstSpanHasPositionStyle: Boolean(firstSpanStyle && firstSpanStyle.includes('left') && firstSpanStyle.includes('top'))
      };
    }
  },
  {
    id: 'react-aria-components-button--button-render',
    async run(page) {
      let button = await waitForFirstVisibleLocator(page, [
        'button',
        '[role="button"]'
      ], 10000);

      if (!button) {
        throw new Error('Unable to find button render control.');
      }

      let backgroundColor = await button.evaluate((element) => window.getComputedStyle(element).backgroundColor);
      let text = (await button.innerText()).replace(/\s+/g, ' ').trim();
      let tagName = await button.evaluate((element) => element.tagName);

      return {
        backgroundColor,
        tagName,
        text
      };
    }
  },
  {
    id: 'react-aria-components-comboboxreproductions--combo-box-reproduction-example',
    async run(page) {
      let input = await waitForFirstVisibleLocator(page, [
        'input[role="combobox"]',
        'input'
      ], 10000);

      if (!input) {
        throw new Error('Unable to find combobox reproduction input.');
      }

      await input.focus();
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(120);

      let ariaExpandedAfterFirstArrow = await input.getAttribute('aria-expanded');
      let activeDescendantAfterFirstArrow = await input.getAttribute('aria-activedescendant');
      let optionCountAfterFirstArrow = await page.locator('[role="option"]').count();

      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(120);
      let activeDescendantAfterSecondArrow = await input.getAttribute('aria-activedescendant');

      await page.keyboard.press('Enter');
      await page.waitForTimeout(120);
      let inputValueAfterEnter = await input.inputValue();
      let ariaExpandedAfterEnter = await input.getAttribute('aria-expanded');

      await input.fill('');
      await page.waitForTimeout(120);

      if (await input.getAttribute('aria-expanded') !== 'true') {
        let triggerClicked = await clickNearestComboboxTrigger(input, page);
        if (!triggerClicked) {
          throw new Error('Unable to reopen combobox reproduction popup.');
        }
      }
      await page.waitForTimeout(120);

      let longOption = page.locator('[role="option"]', {hasText: 'Dooooooooooooooooooooooooooooooooog'}).first();
      let longOptionCountAfterReopen = await longOption.count();

      let listbox = await firstVisibleLocator(page, [
        '[role="listbox"]',
        '.react-aria-ListBox'
      ]);

      if (!listbox) {
        throw new Error('Unable to find combobox reproduction listbox.');
      }

      let listboxHasHorizontalOverflow = await listbox.evaluate((element) => element.scrollWidth > element.clientWidth);

      return {
        activeDescendantChangesOnSecondArrow: Boolean(activeDescendantAfterFirstArrow && activeDescendantAfterSecondArrow && activeDescendantAfterFirstArrow !== activeDescendantAfterSecondArrow),
        ariaExpandedAfterEnter,
        ariaExpandedAfterFirstArrow,
        hasActiveDescendantAfterFirstArrow: Boolean(activeDescendantAfterFirstArrow),
        inputValueAfterEnter,
        listboxHasHorizontalOverflow,
        longOptionCountAfterReopen,
        optionCountAfterFirstArrow
      };
    }
  },
  {
    id: 'react-aria-components-combobox--combo-box-example',
    async run(page) {
      let input = await waitForFirstVisibleLocator(page, [
        'input[role="combobox"]',
        'input[aria-haspopup="listbox"]',
        'input'
      ], 10000);

      if (!input) {
        throw new Error('Unable to find combobox input.');
      }

      let triggerClicked = await clickNearestComboboxTrigger(input, page);
      if (!triggerClicked) {
        throw new Error('Unable to click combobox trigger button.');
      }
      await page.waitForTimeout(120);

      let optionCountAfterOpen = await page.locator('[role="option"]').count();
      let firstOptionText = optionCountAfterOpen > 0
        ? (await page.locator('[role="option"]').first().innerText()).replace(/\s+/g, ' ').trim()
        : null;
      let ariaExpandedAfterOpen = await input.getAttribute('aria-expanded');

      await input.press('Escape');
      await page.waitForTimeout(120);
      let ariaExpandedAfterEscape = await input.getAttribute('aria-expanded');

      return {
        ariaExpandedAfterEscape,
        ariaExpandedAfterOpen,
        firstOptionText,
        optionCountAfterOpen
      };
    }
  },
  {
    id: 'react-aria-components-combobox--combo-box-render-props-static',
    async run(page) {
      let input = await waitForFirstVisibleLocator(page, [
        'input[role="combobox"]',
        'input[aria-haspopup="listbox"]',
        'input'
      ], 10000);

      if (!input) {
        throw new Error('Unable to find render-props static combobox input.');
      }

      let triggerClicked = await clickNearestComboboxTrigger(input, page);
      if (!triggerClicked) {
        throw new Error('Unable to open render-props static combobox.');
      }
      await page.waitForTimeout(120);

      let optionCountAfterOpen = await page.locator('[role="option"]').count();
      let firstOptionText = optionCountAfterOpen > 0
        ? (await page.locator('[role="option"]').first().innerText()).replace(/\s+/g, ' ').trim()
        : null;

      return {
        firstOptionText,
        optionCountAfterOpen
      };
    }
  },
  {
    id: 'react-aria-components-combobox--combo-box-render-props-default-items',
    async run(page) {
      let input = await waitForFirstVisibleLocator(page, [
        'input[role="combobox"]',
        'input[aria-haspopup="listbox"]',
        'input'
      ], 10000);

      if (!input) {
        throw new Error('Unable to find render-props default-items combobox input.');
      }

      let triggerClicked = await clickNearestComboboxTrigger(input, page);
      if (!triggerClicked) {
        throw new Error('Unable to open render-props default-items combobox.');
      }
      await page.waitForTimeout(120);

      let optionCountAfterOpen = await page.locator('[role="option"]').count();
      let firstOptionText = optionCountAfterOpen > 0
        ? (await page.locator('[role="option"]').first().innerText()).replace(/\s+/g, ' ').trim()
        : null;

      return {
        firstOptionText,
        optionCountAfterOpen
      };
    }
  },
  {
    id: 'react-aria-components-combobox--combo-box-render-props-items',
    async run(page) {
      let input = await waitForFirstVisibleLocator(page, [
        'input[role="combobox"]',
        'input[aria-haspopup="listbox"]',
        'input'
      ], 10000);

      if (!input) {
        throw new Error('Unable to find render-props controlled-items combobox input.');
      }

      await input.fill('zz');
      await page.waitForTimeout(120);

      let expandedAfterInput = await input.getAttribute('aria-expanded');
      if (expandedAfterInput !== 'true') {
        let triggerClicked = await clickNearestComboboxTrigger(input, page);
        if (!triggerClicked) {
          throw new Error('Unable to open render-props controlled-items combobox.');
        }
      }
      await page.waitForTimeout(120);

      let optionCountAfterInput = await page.locator('[role="option"]').count();

      return {
        ariaExpandedAfterInput: await input.getAttribute('aria-expanded'),
        optionCountAfterInput
      };
    }
  },
  {
    id: 'react-aria-components-combobox--combo-box-render-props-list-box-dynamic',
    async run(page) {
      let input = await waitForFirstVisibleLocator(page, [
        'input[role="combobox"]',
        'input[aria-haspopup="listbox"]',
        'input'
      ], 10000);

      if (!input) {
        throw new Error('Unable to find render-props listbox-dynamic combobox input.');
      }

      let triggerClicked = await clickNearestComboboxTrigger(input, page);
      if (!triggerClicked) {
        throw new Error('Unable to open render-props listbox-dynamic combobox.');
      }
      await page.waitForTimeout(120);

      let optionCountAfterOpen = await page.locator('[role="option"]').count();
      let firstOptionText = optionCountAfterOpen > 0
        ? (await page.locator('[role="option"]').first().innerText()).replace(/\s+/g, ' ').trim()
        : null;

      return {
        firstOptionText,
        optionCountAfterOpen
      };
    }
  },
  {
    id: 'react-aria-components-combobox--with-create-option',
    async run(page) {
      let input = await waitForFirstVisibleLocator(page, [
        'input[role="combobox"]',
        'input[aria-haspopup="listbox"]',
        'input'
      ], 10000);

      if (!input) {
        throw new Error('Unable to find with-create-option combobox input.');
      }

      await input.fill('Wolf');
      await page.waitForTimeout(80);

      let expandedAfterInput = await input.getAttribute('aria-expanded');
      if (expandedAfterInput !== 'true') {
        let triggerClicked = await clickNearestComboboxTrigger(input, page);
        if (!triggerClicked) {
          throw new Error('Unable to open with-create-option combobox.');
        }
      }
      await page.waitForTimeout(120);

      let createOptionCount = await page.locator('[role="option"]', {hasText: 'Create "Wolf"'}).count();
      let optionCountAfterOpen = await page.locator('[role="option"]').count();
      let ariaExpandedAfterOpen = await input.getAttribute('aria-expanded');
      if (createOptionCount > 0) {
        await page.locator('[role="option"]', {hasText: 'Create "Wolf"'}).first().click();
        await page.waitForTimeout(120);
      }

      let inputValueAfterCreate = await input.inputValue();
      let ariaExpandedAfterCreate = await input.getAttribute('aria-expanded');

      return {
        ariaExpandedAfterCreate,
        ariaExpandedAfterOpen,
        createOptionCount,
        inputValueAfterCreate,
        optionCountAfterOpen
      };
    }
  },
  {
    id: 'react-aria-components-combobox--combo-box-ime-example',
    async run(page) {
      let input = await waitForFirstVisibleLocator(page, [
        'input[role="combobox"]',
        'input[aria-haspopup="listbox"]',
        'input'
      ], 10000);

      if (!input) {
        throw new Error('Unable to find IME combobox input.');
      }

      let triggerClicked = await clickNearestComboboxTrigger(input, page);
      if (!triggerClicked) {
        throw new Error('Unable to click IME combobox trigger button.');
      }
      await page.waitForTimeout(120);

      let optionCountAfterOpen = await page.locator('[role="option"]').count();
      let containsJapaneseOption = await page.locator('text=日本語').count();

      return {
        containsJapaneseOption,
        optionCountAfterOpen
      };
    }
  },
  {
    id: 'react-aria-components-combobox--combo-box-async-loading-example',
    async run(page) {
      let input = await waitForFirstVisibleLocator(page, [
        'input[role="combobox"]',
        'input[aria-haspopup="listbox"]',
        'input'
      ], 10000);

      if (!input) {
        throw new Error('Unable to find async combobox input.');
      }

      await page.waitForTimeout(1000);
      await input.fill('f');
      await page.waitForTimeout(420);

      let optionCountAfterOpen = await page.locator('[role="option"]').count();
      let firstOptionText = optionCountAfterOpen > 0
        ? (await page.locator('[role="option"]').first().innerText()).replace(/\s+/g, ' ').trim()
        : null;
      let ariaExpandedAfterInput = await input.getAttribute('aria-expanded');

      return {
        ariaExpandedAfterInput,
        firstOptionText,
        optionCountAfterOpen
      };
    }
  },
  {
    id: 'react-aria-components-combobox--virtualized-combo-box',
    async run(page) {
      let input = await waitForFirstVisibleLocator(page, [
        'input[role="combobox"]',
        'input[aria-haspopup="listbox"]',
        'input'
      ], 10000);

      if (!input) {
        throw new Error('Unable to find virtualized combobox input.');
      }

      let triggerClicked = await clickNearestComboboxTrigger(input, page);
      if (!triggerClicked) {
        throw new Error('Unable to click virtualized combobox trigger button.');
      }
      await page.waitForTimeout(150);

      let optionCountAfterOpen = await page.locator('[role="option"]').count();
      let hasFirstItemVisible = await page.locator('[role="option"]', {hasText: 'Item 0'}).count();
      let hasLastItemVisible = await page.locator('[role="option"]', {hasText: 'Item 9999'}).count();

      let listbox = await firstVisibleLocator(page, [
        '[role="listbox"]',
        '.react-aria-ListBox'
      ]);

      if (!listbox) {
        throw new Error('Unable to find virtualized combobox listbox.');
      }

      return {
        hasFirstItemVisible: hasFirstItemVisible > 0,
        hasLastItemVisible: hasLastItemVisible > 0,
        isWindowedAfterOpen: optionCountAfterOpen > 0 && optionCountAfterOpen < 10000
      };
    }
  },
  {
    id: 'react-aria-components-combobox--multi-select-combo-box',
    async run(page) {
      let input = await waitForFirstVisibleLocator(page, [
        'input[role="combobox"]',
        'input[aria-haspopup="listbox"]',
        'input'
      ], 10000);

      if (!input) {
        throw new Error('Unable to find multi-select combobox input.');
      }

      let selectedState = page.locator('[aria-label="Selected states"]').first();
      if (await selectedState.count() === 0) {
        throw new Error('Unable to find selected states region.');
      }

      let emptyStateVisibleBefore = ((await selectedState.innerText()).replace(/\s+/g, ' ').trim()).includes('No selected items');

      let triggerClicked = await clickNearestComboboxTrigger(input, page);
      if (!triggerClicked) {
        throw new Error('Unable to click multi-select combobox trigger button.');
      }
      await page.waitForTimeout(150);

      let optionCountAfterOpen = await page.locator('[role="option"]').count();
      if (optionCountAfterOpen === 0) {
        throw new Error('Multi-select combobox rendered no options.');
      }

      await page.locator('[role="option"]').first().click();
      await page.waitForTimeout(120);

      let selectedStateTextAfter = (await selectedState.innerText()).replace(/\s+/g, ' ').trim();
      let emptyStateVisibleAfter = selectedStateTextAfter.includes('No selected items');

      return {
        emptyStateVisibleAfter,
        emptyStateVisibleBefore,
        optionCountAfterOpen,
        selectedContainsAlabama: selectedStateTextAfter.includes('Alabama')
      };
    }
  },
  {
    id: 'react-aria-components-combobox--async-virtualized-dynamic-combobox',
    async run(page) {
      let input = await waitForFirstVisibleLocator(page, [
        'input[role="combobox"]',
        'input[aria-haspopup="listbox"]',
        'input'
      ], 10000);

      if (!input) {
        throw new Error('Unable to find async virtualized dynamic combobox input.');
      }

      await page.waitForTimeout(600);
      await input.fill('luke');
      await page.waitForTimeout(900);

      let expandedAfterInput = await input.getAttribute('aria-expanded');
      if (expandedAfterInput !== 'true') {
        let triggerClicked = await clickNearestComboboxTrigger(input, page);
        if (!triggerClicked) {
          throw new Error('Unable to open async virtualized dynamic combobox.');
        }
      }
      await page.waitForTimeout(150);

      let optionCountAfterSearch = await page.locator('[role="option"]').count();
      let containsLuke = await page.locator('[role="option"]', {hasText: 'Luke Skywalker'}).count();
      let ariaExpandedAfterSearch = await input.getAttribute('aria-expanded');

      return {
        ariaExpandedAfterSearch,
        containsLuke: containsLuke > 0,
        optionCountAfterSearch
      };
    }
  },
  {
    id: 'react-aria-components-select--async-virtualized-collection-render-select',
    async run(page) {
      let label = await waitForFirstVisibleLocator(page, [
        '.react-aria-Label',
        'label'
      ], 10000);

      if (!label) {
        throw new Error('Unable to find async virtualized select label.');
      }

      let trigger = await waitForFirstVisibleLocator(page, [
        'button[aria-haspopup="listbox"]'
      ], 10000);

      if (!trigger) {
        throw new Error('Unable to find async virtualized select trigger.');
      }

      let selectValue = page.locator('.react-aria-SelectValue').first();
      let hasSelectValue = await selectValue.count() > 0;

      return {
        ariaExpanded: await trigger.getAttribute('aria-expanded'),
        ariaHasPopup: await trigger.getAttribute('aria-haspopup'),
        labelText: normalizeText(await label.innerText()),
        selectValuePlaceholder: hasSelectValue ? await selectValue.getAttribute('data-placeholder') : null,
        selectValueText: hasSelectValue ? normalizeText(await selectValue.innerText()) : null,
        triggerText: normalizeText(await trigger.innerText())
      };
    }
  },
  {
    id: 'react-aria-components-tree--tree-section-dynamic',
    async run(page) {
      let treeRoot = await waitForFirstVisibleLocator(page, [
        '[role="treegrid"]',
        '.react-aria-Tree',
        '.tree'
      ], 10000);

      if (!treeRoot) {
        throw new Error('Unable to find dynamic tree root.');
      }

      let labelsToCheck = ['Section 1', 'Project 2A', 'Project 2C'];
      let hasLabels = {};

      for (let label of labelsToCheck) {
        hasLabels[label] = (await page.getByText(label, {exact: true}).count()) > 0;
      }

      return {
        hasChevronButtons: (await page.locator('button[slot="chevron"]').count()) > 0,
        hasInfoButtons: (await page.locator('button[aria-label="Info"]').count()) > 0,
        hasLabels,
        hasMenuButtons: (await page.locator('button[aria-label="Menu"]').count()) > 0
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
    await setupDeterministicNetworkMocks(page);
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
