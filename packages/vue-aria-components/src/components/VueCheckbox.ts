import {defineComponent, h} from 'vue';

const HIDDEN_INPUT_STYLE = {
  border: '0px',
  clip: 'rect(0px, 0px, 0px, 0px)',
  clipPath: 'inset(50%)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: '0px',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px'
} as const;

export const VueCheckbox = defineComponent({
  name: 'VueCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: boolean) => typeof value === 'boolean',
    change: (value: boolean) => typeof value === 'boolean',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {emit, slots, attrs}) {
    let onChange = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      let checked = target?.checked ?? false;
      emit('update:modelValue', checked);
      emit('change', checked);
    };

    return function render() {
      return h('label', {
        ...attrs,
        class: ['react-aria-Checkbox', attrs.class],
        'data-rac': '',
        'data-react-aria-pressable': 'true',
        'data-disabled': props.disabled ? 'true' : undefined
      }, [
        h('span', {
          style: HIDDEN_INPUT_STYLE
        }, [
          h('input', {
            'data-react-aria-pressable': 'true',
            tabindex: props.disabled ? undefined : 0,
            type: 'checkbox',
            title: '',
            checked: props.modelValue,
            disabled: props.disabled,
            onChange,
            onFocus: (event: FocusEvent) => emit('focus', event),
            onBlur: (event: FocusEvent) => emit('blur', event)
          })
        ]),
        ...(slots.default
          ? slots.default()
          : [props.label])
      ]);
    };
  }
});
