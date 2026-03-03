import {ref} from 'vue';
import {useComboBox} from '@vue-aria/combobox';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type ComboItem = {
  id: string,
  textValue: string
};

const lotsOfItems: ComboItem[] = Array.from({length: 50}, (_, index) => ({
  id: `item-${index}`,
  textValue: `Item ${index}`
}));

const meta = {
  title: 'useComboBox'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderComboBox(args: {isDisabled?: boolean, shouldFocusWrap?: boolean}) {
  return {
    setup() {
      let inputValue = ref('');
      let selectedKey = ref<string | null>(null);
      let comboBox = useComboBox({
        inputValue,
        isDisabled: args.isDisabled,
        items: lotsOfItems,
        selectedKey
      });

      let moveFocus = (delta: -1 | 1) => {
        if (!comboBox.isOpen.value) {
          comboBox.open(delta > 0 ? 'first' : 'last');
          return;
        }

        let items = comboBox.filteredItems.value;
        if (items.length === 0) {
          return;
        }

        let currentIndex = items.findIndex((item) => item.id === comboBox.focusedKey.value);
        let nextIndex = currentIndex + delta;
        if (currentIndex < 0) {
          nextIndex = delta > 0 ? 0 : items.length - 1;
        }

        if (args.shouldFocusWrap) {
          nextIndex = (nextIndex + items.length) % items.length;
        } else {
          nextIndex = Math.max(0, Math.min(items.length - 1, nextIndex));
        }

        comboBox.focusedKey.value = items[nextIndex]?.id ?? null;
      };

      let onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          moveFocus(1);
          return;
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          moveFocus(-1);
          return;
        }

        if (event.key === 'Enter' && comboBox.focusedKey.value) {
          event.preventDefault();
          comboBox.selectKey(comboBox.focusedKey.value);
          return;
        }

        if (event.key === 'Escape') {
          comboBox.close();
        }
      };

      let onInput = (event: Event) => {
        let target = event.currentTarget as HTMLInputElement | null;
        inputValue.value = target?.value ?? '';
        comboBox.open('first');
      };

      return {
        ...comboBox,
        onInput,
        onKeyDown
      };
    },
    template: `
      <div style="display: inline-flex; flex-direction: column;">
        <label v-bind="labelProps">Example</label>
        <div style="position: relative; display: inline-block;">
          <input
            v-bind="inputProps"
            type="text"
            @input="onInput"
            @keydown="onKeyDown"
            style="height: 24px; box-sizing: border-box; margin-right: 0; font-size: 16px;">
          <button
            v-bind="buttonProps"
            type="button"
            @click="toggle()"
            style="height: 24px; margin-left: 0;">
            <span aria-hidden="true" style="padding: 0 2px;">▼</span>
          </button>
          <div
            v-if="isOpen"
            style="position: absolute; width: 100%; border: 1px solid gray; background: lightgray; margin-top: 4px;">
            <ul
              v-bind="listBoxProps"
              style="margin: 0; padding: 0; list-style: none; max-height: 150px; overflow: auto;">
              <li
                v-for="item in filteredItems"
                :key="item.id"
                :id="listBoxProps.id + '-option-' + item.id"
                role="option"
                :aria-selected="selectedKey === item.id"
                :style="{
                  background: selectedKey === item.id ? 'blueviolet' : (focusedKey === item.id ? 'gray' : 'transparent'),
                  color: selectedKey === item.id ? 'white' : 'black',
                  padding: '2px 5px',
                  outline: 'none',
                  cursor: 'pointer'
                }"
                @mousedown.prevent="selectKey(item.id)">
                {{item.textValue}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    `
  };
}

export const ScrollTesting: Story = {
  render: (args) => renderComboBox(args),
  args: {},
  name: 'Scroll Testing'
};

export const Disabled: Story = {
  render: (args) => renderComboBox(args),
  args: {
    isDisabled: true
  },
  name: 'Disabled'
};

export const FocusWrapping: Story = {
  render: (args) => renderComboBox(args),
  args: {
    shouldFocusWrap: true
  },
  name: 'Focus Wrapping'
};
