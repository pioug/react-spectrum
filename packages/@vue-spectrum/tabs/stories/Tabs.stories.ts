import {action} from '@storybook/addon-actions';
import {computed, defineComponent, ref, watch} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Tabs, type TabItemData} from '../src';

type TabsStoryArgs = {
  ariaLabel?: string,
  items?: TabItemData[],
  modelValue?: string | null,
  orientation?: 'horizontal' | 'vertical'
};

function cloneItems(items: TabItemData[]): TabItemData[] {
  return items.map((item) => ({...item}));
}

const baseItems: TabItemData[] = [
  {key: 'val1', label: 'Tab 1', content: 'Tab Body 1'},
  {key: 'val2', label: 'Tab 2', content: 'Tab Body 2'},
  {key: 'val3', label: 'Tab 3', content: 'Tab Body 3'},
  {key: 'val4', label: 'Tab 4', content: 'Tab Body 4'},
  {key: 'val5', label: 'Tab 5', content: 'Tab Body 5'}
];

const iconItems: TabItemData[] = [
  {key: 'dashboard', label: 'Dashboard', content: 'Dashboard'},
  {key: 'calendar', label: 'Calendar', content: 'Calendar'},
  {key: 'bookmark', label: 'Bookmark', content: 'Bookmark'}
];

const falsyKeyItems: TabItemData[] = [
  {key: '', label: 'Tab 1', content: 'Tab Body 1'},
  {key: 'val2', label: 'Tab 2', content: 'Tab Body 2'},
  {key: 'val3', label: 'Tab 3', content: 'Tab Body 3'},
  {key: 'val4', label: 'Tab 4', content: 'Tab Body 4'},
  {key: 'val5', label: 'Tab 5', content: 'Tab Body 5'}
];

const verticalWrapItems: TabItemData[] = [
  {key: 'val1', label: 'User Profile Settings', content: 'Tab Body 1'},
  {key: 'val2', label: 'Banner and Display Ads', content: 'Tab Body 2'},
  {key: 'val3', label: 'Very long localized tab label for wrapping behavior', content: 'Tab Body 3'},
  {key: 'val4', label: 'Tab 4', content: 'Tab Body 4'},
  {key: 'val5', label: 'Tab 5', content: 'Tab Body 5'}
];

const middleDisabledItems: TabItemData[] = [
  {key: 'val1', label: 'Tab 1', content: 'Tab Body 1'},
  {key: 'val2', label: 'Tab 2', content: 'Tab Body 2', disabled: true},
  {key: 'val3', label: 'Tab 3', content: 'Tab Body 3'},
  {key: 'val4', label: 'Tab 4', content: 'Tab Body 4'},
  {key: 'val5', label: 'Tab 5', content: 'Tab Body 5'}
];

const allDisabledItems: TabItemData[] = [
  {key: 'val1', label: 'Tab 1', content: 'Tab Body 1', disabled: true},
  {key: 'val2', label: 'Tab 2', content: 'Tab Body 2', disabled: true},
  {key: 'val3', label: 'Tab 3', content: 'Tab Body 3', disabled: true},
  {key: 'val4', label: 'Tab 4', content: 'Tab Body 4', disabled: true},
  {key: 'val5', label: 'Tab 5', content: 'Tab Body 5', disabled: true}
];

const longTitleItems: TabItemData[] = [
  {key: 'val1', label: 'Tab 1 long long long name', content: 'Text'},
  {key: 'val2', label: 'Tab 2', content: 'Text 2'}
];

const dynamicSeedItems: TabItemData[] = [
  {key: 'tab1', label: 'Tab 1', content: 'Tab Body 1'},
  {key: 'tab2', label: 'Tab 2', content: 'Tab Body 2'},
  {key: 'tab3', label: 'Tab 3', content: 'Tab Body 3'},
  {key: 'tab4', label: 'Tab 4', content: 'Tab Body 4'},
  {key: 'tab5', label: 'Tab 5', content: 'Tab Body 5'},
  {key: 'tab6', label: 'Tab 6', content: 'Tab Body 6'}
];

function firstEnabledKey(items: TabItemData[] = []): string | null {
  let first = items.find((item) => !item.disabled);
  return first ? first.key : null;
}

const DynamicTabs = defineComponent({
  name: 'DynamicTabsStory',
  components: {Tabs},
  props: {
    annotation: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    let tabs = ref(cloneItems(dynamicSeedItems));
    let selectedKey = ref<string | null>(tabs.value[0]?.key ?? null);
    let onSelectionChange = action('onSelectionChange');

    let addTab = () => {
      let nextIndex = tabs.value.length + 1;
      tabs.value = [
        ...tabs.value,
        {
          key: `tab${nextIndex}`,
          label: `Tab ${nextIndex}`,
          content: `Tab Body ${nextIndex}`
        }
      ];
    };

    let removeTab = () => {
      if (tabs.value.length <= 1) {
        return;
      }

      let removed = tabs.value[tabs.value.length - 1];
      tabs.value = tabs.value.slice(0, tabs.value.length - 1);
      if (selectedKey.value === removed.key) {
        selectedKey.value = tabs.value[0]?.key ?? null;
      }
    };

    return {
      props,
      tabs,
      selectedKey,
      onSelectionChange,
      addTab,
      removeTab
    };
  },
  template: `
    <div style="width: 80%;">
      <p v-if="props.annotation" style="margin: 0 0 8px; color: var(--spectrum-global-color-gray-700);">{{props.annotation}}</p>
      <Tabs
        aria-label="Tab example"
        :items="tabs"
        :model-value="selectedKey"
        @update:model-value="selectedKey = $event; onSelectionChange($event)" />
      <div style="display: flex; gap: 8px; margin-top: 12px;">
        <button type="button" @click="addTab">Add Tab</button>
        <button type="button" :disabled="tabs.length <= 1" @click="removeTab">Remove Tab</button>
      </div>
    </div>
  `
});

const OrientationFlip = defineComponent({
  name: 'OrientationFlipStory',
  components: {Tabs},
  setup() {
    let flipOrientation = ref(true);
    let selectedKey = ref<string | null>(dynamicSeedItems[0]?.key ?? null);
    let onSelectionChange = action('onSelectionChange');

    return {
      flipOrientation,
      selectedKey,
      items: cloneItems(dynamicSeedItems),
      onSelectionChange
    };
  },
  template: `
    <div style="width: 80%;">
      <Tabs
        aria-label="Tab example"
        :items="items"
        :model-value="selectedKey"
        :orientation="flipOrientation ? 'horizontal' : 'vertical'"
        @update:model-value="selectedKey = $event; onSelectionChange($event)" />
      <button type="button" style="margin-top: 12px;" @click="flipOrientation = !flipOrientation">Flip Orientation</button>
    </div>
  `
});

const DynamicTabsWithDecoration = defineComponent({
  name: 'DynamicTabsWithDecorationStory',
  components: {Tabs},
  setup() {
    let tabs = ref(cloneItems(dynamicSeedItems));
    let selectedKey = ref<string | null>(tabs.value[0]?.key ?? null);
    let onSelectionChange = action('onSelectionChange');

    let addTab = () => {
      let nextIndex = tabs.value.length + 1;
      tabs.value = [
        ...tabs.value,
        {
          key: `tab${nextIndex}`,
          label: `Tab ${nextIndex}`,
          content: `Tab Body ${nextIndex}`
        }
      ];
    };

    let removeTab = () => {
      if (tabs.value.length <= 1) {
        return;
      }

      tabs.value = tabs.value.slice(0, tabs.value.length - 1);
      if (!tabs.value.some((item) => item.key === selectedKey.value)) {
        selectedKey.value = tabs.value[0]?.key ?? null;
      }
    };

    return {
      tabs,
      selectedKey,
      onSelectionChange,
      addTab,
      removeTab
    };
  },
  template: `
    <div style="width: 80%;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <strong>Tabs</strong>
        <div style="display: flex; gap: 8px;">
          <button type="button" @click="addTab">Add Tab</button>
          <button type="button" :disabled="tabs.length <= 1" @click="removeTab">Remove Tab</button>
        </div>
      </div>
      <Tabs
        aria-label="Tab example"
        :items="tabs"
        :model-value="selectedKey"
        @update:model-value="selectedKey = $event; onSelectionChange($event)" />
    </div>
  `
});

const ControlledSelection = defineComponent({
  name: 'ControlledSelectionStory',
  components: {Tabs},
  setup() {
    let items = cloneItems(dynamicSeedItems);
    let selectedKey = ref<string | null>(items[0]?.key ?? null);
    let onSelectionChange = action('onSelectionChange');

    return {
      items,
      selectedKey,
      onSelectionChange
    };
  },
  template: `
    <div style="width: 80%; display: grid; gap: 12px;">
      <label>
        Set selected tab
        <select v-model="selectedKey" style="margin-left: 8px;">
          <option v-for="item in items" :key="item.key" :value="item.key">{{item.label}}</option>
        </select>
      </label>
      <Tabs
        aria-label="Tab example"
        :items="items"
        :model-value="selectedKey"
        @update:model-value="selectedKey = $event; onSelectionChange($event)" />
    </div>
  `
});

const meta: Meta<typeof Tabs> = {
  title: 'Tabs',
  component: Tabs,
  args: {
    ariaLabel: 'Tab example',
    items: cloneItems(baseItems),
    orientation: 'horizontal'
  },
  argTypes: {
    ariaLabel: {
      control: 'text'
    },
    items: {
      table: {
        disable: true
      }
    },
    modelValue: {
      control: 'text'
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderTabs(baseArgs: Partial<TabsStoryArgs> = {}, wrapperStyle?: string) {
  return (args: TabsStoryArgs) => ({
    components: {Tabs},
    setup() {
      let mergedArgs = computed<TabsStoryArgs>(() => ({...args, ...baseArgs}));
      let selectedKey = ref<string | null>(null);
      let onSelectionChange = action('onSelectionChange');

      watch(mergedArgs, (nextArgs) => {
        let nextItems = nextArgs.items ?? [];

        if (nextArgs.modelValue && nextItems.some((item) => item.key === nextArgs.modelValue && !item.disabled)) {
          selectedKey.value = nextArgs.modelValue;
          return;
        }

        if (selectedKey.value && nextItems.some((item) => item.key === selectedKey.value && !item.disabled)) {
          return;
        }

        selectedKey.value = firstEnabledKey(nextItems);
      }, {immediate: true, deep: true});

      let updateSelection = (value: string | null) => {
        selectedKey.value = value;
        onSelectionChange(value);
      };

      return {
        mergedArgs,
        selectedKey,
        updateSelection
      };
    },
    template: `
      <div ${wrapperStyle ? `style="${wrapperStyle}"` : ''}>
        <Tabs
          :aria-label="mergedArgs.ariaLabel"
          :items="mergedArgs.items"
          :model-value="selectedKey"
          :orientation="mergedArgs.orientation"
          @update:model-value="updateSelection" />
      </div>
    `
  });
}

export const Default: Story = {
  render: renderTabs()
};

export const WithFalsyItemKey: Story = {
  render: renderTabs({items: cloneItems(falsyKeyItems)}),
  name: 'with falsy item key'
};

export const DefaultSelectedKeyVal2: Story = {
  render: renderTabs({modelValue: 'val2'}),
  name: 'defaultSelectedKey: val2'
};

export const ControlledSelectedKeyVal3: Story = {
  render: renderTabs({modelValue: 'val3'}),
  name: 'controlled: selectedKey: val3'
};

export const OrientationVertical: Story = {
  render: renderTabs({orientation: 'vertical'}),
  name: 'orientation: vertical'
};

export const OrientationVerticalWrap: Story = {
  render: renderTabs({orientation: 'vertical', items: cloneItems(verticalWrapItems)}),
  name: 'orientation: vertical, wrap: true'
};

export const DensityCompact: Story = {
  render: renderTabs(),
  name: 'density: compact'
};

export const IsQuiet: Story = {
  render: renderTabs(),
  name: 'isQuiet'
};

export const IsQuietDensityCompact: Story = {
  render: renderTabs(),
  name: 'isQuiet, density: compact'
};

export const DensityCompactOrientationVertical: Story = {
  render: renderTabs({orientation: 'vertical'}),
  name: 'density: compact, orientation: vertical'
};

export const Icons: Story = {
  render: renderTabs({items: cloneItems(iconItems), modelValue: 'dashboard'}),
  name: 'icons'
};

export const IconsDensityCompact: Story = {
  render: renderTabs({items: cloneItems(iconItems), modelValue: 'dashboard'}),
  name: 'icons, density: compact'
};

export const IconsOrientationVertical: Story = {
  render: renderTabs({items: cloneItems(iconItems), modelValue: 'dashboard', orientation: 'vertical'}),
  name: 'icons, orientation: vertical'
};

export const IconsDensityCompactOrientationVertical: Story = {
  render: renderTabs({items: cloneItems(iconItems), modelValue: 'dashboard', orientation: 'vertical'}),
  name: 'icons, density: compact, orientation: vertical'
};

export const IsEmphasizedTrue: Story = {
  render: renderTabs(),
  name: 'isEmphasized: true'
};

export const IsEmphasizedTrueIconsIsQuietTrue: Story = {
  render: renderTabs({items: cloneItems(iconItems), modelValue: 'dashboard'}),
  name: 'isEmphasized: true, icons, isQuiet: true'
};

export const IsEmphasizedTrueOrientationVertical: Story = {
  render: renderTabs({orientation: 'vertical'}),
  name: 'isEmphasized: true, orientation: vertical'
};

export const DisableAllTabs: Story = {
  render: renderTabs({items: cloneItems(allDisabledItems)}),
  name: 'disable all tabs'
};

export const KeyboardActivationManual: Story = {
  render: renderTabs(),
  name: 'keyboardActivation: manual'
};

export const MiddleDisabled: Story = {
  render: renderTabs({items: cloneItems(middleDisabledItems)}),
  name: 'middle disabled'
};

export const AllDisabled: Story = {
  render: renderTabs({items: cloneItems(allDisabledItems)}),
  name: 'all disabled'
};

export const Resizeable: Story = {
  render: renderTabs({}, 'min-width: 100px; width: 300px; height: 400px; padding: 10px; resize: horizontal; overflow: auto; background-color: var(--spectrum-global-color-gray-50);'),
  name: 'resizeable'
};

export const CollapseBehavior: Story = {
  render: () => ({
    components: {DynamicTabs},
    template: '<DynamicTabs />'
  }),
  name: 'collapse behavior'
};

export const CollapseBehaviorIsQuiet: Story = {
  render: () => ({
    components: {DynamicTabs},
    template: '<DynamicTabs annotation="isQuiet variant" />'
  }),
  name: 'collapse behavior, isQuiet'
};

export const CollapseBehaviorDensityCompact: Story = {
  render: () => ({
    components: {DynamicTabs},
    template: '<DynamicTabs annotation="density: compact variant" />'
  }),
  name: 'collapse behavior, density: compact'
};

export const CollapseBehaviorDensityCompactIsQuiet: Story = {
  render: () => ({
    components: {DynamicTabs},
    template: '<DynamicTabs annotation="density: compact, isQuiet variant" />'
  }),
  name: 'collapse behavior, density: compact, isQuiet'
};

export const CollapseBehaviorIsEmphasizedTrue: Story = {
  render: () => ({
    components: {DynamicTabs},
    template: '<DynamicTabs annotation="isEmphasized: true variant" />'
  }),
  name: 'collapse behavior, isEmphasized: true'
};

export const _OrientationFlip: Story = {
  render: () => ({
    components: {OrientationFlip},
    template: '<OrientationFlip />'
  }),
  name: 'orientation flip'
};

export const TestingTabsInFlex: Story = {
  render: () => ({
    components: {Tabs},
    setup() {
      let selectedKey = ref<string | null>('tab1');
      let onSelectionChange = action('onSelectionChange');
      let items = [
        {key: 'tab1', label: 'Tab 1', content: 'Hello World'},
        {key: 'tab2', label: 'Tab 2', content: 'Goodbye World'}
      ];

      return {
        selectedKey,
        onSelectionChange,
        items
      };
    },
    template: `
      <div style="min-height: 400px; min-width: 400px; border: 1px solid var(--spectrum-global-color-gray-800); padding: 10px;">
        <Tabs
          aria-label="Some tabs"
          :items="items"
          :model-value="selectedKey"
          @update:model-value="selectedKey = $event; onSelectionChange($event)" />
      </div>
    `
  }),
  name: 'testing: tabs in flex'
};

export const TransitionBetweenTabSizes: Story = {
  render: renderTabs({items: cloneItems(longTitleItems), modelValue: 'val1'}),
  name: 'transition between tab sizes'
};

export const TabWithFlexContainerInBetween: Story = {
  render: () => ({
    components: {DynamicTabsWithDecoration},
    template: '<DynamicTabsWithDecoration />'
  }),
  name: 'Tab with flex container in between'
};

export const TabsAtTheBottom: Story = {
  render: renderTabs({items: [
    {key: 'tab1', label: 'Tab 1', content: 'Text 1'},
    {key: 'tab2', label: 'Tab 2', content: 'Text 2'}
  ]}),
  name: 'tabs at the bottom'
};

export const TabsOnTheRight: Story = {
  render: renderTabs({
    orientation: 'vertical',
    items: [
      {key: 'tab1', label: 'Tab 1', content: 'Text 1'},
      {key: 'tab2', label: 'Tab 2', content: 'Text 2'}
    ]
  }),
  name: 'tabs on the right'
};

export const FocusableElementInTabPanel: Story = {
  render: () => ({
    components: {Tabs},
    setup() {
      let items = [
        {key: 'tab1', label: 'Tab 1', content: 'Tab 1'},
        {key: 'tab2', label: 'Tab 2', content: 'Tab 2'}
      ];
      let selectedKey = ref<string | null>('tab1');
      let onSelectionChange = action('onSelectionChange');

      return {
        items,
        selectedKey,
        onSelectionChange
      };
    },
    template: `
      <Tabs
        aria-label="Some tabs"
        :items="items"
        :model-value="selectedKey"
        @update:model-value="selectedKey = $event; onSelectionChange($event)">
        <template #default="{item}">
          <label v-if="item?.key === 'tab1'" style="display: grid; gap: 6px; max-width: 240px;">
            <span>Tab 1</span>
            <input type="text" />
          </label>
          <label v-else style="display: grid; gap: 6px; max-width: 240px;">
            <span>Tab 2</span>
            <input type="text" disabled />
          </label>
        </template>
      </Tabs>
    `
  }),
  name: 'focusable element in tab panel'
};

export const Tab1ControlledChild: Story = {
  render: () => ({
    components: {Tabs},
    setup() {
      let selectedKey = ref<string | null>('tab1');
      let tab1Text = ref('');
      let items = [
        {key: 'tab1', label: 'Tab 1', content: 'Tab 1'},
        {key: 'tab2', label: 'Tab 2', content: 'Tab 2'}
      ];
      let onSelectionChange = action('onSelectionChange');

      return {
        selectedKey,
        tab1Text,
        items,
        onSelectionChange
      };
    },
    template: `
      <Tabs
        aria-label="Some tabs"
        :items="items"
        :model-value="selectedKey"
        @update:model-value="selectedKey = $event; onSelectionChange($event)">
        <template #default="{item}">
          <label v-if="item?.key === 'tab1'" style="display: grid; gap: 6px; max-width: 240px;">
            <span>Tab 1</span>
            <input v-model="tab1Text" type="text" />
          </label>
          <label v-else style="display: grid; gap: 6px; max-width: 240px;">
            <span>Tab 2</span>
            <input type="text" />
          </label>
        </template>
      </Tabs>
    `
  }),
  name: 'Tab 1 controlled child'
};

export const ChangingTabTitles: Story = {
  render: () => ({
    components: {Tabs},
    setup() {
      let tab1Text = ref('Tab 1');
      let tab2Text = ref('Tab 2');
      let selectedKey = ref<string | null>('tab1');
      let onSelectionChange = action('onSelectionChange');
      let items = computed<TabItemData[]>(() => ([
        {key: 'tab1', label: tab1Text.value, content: 'Tab 1 Content'},
        {key: 'tab2', label: tab2Text.value, content: 'Tab 2 Content'}
      ]));

      return {
        tab1Text,
        tab2Text,
        selectedKey,
        onSelectionChange,
        items
      };
    },
    template: `
      <div style="min-height: 400px; min-width: 400px; display: grid; gap: 8px; align-content: start;">
        <label style="display: grid; gap: 4px; max-width: 240px;">
          <span>Tab1 Title</span>
          <input v-model="tab1Text" type="text" />
        </label>
        <label style="display: grid; gap: 4px; max-width: 240px;">
          <span>Tab2 Title</span>
          <input v-model="tab2Text" type="text" />
        </label>
        <Tabs
          aria-label="Some tabs"
          :items="items"
          :model-value="selectedKey"
          @update:model-value="selectedKey = $event; onSelectionChange($event)" />
      </div>
    `
  }),
  name: 'changing tab titles'
};

export const ChangingSelectionProgrammatically: Story = {
  render: () => ({
    components: {ControlledSelection},
    template: '<ControlledSelection />'
  }),
  name: 'changing selection programmatically'
};

export const Links: Story = {
  render: (args: TabsStoryArgs & {collapsed?: boolean}) => ({
    components: {Tabs},
    setup() {
      let selectedUrl = ref<string | null>('/one');
      let onSelectionChange = action('onSelectionChange');
      let items = [
        {key: '/one', label: 'Tab 1', content: 'Foo'},
        {key: '/two', label: 'Tab 2', content: 'Bar'},
        {key: '/three', label: 'Tab 3', content: 'Tab 3'},
        {key: '/four', label: 'Tab 4', content: 'Tab 4'},
        {key: '/five', label: 'Tab 5', content: 'Tab 5'}
      ];
      let widthValue = computed(() => args.collapsed ? '200px' : '300px');

      return {
        selectedUrl,
        onSelectionChange,
        items,
        widthValue
      };
    },
    template: `
      <div>
        <p style="margin: 0 0 8px;">Current URL: {{selectedUrl}}</p>
        <Tabs
          aria-label="Some tabs"
          :items="items"
          :model-value="selectedUrl"
          :style="{width: widthValue}"
          @update:model-value="selectedUrl = $event; onSelectionChange($event)" />
      </div>
    `
  }),
  args: {
    collapsed: false
  } as any
};

export const Nested: Story = {
  render: () => ({
    components: {Tabs},
    setup() {
      let outerSelectedKey = ref<string | null>('one');
      let innerSelectedKey = ref<string | null>('inner1');
      let onSelectionChange = action('onSelectionChange');
      let outerItems: TabItemData[] = [
        {key: 'one', label: 'Tab 1', content: 'Tab 1'},
        {key: 'two', label: 'Tab 2', content: 'Bar'},
        {key: 'three', label: 'Tab 3', content: 'Foobar'},
        {key: 'four', label: 'Tab 4', content: 'Foofoo'},
        {key: 'five', label: 'Tab 5', content: 'Barfoo'}
      ];
      let innerItems: TabItemData[] = [
        {key: 'inner1', label: 'Tab 1', content: 'Inner tab 1'},
        {key: 'inner2', label: 'Tab 2', content: 'Inner tab 2'}
      ];

      return {
        outerSelectedKey,
        innerSelectedKey,
        onSelectionChange,
        outerItems,
        innerItems
      };
    },
    template: `
      <Tabs
        aria-label="Some tabs"
        :items="outerItems"
        :model-value="outerSelectedKey"
        @update:model-value="outerSelectedKey = $event; onSelectionChange($event)">
        <template #default="{item}">
          <div v-if="item?.key === 'one'" style="display: grid; gap: 8px;">
            <h3 style="margin: 0;">Nested</h3>
            <Tabs
              aria-label="Nested tabs"
              :items="innerItems"
              :model-value="innerSelectedKey"
              @update:model-value="innerSelectedKey = $event; onSelectionChange($event)" />
          </div>
          <div v-else>
            <h3 style="margin: 0 0 4px;">{{item?.content}}</h3>
            <p style="margin: 0;">Panel content for {{item?.label}}.</p>
          </div>
        </template>
      </Tabs>
    `
  })
};
