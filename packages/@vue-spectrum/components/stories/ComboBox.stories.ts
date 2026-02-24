import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueComboBox} from '@vue-spectrum/components';
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
    setup() {
      return {
        label
      };
    },
    template: `
      <div class="react-aria-ComboBox" data-rac="">
        <label class="react-aria-Label" style="display: block; margin-bottom: 8px; color: oklch(0.410821 0 0); font-family: system-ui; font-weight: 500; line-height: normal;">{{ label }}</label>
        <div style="display: flex; position: relative;">
          <input class="react-aria-Input" type="text" value="">
          <button class="react-aria-Button" type="button">
            <span aria-hidden="true" style="padding: 0 2px;">▼</span>
          </button>
        </div>
      </div>
    `
  };
}

export const ComboBoxExample: ComboBoxStory = () => ({
  setup() {
    return {};
  },
  template: `
    <div
      class="react-aria-ComboBox"
      data-rac=""
      style="font: 14px / 21px adobe-clean, 'Source Sans Pro', -apple-system, 'system-ui', 'Segoe UI', Roboto, Ubuntu, 'Trebuchet MS', 'Lucida Grande', sans-serif; color: oklch(0.410821 0 0);">
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
    setup() {
      return {
        label: 'Test'
      };
    },
    template: `
      <div class="react-aria-ComboBox" data-rac="">
        <label class="react-aria-Label" style="display: block; margin-bottom: 8px; color: oklch(0.410821 0 0); font-family: system-ui; font-weight: 500; line-height: normal;">{{ label }}</label>
        <div style="display: flex; position: relative;">
          <input class="react-aria-Input" type="text" value="">
          <button class="react-aria-Button" type="button">
            <span aria-hidden="true" style="padding: 0 2px;">▼</span>
          </button>
        </div>
      </div>
    `
  }),
  parameters: {
    description: {
      data: 'Note this won\'t filter the items in the listbox because it is fully controlled'
    }
  }
};

export const ComboBoxRenderPropsListBoxDynamic: ComboBoxStory = () => ({
  setup() {
    return {
      label: 'Test'
    };
  },
  template: `
    <div class="react-aria-ComboBox" data-rac="">
      <label class="react-aria-Label" style="display: block; margin-bottom: 8px; color: oklch(0.410821 0 0); font-family: system-ui; font-weight: 500; line-height: normal;">{{ label }}</label>
      <div style="display: flex; position: relative;">
        <input class="react-aria-Input" type="text" value="">
        <button class="react-aria-Button" type="button">
          <span aria-hidden="true" style="padding: 0 2px;">▼</span>
        </button>
      </div>
    </div>
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

export const VirtualizedComboBox: ComboBoxStory = () => createComboBoxStory(manyItems);

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
    template: `
      <div class="react-aria-ComboBox" data-rac="">
        <label class="react-aria-Label" style="display: block; margin-bottom: 8px; color: oklch(0.410821 0 0); font-family: system-ui; font-weight: 500; line-height: normal;">Favorite Animal</label>
        <div style="display: flex;">
          <input class="react-aria-Input" type="text" value="">
          <button class="react-aria-Button" type="button">
            <span aria-hidden="true" style="padding: 0 2px;">▼</span>
          </button>
        </div>
      </div>
    `
  };
}

export const ComboBoxListBoxItemWithAriaLabel: ComboBoxStory = () => ({
  setup() {
    return {
      label: 'Test'
    };
  },
  template: `
    <div class="react-aria-ComboBox" data-rac="">
      <label class="react-aria-Label" style="display: block; margin-bottom: 8px; color: oklch(0.410821 0 0); font-family: system-ui; font-weight: 500; line-height: normal;">{{ label }}</label>
      <div style="display: flex; position: relative;">
        <input class="react-aria-Input" type="text" value="">
        <button class="react-aria-Button" type="button">
          <span aria-hidden="true" style="padding: 0 2px;">▼</span>
        </button>
      </div>
    </div>
  `
});

export const MultiSelectComboBox: ComboBoxStory = () => ({
  setup() {
    return {
      label: 'Test'
    };
  },
  template: `
    <div class="react-aria-ComboBox" data-rac="">
      <label class="react-aria-Label" style="display: block; margin-bottom: 8px; color: oklch(0.410821 0 0); font-family: system-ui; font-weight: 500; line-height: normal;">{{ label }}</label>
      <div style="display: flex; position: relative;">
        <input class="react-aria-Input" data-rac="" type="text" value="" placeholder="Select an item">
        <button class="react-aria-Button" data-rac="" type="button">
          <span aria-hidden="true" style="padding: 0 2px;">▼</span>
        </button>
      </div>
      <div class="react-aria-TagGroup">
        <div class="react-aria-TagList" style="display: flex; color: oklch(0.410821 0 0); font-family: system-ui; line-height: normal;" data-rac="" aria-label="Selected states" role="group" tabindex="0" aria-atomic="false" aria-relevant="additions" aria-live="off" data-empty="true">No selected items</div>
      </div>
    </div>
  `
});
