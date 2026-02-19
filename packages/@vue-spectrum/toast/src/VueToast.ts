import {type QueuedToast as AriaQueuedToast, useToast as createToast, useToastRegion as createToastRegion} from '@vue-aria/toast';
import {computed, defineComponent, h, type PropType, ref, type Ref} from 'vue';

export type ToastPlacement = 'top' | 'top end' | 'bottom' | 'bottom end';
export type ToastVariant = 'info' | 'negative' | 'neutral' | 'positive';

export interface SpectrumToastValue {
  actionLabel?: string,
  children: string,
  onAction?: () => void,
  shouldCloseOnAction?: boolean,
  variant: ToastVariant
}

export interface SpectrumToastOptions {
  actionLabel?: string,
  onAction?: () => void,
  onClose?: () => void,
  shouldCloseOnAction?: boolean,
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

function createToastKey(): string {
  toastIdCounter += 1;
  return `vue-toast-${toastIdCounter}`;
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
        shouldCloseOnAction: toastOptions.shouldCloseOnAction
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

    return () => h('article', {
      ...toast.toastProps.value,
      class: [
        'vs-toast',
        `vs-toast--${props.toast.content?.variant ?? 'neutral'}`
      ]
    }, [
      h('div', {
        ...toast.contentProps.value,
        class: 'vs-toast__content'
      }, [
        h('p', {
          ...toast.titleProps.value,
          class: 'vs-toast__title'
        }, props.toast.content?.children ?? ''),
        props.toast.content?.actionLabel
          ? h('button', {
            type: 'button',
            class: 'vs-toast__action',
            onClick: handleAction
          }, props.toast.content.actionLabel)
          : null
      ]),
      h('button', {
        type: 'button',
        class: 'vs-toast__close',
        'aria-label': toast.closeButtonProps.value['aria-label'],
        onClick: () => {
          toast.closeButtonProps.value.onPress();
        }
      }, '×')
    ]);
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
    let activeQueue = computed(() => props.queue ?? getGlobalToastQueue());
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

    return () => {
      let toasts = activeQueue.value.visibleToasts.value;
      if (toasts.length === 0) {
        return null;
      }

      return h('section', {
        ...attrs,
        ...toastRegion.regionProps.value,
        class: [
          'vs-toast-region',
          `vs-toast-region--${props.placement.replace(' ', '-')}`,
          attrs.class
        ],
        'data-vac': ''
      }, [
        h('ol', {
          class: 'vs-toast-region__list'
        }, toasts.map((toast) => h('li', {
          key: String(toast.key),
          class: 'vs-toast-region__item'
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
