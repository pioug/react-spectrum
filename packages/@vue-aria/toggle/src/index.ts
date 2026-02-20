import {useToggle as useToggleInternal, type AriaToggleOptions, type ToggleAria, type ToggleValidationState} from './useToggle';
import type {ToggleState} from '@vue-stately/toggle';
import type {AriaToggleProps} from '@react-types/checkbox';

type RefObject<T> = {
  current: T
};

export type {AriaToggleOptions, ToggleAria, ToggleValidationState};
export type {AriaToggleProps} from '@react-types/checkbox';

export function useToggle(
  props: AriaToggleProps,
  state: ToggleState,
  ref: RefObject<HTMLInputElement | null>
): ToggleAria;
export function useToggle(
  options: AriaToggleOptions = {},
  state?: ToggleState,
  refObject?: RefObject<HTMLInputElement | null>
): ToggleAria {
  void state;
  void refObject;
  return useToggleInternal(options);
}
