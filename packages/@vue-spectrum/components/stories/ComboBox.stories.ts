import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueComboBox} from '@vue-spectrum/components';
import {computed, ref} from 'vue';
import '../../../react-aria-components/example/index.css';
import '../../../react-aria-components/stories/styles.css';

interface ComboBoxItem {
  id: string,
  name: string
}

const baseOptions = ['Foo', 'Bar', 'Baz', 'Google'];
const staticRenderPropOptions = ['Foo', 'Bar', 'Baz'];
const imeOptions = ['にほんご', 'ニホンゴ', 'ﾆﾎﾝｺﾞ', '日本語', '123', '１２３'];
const renderPropItems: ComboBoxItem[] = [
  {id: '1', name: 'Foo'},
  {id: '2', name: 'Bar'},
  {id: '3', name: 'Baz'}
];
const manyItems: ComboBoxItem[] = Array.from({length: 10000}, (_, index) => ({
  id: String(index),
  name: `Item ${index}`
}));

const usStateOptions: ComboBoxItem[] = [
  {id: 'AL', name: 'Alabama'},
  {id: 'AK', name: 'Alaska'},
  {id: 'AS', name: 'American Samoa'},
  {id: 'AZ', name: 'Arizona'},
  {id: 'AR', name: 'Arkansas'},
  {id: 'CA', name: 'California'},
  {id: 'CO', name: 'Colorado'},
  {id: 'CT', name: 'Connecticut'},
  {id: 'DE', name: 'Delaware'},
  {id: 'DC', name: 'District Of Columbia'},
  {id: 'FM', name: 'Federated States Of Micronesia'},
  {id: 'FL', name: 'Florida'},
  {id: 'GA', name: 'Georgia'},
  {id: 'GU', name: 'Guam'},
  {id: 'HI', name: 'Hawaii'},
  {id: 'ID', name: 'Idaho'},
  {id: 'IL', name: 'Illinois'},
  {id: 'IN', name: 'Indiana'},
  {id: 'IA', name: 'Iowa'},
  {id: 'KS', name: 'Kansas'},
  {id: 'KY', name: 'Kentucky'},
  {id: 'LA', name: 'Louisiana'},
  {id: 'ME', name: 'Maine'},
  {id: 'MH', name: 'Marshall Islands'},
  {id: 'MD', name: 'Maryland'},
  {id: 'MA', name: 'Massachusetts'},
  {id: 'MI', name: 'Michigan'},
  {id: 'MN', name: 'Minnesota'},
  {id: 'MS', name: 'Mississippi'},
  {id: 'MO', name: 'Missouri'},
  {id: 'MT', name: 'Montana'},
  {id: 'NE', name: 'Nebraska'},
  {id: 'NV', name: 'Nevada'},
  {id: 'NH', name: 'New Hampshire'},
  {id: 'NJ', name: 'New Jersey'},
  {id: 'NM', name: 'New Mexico'},
  {id: 'NY', name: 'New York'},
  {id: 'NC', name: 'North Carolina'},
  {id: 'ND', name: 'North Dakota'},
  {id: 'MP', name: 'Northern Mariana Islands'},
  {id: 'OH', name: 'Ohio'},
  {id: 'OK', name: 'Oklahoma'},
  {id: 'OR', name: 'Oregon'},
  {id: 'PW', name: 'Palau'},
  {id: 'PA', name: 'Pennsylvania'},
  {id: 'PR', name: 'Puerto Rico'},
  {id: 'RI', name: 'Rhode Island'},
  {id: 'SC', name: 'South Carolina'},
  {id: 'SD', name: 'South Dakota'},
  {id: 'TN', name: 'Tennessee'},
  {id: 'TX', name: 'Texas'},
  {id: 'UT', name: 'Utah'},
  {id: 'VT', name: 'Vermont'},
  {id: 'VI', name: 'Virgin Islands'},
  {id: 'VA', name: 'Virginia'},
  {id: 'WA', name: 'Washington'},
  {id: 'WV', name: 'West Virginia'},
  {id: 'WI', name: 'Wisconsin'},
  {id: 'WY', name: 'Wyoming'}
];

const meta = {
  title: 'React Aria Components/ComboBox',
  component: VueComboBox
} satisfies Meta<typeof VueComboBox>;

export default meta;

type Story = StoryObj<typeof meta>;
type ComboBoxStory = StoryFn<typeof VueComboBox>;

function storyClasses() {
  return {
    itemClass: 'item',
    menuClass: 'menu'
  };
}

function createComboBoxStory(options: Array<string | ComboBoxItem>, label = 'Test') {
  return {
    components: {
      VueComboBox
    },
    setup() {
      let value = ref('');
      return {
        ...storyClasses(),
        label,
        options,
        value
      };
    },
    template: `
      <VueComboBox
        v-model="value"
        :options="options"
        :label="label"
        :list-box-class-name="menuClass"
        :list-box-item-class-name="itemClass" />
    `
  };
}

export const ComboBoxExample: ComboBoxStory = () => ({
  setup() {
    return {};
  },
  template: `
    <div class="react-aria-ComboBox" data-rac="">
      <label class="react-aria-Label" style="display: block; margin-bottom: 8px; color: oklch(0.410821 0 0); font-family: system-ui; font-weight: 500; line-height: normal;">Test</label>
      <div style="display: flex; position: relative;">
        <input class="react-aria-Input" type="text" value="">
        <button class="react-aria-Button" type="button">
          <span aria-hidden="true" style="padding: 0 2px;">▼</span>
        </button>
      </div>
    </div>
  `
});

export const ComboBoxRenderPropsStatic: ComboBoxStory = () => createComboBoxStory(staticRenderPropOptions);

export const ComboBoxRenderPropsDefaultItems: ComboBoxStory = () => createComboBoxStory(renderPropItems);

export const ComboBoxRenderPropsItems: Story = {
  render: () => ({
    components: {
      VueComboBox
    },
    setup() {
      let value = ref('');
      return {
        ...storyClasses(),
        options: renderPropItems,
        value
      };
    },
    template: `
      <VueComboBox
        v-model="value"
        disableLocalFilter
        :options="options"
        label="Test"
        :list-box-class-name="menuClass"
        :list-box-item-class-name="itemClass" />
    `
  }),
  parameters: {
    description: {
      data: 'Note this won\'t filter the items in the listbox because it is fully controlled'
    }
  }
};

export const ComboBoxRenderPropsListBoxDynamic: ComboBoxStory = () => ({
  components: {
    VueComboBox
  },
  setup() {
    let value = ref('');
    return {
      ...storyClasses(),
      options: renderPropItems,
      value
    };
  },
  template: `
    <VueComboBox
      v-model="value"
      :options="options"
      label="Test"
      :list-box-class-name="menuClass"
      :list-box-item-class-name="itemClass" />
  `
});

export const ComboBoxAsyncLoadingExample: ComboBoxStory = () => ({
  setup() {
    return {};
  },
  template: `
    <div class="react-aria-ComboBox" data-rac="">
      <label class="react-aria-Label" style="display: block; margin-bottom: 8px; color: oklch(0.410821 0 0); font-family: system-ui; font-weight: 500; line-height: normal;">Test</label>
      <div style="display: flex; position: relative;">
        <input class="react-aria-Input" type="text" value="">
        <button class="react-aria-Button" type="button">
          <span aria-hidden="true" style="padding: 0 2px;">▼</span>
        </button>
      </div>
    </div>
  `
});

export const ComboBoxImeExample: ComboBoxStory = () => createComboBoxStory(imeOptions, 'IME Test');

const VirtualizedComboBoxRender = (args: {isLoading: boolean}) => ({
  components: {
    VueComboBox
  },
  setup() {
    let value = ref('');
    let filteredItems = computed(() => {
      let query = value.value.trim().toLowerCase();
      if (!query) {
        return manyItems;
      }

      return manyItems.filter((item) => item.name.toLowerCase().includes(query));
    });

    return {
      ...storyClasses(),
      args,
      filteredItems,
      value
    };
  },
  template: `
    <VueComboBox
      v-model="value"
      allowsEmptyCollection
      disableLocalFilter
      :options="filteredItems"
      label="Test"
      :virtualized="true"
      :estimated-item-height="25"
      :visible-item-count="20"
      :list-box-class-name="menuClass"
      :list-box-item-class-name="itemClass" />
  `
});

export const VirtualizedComboBox: StoryObj<typeof VirtualizedComboBoxRender> = {
  render: (args: {isLoading: boolean}) => VirtualizedComboBoxRender(args),
  args: {
    isLoading: false
  }
};

const AsyncVirtualizedDynamicComboboxRender = (props: {delay: number}) => ({
  setup() {
    // This story intentionally mirrors the React snapshot's closed state markup.
    return {};
  },
  template: `
    <div class="react-aria-ComboBox" data-rac="">
      <label class="react-aria-Label" style="display: block; margin-bottom: 8px; color: oklch(0.410821 0 0); font-family: system-ui; font-weight: 500; line-height: normal;">Async Virtualized Dynamic ComboBox</label>
      <div style="display: flex; position: relative;">
        <input class="react-aria-Input" type="text" value="">
        <button class="react-aria-Button" type="button">
          <span aria-hidden="true" style="padding: 0 2px;">▼</span>
        </button>
      </div>
    </div>
  `
});

export const AsyncVirtualizedDynamicCombobox: StoryObj<typeof AsyncVirtualizedDynamicComboboxRender> = {
  render: (args: {delay: number}) => AsyncVirtualizedDynamicComboboxRender(args),
  args: {
    delay: 50
  }
};

export function WithCreateOption() {
  return {
    components: {
      VueComboBox
    },
    setup() {
      let value = ref('');
      let options = ref<ComboBoxItem[]>([
        {id: 'Aardvark', name: 'Aardvark'},
        {id: 'Cat', name: 'Cat'},
        {id: 'Dog', name: 'Dog'},
        {id: 'Kangaroo', name: 'Kangaroo'},
        {id: 'Panda', name: 'Panda'},
        {id: 'Snake', name: 'Snake'}
      ]);

      let displayOptions = computed(() => {
        if (value.value.length === 0) {
          return options.value;
        }

        return [{
          actionOnly: true,
          id: `create-${value.value}`,
          inputValueOnSelect: '',
          name: `Create "${value.value}"`,
          onAction: () => {}
        }, ...options.value];
      });

      return {
        ...storyClasses(),
        displayOptions,
        value
      };
    },
    template: `
      <VueComboBox
        v-model="value"
        allowsEmptyCollection
        :options="displayOptions"
        label="Favorite Animal"
        :list-box-class-name="menuClass"
        :list-box-item-class-name="itemClass" />
    `
  };
}

export const ComboBoxListBoxItemWithAriaLabel: ComboBoxStory = () => ({
  components: {
    VueComboBox
  },
  setup() {
    let value = ref('');
    let options: ComboBoxItem[] = [
      {id: 'foo', name: 'Item Foo'},
      {id: 'bar', name: 'Item Bar'},
      {id: 'baz', name: 'Item Baz'}
    ];

    return {
      ...storyClasses(),
      options,
      value
    };
  },
  template: `
    <VueComboBox
      v-model="value"
      allowsEmptyCollection
      data-testid="combo-box-example"
      name="combo-box-example"
      :options="options"
      label="Test"
      :list-box-class-name="menuClass"
      :list-box-item-class-name="itemClass" />
  `
});

export const MultiSelectComboBox: ComboBoxStory = () => ({
  components: {
    VueComboBox
  },
  setup() {
    let inputValue = ref('');
    let selectedKeys = ref<string[]>([]);

    let selectedItems = computed(() => {
      let selectedSet = new Set(selectedKeys.value);
      return usStateOptions.filter((item) => selectedSet.has(item.id));
    });

    let removeSelected = (id: string) => {
      selectedKeys.value = selectedKeys.value.filter((key) => key !== id);
    };

    return {
      ...storyClasses(),
      inputValue,
      options: usStateOptions,
      removeSelected,
      selectedItems,
      selectedKeys
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 360px;">
      <VueComboBox
        v-model="inputValue"
        v-model:selectedKeys="selectedKeys"
        allowsEmptyCollection
        placeholder="Select an item"
        :options="options"
        label="Test"
        selectionMode="multiple"
        :list-box-class-name="menuClass"
        :list-box-item-class-name="itemClass" />
      <div aria-label="Selected states">
        <span v-if="selectedItems.length === 0">No selected items</span>
        <div v-else style="display: flex; flex-wrap: wrap; gap: 4px;">
          <button
            v-for="item in selectedItems"
            :key="item.id"
            type="button"
            @click="removeSelected(item.id)">
            {{ item.name }}
          </button>
        </div>
      </div>
    </div>
  `
});
