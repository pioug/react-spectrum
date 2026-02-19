import {computed, defineComponent, h} from 'vue';
import {getSpectrumContext} from '../context';

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
    let context = getSpectrumContext();

    let normalizedValue = computed(() => {
      if (props.indeterminate) {
        return 0;
      }

      let clampedValue = Math.min(props.max, Math.max(props.min, props.value));
      if (props.max <= props.min) {
        return 0;
      }

      return ((clampedValue - props.min) / (props.max - props.min)) * 100;
    });

    let classes = computed(() => ([
      'vs-progress-bar',
      context.value.scale === 'large' ? 'vs-progress-bar--large' : 'vs-progress-bar--medium',
      props.indeterminate ? 'is-indeterminate' : null
    ]));

    return function render() {
      return h('div', {class: [classes.value, attrs.class], 'data-vac': ''}, [
        props.label || props.showValueLabel
          ? h('div', {class: 'vs-progress-bar__header'}, [
            props.label ? h('span', {class: 'vs-progress-bar__label'}, props.label) : null,
            props.showValueLabel && !props.indeterminate
              ? h('span', {class: 'vs-progress-bar__value'}, `${Math.round(normalizedValue.value)}%`)
              : null
          ])
          : null,
        h('div', {
          class: 'vs-progress-bar__track',
          role: 'progressbar',
          'aria-label': props.label || undefined,
          'aria-valuemin': props.indeterminate ? undefined : props.min,
          'aria-valuemax': props.indeterminate ? undefined : props.max,
          'aria-valuenow': props.indeterminate ? undefined : props.value
        }, [
          h('div', {
            class: 'vs-progress-bar__fill',
            style: {width: props.indeterminate ? '40%' : `${normalizedValue.value}%`}
          })
        ])
      ]);
    };
  }
});
