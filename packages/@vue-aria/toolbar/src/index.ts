import type {Ref} from 'vue';
import {useToolbar as useToolbarInternal, type AriaToolbarOptions, type ToolbarAria, type ToolbarOrientation} from './useToolbar';

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
