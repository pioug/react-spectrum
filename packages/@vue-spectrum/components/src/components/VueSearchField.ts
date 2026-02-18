import {computed, defineComponent, h} from 'vue';
import {getSpectrumContext} from '../context';

let searchFieldId = 0;

export const VueSearchField = defineComponent({
  name: 'VueSearchField',
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
    clear: () => true,
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();
    let generatedId = `vs-search-field-${++searchFieldId}`;
    let inputId = computed(() => props.id ?? generatedId);

    let classes = computed(() => ([
      'vs-search-field__input',
      context.value.scale === 'large' ? 'vs-search-field__input--large' : 'vs-search-field__input--medium',
      props.invalid ? 'is-invalid' : null
    ]));

    let onInput = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      emit('update:modelValue', target?.value ?? '');
    };

    let onClear = () => {
      emit('update:modelValue', '');
      emit('clear');
    };

    return function render() {
      let descriptionId = props.description ? `${inputId.value}-description` : undefined;

      return h('label', {class: ['vs-search-field', attrs.class], 'data-vac': ''}, [
        props.label ? h('span', {class: 'vs-search-field__label'}, props.label) : null,
        h('span', {class: 'vs-search-field__control'}, [
          h('input', {
            id: inputId.value,
            class: classes.value,
            type: 'search',
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
          props.modelValue && !props.disabled
            ? h('button', {
              class: 'vs-search-field__clear',
              type: 'button',
              'aria-label': 'Clear search',
              onClick: onClear
            }, 'Clear')
            : null
        ]),
        props.description
          ? h('span', {id: descriptionId, class: 'vs-search-field__description'}, props.description)
          : null
      ]);
    };
  }
});
