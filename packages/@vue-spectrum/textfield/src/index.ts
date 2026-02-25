import '@adobe/spectrum-css-temp/components/textfield/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref, watch} from 'vue';
import {getEventTarget} from '@vue-aria/utils';
import type {SpectrumTextAreaProps, SpectrumTextFieldProps} from '@vue-types/textfield';
const styles: {[key: string]: string} = {};


type ValidationState = 'invalid' | 'valid';
type FieldKind = 'input' | 'textarea';

let inputIdCounter = 0;
let textAreaIdCounter = 0;

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

function resolveIsRequired(props: {required?: boolean, isRequired?: boolean | undefined}) {
  if (props.isRequired !== undefined) {
    return props.isRequired;
  }

  return Boolean(props.required);
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
      description: {
        type: String,
        default: ''
      },
      defaultValue: {
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
      contextualHelp: {
        type: String,
        default: ''
      },
      modelValue: {
        type: String as PropType<string | undefined>,
        default: undefined
      },
      value: {
        type: String as PropType<string | undefined>,
        default: undefined
      },
      placeholder: {
        type: String,
        default: ''
      },
      pattern: {
        type: String as PropType<string | undefined>,
        default: undefined
      },
      required: {
        type: Boolean,
        default: false
      },
      rows: {
        type: Number,
        default: 3
      },
      validationState: {
        type: String as PropType<ValidationState | undefined>,
        default: undefined
      },
      type: {
        type: String,
        default: 'text'
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

      let isHovered = ref(false);
      let isFocusVisible = ref(false);

      let isDisabled = computed(() => resolveIsDisabled(props));
      let isInvalid = computed(() => resolveIsInvalid(props, isDisabled.value));
      let isRequired = computed(() => resolveIsRequired(props));
      let isValid = computed(() => !isInvalid.value && props.validationState === 'valid');

      let uncontrolledValue = ref(props.defaultValue);
      let currentValue = computed(() => props.value ?? props.modelValue ?? uncontrolledValue.value);

      watch(() => [props.modelValue, props.value], ([modelValue, value]) => {
        if (typeof value === 'string') {
          uncontrolledValue.value = value;
          return;
        }

        if (typeof modelValue === 'string') {
          uncontrolledValue.value = modelValue;
        }
      }, {immediate: true});

      let descriptionId = computed(() => props.description ? `${inputId.value}-description` : undefined);
      let errorMessageId = computed(() => props.errorMessage ? `${inputId.value}-error` : undefined);
      let describedBy = computed(() => {
        if (isInvalid.value && props.errorMessage) {
          return errorMessageId.value;
        }

        return descriptionId.value;
      });

      let wrapperClassName = computed(() => classNames(
        styles,
        'spectrum-Textfield-wrapper',
        {
          'spectrum-Textfield-wrapper--quiet': props.isQuiet
        }
      ));

      let containerClassName = computed(() => classNames(
        styles,
        'spectrum-Textfield',
        {
            'spectrum-Textfield--invalid': isInvalid.value,
            'is-valid': isValid.value,
            'spectrum-Textfield--quiet': props.isQuiet,
            'spectrum-Textfield--multiline': kind === 'textarea',
            'focus-ring': isFocusVisible.value
        }
      ));

      let inputClassName = computed(() => classNames(
        styles,
        'spectrum-Textfield-input',
        {
          'is-hovered': isHovered.value,
          'vs-text-field__input--multiline': kind === 'textarea'
        }
      ));

      let ariaLabel = computed(() => {
        let fromAttrs = attrs['aria-label'];
        if (typeof fromAttrs === 'string' && fromAttrs.length > 0) {
          return fromAttrs;
        }

        return props.label || undefined;
      });

      let onInput = (event: Event) => {
        let target = event.currentTarget as HTMLInputElement | HTMLTextAreaElement | null;
        let value = target?.value ?? '';
        uncontrolledValue.value = value;
        emit('update:modelValue', value);
        emit('change', value);
      };

      return () => {
        let inputTag = kind === 'textarea' ? 'textarea' : 'input';

        let inputNode = h(inputTag, {
          id: inputId.value,
          class: [inputClassName.value, 'vs-text-field__input'],
          value: currentValue.value,
          type: kind === 'textarea' ? undefined : props.type,
          pattern: kind === 'textarea' ? undefined : props.pattern,
          placeholder: props.placeholder || undefined,
          disabled: isDisabled.value,
          required: isRequired.value || undefined,
          readonly: props.isReadOnly || undefined,
          rows: kind === 'textarea' ? props.rows : undefined,
          'aria-invalid': isInvalid.value ? 'true' : undefined,
          'aria-describedby': describedBy.value,
          'aria-label': ariaLabel.value,
          autofocus: props.autoFocus || attrs.autofocus || undefined,
          onInput,
          onFocus: (event: FocusEvent) => {
            let target = getEventTarget(event);
            if (target instanceof HTMLElement && target.matches(':focus-visible')) {
              isFocusVisible.value = true;
            } else {
              isFocusVisible.value = true;
            }

            emit('focus', event);
          },
          onBlur: (event: FocusEvent) => {
            isFocusVisible.value = false;
            emit('blur', event);
          },
          onMouseenter: () => {
            if (isDisabled.value) {
              return;
            }

            isHovered.value = true;
          },
          onMouseleave: () => {
            isHovered.value = false;
          }
        });

        return h('label', {
          ...attrs,
          class: [wrapperClassName.value, 'vs-text-field', attrs.class],
          style: {
            ...((attrs.style as Record<string, unknown>) ?? {}),
            width: props.width ?? (attrs.style as Record<string, unknown> | undefined)?.width
          },
          'data-vac': ''
        }, [
          props.label || props.contextualHelp
            ? h('div', {class: 'vs-text-field__label-row'}, [
              props.label ? h('span', {class: 'vs-text-field__label'}, props.label) : null,
              props.contextualHelp
                ? h('span', {class: 'vs-text-field__contextual-help'}, props.contextualHelp)
                : null
            ])
            : null,
          h('div', {
            class: [containerClassName.value, 'vs-text-field__container']
          }, [
            props.icon
              ? h('span', {
                class: 'vs-text-field__icon',
                'aria-hidden': 'true'
              }, typeof props.icon === 'string' ? props.icon : [props.icon as never])
              : null,
            inputNode,
            isInvalid.value
              ? h('span', {
                class: classNames(styles, 'spectrum-Textfield-validationIcon'),
                'aria-hidden': 'true'
              }, '!')
              : isValid.value
                ? h('span', {
                  class: classNames(styles, 'spectrum-Textfield-validationIcon'),
                  'aria-hidden': 'true'
                }, '\u2713')
              : null
          ]),
          isInvalid.value && props.errorMessage
            ? h('span', {
              id: errorMessageId.value,
              class: 'vs-text-field__error'
            }, props.errorMessage)
            : props.description
            ? h('span', {
              id: descriptionId.value,
              class: 'vs-text-field__description'
            }, props.description)
            : null
        ]);
      };
    }
  });
}

export const TextField = buildField('input', () => `vs-text-field-${++inputIdCounter}`);
export const TextFieldBase = TextField;
export const VueTextField = TextField;

export const TextArea = buildField('textarea', () => `vs-text-area-${++textAreaIdCounter}`);

export type {SpectrumTextAreaProps, SpectrumTextFieldProps};
