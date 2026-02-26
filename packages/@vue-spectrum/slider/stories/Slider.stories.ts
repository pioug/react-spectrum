import {Slider} from '../src';
import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const meta: Meta<typeof Slider> = {
  title: 'Slider',
  component: Slider,
  args: {
    label: 'Label',
    isDisabled: false,
    labelPosition: 'top'
  },
  argTypes: {
    labelPosition: {
      control: {
        type: 'radio',
        options: ['top', 'side']
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function render(args: StoryArgs = {}) {
  return {
    components: {Slider},
    setup() {
      return {
        args,
        onChange: action('change'),
        onChangeEnd: action('changeEnd')
      };
    },
    template: '<Slider v-bind="args" @change="onChange($event)" @blur="onChangeEnd($event)" />'
  };
}

function renderMultitouch(args: StoryArgs = {}) {
  return {
    components: {Slider},
    setup() {
      return {
        args
      };
    },
    template: `
      <div style="display: grid; gap: 24px;">
        <Slider v-bind="args" label="Label" />
        <Slider v-bind="args" label="Label" />
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => render({...args, label: '', 'aria-label': 'Label'})
};

export const Label: Story = {
  render: (args) => render(args)
};

export const Multitouch: Story = {
  render: (args) => renderMultitouch(args)
};

export const CustomWidth: Story = {
  render: (args) => render({...args, style: 'width: 300px;'})
};

export const CustomWidthSmall: Story = {
  render: (args) => render({...args, style: 'width: 30px;'})
};

export const LabelOverflow: Story = {
  render: (args) => render({
    ...args,
    label: 'This is a rather long label for this narrow slider element.',
    max: 1000,
    style: 'width: 300px;'
  })
};

export const ShowValueLabelFalse: Story = {
  render: (args) => render({...args, showValue: false})
};

export const FormatOptionsPercent: Story = {
  render: (args) => render({
    ...args,
    min: 0,
    max: 1,
    step: 0.01,
    description: 'formatOptions percent'
  })
};

export const FormatOptionsCentimeter: Story = {
  render: (args) => render({
    ...args,
    max: 1000,
    description: 'formatOptions centimeter'
  })
};

export const CustomValueLabel: Story = {
  render: (args) => render({
    ...args,
    description: 'custom valueLabel'
  })
};

export const CustomValueLabelWithLabelOverflow: Story = {
  render: (args) => render({
    ...args,
    label: 'This is a rather long label for this narrow slider element.',
    description: 'custom valueLabel with label overflow'
  })
};

export const MinMax: Story = {
  render: (args) => render({...args, min: 30, max: 70})
};

export const Step: Story = {
  render: (args) => render({...args, min: 0, max: 100, step: 5})
};

export const IsFilledTrue: Story = {
  render: (args) => render({...args, description: 'isFilled: true'})
};

export const FillOffset: Story = {
  render: (args) => render({
    ...args,
    label: 'Exposure',
    min: -7,
    max: 5,
    modelValue: 0,
    description: 'fillOffset'
  })
};

export const TrackGradient: Story = {
  render: (args) => render({
    ...args,
    description: 'trackGradient'
  })
};

export const TrackGradientWithFillOffset: Story = {
  render: (args) => render({
    ...args,
    min: 0,
    max: 100,
    modelValue: 50,
    description: 'trackGradient with fillOffset'
  })
};

export const _ContextualHelp: Story = {
  render: (args) => render({
    ...args,
    description: 'Contextual help: Segments identify who your visitors are.'
  })
};
