import {computed, type ComputedRef, type Ref, ref, unref, watch} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface DisclosureProps {
  /** Whether the disclosure is expanded (controlled). */
  isExpanded?: Ref<boolean | undefined>,
  /** Whether the disclosure is expanded by default (uncontrolled). */
  defaultExpanded?: MaybeRef<boolean>,
  /** Handler that is called when the disclosure expanded state changes. */
  onExpandedChange?: (isExpanded: boolean) => void
}

export interface DisclosureState {
  /** Whether the disclosure is currently expanded. */
  isExpanded: ComputedRef<boolean>,
  /** Sets whether the disclosure is expanded. */
  setExpanded: (isExpanded: boolean) => void,
  /** Expand the disclosure. */
  expand: () => void,
  /** Collapse the disclosure. */
  collapse: () => void,
  /** Toggles the disclosure's visibility. */
  toggle: () => void
}

/**
 * Manages state for a disclosure widget. Tracks whether the disclosure is expanded, and provides
 * methods to toggle this state.
 */
export function useDisclosureState(props: DisclosureProps = {}): DisclosureState {
  let uncontrolledExpanded = ref(Boolean(unref(props.defaultExpanded)));
  let isControlled = computed(() => props.isExpanded !== undefined && props.isExpanded.value !== undefined);
  let wasControlled = ref(isControlled.value);

  watch(isControlled, (nextIsControlled) => {
    if (wasControlled.value !== nextIsControlled && process.env.NODE_ENV !== 'production') {
      console.warn(`WARN: A component changed from ${wasControlled.value ? 'controlled' : 'uncontrolled'} to ${nextIsControlled ? 'controlled' : 'uncontrolled'}.`);
    }
    wasControlled.value = nextIsControlled;
  });

  let isExpanded = computed(() => {
    if (isControlled.value && props.isExpanded) {
      return props.isExpanded.value;
    }

    return uncontrolledExpanded.value;
  });

  let setExpanded = (nextExpanded: boolean): void => {
    if (isExpanded.value === nextExpanded) {
      return;
    }

    if (!isControlled.value) {
      uncontrolledExpanded.value = nextExpanded;
    }

    props.onExpandedChange?.(nextExpanded);
  };

  let expand = (): void => {
    setExpanded(true);
  };

  let collapse = (): void => {
    setExpanded(false);
  };

  let toggle = (): void => {
    setExpanded(!isExpanded.value);
  };

  return {
    isExpanded,
    setExpanded,
    expand,
    collapse,
    toggle
  };
}
