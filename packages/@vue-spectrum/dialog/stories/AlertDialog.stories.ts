import {AlertDialog} from '../src';
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
    variant: 'error',
    title: 'Error: Danger Will Robinson',
    primaryActionLabel: 'Accept',
    secondaryActionLabel: 'Secondary button',
    cancelLabel: 'Cancel',
    ...overrides
  };
}

function renderAlert(args: StoryArgs, note?: string) {
  return {
    components: {AlertDialog},
    setup() {
      return {args, note};
    },
    template: `
      <div style="display: grid; gap: 8px; width: 420px;">
        <div v-if="note">{{note}}</div>
        <AlertDialog v-bind="args">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus.
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
  }),
  name: 'destructive'
};

export const Confirmation: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    variant: 'confirmation',
    title: 'Confirmation Required'
  }),
  name: 'confirmation'
};

export const Information: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    variant: 'information',
    title: 'Informative Alert'
  }),
  name: 'information'
};

export const Error: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    variant: 'error',
    title: 'Error: Danger Will Robinson'
  }),
  name: 'error'
};

export const Warning: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    variant: 'warning',
    title: 'This is a warning'
  }),
  name: 'warning'
};

export const PrimaryDisabled: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    isPrimaryActionDisabled: true
  }),
  name: 'primary disabled'
};

export const AutoFocusPrimary: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    autoFocusButton: 'primary'
  }),
  name: 'autoFocus primary'
};

export const SecondaryDisabled: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    isSecondaryActionDisabled: true
  }),
  name: 'secondary disabled'
};

export const AutoFocusSecondary: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    autoFocusButton: 'secondary'
  }),
  name: 'autoFocus secondary'
};

export const AutoFocusCancel: Story = {
  render: (args) => renderAlert(args),
  args: baseAlertArgs({
    autoFocusButton: 'cancel',
    dataTestid: 'alert-dialog'
  }),
  name: 'autoFocus cancel'
};
