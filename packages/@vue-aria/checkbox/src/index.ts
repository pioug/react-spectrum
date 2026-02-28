import {type AriaCheckboxGroupItemOptions, useCheckboxGroupItem as useCheckboxGroupItemInternal} from './useCheckboxGroupItem';
import type {AriaCheckboxGroupItemProps, AriaCheckboxGroupProps, AriaCheckboxProps} from '@vue-types/checkbox';
import {type AriaCheckboxGroupOptions, type CheckboxGroupAria, useCheckboxGroup as useCheckboxGroupInternal} from './useCheckboxGroup';
import {type AriaCheckboxOptions, type CheckboxAria, useCheckbox as useCheckboxInternal} from './useCheckbox';
import type {CheckboxGroupState} from '@vue-stately/checkbox';
import type {ToggleState} from '@vue-stately/toggle';
import {computed, unref} from 'vue';

type RefObject<T> = {
  current: T
};

type AnyRecord = Record<string, unknown>;

function toValueSet(values: unknown): Set<string> {
  if (!values || typeof values !== 'object') {
    return new Set();
  }

  if (values instanceof Set) {
    return new Set(Array.from(values, (value) => String(value)));
  }

  if (Array.isArray(values)) {
    return new Set(values.map((value) => String(value)));
  }

  if (Symbol.iterator in values) {
    return new Set(Array.from(values as Iterable<unknown>, (value) => String(value)));
  }

  return new Set();
}

function applyGroupSelection(stateRecord: AnyRecord, nextValues: Set<string>): void {
  let setValue = stateRecord.setValue;
  if (typeof setValue === 'function') {
    setValue(Array.from(nextValues));
    return;
  }

  let previousValues = toValueSet(stateRecord.selectedValues ?? stateRecord.value);
  let removeValue = stateRecord.removeValue;
  if (typeof removeValue === 'function') {
    for (let value of previousValues) {
      if (!nextValues.has(value)) {
        removeValue(value);
      }
    }
  }

  let addValue = stateRecord.addValue;
  if (typeof addValue === 'function') {
    for (let value of nextValues) {
      if (!previousValues.has(value)) {
        addValue(value);
      }
    }
    return;
  }

  let setSelectedValues = stateRecord.setSelectedValues;
  if (typeof setSelectedValues === 'function') {
    setSelectedValues(new Set(nextValues));
    return;
  }

  stateRecord.selectedValues = new Set(nextValues);
}

export type {AriaCheckboxGroupItemProps, AriaCheckboxGroupProps, AriaCheckboxProps} from '@vue-types/checkbox';
export type {AriaCheckboxOptions, CheckboxAria, AriaCheckboxGroupOptions, CheckboxGroupAria, AriaCheckboxGroupItemOptions};

export function useCheckbox(
  props: AriaCheckboxProps,
  state: ToggleState,
  ref: RefObject<HTMLInputElement | null>
): CheckboxAria;
export function useCheckbox(options?: AriaCheckboxOptions): CheckboxAria;
export function useCheckbox(
  options?: AriaCheckboxOptions,
  state?: ToggleState,
  refObject?: RefObject<HTMLInputElement | null>
): CheckboxAria {
  void refObject;
  if (state) {
    let stateRecord = state as AnyRecord;
    return useCheckboxInternal({
      ...options,
      isSelected: computed(() => Boolean(stateRecord.isSelected)),
      setSelected: (isSelected) => {
        if (Boolean(stateRecord.isSelected) === isSelected) {
          return;
        }

        let toggle = stateRecord.toggle;
        if (typeof toggle === 'function') {
          toggle();
          return;
        }

        let setSelected = stateRecord.setSelected;
        if (typeof setSelected === 'function') {
          setSelected(isSelected);
          return;
        }

        stateRecord.isSelected = isSelected;
      }
    });
  }

  return useCheckboxInternal(options);
}

export function useCheckboxGroup(props: AriaCheckboxGroupProps, state: CheckboxGroupState): CheckboxGroupAria;
export function useCheckboxGroup(options?: AriaCheckboxGroupOptions): CheckboxGroupAria;
export function useCheckboxGroup(
  options?: AriaCheckboxGroupOptions,
  state?: CheckboxGroupState
): CheckboxGroupAria {
  if (state) {
    let stateRecord = state as AnyRecord;
    let selectedValues = computed<Set<string>>({
      get: () => toValueSet(stateRecord.selectedValues ?? stateRecord.value),
      set: (nextValues) => {
        applyGroupSelection(stateRecord, new Set(nextValues));
      }
    });

    return useCheckboxGroupInternal({
      ...options,
      isDisabled: computed(() => Boolean(unref(options?.isDisabled)) || Boolean(stateRecord.isDisabled)),
      isReadOnly: computed(() => Boolean(unref(options?.isReadOnly)) || Boolean(stateRecord.isReadOnly)),
      isRequired: computed(() => Boolean(unref(options?.isRequired)) || Boolean(stateRecord.isRequired)),
      name: computed(() => (unref(options?.name) as string | undefined) ?? (stateRecord.name as string | undefined)),
      selectedValues
    });
  }

  return useCheckboxGroupInternal(options);
}

export function useCheckboxGroupItem(
  props: AriaCheckboxGroupItemProps,
  state: CheckboxGroupState,
  ref: RefObject<HTMLInputElement | null>
): CheckboxAria;
export function useCheckboxGroupItem(options: AriaCheckboxGroupItemOptions): CheckboxAria;
export function useCheckboxGroupItem(
  options: AriaCheckboxGroupItemOptions,
  state?: CheckboxGroupState,
  refObject?: RefObject<HTMLInputElement | null>
): CheckboxAria {
  if (state) {
    void refObject;
    return useCheckboxGroupItemInternal({
      ...options,
      group: useCheckboxGroup({}, state),
      value: String((options as AnyRecord).value ?? '')
    });
  }

  return useCheckboxGroupItemInternal(options);
}
