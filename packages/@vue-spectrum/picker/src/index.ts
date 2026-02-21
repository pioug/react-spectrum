import '@adobe/spectrum-css-temp/components/dropdown/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
import './styles.css';
const styles: {[key: string]: string} = {};


export type PickerItem = {
  disabled?: boolean,
  id: string,
  label: string
};

export type PickerSection = {
  id: string,
  items: PickerItem[],
  title: string
};

type PickerOptionInput = PickerItem | string;
type ValidationState = 'invalid' | 'valid';

let pickerId = 0;

function normalizeOption(option: PickerOptionInput): PickerItem {
  if (typeof option === 'string') {
    return {
      id: option,
      label: option
    };
  }

  return {
    disabled: option.disabled,
    id: option.id,
    label: option.label
  };
}

export const Picker = defineComponent({
  name: 'VuePicker',
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
    items: {
      type: Array as PropType<PickerOptionInput[]>,
      default: () => []
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
      default: 'Select...'
    },
    validationState: {
      type: String as PropType<ValidationState | undefined>,
      default: undefined
    }
  },
  emits: {
    change: (value: string) => typeof value === 'string',
    close: () => true,
    open: () => true,
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {attrs, emit}) {
    let generatedId = `vs-picker-${++pickerId}`;
    let isHovered = ref(false);

    let pickerIdValue = computed(() => props.id ?? generatedId);
    let options = computed(() => props.items.map((item) => normalizeOption(item)));
    let selectedItem = computed(() => options.value.find((option) => option.id === props.modelValue));
    let isPlaceholder = computed(() => !selectedItem.value);

    let isDisabled = computed(() => {
      if (props.isDisabled !== undefined) {
        return props.isDisabled;
      }

      return props.disabled;
    });

    let isInvalid = computed(() => {
      let invalid = props.isInvalid || props.validationState === 'invalid';
      return invalid && !isDisabled.value;
    });

    let descriptionId = computed(() => props.description ? `${pickerIdValue.value}-description` : undefined);

    let dropdownClassName = computed(() => classNames(
      styles,
      'spectrum-Dropdown',
      {
        'is-disabled': isDisabled.value,
        'is-invalid': isInvalid.value,
        'spectrum-Dropdown--quiet': props.isQuiet
      }
    ));

    let triggerClassName = computed(() => classNames(
      styles,
      'spectrum-Dropdown-trigger',
      {
        'is-hovered': isHovered.value
      }
    ));

    let labelClassName = computed(() => classNames(
      styles,
      'spectrum-Dropdown-label',
      {
        'is-placeholder': isPlaceholder.value
      }
    ));

    let pickerFieldClassName = computed(() => classNames(styles, 'spectrum-Field'));

    let ariaLabel = computed(() => {
      let fromAttrs = attrs['aria-label'];
      if (typeof fromAttrs === 'string' && fromAttrs.length > 0) {
        return fromAttrs;
      }

      return props.label || undefined;
    });

    let emitSelection = (event: Event) => {
      let target = event.currentTarget as HTMLSelectElement | null;
      let value = target?.value ?? '';
      emit('update:modelValue', value);
      emit('change', value);
    };

    return () => h('label', {
      ...attrs,
      class: [pickerFieldClassName.value, 'vs-picker', attrs.class],
      'data-vac': ''
    }, [
      props.label ? h('span', {class: 'vs-picker__label'}, props.label) : null,
      h('div', {
        class: [dropdownClassName.value, 'vs-picker__dropdown'],
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
        h('select', {
          id: pickerIdValue.value,
          'aria-describedby': descriptionId.value,
          'aria-label': ariaLabel.value,
          class: ['vs-picker__select', triggerClassName.value, labelClassName.value],
          disabled: isDisabled.value,
          autofocus: props.autoFocus || attrs.autofocus || undefined,
          value: props.modelValue,
          onBlur: () => {
            isHovered.value = false;
            emit('close');
          },
          onChange: emitSelection,
          onFocus: () => {
            emit('open');
          }
        }, [
          h('option', {
            value: '',
            disabled: true,
            selected: props.modelValue === ''
          }, props.placeholder),
          ...options.value.map((option) => h('option', {
            key: option.id,
            value: option.id,
            disabled: Boolean(option.disabled)
          }, option.label))
        ]),
        isInvalid.value
          ? h('span', {
            class: classNames(styles, 'spectrum-Dropdown-invalidIcon'),
            'aria-hidden': 'true'
          }, '!')
          : null,
        h('span', {
          class: [classNames(styles, 'spectrum-Dropdown-chevron'), 'vs-picker__chevron'],
          'aria-hidden': 'true'
        }, '\u25be')
      ]),
      props.description
        ? h('span', {
          id: descriptionId.value,
          class: 'vs-picker__description'
        }, props.description)
        : null
    ]);
  }
});

export const Item = <T extends PickerItem>(item: T): T => item;
export const Section = <T extends PickerSection>(section: T): T => section;

export const VuePicker = Picker;
export type {SpectrumPickerProps} from '@vue-types/select';
