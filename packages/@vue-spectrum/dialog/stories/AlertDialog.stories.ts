import {ActionButton} from '@vue-spectrum/button';
import {AlertDialog} from '../src';
import {action} from 'storybook/actions';
import {ref} from 'vue';
import {singleParagraph} from './Dialog.stories';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const meta: Meta<typeof AlertDialog> = {
  title: 'Dialog/Alert',
  component: AlertDialog,
  argTypes: {
    autoFocusButton: {
      control: 'text'
    },
    cancelLabel: {
      control: 'text'
    },
    dismissable: {
      control: 'boolean'
    },
    isDismissable: {
      control: 'boolean'
    },
    isHidden: {
      control: 'boolean'
    },
    isOpen: {
      control: 'boolean'
    },
    isPrimaryActionDisabled: {
      control: 'boolean'
    },
    isSecondaryActionDisabled: {
      control: 'boolean'
    },
    onCancel: {
      table: {
        disable: true
      }
    },
    onClose: {
      table: {
        disable: true
      }
    },
    onPrimaryAction: {
      table: {
        disable: true
      }
    },
    onSecondaryAction: {
      table: {
        disable: true
      }
    },
    open: {
      control: 'boolean'
    },
    primaryActionLabel: {
      control: 'text'
    },
    secondaryActionLabel: {
      control: 'text'
    },
    title: {
      control: 'text'
    },
    variant: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function baseAlertArgs(overrides: StoryArgs = {}): StoryArgs {
  return {
    isOpen: true,
    title: 'Error: Danger Will Robinson',
    primaryActionLabel: 'Accept',
    cancelLabel: 'Cancel',
    variant: 'error',
    ...overrides
  };
}

function renderAlert(args: StoryArgs) {
  return {
    components: {ActionButton, AlertDialog},
    setup() {
      let isOpen = ref(true);
      let openDialog = () => {
        isOpen.value = true;
      };
      let closeDialog = () => {
        isOpen.value = false;
      };

      return {
        args,
        bodyText: singleParagraph(),
        closeDialog,
        isOpen,
        onCancel: action('cancel'),
        onPrimaryAction: action('primary'),
        onSecondaryAction: action('secondary'),
        openDialog
      };
    },
    template: `
      <div style="display: flex; width: auto; margin: 100px 0;">
        <ActionButton @click="openDialog">Trigger</ActionButton>
        <AlertDialog
          v-bind="args"
          :is-open="isOpen"
          @cancel="onCancel"
          @close="closeDialog"
          @primary-action="onPrimaryAction"
          @secondary-action="onSecondaryAction">
          {{bodyText}}
        </AlertDialog>
      </div>
    `
  };
}

export const Destructive: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    variant: 'destructive',
    title: 'Warning Destructive'
  })
};

export const Confirmation: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    variant: 'confirmation',
    title: 'Confirmation Required'
  })
};

export const Information: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    variant: 'information',
    title: 'Informative Alert'
  })
};

export const Error: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    variant: 'error',
    title: 'Error: Danger Will Robinson'
  })
};

export const Warning: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    variant: 'warning',
    title: 'This is a warning'
  })
};

export const PrimaryDisabled: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    isPrimaryActionDisabled: true
  })
};

export const AutoFocusPrimary: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    autoFocusButton: 'primary',
    secondaryActionLabel: 'Secondary button'
  })
};

export const SecondaryDisabled: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    isSecondaryActionDisabled: true,
    secondaryActionLabel: 'Secondary button'
  })
};

export const AutoFocusSecondary: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    autoFocusButton: 'secondary',
    secondaryActionLabel: 'Secondary button'
  })
};

export const AutoFocusCancel: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    autoFocusButton: 'cancel',
    'data-testid': 'alert-dialog',
    secondaryActionLabel: 'Secondary button'
  })
};
