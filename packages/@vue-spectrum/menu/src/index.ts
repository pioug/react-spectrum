import '@adobe/spectrum-css-temp/components/contextualhelp/vars.css';
import '@adobe/spectrum-css-temp/components/menu/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref, type VNode} from 'vue';
const contextualHelpStyles: {[key: string]: string} = {};
const menuStyles: {[key: string]: string} = {};


type SelectionMode = 'multiple' | 'none' | 'single';
type SelectionValue = number | string | Array<number | string>;

type MenuItemRecord = {
  ariaLabel?: string,
  children?: MenuItemRecord[],
  disabled?: boolean,
  id?: number | string,
  key?: number | string,
  label?: string,
  selectable?: boolean,
  textValue?: string
};

type NormalizedMenuItem = {
  children: NormalizedMenuItem[],
  disabled: boolean,
  key: number | string,
  label: string,
  original: MenuItemRecord | string,
  selectable: boolean
};

function normalizeSelection(value: SelectionValue | undefined): Array<number | string> {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is number | string => typeof entry === 'number' || typeof entry === 'string');
  }

  if (typeof value === 'number' || typeof value === 'string') {
    return [value];
  }

  return [];
}

function normalizeItem(item: MenuItemRecord | string, index: number): NormalizedMenuItem {
  if (typeof item === 'string') {
    return {
      key: item,
      label: item,
      disabled: false,
      selectable: true,
      children: [],
      original: item
    };
  }

  let key = item.key ?? item.id ?? index;
  let label = item.label ?? item.textValue ?? String(key);

  return {
    key,
    label,
    disabled: !!item.disabled,
    selectable: item.selectable ?? true,
    children: Array.isArray(item.children)
      ? item.children.map((child, childIndex) => normalizeItem(child, childIndex))
      : [],
    original: item
  };
}

function toBooleanString(value: boolean): 'false' | 'true' {
  return value ? 'true' : 'false';
}

export const Menu = defineComponent({
  name: 'VueMenu',
  inheritAttrs: false,
  props: {
    ariaLabel: {
      type: String,
      default: ''
    },
    ariaLabelledby: {
      type: String,
      default: ''
    },
    dataTestid: {
      type: String,
      default: 'menu-wrapper'
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isExpanded: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array as PropType<Array<MenuItemRecord | string>>,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number, Array] as PropType<SelectionValue | undefined>,
      default: undefined
    },
    openKeys: {
      type: Array as PropType<Array<number | string>>,
      default: () => []
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'single'
    }
  },
  emits: {
    action: (key: number | string) => typeof key === 'number' || typeof key === 'string',
    openChange: (keys: Array<number | string>) => Array.isArray(keys),
    select: (value: SelectionValue) => {
      if (typeof value === 'number' || typeof value === 'string') {
        return true;
      }

      return Array.isArray(value);
    },
    'update:modelValue': (value: SelectionValue) => {
      if (typeof value === 'number' || typeof value === 'string') {
        return true;
      }

      return Array.isArray(value);
    }
  },
  setup(props, {emit, attrs}) {
    let hoveredKey = ref<number | string | null>(null);
    let focusedKey = ref<number | string | null>(null);

    let normalizedItems = computed(() => props.items.map((item, index) => normalizeItem(item, index)));
    let selectedSet = computed(() => new Set(normalizeSelection(props.modelValue)));
    let openSet = computed(() => new Set(props.openKeys));

    let onToggleOpen = (key: number | string) => {
      let next = new Set(openSet.value);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      emit('openChange', Array.from(next));
    };

    let onSelect = (item: NormalizedMenuItem) => {
      emit('action', item.key);

      if (props.selectionMode === 'none' || props.isDisabled || item.disabled || !item.selectable) {
        emit('select', item.key);
        return;
      }

      if (props.selectionMode === 'single') {
        emit('update:modelValue', item.key);
        emit('select', item.key);
        return;
      }

      let next = new Set(selectedSet.value);
      if (next.has(item.key)) {
        next.delete(item.key);
      } else {
        next.add(item.key);
      }

      let values = Array.from(next);
      emit('update:modelValue', values);
      emit('select', values);
    };

    let renderItem = (item: NormalizedMenuItem): VNode => {
      let hasChildren = item.children.length > 0;
      let isDisabled = props.isDisabled || item.disabled;
      let isSelected = selectedSet.value.has(item.key);
      let isHovered = hoveredKey.value === item.key && !isDisabled;
      let isFocused = focusedKey.value === item.key && !isDisabled;
      let isOpen = openSet.value.has(item.key);
      let isSelectable = props.selectionMode !== 'none' && !hasChildren && item.selectable;

      let role = 'menuitem';
      if (isSelectable) {
        role = props.selectionMode === 'multiple' ? 'menuitemcheckbox' : 'menuitemradio';
      }

      return h('li', {
        key: String(item.key),
        class: ['vs-menu__item-wrapper']
      }, [
        h('button', {
          type: 'button',
          role,
          class: [
            classNames(
              menuStyles,
              'spectrum-Menu-item',
              {
                'focus-ring': isFocused,
                'is-disabled': isDisabled,
                'is-hovered': isHovered,
                'is-open': isOpen,
                'is-selectable': isSelectable,
                'is-selected': isSelected
              }
            ),
            'vs-menu__item'
          ],
          disabled: isDisabled,
          'aria-label': typeof item.original === 'string' ? item.label : item.original.ariaLabel || item.label,
          'aria-checked': isSelectable ? toBooleanString(isSelected) : undefined,
          onMouseenter: () => {
            hoveredKey.value = item.key;
          },
          onMouseleave: () => {
            if (hoveredKey.value === item.key) {
              hoveredKey.value = null;
            }
          },
          onFocus: () => {
            focusedKey.value = item.key;
          },
          onBlur: () => {
            if (focusedKey.value === item.key) {
              focusedKey.value = null;
            }
          },
          onClick: () => {
            if (hasChildren) {
              onToggleOpen(item.key);
              return;
            }
            onSelect(item);
          }
        }, [
          h('span', {class: [classNames(menuStyles, 'spectrum-Menu-itemLabel'), 'vs-menu__item-label']}, item.label),
          hasChildren
            ? h('span', {
              class: [classNames(menuStyles, 'spectrum-Menu-chevron'), 'vs-menu__item-chevron'],
              'aria-hidden': 'true'
            }, '›')
            : null
        ]),
        hasChildren
          ? h('div', {
            class: [classNames(menuStyles, 'spectrum-Submenu-wrapper'), 'vs-menu__submenu'],
            hidden: !isOpen,
            'aria-hidden': isOpen ? 'false' : 'true'
          }, [
            h('ul', {
              class: [classNames(menuStyles, 'spectrum-Menu'), 'vs-menu__submenu-list'],
              role: 'menu',
              'aria-label': item.label
            }, item.children.map((child) => renderItem(child)))
          ])
          : null
      ]);
    };

    return () => {
      let hasOpenSubmenu = props.openKeys.length > 0;
      let wrapperExpanded = props.isExpanded || hasOpenSubmenu;

      return h('div', {
        ...attrs,
        class: [
          classNames(
            menuStyles,
            'spectrum-Menu-wrapper',
            {
              'is-expanded': wrapperExpanded,
              'spectrum-Menu-wrapper--isMobile': false
            }
          ),
          'vs-menu',
          attrs.class
        ],
        role: 'dialog',
        'aria-hidden': wrapperExpanded ? 'false' : 'true',
        'aria-label': props.ariaLabel || attrs['aria-label'] || props.label || undefined,
        'aria-labelledby': props.ariaLabelledby || attrs['aria-labelledby'],
        'data-testid': props.dataTestid || attrs['data-testid'],
        'data-vac': ''
      }, [
        h('div', {
          class: [classNames(menuStyles, 'spectrum-Submenu-wrapper'), 'vs-menu__wrapper'],
          role: 'presentation'
        }, [
          props.label
            ? h('span', {
              class: [classNames(menuStyles, 'spectrum-Menu-sectionHeading'), 'vs-menu__label']
            }, props.label)
            : null,
          h('ul', {
            class: [classNames(menuStyles, 'spectrum-Menu'), classNames(contextualHelpStyles, 'spectrum-Menu'), 'vs-menu__items'],
            role: 'menu',
            'aria-label': props.ariaLabel || attrs['aria-label'] || props.label || undefined,
            'aria-labelledby': props.ariaLabelledby || attrs['aria-labelledby']
          }, normalizedItems.value.map((item) => renderItem(item)))
        ]),
        h('div', {
          hidden: true,
          'aria-hidden': 'true',
          class: 'vs-menu__hidden-state'
        })
      ]);
    };
  }
});

export const VueMenu = Menu;
export const ActionMenu = Menu;
export const MenuTrigger = Menu;
export const SubmenuTrigger = Menu;
export const ContextualHelpTrigger = Menu;
export const Item = Menu;
export const Section = Menu;

export type SpectrumMenuProps<T = unknown> = Record<string, unknown> & {
  item?: T
};
export type SpectrumActionMenuProps<T = unknown> = SpectrumMenuProps<T>;
export type SpectrumMenuTriggerProps = SpectrumMenuProps;
export type SpectrumMenuDialogTriggerProps = SpectrumMenuProps;
export type SpectrumSubmenuTriggerProps<T = unknown> = SpectrumMenuProps<T>;
