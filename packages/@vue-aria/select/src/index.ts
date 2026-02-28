import {type AriaHiddenSelectOptions, type HiddenSelectAria, useHiddenSelect as useHiddenSelectInternal} from './useHiddenSelect';
import {HiddenSelect} from './HiddenSelect';
import {type SelectKey, type SelectOption, useSelect as useSelectInternal, type AriaSelectOptions as VueAriaSelectOptions, type SelectAria as VueSelectAria} from './useSelect';
import {computed, isRef, type Ref} from 'vue';
import type {SelectState} from '@vue-stately/select';

type SelectionMode = 'multiple' | 'single';
type FocusableElement = Element;
type RefObject<T> = {
  current: T
};
type AnyRecord = Record<string, unknown>;

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

function normalizeSelectKey(value: unknown): SelectKey | null {
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  return null;
}

function getCollectionOptions(stateRecord: AnyRecord): SelectOption[] {
  let resolvedCollection = readMaybeRef<unknown>(stateRecord.collection);
  if (!resolvedCollection || typeof resolvedCollection !== 'object') {
    return [];
  }

  let collectionRecord = resolvedCollection as AnyRecord;
  let selectionManager = (readMaybeRef<unknown>(stateRecord.selectionManager) ?? {}) as AnyRecord;
  let disabledKeys = new Set<unknown>();
  let resolvedDisabledKeys = readMaybeRef<unknown>(stateRecord.disabledKeys);
  if (resolvedDisabledKeys instanceof Set) {
    for (let key of resolvedDisabledKeys) {
      disabledKeys.add(key);
    }
  } else if (resolvedDisabledKeys && typeof resolvedDisabledKeys === 'object' && Symbol.iterator in resolvedDisabledKeys) {
    for (let key of resolvedDisabledKeys as Iterable<unknown>) {
      disabledKeys.add(key);
    }
  }

  let nodes: AnyRecord[] = [];
  if (typeof collectionRecord.getKeys === 'function' && typeof collectionRecord.getItem === 'function') {
    for (let key of collectionRecord.getKeys() as Iterable<unknown>) {
      let node = collectionRecord.getItem(key);
      if (node && typeof node === 'object') {
        nodes.push(node as AnyRecord);
      }
    }
  } else if (Symbol.iterator in collectionRecord) {
    for (let node of collectionRecord as Iterable<unknown>) {
      if (node && typeof node === 'object') {
        nodes.push(node as AnyRecord);
      }
    }
  }

  return nodes
    .filter((node) => node.type == null || node.type === 'item')
    .map((node, index) => {
      let rawKey = node.key ?? index;
      let key = normalizeSelectKey(rawKey) ?? String(rawKey);
      let nodeProps = (node.props && typeof node.props === 'object')
        ? node.props as AnyRecord
        : {};
      let disabledByManager = typeof selectionManager.isDisabled === 'function'
        ? Boolean(selectionManager.isDisabled(rawKey))
        : false;
      let textValue = typeof node.textValue === 'string'
        ? node.textValue
        : String(key);

      return {
        disabled: Boolean(node.isDisabled) || Boolean(nodeProps.isDisabled) || disabledByManager || disabledKeys.has(rawKey),
        key,
        textValue
      };
    });
}

function createSelectedKeyRef(stateRecord: AnyRecord): Ref<SelectKey | null> {
  return computed<SelectKey | null>({
    get: () => normalizeSelectKey(readMaybeRef<unknown>(stateRecord.selectedKey)),
    set: (nextKey) => {
      let setSelectedKey = stateRecord.setSelectedKey;
      if (typeof setSelectedKey === 'function') {
        setSelectedKey(nextKey);
        return;
      }

      let setValue = stateRecord.setValue;
      if (typeof setValue === 'function') {
        setValue(nextKey);
        return;
      }

      writeMaybeRef(stateRecord, 'selectedKey', nextKey);
    }
  }) as Ref<SelectKey | null>;
}

function createIsOpenRef(stateRecord: AnyRecord): Ref<boolean> {
  return computed<boolean>({
    get: () => Boolean(readMaybeRef<unknown>(stateRecord.isOpen)),
    set: (nextOpen) => {
      let open = stateRecord.open;
      let close = stateRecord.close;
      if (nextOpen && typeof open === 'function') {
        open();
        return;
      }

      if (!nextOpen && typeof close === 'function') {
        close();
        return;
      }

      let toggle = stateRecord.toggle;
      if (typeof toggle === 'function') {
        toggle();
        return;
      }

      writeMaybeRef(stateRecord, 'isOpen', nextOpen);
    }
  }) as Ref<boolean>;
}

function readStateIsInvalid(stateRecord: AnyRecord): boolean {
  let isInvalid = readMaybeRef<unknown>(stateRecord.isInvalid);
  if (typeof isInvalid === 'boolean') {
    return isInvalid;
  }

  let displayValidation = stateRecord.displayValidation;
  if (!displayValidation || typeof displayValidation !== 'object') {
    return false;
  }

  let displayValidationRecord = displayValidation as AnyRecord;
  let displayInvalid = readMaybeRef<unknown>(displayValidationRecord.isInvalid);
  return typeof displayInvalid === 'boolean' ? displayInvalid : false;
}

export {HiddenSelect};
export type {AriaHiddenSelectProps, HiddenSelectProps} from './HiddenSelect';
export type {AriaSelectProps} from '@vue-types/select';
export type {MaybeRef} from './types';

export type AriaSelectOptions<T = unknown, M extends SelectionMode = 'single'> = VueAriaSelectOptions;
export type SelectAria<T = unknown, M extends SelectionMode = 'single'> = VueSelectAria;
export type {AriaHiddenSelectOptions, HiddenSelectAria, SelectKey, SelectOption};

export function useSelect<T, M extends SelectionMode = 'single'>(
  props: AriaSelectOptions<T, M>,
  state: SelectState<T, M>,
  ref: RefObject<HTMLElement | null>
): SelectAria<T, M>;
export function useSelect(options?: VueAriaSelectOptions): VueSelectAria;
export function useSelect(
  options?: VueAriaSelectOptions,
  state?: SelectState<unknown, SelectionMode>,
  refObject?: RefObject<HTMLElement | null>
): VueSelectAria {
  if (state) {
    void refObject;
    let stateRecord = state as unknown as AnyRecord;
    let optionsRecord = (options ?? {}) as AnyRecord;
    let stateOptions = computed(() => getCollectionOptions(stateRecord));
    let stateSelectedKey = createSelectedKeyRef(stateRecord);
    let stateIsOpen = createIsOpenRef(stateRecord);

    return useSelectInternal({
      ...(optionsRecord as VueAriaSelectOptions),
      isInvalid: optionsRecord.isInvalid ?? computed(() => readStateIsInvalid(stateRecord)),
      isOpen: optionsRecord.isOpen ?? stateIsOpen,
      options: optionsRecord.options ?? stateOptions,
      selectedKey: optionsRecord.selectedKey ?? stateSelectedKey
    });
  }

  return useSelectInternal(options);
}

export function useHiddenSelect<T, M extends SelectionMode = 'single'>(
  props: AriaHiddenSelectOptions,
  state: SelectState<T, M>,
  triggerRef: RefObject<FocusableElement | null>
): HiddenSelectAria;
export function useHiddenSelect(options: AriaHiddenSelectOptions): HiddenSelectAria;
export function useHiddenSelect(
  options: AriaHiddenSelectOptions,
  state?: SelectState<unknown, SelectionMode>,
  triggerRef?: RefObject<FocusableElement | null>
): HiddenSelectAria {
  if (state) {
    void triggerRef;
    let stateRecord = state as unknown as AnyRecord;
    let optionsRecord = options as AnyRecord;

    return useHiddenSelectInternal({
      form: optionsRecord.form as AriaHiddenSelectOptions['form'],
      isDisabled: optionsRecord.isDisabled as AriaHiddenSelectOptions['isDisabled'],
      name: optionsRecord.name as AriaHiddenSelectOptions['name'],
      onSelectionChange: optionsRecord.onSelectionChange as AriaHiddenSelectOptions['onSelectionChange'],
      options: optionsRecord.options ?? computed(() => getCollectionOptions(stateRecord)),
      selectedKey: optionsRecord.selectedKey ?? createSelectedKeyRef(stateRecord)
    });
  }

  return useHiddenSelectInternal(options);
}
