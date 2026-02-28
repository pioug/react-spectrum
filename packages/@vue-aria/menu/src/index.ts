import {type AriaMenuItemProps, type MenuItemAria, useMenuItem as useMenuItemInternal} from './useMenuItem';
import {type AriaMenuTriggerProps, useMenuTrigger as useMenuTriggerInternal, type MenuTriggerAria as VueMenuTriggerAria} from './useMenuTrigger';
import {type AriaSubmenuTriggerProps, useSubmenuTrigger as useSubmenuTriggerInternal, type SubmenuTriggerAria as VueSubmenuTriggerAria} from './useSubmenuTrigger';
import {type MenuAria, useMenu as useMenuInternal, type AriaMenuOptions as VueAriaMenuOptions} from './useMenu';
import {computed, isRef, type Ref} from 'vue';
import type {MenuTriggerState, SubmenuTriggerState} from '@vue-stately/menu';
import type {TreeState as VueTreeState} from '@vue-stately/tree';
import type {MenuKey, SelectionMode} from './types';

type RefObject<T> = {
  current: T
};
type FocusableElement = Element;
type TreeState<T> = VueTreeState<T>;
type AnyRecord = Record<string, unknown>;

let menuStateData = new WeakMap<object, {onAction?: (key: MenuKey) => void}>();

function isMenuAria(value: unknown): value is MenuAria {
  if (!value || typeof value !== 'object') {
    return false;
  }

  let record = value as AnyRecord;
  return 'menuProps' in record && 'toggleSelection' in record;
}

function readMaybeRef<T>(value: unknown): T {
  if (isRef(value)) {
    return value.value as T;
  }

  return value as T;
}

function writeMaybeRef(record: AnyRecord, key: string, nextValue: unknown): void {
  let currentValue = record[key];
  if (isRef(currentValue)) {
    currentValue.value = nextValue;
    return;
  }

  record[key] = nextValue;
}

function toKeySet(value: unknown): Set<MenuKey> {
  let resolvedValue = readMaybeRef<unknown>(value);
  if (!resolvedValue) {
    return new Set();
  }

  if (resolvedValue instanceof Set) {
    return new Set(resolvedValue as Set<MenuKey>);
  }

  if (resolvedValue && typeof resolvedValue === 'object' && Symbol.iterator in resolvedValue) {
    return new Set(Array.from(resolvedValue as Iterable<MenuKey>));
  }

  return new Set();
}

function createSelectedKeysRef(selectionManager: AnyRecord): Ref<Set<MenuKey>> {
  return computed<Set<MenuKey>>({
    get: () => toKeySet(selectionManager.selectedKeys),
    set: (nextSelectedKeys) => {
      let normalizedKeys = new Set(nextSelectedKeys);
      if (typeof selectionManager.setSelectedKeys === 'function') {
        selectionManager.setSelectedKeys(normalizedKeys);
        return;
      }

      writeMaybeRef(selectionManager, 'selectedKeys', normalizedKeys);
    }
  }) as Ref<Set<MenuKey>>;
}

function createSelectionModeRef(selectionManager: AnyRecord): Ref<SelectionMode> {
  return computed(() => {
    let selectionMode = readMaybeRef<unknown>(selectionManager.selectionMode);
    if (selectionMode === 'multiple' || selectionMode === 'single' || selectionMode === 'none') {
      return selectionMode;
    }

    return 'none';
  }) as Ref<SelectionMode>;
}

function createFocusedKeyRef(selectionManager: AnyRecord): Ref<MenuKey | null> {
  return computed<MenuKey | null>({
    get: () => {
      let focusedKey = readMaybeRef<unknown>(selectionManager.focusedKey);
      if (typeof focusedKey === 'string' || typeof focusedKey === 'number') {
        return focusedKey;
      }

      return null;
    },
    set: (nextFocusedKey) => {
      if (typeof selectionManager.setFocused === 'function') {
        selectionManager.setFocused(nextFocusedKey != null);
      }

      if (typeof selectionManager.setFocusedKey === 'function') {
        selectionManager.setFocusedKey(nextFocusedKey);
        return;
      }

      writeMaybeRef(selectionManager, 'focusedKey', nextFocusedKey);
    }
  }) as Ref<MenuKey | null>;
}

function createMenuFromState(options: VueAriaMenuOptions, stateRecord: AnyRecord): MenuAria {
  let selectionManager = (readMaybeRef<unknown>(stateRecord.selectionManager) ?? {}) as AnyRecord;
  let focusedKey = createFocusedKeyRef(selectionManager);
  let stateData = menuStateData.get(stateRecord as object);
  let menu = useMenuInternal({
    ...options,
    onAction: options.onAction ?? stateData?.onAction,
    selectedKeys: createSelectedKeysRef(selectionManager),
    selectionMode: createSelectionModeRef(selectionManager)
  });

  return {
    ...menu,
    focusKey: (key) => {
      focusedKey.value = key;
    },
    focusedKey
  };
}

function resolveCollectionItemAction(
  stateRecord: AnyRecord,
  key: MenuKey
): (() => void) | undefined {
  let collection = readMaybeRef<unknown>(stateRecord.collection);
  if (!collection || typeof collection !== 'object') {
    return undefined;
  }

  let collectionRecord = collection as AnyRecord;
  let getItem = collectionRecord.getItem;
  if (typeof getItem !== 'function') {
    return undefined;
  }

  let node = collectionRecord.getItem(key);
  if (!node || typeof node !== 'object') {
    return undefined;
  }

  let nodeProps = (node as AnyRecord).props;
  if (!nodeProps || typeof nodeProps !== 'object') {
    return undefined;
  }

  let nodeAction = (nodeProps as AnyRecord).onAction;
  return typeof nodeAction === 'function' ? nodeAction as () => void : undefined;
}

function createStateOpenRef(stateRecord: AnyRecord): Ref<boolean> {
  return computed<boolean>({
    get: () => Boolean(readMaybeRef<unknown>(stateRecord.isOpen)),
    set: (nextOpen) => {
      if (typeof stateRecord.setOpen === 'function') {
        stateRecord.setOpen(nextOpen);
        return;
      }

      if (nextOpen && typeof stateRecord.open === 'function') {
        stateRecord.open();
        return;
      }

      if (!nextOpen && typeof stateRecord.close === 'function') {
        stateRecord.close();
        return;
      }

      writeMaybeRef(stateRecord, 'isOpen', nextOpen);
    }
  }) as Ref<boolean>;
}

export type MenuTriggerAria<T = unknown> = VueMenuTriggerAria;
export type AriaMenuOptions<T = unknown> = VueAriaMenuOptions;
export type SubmenuTriggerAria<T = unknown> = VueSubmenuTriggerAria;
export type {AriaMenuTriggerProps, MenuAria, AriaMenuItemProps, MenuItemAria, AriaSubmenuTriggerProps};

export function useMenuTrigger<T>(
  props: AriaMenuTriggerProps,
  state: MenuTriggerState,
  ref: RefObject<Element | null>
): MenuTriggerAria<T>;
export function useMenuTrigger(props?: AriaMenuTriggerProps): VueMenuTriggerAria;
export function useMenuTrigger(
  props?: AriaMenuTriggerProps,
  state?: MenuTriggerState,
  refObject?: RefObject<Element | null>
): VueMenuTriggerAria {
  if (state) {
    void refObject;
    let stateRecord = state as unknown as AnyRecord;
    let propsRecord = (props ?? {}) as AnyRecord;
    return useMenuTriggerInternal({
      ...(propsRecord as AriaMenuTriggerProps),
      isOpen: propsRecord.isOpen ?? createStateOpenRef(stateRecord)
    });
  }

  return useMenuTriggerInternal(props);
}

export function useMenu<T>(
  props: AriaMenuOptions<T>,
  state: TreeState<T>,
  ref: RefObject<HTMLElement | null>
): MenuAria;
export function useMenu(options?: VueAriaMenuOptions): MenuAria;
export function useMenu(
  options?: VueAriaMenuOptions,
  state?: TreeState<unknown>,
  refObject?: RefObject<HTMLElement | null>
): MenuAria {
  if (state) {
    void refObject;
    let stateRecord = state as unknown as AnyRecord;
    let menu = createMenuFromState(options ?? {}, stateRecord);
    let onAction = (options as AnyRecord | undefined)?.onAction;
    if (typeof onAction === 'function') {
      menuStateData.set(stateRecord as object, {onAction: onAction as (key: MenuKey) => void});
    } else {
      menuStateData.delete(stateRecord as object);
    }
    return menu;
  }

  return useMenuInternal(options);
}

export function useMenuItem<T>(
  props: AriaMenuItemProps,
  state: TreeState<T>,
  ref: RefObject<FocusableElement | null>
): MenuItemAria;
export function useMenuItem(props: AriaMenuItemProps, menu: MenuAria): MenuItemAria;
export function useMenuItem(
  props: AriaMenuItemProps,
  stateOrMenu: TreeState<unknown> | MenuAria,
  refObject?: RefObject<FocusableElement | null>
): MenuItemAria {
  if (isMenuAria(stateOrMenu)) {
    void refObject;
    return useMenuItemInternal(props, stateOrMenu);
  }

  let stateRecord = stateOrMenu as unknown as AnyRecord;
  let optionsRecord = props as AnyRecord;
  let key = readMaybeRef<MenuKey>(optionsRecord.key);
  let nodeAction = resolveCollectionItemAction(stateRecord, key);
  let menu = createMenuFromState({
    ariaLabel: 'menu'
  }, stateRecord);

  return useMenuItemInternal({
    ...props,
    onAction: (actionKey) => {
      if (nodeAction) {
        nodeAction();
        return;
      }

      let onAction = optionsRecord.onAction;
      if (typeof onAction === 'function') {
        onAction(actionKey);
      }
    }
  }, menu);
}

export {useMenuSection} from './useMenuSection';
export type {AriaMenuSectionProps, MenuSectionAria} from './useMenuSection';
export type {MenuKey, MaybeRef, SelectionMode} from './types';
export type {AriaMenuProps} from '@vue-types/menu';

export function useSubmenuTrigger<T>(
  props: AriaSubmenuTriggerProps,
  state: SubmenuTriggerState,
  ref: RefObject<FocusableElement | null>
): SubmenuTriggerAria<T>;
export function useSubmenuTrigger(props?: AriaSubmenuTriggerProps): VueSubmenuTriggerAria;
export function useSubmenuTrigger(
  props?: AriaSubmenuTriggerProps,
  state?: SubmenuTriggerState,
  refObject?: RefObject<FocusableElement | null>
): VueSubmenuTriggerAria {
  if (state) {
    void refObject;
    let stateRecord = state as unknown as AnyRecord;
    let propsRecord = (props ?? {}) as AnyRecord;
    return useSubmenuTriggerInternal({
      ...(propsRecord as AriaSubmenuTriggerProps),
      isOpen: propsRecord.isOpen ?? createStateOpenRef(stateRecord)
    });
  }

  return useSubmenuTriggerInternal(props);
}
