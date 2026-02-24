import {computed, defineComponent, h} from 'vue';
import {getSpectrumContext} from '../context';

let sliderId = 0;

export const VueSlider = defineComponent({
  name: 'VueSlider',
  props: {
    id: {
      type: String,
      default: undefined
    },
    modelValue: {
      type: Number,
      default: 0
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
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showValue: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    'update:modelValue': (value: number) => typeof value === 'number' && Number.isFinite(value),
    change: (value: number) => typeof value === 'number' && Number.isFinite(value),
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();
    let generatedId = `vs-slider-${++sliderId}`;
    let inputId = computed(() => props.id ?? generatedId);

    let classes = computed(() => ([
      'vs-slider',
      context.value.scale === 'large' ? 'vs-slider--large' : 'vs-slider--medium',
      props.disabled ? 'is-disabled' : null
    ]));

    let onInput = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      let parsedValue = Number(target?.value);
      if (Number.isFinite(parsedValue)) {
        emit('update:modelValue', parsedValue);
      }
    };

    let onChange = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      let parsedValue = Number(target?.value);
      if (Number.isFinite(parsedValue)) {
        emit('change', parsedValue);
      }
    };

    return function render() {
      let descriptionId = props.description ? `${inputId.value}-description` : undefined;

      return h('label', {class: [classes.value, attrs.class], 'data-vac': ''}, [
        props.label || props.showValue
          ? h('span', {class: 'vs-slider__header'}, [
            props.label ? h('span', {class: 'vs-slider__label'}, props.label) : null,
            props.showValue ? h('span', {class: 'vs-slider__value'}, `${props.modelValue}`) : null
          ])
          : null,
        h('input', {
          id: inputId.value,
          class: 'vs-slider__input',
          type: 'range',
          value: props.modelValue,
          min: props.min,
          max: props.max,
          step: props.step,
          disabled: props.disabled,
          'aria-describedby': descriptionId,
          onInput,
          onChange,
          onFocus: (event: FocusEvent) => emit('focus', event),
          onBlur: (event: FocusEvent) => emit('blur', event)
        }),
        props.description
          ? h('span', {id: descriptionId, class: 'vs-slider__description'}, props.description)
          : null
      ]);
    };
  }
});
