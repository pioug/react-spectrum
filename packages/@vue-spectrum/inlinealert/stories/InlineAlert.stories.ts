import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'InlineAlert',
  parameters: {
    docs: {
      description: {
        story: 'Story source scaffold for Vue parity. Replace with real Vue story implementations.'
      }
    }
  }
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const InlineAlertScaffold: Story = {
  render: () => ({
    template: '<div style="padding: 16px;">Story source scaffold</div>'
  })
};
