import {ariaHideOutside as ariaHideOutsideInternal} from './ariaHideOutside';
import {FocusScope} from '@vue-aria/focus';
import {useCreateModalProvider} from './modalContext';
import {type AriaModalOptions, type ModalAria, useModal} from './useModal';
import {type AriaModalOverlayOptions, type ModalOverlayAria, useModalOverlay as useModalOverlayInternal} from './useModalOverlay';
import {type AriaOverlayOptions, type OverlayAria, useOverlay as useOverlayInternal} from './useOverlay';
import {type AriaOverlayPositionOptions, type OverlayPlacement, type PositionAria, useOverlayPosition as useOverlayPositionInternal} from './useOverlayPosition';
import {type AriaPopoverOptions, type PopoverAria, usePopover as usePopoverInternal} from './usePopover';
import {computed, defineComponent, h, inject, provide, ref, Teleport, type ComputedRef, type PropType, type Ref, unref} from 'vue';
import type {MaybeRef} from './types';
import {type OverlayTriggerAria, type OverlayTriggerOptions, type OverlayTriggerType, useOverlayTrigger as useOverlayTriggerInternal} from './useOverlayTrigger';
import {type PreventScrollAria, type PreventScrollOptions, usePreventScroll as usePreventScrollInternal} from './usePreventScroll';

export {useModal};
export type {AriaModalOptions, ModalAria, AriaModalOverlayOptions, ModalOverlayAria, AriaOverlayOptions, OverlayAria, AriaOverlayPositionOptions, OverlayPlacement, PositionAria, OverlayTriggerAria, OverlayTriggerOptions, OverlayTriggerType, AriaPopoverOptions, PopoverAria, PreventScrollAria, PreventScrollOptions, MaybeRef};

type AnyRecord = Record<string, unknown>;
type RefObject<T> = {current: T};
type OverlayPortalContainer = Element | string | null | undefined;
export type OverlayTriggerState = {
  close: () => void,
  isOpen: boolean | ComputedRef<boolean> | Ref<boolean>,
  open?: () => void,
  toggle: () => void
};
export type AriaHideOutsideOptions = AnyRecord;

export type AriaModalOverlayProps = Omit<AriaModalOverlayOptions, 'isOpen' | 'modalRef' | 'onClose'>;
export type AriaOverlayProps = Omit<AriaOverlayOptions, 'overlayRef'>;
export type AriaPopoverProps = Omit<AriaPopoverOptions, 'isOpen' | 'onClose'>;
export type AriaPositionProps = AriaOverlayPositionOptions;
export type DismissButtonProps = AnyRecord;
export type ModalProviderAria = {
  modalProviderProps: ComputedRef<{
    'aria-hidden': true | undefined
  }>,
  parent: Ref<unknown>
};
export type ModalProviderProps = AnyRecord;
export type OverlayContainerProps = {
  portalContainer?: OverlayPortalContainer
};
export type OverlayProps = {
  disableFocusManagement?: boolean,
  isExiting?: boolean,
  portalContainer?: OverlayPortalContainer,
  shouldContainFocus?: boolean
};
export type OverlayTriggerProps = Pick<OverlayTriggerOptions, 'type'>;
export type PositionProps = AriaOverlayPositionOptions;
export type PortalProviderProps = {
  getContainer?: (() => Element | null) | null
};
export type PortalProviderContextValue = {
  getContainer?: () => Element | null
};
export type Placement = string;
export type PlacementAxis = 'main' | 'cross';

const portalContextSymbol = Symbol('VueAriaPortalContext');
const overlayContainContextSymbol = Symbol('VueAriaOverlayContainContext');

type OverlayContainContextValue = {
  contain: Ref<boolean>,
  setContain: (contain: boolean) => void
};

function getClosestOverlayContainer(container: Element): Element | null {
  return container.closest('[data-overlay-container]');
}

function resolvePortalContainer(container: OverlayPortalContainer): Element | null {
  if (typeof container === 'string') {
    if (typeof document === 'undefined') {
      return null;
    }

    return document.querySelector(container);
  }

  if (container !== undefined) {
    return container;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return document.body;
}

function toElementRef(refObject: RefObject<Element | null>): Ref<HTMLElement | null> {
  return ref((refObject.current as HTMLElement | null) ?? null);
}

function readIsOpenState(state: OverlayTriggerState): boolean {
  return Boolean(unref((state as AnyRecord).isOpen as boolean | undefined));
}

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
export function useOverlay(
  options: AriaOverlayOptions,
  refObject?: RefObject<Element | null>
): OverlayAria {
  if (refObject) {
    return useOverlayInternal({
      ...options,
      overlayRef: toElementRef(refObject)
    });
  }

  return useOverlayInternal(options);
}

export function useOverlayTrigger(
  props: OverlayTriggerProps,
  state: OverlayTriggerState,
  ref?: RefObject<Element | null>
): OverlayTriggerAria;
export function useOverlayTrigger(options: OverlayTriggerOptions): OverlayTriggerAria;
export function useOverlayTrigger(
  options: OverlayTriggerOptions,
  state?: OverlayTriggerState,
  refObject?: RefObject<Element | null>
): OverlayTriggerAria {
  if (state) {
    let isOpen = computed({
      get: () => readIsOpenState(state),
      set: (nextOpen: boolean) => {
        if (nextOpen === readIsOpenState(state)) {
          return;
        }

        if (nextOpen) {
          if (state.open) {
            state.open();
          } else {
            state.toggle();
          }
          return;
        }

        state.close();
      }
    });

    void refObject;
    return useOverlayTriggerInternal({
      ...options,
      isOpen
    });
  }

  return useOverlayTriggerInternal(options);
}

export function usePopover(props: AriaPopoverProps, state: OverlayTriggerState): PopoverAria;
export function usePopover(options: AriaPopoverOptions): PopoverAria;
export function usePopover(
  options: AriaPopoverOptions,
  state?: OverlayTriggerState
): PopoverAria {
  if (state) {
    return usePopoverInternal({
      ...options,
      isOpen: computed(() => readIsOpenState(state)),
      onClose: state.close
    });
  }

  return usePopoverInternal(options);
}

export function useModalOverlay(
  props: AriaModalOverlayProps,
  state: OverlayTriggerState,
  ref: RefObject<HTMLElement | null>
): ModalOverlayAria;
export function useModalOverlay(options: AriaModalOverlayOptions): ModalOverlayAria;
export function useModalOverlay(
  options: AriaModalOverlayOptions,
  state?: OverlayTriggerState,
  refObject?: RefObject<HTMLElement | null>
): ModalOverlayAria {
  if (state && refObject) {
    return useModalOverlayInternal({
      ...options,
      isOpen: computed(() => readIsOpenState(state)),
      modalRef: ref((refObject.current as HTMLElement | null) ?? null),
      onClose: state.close
    });
  }

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
    useModalProvider();
    return () => slots.default ? slots.default() : null;
  }
});

export const OverlayProvider = defineComponent({
  name: 'VueAriaOverlayProvider',
  inheritAttrs: false,
  setup(_, {attrs, slots}) {
    let {modalProviderProps} = useModalProvider();

    return () => h('div', {
      'data-overlay-container': true,
      ...attrs,
      ...modalProviderProps.value
    }, slots.default ? slots.default() : undefined);
  }
});

export const OverlayContainer = defineComponent({
  name: 'VueAriaOverlayContainer',
  inheritAttrs: false,
  props: {
    portalContainer: {
      type: [String, Object] as PropType<OverlayPortalContainer>,
      default: undefined
    }
  },
  setup(props, {attrs, slots}) {
    let {getContainer} = useUNSAFE_PortalContext();

    return () => {
      let portalContainer: Element | null;
      if (props.portalContainer !== undefined) {
        portalContainer = resolvePortalContainer(props.portalContainer);
      } else if (getContainer) {
        portalContainer = getContainer();
      } else {
        portalContainer = resolvePortalContainer(undefined);
      }

      if (!portalContainer) {
        return null;
      }

      if (getClosestOverlayContainer(portalContainer)) {
        throw new Error('An OverlayContainer must not be inside another container. Please change the portalContainer prop.');
      }

      return h(Teleport, {
        to: portalContainer
      }, [
        h(OverlayProvider, attrs, slots)
      ]);
    };
  }
});

export const Overlay = defineComponent({
  name: 'VueAriaOverlay',
  props: {
    portalContainer: {
      type: [String, Object] as PropType<OverlayPortalContainer>,
      default: undefined
    },
    disableFocusManagement: {
      type: Boolean,
      default: false
    },
    shouldContainFocus: {
      type: Boolean,
      default: false
    },
    isExiting: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {slots}) {
    let contain = ref(false);
    provide<OverlayContainContextValue>(overlayContainContextSymbol, {
      contain,
      setContain: (nextContain: boolean) => {
        contain.value = nextContain;
      }
    });
    let {getContainer} = useUNSAFE_PortalContext();

    return () => {
      let portalContainer: Element | null;
      if (props.portalContainer !== undefined) {
        portalContainer = resolvePortalContainer(props.portalContainer);
      } else if (getContainer) {
        portalContainer = getContainer();
      } else {
        portalContainer = resolvePortalContainer(undefined);
      }

      if (!portalContainer) {
        return null;
      }

      let renderContents = () => slots.default ? slots.default() : null;
      let overlayContents = props.disableFocusManagement
        ? renderContents()
        : h(FocusScope, {
          contain: (props.shouldContainFocus || contain.value) && !props.isExiting,
          restoreFocus: true
        }, {
          default: renderContents
        });

      return h(Teleport, {
        to: portalContainer
      }, [overlayContents]);
    };
  }
});

export const UNSAFE_PortalProvider = defineComponent({
  name: 'VueAriaPortalProvider',
  props: {
    getContainer: {
      type: Function as PropType<(() => Element | null) | null>,
      default: undefined
    }
  },
  setup(props, {slots}) {
    let parentContext = inject<PortalProviderContextValue>(portalContextSymbol, {});

    provide<PortalProviderContextValue>(portalContextSymbol, {
      getContainer() {
        if (props.getContainer === null) {
          return null;
        }

        let getPortalContainer = props.getContainer ?? parentContext.getContainer;
        return getPortalContainer ? getPortalContainer() : null;
      }
    });

    return () => slots.default ? slots.default() : null;
  }
});

export function useModalProvider(): ModalProviderAria {
  let {modalProviderProps, parent} = useCreateModalProvider();
  return {
    modalProviderProps,
    parent: ref(parent)
  };
}

export function useOverlayFocusContain(): void {
  let context = inject<OverlayContainContextValue | null>(overlayContainContextSymbol, null);
  context?.setContain(true);
}

export function useUNSAFE_PortalContext(): PortalProviderContextValue {
  return inject<PortalProviderContextValue>(portalContextSymbol, {});
}
