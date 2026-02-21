import {type AriaToolbarOptions, type ToolbarAria, type ToolbarOrientation, useToolbar as useToolbarInternal} from './useToolbar';
import type {Ref} from 'vue';

type RefObject<T> = {
  current: T
};

export interface AriaToolbarProps extends AriaToolbarOptions {}

export type {AriaToolbarOptions, ToolbarAria, ToolbarOrientation};

export function useToolbar(
  props: AriaToolbarProps,
  ref: RefObject<HTMLElement | null>
): ToolbarAria;
export function useToolbar(options?: AriaToolbarOptions, refArg?: Ref<HTMLElement | null>): ToolbarAria;
export function useToolbar(options?: AriaToolbarOptions, refArg?: Ref<HTMLElement | null>): ToolbarAria {
  return useToolbarInternal(options, refArg);
}
