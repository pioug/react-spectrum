import {defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties, type PropType} from 'vue';

type Side = 'top' | 'right' | 'bottom' | 'left';
type Alignment = 'start' | 'center' | 'end';

function normalizeSide(value: string): Side {
  if (value === 'start') {
    return 'left';
  }
  if (value === 'end') {
    return 'right';
  }
  if (value === 'top' || value === 'right' || value === 'left') {
    return value;
  }
  return 'bottom';
}

function normalizeAlignment(value: string, side: Side): Alignment {
  if (side === 'top' || side === 'bottom') {
    if (value === 'left' || value === 'start') {
      return 'start';
    }
    if (value === 'right' || value === 'end') {
      return 'end';
    }
    return 'center';
  }

  if (value === 'top' || value === 'start') {
    return 'start';
  }
  if (value === 'bottom' || value === 'end') {
    return 'end';
  }
  return 'center';
}

function parsePlacement(placement: string): {side: Side, alignment: Alignment} {
  let parts = placement
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  let side = normalizeSide(parts[0] ?? 'bottom');
  let alignment = normalizeAlignment(parts[1] ?? 'center', side);
  return {side, alignment};
}

function clampCoordinate(value: number, min: number, max: number): number {
  return Math.min(Math.max(min, value), Math.max(min, max));
}

function clampToSize(value: number, size: number): number {
  return Math.min(Math.max(0, value), Math.max(0, size));
}

function resolveAlignedAxis(start: number, size: number, contentSize: number, alignment: Alignment): number {
  if (alignment === 'start') {
    return start;
  }
  if (alignment === 'end') {
    return start + size - contentSize;
  }
  return start + ((size - contentSize) / 2);
}

export const VuePopover = defineComponent({
  name: 'VuePopover',
  inheritAttrs: false,
  props: {
    open: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String as PropType<string>,
      default: 'bottom'
    },
    offset: {
      type: Number,
      default: 8
    },
    containerPadding: {
      type: Number,
      default: 8
    },
    dismissable: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    close: () => true
  },
  setup(props, {slots, emit, attrs}) {
    let layerRef = ref<HTMLElement | null>(null);
    let popoverRef = ref<HTMLElement | null>(null);
    let popoverStyle = ref<CSSProperties>({});
    let frameId: number | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let observedTrigger: HTMLElement | null = null;

    let resolveTriggerElement = (): HTMLElement | null => {
      let layer = layerRef.value;
      if (!layer) {
        return null;
      }

      let candidate = layer.previousElementSibling;
      while (candidate) {
        if (candidate instanceof HTMLElement) {
          return candidate;
        }
        candidate = candidate.previousElementSibling;
      }

      return null;
    };

    let disconnectTriggerObserver = () => {
      if (resizeObserver && observedTrigger) {
        resizeObserver.unobserve(observedTrigger);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      observedTrigger = null;
      resizeObserver = null;
    };

    let connectTriggerObserver = () => {
      if (typeof ResizeObserver === 'undefined') {
        return;
      }

      let trigger = resolveTriggerElement();
      if (!trigger) {
        disconnectTriggerObserver();
        return;
      }

      if (resizeObserver && observedTrigger === trigger) {
        return;
      }

      disconnectTriggerObserver();
      observedTrigger = trigger;
      resizeObserver = new ResizeObserver(() => {
        schedulePositionUpdate();
      });
      resizeObserver.observe(trigger);
    };

    let updatePosition = () => {
      if (!props.open) {
        return;
      }

      let popover = popoverRef.value;
      let trigger = resolveTriggerElement();
      if (!popover || !trigger) {
        return;
      }

      let triggerRect = trigger.getBoundingClientRect();
      let popoverRect = popover.getBoundingClientRect();
      let {side, alignment} = parsePlacement(props.placement);
      let top = props.containerPadding;
      let left = props.containerPadding;

      if (side === 'top') {
        top = triggerRect.top - popoverRect.height - props.offset;
        left = resolveAlignedAxis(triggerRect.left, triggerRect.width, popoverRect.width, alignment);
      } else if (side === 'bottom') {
        top = triggerRect.bottom + props.offset;
        left = resolveAlignedAxis(triggerRect.left, triggerRect.width, popoverRect.width, alignment);
      } else if (side === 'left') {
        left = triggerRect.left - popoverRect.width - props.offset;
        top = resolveAlignedAxis(triggerRect.top, triggerRect.height, popoverRect.height, alignment);
      } else {
        left = triggerRect.right + props.offset;
        top = resolveAlignedAxis(triggerRect.top, triggerRect.height, popoverRect.height, alignment);
      }

      let maxTop = window.innerHeight - popoverRect.height - props.containerPadding;
      let maxLeft = window.innerWidth - popoverRect.width - props.containerPadding;
      let resolvedTop = clampCoordinate(top, props.containerPadding, maxTop);
      let resolvedLeft = clampCoordinate(left, props.containerPadding, maxLeft);
      let anchorX = clampToSize((triggerRect.left + (triggerRect.width / 2)) - resolvedLeft, popoverRect.width);
      let anchorY = clampToSize((triggerRect.top + (triggerRect.height / 2)) - resolvedTop, popoverRect.height);

      popoverStyle.value = {
        top: `${Math.round(resolvedTop)}px`,
        left: `${Math.round(resolvedLeft)}px`,
        '--trigger-width': `${Math.round(triggerRect.width)}px`,
        '--trigger-anchor-point': `${Math.round(anchorX)}px ${Math.round(anchorY)}px`
      };
    };

    let schedulePositionUpdate = () => {
      if (frameId != null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }

      nextTick(() => {
        updatePosition();
        frameId = window.requestAnimationFrame(() => {
          frameId = null;
          updatePosition();
        });
      });
    };

    let handleViewportChange = () => {
      schedulePositionUpdate();
    };

    watch(() => props.open, (isOpen) => {
      if (isOpen) {
        connectTriggerObserver();
        schedulePositionUpdate();
      } else {
        disconnectTriggerObserver();
      }
    });

    watch(() => props.placement, () => {
      if (props.open) {
        schedulePositionUpdate();
      }
    });

    watch(() => props.offset, () => {
      if (props.open) {
        schedulePositionUpdate();
      }
    });

    watch(() => props.containerPadding, () => {
      if (props.open) {
        schedulePositionUpdate();
      }
    });

    onMounted(() => {
      window.addEventListener('resize', handleViewportChange);
      window.addEventListener('scroll', handleViewportChange, true);
      if (props.open) {
        connectTriggerObserver();
        schedulePositionUpdate();
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
      disconnectTriggerObserver();
      if (frameId != null) {
        window.cancelAnimationFrame(frameId);
      }
    });

    return function render() {
      if (!props.open) {
        return null;
      }

      return h('div', {
        class: 'vs-popover-layer',
        ref: layerRef,
        'data-vac': ''
      }, [
        props.dismissable
          ? h('button', {
            class: 'vs-popover-layer__backdrop',
            type: 'button',
            'aria-label': 'Dismiss popover',
            onClick: () => emit('close')
          })
          : null,
        h('section', {
          ...attrs,
          class: ['vs-popover', `vs-popover--${String(props.placement).replace(/\s+/g, '-')}`, attrs.class],
          'data-vac': '',
          'data-placement': props.placement,
          ref: popoverRef,
          role: 'dialog',
          style: [attrs.style, popoverStyle.value]
        }, slots.default ? slots.default() : [])
      ]);
    };
  }
});
