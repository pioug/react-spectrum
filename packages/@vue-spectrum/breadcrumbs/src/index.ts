import '@adobe/spectrum-css-temp/components/breadcrumb/vars.css';
import '@adobe/spectrum-css-temp/components/button/vars.css';
import '@adobe/spectrum-css-temp/components/menu/vars.css';
import {Item, Section} from '@vue-stately/collections';
import {classNames, filterDOMProps} from '@vue-spectrum/utils';
import {
  Comment,
  computed,
  defineComponent,
  Fragment,
  h,
  isVNode,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  type PropType,
  ref,
  type VNode,
  watch
} from 'vue';

const styles: {[key: string]: string} = {};
const buttonStyles: {[key: string]: string} = {};
const menuStyles: {[key: string]: string} = {};

const MIN_VISIBLE_ITEMS = 1;
const MAX_VISIBLE_ITEMS = 4;

const FOLDER_BREADCRUMB_PATH = 'M16.5 4l-7.166.004-1.652-1.7A1 1 0 0 0 6.965 2H2a1 1 0 0 0-1 1v11.5a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-.5-.5zM2 3h4.965l1.943 2H2zm10.354 5.854l-3 3a.5.5 0 0 1-.707 0l-3-3a.5.5 0 0 1 .707-.707L9 10.793l2.646-2.646a.5.5 0 0 1 .707.707z';
const CHEVRON_RIGHT_SMALL_PATH = 'M5.5 4a.747.747 0 0 0-.22-.53C4.703 2.862 3.242 1.5 2.04.23A.75.75 0 1 0 .98 1.29L3.69 4 .98 6.71a.75.75 0 1 0 1.06 1.06l3.24-3.24A.747.747 0 0 0 5.5 4z';

type BreadcrumbItemInput = string | {
  children?: string,
  href?: string,
  id?: string | number,
  key?: string | number,
  label?: string,
  rel?: string,
  target?: string
};

type BreadcrumbSize = 'L' | 'M' | 'S';
type NormalizedBreadcrumbItem = {
  href?: string,
  key: string,
  label: string,
  rel?: string,
  target?: string
};

type OverflowMenuItem = {
  items: NormalizedBreadcrumbItem[],
  key: 'menu',
  selectedKey: string,
  type: 'menu'
};

type RenderedBreadcrumbItem = NormalizedBreadcrumbItem | OverflowMenuItem;
type ChildItem = BreadcrumbItemInput | string;
type FlattenedVNodes = VNode[];

function toChildArray(children: unknown): unknown[] {
  if (children == null || typeof children === 'boolean') {
    return [];
  }

  if (Array.isArray(children)) {
    return children;
  }

  if (typeof children === 'function') {
    return toChildArray(children());
  }

  if (typeof children === 'object') {
    let defaultSlot = (children as {default?: () => unknown}).default;
    if (typeof defaultSlot === 'function') {
      return toChildArray(defaultSlot());
    }
  }

  return [children];
}

function flattenChildren(nodes: unknown[]): FlattenedVNodes {
  let result: FlattenedVNodes = [];

  for (let node of nodes) {
    if (Array.isArray(node)) {
      result.push(...flattenChildren(node));
      continue;
    }

    if (!isVNode(node) || node.type === Comment) {
      continue;
    }

    if (node.type === Fragment) {
      result.push(...flattenChildren(toChildArray(node.children)));
      continue;
    }

    result.push(node);
  }

  return result;
}

function getNodeText(node: unknown): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((child) => getNodeText(child)).join('');
  }

  if (!isVNode(node)) {
    if (typeof node === 'function') {
      return getNodeText(node());
    }

    if (node && typeof node === 'object') {
      let defaultSlot = (node as {default?: () => unknown}).default;
      if (typeof defaultSlot === 'function') {
        return getNodeText(defaultSlot());
      }
    }

    return '';
  }

  return getNodeText(toChildArray(node.children));
}

function normalizeChildItems(children: unknown[]): ChildItem[] {
  let items: ChildItem[] = [];

  for (let child of flattenChildren(children)) {
    let itemProps = (child.props ?? {}) as Record<string, unknown>;

    if (child.type === Section) {
      items.push(...normalizeChildItems(toChildArray(child.children)));
      continue;
    }

    if (child.type !== Item) {
      continue;
    }

    let label = getNodeText(toChildArray(child.children)).trim();
    let fallbackKey = child.key ?? itemProps.id ?? itemProps.key;
    let textValue = typeof itemProps.textValue === 'string' ? itemProps.textValue : '';

    items.push({
      children: label,
      href: typeof itemProps.href === 'string' ? itemProps.href : undefined,
      id: fallbackKey != null ? String(fallbackKey) : undefined,
      key: fallbackKey != null ? String(fallbackKey) : undefined,
      label: label || textValue,
      rel: typeof itemProps.rel === 'string' ? itemProps.rel : undefined,
      target: typeof itemProps.target === 'string' ? itemProps.target : undefined
    });
  }

  return items;
}

function normalizeBreadcrumbItem(item: BreadcrumbItemInput, index: number): NormalizedBreadcrumbItem {
  if (typeof item === 'string') {
    return {
      key: item,
      label: item
    };
  }

  let fallbackLabel = item.id != null ? String(item.id) : `Item ${index + 1}`;
  let label = item.label ?? item.children ?? fallbackLabel;
  let key = item.key ?? item.id ?? index;

  return {
    href: item.href,
    key: String(key),
    label,
    rel: item.rel,
    target: item.target
  };
}

function getCurrentKey(items: NormalizedBreadcrumbItem[], current: string): string {
  if (current) {
    let match = items.find((item) => item.key === current || item.label === current);
    if (match) {
      return match.key;
    }
  }

  return items.at(-1)?.key ?? '';
}

function getRenderedItems(
  items: NormalizedBreadcrumbItem[],
  visibleItemCount: number,
  showRoot: boolean
): RenderedBreadcrumbItem[] {
  let clampedVisibleItems = Math.max(0, Math.min(items.length, visibleItemCount || items.length));

  if (items.length <= clampedVisibleItems) {
    return items;
  }

  let selectedKey = items.at(-1)?.key ?? '';
  let availableItems = [...items];
  let contents: RenderedBreadcrumbItem[] = [];
  let endItems = clampedVisibleItems;

  if (showRoot && clampedVisibleItems > 1) {
    let rootItem = availableItems.shift();
    if (rootItem) {
      contents.push(rootItem);
      endItems--;
    }
  }

  let safeEndItems = Math.max(1, endItems);
  let hiddenItems = availableItems.slice(0, Math.max(0, availableItems.length - safeEndItems));
  let tailItems = availableItems.slice(-safeEndItems);

  if (hiddenItems.length > 0) {
    contents.push({
      type: 'menu',
      key: 'menu',
      items,
      selectedKey
    });
  }

  contents.push(...tailItems);
  return contents;
}

function isOverflowMenuItem(item: RenderedBreadcrumbItem): item is OverflowMenuItem {
  return (item as OverflowMenuItem).type === 'menu';
}

function renderIconPath(className: string, path: string) {
  return h('svg', {
    class: className,
    focusable: 'false',
    'aria-hidden': 'true',
    role: 'img'
  }, [
    h('path', {d: path})
  ]);
}

export const Breadcrumbs = defineComponent({
  name: 'VueBreadcrumbs',
  inheritAttrs: false,
  props: {
    autoFocusCurrent: {
      type: Boolean,
      default: false
    },
    current: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isMultiline: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array as PropType<BreadcrumbItemInput[]>,
      default: () => []
    },
    showRoot: {
      type: Boolean,
      default: false
    },
    size: {
      type: String as PropType<BreadcrumbSize>,
      default: 'L'
    }
  },
  emits: {
    action: (key: string) => typeof key === 'string'
  },
  setup(props, {attrs, emit, slots}) {
    let currentItemRef = ref<HTMLElement | null>(null);
    let hoveredKey = ref<string | null>(null);
    let focusedKey = ref<string | null>(null);
    let isMenuOpen = ref(false);
    let listRef = ref<HTMLUListElement | null>(null);
    let navRef = ref<HTMLElement | null>(null);
    let visibleItems = ref(0);
    let resizeObserver: ResizeObserver | null = null;
    let latestItemSignature = '';
    let previousItemSignature = '';
    let latestNormalizedItems: NormalizedBreadcrumbItem[] = [];

    let isDisabled = computed(() => props.isDisabled ?? props.disabled);

    let computeVisibleItems = (visibleCount: number) => {
      let currentList = listRef.value;
      if (!currentList) {
        return visibleCount;
      }

      let listItems = Array.from(currentList.children) as HTMLLIElement[];
      if (listItems.length === 0) {
        return visibleCount;
      }

      let containerWidth = currentList.offsetWidth;
      let isShowingMenu = latestNormalizedItems.length > visibleCount;
      let calculatedWidth = 0;
      let nextVisibleItems = 0;
      let maxVisibleItems = MAX_VISIBLE_ITEMS;

      if (props.showRoot) {
        let rootItem = listItems.shift();
        if (rootItem) {
          calculatedWidth += rootItem.offsetWidth;
          nextVisibleItems++;
        }
      }

      if (isShowingMenu) {
        let menuItem = listItems.shift();
        if (menuItem) {
          calculatedWidth += menuItem.offsetWidth;
          maxVisibleItems--;
        }
      }

      if (props.showRoot && calculatedWidth >= containerWidth) {
        nextVisibleItems--;
      }

      if (props.isMultiline) {
        if (listItems.length > 0) {
          listItems.pop();
          nextVisibleItems++;
        }
      } else if (listItems.length > 0) {
        let lastItem = listItems.pop() as HTMLLIElement;
        let previousOverflow = lastItem.style.overflow;
        lastItem.style.overflow = 'visible';

        calculatedWidth += lastItem.offsetWidth;
        if (calculatedWidth < containerWidth) {
          nextVisibleItems++;
        }

        lastItem.style.overflow = previousOverflow;
      }

      for (let item of listItems.reverse()) {
        calculatedWidth += item.offsetWidth;
        if (calculatedWidth < containerWidth) {
          nextVisibleItems++;
        }
      }

      return Math.max(MIN_VISIBLE_ITEMS, Math.min(maxVisibleItems, nextVisibleItems));
    };

    let updateOverflow = async () => {
      let itemCount = latestNormalizedItems.length;
      visibleItems.value = itemCount;
      await nextTick();

      let nextVisibleItems = computeVisibleItems(itemCount);
      visibleItems.value = nextVisibleItems;
      await nextTick();

      if (nextVisibleItems < itemCount && nextVisibleItems > 1) {
        visibleItems.value = computeVisibleItems(nextVisibleItems);
      }
    };

    let focusCurrentItem = () => {
      if (props.autoFocusCurrent) {
        void nextTick(() => {
          currentItemRef.value?.focus();
        });
      }
    };

    let onDocumentMouseDown = (event: MouseEvent) => {
      let target = event.target as Node | null;
      if (!target || !navRef.value?.contains(target)) {
        isMenuOpen.value = false;
      }
    };

    onMounted(() => {
      visibleItems.value = latestNormalizedItems.length;
      previousItemSignature = latestItemSignature;
      void updateOverflow();
      focusCurrentItem();

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          void updateOverflow();
        });
        if (navRef.value) {
          resizeObserver.observe(navRef.value);
        }
      }

      document.addEventListener('mousedown', onDocumentMouseDown);
    });

    onUpdated(() => {
      if (latestItemSignature !== previousItemSignature) {
        previousItemSignature = latestItemSignature;
        isMenuOpen.value = false;
        void updateOverflow();
        focusCurrentItem();
      }
    });

    onBeforeUnmount(() => {
      resizeObserver?.disconnect();
      document.removeEventListener('mousedown', onDocumentMouseDown);
    });

    watch(
      () => [
        props.showRoot,
        props.isMultiline,
        props.size
      ],
      () => {
        isMenuOpen.value = false;
        void updateOverflow();
      }
    );

    watch(
      () => [props.current, props.autoFocusCurrent],
      () => {
        focusCurrentItem();
      }
    );

    let emitAction = (key: string) => {
      if (!isDisabled.value) {
        emit('action', key);
      }
    };

    return () => {
      let domProps = filterDOMProps(attrs as Record<string, unknown>, {labelable: true}) as Record<string, unknown>;
      let {
        class: domClass,
        className: domClassName,
        style: domStyle,
        ...restDomProps
      } = domProps;

      let ariaLabel = (typeof attrs['aria-label'] === 'string' && attrs['aria-label']) || 'Breadcrumbs';
      let sourceItems = slots.default ? normalizeChildItems(slots.default()) : props.items;
      let normalizedItems = sourceItems.map((item, index) => normalizeBreadcrumbItem(item, index));
      let currentKey = getCurrentKey(normalizedItems, props.current);
      let breadcrumbItems = getRenderedItems(normalizedItems, visibleItems.value, props.showRoot);

      latestNormalizedItems = normalizedItems;
      latestItemSignature = normalizedItems
        .map((item) => `${item.key}:${item.label}:${item.href ?? ''}`)
        .join('|');

      return h('nav', {
        ...restDomProps,
        ref: navRef,
        class: [domClassName, domClass],
        style: domStyle,
        'aria-label': ariaLabel
      }, [
        h('ul', {
          ref: listRef,
          class: classNames(
            styles,
            'spectrum-Breadcrumbs',
            {
              'spectrum-Breadcrumbs--small': props.size === 'S',
              'spectrum-Breadcrumbs--medium': props.size === 'M',
              'spectrum-Breadcrumbs--multiline': props.isMultiline,
              'spectrum-Breadcrumbs--showRoot': props.showRoot,
              'is-disabled': isDisabled.value
            }
          )
        }, breadcrumbItems.map((item, index) => {
          if (isOverflowMenuItem(item)) {
            return h('li', {
              key: item.key,
              class: classNames(styles, 'spectrum-Breadcrumbs-item')
            }, [
              h('span', null, [
                h('button', {
                  class: classNames(
                    buttonStyles,
                    'spectrum-ActionButton',
                    'spectrum-BaseButton',
                    'i18nFontFamily',
                    'spectrum-FocusRing',
                    'spectrum-FocusRing-ring',
                    'spectrum-ActionButton--quiet',
                    classNames(styles, 'spectrum-Breadcrumbs-actionButton')
                  ),
                  type: 'button',
                  tabIndex: 0,
                  disabled: isDisabled.value,
                  'aria-haspopup': 'true',
                  'aria-expanded': isMenuOpen.value ? 'true' : 'false',
                  'data-react-aria-pressable': 'true',
                  'aria-label': '…',
                  onClick: (event: MouseEvent) => {
                    event.preventDefault();
                    if (isDisabled.value) {
                      return;
                    }
                    isMenuOpen.value = !isMenuOpen.value;
                  }
                }, [
                  renderIconPath(
                    classNames(buttonStyles, 'spectrum-Icon', 'spectrum-UIIcon-FolderBreadcrumb', 'spectrum-Icon'),
                    FOLDER_BREADCRUMB_PATH
                  )
                ]),
                isMenuOpen.value
                  ? h('ul', {
                    class: classNames(menuStyles, 'spectrum-Menu'),
                    role: 'menu'
                  }, item.items.map((menuItem) => {
                    let isSelected = menuItem.key === item.selectedKey;
                    let onMenuItemClick = (event: MouseEvent) => {
                      if (menuItem.href) {
                        event.preventDefault();
                      }

                      if (!isSelected) {
                        emitAction(menuItem.key);
                      }

                      isMenuOpen.value = false;
                    };

                    let menuItemProps = {
                      key: menuItem.key,
                      class: classNames(menuStyles, 'spectrum-Menu-item'),
                      role: 'menuitemradio',
                      'aria-checked': isSelected ? 'true' : 'false',
                      onClick: onMenuItemClick
                    };

                    return menuItem.href
                      ? h('a', {
                        ...menuItemProps,
                        href: menuItem.href,
                        rel: menuItem.rel,
                        target: menuItem.target
                      }, menuItem.label)
                      : h('span', menuItemProps, menuItem.label);
                  }))
                  : null
              ]),
              renderIconPath(
                classNames(styles, 'spectrum-Breadcrumbs-itemSeparator', 'spectrum-Icon', 'spectrum-UIIcon-ChevronRightSmall'),
                CHEVRON_RIGHT_SMALL_PATH
              )
            ]);
          }

          let isCurrent = item.key === currentKey;
          let isHovered = hoveredKey.value === item.key && !isDisabled.value && !isCurrent;
          let isFocused = focusedKey.value === item.key && !isCurrent;
          let commonProps = {
            class: classNames(
              styles,
              'spectrum-Breadcrumbs-itemLink',
              {
                'is-hovered': isHovered,
                'focus-ring': isFocused
              }
            ),
            'data-react-aria-pressable': 'true',
            'aria-disabled': isCurrent || isDisabled.value ? 'true' : undefined,
            'aria-current': isCurrent ? 'page' : undefined,
            tabindex: !isCurrent && !isDisabled.value ? 0 : undefined,
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
            }
          };

          let linkNode = item.href
            ? h('a', {
              ...commonProps,
              ref: props.autoFocusCurrent && isCurrent ? currentItemRef : undefined,
              href: item.href,
              rel: item.rel,
              target: item.target,
              onClick: (event: MouseEvent) => {
                event.preventDefault();
                if (!isCurrent) {
                  emitAction(item.key);
                }
              }
            }, item.label)
            : h('span', {
              ...commonProps,
              ref: props.autoFocusCurrent && isCurrent ? currentItemRef : undefined,
              role: 'link',
              onClick: () => {
                if (!isCurrent) {
                  emitAction(item.key);
                }
              }
            }, item.label);

          return h('li', {
            key: `${item.key}-${index}`,
            class: classNames(styles, 'spectrum-Breadcrumbs-item')
          }, [
            linkNode,
            renderIconPath(
              classNames(styles, 'spectrum-Breadcrumbs-itemSeparator', 'spectrum-Icon', 'spectrum-UIIcon-ChevronRightSmall'),
              CHEVRON_RIGHT_SMALL_PATH
            )
          ]);
        }))
      ]);
    };
  }
});

export const VueBreadcrumbs = Breadcrumbs;
export {Item} from '@vue-stately/collections';
export type {SpectrumBreadcrumbsProps} from '@vue-types/breadcrumbs';
