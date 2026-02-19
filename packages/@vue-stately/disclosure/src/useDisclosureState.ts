import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface DisclosureProps {
  /** Whether the disclosure is expanded (controlled). */
  isExpanded?: Ref<boolean>,
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

  let isExpanded = computed(() => {
    if (props.isExpanded) {
      return props.isExpanded.value;
    }

    return uncontrolledExpanded.value;
  });

  let setExpanded = (nextExpanded: boolean): void => {
    if (props.isExpanded) {
      props.isExpanded.value = nextExpanded;
    } else {
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
