import {createToastQueue, ToastContainer} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ToastContainer> = {
  title: 'Toast',
  component: ToastContainer,
  args: {
    ariaLabel: 'Notifications',
    placement: 'bottom'
  },
  argTypes: {
    ariaLabel: {
      control: 'text'
    },
    placement: {
      control: 'select',
      options: [
        'top',
        'top end',
        'bottom',
        'bottom end'
      ]
    },
    queue: {
      table: {
        disable: true
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {ToastContainer},
    setup() {
      let queue = createToastQueue({maxVisibleToasts: 3});
      queue.neutral('Draft saved', {timeout: 10000});
      queue.info('Invited collaborators', {timeout: 10000});
      return {args, queue};
    },
    template: '<ToastContainer v-bind="args" :queue="queue"></ToastContainer>'
  })
};

export const TopEnd: Story = {
  ...Default,
  args: {
    placement: 'top end'
  }
};

export const Top: Story = {
  ...Default,
  args: {
    placement: 'top'
  }
};

export const BottomEnd: Story = {
  ...Default,
  args: {
    placement: 'bottom end'
  }
};
