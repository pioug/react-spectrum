import {useSwitch as useSwitchInternal, type AriaSwitchOptions, type SwitchAria} from './useSwitch';
import type {ToggleState} from '@vue-stately/toggle';
import type {AriaSwitchProps} from '@react-types/switch';

type RefObject<T> = {
  current: T
};

export type {AriaSwitchOptions, SwitchAria};
export type {AriaSwitchProps} from '@react-types/switch';

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
