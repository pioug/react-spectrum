import {type AriaSwitchOptions, type SwitchAria, useSwitch as useSwitchInternal} from './useSwitch';
import type {AriaSwitchProps} from '@vue-types/switch';
import type {ToggleState} from '@vue-stately/toggle';

type RefObject<T> = {
  current: T
};

export type {AriaSwitchOptions, SwitchAria};
export type {AriaSwitchProps} from '@vue-types/switch';

export function useSwitch(
  props: AriaSwitchProps,
  state: ToggleState,
  ref: RefObject<HTMLInputElement | null>
): SwitchAria;
export function useSwitch(
  options: AriaSwitchOptions = {},
  state?: ToggleState,
  refObject?: RefObject<HTMLInputElement | null>
): SwitchAria {
  void state;
  void refObject;
  return useSwitchInternal(options);
}
