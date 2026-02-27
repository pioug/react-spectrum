import '@adobe/spectrum-css-temp/components/contextualhelp/vars.css';
import {ActionButton} from '@vue-spectrum/button';
import HelpOutline from '@spectrum-icons-vue/workflow/HelpOutline';
import InfoOutline from '@spectrum-icons-vue/workflow/InfoOutline';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, nextTick, type PropType, ref, watch} from 'vue';
const helpStyles: {[key: string]: string} = {};


type ContextualHelpVariant = 'help' | 'info';
type ContextualHelpPlacement =
  | 'bottom'
  | 'bottom end'
  | 'bottom start'
  | 'left'
  | 'left bottom'
  | 'left top'
  | 'right'
  | 'right bottom'
  | 'right top'
  | 'top'
  | 'top end'
  | 'top start';

function normalizePlacement(placement: ContextualHelpPlacement): 'bottom' | 'left' | 'right' | 'top' {
  return (placement.split(' ')[0] as 'bottom' | 'left' | 'right' | 'top') || 'bottom';
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
    let internalOpen = ref(props.modelValue);
    let triggerRef = ref<HTMLElement | {$el?: Element} | null>(null);

    watch(() => props.modelValue, (value) => {
      internalOpen.value = value;
    });

    let triggerLabel = computed(() => {
      if (props.label) {
        return props.label;
      }

      return props.variant === 'info' ? 'Info' : 'Help';
    });

    let dialogTitle = computed(() => {
      if (props.title) {
        return props.title;
      }

      return props.variant === 'info' ? 'Information' : 'Help';
    });

    let triggerIcon = computed(() => props.variant === 'info' ? InfoOutline : HelpOutline);
    let placementSide = computed(() => normalizePlacement(props.placement));

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

    return () => h('div', {
      ...attrs,
      class: ['vs-contextual-help', attrs.class],
      'data-vac': ''
    }, [
      h(ActionButton, {
        ref: triggerRef,
        class: [
          classNames(helpStyles, 'react-spectrum-ContextualHelp-button'),
          'vs-contextual-help__trigger',
          props.variant === 'info' ? 'vs-contextual-help__trigger--info' : 'vs-contextual-help__trigger--help'
        ],
        'aria-haspopup': 'dialog',
        'aria-expanded': internalOpen.value ? 'true' : 'false',
        'aria-label': triggerLabel.value,
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
              class: 'vs-contextual-help__trigger-icon',
              'aria-hidden': 'true'
            })
          ]
        }),
      internalOpen.value
        ? h('div', {class: 'vs-contextual-help__layer'}, [
          props.dismissable
            ? h('button', {
              class: 'vs-contextual-help__backdrop',
              type: 'button',
              'aria-label': 'Dismiss contextual help',
              onClick: () => setOpen(false)
            })
            : null,
          h('section', {
            class: [
              classNames(helpStyles, 'react-spectrum-ContextualHelp-dialog'),
              'vs-contextual-help__dialog',
              `vs-contextual-help__dialog--${placementSide.value}`
            ],
            role: 'dialog',
            'aria-modal': 'false',
            'data-placement': props.placement,
            onKeydown: (event: KeyboardEvent) => {
              if (event.key === 'Escape' && props.dismissable) {
                event.preventDefault();
                setOpen(false);
              }
            }
          }, [
            h('header', {class: 'vs-contextual-help__header'}, [
              h('h3', {class: 'vs-contextual-help__title'}, dialogTitle.value),
              props.dismissable
                ? h('button', {
                  class: 'vs-contextual-help__close',
                  type: 'button',
                  'aria-label': 'Close contextual help',
                  onClick: () => setOpen(false)
                }, 'x')
                : null
            ]),
            h('div', {
              class: [classNames(helpStyles, 'react-spectrum-ContextualHelp-content'), 'vs-contextual-help__content']
            }, slots.default ? slots.default() : []),
            slots.footer
              ? h('footer', {
                class: [classNames(helpStyles, 'react-spectrum-ContextualHelp-footer'), 'vs-contextual-help__footer']
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
