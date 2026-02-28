import {computed, defineComponent, h, type PropType, ref} from 'vue';
import {useTooltip as createTooltip, useTooltipTrigger as createTooltipTrigger, type TooltipTriggerAria, type TooltipTriggerMode} from '@vue-aria/tooltip';
import {useTooltipTriggerState} from '@vue-stately/tooltip';

export type TooltipPlacement = 'bottom' | 'left' | 'right' | 'top';
export type TooltipVariant = 'info' | 'negative' | 'neutral' | 'positive';

export interface TooltipSharedProps {
  placement?: TooltipPlacement,
  showIcon?: boolean,
  variant?: TooltipVariant
}

const iconByVariant: Record<TooltipVariant, string> = {
  neutral: '',
  info: 'i',
  positive: '✓',
  negative: '!'
};

export const VueTooltip = defineComponent({
  name: 'VueTooltip',
  props: {
    ariaLabel: {
      type: String,
      default: undefined
    },
    ariaLabelledby: {
      type: String,
      default: undefined
    },
    id: {
      type: String,
      default: undefined
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String as PropType<TooltipPlacement>,
      default: 'top'
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    state: {
      type: Object as PropType<TooltipTriggerAria>,
      default: undefined
    },
    variant: {
      type: String as PropType<TooltipVariant>,
      default: 'neutral'
    }
  },
  setup(props, {attrs, slots}) {
    let tooltip = createTooltip({
      id: computed(() => props.id),
      'aria-label': computed(() => props.ariaLabel),
      'aria-labelledby': computed(() => props.ariaLabelledby)
    }, props.state);

    return () => {
      if (!props.isOpen) {
        return null;
      }

      let tooltipProps = tooltip.tooltipProps.value;
      let slotContent = slots.default?.();
      let icon = props.showIcon && props.variant !== 'neutral'
        ? h('span', {
          class: 'vs-tooltip__icon',
          'aria-hidden': 'true'
        }, iconByVariant[props.variant])
        : null;

      return h('div', {
        ...attrs,
        id: tooltipProps.id,
        role: tooltipProps.role,
        'aria-label': tooltipProps['aria-label'],
        'aria-labelledby': tooltipProps['aria-labelledby'],
        class: [
          'vs-tooltip',
          `vs-tooltip--${props.variant}`,
          `vs-tooltip--${props.placement}`,
          attrs.class
        ],
        onMouseenter: tooltipProps.onMouseEnter,
        onMouseleave: tooltipProps.onMouseLeave,
        onPointerenter: tooltipProps.onPointerEnter,
        onPointerleave: tooltipProps.onPointerLeave
      }, [
        icon,
        h('span', {
          class: 'vs-tooltip__label'
        }, slotContent)
      ]);
    };
  }
});

export const VueTooltipTrigger = defineComponent({
  name: 'VueTooltipTrigger',
  props: {
    closeDelay: {
      type: Number,
      default: 500
    },
    content: {
      type: String,
      default: ''
    },
    defaultOpen: {
      type: Boolean,
      default: false
    },
    delay: {
      type: Number,
      default: 1500
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isOpen: {
      type: Boolean,
      default: undefined
    },
    modelValue: {
      type: Boolean,
      default: undefined
    },
    onOpenChange: {
      type: Function as PropType<((isOpen: boolean) => void) | undefined>,
      default: undefined
    },
    placement: {
      type: String as PropType<TooltipPlacement>,
      default: 'top'
    },
    shouldCloseOnPress: {
      type: Boolean,
      default: true
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    trigger: {
      type: String as PropType<TooltipTriggerMode>,
      default: 'focus hover'
    },
    variant: {
      type: String as PropType<TooltipVariant>,
      default: 'neutral'
    }
  },
  emits: {
    change: (value: boolean) => typeof value === 'boolean',
    openChange: (value: boolean) => typeof value === 'boolean',
    'update:isOpen': (value: boolean) => typeof value === 'boolean',
    'update:modelValue': (value: boolean) => typeof value === 'boolean'
  },
  setup(props, {attrs, emit, slots}) {
    let triggerRef = ref<HTMLElement | null>(null);
    let controlledOpen = computed<boolean | undefined>(() => {
      if (typeof props.isOpen === 'boolean') {
        return props.isOpen;
      }

      if (typeof props.modelValue === 'boolean') {
        return props.modelValue;
      }

      return undefined;
    });

    let tooltipState = useTooltipTriggerState({
      closeDelay: computed(() => props.closeDelay),
      defaultOpen: computed(() => props.defaultOpen),
      delay: computed(() => props.delay),
      isOpen: controlledOpen,
      onOpenChange: (nextOpen) => {
        props.onOpenChange?.(nextOpen);
        emit('update:isOpen', nextOpen);
        emit('update:modelValue', nextOpen);
        emit('change', nextOpen);
        emit('openChange', nextOpen);
      }
    });

    let tooltipTrigger = createTooltipTrigger({
      close: tooltipState.close,
      isDisabled: computed(() => props.isDisabled),
      isOpen: tooltipState.isOpen,
      open: tooltipState.open,
      shouldCloseOnPress: computed(() => props.shouldCloseOnPress),
      trigger: computed(() => props.trigger),
      triggerRef
    });

    return () => {
      let triggerProps = tooltipTrigger.triggerProps.value;
      let triggerChildren = slots.default?.({isOpen: tooltipTrigger.isOpen.value}) ?? 'Tooltip trigger';
      let tooltipChildren = slots.tooltip?.({isOpen: tooltipTrigger.isOpen.value}) ?? props.content;

      return h('span', {
        ...attrs,
        class: ['vs-tooltip-trigger', attrs.class],
        'data-vac': ''
      }, [
        h('span', {
          ref: triggerRef,
          class: 'vs-tooltip-trigger__target',
          tabindex: triggerProps.tabindex,
          'aria-describedby': triggerProps['aria-describedby'],
          onBlur: triggerProps.onBlur,
          onFocus: triggerProps.onFocus,
          onKeydown: triggerProps.onKeyDown,
          onKeyup: triggerProps.onKeyUp,
          onMouseenter: triggerProps.onMouseEnter,
          onMouseleave: triggerProps.onMouseLeave,
          onPointerdown: triggerProps.onPointerDown,
          onPointerenter: triggerProps.onPointerEnter,
          onPointerleave: triggerProps.onPointerLeave
        }, triggerChildren),
        h(VueTooltip, {
          id: tooltipTrigger.tooltipProps.value.id,
          isOpen: tooltipTrigger.isOpen.value,
          placement: props.placement,
          showIcon: props.showIcon,
          state: tooltipTrigger,
          variant: props.variant
        }, {
          default: () => tooltipChildren
        })
      ]);
    };
  }
});
