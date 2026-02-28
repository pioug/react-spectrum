import '@adobe/spectrum-css-temp/components/actiongroup/vars.css';
import '@adobe/spectrum-css-temp/components/button/vars.css';
import '@adobe/spectrum-css-temp/components/menu/vars.css';
import './actiongroup.css';
import More from '@spectrum-icons-vue/workflow/More';
import {classNames} from '@vue-spectrum/utils';
import {
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  type PropType,
  ref,
  watch
} from 'vue';
const actionGroupStyles: {[key: string]: string} = {};
const buttonStyles: {[key: string]: string} = {};
const menuStyles: {[key: string]: string} = {};


type SelectionMode = 'none' | 'single' | 'multiple';
type ActionGroupItem = string | {
  children?: string,
  name: string
};
type ActionGroupKey = string | number;
type ActionGroupSelectionValue = Iterable<ActionGroupKey>;
type MenuFocusTarget = 'first' | 'last' | 'manual';

let actionGroupOverflowId = 0;

function getItemKey(item: ActionGroupItem): string {
  return typeof item === 'string' ? item : String(item.name);
}

function getItemLabel(item: ActionGroupItem): string {
  if (typeof item === 'string') {
    return item;
  }

  if (typeof item.children === 'string' && item.children.length > 0) {
    return item.children;
  }

  return String(item.name);
}

function normalizeActionGroupSelection(value: ActionGroupSelectionValue | undefined): string[] {
  if (value == null || typeof value === 'string') {
    return [];
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return [];
  }

  return Array.from(value as Iterable<unknown>)
    .filter((entry): entry is ActionGroupKey => typeof entry === 'number' || typeof entry === 'string')
    .map((entry) => String(entry));
}

function isActionGroupSelectionValue(value: unknown): value is ActionGroupSelectionValue {
  if (value == null) {
    return false;
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return false;
  }

  for (let entry of value as Iterable<unknown>) {
    if (typeof entry !== 'string' && typeof entry !== 'number') {
      return false;
    }
  }

  return true;
}

interface CollapseCalculation {
  containerSize: number,
  itemSizes: number[],
  overflowTriggerSize: number,
  selectionMode: SelectionMode
}

export function calculateVisibleItemsForCollapse({
  containerSize,
  itemSizes,
  overflowTriggerSize,
  selectionMode
}: CollapseCalculation): number {
  if (itemSizes.length === 0) {
    return 0;
  }

  let totalSize = itemSizes.reduce((sum, itemSize) => sum + itemSize, 0);
  if (Math.round(totalSize) <= Math.round(containerSize)) {
    return itemSizes.length;
  }

  let availableSize = Math.max(0, containerSize - Math.max(0, overflowTriggerSize));
  let usedSize = 0;
  let visibleItems = 0;
  for (let itemSize of itemSizes) {
    usedSize += itemSize;
    if (Math.round(usedSize) <= Math.round(availableSize)) {
      visibleItems++;
    } else {
      break;
    }
  }

  if (selectionMode !== 'none' && visibleItems < itemSizes.length) {
    return 0;
  }

  return visibleItems;
}

function toNumber(value: string): number {
  let parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function outerSize(
  element: HTMLElement,
  orientation: 'horizontal' | 'vertical',
  ignoreStartMargin: boolean,
  ignoreEndMargin: boolean
): number {
  let style = window.getComputedStyle(element);
  if (orientation === 'horizontal') {
    return element.getBoundingClientRect().width
      + (ignoreStartMargin ? 0 : toNumber(style.marginLeft))
      + (ignoreEndMargin ? 0 : toNumber(style.marginRight));
  }

  return element.getBoundingClientRect().height
    + (ignoreStartMargin ? 0 : toNumber(style.marginTop))
    + (ignoreEndMargin ? 0 : toNumber(style.marginBottom));
}

export const ActionGroup = defineComponent({
  name: 'VueActionGroup',
  inheritAttrs: false,
  props: {
    buttonLabelBehavior: {
      type: String as PropType<'collapse' | 'hide' | 'show'>,
      default: 'show'
    },
    density: {
      type: String as PropType<'compact' | 'regular'>,
      default: 'regular'
    },
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<ActionGroupKey>>,
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
      type: Array as PropType<ActionGroupItem[]>,
      default: () => []
    },
    isJustified: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: [Array, Set] as PropType<ActionGroupSelectionValue>,
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
    overflowMode: {
      type: String as PropType<'wrap' | 'collapse'>,
      default: 'wrap'
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'none'
    },
    staticColor: {
      type: String as PropType<'black' | 'white' | undefined>,
      default: undefined
    }
  },
  emits: {
    action: (key: string) => typeof key === 'string',
    change: (value: ActionGroupSelectionValue) => isActionGroupSelectionValue(value),
    selectionChange: (value: ActionGroupSelectionValue) => isActionGroupSelectionValue(value),
    'update:modelValue': (value: ActionGroupSelectionValue) => isActionGroupSelectionValue(value)
  },
  setup(props, {emit, attrs, slots}) {
    let groupId = `vs-action-group-overflow-${++actionGroupOverflowId}`;
    let wrapperRef = ref<HTMLElement | null>(null);
    let groupRef = ref<HTMLElement | null>(null);
    let overflowMeasureRef = ref<HTMLElement | null>(null);
    let overflowTriggerRef = ref<HTMLElement | null>(null);
    let overflowMenuRef = ref<HTMLElement | null>(null);
    let focusedOverflowKey = ref<string | null>(null);
    let hoveredOverflowKey = ref<string | null>(null);
    let hoveredKey = ref<string | null>(null);
    let visibleItems = ref(props.items.length);
    let isOverflowMenuOpen = ref(false);
    let rafId = 0;
    let resizeObserver: ResizeObserver | null = null;

    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let isQuiet = computed(() => props.isQuiet ?? props.quiet);
    let isEmphasized = computed(() => props.isEmphasized ?? props.emphasized);
    let isVertical = computed(() => props.orientation === 'vertical');
    let selectedKeys = computed(() => normalizeActionGroupSelection(props.modelValue));
    let selectedKeySet = computed(() => new Set(selectedKeys.value));
    let disabledKeySet = computed(() => new Set(Array.from(props.disabledKeys).map((key) => String(key))));
    let canCollapse = computed(() => {
      if (props.overflowMode !== 'collapse') {
        return false;
      }

      // Vertical collapsing with selection is unsupported in React Spectrum.
      if (isVertical.value && props.selectionMode !== 'none') {
        return false;
      }

      return true;
    });
    let resolvedRole = computed(() => props.selectionMode === 'none' ? 'toolbar' : 'group');
    let resolvedVisibleItems = computed(() => {
      if (!canCollapse.value) {
        return props.items.length;
      }

      return Math.min(props.items.length, Math.max(0, visibleItems.value));
    });
    let visibleActionItems = computed(() => props.items.slice(0, resolvedVisibleItems.value));
    let overflowItems = computed(() => props.items.slice(resolvedVisibleItems.value));
    let hasOverflow = computed(() => canCollapse.value && overflowItems.value.length > 0);
    let shouldHideGroupAria = computed(() => hasOverflow.value && resolvedVisibleItems.value === 0);
    let shouldHideButtonText = computed(() => {
      if (!slots.item) {
        return false;
      }

      if (props.buttonLabelBehavior === 'hide') {
        return true;
      }

      return props.buttonLabelBehavior === 'collapse' && hasOverflow.value;
    });
    let itemCount = computed(() => props.items.length);

    let className = computed(() => classNames(
      actionGroupStyles,
      'flex-gap',
      'spectrum-ActionGroup',
      {
        'spectrum-ActionGroup--compact': props.density === 'compact',
        'spectrum-ActionGroup--justified': props.isJustified,
        'spectrum-ActionGroup--quiet': isQuiet.value,
        'spectrum-ActionGroup--vertical': isVertical.value,
        'spectrum-ActionGroup--overflowCollapse': props.overflowMode === 'collapse'
      }
    ));

    let onAction = (itemKey: string) => {
      let isItemDisabled = isDisabled.value || disabledKeySet.value.has(itemKey);
      if (isItemDisabled) {
        return;
      }

      emit('action', itemKey);

      if (props.selectionMode === 'none') {
        return;
      }

      if (props.selectionMode === 'single') {
        let next = new Set([itemKey]);
        emit('update:modelValue', next);
        emit('change', next);
        emit('selectionChange', next);
        return;
      }

      let next = new Set(selectedKeys.value);
      if (next.has(itemKey)) {
        next.delete(itemKey);
      } else {
        next.add(itemKey);
      }
      emit('update:modelValue', new Set(next));
      emit('change', new Set(next));
      emit('selectionChange', new Set(next));
    };

    let updateOverflow = async () => {
      if (!canCollapse.value) {
        visibleItems.value = itemCount.value;
        isOverflowMenuOpen.value = false;
        return;
      }

      if (itemCount.value === 0) {
        visibleItems.value = 0;
        isOverflowMenuOpen.value = false;
        return;
      }

      if (visibleItems.value !== itemCount.value) {
        visibleItems.value = itemCount.value;
      }

      await nextTick();
      let groupElement = groupRef.value;
      let wrapperElement = wrapperRef.value;
      if (!groupElement || !wrapperElement) {
        return;
      }

      let containerRect = wrapperElement.getBoundingClientRect();
      let containerSize = isVertical.value ? containerRect.height : containerRect.width;

      let itemElements = Array.from(groupElement.querySelectorAll<HTMLElement>('[data-vs-action-group-item="true"]'));
      let itemSizes = itemElements.map((itemElement, index) => outerSize(
        itemElement,
        props.orientation,
        index === 0,
        index === itemElements.length - 1
      ));
      let fallbackOverflowSize = itemSizes[itemSizes.length - 1] ?? 0;
      let overflowSize = overflowMeasureRef.value
        ? outerSize(overflowMeasureRef.value, props.orientation, false, true)
        : fallbackOverflowSize;
      let nextVisibleItems = calculateVisibleItemsForCollapse({
        containerSize,
        itemSizes,
        overflowTriggerSize: overflowSize,
        selectionMode: props.selectionMode
      });

      visibleItems.value = nextVisibleItems;
      if (nextVisibleItems >= itemCount.value) {
        isOverflowMenuOpen.value = false;
      }
    };

    let scheduleOverflowUpdate = () => {
      if (typeof window === 'undefined') {
        return;
      }

      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        rafId = 0;
        void updateOverflow();
      });
    };

    let getEnabledOverflowMenuItems = () => {
      if (!overflowMenuRef.value) {
        return [] as HTMLButtonElement[];
      }

      return Array.from(overflowMenuRef.value.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]'))
        .filter((item) => !item.disabled);
    };

    let focusOverflowMenuItem = (target: Exclude<MenuFocusTarget, 'manual'>) => {
      let items = getEnabledOverflowMenuItems();
      if (items.length === 0) {
        return;
      }

      let nextItem = target === 'last'
        ? items[items.length - 1]
        : items[0];

      nextItem.focus();
      focusedOverflowKey.value = nextItem.dataset.key ?? null;
    };

    let moveOverflowMenuFocus = (step: -1 | 1) => {
      let items = getEnabledOverflowMenuItems();
      if (items.length === 0) {
        return;
      }

      let activeIndex = items.findIndex((item) => item === document.activeElement);
      if (activeIndex < 0) {
        let fallback = step > 0 ? items[0] : items[items.length - 1];
        fallback.focus();
        focusedOverflowKey.value = fallback.dataset.key ?? null;
        return;
      }

      let nextIndex = Math.max(0, Math.min(items.length - 1, activeIndex + step));
      let nextItem = items[nextIndex];
      nextItem.focus();
      focusedOverflowKey.value = nextItem.dataset.key ?? null;
    };

    let openOverflowMenu = (focusTarget: MenuFocusTarget = 'manual') => {
      if (!hasOverflow.value) {
        return;
      }

      isOverflowMenuOpen.value = true;
      if (focusTarget === 'manual') {
        return;
      }

      void nextTick(() => {
        focusOverflowMenuItem(focusTarget);
      });
    };

    let closeOverflowMenu = (restoreFocus = false) => {
      if (!isOverflowMenuOpen.value) {
        return;
      }

      isOverflowMenuOpen.value = false;
      focusedOverflowKey.value = null;
      hoveredOverflowKey.value = null;
      if (restoreFocus) {
        void nextTick(() => {
          overflowTriggerRef.value?.focus();
        });
      }
    };

    let onOverflowItemAction = (item: string) => {
      onAction(item);
      closeOverflowMenu(true);
    };

    let onOverflowMenuKeydown = (event: KeyboardEvent) => {
      if (!isOverflowMenuOpen.value) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeOverflowMenu(true);
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveOverflowMenuFocus(1);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveOverflowMenuFocus(-1);
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        focusOverflowMenuItem('first');
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        focusOverflowMenuItem('last');
      }
    };

    let onDocumentPointerDown = (event: MouseEvent | PointerEvent | TouchEvent) => {
      if (!isOverflowMenuOpen.value) {
        return;
      }

      let target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (overflowTriggerRef.value?.contains(target) || overflowMenuRef.value?.contains(target)) {
        return;
      }

      closeOverflowMenu();
    };

    onMounted(() => {
      document.addEventListener('mousedown', onDocumentPointerDown, true);
      document.addEventListener('pointerdown', onDocumentPointerDown, true);
      document.addEventListener('touchstart', onDocumentPointerDown, true);

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          scheduleOverflowUpdate();
        });
        let observedElement = wrapperRef.value?.parentElement ?? wrapperRef.value;
        if (observedElement) {
          resizeObserver.observe(observedElement);
        }
      }

      scheduleOverflowUpdate();
    });

    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', onDocumentPointerDown, true);
      document.removeEventListener('pointerdown', onDocumentPointerDown, true);
      document.removeEventListener('touchstart', onDocumentPointerDown, true);
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }

      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    });

    watch(
      () => props.items.slice(),
      () => {
        if (isOverflowMenuOpen.value && overflowItems.value.length === 0) {
          closeOverflowMenu();
        }
        scheduleOverflowUpdate();
      },
      {immediate: true}
    );

    watch(
      () => [props.buttonLabelBehavior, props.overflowMode, props.orientation, props.selectionMode],
      () => {
        scheduleOverflowUpdate();
      },
      {immediate: true}
    );

    return () => h('div', {
      ref: wrapperRef,
      class: ['flex-container', 'vs-spectrum-action-group__wrapper']
    }, [
      h('div', {
        ...attrs,
        ref: groupRef,
        class: [className.value, 'vs-spectrum-action-group', attrs.class],
        role: shouldHideGroupAria.value ? undefined : resolvedRole.value,
        'aria-orientation': shouldHideGroupAria.value ? undefined : props.orientation,
        'aria-label': shouldHideGroupAria.value ? undefined : attrs['aria-label'],
        'aria-labelledby': shouldHideGroupAria.value ? undefined : attrs['aria-labelledby'],
        'data-vac': ''
      }, [
      ...visibleActionItems.value.map((item) => {
        let itemKey = getItemKey(item);
        let itemLabel = getItemLabel(item);
        let isSelected = selectedKeySet.value.has(itemKey);
        let isItemDisabled = isDisabled.value || disabledKeySet.value.has(itemKey);
        let ariaPressed: 'true' | 'false' | undefined = undefined;
        if (props.selectionMode !== 'none') {
          ariaPressed = isSelected ? 'true' : 'false';
        }

        return h('button', {
          key: itemKey,
          'data-vs-action-group-item': 'true',
          class: [classNames(
            actionGroupStyles,
            'spectrum-ActionGroup-item',
            {
              'is-selected': isSelected,
              'is-hovered': hoveredKey.value === itemKey && !isItemDisabled,
              'spectrum-ActionGroup-item--iconOnly': shouldHideButtonText.value,
              'spectrum-ActionGroup-item--isDisabled': isItemDisabled
            },
            classNames(
              buttonStyles,
              'i18nFontFamily',
              'spectrum-ActionButton',
              'spectrum-BaseButton',
              'spectrum-FocusRing',
              'spectrum-FocusRing-ring',
              {
                'spectrum-ActionButton--emphasized': isEmphasized.value,
                'spectrum-ActionButton--quiet': isQuiet.value,
                'spectrum-ActionButton--staticBlack': props.staticColor === 'black',
                'spectrum-ActionButton--staticColor': !!props.staticColor,
                'spectrum-ActionButton--staticWhite': props.staticColor === 'white',
                'is-disabled': isItemDisabled,
                'is-selected': isSelected
              }
            )
          ), 'vs-spectrum-action-group__item'],
          type: 'button',
          disabled: isItemDisabled,
          'aria-label': shouldHideButtonText.value ? itemLabel : undefined,
          'aria-pressed': ariaPressed,
          'aria-disabled': isItemDisabled ? 'true' : undefined,
          onMouseenter: () => {
            if (isItemDisabled) {
              return;
            }

            hoveredKey.value = itemKey;
          },
          onMouseleave: () => {
            hoveredKey.value = null;
          },
          onClick: () => onAction(itemKey)
        }, slots.item ? slots.item({item, selected: isSelected, hideButtonText: shouldHideButtonText.value}) : [
          h('span', {class: classNames(actionGroupStyles, 'spectrum-ActionButton-label')}, itemLabel)
        ]);
      }),
      hasOverflow.value
        ? h('div', {class: 'vs-spectrum-action-group__overflow'}, [
          h('button', {
            ref: overflowTriggerRef,
            class: [
              classNames(
                actionGroupStyles,
                'spectrum-ActionGroup-item',
                'spectrum-ActionGroup-menu',
                classNames(
                  buttonStyles,
                  'i18nFontFamily',
                  'spectrum-ActionButton',
                  'spectrum-BaseButton',
                  'spectrum-FocusRing',
                  'spectrum-FocusRing-ring',
                  {
                    'spectrum-ActionButton--emphasized': isEmphasized.value,
                    'spectrum-ActionButton--quiet': isQuiet.value,
                    'spectrum-ActionButton--staticBlack': props.staticColor === 'black',
                    'spectrum-ActionButton--staticColor': !!props.staticColor,
                    'spectrum-ActionButton--staticWhite': props.staticColor === 'white',
                    'is-selected': props.selectionMode !== 'none' && selectedKeys.value.length > 0
                  }
                )
              ),
              'vs-spectrum-action-group__item',
              'vs-spectrum-action-group__overflow-trigger'
            ],
            type: 'button',
            'aria-haspopup': 'menu',
            'aria-expanded': isOverflowMenuOpen.value ? 'true' : 'false',
            'aria-controls': isOverflowMenuOpen.value ? groupId : undefined,
            'aria-label': shouldHideGroupAria.value ? attrs['aria-label'] ?? 'More actions' : 'More actions',
            'aria-labelledby': shouldHideGroupAria.value ? attrs['aria-labelledby'] : undefined,
            'data-vs-action-group-overflow-trigger': 'true',
            onClick: () => {
              if (isOverflowMenuOpen.value) {
                closeOverflowMenu();
              } else {
                openOverflowMenu('manual');
              }
            },
            onKeydown: (event: KeyboardEvent) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                openOverflowMenu('first');
                return;
              }

              if (event.key === 'ArrowUp') {
                event.preventDefault();
                openOverflowMenu('last');
                return;
              }

              if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                closeOverflowMenu(true);
              }
            }
          }, [
            h('span', {
              class: classNames(actionGroupStyles, 'spectrum-ActionGroup-menu-contents'),
              'aria-hidden': 'true'
            }, [h(More)])
          ]),
          isOverflowMenuOpen.value
            ? h('div', {
              ref: overflowMenuRef,
              class: [
                classNames(menuStyles, 'spectrum-Menu-wrapper'),
                classNames(actionGroupStyles, 'spectrum-ActionGroup-menu-popover'),
                'vs-spectrum-action-group__overflow-menu-wrapper'
              ],
              role: 'presentation'
            }, [
              h('ul', {
                id: groupId,
                class: [classNames(menuStyles, 'spectrum-Menu'), 'vs-spectrum-action-group__overflow-menu'],
                role: 'menu',
                'aria-label': 'More actions',
                onKeydown: onOverflowMenuKeydown
              }, overflowItems.value.map((item) => {
                let itemKey = getItemKey(item);
                let itemLabel = getItemLabel(item);
                let isItemDisabled = isDisabled.value || disabledKeySet.value.has(itemKey);
                return h('li', {
                  key: `${itemKey}-overflow`,
                  class: 'vs-spectrum-action-group__overflow-item-wrapper'
                }, [
                  h('button', {
                    class: classNames(menuStyles, 'spectrum-Menu-item', {
                      'is-disabled': isItemDisabled,
                      'is-focused': focusedOverflowKey.value === itemKey && !isItemDisabled,
                      'is-hovered': hoveredOverflowKey.value === itemKey && !isItemDisabled
                    }),
                    type: 'button',
                    disabled: isItemDisabled,
                    role: 'menuitem',
                    'data-key': itemKey,
                    onBlur: () => {
                      if (focusedOverflowKey.value === itemKey) {
                        focusedOverflowKey.value = null;
                      }
                    },
                    onFocus: () => {
                      focusedOverflowKey.value = itemKey;
                    },
                    onMouseenter: () => {
                      if (isItemDisabled) {
                        return;
                      }

                      hoveredOverflowKey.value = itemKey;
                    },
                    onMouseleave: () => {
                      if (hoveredOverflowKey.value === itemKey) {
                        hoveredOverflowKey.value = null;
                      }
                    },
                    onClick: () => onOverflowItemAction(itemKey)
                  }, [
                    h('span', {
                      class: classNames(menuStyles, 'spectrum-Menu-itemLabel')
                    }, itemLabel)
                  ])
                ]);
              }))
            ])
            : null
        ])
        : null,
      h('span', {
        hidden: true,
        'aria-hidden': 'true',
        class: 'vs-spectrum-action-group__hidden-marker'
      })
    ]),
      h('button', {
        ref: overflowMeasureRef,
        type: 'button',
        tabIndex: -1,
        'aria-hidden': 'true',
        class: [
          classNames(
            actionGroupStyles,
            'spectrum-ActionGroup-item',
            'spectrum-ActionGroup-menu',
            classNames(
              buttonStyles,
              'i18nFontFamily',
              'spectrum-ActionButton',
              'spectrum-BaseButton',
              'spectrum-FocusRing',
              'spectrum-FocusRing-ring',
              {
                'spectrum-ActionButton--emphasized': isEmphasized.value,
                'spectrum-ActionButton--quiet': isQuiet.value,
                'spectrum-ActionButton--staticBlack': props.staticColor === 'black',
                'spectrum-ActionButton--staticColor': !!props.staticColor,
                'spectrum-ActionButton--staticWhite': props.staticColor === 'white'
              }
            )
          ),
          'vs-spectrum-action-group__overflow-measure'
        ]
      }, [
        h('span', {
          class: classNames(actionGroupStyles, 'spectrum-ActionGroup-menu-contents'),
          'aria-hidden': 'true'
        }, [h(More)])
      ])
    ]);
  }
});

export const VueActionGroup = ActionGroup;
export {Item} from '@vue-stately/collections';
export type {SpectrumActionGroupProps} from '@vue-types/actiongroup';
