import {computed, type ComputedRef, type Ref, unref} from 'vue';
import {useControlledState} from '@vue-stately/utils';

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
  let [isExpanded, setExpandedInternal] = useControlledState(
    props.isExpanded,
    Boolean(unref(props.defaultExpanded)),
    props.onExpandedChange
  );

  let setExpanded = (nextExpanded: boolean): void => {
    setExpandedInternal(nextExpanded);
  };

  let expand = (): void => {
    setExpandedInternal(true);
  };

  let collapse = (): void => {
    setExpandedInternal(false);
  };

  let toggle = (): void => {
    setExpandedInternal(!isExpanded.value);
  };

  return {
    isExpanded,
    setExpanded,
    expand,
    collapse,
    toggle
  };
}
