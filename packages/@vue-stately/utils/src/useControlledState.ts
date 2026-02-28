import {computed, type ComputedRef, type Ref, ref, watch} from 'vue';

export type SetValueAction<T> = T | ((currentValue: T) => T);

type WritableComputedRef<T> = ComputedRef<T> & {value: T};

/**
 * Provides controlled/uncontrolled state with an onChange callback.
 */
export function useControlledState<T, C = T>(
  value: Ref<T | undefined> | undefined,
  defaultValue: T,
  onChange?: (nextValue: C, ...args: unknown[]) => void
): [WritableComputedRef<T>, (nextValue: SetValueAction<T>, ...args: unknown[]) => void] {
  let uncontrolledValue = ref(defaultValue);
  let isControlledRef = ref(value?.value !== undefined);
  let isControlled = computed(() => value?.value !== undefined);

  watch(isControlled, (nextIsControlled) => {
    let wasControlled = isControlledRef.value;
    if (wasControlled !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }

    isControlledRef.value = nextIsControlled;
  });

  let currentValue = computed<T>({
    get: () => {
      if (isControlled.value && value) {
        return value.value;
      }

      return uncontrolledValue.value;
    },
    set: (nextValue) => {
      if (isControlled.value && value) {
        value.value = nextValue;
      } else {
        uncontrolledValue.value = nextValue;
      }
    }
  }) as WritableComputedRef<T>;

  let setValue = (nextValue: SetValueAction<T>, ...args: unknown[]): void => {
    let resolvedNextValue = typeof nextValue === 'function'
      ? (nextValue as (currentValue: T) => T)(currentValue.value)
      : nextValue;

    if (Object.is(currentValue.value, resolvedNextValue)) {
      return;
    }

    currentValue.value = resolvedNextValue;
    onChange?.(resolvedNextValue as unknown as C, ...args);
  };

  return [currentValue, setValue];
}
