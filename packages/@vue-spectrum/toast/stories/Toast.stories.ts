import {createToastQueue, ToastContainer} from '../src';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = {
  placement?: 'bottom' | 'bottom end' | 'top' | 'top end',
  shouldCloseOnAction?: boolean,
  timeout?: number
};

const meta: Meta = {
  title: 'Toast',
  args: {
    shouldCloseOnAction: false,
    timeout: undefined,
    placement: undefined
  },
  argTypes: {
    shouldCloseOnAction: {
      control: 'boolean'
    },
    timeout: {
      control: 'radio',
      options: [undefined, 5000]
    },
    placement: {
      control: 'select',
      options: [undefined, 'top', 'top end', 'bottom', 'bottom end']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function createSeededQueue(args: StoryArgs = {}, withAction = false) {
  let toastOptions = {
    shouldCloseOnAction: Boolean(args.shouldCloseOnAction),
    timeout: typeof args.timeout === 'number' ? args.timeout : undefined
  };
  let queue = createToastQueue({maxVisibleToasts: 3});
  queue.neutral('Toast available', withAction ? {...toastOptions, actionLabel: 'Action', onAction: () => {}} : toastOptions);
  queue.positive('Toast is done!', withAction ? {...toastOptions, actionLabel: 'Action', onAction: () => {}} : toastOptions);
  queue.negative('Toast is burned!', toastOptions);
  return queue;
}

function renderToastContainer(args: StoryArgs, withAction = false) {
  return {
    components: {ToastContainer},
    setup() {
      let queue = createSeededQueue(args, withAction);
      return {
        placement: args.placement,
        queue
      };
    },
    template: '<ToastContainer :placement="placement" :queue="queue" />'
  };
}

export const Default: Story = {
  render: (args) => renderToastContainer(args)
};

export const WithAction: Story = {
  render: (args) => renderToastContainer(args, true)
};

export const WithTestId: Story = {
  render: (args) => ({
    components: {ToastContainer},
    setup() {
      let queue = createSeededQueue(args, true);
      return {placement: args.placement, queue};
    },
    template: '<ToastContainer :placement="placement" data-testid="hello i am a test id" :queue="queue" />'
  })
};

export const WithDialog: Story = {
  render: (args) => ({
    components: {ToastContainer},
    setup() {
      let queue = createSeededQueue(args);
      return {placement: args.placement, queue};
    },
    template: `
      <div style="display: grid; gap: 12px; padding: 16px; border: 1px solid #d4d4d8; border-radius: 8px;">
        <strong>Toasty</strong>
        <div>Dialog-like wrapper parity scenario.</div>
        <ToastContainer :placement="placement" :queue="queue" />
      </div>
    `
  })
};

export const MultipleToastContainers: Story = {
  render: (args) => ({
    components: {ToastContainer},
    setup() {
      let firstQueue = createToastQueue({maxVisibleToasts: 2});
      let secondQueue = createToastQueue({maxVisibleToasts: 2});
      let toastOptions = {
        shouldCloseOnAction: Boolean(args.shouldCloseOnAction),
        timeout: typeof args.timeout === 'number' ? args.timeout : undefined
      };
      firstQueue.info('First queue', toastOptions);
      secondQueue.positive('Second queue', toastOptions);
      return {placement: args.placement, firstQueue, secondQueue};
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <ToastContainer :placement="placement" :queue="firstQueue" />
        <ToastContainer :placement="placement" :queue="secondQueue" />
      </div>
    `
  })
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
          shouldCloseOnAction: Boolean(args.shouldCloseOnAction),
          timeout: typeof args.timeout === 'number' ? args.timeout : undefined,
          onClose: () => {
            close.value = null;
          }
        });
      };

      return {
        close,
        placement: args.placement,
        queue,
        toggleToast
      };
    },
    template: `
      <div style="display: grid; gap: 10px; justify-items: start;">
        <button type="button" @click="toggleToast">{{close ? 'Hide' : 'Show'}} Toast</button>
        <ToastContainer :placement="placement" :queue="queue" />
      </div>
    `
  })
};

export const WithIframe: Story = {
  render: (args) => ({
    components: {ToastContainer},
    setup() {
      let queue = createSeededQueue(args);
      return {placement: args.placement, queue};
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <div>Iframe parity scenario placeholder.</div>
        <ToastContainer :placement="placement" :queue="queue" />
      </div>
    `
  })
};

export const withFullscreen: Story = {
  render: (args) => ({
    components: {ToastContainer},
    setup() {
      let queue = createSeededQueue(args);
      return {placement: args.placement, queue};
    },
    template: `
      <div style="min-height: 300px; border: 1px dashed #d4d4d8; padding: 16px;">
        <ToastContainer :placement="placement" :queue="queue" />
      </div>
    `
  })
};
