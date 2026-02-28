import '@adobe/spectrum-css-temp/components/card/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {Comment, computed, defineComponent, h, isVNode, nextTick, onMounted, onUpdated, Text, type PropType, ref} from 'vue';
import {getEventTarget} from '@vue-aria/utils';
const styles: {[key: string]: string} = {};


export type GalleryLayoutOptions = {
  columns?: number,
  gap?: string
};

export type GridLayoutOptions = {
  columns?: number,
  gap?: string
};

export type WaterfallLayoutOptions = {
  columns?: number,
  gap?: string
};

type CardViewItem = {
  [key: string]: unknown,
  description?: string,
  detail?: string,
  height?: number,
  id?: string | number | null,
  key?: string | number,
  src?: string,
  title?: string,
  width?: number
};

type CardLayout = 'gallery' | 'grid' | 'waterfall';
type CardOrientation = 'horizontal' | 'vertical';
type CardViewLayoutInput = CardLayout | ((options?: unknown) => unknown) | Record<string, unknown>;
type CardViewLoadingState = 'filtering' | 'idle' | 'loading' | 'loadingMore';
type CardViewSelectionMode = 'multiple' | 'none' | 'single';
type CardViewSelectionValue = number | string | Iterable<string | number>;
type CardViewSelectedKeys = 'all' | CardViewSelectionValue;
type CardSelectionKey = number | string;
const CARD_FOCUSABLE_WARNING = 'Card does not support focusable elements, please contact the team regarding your use case.';

let cardId = 0;

function hasRenderableContent(value: unknown): boolean {
  if (value == null || typeof value === 'boolean') {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (typeof value === 'number') {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(hasRenderableContent);
  }

  if (!isVNode(value)) {
    return true;
  }

  if (value.type === Comment) {
    return false;
  }

  if (value.type === Text) {
    return hasRenderableContent(value.children);
  }

  return true;
}

function resolveCardViewLayout(layout: CardViewLayoutInput | undefined): CardLayout {
  if (layout === 'gallery' || layout === 'waterfall' || layout === 'grid') {
    return layout;
  }

  if (layout && typeof layout === 'object' && 'layoutType' in layout) {
    let layoutType = (layout as {layoutType?: unknown}).layoutType;
    if (layoutType === 'gallery' || layoutType === 'waterfall' || layoutType === 'grid') {
      return layoutType;
    }
  }

  if (typeof layout === 'function') {
    let name = layout.name.toLowerCase();
    if (name.includes('gallery')) {
      return 'gallery';
    }

    if (name.includes('waterfall')) {
      return 'waterfall';
    }
  }

  return 'grid';
}

function getItemSelectionKey(item: CardViewItem, index: number): CardSelectionKey {
  if (item.id != null) {
    return item.id;
  }

  if (item.key != null) {
    return item.key;
  }

  if (item.title) {
    return item.title;
  }

  return `item-${index}`;
}

function toStringArray(value: unknown): string[] {
  if (value == null) {
    return [];
  }

  if (typeof value === 'string') {
    return [value];
  }

  if (typeof value === 'number') {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value === 'object' && Symbol.iterator in (value as Record<string | symbol, unknown>)) {
    return Array.from(value as Iterable<unknown>).map((item) => String(item));
  }

  return [];
}

function isCardViewSelectionValue(value: unknown): value is CardViewSelectionValue {
  if (typeof value === 'number' || typeof value === 'string') {
    return true;
  }

  if (value == null || typeof value === 'string') {
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

function isCardViewSelectionChangeValue(value: unknown): value is 'all' | CardViewSelectionValue {
  return value === 'all' || isCardViewSelectionValue(value);
}

export const Card = defineComponent({
  name: 'VueCard',
  inheritAttrs: false,
  props: {
    description: {
      type: String,
      default: ''
    },
    detail: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: undefined
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isQuiet: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isSelected: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    layout: {
      type: String as PropType<CardLayout | undefined>,
      default: undefined
    },
    orientation: {
      type: String as PropType<CardOrientation>,
      default: 'vertical'
    },
    quiet: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    press: () => true
  },
  setup(props, {slots, emit, attrs}) {
    let generatedId = `vs-card-${++cardId}`;
    let cardBaseId = computed(() => props.id ?? generatedId);
    let isQuiet = computed(() => props.isQuiet ?? props.quiet);
    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let isSelected = computed(() => props.isSelected ?? props.selected);
    let cardRef = ref<HTMLElement | null>(null);
    let hasWarnedFocusableChildren = ref(false);

    let isHovered = ref(false);
    let isFocused = ref(false);
    let isFocusVisible = ref(false);

    let titleNodes = computed(() => {
      if (slots.title) {
        return slots.title();
      }

      if (props.title) {
        return [props.title];
      }

      return [];
    });
    let detailNodes = computed(() => {
      if (slots.detail) {
        return slots.detail();
      }

      if (props.detail) {
        return [props.detail];
      }

      if (slots.default) {
        return slots.default();
      }

      return [];
    });
    let contentNodes = computed(() => {
      if (slots.content) {
        return slots.content();
      }

      if (props.description) {
        return [props.description];
      }

      return [];
    });
    let previewNodes = computed(() => slots.preview ? slots.preview() : []);

    let hasTitle = computed(() => hasRenderableContent(titleNodes.value));
    let hasDetail = computed(() => hasRenderableContent(detailNodes.value));
    let hasContent = computed(() => hasRenderableContent(contentNodes.value));
    let hasPreview = computed(() => hasRenderableContent(previewNodes.value));

    let titleId = computed(() => hasTitle.value ? `${cardBaseId.value}-title` : undefined);
    let descriptionId = computed(() => hasContent.value ? `${cardBaseId.value}-description` : undefined);

    let warnOnFocusableChildren = () => {
      if (hasWarnedFocusableChildren.value || process.env.NODE_ENV === 'production') {
        return;
      }

      let focusableNode = cardRef.value?.querySelector<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusableNode) {
        return;
      }

      console.warn(CARD_FOCUSABLE_WARNING);
      hasWarnedFocusableChildren.value = true;
    };

    onMounted(() => {
      nextTick().then(warnOnFocusableChildren);
    });

    onUpdated(() => {
      nextTick().then(warnOnFocusableChildren);
    });

    let className = computed(() => classNames(
      styles,
      'spectrum-Card',
      {
        'spectrum-Card--default': !isQuiet.value && props.orientation !== 'horizontal',
        'spectrum-Card--isQuiet': isQuiet.value && props.orientation !== 'horizontal',
        'spectrum-Card--horizontal': props.orientation === 'horizontal',
        'spectrum-Card--waterfall': props.layout === 'waterfall',
        'spectrum-Card--gallery': props.layout === 'gallery',
        'spectrum-Card--grid': props.layout === 'grid',
        'spectrum-Card--noLayout': props.layout !== 'waterfall' && props.layout !== 'gallery' && props.layout !== 'grid',
        'spectrum-Card--noPreview': !hasPreview.value,
        'is-hovered': isHovered.value && !isDisabled.value,
        'is-focused': isFocused.value,
        'is-selected': isSelected.value,
        'focus-ring': isFocusVisible.value
      }
    ));

    return () => h('div', {
      ...attrs,
      ref: cardRef,
      class: [className.value, attrs.class],
      role: typeof attrs.role === 'string' ? attrs.role : 'article',
      tabindex: isDisabled.value ? -1 : 0,
      'aria-disabled': isDisabled.value ? 'true' : undefined,
      'aria-label': typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : (hasTitle.value ? undefined : props.title || undefined),
      'aria-labelledby': titleId.value,
      'aria-describedby': descriptionId.value,
      onMouseenter: () => {
        if (!isDisabled.value) {
          isHovered.value = true;
        }
      },
      onMouseleave: () => {
        isHovered.value = false;
      },
      onFocus: (event: FocusEvent) => {
        isFocused.value = true;
        let target = getEventTarget(event);
        isFocusVisible.value = target instanceof HTMLElement ? target.matches(':focus-visible') : false;
        emit('focus', event);
      },
      onBlur: (event: FocusEvent) => {
        isFocused.value = false;
        isFocusVisible.value = false;
        emit('blur', event);
      },
      onClick: () => {
        if (!isDisabled.value) {
          emit('press');
        }
      }
    }, [
      h('div', {class: classNames(styles, 'spectrum-Card-grid')}, [
        hasPreview.value
          ? h('div', {class: classNames(styles, 'spectrum-Card-image')}, previewNodes.value)
          : null,
        hasTitle.value ? h('span', {id: titleId.value, class: classNames(styles, 'spectrum-Card-heading')}, titleNodes.value) : null,
        hasDetail.value ? h('span', {class: classNames(styles, 'spectrum-Card-detail')}, detailNodes.value) : null,
        hasContent.value ? h('span', {id: descriptionId.value, class: classNames(styles, 'spectrum-Card-content')}, contentNodes.value) : null,
        h('div', {class: classNames(styles, 'spectrum-Card-decoration'), 'aria-hidden': 'true'})
      ])
    ]);
  }
});

export const CardView = defineComponent({
  name: 'VueCardView',
  inheritAttrs: false,
  props: {
    cardOrientation: {
      type: String as PropType<CardOrientation>,
      default: 'vertical'
    },
    columns: {
      type: Number,
      default: 3
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<string | number>>,
      default: () => []
    },
    isQuiet: {
      type: Boolean,
      default: true
    },
    items: {
      type: Array as PropType<CardViewItem[]>,
      default: () => []
    },
    layout: {
      type: [String, Function, Object] as PropType<CardViewLayoutInput | undefined>,
      default: undefined
    },
    layoutOptions: {
      type: Object as PropType<Record<string, unknown> | undefined>,
      default: undefined
    },
    loadingState: {
      type: String as PropType<CardViewLoadingState>,
      default: 'idle'
    },
    modelValue: {
      type: [String, Number, Array, Set] as PropType<CardViewSelectionValue | undefined>,
      default: undefined
    },
    renderEmptyState: {
      type: Function as PropType<(() => unknown) | undefined>,
      default: undefined
    },
    selectedKeys: {
      type: [String, Number, Array, Set] as PropType<CardViewSelectedKeys | undefined>,
      default: undefined
    },
    selectionMode: {
      type: String as PropType<CardViewSelectionMode>,
      default: 'single'
    }
  },
  emits: {
    action: (item: CardViewItem) => typeof item === 'object' && item !== null,
    change: (value: unknown) => isCardViewSelectionValue(value),
    selectionChange: (value: unknown) => isCardViewSelectionChangeValue(value),
    'update:modelValue': (value: unknown) => isCardViewSelectionValue(value)
  },
  setup(props, {emit, attrs}) {
    let layoutColumnCount = computed(() => {
      if (!props.layoutOptions) {
        return undefined;
      }

      let maxColumns = props.layoutOptions.maxColumns;
      if (typeof maxColumns === 'number' && Number.isFinite(maxColumns) && maxColumns > 0) {
        return Math.max(1, Math.round(maxColumns));
      }

      return undefined;
    });
    let columnCount = computed(() => layoutColumnCount.value ?? Math.max(1, Math.round(props.columns)));
    let normalizedItems = computed(() => props.items.map((item, index) => {
      let selectionKey = getItemSelectionKey(item, index);
      return {
        item,
        selectionKey,
        key: String(selectionKey)
      };
    }));
    let itemKeySet = computed(() => new Set(normalizedItems.value.map((entry) => entry.key)));
    let itemSelectionKeyByStringKey = computed(() => {
      let result = new Map<string, CardSelectionKey>();
      for (let item of normalizedItems.value) {
        result.set(item.key, item.selectionKey);
      }
      return result;
    });
    let disabledKeySet = computed(() => new Set(Array.from(props.disabledKeys).map((key) => String(key))));
    let resolvedLayout = computed(() => resolveCardViewLayout(props.layout));
    let selectedKeys = computed(() => {
      if (props.selectedKeys === 'all') {
        return new Set(itemKeySet.value);
      }

      let selected = toStringArray(props.selectedKeys ?? props.modelValue);
      return new Set(selected.filter((key) => itemKeySet.value.has(key)));
    });
    let isLoading = computed(() => props.loadingState === 'loading' || props.loadingState === 'loadingMore' || props.loadingState === 'filtering');

    let emitSelection = (nextSelection: Set<string>) => {
      if (props.selectionMode === 'single') {
        let selectedKey = nextSelection.values().next().value;
        let value = selectedKey == null
          ? ''
          : (itemSelectionKeyByStringKey.value.get(selectedKey) ?? selectedKey);
        emit('update:modelValue', value);
        emit('change', value);
        emit('selectionChange', selectedKey == null ? [] : [value]);
        return;
      }

      let value = Array.from(nextSelection, (key) => itemSelectionKeyByStringKey.value.get(key) ?? key);
      let iterableValue = new Set(value);
      emit('update:modelValue', iterableValue);
      emit('change', iterableValue);
      emit('selectionChange', iterableValue);
    };

    let onItemPress = (item: CardViewItem, itemKey: string) => {
      if (props.disabled || disabledKeySet.value.has(itemKey)) {
        return;
      }

      if (props.selectionMode === 'none') {
        emit('action', item);
        return;
      }

      if (props.selectionMode === 'single') {
        emitSelection(new Set([itemKey]));
        emit('action', item);
        return;
      }

      let nextSelection = new Set(selectedKeys.value);
      if (nextSelection.has(itemKey)) {
        nextSelection.delete(itemKey);
      } else {
        nextSelection.add(itemKey);
      }
      emitSelection(nextSelection);
      emit('action', item);
    };

    let renderCenteredRow = (content: unknown) => h('div', {
      role: 'row',
      'aria-rowindex': normalizedItems.value.length + 1,
      class: classNames(styles, 'spectrum-CardView-centeredWrapper')
    }, [
      h('div', {role: 'gridcell'}, [content])
    ]);

    return () => {
      let gridRows = normalizedItems.value.map(({item, key}, index) => {
        let itemTitle = item.title ? String(item.title) : `Item ${index + 1}`;
        let itemDetail = item.detail ? String(item.detail) : 'PNG';
        let itemDescription = item.description ? String(item.description) : undefined;
        let itemSrc = item.src ? String(item.src) : undefined;
        let isItemDisabled = props.disabled || disabledKeySet.value.has(key);
        let isItemSelected = selectedKeys.value.has(key);

        let cardSlots = itemSrc
          ? {
            preview: () => [
              h('img', {
                alt: '',
                src: itemSrc,
                style: {
                  display: 'block',
                  height: '100%',
                  objectFit: props.cardOrientation === 'horizontal' ? 'cover' : 'contain',
                  width: '100%'
                }
              })
            ]
          }
          : undefined;

        return h('div', {
          key,
          role: 'row',
          'aria-rowindex': index + 1,
          class: classNames(styles, 'spectrum-CardView-row')
        }, [
          h(Card, {
            class: 'vs-card-view__item',
            description: itemDescription,
            detail: itemDetail,
            id: item.id == null ? undefined : String(item.id),
            isDisabled: isItemDisabled,
            isQuiet: props.isQuiet,
            isSelected: isItemSelected,
            layout: resolvedLayout.value,
            orientation: props.cardOrientation,
            role: 'gridcell',
            title: itemTitle,
            'aria-label': itemTitle,
            'aria-selected': props.selectionMode === 'none' ? undefined : (isItemSelected ? 'true' : 'false'),
            onPress: () => onItemPress(item, key)
          }, cardSlots)
        ]);
      });

      if (normalizedItems.value.length === 0) {
        if (isLoading.value) {
          gridRows.push(renderCenteredRow('Loading...'));
        } else if (props.renderEmptyState) {
          gridRows.push(renderCenteredRow(props.renderEmptyState()));
        }
      } else if (props.loadingState === 'loadingMore') {
        gridRows.push(renderCenteredRow('Loading more...'));
      }

      return h('div', {
        ...attrs,
        class: [classNames(styles, 'spectrum-CardView'), 'vs-card-view', attrs.class],
        role: 'grid',
        'aria-label': attrs['aria-label'],
        'aria-rowcount': normalizedItems.value.length,
        'aria-multiselectable': props.selectionMode === 'multiple' ? 'true' : undefined,
        style: [
          {
            gridTemplateColumns: `repeat(${columnCount.value}, minmax(0, 1fr))`
          },
          attrs.style
        ],
        'data-vac': ''
      }, gridRows);
    };
  }
});
export const GalleryLayout = (options: GalleryLayoutOptions = {}) => options;
export const GridLayout = (options: GridLayoutOptions = {}) => options;
export const WaterfallLayout = (options: WaterfallLayoutOptions = {}) => options;
export const VueCard = Card;
export const VueCardView = CardView;
export type {SpectrumCardViewProps} from '@vue-types/card';
