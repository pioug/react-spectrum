import {ActionButton} from '@vue-spectrum/button';
import {Button} from '@vue-spectrum/button';
import {ButtonGroup} from '@vue-spectrum/buttongroup';
import {DialogContainer, useDialogContainer} from '../src';
import {Menu} from '@vue-spectrum/menu';
import {defineComponent, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof DialogContainer> = {
  title: 'DialogContainer'
};

export default meta;

type Story = StoryObj<typeof meta>;
type StoryArgs = Record<string, unknown>;
type RenderOptions = {
  useMenu?: boolean
};

const DIALOG_BODY_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.';

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
    components: {ActionButton, DialogButtons, DialogContainer, Menu},
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
        onMenuAction: openDialog,
        openDialog,
        useMenu
      };
    },
    template: `
      <div style="display: grid; gap: 12px; justify-items: start;">
        <Menu v-if="useMenu" :items="menuItems" @action="onMenuAction" />
        <ActionButton v-else @click="openDialog">Open dialog</ActionButton>
        <DialogContainer v-bind="args" :is-open="isOpen" @close="onDismiss">
          <template #heading><h2>The Heading</h2></template>
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
    components: {ActionButton, DialogContainer, Menu},
    setup() {
      let outerOpen = ref(false);
      let innerOpen = ref(false);
      let dialogKey = ref<'doThat' | 'doThis' | null>(null);

      let onAction = (key: number | string) => {
        dialogKey.value = key === 'doThat' ? 'doThat' : 'doThis';
        outerOpen.value = true;
        innerOpen.value = false;
      };
      let closeOuter = () => {
        outerOpen.value = false;
        innerOpen.value = false;
        dialogKey.value = null;
      };
      let toggleInner = () => {
        innerOpen.value = !innerOpen.value;
      };

      return {
        closeOuter,
        dialogKey,
        innerOpen,
        items: NESTED_DIALOG_MENU_ITEMS,
        onAction,
        outerOpen,
        toggleInner
      };
    },
    template: `
      <div style="display: grid; gap: 12px; justify-items: start;">
        <Menu :items="items" @action="onAction" />
        <DialogContainer :is-open="outerOpen" isDismissable @close="closeOuter">
          <template #heading><h2>{{dialogKey === 'doThat' ? 'That' : 'This'}}</h2></template>
          <template #divider><hr /></template>
          <div style="display: grid; gap: 8px;">
            <ActionButton autoFocus @click="toggleInner">{{dialogKey === 'doThat' ? 'Do this' : 'Do that'}}</ActionButton>
            <DialogContainer :is-open="innerOpen" @close="innerOpen = false">
              <template #heading><h3>Nested dialog</h3></template>
              <div>Nested dialog content</div>
            </DialogContainer>
          </div>
        </DialogContainer>
      </div>
    `
  })
};
