import {defineComponent, h, ref, type PropType, type VNode} from 'vue';

type MenuSelectionMode = 'none' | 'single' | 'multiple';
type MenuValue = string | string[];

type MenuItemRecord = {
  children?: MenuItemInput[],
  disabled?: boolean,
  id?: string,
  key?: string,
  label?: string,
  textValue?: string
};

type MenuSectionRecord = {
  ariaLabel?: string,
  items: MenuItemInput[],
  label?: string
};

type MenuItemInput = MenuItemRecord | string;

type NormalizedMenuItem = {
  children: NormalizedMenuItem[],
  disabled: boolean,
  key: string,
  label: string,
  value: string
};

type NormalizedMenuSection = {
  ariaLabel?: string,
  items: NormalizedMenuItem[],
  key: string,
  label?: string
};

function normalizeItem(item: MenuItemInput, index: number, parentKey = ''): NormalizedMenuItem {
  if (typeof item === 'string') {
    let value = item;
    let key = parentKey ? `${parentKey}/${item}-${index}` : `${item}-${index}`;
    return {
      children: [],
      disabled: false,
      key,
      label: item,
      value
    };
  }

  let value = item.key ?? item.id ?? item.label ?? item.textValue ?? `${index}`;
  let key = parentKey ? `${parentKey}/${value}` : String(value);

  return {
    children: (item.children ?? []).map((child, childIndex) => normalizeItem(child, childIndex, key)),
    disabled: Boolean(item.disabled),
    key,
    label: item.label ?? item.textValue ?? String(value),
    value: String(value)
  };
}

function normalizeSection(section: MenuSectionRecord, index: number): NormalizedMenuSection {
  let key = `section-${index}`;

  return {
    ariaLabel: section.ariaLabel,
    items: section.items.map((item, itemIndex) => normalizeItem(item, itemIndex, key)),
    key,
    label: section.label
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
    },
    sections: {
      type: Array as PropType<MenuSectionRecord[]>,
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
    let openKeys = ref<Set<string>>(new Set());

    let isSelected = (value: string) => {
      if (props.selectionMode === 'none') {
        return false;
      }

      if (props.selectionMode === 'multiple') {
        return Array.isArray(props.modelValue) && props.modelValue.includes(value);
      }

      return props.modelValue === value;
    };

    let toggleSubmenu = (key: string) => {
      let next = new Set(openKeys.value);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      openKeys.value = next;
    };

    let onSelect = (item: NormalizedMenuItem) => {
      if (item.disabled) {
        return;
      }

      if (item.children.length > 0) {
        toggleSubmenu(item.key);
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

    let renderItem = (item: NormalizedMenuItem): VNode => {
      let selected = isSelected(item.value);
      let hasSubmenu = item.children.length > 0;
      let isOpen = openKeys.value.has(item.key);

      let role = 'menuitem';
      if (!hasSubmenu && props.selectionMode === 'single') {
        role = 'menuitemradio';
      } else if (!hasSubmenu && props.selectionMode === 'multiple') {
        role = 'menuitemcheckbox';
      }

      return h('div', {
        key: item.key,
        class: 'vs-menu__item-wrapper'
      }, [
        h('button', {
          class: ['vs-menu__item', 'item', selected ? 'is-selected' : null, isOpen ? 'open' : null],
          type: 'button',
          role,
          disabled: item.disabled,
          'aria-disabled': item.disabled ? 'true' : undefined,
          'aria-haspopup': hasSubmenu ? 'menu' : undefined,
          'aria-expanded': hasSubmenu ? (isOpen ? 'true' : 'false') : undefined,
          'aria-checked': (!hasSubmenu && props.selectionMode !== 'none') ? (selected ? 'true' : 'false') : undefined,
          onClick: () => onSelect(item)
        }, [
          h('span', {class: 'vs-menu__item-label'}, item.label),
          hasSubmenu ? h('span', {'aria-hidden': 'true', class: 'vs-menu__item-chevron'}, '›') : null
        ]),
        hasSubmenu && isOpen
          ? h('div', {
            class: ['vs-menu__submenu', 'group'],
            role: 'presentation'
          }, [
            h('div', {
              class: ['vs-menu__items', 'group'],
              role: 'menu',
              'aria-label': item.label
            }, item.children.map((child) => renderItem(child)))
          ])
          : null
      ]);
    };

    let renderSection = (section: NormalizedMenuSection): VNode => {
      return h('section', {
        key: section.key,
        class: ['vs-menu__section', 'group'],
        role: 'group',
        'aria-label': section.ariaLabel ?? section.label
      }, [
        section.label ? h('div', {class: 'vs-menu__section-label'}, section.label) : null,
        ...section.items.map((item) => renderItem(item))
      ]);
    };

    return function render() {
      let normalizedSections = props.sections.map((section, index) => normalizeSection(section, index));
      let normalizedItems = props.items.map((item, index) => normalizeItem(item, index));
      let hasSections = normalizedSections.length > 0;

      return h('section', {
        ...attrs,
        class: ['vs-menu', 'menu', attrs.class],
        'data-vac': ''
      }, [
        props.label && !hasSections ? h('p', {class: ['vs-menu__label']}, props.label) : null,
        h('div', {
          class: ['vs-menu__items', 'group'],
          role: 'menu',
          'aria-multiselectable': props.selectionMode === 'multiple' ? 'true' : undefined
        }, hasSections
          ? normalizedSections.map((section) => renderSection(section))
          : normalizedItems.map((item) => renderItem(item)))
      ]);
    };
  }
});
