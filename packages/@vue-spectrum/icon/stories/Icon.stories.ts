import {Icon} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'Icons/Custom',
  component: Icon,
  providerSwitcher: {status: 'positive'}
} as Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ExcitingSquare: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {Icon},
    template: '<Icon><svg viewBox="0 0 25 25"><rect x="0" y="0" width="25" height="25" /></svg></Icon>'
  })
};
