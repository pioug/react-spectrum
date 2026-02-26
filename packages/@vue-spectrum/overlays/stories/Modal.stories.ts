import {ActionButton, Button} from '@vue-spectrum/button';
import {Dialog} from '@vue-spectrum/dialog';
import {Divider} from '@vue-spectrum/divider';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Modal} from '../src';

const meta: Meta<typeof Modal> = {
  title: 'Modal',
  component: Modal,
  parameters: {
    providerSwitcher: {status: 'notice'}
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderDefaultModal() {
  return {
    components: {ActionButton, Button, Dialog, Divider, Modal},
    setup() {
      let isOpen = ref(false);
      let openModal = () => {
        isOpen.value = true;
      };
      let closeModal = () => {
        isOpen.value = false;
      };

      return {
        closeModal,
        isOpen,
        openModal
      };
    },
    template: `
      <ActionButton @click="openModal">Open modal</ActionButton>
      <Modal :is-open="isOpen" @close="closeModal">
          <Dialog>
            <template #heading>Title</template>
            <template #divider>
              <Divider />
            </template>
            <span role="none">I am a dialog</span>
            <template #buttonGroup>
              <Button variant="cta" @click="closeModal">Close</Button>
            </template>
          </Dialog>
        </Modal>
    `
  };
}

function renderUnmountingTrigger() {
  return {
    components: {ActionButton, Button, Dialog, Divider, Modal},
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
        <Modal :is-open="isModalOpen" @close="closeModal">
          <Dialog>
            <template #heading>Title</template>
            <template #divider>
              <Divider />
            </template>
            <span role="none">I am a dialog</span>
            <template #buttonGroup>
              <Button variant="cta" @click="closeModal">Close</Button>
            </template>
          </Dialog>
        </Modal>
      </div>
    `
  };
}

export const Default: Story = {
  render: () => renderDefaultModal()
};

export const _UnmountingTrigger: Story = {
  render: () => renderUnmountingTrigger()
};
