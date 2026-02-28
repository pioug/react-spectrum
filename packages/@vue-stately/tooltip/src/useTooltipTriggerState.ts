import {computed, type ComputedRef, getCurrentScope, onScopeDispose, type Ref, unref} from 'vue';
import {useOverlayTriggerState} from '@vue-stately/overlays';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;
type TooltipCloser = (immediate?: boolean) => void;

const TOOLTIP_DELAY = 1500;
const TOOLTIP_COOLDOWN = 500;

let tooltipClosers = new Map<string, TooltipCloser>();
let tooltipId = 0;
let globalWarmedUp = false;
let globalWarmUpTimeout: ReturnType<typeof setTimeout> | null = null;
let globalCooldownTimeout: ReturnType<typeof setTimeout> | null = null;

function clearTimer(timer: ReturnType<typeof setTimeout> | null): null {
  if (timer != null) {
    clearTimeout(timer);
  }

  return null;
}

function toNumberWithFallback(value: unknown, fallback: number): number {
  let numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return numeric;
}

export interface TooltipTriggerProps {
  closeDelay?: MaybeRef<number>,
  defaultOpen?: MaybeRef<boolean>,
  delay?: MaybeRef<number>,
  isOpen?: MaybeRef<boolean | undefined>,
  onOpenChange?: (isOpen: boolean) => void
}

export interface TooltipTriggerState {
  isOpen: Ref<boolean>,
  close: (immediate?: boolean) => void,
  open: (immediate?: boolean) => void
}

/**
 * Manages state for a tooltip trigger, including global warmup and cooldown timing.
 */
export function useTooltipTriggerState(props: TooltipTriggerProps = {}): TooltipTriggerState {
  let delay = computed(() => toNumberWithFallback(unref(props.delay), TOOLTIP_DELAY));
  let closeDelay = computed(() => toNumberWithFallback(unref(props.closeDelay), TOOLTIP_COOLDOWN));
  let overlayState = useOverlayTriggerState(props);
  let id = `${++tooltipId}`;
  let closeTimeout: ReturnType<typeof setTimeout> | null = null;

  let ensureTooltipEntry = (): void => {
    tooltipClosers.set(id, hideTooltip);
  };

  let closeOpenTooltips = (): void => {
    for (let [openTooltipId, hide] of tooltipClosers) {
      if (openTooltipId !== id) {
        hide(true);
        tooltipClosers.delete(openTooltipId);
      }
    }
  };

  let showTooltip = (): void => {
    closeTimeout = clearTimer(closeTimeout);
    closeOpenTooltips();
    ensureTooltipEntry();

    globalWarmedUp = true;
    overlayState.open();
    globalWarmUpTimeout = clearTimer(globalWarmUpTimeout);
    globalCooldownTimeout = clearTimer(globalCooldownTimeout);
  };

  function hideTooltip(immediate?: boolean): void {
    let resolvedCloseDelay = closeDelay.value;

    if (immediate || resolvedCloseDelay <= 0) {
      closeTimeout = clearTimer(closeTimeout);
      overlayState.close();
    } else if (!closeTimeout) {
      closeTimeout = setTimeout(() => {
        closeTimeout = null;
        overlayState.close();
      }, resolvedCloseDelay);
    }

    globalWarmUpTimeout = clearTimer(globalWarmUpTimeout);

    if (globalWarmedUp) {
      globalCooldownTimeout = clearTimer(globalCooldownTimeout);
      globalCooldownTimeout = setTimeout(() => {
        tooltipClosers.delete(id);
        globalCooldownTimeout = null;
        globalWarmedUp = false;
      }, Math.max(TOOLTIP_COOLDOWN, resolvedCloseDelay));
    }
  }

  let warmupTooltip = (): void => {
    closeOpenTooltips();
    ensureTooltipEntry();

    if (!overlayState.isOpen.value && !globalWarmedUp) {
      globalWarmUpTimeout = clearTimer(globalWarmUpTimeout);
      globalWarmUpTimeout = setTimeout(() => {
        globalWarmUpTimeout = null;
        globalWarmedUp = true;
        showTooltip();
      }, Math.max(0, delay.value));
    } else if (!overlayState.isOpen.value) {
      showTooltip();
    }
  };

  if (getCurrentScope()) {
    onScopeDispose(() => {
      closeTimeout = clearTimer(closeTimeout);
      tooltipClosers.delete(id);

      if (tooltipClosers.size === 0) {
        globalWarmUpTimeout = clearTimer(globalWarmUpTimeout);
        globalCooldownTimeout = clearTimer(globalCooldownTimeout);
        globalWarmedUp = false;
      }
    });
  }

  return {
    isOpen: overlayState.isOpen,
    open: (immediate) => {
      if (!immediate && delay.value > 0 && !closeTimeout) {
        warmupTooltip();
      } else {
        showTooltip();
      }
    },
    close: hideTooltip
  };
}
