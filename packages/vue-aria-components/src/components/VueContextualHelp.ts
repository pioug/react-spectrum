import {computed, defineComponent, h, type PropType, ref, watch} from 'vue';

type ContextualHelpVariant = 'help' | 'info';
type ContextualHelpPlacement = 'top' | 'right' | 'bottom' | 'left';

export const VueContextualHelp = defineComponent({
  name: 'VueContextualHelp',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    variant: {
      type: String as PropType<ContextualHelpVariant>,
      default: 'help'
    },
    placement: {
      type: String as PropType<ContextualHelpPlacement>,
      default: 'bottom'
    },
    dismissable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: boolean) => typeof value === 'boolean',
    open: () => true,
    close: () => true
  },
  setup(props, {emit, slots, attrs}) {
    let internalOpen = ref(props.modelValue);

    watch(() => props.modelValue, (value) => {
      internalOpen.value = value;
    });

    let dialogLabel = computed(() => {
      if (props.label) {
        return props.label;
      }

      return props.variant === 'info' ? 'Info' : 'Help';
    });

    let icon = computed(() => (props.variant === 'info' ? 'i' : '?'));

    let dialogTitle = computed(() => {
      if (props.title) {
        return props.title;
      }

      return props.variant === 'info' ? 'Information' : 'Help';
    });

    let setOpen = (nextValue: boolean) => {
      if (internalOpen.value === nextValue) {
        return;
      }

      internalOpen.value = nextValue;
      emit('update:modelValue', nextValue);
      if (nextValue) {
        emit('open');
      } else {
        emit('close');
      }
    };

    return function render() {
      return h('div', {
        ...attrs,
        class: ['vs-contextual-help', attrs.class],
        'data-vac': ''
      }, [
        h('button', {
          class: [
            'vs-contextual-help__trigger',
            props.variant === 'info' ? 'vs-contextual-help__trigger--info' : 'vs-contextual-help__trigger--help'
          ],
          type: 'button',
          disabled: props.disabled,
          'aria-haspopup': 'dialog',
          'aria-expanded': internalOpen.value,
          'aria-label': dialogLabel.value,
          onClick: () => setOpen(!internalOpen.value)
        }, [
          h('span', {class: 'vs-contextual-help__trigger-icon', 'aria-hidden': 'true'}, icon.value)
        ]),
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
              class: ['vs-contextual-help__dialog', `vs-contextual-help__dialog--${props.placement}`],
              role: 'dialog',
              'aria-modal': 'false'
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
              h('div', {class: 'vs-contextual-help__content'}, slots.default ? slots.default() : []),
              slots.footer ? h('footer', {class: 'vs-contextual-help__footer'}, slots.footer()) : null
            ])
          ])
          : null
      ]);
    };
  }
});
