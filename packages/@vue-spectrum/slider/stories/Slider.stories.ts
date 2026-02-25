import {Slider} from '../src';
import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const meta: Meta<typeof Slider> = {
  title: 'Slider',
  component: Slider,
  args: {
    label: 'Label',
    isDisabled: false
  },
  argTypes: {
    description: {control: 'text'},
    disabled: {control: 'boolean'},
    id: {control: 'text'},
    isDisabled: {control: 'boolean'},
    label: {control: 'text'},
    max: {control: 'number'},
    min: {control: 'number'},
    modelValue: {control: 'number'},
    showValue: {control: 'boolean'},
    step: {control: 'number'}
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
  render: (args) => render(args),
  name: 'label'
};

export const Multitouch: Story = {
  render: (args) => renderMultitouch(args),
  name: 'multitouch'
};

export const CustomWidth: Story = {
  render: (args) => render({...args, style: 'width: 300px;'}),
  name: 'custom width'
};

export const CustomWidthSmall: Story = {
  render: (args) => render({...args, style: 'width: 30px;'}),
  name: 'custom width small'
};

export const LabelOverflow: Story = {
  render: (args) => render({
    ...args,
    label: 'This is a rather long label for this narrow slider element.',
    max: 1000,
    style: 'width: 300px;'
  }),
  name: 'label overflow'
};

export const ShowValueLabelFalse: Story = {
  render: (args) => render({...args, showValue: false}),
  name: 'showValueLabel: false'
};

export const FormatOptionsPercent: Story = {
  render: (args) => render({
    ...args,
    min: 0,
    max: 1,
    step: 0.01,
    description: 'formatOptions percent'
  }),
  name: 'formatOptions percent'
};

export const FormatOptionsCentimeter: Story = {
  render: (args) => render({
    ...args,
    max: 1000,
    description: 'formatOptions centimeter'
  }),
  name: 'formatOptions centimeter'
};

export const CustomValueLabel: Story = {
  render: (args) => render({
    ...args,
    description: 'custom valueLabel'
  }),
  name: 'custom valueLabel'
};

export const CustomValueLabelWithLabelOverflow: Story = {
  render: (args) => render({
    ...args,
    label: 'This is a rather long label for this narrow slider element.',
    description: 'custom valueLabel with label overflow'
  }),
  name: 'custom valueLabel with label overflow'
};

export const MinMax: Story = {
  render: (args) => render({...args, min: 30, max: 70}),
  name: 'min/max'
};

export const Step: Story = {
  render: (args) => render({...args, min: 0, max: 100, step: 5}),
  name: 'step'
};

export const IsFilledTrue: Story = {
  render: (args) => render({...args, description: 'isFilled: true'}),
  name: 'isFilled: true'
};

export const FillOffset: Story = {
  render: (args) => render({
    ...args,
    label: 'Exposure',
    min: -7,
    max: 5,
    modelValue: 0,
    description: 'fillOffset'
  }),
  name: 'fillOffset'
};

export const TrackGradient: Story = {
  render: (args) => render({
    ...args,
    description: 'trackGradient'
  }),
  name: 'trackGradient'
};

export const TrackGradientWithFillOffset: Story = {
  render: (args) => render({
    ...args,
    min: 0,
    max: 100,
    modelValue: 50,
    description: 'trackGradient with fillOffset'
  }),
  name: 'trackGradient with fillOffset'
};

export const _ContextualHelp: Story = {
  render: (args) => render({
    ...args,
    description: 'Contextual help: Segments identify who your visitors are.'
  }),
  name: 'contextual help'
};
