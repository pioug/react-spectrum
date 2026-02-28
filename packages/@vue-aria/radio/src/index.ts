import {type AriaRadioGroupOptions, type RadioGroupAria, useRadioGroup as useRadioGroupInternal} from './useRadioGroup';
import type {AriaRadioGroupProps, AriaRadioProps} from '@vue-types/radio';
import {type AriaRadioOptions, type RadioAria, useRadio as useRadioInternal} from './useRadio';
import type {RadioGroupState} from '@vue-stately/radio';
import {computed, unref} from 'vue';

type RefObject<T> = {
  current: T
};

type AnyRecord = Record<string, unknown>;

function isRefLike<T>(value: unknown): value is {value: T} {
  return Boolean(value) && typeof value === 'object' && 'value' in (value as AnyRecord);
}

let radioGroupsByState = new WeakMap<object, RadioGroupAria>();

function isRadioGroupAria(value: unknown): value is RadioGroupAria {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return 'radioGroupProps' in (value as AnyRecord) && 'registerOption' in (value as AnyRecord);
}

function createRadioGroupFromState(
  stateRecord: AnyRecord,
  options?: AriaRadioGroupOptions
): RadioGroupAria {
  let selectedValue = computed<string | null>({
    get: () => {
      let value = unref(stateRecord.selectedValue as string | null | {value: string | null} | undefined);
      return value == null ? null : String(value);
    },
    set: (value) => {
      let setSelectedValue = stateRecord.setSelectedValue;
      if (typeof setSelectedValue === 'function') {
        setSelectedValue(value);
        return;
      }

      if (isRefLike<string | null>(stateRecord.selectedValue)) {
        stateRecord.selectedValue.value = value;
        return;
      }

      stateRecord.selectedValue = value;
    }
  });

  return useRadioGroupInternal({
    ...options,
    isDisabled: computed(() => Boolean(unref(options?.isDisabled)) || Boolean(unref(stateRecord.isDisabled as boolean | undefined))),
    isInvalid: computed(() => Boolean(unref(options?.isInvalid)) || Boolean(unref(stateRecord.isInvalid as boolean | undefined))),
    isReadOnly: computed(() => Boolean(unref(options?.isReadOnly)) || Boolean(unref(stateRecord.isReadOnly as boolean | undefined))),
    isRequired: computed(() => Boolean(unref(options?.isRequired)) || Boolean(unref(stateRecord.isRequired as boolean | undefined))),
    name: computed(() => (unref(options?.name) as string | undefined) ?? (unref(stateRecord.name as string | undefined | {value: string | undefined}) as string | undefined)),
    selectedValue
  });
}

function getStateRadioGroup(
  state: RadioGroupState,
  options?: AriaRadioGroupOptions
): RadioGroupAria {
  let stateObject = state as unknown as object;
  if (!options) {
    let cached = radioGroupsByState.get(stateObject);
    if (cached) {
      return cached;
    }
  }

  let stateRecord = state as AnyRecord;
  let nextGroup = createRadioGroupFromState(stateRecord, options);
  radioGroupsByState.set(stateObject, nextGroup);
  return nextGroup;
}

export type {AriaRadioOptions, RadioAria, AriaRadioGroupOptions, RadioGroupAria};
export type {MaybeRef} from './types';
export type {AriaRadioGroupProps, AriaRadioProps};
export type {Orientation} from '@vue-types/shared';

export function useRadio(
  props: AriaRadioProps,
  state: RadioGroupState,
  ref: RefObject<HTMLInputElement | null>
): RadioAria;
export function useRadio(options: AriaRadioOptions, group: RadioGroupAria): RadioAria;
export function useRadio(
  options: AriaRadioOptions,
  groupOrState: RadioGroupAria | RadioGroupState,
  refObject?: RefObject<HTMLInputElement | null>
): RadioAria {
  void refObject;
  if (!isRadioGroupAria(groupOrState)) {
    return useRadioInternal({
      ...options,
      value: computed(() => String(unref(options.value)))
    }, getStateRadioGroup(groupOrState));
  }

  return useRadioInternal(options, groupOrState);
}

export function useRadioGroup(props: AriaRadioGroupProps, state: RadioGroupState): RadioGroupAria;
export function useRadioGroup(options?: AriaRadioGroupOptions): RadioGroupAria;
export function useRadioGroup(
  options?: AriaRadioGroupOptions,
  state?: RadioGroupState
): RadioGroupAria {
  if (state) {
    return getStateRadioGroup(state, options);
  }

  return useRadioGroupInternal(options);
}
