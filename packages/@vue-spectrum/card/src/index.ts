import '@adobe/spectrum-css-temp/components/card/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {Comment, computed, defineComponent, h, isVNode, Text, type PropType, ref} from 'vue';
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
  description?: string,
  id: string,
  title: string
};

type CardLayout = 'gallery' | 'grid' | 'waterfall';
type CardOrientation = 'horizontal' | 'vertical';

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
      class: [className.value, 'vs-card', attrs.class],
      role: typeof attrs.role === 'string' ? attrs.role : 'article',
      tabindex: isDisabled.value ? -1 : 0,
      'aria-disabled': isDisabled.value ? 'true' : undefined,
      'aria-label': typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : (hasTitle.value ? undefined : props.title || undefined),
      'aria-labelledby': titleId.value,
      'aria-describedby': descriptionId.value,
      'data-vac': '',
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
        if (target instanceof HTMLElement && target.matches(':focus-visible')) {
          isFocusVisible.value = true;
        } else {
          isFocusVisible.value = true;
        }
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
        hasTitle.value ? h('span', {id: titleId.value, class: ['vs-card__title', classNames(styles, 'spectrum-Card-heading')]}, titleNodes.value) : null,
        hasDetail.value ? h('span', {class: ['vs-card__detail', classNames(styles, 'spectrum-Card-detail')]}, detailNodes.value) : null,
        hasContent.value ? h('span', {id: descriptionId.value, class: ['vs-card__description', classNames(styles, 'spectrum-Card-content')]}, contentNodes.value) : null,
        h('div', {class: classNames(styles, 'spectrum-Card-decoration'), 'aria-hidden': 'true'})
      ])
    ]);
  }
});

export const CardView = defineComponent({
  name: 'VueCardView',
  inheritAttrs: false,
  props: {
    columns: {
      type: Number,
      default: 3
    },
    disabled: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array as PropType<CardViewItem[]>,
      default: () => []
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: {
    action: (item: CardViewItem) => typeof item === 'object' && item !== null,
    'update:modelValue': (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs}) {
    let columnCount = computed(() => Math.max(1, Math.round(props.columns)));
    let focusedId = ref<string | null>(null);
    let hoveredId = ref<string | null>(null);

    return () => h('div', {
      ...attrs,
      class: [classNames(styles, 'spectrum-CardView'), 'vs-card-view', attrs.class],
      role: 'grid',
      'aria-label': attrs['aria-label'],
      style: {
        gridTemplateColumns: `repeat(${columnCount.value}, minmax(0, 1fr))`
      },
      'data-vac': ''
    }, props.items.map((item, index) => {
      let rowId = `vs-card-view-row-${item.id}`;
      let titleId = `${rowId}-title`;
      let descriptionId = `${rowId}-description`;
      let isSelected = props.modelValue === item.id;
      let isFocused = focusedId.value === item.id;
      let isHovered = hoveredId.value === item.id && !props.disabled;

      return h('div', {
        key: item.id,
        role: 'row',
        'aria-rowindex': index + 1,
        class: classNames(styles, 'spectrum-CardView-row')
      }, [
        h('button', {
          class: [classNames(
            styles,
            'spectrum-Card',
            'spectrum-Card--isQuiet',
            {
              'is-selected': isSelected,
              'is-focused': isFocused,
              'is-hovered': isHovered,
              'focus-ring': isFocused
            }
          ), 'vs-card-view__item'],
          type: 'button',
          role: 'gridcell',
          disabled: props.disabled,
          'aria-label': item.title,
          'aria-labelledby': titleId,
          'aria-describedby': item.description ? descriptionId : undefined,
          onMouseenter: () => {
            hoveredId.value = item.id;
          },
          onMouseleave: () => {
            if (hoveredId.value === item.id) {
              hoveredId.value = null;
            }
          },
          onFocus: () => {
            focusedId.value = item.id;
          },
          onBlur: () => {
            if (focusedId.value === item.id) {
              focusedId.value = null;
            }
          },
          onClick: () => {
            if (props.disabled) {
              return;
            }

            emit('update:modelValue', item.id);
            emit('action', item);
          }
        }, [
          h('span', {id: titleId, class: ['vs-card-view__title', classNames(styles, 'spectrum-Card-heading')]}, item.title),
          item.description ? h('span', {id: descriptionId, class: ['vs-card-view__description', classNames(styles, 'spectrum-Card-content')]}, item.description) : null
        ])
      ]);
    }));
  }
});
export const GalleryLayout = (options: GalleryLayoutOptions = {}) => options;
export const GridLayout = (options: GridLayoutOptions = {}) => options;
export const WaterfallLayout = (options: WaterfallLayoutOptions = {}) => options;
export const VueCard = Card;
export const VueCardView = CardView;
export type {SpectrumCardViewProps} from '@vue-types/card';
