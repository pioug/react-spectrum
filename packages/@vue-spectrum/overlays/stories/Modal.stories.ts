import {ActionButton, Button} from '@vue-spectrum/button';
import {ButtonGroup} from '@vue-spectrum/buttongroup';
import {Dialog, DialogTrigger} from '@vue-spectrum/dialog';
import {Divider} from '@vue-spectrum/divider';
import {Content} from '@vue-spectrum/view';
import {Heading} from '@vue-spectrum/text';
import {Text} from '@vue-spectrum/text';
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
    components: {ActionButton, Button, ButtonGroup, Content, Dialog, Divider, Modal, Text},
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
        <Dialog title="Title">
          <template #divider><Divider /></template>
          <Content>
            <Text>I am a dialog</Text>
          </Content>
          <template #buttonGroup>
            <ButtonGroup>
              <Button variant="cta" @click="closeModal">Close</Button>
            </ButtonGroup>
          </template>
        </Dialog>
      </Modal>
    `
  };
}

function renderUnmountingTrigger() {
  return {
    components: {ActionButton, Button, ButtonGroup, Content, Dialog, DialogTrigger, Divider, Heading, Modal, Text},
    setup() {
      let isModalOpen = ref(false);
      let isPopoverOpen = ref(false);
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
        openModalFromPopover
      };
    },
    template: `
      <DialogTrigger type="popover" :is-open="isPopoverOpen" @open-change="isPopoverOpen = $event">
        <template #trigger="{open}">
          <ActionButton @click="open">Open popover</ActionButton>
        </template>
        <template #heading><Heading>Title</Heading></template>
        <template #divider><Divider /></template>
        <Content>
          <div style="display: flex; flex-direction: column; gap: var(--spectrum-global-dimension-size-100);">
            <Text>I am a dialog</Text>
            <ActionButton @click="openModalFromPopover">Open modal</ActionButton>
          </div>
        </Content>
      </DialogTrigger>
      <Modal :is-open="isModalOpen" @close="closeModal">
        <Dialog title="Title">
          <template #divider><Divider /></template>
          <Content>
            <Text>I am a dialog</Text>
          </Content>
          <template #buttonGroup>
            <ButtonGroup>
              <Button variant="cta" @click="closeModal">Close</Button>
            </ButtonGroup>
          </template>
        </Dialog>
      </Modal>
    `
  };
}

export const Default: Story = {
  render: () => renderDefaultModal()
};

export const _UnmountingTrigger: Story = {
  render: () => renderUnmountingTrigger()
};
