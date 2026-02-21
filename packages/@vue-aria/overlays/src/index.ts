import {ariaHideOutside as ariaHideOutsideInternal} from './ariaHideOutside';
import {type AriaModalOptions, type ModalAria, useModal} from './useModal';
import {type AriaModalOverlayOptions, type ModalOverlayAria, useModalOverlay as useModalOverlayInternal} from './useModalOverlay';
import {type AriaOverlayOptions, type OverlayAria, useOverlay as useOverlayInternal} from './useOverlay';
import {type AriaOverlayPositionOptions, type OverlayPlacement, type PositionAria, useOverlayPosition as useOverlayPositionInternal} from './useOverlayPosition';
import {type AriaPopoverOptions, type PopoverAria, usePopover as usePopoverInternal} from './usePopover';
import {defineComponent, ref, type Ref} from 'vue';
import type {MaybeRef} from './types';
import {type OverlayTriggerAria, type OverlayTriggerOptions, type OverlayTriggerType, useOverlayTrigger as useOverlayTriggerInternal} from './useOverlayTrigger';
import {type PreventScrollAria, type PreventScrollOptions, usePreventScroll as usePreventScrollInternal} from './usePreventScroll';

export {useModal};
export type {AriaModalOptions, ModalAria, AriaModalOverlayOptions, ModalOverlayAria, AriaOverlayOptions, OverlayAria, AriaOverlayPositionOptions, OverlayPlacement, PositionAria, OverlayTriggerAria, OverlayTriggerOptions, OverlayTriggerType, AriaPopoverOptions, PopoverAria, PreventScrollAria, PreventScrollOptions, MaybeRef};

type AnyRecord = Record<string, unknown>;
type RefObject<T> = {current: T};
export type OverlayTriggerState = AnyRecord;
export type AriaHideOutsideOptions = AnyRecord;

export type AriaModalOverlayProps = AriaModalOverlayOptions;
export type AriaOverlayProps = AriaOverlayOptions;
export type AriaPopoverProps = AriaPopoverOptions;
export type AriaPositionProps = AriaOverlayPositionOptions;
export type DismissButtonProps = AnyRecord;
export type ModalProviderAria = {
  modalProviderProps: AnyRecord,
  parent: Ref<unknown>
};
export type ModalProviderProps = AnyRecord;
export type OverlayContainerProps = AnyRecord;
export type OverlayProps = AnyRecord;
export type OverlayTriggerProps = OverlayTriggerOptions;
export type PositionProps = AriaOverlayPositionOptions;
export type PortalProviderProps = AnyRecord;
export type PortalProviderContextValue = {
  getContainer: () => Element | null
};
export type Placement = string;
export type PlacementAxis = 'main' | 'cross';

export function ariaHideOutside(targets: Element[], options?: AriaHideOutsideOptions | Element): () => void;
export function ariaHideOutside(targets: Array<Element | null | undefined>): () => void;
export function ariaHideOutside(
  targets: Array<Element | null | undefined>,
  _options?: AriaHideOutsideOptions | Element
): () => void {
  return ariaHideOutsideInternal(targets);
}

export function useOverlayPosition(props: AriaPositionProps): PositionAria;
export function useOverlayPosition(options: AriaOverlayPositionOptions): PositionAria;
export function useOverlayPosition(options: AriaOverlayPositionOptions): PositionAria {
  return useOverlayPositionInternal(options);
}

export function useOverlay(props: AriaOverlayProps, ref: RefObject<Element | null>): OverlayAria;
export function useOverlay(options: AriaOverlayOptions): OverlayAria;
export function useOverlay(options: AriaOverlayOptions): OverlayAria {
  return useOverlayInternal(options);
}

export function useOverlayTrigger(
  props: OverlayTriggerProps,
  state: OverlayTriggerState,
  ref: RefObject<Element | null>
): OverlayTriggerAria;
export function useOverlayTrigger(options: OverlayTriggerOptions): OverlayTriggerAria;
export function useOverlayTrigger(options: OverlayTriggerOptions): OverlayTriggerAria {
  return useOverlayTriggerInternal(options);
}

export function usePopover(props: AriaPopoverProps, state: OverlayTriggerState): PopoverAria;
export function usePopover(options: AriaPopoverOptions): PopoverAria;
export function usePopover(options: AriaPopoverOptions): PopoverAria {
  return usePopoverInternal(options);
}

export function useModalOverlay(
  props: AriaModalOverlayProps,
  state: OverlayTriggerState,
  ref: RefObject<HTMLElement | null>
): ModalOverlayAria;
export function useModalOverlay(options: AriaModalOverlayOptions): ModalOverlayAria;
export function useModalOverlay(options: AriaModalOverlayOptions): ModalOverlayAria {
  return useModalOverlayInternal(options);
}

export function usePreventScroll(options: PreventScrollOptions): void;
export function usePreventScroll(options?: PreventScrollOptions): PreventScrollAria;
export function usePreventScroll(options: PreventScrollOptions = {}): PreventScrollAria {
  return usePreventScrollInternal(options);
}

export const DismissButton = defineComponent({
  name: 'VueAriaDismissButton',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export const ModalProvider = defineComponent({
  name: 'VueAriaModalProvider',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export const OverlayProvider = defineComponent({
  name: 'VueAriaOverlayProvider',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export const OverlayContainer = defineComponent({
  name: 'VueAriaOverlayContainer',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export const Overlay = defineComponent({
  name: 'VueAriaOverlay',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export const UNSAFE_PortalProvider = defineComponent({
  name: 'VueAriaPortalProvider',
  setup(_, {slots}) {
    return () => slots.default ? slots.default() : null;
  }
});

export function useModalProvider(): ModalProviderAria {
  return {
    modalProviderProps: {},
    parent: ref<unknown>(null)
  };
}

export function useOverlayFocusContain(): void {
  // Compatibility no-op.
}

export function useUNSAFE_PortalContext(): PortalProviderContextValue {
  return {
    getContainer: () => null
  };
}
