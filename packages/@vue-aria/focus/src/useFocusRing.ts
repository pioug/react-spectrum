import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaFocusRingProps {
  autoFocus?: MaybeRef<boolean>,
  isTextInput?: MaybeRef<boolean>,
  within?: MaybeRef<boolean>
}

export interface FocusRingProps {
  onBlur?: (event: FocusEvent) => void,
  onFocus?: (event: FocusEvent) => void,
  onFocusin?: (event: FocusEvent) => void,
  onFocusout?: (event: FocusEvent) => void
}

export interface FocusRingAria {
  focusProps: ComputedRef<FocusRingProps>,
  isFocused: Ref<boolean>,
  isFocusVisible: Ref<boolean>
}

let globalFocusVisible = true;
let listenersAttached = false;

function onKeyboardInteraction(event: KeyboardEvent): void {
  if (event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }

  globalFocusVisible = true;
}

function onPointerInteraction(): void {
  globalFocusVisible = false;
}

function ensureGlobalListeners(): void {
  if (listenersAttached || typeof window === 'undefined') {
    return;
  }

  listenersAttached = true;
  window.addEventListener('keydown', onKeyboardInteraction, true);
  window.addEventListener('mousedown', onPointerInteraction, true);
  window.addEventListener('pointerdown', onPointerInteraction, true);
  window.addEventListener('touchstart', onPointerInteraction, true);
}

function nodeContains(target: Node, node: Node): boolean {
  if (target === node) {
    return true;
  }

  return Boolean(target.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY);
}

export function useFocusRing(props: AriaFocusRingProps = {}): FocusRingAria {
  ensureGlobalListeners();

  let within = computed(() => Boolean(unref(props.within)));
  let autoFocus = computed(() => Boolean(unref(props.autoFocus)));
  let isFocused = ref(false);
  let isFocusVisible = ref(Boolean(autoFocus.value || globalFocusVisible));

  let setFocused = (nextFocused: boolean) => {
    isFocused.value = nextFocused;
    isFocusVisible.value = nextFocused && (autoFocus.value || globalFocusVisible);
  };

  let onFocus = () => {
    if (within.value) {
      return;
    }

    setFocused(true);
  };

  let onBlur = () => {
    if (within.value) {
      return;
    }

    setFocused(false);
  };

  let onFocusin = () => {
    if (!within.value) {
      return;
    }

    setFocused(true);
  };

  let onFocusout = (event: FocusEvent) => {
    if (!within.value) {
      return;
    }

    let currentTarget = event.currentTarget;
    let relatedTarget = event.relatedTarget;
    if (
      currentTarget instanceof Element &&
      relatedTarget instanceof Node &&
      nodeContains(currentTarget, relatedTarget)
    ) {
      return;
    }

    setFocused(false);
  };

  let focusProps = computed<FocusRingProps>(() => {
    if (within.value) {
      return {
        onFocusin,
        onFocusout
      };
    }

    return {
      onBlur,
      onFocus
    };
  });

  return {
    focusProps,
    isFocused,
    isFocusVisible
  };
}
