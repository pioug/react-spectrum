import {computed, defineComponent, h} from 'vue';
import {getSpectrumContext} from '../context';

export const VueSwitch = defineComponent({
  name: 'VueSwitch',
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
    let context = getSpectrumContext();

    let classes = computed(() => ([
      'vs-switch',
      context.value.scale === 'large' ? 'vs-switch--large' : 'vs-switch--medium',
      props.disabled ? 'is-disabled' : null
    ]));

    let onChange = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      let checked = target?.checked ?? false;
      emit('update:modelValue', checked);
      emit('change', checked);
    };

    return function render() {
      return h('label', {
        ...attrs,
        class: [classes.value, attrs.class],
        'data-vac': ''
      }, [
        h('span', {class: 'vs-switch__control'}, [
          h('input', {
            class: 'vs-switch__input',
            type: 'checkbox',
            role: 'switch',
            checked: props.modelValue,
            disabled: props.disabled,
            onChange,
            onFocus: (event: FocusEvent) => emit('focus', event),
            onBlur: (event: FocusEvent) => emit('blur', event)
          }),
          h('span', {class: 'vs-switch__track', 'aria-hidden': 'true'}, [
            h('span', {class: 'vs-switch__thumb'})
          ])
        ]),
        h('span', {class: 'vs-switch__label'}, slots.default ? slots.default() : props.label)
      ]);
    };
  }
});
