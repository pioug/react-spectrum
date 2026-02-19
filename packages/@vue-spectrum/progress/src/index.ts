import {VueProgressBar as VueProgressBarComponent} from '@vue-spectrum/components';
import {computed, defineComponent, h, type PropType} from 'vue';
import type {SpectrumProgressBarProps, SpectrumProgressCircleProps} from '@react-types/progress';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export const ProgressBar = defineComponent({
  name: 'VueSpectrumProgressBar',
  inheritAttrs: false,
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
      type: Number,
      default: 0
    },
    maxValue: {
      type: Number,
      default: 100
    },
    isIndeterminate: {
      type: Boolean,
      default: false
    },
    showValueLabel: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs}) {
    let showValueLabel = computed(() => props.showValueLabel ?? !!props.label);

    return () => h(VueProgressBarComponent, {
      ...attrs,
      label: props.label,
      value: props.value,
      min: props.minValue,
      max: props.maxValue,
      indeterminate: props.isIndeterminate,
      showValueLabel: showValueLabel.value
    });
  }
});

export const ProgressBarBase = ProgressBar;
export const VueProgressBar = VueProgressBarComponent;

export const ProgressCircle = defineComponent({
  name: 'VueSpectrumProgressCircle',
  inheritAttrs: false,
  props: {
    value: {
      type: Number,
      default: 0
    },
    minValue: {
      type: Number,
      default: 0
    },
    maxValue: {
      type: Number,
      default: 100
    },
    isIndeterminate: {
      type: Boolean,
      default: false
    },
    size: {
      type: String as PropType<'S' | 'M' | 'L'>,
      default: 'M'
    },
    staticColor: {
      type: String as PropType<'white' | 'black' | undefined>,
      default: undefined
    },
    variant: {
      type: String as PropType<'overBackground' | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs}) {
    let clampedValue = computed(() => clamp(props.value, props.minValue, props.maxValue));
    let normalizedValue = computed(() => {
      if (props.isIndeterminate || props.maxValue <= props.minValue) {
        return 0;
      }

      return ((clampedValue.value - props.minValue) / (props.maxValue - props.minValue)) * 100;
    });

    let radius = computed(() => {
      switch (props.size) {
        case 'S':
          return 14;
        case 'L':
          return 22;
        default:
          return 18;
      }
    });

    let circumference = computed(() => 2 * Math.PI * radius.value);
    let dashOffset = computed(() => circumference.value * (1 - normalizedValue.value / 100));

    return () => h('div', {
      ...attrs,
      class: [
        'vs-progress-circle',
        `vs-progress-circle--${props.size.toLowerCase()}`,
        props.isIndeterminate ? 'is-indeterminate' : null,
        props.staticColor ? `is-${props.staticColor}` : null,
        props.variant === 'overBackground' ? 'is-over-background' : null,
        attrs.class
      ],
      'data-vac': '',
      role: 'progressbar',
      'aria-valuemin': props.isIndeterminate ? undefined : props.minValue,
      'aria-valuemax': props.isIndeterminate ? undefined : props.maxValue,
      'aria-valuenow': props.isIndeterminate ? undefined : clampedValue.value
    }, [
      h('svg', {
        viewBox: '0 0 48 48',
        style: {
          width: props.size === 'S' ? '24px' : props.size === 'L' ? '40px' : '32px',
          height: props.size === 'S' ? '24px' : props.size === 'L' ? '40px' : '32px'
        }
      }, [
        h('circle', {
          cx: 24,
          cy: 24,
          r: radius.value,
          fill: 'none',
          stroke: 'currentColor',
          'stroke-opacity': 0.2,
          'stroke-width': 4
        }),
        h('circle', {
          cx: 24,
          cy: 24,
          r: radius.value,
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 4,
          'stroke-linecap': 'round',
          'stroke-dasharray': circumference.value,
          'stroke-dashoffset': props.isIndeterminate ? circumference.value * 0.65 : dashOffset.value,
          style: {
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
            transition: props.isIndeterminate ? undefined : 'stroke-dashoffset 150ms ease'
          }
        })
      ])
    ]);
  }
});

export type {SpectrumProgressBarProps, SpectrumProgressCircleProps};
