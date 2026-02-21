import {defineComponent, h, nextTick, onBeforeUnmount, ref, type PropType, type VNode} from 'vue';

type MenuSelectionMode = 'none' | 'single' | 'multiple';
type MenuValue = string | string[];

type MenuItemRecord = {
  childSections?: MenuSectionRecord[],
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
  label?: string,
  separatorAfter?: boolean
};

type MenuItemInput = MenuItemRecord | string;

type NormalizedMenuItem = {
  childSections: NormalizedMenuSection[],
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
  label?: string,
  separatorAfter?: boolean
};

function normalizeItem(item: MenuItemInput, index: number, parentKey = ''): NormalizedMenuItem {
  if (typeof item === 'string') {
    let value = item;
    let key = parentKey ? `${parentKey}/${item}-${index}` : `${item}-${index}`;
    return {
      childSections: [],
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
    childSections: (item.childSections ?? []).map((section, sectionIndex) => normalizeSection(section, sectionIndex, key)),
    children: (item.children ?? []).map((child, childIndex) => normalizeItem(child, childIndex, key)),
    disabled: Boolean(item.disabled),
    key,
    label: item.label ?? item.textValue ?? String(value),
    value: String(value)
  };
}

function normalizeSection(section: MenuSectionRecord, index: number, parentKey = ''): NormalizedMenuSection {
  let key = parentKey ? `${parentKey}/section-${index}` : `section-${index}`;

  return {
    ariaLabel: section.ariaLabel,
    items: section.items.map((item, itemIndex) => normalizeItem(item, itemIndex, key)),
    key,
    label: section.label,
    separatorAfter: section.separatorAfter
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
    },
    delay: {
      type: Number,
      default: 200
    },
    virtualized: {
      type: Boolean,
      default: false
    },
    visibleItemCount: {
      type: Number,
      default: 20
    },
    estimatedItemHeight: {
      type: Number,
      default: 16
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
    let scrollTop = ref(0);
    let hoverOpenTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
    let itemRefs = new Map<string, HTMLButtonElement>();

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

    let openSubmenu = (key: string) => {
      let next = new Set(openKeys.value);
      next.add(key);
      openKeys.value = next;
    };

    let closeSubmenu = (key: string) => {
      let next = new Set(openKeys.value);
      next.delete(key);
      openKeys.value = next;
    };

    let setItemRef = (key: string, element: HTMLButtonElement | null) => {
      if (element) {
        itemRefs.set(key, element);
      } else {
        itemRefs.delete(key);
      }
    };

    let focusFirstSubmenuItem = (item: NormalizedMenuItem) => {
      let submenuItems = item.childSections.length > 0
        ? item.childSections.flatMap((section) => section.items)
        : item.children;
      let firstEnabledChild = submenuItems.find((child) => !child.disabled);
      if (!firstEnabledChild) {
        return;
      }

      nextTick(() => {
        itemRefs.get(firstEnabledChild.key)?.focus();
      });
    };

    let clearHoverOpenTimeout = (key: string) => {
      let timeout = hoverOpenTimeouts.get(key);
      if (timeout) {
        clearTimeout(timeout);
        hoverOpenTimeouts.delete(key);
      }
    };

    let scheduleHoverOpen = (key: string) => {
      clearHoverOpenTimeout(key);
      hoverOpenTimeouts.set(key, setTimeout(() => {
        openSubmenu(key);
        hoverOpenTimeouts.delete(key);
      }, props.delay));
    };

    onBeforeUnmount(() => {
      for (let timeout of hoverOpenTimeouts.values()) {
        clearTimeout(timeout);
      }
      hoverOpenTimeouts.clear();
      itemRefs.clear();
    });

    let onSelect = (item: NormalizedMenuItem) => {
      if (item.disabled) {
        return;
      }

      if (item.children.length > 0 || item.childSections.length > 0) {
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

    let renderSectionSeparator = (key: string): VNode => {
      return h('div', {
        key,
        class: 'vs-menu__separator',
        role: 'separator',
        style: {borderTop: '1px solid gray', margin: '2px 5px'}
      });
    };

    let renderItem: (item: NormalizedMenuItem, parentSubmenuKey?: string) => VNode;
    let renderSection = (section: NormalizedMenuSection, parentSubmenuKey?: string): VNode => {
      return h('section', {
        key: section.key,
        class: ['vs-menu__section', 'group'],
        role: 'group',
        'aria-label': section.ariaLabel ?? section.label
      }, [
        section.label ? h('div', {class: 'vs-menu__section-label'}, section.label) : null,
        ...section.items.map((item) => renderItem(item, parentSubmenuKey))
      ]);
    };

    let renderSections = (sections: NormalizedMenuSection[], parentSubmenuKey?: string): VNode[] => {
      return sections.flatMap((section, index) => {
        let nodes: VNode[] = [renderSection(section, parentSubmenuKey)];
        if (section.separatorAfter && index < sections.length - 1) {
          nodes.push(renderSectionSeparator(`${section.key}-separator`));
        }
        return nodes;
      });
    };

    renderItem = (item: NormalizedMenuItem, parentSubmenuKey?: string): VNode => {
      let selected = isSelected(item.value);
      let hasSubmenu = item.children.length > 0 || item.childSections.length > 0;
      let isOpen = openKeys.value.has(item.key);

      let role = 'menuitem';
      if (!hasSubmenu && props.selectionMode === 'single') {
        role = 'menuitemradio';
      } else if (!hasSubmenu && props.selectionMode === 'multiple') {
        role = 'menuitemcheckbox';
      }

      let submenuContent = item.childSections.length > 0
        ? renderSections(item.childSections, item.key)
        : item.children.map((child) => renderItem(child, item.key));

      return h('div', {
        key: item.key,
        class: 'vs-menu__item-wrapper'
      }, [
        h('button', {
          class: ['vs-menu__item', 'item', selected ? 'is-selected' : null, isOpen ? 'open' : null],
          type: 'button',
          ref: (element) => {
            setItemRef(item.key, element as HTMLButtonElement | null);
          },
          role,
          disabled: item.disabled,
          'aria-disabled': item.disabled ? 'true' : undefined,
          'aria-haspopup': hasSubmenu ? 'menu' : undefined,
          'aria-expanded': hasSubmenu ? (isOpen ? 'true' : 'false') : undefined,
          'aria-checked': (!hasSubmenu && props.selectionMode !== 'none') ? (selected ? 'true' : 'false') : undefined,
          'data-has-submenu': hasSubmenu ? 'true' : undefined,
          onMouseenter: hasSubmenu ? () => scheduleHoverOpen(item.key) : undefined,
          onMouseleave: hasSubmenu ? () => clearHoverOpenTimeout(item.key) : undefined,
          onKeydown: (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight' && hasSubmenu) {
              event.preventDefault();
              openSubmenu(item.key);
              focusFirstSubmenuItem(item);
              return;
            }

            if (event.key === 'ArrowLeft') {
              if (parentSubmenuKey) {
                event.preventDefault();
                closeSubmenu(parentSubmenuKey);
                nextTick(() => {
                  itemRefs.get(parentSubmenuKey)?.focus();
                });
                return;
              }

              if (hasSubmenu) {
                event.preventDefault();
                closeSubmenu(item.key);
              }
              return;
            }

            if (event.key === 'Escape') {
              if (parentSubmenuKey) {
                event.preventDefault();
                closeSubmenu(parentSubmenuKey);
                nextTick(() => {
                  itemRefs.get(parentSubmenuKey)?.focus();
                });
                return;
              }

              if (hasSubmenu) {
                event.preventDefault();
                closeSubmenu(item.key);
              }
            }
          },
          onClick: () => onSelect(item)
        }, [
          h('span', {class: 'vs-menu__item-label'}, item.label)
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
            }, submenuContent)
          ])
          : null
      ]);
    };

    return function render() {
      let normalizedSections = props.sections.map((section, index) => normalizeSection(section, index));
      let normalizedItems = props.items.map((item, index) => normalizeItem(item, index));
      let hasSections = normalizedSections.length > 0;
      let isVirtualizedFlat = props.virtualized
        && !hasSections
        && normalizedItems.every((item) => item.children.length === 0 && item.childSections.length === 0);

      let menuChildren: VNode[];
      let menuStyle: Record<string, string> | undefined;
      if (isVirtualizedFlat) {
        let itemHeight = Math.max(1, props.estimatedItemHeight);
        let clampedVisibleCount = Math.max(1, props.visibleItemCount);
        let maxStart = Math.max(0, normalizedItems.length - clampedVisibleCount);
        let startIndex = Math.min(maxStart, Math.max(0, Math.floor(scrollTop.value / itemHeight)));
        let endIndex = Math.min(normalizedItems.length, startIndex + clampedVisibleCount);
        let topSpacerHeight = startIndex * itemHeight;
        let bottomSpacerHeight = Math.max(0, (normalizedItems.length - endIndex) * itemHeight);
        let visibleItems = normalizedItems.slice(startIndex, endIndex);

        menuStyle = {
          maxHeight: `${clampedVisibleCount * itemHeight}px`,
          overflowY: 'auto',
          position: 'relative'
        };

        menuChildren = [
          h('div', {
            'aria-hidden': 'true',
            class: 'vs-menu__virtual-spacer--top',
            style: {height: `${topSpacerHeight}px`}
          }),
          ...visibleItems.map((item) => renderItem(item)),
          h('div', {
            'aria-hidden': 'true',
            class: 'vs-menu__virtual-spacer--bottom',
            style: {height: `${bottomSpacerHeight}px`}
          })
        ];
      } else {
        menuChildren = hasSections
          ? renderSections(normalizedSections)
          : normalizedItems.map((item) => renderItem(item));
      }

      return h('section', {
        ...attrs,
        class: ['vs-menu', 'menu', attrs.class],
        'data-vac': ''
      }, [
        props.label && !hasSections ? h('p', {class: ['vs-menu__label']}, props.label) : null,
        h('div', {
          class: ['vs-menu__items', 'group'],
          role: 'menu',
          style: menuStyle,
          'aria-multiselectable': props.selectionMode === 'multiple' ? 'true' : undefined,
          onScroll: isVirtualizedFlat
            ? (event: Event) => {
              let target = event.currentTarget as HTMLElement;
              scrollTop.value = target.scrollTop;
            }
            : undefined
        }, menuChildren)
      ]);
    };
  }
});
