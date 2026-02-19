import {type PressHookProps, type PressResult, usePress} from './usePress';

export function Pressable(props: PressHookProps = {}): PressResult {
  return usePress(props);
}
