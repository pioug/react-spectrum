import {type QueuedToast as AriaQueuedToast, useToast as createToast, useToastRegion as createToastRegion} from '@vue-aria/toast';
import {computed, defineComponent, h, onBeforeUnmount, onMounted, type PropType, ref, type Ref} from 'vue';

export type ToastPlacement = 'top' | 'top end' | 'bottom' | 'bottom end';
export type ToastVariant = 'info' | 'negative' | 'neutral' | 'positive';

interface ToastDOMProps {
  'aria-describedby'?: string,
  'aria-label'?: string,
  'aria-labelledby'?: string,
  'data-testid'?: string,
  id?: string,
  role?: string,
  tabIndex?: number
}

export interface SpectrumToastValue {
  actionLabel?: string,
  'aria-describedby'?: string,
  'aria-label'?: string,
  'aria-labelledby'?: string,
  children: string,
  'data-testid'?: string,
  id?: string,
  onAction?: () => void,
  role?: string,
  shouldCloseOnAction?: boolean,
  tabIndex?: number,
  variant: ToastVariant
}

export interface SpectrumToastOptions {
  actionLabel?: string,
  'aria-describedby'?: string,
  'aria-label'?: string,
  'aria-labelledby'?: string,
  'data-testid'?: string,
  id?: string,
  onAction?: () => void,
  onClose?: () => void,
  role?: string,
  shouldCloseOnAction?: boolean,
  tabIndex?: number,
  timeout?: number
}

export interface SpectrumQueuedToast extends AriaQueuedToast<SpectrumToastValue> {
  createdAt: number
}

export interface SpectrumToastQueue {
  clear: () => void,
  close: (key: string | number) => void,
  info: (children: string, options?: SpectrumToastOptions) => () => void,
  negative: (children: string, options?: SpectrumToastOptions) => () => void,
  neutral: (children: string, options?: SpectrumToastOptions) => () => void,
  pauseAll: () => void,
  positive: (children: string, options?: SpectrumToastOptions) => () => void,
  resumeAll: () => void,
  visibleToasts: Ref<SpectrumQueuedToast[]>
}

export interface CreateToastQueueOptions {
  maxVisibleToasts?: number
}

interface InternalToast extends SpectrumQueuedToast {
  onClose?: () => void
}

interface TimerState {
  closeAt: number,
  handle: ReturnType<typeof setTimeout> | null,
  remaining: number
}

let toastIdCounter = 0;
const TOAST_DOM_PROP_KEYS: Array<keyof ToastDOMProps> = [
  'id',
  'role',
  'tabIndex',
  'data-testid',
  'aria-label',
  'aria-labelledby',
  'aria-describedby'
];
const TOAST_ICON_CLASS_BY_VARIANT: Partial<Record<ToastVariant, string>> = {
  info: 'spectrum-UIIcon-InfoMedium',
  negative: 'spectrum-UIIcon-AlertMedium',
  positive: 'spectrum-UIIcon-SuccessMedium'
};
const TOAST_ICON_LABEL_BY_VARIANT: Partial<Record<ToastVariant, string>> = {
  info: 'Info',
  negative: 'Negative',
  positive: 'Positive'
};

function createToastKey(): string {
  toastIdCounter += 1;
  return `vue-toast-${toastIdCounter}`;
}

function getToastDOMProps(value: ToastDOMProps): ToastDOMProps {
  let domProps: ToastDOMProps = {};
  for (let key of TOAST_DOM_PROP_KEYS) {
    let propValue = value[key];
    if (propValue != null) {
      domProps[key] = propValue;
    }
  }

  return domProps;
}

function getTimeoutValue(options: SpectrumToastOptions): number | undefined {
  if (options.timeout == null || options.onAction) {
    return undefined;
  }

  return Math.max(options.timeout, 5000);
}

export function createToastQueue(options: CreateToastQueueOptions = {}): SpectrumToastQueue {
  let maxVisibleToasts = options.maxVisibleToasts ?? Number.POSITIVE_INFINITY;
  let visibleToasts = ref<InternalToast[]>([]);
  let timers = new Map<string | number, TimerState>();

  let close = (key: string | number): void => {
    let toastIndex = visibleToasts.value.findIndex((toast) => toast.key === key);
    if (toastIndex < 0) {
      return;
    }

    let [toast] = visibleToasts.value.splice(toastIndex, 1);
    let timer = timers.get(key);
    if (timer?.handle) {
      clearTimeout(timer.handle);
    }
    timers.delete(key);
    toast?.onClose?.();
  };

  let scheduleToast = (key: string | number, timeout: number): void => {
    let closeAt = Date.now() + timeout;
    let timer: TimerState = {
      closeAt,
      remaining: timeout,
      handle: null
    };

    timer.handle = setTimeout(() => {
      timers.delete(key);
      close(key);
    }, timeout);

    timers.set(key, timer);
  };

  let pauseAll = (): void => {
    for (let timer of timers.values()) {
      if (!timer.handle) {
        continue;
      }

      clearTimeout(timer.handle);
      timer.handle = null;
      timer.remaining = Math.max(0, timer.closeAt - Date.now());
    }
  };

  let resumeAll = (): void => {
    let keysToClose: Array<string | number> = [];

    for (let [key, timer] of timers.entries()) {
      if (timer.handle) {
        continue;
      }

      if (timer.remaining <= 0) {
        keysToClose.push(key);
        continue;
      }

      timer.closeAt = Date.now() + timer.remaining;
      timer.handle = setTimeout(() => {
        timers.delete(key);
        close(key);
      }, timer.remaining);
    }

    for (let key of keysToClose) {
      close(key);
    }
  };

  let clear = (): void => {
    let keys = visibleToasts.value.map((toast) => toast.key);
    for (let key of keys) {
      close(key);
    }
  };

  let addToast = (children: string, variant: ToastVariant, toastOptions: SpectrumToastOptions = {}): (() => void) => {
    let key = createToastKey();
    let timeout = getTimeoutValue(toastOptions);
    let toast: InternalToast = {
      key,
      createdAt: Date.now(),
      timeout,
      content: {
        children,
        variant,
        actionLabel: toastOptions.actionLabel,
        onAction: toastOptions.onAction,
        shouldCloseOnAction: toastOptions.shouldCloseOnAction,
        ...getToastDOMProps(toastOptions)
      },
      onClose: toastOptions.onClose
    };

    visibleToasts.value.push(toast);
    while (visibleToasts.value.length > maxVisibleToasts) {
      close(visibleToasts.value[0].key);
    }

    if (timeout != null) {
      scheduleToast(key, timeout);
    }

    return () => {
      close(key);
    };
  };

  return {
    visibleToasts: visibleToasts as Ref<SpectrumQueuedToast[]>,
    close,
    clear,
    pauseAll,
    resumeAll,
    neutral: (children: string, toastOptions: SpectrumToastOptions = {}) => addToast(children, 'neutral', toastOptions),
    positive: (children: string, toastOptions: SpectrumToastOptions = {}) => addToast(children, 'positive', toastOptions),
    negative: (children: string, toastOptions: SpectrumToastOptions = {}) => addToast(children, 'negative', toastOptions),
    info: (children: string, toastOptions: SpectrumToastOptions = {}) => addToast(children, 'info', toastOptions)
  };
}

let globalToastQueue: SpectrumToastQueue | null = null;
let toastContainerTokens = new Set<symbol>();
let activeToastContainerToken = ref<symbol | null>(null);

function syncActiveToastContainer() {
  activeToastContainerToken.value = toastContainerTokens.values().next().value ?? null;
}

function registerToastContainer(token: symbol): void {
  toastContainerTokens.add(token);
  syncActiveToastContainer();
}

function unregisterToastContainer(token: symbol): void {
  toastContainerTokens.delete(token);
  syncActiveToastContainer();
}

function getGlobalToastQueue(): SpectrumToastQueue {
  if (!globalToastQueue) {
    globalToastQueue = createToastQueue();
  }

  return globalToastQueue;
}

export function clearToastQueue(): void {
  if (globalToastQueue) {
    globalToastQueue.clear();
  }

  globalToastQueue = null;
}

export const ToastQueue = {
  neutral: (children: string, options: SpectrumToastOptions = {}) => getGlobalToastQueue().neutral(children, options),
  positive: (children: string, options: SpectrumToastOptions = {}) => getGlobalToastQueue().positive(children, options),
  negative: (children: string, options: SpectrumToastOptions = {}) => getGlobalToastQueue().negative(children, options),
  info: (children: string, options: SpectrumToastOptions = {}) => getGlobalToastQueue().info(children, options),
  close: (key: string | number) => {
    getGlobalToastQueue().close(key);
  },
  clear: () => {
    getGlobalToastQueue().clear();
  }
};

const VueToastItem = defineComponent({
  name: 'VueToastItem',
  props: {
    queue: {
      type: Object as PropType<SpectrumToastQueue>,
      required: true
    },
    toast: {
      type: Object as PropType<SpectrumQueuedToast>,
      required: true
    }
  },
  setup(props) {
    let toastState = {
      close: (key: string | number) => {
        props.queue.close(key);
      },
      get visibleToasts() {
        return props.queue.visibleToasts.value;
      }
    };
    let toast = createToast({
      toast: props.toast
    }, toastState);

    let handleAction = (): void => {
      props.toast.content?.onAction?.();

      if (props.toast.content?.shouldCloseOnAction) {
        props.queue.close(props.toast.key);
      }
    };

    return () => {
      let variant = props.toast.content?.variant ?? 'neutral';
      let iconClassName = TOAST_ICON_CLASS_BY_VARIANT[variant];
      let iconLabel = TOAST_ICON_LABEL_BY_VARIANT[variant];

      return h('article', {
        ...toast.toastProps.value,
        ...getToastDOMProps(props.toast.content),
        class: [
          'spectrum-Toast',
          `spectrum-Toast--${variant}`
        ]
      }, [
        h('div', {
          ...toast.contentProps.value,
          class: 'spectrum-Toast-contentWrapper'
        }, [
          iconClassName
            ? h('span', {
              role: 'img',
              'aria-label': iconLabel,
              class: ['spectrum-Icon', iconClassName, 'spectrum-Toast-typeIcon']
            })
            : null,
          h('div', {
            class: 'spectrum-Toast-body',
            role: 'presentation'
          }, [
            h('div', {
              ...toast.titleProps.value,
              class: 'spectrum-Toast-content',
              role: 'presentation'
            }, props.toast.content?.children ?? ''),
            props.toast.content?.actionLabel
              ? h('button', {
                type: 'button',
                class: ['spectrum-BaseButton', 'spectrum-Button'],
                'data-style': 'fill',
                'data-variant': 'secondary',
                'data-static-color': 'white',
                'data-testid': 'rsp-Toast-secondaryButton',
                onClick: handleAction
              }, props.toast.content.actionLabel)
              : null
          ])
        ]),
        h('div', {
          class: 'spectrum-Toast-buttons'
        }, [
          h('button', {
            type: 'button',
            class: ['spectrum-BaseButton', 'spectrum-ClearButton', 'spectrum-ClearButton--overBackground'],
            'aria-label': toast.closeButtonProps.value['aria-label'],
            'data-testid': 'rsp-Toast-closeButton',
            onClick: () => {
              toast.closeButtonProps.value.onPress();
            }
          }, [
            h('span', {
              class: ['spectrum-Icon', 'spectrum-UIIcon-CrossMedium']
            })
          ])
        ])
      ]);
    };
  }
});

export const VueToastContainer = defineComponent({
  name: 'VueToastContainer',
  props: {
    ariaLabel: {
      type: String,
      default: 'Notifications'
    },
    placement: {
      type: String as PropType<ToastPlacement>,
      default: 'bottom'
    },
    queue: {
      type: Object as PropType<SpectrumToastQueue>,
      default: undefined
    }
  },
  setup(props, {attrs}) {
    let containerToken = Symbol('vue-toast-container');
    let activeQueue = computed(() => props.queue ?? getGlobalToastQueue());
    let isActiveContainer = computed(() => props.queue != null || activeToastContainerToken.value === containerToken);
    let containerPlacement = computed(() => {
      let [position = 'bottom', placement = 'center'] = props.placement.split(' ');
      return {
        position,
        placement
      };
    });
    let toastRegion = createToastRegion({
      ariaLabel: props.ariaLabel
    }, {
      pauseAll: () => {
        activeQueue.value.pauseAll();
      },
      resumeAll: () => {
        activeQueue.value.resumeAll();
      },
      get visibleToasts() {
        return activeQueue.value.visibleToasts.value;
      }
    });

    onMounted(() => {
      registerToastContainer(containerToken);
    });

    onBeforeUnmount(() => {
      unregisterToastContainer(containerToken);
    });

    return () => {
      let toasts = activeQueue.value.visibleToasts.value;
      if (!isActiveContainer.value || toasts.length === 0) {
        return null;
      }

      return h('section', {
        ...attrs,
        ...toastRegion.regionProps.value,
        class: [
          'react-spectrum-ToastContainer',
          attrs.class
        ],
        'data-position': containerPlacement.value.position,
        'data-placement': containerPlacement.value.placement,
        'data-vac': ''
      }, [
        h('ol', {
          class: 'spectrum-ToastContainer-list'
        }, toasts.map((toast) => h('li', {
          key: String(toast.key),
          class: 'spectrum-ToastContainer-listitem'
        }, [
          h(VueToastItem, {
            toast,
            queue: activeQueue.value
          })
        ])))
      ]);
    };
  }
});
