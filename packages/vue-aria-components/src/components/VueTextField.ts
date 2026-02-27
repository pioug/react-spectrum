import {computed, defineComponent, h} from 'vue';

let textFieldId = 0;

export const VueTextField = defineComponent({
  name: 'VueTextField',
  props: {
    id: {
      type: String,
      default: undefined
    },
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
    name: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    autocomplete: {
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
    change: (value: string) => typeof value === 'string',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {emit, attrs}) {
    let generatedId = `vs-text-field-${++textFieldId}`;
    let inputId = computed(() => props.id ?? generatedId);

    let onInput = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      emit('update:modelValue', target?.value ?? '');
    };

    let onChange = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      emit('change', target?.value ?? '');
    };

    return function render() {
      let descriptionId = props.description ? `${inputId.value}-description` : undefined;

      return h('div', {
        ...attrs,
        class: ['react-aria-TextField', attrs.class],
        'data-rac': '',
        'data-disabled': props.disabled ? 'true' : undefined,
        'data-invalid': props.invalid ? 'true' : undefined,
        'data-readonly': props.readOnly ? 'true' : undefined,
        'data-required': props.required ? 'true' : undefined
      }, [
        props.label ? h('label', {class: 'react-aria-Label', for: inputId.value}, props.label) : null,
        h('input', {
          id: inputId.value,
          class: 'react-aria-Input',
          'data-rac': '',
          type: props.type,
          name: props.name || undefined,
          value: props.modelValue,
          placeholder: props.placeholder || undefined,
          autocomplete: props.autocomplete || undefined,
          disabled: props.disabled,
          readonly: props.readOnly || undefined,
          required: props.required,
          'aria-invalid': props.invalid ? 'true' : undefined,
          'aria-describedby': descriptionId,
          onInput,
          onChange,
          onFocus: (event: FocusEvent) => emit('focus', event),
          onBlur: (event: FocusEvent) => emit('blur', event)
        }),
        props.description
          ? h('span', {id: descriptionId, class: 'react-aria-Text'}, props.description)
          : null
      ]);
    };
  }
});
