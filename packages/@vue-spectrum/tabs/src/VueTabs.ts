import {computed, defineComponent, h, inject, type InjectionKey, type PropType, provide, ref, watch} from 'vue';
import {useTab as createTab, useTabList as createTabList, useTabPanel as createTabPanel, type TabListState, type TabOrientation} from '@vue-aria/tabs';

export interface TabItemData {
  content?: string,
  disabled?: boolean,
  key: string,
  label: string
}

export type TabsValue = string | null;

interface TabsContextValue {
  state: TabListState
}

const tabsContextKey: InjectionKey<TabsContextValue> = Symbol('VueTabsContext');

const VueTabButton = defineComponent({
  name: 'VueTabButton',
  props: {
    item: {
      type: Object as PropType<TabItemData>,
      required: true
    }
  },
  setup(props) {
    let context = inject(tabsContextKey);
    if (!context) {
      throw new Error('VueTabButton must be rendered inside VueTabs.');
    }

    let tab = createTab({
      isDisabled: Boolean(props.item.disabled),
      key: props.item.key
    }, context.state);

    return () => {
      let tabProps = tab.tabProps.value;

      return h('button', {
        id: tabProps.id,
        type: 'button',
        role: tabProps.role,
        tabIndex: tabProps.tabIndex,
        disabled: tab.isDisabled.value,
        'aria-controls': tabProps['aria-controls'],
        'aria-disabled': tabProps['aria-disabled'],
        'aria-selected': tabProps['aria-selected'],
        class: [
          'vs-tabs__tab',
          tab.isSelected.value ? 'is-selected' : null,
          tab.isPressed.value ? 'is-pressed' : null,
          tab.isDisabled.value ? 'is-disabled' : null
        ],
        onClick: () => {
          tab.press();
        },
        onBlur: tabProps.onBlur,
        onFocus: tabProps.onFocus,
        onKeydown: tabProps.onKeyDown,
        onMousedown: tabProps.onMouseDown,
        onMouseup: tabProps.onMouseUp
      }, props.item.label);
    };
  }
});

export const VueTabs = defineComponent({
  name: 'VueTabs',
  props: {
    ariaLabel: {
      type: String,
      default: 'Tabs'
    },
    items: {
      type: Array as PropType<TabItemData[]>,
      default: () => []
    },
    modelValue: {
      type: String as PropType<TabsValue>,
      default: null
    },
    orientation: {
      type: String as PropType<TabOrientation>,
      default: 'horizontal'
    }
  },
  emits: {
    'update:modelValue': (value: TabsValue) => value === null || typeof value === 'string',
    change: (value: TabsValue) => value === null || typeof value === 'string'
  },
  setup(props, {attrs, emit, slots}) {
    let selectedKey = ref<string | null>(null);

    let getFirstEnabledKey = (): string | null => {
      let firstEnabledItem = props.items.find((item) => !item.disabled);
      return firstEnabledItem ? firstEnabledItem.key : null;
    };

    let tabList = createTabList({
      tabs: computed(() => props.items.map((item) => item.key)),
      ariaLabel: computed(() => props.ariaLabel),
      disabledKeys: computed(() => props.items.filter((item) => item.disabled).map((item) => item.key)),
      orientation: computed(() => props.orientation),
      selectedKey,
      onSelectionChange: (key) => {
        emit('update:modelValue', key);
        emit('change', key);
      }
    });
    let tabPanel = createTabPanel({}, tabList.state);
    let selectedItem = computed(() => {
      let key = tabList.state.selectedKey.value;
      return props.items.find((item) => item.key === key);
    });

    watch(() => ({
      disabledKeys: props.items.filter((item) => item.disabled).map((item) => item.key).join('|'),
      itemKeys: props.items.map((item) => item.key).join('|'),
      modelValue: props.modelValue
    }), () => {
      if (props.modelValue && props.items.some((item) => item.key === props.modelValue && !item.disabled)) {
        selectedKey.value = props.modelValue;
        return;
      }

      if (selectedKey.value && props.items.some((item) => item.key === selectedKey.value && !item.disabled)) {
        return;
      }

      selectedKey.value = getFirstEnabledKey();
    }, {immediate: true});

    provide(tabsContextKey, {
      state: tabList.state
    });

    let classes = computed(() => ([
      'vs-tabs',
      props.orientation === 'vertical' ? 'vs-tabs--vertical' : 'vs-tabs--horizontal'
    ]));

    return () => {
      let panelContent = slots.default
        ? slots.default({item: selectedItem.value})
        : selectedItem.value?.content ?? selectedItem.value?.label ?? null;
      let panelChildren = panelContent == null ? undefined : panelContent;

      return h('section', {
        ...attrs,
        class: [classes.value, attrs.class],
        'data-vac': ''
      }, [
        h('div', {
          ...tabList.tabListProps.value,
          class: 'vs-tabs__list'
        }, props.items.map((item) => h(VueTabButton, {
          key: item.key,
          item
        }))),
        h('div', {
          ...tabPanel.tabPanelProps.value,
          class: 'vs-tabs__panel'
        }, panelChildren)
      ]);
    };
  }
});
