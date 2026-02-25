import '@adobe/spectrum-css-temp/components/breadcrumb/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, nextTick, onMounted, type PropType, ref} from 'vue';
const styles: {[key: string]: string} = {};

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

function normalizeBreadcrumbItem(item: BreadcrumbItemInput, index: number): NormalizedBreadcrumbItem {
  if (typeof item === 'string') {
    return {
      key: item,
      label: item
    };
  }

  let label = item.label ?? item.children ?? (item.id != null ? String(item.id) : '') ?? `Item ${index + 1}`;
  let key = item.key ?? item.id ?? label ?? index;

  return {
    href: item.href,
    key: String(key),
    label,
    rel: item.rel,
    target: item.target
  };
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
  setup(props, {emit, attrs}) {
    let currentItemRef = ref<HTMLElement | null>(null);
    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let normalizedItems = computed(() => props.items.map((item, index) => normalizeBreadcrumbItem(item, index)));
    let currentKey = computed(() => {
      if (props.current) {
        let match = normalizedItems.value.find((item) => item.key === props.current || item.label === props.current);
        if (match) {
          return match.key;
        }
      }

      let last = normalizedItems.value.at(-1);
      return last?.key ?? '';
    });
    let hoveredItem = ref<string | null>(null);
    let focusedItem = ref<string | null>(null);

    onMounted(() => {
      if (props.autoFocusCurrent) {
        void nextTick(() => {
          currentItemRef.value?.focus();
        });
      }
    });

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
            'is-disabled': isDisabled.value,
            'spectrum-Breadcrumbs--multiline': props.isMultiline,
            'spectrum-Breadcrumbs--showRoot': props.showRoot,
            'spectrum-Breadcrumbs--small': props.size === 'S',
            'spectrum-Breadcrumbs--medium': props.size === 'M'
          }
        ), 'vs-breadcrumbs__list']
      }, normalizedItems.value.map((item, index) => {
        let isCurrent = item.key === currentKey.value;
        let isHovered = hoveredItem.value === item.key && !isDisabled.value && !isCurrent;
        let isFocused = focusedItem.value === item.key && !isCurrent;

        return h('li', {
          key: item.key,
          class: [classNames(styles, 'spectrum-Breadcrumbs-item'), 'vs-breadcrumbs__item']
        }, [
          isCurrent
            ? h('span', {
              ref: props.autoFocusCurrent ? currentItemRef : undefined,
              tabindex: props.autoFocusCurrent ? -1 : undefined,
              class: 'vs-breadcrumbs__current',
              'aria-current': 'page'
            }, item.label)
            : item.href
              ? h('a', {
                class: [classNames(
                  styles,
                  'spectrum-Breadcrumbs-itemLink',
                  {
                    'is-hovered': isHovered,
                    'focus-ring': isFocused,
                    'is-reversed': false
                  }
                ), 'vs-breadcrumbs__link'],
                href: item.href,
                rel: item.rel,
                target: item.target,
                'aria-disabled': isDisabled.value ? 'true' : undefined,
                onMouseenter: () => {
                  hoveredItem.value = item.key;
                },
                onMouseleave: () => {
                  if (hoveredItem.value === item.key) {
                    hoveredItem.value = null;
                  }
                },
                onFocus: () => {
                  focusedItem.value = item.key;
                },
                onBlur: () => {
                  if (focusedItem.value === item.key) {
                    focusedItem.value = null;
                  }
                },
                onClick: (event: MouseEvent) => {
                  event.preventDefault();
                  if (!isDisabled.value) {
                    emit('action', item.key);
                  }
                }
              }, item.label)
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
                disabled: isDisabled.value,
                onMouseenter: () => {
                  hoveredItem.value = item.key;
                },
                onMouseleave: () => {
                  if (hoveredItem.value === item.key) {
                    hoveredItem.value = null;
                  }
                },
                onFocus: () => {
                  focusedItem.value = item.key;
                },
                onBlur: () => {
                  if (focusedItem.value === item.key) {
                    focusedItem.value = null;
                  }
                },
                onClick: () => {
                  if (!isDisabled.value) {
                    emit('action', item.key);
                  }
                }
              }, item.label),
          index < normalizedItems.value.length - 1
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
