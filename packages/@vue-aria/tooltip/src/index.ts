import {type AriaTooltipOptions, type TooltipAria, type TooltipTriggerStateLike, useTooltip as useTooltipInternal} from './useTooltip';
import type {AriaTooltipProps, TooltipTriggerProps} from '@vue-types/tooltip';
import {type AriaTooltipTriggerOptions, type TooltipTriggerAria, type TooltipTriggerMode, useTooltipTrigger as useTooltipTriggerInternal} from './useTooltipTrigger';
import type {TooltipTriggerState} from '@vue-stately/tooltip';

type FocusableElement = Element;
type RefObject<T> = {
  current: T
};

export type {AriaTooltipOptions, TooltipAria, TooltipTriggerStateLike, AriaTooltipTriggerOptions, TooltipTriggerAria, TooltipTriggerMode, AriaTooltipProps, TooltipTriggerProps};

export function useTooltip(props: AriaTooltipProps, state: TooltipTriggerState): TooltipAria;
export function useTooltip(options?: AriaTooltipOptions, state?: TooltipTriggerStateLike): TooltipAria;
export function useTooltip(options?: AriaTooltipOptions, state?: TooltipTriggerStateLike): TooltipAria {
  return useTooltipInternal(options, state);
}

export function useTooltipTrigger(
  props: TooltipTriggerProps,
  state: TooltipTriggerState,
  ref: RefObject<FocusableElement | null>
): TooltipTriggerAria;
export function useTooltipTrigger(options?: AriaTooltipTriggerOptions): TooltipTriggerAria;
export function useTooltipTrigger(options?: AriaTooltipTriggerOptions): TooltipTriggerAria {
  return useTooltipTriggerInternal(options);
}
