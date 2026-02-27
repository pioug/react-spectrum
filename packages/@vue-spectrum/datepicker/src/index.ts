import '@adobe/spectrum-css-temp/components/button/vars.css';
import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import '@adobe/spectrum-css-temp/components/textfield/vars.css';
import '@adobe/spectrum-css-temp/components/inputgroup/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
import './styles.css';
import {getEventTarget} from '@vue-aria/utils';
const buttonStyles: {[key: string]: string} = {};
const fieldLabelStyles: {[key: string]: string} = {};
const textfieldStyles: {[key: string]: string} = {};
const inputGroupStyles: {[key: string]: string} = {};


const datepickerStyles: {[key: string]: string} = {};

type ValidationState = 'invalid' | 'valid';
type DateRangeValue = {
  end: string,
  start: string
};

let dateFieldId = 0;
let datePickerId = 0;
let dateRangePickerId = 0;
let timeFieldId = 0;

function resolveIsDisabled(props: {disabled?: boolean, isDisabled?: boolean | undefined}) {
  if (props.isDisabled !== undefined) {
    return props.isDisabled;
  }

  return Boolean(props.disabled);
}

function resolveIsInvalid(props: {
  invalid?: boolean,
  isInvalid?: boolean,
  validationState?: ValidationState | undefined
}, isDisabled: boolean) {
  let isInvalid = Boolean(props.invalid || props.isInvalid || props.validationState === 'invalid');
  return isInvalid && !isDisabled;
}

function resolveIsReadOnly(props: {readOnly?: boolean, isReadOnly?: boolean | undefined}) {
  if (props.isReadOnly !== undefined) {
    return props.isReadOnly;
  }

  return Boolean(props.readOnly);
}

function resolveIsRequired(props: {required?: boolean, isRequired?: boolean | undefined}) {
  if (props.isRequired !== undefined) {
    return props.isRequired;
  }

  return Boolean(props.required);
}

function readInputValue(event: Event) {
  let target = event.currentTarget as HTMLInputElement | null;
  return target?.value ?? '';
}

type SingleFieldKind = 'date-field' | 'date-picker' | 'time-field';
type SingleFieldType = 'date' | 'time';

const SINGLE_FIELD_COMPONENT_NAME: Record<SingleFieldKind, string> = {
  'date-field': 'VueDateField',
  'date-picker': 'VueDatePicker',
  'time-field': 'VueTimeField'
};

const SINGLE_FIELD_CLASS_PREFIX: Record<SingleFieldKind, string> = {
  'date-field': 'vs-date-field',
  'date-picker': 'vs-date-picker',
  'time-field': 'vs-time-field'
};

function buildSingleField(
  kind: SingleFieldKind,
  inputType: SingleFieldType,
  idFactory: () => string,
  options: {
    includeButton: boolean,
    dataTestId?: string
  }
) {
  let singleFieldClassPrefix = SINGLE_FIELD_CLASS_PREFIX[kind];

  return defineComponent({
    name: SINGLE_FIELD_COMPONENT_NAME[kind],
    inheritAttrs: false,
    props: {
      autoFocus: {
        type: Boolean,
        default: false
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
      invalid: {
        type: Boolean,
        default: false
      },
      isDisabled: {
        type: Boolean as PropType<boolean | undefined>,
        default: undefined
      },
      isInvalid: {
        type: Boolean,
        default: false
      },
      isQuiet: {
        type: Boolean,
        default: false
      },
      isReadOnly: {
        type: Boolean as PropType<boolean | undefined>,
        default: undefined
      },
      isRequired: {
        type: Boolean as PropType<boolean | undefined>,
        default: undefined
      },
      label: {
        type: String,
        default: ''
      },
      max: {
        type: String,
        default: ''
      },
      min: {
        type: String,
        default: ''
      },
      modelValue: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      required: {
        type: Boolean,
        default: false
      },
      step: {
        type: Number,
        default: 60
      },
      validationState: {
        type: String as PropType<ValidationState | undefined>,
        default: undefined
      }
    },
    emits: {
      blur: (event: FocusEvent) => event instanceof FocusEvent,
      change: (value: string) => typeof value === 'string',
      close: () => true,
      focus: (event: FocusEvent) => event instanceof FocusEvent,
      open: () => true,
      openChange: (value: boolean) => typeof value === 'boolean',
      'update:modelValue': (value: string) => typeof value === 'string'
    },
    setup(props, {attrs, emit}) {
      let inputId = computed(() => props.id ?? idFactory());
      let labelId = computed(() => props.label ? `${inputId.value}-label` : undefined);
      let descriptionId = computed(() => props.description ? `${inputId.value}-description` : undefined);
      let popoverId = computed(() => `${inputId.value}-popover`);

      let isDisabled = computed(() => resolveIsDisabled(props));
      let isInvalid = computed(() => resolveIsInvalid(props, isDisabled.value));
      let isValid = computed(() => props.validationState === 'valid' && !isDisabled.value);
      let isReadOnly = computed(() => resolveIsReadOnly(props));
      let isRequired = computed(() => resolveIsRequired(props));
      let isPlaceholder = computed(() => props.modelValue === '');

      let isFocused = ref(false);
      let isFocusVisible = ref(false);
      let isHovered = ref(false);
      let isOpen = ref(false);

      let groupClassName = computed(() => classNames(
        inputGroupStyles,
        'spectrum-InputGroup',
        {
          'spectrum-InputGroup--quiet': props.isQuiet,
          'spectrum-InputGroup--invalid': isInvalid.value,
          'is-disabled': isDisabled.value,
          'is-focused': isFocused.value,
          'is-hovered': isHovered.value && !isDisabled.value,
          'focus-ring': isFocusVisible.value
        }
      ));

      let fieldClassName = computed(() => classNames(
        textfieldStyles,
        'spectrum-Textfield',
        {
          'spectrum-Textfield--invalid': isInvalid.value,
          'spectrum-Textfield--valid': isValid.value,
          'spectrum-Textfield--quiet': props.isQuiet
        },
        classNames(datepickerStyles, 'react-spectrum-Datepicker-field'),
        classNames(inputGroupStyles, 'spectrum-InputGroup-field')
      ));

      let inputClassName = computed(() => classNames(
        textfieldStyles,
        'spectrum-Textfield-input',
        {
          'is-disabled': isDisabled.value,
          'is-focused': isFocused.value,
          'is-hovered': isHovered.value && !isDisabled.value,
          'is-invalid': isInvalid.value,
          'is-placeholder': isPlaceholder.value,
          'is-read-only': isReadOnly.value
        },
        classNames(datepickerStyles, 'react-spectrum-DateField-Input'),
        classNames(inputGroupStyles, 'spectrum-InputGroup-input')
      ));

      let triggerClassName = computed(() => classNames(
        buttonStyles,
        'spectrum-FieldButton',
        {
          'spectrum-FieldButton--quiet': props.isQuiet,
          'spectrum-FieldButton--invalid': isInvalid.value,
          'is-disabled': isDisabled.value,
          'is-hovered': isHovered.value && !isDisabled.value
        },
        classNames(inputGroupStyles, 'spectrum-FieldButton')
      ));

      let externalAriaLabelledBy = computed(() => {
        let value = attrs['aria-labelledby'];
        return typeof value === 'string' && value.length > 0 ? value : undefined;
      });
      let ariaLabelledBy = computed(() => {
        let parts = [externalAriaLabelledBy.value, labelId.value].filter((part): part is string => Boolean(part));
        return parts.length > 0 ? parts.join(' ') : undefined;
      });
      let ariaLabel = computed(() => {
        if (externalAriaLabelledBy.value) {
          return undefined;
        }

        let fromAttrs = attrs['aria-label'];
        if (typeof fromAttrs === 'string' && fromAttrs.length > 0) {
          return fromAttrs;
        }

        return props.label || undefined;
      });

      let openPopover = () => {
        if (!options.includeButton || isOpen.value || isDisabled.value || isReadOnly.value) {
          return;
        }

        isOpen.value = true;
        emit('open');
        emit('openChange', true);
      };

      let closePopover = () => {
        if (!options.includeButton || !isOpen.value) {
          return;
        }

        isOpen.value = false;
        emit('close');
        emit('openChange', false);
      };

      return () => h('label', {
        ...attrs,
        class: [
          singleFieldClassPrefix,
          attrs.class
        ],
        'data-vac': ''
      }, [
        props.label
          ? h('span', {
            id: labelId.value,
            class: [
              classNames(fieldLabelStyles, 'spectrum-FieldLabel'),
              `${singleFieldClassPrefix}__label`
            ]
          }, props.label)
          : null,
        h('div', {
          class: [
            groupClassName.value,
            `${singleFieldClassPrefix}__control`
          ],
          onMouseenter: () => {
            if (isDisabled.value) {
              return;
            }

            isHovered.value = true;
          },
          onMouseleave: () => {
            isHovered.value = false;
          }
        }, [
          h('div', {
            class: fieldClassName.value
          }, [
            h('input', {
              id: inputId.value,
              type: 'text',
              class: [
                inputClassName.value,
                `${singleFieldClassPrefix}__input`
              ],
              value: props.modelValue,
              disabled: isDisabled.value,
              readonly: isReadOnly.value || undefined,
              required: isRequired.value || undefined,
              placeholder: props.placeholder || undefined,
              'aria-label': ariaLabel.value,
              'aria-labelledby': ariaLabelledBy.value,
              'aria-describedby': descriptionId.value,
              'aria-invalid': isInvalid.value ? 'true' : undefined,
              'data-testid': options.dataTestId,
              autofocus: props.autoFocus || attrs.autofocus || undefined,
              onInput: (event: Event) => emit('update:modelValue', readInputValue(event)),
              onChange: (event: Event) => emit('change', readInputValue(event)),
              onFocus: (event: FocusEvent) => {
                isFocused.value = true;
                let target = getEventTarget(event);
                isFocusVisible.value = target instanceof HTMLElement ? target.matches(':focus-visible') : false;
                emit('focus', event);
              },
              onBlur: (event: FocusEvent) => {
                isFocused.value = false;
                isFocusVisible.value = false;
                closePopover();
                emit('blur', event);
              }
            }),
            h('span', {
              class: classNames(datepickerStyles, 'react-spectrum-DatePicker-placeholder'),
              hidden: !isPlaceholder.value,
              'aria-hidden': 'true'
            }, props.placeholder || '--'),
            isInvalid.value
              ? h('span', {
                class: classNames(textfieldStyles, 'spectrum-Textfield-validationIcon'),
                'aria-hidden': 'true'
              }, '!')
              : null
          ]),
          options.includeButton
            ? h('button', {
              class: triggerClassName.value,
              type: 'button',
              disabled: isDisabled.value,
              'aria-haspopup': 'dialog',
              'aria-expanded': isOpen.value ? 'true' : 'false',
              'aria-controls': popoverId.value,
              onClick: () => {
                if (isOpen.value) {
                  closePopover();
                } else {
                  openPopover();
                }
              }
            }, [
              h('svg', {
                viewBox: '0 0 18 18',
                focusable: 'false',
                'aria-hidden': 'true'
              }, [
                h('rect', {
                  x: '2.2',
                  y: '2.8',
                  width: '13.6',
                  height: '12.4',
                  rx: '0.8',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': '1.35'
                }),
                h('path', {
                  d: 'M2.2 6.9h13.6',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': '1.35'
                }),
                h('rect', {x: '5.1', y: '8.6', width: '1.4', height: '1.4', fill: 'currentColor'}),
                h('rect', {x: '8.3', y: '8.6', width: '1.4', height: '1.4', fill: 'currentColor'}),
                h('rect', {x: '11.5', y: '8.6', width: '1.4', height: '1.4', fill: 'currentColor'}),
                h('rect', {x: '5.1', y: '11.4', width: '1.4', height: '1.4', fill: 'currentColor'}),
                h('rect', {x: '8.3', y: '11.4', width: '1.4', height: '1.4', fill: 'currentColor'}),
                h('rect', {x: '11.5', y: '11.4', width: '1.4', height: '1.4', fill: 'currentColor'})
              ])
            ])
            : null
        ]),
        options.includeButton
          ? h('div', {
            id: popoverId.value,
            class: classNames(datepickerStyles, 'react-spectrum-Datepicker-dialog'),
            hidden: !isOpen.value,
            'aria-hidden': isOpen.value ? 'false' : 'true'
          }, [
            h('div', {
              class: classNames(datepickerStyles, 'react-spectrum-Datepicker-dialogContent')
            }, 'Calendar')
          ])
          : null,
        props.description
          ? h('span', {
            id: descriptionId.value,
            class: `${singleFieldClassPrefix}__description`
          }, props.description)
          : null
      ]);
    }
  });
}

export const DateField = buildSingleField('date-field', 'date', () => `vs-date-field-${++dateFieldId}`, {includeButton: false});

export const DatePicker = buildSingleField('date-picker', 'date', () => `vs-date-picker-${++datePickerId}`, {
  includeButton: true,
  dataTestId: 'date-field'
});

export const TimeField = buildSingleField('time-field', 'time', () => `vs-time-field-${++timeFieldId}`, {includeButton: false});

export const DateRangePicker = defineComponent({
  name: 'VueDateRangePicker',
  inheritAttrs: false,
  props: {
    autoFocus: {
      type: Boolean,
      default: false
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
    invalid: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isQuiet: {
      type: Boolean,
      default: false
    },
    isReadOnly: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isRequired: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    label: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    min: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Object as PropType<DateRangeValue>,
      default: () => ({
        start: '',
        end: ''
      })
    },
    placeholder: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    validationState: {
      type: String as PropType<ValidationState | undefined>,
      default: undefined
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: DateRangeValue) => typeof value === 'object' && value !== null,
    close: () => true,
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    open: () => true,
    openChange: (value: boolean) => typeof value === 'boolean',
    'update:modelValue': (value: DateRangeValue) => typeof value === 'object' && value !== null
  },
  setup(props, {attrs, emit}) {
    let generatedId = `vs-date-range-picker-${++dateRangePickerId}`;
    let pickerId = computed(() => props.id ?? generatedId);
    let labelId = computed(() => props.label ? `${pickerId.value}-label` : undefined);
    let descriptionId = computed(() => props.description ? `${pickerId.value}-description` : undefined);
    let popoverId = computed(() => `${pickerId.value}-popover`);

    let isDisabled = computed(() => resolveIsDisabled(props));
    let isInvalid = computed(() => resolveIsInvalid(props, isDisabled.value));
    let isReadOnly = computed(() => resolveIsReadOnly(props));
    let isRequired = computed(() => resolveIsRequired(props));
    let isFocused = ref(false);
    let isFocusVisible = ref(false);
    let isHovered = ref(false);
    let isOpen = ref(false);

    let groupClassName = computed(() => classNames(
      inputGroupStyles,
      'spectrum-InputGroup',
      {
        'spectrum-InputGroup--quiet': props.isQuiet,
        'spectrum-InputGroup--invalid': isInvalid.value,
        'is-disabled': isDisabled.value,
        'is-focused': isFocused.value,
        'is-hovered': isHovered.value && !isDisabled.value,
        'focus-ring': isFocusVisible.value
      }
    ));

    let fieldClassName = computed(() => classNames(
      textfieldStyles,
      'spectrum-Textfield',
      {
        'spectrum-Textfield--invalid': isInvalid.value,
        'spectrum-Textfield--quiet': props.isQuiet
      },
      classNames(datepickerStyles, 'react-spectrum-Datepicker-field'),
      classNames(inputGroupStyles, 'spectrum-InputGroup-field')
    ));

    let inputClassName = computed(() => classNames(
      textfieldStyles,
      'spectrum-Textfield-input',
      {
        'is-disabled': isDisabled.value,
        'is-focused': isFocused.value,
        'is-hovered': isHovered.value && !isDisabled.value,
        'is-invalid': isInvalid.value,
        'is-read-only': isReadOnly.value
      },
      classNames(datepickerStyles, 'react-spectrum-DateField-Input'),
      classNames(inputGroupStyles, 'spectrum-InputGroup-input')
    ));

    let triggerClassName = computed(() => classNames(
      buttonStyles,
      'spectrum-FieldButton',
      {
        'spectrum-FieldButton--quiet': props.isQuiet,
        'spectrum-FieldButton--invalid': isInvalid.value,
        'is-disabled': isDisabled.value,
        'is-hovered': isHovered.value && !isDisabled.value
      },
      classNames(inputGroupStyles, 'spectrum-FieldButton')
    ));

    let setFocusState = (event: FocusEvent, focused: boolean) => {
      isFocused.value = focused;
      if (focused) {
        let target = getEventTarget(event);
        isFocusVisible.value = target instanceof HTMLElement ? target.matches(':focus-visible') : false;
      } else {
        isFocusVisible.value = false;
      }
    };

    let emitNextValue = (partial: Partial<DateRangeValue>, emitChange: boolean) => {
      let nextValue = {
        start: partial.start ?? props.modelValue.start,
        end: partial.end ?? props.modelValue.end
      };
      emit('update:modelValue', nextValue);
      if (emitChange) {
        emit('change', nextValue);
      }
    };

    let openPopover = () => {
      if (isOpen.value || isDisabled.value || isReadOnly.value) {
        return;
      }

      isOpen.value = true;
      emit('open');
      emit('openChange', true);
    };

    let closePopover = () => {
      if (!isOpen.value) {
        return;
      }

      isOpen.value = false;
      emit('close');
      emit('openChange', false);
    };

    return () => h('fieldset', {
      ...attrs,
      class: ['vs-date-range-picker', attrs.class],
      disabled: isDisabled.value,
      'data-vac': ''
    }, [
      props.label
        ? h('legend', {
          id: labelId.value,
          class: [classNames(fieldLabelStyles, 'spectrum-FieldLabel'), 'vs-date-range-picker__label']
        }, props.label)
        : null,
      h('div', {
        class: [groupClassName.value, 'vs-date-range-picker__controls'],
        onMouseenter: () => {
          if (isDisabled.value) {
            return;
          }

          isHovered.value = true;
        },
        onMouseleave: () => {
          isHovered.value = false;
        }
      }, [
        h('div', {
          class: fieldClassName.value
        }, [
          h('input', {
            id: `${pickerId.value}-start`,
            class: [
              inputClassName.value,
              classNames(datepickerStyles, 'react-spectrum-Datepicker-startField'),
              'vs-date-range-picker__input'
            ],
            type: 'text',
            value: props.modelValue.start,
            disabled: isDisabled.value,
            readonly: isReadOnly.value || undefined,
            required: isRequired.value || undefined,
            placeholder: props.placeholder || undefined,
            'aria-label': 'Start date',
            'aria-labelledby': labelId.value,
            'aria-describedby': descriptionId.value,
            'aria-invalid': isInvalid.value ? 'true' : undefined,
            'data-testid': 'start-date',
            autofocus: props.autoFocus || attrs.autofocus || undefined,
            onInput: (event: Event) => emitNextValue({start: readInputValue(event)}, false),
            onChange: (event: Event) => emitNextValue({start: readInputValue(event)}, true),
            onFocus: (event: FocusEvent) => {
              setFocusState(event, true);
              emit('focus', event);
            },
            onBlur: (event: FocusEvent) => {
              setFocusState(event, false);
              emit('blur', event);
            }
          }),
          h('span', {
            class: classNames(datepickerStyles, 'react-spectrum-Datepicker-rangeDash'),
            'data-testid': 'date-range-dash',
            'aria-hidden': 'true'
          }),
          h('input', {
            id: `${pickerId.value}-end`,
            class: [
              inputClassName.value,
              classNames(datepickerStyles, 'react-spectrum-Datepicker-endField'),
              'vs-date-range-picker__input'
            ],
            type: 'text',
            value: props.modelValue.end,
            disabled: isDisabled.value,
            readonly: isReadOnly.value || undefined,
            required: isRequired.value || undefined,
            placeholder: props.placeholder || undefined,
            'aria-label': 'End date',
            'aria-labelledby': labelId.value,
            'aria-describedby': descriptionId.value,
            'aria-invalid': isInvalid.value ? 'true' : undefined,
            'data-testid': 'end-date',
            onInput: (event: Event) => emitNextValue({end: readInputValue(event)}, false),
            onChange: (event: Event) => emitNextValue({end: readInputValue(event)}, true),
            onFocus: (event: FocusEvent) => {
              setFocusState(event, true);
              emit('focus', event);
            },
            onBlur: (event: FocusEvent) => {
              setFocusState(event, false);
              emit('blur', event);
            }
          })
        ]),
        h('button', {
          type: 'button',
          class: triggerClassName.value,
          disabled: isDisabled.value,
          'aria-haspopup': 'dialog',
          'aria-expanded': isOpen.value ? 'true' : 'false',
          'aria-controls': popoverId.value,
          onClick: () => {
            if (isOpen.value) {
              closePopover();
            } else {
              openPopover();
            }
          }
        }, [
          h('svg', {
            viewBox: '0 0 18 18',
            focusable: 'false',
            'aria-hidden': 'true'
          }, [
            h('rect', {
              x: '2.2',
              y: '2.8',
              width: '13.6',
              height: '12.4',
              rx: '0.8',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': '1.35'
            }),
            h('path', {
              d: 'M2.2 6.9h13.6',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': '1.35'
            }),
            h('rect', {x: '5.1', y: '8.6', width: '1.4', height: '1.4', fill: 'currentColor'}),
            h('rect', {x: '8.3', y: '8.6', width: '1.4', height: '1.4', fill: 'currentColor'}),
            h('rect', {x: '11.5', y: '8.6', width: '1.4', height: '1.4', fill: 'currentColor'}),
            h('rect', {x: '5.1', y: '11.4', width: '1.4', height: '1.4', fill: 'currentColor'}),
            h('rect', {x: '8.3', y: '11.4', width: '1.4', height: '1.4', fill: 'currentColor'}),
            h('rect', {x: '11.5', y: '11.4', width: '1.4', height: '1.4', fill: 'currentColor'})
          ])
        ])
      ]),
      h('div', {
        id: popoverId.value,
        class: classNames(datepickerStyles, 'react-spectrum-Datepicker-dialog'),
        hidden: !isOpen.value,
        'aria-hidden': isOpen.value ? 'false' : 'true'
      }, [
        h('div', {
          class: classNames(datepickerStyles, 'react-spectrum-Datepicker-dialogContent')
        }, 'Range calendar')
      ]),
      props.description
        ? h('span', {
          id: descriptionId.value,
          class: 'vs-date-range-picker__description'
        }, props.description)
        : null
    ]);
  }
});

export const VueDateField = DateField;
export const VueDatePicker = DatePicker;
export const VueDateRangePicker = DateRangePicker;
export const VueTimeField = TimeField;

export type {
  SpectrumDateFieldProps,
  SpectrumDatePickerProps,
  SpectrumDateRangePickerProps,
  SpectrumTimeFieldProps
} from '@vue-types/datepicker';
