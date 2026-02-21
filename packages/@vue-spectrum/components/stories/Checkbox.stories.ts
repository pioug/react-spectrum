import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueCheckbox} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/Checkbox',
  component: VueCheckbox,
  args: {
    onFocus: action('onFocus'),
    onBlur: action('onBlur')
  }
} satisfies Meta<typeof VueCheckbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CheckboxExample: Story = {
  render: (args: {onFocus?: (event: FocusEvent) => void, onBlur?: (event: FocusEvent) => void}) => ({
    components: {
      VueCheckbox
    },
    setup() {
      return {
        args
      };
    },
    template: `
      <VueCheckbox v-bind="args">
        <div class="checkbox">
          <svg viewBox="0 0 18 18" aria-hidden="true">
            <polyline points="1 9 7 14 15 4" />
          </svg>
        </div>
        Unsubscribe
      </VueCheckbox>
    `
  })
};
