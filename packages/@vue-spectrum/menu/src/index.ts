import '@adobe/spectrum-css-temp/components/contextualhelp/vars.css';
import '@adobe/spectrum-css-temp/components/menu/vars.css';
import More from '@spectrum-icons-vue/workflow/More';
import {ActionButton} from '@vue-spectrum/button';
import {Item, Section} from '@vue-stately/collections';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, type PropType, ref, type VNode, watch} from 'vue';
const contextualHelpStyles: {[key: string]: string} = {};
const menuStyles: {[key: string]: string} = {};


type AlignMode = 'end' | 'start';
type AutoFocusMode = 'first' | 'last' | true;
type DirectionMode = 'bottom' | 'end' | 'left' | 'right' | 'start' | 'top';
type SelectionMode = 'multiple' | 'none' | 'single';
type SelectionKey = number | string;
type SelectionValue = SelectionKey | Iterable<SelectionKey>;

type MenuItemRecord = {
  ariaLabel?: string,
  children?: MenuItemRecord[],
  disabled?: boolean,
  href?: string,
  id?: number | string,
  isSection?: boolean,
  key?: number | string,
  label?: string,
  rel?: string,
  selectable?: boolean,
  target?: string,
  textValue?: string
};

type NormalizedMenuItem = {
  ariaLabel?: string,
  children: NormalizedMenuItem[],
  disabled: boolean,
  href?: string,
  isSection: boolean,
  key: number | string,
  label: string,
  original: MenuItemRecord | string,
  rel?: string,
  selectable: boolean,
  target?: string
};

function normalizeSelection(value: SelectionValue | undefined): SelectionKey[] {
  if (typeof value === 'number' || typeof value === 'string') {
    return [value];
  }

  if (value == null) {
    return [];
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return [];
  }

  return Array.from(value as Iterable<unknown>).filter((entry): entry is SelectionKey => typeof entry === 'number' || typeof entry === 'string');
}

function isSelectionValue(value: unknown): value is SelectionValue {
  if (typeof value === 'number' || typeof value === 'string') {
    return true;
  }

  if (value == null) {
    return false;
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return false;
  }

  for (let entry of value as Iterable<unknown>) {
    if (typeof entry !== 'number' && typeof entry !== 'string') {
      return false;
    }
  }

  return true;
}

function isSelectionIterable(value: unknown): value is Iterable<SelectionKey> {
  if (value == null) {
    return false;
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return false;
  }

  for (let entry of value as Iterable<unknown>) {
    if (typeof entry !== 'number' && typeof entry !== 'string') {
      return false;
    }
  }

  return true;
}

function normalizeItem(item: MenuItemRecord | string, index: number): NormalizedMenuItem {
  if (typeof item === 'string') {
    return {
      ariaLabel: undefined,
      key: item,
      label: item,
      disabled: false,
      href: undefined,
      isSection: false,
      selectable: true,
      children: [],
      original: item,
      rel: undefined,
      target: undefined
    };
  }

  let key = item.key ?? item.id ?? index;
  let label = item.label ?? item.textValue ?? String(key);

  return {
    ariaLabel: item.ariaLabel,
    key,
    label,
    disabled: !!item.disabled,
    href: item.href,
    isSection: !!item.isSection,
    selectable: item.selectable ?? true,
    children: Array.isArray(item.children)
      ? item.children.map((child, childIndex) => normalizeItem(child, childIndex))
      : [],
    original: item,
    rel: item.rel,
    target: item.target
  };
}

function toBooleanString(value: boolean): 'false' | 'true' {
  return value ? 'true' : 'false';
}

function normalizeKeyArray(value: unknown): SelectionKey[] {
  if (typeof value === 'string' || value == null) {
    return [];
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return [];
  }

  return Array.from(value as Iterable<unknown>).filter((entry): entry is SelectionKey => typeof entry === 'number' || typeof entry === 'string');
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export const Menu = defineComponent({
  name: 'VueMenu',
  inheritAttrs: false,
  props: {
    align: {
      type: String as PropType<AlignMode>,
      default: 'start'
    },
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
    autoFocus: {
      type: [Boolean, String] as PropType<AutoFocusMode | false | undefined>,
      default: undefined
    },
    closeOnSelect: {
      type: Boolean,
      default: true
    },
    defaultOpen: {
      type: Boolean,
      default: false
    },
    defaultSelectedKeys: {
      type: [Array, Set] as PropType<Iterable<number | string>>,
      default: () => []
    },
    direction: {
      type: String as PropType<DirectionMode>,
      default: 'bottom'
    },
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<number | string>>,
      default: () => []
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isExpanded: {
      type: Boolean,
      default: false
    },
    isOpen: {
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
      type: [String, Number, Array, Set] as PropType<SelectionValue | undefined>,
      default: undefined
    },
    openKeys: {
      type: [Array, Set] as PropType<Iterable<number | string>>,
      default: () => []
    },
    shouldFlip: {
      type: Boolean,
      default: true
    },
    shouldFocusWrap: {
      type: Boolean,
      default: true
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'none'
    },
    trigger: {
      type: String,
      default: 'press'
    }
  },
  emits: {
    action: (key: number | string) => typeof key === 'number' || typeof key === 'string',
    dismiss: () => true,
    openChange: (keys: Iterable<SelectionKey>) => isSelectionIterable(keys),
    selectionChange: (value: SelectionValue) => isSelectionValue(value),
    select: (value: SelectionValue) => {
      return isSelectionValue(value);
    },
    'update:modelValue': (value: SelectionValue) => {
      return isSelectionValue(value);
    }
  },
  setup(props, {emit, attrs}) {
    let hoveredKey = ref<number | string | null>(null);
    let focusedKey = ref<number | string | null>(null);
    let focusVisibleKey = ref<number | string | null>(null);
    let keyboardNavigation = ref(false);
    let rootMenuElement = ref<HTMLElement | null>(null);
    let rootWrapperElement = ref<HTMLElement | null>(null);
    let suppressOutsideDismiss = ref(false);
    let suppressOutsideDismissTimeout: ReturnType<typeof setTimeout> | null = null;
    let itemElements = new Map<SelectionKey, HTMLElement>();
    let submenuElements = new Map<SelectionKey, HTMLElement>();
    let internalOpenKeys = ref<SelectionKey[]>(normalizeKeyArray(props.openKeys));
    let internalSelectedKeys = ref<SelectionKey[]>(
      props.modelValue != null
        ? normalizeSelection(props.modelValue)
        : normalizeKeyArray(props.defaultSelectedKeys)
    );

    let normalizedItems = computed(() => props.items.map((item, index) => normalizeItem(item, index)));
    let disabledKeySet = computed(() => new Set(normalizeKeyArray(props.disabledKeys)));
    let selectedSet = computed(() => new Set(internalSelectedKeys.value));
    let openSet = computed(() => new Set(internalOpenKeys.value));
    let isMenuExpanded = computed(() => props.isExpanded || props.isOpen || props.defaultOpen || openSet.value.size > 0);

    watch(() => props.openKeys, (keys) => {
      internalOpenKeys.value = normalizeKeyArray(keys);
    }, {deep: true});

    watch(() => props.modelValue, (value) => {
      if (value == null) {
        return;
      }

      internalSelectedKeys.value = normalizeSelection(value);
    }, {deep: true});

    let emitOpenKeys = (next: Set<SelectionKey>) => {
      let nextKeys = Array.from(next);
      internalOpenKeys.value = nextKeys;
      emit('openChange', new Set(next));
    };

    let onToggleOpen = (key: number | string) => {
      let next = new Set(openSet.value);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      emitOpenKeys(next);
    };

    let onCloseOpenKey = (key: SelectionKey) => {
      if (!openSet.value.has(key)) {
        return;
      }
      let next = new Set(openSet.value);
      next.delete(key);
      emitOpenKeys(next);
    };

    let getDirectMenuItems = (menuElement: HTMLElement): HTMLElement[] => {
      let directItems: HTMLElement[] = [];

      let pushItemFromNode = (node: Element | null) => {
        if (node instanceof HTMLElement && node.classList.contains('vs-spectrum-menu__item')) {
          directItems.push(node);
        }
      };

      for (let childNode of Array.from(menuElement.children)) {
        if (!(childNode instanceof HTMLElement)) {
          continue;
        }
        if (childNode.classList.contains('vs-spectrum-menu__item')) {
          pushItemFromNode(childNode);
          continue;
        }
        if (!childNode.classList.contains('vs-spectrum-menu__item-wrapper')) {
          if (!childNode.classList.contains('vs-spectrum-menu__section')) {
            continue;
          }

          for (let sectionChild of Array.from(childNode.children)) {
            if (!(sectionChild instanceof HTMLElement)) {
              continue;
            }

            if (sectionChild.classList.contains('vs-spectrum-menu__item')) {
              pushItemFromNode(sectionChild);
              continue;
            }

            if (!sectionChild.classList.contains('vs-spectrum-menu__item-wrapper')) {
              continue;
            }

            let sectionNestedItem = sectionChild.querySelector(':scope > .vs-spectrum-menu__item');
            pushItemFromNode(sectionNestedItem);
          }

          continue;
        }

        let nestedItem = childNode.querySelector(':scope > .vs-spectrum-menu__item');
        pushItemFromNode(nestedItem);
      }
      return directItems;
    };

    let getEnabledMenuItems = (menuElement: HTMLElement): HTMLElement[] => {
      return getDirectMenuItems(menuElement).filter((menuItem) => menuItem.getAttribute('aria-disabled') !== 'true');
    };

    let focusFirstEnabledItem = (menuElement: HTMLElement | null) => {
      if (!menuElement) {
        return;
      }
      let enabledItems = getEnabledMenuItems(menuElement);
      enabledItems[0]?.focus();
    };

    let focusLastEnabledItem = (menuElement: HTMLElement | null) => {
      if (!menuElement) {
        return;
      }
      let enabledItems = getEnabledMenuItems(menuElement);
      enabledItems[enabledItems.length - 1]?.focus();
    };

    let focusInitialItem = () => {
      if (props.autoFocus === false || props.autoFocus == null) {
        return;
      }

      nextTick(() => {
        if (props.autoFocus === 'last') {
          focusLastEnabledItem(rootMenuElement.value);
          return;
        }
        focusFirstEnabledItem(rootMenuElement.value);
      });
    };

    let moveFocusByOffset = (currentElement: HTMLElement, offset: -1 | 1) => {
      let menuElement = currentElement.closest('[role="menu"]');
      if (!(menuElement instanceof HTMLElement)) {
        return;
      }

      let enabledItems = getEnabledMenuItems(menuElement);
      if (enabledItems.length === 0) {
        return;
      }

      let currentIndex = enabledItems.indexOf(currentElement);
      if (currentIndex === -1) {
        if (offset === 1) {
          enabledItems[0]?.focus();
        } else {
          enabledItems[enabledItems.length - 1]?.focus();
        }
        return;
      }

      let nextIndex = currentIndex + offset;
      if (props.shouldFocusWrap) {
        nextIndex = (nextIndex + enabledItems.length) % enabledItems.length;
      } else {
        nextIndex = Math.min(enabledItems.length - 1, Math.max(0, nextIndex));
      }

      enabledItems[nextIndex]?.focus();
    };

    let scheduleSuppressOutsideDismiss = () => {
      suppressOutsideDismiss.value = true;
      if (suppressOutsideDismissTimeout != null) {
        clearTimeout(suppressOutsideDismissTimeout);
      }
      suppressOutsideDismissTimeout = setTimeout(() => {
        suppressOutsideDismiss.value = false;
        suppressOutsideDismissTimeout = null;
      }, 0);
    };

    let setItemRef = (key: SelectionKey, element: Element | null) => {
      if (element instanceof HTMLElement) {
        itemElements.set(key, element);
        return;
      }
      itemElements.delete(key);
    };

    let setSubmenuRef = (key: SelectionKey, element: Element | null) => {
      if (element instanceof HTMLElement) {
        submenuElements.set(key, element);
        return;
      }
      submenuElements.delete(key);
    };

    onMounted(() => {
      if (isMenuExpanded.value) {
        scheduleSuppressOutsideDismiss();
      }
      focusInitialItem();
    });

    let onDocumentKeydown = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey && !event.altKey) {
        keyboardNavigation.value = true;
      }

      if (event.defaultPrevented || event.key !== 'Escape' || !isMenuExpanded.value) {
        return;
      }

      event.preventDefault();
      emitOpenKeys(new Set<SelectionKey>());
      emit('dismiss');
    };

    onMounted(() => {
      document.addEventListener('keydown', onDocumentKeydown);
    });

    let onDocumentPointer = () => {
      keyboardNavigation.value = false;
    };

    let onDocumentClick = (event: Event) => {
      if (!isMenuExpanded.value) {
        return;
      }

      if (suppressOutsideDismiss.value) {
        return;
      }

      let target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (rootWrapperElement.value?.contains(target)) {
        return;
      }

      emitOpenKeys(new Set<SelectionKey>());
      emit('dismiss');
    };

    onMounted(() => {
      document.addEventListener('mousedown', onDocumentPointer, true);
      document.addEventListener('pointerdown', onDocumentPointer, true);
      document.addEventListener('touchstart', onDocumentPointer, true);
      document.addEventListener('click', onDocumentClick);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onDocumentKeydown);
      document.removeEventListener('mousedown', onDocumentPointer, true);
      document.removeEventListener('pointerdown', onDocumentPointer, true);
      document.removeEventListener('touchstart', onDocumentPointer, true);
      document.removeEventListener('click', onDocumentClick);
      if (suppressOutsideDismissTimeout != null) {
        clearTimeout(suppressOutsideDismissTimeout);
      }
    });

    watch(isMenuExpanded, (next, previous) => {
      if (next && !previous) {
        scheduleSuppressOutsideDismiss();
        focusInitialItem();
      }
    });

    let onSelect = (item: NormalizedMenuItem) => {
      emit('action', item.key);

      if (props.selectionMode === 'none' || props.isDisabled || item.disabled || disabledKeySet.value.has(item.key) || !item.selectable) {
        emit('select', item.key);
        return;
      }

      if (props.selectionMode === 'single') {
        internalSelectedKeys.value = [item.key];
        emit('update:modelValue', item.key);
        emit('select', item.key);
        emit('selectionChange', item.key);
        if (props.closeOnSelect && internalOpenKeys.value.length > 0) {
          internalOpenKeys.value = [];
          emit('openChange', new Set<SelectionKey>());
        }
        return;
      }

      let next = new Set(selectedSet.value);
      if (next.has(item.key)) {
        next.delete(item.key);
      } else {
        next.add(item.key);
      }

      let values = Array.from(next);
      internalSelectedKeys.value = values;
      emit('update:modelValue', new Set(next));
      emit('select', new Set(next));
      emit('selectionChange', new Set(next));
      if (props.closeOnSelect && internalOpenKeys.value.length > 0) {
        internalOpenKeys.value = [];
        emit('openChange', new Set<SelectionKey>());
      }
    };

    let renderItem = (item: NormalizedMenuItem, parentKey?: SelectionKey): VNode => {
      if (item.isSection) {
        let headingId = `vs-spectrum-menu-section-heading-${String(item.key)}`;
        let hasVisibleHeading = item.label.trim().length > 0;

        return h('div', {
          key: `section-${String(item.key)}`,
          class: [classNames(menuStyles, 'spectrum-Menu-section'), 'vs-spectrum-menu__section'],
          role: 'presentation',
          'aria-label': !hasVisibleHeading ? item.ariaLabel || undefined : undefined,
          'aria-labelledby': hasVisibleHeading ? headingId : undefined
        }, [
          hasVisibleHeading
            ? h('div', {
              id: headingId,
              class: [classNames(menuStyles, 'spectrum-Menu-sectionHeading'), 'vs-spectrum-menu__section-heading'],
              role: 'presentation'
            }, item.label)
            : null,
          ...item.children.map((child) => renderItem(child, parentKey))
        ]);
      }

      let hasChildren = item.children.length > 0;
      let isDisabled = props.isDisabled || item.disabled || disabledKeySet.value.has(item.key);
      let isSelected = selectedSet.value.has(item.key);
      let isHovered = hoveredKey.value === item.key && !isDisabled;
      let isFocused = focusedKey.value === item.key && !isDisabled;
      let isFocusVisible = focusVisibleKey.value === item.key && !isDisabled;
      let isOpen = openSet.value.has(item.key);
      let isSelectable = props.selectionMode !== 'none' && !hasChildren && item.selectable;

      let role = 'menuitem';
      if (isSelectable) {
        role = props.selectionMode === 'multiple' ? 'menuitemcheckbox' : 'menuitemradio';
      }

      let isLinkItem = !hasChildren && typeof item.href === 'string' && item.href.length > 0;
      let linkRel = item.rel || (item.target === '_blank' ? 'noopener noreferrer' : undefined);
      let interactiveTag = isLinkItem ? 'a' : 'div';

      let onActivate = (event: MouseEvent | KeyboardEvent) => {
        if (isDisabled) {
          event.preventDefault();
          return;
        }

        if (hasChildren) {
          onToggleOpen(item.key);
          return;
        }
        onSelect(item);
      };

      let menuItemNode = h(interactiveTag, {
        key: String(item.key),
        role,
        ref: (element: Element | null) => {
          setItemRef(item.key, element);
        },
        'data-key': String(item.key),
          class: [
            classNames(
              menuStyles,
              'spectrum-Menu-item',
              {
              'focus-ring': isFocusVisible,
              'is-disabled': isDisabled,
              'is-hovered': isHovered,
              'is-open': isOpen,
              'is-selectable': isSelectable,
              'is-selected': isSelected
              }
            ),
            'vs-spectrum-menu__item'
          ],
        href: isLinkItem ? item.href : undefined,
        target: isLinkItem ? item.target : undefined,
        rel: isLinkItem ? linkRel : undefined,
        tabindex: isLinkItem || isDisabled ? undefined : 0,
        'aria-label': typeof item.original === 'string' ? item.label : item.original.ariaLabel || item.label,
        'aria-disabled': isDisabled ? 'true' : undefined,
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
          if (keyboardNavigation.value) {
            focusVisibleKey.value = item.key;
          }
        },
        onBlur: () => {
          if (focusedKey.value === item.key) {
            focusedKey.value = null;
          }
          if (focusVisibleKey.value === item.key) {
            focusVisibleKey.value = null;
          }
        },
        onClick: (event: MouseEvent) => {
          onActivate(event);
        },
        onKeydown: (event: KeyboardEvent) => {
          keyboardNavigation.value = true;
          let currentTarget = event.currentTarget;
          let currentElement = currentTarget instanceof HTMLElement ? currentTarget : null;

          if (event.key === 'ArrowDown' && currentElement) {
            event.preventDefault();
            moveFocusByOffset(currentElement, 1);
            return;
          }

          if (event.key === 'ArrowUp' && currentElement) {
            event.preventDefault();
            moveFocusByOffset(currentElement, -1);
            return;
          }

          if (event.key === 'Home') {
            event.preventDefault();
            let menuElement = currentElement?.closest('[role="menu"]');
            focusFirstEnabledItem(menuElement instanceof HTMLElement ? menuElement : null);
            return;
          }

          if (event.key === 'End') {
            event.preventDefault();
            let menuElement = currentElement?.closest('[role="menu"]');
            focusLastEnabledItem(menuElement instanceof HTMLElement ? menuElement : null);
            return;
          }

          if ((event.key === 'ArrowRight' || event.key === 'Right') && hasChildren && !isDisabled) {
            event.preventDefault();
            if (!openSet.value.has(item.key)) {
              onToggleOpen(item.key);
            }
            nextTick(() => {
              focusFirstEnabledItem(submenuElements.get(item.key) ?? null);
            });
            return;
          }

          if ((event.key === 'ArrowLeft' || event.key === 'Left') && parentKey != null) {
            event.preventDefault();
            onCloseOpenKey(parentKey);
            nextTick(() => {
              itemElements.get(parentKey)?.focus();
            });
            return;
          }

          if (event.key === 'Escape' && parentKey != null) {
            event.preventDefault();
            onCloseOpenKey(parentKey);
            nextTick(() => {
              itemElements.get(parentKey)?.focus();
            });
            return;
          }

          if (event.key === 'Escape' && parentKey == null) {
            event.preventDefault();
            emitOpenKeys(new Set<SelectionKey>());
            emit('dismiss');
            return;
          }

          if (isLinkItem) {
            return;
          }
          if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') {
            return;
          }
          event.preventDefault();
          onActivate(event);
        }
      }, [
        h('div', {
          class: [classNames(menuStyles, 'spectrum-Menu-itemGrid'), 'vs-spectrum-menu__item-grid']
        }, [
          h('span', {
            class: [
              classNames(menuStyles, 'spectrum-Menu-itemLabel'),
              'vs-spectrum-menu__item-label'
            ]
          }, item.label),
          hasChildren
            ? h('span', {
              class: [classNames(menuStyles, 'spectrum-Menu-chevron'), 'vs-spectrum-menu__item-chevron'],
              'aria-hidden': 'true'
            }, '›')
            : null
        ])
      ]);

      if (!hasChildren) {
        return menuItemNode;
      }

      return h('div', {
        key: `${String(item.key)}-submenu`,
        class: ['vs-spectrum-menu__item-wrapper']
      }, [
        menuItemNode,
        h('div', {
          class: [classNames(menuStyles, 'spectrum-Submenu-wrapper'), 'vs-spectrum-menu__submenu'],
          hidden: !isOpen,
          'aria-hidden': isOpen ? 'false' : 'true'
        }, [
          h('div', {
            class: [classNames(menuStyles, 'spectrum-Menu'), classNames(menuStyles, 'spectrum-Menu-popover'), 'vs-spectrum-menu__submenu-list'],
            role: 'menu',
            ref: (element: Element | null) => {
              setSubmenuRef(item.key, element);
            },
            'aria-label': item.label
          }, item.children.map((child) => renderItem(child, item.key)))
        ])
      ]);
    };

    return () => {
      let wrapperExpanded = isMenuExpanded.value;
      let autoFocusValue = props.autoFocus === true
        ? 'true'
        : typeof props.autoFocus === 'string'
          ? props.autoFocus
          : undefined;

      return h('div', {
        ...attrs,
        ref: (element: Element | null) => {
          rootWrapperElement.value = element instanceof HTMLElement ? element : null;
        },
        class: [
          classNames(
            menuStyles,
            'spectrum-Menu-wrapper',
            {
              'is-expanded': wrapperExpanded,
              'spectrum-Menu-wrapper--isMobile': false
            }
          ),
          'vs-spectrum-menu',
          attrs.class
        ],
        role: 'dialog',
        'aria-hidden': wrapperExpanded ? 'false' : 'true',
        'aria-label': props.ariaLabel || attrs['aria-label'] || props.label || undefined,
        'aria-labelledby': props.ariaLabelledby || attrs['aria-labelledby'],
        'data-align': props.align,
        'data-auto-focus': autoFocusValue,
        'data-close-on-select': toBooleanString(props.closeOnSelect),
        'data-direction': props.direction,
        'data-open': wrapperExpanded ? 'true' : 'false',
        'data-should-flip': toBooleanString(props.shouldFlip),
        'data-should-focus-wrap': toBooleanString(props.shouldFocusWrap),
        'data-testid': props.dataTestid || attrs['data-testid'],
        'data-trigger': props.trigger,
        'data-vac': ''
      }, [
        h('div', {
          class: [classNames(menuStyles, 'spectrum-Submenu-wrapper'), 'vs-spectrum-menu__wrapper'],
          role: 'presentation'
        }, [
          h('div', {
            class: [
              classNames(menuStyles, 'spectrum-Menu'),
              classNames(contextualHelpStyles, 'spectrum-Menu'),
              classNames(menuStyles, 'spectrum-Menu-popover'),
              'vs-spectrum-menu__items'
            ],
            role: 'menu',
            ref: (element: Element | null) => {
              rootMenuElement.value = element instanceof HTMLElement ? element : null;
            },
            'aria-label': props.ariaLabel || attrs['aria-label'] || props.label || undefined,
            'aria-labelledby': props.ariaLabelledby || attrs['aria-labelledby']
          }, normalizedItems.value.map((item) => renderItem(item)))
        ]),
        h('div', {
          hidden: true,
          'aria-hidden': 'true',
          class: 'vs-spectrum-menu__hidden-state'
        })
      ]);
    };
  }
});

let menuTriggerId = 0;

export const MenuTrigger = defineComponent({
  name: 'VueMenuTrigger',
  inheritAttrs: false,
  props: {
    align: {
      type: String as PropType<AlignMode>,
      default: 'start'
    },
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
    autoFocus: {
      type: [Boolean, String] as PropType<AutoFocusMode | false | undefined>,
      default: undefined
    },
    closeOnSelect: {
      type: Boolean,
      default: true
    },
    defaultOpen: {
      type: Boolean,
      default: false
    },
    defaultSelectedKeys: {
      type: [Array, Set] as PropType<Iterable<number | string>>,
      default: () => []
    },
    direction: {
      type: String as PropType<DirectionMode>,
      default: 'bottom'
    },
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<number | string>>,
      default: () => []
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isExpanded: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isOpen: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
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
      type: [String, Number, Array, Set] as PropType<SelectionValue | undefined>,
      default: undefined
    },
    openKeys: {
      type: [Array, Set] as PropType<Iterable<number | string>>,
      default: () => []
    },
    shouldFlip: {
      type: Boolean,
      default: true
    },
    shouldFocusWrap: {
      type: Boolean,
      default: true
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'none'
    },
    trigger: {
      type: String,
      default: 'press'
    }
  },
  emits: {
    action: (key: number | string) => typeof key === 'number' || typeof key === 'string',
    dismiss: () => true,
    menuOpenChange: (keys: Iterable<SelectionKey>) => isSelectionIterable(keys),
    openChange: (isOpen: boolean) => isBoolean(isOpen),
    select: (value: SelectionValue) => isSelectionValue(value),
    'update:modelValue': (value: SelectionValue) => isSelectionValue(value)
  },
  setup(props, {attrs, emit, slots}) {
    let menuId = `vs-spectrum-menu-trigger-${++menuTriggerId}`;
    let uncontrolledOpen = ref(Boolean(props.defaultOpen));
    let triggerAnchorElement = ref<HTMLElement | null>(null);
    let menuAutoFocusOverride = ref<AutoFocusMode | false | undefined>(undefined);

    let isOpenControlled = computed(() => typeof props.isOpen === 'boolean' || typeof props.isExpanded === 'boolean');
    let resolvedControlledOpen = computed<boolean | undefined>(() => {
      if (typeof props.isOpen === 'boolean') {
        return props.isOpen;
      }

      if (typeof props.isExpanded === 'boolean') {
        return props.isExpanded;
      }

      return undefined;
    });

    let isExpanded = computed(() => {
      if (isOpenControlled.value) {
        return Boolean(resolvedControlledOpen.value);
      }

      return uncontrolledOpen.value;
    });

    let resolvedMenuAutoFocus = computed<AutoFocusMode | false | undefined>(() => {
      if (menuAutoFocusOverride.value != null) {
        return menuAutoFocusOverride.value;
      }

      if (props.autoFocus !== undefined) {
        return props.autoFocus;
      }

      // Do not force focus on pointer-open unless explicitly requested.
      return undefined;
    });

    let setOpenState = (next: boolean) => {
      emit('openChange', next);
      if (!isOpenControlled.value) {
        uncontrolledOpen.value = next;
      }
    };

    let focusTrigger = () => {
      nextTick(() => {
        let triggerElement = triggerAnchorElement.value?.querySelector('button, [role="button"], [tabindex]') as HTMLElement | null | undefined;
        triggerElement?.focus();
      });
    };

    let getEnabledTopLevelMenuItems = (): HTMLElement[] => {
      let root = triggerAnchorElement.value?.parentElement;
      let menuRoot = root?.querySelector('.vs-spectrum-menu__items');
      if (!(menuRoot instanceof HTMLElement)) {
        return [];
      }

      let directItems: HTMLElement[] = [];
      for (let childNode of Array.from(menuRoot.children)) {
        if (!(childNode instanceof HTMLElement)) {
          continue;
        }

        if (childNode.classList.contains('vs-spectrum-menu__item')) {
          directItems.push(childNode);
          continue;
        }

        if (!childNode.classList.contains('vs-spectrum-menu__item-wrapper')) {
          continue;
        }

        let nestedItem = childNode.querySelector(':scope > .vs-spectrum-menu__item');
        if (nestedItem instanceof HTMLElement) {
          directItems.push(nestedItem);
        }
      }

      return directItems.filter((item) => item.getAttribute('aria-disabled') !== 'true');
    };

    let focusTopLevelMenuBoundary = (strategy: 'first' | 'last') => {
      nextTick(() => {
        let items = getEnabledTopLevelMenuItems();
        if (items.length === 0) {
          return;
        }

        if (strategy === 'last') {
          items[items.length - 1]?.focus();
          return;
        }

        items[0]?.focus();
      });
    };

    let closeMenu = ({restoreFocus = false}: {restoreFocus?: boolean} = {}) => {
      if (!isExpanded.value) {
        return;
      }

      setOpenState(false);
      if (restoreFocus) {
        focusTrigger();
      }
    };

    let openMenu = (focusStrategy: AutoFocusMode | false | undefined = undefined) => {
      if (props.isDisabled) {
        return;
      }

      menuAutoFocusOverride.value = focusStrategy;
      if (!isExpanded.value) {
        setOpenState(true);
        if (focusStrategy === 'first' || focusStrategy === 'last') {
          focusTopLevelMenuBoundary(focusStrategy);
        }
        return;
      }

      if (focusStrategy === 'first' || focusStrategy === 'last') {
        focusTopLevelMenuBoundary(focusStrategy);
      }
    };

    let toggleMenu = () => {
      if (props.isDisabled) {
        return;
      }

      if (isExpanded.value) {
        closeMenu();
        return;
      }

      openMenu(props.autoFocus);
    };

    let onTriggerClick = () => {
      toggleMenu();
    };

    let onTriggerKeydown = (event: KeyboardEvent) => {
      if (props.isDisabled) {
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'Down') {
        event.preventDefault();
        openMenu('first');
        return;
      }

      if (event.key === 'ArrowUp' || event.key === 'Up') {
        event.preventDefault();
        openMenu('last');
      }
    };

    let onMenuAction = (key: SelectionKey) => {
      emit('action', key);
      if (props.closeOnSelect !== false) {
        closeMenu({restoreFocus: true});
      }
    };

    let onMenuDismiss = () => {
      closeMenu({restoreFocus: true});
      emit('dismiss');
    };

    let onMenuOpenChange = (keys: Iterable<SelectionKey>) => {
      emit('menuOpenChange', keys);
    };

    let rootTriggerWrapperContains = (target: EventTarget | null) => {
      return target instanceof Node && triggerAnchorElement.value?.parentElement?.contains(target);
    };

    let onDocumentFocusIn = (event: FocusEvent) => {
      if (!isExpanded.value || rootTriggerWrapperContains(event.target)) {
        return;
      }

      closeMenu();
    };

    let shouldPreventDocumentScroll = (event: Event) => {
      if (!isExpanded.value) {
        return false;
      }

      let target = event.target;
      return !(target instanceof Node && triggerAnchorElement.value?.parentElement?.contains(target));
    };

    let onDocumentWheel = (event: WheelEvent) => {
      if (!shouldPreventDocumentScroll(event)) {
        return;
      }

      event.preventDefault();
    };

    let onDocumentTouchMove = (event: TouchEvent) => {
      if (!shouldPreventDocumentScroll(event)) {
        return;
      }

      event.preventDefault();
    };

    onMounted(() => {
      document.addEventListener('focusin', onDocumentFocusIn);
      document.addEventListener('wheel', onDocumentWheel, {capture: true, passive: false});
      document.addEventListener('touchmove', onDocumentTouchMove, {capture: true, passive: false});
    });

    onBeforeUnmount(() => {
      document.removeEventListener('focusin', onDocumentFocusIn);
      document.removeEventListener('wheel', onDocumentWheel, {capture: true});
      document.removeEventListener('touchmove', onDocumentTouchMove, {capture: true});
    });

    watch(isExpanded, (next) => {
      if (!next) {
        menuAutoFocusOverride.value = undefined;
        return;
      }

      nextTick(() => {
        menuAutoFocusOverride.value = undefined;
      });
    });

    let menuSurfaceStyle = computed<Record<string, string>>(() => {
      let triggerRect = triggerAnchorElement.value?.getBoundingClientRect();
      if (!triggerRect) {
        return {
          position: 'absolute',
          zIndex: '1'
        };
      }

      let style: Record<string, string> = {
        left: `${triggerRect.left}px`,
        position: 'fixed',
        top: `${triggerRect.bottom + 4}px`,
        transform: 'translateX(0) translateY(0)',
        zIndex: '1'
      };

      if (props.direction === 'top') {
        style.top = `${triggerRect.top - 4}px`;
        style.transform = props.align === 'end'
          ? 'translateX(-100%) translateY(-100%)'
          : 'translateX(0) translateY(-100%)';
        if (props.align === 'end') {
          style.left = `${triggerRect.right}px`;
        }
        return style;
      }

      if (props.direction === 'left' || props.direction === 'start') {
        style.left = `${triggerRect.left - 4}px`;
        style.top = props.align === 'end' ? `${triggerRect.bottom}px` : `${triggerRect.top}px`;
        style.transform = props.align === 'end'
          ? 'translateX(-100%) translateY(-100%)'
          : 'translateX(-100%) translateY(0)';
        return style;
      }

      if (props.direction === 'right' || props.direction === 'end') {
        style.left = `${triggerRect.right + 4}px`;
        style.top = props.align === 'end' ? `${triggerRect.bottom}px` : `${triggerRect.top}px`;
        style.transform = props.align === 'end'
          ? 'translateX(0) translateY(-100%)'
          : 'translateX(0) translateY(0)';
        return style;
      }

      style.top = `${triggerRect.bottom + 4}px`;
      style.transform = props.align === 'end'
        ? 'translateX(-100%) translateY(0)'
        : 'translateX(0) translateY(0)';
      if (props.align === 'end') {
        style.left = `${triggerRect.right}px`;
      }
      return style;
    });

    return () => {
      let rootAttrs: Record<string, unknown> = {...attrs};
      delete rootAttrs.class;
      delete rootAttrs.style;

      let triggerSlotContent = slots.trigger?.({
        isOpen: isExpanded.value,
        toggle: toggleMenu
      }) ?? [
        h('button', {
          type: 'button',
          disabled: props.isDisabled,
          'aria-label': 'Menu Button'
        }, 'Menu Button')
      ];

      return h('div', {
        ...rootAttrs,
        class: ['vs-spectrum-menu-trigger', attrs.class],
        style: [
          {
            display: 'inline-grid',
            justifyItems: 'start',
            position: 'relative'
          },
          attrs.style as unknown
        ]
      }, [
        h('span', {
          ref: (element: Element | null) => {
            triggerAnchorElement.value = element instanceof HTMLElement ? element : null;
          },
          class: 'vs-spectrum-menu-trigger__anchor',
          role: 'presentation',
          'aria-haspopup': 'menu',
          'aria-expanded': isExpanded.value ? 'true' : 'false',
          'aria-controls': isExpanded.value ? menuId : undefined,
          onClick: onTriggerClick,
          onKeydown: onTriggerKeydown
        }, triggerSlotContent),
        isExpanded.value
          ? h('div', {
            class: 'vs-spectrum-menu-trigger__overlay',
            style: menuSurfaceStyle.value
          }, [
            h(Menu, {
              align: props.align,
              ariaLabel: props.ariaLabel,
              ariaLabelledby: props.ariaLabelledby,
              autoFocus: resolvedMenuAutoFocus.value,
              closeOnSelect: props.closeOnSelect,
              dataTestid: props.dataTestid,
              defaultSelectedKeys: props.defaultSelectedKeys,
              direction: props.direction,
              disabledKeys: props.disabledKeys,
              id: menuId,
              isDisabled: props.isDisabled,
              isExpanded: true,
              items: props.items,
              label: props.label,
              modelValue: props.modelValue,
              openKeys: props.openKeys,
              selectionMode: props.selectionMode,
              shouldFlip: props.shouldFlip,
              shouldFocusWrap: props.shouldFocusWrap,
              trigger: props.trigger,
              onAction: onMenuAction,
              onDismiss: onMenuDismiss,
              onOpenChange: onMenuOpenChange,
              onSelect: (value: SelectionValue) => {
                emit('select', value);
              },
              'onUpdate:modelValue': (value: SelectionValue) => {
                emit('update:modelValue', value);
              }
            })
          ])
          : null
      ]);
    };
  }
});

export const VueMenu = Menu;
export const ActionMenu = defineComponent({
  name: 'VueActionMenu',
  inheritAttrs: false,
  props: {
    align: {
      type: String as PropType<AlignMode>,
      default: 'start'
    },
    ariaLabel: {
      type: String,
      default: ''
    },
    ariaLabelledby: {
      type: String,
      default: ''
    },
    autoFocus: {
      type: [Boolean, String] as PropType<AutoFocusMode | false | undefined>,
      default: undefined
    },
    closeOnSelect: {
      type: Boolean,
      default: true
    },
    dataTestid: {
      type: String,
      default: 'menu-wrapper'
    },
    defaultOpen: {
      type: Boolean,
      default: false
    },
    defaultSelectedKeys: {
      type: [Array, Set] as PropType<Iterable<number | string>>,
      default: () => []
    },
    direction: {
      type: String as PropType<DirectionMode>,
      default: 'bottom'
    },
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<number | string>>,
      default: () => []
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isOpen: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isQuiet: {
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
      type: [String, Number, Array, Set] as PropType<SelectionValue | undefined>,
      default: undefined
    },
    openKeys: {
      type: [Array, Set] as PropType<Iterable<number | string>>,
      default: () => []
    },
    shouldFlip: {
      type: Boolean,
      default: true
    },
    shouldFocusWrap: {
      type: Boolean,
      default: true
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'none'
    },
    trigger: {
      type: String,
      default: 'press'
    }
  },
  emits: {
    action: (key: number | string) => typeof key === 'number' || typeof key === 'string',
    dismiss: () => true,
    menuOpenChange: (keys: Iterable<SelectionKey>) => isSelectionIterable(keys),
    openChange: (isOpen: boolean) => isBoolean(isOpen),
    select: (value: SelectionValue) => isSelectionValue(value),
    'update:modelValue': (value: SelectionValue) => isSelectionValue(value)
  },
  setup(props, {attrs, emit, slots}) {
    let triggerAriaLabel = computed(() => props.ariaLabel || attrs['aria-label'] || 'More actions');

    return () => h(MenuTrigger, {
      align: props.align,
      ariaLabel: props.ariaLabel,
      ariaLabelledby: props.ariaLabelledby,
      autoFocus: props.autoFocus,
      closeOnSelect: props.closeOnSelect,
      dataTestid: props.dataTestid,
      defaultOpen: props.defaultOpen,
      defaultSelectedKeys: props.defaultSelectedKeys,
      direction: props.direction,
      disabledKeys: props.disabledKeys,
      isDisabled: props.isDisabled,
      isOpen: props.isOpen,
      items: props.items,
      label: props.label,
      modelValue: props.modelValue,
      openKeys: props.openKeys,
      selectionMode: props.selectionMode,
      shouldFlip: props.shouldFlip,
      shouldFocusWrap: props.shouldFocusWrap,
      trigger: props.trigger,
      onAction: (key: SelectionKey) => {
        emit('action', key);
      },
      onDismiss: () => {
        emit('dismiss');
      },
      onMenuOpenChange: (keys: Iterable<SelectionKey>) => {
        emit('menuOpenChange', keys);
      },
      onOpenChange: (isOpen: boolean) => {
        emit('openChange', isOpen);
      },
      onSelect: (value: SelectionValue) => {
        emit('select', value);
      },
      'onUpdate:modelValue': (value: SelectionValue) => {
        emit('update:modelValue', value);
      }
    }, {
      trigger: (slotProps: {isOpen: boolean, toggle: () => void}) => (
        slots.trigger?.(slotProps) ?? [
          h(ActionButton, {
            autoFocus: props.autoFocus === true,
            isDisabled: props.isDisabled,
            isQuiet: props.isQuiet,
            id: attrs.id as string | undefined,
            'aria-label': triggerAriaLabel.value
          }, {
            default: () => [h(More)]
          })
        ]
      )
    });
  }
});

function createMenuTriggerProxy(name: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, {attrs, slots}) {
      return () => h(MenuTrigger, {
        ...attrs
      }, slots);
    }
  });
}

export const SubmenuTrigger = createMenuTriggerProxy('VueSubmenuTrigger');
export const ContextualHelpTrigger = createMenuTriggerProxy('VueContextualHelpTrigger');
export {Item, Section};

export type SpectrumMenuProps<T = unknown> = Record<string, unknown> & {
  item?: T
};
export type SpectrumActionMenuProps<T = unknown> = SpectrumMenuProps<T>;
export type SpectrumMenuTriggerProps = SpectrumMenuProps;
export type SpectrumMenuDialogTriggerProps = SpectrumMenuProps;
export type SpectrumSubmenuTriggerProps<T = unknown> = SpectrumMenuProps<T>;
