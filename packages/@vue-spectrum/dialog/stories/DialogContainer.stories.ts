import {ActionButton, Button} from '@vue-spectrum/button';
import {ButtonGroup} from '@vue-spectrum/buttongroup';
import {DialogContainer, useDialogContainer} from '../src';
import {MenuTrigger} from '@vue-spectrum/menu';
import {Heading} from '@vue-spectrum/text';
import {defineComponent, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof DialogContainer> = {
  title: 'DialogContainer',
  providerSwitcher: {status: 'notice'}
};

export default meta;

type Story = StoryObj<typeof meta>;
type StoryArgs = Record<string, unknown>;

type RenderOptions = {
  useMenu?: boolean
};

const DIALOG_BODY_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.';

const DIALOG_MENU_ITEMS = [
  {
    key: 'open-dialog',
    label: 'Open dialog...'
  }
];

const NESTED_DIALOG_MENU_ITEMS = [
  {
    key: 'doThis',
    label: 'Do this...'
  },
  {
    key: 'doThat',
    label: 'Do that...'
  }
];

const DialogButtons = defineComponent({
  name: 'DialogButtons',
  components: {Button, ButtonGroup},
  setup() {
    let dialogContainer = useDialogContainer();
    return {dialogContainer};
  },
  template: `
    <ButtonGroup>
      <Button variant="secondary" @click="dialogContainer.dismiss">Cancel</Button>
      <Button variant="cta" @click="dialogContainer.dismiss">Confirm</Button>
    </ButtonGroup>
  `
});

function renderDialogContainer(args: StoryArgs = {}, options: RenderOptions = {}) {
  let {useMenu = false} = options;
  return {
    components: {ActionButton, DialogButtons, DialogContainer, MenuTrigger, Heading},
    setup() {
      let isOpen = ref(false);
      let onDismiss = () => {
        isOpen.value = false;
      };
      let openDialog = () => {
        isOpen.value = true;
      };

      return {
        args,
        bodyText: DIALOG_BODY_TEXT,
        isOpen,
        menuItems: DIALOG_MENU_ITEMS,
        onDismiss,
        openDialog,
        useMenu
      };
    },
    template: `
      <div style="display: grid; gap: 12px; justify-items: start;">
        <MenuTrigger v-if="useMenu" :items="menuItems" @action="openDialog">
          <template #trigger>
            <ActionButton>Open menu</ActionButton>
          </template>
        </MenuTrigger>
        <ActionButton v-else @click="openDialog">Open dialog</ActionButton>

        <DialogContainer v-bind="args" :is-open="isOpen" @close="onDismiss">
          <template #heading><Heading>The Heading</Heading></template>
          <template #header><div>The Header</div></template>
          <template #divider><hr /></template>
          <div>{{bodyText}}</div>
          <template v-if="!args.isDismissable" #buttonGroup>
            <DialogButtons />
          </template>
        </DialogContainer>
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => renderDialogContainer(args)
};

export const InAMenu: Story = {
  render: (args) => renderDialogContainer(args, {useMenu: true})
};

export const TypeFullscreen: Story = {
  render: (args) => renderDialogContainer(args, {useMenu: true}),
  args: {
    type: 'fullscreen'
  }
};

export const TypeFullscreenTakeover: Story = {
  render: (args) => renderDialogContainer(args, {useMenu: true}),
  args: {
    type: 'fullscreenTakeover'
  }
};

export const IsDismissable: Story = {
  render: (args) => renderDialogContainer(args, {useMenu: true}),
  args: {
    isDismissable: true
  }
};

export const IsKeyboardDismissDisabled: Story = {
  render: (args) => renderDialogContainer(args, {useMenu: true}),
  args: {
    isKeyboardDismissDisabled: true
  }
};

export const NestedDialogContainers: Story = {
  render: () => ({
    components: {ActionButton, DialogContainer, MenuTrigger},
    setup() {
      let dialogKey = ref<'doThat' | 'doThis' | null>(null);

      let onAction = (key: number | string) => {
        dialogKey.value = key === 'doThat' ? 'doThat' : 'doThis';
      };
      let dismiss = () => {
        dialogKey.value = null;
      };
      let toggleDialog = () => {
        if (dialogKey.value === 'doThat') {
          dialogKey.value = 'doThis';
          return;
        }

        if (dialogKey.value === 'doThis') {
          dialogKey.value = 'doThat';
        }
      };

      return {
        dialogKey,
        dismiss,
        items: NESTED_DIALOG_MENU_ITEMS,
        onAction,
        toggleDialog
      };
    },
    template: `
      <div style="display: grid; gap: 12px; justify-items: start;">
        <MenuTrigger :items="items" @action="onAction">
          <template #trigger>
            <ActionButton aria-label="Actions">Open menu</ActionButton>
          </template>
        </MenuTrigger>
        <DialogContainer :is-open="dialogKey !== null" is-dismissable @close="dismiss">
          <template #heading><Heading>{{dialogKey === 'doThis' ? 'This' : 'That'}}</Heading></template>
          <template #divider><hr /></template>
          <ActionButton auto-focus @click="toggleDialog">
            {{dialogKey === 'doThis' ? 'Do that' : 'Do this'}}
          </ActionButton>
        </DialogContainer>
      </div>
    `
  })
};
