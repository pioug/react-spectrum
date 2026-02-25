import {TimeField} from '../src';
import {render} from './TimeField.stories';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const meta: Meta<typeof TimeField> = {
  title: 'Date and Time/TimeField/styling',
  component: TimeField,
  args: {
    label: 'Time',
    step: 60
  },
  argTypes: {
    autoFocus: {control: 'boolean'},
    description: {control: 'text'},
    disabled: {control: 'boolean'},
    id: {control: 'text'},
    invalid: {control: 'boolean'},
    isDisabled: {control: 'boolean'},
    isInvalid: {control: 'boolean'},
    isQuiet: {control: 'boolean'},
    isReadOnly: {control: 'boolean'},
    isRequired: {control: 'boolean'},
    label: {control: 'text'},
    max: {control: 'text'},
    min: {control: 'text'},
    modelValue: {control: 'text'},
    placeholder: {control: 'text'},
    readOnly: {control: 'boolean'},
    required: {control: 'boolean'},
    step: {control: 'number'},
    validationState: {
      control: 'select',
      options: ['invalid', 'valid']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderWithMeta(args: StoryArgs, fallbackDescription?: string) {
  let nextArgs = {
    ...args
  };
  if (fallbackDescription && typeof nextArgs.description !== 'string') {
    nextArgs.description = fallbackDescription;
  }
  return render(nextArgs);
}

export const IsQuiet: Story = {
  render: (args) => renderWithMeta({...args, isQuiet: true}),
  name: 'isQuiet'
};

export const LabelPositionSide: Story = {
  render: (args) => renderWithMeta({...args, labelPosition: 'side'}, 'labelPosition: side'),
  name: 'labelPosition: side'
};

export const LabelAlignEnd: Story = {
  render: (args) => renderWithMeta({...args, labelPosition: 'top', labelAlign: 'end'}, 'labelAlign: end'),
  name: 'labelAlign: end'
};

export const Required: Story = {
  render: (args) => renderWithMeta({...args, isRequired: true}),
  name: 'required'
};

export const RequiredWithLabel: Story = {
  render: (args) => renderWithMeta({...args, isRequired: true, necessityIndicator: 'label'}, 'required with label'),
  name: 'required with label'
};

export const Optional: Story = {
  render: (args) => renderWithMeta({...args, necessityIndicator: 'label'}, 'optional'),
  name: 'optional'
};

export const NoVisibleLabel: Story = {
  render: (args) => renderWithMeta({...args, 'aria-label': 'Time', label: ''}),
  name: 'no visible label'
};

export const QuietNoVisibleLabel: Story = {
  render: (args) => renderWithMeta({...args, isQuiet: true, 'aria-label': 'Time', label: ''}),
  name: 'quiet no visible label'
};

export const CustomWidth: Story = {
  render: (args) => renderWithMeta({...args, style: 'width: min(100%, 300px);'}, 'custom width'),
  name: 'custom width'
};

export const QuietCustomWidth: Story = {
  render: (args) => renderWithMeta({...args, isQuiet: true, style: 'width: min(100%, 300px);'}, 'quiet custom width'),
  name: 'quiet custom width'
};

export const CustomWidthNoVisibleLabel: Story = {
  render: (args) => renderWithMeta({...args, style: 'width: min(100%, 300px);', 'aria-label': 'Time', label: ''}),
  name: 'custom width no visible label'
};

export const CustomWidthLabelPositionSide: Story = {
  render: (args) => renderWithMeta({...args, style: 'width: min(100%, 300px);', labelPosition: 'side'}, 'custom width, labelPosition=side'),
  name: 'custom width, labelPosition=side'
};

export const Description: Story = {
  render: (args) => renderWithMeta({...args, description: 'Help text'}),
  name: 'description'
};

export const ErrorMessage: Story = {
  render: (args) => renderWithMeta({...args, validationState: 'invalid', description: 'Time must be between 9 AM and 5 PM'}),
  name: 'errorMessage'
};

export const _ContextualHelp: Story = {
  render: (args) => renderWithMeta({...args, description: 'Contextual help: Segments identify who your visitors are.'}),
  name: 'contextual help'
};
