import {Slider} from '../src';
import {action} from 'storybook/actions';
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
    template: '<Slider v-bind="args" @change="onChange($event)" @change-end="onChangeEnd($event)" />'
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
    maxValue: 1000,
    style: 'width: 300px;'
  })
};

export const ShowValueLabelFalse: Story = {
  render: (args) => render({...args, showValueLabel: false})
};

export const FormatOptionsPercent: Story = {
  render: (args) => render({
    ...args,
    minValue: 0,
    maxValue: 1,
    step: 0.01,
    formatOptions: {style: 'percent'}
  })
};

export const FormatOptionsCentimeter: Story = {
  render: (args) => render({
    ...args,
    maxValue: 1000,
    formatOptions: {style: 'unit', unit: 'centimeter'}
  })
};

export const CustomValueLabel: Story = {
  render: (args) => render({
    ...args,
    getValueLabel: (value: number) => `A ${value} B`
  })
};

export const CustomValueLabelWithLabelOverflow: Story = {
  render: (args) => render({
    ...args,
    label: 'This is a rather long label for this narrow slider element.',
    getValueLabel: (value: number) => `A ${value} B`
  })
};

export const MinMax: Story = {
  render: (args) => render({...args, minValue: 30, maxValue: 70})
};

export const Step: Story = {
  render: (args) => render({...args, minValue: 0, maxValue: 100, step: 5})
};

export const IsFilledTrue: Story = {
  render: (args) => render({...args, isFilled: true})
};

export const FillOffset: Story = {
  render: (args) => render({
    ...args,
    label: 'Exposure',
    isFilled: true,
    fillOffset: 0,
    minValue: -7,
    maxValue: 5,
    modelValue: 0
  })
};

export const TrackGradient: Story = {
  render: (args) => render({
    ...args,
    trackGradient: ['blue', 'red']
  })
};

export const TrackGradientWithFillOffset: Story = {
  render: (args) => render({
    ...args,
    minValue: 0,
    maxValue: 100,
    modelValue: 50,
    trackGradient: ['blue', 'red'],
    isFilled: true,
    fillOffset: 50
  })
};

export const _ContextualHelp: Story = {
  render: (args) => ({
    components: {Slider},
    setup() {
      return {
        args,
        onChange: action('change'),
        onChangeEnd: action('changeEnd')
      };
    },
    template: `
      <Slider v-bind="args" @change="onChange($event)" @change-end="onChangeEnd($event)">
        <template #contextual-help>
          <button type="button" aria-label="Help">?</button>
        </template>
      </Slider>
    `
  })
};
