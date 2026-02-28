import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type TabDirection = 'ltr' | 'rtl';
export type TabKey = string;
export type TabKeyboardActivation = 'automatic' | 'manual';
export type TabOrientation = 'horizontal' | 'vertical';

export interface AriaTabListOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  direction?: MaybeRef<TabDirection>,
  disabledKeys?: MaybeRef<Iterable<TabKey>>,
  focusedKey?: Ref<TabKey | null>,
  id?: MaybeRef<string | undefined>,
  isDisabled?: MaybeRef<boolean>,
  keyboardActivation?: MaybeRef<TabKeyboardActivation>,
  onFocusChange?: (key: TabKey | null) => void,
  onSelectionChange?: (key: TabKey) => void,
  orientation?: MaybeRef<TabOrientation>,
  selectedKey?: Ref<TabKey | null>,
  tabs: MaybeRef<Iterable<TabKey>>
}

export interface TabListState {
  containsKey: (key: TabKey) => boolean,
  direction: ComputedRef<TabDirection>,
  disabledKeys: ComputedRef<Set<TabKey>>,
  focusedKey: Ref<TabKey | null>,
  getFirstEnabledKey: () => TabKey | null,
  getNextEnabledKey: (key: TabKey, direction: 'next' | 'prev') => TabKey | null,
  getTabId: (key: TabKey | null | undefined) => string,
  getTabPanelId: (key: TabKey | null | undefined) => string,
  isDisabled: ComputedRef<boolean>,
  isDisabledKey: (key: TabKey) => boolean,
  isSelected: (key: TabKey) => boolean,
  keyboardActivation: ComputedRef<TabKeyboardActivation>,
  orientation: ComputedRef<TabOrientation>,
  selectedKey: Ref<TabKey | null>,
  setFocusedKey: (key: TabKey | null) => void,
  setSelectedKey: (key: TabKey) => void,
  tabs: ComputedRef<TabKey[]>
}

export interface TabListAria {
  state: TabListState,
  tabListProps: ComputedRef<{
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-orientation': TabOrientation,
    id: string,
    onKeyDown: (event: KeyboardEvent) => void,
    role: 'tablist'
  }>
}

let tabListCounter = 0;

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

function normalizeKey(key: TabKey | null | undefined): string {
  if (key == null) {
    return 'item';
  }

  return String(key).replace(/\s+/g, '');
}

function toKeySet(keys: MaybeRef<Iterable<TabKey>> | undefined): Set<TabKey> {
  if (!keys) {
    return new Set();
  }

  let resolved = unref(keys);
  if (!resolved) {
    return new Set();
  }

  return new Set(Array.from(resolved, (key) => String(key)));
}

export function useTabList(options: AriaTabListOptions): TabListAria {
  tabListCounter += 1;

  let tabs = computed(() => Array.from(unref(options.tabs), (key) => String(key)));
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let orientation = computed(() => unref(options.orientation) ?? 'horizontal');
  let keyboardActivation = computed(() => unref(options.keyboardActivation) ?? 'automatic');
  let direction = computed(() => unref(options.direction) ?? 'ltr');
  let disabledKeys = computed(() => toKeySet(options.disabledKeys));
  let selectedKey = options.selectedKey ?? ref<TabKey | null>(null);
  let focusedKey = options.focusedKey ?? ref<TabKey | null>(null);
  let tabListId = computed(() => resolveOptionalString(options.id) ?? `vue-tablist-${tabListCounter}`);
  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']));
  let ariaLabelledby = computed(() => resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']));
  let combinedAriaLabelledBy = computed(() => {
    let ids = new Set<string>();
    if (ariaLabelledby.value) {
      for (let id of ariaLabelledby.value.trim().split(/\s+/)) {
        if (id) {
          ids.add(id);
        }
      }
    }

    if (ariaLabel.value && ids.size > 0) {
      ids.add(tabListId.value);
    }

    return ids.size > 0 ? Array.from(ids).join(' ') : undefined;
  });

  let containsKey = (key: TabKey): boolean => {
    return tabs.value.includes(String(key));
  };

  let isDisabledKey = (key: TabKey): boolean => {
    return isDisabled.value || disabledKeys.value.has(String(key));
  };

  let getEnabledKeys = (): TabKey[] => {
    return tabs.value.filter((key) => !isDisabledKey(key));
  };

  let getFirstEnabledKey = (): TabKey | null => {
    return getEnabledKeys()[0] ?? null;
  };

  let getLastEnabledKey = (): TabKey | null => {
    let enabledKeys = getEnabledKeys();
    return enabledKeys[enabledKeys.length - 1] ?? null;
  };

  let getNextEnabledKey = (key: TabKey, movementDirection: 'next' | 'prev'): TabKey | null => {
    let enabledKeys = getEnabledKeys();
    if (enabledKeys.length === 0) {
      return null;
    }

    let currentIndex = enabledKeys.indexOf(String(key));
    if (currentIndex < 0) {
      return movementDirection === 'next' ? enabledKeys[0] : enabledKeys[enabledKeys.length - 1];
    }

    let step = movementDirection === 'next' ? 1 : -1;
    let nextIndex = (currentIndex + step + enabledKeys.length) % enabledKeys.length;
    return enabledKeys[nextIndex] ?? null;
  };

  let setFocusedKey = (key: TabKey | null) => {
    if (key != null && (!containsKey(key) || isDisabledKey(key))) {
      return;
    }

    let normalizedKey = key == null ? null : String(key);
    if (focusedKey.value === normalizedKey) {
      return;
    }

    focusedKey.value = normalizedKey;
    options.onFocusChange?.(normalizedKey);
  };

  let setSelectedKey = (key: TabKey) => {
    if (!containsKey(key) || isDisabledKey(key)) {
      return;
    }

    let normalizedKey = String(key);
    if (selectedKey.value === normalizedKey) {
      setFocusedKey(normalizedKey);
      return;
    }

    selectedKey.value = normalizedKey;
    setFocusedKey(normalizedKey);
    options.onSelectionChange?.(normalizedKey);
  };

  let isSelected = (key: TabKey) => selectedKey.value === String(key);

  let getTabId = (key: TabKey | null | undefined) => {
    return `${tabListId.value}-tab-${normalizeKey(key)}`;
  };

  let getTabPanelId = (key: TabKey | null | undefined) => {
    return `${tabListId.value}-tabpanel-${normalizeKey(key)}`;
  };

  let onKeyDown = (event: KeyboardEvent) => {
    if (isDisabled.value) {
      return;
    }

    let nextKey: TabKey | null = null;
    let eventKey = event.key;

    if (eventKey === 'Home') {
      nextKey = getFirstEnabledKey();
    } else if (eventKey === 'End') {
      nextKey = getLastEnabledKey();
    } else if (orientation.value === 'horizontal') {
      if (eventKey === 'ArrowRight') {
        nextKey = getNextEnabledKey(focusedKey.value ?? selectedKey.value ?? getFirstEnabledKey() ?? '', direction.value === 'rtl' ? 'prev' : 'next');
      } else if (eventKey === 'ArrowLeft') {
        nextKey = getNextEnabledKey(focusedKey.value ?? selectedKey.value ?? getFirstEnabledKey() ?? '', direction.value === 'rtl' ? 'next' : 'prev');
      }
    } else if (orientation.value === 'vertical') {
      if (eventKey === 'ArrowDown') {
        nextKey = getNextEnabledKey(focusedKey.value ?? selectedKey.value ?? getFirstEnabledKey() ?? '', 'next');
      } else if (eventKey === 'ArrowUp') {
        nextKey = getNextEnabledKey(focusedKey.value ?? selectedKey.value ?? getFirstEnabledKey() ?? '', 'prev');
      }
    }

    if (nextKey != null) {
      event.preventDefault();
      setFocusedKey(nextKey);

      if (keyboardActivation.value === 'automatic') {
        setSelectedKey(nextKey);
      }

      return;
    }

    if (keyboardActivation.value === 'manual' && (eventKey === 'Enter' || eventKey === ' ' || eventKey === 'Spacebar')) {
      if (focusedKey.value != null) {
        event.preventDefault();
        setSelectedKey(focusedKey.value);
      }
    }
  };

  let state: TabListState = {
    containsKey,
    direction,
    disabledKeys,
    focusedKey,
    getFirstEnabledKey,
    getNextEnabledKey,
    getTabId,
    getTabPanelId,
    isDisabled,
    isDisabledKey,
    isSelected,
    keyboardActivation,
    orientation,
    selectedKey,
    setFocusedKey,
    setSelectedKey,
    tabs
  };

  return {
    state,
    tabListProps: computed(() => ({
      id: tabListId.value,
      role: 'tablist' as const,
      'aria-label': ariaLabel.value,
      'aria-labelledby': combinedAriaLabelledBy.value,
      'aria-orientation': orientation.value,
      onKeyDown
    }))
  };
}
