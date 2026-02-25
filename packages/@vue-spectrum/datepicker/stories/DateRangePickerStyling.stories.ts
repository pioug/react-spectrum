import {DateRangePicker} from '../src';
import {render} from './DateRangePicker.stories';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const meta: Meta<typeof DateRangePicker> = {
  title: 'Date and Time/DateRangePicker/styling',
  component: DateRangePicker,
  args: {
    label: 'Date range'
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
    modelValue: {
      table: {
        disable: true
      }
    },
    placeholder: {control: 'text'},
    readOnly: {control: 'boolean'},
    required: {control: 'boolean'},
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
  render: (args) => renderWithMeta({...args, 'aria-label': 'Date range', label: ''}),
  name: 'no visible label'
};

export const QuietNoVisibleLabel: Story = {
  render: (args) => renderWithMeta({...args, isQuiet: true, 'aria-label': 'Date range', label: ''}),
  name: 'quiet no visible label'
};

export const CustomWidth: Story = {
  render: (args) => renderWithMeta({...args, style: 'width: min(100%, 460px);'}, 'custom width'),
  name: 'custom width'
};

export const QuietCustomWidth: Story = {
  render: (args) => renderWithMeta({...args, isQuiet: true, style: 'width: min(100%, 460px);'}, 'quiet custom width'),
  name: 'quiet custom width'
};

export const CustomWidthNoVisibleLabel: Story = {
  render: (args) => renderWithMeta({...args, style: 'width: min(100%, 460px);', label: '', 'aria-label': 'Date range'}),
  name: 'custom width no visible label'
};

export const CustomWidthLabelPositionSide: Story = {
  render: (args) => renderWithMeta({...args, style: 'width: min(100%, 460px);', labelPosition: 'side'}, 'custom width, labelPosition=side'),
  name: 'custom width, labelPosition=side'
};

export const Description: Story = {
  render: (args) => renderWithMeta({...args, description: 'Help text'}),
  name: 'description'
};

export const ErrorMessage: Story = {
  render: (args) => renderWithMeta({...args, validationState: 'invalid', description: 'Dates must be after today'}),
  name: 'errorMessage'
};

export const InvalidWithTime: Story = {
  render: (args) => renderWithMeta({
    ...args,
    validationState: 'invalid',
    modelValue: {
      start: '2020-02-03T09:00:00-05:00',
      end: '2020-02-12T09:00:00-08:00'
    }
  }, 'invalid with time'),
  name: 'invalid with time'
};

export const _ContextualHelp: Story = {
  render: (args) => renderWithMeta({...args, description: 'Contextual help: Segments identify who your visitors are.'}),
  name: 'contextual help'
};

export const InScrollableContainer: Story = {
  render: (args) => ({
    components: {DateRangePicker},
    setup() {
      return {args};
    },
    template: `
      <div style="height: 200vh;">
        <DateRangePicker v-bind="args" label="Date range" style="max-width: calc(100vw - 40px);" />
      </div>
    `
  }),
  name: 'in scrollable container'
};

export const ShouldFlipFalse: Story = {
  render: (args) => renderWithMeta({...args, shouldFlip: false}, 'shouldFlip: false'),
  name: 'shouldFlip: false'
};
