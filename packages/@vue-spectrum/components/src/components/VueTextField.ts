import {computed, defineComponent, h} from 'vue';
import {getSpectrumContext} from '../context';

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
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
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
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();
    let generatedId = `vs-text-field-${++textFieldId}`;
    let inputId = computed(() => props.id ?? generatedId);

    let classes = computed(() => ([
      'vs-text-field__input',
      context.value.scale === 'large' ? 'vs-text-field__input--large' : 'vs-text-field__input--medium',
      props.invalid ? 'is-invalid' : null
    ]));

    let onInput = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      emit('update:modelValue', target?.value ?? '');
    };

    return function render() {
      let descriptionId = props.description ? `${inputId.value}-description` : undefined;

      return h('label', {class: ['vs-text-field', attrs.class]}, [
        props.label ? h('span', {class: 'vs-text-field__label'}, props.label) : null,
        h('input', {
          id: inputId.value,
          class: classes.value,
          value: props.modelValue,
          placeholder: props.placeholder,
          disabled: props.disabled,
          required: props.required,
          'aria-invalid': props.invalid ? 'true' : undefined,
          'aria-describedby': descriptionId,
          onInput,
          onFocus: (event: FocusEvent) => emit('focus', event),
          onBlur: (event: FocusEvent) => emit('blur', event)
        }),
        props.description
          ? h('span', {id: descriptionId, class: 'vs-text-field__description'}, props.description)
          : null
      ]);
    };
  }
});
