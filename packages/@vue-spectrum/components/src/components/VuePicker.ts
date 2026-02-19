import {computed, defineComponent, h, type PropType} from 'vue';
import {getSpectrumContext} from '../context';

type PickerOption = {
  disabled?: boolean,
  id: string,
  label: string
};

type PickerOptionInput = PickerOption | string;

let pickerId = 0;

function normalizeOption(option: PickerOptionInput): PickerOption {
  if (typeof option === 'string') {
    return {
      id: option,
      label: option
    };
  }

  return {
    id: option.id,
    label: option.label,
    disabled: option.disabled
  };
}

export const VuePicker = defineComponent({
  name: 'VuePicker',
  props: {
    id: {
      type: String,
      default: undefined
    },
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Select an option'
    },
    items: {
      type: Array as PropType<PickerOptionInput[]>,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    change: (value: string) => typeof value === 'string',
    open: () => true,
    close: () => true
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();
    let generatedId = `vs-picker-${++pickerId}`;

    let pickerIdValue = computed(() => props.id ?? generatedId);
    let options = computed(() => props.items.map((item) => normalizeOption(item)));
    let selectClasses = computed(() => ([
      'vs-picker__select',
      context.value.scale === 'large' ? 'vs-picker__select--large' : 'vs-picker__select--medium'
    ]));

    return function render() {
      return h('label', {
        ...attrs,
        class: ['vs-picker', attrs.class],
        'data-vac': ''
      }, [
        props.label ? h('span', {class: 'vs-picker__label'}, props.label) : null,
        h('select', {
          id: pickerIdValue.value,
          class: selectClasses.value,
          value: props.modelValue,
          disabled: props.disabled,
          onFocus: () => emit('open'),
          onBlur: () => emit('close'),
          onChange: (event: Event) => {
            let target = event.currentTarget as HTMLSelectElement | null;
            let value = target?.value ?? '';
            emit('update:modelValue', value);
            emit('change', value);
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
        props.description ? h('span', {class: 'vs-picker__description'}, props.description) : null
      ]);
    };
  }
});
