import {computed, defineComponent, h, type PropType} from 'vue';
import {getSpectrumContext} from '../context';

type DateRangeValue = {
  end: string,
  start: string
};

let calendarId = 0;
let rangeCalendarId = 0;

export const VueCalendar = defineComponent({
  name: 'VueCalendar',
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
    disabled: {
      type: Boolean,
      default: false
    },
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    change: (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();
    let generatedId = `vs-calendar-${++calendarId}`;
    let inputId = computed(() => props.id ?? generatedId);
    let classes = computed(() => ([
      'vs-calendar__input',
      context.value.scale === 'large' ? 'vs-calendar__input--large' : 'vs-calendar__input--medium'
    ]));

    return function render() {
      return h('label', {
        ...attrs,
        class: ['vs-calendar', attrs.class],
        'data-vac': ''
      }, [
        props.label ? h('span', {class: 'vs-calendar__label'}, props.label) : null,
        h('input', {
          id: inputId.value,
          class: classes.value,
          type: 'date',
          value: props.modelValue,
          disabled: props.disabled,
          min: props.min || undefined,
          max: props.max || undefined,
          onInput: (event: Event) => {
            let target = event.currentTarget as HTMLInputElement | null;
            let value = target?.value ?? '';
            emit('update:modelValue', value);
            emit('change', value);
          }
        })
      ]);
    };
  }
});

export const VueRangeCalendar = defineComponent({
  name: 'VueRangeCalendar',
  props: {
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
    disabled: {
      type: Boolean,
      default: false
    },
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    }
  },
  emits: {
    'update:modelValue': (value: DateRangeValue) => typeof value === 'object' && value !== null,
    change: (value: DateRangeValue) => typeof value === 'object' && value !== null
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();
    let generatedId = `vs-range-calendar-${++rangeCalendarId}`;

    let classes = computed(() => ([
      'vs-range-calendar__input',
      context.value.scale === 'large' ? 'vs-range-calendar__input--large' : 'vs-range-calendar__input--medium'
    ]));

    let emitChange = (value: DateRangeValue) => {
      emit('update:modelValue', value);
      emit('change', value);
    };

    return function render() {
      return h('fieldset', {
        ...attrs,
        class: ['vs-range-calendar', attrs.class],
        disabled: props.disabled,
        'data-vac': ''
      }, [
        props.label ? h('legend', {class: 'vs-range-calendar__label'}, props.label) : null,
        h('div', {class: 'vs-range-calendar__inputs'}, [
          h('label', {class: 'vs-range-calendar__field', for: `${generatedId}-start`}, 'Start'),
          h('input', {
            id: `${generatedId}-start`,
            class: classes.value,
            type: 'date',
            value: props.modelValue.start,
            min: props.min || undefined,
            max: props.max || undefined,
            onInput: (event: Event) => {
              let target = event.currentTarget as HTMLInputElement | null;
              let nextValue = {
                start: target?.value ?? '',
                end: props.modelValue.end
              };
              emitChange(nextValue);
            }
          }),
          h('label', {class: 'vs-range-calendar__field', for: `${generatedId}-end`}, 'End'),
          h('input', {
            id: `${generatedId}-end`,
            class: classes.value,
            type: 'date',
            value: props.modelValue.end,
            min: props.min || undefined,
            max: props.max || undefined,
            onInput: (event: Event) => {
              let target = event.currentTarget as HTMLInputElement | null;
              let nextValue = {
                start: props.modelValue.start,
                end: target?.value ?? ''
              };
              emitChange(nextValue);
            }
          })
        ])
      ]);
    };
  }
});
