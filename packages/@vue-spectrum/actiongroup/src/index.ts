import '@adobe/spectrum-css-temp/components/actiongroup/vars.css';
import '@adobe/spectrum-css-temp/components/button/vars.css';
import '@adobe/spectrum-css-temp/components/menu/vars.css';
import './actiongroup.css';
import More from '@spectrum-icons-vue/workflow/More';
import {classNames} from '@vue-spectrum/utils';
import {
  cloneVNode,
  computed,
  defineComponent,
  h,
  isVNode,
  nextTick,
  onBeforeUnmount,
  onMounted,
  type PropType,
  ref,
  type VNodeChild,
  watch
} from 'vue';
const actionGroupStyles: {[key: string]: string} = {};
const buttonStyles: {[key: string]: string} = {};
const menuStyles: {[key: string]: string} = {};


type SelectionMode = 'none' | 'single' | 'multiple';
type ActionGroupRole = 'group' | 'radiogroup' | 'toolbar';
type ActionGroupItem = string | {
  children?: string,
  name: string
};
type ActionGroupKey = string | number;
type ActionGroupSelectionValue = Iterable<ActionGroupKey>;
type MenuFocusTarget = 'first' | 'last' | 'manual';
const CHEVRON_DOWN_MEDIUM_PATH = 'M9.99 1.01A1 1 0 0 0 8.283.303L5 3.586 1.717.303A1 1 0 1 0 .303 1.717l3.99 3.98a1 1 0 0 0 1.414 0l3.99-3.98a.997.997 0 0 0 .293-.707z';
const MORE_ITEMS_LABEL = 'More items';
const ACTION_GROUP_ROLE_BY_SELECTION_MODE: Record<SelectionMode, ActionGroupRole> = {
  none: 'toolbar',
  single: 'radiogroup',
  multiple: 'toolbar'
};

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

  // Match React ActionGroup collapse behavior by always keeping at least one action visible
  // when selection is not enabled, even in very constrained layouts.
  if (selectionMode === 'none' && visibleItems === 0 && itemSizes.length > 0) {
    return 1;
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

function getActionGroupRole(selectionMode: SelectionMode, isInToolbar: boolean): ActionGroupRole {
  let role = ACTION_GROUP_ROLE_BY_SELECTION_MODE[selectionMode];
  if (isInToolbar && role === 'toolbar') {
    return 'group';
  }

  return role;
}

function getActionGroupItemRole(selectionMode: SelectionMode): 'checkbox' | 'radio' | undefined {
  if (selectionMode === 'single') {
    return 'radio';
  }

  if (selectionMode === 'multiple') {
    return 'checkbox';
  }

  return undefined;
}

function toClassTokens(value: unknown): string[] {
  if (typeof value === 'string') {
    return value.split(/\s+/).filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => toClassTokens(entry));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value)
      .filter(([, isEnabled]) => Boolean(isEnabled))
      .map(([className]) => className);
  }

  return [];
}

function normalizeActionGroupSlotContent(
  content: VNodeChild,
  options: {
    hideButtonText: boolean,
    labelId: string
  }
): VNodeChild {
  if (Array.isArray(content)) {
    return content.map((entry) => normalizeActionGroupSlotContent(entry, options));
  }

  if (!isVNode(content)) {
    return content;
  }

  let classTokens = toClassTokens(content.props?.class);
  if (!classTokens.includes('spectrum-ActionButton-label')) {
    return content;
  }

  return cloneVNode(content, {
    hidden: options.hideButtonText || content.props?.hidden,
    id: options.labelId,
    role: content.props?.role ?? 'none'
  }, true);
}

function slotContentHasActionButtonLabel(content: VNodeChild): boolean {
  if (Array.isArray(content)) {
    return content.some((entry) => slotContentHasActionButtonLabel(entry));
  }

  if (!isVNode(content)) {
    return false;
  }

  return toClassTokens(content.props?.class).includes('spectrum-ActionButton-label');
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
    summaryIcon: {
      type: null as unknown as PropType<VNodeChild | undefined>,
      default: undefined
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
    let focusedActionKey = ref<string | null>(null);
    let focusedOverflowKey = ref<string | null>(null);
    let hoveredOverflowKey = ref<string | null>(null);
    let hoveredKey = ref<string | null>(null);
    let visibleItems = ref(props.items.length);
    let isOverflowMenuOpen = ref(false);
    let isMeasuring = ref(false);
    let isInToolbar = ref(false);
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
    let resolvedRole = computed<ActionGroupRole>(() => getActionGroupRole(props.selectionMode, isInToolbar.value));
    let resolvedVisibleItems = computed(() => {
      if (!canCollapse.value) {
        return props.items.length;
      }

      return Math.min(props.items.length, Math.max(0, visibleItems.value));
    });
    let visibleActionItems = computed(() => props.items.slice(0, resolvedVisibleItems.value));
    let overflowItems = computed(() => props.items.slice(resolvedVisibleItems.value));
    let overflowTriggerFocusKey = computed(() => overflowItems.value[0] ? getItemKey(overflowItems.value[0]) : null);
    let hasOverflow = computed(() => canCollapse.value && overflowItems.value.length > 0);
    let shouldHideGroupAria = computed(() => hasOverflow.value && resolvedVisibleItems.value === 0);
    let isGroupDisabled = computed(() => {
      if (isDisabled.value) {
        return true;
      }

      return props.items.every((item) => disabledKeySet.value.has(getItemKey(item)));
    });
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

    let getItemTabIndex = (itemKey: string) => focusedActionKey.value == null || focusedActionKey.value === itemKey ? 0 : -1;

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

    let getFocusableGroupActions = () => {
      if (!groupRef.value) {
        return [] as HTMLButtonElement[];
      }

      return Array.from(groupRef.value.querySelectorAll<HTMLButtonElement>('[data-vs-action-group-item="true"], [data-vs-action-group-overflow-trigger="true"]'))
        .filter((item) => !item.disabled);
    };

    let moveGroupFocus = (step: -1 | 1) => {
      let items = getFocusableGroupActions();
      if (items.length === 0) {
        return;
      }

      let activeIndex = items.findIndex((item) => item === document.activeElement);
      let nextIndex = activeIndex < 0
        ? 0
        : (activeIndex + step + items.length) % items.length;
      items[nextIndex]?.focus();
    };

    let onGroupKeydown = (event: KeyboardEvent) => {
      let target = event.target;
      if (!(target instanceof Node) || !groupRef.value?.contains(target) || overflowMenuRef.value?.contains(target)) {
        return;
      }

      let isRtl = !isVertical.value && typeof window !== 'undefined' && groupRef.value
        ? window.getComputedStyle(groupRef.value).direction === 'rtl'
        : false;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          event.stopPropagation();
          moveGroupFocus(event.key === 'ArrowRight' && isRtl ? -1 : 1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          event.stopPropagation();
          moveGroupFocus(event.key === 'ArrowLeft' && isRtl ? 1 : -1);
          break;
      }
    };

    let updateOverflow = async () => {
      if (!canCollapse.value) {
        visibleItems.value = itemCount.value;
        isOverflowMenuOpen.value = false;
        isMeasuring.value = false;
        return;
      }

      if (itemCount.value === 0) {
        visibleItems.value = 0;
        isOverflowMenuOpen.value = false;
        isMeasuring.value = false;
        return;
      }

      isMeasuring.value = true;
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
      isMeasuring.value = false;
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

      isInToolbar.value = Boolean(groupRef.value?.parentElement?.closest('[role="toolbar"]'));

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
        if (focusedActionKey.value != null && !props.items.some((item) => getItemKey(item) === focusedActionKey.value)) {
          focusedActionKey.value = null;
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
      class: ['flex-container', attrs.class],
      style: isOverflowMenuOpen.value ? {position: 'relative'} : undefined
    }, [
      h('div', {
        ...attrs,
        ref: groupRef,
        class: [className.value, attrs.class],
        role: shouldHideGroupAria.value ? undefined : resolvedRole.value,
        'aria-orientation': shouldHideGroupAria.value || resolvedRole.value !== 'toolbar' ? undefined : props.orientation,
        'aria-label': shouldHideGroupAria.value ? undefined : attrs['aria-label'],
        'aria-labelledby': shouldHideGroupAria.value ? undefined : attrs['aria-labelledby'],
        'aria-disabled': shouldHideGroupAria.value || !isGroupDisabled.value ? undefined : 'true',
        onKeydown: onGroupKeydown,
        'data-vac': ''
      }, [
      ...visibleActionItems.value.map((item) => {
        let itemKey = getItemKey(item);
        let itemLabel = getItemLabel(item);
        let isSelected = selectedKeySet.value.has(itemKey);
        let isItemDisabled = isDisabled.value || disabledKeySet.value.has(itemKey);
        let itemRole = getActionGroupItemRole(props.selectionMode);
        let labelId = `${groupId}-label-${itemKey}`;
        let rawItemContent = slots.item?.({item, selected: isSelected, hideButtonText: shouldHideButtonText.value, labelId});
        let hasActionButtonLabel = rawItemContent ? slotContentHasActionButtonLabel(rawItemContent) : false;
        let itemContent = slots.item
          ? normalizeActionGroupSlotContent(
            rawItemContent,
            {
              hideButtonText: shouldHideButtonText.value,
              labelId
            }
          )
          : [
            h('span', {
              class: classNames(actionGroupStyles, 'spectrum-ActionButton-label'),
              hidden: shouldHideButtonText.value,
              id: labelId,
              role: 'none'
            }, itemLabel)
          ];

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
        )],
          type: 'button',
          disabled: isItemDisabled,
          role: itemRole,
          tabindex: getItemTabIndex(itemKey),
          'aria-label': shouldHideButtonText.value && (!slots.item || !hasActionButtonLabel) ? itemLabel : undefined,
          'aria-checked': itemRole ? (isSelected ? 'true' : 'false') : undefined,
          'aria-disabled': isItemDisabled ? 'true' : undefined,
          'aria-labelledby': shouldHideButtonText.value && hasActionButtonLabel ? labelId : undefined,
          onFocus: () => {
            focusedActionKey.value = itemKey;
          },
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
        }, itemContent);
      }),
      hasOverflow.value
        ? [
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
              props.summaryIcon && props.selectionMode !== 'none'
                ? 'spectrum-ActionGroup-menu-summaryIcon'
                : undefined
            ],
            type: 'button',
            tabindex: overflowTriggerFocusKey.value ? getItemTabIndex(overflowTriggerFocusKey.value) : 0,
            'aria-haspopup': 'true',
            'aria-expanded': isOverflowMenuOpen.value ? 'true' : 'false',
            'aria-controls': isOverflowMenuOpen.value ? groupId : undefined,
            'aria-label': shouldHideGroupAria.value ? attrs['aria-label'] ?? MORE_ITEMS_LABEL : MORE_ITEMS_LABEL,
            'aria-labelledby': shouldHideGroupAria.value ? attrs['aria-labelledby'] : undefined,
            'data-vs-action-group-overflow-trigger': 'true',
            onFocus: () => {
              focusedActionKey.value = overflowTriggerFocusKey.value;
            },
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
                event.stopPropagation();
                openOverflowMenu('first');
                return;
              }

              if (event.key === 'ArrowUp') {
                event.preventDefault();
                event.stopPropagation();
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
            props.summaryIcon && props.selectionMode !== 'none'
              ? [
                h('svg', {
                  class: classNames(actionGroupStyles, 'spectrum-ActionGroup-menu-chevron'),
                  focusable: 'false',
                  'aria-hidden': 'true',
                  role: 'img',
                  viewBox: '0 0 10 6'
                }, [
                  h('path', {
                    d: CHEVRON_DOWN_MEDIUM_PATH
                  })
                ]),
                h('span', {
                  class: classNames(actionGroupStyles, 'spectrum-ActionGroup-menu-contents'),
                  'aria-hidden': 'true'
                }, [props.summaryIcon])
              ]
              : h(More, {size: 'S'})
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
                'aria-label': MORE_ITEMS_LABEL,
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
        ]
        : null,
    ]),
      isMeasuring.value ? h('div', {
        ref: overflowMeasureRef,
        role: 'presentation',
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
        props.summaryIcon && props.selectionMode !== 'none'
          ? [
            h('svg', {
              class: classNames(actionGroupStyles, 'spectrum-ActionGroup-menu-chevron'),
              focusable: 'false',
              'aria-hidden': 'true',
              role: 'img',
              viewBox: '0 0 10 6'
            }, [
              h('path', {
                d: CHEVRON_DOWN_MEDIUM_PATH
              })
            ]),
            h('span', {
              class: classNames(actionGroupStyles, 'spectrum-ActionGroup-menu-contents'),
              'aria-hidden': 'true'
            }, [props.summaryIcon])
          ]
          : h(More, {size: 'S'})
      ]) : null
    ]);
  }
});

export const VueActionGroup = ActionGroup;
export {Item} from '@vue-stately/collections';
export type {SpectrumActionGroupProps} from '@vue-types/actiongroup';
