import './actionbar.css';
import {ActionButton} from '@vue-spectrum/button';
import {ActionGroup} from '@vue-spectrum/actiongroup';
import {computed, defineComponent, h, type PropType} from 'vue';

function normalizeActionKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '');
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
      type: Array as PropType<string[]>,
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
      let disabledKeys = new Set(props.disabledKeys);
      let normalizedDisabledKeys = new Set(props.disabledKeys.map((key) => normalizeActionKey(key)));
      return props.items.filter((item) => {
        return disabledKeys.has(item) || normalizedDisabledKeys.has(normalizeActionKey(item));
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
          class: ['react-spectrum-ActionBar-actionGroup', 'vs-action-bar__actions'],
          'aria-label': 'Actions',
          items: props.items,
          selectionMode: 'none',
          isQuiet: true,
          overflowMode: 'collapse',
          buttonLabelBehavior: props.buttonLabelBehavior,
          staticColor: isEmphasized.value ? 'white' : undefined,
          disabledKeys: resolvedDisabledKeys.value,
          disabled: false,
          onAction: (key: string) => emit('action', normalizeActionKey(key))
        }, {
          item: renderItem
        });

      return h('div', {
        ...attrs,
        class: [
          actionBarClassName.value,
          'vs-action-bar',
          isEmphasized.value ? 'is-emphasized' : null,
          isOpen.value ? 'is-open' : null,
          attrs.class
        ],
        tabindex: 0,
        'data-vac': '',
        onKeydown: (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            emit('clearSelection');
          }
        }
      }, [
        h('div', {class: ['react-spectrum-ActionBar-bar', 'vs-action-bar__bar']}, [
          actions,
          h(ActionButton, {
            class: 'vs-action-bar__clear',
            isQuiet: true,
            staticColor: isEmphasized.value ? 'white' : undefined,
            'aria-label': props.clearLabel,
            style: {
              gridArea: 'clear'
            },
            onClick: () => emit('clearSelection')
          }, () => '\u00d7'),
          h('p', {
            class: ['react-spectrum-ActionBar-selectedCount', 'vs-action-bar__count']
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
      class: ['ActionBarContainer', 'vs-action-bar-container', attrs.class],
      'data-vac': ''
    }, slots.default ? slots.default() : []);
  }
});

export {Item} from '@vue-stately/collections';

export const VueActionBar = ActionBar;
export const VueActionBarContainer = ActionBarContainer;
export type {SpectrumActionBarContainerProps, SpectrumActionBarProps} from '@vue-types/actionbar';
