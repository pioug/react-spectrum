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
  let stateValue = ref((value?.value !== undefined ? value.value : defaultValue) as T);
  let valueRef = ref<T>(stateValue.value);
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
        return value.value as T;
      }

      return stateValue.value;
    }
  }) as WritableComputedRef<T>;

  watch(currentValue, (nextValue) => {
    valueRef.value = nextValue;
  }, {flush: 'sync'});

  let setValue = (nextValue: SetValueAction<T>, ...args: unknown[]): void => {
    let resolvedNextValue = typeof nextValue === 'function'
      ? (nextValue as (currentValue: T) => T)(valueRef.value)
      : nextValue;

    if (Object.is(valueRef.value, resolvedNextValue)) {
      return;
    }

    valueRef.value = resolvedNextValue;
    stateValue.value = resolvedNextValue;
    if (isControlled.value) {
      queueMicrotask(() => {
        valueRef.value = currentValue.value;
      });
    }

    onChange?.(resolvedNextValue as unknown as C, ...args);
  };

  return [currentValue, setValue];
}
