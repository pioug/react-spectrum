import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import '@adobe/spectrum-css-temp/components/helptext/vars.css';
import '@adobe/spectrum-css-temp/components/stepper/vars.css';
import '@adobe/spectrum-css-temp/components/textfield/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref, watch} from 'vue';
import {getEventTarget} from '@vue-aria/utils';
import './styles.css';

const fieldStyles: {[key: string]: string} = {};
const helpTextStyles: {[key: string]: string} = {};
const stepperStyles: {[key: string]: string} = {};
const textfieldStyles: {[key: string]: string} = {};

type LabelAlign = 'end' | 'start';
type LabelPosition = 'side' | 'top';
type NecessityIndicator = 'icon' | 'label';
type ValidationState = 'invalid' | 'valid';

const ALERT_PATH = 'M8.564 1.289L.2 16.256A.5.5 0 0 0 .636 17h16.728a.5.5 0 0 0 .436-.744L9.436 1.289a.5.5 0 0 0-.872 0zM10 14.75a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25zm0-3a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-6a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25z';
const CHECKMARK_PATH = 'M4.5 10a1.022 1.022 0 0 1-.799-.384l-2.488-3a1 1 0 0 1 1.576-1.233L4.5 7.376l4.712-5.991a1 1 0 1 1 1.576 1.23l-5.51 7A.978.978 0 0 1 4.5 10z';

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

function resolveBoolean(primary: boolean | undefined, fallback: boolean) {
  if (primary !== undefined) {
    return primary;
  }

  return fallback;
}

function resolveIsInvalid(props: {
  invalid?: boolean,
  isInvalid?: boolean,
  validationState?: ValidationState | undefined
}, isDisabled: boolean) {
  let invalid = Boolean(props.invalid || props.isInvalid || props.validationState === 'invalid');
  return invalid && !isDisabled;
}

function readInputValue(event: Event): string {
  let target = event.currentTarget as HTMLInputElement | null;
  return target?.value ?? '';
}

function renderValidationIcon(className: string, path: string, attrs: Record<string, unknown> = {}) {
  return h('svg', {
    class: className,
    focusable: 'false',
    'aria-hidden': 'true',
    role: 'img',
    viewBox: '0 0 18 18',
    ...attrs
  }, [
    h('path', {d: path})
  ]);
}

export const NumberField = defineComponent({
  name: 'VueNumberField',
  inheritAttrs: false,
  props: {
    autoFocus: {
      type: Boolean,
      default: false
    },
    contextualHelp: {
      type: null as unknown as PropType<unknown>,
      default: undefined
    },
    defaultValue: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    decrementAriaLabel: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    description: {
      type: [String, Number, Object, Function, Array] as PropType<unknown>,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: [String, Number, Object, Function, Array] as PropType<unknown>,
      default: ''
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
    incrementAriaLabel: {
      type: String as PropType<string | undefined>,
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
      type: [String, Number, Object, Function, Array] as PropType<unknown>,
      default: ''
    },
    labelAlign: {
      type: String as PropType<LabelAlign>,
      default: 'start'
    },
    labelPosition: {
      type: String as PropType<LabelPosition>,
      default: 'top'
    },
    max: {
      type: Number,
      default: undefined
    },
    maxValue: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    min: {
      type: Number,
      default: undefined
    },
    minValue: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    modelValue: {
      type: Number as PropType<number | null | undefined>,
      default: undefined
    },
    name: {
      type: String,
      default: undefined
    },
    necessityIndicator: {
      type: String as PropType<NecessityIndicator | undefined>,
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
    },
    value: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    width: {
      type: [String, Number] as PropType<string | number | undefined>,
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
    let inputRef = ref<HTMLInputElement | null>(null);
    let uncontrolledValue = ref<number | null>(props.defaultValue ?? null);

    watch(() => [props.value, props.modelValue], ([value, modelValue]) => {
      if (typeof value === 'number' && Number.isFinite(value)) {
        uncontrolledValue.value = value;
        return;
      }

      if (typeof modelValue === 'number' && Number.isFinite(modelValue)) {
        uncontrolledValue.value = modelValue;
        return;
      }

      if (modelValue === null) {
        uncontrolledValue.value = null;
      }
    }, {immediate: true});

    let isHovered = ref(false);
    let inputHovered = ref(false);
    let isFocused = ref(false);
    let isFocusVisible = ref(false);
    let upHovered = ref(false);
    let downHovered = ref(false);
    let upPressed = ref(false);
    let downPressed = ref(false);
    let upFocusVisible = ref(false);
    let downFocusVisible = ref(false);
    let pointerFocusIntent = false;

    let isDisabled = computed(() => resolveBoolean(props.isDisabled, props.disabled));
    let isReadOnly = computed(() => resolveBoolean(props.isReadOnly, props.readOnly));
    let isRequired = computed(() => resolveBoolean(props.isRequired, props.required));
    let isInvalid = computed(() => resolveIsInvalid(props, isDisabled.value));
    let isValid = computed(() => props.validationState === 'valid' && !isDisabled.value);
    let minValue = computed(() => props.minValue ?? props.min);
    let maxValue = computed(() => props.maxValue ?? props.max);
    let showStepper = computed(() => !props.hideStepper);

    let currentValue = computed(() => {
      if (typeof props.value === 'number' && Number.isFinite(props.value)) {
        return props.value;
      }

      if (typeof props.modelValue === 'number' && Number.isFinite(props.modelValue)) {
        return props.modelValue;
      }

      return uncontrolledValue.value;
    });

    let canStep = computed(() => !isDisabled.value && !isReadOnly.value);
    let necessityIndicator = computed<NecessityIndicator | undefined>(() => {
      if (props.necessityIndicator) {
        return props.necessityIndicator;
      }

      return isRequired.value ? 'icon' : undefined;
    });

    let labelId = computed(() => props.label ? `${inputId.value}-label` : undefined);
    let validIconId = computed(() => isValid.value ? `${inputId.value}-valid` : undefined);
    let helpText = computed(() => {
      if (isInvalid.value && props.errorMessage) {
        return props.errorMessage;
      }

      return props.description;
    });
    let helpTextId = computed(() => {
      if (!helpText.value) {
        return undefined;
      }

      return `${inputId.value}-${isInvalid.value ? 'error' : 'description'}`;
    });
    let describedBy = computed(() => {
      let ids: string[] = [];
      if (helpTextId.value) {
        ids.push(helpTextId.value);
      }
      if (validIconId.value) {
        ids.push(validIconId.value);
      }
      return ids.length > 0 ? ids.join(' ') : undefined;
    });

    let rootClassName = computed(() => classNames(
      fieldStyles,
      'spectrum-Field',
      {
        'spectrum-Field--positionTop': props.labelPosition !== 'side',
        'spectrum-Field--positionSide': props.labelPosition === 'side',
        'spectrum-Field--alignEnd': props.labelAlign === 'end',
        'spectrum-Field--hasContextualHelp': !!props.contextualHelp
      }
    ));

    let labelClassName = computed(() => classNames(
      fieldStyles,
      'spectrum-FieldLabel',
      {
        'spectrum-FieldLabel--positionSide': props.labelPosition === 'side',
        'spectrum-FieldLabel--alignEnd': props.labelAlign === 'end'
      }
    ));

    let stepperContainerClassName = computed(() => classNames(
      stepperStyles,
      'spectrum-Stepper-container'
    ));

    let groupClassName = computed(() => classNames(
      stepperStyles,
      'spectrum-Stepper',
      'spectrum-FocusRing',
      'spectrum-FocusRing-ring',
      fieldStyles,
      'spectrum-Field-field',
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

    let stepperFieldClassName = computed(() => classNames(
      fieldStyles,
      'spectrum-Field',
      'spectrum-Field--positionTop',
      stepperStyles,
      'spectrum-Stepper-field',
      textfieldStyles,
      'spectrum-Textfield-wrapper',
      {
        'spectrum-Textfield-wrapper--quiet': props.isQuiet
      }
    ));

    let textfieldClassName = computed(() => classNames(
      textfieldStyles,
      'spectrum-Textfield',
      'spectrum-FocusRing',
      'spectrum-FocusRing-ring',
      fieldStyles,
      'spectrum-Field-field',
      {
        'spectrum-Textfield--invalid': isInvalid.value,
        'spectrum-Textfield--valid': isValid.value,
        'spectrum-Textfield--quiet': props.isQuiet
      }
    ));

    let inputClassName = computed(() => classNames(
      textfieldStyles,
      'spectrum-Textfield-input',
      'i18nFontFamily',
      stepperStyles,
      'spectrum-Stepper-input',
      {
        'is-disabled': isDisabled.value,
        'is-hovered': inputHovered.value && !isDisabled.value
      }
    ));

    let upButtonClassName = computed(() => classNames(
      stepperStyles,
      'spectrum-Stepper-button',
      'spectrum-BaseButton',
      'i18nFontFamily',
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
      'spectrum-BaseButton',
      'i18nFontFamily',
      'spectrum-Stepper-button--stepDown',
      {
        'spectrum-Stepper-button--isQuiet': props.isQuiet,
        'is-hovered': downHovered.value && canStep.value,
        'is-active': downPressed.value && canStep.value,
        'is-disabled': !canStep.value,
        'focus-ring': downFocusVisible.value
      }
    ));

    let passthroughRootAttrs = computed(() => {
      let next: Record<string, unknown> = {};
      for (let [key, value] of Object.entries(attrs)) {
        if (
          key === 'aria-label' ||
          key === 'aria-labelledby' ||
          key === 'autofocus' ||
          key === 'class' ||
          key === 'name' ||
          key === 'style' ||
          key === 'tabindex'
        ) {
          continue;
        }

        next[key] = value;
      }
      return next;
    });

    let ariaLabel = computed(() => {
      let value = attrs['aria-label'];
      if (typeof value === 'string' && value.length > 0) {
        return value;
      }

      return undefined;
    });

    let ariaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      if (typeof value === 'string' && value.length > 0) {
        return value;
      }

      return labelId.value;
    });

    let emitValue = (value: number | null) => {
      if (props.value === undefined && props.modelValue === undefined) {
        uncontrolledValue.value = value;
      }

      emit('update:modelValue', value);
      emit('change', value);
    };

    let stepBy = (delta: number) => {
      if (!canStep.value) {
        return;
      }

      let base = currentValue.value ?? 0;
      let next = clampValue(base + delta, minValue.value, maxValue.value);
      emitValue(next);
    };

    let evaluateFocusVisible = (event: FocusEvent): boolean => {
      let target = getEventTarget(event);
      if (target instanceof HTMLElement && target.matches(':focus-visible')) {
        return true;
      }

      return false;
    };

    let fieldLabel = computed(() => {
      if (typeof props.label === 'string' && props.label.length > 0) {
        return props.label;
      }

      if (typeof props.label === 'number') {
        return String(props.label);
      }

      let attrLabel = attrs['aria-label'];
      if (typeof attrLabel === 'string' && attrLabel.length > 0) {
        return attrLabel;
      }

      return 'Value';
    });

    let incrementAriaLabel = computed(() => props.incrementAriaLabel ?? `Increase ${fieldLabel.value}`);
    let decrementAriaLabel = computed(() => props.decrementAriaLabel ?? `Decrease ${fieldLabel.value}`);

    let focusInput = () => {
      if (!inputRef.value) {
        return;
      }

      inputRef.value.focus();
    };

    return () => h('div', {
      ...passthroughRootAttrs.value,
      class: [rootClassName.value, stepperContainerClassName.value, attrs.class],
      style: [{width: props.width}, attrs.style]
    }, [
      props.label
        ? h('label', {
          id: labelId.value,
          class: labelClassName.value,
          for: inputId.value
        }, [
          props.label,
          (necessityIndicator.value === 'label' || necessityIndicator.value === 'icon') && isRequired.value ? ' \u200b' : null,
          necessityIndicator.value === 'label' && isRequired.value
            ? h('span', {'aria-hidden': 'true'}, '(required)')
            : null,
          necessityIndicator.value === 'icon' && isRequired.value
            ? h('span', {
              class: classNames(fieldStyles, 'spectrum-FieldLabel-requiredIcon'),
              'aria-hidden': 'true'
            }, '*')
            : null
        ])
        : null,
      props.label && props.contextualHelp
        ? h('span', {
          class: classNames(fieldStyles, 'spectrum-Field-contextualHelp')
        }, props.contextualHelp as never)
        : null,
      h('div', {
        class: groupClassName.value,
        role: 'group',
        'aria-invalid': isInvalid.value ? 'true' : undefined,
        onMouseenter: () => {
          if (isDisabled.value) {
            return;
          }

          isHovered.value = true;
        },
        onMouseleave: () => {
          isHovered.value = false;
          inputHovered.value = false;
          upHovered.value = false;
          downHovered.value = false;
          upPressed.value = false;
          downPressed.value = false;
        }
      }, [
        h('div', {class: stepperFieldClassName.value}, [
          h('div', {class: textfieldClassName.value}, [
            h('input', {
              id: inputId.value,
              ref: inputRef,
              class: inputClassName.value,
              type: 'text',
              value: currentValue.value ?? '',
              autocomplete: 'off',
              inputmode: 'numeric',
              autocorrect: 'off',
              spellcheck: 'false',
              tabindex: isDisabled.value ? undefined : attrs.tabindex ?? 0,
              placeholder: props.placeholder || undefined,
              disabled: isDisabled.value || undefined,
              readonly: isReadOnly.value || undefined,
              required: isRequired.value || undefined,
              autofocus: props.autoFocus || attrs.autofocus || undefined,
              'aria-label': ariaLabel.value,
              'aria-labelledby': ariaLabel.value ? undefined : ariaLabelledBy.value,
              'aria-describedby': describedBy.value,
              'aria-invalid': isInvalid.value ? 'true' : undefined,
              'aria-roledescription': 'Number field',
              onMouseenter: () => {
                if (!isDisabled.value) {
                  inputHovered.value = true;
                }
              },
              onMouseleave: () => {
                inputHovered.value = false;
              },
              onInput: (event: Event) => {
                let nextValue = parseInputValue(readInputValue(event));
                emitValue(nextValue);
              },
              onFocus: (event: FocusEvent) => {
                isFocused.value = true;
                isFocusVisible.value = pointerFocusIntent ? false : evaluateFocusVisible(event);
                pointerFocusIntent = false;
                emit('focus', event);
              },
              onBlur: (event: FocusEvent) => {
                isFocused.value = false;
                isFocusVisible.value = false;
                pointerFocusIntent = false;
                emit('blur', event);
              }
            }),
            isInvalid.value
              ? renderValidationIcon(
                classNames(
                  textfieldStyles,
                  'spectrum-Icon',
                  'spectrum-UIIcon-AlertMedium',
                  'spectrum-Textfield-validationIcon',
                  stepperStyles,
                  'spectrum-Stepper-icon'
                ),
                ALERT_PATH
              )
              : null,
            isValid.value
              ? renderValidationIcon(
                classNames(
                  textfieldStyles,
                  'spectrum-Icon',
                  'spectrum-UIIcon-CheckmarkMedium',
                  'spectrum-Textfield-validationIcon',
                  stepperStyles,
                  'spectrum-Stepper-icon'
                ),
                CHECKMARK_PATH,
                {
                  id: validIconId.value,
                  'aria-label': 'Valid'
                }
              )
              : null
          ])
        ]),
        showStepper.value
          ? h('div', {
            class: upButtonClassName.value,
            role: 'button',
            tabindex: -1,
            'data-react-aria-pressable': 'true',
            'aria-controls': inputId.value,
            'aria-label': incrementAriaLabel.value,
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
            onMousedown: (event: MouseEvent) => {
              if (!canStep.value) {
                return;
              }

              event.preventDefault();
              pointerFocusIntent = true;
              focusInput();
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
            onKeydown: (event: KeyboardEvent) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                stepBy(props.step);
              }
            },
            onClick: () => stepBy(props.step)
          }, [
            h('svg', {
              class: classNames(
                stepperStyles,
                'spectrum-Icon',
                'spectrum-UIIcon-ChevronUpSmall',
                'spectrum-Stepper-button-icon',
                'spectrum-Stepper-stepUpIcon'
              ),
              focusable: 'false',
              'aria-hidden': 'true',
              role: 'img',
              viewBox: '0 0 8 6'
            }, [
              h('path', {
                d: 'M4 .5a.747.747 0 0 0-.53.22C2.862 1.297 1.5 2.758.23 3.96a.75.75 0 1 0 1.06 1.06L4 2.31l2.71 2.71a.75.75 0 1 0 1.06-1.06L4.53.72A.747.747 0 0 0 4 .5z'
              })
            ])
          ])
          : null,
        showStepper.value
          ? h('div', {
            class: downButtonClassName.value,
            role: 'button',
            tabindex: -1,
            'data-react-aria-pressable': 'true',
            'aria-controls': inputId.value,
            'aria-label': decrementAriaLabel.value,
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
            onMousedown: (event: MouseEvent) => {
              if (!canStep.value) {
                return;
              }

              event.preventDefault();
              pointerFocusIntent = true;
              focusInput();
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
            onKeydown: (event: KeyboardEvent) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                stepBy(-props.step);
              }
            },
            onClick: () => stepBy(-props.step)
          }, [
            h('svg', {
              class: classNames(
                stepperStyles,
                'spectrum-Icon',
                'spectrum-UIIcon-ChevronDownSmall',
                'spectrum-Stepper-button-icon',
                'spectrum-Stepper-stepDownIcon'
              ),
              focusable: 'false',
              'aria-hidden': 'true',
              role: 'img',
              viewBox: '0 0 8 6'
            }, [
              h('path', {
                d: 'M4 5.5a.747.747 0 0 1-.53-.22C2.862 4.703 1.5 3.242.23 2.04A.75.75 0 1 1 1.29.98L4 3.69 6.71.98a.75.75 0 1 1 1.06 1.06L4.53 5.28A.747.747 0 0 1 4 5.5z'
              })
            ])
          ])
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
      ]),
      helpText.value
        ? h('div', {
          class: classNames(
            helpTextStyles,
            'spectrum-HelpText',
            `spectrum-HelpText--${isInvalid.value ? 'negative' : 'neutral'}`,
            {'is-disabled': isDisabled.value}
          )
        }, [
          h('div', {
            id: helpTextId.value,
            class: classNames(helpTextStyles, 'spectrum-HelpText-text')
          }, helpText.value as never)
        ])
        : null
    ]);
  }
});

export const VueNumberField = NumberField;
export type {SpectrumNumberFieldProps} from '@vue-types/numberfield';
