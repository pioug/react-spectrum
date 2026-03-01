import {DateRangePicker} from '../src';
import {render} from './DateRangePicker.stories';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const meta: Meta<typeof DateRangePicker> = {
  title: 'Date and Time/DateRangePicker/styling',
  component: DateRangePicker
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
  render: (args) => renderWithMeta({...args, 'aria-label': 'Date range', label: ''})
};

export const QuietNoVisibleLabel: Story = {
  render: (args) => renderWithMeta({...args, isQuiet: true, 'aria-label': 'Date range', label: ''})
};

export const CustomWidth: Story = {
  render: (args) => renderWithMeta({...args, style: 'width: min(100%, 460px);'}, 'custom width')
};

export const QuietCustomWidth: Story = {
  render: (args) => renderWithMeta({...args, isQuiet: true, style: 'width: min(100%, 460px);'}, 'quiet custom width')
};

export const CustomWidthNoVisibleLabel: Story = {
  render: (args) => renderWithMeta({...args, style: 'width: min(100%, 460px);', label: '', 'aria-label': 'Date range'})
};

export const CustomWidthLabelPositionSide: Story = {
  render: (args) => renderWithMeta({...args, style: 'width: min(100%, 460px);', labelPosition: 'side'}, 'custom width, labelPosition=side')
};

export const Description: Story = {
  render: (args) => renderWithMeta({...args, description: 'Help text'})
};

export const ErrorMessage: Story = {
  render: (args) => renderWithMeta({...args, validationState: 'invalid', description: 'Dates must be after today'})
};

export const InvalidWithTime: Story = {
  render: (args) => renderWithMeta({
    ...args,
    validationState: 'invalid',
    modelValue: {
      start: '2020-02-03T09:00:00-05:00',
      end: '2020-02-12T09:00:00-08:00'
    }
  }, 'invalid with time')
};

export const _ContextualHelp: Story = {
  render: (args) => renderWithMeta({...args, description: 'Contextual help: Segments identify who your visitors are.'})
};

export const InScrollableContainer: Story = {
  render: (args) => {
    let baseStory = renderWithMeta({...args, granularity: 'second'});
    return {
      ...baseStory,
      template: `
        <div style="height: 200vh;">
          ${baseStory.template}
        </div>
      `
    };
  }
};

export const ShouldFlipFalse: Story = {
  render: (args) => renderWithMeta({...args, shouldFlip: false}, 'shouldFlip: false')
};
