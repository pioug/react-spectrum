import {action} from 'storybook/actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {ActionGroup} from '@vue-spectrum/actiongroup';
import {Button} from '@vue-spectrum/button';
import {ButtonGroup} from '@vue-spectrum/buttongroup';
import {Picker} from '@vue-spectrum/picker';
import {TextField} from '@vue-spectrum/textfield';
import Bookmark from '@spectrum-icons-vue/workflow/Bookmark';
import Calendar from '@spectrum-icons-vue/workflow/Calendar';
import Dashboard from '@spectrum-icons-vue/workflow/Dashboard';
import {computed, defineComponent, ref, watch, type PropType} from 'vue';
import {Tabs, type TabItemData} from '../src';

type TabsStoryArgs = {
  ariaLabel?: string,
  density?: 'compact' | 'regular',
  disabledKeys?: Iterable<string>,
  isDisabled?: boolean,
  isEmphasized?: boolean,
  isQuiet?: boolean,
  items?: TabItemData[],
  keyboardActivation?: 'automatic' | 'manual',
  maxWidth?: number | string,
  modelValue?: string | null,
  orientation?: 'horizontal' | 'vertical',
  tabPlacement?: 'start' | 'end',
  width?: number | string
};

type DynamicControlAction = {
  children: string,
  name: string
};

const DEFAULT_MAX_WIDTH = 500;
const ICON_CYCLE = [Dashboard, Calendar, Bookmark] as const;
const DYNAMIC_CONTROL_ACTIONS: DynamicControlAction[] = [
  {children: 'Add Tab', name: 'add'},
  {children: 'Remove Tab', name: 'remove'}
];

function cloneItems(items: TabItemData[]): TabItemData[] {
  return items.map((item) => ({...item}));
}

function toCssWidth(value: number | string | undefined): string {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  return `${DEFAULT_MAX_WIDTH}px`;
}

const LOREM_BODY = 'Dolore ex esse laboris elit magna esse sunt. Pariatur in veniam Lorem est occaecat do magna nisi mollit ipsum sit adipisicing fugiat ex. Pariatur ullamco exercitation ea qui adipisicing. Id cupidatat aute id ut excepteur exercitation magna pariatur. Mollit irure irure reprehenderit pariatur eiusmod proident Lorem deserunt duis cillum mollit. Do reprehenderit sit cupidatat quis laborum in do culpa nisi ipsum. Velit aliquip commodo ea ipsum incididunt culpa nostrud deserunt incididunt exercitation. In quis proident sit ad dolore tempor. Eiusmod pariatur quis commodo labore cupidatat cillum enim eiusmod voluptate laborum culpa. Laborum cupidatat incididunt velit voluptate incididunt occaecat quis do. Consequat adipisicing irure Lorem commodo officia sint id. Velit sit magna aliquip eiusmod non id deserunt. Magna veniam ad consequat dolor cupidatat esse enim Lorem ullamco. Anim excepteur consectetur id in. Mollit laboris duis labore enim duis esse reprehenderit.';

function buildTabBody(title: string) {
  return {
    title,
    description: LOREM_BODY
  };
}

function buildDynamicTabItem(index: number): TabItemData {
  return {
    key: `tab${index}`,
    label: `Tab ${index}`,
    icon: ICON_CYCLE[(index - 1) % ICON_CYCLE.length],
    content: buildTabBody(`Tab Body ${index}`)
  };
}

const baseItems: TabItemData[] = [
  {key: 'val1', label: 'Tab 1', content: buildTabBody('Tab Body 1')},
  {key: 'val2', label: 'Tab 2', content: buildTabBody('Tab Body 2')},
  {key: 'val3', label: 'Tab 3', content: buildTabBody('Tab Body 3')},
  {key: 'val4', label: 'Tab 4', content: buildTabBody('Tab Body 4')},
  {key: 'val5', label: 'Tab 5', content: buildTabBody('Tab Body 5')}
];

const iconItems: TabItemData[] = [
  {key: 'dashboard', label: 'Dashboard', icon: Dashboard, content: buildTabBody('Dashboard')},
  {key: 'calendar', label: 'Calendar', icon: Calendar, content: buildTabBody('Calendar')},
  {key: 'bookmark', label: 'Bookmark', icon: Bookmark, content: buildTabBody('Bookmark')}
];

const falsyKeyItems: TabItemData[] = [
  {key: '', label: 'Tab 1', content: buildTabBody('Tab Body 1')},
  {key: 'val2', label: 'Tab 2', content: buildTabBody('Tab Body 2')},
  {key: 'val3', label: 'Tab 3', content: buildTabBody('Tab Body 3')},
  {key: 'val4', label: 'Tab 4', content: buildTabBody('Tab Body 4')},
  {key: 'val5', label: 'Tab 5', content: buildTabBody('Tab Body 5')}
];

const verticalWrapItems: TabItemData[] = [
  {key: 'val1', label: 'User Profile Settings', content: buildTabBody('Tab Body 1')},
  {key: 'val2', label: 'バナーおよびディスプレイ広告', content: buildTabBody('Tab Body 2')},
  {key: 'val3', label: 'Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz', content: buildTabBody('Tab Body 3')},
  {key: 'val4', label: 'Tab 4', content: buildTabBody('Tab Body 4')},
  {key: 'val5', label: 'Tab 5', content: buildTabBody('Tab Body 5')}
];

const allDisabledKeys = ['val1', 'val2', 'val3', 'val4', 'val5'];

const longTitleItems: TabItemData[] = [
  {key: 'val1', label: 'Tab 1 long long long name', content: 'Text'},
  {key: 'val2', label: 'Tab 2', content: 'Text 2'}
];

const dynamicSeedItems: TabItemData[] = Array.from({length: 6}, (_, index) => buildDynamicTabItem(index + 1));

function firstAvailableKey(items: TabItemData[] = [], disabledKeys?: Iterable<string>): string | null {
  let disabledKeySet = new Set(Array.from(disabledKeys ?? [], (key) => String(key)));

  let firstEnabledItem = items.find((item) => !item.disabled && !disabledKeySet.has(item.key));
  if (firstEnabledItem) {
    return firstEnabledItem.key;
  }

  return items[0]?.key ?? null;
}

const DynamicTabs = defineComponent({
  name: 'DynamicTabsStory',
  components: {Button, ButtonGroup, Tabs},
  props: {
    density: {
      type: String as PropType<'compact' | 'regular'>,
      default: 'regular'
    },
    isEmphasized: {
      type: Boolean,
      default: false
    },
    isQuiet: {
      type: Boolean,
      default: false
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
          content: buildTabBody(`Tab Body ${nextIndex}`)
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
      <Tabs
        aria-label="Tab example"
        :density="props.density"
        :is-emphasized="props.isEmphasized"
        :is-quiet="props.isQuiet"
        :items="tabs"
        :max-width="500"
        :model-value="selectedKey"
        @update:model-value="selectedKey = $event; onSelectionChange($event)" />
      <ButtonGroup style="margin-top: 12px; margin-right: 30px;">
        <Button variant="secondary" @click="addTab">Add Tab</Button>
        <Button variant="secondary" :is-disabled="tabs.length <= 1" @click="removeTab">Remove Tab</Button>
      </ButtonGroup>
    </div>
  `
});

const OrientationFlip = defineComponent({
  name: 'OrientationFlipStory',
  components: {Button, Tabs},
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
        :max-width="500"
        :model-value="selectedKey"
        :orientation="flipOrientation ? 'horizontal' : 'vertical'"
        @update:model-value="selectedKey = $event; onSelectionChange($event)" />
      <Button variant="secondary" style="margin-top: 12px;" @click="flipOrientation = !flipOrientation">Flip Orientation</Button>
    </div>
  `
});

const DynamicTabsWithDecoration = defineComponent({
  name: 'DynamicTabsWithDecorationStory',
  components: {ActionGroup, Tabs},
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
          content: buildTabBody(`Tab Body ${nextIndex}`)
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

    let disabledActionKeys = computed(() => tabs.value.length <= 1 ? ['remove'] : []);

    let onAction = (key: string) => {
      if (key === 'add') {
        addTab();
        return;
      }

      if (key === 'remove') {
        removeTab();
      }
    };

    return {
      tabs,
      selectedKey,
      onSelectionChange,
      disabledActionKeys,
      actionItems: DYNAMIC_CONTROL_ACTIONS,
      onAction
    };
  },
  template: `
    <div style="width: 80%;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: var(--spectrum-alias-border-size-thick) solid var(--spectrum-global-color-gray-300); padding-bottom: 8px;">
        <strong>Tabs</strong>
        <ActionGroup
          :disabled-keys="disabledActionKeys"
          :items="actionItems"
          @action="onAction">
          <template #item="{item}">
            <span class="spectrum-ActionButton-label">{{item.children}}</span>
          </template>
        </ActionGroup>
      </div>
      <Tabs
        aria-label="Tab example"
        :items="tabs"
        :max-width="500"
        :model-value="selectedKey"
        @update:model-value="selectedKey = $event; onSelectionChange($event)" />
    </div>
  `
});

const ControlledSelection = defineComponent({
  name: 'ControlledSelectionStory',
  components: {Picker, Tabs},
  setup() {
    let items = cloneItems(dynamicSeedItems);
    let selectedKey = ref<string | null>(items[0]?.key ?? null);
    let onSelectionChange = action('onSelectionChange');

    let pickerItems = computed(() => items.map((item) => ({
      id: item.key,
      name: item.label
    })));

    let onPickerSelection = (key: string | number | undefined) => {
      selectedKey.value = key == null ? null : String(key);
    };

    return {
      items,
      selectedKey,
      onSelectionChange,
      pickerItems,
      onPickerSelection
    };
  },
  template: `
    <div style="width: 80%; display: grid; gap: 12px;">
      <Picker
        label="Set selected tab"
        :items="pickerItems"
        :model-value="selectedKey ?? undefined"
        @update:model-value="onPickerSelection" />
      <Tabs
        aria-label="Tab example"
        :items="items"
        :max-width="500"
        :model-value="selectedKey"
        @update:model-value="selectedKey = $event; onSelectionChange($event)" />
    </div>
  `
});

const meta: Meta<typeof Tabs> = {
  title: 'Tabs',
  component: Tabs
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderTabs(baseArgs: Partial<TabsStoryArgs> = {}, wrapperStyle?: string) {
  return (args: TabsStoryArgs) => ({
    components: {Tabs},
    setup() {
      let mergedArgs = computed<TabsStoryArgs>(() => ({
        ariaLabel: 'Tab example',
        density: 'regular',
        items: cloneItems(baseItems),
        keyboardActivation: 'automatic',
        maxWidth: DEFAULT_MAX_WIDTH,
        orientation: 'horizontal',
        tabPlacement: 'start',
        ...args,
        ...baseArgs
      }));
      let wrapperInlineStyle = computed(() => {
        let style = `width: 100%; max-width: ${toCssWidth(mergedArgs.value.maxWidth)};`;
        if (wrapperStyle) {
          style += ` ${wrapperStyle}`;
        }
        return style;
      });
      let selectedKey = ref<string | null>(null);
      let onSelectionChange = action('onSelectionChange');

      watch(mergedArgs, (nextArgs) => {
        let nextItems = nextArgs.items ?? [];

        if (nextArgs.modelValue && nextItems.some((item) => item.key === nextArgs.modelValue)) {
          selectedKey.value = nextArgs.modelValue;
          return;
        }

        if (selectedKey.value && nextItems.some((item) => item.key === selectedKey.value)) {
          return;
        }

        selectedKey.value = firstAvailableKey(nextItems, nextArgs.disabledKeys);
      }, {immediate: true, deep: true});

      let updateSelection = (value: string | null) => {
        selectedKey.value = value;
        onSelectionChange(value);
      };

      return {
        mergedArgs,
        wrapperInlineStyle,
        selectedKey,
        updateSelection
      };
    },
    template: `
      <div :style="wrapperInlineStyle">
        <Tabs
          :aria-label="mergedArgs.ariaLabel"
          :density="mergedArgs.density"
          :disabled-keys="mergedArgs.disabledKeys"
          :is-disabled="Boolean(mergedArgs.isDisabled)"
          :is-emphasized="Boolean(mergedArgs.isEmphasized)"
          :is-quiet="Boolean(mergedArgs.isQuiet)"
          :items="mergedArgs.items"
          :keyboard-activation="mergedArgs.keyboardActivation"
          :max-width="mergedArgs.maxWidth"
          :model-value="selectedKey"
          :orientation="mergedArgs.orientation"
          :tab-placement="mergedArgs.tabPlacement"
          :width="mergedArgs.width"
          @update:model-value="updateSelection" />
      </div>
    `
  });
}

export const Default: Story = {
  render: renderTabs()
};

export const WithFalsyItemKey: Story = {
  render: renderTabs({items: cloneItems(falsyKeyItems)})
};

export const DefaultSelectedKeyVal2: Story = {
  render: renderTabs({modelValue: 'val2'})
};

export const ControlledSelectedKeyVal3: Story = {
  render: renderTabs({modelValue: 'val3'})
};

export const OrientationVertical: Story = {
  render: renderTabs({orientation: 'vertical'})
};

export const OrientationVerticalWrap: Story = {
  render: renderTabs({orientation: 'vertical', items: cloneItems(verticalWrapItems), maxWidth: 90})
};

export const DensityCompact: Story = {
  render: renderTabs({density: 'compact'})
};

export const IsQuiet: Story = {
  render: renderTabs({isQuiet: true})
};

export const IsQuietDensityCompact: Story = {
  render: renderTabs({density: 'compact', isQuiet: true})
};

export const DensityCompactOrientationVertical: Story = {
  render: renderTabs({density: 'compact', orientation: 'vertical'})
};

export const Icons: Story = {
  render: renderTabs({items: cloneItems(iconItems), modelValue: 'dashboard'})
};

export const IconsDensityCompact: Story = {
  render: renderTabs({items: cloneItems(iconItems), modelValue: 'dashboard', density: 'compact'})
};

export const IconsOrientationVertical: Story = {
  render: renderTabs({items: cloneItems(iconItems), modelValue: 'dashboard', orientation: 'vertical'})
};

export const IconsDensityCompactOrientationVertical: Story = {
  render: renderTabs({items: cloneItems(iconItems), modelValue: 'dashboard', density: 'compact', orientation: 'vertical'})
};

export const IsEmphasizedTrue: Story = {
  render: renderTabs({isEmphasized: true})
};

export const IsEmphasizedTrueIconsIsQuietTrue: Story = {
  render: renderTabs({items: cloneItems(iconItems), modelValue: 'dashboard', isEmphasized: true, isQuiet: true})
};

export const IsEmphasizedTrueOrientationVertical: Story = {
  render: renderTabs({isEmphasized: true, orientation: 'vertical'})
};

export const DisableAllTabs: Story = {
  render: renderTabs({isDisabled: true})
};

export const KeyboardActivationManual: Story = {
  render: renderTabs({keyboardActivation: 'manual'})
};

export const MiddleDisabled: Story = {
  render: renderTabs({disabledKeys: ['val2']})
};

export const AllDisabled: Story = {
  render: renderTabs({disabledKeys: allDisabledKeys})
};

export const Resizeable: Story = {
  render: renderTabs({maxWidth: 'none'}, 'min-width: 100px; width: 300px; height: 400px; padding: 10px; resize: horizontal; overflow: auto; background-color: var(--spectrum-global-color-gray-50);')
};

export const CollapseBehavior: Story = {
  render: () => ({
    components: {DynamicTabs},
    template: '<DynamicTabs />'
  })
};

export const CollapseBehaviorIsQuiet: Story = {
  render: () => ({
    components: {DynamicTabs},
    template: '<DynamicTabs is-quiet />'
  })
};

export const CollapseBehaviorDensityCompact: Story = {
  render: () => ({
    components: {DynamicTabs},
    template: '<DynamicTabs density="compact" />'
  })
};

export const CollapseBehaviorDensityCompactIsQuiet: Story = {
  render: () => ({
    components: {DynamicTabs},
    template: '<DynamicTabs density="compact" is-quiet />'
  })
};

export const CollapseBehaviorIsEmphasizedTrue: Story = {
  render: () => ({
    components: {DynamicTabs},
    template: '<DynamicTabs is-emphasized />'
  })
};

export const _OrientationFlip: Story = {
  render: () => ({
    components: {OrientationFlip},
    template: '<OrientationFlip />'
  })
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
          :max-width="500"
          :model-value="selectedKey"
          @update:model-value="selectedKey = $event; onSelectionChange($event)" />
      </div>
    `
  })
};

export const TransitionBetweenTabSizes: Story = {
  render: renderTabs({items: cloneItems(longTitleItems), modelValue: 'val1', maxWidth: 500})
};

export const TabWithFlexContainerInBetween: Story = {
  render: () => ({
    components: {DynamicTabsWithDecoration},
    template: '<DynamicTabsWithDecoration />'
  })
};

export const TabsAtTheBottom: Story = {
  render: renderTabs({
    items: [
      {key: 'tab1', label: 'Tab 1', content: 'Text 1'},
      {key: 'tab2', label: 'Tab 2', content: 'Text 2'}
    ],
    maxWidth: 500,
    tabPlacement: 'end'
  })
};

export const TabsOnTheRight: Story = {
  render: renderTabs({
    orientation: 'vertical',
    items: [
      {key: 'tab1', label: 'Tab 1', content: 'Text 1'},
      {key: 'tab2', label: 'Tab 2', content: 'Text 2'}
    ],
    maxWidth: 500,
    tabPlacement: 'end'
  })
};

export const FocusableElementInTabPanel: Story = {
  render: () => ({
    components: {Tabs, TextField},
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
        :max-width="500"
        :model-value="selectedKey"
        @update:model-value="selectedKey = $event; onSelectionChange($event)">
        <template #default="{item}">
          <TextField v-if="item?.key === 'tab1'" label="Tab 1" />
          <TextField v-else label="Tab 2" is-disabled />
        </template>
      </Tabs>
    `
  })
};

export const Tab1ControlledChild: Story = {
  render: () => ({
    components: {Tabs, TextField},
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
        :max-width="500"
        :model-value="selectedKey"
        @update:model-value="selectedKey = $event; onSelectionChange($event)">
        <template #default="{item}">
          <TextField
            v-if="item?.key === 'tab1'"
            label="Tab 1"
            :model-value="tab1Text"
            @update:model-value="tab1Text = $event" />
          <TextField v-else label="Tab 2" />
        </template>
      </Tabs>
    `
  })
};

export const ChangingTabTitles: Story = {
  render: () => ({
    components: {Tabs, TextField},
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
        <TextField
          label="Tab1 Title"
          :model-value="tab1Text"
          @update:model-value="tab1Text = $event" />
        <TextField
          label="Tab2 Title"
          :model-value="tab2Text"
          @update:model-value="tab2Text = $event" />
        <Tabs
          aria-label="Some tabs"
          :items="items"
          :max-width="500"
          :model-value="selectedKey"
          @update:model-value="selectedKey = $event; onSelectionChange($event)" />
      </div>
    `
  })
};

export const ChangingSelectionProgrammatically: Story = {
  render: () => ({
    components: {ControlledSelection},
    template: '<ControlledSelection />'
  })
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
          :width="widthValue"
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
    components: {Tabs, TextField},
    setup() {
      let outerSelectedKey = ref<string | null>('one');
      let innerSelectedKey = ref<string | null>('inner1');
      let onSelectionChange = action('onSelectionChange');
      let outerItems: TabItemData[] = [
        {key: 'one', label: 'Tab 1', content: 'Nested'},
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
        :max-width="500"
        :model-value="outerSelectedKey"
        @update:model-value="outerSelectedKey = $event; onSelectionChange($event)">
        <template #default="{item}">
          <div v-if="item?.key === 'one'" style="display: grid; gap: 8px;">
            <h3 style="margin: 0;">Nested</h3>
            <Tabs
              aria-label="Nested tabs"
              :items="innerItems"
              :max-width="500"
              :model-value="innerSelectedKey"
              @update:model-value="innerSelectedKey = $event; onSelectionChange($event)">
              <template #default="{item: innerItem}">
                <TextField v-if="innerItem?.key === 'inner1'" label="Tab 1" />
                <TextField v-else label="Tab 2" />
              </template>
            </Tabs>
          </div>
          <div v-else-if="item?.key === 'two'">
            <h3 style="margin: 0 0 4px;">Bar</h3>
            <p style="margin: 0;">To bar or not to bar.</p>
          </div>
          <div v-else-if="item?.key === 'three'">
            <h3 style="margin: 0 0 4px;">Foobar</h3>
            <p style="margin: 0;">That is the foobar.</p>
          </div>
          <div v-else-if="item?.key === 'four'">
            <h3 style="margin: 0 0 4px;">Foofoo</h3>
            <p style="margin: 0;">Once more foo upon the foo.</p>
          </div>
          <div v-else>
            <h3 style="margin: 0 0 4px;">Barfoo</h3>
            <p style="margin: 0;">What's he that barfoos so?</p>
          </div>
        </template>
      </Tabs>
    `
  })
};
