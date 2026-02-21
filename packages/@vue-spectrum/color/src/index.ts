import '@adobe/spectrum-css-temp/components/colorarea/vars.css';
import '@adobe/spectrum-css-temp/components/colorhandle/vars.css';
import '@adobe/spectrum-css-temp/components/colorloupe/vars.css';
import '@adobe/spectrum-css-temp/components/colorslider/vars.css';
import '@adobe/spectrum-css-temp/components/colorwheel/vars.css';
import './colorfield.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
const colorAreaStyles: {[key: string]: string} = {};
const colorHandleStyles: {[key: string]: string} = {};
const colorLoupeStyles: {[key: string]: string} = {};
const colorSliderStyles: {[key: string]: string} = {};
const colorWheelStyles: {[key: string]: string} = {};


const colorFieldStyles: {[key: string]: string} = {};

export type Color = string;
export type ColorSpace = 'rgb' | 'hsl' | 'hsb';
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsb';
export type ColorChannel = 'red' | 'green' | 'blue' | 'hue' | 'saturation' | 'lightness' | 'brightness';
type IColor = Color;

type ColorAreaValue = {
  x: number,
  y: number
};

type ColorSwatchItem = {
  color: string,
  id: string,
  label?: string
};

type RgbColor = {
  b: number,
  g: number,
  r: number
};

const DEFAULT_HEX_COLOR = '#3366ff';
const DEFAULT_COLOR_SWATCHES: ColorSwatchItem[] = [
  {id: 'azure', color: '#0ea5e9', label: 'Azure'},
  {id: 'violet', color: '#8b5cf6', label: 'Violet'},
  {id: 'emerald', color: '#10b981', label: 'Emerald'},
  {id: 'amber', color: '#f59e0b', label: 'Amber'}
];

let colorFieldId = 0;
let colorSliderId = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function readNumberInputValue(event: Event): number | null {
  let target = event.currentTarget as HTMLInputElement | null;
  let parsedValue = Number(target?.value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function readTextInputValue(event: Event): string {
  let target = event.currentTarget as HTMLInputElement | null;
  return target?.value ?? '';
}

function resolveDisabled(disabled: boolean, isDisabled?: boolean): boolean {
  return isDisabled ?? disabled;
}

function normalizeHexColor(value: string): string {
  let candidate = value.trim();
  if (/^#[0-9a-fA-F]{3}$/.test(candidate)) {
    let expanded = candidate.slice(1).split('').map((channel) => `${channel}${channel}`).join('');
    return `#${expanded.toLowerCase()}`;
  }

  if (/^#[0-9a-fA-F]{6}$/.test(candidate)) {
    return candidate.toLowerCase();
  }

  return DEFAULT_HEX_COLOR;
}

function channelToHex(channelValue: number): string {
  return clamp(Math.round(channelValue), 0, 255).toString(16).padStart(2, '0');
}

function rgbToHex(value: RgbColor): string {
  return `#${channelToHex(value.r)}${channelToHex(value.g)}${channelToHex(value.b)}`;
}

function hexToRgb(value: string): RgbColor {
  let normalizedHex = normalizeHexColor(value);
  return {
    r: Number.parseInt(normalizedHex.slice(1, 3), 16),
    g: Number.parseInt(normalizedHex.slice(3, 5), 16),
    b: Number.parseInt(normalizedHex.slice(5, 7), 16)
  };
}

function hueToHex(hue: number): string {
  let normalizedHue = ((Math.round(hue) % 360) + 360) % 360;
  let segment = normalizedHue / 60;
  let secondary = 1 - Math.abs((segment % 2) - 1);

  let red = 0;
  let green = 0;
  let blue = 0;

  if (segment >= 0 && segment < 1) {
    red = 1;
    green = secondary;
  } else if (segment >= 1 && segment < 2) {
    red = secondary;
    green = 1;
  } else if (segment >= 2 && segment < 3) {
    green = 1;
    blue = secondary;
  } else if (segment >= 3 && segment < 4) {
    green = secondary;
    blue = 1;
  } else if (segment >= 4 && segment < 5) {
    red = secondary;
    blue = 1;
  } else {
    red = 1;
    blue = secondary;
  }

  return rgbToHex({
    r: red * 255,
    g: green * 255,
    b: blue * 255
  });
}

function hexToHue(value: string): number {
  let {r, g, b} = hexToRgb(value);
  let red = r / 255;
  let green = g / 255;
  let blue = b / 255;

  let max = Math.max(red, green, blue);
  let min = Math.min(red, green, blue);
  let delta = max - min;

  if (delta === 0) {
    return 0;
  }

  let hue = 0;
  if (max === red) {
    hue = ((green - blue) / delta) % 6;
  } else if (max === green) {
    hue = (blue - red) / delta + 2;
  } else {
    hue = (red - green) / delta + 4;
  }

  return Math.round((hue * 60 + 360) % 360);
}

function normalizeColorAreaValue(value: ColorAreaValue): ColorAreaValue {
  return {
    x: clamp(Math.round(value.x), 0, 100),
    y: clamp(Math.round(value.y), 0, 100)
  };
}

export const ColorSwatch = defineComponent({
  name: 'VueColorSwatch',
  inheritAttrs: false,
  props: {
    bordered: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: DEFAULT_HEX_COLOR
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {attrs}) {
    return () => h('span', {
      ...attrs,
      class: [
        classNames(colorHandleStyles, 'spectrum-ColorHandle', {
          'is-disabled': props.isDisabled,
          'is-focused': false,
          'is-open': false
        }),
        'vs-color-swatch',
        props.bordered ? 'is-bordered' : null,
        props.selected ? 'is-selected' : null,
        attrs.class
      ],
      role: 'img',
      'aria-label': props.label || `Color ${props.color}`,
      'aria-hidden': attrs['aria-hidden'],
      style: {
        backgroundColor: props.color || DEFAULT_HEX_COLOR
      },
      'data-vac': ''
    });
  }
});

export const ColorField = defineComponent({
  name: 'VueColorField',
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
    form: {
      type: String,
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
    isInvalid: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: DEFAULT_HEX_COLOR
    },
    name: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '#3366ff'
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: string) => typeof value === 'string',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let generatedId = `vs-color-field-${++colorFieldId}`;
    let focused = ref(false);

    let disabled = computed(() => resolveDisabled(props.disabled, props.isDisabled));
    let inputId = computed(() => props.id ?? generatedId);

    let inputClasses = computed(() => ([
      classNames(colorFieldStyles, 'react-spectrum-ColorField-input'),
      'vs-color-field__input',
      props.isInvalid ? 'is-invalid' : null,
      disabled.value ? 'is-disabled' : null
    ]));

    return () => h('label', {
      ...attrs,
      class: [
        classNames(colorFieldStyles, 'react-spectrum-ColorField', {
          'focus-ring': focused.value,
          'is-disabled': disabled.value
        }),
        'vs-color-field',
        attrs.class
      ],
      'data-vac': ''
    }, [
      props.label ? h('span', {class: 'vs-color-field__label'}, props.label) : null,
      h('span', {class: 'vs-color-field__control'}, [
        h(ColorSwatch, {
          class: ['vs-color-field__swatch', classNames(colorHandleStyles, 'spectrum-ColorHandle-color')],
          color: props.modelValue || DEFAULT_HEX_COLOR,
          isDisabled: disabled.value,
          label: props.label || 'Selected color'
        }),
        h('input', {
          id: inputId.value,
          class: inputClasses.value,
          type: 'text',
          value: props.modelValue,
          placeholder: props.placeholder,
          disabled: disabled.value,
          spellcheck: 'false',
          'aria-label': attrs['aria-label'],
          'aria-labelledby': attrs['aria-labelledby'],
          onInput: (event: Event) => {
            emit('update:modelValue', readTextInputValue(event));
          },
          onChange: (event: Event) => {
            emit('change', readTextInputValue(event));
          },
          onFocus: (event: FocusEvent) => {
            focused.value = true;
            emit('focus', event);
          },
          onBlur: (event: FocusEvent) => {
            focused.value = false;
            emit('blur', event);
          }
        })
      ]),
      props.description
        ? h('span', {class: 'vs-color-field__description'}, props.description)
        : null,
      props.name
        ? h('input', {
          type: 'hidden',
          hidden: true,
          'aria-hidden': 'true',
          name: props.name,
          form: props.form,
          value: props.modelValue
        })
        : null
    ]);
  }
});

export const ColorSlider = defineComponent({
  name: 'VueColorSlider',
  inheritAttrs: false,
  props: {
    channel: {
      type: String,
      default: 'hue'
    },
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
      default: 360
    },
    min: {
      type: Number,
      default: 0
    },
    modelValue: {
      type: Number,
      default: 220
    },
    step: {
      type: Number,
      default: 1
    }
  },
  emits: {
    change: (value: number) => Number.isFinite(value),
    'update:modelValue': (value: number) => Number.isFinite(value)
  },
  setup(props, {emit, attrs}) {
    let generatedId = `vs-color-slider-${++colorSliderId}`;
    let sliderId = computed(() => props.id ?? generatedId);

    let disabled = computed(() => resolveDisabled(props.disabled, props.isDisabled));
    let minimum = computed(() => Math.min(props.min, props.max));
    let maximum = computed(() => Math.max(props.min, props.max));
    let sliderValue = computed(() => clamp(props.modelValue, minimum.value, maximum.value));

    let trackBackground = computed(() => {
      if (props.channel === 'hue') {
        return 'linear-gradient(90deg, #ff0000 0%, #ffff00 16%, #00ff00 33%, #00ffff 50%, #0000ff 66%, #ff00ff 83%, #ff0000 100%)';
      }

      return 'linear-gradient(90deg, #000000 0%, #ffffff 100%)';
    });

    let emitInputValue = (value: number, emitChange: boolean) => {
      let normalized = clamp(value, minimum.value, maximum.value);
      emit('update:modelValue', normalized);
      if (emitChange) {
        emit('change', normalized);
      }
    };

    return () => h('label', {
      ...attrs,
      class: [
        classNames(colorSliderStyles, 'spectrum-ColorSlider', {
          'is-disabled': disabled.value
        }),
        'vs-color-slider',
        attrs.class
      ],
      'data-vac': ''
    }, [
      props.label
        ? h('span', {class: 'vs-color-slider__header'}, [
          h('span', {class: 'vs-color-slider__label'}, props.label),
          h('span', {class: 'vs-color-slider__value'}, `${sliderValue.value}`)
        ])
        : null,
      h('input', {
        id: sliderId.value,
        class: ['vs-color-slider__input', classNames(colorSliderStyles, 'spectrum-ColorSlider-slider')],
        type: 'range',
        min: minimum.value,
        max: maximum.value,
        step: props.step,
        value: sliderValue.value,
        disabled: disabled.value,
        'aria-label': attrs['aria-label'] || props.label || undefined,
        style: {
          background: trackBackground.value
        },
        onInput: (event: Event) => {
          let parsedValue = readNumberInputValue(event);
          if (parsedValue === null) {
            return;
          }

          emitInputValue(parsedValue, false);
        },
        onChange: (event: Event) => {
          let parsedValue = readNumberInputValue(event);
          if (parsedValue === null) {
            return;
          }

          emitInputValue(parsedValue, true);
        }
      }),
      props.description
        ? h('span', {class: 'vs-color-slider__description'}, props.description)
        : null,
      h('div', {
        class: [classNames(colorHandleStyles, 'spectrum-ColorHandle', {'is-disabled': disabled.value}), 'vs-color-slider__thumb-marker'],
        hidden: true,
        'aria-hidden': 'true'
      })
    ]);
  }
});

export const ColorArea = defineComponent({
  name: 'VueColorArea',
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
      default: 'Color area'
    },
    modelValue: {
      type: Object as PropType<ColorAreaValue>,
      default: () => ({
        x: 50,
        y: 50
      })
    }
  },
  emits: {
    change: (value: ColorAreaValue) => typeof value === 'object' && value !== null,
    'update:modelValue': (value: ColorAreaValue) => typeof value === 'object' && value !== null
  },
  setup(props, {emit, attrs}) {
    let disabled = computed(() => resolveDisabled(props.disabled, props.isDisabled));
    let areaValue = computed(() => normalizeColorAreaValue(props.modelValue));

    let emitNextValue = (nextValue: Partial<ColorAreaValue>, emitChange: boolean) => {
      let normalizedValue = normalizeColorAreaValue({
        x: nextValue.x ?? areaValue.value.x,
        y: nextValue.y ?? areaValue.value.y
      });

      emit('update:modelValue', normalizedValue);
      if (emitChange) {
        emit('change', normalizedValue);
      }
    };

    let previewColor = computed(() => {
      let hue = Math.round(areaValue.value.x * 3.6);
      let lightness = clamp(Math.round(90 - areaValue.value.y * 0.6), 20, 90);
      return `hsl(${hue}, 85%, ${lightness}%)`;
    });

    return () => h('fieldset', {
      ...attrs,
      class: [
        classNames(colorAreaStyles, 'spectrum-ColorArea', {'is-disabled': disabled.value}),
        'vs-color-area',
        attrs.class
      ],
      disabled: disabled.value,
      'data-vac': ''
    }, [
      h('legend', {class: 'vs-color-area__label'}, props.label),
      h('div', {class: 'vs-color-area__preview', style: {backgroundColor: previewColor.value}}),
      h('label', {class: 'vs-color-area__channel'}, [
        h('span', 'X channel'),
        h('input', {
          class: 'vs-color-area__input',
          type: 'range',
          min: 0,
          max: 100,
          step: 1,
          value: areaValue.value.x,
          onInput: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitNextValue({x: parsedValue}, false);
          },
          onChange: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitNextValue({x: parsedValue}, true);
          }
        })
      ]),
      h('label', {class: 'vs-color-area__channel'}, [
        h('span', 'Y channel'),
        h('input', {
          class: 'vs-color-area__input',
          type: 'range',
          min: 0,
          max: 100,
          step: 1,
          value: areaValue.value.y,
          onInput: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitNextValue({y: parsedValue}, false);
          },
          onChange: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitNextValue({y: parsedValue}, true);
          }
        })
      ]),
      h('div', {
        class: [classNames(colorHandleStyles, 'spectrum-ColorHandle', {'is-disabled': disabled.value}), 'vs-color-area__thumb-marker'],
        hidden: true,
        'aria-hidden': 'true'
      }),
      h('svg', {
        class: [classNames(colorLoupeStyles, 'spectrum-ColorLoupe', {'is-open': false}), 'vs-color-area__loupe-marker'],
        hidden: true,
        'aria-hidden': 'true'
      })
    ]);
  }
});

export const ColorWheel = defineComponent({
  name: 'VueColorWheel',
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
      default: 'Color wheel'
    },
    modelValue: {
      type: Number,
      default: 220
    }
  },
  emits: {
    change: (value: number) => Number.isFinite(value),
    'update:modelValue': (value: number) => Number.isFinite(value)
  },
  setup(props, {emit, attrs}) {
    let disabled = computed(() => resolveDisabled(props.disabled, props.isDisabled));
    let hueValue = computed(() => ((Math.round(props.modelValue) % 360) + 360) % 360);

    let emitHue = (value: number, emitChange: boolean) => {
      let normalizedHue = ((Math.round(value) % 360) + 360) % 360;
      emit('update:modelValue', normalizedHue);
      if (emitChange) {
        emit('change', normalizedHue);
      }
    };

    return () => h('section', {
      ...attrs,
      class: [
        classNames(colorWheelStyles, 'spectrum-ColorWheel', {'is-disabled': disabled.value}),
        'vs-color-wheel',
        attrs.class
      ],
      'data-vac': ''
    }, [
      h('p', {class: 'vs-color-wheel__label'}, props.label),
      h('div', {class: 'vs-color-wheel__ring'}, [
        h('span', {
          class: 'vs-color-wheel__indicator',
          style: {
            transform: `rotate(${hueValue.value}deg)`
          }
        })
      ]),
      h('div', {class: 'vs-color-wheel__swatch-row'}, [
        h(ColorSwatch, {
          class: 'vs-color-wheel__swatch',
          color: hueToHex(hueValue.value),
          label: `Hue ${hueValue.value}`
        }),
        h('span', {class: 'vs-color-wheel__value'}, `${hueValue.value}\u00b0`)
      ]),
      h('input', {
        class: 'vs-color-wheel__input',
        type: 'range',
        min: 0,
        max: 360,
        step: 1,
        value: hueValue.value,
        disabled: disabled.value,
        onInput: (event: Event) => {
          let parsedValue = readNumberInputValue(event);
          if (parsedValue === null) {
            return;
          }

          emitHue(parsedValue, false);
        },
        onChange: (event: Event) => {
          let parsedValue = readNumberInputValue(event);
          if (parsedValue === null) {
            return;
          }

          emitHue(parsedValue, true);
        }
      }),
      h('div', {
        class: [classNames(colorHandleStyles, 'spectrum-ColorHandle', {'is-disabled': disabled.value}), 'vs-color-wheel__thumb-marker'],
        hidden: true,
        'aria-hidden': 'true'
      }),
      h('svg', {
        class: [classNames(colorLoupeStyles, 'spectrum-ColorLoupe', {'is-open': false}), 'vs-color-wheel__loupe-marker'],
        hidden: true,
        'aria-hidden': 'true'
      })
    ]);
  }
});

export const ColorSwatchPicker = defineComponent({
  name: 'VueColorSwatchPicker',
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
    items: {
      type: Array as PropType<ColorSwatchItem[]>,
      default: () => DEFAULT_COLOR_SWATCHES.map((item) => ({...item}))
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: {
    change: (item: ColorSwatchItem) => typeof item === 'object' && item !== null,
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let focused = ref(false);
    let disabled = computed(() => resolveDisabled(props.disabled, props.isDisabled));

    let swatches = computed(() => (
      props.items.length > 0
        ? props.items
        : DEFAULT_COLOR_SWATCHES
    ));

    let selectedId = computed(() => {
      if (props.modelValue) {
        return props.modelValue;
      }

      return swatches.value[0]?.id ?? '';
    });

    let onSelect = (item: ColorSwatchItem) => {
      emit('update:modelValue', item.id);
      emit('change', item);
    };

    return () => h('div', {
      ...attrs,
      class: [
        classNames(colorHandleStyles, 'spectrum-ColorHandle', {
          'focus-ring': focused.value,
          'is-disabled': disabled.value
        }),
        'vs-color-swatch-picker',
        attrs.class
      ],
      onFocusin: () => {
        focused.value = true;
      },
      onFocusout: () => {
        focused.value = false;
      },
      'data-vac': ''
    }, [
      ...swatches.value.map((item) => {
        let isSelected = item.id === selectedId.value;
        return h('button', {
          key: item.id,
          class: ['vs-color-swatch-picker__item', isSelected ? 'is-selected' : null],
          type: 'button',
          disabled: disabled.value,
          onClick: () => onSelect(item)
        }, [
          h(ColorSwatch, {
            class: 'vs-color-swatch-picker__swatch',
            color: item.color,
            label: item.label ?? item.id,
            selected: isSelected,
            isDisabled: disabled.value
          }),
          h('span', {class: 'vs-color-swatch-picker__label'}, item.label ?? item.id)
        ]);
      }),
      h('input', {
        type: 'hidden',
        hidden: true,
        'aria-hidden': 'true',
        value: selectedId.value
      })
    ]);
  }
});

export const ColorPicker = defineComponent({
  name: 'VueColorPicker',
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
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'Color picker'
    },
    modelValue: {
      type: String,
      default: DEFAULT_HEX_COLOR
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: string) => typeof value === 'string',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    open: () => true,
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let disabled = computed(() => resolveDisabled(props.disabled, props.isDisabled));
    let focused = ref(false);
    let open = ref(props.isOpen);

    let normalizedColor = computed(() => normalizeHexColor(props.modelValue));
    let hueValue = computed(() => hexToHue(props.modelValue));

    return () => h('section', {
      ...attrs,
      class: [
        classNames(colorHandleStyles, 'spectrum-ColorHandle', {
          'focus-ring': focused.value,
          'is-disabled': disabled.value,
          'is-focused': focused.value,
          'is-open': open.value
        }),
        'vs-color-picker',
        attrs.class
      ],
      'aria-label': attrs['aria-label'],
      'aria-labelledby': attrs['aria-labelledby'],
      'aria-describedby': attrs['aria-describedby'],
      'aria-details': attrs['aria-details'],
      'data-vac': ''
    }, [
      h(ColorField, {
        modelValue: props.modelValue,
        label: props.label,
        description: props.description,
        disabled: disabled.value,
        isDisabled: disabled.value,
        'aria-label': attrs['aria-label'],
        'aria-labelledby': attrs['aria-labelledby'],
        'aria-describedby': attrs['aria-describedby'],
        'aria-details': attrs['aria-details'],
        'onUpdate:modelValue': (value: string) => emit('update:modelValue', value),
        onChange: (value: string) => emit('change', value),
        onFocus: (event: FocusEvent) => {
          focused.value = true;
          open.value = true;
          emit('focus', event);
          emit('open');
        },
        onBlur: (event: FocusEvent) => {
          focused.value = false;
          open.value = false;
          emit('blur', event);
        }
      }),
      h(ColorSlider, {
        class: 'vs-color-picker__hue',
        modelValue: hueValue.value,
        label: 'Hue',
        min: 0,
        max: 360,
        channel: 'hue',
        disabled: disabled.value,
        isDisabled: disabled.value,
        'aria-label': attrs['aria-label'] || 'Hue',
        'onUpdate:modelValue': (value: number) => emit('update:modelValue', hueToHex(value)),
        onChange: (value: number) => emit('change', hueToHex(value))
      }),
      h('div', {class: 'vs-color-picker__preview'}, [
        h(ColorSwatch, {
          class: 'vs-color-picker__preview-swatch',
          color: normalizedColor.value,
          label: 'Current color',
          isDisabled: disabled.value
        }),
        h('code', {class: 'vs-color-picker__preview-value'}, normalizedColor.value)
      ]),
      h('svg', {
        class: [classNames(colorLoupeStyles, 'spectrum-ColorLoupe', {'is-open': open.value}), 'vs-color-picker__loupe-marker'],
        hidden: true,
        'aria-hidden': 'true'
      }),
      h('div', {
        class: [classNames(colorHandleStyles, 'spectrum-ColorHandle', {
          'is-disabled': disabled.value,
          'is-focused': focused.value,
          'is-open': open.value
        }), 'vs-color-picker__thumb-marker'],
        hidden: true,
        'aria-hidden': 'true'
      })
    ]);
  }
});

export const ColorEditor = defineComponent({
  name: 'VueColorEditor',
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
      default: 'Color editor'
    },
    modelValue: {
      type: String,
      default: DEFAULT_HEX_COLOR
    }
  },
  emits: {
    change: (value: string) => typeof value === 'string',
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let disabled = computed(() => resolveDisabled(props.disabled, props.isDisabled));
    let rgbColor = computed(() => hexToRgb(props.modelValue));

    let emitChannelValue = (channel: keyof RgbColor, value: number, emitChange: boolean) => {
      let nextColor: RgbColor = {
        ...rgbColor.value,
        [channel]: clamp(Math.round(value), 0, 255)
      };

      let nextHex = rgbToHex(nextColor);
      emit('update:modelValue', nextHex);
      if (emitChange) {
        emit('change', nextHex);
      }
    };

    return () => h('fieldset', {
      ...attrs,
      class: ['vs-color-editor', attrs.class],
      disabled: disabled.value,
      'data-vac': ''
    }, [
      h('legend', {class: 'vs-color-editor__label'}, props.label),
      h('div', {class: 'vs-color-editor__preview'}, [
        h(ColorSwatch, {
          class: 'vs-color-editor__preview-swatch',
          color: props.modelValue,
          label: 'Editable color',
          isDisabled: disabled.value
        }),
        h('code', {class: 'vs-color-editor__preview-value'}, normalizeHexColor(props.modelValue))
      ]),
      h('label', {class: 'vs-color-editor__channel'}, [
        h('span', `Red (${rgbColor.value.r})`),
        h('input', {
          class: 'vs-color-editor__channel-input',
          type: 'range',
          min: 0,
          max: 255,
          step: 1,
          value: rgbColor.value.r,
          onInput: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitChannelValue('r', parsedValue, false);
          },
          onChange: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitChannelValue('r', parsedValue, true);
          }
        })
      ]),
      h('label', {class: 'vs-color-editor__channel'}, [
        h('span', `Green (${rgbColor.value.g})`),
        h('input', {
          class: 'vs-color-editor__channel-input',
          type: 'range',
          min: 0,
          max: 255,
          step: 1,
          value: rgbColor.value.g,
          onInput: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitChannelValue('g', parsedValue, false);
          },
          onChange: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitChannelValue('g', parsedValue, true);
          }
        })
      ]),
      h('label', {class: 'vs-color-editor__channel'}, [
        h('span', `Blue (${rgbColor.value.b})`),
        h('input', {
          class: 'vs-color-editor__channel-input',
          type: 'range',
          min: 0,
          max: 255,
          step: 1,
          value: rgbColor.value.b,
          onInput: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitChannelValue('b', parsedValue, false);
          },
          onChange: (event: Event) => {
            let parsedValue = readNumberInputValue(event);
            if (parsedValue === null) {
              return;
            }

            emitChannelValue('b', parsedValue, true);
          }
        })
      ])
    ]);
  }
});

export function parseColor(value: string): IColor {
  let candidate = value.trim();
  if (/^#[0-9a-fA-F]{3}$/.test(candidate)) {
    let expanded = candidate.slice(1).split('').map((channel) => `${channel}${channel}`).join('');
    return `#${expanded.toLowerCase()}`;
  }

  if (/^#[0-9a-fA-F]{6}$/.test(candidate)) {
    return candidate.toLowerCase();
  }

  if (/^(rgb|rgba|hsl|hsla|hsb|hsba)\(/i.test(candidate)) {
    return candidate;
  }

  return '#000000';
}

export function getColorChannels(colorSpace: ColorSpace): [ColorChannel, ColorChannel, ColorChannel] {
  if (colorSpace === 'rgb') {
    return ['red', 'green', 'blue'];
  }

  if (colorSpace === 'hsb') {
    return ['hue', 'saturation', 'brightness'];
  }

  return ['hue', 'saturation', 'lightness'];
}

export {
  ColorArea as VueColorArea,
  ColorEditor as VueColorEditor,
  ColorField as VueColorField,
  ColorPicker as VueColorPicker,
  ColorSlider as VueColorSlider,
  ColorSwatch as VueColorSwatch,
  ColorSwatchPicker as VueColorSwatchPicker,
  ColorWheel as VueColorWheel
};

export type {
  SpectrumColorAreaProps,
  SpectrumColorFieldProps,
  SpectrumColorSliderProps,
  SpectrumColorWheelProps
} from '@vue-types/color';
export type SpectrumColorEditorProps = InstanceType<typeof ColorEditor>['$props'];
export type SpectrumColorPickerProps = InstanceType<typeof ColorPicker>['$props'];
export type SpectrumColorSwatchPickerProps = InstanceType<typeof ColorSwatchPicker>['$props'];
export type SpectrumColorSwatchProps = InstanceType<typeof ColorSwatch>['$props'];
