import {RangeSlider} from '../src';
import {action} from 'storybook/actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;
type RenderOptions = {
  width?: string
};

const meta: Meta<typeof RangeSlider> = {
  title: 'Slider/RangeSlider',
  component: RangeSlider,
  args: {
    isDisabled: false,
    label: 'Label',
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

function renderRangeSlider(args: StoryArgs = {}, options: RenderOptions = {}) {
  let {width} = options;

  return {
    components: {RangeSlider},
    setup() {
      return {
        args,
        onChange: action('change'),
        onChangeEnd: action('changeEnd'),
        width
      };
    },
    template: `
      <div :style="{display: 'grid', gap: '8px', width: width || undefined}">
        <RangeSlider v-bind="args" @change="onChange($event)" @change-end="onChangeEnd($event)" />
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => renderRangeSlider({...args, label: undefined, 'aria-label': 'Label'})
};

export const Label: Story = {
  render: (args) => renderRangeSlider(args)
};

export const CustomWidth: Story = {
  render: (args) => renderRangeSlider(args, {width: '300px'})
};

export const LabelOverflow: Story = {
  render: (args) => renderRangeSlider({
    ...args,
    label: 'This is a rather long label for this narrow slider element.',
    maxValue: 1000
  }, {width: '300px'})
};

export const ShowValueLabelFalse: Story = {
  render: (args) => renderRangeSlider({...args, showValueLabel: false})
};

export const FormatOptionsPercent: Story = {
  render: (args) => renderRangeSlider({
    ...args,
    minValue: 0,
    maxValue: 1,
    step: 0.01,
    formatOptions: {style: 'percent'}
  })
};

export const FormatOptionsCentimeter: Story = {
  render: (args) => renderRangeSlider({
    ...args,
    maxValue: 1000,
    formatOptions: {style: 'unit', unit: 'centimeter'}
  })
};

export const CustomValueLabel: Story = {
  render: (args) => renderRangeSlider({
    ...args,
    getValueLabel: (value: {start: number, end: number}) => `${value.start} <-> ${value.end}`
  })
};

export const CustomValueLabelWithLabelOverflow: Story = {
  render: (args) => renderRangeSlider({
    ...args,
    label: 'This is a rather long label for this narrow slider element.',
    getValueLabel: (value: {start: number, end: number}) => `${value.start} <-> ${value.end}`
  }, {width: '300px'})
};

export const MinMax: Story = {
  render: (args) => renderRangeSlider({...args, minValue: 30, maxValue: 70})
};

export const _ContextualHelp: Story = {
  render: (args) => ({
    components: {RangeSlider},
    setup() {
      return {
        args,
        onChange: action('change'),
        onChangeEnd: action('changeEnd')
      };
    },
    template: `
      <RangeSlider v-bind="args" @change="onChange($event)" @change-end="onChangeEnd($event)">
        <template #contextual-help>
          <button type="button" aria-label="Help">?</button>
        </template>
      </RangeSlider>
    `
  })
};
