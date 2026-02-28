import {computed, type ComputedRef, type Ref, unref} from 'vue';
import {useControlledState} from '@vue-stately/utils';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface OverlayTriggerProps {
  defaultOpen?: MaybeRef<boolean>,
  isOpen?: MaybeRef<boolean | undefined>,
  onOpenChange?: (isOpen: boolean) => void
}

export interface OverlayTriggerState {
  isOpen: ComputedRef<boolean>,
  close: () => void,
  open: () => void,
  setOpen: (isOpen: boolean) => void,
  toggle: () => void
}

/**
 * Manages state for an overlay trigger.
 */
export function useOverlayTriggerState(props: OverlayTriggerProps = {}): OverlayTriggerState {
  let controlledOpen = props.isOpen === undefined
    ? undefined
    : computed<boolean | undefined>(() => {
      let nextOpen = unref(props.isOpen);
      return nextOpen === undefined ? undefined : Boolean(nextOpen);
    });
  let [isOpen, setOpenInternal] = useControlledState(
    controlledOpen,
    Boolean(unref(props.defaultOpen)),
    props.onOpenChange
  );

  let setOpen = (nextOpen: boolean): void => {
    setOpenInternal(nextOpen);
  };

  let open = (): void => {
    setOpen(true);
  };

  let close = (): void => {
    setOpen(false);
  };

  let toggle = (): void => {
    setOpen(!isOpen.value);
  };

  return {
    isOpen,
    setOpen,
    open,
    close,
    toggle
  };
}
