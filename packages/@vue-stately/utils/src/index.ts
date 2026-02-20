import {clamp, roundToStepPrecision, snapValueToStep, toFixedNumber} from './number';
import {useControlledState as useControlledStateInternal, type SetValueAction} from './useControlledState';
import {isRef, ref, type Ref} from 'vue';

type SetStateAction<T> = SetValueAction<T>;

export type {SetValueAction};
export {clamp, roundToStepPrecision, snapValueToStep, toFixedNumber};

export function useControlledState<T, C = T>(
  value: Exclude<T, undefined>,
  defaultValue: Exclude<T, undefined> | undefined,
  onChange?: (v: C, ...args: any[]) => void
): [T, (value: SetStateAction<T>, ...args: any[]) => void];
export function useControlledState<T, C = T>(
  value: Exclude<T, undefined> | undefined,
  defaultValue: Exclude<T, undefined>,
  onChange?: (v: C, ...args: any[]) => void
): [T, (value: SetStateAction<T>, ...args: any[]) => void];
export function useControlledState<T, C = T>(
  value: T,
  defaultValue: T,
  onChange?: (v: C, ...args: any[]) => void
): [T, (value: SetStateAction<T>, ...args: any[]) => void] {
  let valueRef: Ref<T | undefined> | undefined;
  if (isRef(value)) {
    valueRef = value as Ref<T | undefined>;
  } else if (value === undefined) {
    valueRef = undefined;
  } else {
    valueRef = ref(value) as Ref<T | undefined>;
  }

  let resolvedDefaultValue = (defaultValue === undefined ? value : defaultValue) as T;
  let [currentValue, setValue] = useControlledStateInternal(
    valueRef,
    resolvedDefaultValue,
    onChange as ((nextValue: C, ...args: unknown[]) => void) | undefined
  );

  let setState = (nextValue: SetStateAction<T>, ...args: any[]): void => {
    setValue(nextValue as SetValueAction<T>, ...args);
  };

  return [currentValue as unknown as T, setState];
}
