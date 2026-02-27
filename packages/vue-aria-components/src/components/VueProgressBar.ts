import {computed, defineComponent, h, type PropType} from 'vue';

export const VueProgressBar = defineComponent({
  name: 'VueProgressBar',
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
    indeterminate: {
      type: Boolean,
      default: false
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

    let normalizedValue = computed(() => {
      if (props.indeterminate) {
        return 0;
      }

      if (resolvedMax.value <= resolvedMin.value) {
        return 0;
      }

      return ((clampedValue.value - resolvedMin.value) / (resolvedMax.value - resolvedMin.value)) * 100;
    });
    let valueText = computed(() => `${Math.round(normalizedValue.value)}%`);

    return function render() {
      return h('div', {
        ...attrs,
        class: ['react-aria-ProgressBar', attrs.class],
        role: 'progressbar',
        'data-rac': '',
        'data-indeterminate': props.indeterminate ? 'true' : undefined,
        'aria-label': props.label || undefined,
        'aria-valuemin': props.indeterminate ? undefined : resolvedMin.value,
        'aria-valuemax': props.indeterminate ? undefined : resolvedMax.value,
        'aria-valuenow': props.indeterminate ? undefined : clampedValue.value,
        'aria-valuetext': props.indeterminate ? undefined : valueText.value
      }, [
        props.label || props.showValueLabel
          ? h('div', {class: 'react-aria-LabelRow'}, [
            props.label ? h('span', {class: 'react-aria-Label'}, props.label) : null,
            props.showValueLabel && !props.indeterminate
              ? h('span', {class: 'value'}, valueText.value)
              : null
          ])
          : null,
        h('div', {
          class: 'bar'
        }, [
          h('div', {
            class: 'fill',
            style: {width: props.indeterminate ? '40%' : `${normalizedValue.value}%`}
          })
        ])
      ]);
    };
  }
});
