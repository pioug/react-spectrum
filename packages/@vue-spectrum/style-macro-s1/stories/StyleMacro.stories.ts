import {style} from '@vue-spectrum/style-macro-s1';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'S1 Style Macro'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: () => ({
    setup() {
      let className = style({
        backgroundColor: 'orange-500',
        color: 'black',
        fontSize: 'lg',
        paddingX: 8,
        paddingY: 4,
        borderRadius: 'default'
      })();

      return {
        className
      };
    },
    template: '<div :class="className">Test</div>'
  })
};
