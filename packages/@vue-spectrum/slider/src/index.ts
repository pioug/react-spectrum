import '@adobe/spectrum-css-temp/components/slider/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
const styles: {[key: string]: string} = {};


type LabelPosition = 'side' | 'top';

type RangeValue = {
  end: number,
  start: number
};

let sliderId = 0;
let rangeSliderId = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function resolveFormatOptions(
  minValue: number,
  maxValue: number,
  formatOptions?: Intl.NumberFormatOptions
): Intl.NumberFormatOptions | undefined {
  let options = formatOptions ? {...formatOptions} : undefined;

  let alwaysDisplaySign = Math.abs(Math.sign(minValue) - Math.sign(maxValue)) === 2;
  if (!alwaysDisplaySign) {
    return options;
  }

  if (options == null) {
    return {signDisplay: 'exceptZero'};
  }

  if (!('signDisplay' in options)) {
    options.signDisplay = 'exceptZero';
  }

  return options;
}

function createFormatter(options?: Intl.NumberFormatOptions): Intl.NumberFormat {
  try {
    return new Intl.NumberFormat(undefined, options);
  } catch {
    return new Intl.NumberFormat();
  }
}

export const Slider = defineComponent({
  name: 'VueSlider',
  inheritAttrs: false,
  props: {
    contextualHelp: {
      type: [Object, String, Number, Boolean] as PropType<unknown>,
      default: undefined
    },
    description: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fillOffset: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    form: {
      type: String,
      default: undefined
    },
    formatOptions: {
      type: Object as PropType<Intl.NumberFormatOptions | undefined>,
      default: undefined
    },
    getValueLabel: {
      type: Function as PropType<((value: number) => string) | undefined>,
      default: undefined
    },
    id: {
      type: String,
      default: undefined
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isFilled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    labelPosition: {
      type: String as PropType<LabelPosition>,
      default: 'top'
    },
    max: {
      type: Number,
      default: 100
    },
    maxValue: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    min: {
      type: Number,
      default: 0
    },
    minValue: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    modelValue: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: undefined
    },
    showValue: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    showValueLabel: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    step: {
      type: Number,
      default: 1
    },
    trackGradient: {
      type: Array as PropType<string[] | undefined>,
      default: undefined
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: number) => typeof value === 'number' && Number.isFinite(value),
    changeEnd: (value: number) => typeof value === 'number' && Number.isFinite(value),
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    'update:modelValue': (value: number) => typeof value === 'number' && Number.isFinite(value)
  },
  setup(props, {emit, attrs, slots}) {
    let generatedId = `vs-slider-${++sliderId}`;
    let inputId = computed(() => props.id ?? generatedId);
    let descriptionId = computed(() => props.description ? `${inputId.value}-description` : undefined);
    let rootId = computed(() => `${inputId.value}-group`);
    let labelId = computed(() => props.label ? `${inputId.value}-label` : undefined);

    let rootAttrs = computed(() => {
      let nextAttrs = {...attrs};
      delete (nextAttrs as Record<string, unknown>).class;
      delete (nextAttrs as Record<string, unknown>).style;
      return nextAttrs;
    });

    let externalAriaLabel = computed(() => {
      let value = attrs['aria-label'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });

    let externalAriaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });

    let groupAriaLabelledBy = computed(() => {
      if (labelId.value) {
        return [labelId.value, externalAriaLabelledBy.value].filter((part): part is string => Boolean(part)).join(' ') || undefined;
      }

      return externalAriaLabelledBy.value;
    });

    let groupAriaLabel = computed(() => groupAriaLabelledBy.value ? undefined : externalAriaLabel.value);
    let inputAriaLabelledBy = computed(() => labelId.value ?? rootId.value);

    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let minValue = computed(() => props.minValue ?? props.min);
    let maxValue = computed(() => props.maxValue ?? props.max);
    let labelPosition = computed<LabelPosition>(() => props.labelPosition === 'side' ? 'side' : 'top');
    let shouldShowValueLabel = computed(() => props.showValueLabel ?? props.showValue ?? true);

    let formatter = computed(() => createFormatter(resolveFormatOptions(
      minValue.value,
      maxValue.value,
      props.formatOptions
    )));

    let clampedValue = computed(() => clamp(props.modelValue, minValue.value, maxValue.value));
    let percent = computed(() => {
      let range = maxValue.value - minValue.value;
      if (range <= 0) {
        return 0;
      }
      return (clampedValue.value - minValue.value) / range;
    });

    let valueLabel = computed(() => {
      if (typeof props.getValueLabel === 'function') {
        return props.getValueLabel(clampedValue.value);
      }

      return formatter.value.format(clampedValue.value);
    });

    let gradientStyle = computed(() => {
      if (props.trackGradient == null || props.trackGradient.length === 0) {
        return undefined;
      }

      return {
        '--spectrum-slider-track-gradient': `linear-gradient(to right, ${props.trackGradient.join(', ')})`
      };
    });

    let fillOffsetPercent = computed(() => {
      if (!props.isFilled || props.fillOffset == null) {
        return null;
      }

      let range = maxValue.value - minValue.value;
      if (range <= 0) {
        return 0;
      }

      let clampedOffset = clamp(props.fillOffset, minValue.value, maxValue.value);
      return (clampedOffset - minValue.value) / range;
    });

    let isHovered = ref(false);
    let isFocused = ref(false);
    let isDragged = ref(false);

    let rootClassName = computed(() => classNames(
      styles,
      'spectrum-Slider',
      {
        'is-disabled': isDisabled.value,
        'spectrum-Slider--filled': props.isFilled && fillOffsetPercent.value == null,
        'spectrum-Slider--positionSide': labelPosition.value === 'side',
        'spectrum-Slider--positionTop': labelPosition.value === 'top'
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
      let next = clamp(value, minValue.value, maxValue.value);
      emit('update:modelValue', next);
      if (isChange) {
        emit('change', next);
        emit('changeEnd', next);
      }
    };

    let contextualHelp = computed(() => {
      let slotContent = slots['contextual-help']?.();
      if (slotContent != null && slotContent.length > 0) {
        return slotContent;
      }

      if (props.contextualHelp == null || props.contextualHelp === '') {
        return null;
      }

      return [props.contextualHelp as never];
    });

    return () => {
      let valueOutput = shouldShowValueLabel.value
        ? h('output', {class: [classNames(styles, 'spectrum-Slider-value'), 'vs-slider__value']}, valueLabel.value)
        : null;
      let shouldRenderLabelContainer = Boolean(props.label)
        || contextualHelp.value != null
        || (labelPosition.value === 'top' && valueOutput != null);

      let fillTrack = null;
      if (props.isFilled && fillOffsetPercent.value != null) {
        let width = percent.value - fillOffsetPercent.value;
        let isRightOfOffset = width > 0;
        let offset = isRightOfOffset ? fillOffsetPercent.value : percent.value;

        fillTrack = h('div', {
          class: classNames(styles, 'spectrum-Slider-fill', {'spectrum-Slider-fill--right': isRightOfOffset}),
          style: {
            left: `${offset * 100}%`,
            width: `${Math.abs(width) * 100}%`
          }
        });
      }

      let lowerTrackStyle: Record<string, string> = {
        width: `${percent.value * 100}%`
      };
      if (percent.value > 0) {
        lowerTrackStyle['--spectrum-track-background-position'] = '0';
        lowerTrackStyle['--spectrum-track-background-size'] = `${(1 / percent.value) * 100}%`;
      }

      let upperPercent = 1 - percent.value;
      let upperTrackStyle: Record<string, string> = {
        width: `${upperPercent * 100}%`
      };
      if (upperPercent > 0) {
        upperTrackStyle['--spectrum-track-background-position'] = '100%';
        upperTrackStyle['--spectrum-track-background-size'] = `${(1 / upperPercent) * 100}%`;
      }

      return h('div', {
        ...rootAttrs.value,
        id: rootId.value,
        role: 'group',
        class: [rootClassName.value, 'vs-slider', attrs.class],
        style: [attrs.style as never, gradientStyle.value as never],
        'aria-label': groupAriaLabel.value,
        'aria-labelledby': groupAriaLabelledBy.value,
        'data-vac': ''
      }, [
        shouldRenderLabelContainer
          ? h('div', {class: classNames(styles, 'spectrum-Slider-labelContainer'), role: 'presentation'}, [
            props.label
              ? h('label', {id: labelId.value, class: [classNames(styles, 'spectrum-Slider-label'), 'vs-slider__label']}, props.label)
              : null,
            contextualHelp.value
              ? h('div', {class: classNames(styles, 'spectrum-Slider-contextualHelp')}, contextualHelp.value)
              : null,
            labelPosition.value === 'top' ? valueOutput : null
          ])
          : null,
        h('div', {class: classNames(styles, 'spectrum-Slider-controls')}, [
          h('div', {
            class: classNames(styles, 'spectrum-Slider-track'),
            style: lowerTrackStyle
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
              min: minValue.value,
              max: maxValue.value,
              step: props.step,
              disabled: isDisabled.value,
              form: props.form,
              name: props.name,
              'aria-label': undefined,
              'aria-labelledby': inputAriaLabelledBy.value,
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
          fillTrack,
          h('div', {
            class: classNames(styles, 'spectrum-Slider-track'),
            style: upperTrackStyle
          })
        ]),
        labelPosition.value === 'side' && valueOutput != null
          ? h('div', {class: classNames(styles, 'spectrum-Slider-valueLabelContainer'), role: 'presentation'}, [valueOutput])
          : null,
        props.description
          ? h('span', {id: descriptionId.value, class: 'vs-slider__description'}, props.description)
          : null
      ]);
    };
  }
});

export const RangeSlider = defineComponent({
  name: 'VueRangeSlider',
  inheritAttrs: false,
  props: {
    contextualHelp: {
      type: [Object, String, Number, Boolean] as PropType<unknown>,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    endName: {
      type: String,
      default: undefined
    },
    form: {
      type: String,
      default: undefined
    },
    formatOptions: {
      type: Object as PropType<Intl.NumberFormatOptions | undefined>,
      default: undefined
    },
    getValueLabel: {
      type: Function as PropType<((value: RangeValue) => string) | undefined>,
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
    labelPosition: {
      type: String as PropType<LabelPosition>,
      default: 'top'
    },
    max: {
      type: Number,
      default: 100
    },
    maxValue: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    min: {
      type: Number,
      default: 0
    },
    minValue: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    modelValue: {
      type: Object as PropType<RangeValue>,
      default: () => ({start: 0, end: 100})
    },
    showValue: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    showValueLabel: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    startName: {
      type: String,
      default: undefined
    },
    step: {
      type: Number,
      default: 1
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: RangeValue) => typeof value === 'object' && value !== null,
    changeEnd: (value: RangeValue) => typeof value === 'object' && value !== null,
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    'update:modelValue': (value: RangeValue) => typeof value === 'object' && value !== null
  },
  setup(props, {emit, attrs, slots}) {
    let generatedId = `vs-range-slider-${++rangeSliderId}`;
    let rootId = computed(() => `${generatedId}-group`);
    let labelId = computed(() => props.label ? `${generatedId}-label` : undefined);
    let startInputId = computed(() => `${generatedId}-start`);
    let endInputId = computed(() => `${generatedId}-end`);
    let rootAttrs = computed(() => {
      let nextAttrs = {...attrs};
      delete (nextAttrs as Record<string, unknown>).class;
      delete (nextAttrs as Record<string, unknown>).style;
      return nextAttrs;
    });

    let externalAriaLabel = computed(() => {
      let value = attrs['aria-label'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });

    let externalAriaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });

    let groupAriaLabelledBy = computed(() => {
      if (labelId.value) {
        return [labelId.value, externalAriaLabelledBy.value].filter((part): part is string => Boolean(part)).join(' ') || undefined;
      }

      return externalAriaLabelledBy.value;
    });

    let groupAriaLabel = computed(() => groupAriaLabelledBy.value ? undefined : externalAriaLabel.value);
    let thumbAriaLabelledBy = computed(() => labelId.value ?? rootId.value);

    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let minValue = computed(() => props.minValue ?? props.min);
    let maxValue = computed(() => props.maxValue ?? props.max);
    let labelPosition = computed<LabelPosition>(() => props.labelPosition === 'side' ? 'side' : 'top');
    let shouldShowValueLabel = computed(() => props.showValueLabel ?? props.showValue ?? true);

    let formatter = computed(() => createFormatter(resolveFormatOptions(
      minValue.value,
      maxValue.value,
      props.formatOptions
    )));

    let hoveredThumb = ref<0 | 1 | null>(null);
    let draggedThumb = ref<0 | 1 | null>(null);
    let focusedThumb = ref<0 | 1 | null>(null);

    let start = computed(() => clamp(
      Math.min(props.modelValue.start, props.modelValue.end),
      minValue.value,
      maxValue.value
    ));
    let end = computed(() => clamp(
      Math.max(props.modelValue.start, props.modelValue.end),
      minValue.value,
      maxValue.value
    ));
    let range = computed(() => maxValue.value - minValue.value <= 0 ? 1 : maxValue.value - minValue.value);
    let startPercent = computed(() => (start.value - minValue.value) / range.value);
    let endPercent = computed(() => (end.value - minValue.value) / range.value);

    let valueLabel = computed(() => {
      if (typeof props.getValueLabel === 'function') {
        return props.getValueLabel({
          start: start.value,
          end: end.value
        });
      }

      return `${formatter.value.format(start.value)} – ${formatter.value.format(end.value)}`;
    });

    let rootClassName = computed(() => classNames(
      styles,
      'spectrum-Slider',
      'spectrum-Slider--range',
      {
        'is-disabled': isDisabled.value,
        'spectrum-Slider--positionSide': labelPosition.value === 'side',
        'spectrum-Slider--positionTop': labelPosition.value === 'top'
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
      let clampedStart = clamp(Math.min(next.start, next.end), minValue.value, maxValue.value);
      let clampedEnd = clamp(Math.max(next.start, next.end), minValue.value, maxValue.value);
      let value = {start: clampedStart, end: clampedEnd};
      emit('update:modelValue', value);
      if (isChange) {
        emit('change', value);
        emit('changeEnd', value);
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

    let contextualHelp = computed(() => {
      let slotContent = slots['contextual-help']?.();
      if (slotContent != null && slotContent.length > 0) {
        return slotContent;
      }

      if (props.contextualHelp == null || props.contextualHelp === '') {
        return null;
      }

      return [props.contextualHelp as never];
    });

    return () => {
      let valueOutput = shouldShowValueLabel.value
        ? h('output', {class: [classNames(styles, 'spectrum-Slider-value'), 'vs-slider__value']}, valueLabel.value)
        : null;
      let shouldRenderLabelContainer = Boolean(props.label)
        || contextualHelp.value != null
        || (labelPosition.value === 'top' && valueOutput != null);

      return h('div', {
        ...rootAttrs.value,
        id: rootId.value,
        role: 'group',
        class: [rootClassName.value, 'vs-slider', attrs.class],
        style: [attrs.style as never],
        'aria-label': groupAriaLabel.value,
        'aria-labelledby': groupAriaLabelledBy.value,
        'data-vac': ''
      }, [
        shouldRenderLabelContainer
          ? h('div', {class: classNames(styles, 'spectrum-Slider-labelContainer'), role: 'presentation'}, [
            props.label
              ? h('label', {id: labelId.value, class: [classNames(styles, 'spectrum-Slider-label'), 'vs-slider__label']}, props.label)
              : null,
            contextualHelp.value
              ? h('div', {class: classNames(styles, 'spectrum-Slider-contextualHelp')}, contextualHelp.value)
              : null,
            labelPosition.value === 'top' ? valueOutput : null
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
              id: startInputId.value,
              class: [classNames(styles, 'spectrum-Slider-input'), 'vs-slider__input'],
              type: 'range',
              min: minValue.value,
              max: maxValue.value,
              step: props.step,
              value: start.value,
              disabled: isDisabled.value,
              form: props.form,
              name: props.startName,
              'aria-label': 'Minimum',
              'aria-labelledby': `${startInputId.value} ${thumbAriaLabelledBy.value}`,
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
              id: endInputId.value,
              class: [classNames(styles, 'spectrum-Slider-input'), 'vs-slider__input'],
              type: 'range',
              min: minValue.value,
              max: maxValue.value,
              step: props.step,
              value: end.value,
              disabled: isDisabled.value,
              form: props.form,
              name: props.endName,
              'aria-label': 'Maximum',
              'aria-labelledby': `${endInputId.value} ${thumbAriaLabelledBy.value}`,
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
        ]),
        labelPosition.value === 'side' && valueOutput != null
          ? h('div', {class: classNames(styles, 'spectrum-Slider-valueLabelContainer'), role: 'presentation'}, [valueOutput])
          : null
      ]);
    };
  }
});

export const VueSlider = Slider;
export type {SpectrumRangeSliderProps, SpectrumSliderProps} from '@vue-types/slider';
