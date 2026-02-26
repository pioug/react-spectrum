import '@adobe/spectrum-css-temp/components/modal/vars.css';
import '@adobe/spectrum-css-temp/components/popover/vars.css';
import '@adobe/spectrum-css-temp/components/tray/vars.css';
import '@adobe/spectrum-css-temp/components/underlay/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, type PropType, ref, Teleport, Transition, watch} from 'vue';
import './overlays.css';
const modalStyles: {[key: string]: string} = {};
const popoverStyles: {[key: string]: string} = {};
const trayStyles: {[key: string]: string} = {};
const underlayStyles: {[key: string]: string} = {};


type OverlayContainer = string | Element | ShadowRoot | null | undefined;
type ModalType = 'modal' | 'fullscreen' | 'fullscreenTakeover';
type PopoverPlacement = 'top' | 'right' | 'bottom' | 'left';

type OverlayStateLike = {
  isOpen?: boolean,
  close?: () => void
};

type LifecycleHandler = (() => void) | undefined;

let popoverArrowPlacement: Record<PopoverPlacement, 'bottom' | 'right'> = {
  bottom: 'bottom',
  left: 'right',
  right: 'right',
  top: 'bottom'
};

let modalTypeMap: Record<ModalType, string | undefined> = {
  fullscreen: 'fullscreen',
  fullscreenTakeover: 'fullscreenTakeover',
  modal: undefined
};

function invokeLifecycle(handler: LifecycleHandler) {
  handler?.();
}

function useViewportHeight() {
  let viewportHeight = ref(typeof window === 'undefined' ? 0 : (window.visualViewport?.height ?? window.innerHeight));

  let updateViewportHeight = () => {
    if (typeof window === 'undefined') {
      return;
    }

    viewportHeight.value = window.visualViewport?.height ?? window.innerHeight;
  };

  onMounted(() => {
    updateViewportHeight();
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('resize', updateViewportHeight);
    window.visualViewport?.addEventListener('resize', updateViewportHeight);
  });

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('resize', updateViewportHeight);
    window.visualViewport?.removeEventListener('resize', updateViewportHeight);
  });

  return viewportHeight;
}

function resolveOpenState(
  props: {
    isOpen?: boolean,
    open?: boolean,
    state?: OverlayStateLike
  }
) {
  if (props.isOpen !== undefined) {
    return props.isOpen;
  }

  if (props.open !== undefined) {
    return props.open;
  }

  return props.state?.isOpen ?? false;
}

function resolveDismissableState(
  props: {
    isDismissable?: boolean,
    dismissable?: boolean
  }
) {
  if (props.isDismissable !== undefined) {
    return props.isDismissable;
  }

  return props.dismissable ?? true;
}

function renderPopoverArrow(placement: PopoverPlacement) {
  let size = 20;
  let borderWidth = 1;
  let borderDiagonal = borderWidth * Math.SQRT2;
  let primary = size + borderDiagonal;
  let secondary = primary * 2;
  let isLandscape = popoverArrowPlacement[placement] === 'bottom';
  let halfBorderDiagonal = borderDiagonal / 2;

  let primaryStart = 0;
  let primaryEnd = primary - halfBorderDiagonal;

  let secondaryStart = halfBorderDiagonal;
  let secondaryMiddle = secondary / 2;
  let secondaryEnd = secondary - halfBorderDiagonal;

  let pathData = isLandscape
    ? [
      'M', secondaryStart, primaryStart,
      'L', secondaryMiddle, primaryEnd,
      'L', secondaryEnd, primaryStart
    ]
    : [
      'M', primaryStart, secondaryStart,
      'L', primaryEnd, secondaryMiddle,
      'L', primaryStart, secondaryEnd
    ];

  return h('svg', {
    class: classNames(popoverStyles, 'spectrum-Popover-tip'),
    height: Math.ceil(isLandscape ? primary : secondary),
    width: Math.ceil(isLandscape ? secondary : primary),
    xmlns: 'http://www.w3.org/2000/svg'
  }, [
    h('path', {
      class: classNames(popoverStyles, 'spectrum-Popover-tip-triangle'),
      d: pathData.join(' ')
    })
  ]);
}

export const OpenTransition = defineComponent({
  name: 'VueOpenTransition',
  props: {
    appear: {
      type: Boolean,
      default: false
    },
    in: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {slots}) {
    return () => h(Transition, {
      appear: props.appear,
      name: 'vs-open-transition'
    }, () => (props.in ? slots.default?.() : null));
  }
});

export const Overlay = defineComponent({
  name: 'VueOverlay',
  inheritAttrs: false,
  props: {
    container: {
      type: [String, Object] as PropType<OverlayContainer>,
      default: undefined
    },
    isOpen: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    onEnter: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onEntered: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onEntering: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onExit: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onExited: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onExiting: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    open: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs, slots}) {
    let resolvedContainer = computed<OverlayContainer>(() => {
      if (props.container !== undefined && props.container !== null) {
        return props.container;
      }

      if (typeof document === 'undefined') {
        return 'body';
      }

      return document.querySelector('.vs-provider') ?? 'body';
    });

    let resolvedIsOpen = computed(() => resolveOpenState(props));
    let exited = ref(!resolvedIsOpen.value);
    let exitTimer: ReturnType<typeof setTimeout> | null = null;

    let clearExitTimer = () => {
      if (!exitTimer) {
        return;
      }

      clearTimeout(exitTimer);
      exitTimer = null;
    };

    watch(resolvedIsOpen, (isOpen, wasOpen) => {
      if (isOpen) {
        clearExitTimer();
        if (exited.value || !wasOpen) {
          invokeLifecycle(props.onEnter);
          invokeLifecycle(props.onEntering);
        }

        exited.value = false;
        nextTick(() => invokeLifecycle(props.onEntered));
        return;
      }

      if (exited.value) {
        return;
      }

      invokeLifecycle(props.onExit);
      invokeLifecycle(props.onExiting);
      clearExitTimer();
      exitTimer = setTimeout(() => {
        exited.value = true;
        invokeLifecycle(props.onExited);
        exitTimer = null;
      }, 350);
    }, {immediate: true});

    onBeforeUnmount(() => {
      clearExitTimer();
    });

    let shouldRender = computed(() => resolvedIsOpen.value || !exited.value);

    return () => {
      if (!shouldRender.value) {
        return null;
      }

      let content = h('div', {
        ...attrs,
        class: ['vs-overlay', attrs.class],
        'data-vac': '',
        style: [
          {
            background: 'transparent',
            isolation: 'isolate'
          },
          attrs.style
        ]
      }, slots.default ? slots.default() : []);

      return h(Teleport, {to: resolvedContainer.value ?? 'body'}, [content]);
    };
  }
});

export const Underlay = defineComponent({
  name: 'VueUnderlay',
  inheritAttrs: false,
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    isTransparent: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {attrs}) {
    return () => {
      let pageHeight: string | undefined;

      if (typeof document !== 'undefined') {
        let scrollingElement = document.scrollingElement ?? document.documentElement;
        let fractionalHeightDifference = scrollingElement.getBoundingClientRect().height % 1;
        pageHeight = `${scrollingElement.scrollHeight - fractionalHeightDifference}px`;
      }

      return h('div', {
        ...attrs,
        class: [
          classNames(underlayStyles, 'spectrum-Underlay', 'spectrum-overlay', {
            'is-open': props.isOpen,
            'spectrum-overlay--open': props.isOpen,
            'spectrum-Underlay--transparent': props.isTransparent
          }),
          attrs.class
        ],
        'data-testid': 'underlay',
        style: [
          {
            height: pageHeight
          },
          attrs.style
        ]
      });
    };
  }
});

export const Modal = defineComponent({
  name: 'VueModal',
  inheritAttrs: false,
  props: {
    container: {
      type: [String, Object] as PropType<OverlayContainer>,
      default: undefined
    },
    dismissable: {
      type: Boolean,
      default: true
    },
    isDismissable: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isOpen: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    onEnter: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onEntered: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onEntering: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onExit: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onExited: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onExiting: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    open: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    state: {
      type: Object as PropType<OverlayStateLike | undefined>,
      default: undefined
    },
    type: {
      type: String as PropType<ModalType>,
      default: 'modal'
    }
  },
  emits: {
    close: () => true
  },
  setup(props, {attrs, emit, slots}) {
    let isOpen = computed(() => resolveOpenState(props));
    let isDismissable = computed(() => resolveDismissableState(props));
    let viewportHeight = useViewportHeight();

    let wrapperClassName = computed(() => classNames(
      modalStyles,
      'spectrum-Modal-wrapper',
      classNames({}, 'spectrum-Modal-wrapper', 'react-spectrum-Modal-wrapper')
    ));

    let modalClassName = computed(() => classNames(
      modalStyles,
      'spectrum-Modal',
      'spectrum-overlay',
      {
        'is-open': isOpen.value,
        'spectrum-overlay--open': isOpen.value
      },
      classNames({}, 'spectrum-Modal', 'react-spectrum-Modal'),
      {
        [`spectrum-Modal--${modalTypeMap[props.type]}`]: Boolean(modalTypeMap[props.type])
      }
    ));

    let close = () => {
      props.state?.close?.();
      emit('close');
    };

    return () => h(Overlay, {
      container: props.container,
      isOpen: isOpen.value,
      onEnter: props.onEnter,
      onEntered: props.onEntered,
      onEntering: props.onEntering,
      onExit: props.onExit,
      onExited: props.onExited,
      onExiting: props.onExiting
    }, {
      default: () => [
        h('div', {class: 'vs-modal-layer'}, [
          h(Underlay, {
            isOpen: isOpen.value,
            onClick: () => {
              if (isDismissable.value) {
                close();
              }
            }
          }),
          h('div', {
            class: [wrapperClassName.value, 'vs-modal__wrapper'],
            style: {
              '--spectrum-visual-viewport-height': `${viewportHeight.value}px`
            }
          }, [
            h('div', {
              ...attrs,
              class: [modalClassName.value, 'vs-modal', attrs.class],
              'data-testid': 'modal'
            }, slots.default ? slots.default() : [])
          ])
        ])
      ]
    });
  }
});

export const Tray = defineComponent({
  name: 'VueTray',
  inheritAttrs: false,
  props: {
    container: {
      type: [String, Object] as PropType<OverlayContainer>,
      default: undefined
    },
    isFixedHeight: {
      type: Boolean,
      default: false
    },
    isOpen: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    onEnter: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onEntered: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onEntering: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onExit: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onExited: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onExiting: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    open: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    state: {
      type: Object as PropType<OverlayStateLike | undefined>,
      default: undefined
    }
  },
  emits: {
    close: () => true
  },
  setup(props, {attrs, emit, slots}) {
    let isOpen = computed(() => resolveOpenState(props));
    let viewportHeight = useViewportHeight();

    let wrapperClassName = computed(() => classNames(trayStyles, 'spectrum-Tray-wrapper'));

    let trayClassName = computed(() => classNames(
      trayStyles,
      'spectrum-Tray',
      {
        'is-open': isOpen.value,
        'spectrum-Tray--fixedHeight': props.isFixedHeight
      },
      classNames({}, 'spectrum-Tray', 'react-spectrum-Tray')
    ));

    let close = () => {
      props.state?.close?.();
      emit('close');
    };

    return () => h(Overlay, {
      container: props.container,
      isOpen: isOpen.value,
      onEnter: props.onEnter,
      onEntered: props.onEntered,
      onEntering: props.onEntering,
      onExit: props.onExit,
      onExited: props.onExited,
      onExiting: props.onExiting
    }, {
      default: () => [
        h('div', {class: 'vs-tray-layer'}, [
          h(Underlay, {
            isOpen: isOpen.value,
            onClick: close
          }),
          h('div', {
            class: [wrapperClassName.value, 'vs-tray__wrapper'],
            style: {
              '--spectrum-visual-viewport-height': `${viewportHeight.value}px`,
              top: typeof window !== 'undefined' ? `${window.scrollY}px` : '0px'
            }
          }, [
            h('div', {
              ...attrs,
              class: [trayClassName.value, 'vs-tray', attrs.class],
              'data-testid': 'tray'
            }, slots.default ? slots.default() : [])
          ])
        ])
      ]
    });
  }
});

export const Popover = defineComponent({
  name: 'VuePopover',
  inheritAttrs: false,
  props: {
    container: {
      type: [String, Object] as PropType<OverlayContainer>,
      default: undefined
    },
    dismissable: {
      type: Boolean,
      default: true
    },
    hideArrow: {
      type: Boolean,
      default: false
    },
    isDismissable: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isNonModal: {
      type: Boolean,
      default: false
    },
    isOpen: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    onDismissButtonPress: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onEnter: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onEntered: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onEntering: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onExit: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onExited: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    onExiting: {
      type: Function as PropType<LifecycleHandler>,
      default: undefined
    },
    open: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    placement: {
      type: String as PropType<PopoverPlacement>,
      default: 'bottom'
    },
    state: {
      type: Object as PropType<OverlayStateLike | undefined>,
      default: undefined
    }
  },
  emits: {
    close: () => true
  },
  setup(props, {attrs, emit, slots}) {
    let isOpen = computed(() => resolveOpenState(props));
    let isDismissable = computed(() => resolveDismissableState(props));

    let popoverClassName = computed(() => classNames(
      popoverStyles,
      'spectrum-Popover',
      `spectrum-Popover--${props.placement}`,
      {
        'spectrum-Popover--withTip': !props.hideArrow,
        'is-open': isOpen.value,
        [`is-open--${props.placement}`]: isOpen.value
      },
      classNames({}, 'spectrum-Popover', 'react-spectrum-Popover')
    ));

    let close = () => {
      if (props.onDismissButtonPress) {
        props.onDismissButtonPress();
      } else {
        props.state?.close?.();
      }

      emit('close');
    };

    return () => h(Overlay, {
      container: props.container,
      isOpen: isOpen.value,
      onEnter: props.onEnter,
      onEntered: props.onEntered,
      onEntering: props.onEntering,
      onExit: props.onExit,
      onExited: props.onExited,
      onExiting: props.onExiting
    }, {
      default: () => [
        h('div', {class: 'vs-popover-layer'}, [
          (!props.isNonModal && isDismissable.value)
            ? h('button', {
              class: 'vs-popover-layer__backdrop',
              type: 'button',
              'aria-label': 'Dismiss popover',
              onClick: close
            })
            : null,
          h('section', {
            ...attrs,
            class: [popoverClassName.value, 'vs-popover', `vs-popover--${props.placement}`, attrs.class],
            'data-testid': 'popover',
            'data-vac': '',
            role: 'presentation'
          }, [
            slots.default ? slots.default() : [],
            props.hideArrow ? null : renderPopoverArrow(props.placement)
          ])
        ])
      ]
    });
  }
});

export const VuePopover = Popover;
