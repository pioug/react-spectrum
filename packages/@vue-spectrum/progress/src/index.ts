import '@adobe/spectrum-css-temp/components/barloader/vars.css';
import '@adobe/spectrum-css-temp/components/circleloader/vars.css';
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
    ariaLabel: {
      type: String,
      default: ''
    },
    ariaLabelledby: {
      type: String,
      default: ''
    },
    isIndeterminate: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
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
    }
  },
  setup(props, {attrs, slots}) {
    let showValueLabel = computed(() => props.showValueLabel ?? !!props.label);
    let clampedValue = computed(() => clamp(props.value, props.minValue, props.maxValue));
    let percentage = computed(() => {
      if (props.maxValue <= props.minValue) {
        return 0;
      }
      return ((clampedValue.value - props.minValue) / (props.maxValue - props.minValue)) * 100;
    });

    return () => h('div', {
      ...attrs,
      class: [
        classNames(
          barStyles,
          'spectrum-BarLoader',
          {
            'spectrum-BarLoader--indeterminate': props.isIndeterminate,
            'spectrum-BarLoader--large': props.size === 'L',
            'spectrum-BarLoader--sideLabel': props.labelPosition === 'side',
            'spectrum-BarLoader--small': props.size === 'S'
          }
        ),
        'vs-progress-bar',
        attrs.class
      ],
      role: 'progressbar',
      'aria-label': props.ariaLabel || attrs['aria-label'],
      'aria-labelledby': props.ariaLabelledby || attrs['aria-labelledby'],
      'aria-valuemin': props.isIndeterminate ? undefined : props.minValue,
      'aria-valuemax': props.isIndeterminate ? undefined : props.maxValue,
      'aria-valuenow': props.isIndeterminate ? undefined : clampedValue.value,
      'aria-valuetext': props.isIndeterminate ? undefined : `${Math.round(percentage.value)}%`,
      'data-vac': ''
    }, [
      props.label
        ? h('span', {
          class: classNames(barStyles, 'spectrum-BarLoader-label')
        }, props.label)
        : null,
      showValueLabel.value
        ? h('div', {
          class: classNames(barStyles, 'spectrum-BarLoader-percentage')
        }, props.isIndeterminate ? '' : `${Math.round(percentage.value)}%`)
        : null,
      h('div', {
        class: classNames(barStyles, 'spectrum-BarLoader-track')
      }, [
        h('div', {
          class: classNames(barStyles, 'spectrum-BarLoader-fill'),
          style: props.isIndeterminate ? undefined : ({width: `${Math.round(percentage.value)}%`} as CSSProperties)
        })
      ]),
      slots.default ? h('span', {class: 'vs-progress-bar__content'}, slots.default()) : null
    ]);
  }
});

export const ProgressBarBase = ProgressBar;
export const VueProgressBar = ProgressBar;

export const ProgressCircle = defineComponent({
  name: 'VueSpectrumProgressCircle',
  inheritAttrs: false,
  props: {
    ariaLabel: {
      type: String,
      default: ''
    },
    ariaLabelledby: {
      type: String,
      default: ''
    },
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
    let clampedValue = computed(() => clamp(props.value, props.minValue, props.maxValue));
    let percentage = computed(() => {
      if (props.isIndeterminate || props.maxValue <= props.minValue) {
        return 0;
      }

      return ((clampedValue.value - props.minValue) / (props.maxValue - props.minValue)) * 100;
    });

    let fillSubMask1Style = computed<CSSProperties>(() => {
      if (props.isIndeterminate) {
        return {};
      }

      if (percentage.value > 0 && percentage.value <= 50) {
        let angle = -180 + (percentage.value / 50) * 180;
        return {
          transform: `rotate(${angle}deg)`
        };
      }

      if (percentage.value > 50) {
        return {
          transform: 'rotate(0deg)'
        };
      }

      return {
        transform: 'rotate(-180deg)'
      };
    });

    let fillSubMask2Style = computed<CSSProperties>(() => {
      if (props.isIndeterminate) {
        return {};
      }

      if (percentage.value > 50) {
        let angle = -180 + ((percentage.value - 50) / 50) * 180;
        return {
          transform: `rotate(${angle}deg)`
        };
      }

      return {
        transform: 'rotate(-180deg)'
      };
    });

    return () => h('div', {
      ...attrs,
      class: [
        classNames(
          circleStyles,
          'spectrum-CircleLoader',
          {
            'spectrum-CircleLoader--indeterminate': props.isIndeterminate,
            'spectrum-CircleLoader--large': props.size === 'L',
            'spectrum-CircleLoader--overBackground': props.variant === 'overBackground',
            'spectrum-CircleLoader--small': props.size === 'S',
            'spectrum-CircleLoader--staticBlack': props.staticColor === 'black',
            'spectrum-CircleLoader--staticWhite': props.staticColor === 'white'
          }
        ),
        'vs-progress-circle',
        attrs.class
      ],
      role: 'progressbar',
      'aria-label': props.ariaLabel || attrs['aria-label'],
      'aria-labelledby': props.ariaLabelledby || attrs['aria-labelledby'],
      'aria-valuemin': props.isIndeterminate ? undefined : props.minValue,
      'aria-valuemax': props.isIndeterminate ? undefined : props.maxValue,
      'aria-valuenow': props.isIndeterminate ? undefined : clampedValue.value,
      'data-vac': ''
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
  }
});

export type {SpectrumProgressBarProps, SpectrumProgressCircleProps};
