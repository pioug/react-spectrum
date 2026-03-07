import './actionbar.css';
import {ActionButton} from '@vue-spectrum/button';
import {ActionGroup} from '@vue-spectrum/actiongroup';
import {announce} from '@vue-aria/live-announcer';
import {cloneVNode, computed, defineComponent, h, isVNode, onMounted, type PropType, type VNodeChild} from 'vue';

const ACTION_BAR_CLEAR_ICON_PATH = 'M11.697 10.283L7.414 6l4.283-4.283A1 1 0 1 0 10.283.303L6 4.586 1.717.303A1 1 0 1 0 .303 1.717L4.586 6 .303 10.283a1 1 0 1 0 1.414 1.414L6 7.414l4.283 4.283a1 1 0 1 0 1.414-1.414z';
type ActionBarKey = string | number;
type ActionBarItem = string | {
  children?: string,
  name: ActionBarKey
};

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

function getActionBarItemLabel(item: ActionBarItem): string {
  if (typeof item === 'string') {
    return item;
  }

  if (typeof item.children === 'string' && item.children.length > 0) {
    return item.children;
  }

  return String(item.name);
}

function normalizeActionBarItemContent(content: VNodeChild, hideButtonText: boolean): VNodeChild {
  if (Array.isArray(content)) {
    return content.map((entry) => normalizeActionBarItemContent(entry, hideButtonText));
  }

  if (!isVNode(content)) {
    return content;
  }

  if (toClassTokens(content.props?.class).includes('spectrum-ActionButton-label')) {
    return content;
  }

  if (typeof content.type === 'string' && content.type !== 'svg') {
    return content;
  }

  return cloneVNode(content, {
    class: [
      content.props?.class,
      hideButtonText ? 'spectrum-ActionGroup-itemIcon' : undefined
    ],
    size: content.props?.size ?? 'S'
  }, true);
}

function renderActionBarClearIcon(): VNodeChild {
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
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<ActionBarKey>>,
      default: () => []
    },
    isEmphasized: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array as PropType<ActionBarItem[]>,
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
    let selectedLabel = computed(() => {
      if (props.selectedItemCount === 'all') {
        return 'All selected';
      }

      let count = Math.max(0, Number(props.selectedItemCount) || 0);
      return `${count} selected`;
    });

    onMounted(() => {
      if (isOpen.value) {
        announce('Actions available.');
      }
    });

    return () => {
      if (!isOpen.value) {
        return null;
      }

      let {class: className, ...domProps} = attrs as Record<string, unknown>;
      let userKeyDown = domProps.onKeydown as ((event: KeyboardEvent) => void) | undefined;
      let renderItem = slots.item
        ? (itemProps: {item: ActionBarItem, selected: boolean, hideButtonText: boolean, labelId: string}) => normalizeActionBarItemContent(slots.item?.(itemProps) ?? [], itemProps.hideButtonText)
        : ({item}: {item: ActionBarItem}) => h('span', {
          class: 'spectrum-ActionButton-label',
          role: 'none'
        }, getActionBarItemLabel(item));

      return h('div', {
        ...domProps,
        class: [
          'react-spectrum-ActionBar',
          {
            'is-open': isOpen.value,
            'react-spectrum-ActionBar--emphasized': props.isEmphasized
          },
          className
        ],
        onKeydown: (event: KeyboardEvent) => {
          userKeyDown?.(event);

          if (event.key === 'Escape') {
            event.preventDefault();
            emit('clearSelection');
          }
        }
      }, [
        h('div', {class: 'react-spectrum-ActionBar-bar'}, [
          h(ActionGroup, {
            class: 'react-spectrum-ActionBar-actionGroup',
            'aria-label': 'Actions',
            items: props.items,
            selectionMode: 'none',
            isQuiet: true,
            overflowMode: 'collapse',
            buttonLabelBehavior: props.buttonLabelBehavior,
            staticColor: props.isEmphasized ? 'white' : undefined,
            disabledKeys: props.disabledKeys,
            onAction: (key: string) => emit('action', key)
          }, {
            item: renderItem
          }),
          h(ActionButton, {
            isQuiet: true,
            staticColor: props.isEmphasized ? 'white' : undefined,
            'aria-label': 'Clear selection',
            style: {
              gridArea: 'clear'
            },
            onClick: () => emit('clearSelection')
          }, () => renderActionBarClearIcon()),
          h('span', {
            class: 'react-spectrum-ActionBar-selectedCount',
            role: 'none'
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
      ...(attrs as Record<string, unknown>),
      class: [
        'ActionBarContainer',
        (attrs as Record<string, unknown>).class
      ]
    }, slots.default ? slots.default() : []);
  }
});

export {Item} from '@vue-stately/collections';

export const VueActionBar = ActionBar;
export const VueActionBarContainer = ActionBarContainer;
export type {SpectrumActionBarContainerProps, SpectrumActionBarProps} from '@vue-types/actionbar';
