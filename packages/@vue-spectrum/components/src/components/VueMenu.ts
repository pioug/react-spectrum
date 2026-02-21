import {defineComponent, h, type PropType} from 'vue';

type MenuSelectionMode = 'none' | 'single' | 'multiple';
type MenuValue = string | string[];

type MenuItemRecord = {
  disabled?: boolean,
  href?: string,
  id?: string,
  key?: string,
  label?: string,
  textValue?: string
};

type MenuItemInput = MenuItemRecord | string;

type NormalizedMenuItem = {
  disabled: boolean,
  href?: string,
  key: string,
  label: string,
  value: string
};

function normalizeItem(item: MenuItemInput, index: number): NormalizedMenuItem {
  if (typeof item === 'string') {
    return {
      disabled: false,
      key: `${item}-${index}`,
      label: item,
      value: item
    };
  }

  let value = item.key ?? item.id ?? item.label ?? item.textValue ?? `${index}`;
  return {
    disabled: Boolean(item.disabled),
    href: item.href,
    key: String(value),
    label: item.label ?? item.textValue ?? String(value),
    value: String(value)
  };
}

export const VueMenu = defineComponent({
  name: 'VueMenu',
  props: {
    modelValue: {
      type: [String, Array] as PropType<MenuValue>,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    selectionMode: {
      type: String as PropType<MenuSelectionMode>,
      default: 'none'
    },
    items: {
      type: Array as PropType<MenuItemInput[]>,
      default: () => []
    }
  },
  emits: {
    action: (value: string) => typeof value === 'string',
    'update:modelValue': (value: MenuValue) => (
      typeof value === 'string'
      || (Array.isArray(value) && value.every((item) => typeof item === 'string'))
    ),
    select: (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let isSelected = (value: string) => {
      if (props.selectionMode === 'none') {
        return false;
      }

      if (props.selectionMode === 'multiple') {
        return Array.isArray(props.modelValue) && props.modelValue.includes(value);
      }

      return props.modelValue === value;
    };

    let onSelect = (item: NormalizedMenuItem) => {
      if (item.disabled) {
        return;
      }

      emit('action', item.value);
      emit('select', item.value);

      if (props.selectionMode === 'none') {
        return;
      }

      if (props.selectionMode === 'multiple') {
        let current = Array.isArray(props.modelValue) ? props.modelValue : [];
        let next = current.includes(item.value)
          ? current.filter((value) => value !== item.value)
          : [...current, item.value];
        emit('update:modelValue', next);
        return;
      }

      emit('update:modelValue', item.value);
    };

    return function render() {
      let normalizedItems = props.items.map((item, index) => normalizeItem(item, index));

      return h('section', {
        ...attrs,
        class: ['vs-menu', 'menu', attrs.class],
        'data-vac': ''
      }, [
        props.label ? h('p', {class: ['vs-menu__label']}, props.label) : null,
        h('div', {
          class: ['vs-menu__items', 'group'],
          role: 'menu',
          'aria-multiselectable': props.selectionMode === 'multiple' ? 'true' : undefined
        }, normalizedItems.map((item) => {
          let selected = isSelected(item.value);
          let role = 'menuitem';
          if (props.selectionMode === 'single') {
            role = 'menuitemradio';
          } else if (props.selectionMode === 'multiple') {
            role = 'menuitemcheckbox';
          }

          return h('button', {
            key: item.key,
            class: ['vs-menu__item', 'item', selected ? 'is-selected' : null],
            type: 'button',
            role,
            disabled: item.disabled,
            'aria-disabled': item.disabled ? 'true' : undefined,
            'aria-checked': props.selectionMode === 'none' ? undefined : (selected ? 'true' : 'false'),
            onClick: () => onSelect(item)
          }, item.label);
        }))
      ]);
    };
  }
});
