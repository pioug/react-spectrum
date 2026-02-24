import {computed, type ComputedRef, defineComponent, h, inject, type InjectionKey, type PropType, provide} from 'vue';
import {getSpectrumContext} from '../context';

interface RadioGroupContextValue {
  disabled: ComputedRef<boolean>,
  modelValue: ComputedRef<string>,
  name: ComputedRef<string>,
  setValue: (value: string) => void
}

const radioGroupContextKey: InjectionKey<RadioGroupContextValue> = Symbol('vue-spectrum-radio-group-context');
let radioGroupId = 0;

export const VueRadioGroup = defineComponent({
  name: 'VueRadioGroup',
  props: {
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
    name: {
      type: String,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'vertical'
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {emit, slots, attrs}) {
    let generatedName = `vs-radio-group-${++radioGroupId}`;
    let descriptionId = `${generatedName}-description`;
    let groupName = computed(() => props.name ?? generatedName);

    provide(radioGroupContextKey, {
      name: groupName,
      modelValue: computed(() => props.modelValue),
      disabled: computed(() => props.disabled),
      setValue: (value: string) => emit('update:modelValue', value)
    });

    return function render() {
      return h('div', {
        ...attrs,
        class: [
          'vs-radio-group',
          props.orientation === 'horizontal' ? 'vs-radio-group--horizontal' : 'vs-radio-group--vertical',
          attrs.class
        ],
        'data-vac': '',
        role: 'radiogroup',
        'aria-disabled': props.disabled ? 'true' : undefined,
        'aria-describedby': props.description ? descriptionId : undefined
      }, [
        props.label ? h('span', {class: 'vs-radio-group__label'}, props.label) : null,
        h('div', {class: 'vs-radio-group__options'}, slots.default ? slots.default() : []),
        props.description ? h('span', {id: descriptionId, class: 'vs-radio-group__description'}, props.description) : null
      ]);
    };
  }
});

export const VueRadio = defineComponent({
  name: 'VueRadio',
  props: {
    value: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    change: (value: string) => typeof value === 'string',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {emit, slots, attrs}) {
    let context = getSpectrumContext();
    let group = inject(radioGroupContextKey, null);

    let isDisabled = computed(() => props.disabled || (group ? group.disabled.value : false));
    let isChecked = computed(() => {
      let value = group ? group.modelValue.value : props.modelValue;
      return value === props.value;
    });
    let name = computed(() => group ? group.name.value : props.name);

    let classes = computed(() => ([
      'vs-radio',
      context.value.scale === 'large' ? 'vs-radio--large' : 'vs-radio--medium',
      isDisabled.value ? 'is-disabled' : null
    ]));

    let onChange = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      if (!target?.checked) {
        return;
      }

      emit('update:modelValue', props.value);
      emit('change', props.value);
      if (group) {
        group.setValue(props.value);
      }
    };

    return function render() {
      return h('label', {
        ...attrs,
        'data-vac': '',
        class: [classes.value, attrs.class]
      }, [
        h('input', {
          class: 'vs-radio__input',
          type: 'radio',
          name: name.value,
          value: props.value,
          checked: isChecked.value,
          disabled: isDisabled.value,
          onChange,
          onFocus: (event: FocusEvent) => emit('focus', event),
          onBlur: (event: FocusEvent) => emit('blur', event)
        }),
        h('span', {class: 'vs-radio__label'}, slots.default ? slots.default() : (props.label || props.value))
      ]);
    };
  }
});
