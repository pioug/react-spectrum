import '@adobe/spectrum-css-temp/components/barloader/vars.css';
import {useMeter} from '@vue-aria/meter';
import {classNames} from '@vue-spectrum/utils';
import {filterDOMProps} from '@vue-aria/utils';
import {computed, type CSSProperties, defineComponent, h, type PropType} from 'vue';
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
    maxValue: {
      type: Number,
      default: 100
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
    let showValueLabel = computed(() => props.showValueLabel ?? !!props.label);
    let ariaLabel = computed(() => {
      let value = attrs['aria-label'];
      return typeof value === 'string' ? value : undefined;
    });
    let ariaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' ? value : undefined;
    });
    let meter = useMeter({
      id: computed(() => typeof attrs.id === 'string' ? attrs.id : undefined),
      label: computed(() => props.label || undefined),
      value: computed(() => props.value),
      minValue: computed(() => props.minValue),
      maxValue: computed(() => props.maxValue),
      valueLabel: computed(() => props.valueLabel),
      formatOptions: computed(() => props.formatOptions),
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy
    });

    return () => {
      let meterProps = meter.meterProps.value;
      let labelProps = meter.labelProps.value;

      if (!props.label && !meterProps['aria-label'] && !meterProps['aria-labelledby'] && process.env.NODE_ENV !== 'production') {
        console.warn('If you do not provide a visible label via children, you must specify an aria-label or aria-labelledby attribute for accessibility');
      }

      let domProps = filterDOMProps(attrs as Record<string, unknown>, {labelable: true}) as Record<string, unknown>;
      let {
        class: domClass,
        className: domClassName,
        style: domStyle,
        ...otherDomProps
      } = domProps;
      delete otherDomProps.id;
      delete otherDomProps.role;
      delete otherDomProps['aria-label'];
      delete otherDomProps['aria-labelledby'];
      delete otherDomProps['aria-valuemin'];
      delete otherDomProps['aria-valuemax'];
      delete otherDomProps['aria-valuenow'];
      delete otherDomProps['aria-valuetext'];

      let valueFillStyle: CSSProperties = {
        width: `${Math.round(meter.percentage.value * 100)}%`
      };

      return h('div', {
        ...otherDomProps,
        ...meterProps,
        class: [
          classNames(
            styles,
            'spectrum-BarLoader',
            {
              'spectrum-BarLoader--large': props.size === 'L',
              'spectrum-BarLoader--small': props.size === 'S',
              'spectrum-BarLoader--sideLabel': props.labelPosition === 'side',
              'is-positive': props.variant === 'positive',
              'is-warning': props.variant === 'warning',
              'is-critical': props.variant === 'critical'
            }
          ),
          domClassName,
          domClass
        ],
        style: [
          {minWidth: '-moz-fit-content'},
          domStyle,
          props.width != null ? ({width: props.width} as CSSProperties) : undefined
        ]
      }, [
        props.label
          ? h('span', {
            ...labelProps,
            class: classNames(styles, 'spectrum-BarLoader-label')
          }, props.label)
          : null,
        showValueLabel.value
          ? h('div', {
            class: classNames(styles, 'spectrum-BarLoader-percentage')
          }, meterProps['aria-valuetext'])
          : null,
        h('div', {
          class: classNames(styles, 'spectrum-BarLoader-track')
        }, [
          h('div', {
            class: classNames(styles, 'spectrum-BarLoader-fill'),
            style: valueFillStyle
          })
        ])
      ]);
    };
  }
});

export const VueMeter = Meter;
export type {SpectrumMeterProps} from '@vue-types/meter';
