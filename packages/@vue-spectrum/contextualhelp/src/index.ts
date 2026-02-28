import '@adobe/spectrum-css-temp/components/contextualhelp/vars.css';
import '@adobe/spectrum-css-temp/components/dialog/vars.css';
import '@adobe/spectrum-css-temp/components/popover/vars.css';
import {ActionButton} from '@vue-spectrum/button';
import HelpOutline from '@spectrum-icons-vue/workflow/HelpOutline';
import InfoOutline from '@spectrum-icons-vue/workflow/InfoOutline';
import {getEventTarget} from '@vue-aria/utils';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, type PropType, ref, watch} from 'vue';
const helpStyles: {[key: string]: string} = {};
let contextualHelpId = 0;


type ContextualHelpVariant = 'help' | 'info';
type ContextualHelpPlacement =
  | 'bottom'
  | 'bottom end'
  | 'bottom left'
  | 'bottom right'
  | 'bottom start'
  | 'end'
  | 'end bottom'
  | 'end top'
  | 'left'
  | 'left bottom'
  | 'left top'
  | 'right'
  | 'right bottom'
  | 'right top'
  | 'start'
  | 'start bottom'
  | 'start top'
  | 'top'
  | 'top end'
  | 'top left'
  | 'top right'
  | 'top start';

type PhysicalPlacementSide = 'bottom' | 'left' | 'right' | 'top';
type PhysicalPlacementAlign = 'bottom' | 'end' | 'left' | 'right' | 'start' | 'top';

function normalizeSide(rawSide: string | undefined, isRTL: boolean): PhysicalPlacementSide {
  if (rawSide === 'top' || rawSide === 'left' || rawSide === 'right') {
    return rawSide;
  }

  if (rawSide === 'start') {
    return isRTL ? 'right' : 'left';
  }

  if (rawSide === 'end') {
    return isRTL ? 'left' : 'right';
  }

  return 'bottom';
}

function normalizeAlign(side: PhysicalPlacementSide, rawAlign: string | undefined): PhysicalPlacementAlign {
  if (side === 'top' || side === 'bottom') {
    if (rawAlign === 'end' || rawAlign === 'right' || rawAlign === 'left') {
      return rawAlign;
    }

    return 'start';
  }

  if (rawAlign === 'bottom') {
    return 'bottom';
  }

  if (rawAlign === 'end') {
    return 'bottom';
  }

  if (rawAlign === 'top') {
    return 'top';
  }

  return 'top';
}

function resolvePlacement(placement: string, isRTL: boolean): {align: PhysicalPlacementAlign, side: PhysicalPlacementSide} {
  let [rawSide, rawAlign] = placement.trim().split(/\s+/);
  let side = normalizeSide(rawSide, isRTL);
  let align = normalizeAlign(side, rawAlign);
  return {align, side};
}

export const ContextualHelp = defineComponent({
  name: 'VueContextualHelp',
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    dismissable: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String as PropType<ContextualHelpPlacement>,
      default: 'bottom start'
    },
    offset: {
      type: Number,
      default: 8
    },
    crossOffset: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    },
    variant: {
      type: String as PropType<ContextualHelpVariant>,
      default: 'help'
    }
  },
  emits: {
    close: () => true,
    open: () => true,
    openChange: (value: boolean) => typeof value === 'boolean',
    'update:modelValue': (value: boolean) => typeof value === 'boolean'
  },
  setup(props, {attrs, emit, slots}) {
    let generatedId = `vs-contextual-help-${++contextualHelpId}`;
    let internalOpen = ref(props.modelValue);
    let rootRef = ref<HTMLElement | null>(null);
    let triggerRef = ref<HTMLElement | {$el?: Element} | null>(null);
    let triggerId = computed(() => typeof attrs.id === 'string' && attrs.id.length > 0 ? attrs.id : generatedId);
    let dialogId = computed(() => `${triggerId.value}-dialog`);
    let isRTL = computed(() => {
      if (attrs.dir === 'rtl') {
        return true;
      }

      if (attrs.dir === 'ltr') {
        return false;
      }

      if (typeof document !== 'undefined') {
        return document.documentElement.dir === 'rtl';
      }

      return false;
    });

    watch(() => props.modelValue, (value) => {
      internalOpen.value = value;
    });

    let externalLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });

    let explicitAriaLabel = computed(() => {
      let value = attrs['aria-label'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });

    let triggerLabel = computed(() => {
      if (explicitAriaLabel.value) {
        return explicitAriaLabel.value;
      }

      if (externalLabelledBy.value) {
        return undefined;
      }

      if (props.label) {
        return props.label;
      }

      return props.variant === 'info' ? 'Information' : 'Help';
    });
    let labelledBy = computed(() => {
      if (!externalLabelledBy.value) {
        return undefined;
      }

      let ids = new Set<string>(externalLabelledBy.value.trim().split(/\s+/).filter(Boolean));
      if (triggerLabel.value) {
        ids.add(triggerId.value);
      }

      return ids.size > 0 ? Array.from(ids).join(' ') : undefined;
    });

    let triggerIcon = computed(() => props.variant === 'info' ? InfoOutline : HelpOutline);
    let resolvedPlacement = computed(() => resolvePlacement(props.placement, isRTL.value));
    let popoverClassName = computed(() => classNames(
      {},
      'spectrum-Popover',
      `spectrum-Popover--${resolvedPlacement.value.side}`,
      'react-spectrum-Popover',
      {
        'is-open': internalOpen.value,
        [`is-open--${resolvedPlacement.value.side}`]: internalOpen.value
      }
    ));
    let popoverStyle = computed<Record<string, string>>(() => {
      let {align, side} = resolvedPlacement.value;
      let offset = `${props.offset}px`;
      let crossOffset = `${props.crossOffset}px`;
      let style: Record<string, string> = {
        position: 'absolute',
        zIndex: '1'
      };

      switch (side) {
        case 'top':
          style.bottom = `calc(100% + ${offset})`;
          break;
        case 'left':
          style.right = `calc(100% + ${offset})`;
          break;
        case 'right':
          style.left = `calc(100% + ${offset})`;
          break;
        default:
          style.top = `calc(100% + ${offset})`;
      }

      if (side === 'top' || side === 'bottom') {
        if (align === 'end' || align === 'right') {
          style.right = props.crossOffset === 0 ? '0' : `calc(0px - ${crossOffset})`;
        } else {
          style.left = crossOffset;
        }
      } else if (side === 'left' || side === 'right') {
        if (align === 'bottom') {
          style.bottom = props.crossOffset === 0 ? '0' : `calc(0px - ${crossOffset})`;
        } else {
          style.top = crossOffset;
        }
      }

      return style;
    });

    let setOpen = (nextValue: boolean) => {
      if (internalOpen.value === nextValue) {
        return;
      }

      let wasOpen = internalOpen.value;
      internalOpen.value = nextValue;
      emit('update:modelValue', nextValue);
      if (nextValue) {
        emit('open');
      } else {
        emit('close');
        if (wasOpen) {
          void nextTick(() => {
            let triggerElement = triggerRef.value instanceof HTMLElement
              ? triggerRef.value
              : triggerRef.value && '$el' in triggerRef.value && triggerRef.value.$el instanceof HTMLElement
                ? triggerRef.value.$el
                : null;
            triggerElement?.focus();
          });
        }
      }
      emit('openChange', nextValue);
    };

    let onDocumentPointerDown = (event: MouseEvent | PointerEvent | TouchEvent) => {
      if (!internalOpen.value || !props.dismissable) {
        return;
      }

      let target = getEventTarget(event);
      if (target instanceof Node && rootRef.value?.contains(target)) {
        return;
      }

      setOpen(false);
    };

    onMounted(() => {
      document.addEventListener('mousedown', onDocumentPointerDown, true);
      document.addEventListener('pointerdown', onDocumentPointerDown, true);
      document.addEventListener('touchstart', onDocumentPointerDown, true);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', onDocumentPointerDown, true);
      document.removeEventListener('pointerdown', onDocumentPointerDown, true);
      document.removeEventListener('touchstart', onDocumentPointerDown, true);
    });

    let triggerAttrs = computed(() => {
      let filteredAttrs: Record<string, unknown> = {};
      for (let [key, value] of Object.entries(attrs)) {
        if (key === 'aria-label' || key === 'aria-labelledby' || key === 'children' || key === 'class' || key === 'id') {
          continue;
        }

        filteredAttrs[key] = value;
      }

      return filteredAttrs;
    });

    return () => h('div', {
      ref: rootRef,
      class: 'vs-contextual-help',
      style: {
        display: 'inline-flex',
        position: 'relative'
      },
      'data-vac': ''
    }, [
      h(ActionButton, {
        ...triggerAttrs.value,
        ref: triggerRef,
        id: triggerId.value,
        class: [classNames(helpStyles, 'react-spectrum-ContextualHelp-button'), attrs.class],
        'aria-expanded': internalOpen.value ? 'true' : 'false',
        'aria-label': triggerLabel.value,
        'aria-labelledby': labelledBy.value,
        'aria-controls': internalOpen.value ? dialogId.value : undefined,
        isActive: internalOpen.value,
        isDisabled: props.disabled,
        isQuiet: true,
        onClick: () => setOpen(!internalOpen.value),
        onKeydown: (event: KeyboardEvent) => {
          if (event.key === 'Escape' && internalOpen.value && props.dismissable) {
            event.preventDefault();
            setOpen(false);
          }
        }
      }, {
        default: () => [
          h(triggerIcon.value, {
            size: 'S',
            'aria-hidden': 'true'
          })
        ]
      }),
      internalOpen.value
        ? h('div', {
          class: [popoverClassName.value, 'vs-contextual-help__popover'],
          'data-testid': 'popover',
          role: 'presentation',
          style: popoverStyle.value
        }, [
          h('section', {
            id: dialogId.value,
            class: [
              classNames({}, 'spectrum-Dialog', 'spectrum-Dialog--small', 'react-spectrum-Dialog'),
              classNames(helpStyles, 'react-spectrum-ContextualHelp-dialog')
            ],
            role: 'dialog',
            tabindex: -1,
            onKeydown: (event: KeyboardEvent) => {
              if (event.key === 'Escape' && props.dismissable) {
                event.preventDefault();
                setOpen(false);
              }
            }
          }, [
            h('div', {
              class: classNames(helpStyles, 'react-spectrum-ContextualHelp-content')
            }, slots.default ? slots.default() : []),
            slots.footer
              ? h('footer', {
                class: classNames(helpStyles, 'react-spectrum-ContextualHelp-footer')
              }, slots.footer())
              : null
          ])
        ])
        : null
    ]);
  }
});

export const VueContextualHelp = ContextualHelp;
export type {SpectrumContextualHelpProps} from '@vue-types/contextualhelp';
