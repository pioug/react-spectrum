import '@adobe/spectrum-css-temp/components/stepper/vars.css';
import '@adobe/spectrum-css-temp/components/textfield/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
import {getEventTarget} from '@vue-aria/utils';
import './styles.css';
const stepperStyles: {[key: string]: string} = {};


type ValidationState = 'invalid' | 'valid';

let numberFieldId = 0;

function parseInputValue(rawValue: string): number | null {
  if (rawValue === '') {
    return null;
  }

  let parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function clampValue(value: number, min?: number, max?: number): number {
  let next = value;
  if (typeof min === 'number') {
    next = Math.max(next, min);
  }
  if (typeof max === 'number') {
    next = Math.min(next, max);
  }
  return next;
}

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
  let invalid = Boolean(props.invalid || props.isInvalid || props.validationState === 'invalid');
  return invalid && !isDisabled;
}

function resolveIsReadOnly(props: {isReadOnly?: boolean, readOnly?: boolean}) {
  if (props.isReadOnly !== undefined) {
    return props.isReadOnly;
  }

  return Boolean(props.readOnly);
}

function resolveIsRequired(props: {isRequired?: boolean | undefined, required?: boolean}) {
  if (props.isRequired !== undefined) {
    return props.isRequired;
  }

  return Boolean(props.required);
}

export const NumberField = defineComponent({
  name: 'VueNumberField',
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
    errorMessage: {
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
    hideStepper: {
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
      type: Number,
      default: undefined
    },
    min: {
      type: Number,
      default: undefined
    },
    modelValue: {
      type: Number as PropType<number | null>,
      default: null
    },
    name: {
      type: String,
      default: undefined
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
      default: 1
    },
    validationState: {
      type: String as PropType<ValidationState | undefined>,
      default: undefined
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: number | null) => value === null || typeof value === 'number',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    'update:modelValue': (value: number | null) => value === null || typeof value === 'number'
  },
  setup(props, {attrs, emit}) {
    let generatedId = `vs-number-field-${++numberFieldId}`;
    let inputId = computed(() => props.id ?? generatedId);
    let descriptionId = computed(() => (props.description || props.errorMessage) ? `${inputId.value}-description` : undefined);

    let isDisabled = computed(() => resolveIsDisabled(props));
    let isInvalid = computed(() => resolveIsInvalid(props, isDisabled.value));
    let isReadOnly = computed(() => resolveIsReadOnly(props));
    let isRequired = computed(() => resolveIsRequired(props));
    let showStepper = computed(() => !props.hideStepper);
    let currentValue = computed(() => typeof props.modelValue === 'number' && Number.isFinite(props.modelValue) ? props.modelValue : null);

    let isHovered = ref(false);
    let isFocused = ref(false);
    let isFocusVisible = ref(false);
    let upHovered = ref(false);
    let downHovered = ref(false);
    let upPressed = ref(false);
    let downPressed = ref(false);
    let upFocusVisible = ref(false);
    let downFocusVisible = ref(false);

    let canStep = computed(() => !isDisabled.value && !isReadOnly.value);
    let helpText = computed(() => {
      if (isInvalid.value) {
        return props.errorMessage || props.description;
      }

      return props.description;
    });

    let rootClassName = computed(() => classNames(
      stepperStyles,
      'spectrum-Stepper',
      {
        'spectrum-Stepper--isQuiet': props.isQuiet,
        'spectrum-Stepper--readonly': isReadOnly.value,
        'spectrum-Stepper--showStepper': showStepper.value,
        'is-disabled': isDisabled.value,
        'is-focused': isFocused.value,
        'is-hovered': isHovered.value && !isDisabled.value,
        'is-invalid': isInvalid.value,
        'focus-ring': isFocusVisible.value
      }
    ));

    let fieldClassName = computed(() => classNames(
      stepperStyles,
      'spectrum-Stepper-field'
    ));

    let inputClassName = computed(() => classNames(
      stepperStyles,
      'spectrum-Stepper-input',
      'spectrum-Textfield-input',
      'i18nFontFamily',
      {
        'is-disabled': isDisabled.value,
        'is-focused': isFocused.value
      }
    ));

    let upButtonClassName = computed(() => classNames(
      stepperStyles,
      'spectrum-Stepper-button',
      'spectrum-Stepper-button--stepUp',
      {
        'spectrum-Stepper-button--isQuiet': props.isQuiet,
        'is-hovered': upHovered.value && canStep.value,
        'is-active': upPressed.value && canStep.value,
        'is-disabled': !canStep.value,
        'focus-ring': upFocusVisible.value
      }
    ));

    let downButtonClassName = computed(() => classNames(
      stepperStyles,
      'spectrum-Stepper-button',
      'spectrum-Stepper-button--stepDown',
      {
        'spectrum-Stepper-button--isQuiet': props.isQuiet,
        'is-hovered': downHovered.value && canStep.value,
        'is-active': downPressed.value && canStep.value,
        'is-disabled': !canStep.value,
        'focus-ring': downFocusVisible.value
      }
    ));

    let emitValue = (value: number | null) => {
      emit('update:modelValue', value);
      emit('change', value);
    };

    let stepBy = (delta: number) => {
      if (!canStep.value) {
        return;
      }

      let base = currentValue.value ?? 0;
      let next = clampValue(base + delta, props.min, props.max);
      emitValue(next);
    };

    let evaluateFocusVisible = (event: FocusEvent): boolean => {
      let target = getEventTarget(event);
      if (target instanceof HTMLElement && target.matches(':focus-visible')) {
        return true;
      }

      return true;
    };

    return () => h('label', {
      ...attrs,
      class: ['vs-number-field', attrs.class],
      'data-vac': ''
    }, [
      props.label ? h('span', {class: 'vs-number-field__label'}, props.label) : null,
      h('div', {
        class: classNames(
          stepperStyles,
          'spectrum-Stepper-container',
          'vs-number-field__container'
        )
      }, [
        h('div', {
          class: [rootClassName.value, 'vs-number-field__control'],
          onMouseenter: () => {
            if (isDisabled.value) {
              return;
            }

            isHovered.value = true;
          },
          onMouseleave: () => {
            isHovered.value = false;
            upHovered.value = false;
            downHovered.value = false;
            upPressed.value = false;
            downPressed.value = false;
          }
        }, [
          h('div', {class: fieldClassName.value}, [
            h('input', {
              id: inputId.value,
              class: inputClassName.value,
              type: 'text',
              inputmode: 'decimal',
              value: currentValue.value ?? '',
              tabindex: isDisabled.value ? undefined : attrs.tabindex ?? 0,
              placeholder: props.placeholder || undefined,
              disabled: isDisabled.value,
              readonly: isReadOnly.value || undefined,
              required: isRequired.value || undefined,
              'aria-invalid': isInvalid.value ? 'true' : undefined,
              'aria-describedby': descriptionId.value,
              autofocus: props.autoFocus || attrs.autofocus || undefined,
              onInput: (event: Event) => {
                let nextValue = parseInputValue(readInputValue(event));
                emitValue(nextValue);
              },
              onFocus: (event: FocusEvent) => {
                isFocused.value = true;
                isFocusVisible.value = evaluateFocusVisible(event);
                emit('focus', event);
              },
              onBlur: (event: FocusEvent) => {
                isFocused.value = false;
                isFocusVisible.value = false;
                emit('blur', event);
              }
            }),
            isInvalid.value
              ? h('span', {
                class: [classNames(stepperStyles, 'spectrum-Stepper-icon')],
                'aria-hidden': 'true'
              }, [
                h('svg', {
                  class: 'vs-number-field__alert-icon',
                  viewBox: '0 0 16 16',
                  focusable: 'false'
                }, [
                  h('path', {
                    d: 'm8 1 7 13h-14z',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '1.6',
                    'stroke-linejoin': 'round'
                  }),
                  h('path', {
                    d: 'M8 5.2v4.7',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '1.6',
                    'stroke-linecap': 'round'
                  }),
                  h('circle', {
                    cx: '8',
                    cy: '12.2',
                    r: '0.95',
                    fill: 'currentColor'
                  })
                ])
              ])
              : null
          ]),
          showStepper.value
            ? h('button', {
              class: [upButtonClassName.value, 'vs-number-field__stepper', 'vs-number-field__stepper--up'],
              type: 'button',
              disabled: !canStep.value,
              onMouseenter: () => {
                if (!canStep.value) {
                  return;
                }

                upHovered.value = true;
              },
              onMouseleave: () => {
                upHovered.value = false;
                upPressed.value = false;
              },
              onMousedown: () => {
                if (!canStep.value) {
                  return;
                }

                upPressed.value = true;
              },
              onMouseup: () => {
                upPressed.value = false;
              },
              onFocus: (event: FocusEvent) => {
                upFocusVisible.value = evaluateFocusVisible(event);
              },
              onBlur: () => {
                upFocusVisible.value = false;
              },
              onClick: () => stepBy(props.step)
            }, '\u25b4')
            : null,
          showStepper.value
            ? h('button', {
              class: [downButtonClassName.value, 'vs-number-field__stepper', 'vs-number-field__stepper--down'],
              type: 'button',
              disabled: !canStep.value,
              onMouseenter: () => {
                if (!canStep.value) {
                  return;
                }

                downHovered.value = true;
              },
              onMouseleave: () => {
                downHovered.value = false;
                downPressed.value = false;
              },
              onMousedown: () => {
                if (!canStep.value) {
                  return;
                }

                downPressed.value = true;
              },
              onMouseup: () => {
                downPressed.value = false;
              },
              onFocus: (event: FocusEvent) => {
                downFocusVisible.value = evaluateFocusVisible(event);
              },
              onBlur: () => {
                downFocusVisible.value = false;
              },
              onClick: () => stepBy(-props.step)
            }, '\u25be')
            : null,
          props.name
            ? h('input', {
              type: 'hidden',
              hidden: true,
              name: props.name,
              form: props.form || undefined,
              value: currentValue.value ?? ''
            })
            : null
        ])
      ]),
      helpText.value
        ? h('span', {
          id: descriptionId.value,
          class: ['vs-number-field__description', isInvalid.value ? 'is-invalid' : null]
        }, helpText.value)
        : null
    ]);
  }
});

function readInputValue(event: Event): string {
  let target = event.currentTarget as HTMLInputElement | null;
  return target?.value ?? '';
}

export const VueNumberField = NumberField;
export type {SpectrumNumberFieldProps} from '@vue-types/numberfield';
