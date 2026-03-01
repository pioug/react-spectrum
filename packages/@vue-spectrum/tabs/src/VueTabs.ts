import '@adobe/spectrum-css-temp/components/tabs/vars.css';
import '@adobe/spectrum-css-temp/components/typography/vars.css';
import {classNames, dimensionValue} from '@vue-spectrum/utils';
import {cloneVNode, computed, defineComponent, h, inject, type InjectionKey, isVNode, nextTick, onMounted, type PropType, provide, ref, watch} from 'vue';
import {useTab as createTab, useTabList as createTabList, useTabPanel as createTabPanel, type TabOrientation} from '@vue-aria/tabs';

export interface TabPanelContent {
  description?: string,
  title?: string
}

export interface TabItemData {
  content?: string | TabPanelContent,
  disabled?: boolean,
  icon?: unknown,
  key: string,
  label: string
}

export type TabsValue = string | null;

interface TabsContextValue {
  registerTabRef: (key: string, element: Element | null) => void,
  state: ReturnType<typeof createTabList>['state']
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

    let isHovered = ref(false);
    let tab = createTab({
      isDisabled: Boolean(props.item.disabled),
      key: props.item.key
    }, context.state);

    let renderIcon = () => {
      let icon = props.item.icon;
      if (icon == null) {
        return null;
      }

      if (typeof icon === 'string' || typeof icon === 'number') {
        return h('span', {class: [classNames({}, 'spectrum-Icon'), 'vs-tabs__icon']}, String(icon));
      }

      if (isVNode(icon)) {
        return cloneVNode(icon, {
          class: ['vs-tabs__icon', icon.props?.class]
        }, true);
      }

      return h(icon as never, {
        class: 'vs-tabs__icon',
        size: 'S'
      });
    };

    return () => {
      let tabProps = tab.tabProps.value;
      return h('button', {
        id: tabProps.id,
        ref: (element: Element | null) => {
          context.registerTabRef(props.item.key, element);
        },
        type: 'button',
        role: tabProps.role,
        tabIndex: tabProps.tabIndex ?? -1,
        'aria-controls': tabProps['aria-controls'],
        'aria-disabled': tabProps['aria-disabled'],
        'aria-selected': tabProps['aria-selected'],
        'data-key': props.item.key,
        style: {
          appearance: 'none',
          background: 'transparent',
          border: '0',
          color: 'inherit',
          cursor: 'default',
          font: 'inherit',
          margin: '0',
          padding: '0 8px'
        },
        class: [
          classNames({}, 'spectrum-Tabs-item', {
            'is-disabled': tab.isDisabled.value,
            'is-hovered': isHovered.value,
            'is-pressed': tab.isPressed.value,
            'is-selected': tab.isSelected.value
          }),
          'vs-tabs__tab'
        ],
        onClick: () => {
          tab.press();
        },
        onBlur: tabProps.onBlur,
        onFocus: tabProps.onFocus,
        onKeydown: tabProps.onKeyDown,
        onMousedown: tabProps.onMouseDown,
        onMouseenter: () => {
          isHovered.value = true;
        },
        onMouseleave: () => {
          isHovered.value = false;
        },
        onMouseup: tabProps.onMouseUp
      }, [
        renderIcon(),
        h('span', {class: [classNames({}, 'spectrum-Tabs-itemLabel'), 'vs-tabs__label']}, props.item.label)
      ]);
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
    ariaLabelledby: {
      type: String,
      default: ''
    },
    density: {
      type: String as PropType<'compact' | 'regular'>,
      default: 'regular'
    },
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<string>>,
      default: () => []
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isEmphasized: {
      type: Boolean,
      default: false
    },
    isQuiet: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array as PropType<TabItemData[]>,
      default: () => []
    },
    keyboardActivation: {
      type: String as PropType<'automatic' | 'manual'>,
      default: 'automatic'
    },
    modelValue: {
      type: String as PropType<TabsValue>,
      default: null
    },
    maxWidth: {
      type: [Number, String] as PropType<number | string | undefined>,
      default: undefined
    },
    orientation: {
      type: String as PropType<TabOrientation>,
      default: 'horizontal'
    },
    tabPlacement: {
      type: String as PropType<'start' | 'end'>,
      default: 'start'
    },
    width: {
      type: [Number, String] as PropType<number | string | undefined>,
      default: undefined
    }
  },
  emits: {
    'update:modelValue': (value: TabsValue) => value === null || typeof value === 'string',
    change: (value: TabsValue) => value === null || typeof value === 'string',
    selectionChange: (value: TabsValue) => value === null || typeof value === 'string'
  },
  setup(props, {attrs, emit, slots}) {
    let selectedKey = ref<string | null>(null);
    let selectionIndicatorStyle = ref<Record<string, string>>({});
    let tabRefs = new Map<string, HTMLElement>();

    let normalizedItems = computed(() =>
      props.items.map((item) => ({
        ...item,
        key: String(item.key)
      }))
    );

    let disabledKeySet = computed(() => {
      let set = new Set<string>();
      for (let item of normalizedItems.value) {
        if (item.disabled) {
          set.add(item.key);
        }
      }
      for (let key of props.disabledKeys) {
        set.add(String(key));
      }
      return set;
    });

    let getInitialSelectionKey = (): string | null => {
      let firstEnabledItem = normalizedItems.value.find((item) => !disabledKeySet.value.has(item.key));
      if (firstEnabledItem) {
        return firstEnabledItem.key;
      }

      return normalizedItems.value[0]?.key ?? null;
    };

    let tabList = createTabList({
      tabs: computed(() => normalizedItems.value.map((item) => item.key)),
      ariaLabel: computed(() => props.ariaLabel),
      ariaLabelledby: computed(() => props.ariaLabelledby || undefined),
      disabledKeys: disabledKeySet,
      isDisabled: computed(() => props.isDisabled),
      keyboardActivation: computed(() => props.keyboardActivation),
      orientation: computed(() => props.orientation),
      selectedKey,
      onSelectionChange: (key) => {
        emit('update:modelValue', key);
        emit('change', key);
        emit('selectionChange', key);
      }
    });
    let tabPanel = createTabPanel({}, tabList.state);

    let registerTabRef = (key: string, element: Element | null) => {
      if (element instanceof HTMLElement) {
        tabRefs.set(key, element);
      } else {
        tabRefs.delete(key);
      }
    };

    let updateSelectionIndicator = () => {
      let key = tabList.state.selectedKey.value;
      if (!key) {
        selectionIndicatorStyle.value = {
          width: '0px'
        };
        return;
      }

      let selectedTab = tabRefs.get(key);
      if (!selectedTab) {
        return;
      }

      if (props.orientation === 'vertical') {
        selectionIndicatorStyle.value = {
          height: `${selectedTab.offsetHeight}px`,
          transform: `translateY(${selectedTab.offsetTop}px)`
        };
      } else {
        selectionIndicatorStyle.value = {
          transform: `translateX(${selectedTab.offsetLeft}px)`,
          width: `${selectedTab.offsetWidth}px`
        };
      }
    };

    let selectedItem = computed(() => {
      let key = tabList.state.selectedKey.value;
      return normalizedItems.value.find((item) => item.key === key);
    });

    watch(() => ({
      disabledKeys: Array.from(disabledKeySet.value).join('|'),
      itemKeys: normalizedItems.value.map((item) => item.key).join('|'),
      modelValue: props.modelValue
    }), () => {
      if (props.modelValue && normalizedItems.value.some((item) => item.key === props.modelValue)) {
        selectedKey.value = props.modelValue;
        return;
      }

      if (selectedKey.value && normalizedItems.value.some((item) => item.key === selectedKey.value)) {
        return;
      }

      selectedKey.value = getInitialSelectionKey();
    }, {immediate: true});

    watch(() => [tabList.state.selectedKey.value, props.orientation, normalizedItems.value.length], async () => {
      await nextTick();
      updateSelectionIndicator();
    }, {immediate: true});

    onMounted(async () => {
      await nextTick();
      updateSelectionIndicator();
    });

    provide(tabsContextKey, {
      registerTabRef,
      state: tabList.state
    });

    let tabsPanelClassName = computed(() => classNames({}, 'spectrum-TabsPanel', `spectrum-TabsPanel--${props.orientation}`));
    let tabsClassName = computed(() => classNames(
      {},
      'spectrum-Tabs',
      `spectrum-Tabs--${props.orientation}`,
      {
        'spectrum-Tabs--compact': props.density === 'compact',
        'spectrum-Tabs--emphasized': props.isEmphasized,
        'spectrum-Tabs--quiet': props.isQuiet
      }
    ));
    let panelStyle = computed(() => {
      let styles: Record<string, string> = {};
      let resolvedMaxWidth = dimensionValue(props.maxWidth);
      if (resolvedMaxWidth) {
        styles.maxWidth = resolvedMaxWidth;
      }

      let resolvedWidth = dimensionValue(props.width);
      if (resolvedWidth) {
        styles.width = resolvedWidth;
      }

      return styles;
    });

    return () => {
      let tabListProps = tabList.tabListProps.value;
      let panelContent = slots.default
        ? slots.default({item: selectedItem.value})
        : selectedItem.value?.content ?? selectedItem.value?.label ?? null;

      let panelChildren = panelContent == null
        ? undefined
        : (typeof panelContent === 'object' && !Array.isArray(panelContent) && (panelContent.title || panelContent.description))
          ? h('div', {class: 'vs-tabs__panel-content'}, [
            panelContent.title ? h('h3', {
              class: [classNames({}, 'spectrum-Heading', 'spectrum-Heading--sizeS'), 'vs-tabs__panel-heading']
            }, panelContent.title) : null,
            panelContent.description ? h('p', {
              class: [classNames({}, 'spectrum-Body', 'spectrum-Body--sizeM'), 'vs-tabs__panel-description']
            }, panelContent.description) : null
          ])
          : panelContent;

      let tabListNode = h('div', {
        ...tabListProps,
        onKeydown: tabListProps.onKeyDown,
        class: [tabsClassName.value, classNames({}, 'spectrum-TabsPanel-tabs'), 'vs-tabs__list']
      }, [
        ...normalizedItems.value.map((item) => h(VueTabButton, {
          key: item.key,
          item
        })),
        h('div', {
          class: [classNames({}, 'spectrum-Tabs-selectionIndicator'), 'vs-tabs__selection-indicator'],
          role: 'presentation',
          style: selectionIndicatorStyle.value
        })
      ]);

      let tabPanelNode = h('div', {
        ...tabPanel.tabPanelProps.value,
        class: [classNames({}, 'spectrum-TabsPanel-tabpanel'), 'vs-tabs__panel']
      }, panelChildren);

      return h('section', {
        ...attrs,
        class: [tabsPanelClassName.value, `vs-tabs--${props.orientation}`, 'vs-tabs', attrs.class],
        style: [panelStyle.value, attrs.style],
        'data-vac': ''
      }, props.tabPlacement === 'end' ? [tabPanelNode, tabListNode] : [tabListNode, tabPanelNode]);
    };
  }
});
