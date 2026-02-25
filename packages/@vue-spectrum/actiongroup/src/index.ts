import '@adobe/spectrum-css-temp/components/actiongroup/vars.css';
import '@adobe/spectrum-css-temp/components/button/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
const actionGroupStyles: {[key: string]: string} = {};
const buttonStyles: {[key: string]: string} = {};


type SelectionMode = 'none' | 'single' | 'multiple';

export const ActionGroup = defineComponent({
  name: 'VueActionGroup',
  inheritAttrs: false,
  props: {
    disabledKeys: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    emphasized: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isEmphasized: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isQuiet: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    items: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    modelValue: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal'
    },
    quiet: {
      type: Boolean,
      default: false
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'none'
    }
  },
  emits: {
    action: (key: string) => typeof key === 'string',
    change: (value: string[]) => Array.isArray(value),
    'update:modelValue': (value: string[]) => Array.isArray(value)
  },
  setup(props, {emit, attrs, slots}) {
    let hoveredKey = ref<string | null>(null);

    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let isQuiet = computed(() => props.isQuiet ?? props.quiet);
    let isEmphasized = computed(() => props.isEmphasized ?? props.emphasized);

    let className = computed(() => classNames(
      actionGroupStyles,
      'spectrum-ActionGroup',
      {
        'spectrum-ActionGroup--quiet': isQuiet.value,
        'spectrum-ActionGroup--vertical': props.orientation === 'vertical'
      }
    ));

    let onAction = (item: string) => {
      let isItemDisabled = isDisabled.value || props.disabledKeys.includes(item);
      if (isItemDisabled) {
        return;
      }

      emit('action', item);

      if (props.selectionMode === 'none') {
        return;
      }

      if (props.selectionMode === 'single') {
        let next = [item];
        emit('update:modelValue', next);
        emit('change', next);
        return;
      }

      let isSelected = props.modelValue.includes(item);
      let next = isSelected
        ? props.modelValue.filter((key) => key !== item)
        : [...props.modelValue, item];
      emit('update:modelValue', next);
      emit('change', next);
    };

    return () => h('div', {
      ...attrs,
      class: [className.value, 'vs-action-group', attrs.class],
      role: 'group',
      'data-vac': ''
    }, [
      ...props.items.map((item) => {
        let isSelected = props.modelValue.includes(item);
        let isItemDisabled = isDisabled.value || props.disabledKeys.includes(item);
        let ariaPressed: 'true' | 'false' | undefined = undefined;
        if (props.selectionMode !== 'none') {
          ariaPressed = isSelected ? 'true' : 'false';
        }

        return h('button', {
          key: item,
          class: [classNames(
            actionGroupStyles,
            'spectrum-ActionGroup-item',
            {
              'is-selected': isSelected,
              'is-hovered': hoveredKey.value === item && !isItemDisabled,
              'spectrum-ActionGroup-item--isDisabled': isItemDisabled
            },
            classNames(
              buttonStyles,
              'spectrum-ActionButton',
              {
                'spectrum-ActionButton--emphasized': isEmphasized.value,
                'is-selected': isSelected
              }
            )
          ), 'vs-action-group__item'],
          type: 'button',
          disabled: isItemDisabled,
          'aria-pressed': ariaPressed,
          'aria-disabled': isItemDisabled ? 'true' : 'false',
          'aria-label': attrs['aria-label'],
          'aria-labelledby': attrs['aria-labelledby'],
          onMouseenter: () => {
            if (isItemDisabled) {
              return;
            }

            hoveredKey.value = item;
          },
          onMouseleave: () => {
            hoveredKey.value = null;
          },
          onClick: () => onAction(item)
        }, slots.item ? slots.item({item, selected: isSelected}) : item);
      }),
      h('span', {
        hidden: true,
        'aria-hidden': 'true',
        class: 'vs-action-group__hidden-marker'
      })
    ]);
  }
});

export const VueActionGroup = ActionGroup;
export {Item} from '@vue-stately/collections';
export type {SpectrumActionGroupProps} from '@vue-types/actiongroup';
