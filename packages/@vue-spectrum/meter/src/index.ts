import '@adobe/spectrum-css-temp/components/barloader/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType} from 'vue';
const styles: {[key: string]: string} = {};


type Variant = 'critical' | 'informative' | 'positive' | 'warning';

export const Meter = defineComponent({
  name: 'VueMeter',
  inheritAttrs: false,
  props: {
    formatOptions: {
      type: Object as PropType<Intl.NumberFormatOptions | undefined>,
      default: undefined
    },
    label: {
      type: String as PropType<string | null>,
      default: ''
    },
    max: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    maxValue: {
      type: Number,
      default: 100
    },
    min: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    minValue: {
      type: Number,
      default: 0
    },
    labelPosition: {
      type: String as PropType<'side' | 'top'>,
      default: 'top'
    },
    showValueLabel: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    size: {
      type: String as PropType<'L' | 'S'>,
      default: 'L'
    },
    value: {
      type: Number,
      default: 0
    },
    valueLabel: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    variant: {
      type: String as PropType<Variant>,
      default: 'informative'
    },
    width: {
      type: [Number, String] as PropType<number | string | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs}) {
    let resolvedMin = computed(() => props.min ?? props.minValue);
    let resolvedMax = computed(() => props.max ?? props.maxValue);
    let showValueLabel = computed(() => props.showValueLabel ?? !!props.label);
    let clampedValue = computed(() => Math.min(resolvedMax.value, Math.max(resolvedMin.value, props.value)));
    let percentage = computed(() => {
      if (resolvedMax.value <= resolvedMin.value) {
        return 0;
      }
      return ((clampedValue.value - resolvedMin.value) / (resolvedMax.value - resolvedMin.value)) * 100;
    });
    let formatter = computed(() => props.formatOptions ? new Intl.NumberFormat(undefined, props.formatOptions) : null);
    let defaultValueLabel = computed(() => {
      if (formatter.value) {
        return formatter.value.format(clampedValue.value);
      }

      return `${Math.round(percentage.value)}%`;
    });
    let valueLabel = computed(() => props.valueLabel ?? defaultValueLabel.value);

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
      class: [
        classNames(
          styles,
          'spectrum-BarLoader',
          {
            'spectrum-BarLoader--large': props.size === 'L',
            'spectrum-BarLoader--sideLabel': props.labelPosition === 'side',
            'spectrum-BarLoader--small': props.size === 'S'
          }
        ),
        'vs-meter',
        attrs.class
      ],
      style: {
        ...((attrs.style as Record<string, unknown>) ?? {}),
        width: props.width ?? (attrs.style as Record<string, unknown> | undefined)?.width
      },
      'data-vac': ''
    }, [
      props.label || showValueLabel.value
        ? h('div', {class: 'vs-meter__header'}, [
          props.label ? h('span', {class: ['vs-meter__label', classNames(styles, 'spectrum-BarLoader-label')]}, props.label) : null,
          showValueLabel.value ? h('span', {class: ['vs-meter__value', classNames(styles, 'spectrum-BarLoader-percentage')]}, valueLabel.value) : null
        ])
        : null,
      h('div', {
        class: ['vs-meter__track', classNames(styles, 'spectrum-BarLoader-track'), barClassName.value],
        role: 'meter',
        'aria-label': props.label || attrs['aria-label'] || undefined,
        'aria-valuemin': resolvedMin.value,
        'aria-valuemax': resolvedMax.value,
        'aria-valuenow': clampedValue.value,
        'aria-valuetext': valueLabel.value
      }, [
        h('div', {
          class: ['vs-meter__fill', classNames(styles, 'spectrum-BarLoader-fill')],
          style: {width: `${percentage.value}%`}
        })
      ])
    ]);
  }
});

export const VueMeter = Meter;
export type {SpectrumMeterProps} from '@vue-types/meter';
