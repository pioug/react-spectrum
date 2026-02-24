import {computed, defineComponent, h} from 'vue';
import {getSpectrumContext} from '../context';

export const VueMeter = defineComponent({
  name: 'VueMeter',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    low: {
      type: Number,
      default: undefined
    },
    high: {
      type: Number,
      default: undefined
    },
    optimum: {
      type: Number,
      default: undefined
    },
    showValueLabel: {
      type: Boolean,
      default: true
    }
  },
  setup(props, {attrs}) {
    let context = getSpectrumContext();

    let clampedValue = computed(() => Math.min(props.max, Math.max(props.min, props.value)));
    let percentage = computed(() => {
      if (props.max <= props.min) {
        return 0;
      }

      return ((clampedValue.value - props.min) / (props.max - props.min)) * 100;
    });

    let classes = computed(() => ([
      'vs-meter',
      context.value.scale === 'large' ? 'vs-meter--large' : 'vs-meter--medium'
    ]));

    return function render() {
      return h('div', {class: [classes.value, attrs.class], 'data-vac': ''}, [
        props.label || props.showValueLabel
          ? h('div', {class: 'vs-meter__header'}, [
            props.label ? h('span', {class: 'vs-meter__label'}, props.label) : null,
            props.showValueLabel ? h('span', {class: 'vs-meter__value'}, `${Math.round(percentage.value)}%`) : null
          ])
          : null,
        h('div', {
          class: 'vs-meter__track',
          role: 'meter',
          'aria-label': props.label || undefined,
          'aria-valuemin': props.min,
          'aria-valuemax': props.max,
          'aria-valuenow': clampedValue.value,
          'aria-valuetext': `${Math.round(percentage.value)}%`,
          'data-low': props.low,
          'data-high': props.high,
          'data-optimum': props.optimum
        }, [
          h('div', {
            class: 'vs-meter__fill',
            style: {width: `${percentage.value}%`}
          })
        ])
      ]);
    };
  }
});
