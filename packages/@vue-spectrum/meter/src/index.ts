import '@adobe/spectrum-css-temp/components/barloader/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType} from 'vue';
const styles: {[key: string]: string} = {};


type Variant = 'critical' | 'informative' | 'positive' | 'warning';

export const Meter = defineComponent({
  name: 'VueMeter',
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: ''
    },
    max: {
      type: Number,
      default: 100
    },
    min: {
      type: Number,
      default: 0
    },
    showValueLabel: {
      type: Boolean,
      default: true
    },
    value: {
      type: Number,
      default: 0
    },
    variant: {
      type: String as PropType<Variant>,
      default: 'informative'
    }
  },
  setup(props, {attrs}) {
    let clampedValue = computed(() => Math.min(props.max, Math.max(props.min, props.value)));
    let percentage = computed(() => {
      if (props.max <= props.min) {
        return 0;
      }
      return ((clampedValue.value - props.min) / (props.max - props.min)) * 100;
    });

    let barClassName = computed(() => classNames(
      styles,
      {
        'is-positive': props.variant === 'positive',
        'is-warning': props.variant === 'warning',
        'is-critical': props.variant === 'critical'
      }
    ));

    return () => h('div', {
      ...attrs,
      class: ['vs-meter', attrs.class],
      'data-vac': ''
    }, [
      props.label || props.showValueLabel
        ? h('div', {class: 'vs-meter__header'}, [
          props.label ? h('span', {class: 'vs-meter__label'}, props.label) : null,
          props.showValueLabel ? h('span', {class: 'vs-meter__value'}, `${Math.round(percentage.value)}%`) : null
        ])
        : null,
      h('div', {
        class: ['vs-meter__track', barClassName.value],
        role: 'meter',
        'aria-label': props.label || undefined,
        'aria-valuemin': props.min,
        'aria-valuemax': props.max,
        'aria-valuenow': clampedValue.value,
        'aria-valuetext': `${Math.round(percentage.value)}%`
      }, [
        h('div', {
          class: 'vs-meter__fill',
          style: {width: `${percentage.value}%`}
        })
      ])
    ]);
  }
});

export const VueMeter = Meter;
export type {SpectrumMeterProps} from '@vue-types/meter';
