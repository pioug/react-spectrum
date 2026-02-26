import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {ProgressCircle} from '../src';

const grayedBoxStyle = {
  width: '100px',
  height: '100px',
  backgroundColor: 'rgba(0,0,0,0.4)',
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

function render(props: Record<string, unknown> = {}, wrapperStyle?: Record<string, string>) {
  return {
    components: {ProgressCircle},
    setup() {
      return {props, wrapperStyle};
    },
    template: wrapperStyle
      ? '<div :style="wrapperStyle"><ProgressCircle aria-label="Loading…" v-bind="props" /></div>'
      : '<ProgressCircle aria-label="Loading…" v-bind="props" />'
  };
}

const meta: Meta<typeof ProgressCircle> = {
  title: 'Progress/ProgressCircle',
  component: ProgressCircle,
  providerSwitcher: {status: 'positive'},
  args: {value: 32},
  argTypes: {
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100
      }
    }
  }
};

export default meta;
type ProgressCircleStory = StoryObj<typeof meta>;

export const Default: ProgressCircleStory = {
  render: (args) => render(args as Record<string, unknown>)
};

export const Value50: ProgressCircleStory = {
  render: () => render({value: 50})
};

export const Value100: ProgressCircleStory = {
  render: () => render({value: 100})
};

export const SizeS: ProgressCircleStory = {
  render: (args) => render({...(args as Record<string, unknown>), size: 'S'})
};

export const SizeL: ProgressCircleStory = {
  render: (args) => render({...(args as Record<string, unknown>), size: 'L'})
};

export const VariantOverBackground: ProgressCircleStory = {
  render: (args) => render({...(args as Record<string, unknown>), variant: 'overBackground'}, grayedBoxStyle)
};

export const StaticColorWhite: ProgressCircleStory = {
  render: (args) => render({...(args as Record<string, unknown>), staticColor: 'white'}, staticWhiteBackgroundStyle)
};

export const StaticColorBlack: ProgressCircleStory = {
  render: (args) => render({...(args as Record<string, unknown>), staticColor: 'black'}, staticBlackBackgroundStyle)
};

export const UsingRawValuesForMinValueMaxValueAndValue: ProgressCircleStory = {
  render: () => render({
    labelPosition: 'top',
    maxValue: 2147483648,
    value: 715827883
  })
};

export const IsIndeterminateTrue: ProgressCircleStory = {
  render: () => render({isIndeterminate: true})
};

export const IsIndeterminateTrueSizeS: ProgressCircleStory = {
  render: () => render({isIndeterminate: true, size: 'S'})
};

export const IsIndeterminateTrueSizeL: ProgressCircleStory = {
  render: () => render({isIndeterminate: true, size: 'L'})
};

export const IsIndeterminateTrueVariantOverBackground: ProgressCircleStory = {
  render: () => render({isIndeterminate: true, variant: 'overBackground'}, grayedBoxStyle)
};
