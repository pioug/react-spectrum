import {type AriaToastOptions, type QueuedToast, type ToastAria, type ToastTimer, useToast as useToastInternal, type ToastState as VueToastState} from './useToast';
import {type AriaToastRegionOptions, type ToastRegionAria, type ToastRegionState, useToastRegion as useToastRegionInternal} from './useToastRegion';
import type {ToastState as StatelyToastState} from '@vue-stately/toast';

type FocusableElement = Element;
type RefObject<T> = {
  current: T
};
type ToastState<T = unknown> = StatelyToastState<T>;

export type AriaToastProps<T = unknown> = AriaToastOptions<T>;
export type AriaToastRegionProps = AriaToastRegionOptions;

export type {
  AriaToastOptions,
  ToastAria,
  VueToastState as ToastQueueState,
  ToastTimer,
  QueuedToast,
  AriaToastRegionOptions,
  ToastRegionAria,
  ToastRegionState
};

export function useToast<T>(
  props: AriaToastProps<T>,
  state: ToastState<T>,
  ref: RefObject<FocusableElement | null>
): ToastAria;
export function useToast<T>(options: AriaToastOptions<T>, state: VueToastState<T>): ToastAria;
export function useToast<T>(options: AriaToastOptions<T>, state: VueToastState<T>): ToastAria {
  return useToastInternal(options, state);
}

export function useToastRegion<T>(
  props: AriaToastRegionProps,
  state: ToastState<T>,
  ref: RefObject<HTMLElement | null>
): ToastRegionAria;
export function useToastRegion<T>(options: AriaToastRegionOptions, state: ToastRegionState<T>): ToastRegionAria;
export function useToastRegion<T>(options: AriaToastRegionOptions, state: ToastRegionState<T>): ToastRegionAria {
  return useToastRegionInternal(options, state);
}
