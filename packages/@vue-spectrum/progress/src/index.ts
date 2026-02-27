import '@adobe/spectrum-css-temp/components/barloader/vars.css';
import '@adobe/spectrum-css-temp/components/circleloader/vars.css';
import {useProgressBar} from '@vue-aria/progress';
import {classNames} from '@vue-spectrum/utils';
import {computed, type CSSProperties, defineComponent, h, type PropType} from 'vue';
import type {SpectrumProgressBarProps, SpectrumProgressCircleProps} from '@vue-types/progress';
const barStyles: {[key: string]: string} = {};
const circleStyles: {[key: string]: string} = {};


function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export const ProgressBar = defineComponent({
  name: 'VueSpectrumProgressBar',
  inheritAttrs: false,
  props: {
    isIndeterminate: {
      type: Boolean,
      default: false
    },
    formatOptions: {
      type: Object as PropType<Intl.NumberFormatOptions | undefined>,
      default: undefined
    },
    label: {
      type: String as PropType<string | null | undefined>,
      default: undefined
    },
    labelPosition: {
      type: String as PropType<'side' | 'top'>,
      default: 'top'
    },
    maxValue: {
      type: Number,
      default: 100
    },
    minValue: {
      type: Number,
      default: 0
    },
    staticColor: {
      type: String as PropType<'black' | 'white' | undefined>,
      default: undefined
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
      type: String as PropType<'overBackground' | undefined>,
      default: undefined
    },
    width: {
      type: [Number, String] as PropType<number | string | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs}) {
    let resolvedValue = computed(() => clamp(props.value, props.minValue, props.maxValue));
    let ariaLabel = computed(() => {
      let value = attrs['aria-label'];
      return typeof value === 'string' ? value : undefined;
    });
    let ariaLabelledby = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' ? value : undefined;
    });
    let progress = useProgressBar({
      id: computed(() => typeof attrs.id === 'string' ? attrs.id : undefined),
      label: computed(() => props.label ?? undefined),
      value: resolvedValue,
      minValue: computed(() => props.minValue),
      maxValue: computed(() => props.maxValue),
      isIndeterminate: computed(() => props.isIndeterminate),
      valueLabel: computed(() => props.valueLabel),
      formatOptions: computed(() => props.formatOptions),
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby
    });
    let showValueLabel = computed(() => props.showValueLabel ?? !!props.label);
    let fillStyle = computed<CSSProperties>(() => {
      if (props.isIndeterminate) {
        return {};
      }

      let percentage = (resolvedValue.value - props.minValue) / (props.maxValue - props.minValue);
      return {
        width: `${Math.round(percentage * 100)}%`
      };
    });

    return () => {
      let progressBarProps = progress.progressBarProps.value;
      let labelProps = progress.labelProps.value;

      if (!props.label && !progressBarProps['aria-label'] && !progressBarProps['aria-labelledby'] && process.env.NODE_ENV !== 'production') {
        console.warn('If you do not provide a visible label via children, you must specify an aria-label or aria-labelledby attribute for accessibility');
      }

      return h('div', {
        ...progressBarProps,
        class: [
          classNames(
            barStyles,
            'spectrum-BarLoader',
            {
              'spectrum-BarLoader--small': props.size === 'S',
              'spectrum-BarLoader--large': props.size === 'L',
              'spectrum-BarLoader--indeterminate': props.isIndeterminate,
              'spectrum-BarLoader--sideLabel': props.labelPosition === 'side',
              'spectrum-BarLoader--overBackground': props.variant === 'overBackground',
              'spectrum-BarLoader--staticWhite': props.staticColor === 'white',
              'spectrum-BarLoader--staticBlack': props.staticColor === 'black'
            }
          ),
          attrs.className,
          attrs.class
        ],
        style: [
          {minWidth: '-moz-fit-content'},
          attrs.style,
          props.width != null ? ({width: props.width} as CSSProperties) : undefined
        ]
      }, [
        props.label
          ? h('span', {
            ...labelProps,
            class: classNames(barStyles, 'spectrum-BarLoader-label')
          }, props.label)
          : null,
        showValueLabel.value
          ? h('div', {
            class: classNames(barStyles, 'spectrum-BarLoader-percentage')
          }, progressBarProps['aria-valuetext'])
          : null,
        h('div', {
          class: classNames(barStyles, 'spectrum-BarLoader-track')
        }, [
          h('div', {
            class: classNames(barStyles, 'spectrum-BarLoader-fill'),
            style: fillStyle.value
          })
        ])
      ]);
    };
  }
});

export const ProgressBarBase = defineComponent({
  name: 'VueSpectrumProgressBarBase',
  inheritAttrs: false,
  props: ProgressBar.props,
  setup(props, {attrs, slots}) {
    return () => h(ProgressBar, {
      ...attrs,
      ...props
    }, slots);
  }
});
export const VueProgressBar = ProgressBar;

export const ProgressCircle = defineComponent({
  name: 'VueSpectrumProgressCircle',
  inheritAttrs: false,
  props: {
    isIndeterminate: {
      type: Boolean,
      default: false
    },
    maxValue: {
      type: Number,
      default: 100
    },
    minValue: {
      type: Number,
      default: 0
    },
    size: {
      type: String as PropType<'L' | 'M' | 'S'>,
      default: 'M'
    },
    staticColor: {
      type: String as PropType<'black' | 'white' | undefined>,
      default: undefined
    },
    value: {
      type: Number,
      default: 0
    },
    variant: {
      type: String as PropType<'overBackground' | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs}) {
    let resolvedValue = computed(() => clamp(props.value, props.minValue, props.maxValue));
    let ariaLabel = computed(() => {
      let value = attrs['aria-label'];
      return typeof value === 'string' ? value : undefined;
    });
    let ariaLabelledby = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' ? value : undefined;
    });
    let progress = useProgressBar({
      id: computed(() => typeof attrs.id === 'string' ? attrs.id : undefined),
      value: resolvedValue,
      minValue: computed(() => props.minValue),
      maxValue: computed(() => props.maxValue),
      isIndeterminate: computed(() => props.isIndeterminate),
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby
    });

    let fillSubMask1Style = computed<CSSProperties>(() => {
      let style: CSSProperties = {};
      if (props.isIndeterminate) {
        return style;
      }

      let percentage = ((resolvedValue.value - props.minValue) / (props.maxValue - props.minValue)) * 100;
      if (percentage > 0 && percentage <= 50) {
        let angle = -180 + (percentage / 50) * 180;
        style.transform = `rotate(${angle}deg)`;
      }
      if (percentage > 50) {
        style.transform = 'rotate(0deg)';
      }

      return style;
    });

    let fillSubMask2Style = computed<CSSProperties>(() => {
      let style: CSSProperties = {};
      if (props.isIndeterminate) {
        return style;
      }

      let percentage = ((resolvedValue.value - props.minValue) / (props.maxValue - props.minValue)) * 100;
      if (percentage > 50) {
        let angle = -180 + ((percentage - 50) / 50) * 180;
        style.transform = `rotate(${angle}deg)`;
      } else if (percentage > 0 && percentage <= 50) {
        style.transform = 'rotate(-180deg)';
      }

      return style;
    });

    return () => {
      let progressBarProps = progress.progressBarProps.value;

      if (!progressBarProps['aria-label'] && !progressBarProps['aria-labelledby'] && process.env.NODE_ENV !== 'production') {
        console.warn('ProgressCircle requires an aria-label or aria-labelledby attribute for accessibility');
      }

      return h('div', {
        ...progressBarProps,
        class: [
          classNames(
            circleStyles,
            'spectrum-CircleLoader',
            {
              'spectrum-CircleLoader--indeterminate': props.isIndeterminate,
              'spectrum-CircleLoader--small': props.size === 'S',
              'spectrum-CircleLoader--large': props.size === 'L',
              'spectrum-CircleLoader--overBackground': props.variant === 'overBackground',
              'spectrum-CircleLoader--staticWhite': props.staticColor === 'white',
              'spectrum-CircleLoader--staticBlack': props.staticColor === 'black'
            }
          ),
          attrs.className,
          attrs.class
        ],
        style: attrs.style
      }, [
        h('div', {class: classNames(circleStyles, 'spectrum-CircleLoader-track')}),
        h('div', {class: classNames(circleStyles, 'spectrum-CircleLoader-fills')}, [
          h('div', {class: classNames(circleStyles, 'spectrum-CircleLoader-fillMask1')}, [
            h('div', {
              class: classNames(circleStyles, 'spectrum-CircleLoader-fillSubMask1'),
              'data-testid': 'fillSubMask1',
              style: fillSubMask1Style.value
            }, [
              h('div', {class: classNames(circleStyles, 'spectrum-CircleLoader-fill')})
            ])
          ]),
          h('div', {class: classNames(circleStyles, 'spectrum-CircleLoader-fillMask2')}, [
            h('div', {
              class: classNames(circleStyles, 'spectrum-CircleLoader-fillSubMask2'),
              'data-testid': 'fillSubMask2',
              style: fillSubMask2Style.value
            }, [
              h('div', {class: classNames(circleStyles, 'spectrum-CircleLoader-fill')})
            ])
          ])
        ])
      ]);
    };
  }
});

export type {SpectrumProgressBarProps, SpectrumProgressCircleProps};
