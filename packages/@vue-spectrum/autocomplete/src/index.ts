import '@adobe/spectrum-css-temp/components/button/vars.css';
import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import '@adobe/spectrum-css-temp/components/inputgroup/vars.css';
import '@adobe/spectrum-css-temp/components/search/vars.css';
import '@adobe/spectrum-css-temp/components/textfield/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref, watch} from 'vue';
import './searchautocomplete.css';
import {getEventTarget} from '@vue-aria/utils';
const buttonStyles: {[key: string]: string} = {};
const fieldStyles: {[key: string]: string} = {};
const inputGroupStyles: {[key: string]: string} = {};
const searchStyles: {[key: string]: string} = {};
const textfieldStyles: {[key: string]: string} = {};


type ValidationState = 'invalid' | 'valid';
type PickerOptionInput = string;
const SEARCH_AUTOCOMPLETE_PLACEHOLDER_WARNING = 'Placeholders are deprecated due to accessibility issues. Please use help text instead.';
const MAGNIFIER_PATH = 'M15.77 14.71l-4.534-4.535a6.014 6.014 0 1 0-1.06 1.06l4.533 4.535a.75.75 0 1 0 1.061-1.06zM6.5 11A4.5 4.5 0 1 1 11 6.5 4.505 4.505 0 0 1 6.5 11z';
const FILTER_PATH = 'M30.946,2H3.054a1,1,0,0,0-.787,1.617L14,18.589V33.9a.992.992,0,0,0,1.68.824l3.981-4.153A1.219,1.219,0,0,0,20,29.728V18.589L31.733,3.617A1,1,0,0,0,30.946,2Z';
const CLEAR_PATH = 'M7.317 6.433L4.884 4l2.433-2.433a.625.625 0 1 0-.884-.884L4 3.116 1.567.683a.625.625 0 1 0-.884.884L3.116 4 .683 6.433a.625.625 0 1 0 .884.884L4 4.884l2.433 2.433a.625.625 0 0 0 .884-.884z';
const ALERT_PATH = 'M8.564 1.289L.2 16.256A.5.5 0 0 0 .636 17h16.728a.5.5 0 0 0 .436-.744L9.436 1.289a.5.5 0 0 0-.872 0zM10 14.75a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25zm0-3a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-6a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25z';

function renderIconPath(
  className: string,
  path: string,
  attrs: Record<string, unknown> = {},
  viewBox?: string
) {
  return h('svg', {
    class: className,
    focusable: 'false',
    'aria-hidden': 'true',
    role: 'img',
    viewBox,
    ...attrs
  }, [
    h('path', {d: path})
  ]);
}

let autocompleteId = 0;

export const SearchAutocomplete = defineComponent({
  name: 'VueSearchAutocomplete',
  inheritAttrs: false,
  props: {
    autoFocus: {
      type: Boolean,
      default: false
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
      type: Boolean,
      default: false
    },
    icon: {
      type: null as unknown as PropType<unknown>,
      default: undefined
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: ''
    },
    options: {
      type: Array as PropType<PickerOptionInput[]>,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    validationState: {
      type: String as PropType<ValidationState | undefined>,
      default: undefined
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: string) => typeof value === 'string',
    clear: () => true,
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    inputChange: (value: string) => typeof value === 'string',
    openChange: (value: boolean) => typeof value === 'boolean',
    selectionChange: (key: string | null) => key == null || typeof key === 'string',
    submit: (value: string, key: string | null) => typeof value === 'string' && (key == null || typeof key === 'string'),
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {attrs, emit}) {
    let generatedId = `vs-search-autocomplete-${++autocompleteId}`;
    let inputRef = ref<HTMLInputElement | null>(null);
    let isHovered = ref(false);
    let isFocused = ref(false);
    let isFocusVisible = ref(false);
    let hasWarnedDeprecatedPlaceholder = ref(false);

    let inputId = computed(() => props.id ?? generatedId);
    let labelId = computed(() => props.label ? `${inputId.value}-label` : undefined);
    let listId = computed(() => `${inputId.value}-list`);

    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let isInvalid = computed(() => (props.isInvalid || props.invalid || props.validationState === 'invalid') && !isDisabled.value);
    let isValid = computed(() => props.validationState === 'valid' && !isDisabled.value);
    let hasInputIcon = computed(() => props.icon !== null);
    let filteredOptions = computed(() => {
      let query = props.modelValue.trim().toLocaleLowerCase();
      if (!query) {
        return props.options;
      }

      return props.options.filter((option) => option.toLocaleLowerCase().includes(query));
    });
    let isOpen = computed(() => isFocused.value && filteredOptions.value.length > 0 && !isDisabled.value);

    watch(() => props.placeholder, (placeholder) => {
      if (placeholder && !hasWarnedDeprecatedPlaceholder.value && process.env.NODE_ENV !== 'production') {
        console.warn(SEARCH_AUTOCOMPLETE_PLACEHOLDER_WARNING);
        hasWarnedDeprecatedPlaceholder.value = true;
      }
    }, {immediate: true});

    let controlClassName = computed(() => classNames(
      inputGroupStyles,
      'spectrum-InputGroup',
      'spectrum-FocusRing',
      'spectrum-FocusRing-ring',
      fieldStyles,
      'spectrum-Field-field',
      {
        'spectrum-InputGroup--quiet': props.isQuiet,
        'is-disabled': isDisabled.value,
        'spectrum-InputGroup--invalid': isInvalid.value,
        'is-hovered': isHovered.value && !isDisabled.value,
        'is-focused': isFocused.value,
        'focus-ring': isFocusVisible.value
      },
      'searchautocomplete'
    ));

    let searchFieldClassName = computed(() => classNames(
      fieldStyles,
      'spectrum-Field',
      'spectrum-Field--positionTop',
      searchStyles,
      'spectrum-Search',
      'spectrum-Search--loadable',
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
      },
      classNames(inputGroupStyles, 'spectrum-InputGroup-field')
    ));

    let textfieldClassName = computed(() => classNames(
      textfieldStyles,
      'spectrum-Textfield',
      'spectrum-FocusRing',
      'spectrum-FocusRing-ring',
      fieldStyles,
      'spectrum-Field-field'
    ));

    let inputClassName = computed(() => classNames(
      searchStyles,
      'spectrum-Search-input',
      textfieldStyles,
      'spectrum-Textfield-input',
      'i18nFontFamily',
      {
        'spectrum-Textfield-inputIcon': hasInputIcon.value,
        'is-hovered': isHovered.value && !isDisabled.value
      }
    ));

    let rootClassName = computed(() => classNames(
      fieldStyles,
      'spectrum-Field',
      'spectrum-Field--positionTop'
    ));

    let labelClassName = computed(() => classNames(
      fieldStyles,
      'spectrum-FieldLabel'
    ));

    let iconClassName = computed(() => classNames(
      textfieldStyles,
      'spectrum-Icon',
      'spectrum-Textfield-icon'
    ));

    let clearButtonClassName = computed(() => classNames(
      buttonStyles,
      searchStyles,
      'spectrum-ClearButton',
      'spectrum-BaseButton',
      'i18nFontFamily',
      'spectrum-FocusRing',
      'spectrum-FocusRing-ring'
    ));

    let rootAttrs = computed(() => {
      let next: Record<string, unknown> = {};
      for (let [key, value] of Object.entries(attrs)) {
        if (
          key === 'aria-label'
          || key === 'aria-labelledby'
          || key === 'autofocus'
          || key === 'class'
          || key === 'style'
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

      let fromAttrs = attrs['aria-label'];
      if (typeof fromAttrs === 'string' && fromAttrs.length > 0) {
        return fromAttrs;
      }

      return undefined;
    });

    let iconNode = computed(() => {
      if (props.icon === null) {
        return null;
      }

      if (typeof props.icon === 'string') {
        let normalized = props.icon.trim().toLowerCase();
        if (normalized === '' || normalized === 'search') {
          return renderIconPath(
            `${iconClassName.value} spectrum-UIIcon-Magnifier`,
            MAGNIFIER_PATH,
            {'data-testid': 'searchicon'}
          );
        }

        if (normalized === 'filter') {
          return renderIconPath(
            `${iconClassName.value} spectrum-Icon--sizeS`,
            FILTER_PATH,
            {'data-testid': 'searchicon', 'fill-rule': 'evenodd'},
            '0 0 36 36'
          );
        }

        return h('span', {
          class: iconClassName.value,
          'data-testid': 'searchicon',
          'aria-hidden': 'true'
        }, props.icon);
      }

      if (props.icon !== undefined) {
        return h('span', {
          class: iconClassName.value,
          'data-testid': 'searchicon',
          'aria-hidden': 'true'
        }, [props.icon as never]);
      }

      return renderIconPath(
        `${iconClassName.value} spectrum-UIIcon-Magnifier`,
        MAGNIFIER_PATH,
        {'data-testid': 'searchicon'}
      );
    });

    let emitValue = (value: string) => {
      emit('update:modelValue', value);
      emit('change', value);
      emit('inputChange', value);
    };

    let resolveSelectionKey = (value: string): string | null => {
      return props.options.includes(value) ? value : null;
    };

    return () => h('div', {
      ...rootAttrs.value,
      class: [rootClassName.value, attrs.class],
      style: attrs.style
    }, [
      props.label ? h('label', {id: labelId.value, class: labelClassName.value, for: inputId.value}, props.label) : null,
      h('div', {
        class: controlClassName.value,
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
          class: searchFieldClassName.value
        }, [
          h('div', {class: textfieldClassName.value}, [
            iconNode.value,
            h('input', {
              ref: inputRef,
              id: inputId.value,
              class: inputClassName.value,
              type: 'text',
              value: props.modelValue,
              placeholder: props.placeholder || undefined,
              disabled: isDisabled.value,
              readonly: props.isReadOnly || undefined,
              autocomplete: 'off',
              autocorrect: 'off',
              spellcheck: 'false',
              role: 'combobox',
              'aria-autocomplete': 'list',
              'aria-expanded': isOpen.value ? 'true' : 'false',
              'aria-controls': isOpen.value ? listId.value : undefined,
              'aria-invalid': isInvalid.value ? 'true' : undefined,
              'aria-label': ariaLabel.value,
              'aria-labelledby': ariaLabelledBy.value,
              autofocus: props.autoFocus || attrs.autofocus || undefined,
              onInput: (event: Event) => {
                let target = event.currentTarget as HTMLInputElement | null;
                emitValue(target?.value ?? '');
              },
              onChange: (event: Event) => {
                let target = event.currentTarget as HTMLInputElement | null;
                emit('selectionChange', resolveSelectionKey(target?.value ?? ''));
              },
              onFocus: (event: FocusEvent) => {
                isFocused.value = true;
                let target = getEventTarget(event);
                isFocusVisible.value = target instanceof HTMLElement ? target.matches(':focus-visible') : false;
                emit('openChange', filteredOptions.value.length > 0);
                emit('focus', event);
              },
              onBlur: (event: FocusEvent) => {
                isFocused.value = false;
                isFocusVisible.value = false;
                emit('openChange', false);
                emit('blur', event);
              },
              onKeydown: (event: KeyboardEvent) => {
                if (event.key === 'Enter') {
                  let target = event.currentTarget as HTMLInputElement | null;
                  let currentValue = target?.value ?? props.modelValue;
                  emit('submit', currentValue, resolveSelectionKey(currentValue));
                }
              }
            }),
            props.modelValue !== '' && !isDisabled.value && !props.isReadOnly
              ? h('div', {
                class: clearButtonClassName.value,
                role: 'button',
                'data-react-aria-pressable': 'true',
                'aria-label': 'Clear search',
                'aria-hidden': 'true',
                onMousedown: (event: MouseEvent) => {
                  event.preventDefault();
                  inputRef.value?.focus();
                },
                onClick: () => {
                  emit('update:modelValue', '');
                  emit('change', '');
                  emit('inputChange', '');
                  emit('selectionChange', null);
                  emit('clear');
                  inputRef.value?.focus();
                }
              }, [
                renderIconPath(
                  classNames(buttonStyles, 'spectrum-Icon', 'spectrum-UIIcon-CrossSmall', 'spectrum-Icon'),
                  CLEAR_PATH
                )
              ])
              : null,
            isInvalid.value
              ? renderIconPath(
                classNames(textfieldStyles, 'spectrum-Icon', 'spectrum-UIIcon-AlertMedium', 'spectrum-Textfield-validationIcon'),
                ALERT_PATH
              )
              : null
          ])
        ])
      ])
    ]);
  }
});

export const Autocomplete = SearchAutocomplete;
export const VueSearchAutocomplete = SearchAutocomplete;

export {Item, Section} from '@vue-stately/collections';
export type {SpectrumSearchAutocompleteProps} from '@vue-types/autocomplete';
