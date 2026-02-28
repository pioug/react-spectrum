import type {AriaTabListProps, AriaTabPanelProps, AriaTabProps} from '@vue-types/tabs';
import {type AriaTabOptions, type TabAria, useTab as useTabInternal} from './useTab';
import {type AriaTabPanelOptions, type TabPanelAria, useTabPanel as useTabPanelInternal} from './useTabPanel';
import {type TabListAria, type TabOrientation, useTabList as useTabListInternal, type AriaTabListOptions as VueAriaTabListOptions, type TabListState as VueTabListAriaState} from './useTabList';
import type {TabListState as VueTabListState} from '@vue-stately/tabs';
import {computed, type Ref, unref} from 'vue';

type RefObject<T> = {
  current: T
};
type FocusableElement = Element;
type AnyRecord = Record<string, unknown>;
type Key = string;
type TabListStateRecord = AnyRecord;

let tabListsByState = new WeakMap<object, TabListAria>();

function isRefLike<T>(value: unknown): value is {value: T} {
  return Boolean(value) && typeof value === 'object' && 'value' in (value as AnyRecord);
}

function isVueTabListAriaState(value: unknown): value is VueTabListAriaState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  let record = value as AnyRecord;
  return 'getTabId' in record
    && 'getTabPanelId' in record
    && 'setSelectedKey' in record
    && 'setFocusedKey' in record;
}

function toKey(value: unknown): Key | null {
  if (value == null) {
    return null;
  }

  return String(value);
}

function toKeySet(value: unknown): Set<Key> {
  let resolvedValue = isRefLike<unknown>(value) ? value.value : value;
  if (!resolvedValue || typeof resolvedValue !== 'object') {
    return new Set();
  }

  if (resolvedValue instanceof Set) {
    return new Set(Array.from(resolvedValue, (key) => String(key)));
  }

  if (Array.isArray(resolvedValue)) {
    return new Set(resolvedValue.map((key) => String(key)));
  }

  if (Symbol.iterator in resolvedValue) {
    return new Set(Array.from(resolvedValue as Iterable<unknown>, (key) => String(key)));
  }

  return new Set();
}

function getCollectionKeys(collection: unknown): Key[] {
  let resolvedCollection = isRefLike<unknown>(collection) ? collection.value : collection;
  if (!resolvedCollection || typeof resolvedCollection !== 'object') {
    return [];
  }

  let collectionRecord = resolvedCollection as AnyRecord;
  let getKeys = collectionRecord.getKeys;
  if (typeof getKeys === 'function') {
    return Array.from(getKeys() as Iterable<unknown>, (key) => String(key));
  }

  return [];
}

function createSelectedKeyRef(stateRecord: TabListStateRecord): Ref<Key | null> {
  return computed<Key | null>({
    get: () => {
      let selectedKey = stateRecord.selectedKey;
      if (isRefLike<unknown>(selectedKey)) {
        return toKey(selectedKey.value);
      }

      return toKey(selectedKey);
    },
    set: (nextKey) => {
      let normalizedKey = toKey(nextKey);
      let setSelectedKey = stateRecord.setSelectedKey;
      if (typeof setSelectedKey === 'function') {
        setSelectedKey(normalizedKey);
        return;
      }

      let selectionManager = stateRecord.selectionManager as AnyRecord | undefined;
      let setSelectedKeys = selectionManager?.setSelectedKeys;
      if (typeof setSelectedKeys === 'function') {
        if (normalizedKey == null) {
          setSelectedKeys([]);
        } else {
          setSelectedKeys([normalizedKey]);
        }
        return;
      }

      if (isRefLike<unknown>(stateRecord.selectedKey)) {
        stateRecord.selectedKey.value = normalizedKey;
        return;
      }

      stateRecord.selectedKey = normalizedKey;
    }
  }) as unknown as Ref<Key | null>;
}

function createFocusedKeyRef(stateRecord: TabListStateRecord): Ref<Key | null> {
  return computed<Key | null>({
    get: () => {
      let selectionManager = stateRecord.selectionManager as AnyRecord | undefined;
      let focusedKey = selectionManager?.focusedKey;
      if (isRefLike<unknown>(focusedKey)) {
        return toKey(focusedKey.value);
      }

      return toKey(unref(stateRecord.focusedKey as Key | null | undefined));
    },
    set: (nextKey) => {
      let normalizedKey = toKey(nextKey);
      let selectionManager = stateRecord.selectionManager as AnyRecord | undefined;
      let setFocusedKey = selectionManager?.setFocusedKey;
      if (typeof setFocusedKey === 'function') {
        setFocusedKey(normalizedKey);
        return;
      }

      let setFocusedKeyFromState = stateRecord.setFocusedKey;
      if (typeof setFocusedKeyFromState === 'function') {
        setFocusedKeyFromState(normalizedKey);
        return;
      }

      if (isRefLike<unknown>(stateRecord.focusedKey)) {
        stateRecord.focusedKey.value = normalizedKey;
      }
    }
  }) as unknown as Ref<Key | null>;
}

function createStateTabList(
  state: VueTabListState<unknown>,
  options?: VueAriaTabListOptions
): TabListAria {
  let stateRecord = state as unknown as TabListStateRecord;
  let selectedKey = createSelectedKeyRef(stateRecord);
  let focusedKey = createFocusedKeyRef(stateRecord);
  let mergedDisabledKeys = computed(() => {
    let keys = toKeySet(options?.disabledKeys ? unref(options.disabledKeys) : undefined);
    for (let key of toKeySet(stateRecord.disabledKeys)) {
      keys.add(key);
    }

    let selectionManager = stateRecord.selectionManager as AnyRecord | undefined;
    for (let key of toKeySet(selectionManager?.disabledKeys)) {
      keys.add(key);
    }

    return keys;
  });

  let tabList = useTabListInternal({
    ...options,
    disabledKeys: mergedDisabledKeys,
    focusedKey,
    isDisabled: computed(() => Boolean(unref(options?.isDisabled)) || Boolean(unref(stateRecord.isDisabled as boolean | undefined))),
    selectedKey,
    tabs: computed(() => getCollectionKeys(stateRecord.collection))
  });

  return tabList;
}

function getTabListFromState(
  state: VueTabListState<unknown>,
  options?: VueAriaTabListOptions
): TabListAria {
  let stateObject = state as unknown as object;
  if (!options) {
    let cachedTabList = tabListsByState.get(stateObject);
    if (cachedTabList) {
      return cachedTabList;
    }
  }

  let tabList = createStateTabList(state, options);
  tabListsByState.set(stateObject, tabList);
  return tabList;
}

function getTabAriaState(state: VueTabListState<unknown> | VueTabListAriaState): VueTabListAriaState {
  if (isVueTabListAriaState(state)) {
    return state;
  }

  return getTabListFromState(state).state;
}

export type AriaTabListOptions<T = unknown> = VueAriaTabListOptions;
export type TabListState<T = unknown> = VueTabListState<T>;

export type {
  AriaTabOptions,
  TabAria,
  TabListAria,
  VueTabListAriaState as TabListAriaState,
  TabOrientation,
  AriaTabPanelOptions,
  TabPanelAria
};

export function useTab<T>(
  props: AriaTabProps,
  state: TabListState<T>,
  ref: RefObject<FocusableElement | null>
): TabAria;
export function useTab(options: AriaTabOptions, state: VueTabListAriaState): TabAria;
export function useTab(
  options: AriaTabOptions,
  state: VueTabListAriaState | VueTabListState<unknown>,
  refObject?: RefObject<FocusableElement | null>
): TabAria {
  void refObject;
  return useTabInternal(options, getTabAriaState(state));
}

export function useTabList<T>(
  props: AriaTabListOptions<T>,
  state: TabListState<T>,
  ref: RefObject<HTMLElement | null>
): TabListAria;
export function useTabList(options: VueAriaTabListOptions): TabListAria;
export function useTabList(
  options: VueAriaTabListOptions,
  state?: VueTabListState<unknown>,
  refObject?: RefObject<HTMLElement | null>
): TabListAria {
  void refObject;
  if (state) {
    return getTabListFromState(state, options);
  }

  return useTabListInternal(options);
}

export function useTabPanel<T>(
  props: AriaTabPanelProps,
  state: TabListState<T> | null,
  ref: RefObject<Element | null>
): TabPanelAria;
export function useTabPanel(options: AriaTabPanelOptions, state: VueTabListAriaState | null): TabPanelAria;
export function useTabPanel(
  options: AriaTabPanelOptions,
  state: VueTabListAriaState | VueTabListState<unknown> | null,
  refObject?: RefObject<Element | null>
): TabPanelAria {
  void refObject;
  return useTabPanelInternal(options, state ? getTabAriaState(state) : null);
}

export type {AriaTabListProps, AriaTabPanelProps, AriaTabProps} from '@vue-types/tabs';
export type {Orientation} from '@vue-types/shared';
