import {computed, defineComponent, h, type PropType} from 'vue';
import {getSpectrumContext} from '../context';

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

export const VueColorSwatch = defineComponent({
  name: 'VueColorSwatch',
  props: {
    color: {
      type: String,
      default: DEFAULT_HEX_COLOR
    },
    label: {
      type: String,
      default: ''
    },
    bordered: {
      type: Boolean,
      default: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {attrs}) {
    return function render() {
      return h('span', {
        ...attrs,
        class: [
          'vs-color-swatch',
          props.bordered ? 'is-bordered' : null,
          props.selected ? 'is-selected' : null,
          attrs.class
        ],
        role: 'img',
        'aria-label': props.label || `Color ${props.color}`,
        style: {
          backgroundColor: props.color || DEFAULT_HEX_COLOR
        },
        'data-vac': ''
      });
    };
  }
});

export const VueColorField = defineComponent({
  name: 'VueColorField',
  props: {
    id: {
      type: String,
      default: undefined
    },
    modelValue: {
      type: String,
      default: DEFAULT_HEX_COLOR
    },
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '#3366ff'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    invalid: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    change: (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();
    let generatedId = `vs-color-field-${++colorFieldId}`;

    let inputId = computed(() => props.id ?? generatedId);
    let inputClasses = computed(() => ([
      'vs-color-field__input',
      context.value.scale === 'large' ? 'vs-color-field__input--large' : 'vs-color-field__input--medium',
      props.invalid ? 'is-invalid' : null
    ]));

    let onInput = (event: Event) => {
      emit('update:modelValue', readTextInputValue(event));
    };

    let onChange = (event: Event) => {
      emit('change', readTextInputValue(event));
    };

    return function render() {
      return h('label', {
        ...attrs,
        class: ['vs-color-field', attrs.class],
        'data-vac': ''
      }, [
        props.label ? h('span', {class: 'vs-color-field__label'}, props.label) : null,
        h('span', {class: 'vs-color-field__control'}, [
          h(VueColorSwatch, {
            class: 'vs-color-field__swatch',
            color: props.modelValue || DEFAULT_HEX_COLOR,
            label: props.label || 'Selected color'
          }),
          h('input', {
            id: inputId.value,
            class: inputClasses.value,
            type: 'text',
            value: props.modelValue,
            placeholder: props.placeholder,
            disabled: props.disabled,
            spellcheck: 'false',
            onInput,
            onChange
          })
        ]),
        props.description
          ? h('span', {class: 'vs-color-field__description'}, props.description)
          : null
      ]);
    };
  }
});

export const VueColorSlider = defineComponent({
  name: 'VueColorSlider',
  props: {
    id: {
      type: String,
      default: undefined
    },
    modelValue: {
      type: Number,
      default: 220
    },
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 360
    },
    step: {
      type: Number,
      default: 1
    },
    channel: {
      type: String,
      default: 'hue'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: number) => Number.isFinite(value),
    change: (value: number) => Number.isFinite(value)
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();
    let generatedId = `vs-color-slider-${++colorSliderId}`;

    let sliderId = computed(() => props.id ?? generatedId);
    let minimum = computed(() => Math.min(props.min, props.max));
    let maximum = computed(() => Math.max(props.min, props.max));

    let inputClasses = computed(() => ([
      'vs-color-slider__input',
      context.value.scale === 'large' ? 'vs-color-slider__input--large' : 'vs-color-slider__input--medium'
    ]));

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

    return function render() {
      return h('label', {
        ...attrs,
        class: ['vs-color-slider', attrs.class],
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
          class: inputClasses.value,
          type: 'range',
          min: minimum.value,
          max: maximum.value,
          step: props.step,
          value: sliderValue.value,
          disabled: props.disabled,
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
          : null
      ]);
    };
  }
});

export const VueColorArea = defineComponent({
  name: 'VueColorArea',
  props: {
    modelValue: {
      type: Object as PropType<ColorAreaValue>,
      default: () => ({
        x: 50,
        y: 50
      })
    },
    label: {
      type: String,
      default: 'Color area'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: ColorAreaValue) => typeof value === 'object' && value !== null,
    change: (value: ColorAreaValue) => typeof value === 'object' && value !== null
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();

    let areaValue = computed(() => normalizeColorAreaValue(props.modelValue));
    let rangeClasses = computed(() => ([
      'vs-color-area__input',
      context.value.scale === 'large' ? 'vs-color-area__input--large' : 'vs-color-area__input--medium'
    ]));

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

    return function render() {
      return h('fieldset', {
        ...attrs,
        class: ['vs-color-area', attrs.class],
        disabled: props.disabled,
        'data-vac': ''
      }, [
        h('legend', {class: 'vs-color-area__label'}, props.label),
        h('div', {class: 'vs-color-area__preview', style: {backgroundColor: previewColor.value}}),
        h('label', {class: 'vs-color-area__channel'}, [
          h('span', 'X channel'),
          h('input', {
            class: rangeClasses.value,
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
            class: rangeClasses.value,
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
        ])
      ]);
    };
  }
});

export const VueColorWheel = defineComponent({
  name: 'VueColorWheel',
  props: {
    modelValue: {
      type: Number,
      default: 220
    },
    label: {
      type: String,
      default: 'Color wheel'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: number) => Number.isFinite(value),
    change: (value: number) => Number.isFinite(value)
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();

    let hueValue = computed(() => ((Math.round(props.modelValue) % 360) + 360) % 360);
    let inputClasses = computed(() => ([
      'vs-color-wheel__input',
      context.value.scale === 'large' ? 'vs-color-wheel__input--large' : 'vs-color-wheel__input--medium'
    ]));

    let emitHue = (value: number, emitChange: boolean) => {
      let normalizedHue = ((Math.round(value) % 360) + 360) % 360;
      emit('update:modelValue', normalizedHue);
      if (emitChange) {
        emit('change', normalizedHue);
      }
    };

    return function render() {
      return h('section', {
        ...attrs,
        class: ['vs-color-wheel', attrs.class],
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
          h(VueColorSwatch, {
            color: hueToHex(hueValue.value),
            label: `Hue ${hueValue.value}`,
            class: 'vs-color-wheel__swatch'
          }),
          h('span', {class: 'vs-color-wheel__value'}, `${hueValue.value}\u00b0`)
        ]),
        h('input', {
          class: inputClasses.value,
          type: 'range',
          min: 0,
          max: 360,
          step: 1,
          value: hueValue.value,
          disabled: props.disabled,
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
        })
      ]);
    };
  }
});

export const VueColorSwatchPicker = defineComponent({
  name: 'VueColorSwatchPicker',
  props: {
    items: {
      type: Array as PropType<ColorSwatchItem[]>,
      default: () => DEFAULT_COLOR_SWATCHES.map((item) => ({...item}))
    },
    modelValue: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    change: (item: ColorSwatchItem) => typeof item === 'object' && item !== null
  },
  setup(props, {emit, attrs}) {
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

    return function render() {
      return h('div', {
        ...attrs,
        class: ['vs-color-swatch-picker', attrs.class],
        'data-vac': ''
      }, swatches.value.map((item) => {
        let isSelected = item.id === selectedId.value;
        return h('button', {
          key: item.id,
          class: ['vs-color-swatch-picker__item', isSelected ? 'is-selected' : null],
          type: 'button',
          disabled: props.disabled,
          onClick: () => onSelect(item)
        }, [
          h(VueColorSwatch, {
            class: 'vs-color-swatch-picker__swatch',
            color: item.color,
            label: item.label ?? item.id,
            selected: isSelected
          }),
          h('span', {class: 'vs-color-swatch-picker__label'}, item.label ?? item.id)
        ]);
      }));
    };
  }
});

export const VueColorPicker = defineComponent({
  name: 'VueColorPicker',
  props: {
    modelValue: {
      type: String,
      default: DEFAULT_HEX_COLOR
    },
    label: {
      type: String,
      default: 'Color picker'
    },
    description: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    change: (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let normalizedColor = computed(() => normalizeHexColor(props.modelValue));
    let hueValue = computed(() => hexToHue(props.modelValue));

    return function render() {
      return h('section', {
        ...attrs,
        class: ['vs-color-picker', attrs.class],
        'data-vac': ''
      }, [
        h(VueColorField, {
          modelValue: props.modelValue,
          label: props.label,
          description: props.description,
          disabled: props.disabled,
          'onUpdate:modelValue': (value: string) => emit('update:modelValue', value),
          onChange: (value: string) => emit('change', value)
        }),
        h(VueColorSlider, {
          class: 'vs-color-picker__hue',
          modelValue: hueValue.value,
          label: 'Hue',
          min: 0,
          max: 360,
          channel: 'hue',
          disabled: props.disabled,
          'onUpdate:modelValue': (value: number) => emit('update:modelValue', hueToHex(value)),
          onChange: (value: number) => emit('change', hueToHex(value))
        }),
        h('div', {class: 'vs-color-picker__preview'}, [
          h(VueColorSwatch, {
            class: 'vs-color-picker__preview-swatch',
            color: normalizedColor.value,
            label: 'Current color'
          }),
          h('code', {class: 'vs-color-picker__preview-value'}, normalizedColor.value)
        ])
      ]);
    };
  }
});

export const VueColorEditor = defineComponent({
  name: 'VueColorEditor',
  props: {
    modelValue: {
      type: String,
      default: DEFAULT_HEX_COLOR
    },
    label: {
      type: String,
      default: 'Color editor'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    change: (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();
    let rgbColor = computed(() => hexToRgb(props.modelValue));

    let channelClass = computed(() => ([
      'vs-color-editor__channel-input',
      context.value.scale === 'large'
        ? 'vs-color-editor__channel-input--large'
        : 'vs-color-editor__channel-input--medium'
    ]));

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

    return function render() {
      return h('fieldset', {
        ...attrs,
        class: ['vs-color-editor', attrs.class],
        disabled: props.disabled,
        'data-vac': ''
      }, [
        h('legend', {class: 'vs-color-editor__label'}, props.label),
        h('div', {class: 'vs-color-editor__preview'}, [
          h(VueColorSwatch, {
            class: 'vs-color-editor__preview-swatch',
            color: props.modelValue,
            label: 'Editable color'
          }),
          h('code', {class: 'vs-color-editor__preview-value'}, normalizeHexColor(props.modelValue))
        ]),
        h('label', {class: 'vs-color-editor__channel'}, [
          h('span', `Red (${rgbColor.value.r})`),
          h('input', {
            class: channelClass.value,
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
            class: channelClass.value,
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
            class: channelClass.value,
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
    };
  }
});
