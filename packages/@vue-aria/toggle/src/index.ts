import {type AriaToggleOptions, type ToggleAria, type ToggleValidationState, useToggle as useToggleInternal} from './useToggle';
import type {AriaToggleProps} from '@vue-types/checkbox';
import type {ToggleState} from '@vue-stately/toggle';

type RefObject<T> = {
  current: T
};

export type {AriaToggleOptions, ToggleAria, ToggleValidationState};
export type {AriaToggleProps} from '@vue-types/checkbox';

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
