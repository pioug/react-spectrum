import {computed, type ComputedRef, ref, watch} from 'vue';

export interface ToastTimer {
  pause: () => void,
  reset: (timeout: number) => void
}

export interface QueuedToast<T = unknown> {
  content?: T,
  key: string | number,
  timeout?: number,
  timer?: ToastTimer | null
}

export interface ToastState<T = unknown> {
  close: (key: string | number) => void,
  visibleToasts?: Array<QueuedToast<T>>
}

export interface AriaToastOptions<T = unknown> {
  'aria-describedby'?: string,
  'aria-labelledby'?: string,
  toast: QueuedToast<T>
}

export interface ToastAria {
  closeButtonProps: ComputedRef<{
    'aria-label': string,
    onPress: () => void
  }>,
  contentProps: ComputedRef<{
    'aria-atomic': 'true',
    'aria-hidden'?: 'true',
    role: 'alert'
  }>,
  descriptionProps: ComputedRef<{
    id: string
  }>,
  titleProps: ComputedRef<{
    id: string
  }>,
  toastProps: ComputedRef<{
    'aria-describedby': string,
    'aria-labelledby': string,
    'aria-modal': 'false',
    role: 'alertdialog',
    tabIndex: 0
  }>
}

let toastIdCounter = 0;

function createId(prefix: string): string {
  toastIdCounter += 1;
  return `${prefix}-${toastIdCounter}`;
}

export function useToast<T>(options: AriaToastOptions<T>, state: ToastState<T>): ToastAria {
  let titleId = createId('vue-toast-title');
  let descriptionId = createId('vue-toast-description');
  let isVisible = ref(true);

  watch(
    () => [options.toast.timeout, options.toast.timer] as const,
    ([timeout, timer]) => {
      if (!timer || timeout == null) {
        return;
      }

      timer.reset(timeout);
    },
    {immediate: true}
  );

  return {
    closeButtonProps: computed(() => ({
      'aria-label': 'Close',
      onPress: () => {
        state.close(options.toast.key);
      }
    })),
    contentProps: computed(() => ({
      role: 'alert' as const,
      'aria-atomic': 'true' as const,
      'aria-hidden': isVisible.value ? undefined : 'true' as const
    })),
    descriptionProps: computed(() => ({
      id: descriptionId
    })),
    titleProps: computed(() => ({
      id: titleId
    })),
    toastProps: computed(() => ({
      role: 'alertdialog' as const,
      'aria-modal': 'false' as const,
      'aria-labelledby': options['aria-labelledby'] || titleId,
      'aria-describedby': options['aria-describedby'] || descriptionId,
      tabIndex: 0 as const
    }))
  };
}
