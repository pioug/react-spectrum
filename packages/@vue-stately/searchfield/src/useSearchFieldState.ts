import {computed, type ComputedRef, type Ref, ref, unref, watch} from 'vue';

function toString(value: unknown): string | undefined {
  if (value == null) {
    return undefined;
  }

  return String(value);
}

export interface SearchFieldStateOptions {
  defaultValue?: unknown,
  onChange?: (value: string) => void,
  value?: Ref<unknown>
}

export interface SearchFieldState {
  value: ComputedRef<string>,
  setValue: (value: string) => void
}

/**
 * Provides state management for search fields.
 */
export function useSearchFieldState(options: SearchFieldStateOptions = {}): SearchFieldState {
  let uncontrolledValue = ref(toString(unref(options.defaultValue)) ?? '');
  let isControlled = computed(() => options.value !== undefined && options.value.value !== undefined);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let value = computed(() => {
    if (isControlled.value) {
      return toString(unref(options.value)) ?? '';
    }

    return uncontrolledValue.value;
  });

  let setValue = (nextValue: string): void => {
    if (nextValue === value.value) {
      return;
    }

    if (!isControlled.value) {
      uncontrolledValue.value = nextValue;
    }

    options.onChange?.(nextValue);
  };

  return {
    value,
    setValue
  };
}
