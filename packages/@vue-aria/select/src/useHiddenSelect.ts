import {computed, type ComputedRef, type Ref, unref} from 'vue';
import type {MaybeRef} from './types';
import type {SelectKey, SelectOption} from './useSelect';

export interface AriaHiddenSelectOptions {
  form?: MaybeRef<string | undefined>,
  isDisabled?: MaybeRef<boolean>,
  name?: MaybeRef<string | undefined>,
  options: MaybeRef<SelectOption[]>,
  onSelectionChange?: (key: SelectKey | null) => void,
  selectedKey: Ref<SelectKey | null>
}

export interface HiddenSelectAria {
  containerProps: ComputedRef<{
    'aria-hidden': true,
    style: {
      left: number,
      position: 'fixed',
      top: number,
      width: number
    }
  }>,
  inputProps: ComputedRef<{
    type: 'hidden',
    value: string
  }>,
  selectProps: ComputedRef<{
    disabled: boolean,
    form?: string,
    name?: string,
    onChange: (valueOrEvent: Event | string) => void,
    options: SelectOption[],
    tabIndex: number,
    value: string
  }>
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useHiddenSelect(options: AriaHiddenSelectOptions): HiddenSelectAria {
  let onChange = (valueOrEvent: Event | string) => {
    if (typeof valueOrEvent === 'string') {
      options.selectedKey.value = valueOrEvent;
      options.onSelectionChange?.(valueOrEvent);
      return;
    }

    let eventTarget = valueOrEvent.target;
    if (eventTarget instanceof HTMLSelectElement) {
      options.selectedKey.value = eventTarget.value;
      options.onSelectionChange?.(eventTarget.value);
    }
  };

  return {
    containerProps: computed(() => ({
      'aria-hidden': true as const,
      style: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: 1
      }
    })),
    inputProps: computed(() => ({
      type: 'hidden' as const,
      value: options.selectedKey.value == null ? '' : String(options.selectedKey.value)
    })),
    selectProps: computed(() => ({
      tabIndex: -1,
      disabled: Boolean(unref(options.isDisabled)),
      name: resolveOptionalString(options.name),
      form: resolveOptionalString(options.form),
      value: options.selectedKey.value == null ? '' : String(options.selectedKey.value),
      options: unref(options.options),
      onChange
    }))
  };
}
