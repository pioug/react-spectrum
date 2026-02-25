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
        comboBox,
        onInput,
        onKeyDown
      };
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 280px;">
        <label v-bind="comboBox.labelProps">Example</label>
        <div style="display: flex;">
          <input
            v-bind="comboBox.inputProps"
            type="text"
            @input="onInput"
            @keydown="onKeyDown"
            style="flex: 1; min-height: 32px; border: 1px solid #999; padding: 0 8px;">
          <button
            v-bind="comboBox.buttonProps"
            type="button"
            @click="comboBox.toggle()"
            style="min-width: 32px; border: 1px solid #999; border-left: 0;">
            ▼
          </button>
        </div>
        <ul
          v-show="comboBox.isOpen"
          v-bind="comboBox.listBoxProps"
          style="border: 1px solid #ccc; max-height: 180px; overflow: auto; list-style: none; margin: 0; padding: 4px;">
          <li
            v-for="item in comboBox.filteredItems"
            :key="item.id"
            :id="comboBox.listBoxProps.id + '-option-' + item.id"
            role="option"
            :aria-selected="comboBox.selectedKey === item.id"
            :style="{padding: '4px 8px', cursor: 'pointer', background: comboBox.focusedKey === item.id ? '#e8e8e8' : 'transparent'}"
            @mousedown.prevent="comboBox.selectKey(item.id)">
            {{item.textValue}}
          </li>
        </ul>
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
