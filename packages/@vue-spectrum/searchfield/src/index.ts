import '@adobe/spectrum-css-temp/components/search/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
import type {SpectrumSearchFieldProps} from '@vue-types/searchfield';
const searchStyles: {[key: string]: string} = {};


type ValidationState = 'invalid' | 'valid';

let searchFieldId = 0;

export const SearchField = defineComponent({
  name: 'VueSearchField',
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
    placeholder: {
      type: String,
      default: ''
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
    change: (value: string) => typeof value === 'string',
    clear: () => true,
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {attrs, emit}) {
    let generatedId = `vs-search-field-${++searchFieldId}`;
    let isHovered = ref(false);

    let inputId = computed(() => props.id ?? generatedId);
    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let isInvalid = computed(() => (props.isInvalid || props.invalid || props.validationState === 'invalid') && !isDisabled.value);
    let isValid = computed(() => props.validationState === 'valid' && !isDisabled.value);
    let descriptionId = computed(() => props.description ? `${inputId.value}-description` : undefined);

    let rootClassName = computed(() => classNames(
      searchStyles,
      'spectrum-Search',
      'spectrum-Textfield',
      {
        'is-disabled': isDisabled.value,
        'is-quiet': props.isQuiet,
        'spectrum-Search--invalid': isInvalid.value,
        'spectrum-Search--valid': isValid.value
      }
    ));

    let inputClassName = computed(() => classNames(
      searchStyles,
      'spectrum-Textfield-input',
      'spectrum-Search-input',
      {
        'is-hovered': isHovered.value && !isDisabled.value
      }
    ));

    let ariaLabel = computed(() => {
      let fromAttrs = attrs['aria-label'];
      if (typeof fromAttrs === 'string' && fromAttrs.length > 0) {
        return fromAttrs;
      }

      return props.label || undefined;
    });

    let emitValue = (value: string) => {
      emit('update:modelValue', value);
      emit('change', value);
    };

    return () => h('label', {
      ...attrs,
      class: ['vs-search-field', attrs.class],
      'data-vac': ''
    }, [
      props.label ? h('span', {class: 'vs-search-field__label'}, props.label) : null,
      h('div', {
        class: [rootClassName.value, 'vs-search-field__control']
      }, [
        h('span', {
          class: 'vs-search-field__icon',
          'aria-hidden': 'true',
          'data-testid': 'searchicon'
        }, '\ud83d\udd0d'),
        h('input', {
          id: inputId.value,
          class: [inputClassName.value, 'vs-search-field__input'],
          type: 'search',
          value: props.modelValue,
          placeholder: props.placeholder || undefined,
          disabled: isDisabled.value,
          readonly: props.isReadOnly || undefined,
          required: props.required || undefined,
          'aria-invalid': isInvalid.value ? 'true' : undefined,
          'aria-label': ariaLabel.value,
          'aria-describedby': descriptionId.value,
          autofocus: props.autoFocus || attrs.autofocus || undefined,
          onInput: (event: Event) => {
            let target = event.currentTarget as HTMLInputElement | null;
            emitValue(target?.value ?? '');
          },
          onFocus: (event: FocusEvent) => emit('focus', event),
          onBlur: (event: FocusEvent) => {
            isHovered.value = false;
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
        }),
        props.modelValue !== '' && !isDisabled.value && !props.isReadOnly
          ? h('button', {
            class: [classNames(searchStyles, 'spectrum-ClearButton'), 'vs-search-field__clear'],
            type: 'button',
            'aria-label': 'Clear search',
            onClick: () => {
              emit('update:modelValue', '');
              emit('clear');
            }
          }, '\u00d7')
          : null
      ]),
      props.description
        ? h('span', {
          id: descriptionId.value,
          class: 'vs-search-field__description'
        }, props.description)
        : null
    ]);
  }
});

export const VueSearchField = SearchField;
export type {SpectrumSearchFieldProps};
