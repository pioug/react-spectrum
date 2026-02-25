import {createToastQueue, ToastContainer} from '../src';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = {
  ariaLabel?: string,
  placement?: 'bottom' | 'bottom end' | 'top' | 'top end'
};

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
      options: ['top', 'top end', 'bottom', 'bottom end']
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

function createSeededQueue(withAction = false) {
  let queue = createToastQueue({maxVisibleToasts: 3});
  queue.neutral('Toast available', withAction ? {actionLabel: 'Action', onAction: () => {}} : {});
  queue.positive('Toast is done!', withAction ? {actionLabel: 'Action', onAction: () => {}} : {});
  queue.negative('Toast is burned!');
  return queue;
}

function renderToastContainer(args: StoryArgs, withAction = false) {
  return {
    components: {ToastContainer},
    setup() {
      let queue = createSeededQueue(withAction);
      return {args, queue};
    },
    template: '<ToastContainer v-bind="args" :queue="queue" />'
  };
}

export const Default: Story = {
  render: (args) => renderToastContainer(args)
};

export const WithAction: Story = {
  render: (args) => renderToastContainer(args, true),
  name: 'With action'
};

export const WithTestId: Story = {
  render: (args) => ({
    components: {ToastContainer},
    setup() {
      let queue = createSeededQueue(true);
      return {args, queue};
    },
    template: '<ToastContainer v-bind="args" data-testid="hello i am a test id" :queue="queue" />'
  }),
  name: 'With test id'
};

export const WithDialog: Story = {
  render: (args) => ({
    components: {ToastContainer},
    setup() {
      let queue = createSeededQueue();
      return {args, queue};
    },
    template: `
      <div style="display: grid; gap: 12px; padding: 16px; border: 1px solid #d4d4d8; border-radius: 8px;">
        <strong>Toasty</strong>
        <div>Dialog-like wrapper parity scenario.</div>
        <ToastContainer v-bind="args" :queue="queue" />
      </div>
    `
  }),
  name: 'With dialog'
};

export const MultipleToastContainers: Story = {
  render: (args) => ({
    components: {ToastContainer},
    setup() {
      let firstQueue = createToastQueue({maxVisibleToasts: 2});
      let secondQueue = createToastQueue({maxVisibleToasts: 2});
      firstQueue.info('First queue');
      secondQueue.positive('Second queue');
      return {args, firstQueue, secondQueue};
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <ToastContainer v-bind="args" :queue="firstQueue" />
        <ToastContainer v-bind="args" :queue="secondQueue" />
      </div>
    `
  }),
  name: 'multiple ToastContainers'
};

export const ProgrammaticallyClosing: Story = {
  render: (args) => ({
    setup() {
      let queue = createToastQueue();
      let close = ref<(() => void) | null>(null);
      let toggleToast = () => {
        if (close.value) {
          close.value();
          close.value = null;
          return;
        }
        close.value = queue.negative('Unable to save', {
          onClose: () => {
            close.value = null;
          }
        });
      };

      return {
        args,
        close,
        queue,
        toggleToast
      };
    },
    template: `
      <div style="display: grid; gap: 10px; justify-items: start;">
        <button type="button" @click="toggleToast">{{close ? 'Hide' : 'Show'}} Toast</button>
        <ToastContainer v-bind="args" :queue="queue" />
      </div>
    `
  }),
  name: 'programmatically closing'
};

export const WithIframe: Story = {
  render: (args) => ({
    components: {ToastContainer},
    setup() {
      let queue = createSeededQueue();
      return {args, queue};
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <div>Iframe parity scenario placeholder.</div>
        <ToastContainer v-bind="args" :queue="queue" />
      </div>
    `
  }),
  name: 'with iframe'
};

export const withFullscreen: Story = {
  render: (args) => ({
    components: {ToastContainer},
    setup() {
      let queue = createSeededQueue();
      return {args, queue};
    },
    template: `
      <div style="min-height: 300px; border: 1px dashed #d4d4d8; padding: 16px;">
        <ToastContainer v-bind="args" :queue="queue" />
      </div>
    `
  })
};
