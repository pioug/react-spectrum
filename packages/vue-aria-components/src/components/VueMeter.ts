import {computed, defineComponent, h, type PropType} from 'vue';

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
    minValue: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    maxValue: {
      type: Number as PropType<number | undefined>,
      default: undefined
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
    let resolvedMin = computed(() => props.minValue ?? props.min);
    let resolvedMax = computed(() => props.maxValue ?? props.max);

    let clampedValue = computed(() => Math.min(resolvedMax.value, Math.max(resolvedMin.value, props.value)));
    let percentage = computed(() => {
      if (resolvedMax.value <= resolvedMin.value) {
        return 0;
      }

      return ((clampedValue.value - resolvedMin.value) / (resolvedMax.value - resolvedMin.value)) * 100;
    });
    let valueText = computed(() => `${Math.round(percentage.value)}%`);

    return function render() {
      return h('div', {
        ...attrs,
        class: ['react-aria-Meter', attrs.class],
        role: 'meter progressbar',
        'data-rac': '',
        'aria-label': props.label || undefined,
        'aria-valuemin': resolvedMin.value,
        'aria-valuemax': resolvedMax.value,
        'aria-valuenow': clampedValue.value,
        'aria-valuetext': valueText.value
      }, [
        props.label || props.showValueLabel
          ? h('div', {class: 'react-aria-LabelRow'}, [
            props.label ? h('span', {class: 'react-aria-Label'}, props.label) : null,
            props.showValueLabel ? h('span', {class: 'value'}, valueText.value) : null
          ])
          : null,
        h('div', {
          class: 'bar',
          'data-low': props.low,
          'data-high': props.high,
          'data-optimum': props.optimum
        }, [
          h('div', {
            class: 'fill',
            style: {width: `${percentage.value}%`}
          })
        ])
      ]);
    };
  }
});
