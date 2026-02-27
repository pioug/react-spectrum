import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import '@adobe/spectrum-css-temp/components/helptext/vars.css';
import '@adobe/spectrum-css-temp/components/textfield/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref, watch} from 'vue';
import {getEventTarget} from '@vue-aria/utils';
import type {SpectrumTextAreaProps, SpectrumTextFieldProps} from '@vue-types/textfield';

const fieldStyles: {[key: string]: string} = {};
const helpTextStyles: {[key: string]: string} = {};
const textfieldStyles: {[key: string]: string} = {};

type FieldKind = 'input' | 'textarea';
type LabelAlign = 'end' | 'start';
type LabelPosition = 'side' | 'top';
type NecessityIndicator = 'icon' | 'label';
type ValidationState = 'invalid' | 'valid';

const ALERT_PATH = 'M8.564 1.289L.2 16.256A.5.5 0 0 0 .636 17h16.728a.5.5 0 0 0 .436-.744L9.436 1.289a.5.5 0 0 0-.872 0zM10 14.75a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25zm0-3a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-6a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25z';
const CHECKMARK_PATH = 'M4.5 10a1.022 1.022 0 0 1-.799-.384l-2.488-3a1 1 0 0 1 1.576-1.233L4.5 7.376l4.712-5.991a1 1 0 1 1 1.576 1.23l-5.51 7A.978.978 0 0 1 4.5 10z';

let inputIdCounter = 0;
let textAreaIdCounter = 0;

function resolveBoolean(primary: boolean | undefined, fallback: boolean) {
  if (primary !== undefined) {
    return primary;
  }

  return fallback;
}

function renderValidationIcon(className: string, path: string, attrs: Record<string, unknown> = {}) {
  return h('svg', {
    class: className,
    focusable: 'false',
    'aria-hidden': 'true',
    role: 'img',
    ...attrs
  }, [
    h('path', {d: path})
  ]);
}

function buildField(
  kind: FieldKind,
  idFactory: () => string
) {
  return defineComponent({
    name: kind === 'input' ? 'VueTextField' : 'VueTextArea',
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
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      errorMessage: {
        type: String,
        default: ''
      },
      id: {
        type: String,
        default: undefined
      },
      icon: {
        type: null as unknown as PropType<unknown>,
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
        type: Boolean,
        default: false
      },
      isRequired: {
        type: Boolean as PropType<boolean | undefined>,
        default: undefined
      },
      label: {
        type: String,
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
      modelValue: {
        type: String as PropType<string | undefined>,
        default: undefined
      },
      necessityIndicator: {
        type: String as PropType<NecessityIndicator | undefined>,
        default: undefined
      },
      pattern: {
        type: String as PropType<string | undefined>,
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
      rows: {
        type: Number,
        default: kind === 'textarea' ? 1 : 3
      },
      type: {
        type: String,
        default: 'text'
      },
      validationState: {
        type: String as PropType<ValidationState | undefined>,
        default: undefined
      },
      value: {
        type: String as PropType<string | undefined>,
        default: undefined
      },
      width: {
        type: [Number, String] as PropType<number | string | undefined>,
        default: undefined
      }
    },
    emits: {
      blur: (event: FocusEvent) => event instanceof FocusEvent,
      change: (value: string) => typeof value === 'string',
      focus: (event: FocusEvent) => event instanceof FocusEvent,
      'update:modelValue': (value: string) => typeof value === 'string'
    },
    setup(props, {attrs, emit}) {
      let generatedId = idFactory();
      let inputId = computed(() => props.id ?? generatedId);
      let inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);

      let isHovered = ref(false);
      let isFocusVisible = ref(false);
      let uncontrolledValue = ref(props.defaultValue);

      watch(() => [props.value, props.modelValue], ([value, modelValue]) => {
        if (typeof value === 'string') {
          uncontrolledValue.value = value;
          return;
        }

        if (typeof modelValue === 'string') {
          uncontrolledValue.value = modelValue;
        }
      }, {immediate: true});

      let isDisabled = computed(() => resolveBoolean(props.isDisabled, props.disabled));
      let isReadOnly = computed(() => props.isReadOnly || props.readOnly);
      let isRequired = computed(() => resolveBoolean(props.isRequired, props.required));
      let necessityIndicator = computed<NecessityIndicator | undefined>(() => {
        if (props.necessityIndicator) {
          return props.necessityIndicator;
        }

        return isRequired.value ? 'icon' : undefined;
      });
      let effectiveValidationState = computed<ValidationState | undefined>(() => {
        if (props.validationState) {
          return props.validationState;
        }

        if (props.isInvalid || props.invalid) {
          return 'invalid';
        }

        return undefined;
      });
      let isInvalid = computed(() => effectiveValidationState.value === 'invalid' && !isDisabled.value);
      let isValid = computed(() => effectiveValidationState.value === 'valid' && !isDisabled.value);
      let currentValue = computed(() => props.value ?? props.modelValue ?? uncontrolledValue.value);

      let labelId = computed(() => props.label ? `${inputId.value}-label` : undefined);
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

        return isInvalid.value ? `${inputId.value}-error` : `${inputId.value}-description`;
      });
      let validIconId = computed(() => isValid.value ? `${inputId.value}-valid` : undefined);
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
        },
        textfieldStyles,
        'spectrum-Textfield-wrapper',
        {
          'spectrum-Textfield-wrapper--quiet': props.isQuiet
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

      let controlClassName = computed(() => classNames(
        textfieldStyles,
        'spectrum-Textfield',
        'spectrum-FocusRing',
        'spectrum-FocusRing-ring',
        fieldStyles,
        'spectrum-Field-field',
        {
          'spectrum-Textfield--invalid': isInvalid.value,
          'spectrum-Textfield--valid': isValid.value,
          'spectrum-Textfield--quiet': props.isQuiet,
          'spectrum-Textfield--multiline': kind === 'textarea',
          'focus-ring': isFocusVisible.value
        }
      ));

      let inputClassName = computed(() => classNames(
        textfieldStyles,
        'spectrum-Textfield-input',
        'i18nFontFamily',
        {
          'spectrum-Textfield-inputIcon': !!props.icon,
          'is-hovered': isHovered.value && !isDisabled.value
        }
      ));

      let iconClassName = computed(() => classNames(
        textfieldStyles,
        'spectrum-Icon',
        'spectrum-Textfield-icon'
      ));

      let passthroughRootAttrs = computed(() => {
        let next: Record<string, unknown> = {};
        for (let [key, value] of Object.entries(attrs)) {
          if (
            key === 'aria-label' ||
            key === 'aria-labelledby' ||
            key === 'autofocus' ||
            key === 'class' ||
            key === 'data-testid' ||
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
        let attrLabel = attrs['aria-label'];
        if (typeof attrLabel === 'string' && attrLabel.length > 0) {
          return attrLabel;
        }

        return undefined;
      });

      let ariaLabelledBy = computed(() => {
        let attrLabelledBy = attrs['aria-labelledby'];
        if (typeof attrLabelledBy === 'string' && attrLabelledBy.length > 0) {
          return attrLabelledBy;
        }

        return labelId.value;
      });

      let setValue = (nextValue: string) => {
        if (props.value === undefined && props.modelValue === undefined) {
          uncontrolledValue.value = nextValue;
        }

        emit('update:modelValue', nextValue);
        emit('change', nextValue);
      };

      return () => {
        let inputNode = h(kind === 'textarea' ? 'textarea' : 'input', {
          ref: inputRef,
          id: inputId.value,
          class: inputClassName.value,
          value: currentValue.value,
          type: kind === 'textarea' ? undefined : props.type,
          rows: kind === 'textarea' ? props.rows : undefined,
          pattern: kind === 'textarea' ? undefined : props.pattern,
          name: typeof attrs.name === 'string' ? attrs.name : undefined,
          tabindex: isDisabled.value ? undefined : attrs.tabindex ?? 0,
          placeholder: props.placeholder || undefined,
          disabled: isDisabled.value || undefined,
          readonly: isReadOnly.value || undefined,
          required: isRequired.value || undefined,
          autofocus: props.autoFocus || attrs.autofocus || undefined,
          'aria-invalid': isInvalid.value ? 'true' : undefined,
          'aria-label': ariaLabel.value,
          'aria-labelledby': ariaLabel.value ? undefined : ariaLabelledBy.value,
          'aria-describedby': describedBy.value,
          'data-testid': typeof attrs['data-testid'] === 'string' ? attrs['data-testid'] : undefined,
          onInput: (event: Event) => {
            let target = event.currentTarget as HTMLInputElement | HTMLTextAreaElement | null;
            setValue(target?.value ?? '');
          },
          onFocus: (event: FocusEvent) => {
            let target = getEventTarget(event);
            isFocusVisible.value = target instanceof HTMLElement ? target.matches(':focus-visible') : false;

            emit('focus', event);
          },
          onBlur: (event: FocusEvent) => {
            isFocusVisible.value = false;
            emit('blur', event);
          },
          onMouseenter: () => {
            if (!isDisabled.value) {
              isHovered.value = true;
            }
          },
          onMouseleave: () => {
            isHovered.value = false;
          }
        });

        let iconNode: unknown = null;
        if (props.icon !== undefined) {
          if (typeof props.icon === 'string') {
            iconNode = h('span', {
              class: iconClassName.value,
              'aria-hidden': 'true'
            }, props.icon);
          } else {
            iconNode = h('span', {
              class: iconClassName.value,
              'aria-hidden': 'true'
            }, [props.icon as never]);
          }
        }

        let validationNode = isInvalid.value
          ? renderValidationIcon(
            classNames(textfieldStyles, 'spectrum-Icon', 'spectrum-UIIcon-AlertMedium', 'spectrum-Textfield-validationIcon'),
            ALERT_PATH
          )
          : isValid.value
            ? renderValidationIcon(
              classNames(textfieldStyles, 'spectrum-Icon', 'spectrum-UIIcon-CheckmarkMedium', 'spectrum-Textfield-validationIcon'),
              CHECKMARK_PATH,
              {
                id: validIconId.value,
                'aria-label': 'Valid'
              }
            )
            : null;

        return h('div', {
          ...passthroughRootAttrs.value,
          class: [rootClassName.value, attrs.class],
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
            }, typeof props.contextualHelp === 'string' ? props.contextualHelp : [props.contextualHelp as never])
            : null,
          h('div', {
            class: controlClassName.value
          }, [
            inputNode,
            iconNode,
            validationNode
          ]),
          helpText.value
            ? h('div', {
              class: classNames(
                helpTextStyles,
                'spectrum-HelpText',
                `spectrum-HelpText--${isInvalid.value ? 'negative' : 'neutral'}`,
                {
                  'is-disabled': isDisabled.value
                }
              ),
              style: {
                gridArea: 'helpText'
              }
            }, [
              h('div', {
                id: helpTextId.value,
                class: classNames(helpTextStyles, 'spectrum-HelpText-text')
              }, helpText.value)
            ])
            : null
        ]);
      };
    }
  });
}

export const TextField = buildField('input', () => `vs-text-field-${++inputIdCounter}`);
export const TextFieldBase = defineComponent({
  name: 'VueTextFieldBase',
  inheritAttrs: false,
  props: TextField.props,
  setup(props, {attrs, slots}) {
    return () => h(TextField, {
      ...attrs,
      ...props
    }, slots);
  }
});
export const VueTextField = TextField;

export const TextArea = buildField('textarea', () => `vs-text-area-${++textAreaIdCounter}`);

export type {SpectrumTextAreaProps, SpectrumTextFieldProps};
