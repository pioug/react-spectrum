import {defineComponent, ref} from 'vue';

export {ariaHideOutside} from './ariaHideOutside';
export {useModal} from './useModal';
export type {AriaModalOptions, ModalAria} from './useModal';
export {useModalOverlay} from './useModalOverlay';
export type {AriaModalOverlayOptions, ModalOverlayAria} from './useModalOverlay';
export {useOverlay} from './useOverlay';
export type {AriaOverlayOptions, OverlayAria} from './useOverlay';
export {useOverlayPosition} from './useOverlayPosition';
export type {AriaOverlayPositionOptions, OverlayPlacement, PositionAria} from './useOverlayPosition';
export {useOverlayTrigger} from './useOverlayTrigger';
export type {OverlayTriggerAria, OverlayTriggerOptions, OverlayTriggerType} from './useOverlayTrigger';
export {usePopover} from './usePopover';
export type {AriaPopoverOptions, PopoverAria} from './usePopover';
export {usePreventScroll} from './usePreventScroll';
export type {PreventScrollAria, PreventScrollOptions} from './usePreventScroll';
export type {MaybeRef} from './types';

type AnyRecord = Record<string, unknown>;

export type AriaModalOverlayProps = AnyRecord;
export type AriaOverlayProps = AnyRecord;
export type AriaPopoverProps = AnyRecord;
export type AriaPositionProps = AnyRecord;
export type DismissButtonProps = AnyRecord;
export type ModalProviderAria = AnyRecord;
export type ModalProviderProps = AnyRecord;
export type OverlayContainerProps = AnyRecord;
export type OverlayProps = AnyRecord;
export type OverlayTriggerProps = AnyRecord;
export type PositionProps = AnyRecord;
export type PortalProviderProps = AnyRecord;
export type PortalProviderContextValue = AnyRecord;
export type Placement = string;
export type PlacementAxis = 'main' | 'cross';

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

export function useModalProvider() {
  return {
    modalProviderProps: {},
    parent: ref<unknown>(null)
  };
}

export function useOverlayFocusContain() {
  return {};
}

export function useUNSAFE_PortalContext() {
  return {
    getContainer: () => null
  };
}
