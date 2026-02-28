import {action} from 'storybook/actions';
import {ref} from 'vue';
import {useCheckbox} from '@vue-aria/checkbox';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'useCheckbox'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: () => ({
    setup() {
      let selected = ref(false);
      let {inputProps, labelProps, toggle} = useCheckbox({
        isSelected: selected,
        onChange: (value) => {
          selected.value = value;
        }
      });

      return {
        inputProps,
        labelProps,
        onBlur: action('onBlur'),
        onFocus: action('onFocus'),
        toggle
      };
    },
    template: `
      <div>
        <label v-bind="labelProps" style="display: block;">Unsubscribe</label>
        <input
          v-bind="inputProps"
          @change="toggle"
          @focus="onFocus"
          @blur="onBlur" />
      </div>
    `
  })
};
