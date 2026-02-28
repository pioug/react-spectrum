import './actionbar.css';
import {ActionButton} from '@vue-spectrum/button';
import {ActionGroup} from '@vue-spectrum/actiongroup';
import {computed, defineComponent, h, type PropType} from 'vue';

const ACTION_BAR_CLEAR_ICON_PATH = 'M11.697 10.283L7.414 6l4.283-4.283A1 1 0 1 0 10.283.303L6 4.586 1.717.303A1 1 0 1 0 .303 1.717L4.586 6 .303 10.283a1 1 0 1 0 1.414 1.414L6 7.414l4.283 4.283a1 1 0 1 0 1.414-1.414z';

function normalizeActionKeyForComparison(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '');
}

function renderActionBarClearIcon() {
  return h('svg', {
    class: ['spectrum-Icon', 'spectrum-UIIcon-CrossLarge'],
    focusable: 'false',
    'aria-hidden': 'true',
    role: 'img',
    viewBox: '0 0 12 12'
  }, [
    h('path', {
      d: ACTION_BAR_CLEAR_ICON_PATH
    })
  ]);
}

export const ActionBar = defineComponent({
  name: 'VueActionBar',
  inheritAttrs: false,
  props: {
    buttonLabelBehavior: {
      type: String as PropType<'collapse' | 'hide' | 'show'>,
      default: 'collapse'
    },
    clearLabel: {
      type: String,
      default: 'Clear selection'
    },
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<string>>,
      default: () => []
    },
    emphasized: {
      type: Boolean,
      default: false
    },
    isEmphasized: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    items: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    selectedItemCount: {
      type: [Number, String] as PropType<number | 'all'>,
      default: 0
    }
  },
  emits: {
    action: (key: string) => typeof key === 'string',
    clearSelection: () => true
  },
  setup(props, {attrs, emit, slots}) {
    let isOpen = computed(() => props.selectedItemCount === 'all' || props.selectedItemCount > 0);

    let isEmphasized = computed(() => {
      if (props.isEmphasized !== undefined) {
        return props.isEmphasized;
      }

      return props.emphasized;
    });

    let selectedLabel = computed(() => {
      if (props.selectedItemCount === 'all') {
        return 'All selected';
      }

      let count = Math.max(0, Number(props.selectedItemCount) || 0);
      return `${count} selected`;
    });

    let actionBarClassName = computed(() => [
      'react-spectrum-ActionBar',
      {
        'is-open': isOpen.value,
        'react-spectrum-ActionBar--emphasized': isEmphasized.value
      }
    ]);

    let resolvedDisabledKeys = computed(() => {
      let disabledKeys = Array.from(props.disabledKeys);
      let disabledKeySet = new Set(disabledKeys);
      let normalizedDisabledKeys = new Set(disabledKeys.map((key) => normalizeActionKeyForComparison(key)));
      return props.items.filter((item) => {
        return disabledKeySet.has(item) || normalizedDisabledKeys.has(normalizeActionKeyForComparison(item));
      });
    });

    return () => {
      if (!isOpen.value) {
        return null;
      }

      let renderItem = slots.item
        ? (itemProps: {item: string, selected: boolean}) => slots.item?.(itemProps)
        : ({item}: {item: string}) => h('span', {
          class: 'spectrum-ActionButton-label'
        }, item);

      let actions = slots.default
        ? slots.default()
        : h(ActionGroup, {
          class: ['react-spectrum-ActionBar-actionGroup', 'vs-spectrum-action-bar__actions'],
          'data-vs-action-bar-actions': 'true',
          'aria-label': 'Actions',
          items: props.items,
          selectionMode: 'none',
          isQuiet: true,
          overflowMode: 'collapse',
          buttonLabelBehavior: props.buttonLabelBehavior,
          staticColor: isEmphasized.value ? 'white' : undefined,
          disabledKeys: resolvedDisabledKeys.value,
          disabled: false,
          onAction: (key: string) => emit('action', key)
        }, {
          item: renderItem
        });

      return h('div', {
        ...attrs,
        class: [
          actionBarClassName.value,
          'vs-spectrum-action-bar',
          isEmphasized.value ? 'is-emphasized' : null,
          isOpen.value ? 'is-open' : null,
          attrs.class
        ],
        'data-vs-action-bar': 'true',
        tabindex: 0,
        'data-vac': '',
        onKeydown: (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            emit('clearSelection');
          }
        }
      }, [
        h('div', {class: ['react-spectrum-ActionBar-bar', 'vs-spectrum-action-bar__bar']}, [
          actions,
          h(ActionButton, {
            class: 'vs-spectrum-action-bar__clear',
            isQuiet: true,
            staticColor: isEmphasized.value ? 'white' : undefined,
            'aria-label': props.clearLabel,
            'data-vs-action-bar-clear': 'true',
            style: {
              gridArea: 'clear'
            },
            onClick: () => emit('clearSelection')
          }, () => renderActionBarClearIcon()),
          h('p', {
            class: ['react-spectrum-ActionBar-selectedCount', 'vs-spectrum-action-bar__count'],
            'data-vs-action-bar-count': 'true'
          }, selectedLabel.value)
        ])
      ]);
    };
  }
});

export const ActionBarContainer = defineComponent({
  name: 'VueActionBarContainer',
  inheritAttrs: false,
  setup(_props, {attrs, slots}) {
    return () => h('div', {
      ...attrs,
      class: ['ActionBarContainer', 'vs-spectrum-action-bar-container', attrs.class],
      'data-vs-action-bar-container': 'true',
      'data-vac': ''
    }, slots.default ? slots.default() : []);
  }
});

export {Item} from '@vue-stately/collections';

export const VueActionBar = ActionBar;
export const VueActionBarContainer = ActionBarContainer;
export type {SpectrumActionBarContainerProps, SpectrumActionBarProps} from '@vue-types/actionbar';
