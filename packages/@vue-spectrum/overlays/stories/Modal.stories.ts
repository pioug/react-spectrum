import {ActionButton, Button} from '@vue-spectrum/button';
import {Dialog} from '@vue-spectrum/dialog';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Modal} from '../src';

const meta: Meta<typeof Modal> = {
  title: 'Modal',
  component: Modal,
  parameters: {
    providerSwitcher: {status: 'notice'}
  },
  argTypes: {
    dismissable: {
      control: 'boolean'
    },
    isDismissable: {
      control: 'boolean'
    },
    isOpen: {
      control: 'boolean'
    },
    onEnter: {
      table: {
        disable: true
      }
    },
    onEntered: {
      table: {
        disable: true
      }
    },
    onEntering: {
      table: {
        disable: true
      }
    },
    onExit: {
      table: {
        disable: true
      }
    },
    onExited: {
      table: {
        disable: true
      }
    },
    onExiting: {
      table: {
        disable: true
      }
    },
    open: {
      control: 'boolean'
    },
    state: {
      table: {
        disable: true
      }
    },
    type: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderDefaultModal(args: Record<string, unknown>) {
  return {
    components: {ActionButton, Button, Dialog, Modal},
    setup() {
      let isOpen = ref(false);
      let openModal = () => {
        isOpen.value = true;
      };
      let closeModal = () => {
        isOpen.value = false;
      };

      return {
        args,
        closeModal,
        isOpen,
        openModal
      };
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <ActionButton @click="openModal">Open modal</ActionButton>
        <Modal v-bind="args" :is-open="isOpen" @close="closeModal">
          <Dialog title="Title" :is-dismissable="true" @close="closeModal">
            <p>I am a dialog</p>
            <template #buttonGroup>
              <Button variant="primary" @click="closeModal">Close</Button>
            </template>
          </Dialog>
        </Modal>
      </div>
    `
  };
}

function renderUnmountingTrigger(args: Record<string, unknown>) {
  return {
    components: {ActionButton, Button, Dialog, Modal},
    setup() {
      let isModalOpen = ref(false);
      let isPopoverOpen = ref(false);

      let openPopover = () => {
        isPopoverOpen.value = true;
      };
      let openModalFromPopover = () => {
        isPopoverOpen.value = false;
        isModalOpen.value = true;
      };
      let closeModal = () => {
        isModalOpen.value = false;
      };

      return {
        args,
        closeModal,
        isModalOpen,
        isPopoverOpen,
        openModalFromPopover,
        openPopover
      };
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <ActionButton @click="openPopover">Open popover</ActionButton>
        <div
          v-if="isPopoverOpen"
          style="border: 1px solid #444; border-radius: 8px; padding: 12px; display: grid; gap: 8px; max-width: 280px;">
          <p style="margin: 0;">I am a dialog</p>
          <ActionButton @click="openModalFromPopover">Open modal</ActionButton>
        </div>
        <Modal v-bind="args" :is-open="isModalOpen" @close="closeModal">
          <Dialog title="Title" :is-dismissable="true" @close="closeModal">
            <p>I am a dialog</p>
            <template #buttonGroup>
              <Button variant="primary" @click="closeModal">Close</Button>
            </template>
          </Dialog>
        </Modal>
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => renderDefaultModal(args)
};

export const _UnmountingTrigger: Story = {
  render: (args) => renderUnmountingTrigger(args)
};
