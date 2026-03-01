import {TimeField} from '../src';
import {render} from './TimeField.stories';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const meta: Meta<typeof TimeField> = {
  title: 'Date and Time/TimeField/styling',
  component: TimeField
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
  render: (args) => renderWithMeta({...args, isQuiet: true})
};

export const LabelPositionSide: Story = {
  render: (args) => renderWithMeta({...args, labelPosition: 'side'}, 'labelPosition: side')
};

export const LabelAlignEnd: Story = {
  render: (args) => renderWithMeta({...args, labelPosition: 'top', labelAlign: 'end'}, 'labelAlign: end')
};

export const Required: Story = {
  render: (args) => renderWithMeta({...args, isRequired: true})
};

export const RequiredWithLabel: Story = {
  render: (args) => renderWithMeta({...args, isRequired: true, necessityIndicator: 'label'}, 'required with label')
};

export const Optional: Story = {
  render: (args) => renderWithMeta({...args, necessityIndicator: 'label'}, 'optional')
};

export const NoVisibleLabel: Story = {
  render: (args) => renderWithMeta({...args, 'aria-label': 'Time', label: ''})
};

export const QuietNoVisibleLabel: Story = {
  render: (args) => renderWithMeta({...args, isQuiet: true, 'aria-label': 'Time', label: ''})
};

export const CustomWidth: Story = {
  render: (args) => renderWithMeta({...args, style: 'width: min(100%, 300px);'}, 'custom width')
};

export const QuietCustomWidth: Story = {
  render: (args) => renderWithMeta({...args, isQuiet: true, style: 'width: min(100%, 300px);'}, 'quiet custom width')
};

export const CustomWidthNoVisibleLabel: Story = {
  render: (args) => renderWithMeta({...args, style: 'width: min(100%, 300px);', 'aria-label': 'Time', label: ''})
};

export const CustomWidthLabelPositionSide: Story = {
  render: (args) => renderWithMeta({...args, style: 'width: min(100%, 300px);', labelPosition: 'side'}, 'custom width, labelPosition=side')
};

export const Description: Story = {
  render: (args) => renderWithMeta({...args, description: 'Help text'})
};

export const ErrorMessage: Story = {
  render: (args) => renderWithMeta({...args, validationState: 'invalid', description: 'Time must be between 9 AM and 5 PM'})
};

export const _ContextualHelp: Story = {
  render: (args) => renderWithMeta({...args, description: 'Contextual help: Segments identify who your visitors are.'})
};
