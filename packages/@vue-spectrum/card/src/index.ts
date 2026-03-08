import '@adobe/spectrum-css-temp/components/card/vars.css';
import '@adobe/spectrum-css-temp/components/checkbox/vars.css';
import {ProgressCircle} from '@vue-spectrum/progress';
import {classNames} from '@vue-spectrum/utils';
import {cloneVNode, Comment, computed, defineComponent, Fragment, h, isVNode, mergeProps, nextTick, onBeforeUnmount, onMounted, onUpdated, Text, type PropType, ref, type VNode} from 'vue';
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
const CARD_DEFAULT_DESCRIPTION = 'Very very very very very very very very very very very very very long description';

let cardId = 0;
let cardViewId = 0;

type LayoutRow = {
  key: string,
  props: {
    height?: number,
    width?: number
  }
};

type LayoutCollection = {
  size: number,
  rows: LayoutRow[],
  [Symbol.iterator](): Iterator<LayoutRow>
};

type CardLayoutInfo = {
  allowOverflow?: boolean,
  rect: Rect
};

class Size {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

class Rect {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get maxX() {
    return this.x + this.width;
  }

  get maxY() {
    return this.y + this.height;
  }
}

type CardChildKind = 'avatar' | 'content' | 'detail' | 'heading' | 'image' | 'illustration' | 'other';

type DecoratedCardChild = {
  kind: CardChildKind,
  node: VNode
};

function flattenChildren(nodes: unknown[]): VNode[] {
  let result: VNode[] = [];

  for (let node of nodes) {
    if (!isVNode(node) || node.type === Comment) {
      continue;
    }

    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...flattenChildren(node.children));
      continue;
    }

    if (node.type === Text) {
      let text = typeof node.children === 'string' ? node.children : '';
      if (!text.trim()) {
        continue;
      }
    }

    result.push(node);
  }

  return result;
}

function getVNodeComponentName(node: VNode): string {
  if (typeof node.type !== 'object' || node.type == null) {
    return '';
  }

  return (node.type as {name?: string}).name ?? '';
}

function hasSlotName(node: VNode, slotName: string): boolean {
  return (node.props as {slot?: unknown} | null | undefined)?.slot === slotName;
}

function isHeadingVNode(node: VNode): boolean {
  let componentName = getVNodeComponentName(node);
  return componentName === 'VueSpectrumHeading' || hasSlotName(node, 'title');
}

function isContentVNode(node: VNode): boolean {
  let componentName = getVNodeComponentName(node);
  return componentName === 'VueSpectrumContent' || hasSlotName(node, 'content');
}

function isDetailVNode(node: VNode): boolean {
  let componentName = getVNodeComponentName(node);
  return componentName === 'VueSpectrumText' && hasSlotName(node, 'detail');
}

function isImageVNode(node: VNode): boolean {
  if (typeof node.type === 'string') {
    return node.type === 'img';
  }

  let componentName = getVNodeComponentName(node);
  return componentName === 'VueImage' || hasSlotName(node, 'preview');
}

function isIllustrationVNode(node: VNode): boolean {
  return hasSlotName(node, 'illustration');
}

function isAvatarVNode(node: VNode): boolean {
  return hasSlotName(node, 'avatar');
}

function decorateCardChild(
  node: VNode,
  {
    descriptionId,
    orientation,
    titleId
  }: {
    descriptionId?: string,
    orientation: CardOrientation,
    titleId?: string
  }
): DecoratedCardChild {
  let baseClassName = node.props?.class;

  if (isHeadingVNode(node)) {
    return {
      kind: 'heading',
      node: cloneVNode(node, mergeProps(node.props ?? {}, {
        class: [baseClassName, classNames(styles, 'spectrum-Card-heading')],
        id: titleId
      }), true)
    };
  }

  if (isContentVNode(node)) {
    return {
      kind: 'content',
      node: cloneVNode(node, mergeProps(node.props ?? {}, {
        class: [baseClassName, classNames(styles, 'spectrum-Card-content')],
        id: descriptionId
      }), true)
    };
  }

  if (isDetailVNode(node)) {
    return {
      kind: 'detail',
      node: cloneVNode(node, mergeProps(node.props ?? {}, {
        class: [baseClassName, classNames(styles, 'spectrum-Card-detail')]
      }), true)
    };
  }

  if (isImageVNode(node)) {
    return {
      kind: 'image',
      node: cloneVNode(node, mergeProps(node.props ?? {}, {
        alt: (node.props as {alt?: string} | null | undefined)?.alt ?? '',
        class: [baseClassName, classNames(styles, 'spectrum-Card-image')],
        objectFit: (node.props as {objectFit?: string} | null | undefined)?.objectFit ?? (orientation === 'horizontal' ? 'cover' : 'contain')
      }), true)
    };
  }

  if (isIllustrationVNode(node)) {
    return {
      kind: 'illustration',
      node: cloneVNode(node, mergeProps(node.props ?? {}, {
        class: [baseClassName, classNames(styles, 'spectrum-Card-illustration')]
      }), true)
    };
  }

  if (isAvatarVNode(node)) {
    return {
      kind: 'avatar',
      node: cloneVNode(node, mergeProps(node.props ?? {}, {
        class: [baseClassName, classNames(styles, 'spectrum-Card-avatar')]
      }), true)
    };
  }

  return {
    kind: 'other',
    node
  };
}

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

  if (layout === GalleryLayout) {
    return 'gallery';
  }

  if (layout === WaterfallLayout) {
    return 'waterfall';
  }

  if (layout === GridLayout) {
    return 'grid';
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

function toLayoutSize(value: unknown): Size | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  let width = (value as {width?: unknown}).width;
  let height = (value as {height?: unknown}).height;
  if (typeof width === 'number' && Number.isFinite(width) && typeof height === 'number' && Number.isFinite(height)) {
    return new Size(width, height);
  }

  return undefined;
}

function normalizeCardViewLayoutOptions(
  layoutOptions: Record<string, unknown> | undefined,
  cardOrientation: CardOrientation
) {
  let normalized: Record<string, unknown> = {
    ...(layoutOptions ?? {}),
    cardOrientation,
    scale: 'medium'
  };

  for (let key of ['itemSpacing', 'maxItemSize', 'minItemSize', 'minSpace']) {
    let size = toLayoutSize(normalized[key]);
    if (size) {
      normalized[key] = size;
    }
  }

  return normalized;
}

function finalizeLayout(
  layoutInfos: Map<string, CardLayoutInfo>,
  viewportWidth: number,
  viewportHeight: number,
  contentHeight: number,
  isLoading: boolean,
  itemCount: number
) {
  let nextContentHeight = contentHeight;

  if (isLoading) {
    let loaderY = nextContentHeight;
    let loaderHeight = 60;
    if (itemCount === 0) {
      loaderY = 0;
      loaderHeight = viewportHeight || 60;
    }

    layoutInfos.set('loader', {
      rect: new Rect(0, loaderY, viewportWidth, loaderHeight)
    });
    nextContentHeight = loaderY + loaderHeight;
  }

  if (itemCount === 0 && !isLoading) {
    layoutInfos.set('placeholder', {
      rect: new Rect(0, 0, viewportWidth, viewportHeight)
    });
    nextContentHeight = viewportHeight;
  }

  return new Size(viewportWidth, nextContentHeight);
}

function linearPartition(seq: number[], k: number): number[][] {
  let n = seq.length;
  if (n === 0) {
    return [];
  }

  if (k <= 0) {
    return [];
  }

  if (k >= n) {
    return seq.map((value) => [value]);
  }

  if (n === 1) {
    return [seq];
  }

  let table = Array.from({length: n}, () => Array(k).fill(0));
  let solution = Array.from({length: n - 1}, () => Array(k - 1).fill(0));

  table[0][0] = seq[0];
  for (let i = 1; i < n; i++) {
    table[i][0] = seq[i] + table[i - 1][0];
  }

  for (let j = 0; j < k; j++) {
    table[0][j] = seq[0];
  }

  for (let i = 1; i < n; i++) {
    for (let j = 1; j < k; j++) {
      let current = Infinity;
      let minX = 0;
      for (let x = 0; x < i; x++) {
        let cost = Math.max(table[x][j - 1], table[i][0] - table[x][0]);
        if (cost < current) {
          current = cost;
          minX = x;
        }
      }

      table[i][j] = current;
      solution[i - 1][j - 1] = minX;
    }
  }

  let result: number[][] = [];
  let remainingK = k - 2;
  let remainingN = n - 1;
  while (remainingK >= 0) {
    let splitPoint = solution[remainingN - 1][remainingK];
    result.unshift(seq.slice(splitPoint + 1, remainingN + 1));
    remainingN = splitPoint;
    remainingK--;
  }
  result.unshift(seq.slice(0, remainingN + 1));
  return result;
}

function distributeWidths(widths: Array<[number, number]>, minWidth: number) {
  let sortedWidths = widths.concat().sort((a, b) => a[1] > b[1] ? -1 : 1);

  for (let width of widths) {
    if (width[1] < minWidth) {
      let delta = minWidth - width[1];
      for (let item of sortedWidths) {
        if (widths[item[0]][1] > minWidth) {
          if (widths[item[0]][1] - delta > minWidth) {
            widths[item[0]][1] -= delta;
            delta = 0;
            break;
          }

          let maxChange = widths[item[0]][1] - minWidth;
          delta -= maxChange;
          widths[item[0]][1] -= maxChange;
        }
      }

      if (delta > 0) {
        return false;
      }

      width[1] = minWidth;
    }
  }

  return true;
}

function createCardViewLayoutEngine(
  layout: CardLayout,
  layoutOptions: Record<string, unknown> | undefined,
  cardOrientation: CardOrientation
) {
  let normalizedOptions = normalizeCardViewLayoutOptions(layoutOptions, cardOrientation);

  let layoutInfos = new Map<string, CardLayoutInfo>();
  let contentSize = new Size(0, 0);

  return {
    collection: {
      size: 0,
      rows: [],
      *[Symbol.iterator]() {
        yield* [];
      }
    } as LayoutCollection,
    direction: 'ltr' as const,
    getContentSize() {
      return contentSize;
    },
    getLayoutInfo(key: string) {
      return layoutInfos.get(key);
    },
    isLoading: false,
    layoutInfos,
    margin: typeof normalizedOptions.margin === 'number' ? normalizedOptions.margin : 24,
    virtualizer: {
      contentSize: new Size(0, 0),
      isPersistedKey: () => false,
      visibleRect: new Rect(0, 0, 0, 0)
    },
    buildCollection(_invalidationContext?: Record<string, unknown>) {
      layoutInfos.clear();

      let viewportWidth = Math.max(1, this.virtualizer.visibleRect.width);
      let viewportHeight = Math.max(1, this.virtualizer.visibleRect.height);
      let rows = this.collection.rows;

      if (layout === 'gallery') {
        let idealRowHeight = typeof normalizedOptions.idealRowHeight === 'number' ? normalizedOptions.idealRowHeight : 208;
        let itemSpacing = toLayoutSize(normalizedOptions.itemSpacing) ?? new Size(18, 18);
        let itemPadding = typeof normalizedOptions.itemPadding === 'number' ? normalizedOptions.itemPadding : 78;
        let minItemSize = toLayoutSize(normalizedOptions.minItemSize) ?? new Size(136, 136);
        let threshold = typeof normalizedOptions.threshold === 'number' ? normalizedOptions.threshold : 1;
        let margin = typeof normalizedOptions.margin === 'number' ? normalizedOptions.margin : 24;
        let y = margin;
        let availableWidth = viewportWidth - margin * 2;

        if (availableWidth > 0 && rows.length > 0) {
          let ratios: number[] = [];
          let totalWidth = 0;
          let minRatio = minItemSize.width / minItemSize.height;
          let maxRatio = availableWidth / minItemSize.height;

          for (let row of rows) {
            let ratio = (row.props.width && row.props.height)
              ? row.props.width / row.props.height
              : 1;
            if (ratio < minRatio) {
              ratio = minRatio;
            } else if (ratio > maxRatio && ratio !== minRatio) {
              ratio = maxRatio;
            }

            let itemWidth = ratio * minItemSize.height;
            ratios.push(ratio);
            totalWidth += itemWidth;
          }

          totalWidth += itemSpacing.width * Math.max(0, rows.length - 1);
          let partitionRowCount = Math.max(1, Math.ceil(totalWidth / availableWidth));
          if (availableWidth <= (minItemSize.width * 2) + (itemPadding * 2)) {
            partitionRowCount = rows.length;
          }

          let weightedRatios = ratios.map((ratio) => ratio < threshold ? ratio + (0.5 * (1 / ratio)) : ratio);
          let partition = linearPartition(weightedRatios, Math.max(1, partitionRowCount));
          let index = 0;

          for (let partitionRow of partition) {
            let totalWeight = 0;
            for (let j = index; j < index + partitionRow.length; j++) {
              totalWeight += ratios[j];
            }

            let bestRowHeight = (availableWidth - (partitionRow.length - 1) * itemSpacing.width) / totalWeight;
            if (partitionRow === partition[partition.length - 1] && bestRowHeight > idealRowHeight * 2) {
              bestRowHeight = idealRowHeight;
            }

            let itemHeight = Math.round(bestRowHeight) + itemPadding;
            let x = margin;
            let widths: Array<[number, number]> = [];
            for (let j = index; j < index + partitionRow.length; j++) {
              widths.push([j - index, Math.round(bestRowHeight * ratios[j])]);
            }
            distributeWidths(widths, minItemSize.width);

            for (let j = index; j < index + partitionRow.length; j++) {
              let row = rows[j];
              let itemWidth = Math.max(widths[j - index][1], minItemSize.width);
              layoutInfos.set(row.key, {
                allowOverflow: true,
                rect: new Rect(x, y, itemWidth, itemHeight)
              });
              x += itemWidth + itemSpacing.width;
            }

            y += itemHeight + itemSpacing.height;
            index += partitionRow.length;
          }
        }

        this.margin = margin;
        contentSize = finalizeLayout(layoutInfos, viewportWidth, viewportHeight, y, this.isLoading, rows.length);
        return;
      }

      if (layout === 'waterfall') {
        let minItemSize = toLayoutSize(normalizedOptions.minItemSize) ?? new Size(240, 136);
        let maxItemSize = toLayoutSize(normalizedOptions.maxItemSize) ?? new Size(Infinity, Infinity);
        let minSpace = toLayoutSize(normalizedOptions.minSpace) ?? new Size(18, 18);
        let maxColumns = typeof normalizedOptions.maxColumns === 'number' ? normalizedOptions.maxColumns : Infinity;
        let margin = typeof normalizedOptions.margin === 'number' ? normalizedOptions.margin : 24;
        let availableWidth = viewportWidth - margin * 2;
        let columns = Math.floor((availableWidth + minSpace.width) / (minItemSize.width + minSpace.width));
        let numColumns = Math.max(1, Math.min(maxColumns, columns));
        let width = availableWidth - (minSpace.width * Math.max(0, numColumns - 1));
        let itemWidth = Math.round(width / numColumns);
        itemWidth = Math.max(minItemSize.width, Math.min(maxItemSize.width, itemWidth));
        let horizontalSpacing = Math.round((availableWidth - numColumns * itemWidth) / Math.max(1, numColumns - 1));
        let columnHeights = Array(numColumns).fill(margin);

        for (let row of rows) {
          let itemHeight = itemWidth;
          if (row.props.width && row.props.height) {
            let scaledHeight = Math.round(row.props.height * (itemWidth / row.props.width));
            itemHeight = Math.max(minItemSize.height, Math.min(maxItemSize.height, scaledHeight));
          }

          let columnIndex = 0;
          for (let i = 1; i < columnHeights.length; i++) {
            if (columnHeights[i] < columnHeights[columnIndex]) {
              columnIndex = i;
            }
          }

          let x = margin + columnIndex * (itemWidth + horizontalSpacing);
          let y = columnHeights[columnIndex];
          layoutInfos.set(row.key, {
            allowOverflow: true,
            rect: new Rect(x, y, itemWidth, itemHeight)
          });
          columnHeights[columnIndex] += itemHeight + minSpace.height;
        }

        let contentHeight = rows.length > 0
          ? Math.max(...columnHeights) - minSpace.height + margin
          : 0;
        this.margin = margin;
        contentSize = finalizeLayout(layoutInfos, viewportWidth, viewportHeight, contentHeight, this.isLoading, rows.length);
        return;
      }

      let minItemSize = toLayoutSize(normalizedOptions.minItemSize) ?? (cardOrientation === 'horizontal' ? new Size(102, 102) : new Size(208, 208));
      let maxItemSize = toLayoutSize(normalizedOptions.maxItemSize) ?? new Size(Infinity, Infinity);
      let minSpace = toLayoutSize(normalizedOptions.minSpace) ?? new Size(18, 18);
      let maxColumns = typeof normalizedOptions.maxColumns === 'number' ? normalizedOptions.maxColumns : Infinity;
      let itemPadding = typeof normalizedOptions.itemPadding === 'number' ? normalizedOptions.itemPadding : (cardOrientation === 'horizontal' ? 150 : 78);
      let margin = typeof normalizedOptions.margin === 'number' ? normalizedOptions.margin : 24;
      let horizontalItemPadding = cardOrientation === 'horizontal' ? itemPadding : 0;
      let verticalItemPadding = cardOrientation === 'vertical' ? itemPadding : 0;
      let minCardWidth = minItemSize.width + horizontalItemPadding;
      let availableWidth = viewportWidth - margin * 2;
      let columns = Math.floor((availableWidth + minSpace.width) / (minCardWidth + minSpace.width));
      let numColumns = Math.max(1, Math.min(maxColumns, columns));
      let gridWidth = availableWidth - (minSpace.width * Math.max(0, numColumns - 1));
      let itemWidth = Math.floor(gridWidth / numColumns);
      itemWidth = Math.max(minCardWidth, Math.min(maxItemSize.width, itemWidth));
      let t = ((itemWidth - minCardWidth) / minCardWidth);
      let itemHeight = Math.floor(minItemSize.height + minItemSize.height * t);
      itemHeight = Math.max(minItemSize.height, Math.min(maxItemSize.height, itemHeight)) + verticalItemPadding;
      let horizontalSpacing = numColumns < 2 ? 0 : Math.floor((availableWidth - numColumns * itemWidth) / (numColumns - 1));

      for (let index = 0; index < rows.length; index++) {
        let row = Math.floor(index / numColumns);
        let column = index % numColumns;
        let x = margin + column * (itemWidth + horizontalSpacing);
        let y = margin + row * (itemHeight + minSpace.height);
        layoutInfos.set(rows[index].key, {
          allowOverflow: true,
          rect: new Rect(x, y, itemWidth, itemHeight)
        });
      }

      let numRows = Math.ceil(rows.length / numColumns);
      let contentHeight = rows.length > 0
        ? margin + Math.max(0, numRows - 1) * (itemHeight + minSpace.height) + itemHeight
        : 0;
      this.margin = margin;
      contentSize = finalizeLayout(layoutInfos, viewportWidth, viewportHeight, contentHeight, this.isLoading, rows.length);
    }
  };
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
    showSelectionCheckbox: {
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
    let imageNodes = computed(() => slots.preview ? slots.preview() : []);
    let illustrationNodes = computed(() => slots.illustration ? slots.illustration() : []);
    let avatarNodes = computed(() => slots.avatar ? slots.avatar() : []);
    let defaultChildren = computed(() => slots.default ? flattenChildren(slots.default()) : []);

    let hasDefaultHeading = computed(() => defaultChildren.value.some(isHeadingVNode));
    let hasDefaultContent = computed(() => defaultChildren.value.some(isContentVNode));
    let hasDefaultDetail = computed(() => defaultChildren.value.some(isDetailVNode));
    let hasDefaultImage = computed(() => defaultChildren.value.some(isImageVNode));
    let hasDefaultIllustration = computed(() => defaultChildren.value.some(isIllustrationVNode));
    let hasDefaultAvatar = computed(() => defaultChildren.value.some(isAvatarVNode));

    let hasTitle = computed(() => hasRenderableContent(titleNodes.value) || hasDefaultHeading.value);
    let hasDetail = computed(() => hasRenderableContent(detailNodes.value) || hasDefaultDetail.value);
    let hasContent = computed(() => hasRenderableContent(contentNodes.value) || hasDefaultContent.value);
    let hasImage = computed(() => hasRenderableContent(imageNodes.value) || hasDefaultImage.value);
    let hasIllustration = computed(() => hasRenderableContent(illustrationNodes.value) || hasDefaultIllustration.value);
    let hasAvatar = computed(() => hasRenderableContent(avatarNodes.value) || hasDefaultAvatar.value);
    let hasPreview = computed(() => hasImage.value || hasIllustration.value);
    let resolvedTabIndex = computed(() => {
      let tabIndex = attrs.tabindex;
      if (typeof tabIndex === 'number' && Number.isFinite(tabIndex)) {
        return Math.trunc(tabIndex);
      }

      if (typeof tabIndex === 'string' && tabIndex.trim().length > 0) {
        let parsed = Number.parseInt(tabIndex, 10);
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }

      return 0;
    });

    let titleId = computed(() => hasTitle.value ? `${cardBaseId.value}-title` : undefined);
    let descriptionId = computed(() => hasContent.value ? `${cardBaseId.value}-description` : undefined);
    let renderedDefaultChildren = computed(() => defaultChildren.value.map((node) => decorateCardChild(node, {
      descriptionId: descriptionId.value,
      orientation: props.orientation,
      titleId: titleId.value
    })));

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
      tabindex: isDisabled.value ? -1 : resolvedTabIndex.value,
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
        props.showSelectionCheckbox
          ? h('div', {
            class: classNames(styles, 'spectrum-Card-checkboxWrapper')
          }, [
            h('label', {
              class: classNames(styles, 'spectrum-Checkbox', {'is-checked': isSelected.value}, 'spectrum-Card-checkbox')
            }, [
              h('input', {
                'aria-label': 'select',
                checked: isSelected.value,
                class: classNames(styles, 'spectrum-Checkbox-input'),
                'data-react-aria-pressable': 'true',
                disabled: isDisabled.value,
                tabindex: -1,
                type: 'checkbox'
              }),
              h('span', {class: classNames(styles, 'spectrum-Checkbox-box')}, [
                h('svg', {
                  class: classNames(styles, 'spectrum-Icon', 'spectrum-UIIcon-CheckmarkSmall', 'spectrum-Checkbox-checkmark'),
                  focusable: 'false',
                  'aria-hidden': 'true',
                  role: 'img'
                }, [
                  h('path', {d: 'M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1 1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712 6A.999.999 0 0 1 3.788 9z'})
                ])
              ])
            ])
          ])
          : null,
        ...(renderedDefaultChildren.value.length > 0
          ? renderedDefaultChildren.value.map((child) => child.node)
          : [
            hasImage.value
              ? h('div', {
                class: classNames(styles, 'spectrum-Card-image'),
                style: {overflow: 'hidden'}
              }, imageNodes.value)
              : null,
            hasIllustration.value
              ? h('div', {
                class: classNames(styles, 'spectrum-Card-illustration'),
                style: {overflow: 'hidden'}
              }, illustrationNodes.value)
              : null,
            hasAvatar.value ? h('div', {class: classNames(styles, 'spectrum-Card-avatar')}, avatarNodes.value) : null,
            hasTitle.value ? h('h3', {id: titleId.value, class: classNames(styles, 'spectrum-Card-heading')}, titleNodes.value) : null,
            hasDetail.value ? h('span', {class: classNames(styles, 'spectrum-Card-detail'), role: 'none'}, detailNodes.value) : null,
            hasContent.value ? h('section', {id: descriptionId.value, class: classNames(styles, 'spectrum-Card-content')}, contentNodes.value) : null
          ]),
        h('div', {class: classNames(styles, 'spectrum-Card-decoration')})
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
      default: false
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
      default: 'none'
    }
  },
  emits: {
    action: (item: CardViewItem) => typeof item === 'object' && item !== null,
    change: (value: unknown) => isCardViewSelectionValue(value),
    selectionChange: (value: unknown) => isCardViewSelectionChangeValue(value),
    'update:modelValue': (value: unknown) => isCardViewSelectionValue(value)
  },
  setup(props, {emit, attrs, slots}) {
    let resolvedLayout = computed(() => resolveCardViewLayout(props.layout));
    let effectiveSelectionMode = computed<CardViewSelectionMode>(() => (
      props.cardOrientation === 'horizontal' && resolvedLayout.value === 'grid'
        ? 'none'
        : props.selectionMode
    ));
    let effectiveIsQuiet = computed(() => (
      resolvedLayout.value === 'grid' || resolvedLayout.value === 'gallery'
        ? true
        : props.isQuiet
    ));
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
    let selectedKeys = computed(() => {
      if (effectiveSelectionMode.value === 'none') {
        return new Set<string>();
      }

      if (props.selectedKeys === 'all') {
        return new Set<string>(itemKeySet.value);
      }

      let selected = toStringArray(props.selectedKeys ?? props.modelValue);
      return new Set(selected.filter((key) => itemKeySet.value.has(key)));
    });
    let isLoading = computed(() => props.loadingState === 'loading' || props.loadingState === 'loadingMore');
    let collectionId = `vs-card-view-${++cardViewId}`;
    let rootRef = ref<HTMLElement | null>(null);
    let viewportWidth = ref(0);
    let viewportHeight = ref(0);
    let resizeObserver: ResizeObserver | null = null;

    let updateViewport = () => {
      if (!rootRef.value) {
        return;
      }

      let rect = rootRef.value.getBoundingClientRect();
      viewportWidth.value = Math.max(1, Math.round(rect.width));
      viewportHeight.value = Math.max(1, Math.round(rect.height));
    };

    onMounted(() => {
      nextTick().then(updateViewport);
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          updateViewport();
        });

        if (rootRef.value) {
          resizeObserver.observe(rootRef.value);
        }
      }
    });

    onBeforeUnmount(() => {
      resizeObserver?.disconnect();
    });

    let emitSelection = (nextSelection: Set<string>) => {
      if (effectiveSelectionMode.value === 'single') {
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

      if (effectiveSelectionMode.value === 'none') {
        emit('action', item);
        return;
      }

      if (effectiveSelectionMode.value === 'single') {
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

    let layoutState = computed(() => {
      let width = Math.max(1, viewportWidth.value || 800);
      let height = Math.max(1, viewportHeight.value || 600);
      let rows = normalizedItems.value.map(({item, key}) => ({
        key,
        type: 'item',
        props: {
          height: typeof item.height === 'number' ? item.height : undefined,
          width: typeof item.width === 'number' ? item.width : undefined
        }
      }));

      let collection = {
        size: rows.length,
        rows,
        *[Symbol.iterator]() {
          yield* rows;
        }
      };

      let layoutEngine = createCardViewLayoutEngine(
        resolvedLayout.value,
        props.layoutOptions,
        props.cardOrientation
      ) as {
        buildCollection: (invalidationContext?: Record<string, unknown>) => void,
        collection: typeof collection,
        direction: 'ltr' | 'rtl',
        getContentSize: () => Size,
        getLayoutInfo: (key: string) => {rect: Rect, allowOverflow?: boolean} | undefined,
        isLoading: boolean,
        layoutInfos: Map<string, {rect: Rect, allowOverflow?: boolean}>,
        margin: number,
        virtualizer: Record<string, unknown>
      };

      layoutEngine.collection = collection;
      layoutEngine.direction = 'ltr';
      layoutEngine.isLoading = isLoading.value;
      layoutEngine.layoutInfos.clear();
      layoutEngine.virtualizer = {
        contentSize: new Size(width, height),
        isPersistedKey: () => false,
        visibleRect: new Rect(0, 0, width, height)
      };
      layoutEngine.buildCollection({
        layoutOptions: {
          direction: 'ltr',
          isLoading: isLoading.value
        },
        sizeChanged: true
      });

      let contentSize = layoutEngine.getContentSize();
      return {
        contentHeight: Math.max(height, Math.ceil(contentSize.height)),
        contentWidth: width,
        loaderLayoutInfo: layoutEngine.layoutInfos.get('loader'),
        margin: layoutEngine.margin,
        placeholderLayoutInfo: layoutEngine.layoutInfos.get('placeholder'),
        rowLayoutInfoByKey: new Map(rows.map((row) => [row.key, layoutEngine.getLayoutInfo(row.key)]))
      };
    });

    return () => {
      let presentationStyle = (layoutInfo: {rect: Rect, allowOverflow?: boolean}) => ({
        contain: layoutInfo.allowOverflow ? 'size layout style' : undefined,
        height: `${Math.ceil(layoutInfo.rect.height)}px`,
        left: `${Math.round(layoutInfo.rect.x)}px`,
        opacity: 1,
        overflow: layoutInfo.allowOverflow ? 'visible' : 'hidden',
        position: 'absolute',
        top: `${Math.round(layoutInfo.rect.y)}px`,
        width: `${Math.ceil(layoutInfo.rect.width)}px`,
        zIndex: 0
      });

      let renderCenteredLayout = (layoutInfo: {rect: Rect, allowOverflow?: boolean} | undefined, content: unknown) => {
        if (!layoutInfo) {
          return null;
        }

        return h('div', {
          key: layoutInfo === layoutState.value.loaderLayoutInfo ? 'loader' : 'placeholder',
          role: 'presentation',
          style: presentationStyle(layoutInfo)
        }, [
          h('div', {
            role: 'row',
            'aria-rowindex': normalizedItems.value.length + 1,
            class: classNames(styles, 'spectrum-CardView-centeredWrapper')
          }, [
            h('div', {role: 'gridcell'}, [content])
          ])
        ]);
      };

      let itemRows = normalizedItems.value.map(({item, key}, index) => {
        let rowLayoutInfo = layoutState.value.rowLayoutInfoByKey.get(key);
        if (!rowLayoutInfo) {
          return null;
        }

        let itemTitle = item.title ? String(item.title) : `Item ${index + 1}`;
        let itemDetail = item.detail ? String(item.detail) : 'PNG';
        let itemDescription = item.description ? String(item.description) : CARD_DEFAULT_DESCRIPTION;
        let itemSrc = item.src ? String(item.src) : undefined;
        let isItemDisabled = props.disabled || disabledKeySet.value.has(key);
        let isItemSelected = selectedKeys.value.has(key);
        let cardOrientation = resolvedLayout.value === 'grid' ? props.cardOrientation : 'vertical';

        let fallbackCardSlots = itemSrc
          ? {
            preview: () => [
              h('img', {
                alt: '',
                class: classNames(styles, 'spectrum-Image-img'),
                src: itemSrc,
                style: {
                  objectFit: cardOrientation === 'horizontal' ? 'cover' : 'contain'
                }
              })
            ]
          }
          : undefined;
        let cardProps = {
          description: itemDescription,
          detail: itemDetail,
          'data-collection': collectionId,
          'data-key': `cell-${key}`,
          isDisabled: isItemDisabled,
          isQuiet: effectiveIsQuiet.value,
          isSelected: isItemSelected,
          layout: resolvedLayout.value,
          orientation: cardOrientation,
          role: 'gridcell',
          showSelectionCheckbox: effectiveSelectionMode.value !== 'none',
          tabindex: -1,
          title: itemTitle,
          'aria-selected': effectiveSelectionMode.value === 'none' ? undefined : (isItemSelected ? 'true' : 'false'),
          onPress: () => onItemPress(item, key)
        };
        let renderedCardChildren = slots.default ? flattenChildren(slots.default({item, index})) : [];
        let cardNode = renderedCardChildren.length > 0
          ? cloneVNode(renderedCardChildren[0], mergeProps(renderedCardChildren[0].props ?? {}, cardProps), true)
          : h(Card, cardProps, fallbackCardSlots);

        return h('div', {
          key,
          role: 'presentation',
          style: presentationStyle(rowLayoutInfo)
        }, [
          h('div', {
            role: 'row',
            tabindex: -1,
            'aria-rowindex': index + 1,
            'data-collection': collectionId,
            'data-key': key,
            class: classNames(styles, 'spectrum-CardView-row')
          }, [
            cardNode
          ])
        ]);
      }).filter(Boolean);

      if (normalizedItems.value.length === 0) {
        if (isLoading.value) {
          let loadingState = renderCenteredLayout(layoutState.value.loaderLayoutInfo, h(ProgressCircle, {
            'aria-label': props.loadingState === 'loadingMore' ? 'Loading more…' : 'Loading…',
            isIndeterminate: true
          }));
          if (loadingState) {
            itemRows.push(loadingState);
          }
        } else if (props.renderEmptyState) {
          let emptyState = renderCenteredLayout(layoutState.value.placeholderLayoutInfo, props.renderEmptyState());
          if (emptyState) {
            itemRows.push(emptyState);
          }
        }
      } else if (props.loadingState === 'loadingMore') {
        let loadingMoreState = renderCenteredLayout(layoutState.value.loaderLayoutInfo, h(ProgressCircle, {
          'aria-label': 'Loading more…',
          isIndeterminate: true
        }));
        if (loadingMoreState) {
          itemRows.push(loadingMoreState);
        }
      }

      return h('div', {
        ...attrs,
        ref: rootRef,
        class: [classNames(styles, 'spectrum-CardView'), attrs.class],
        'data-collection': collectionId,
        role: 'grid',
        'aria-colcount': 1,
        'aria-label': attrs['aria-label'],
        'aria-multiselectable': effectiveSelectionMode.value === 'multiple' ? 'true' : undefined,
        'aria-rowcount': normalizedItems.value.length,
        tabindex: normalizedItems.value.length === 0 && !isLoading.value ? -1 : 0,
        style: [
          {
            height: '100%',
            overflow: 'hidden auto',
            padding: '0px',
            scrollPaddingTop: `${layoutState.value.margin}px`,
            width: '100%'
          },
          attrs.style
        ]
      }, [
        h('div', {
          role: 'presentation',
          style: {
            height: `${layoutState.value.contentHeight}px`,
            pointerEvents: 'auto',
            position: 'relative',
            width: `${layoutState.value.contentWidth}px`
          }
        }, itemRows)
      ]);
    };
  }
});
export function GalleryLayout(options: GalleryLayoutOptions = {}) {
  return options;
}

export function GridLayout(options: GridLayoutOptions = {}) {
  return options;
}

export function WaterfallLayout(options: WaterfallLayoutOptions = {}) {
  return options;
}
export const VueCard = Card;
export const VueCardView = CardView;
export type {SpectrumCardViewProps} from '@vue-types/card';
