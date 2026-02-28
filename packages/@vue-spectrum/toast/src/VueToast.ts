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

interface ToastIconDefinition {
  className: string,
  path: string,
  viewBox: string
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
const TOAST_ICON_BY_VARIANT: Partial<Record<ToastVariant, ToastIconDefinition & {ariaLabel: string}>> = {
  info: {
    ariaLabel: 'Info',
    className: 'spectrum-UIIcon-InfoMedium',
    path: 'M9 1a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm-.15 2.15a1.359 1.359 0 0 1 1.431 1.283q.004.064.001.129A1.332 1.332 0 0 1 8.85 5.994a1.353 1.353 0 0 1-1.432-1.433 1.359 1.359 0 0 1 1.304-1.412q.064-.002.128.001zM11 13.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5H8V9h-.5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V12h.5a.5.5 0 0 1 .5.5z',
    viewBox: '0 0 18 18'
  },
  negative: {
    ariaLabel: 'Negative',
    className: 'spectrum-UIIcon-AlertMedium',
    path: 'M8.564 1.289L.2 16.256A.5.5 0 0 0 .636 17h16.728a.5.5 0 0 0 .436-.744L9.436 1.289a.5.5 0 0 0-.872 0zM10 14.75a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25zm0-3a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-6a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25z',
    viewBox: '0 0 18 18'
  },
  positive: {
    ariaLabel: 'Positive',
    className: 'spectrum-UIIcon-SuccessMedium',
    path: 'M9 1a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm5.333 4.54l-6.324 8.13a.6.6 0 0 1-.437.23h-.037a.6.6 0 0 1-.425-.176l-3.893-3.9a.6.6 0 0 1 0-.849l.663-.663a.6.6 0 0 1 .848 0L7.4 10.991l5.256-6.754a.6.6 0 0 1 .843-.1l.728.566a.6.6 0 0 1 .106.837z',
    viewBox: '0 0 18 18'
  }
};
const TOAST_CLOSE_ICON: ToastIconDefinition = {
  className: 'spectrum-UIIcon-CrossMedium',
  path: 'M7.77 6.71L5.06 4l2.71-2.71A.75.75 0 1 0 6.71.23L4 2.94 1.29.23A.75.75 0 1 0 .23 1.29L2.94 4 .23 6.71a.75.75 0 1 0 1.06 1.06L4 5.06l2.71 2.71a.75.75 0 1 0 1.06-1.06z',
  viewBox: '0 0 8 8'
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

function renderToastIcon(
  icon: ToastIconDefinition,
  options: {
    ariaHidden?: boolean,
    ariaLabel?: string,
    className?: string
  } = {}
) {
  return h('svg', {
    class: ['spectrum-Icon', icon.className, options.className],
    focusable: 'false',
    'aria-label': options.ariaLabel,
    'aria-hidden': options.ariaHidden ? 'true' : undefined,
    role: 'img',
    viewBox: icon.viewBox
  }, [
    h('path', {d: icon.path})
  ]);
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
      let icon = TOAST_ICON_BY_VARIANT[variant];

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
          icon
            ? renderToastIcon(icon, {
              ariaLabel: icon.ariaLabel,
              className: 'spectrum-Toast-typeIcon'
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
          }, [renderToastIcon(TOAST_CLOSE_ICON, {ariaHidden: true})])
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
