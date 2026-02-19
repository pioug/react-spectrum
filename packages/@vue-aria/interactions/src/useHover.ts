import {computed, type ComputedRef, ref, unref, watch} from 'vue';
import type {MaybeRef, PointerType} from './types';

export interface HoverEvent {
  pointerType: PointerType,
  target: Element,
  type: 'hoverend' | 'hoverstart'
}

export interface HoverProps {
  isDisabled?: MaybeRef<boolean>,
  onHoverChange?: (isHovered: boolean) => void,
  onHoverEnd?: (event: HoverEvent) => void,
  onHoverStart?: (event: HoverEvent) => void
}

export interface HoverDOMProps {
  onMouseEnter?: (event: MouseEvent) => void,
  onMouseLeave?: (event: MouseEvent) => void,
  onPointerEnter?: (event: PointerEvent) => void,
  onPointerLeave?: (event: PointerEvent) => void
}

export interface HoverResult {
  hoverProps: ComputedRef<HoverDOMProps>,
  isHovered: ComputedRef<boolean>
}

export function useHover(props: HoverProps = {}): HoverResult {
  let isDisabled = computed(() => Boolean(unref(props.isDisabled)));
  let isHovered = ref(false);
  let currentPointerType = ref<PointerType>('mouse');
  let currentTarget = ref<Element | null>(null);

  let startHover = (target: EventTarget | null, pointerType: PointerType) => {
    if (isDisabled.value || isHovered.value || pointerType === 'touch' || !(target instanceof Element)) {
      return;
    }

    currentPointerType.value = pointerType;
    currentTarget.value = target;
    isHovered.value = true;

    let hoverEvent: HoverEvent = {
      pointerType,
      target,
      type: 'hoverstart'
    };

    props.onHoverStart?.(hoverEvent);
    props.onHoverChange?.(true);
  };

  let endHover = () => {
    if (!isHovered.value || !currentTarget.value) {
      return;
    }

    let hoverEvent: HoverEvent = {
      pointerType: currentPointerType.value,
      target: currentTarget.value,
      type: 'hoverend'
    };

    isHovered.value = false;
    currentTarget.value = null;

    props.onHoverEnd?.(hoverEvent);
    props.onHoverChange?.(false);
  };

  watch(
    isDisabled,
    (nextIsDisabled) => {
      if (nextIsDisabled) {
        endHover();
      }
    },
    {flush: 'sync'}
  );

  let onPointerEnter = (event: PointerEvent) => {
    let pointerType = event.pointerType;
    if (pointerType !== 'pen' && pointerType !== 'touch') {
      startHover(event.currentTarget, 'mouse');
      return;
    }

    startHover(event.currentTarget, pointerType);
  };

  let onPointerLeave = () => {
    endHover();
  };

  let onMouseEnter = (event: MouseEvent) => {
    if (typeof PointerEvent !== 'undefined') {
      return;
    }

    startHover(event.currentTarget, 'mouse');
  };

  let onMouseLeave = () => {
    if (typeof PointerEvent !== 'undefined') {
      return;
    }

    endHover();
  };

  return {
    hoverProps: computed<HoverDOMProps>(() => {
      if (isDisabled.value) {
        return {};
      }

      return {
        onMouseEnter,
        onMouseLeave,
        onPointerEnter,
        onPointerLeave
      };
    }),
    isHovered: computed(() => isHovered.value)
  };
}
