import '@adobe/spectrum-css-temp/components/slider/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
const styles: {[key: string]: string} = {};


type RangeValue = {
  end: number,
  start: number
};

let sliderId = 0;
let rangeSliderId = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export const Slider = defineComponent({
  name: 'VueSlider',
  inheritAttrs: false,
  props: {
    description: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: undefined
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
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
    modelValue: {
      type: Number,
      default: 0
    },
    showValue: {
      type: Boolean,
      default: true
    },
    step: {
      type: Number,
      default: 1
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: number) => typeof value === 'number' && Number.isFinite(value),
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    'update:modelValue': (value: number) => typeof value === 'number' && Number.isFinite(value)
  },
  setup(props, {emit, attrs}) {
    let generatedId = `vs-slider-${++sliderId}`;
    let inputId = computed(() => props.id ?? generatedId);
    let descriptionId = computed(() => props.description ? `${inputId.value}-description` : undefined);

    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let clampedValue = computed(() => clamp(props.modelValue, props.min, props.max));
    let percent = computed(() => {
      let range = props.max - props.min;
      if (range <= 0) {
        return 0;
      }
      return (clampedValue.value - props.min) / range;
    });

    let isHovered = ref(false);
    let isFocused = ref(false);
    let isDragged = ref(false);

    let rootClassName = computed(() => classNames(
      styles,
      'spectrum-Slider',
      'spectrum-Slider--positionTop',
      {
        'is-disabled': isDisabled.value
      }
    ));

    let handleClassName = computed(() => classNames(
      styles,
      'spectrum-Slider-handle',
      {
        'is-hovered': isHovered.value && !isDisabled.value,
        'is-dragged': isDragged.value,
        'is-focused': isFocused.value,
        'is-tophandle': isFocused.value
      }
    ));

    let emitValue = (value: number, isChange: boolean) => {
      let next = clamp(value, props.min, props.max);
      emit('update:modelValue', next);
      if (isChange) {
        emit('change', next);
      }
    };

    return () => h('div', {
      ...attrs,
      class: [rootClassName.value, 'vs-slider', attrs.class],
      'data-vac': ''
    }, [
      props.label || props.showValue
        ? h('div', {class: classNames(styles, 'spectrum-Slider-labelContainer')}, [
          props.label ? h('label', {class: [classNames(styles, 'spectrum-Slider-label'), 'vs-slider__label']}, props.label) : null,
          props.showValue ? h('output', {class: [classNames(styles, 'spectrum-Slider-value'), 'vs-slider__value']}, `${clampedValue.value}`) : null
        ])
        : null,
      h('div', {class: classNames(styles, 'spectrum-Slider-controls')}, [
        h('div', {
          class: classNames(styles, 'spectrum-Slider-track'),
          style: {width: `${percent.value * 100}%`}
        }),
        h('div', {
          class: [handleClassName.value, 'vs-slider__handle'],
          style: {left: `${percent.value * 100}%`},
          onMouseenter: () => {
            if (isDisabled.value) {
              return;
            }
            isHovered.value = true;
          },
          onMouseleave: () => {
            isHovered.value = false;
            isDragged.value = false;
          },
          onMousedown: () => {
            if (isDisabled.value) {
              return;
            }
            isDragged.value = true;
          },
          onMouseup: () => {
            isDragged.value = false;
          }
        }, [
          h('input', {
            id: inputId.value,
            class: [classNames(styles, 'spectrum-Slider-input'), 'vs-slider__input'],
            type: 'range',
            value: clampedValue.value,
            min: props.min,
            max: props.max,
            step: props.step,
            disabled: isDisabled.value,
            'aria-label': typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : (props.label || undefined),
            'aria-describedby': descriptionId.value,
            onInput: (event: Event) => {
              let target = event.currentTarget as HTMLInputElement | null;
              emitValue(Number(target?.value), false);
            },
            onChange: (event: Event) => {
              let target = event.currentTarget as HTMLInputElement | null;
              emitValue(Number(target?.value), true);
            },
            onFocus: (event: FocusEvent) => {
              isFocused.value = true;
              emit('focus', event);
            },
            onBlur: (event: FocusEvent) => {
              isFocused.value = false;
              isDragged.value = false;
              emit('blur', event);
            }
          }),
          h('input', {
            type: 'hidden',
            hidden: true,
            value: clampedValue.value
          })
        ]),
        h('div', {
          class: classNames(styles, 'spectrum-Slider-track'),
          style: {width: `${(1 - percent.value) * 100}%`}
        })
      ]),
      props.description
        ? h('span', {id: descriptionId.value, class: 'vs-slider__description'}, props.description)
        : null
    ]);
  }
});

export const RangeSlider = defineComponent({
  name: 'VueRangeSlider',
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
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
    modelValue: {
      type: Object as PropType<RangeValue>,
      default: () => ({start: 0, end: 100})
    },
    showValue: {
      type: Boolean,
      default: true
    },
    step: {
      type: Number,
      default: 1
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: RangeValue) => typeof value === 'object' && value !== null,
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    'update:modelValue': (value: RangeValue) => typeof value === 'object' && value !== null
  },
  setup(props, {emit, attrs}) {
    let generatedId = `vs-range-slider-${++rangeSliderId}`;
    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let hoveredThumb = ref<0 | 1 | null>(null);
    let draggedThumb = ref<0 | 1 | null>(null);
    let focusedThumb = ref<0 | 1 | null>(null);

    let start = computed(() => clamp(Math.min(props.modelValue.start, props.modelValue.end), props.min, props.max));
    let end = computed(() => clamp(Math.max(props.modelValue.start, props.modelValue.end), props.min, props.max));
    let range = computed(() => props.max - props.min <= 0 ? 1 : props.max - props.min);
    let startPercent = computed(() => (start.value - props.min) / range.value);
    let endPercent = computed(() => (end.value - props.min) / range.value);

    let rootClassName = computed(() => classNames(
      styles,
      'spectrum-Slider',
      'spectrum-Slider--positionTop',
      'spectrum-Slider--range',
      {
        'is-disabled': isDisabled.value
      }
    ));

    let thumbClass = (index: 0 | 1) => classNames(
      styles,
      'spectrum-Slider-handle',
      {
        'is-hovered': hoveredThumb.value === index && !isDisabled.value,
        'is-dragged': draggedThumb.value === index,
        'is-focused': focusedThumb.value === index,
        'is-tophandle': focusedThumb.value === index
      }
    );

    let emitRange = (next: RangeValue, isChange: boolean) => {
      let clampedStart = clamp(Math.min(next.start, next.end), props.min, props.max);
      let clampedEnd = clamp(Math.max(next.start, next.end), props.min, props.max);
      let value = {start: clampedStart, end: clampedEnd};
      emit('update:modelValue', value);
      if (isChange) {
        emit('change', value);
      }
    };

    let handleInput = (index: 0 | 1, event: Event, isChange: boolean) => {
      let target = event.currentTarget as HTMLInputElement | null;
      let nextValue = Number(target?.value);
      if (!Number.isFinite(nextValue)) {
        return;
      }

      if (index === 0) {
        emitRange({start: nextValue, end: end.value}, isChange);
      } else {
        emitRange({start: start.value, end: nextValue}, isChange);
      }
    };

    return () => h('div', {
      ...attrs,
      class: [rootClassName.value, 'vs-slider', attrs.class],
      'data-vac': ''
    }, [
      props.label || props.showValue
        ? h('div', {class: classNames(styles, 'spectrum-Slider-labelContainer')}, [
          props.label ? h('label', {class: [classNames(styles, 'spectrum-Slider-label'), 'vs-slider__label']}, props.label) : null,
          props.showValue ? h('output', {class: [classNames(styles, 'spectrum-Slider-value'), 'vs-slider__value']}, `${start.value} – ${end.value}`) : null
        ])
        : null,
      h('div', {class: classNames(styles, 'spectrum-Slider-controls')}, [
        h('div', {class: classNames(styles, 'spectrum-Slider-track'), style: {width: `${startPercent.value * 100}%`}}),
        h('div', {
          class: [thumbClass(0), 'vs-slider__handle'],
          style: {left: `${startPercent.value * 100}%`},
          onMouseenter: () => {
            if (!isDisabled.value) {
              hoveredThumb.value = 0;
            }
          },
          onMouseleave: () => {
            if (hoveredThumb.value === 0) {
              hoveredThumb.value = null;
            }
            if (draggedThumb.value === 0) {
              draggedThumb.value = null;
            }
          },
          onMousedown: () => {
            if (!isDisabled.value) {
              draggedThumb.value = 0;
            }
          },
          onMouseup: () => {
            if (draggedThumb.value === 0) {
              draggedThumb.value = null;
            }
          }
        }, [
          h('input', {
            id: `${generatedId}-start`,
            class: [classNames(styles, 'spectrum-Slider-input'), 'vs-slider__input'],
            type: 'range',
            min: props.min,
            max: props.max,
            step: props.step,
            value: start.value,
            disabled: isDisabled.value,
            'aria-label': typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : 'Minimum',
            onInput: (event: Event) => handleInput(0, event, false),
            onChange: (event: Event) => handleInput(0, event, true),
            onFocus: (event: FocusEvent) => {
              focusedThumb.value = 0;
              emit('focus', event);
            },
            onBlur: (event: FocusEvent) => {
              if (focusedThumb.value === 0) {
                focusedThumb.value = null;
              }
              if (draggedThumb.value === 0) {
                draggedThumb.value = null;
              }
              emit('blur', event);
            }
          }),
          h('input', {type: 'hidden', hidden: true, value: start.value})
        ]),
        h('div', {
          class: classNames(styles, 'spectrum-Slider-track'),
          style: {
            left: `${startPercent.value * 100}%`,
            width: `${Math.abs(endPercent.value - startPercent.value) * 100}%`
          }
        }),
        h('div', {
          class: [thumbClass(1), 'vs-slider__handle'],
          style: {left: `${endPercent.value * 100}%`},
          onMouseenter: () => {
            if (!isDisabled.value) {
              hoveredThumb.value = 1;
            }
          },
          onMouseleave: () => {
            if (hoveredThumb.value === 1) {
              hoveredThumb.value = null;
            }
            if (draggedThumb.value === 1) {
              draggedThumb.value = null;
            }
          },
          onMousedown: () => {
            if (!isDisabled.value) {
              draggedThumb.value = 1;
            }
          },
          onMouseup: () => {
            if (draggedThumb.value === 1) {
              draggedThumb.value = null;
            }
          }
        }, [
          h('input', {
            id: `${generatedId}-end`,
            class: [classNames(styles, 'spectrum-Slider-input'), 'vs-slider__input'],
            type: 'range',
            min: props.min,
            max: props.max,
            step: props.step,
            value: end.value,
            disabled: isDisabled.value,
            'aria-label': typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : 'Maximum',
            onInput: (event: Event) => handleInput(1, event, false),
            onChange: (event: Event) => handleInput(1, event, true),
            onFocus: (event: FocusEvent) => {
              focusedThumb.value = 1;
              emit('focus', event);
            },
            onBlur: (event: FocusEvent) => {
              if (focusedThumb.value === 1) {
                focusedThumb.value = null;
              }
              if (draggedThumb.value === 1) {
                draggedThumb.value = null;
              }
              emit('blur', event);
            }
          }),
          h('input', {type: 'hidden', hidden: true, value: end.value})
        ]),
        h('div', {class: classNames(styles, 'spectrum-Slider-track'), style: {width: `${(1 - endPercent.value) * 100}%`}})
      ])
    ]);
  }
});

export const VueSlider = Slider;
export type {SpectrumRangeSliderProps, SpectrumSliderProps} from '@vue-types/slider';
