import '@adobe/spectrum-css-temp/components/button/vars.css';
import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import '@adobe/spectrum-css-temp/components/inputgroup/vars.css';
import '@adobe/spectrum-css-temp/components/search/vars.css';
import '@adobe/spectrum-css-temp/components/textfield/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
import './combobox.css';
import {getEventTarget} from '@vue-aria/utils';
const buttonStyles: {[key: string]: string} = {};
const fieldLabelStyles: {[key: string]: string} = {};
const inputGroupStyles: {[key: string]: string} = {};
const textfieldStyles: {[key: string]: string} = {};


type PickerOptionInput = string;
type FormValue = 'text' | 'key';
type ValidationState = 'invalid' | 'valid';

let comboboxId = 0;

export const ComboBox = defineComponent({
  name: 'VueComboBox',
  inheritAttrs: false,
  props: {
    autoFocus: {
      type: Boolean,
      default: false
    },
    allowsCustomValue: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    form: {
      type: String,
      default: undefined
    },
    formValue: {
      type: String as PropType<FormValue>,
      default: 'text'
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
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: undefined
    },
    options: {
      type: Array as PropType<PickerOptionInput[]>,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    selectedKey: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined
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
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {attrs, emit}) {
    let generatedId = `vs-combobox-${++comboboxId}`;
    let isExpanded = ref(false);
    let isFocused = ref(false);
    let isFocusVisible = ref(false);
    let isHovered = ref(false);
    let isPressed = ref(false);

    let inputId = computed(() => props.id ?? generatedId);
    let labelId = computed(() => props.label ? `${inputId.value}-label` : undefined);
    let listId = computed(() => `${inputId.value}-list`);
    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let isInvalid = computed(() => (props.isInvalid || props.invalid || props.validationState === 'invalid') && !isDisabled.value);
    let isValid = computed(() => props.validationState === 'valid' && !isDisabled.value);
    let isPlaceholder = computed(() => props.modelValue === '');
    let resolvedFormValue = computed<FormValue>(() => props.allowsCustomValue ? 'text' : props.formValue);
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

    let controlClassName = computed(() => classNames(
      inputGroupStyles,
      'spectrum-InputGroup',
      {
        'spectrum-InputGroup--quiet': props.isQuiet,
        'spectrum-InputGroup--invalid': isInvalid.value,
        'is-disabled': isDisabled.value,
        'is-focused': isFocused.value,
        'is-hovered': isHovered.value && !isDisabled.value,
        'focus-ring': isFocusVisible.value
      },
      'mobile-combobox'
    ));

    let inputWrapperClassName = computed(() => classNames(
      textfieldStyles,
      'spectrum-Textfield',
      {
        'spectrum-Textfield--invalid': isInvalid.value,
        'spectrum-Textfield--valid': isValid.value,
        'spectrum-Textfield--quiet': props.isQuiet
      },
      classNames(inputGroupStyles, 'spectrum-InputGroup-field')
    ));

    let inputClassName = computed(() => classNames(
      textfieldStyles,
      'spectrum-Textfield-input',
      {
        'is-disabled': isDisabled.value,
        'is-hovered': isHovered.value && !isDisabled.value,
        'is-placeholder': isPlaceholder.value
      },
      classNames(inputGroupStyles, 'spectrum-InputGroup-input')
    ));

    let triggerClassName = computed(() => classNames(
      buttonStyles,
      'spectrum-FieldButton',
      {
        'spectrum-FieldButton--quiet': props.isQuiet,
        'spectrum-FieldButton--invalid': isInvalid.value,
        'is-active': isPressed.value || isExpanded.value,
        'is-disabled': isDisabled.value,
        'is-hovered': isHovered.value && !isDisabled.value
      },
      classNames(inputGroupStyles, 'spectrum-FieldButton')
    ));

    let filteredOptions = computed(() => {
      let query = props.modelValue.trim().toLowerCase();
      if (!query) {
        return props.options;
      }

      return props.options.filter((option) => option.toLowerCase().includes(query));
    });

    let noResultsHidden = computed(() => !isExpanded.value || filteredOptions.value.length > 0);

    let emitValue = (value: string) => {
      emit('update:modelValue', value);
      emit('change', value);
    };

    let openMenu = () => {
      if (isExpanded.value || isDisabled.value || props.isReadOnly) {
        return;
      }

      isExpanded.value = true;
      emit('open');
    };

    let closeMenu = () => {
      if (!isExpanded.value) {
        return;
      }

      isExpanded.value = false;
      emit('close');
    };

    let selectOption = (option: string) => {
      emitValue(option);
      closeMenu();
    };

    return () => h('label', {
      ...attrs,
      class: ['vs-combobox', attrs.class],
      'data-vac': ''
    }, [
      props.label
        ? h('span', {
          id: labelId.value,
          class: [classNames(fieldLabelStyles, 'spectrum-FieldLabel'), 'vs-combobox__label']
        }, props.label)
        : null,
      h('div', {
        class: [controlClassName.value, 'vs-combobox__control'],
        onMouseenter: () => {
          if (isDisabled.value) {
            return;
          }

          isHovered.value = true;
        },
        onMouseleave: () => {
          isHovered.value = false;
          isPressed.value = false;
        }
      }, [
        h('div', {
          class: [inputWrapperClassName.value, 'vs-combobox__field']
        }, [
          h('input', {
            id: inputId.value,
            class: [inputClassName.value, 'vs-combobox__input'],
            type: 'text',
            value: props.modelValue,
            placeholder: props.placeholder || undefined,
            disabled: isDisabled.value,
            readonly: props.isReadOnly || undefined,
            name: resolvedFormValue.value === 'text' ? props.name : undefined,
            form: props.form || undefined,
            role: 'combobox',
            'aria-haspopup': 'listbox',
            'aria-controls': listId.value,
            'aria-expanded': isExpanded.value ? 'true' : 'false',
            'aria-invalid': isInvalid.value ? 'true' : undefined,
            'aria-label': ariaLabel.value,
            'aria-labelledby': ariaLabelledBy.value,
            autofocus: props.autoFocus || attrs.autofocus || undefined,
            onInput: (event: Event) => {
              let target = event.currentTarget as HTMLInputElement | null;
              emitValue(target?.value ?? '');
              openMenu();
            },
            onFocus: (event: FocusEvent) => {
              isFocused.value = true;
              let target = getEventTarget(event);
              if (target instanceof HTMLElement && target.matches(':focus-visible')) {
                isFocusVisible.value = true;
              } else {
                isFocusVisible.value = true;
              }
              emit('focus', event);
            },
            onBlur: (event: FocusEvent) => {
              isFocused.value = false;
              isFocusVisible.value = false;
              closeMenu();
              emit('blur', event);
            },
            onKeydown: (event: KeyboardEvent) => {
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                openMenu();
              } else if (event.key === 'Escape') {
                closeMenu();
              }
            }
          }),
          isInvalid.value
            ? h('span', {
              class: classNames(textfieldStyles, 'spectrum-Textfield-validationIcon'),
              'aria-hidden': 'true'
            }, '!')
            : null
        ]),
        h('button', {
          class: [triggerClassName.value, 'vs-combobox__button'],
          type: 'button',
          disabled: isDisabled.value,
          'aria-haspopup': 'listbox',
          'aria-controls': listId.value,
          'aria-label': ariaLabel.value,
          'aria-labelledby': ariaLabelledBy.value,
          'aria-expanded': isExpanded.value ? 'true' : 'false',
          onMousedown: () => {
            if (isDisabled.value || props.isReadOnly) {
              return;
            }

            isPressed.value = true;
          },
          onMouseup: () => {
            isPressed.value = false;
          },
          onMouseleave: () => {
            isPressed.value = false;
          },
          onClick: () => {
            if (isDisabled.value || props.isReadOnly) {
              return;
            }

            if (isExpanded.value) {
              closeMenu();
            } else {
              openMenu();
            }
          }
        }, [
          h('span', {
            class: classNames(inputGroupStyles, 'spectrum-Dropdown-chevron'),
            'aria-hidden': 'true'
          }, '\u25bc')
        ]),
        isExpanded.value
          ? h('div', {
            id: listId.value,
            role: 'listbox',
            class: ['vs-combobox__listbox', 'react-aria-ListBox']
          }, filteredOptions.value.map((option) => h('div', {
            key: option,
            role: 'option',
            class: ['vs-combobox__option', 'react-aria-ListBoxItem'],
            onMousedown: (event: MouseEvent) => {
              event.preventDefault();
              selectOption(option);
            }
          }, option)))
          : null
      ]),
      props.name && resolvedFormValue.value === 'key'
        ? h('input', {
          type: 'hidden',
          hidden: true,
          name: props.name,
          form: props.form || undefined,
          value: props.selectedKey ?? ''
        })
        : null,
      h('span', {
        class: ['no-results', 'vs-combobox__empty'],
        hidden: noResultsHidden.value,
        'aria-hidden': noResultsHidden.value ? 'true' : 'false'
      }, 'No results')
    ]);
  }
});

export const VueComboBox = ComboBox;

export {Item, Section} from '@vue-stately/collections';
export type {SpectrumComboBoxProps} from '@vue-types/combobox';
