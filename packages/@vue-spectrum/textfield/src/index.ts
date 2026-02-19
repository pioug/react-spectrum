import {VueTextField} from '@vue-spectrum/components';
import {computed, defineComponent, h} from 'vue';
import type {SpectrumTextAreaProps, SpectrumTextFieldProps} from '@react-types/textfield';

let textAreaId = 0;

export const TextField = VueTextField;
export const TextFieldBase = VueTextField;
export {VueTextField};

export const TextArea = defineComponent({
  name: 'VueTextArea',
  inheritAttrs: false,
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
    },
    rows: {
      type: Number,
      default: 3
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {attrs, emit}) {
    let generatedId = `vs-text-area-${++textAreaId}`;
    let inputId = computed(() => props.id ?? generatedId);

    let onInput = (event: Event) => {
      let target = event.currentTarget as HTMLTextAreaElement | null;
      emit('update:modelValue', target?.value ?? '');
    };

    return () => {
      let descriptionId = props.description ? `${inputId.value}-description` : undefined;

      return h('label', {
        class: ['vs-text-field', attrs.class],
        'data-vac': ''
      }, [
        props.label ? h('span', {class: 'vs-text-field__label'}, props.label) : null,
        h('textarea', {
          id: inputId.value,
          class: ['vs-text-field__input', 'vs-text-field__input--multiline', props.invalid ? 'is-invalid' : null],
          rows: props.rows,
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

export type {SpectrumTextAreaProps, SpectrumTextFieldProps};
