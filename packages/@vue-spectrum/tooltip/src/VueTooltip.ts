import '@adobe/spectrum-css-temp/components/tooltip/vars.css';
import {Overlay, useOverlayPosition} from '@vue-aria/overlays';
import {Provider, useProvider} from '@vue-spectrum/provider';
import {
  cloneVNode,
  computed,
  defineComponent,
  Fragment,
  h,
  isVNode,
  mergeProps,
  nextTick,
  onBeforeUnmount,
  type ComponentPublicInstance,
  type PropType,
  ref,
  type VNode,
  type VNodeChild,
  watch
} from 'vue';
import {useTooltip as createTooltip, useTooltipTrigger as createTooltipTrigger, type TooltipTriggerAria, type TooltipTriggerMode} from '@vue-aria/tooltip';
import {useTooltipTriggerState} from '@vue-stately/tooltip';

export type TooltipPlacement = 'bottom' | 'left' | 'right' | 'top';
export type TooltipVariant = 'info' | 'negative' | 'neutral' | 'positive';

export interface TooltipSharedProps {
  placement?: TooltipPlacement,
  showIcon?: boolean,
  variant?: TooltipVariant
}

type TooltipArrowStyle = {
  left?: string,
  top?: string
};

const iconByVariant: Record<TooltipVariant, string> = {
  neutral: '',
  info: 'i',
  positive: '✓',
  negative: '!'
};
const DEFAULT_CROSS_OFFSET = 0;
const DEFAULT_OFFSET = -1;

function resolveTooltipTriggerVNode(content: VNodeChild): VNode | null {
  if (!Array.isArray(content)) {
    return isVNode(content) ? content : null;
  }

  let vnodeChildren = content.filter((entry): entry is VNode => isVNode(entry));
  return vnodeChildren.length === 1 ? vnodeChildren[0] : null;
}

function getVNodeDisplayName(node: VNode): string | undefined {
  let type = node.type;
  if (typeof type === 'object' && type != null) {
    let namedType = type as {displayName?: string, name?: string};
    return namedType.displayName || namedType.name;
  }

  if (typeof type === 'function') {
    let namedType = type as {displayName?: string, name?: string};
    return namedType.displayName || namedType.name;
  }

  return undefined;
}

function isDirectTriggerVNode(node: VNode | null): node is VNode {
  if (node == null) {
    return false;
  }

  if (typeof node.type === 'string') {
    return ['a', 'button', 'input', 'textarea'].includes(node.type);
  }

  let displayName = getVNodeDisplayName(node);
  return typeof displayName === 'string' && /(Button|Link)$/.test(displayName);
}

function resolveTooltipTriggerElement(value: Element | ComponentPublicInstance | null): HTMLElement | null {
  if (value instanceof HTMLElement) {
    return value;
  }

  let maybeElement = value != null && '$el' in value ? value.$el : null;
  return maybeElement instanceof HTMLElement ? maybeElement : null;
}

function assignVNodeRef(
  targetRef: VNode['ref'],
  value: Element | ComponentPublicInstance | null
): void {
  if (typeof targetRef === 'function') {
    targetRef(value, {});
    return;
  }

  if (targetRef && typeof targetRef === 'object' && 'value' in targetRef) {
    targetRef.value = value;
  }
}

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
    arrowStyle: {
      type: Object as PropType<TooltipArrowStyle | undefined>,
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
          class: 'spectrum-Tooltip-typeIcon',
          'aria-hidden': 'true'
        }, iconByVariant[props.variant])
        : null;
      let children: VNodeChild[] = [];
      if (icon) {
        children.push(icon);
      }
      if (slotContent != null) {
        children.push(h('span', {
          class: 'spectrum-Tooltip-label'
        }, slotContent));
      }
      children.push(h('span', {
        'aria-hidden': 'true',
        class: 'spectrum-Tooltip-tip',
        role: 'presentation',
        style: props.arrowStyle
      }));

      return h('div', {
        ...attrs,
        id: tooltipProps.id,
        role: tooltipProps.role,
        'aria-label': tooltipProps['aria-label'],
        'aria-labelledby': tooltipProps['aria-labelledby'],
        class: [
          'spectrum-Tooltip',
          'spectrum-overlay',
          'spectrum-overlay--open',
          `spectrum-overlay--${props.placement}--open`,
          `spectrum-Tooltip--${props.variant}`,
          `spectrum-Tooltip--${props.placement}`,
          'is-open',
          `is-open--${props.placement}`,
          attrs.class
        ],
        onMouseenter: tooltipProps.onMouseEnter,
        onMouseleave: tooltipProps.onMouseLeave,
        onPointerenter: tooltipProps.onPointerEnter,
        onPointerleave: tooltipProps.onPointerLeave
      }, children);
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
    offset: {
      type: Number,
      default: DEFAULT_OFFSET
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
    let overlayRef = ref<HTMLElement | null>(null);
    let triggerRef = ref<HTMLElement | null>(null);
    let provider = useProvider();
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
    let overlayPosition = useOverlayPosition({
      crossOffset: computed(() => DEFAULT_CROSS_OFFSET),
      isOpen: tooltipState.isOpen,
      offset: computed(() => props.offset),
      overlayRef,
      placement: computed(() => props.placement),
      targetRef: triggerRef
    });

    watch(
      () => [tooltipState.isOpen.value, props.placement] as const,
      async ([isOpen]) => {
        if (!isOpen) {
          return;
        }

        await nextTick();
        overlayPosition.updatePosition();
      },
      {flush: 'post'}
    );

    onBeforeUnmount(() => {
      overlayPosition.dispose();
    });

    return () => {
      let triggerProps = tooltipTrigger.triggerProps.value;
      let triggerDomProps = {
        ...(triggerProps.tabindex != null ? {tabindex: triggerProps.tabindex} : {}),
        ...(triggerProps['aria-describedby'] != null ? {'aria-describedby': triggerProps['aria-describedby']} : {}),
        ...(triggerProps.onBlur ? {onBlur: triggerProps.onBlur} : {}),
        ...(triggerProps.onFocus ? {onFocus: triggerProps.onFocus} : {}),
        ...(triggerProps.onKeyDown ? {onKeydown: triggerProps.onKeyDown} : {}),
        ...(triggerProps.onKeyUp ? {onKeyup: triggerProps.onKeyUp} : {}),
        ...(triggerProps.onMouseEnter ? {onMouseenter: triggerProps.onMouseEnter} : {}),
        ...(triggerProps.onMouseLeave ? {onMouseleave: triggerProps.onMouseLeave} : {}),
        ...(triggerProps.onPointerDown ? {onPointerdown: triggerProps.onPointerDown} : {}),
        ...(triggerProps.onPointerEnter ? {onPointerenter: triggerProps.onPointerEnter} : {}),
        ...(triggerProps.onPointerLeave ? {onPointerleave: triggerProps.onPointerLeave} : {})
      };
      let triggerChildren = slots.default?.({isOpen: tooltipTrigger.isOpen.value}) ?? 'Tooltip trigger';
      let tooltipChildren = slots.tooltip?.({isOpen: tooltipTrigger.isOpen.value}) ?? props.content;
      let triggerNode = resolveTooltipTriggerVNode(triggerChildren);
      let tooltipNode = tooltipTrigger.isOpen.value
        ? h(Overlay, {
          disableFocusManagement: true
        }, {
          default: () => [
            h('span', {
              'data-focus-scope-start': 'true',
              hidden: true
            }),
            h(Provider, {
              colorScheme: provider.colorScheme,
              dir: provider.dir,
              isDisabled: false,
              locale: provider.locale,
              scale: provider.scale,
              theme: provider.theme,
              style: {
                background: 'transparent',
                isolation: 'isolate'
              }
            }, {
              default: () => h(VueTooltip, {
                ref: (value: Element | ComponentPublicInstance | null) => {
                  overlayRef.value = resolveTooltipTriggerElement(value);
                },
                arrowStyle: overlayPosition.arrowProps.value.style,
                id: tooltipTrigger.tooltipProps.value.id,
                isOpen: tooltipTrigger.isOpen.value,
                placement: overlayPosition.placement.value,
                showIcon: props.showIcon,
                state: tooltipTrigger,
                style: {
                  ...overlayPosition.overlayProps.value.style,
                  maxHeight: '420px',
                  zIndex: '100000'
                },
                variant: props.variant
              }, {
                default: () => tooltipChildren
              })
            }),
            h('span', {
              'data-focus-scope-end': 'true',
              hidden: true
            })
          ]
        })
        : null;

      if (isDirectTriggerVNode(triggerNode)) {
        let existingRef = triggerNode.ref;
        let clonedTrigger = cloneVNode(triggerNode, mergeProps(attrs, triggerDomProps, {
          ref: (value: Element | ComponentPublicInstance | null) => {
            triggerRef.value = resolveTooltipTriggerElement(value);
            assignVNodeRef(existingRef, value);
          }
        }), true);

        if (!tooltipNode) {
          return clonedTrigger;
        }

        return h(Fragment, null, [clonedTrigger, tooltipNode]);
      }

      return h('span', {
        ...attrs,
        class: ['vs-tooltip-trigger', attrs.class],
        'data-vac': ''
      }, [
        h('span', {
          ref: triggerRef,
          class: 'vs-tooltip-trigger__target',
          ...triggerDomProps
        }, triggerChildren),
        tooltipNode
      ]);
    };
  }
});
