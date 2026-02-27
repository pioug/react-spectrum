import '@adobe/spectrum-css-temp/components/button/vars.css';
import '@adobe/spectrum-css-temp/components/search/vars.css';
import '@adobe/spectrum-css-temp/components/textfield/vars.css';
import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import '@adobe/spectrum-css-temp/components/helptext/vars.css';
import './stateClassOverrides.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref, watch} from 'vue';
import {getEventTarget} from '@vue-aria/utils';
import type {SpectrumSearchFieldProps} from '@vue-types/searchfield';

const buttonStyles: {[key: string]: string} = {};
const fieldStyles: {[key: string]: string} = {};
const helpTextStyles: {[key: string]: string} = {};
const searchStyles: {[key: string]: string} = {};
const textfieldStyles: {[key: string]: string} = {};

type LabelAlign = 'end' | 'start';
type LabelPosition = 'side' | 'top';
type NecessityIndicator = 'icon' | 'label';
type ValidationState = 'invalid' | 'valid';

let searchFieldId = 0;

const MAGNIFIER_PATH = 'M15.77 14.71l-4.534-4.535a6.014 6.014 0 1 0-1.06 1.06l4.533 4.535a.75.75 0 1 0 1.061-1.06zM6.5 11A4.5 4.5 0 1 1 11 6.5 4.505 4.505 0 0 1 6.5 11z';
const REFRESH_PATH_A = 'M32.67383,20H30.78027a1.21547,1.21547,0,0,0-1.16259.93774,11.44726,11.44726,0,0,1-19.11573,5.074l-.69238-.69251,3.95508-3.95495A.78548.78548,0,0,0,14,20.80371.80343.80343,0,0,0,13.24561,20H2.49609A.4996.4996,0,0,0,2,20.49585V31.24573A.80293.80293,0,0,0,2.80371,32a.78433.78433,0,0,0,.56055-.2356l3.61719-3.61706.356.3562a16.17057,16.17057,0,0,0,7.28321,4.33179A15.43018,15.43018,0,0,0,33.66455,21.16968.99566.99566,0,0,0,32.67383,20Z';
const REFRESH_PATH_B = 'M33.19629,4a.78383.78383,0,0,0-.56055.2356L29.01855,7.85266l-.35595-.3562a16.17057,16.17057,0,0,0-7.28321-4.33179A15.43018,15.43018,0,0,0,2.33545,14.83032.99571.99571,0,0,0,3.32617,16H5.21973a1.21558,1.21558,0,0,0,1.16259-.93787A11.44729,11.44729,0,0,1,25.49805,9.98828l.69238.69251-3.95508,3.95483A.78568.78568,0,0,0,22,15.19617.80353.80353,0,0,0,22.75439,16H33.50391A.49976.49976,0,0,0,34,15.50415V4.75427A.80293.80293,0,0,0,33.19629,4Z';
const CLEAR_PATH = 'M7.317 6.433L4.884 4l2.433-2.433a.625.625 0 1 0-.884-.884L4 3.116 1.567.683a.625.625 0 1 0-.884.884L3.116 4 .683 6.433a.625.625 0 1 0 .884.884L4 4.884l2.433 2.433a.625.625 0 0 0 .884-.884z';
const ALERT_PATH = 'M8.564 1.289L.2 16.256A.5.5 0 0 0 .636 17h16.728a.5.5 0 0 0 .436-.744L9.436 1.289a.5.5 0 0 0-.872 0zM10 14.75a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25zm0-3a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-6a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25z';
const CHECKMARK_PATH = 'M4.5 10a1.022 1.022 0 0 1-.799-.384l-2.488-3a1 1 0 0 1 1.576-1.233L4.5 7.376l4.712-5.991a1 1 0 1 1 1.576 1.23l-5.51 7A.978.978 0 0 1 4.5 10z';

function renderIconPath(
  className: string,
  path: string,
  attrs: Record<string, unknown> = {}
) {
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

function resolveBoolean(primary: boolean | undefined, fallback: boolean) {
  if (primary !== undefined) {
    return primary;
  }

  return fallback;
}

export const SearchField = defineComponent({
  name: 'VueSearchField',
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
    icon: {
      type: null as unknown as PropType<unknown>,
      default: undefined
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
    },
    value: {
      type: String as PropType<string | undefined>,
      default: undefined
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: string) => typeof value === 'string',
    clear: () => true,
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    submit: (value: string) => typeof value === 'string',
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {attrs, emit}) {
    let generatedId = `vs-search-field-${++searchFieldId}`;
    let inputRef = ref<HTMLInputElement | null>(null);

    let isHovered = ref(false);
    let isFocusVisible = ref(false);
    let isClearHovered = ref(false);
    let isClearPressed = ref(false);
    let isClearFocusVisible = ref(false);

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

    let inputId = computed(() => props.id ?? generatedId);
    let labelId = computed(() => props.label ? `${inputId.value}-label` : undefined);
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
    let showClearButton = computed(() => currentValue.value !== '' && !isReadOnly.value);
    let canClear = computed(() => showClearButton.value && !isDisabled.value);

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
      searchStyles,
      'spectrum-Search',
      'spectrum-Textfield',
      {
        'is-disabled': isDisabled.value,
        'is-quiet': props.isQuiet,
        'spectrum-Search--invalid': isInvalid.value,
        'spectrum-Search--valid': isValid.value
      },
      textfieldStyles,
      'spectrum-Textfield-wrapper',
      {
        'spectrum-Textfield-wrapper--quiet': props.isQuiet
      }
    ));

    let fieldClassName = computed(() => classNames(
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
        'focus-ring': isFocusVisible.value
      }
    ));

    let hasInputIcon = computed(() => props.icon !== null);
    let inputClassName = computed(() => classNames(
      textfieldStyles,
      'spectrum-Textfield-input',
      'i18nFontFamily',
      {
        'spectrum-Textfield-inputIcon': hasInputIcon.value,
        'is-hovered': isHovered.value && !isDisabled.value
      },
      searchStyles,
      'spectrum-Search-input'
    ));

    let iconClassName = computed(() => classNames(
      searchStyles,
      textfieldStyles,
      'spectrum-Icon',
      'spectrum-Textfield-icon'
    ));

    let labelClassName = computed(() => classNames(
      fieldStyles,
      'spectrum-FieldLabel',
      {
        'spectrum-FieldLabel--positionSide': props.labelPosition === 'side',
        'spectrum-FieldLabel--alignEnd': props.labelAlign === 'end'
      }
    ));

    let clearButtonClassName = computed(() => classNames(
      buttonStyles,
      searchStyles,
      'spectrum-ClearButton',
      'spectrum-BaseButton',
      'i18nFontFamily',
      'spectrum-FocusRing',
      'spectrum-FocusRing-ring',
      {
        'focus-ring': isClearFocusVisible.value,
        'is-active': isClearPressed.value && canClear.value,
        'is-disabled': !canClear.value,
        'is-hovered': isClearHovered.value && canClear.value
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

    let externalAriaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });

    let ariaLabelledBy = computed(() => {
      let parts = [labelId.value, externalAriaLabelledBy.value].filter((part): part is string => Boolean(part));
      return parts.length > 0 ? parts.join(' ') : undefined;
    });

    let ariaLabel = computed(() => {
      if (ariaLabelledBy.value) {
        return undefined;
      }

      let attrLabel = attrs['aria-label'];
      if (typeof attrLabel === 'string' && attrLabel.length > 0) {
        return attrLabel;
      }

      return undefined;
    });

    let setValue = (nextValue: string) => {
      if (props.value === undefined && props.modelValue === undefined) {
        uncontrolledValue.value = nextValue;
      }

      emit('update:modelValue', nextValue);
      emit('change', nextValue);
    };

    let clearValue = () => {
      if (!canClear.value) {
        return;
      }

      setValue('');
      emit('clear');
      inputRef.value?.focus();
    };

    let submitValue = () => {
      if (isDisabled.value || isReadOnly.value) {
        return;
      }

      emit('submit', currentValue.value);
    };

    return () => {
      let iconNode: unknown = null;
      if (props.icon === null) {
        iconNode = null;
      } else if (props.icon === 'refresh') {
        iconNode = h('svg', {
          viewBox: '0 0 36 36',
          class: [iconClassName.value, 'spectrum-Icon--sizeS'],
          focusable: 'false',
          'aria-hidden': 'true',
          role: 'img'
        }, [
          h('path', {'fill-rule': 'evenodd', d: REFRESH_PATH_A}),
          h('path', {'fill-rule': 'evenodd', d: REFRESH_PATH_B})
        ]);
      } else if (props.icon !== undefined) {
        iconNode = props.icon;
      } else {
        iconNode = renderIconPath(
          `${iconClassName.value} spectrum-UIIcon-Magnifier`,
          MAGNIFIER_PATH,
          {'data-testid': 'searchicon'}
        );
      }

      let validationNode = isInvalid.value
        ? renderIconPath(
          classNames(textfieldStyles, 'spectrum-Icon', 'spectrum-UIIcon-AlertMedium', 'spectrum-Textfield-validationIcon'),
          ALERT_PATH
        )
        : isValid.value
          ? h('svg', {
            id: validIconId.value,
            class: classNames(textfieldStyles, 'spectrum-Icon', 'spectrum-UIIcon-CheckmarkMedium', 'spectrum-Textfield-validationIcon'),
            focusable: 'false',
            'aria-label': 'Valid',
            'aria-hidden': 'true',
            role: 'img'
          }, [
            h('path', {d: CHECKMARK_PATH})
          ])
          : null;

      return h('div', {
        ...passthroughRootAttrs.value,
        class: [rootClassName.value, attrs.class],
        style: attrs.style
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
          class: fieldClassName.value
        }, [
          h('input', {
            ref: inputRef,
            id: inputId.value,
            class: inputClassName.value,
            type: 'search',
            value: currentValue.value,
            name: typeof attrs.name === 'string' ? attrs.name : undefined,
            tabindex: isDisabled.value ? undefined : attrs.tabindex ?? 0,
            placeholder: props.placeholder || undefined,
            disabled: isDisabled.value || undefined,
            readonly: isReadOnly.value || undefined,
            required: isRequired.value || undefined,
            autofocus: props.autoFocus || attrs.autofocus || undefined,
            'aria-invalid': isInvalid.value ? 'true' : undefined,
            'aria-label': ariaLabel.value,
            'aria-labelledby': ariaLabelledBy.value,
            'aria-describedby': describedBy.value,
            'data-testid': typeof attrs['data-testid'] === 'string' ? attrs['data-testid'] : undefined,
            onInput: (event: Event) => {
              let target = event.currentTarget as HTMLInputElement | null;
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
            },
            onKeydown: (event: KeyboardEvent) => {
              if (event.key === 'Enter') {
                submitValue();
                return;
              }

              if (event.key !== 'Escape') {
                return;
              }

              if (!canClear.value) {
                return;
              }

              event.preventDefault();
              clearValue();
              inputRef.value?.blur();
            }
          }),
          iconNode,
          validationNode,
          showClearButton.value
            ? h('div', {
              class: clearButtonClassName.value,
              role: 'button',
              'aria-label': 'Clear search',
              'data-react-aria-pressable': 'true',
              onMouseenter: () => {
                if (canClear.value) {
                  isClearHovered.value = true;
                }
              },
              onMouseleave: () => {
                isClearHovered.value = false;
                isClearPressed.value = false;
              },
              onMousedown: (event: MouseEvent) => {
                event.preventDefault();
                if (canClear.value) {
                  isClearPressed.value = true;
                }
              },
              onMouseup: () => {
                isClearPressed.value = false;
              },
              onFocus: (event: FocusEvent) => {
                let target = getEventTarget(event);
                isClearFocusVisible.value = target instanceof HTMLElement ? target.matches(':focus-visible') : false;
              },
              onBlur: () => {
                isClearFocusVisible.value = false;
              },
              onClick: () => {
                clearValue();
              },
              onKeydown: (event: KeyboardEvent) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  clearValue();
                }
              }
            }, [
              renderIconPath(
                classNames(buttonStyles, 'spectrum-Icon', 'spectrum-UIIcon-CrossSmall', 'spectrum-Icon'),
                CLEAR_PATH
              )
            ])
            : null
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

export const VueSearchField = SearchField;
export type {SpectrumSearchFieldProps};
