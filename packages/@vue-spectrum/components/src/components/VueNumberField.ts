import {computed, defineComponent, h, type PropType} from 'vue';
import {getSpectrumContext} from '../context';

let numberFieldId = 0;

export const VueNumberField = defineComponent({
  name: 'VueNumberField',
  props: {
    id: {
      type: String,
      default: undefined
    },
    modelValue: {
      type: Number as PropType<number | null>,
      default: null
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
    },
    min: {
      type: Number,
      default: undefined
    },
    max: {
      type: Number,
      default: undefined
    },
    step: {
      type: Number,
      default: 1
    }
  },
  emits: {
    'update:modelValue': (value: number | null) => value === null || typeof value === 'number',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();
    let generatedId = `vs-number-field-${++numberFieldId}`;
    let inputId = computed(() => props.id ?? generatedId);

    let classes = computed(() => ([
      'vs-number-field__input',
      context.value.scale === 'large' ? 'vs-number-field__input--large' : 'vs-number-field__input--medium',
      props.invalid ? 'is-invalid' : null
    ]));

    let onInput = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      let rawValue = target?.value ?? '';
      if (rawValue === '') {
        emit('update:modelValue', null);
        return;
      }

      let parsedValue = Number(rawValue);
      emit('update:modelValue', Number.isFinite(parsedValue) ? parsedValue : null);
    };

    return function render() {
      let descriptionId = props.description ? `${inputId.value}-description` : undefined;

      return h('label', {class: ['vs-number-field', attrs.class], 'data-vac': ''}, [
        props.label ? h('span', {class: 'vs-number-field__label'}, props.label) : null,
        h('input', {
          id: inputId.value,
          class: classes.value,
          type: 'number',
          value: props.modelValue ?? '',
          placeholder: props.placeholder,
          disabled: props.disabled,
          required: props.required,
          min: props.min,
          max: props.max,
          step: props.step,
          'aria-invalid': props.invalid ? 'true' : undefined,
          'aria-describedby': descriptionId,
          onInput,
          onFocus: (event: FocusEvent) => emit('focus', event),
          onBlur: (event: FocusEvent) => emit('blur', event)
        }),
        props.description
          ? h('span', {id: descriptionId, class: 'vs-number-field__description'}, props.description)
          : null
      ]);
    };
  }
});
