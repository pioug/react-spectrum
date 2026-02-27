import {defineComponent, h} from 'vue';

export const VueSearchField = defineComponent({
  name: 'VueSearchField',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    invalid: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    clear: () => true,
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {emit, attrs}) {
    let onInput = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      emit('update:modelValue', target?.value ?? '');
    };

    let onClear = () => {
      if (props.disabled || props.readOnly || props.modelValue.length === 0) {
        return;
      }

      emit('update:modelValue', '');
      emit('clear');
    };

    return function render() {
      return h('div', {
        ...attrs,
        class: ['react-aria-SearchField', attrs.class],
        'data-rac': '',
        'data-empty': props.modelValue === '' ? 'true' : undefined,
        'data-disabled': props.disabled ? 'true' : undefined,
        'data-invalid': props.invalid ? 'true' : undefined,
        'data-readonly': props.readOnly ? 'true' : undefined,
        'data-required': props.required ? 'true' : undefined
      }, [
        props.label
          ? h('label', {class: 'react-aria-Label'}, props.label)
          : null,
        h('input', {
          class: 'react-aria-Input',
          type: 'search',
          value: props.modelValue,
          placeholder: props.placeholder || undefined,
          disabled: props.disabled,
          readonly: props.readOnly || undefined,
          required: props.required,
          'aria-invalid': props.invalid ? 'true' : undefined,
          onInput,
          onFocus: (event: FocusEvent) => emit('focus', event),
          onBlur: (event: FocusEvent) => emit('blur', event)
        }),
        h('button', {
          class: 'react-aria-Button',
          type: 'button',
          tabindex: -1,
          disabled: props.disabled || props.readOnly || props.modelValue.length === 0,
          'aria-label': 'Clear search',
          'data-react-aria-pressable': 'true',
          onClick: onClear
        }, '✕'),
        props.description
          ? h('span', {class: 'react-aria-Text'}, props.description)
          : null
      ]);
    };
  }
});
