import {type ActionGroupAria, type ActionGroupOptions, type ActionGroupSelectionMode, useActionGroup as useActionGroupInternal} from './useActionGroup';
import {type ActionGroupItemAria, type AriaActionGroupItemProps, useActionGroupItem as useActionGroupItemInternal} from './useActionGroupItem';
import {computed, isRef, type Ref} from 'vue';
import type {AriaActionGroupProps} from '@vue-types/actiongroup';
import type {ListState as VueListState} from '@vue-stately/list';

type RefObject<T> = {
  current: T
};
type FocusableElement = Element;
type ListState<T> = VueListState<T>;
type AnyRecord = Record<string, unknown>;

interface ActionGroupStateData {
  disabledKeys?: ActionGroupOptions['disabledKeys'],
  selectedKeys?: ActionGroupOptions['selectedKeys'],
  selectionMode?: ActionGroupOptions['selectionMode']
}

let actionGroupStateData = new WeakMap<object, ActionGroupStateData>();

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

function toStringSet(value: unknown): Set<string> {
  let resolvedValue = readMaybeRef<unknown>(value);
  if (!resolvedValue || resolvedValue === 'all') {
    return new Set();
  }

  if (resolvedValue instanceof Set) {
    return new Set(Array.from(resolvedValue, (entry) => String(entry)));
  }

  if (resolvedValue && typeof resolvedValue === 'object' && Symbol.iterator in resolvedValue) {
    return new Set(Array.from(resolvedValue as Iterable<unknown>, (entry) => String(entry)));
  }

  return new Set();
}

function createSelectedKeysRef(selectionManager: AnyRecord): Ref<Set<string>> {
  return computed<Set<string>>({
    get: () => toStringSet(selectionManager.selectedKeys),
    set: (nextSelectedKeys) => {
      let normalizedKeys = new Set(Array.from(nextSelectedKeys, (key) => String(key)));
      if (typeof selectionManager.setSelectedKeys === 'function') {
        selectionManager.setSelectedKeys(normalizedKeys);
        return;
      }

      writeMaybeRef(selectionManager, 'selectedKeys', normalizedKeys);
    }
  }) as Ref<Set<string>>;
}

function createDisabledKeysRef(stateRecord: AnyRecord): Ref<Set<string>> {
  return computed<Set<string>>(() => toStringSet(stateRecord.disabledKeys)) as Ref<Set<string>>;
}

function createSelectionModeRef(selectionManager: AnyRecord): Ref<ActionGroupSelectionMode> {
  return computed(() => {
    let selectionMode = readMaybeRef<unknown>(selectionManager.selectionMode);
    if (selectionMode === 'single' || selectionMode === 'multiple' || selectionMode === 'none') {
      return selectionMode;
    }

    return 'none';
  }) as Ref<ActionGroupSelectionMode>;
}

function isListStateLike(value: unknown): value is AnyRecord {
  return Boolean(value && typeof value === 'object' && 'selectionManager' in (value as AnyRecord));
}

function createActionGroupFromState(options: ActionGroupOptions | undefined, stateRecord: AnyRecord): ActionGroupAria {
  let selectionManager = (readMaybeRef<unknown>(stateRecord.selectionManager) ?? {}) as AnyRecord;
  let stateData = actionGroupStateData.get(stateRecord as object);
  let mergedOptions = options ?? {};
  return useActionGroupInternal({
    ...mergedOptions,
    disabledKeys: mergedOptions.disabledKeys ?? stateData?.disabledKeys ?? createDisabledKeysRef(stateRecord),
    selectedKeys: mergedOptions.selectedKeys ?? stateData?.selectedKeys ?? createSelectedKeysRef(selectionManager),
    selectionMode: mergedOptions.selectionMode ?? stateData?.selectionMode ?? createSelectionModeRef(selectionManager)
  });
}

export type {ActionGroupAria, ActionGroupOptions, ActionGroupSelectionMode, ActionGroupItemAria, AriaActionGroupItemProps};
export type {AriaActionGroupProps};

export function useActionGroup<T>(
  props: AriaActionGroupProps<T>,
  state: ListState<T>,
  ref: RefObject<FocusableElement | null>
): ActionGroupAria;
export function useActionGroup(options?: ActionGroupOptions): ActionGroupAria;
export function useActionGroup(
  options?: ActionGroupOptions,
  state?: ListState<unknown>,
  refObject?: RefObject<FocusableElement | null>
): ActionGroupAria {
  if (state && isListStateLike(state)) {
    void refObject;
    let stateRecord = state as unknown as AnyRecord;
    actionGroupStateData.set(stateRecord as object, {
      disabledKeys: options?.disabledKeys,
      selectedKeys: options?.selectedKeys,
      selectionMode: options?.selectionMode
    });
    return createActionGroupFromState(options, stateRecord);
  }

  return useActionGroupInternal(options);
}

export function useActionGroupItem<T>(
  props: AriaActionGroupItemProps,
  state: ListState<T>,
  ref: RefObject<FocusableElement | null>
): ActionGroupItemAria;
export function useActionGroupItem(props: AriaActionGroupItemProps): ActionGroupItemAria;
export function useActionGroupItem(
  props: AriaActionGroupItemProps,
  state?: ListState<unknown>,
  refObject?: RefObject<FocusableElement | null>
): ActionGroupItemAria {
  if (state && isListStateLike(state)) {
    void refObject;
    let stateRecord = state as unknown as AnyRecord;
    let selectionManager = (readMaybeRef<unknown>(stateRecord.selectionManager) ?? {}) as AnyRecord;
    let propsRecord = props as unknown as AnyRecord;
    let actionGroup = createActionGroupFromState(undefined, stateRecord);
    return useActionGroupItemInternal({
      actionGroup,
      disabled: propsRecord.disabled as AriaActionGroupItemProps['disabled'],
      key: propsRecord.key as AriaActionGroupItemProps['key'],
      onPress: (key, nextSelectedKeys) => {
        let normalizedKeys = new Set(Array.from(nextSelectedKeys, (entry) => String(entry)));
        if (typeof selectionManager.setSelectedKeys === 'function') {
          selectionManager.setSelectedKeys(normalizedKeys);
        } else {
          writeMaybeRef(selectionManager, 'selectedKeys', normalizedKeys);
        }

        let onPress = propsRecord.onPress;
        if (typeof onPress === 'function') {
          onPress(key, nextSelectedKeys);
        }
      }
    });
  }

  return useActionGroupItemInternal(props);
}
