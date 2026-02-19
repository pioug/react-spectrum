import {computed, type ComputedRef, ref} from 'vue';

export interface AriaToastRegionOptions {
  'aria-label'?: string,
  ariaLabel?: string
}

export interface ToastRegionState<T = unknown> {
  pauseAll: () => void,
  resumeAll: () => void,
  visibleToasts: Array<{content?: T, key: string | number}>
}

export interface ToastRegionAria {
  regionProps: ComputedRef<{
    'aria-label': string,
    'data-react-aria-top-layer': true,
    onFocusin: () => void,
    onFocusout: () => void,
    onPointerEnter: () => void,
    onPointerLeave: () => void,
    role: 'region',
    tabindex: -1
  }>
}

function getLabel(options: AriaToastRegionOptions, visibleToastCount: number): string {
  let explicitLabel = options.ariaLabel ?? options['aria-label'];
  if (explicitLabel) {
    return explicitLabel;
  }

  if (visibleToastCount <= 0) {
    return 'Notifications';
  }

  return `Notifications (${visibleToastCount})`;
}

export function useToastRegion<T>(options: AriaToastRegionOptions, state: ToastRegionState<T>): ToastRegionAria {
  let isHovered = ref(false);
  let isFocused = ref(false);

  let updateTimers = () => {
    if (isHovered.value || isFocused.value) {
      state.pauseAll();
    } else {
      state.resumeAll();
    }
  };

  return {
    regionProps: computed(() => ({
      role: 'region' as const,
      tabindex: -1 as const,
      'data-react-aria-top-layer': true as const,
      'aria-label': getLabel(options, state.visibleToasts.length),
      onPointerEnter: () => {
        isHovered.value = true;
        updateTimers();
      },
      onPointerLeave: () => {
        isHovered.value = false;
        updateTimers();
      },
      onFocusin: () => {
        isFocused.value = true;
        updateTimers();
      },
      onFocusout: () => {
        isFocused.value = false;
        updateTimers();
      }
    }))
  };
}
