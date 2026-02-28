import {type AriaTooltipOptions, type TooltipAria, type TooltipTriggerStateLike, useTooltip as useTooltipInternal} from './useTooltip';
import type {AriaTooltipProps, TooltipTriggerProps} from '@vue-types/tooltip';
import {type AriaTooltipTriggerOptions, type TooltipTriggerAria, type TooltipTriggerMode, useTooltipTrigger as useTooltipTriggerInternal} from './useTooltipTrigger';
import type {TooltipTriggerState} from '@vue-stately/tooltip';
import {computed} from 'vue';

type FocusableElement = Element;
type RefObject<T> = {
  current: T
};
type AnyRecord = Record<string, unknown>;

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
export function useTooltipTrigger(
  options?: AriaTooltipTriggerOptions,
  state?: TooltipTriggerState,
  refObject?: RefObject<FocusableElement | null>
): TooltipTriggerAria {
  if (state) {
    void refObject;
    let stateRecord = state as AnyRecord;
    return useTooltipTriggerInternal({
      ...options,
      close: (immediate?: boolean) => {
        let close = stateRecord.close;
        if (typeof close === 'function') {
          close(immediate);
          return;
        }

        stateRecord.isOpen = false;
      },
      isOpen: computed<boolean>({
        get: () => Boolean(stateRecord.isOpen),
        set: (isOpen) => {
          stateRecord.isOpen = isOpen;
        }
      }),
      onOpenChange: (isOpen) => {
        let setOpen = stateRecord.setOpen;
        if (typeof setOpen === 'function') {
          setOpen(isOpen);
        }

        options?.onOpenChange?.(isOpen);
      },
      open: (isFocused?: boolean) => {
        let open = stateRecord.open;
        if (typeof open === 'function') {
          open(isFocused);
          return;
        }

        stateRecord.isOpen = true;
      }
    });
  }

  return useTooltipTriggerInternal(options);
}
