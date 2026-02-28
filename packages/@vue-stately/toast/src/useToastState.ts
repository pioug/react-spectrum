import {getCurrentScope, onScopeDispose, type Ref, shallowRef} from 'vue';

type ToastAction = 'add' | 'clear' | 'remove';

export interface ToastStateProps {
  maxVisibleToasts?: number,
  wrapUpdate?: (fn: () => void, action: ToastAction) => void
}

export interface ToastOptions {
  onClose?: () => void,
  timeout?: number
}

export interface QueuedToast<T> extends ToastOptions {
  content: T,
  key: string,
  timer?: Timer
}

export interface ToastState<T> {
  visibleToasts: Ref<QueuedToast<T>[]>,
  add: (content: T, options?: ToastOptions) => string,
  close: (key: string) => void,
  pauseAll: () => void,
  resumeAll: () => void
}

/**
 * Provides state management for toast queues with a reactive visible-toasts list.
 */
export function useToastState<T>(props: ToastStateProps = {}): ToastState<T> {
  let {maxVisibleToasts = 1, wrapUpdate} = props;
  let queue = new ToastQueue<T>({maxVisibleToasts, wrapUpdate});
  return useToastQueue(queue);
}

/**
 * Subscribes to an existing toast queue and exposes queue operations.
 */
export function useToastQueue<T>(queue: ToastQueue<T>): ToastState<T> {
  let visibleToasts = shallowRef<QueuedToast<T>[]>(queue.visibleToasts.slice());
  let unsubscribe = queue.subscribe(() => {
    visibleToasts.value = queue.visibleToasts.slice();
  });

  if (getCurrentScope()) {
    onScopeDispose(unsubscribe);
  }

  return {
    visibleToasts,
    add: (content, options) => queue.add(content, options),
    close: (key) => queue.close(key),
    pauseAll: () => queue.pauseAll(),
    resumeAll: () => queue.resumeAll()
  };
}

/**
 * A queue that manages toast ordering and visible toast limits.
 */
export class ToastQueue<T> {
  private queue: QueuedToast<T>[] = [];
  private subscriptions: Set<() => void> = new Set();
  private maxVisibleToasts: number;
  private wrapUpdate?: (fn: () => void, action: ToastAction) => void;

  visibleToasts: QueuedToast<T>[] = [];

  constructor(options: ToastStateProps = {}) {
    this.maxVisibleToasts = options.maxVisibleToasts ?? Infinity;
    this.wrapUpdate = options.wrapUpdate;
  }

  private runWithWrapUpdate(fn: () => void, action: ToastAction): void {
    if (this.wrapUpdate) {
      this.wrapUpdate(fn, action);
      return;
    }

    fn();
  }

  subscribe(fn: () => void): () => void {
    this.subscriptions.add(fn);
    return () => {
      this.subscriptions.delete(fn);
    };
  }

  add(content: T, options: ToastOptions = {}): string {
    let toastKey = `_${Math.random().toString(36).slice(2)}`;
    let toast: QueuedToast<T> = {
      ...options,
      content,
      key: toastKey,
      timer: options.timeout ? new Timer(() => this.close(toastKey), options.timeout) : undefined
    };

    this.queue.unshift(toast);
    this.updateVisibleToasts('add');
    return toastKey;
  }

  close(key: string): void {
    let index = this.queue.findIndex((toast) => toast.key === key);
    if (index >= 0) {
      let toast = this.queue[index];
      toast.onClose?.();
      this.queue.splice(index, 1);
    }

    this.updateVisibleToasts('remove');
  }

  clear(): void {
    this.queue = [];
    this.updateVisibleToasts('clear');
  }

  pauseAll(): void {
    for (let toast of this.visibleToasts) {
      toast.timer?.pause();
    }
  }

  resumeAll(): void {
    for (let toast of this.visibleToasts) {
      toast.timer?.resume();
    }
  }

  private updateVisibleToasts(action: ToastAction): void {
    this.visibleToasts = this.queue.slice(0, this.maxVisibleToasts);
    this.runWithWrapUpdate(() => {
      for (let subscription of this.subscriptions) {
        subscription();
      }
    }, action);
  }
}

class Timer {
  private callback: () => void;
  private remaining: number;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private startedAt: number | null = null;

  constructor(callback: () => void, delay: number) {
    this.callback = callback;
    this.remaining = delay;
  }

  reset(delay: number): void {
    this.remaining = delay;
    this.resume();
  }

  pause(): void {
    if (this.timerId == null) {
      return;
    }

    clearTimeout(this.timerId);
    this.timerId = null;
    this.remaining -= Date.now() - this.startedAt!;
  }

  resume(): void {
    if (this.remaining <= 0) {
      return;
    }

    this.startedAt = Date.now();
    this.timerId = setTimeout(() => {
      this.timerId = null;
      this.startedAt = null;
      this.remaining = 0;
      this.callback();
    }, this.remaining);
  }
}
