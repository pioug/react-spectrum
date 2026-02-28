import {computed, type ComputedRef, type Ref, unref} from 'vue';
import {useControlledState} from '@vue-stately/utils';

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
  let controlledValue = options.value === undefined
    ? undefined
    : computed<string | undefined>(() => toString(unref(options.value)));
  let [value, setValueInternal] = useControlledState(
    controlledValue,
    toString(unref(options.defaultValue)) || '',
    options.onChange
  );

  let setValue = (nextValue: string): void => {
    setValueInternal(nextValue);
  };

  return {
    value,
    setValue
  };
}
