import '@adobe/spectrum-css-temp/components/card/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref} from 'vue';
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

let cardId = 0;

export const Card = defineComponent({
  name: 'VueCard',
  inheritAttrs: false,
  props: {
    description: {
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
    isQuiet: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
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
    let titleId = computed(() => props.title ? `${cardBaseId.value}-title` : undefined);
    let descriptionId = computed(() => props.description ? `${cardBaseId.value}-description` : undefined);
    let isQuiet = computed(() => props.isQuiet ?? props.quiet);

    let isHovered = ref(false);
    let isFocused = ref(false);
    let isFocusVisible = ref(false);

    let className = computed(() => classNames(
      styles,
      'spectrum-Card',
      {
        'spectrum-Card--default': !isQuiet.value,
        'spectrum-Card--isQuiet': isQuiet.value,
        'spectrum-Card--noLayout': true,
        'is-hovered': isHovered.value && !props.disabled,
        'is-focused': isFocused.value,
        'is-selected': props.selected,
        'focus-ring': isFocusVisible.value
      }
    ));

    return () => h('button', {
      ...attrs,
      type: 'button',
      class: [className.value, 'vs-card', attrs.class],
      disabled: props.disabled,
      tabindex: props.disabled ? -1 : 0,
      'aria-label': typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : (props.title || undefined),
      'aria-labelledby': titleId.value,
      'aria-describedby': descriptionId.value,
      'data-vac': '',
      onMouseenter: () => {
        if (!props.disabled) {
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
        if (!props.disabled) {
          emit('press');
        }
      }
    }, [
      h('div', {class: classNames(styles, 'spectrum-Card-grid')}, [
        props.title ? h('span', {id: titleId.value, class: ['vs-card__title', classNames(styles, 'spectrum-Card-heading')]}, props.title) : null,
        props.description ? h('span', {id: descriptionId.value, class: ['vs-card__description', classNames(styles, 'spectrum-Card-content')]}, props.description) : null,
        slots.default ? h('span', {class: ['vs-card__content', classNames(styles, 'spectrum-Card-detail')]}, slots.default()) : null,
        h('span', {class: classNames(styles, 'spectrum-Card-decoration'), 'aria-hidden': 'true'})
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
