import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {ProgressCircle} from '../src';

function renderProgressCircle(args: Record<string, unknown>, wrapperStyle?: Record<string, string>) {
  return {
    components: {ProgressCircle},
    setup() {
      return {args, wrapperStyle};
    },
    template: wrapperStyle
      ? '<div :style="wrapperStyle"><ProgressCircle v-bind="args" /></div>'
      : '<ProgressCircle v-bind="args" />'
  };
}

const grayedBoxStyle = {
  width: '100px',
  height: '100px',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const staticWhiteBackgroundStyle = {
  ...grayedBoxStyle,
  backgroundColor: 'rgb(0, 119, 114)'
};

const staticBlackBackgroundStyle = {
  ...grayedBoxStyle,
  backgroundColor: 'rgb(206, 247, 243)'
};

const meta: Meta<typeof ProgressCircle> = {
  title: 'Progress/ProgressCircle',
  component: ProgressCircle,
  args: {
    value: 32,
    ariaLabel: 'Loading…'
  },
  argTypes: {
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100
      }
    },
    size: {
      control: 'radio',
      options: ['S', 'M', 'L']
    },
    isIndeterminate: {
      control: 'boolean'
    },
    staticColor: {
      control: 'radio',
      options: ['white', 'black']
    },
    variant: {
      control: 'radio',
      options: ['overBackground']
    }
  }
};

export default meta;

type ProgressCircleStory = StoryObj<typeof meta>;

export const Default: ProgressCircleStory = {
  render: (args) => renderProgressCircle(args)
};

export const Value50: ProgressCircleStory = {
  args: {value: 50},
  name: 'value: 50',
  render: (args) => renderProgressCircle(args)
};

export const Value100: ProgressCircleStory = {
  args: {value: 100},
  name: 'value: 100',
  render: (args) => renderProgressCircle(args)
};

export const SizeS: ProgressCircleStory = {
  args: {size: 'S'},
  name: 'size: S',
  render: (args) => renderProgressCircle(args)
};

export const SizeL: ProgressCircleStory = {
  args: {size: 'L'},
  name: 'size: L',
  render: (args) => renderProgressCircle(args)
};

export const VariantOverBackground: ProgressCircleStory = {
  args: {variant: 'overBackground'},
  name: 'variant: overBackground',
  render: (args) => renderProgressCircle(args, grayedBoxStyle)
};

export const StaticColorWhite: ProgressCircleStory = {
  args: {staticColor: 'white'},
  name: 'staticColor: white',
  render: (args) => renderProgressCircle(args, staticWhiteBackgroundStyle)
};

export const StaticColorBlack: ProgressCircleStory = {
  args: {staticColor: 'black'},
  name: 'staticColor: black',
  render: (args) => renderProgressCircle(args, staticBlackBackgroundStyle)
};

export const UsingRawValuesForMinValueMaxValueAndValue: ProgressCircleStory = {
  args: {
    maxValue: 2147483648,
    value: 715827883
  },
  name: 'Using raw values for minValue, maxValue, and value',
  render: (args) => renderProgressCircle(args)
};

export const IsIndeterminateTrue: ProgressCircleStory = {
  args: {isIndeterminate: true},
  name: 'isIndeterminate: true',
  render: (args) => renderProgressCircle(args)
};

export const IsIndeterminateTrueSizeS: ProgressCircleStory = {
  args: {
    isIndeterminate: true,
    size: 'S'
  },
  name: 'isIndeterminate: true, size: S',
  render: (args) => renderProgressCircle(args)
};

export const IsIndeterminateTrueSizeL: ProgressCircleStory = {
  args: {
    isIndeterminate: true,
    size: 'L'
  },
  name: 'isIndeterminate: true, size: L',
  render: (args) => renderProgressCircle(args)
};

export const IsIndeterminateTrueVariantOverBackground: ProgressCircleStory = {
  args: {
    isIndeterminate: true,
    variant: 'overBackground'
  },
  name: 'isIndeterminate: true, variant: overBackground',
  render: (args) => renderProgressCircle(args, grayedBoxStyle)
};
