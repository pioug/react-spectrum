import '@adobe/spectrum-css-temp/components/breadcrumb/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, ref} from 'vue';
const styles: {[key: string]: string} = {};


export const Breadcrumbs = defineComponent({
  name: 'VueBreadcrumbs',
  inheritAttrs: false,
  props: {
    current: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array as () => string[],
      default: () => []
    }
  },
  emits: {
    action: (key: string) => typeof key === 'string'
  },
  setup(props, {emit, attrs}) {
    let currentItem = computed(() => props.current || props.items[props.items.length - 1] || '');
    let hoveredItem = ref<string | null>(null);
    let focusedItem = ref<string | null>(null);

    return () => h('nav', {
      ...attrs,
      class: ['vs-breadcrumbs', attrs.class],
      'aria-label': (typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : undefined) || 'Breadcrumbs',
      'data-vac': ''
    }, [
      h('ol', {
        class: [classNames(
          styles,
          'spectrum-Breadcrumbs',
          {
            'is-disabled': props.disabled
          }
        ), 'vs-breadcrumbs__list']
      }, props.items.map((item, index) => {
        let isCurrent = item === currentItem.value;
        let isHovered = hoveredItem.value === item && !props.disabled && !isCurrent;
        let isFocused = focusedItem.value === item && !isCurrent;

        return h('li', {
          key: `${item}-${index}`,
          class: [classNames(styles, 'spectrum-Breadcrumbs-item'), 'vs-breadcrumbs__item']
        }, [
          isCurrent
            ? h('span', {
              class: 'vs-breadcrumbs__current',
              'aria-current': 'page'
            }, item)
            : h('button', {
              class: [classNames(
                styles,
                'spectrum-Breadcrumbs-itemLink',
                {
                  'is-hovered': isHovered,
                  'focus-ring': isFocused,
                  'is-reversed': false
                }
              ), 'vs-breadcrumbs__link'],
              type: 'button',
              disabled: props.disabled,
              onMouseenter: () => {
                hoveredItem.value = item;
              },
              onMouseleave: () => {
                if (hoveredItem.value === item) {
                  hoveredItem.value = null;
                }
              },
              onFocus: () => {
                focusedItem.value = item;
              },
              onBlur: () => {
                if (focusedItem.value === item) {
                  focusedItem.value = null;
                }
              },
              onClick: () => emit('action', item)
            }, item),
          index < props.items.length - 1
            ? h('span', {
              class: [classNames(styles, 'spectrum-Breadcrumbs-itemSeparator'), 'vs-breadcrumbs__separator'],
              'aria-hidden': 'true'
            }, '›')
            : null
        ]);
      }))
    ]);
  }
});

export const VueBreadcrumbs = Breadcrumbs;
export {Item} from '@vue-stately/collections';
export type {SpectrumBreadcrumbsProps} from '@vue-types/breadcrumbs';
