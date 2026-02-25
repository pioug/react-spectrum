import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {RangeSlider} from '../src';

type StoryArgs = Record<string, unknown>;
type RenderOptions = {
  note?: string,
  width?: string
};

const meta: Meta<typeof RangeSlider> = {
  title: 'Slider/RangeSlider',
  component: RangeSlider,
  args: {
    isDisabled: false,
    label: 'Label',
    modelValue: {start: 25, end: 75}
  },
  argTypes: {
    disabled: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    max: {
      control: 'number'
    },
    min: {
      control: 'number'
    },
    modelValue: {
      table: {
        disable: true
      }
    },
    showValueLabel: {
      table: {
        disable: true
      }
    },
    showValue: {
      control: 'boolean'
    },
    step: {
      control: 'number'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderRangeSlider(args: StoryArgs = {}, options: RenderOptions = {}) {
  let {
    note,
    width
  } = options;
  return {
    components: {RangeSlider},
    setup() {
      return {
        args,
        note,
        width
      };
    },
    template: `
      <div :style="{display: 'grid', gap: '8px', width: width || undefined}">
        <div v-if="note">{{note}}</div>
        <RangeSlider v-bind="args" />
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
    max: 1000
  }, {width: '300px'})
};

export const ShowValueLabelFalse: Story = {
  render: (args) => renderRangeSlider({...args, showValue: false})
};

export const FormatOptionsPercent: Story = {
  render: (args) => renderRangeSlider({...args, min: 0, max: 1, step: 0.01})
};

export const FormatOptionsCentimeter: Story = {
  render: (args) => renderRangeSlider({...args, max: 1000})
};

export const CustomValueLabel: Story = {
  render: (args) => renderRangeSlider(args, {note: 'custom valueLabel parity scenario'})
};

export const CustomValueLabelWithLabelOverflow: Story = {
  render: (args) => renderRangeSlider({
    ...args,
    label: 'This is a rather long label for this narrow slider element.'
  }, {
    note: 'custom valueLabel with label overflow parity scenario',
    width: '300px'
  })
};

export const MinMax: Story = {
  render: (args) => renderRangeSlider({...args, min: 30, max: 70})
};

export const _ContextualHelp: Story = {
  render: (args) => renderRangeSlider(args, {note: 'contextual help parity scenario'})
};
