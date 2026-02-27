import {computed, defineComponent, h, type PropType} from 'vue';
import {getSpectrumContext} from '../context';

type DateRangeValue = {
  end: string,
  start: string
};

let dateFieldId = 0;
let datePickerId = 0;
let timeFieldId = 0;
let dateRangePickerId = 0;

function readInputValue(event: Event): string {
  let target = event.currentTarget as HTMLInputElement | null;
  return target?.value ?? '';
}

export const VueDateField = defineComponent({
  name: 'VueDateField',
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
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    change: (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();
    let generatedId = `vs-date-field-${++dateFieldId}`;

    let inputId = computed(() => props.id ?? generatedId);
    let inputClasses = computed(() => ([
      'vs-date-field__input',
      context.value.scale === 'large' ? 'vs-date-field__input--large' : 'vs-date-field__input--medium'
    ]));

    return function render() {
      return h('label', {
        ...attrs,
        class: ['vs-date-field', attrs.class],
        'data-vac': ''
      }, [
        props.label ? h('span', {class: 'vs-date-field__label'}, props.label) : null,
        h('input', {
          id: inputId.value,
          class: inputClasses.value,
          type: 'date',
          value: props.modelValue,
          disabled: props.disabled,
          min: props.min || undefined,
          max: props.max || undefined,
          onInput: (event: Event) => emit('update:modelValue', readInputValue(event)),
          onChange: (event: Event) => emit('change', readInputValue(event))
        }),
        props.description ? h('span', {class: 'vs-date-field__description'}, props.description) : null
      ]);
    };
  }
});

export const VueDatePicker = defineComponent({
  name: 'VueDatePicker',
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
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    change: (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();
    let generatedId = `vs-date-picker-${++datePickerId}`;

    let inputId = computed(() => props.id ?? generatedId);
    let inputClasses = computed(() => ([
      'vs-date-picker__input',
      context.value.scale === 'large' ? 'vs-date-picker__input--large' : 'vs-date-picker__input--medium'
    ]));

    return function render() {
      return h('label', {
        ...attrs,
        class: ['vs-date-picker', attrs.class],
        'data-vac': ''
      }, [
        props.label ? h('span', {class: 'vs-date-picker__label'}, props.label) : null,
        h('span', {class: 'vs-date-picker__control'}, [
          h('input', {
            id: inputId.value,
            class: inputClasses.value,
            type: 'date',
            value: props.modelValue,
            disabled: props.disabled,
            min: props.min || undefined,
            max: props.max || undefined,
            onInput: (event: Event) => emit('update:modelValue', readInputValue(event)),
            onChange: (event: Event) => emit('change', readInputValue(event))
          })
        ]),
        props.description ? h('span', {class: 'vs-date-picker__description'}, props.description) : null
      ]);
    };
  }
});

export const VueTimeField = defineComponent({
  name: 'VueTimeField',
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
    step: {
      type: Number,
      default: 60
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
    change: (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let generatedId = `vs-time-field-${++timeFieldId}`;

    let inputId = computed(() => props.id ?? generatedId);
    let descriptionId = computed(() => props.description ? `${inputId.value}-description` : undefined);

    return function render() {
      return h('div', {
        ...attrs,
        class: ['react-aria-TimeField', attrs.class],
        'data-rac': '',
        'data-disabled': props.disabled ? 'true' : undefined,
        'data-invalid': props.invalid ? 'true' : undefined,
        'data-readonly': props.readOnly ? 'true' : undefined,
        'data-required': props.required ? 'true' : undefined
      }, [
        props.label ? h('label', {class: 'react-aria-Label', for: inputId.value}, props.label) : null,
        h('div', {
          class: 'field',
          role: 'group',
          'data-rac': '',
          'data-react-aria-pressable': 'true'
        }, [
          h('input', {
            id: inputId.value,
            class: 'react-aria-Input',
            type: 'time',
            name: props.name || undefined,
            value: props.modelValue,
            disabled: props.disabled,
            readonly: props.readOnly || undefined,
            required: props.required,
            step: props.step,
            'aria-invalid': props.invalid ? 'true' : undefined,
            'aria-describedby': descriptionId.value,
            onInput: (event: Event) => emit('update:modelValue', readInputValue(event)),
            onChange: (event: Event) => emit('change', readInputValue(event))
          })
        ]),
        props.description ? h('span', {id: descriptionId.value, class: 'react-aria-Text'}, props.description) : null
      ]);
    };
  }
});

export const VueDateRangePicker = defineComponent({
  name: 'VueDateRangePicker',
  props: {
    id: {
      type: String,
      default: undefined
    },
    modelValue: {
      type: Object as PropType<DateRangeValue>,
      default: () => ({
        start: '',
        end: ''
      })
    },
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: DateRangeValue) => typeof value === 'object' && value !== null,
    change: (value: DateRangeValue) => typeof value === 'object' && value !== null
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();
    let generatedId = `vs-date-range-picker-${++dateRangePickerId}`;

    let fieldsetId = computed(() => props.id ?? generatedId);
    let inputClasses = computed(() => ([
      'vs-date-range-picker__input',
      context.value.scale === 'large' ? 'vs-date-range-picker__input--large' : 'vs-date-range-picker__input--medium'
    ]));

    let emitNextValue = (partial: Partial<DateRangeValue>, emitChange: boolean) => {
      let nextValue = {
        start: partial.start ?? props.modelValue.start,
        end: partial.end ?? props.modelValue.end
      };

      emit('update:modelValue', nextValue);
      if (emitChange) {
        emit('change', nextValue);
      }
    };

    return function render() {
      return h('fieldset', {
        ...attrs,
        class: ['vs-date-range-picker', attrs.class],
        disabled: props.disabled,
        'data-vac': ''
      }, [
        props.label ? h('legend', {class: 'vs-date-range-picker__label'}, props.label) : null,
        h('div', {class: 'vs-date-range-picker__controls'}, [
          h('label', {for: `${fieldsetId.value}-start`, class: 'vs-date-range-picker__field-label'}, 'Start'),
          h('input', {
            id: `${fieldsetId.value}-start`,
            class: inputClasses.value,
            type: 'date',
            value: props.modelValue.start,
            min: props.min || undefined,
            max: props.max || undefined,
            onInput: (event: Event) => emitNextValue({start: readInputValue(event)}, false),
            onChange: (event: Event) => emitNextValue({start: readInputValue(event)}, true)
          }),
          h('label', {for: `${fieldsetId.value}-end`, class: 'vs-date-range-picker__field-label'}, 'End'),
          h('input', {
            id: `${fieldsetId.value}-end`,
            class: inputClasses.value,
            type: 'date',
            value: props.modelValue.end,
            min: props.min || undefined,
            max: props.max || undefined,
            onInput: (event: Event) => emitNextValue({end: readInputValue(event)}, false),
            onChange: (event: Event) => emitNextValue({end: readInputValue(event)}, true)
          })
        ]),
        props.description ? h('span', {class: 'vs-date-range-picker__description'}, props.description) : null
      ]);
    };
  }
});
