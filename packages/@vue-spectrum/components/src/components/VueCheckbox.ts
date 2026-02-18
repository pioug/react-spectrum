import {computed, defineComponent, h} from 'vue';
import {getSpectrumContext} from '../context';

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
    let context = getSpectrumContext();

    let classes = computed(() => ([
      'vs-checkbox',
      context.value.scale === 'large' ? 'vs-checkbox--large' : 'vs-checkbox--medium',
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
        'data-vac': '',
        class: [classes.value, attrs.class]
      }, [
        h('input', {
          class: 'vs-checkbox__input',
          type: 'checkbox',
          checked: props.modelValue,
          disabled: props.disabled,
          onChange,
          onFocus: (event: FocusEvent) => emit('focus', event),
          onBlur: (event: FocusEvent) => emit('blur', event)
        }),
        h('span', {class: 'vs-checkbox__label'}, slots.default ? slots.default() : props.label)
      ]);
    };
  }
});
