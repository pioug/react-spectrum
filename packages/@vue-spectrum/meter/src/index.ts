import '@adobe/spectrum-css-temp/components/barloader/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {filterDOMProps, mergeIds, useId} from '@vue-aria/utils';
import {computed, type CSSProperties, defineComponent, h, type PropType} from 'vue';
const styles: {[key: string]: string} = {};


type Variant = 'critical' | 'informative' | 'positive' | 'warning';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

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
    let meterId = useId(typeof attrs.id === 'string' ? attrs.id : undefined);
    let labelId = useId();
    let showValueLabel = computed(() => props.showValueLabel ?? !!props.label);
    let clampedValue = computed(() => clamp(props.value, props.minValue, props.maxValue));
    let percentage = computed(() => {
      if (props.maxValue <= props.minValue) {
        return 0;
      }
      return ((clampedValue.value - props.minValue) / (props.maxValue - props.minValue)) * 100;
    });
    let formatter = computed(() => props.formatOptions ? new Intl.NumberFormat(undefined, props.formatOptions) : null);
    let defaultValueLabel = computed(() => {
      if (formatter.value) {
        return formatter.value.format(clampedValue.value);
      }

      return `${Math.round(percentage.value)}%`;
    });
    let valueLabel = computed(() => props.valueLabel ?? defaultValueLabel.value);

    return () => {
      let ariaLabel = attrs['aria-label'];
      let ariaLabelledby = attrs['aria-labelledby'];
      let hasLabel = !!props.label;

      if (!hasLabel && !ariaLabel && !ariaLabelledby && process.env.NODE_ENV !== 'production') {
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
        width: `${Math.round(percentage.value)}%`
      };

      return h('div', {
        ...otherDomProps,
        id: meterId,
        role: 'meter progressbar',
        'aria-label': !hasLabel && typeof ariaLabel === 'string' ? ariaLabel : undefined,
        'aria-labelledby': hasLabel
          ? mergeIds(labelId, typeof ariaLabelledby === 'string' ? ariaLabelledby : undefined)
          : (typeof ariaLabelledby === 'string' ? ariaLabelledby : undefined),
        'aria-valuemin': props.minValue,
        'aria-valuemax': props.maxValue,
        'aria-valuenow': clampedValue.value,
        'aria-valuetext': valueLabel.value,
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
            id: labelId,
            class: classNames(styles, 'spectrum-BarLoader-label')
          }, props.label)
          : null,
        showValueLabel.value
          ? h('div', {
            class: classNames(styles, 'spectrum-BarLoader-percentage')
          }, valueLabel.value)
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
