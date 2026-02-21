import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueComboBox} from '@vue-spectrum/components';
import {ref} from 'vue';

const baseOptions = ['Foo', 'Bar', 'Baz', 'Google'];
const imeOptions = ['にほんご', 'ニホンゴ', 'ﾆﾎﾝｺﾞ', '日本語', '123', '１２３'];
const usStateOptions = [
  'Alabama',
  'Alaska',
  'Arizona',
  'California',
  'Colorado',
  'Florida',
  'Georgia',
  'New York',
  'Texas',
  'Washington'
];

const meta = {
  title: 'React Aria Components/ComboBox',
  component: VueComboBox
} satisfies Meta<typeof VueComboBox>;

export default meta;

type Story = StoryObj<typeof meta>;
type ComboBoxStory = StoryFn<typeof VueComboBox>;

function createComboBoxStory(options: string[], label = 'Test') {
  return {
    components: {
      VueComboBox
    },
    setup() {
      let value = ref('');
      return {
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
        data-testid="combo-box-example" />
    `
  };
}

export const ComboBoxExample: ComboBoxStory = () => createComboBoxStory(baseOptions);

export const ComboBoxRenderPropsStatic: ComboBoxStory = () => createComboBoxStory(['Foo', 'Bar', 'Baz']);

export const ComboBoxRenderPropsDefaultItems: ComboBoxStory = () => createComboBoxStory(['Foo', 'Bar', 'Baz']);

export const ComboBoxRenderPropsItems: Story = {
  render: () => createComboBoxStory(['Foo', 'Bar', 'Baz']),
  parameters: {
    description: {
      data: 'Note this won\'t filter the items in the listbox because it is fully controlled'
    }
  }
};

export const ComboBoxRenderPropsListBoxDynamic: ComboBoxStory = () => createComboBoxStory(['Foo', 'Bar', 'Baz']);

export const ComboBoxAsyncLoadingExample: ComboBoxStory = () => ({
  components: {
    VueComboBox
  },
  setup() {
    let value = ref('');
    let options = ref<string[]>([]);
    setTimeout(() => {
      options.value = ['Foo', 'Bar', 'Baz'];
    }, 300);

    return {
      options,
      value
    };
  },
  template: `
    <VueComboBox
      v-model="value"
      :options="options"
      label="Test" />
  `
});

export const ComboBoxImeExample: ComboBoxStory = () => createComboBoxStory(imeOptions, 'IME Test');

const manyItems = Array.from({length: 10000}, (_, index) => `Item ${index}`);

const VirtualizedComboBoxRender = (args: {isLoading: boolean}) => ({
  components: {
    VueComboBox
  },
  setup() {
    let value = ref('');
    return {
      args,
      options: manyItems,
      value
    };
  },
  template: `
    <VueComboBox
      v-model="value"
      :options="options"
      label="Test" />
  `
});

export const VirtualizedComboBox: StoryObj<typeof VirtualizedComboBoxRender> = {
  render: (args: {isLoading: boolean}) => VirtualizedComboBoxRender(args),
  args: {
    isLoading: false
  }
};

const AsyncVirtualizedDynamicComboboxRender = (props: {delay: number}) => ({
  components: {
    VueComboBox
  },
  setup() {
    let value = ref('');
    let options = ref<string[]>([]);
    setTimeout(() => {
      options.value = ['Luke Skywalker', 'Leia Organa', 'Han Solo', 'Darth Vader'];
    }, props.delay);

    return {
      options,
      value
    };
  },
  template: `
    <VueComboBox
      v-model="value"
      :options="options"
      label="Async Virtualized Dynamic ComboBox" />
  `
});

export const AsyncVirtualizedDynamicCombobox: StoryObj<typeof AsyncVirtualizedDynamicComboboxRender> = {
  render: (args: {delay: number}) => AsyncVirtualizedDynamicComboboxRender(args),
  args: {
    delay: 50
  }
};

export const ComboBoxListBoxItemWithAriaLabel: ComboBoxStory = () => createComboBoxStory(['Item Foo', 'Item Bar', 'Item Baz']);

export const MultiSelectComboBox: ComboBoxStory = () => createComboBoxStory(usStateOptions, 'Test');
