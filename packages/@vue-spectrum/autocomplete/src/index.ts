import '@adobe/spectrum-css-temp/components/inputgroup/vars.css';
import '@adobe/spectrum-css-temp/components/search/vars.css';
import '@adobe/spectrum-css-temp/components/textfield/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
import './searchautocomplete.css';
import {getEventTarget} from '@vue-aria/utils';
const inputGroupStyles: {[key: string]: string} = {};
const searchStyles: {[key: string]: string} = {};
const textfieldStyles: {[key: string]: string} = {};


type ValidationState = 'invalid' | 'valid';
type PickerOptionInput = string;

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
      type: [Object, String] as PropType<string | null | undefined>,
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
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {attrs, emit}) {
    let generatedId = `vs-search-autocomplete-${++autocompleteId}`;
    let isHovered = ref(false);
    let isFocused = ref(false);
    let isFocusVisible = ref(false);

    let inputId = computed(() => props.id ?? generatedId);
    let listId = computed(() => `${inputId.value}-list`);

    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let isInvalid = computed(() => (props.isInvalid || props.invalid || props.validationState === 'invalid') && !isDisabled.value);
    let isValid = computed(() => props.validationState === 'valid' && !isDisabled.value);
    let isPlaceholder = computed(() => props.modelValue === '');

    let controlClassName = computed(() => classNames(
      inputGroupStyles,
      'spectrum-InputGroup',
      {
        'spectrum-InputGroup--quiet': props.isQuiet,
        'is-disabled': isDisabled.value,
        'spectrum-InputGroup--invalid': isInvalid.value,
        'is-hovered': isHovered.value,
        'is-focused': isFocused.value,
        'focus-ring': isFocusVisible.value
      },
      'searchautocomplete'
    ));

    let searchFieldClassName = computed(() => classNames(
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
      classNames(inputGroupStyles, 'spectrum-InputGroup-field')
    ));

    let inputClassName = computed(() => classNames(
      searchStyles,
      'spectrum-Search-input',
      {
        'is-placeholder': isPlaceholder.value,
        'is-hovered': isHovered.value
      }
    ));

    let ariaLabel = computed(() => {
      let fromAttrs = attrs['aria-label'];
      if (typeof fromAttrs === 'string' && fromAttrs.length > 0) {
        return fromAttrs;
      }

      return props.label || undefined;
    });

    let iconText = computed(() => {
      if (props.icon === null) {
        return null;
      }

      if (typeof props.icon === 'string') {
        let normalized = props.icon.trim().toLowerCase();
        if (normalized === '' || normalized === 'search') {
          return '\ud83d\udd0d';
        }

        if (normalized === 'filter') {
          return '\ud83d\udd0e';
        }

        return props.icon;
      }

      return '\ud83d\udd0d';
    });

    let emitValue = (value: string) => {
      emit('update:modelValue', value);
      emit('change', value);
    };

    return () => h('label', {
      ...attrs,
      class: ['vs-combobox', attrs.class],
      'data-vac': ''
    }, [
      props.label ? h('span', {class: 'vs-combobox__label'}, props.label) : null,
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
          iconText.value != null
            ? h('span', {
              class: classNames(searchStyles, 'spectrum-Icon'),
              'data-testid': 'searchicon',
              'aria-hidden': 'true'
            }, iconText.value)
            : null,
          h('input', {
            id: inputId.value,
            class: ['vs-combobox__input', inputClassName.value],
            type: 'search',
            list: listId.value,
            value: props.modelValue,
            placeholder: props.placeholder || undefined,
            disabled: isDisabled.value,
            readonly: props.isReadOnly || undefined,
            'aria-invalid': isInvalid.value ? 'true' : undefined,
            'aria-label': ariaLabel.value,
            'aria-haspopup': 'listbox',
            autofocus: props.autoFocus || attrs.autofocus || undefined,
            onInput: (event: Event) => {
              let target = event.currentTarget as HTMLInputElement | null;
              emitValue(target?.value ?? '');
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
              emit('blur', event);
            }
          }),
          props.modelValue !== '' && !isDisabled.value && !props.isReadOnly
            ? h('button', {
              class: [classNames(searchStyles, 'spectrum-ClearButton'), 'vs-combobox__clear'],
              type: 'button',
              'aria-label': 'Clear search',
              onClick: () => {
                emit('update:modelValue', '');
                emit('clear');
              }
            }, '\u00d7')
            : null,
          isInvalid.value
            ? h('span', {
              class: classNames(textfieldStyles, 'spectrum-Textfield-validationIcon'),
              'aria-hidden': 'true'
            }, '!')
            : null
        ]),
        h('datalist', {id: listId.value}, props.options.map((option) => h('option', {value: option}, option)))
      ])
    ]);
  }
});

export const Autocomplete = SearchAutocomplete;
export const VueSearchAutocomplete = SearchAutocomplete;

export {Item, Section} from '@vue-stately/collections';
export type {SpectrumSearchAutocompleteProps} from '@vue-types/autocomplete';
