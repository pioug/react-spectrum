import {computed, defineComponent, h, type PropType} from 'vue';
import {getSpectrumContext} from '../context';

type SelectionMode = 'none' | 'single' | 'multiple';

export const VueActionGroup = defineComponent({
  name: 'VueActionGroup',
  props: {
    modelValue: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    items: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'none'
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    emphasized: {
      type: Boolean,
      default: false
    },
    quiet: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: string[]) => Array.isArray(value),
    action: (key: string) => typeof key === 'string'
  },
  setup(props, {emit, attrs, slots}) {
    let context = getSpectrumContext();

    let classes = computed(() => ([
      'vs-action-group',
      props.orientation === 'vertical' ? 'vs-action-group--vertical' : 'vs-action-group--horizontal',
      context.value.scale === 'large' ? 'vs-action-group--large' : 'vs-action-group--medium',
      props.emphasized ? 'is-emphasized' : null,
      props.quiet ? 'is-quiet' : null
    ]));

    let onAction = (item: string) => {
      if (props.disabled) {
        return;
      }

      emit('action', item);

      if (props.selectionMode === 'none') {
        return;
      }

      if (props.selectionMode === 'single') {
        emit('update:modelValue', [item]);
        return;
      }

      let isSelected = props.modelValue.includes(item);
      let nextValue = isSelected
        ? props.modelValue.filter((key) => key !== item)
        : [...props.modelValue, item];
      emit('update:modelValue', nextValue);
    };

    return function render() {
      return h('div', {
        ...attrs,
        class: [classes.value, attrs.class],
        role: 'group',
        'data-vac': ''
      }, props.items.map((item) => {
        let isSelected = props.modelValue.includes(item);
        let ariaPressed: 'true' | 'false' | undefined = undefined;
        if (props.selectionMode !== 'none') {
          ariaPressed = isSelected ? 'true' : 'false';
        }

        return h('button', {
          key: item,
          class: ['vs-action-group__item', isSelected ? 'is-selected' : null],
          type: 'button',
          disabled: props.disabled,
          'aria-pressed': ariaPressed,
          onClick: () => onAction(item)
        }, slots.item ? slots.item({item, selected: isSelected}) : item);
      }));
    };
  }
});
