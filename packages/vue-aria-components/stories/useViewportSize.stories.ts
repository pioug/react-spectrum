import {useViewportSize} from '@vue-aria/utils';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'useViewportSize'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: () => ({
    setup() {
      let viewportSize = useViewportSize();
      return {
        viewportSize
      };
    },
    template: `
      <div>
        {{JSON.stringify(viewportSize)}}
        <input />
        <div style="height: 200vh;" />
      </div>
    `
  }),
  parameters: {
    description: {
      data: 'Clicking the input and then clicking outside should not cause the viewport size to change.'
    }
  }
};
