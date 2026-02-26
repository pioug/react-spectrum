import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {ProgressBar} from '../src';

type WrapperStyle = Record<string, string>;
type WrapperTag = 'div' | 'span';

const formatOptions: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'JPY'
};

const grayedBoxStyle: WrapperStyle = {
  width: '250px',
  height: '60px',
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const lightBoxStyle: WrapperStyle = {
  ...grayedBoxStyle,
  backgroundColor: 'rgb(206, 247, 243)'
};

function render(props: Record<string, unknown> = {}, wrapperStyle?: WrapperStyle, wrapperTag: WrapperTag = 'div') {
  let template = '<ProgressBar label="Loading…" v-bind="props" />';
  if (wrapperStyle && wrapperTag === 'span') {
    template = '<span :style="wrapperStyle"><ProgressBar label="Loading…" v-bind="props" /></span>';
  } else if (wrapperStyle) {
    template = '<div :style="wrapperStyle"><ProgressBar label="Loading…" v-bind="props" /></div>';
  }

  return {
    components: {ProgressBar},
    setup() {
      return {props, wrapperStyle};
    },
    template
  };
}

const meta: Meta<typeof ProgressBar> = {
  title: 'Progress/ProgressBar',
  component: ProgressBar,
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
type ProgressBarStory = StoryObj<typeof meta>;

export const Default: ProgressBarStory = {
  render: (args) => render(args as Record<string, unknown>)
};

export const Value50: ProgressBarStory = {
  render: () => render({value: 50})
};

export const Value100: ProgressBarStory = {
  render: () => render({value: 100})
};

export const SizeS: ProgressBarStory = {
  render: (args) => render({size: 'S', ...(args as Record<string, unknown>)})
};

export const ShowValueLabelTrue: ProgressBarStory = {
  render: (args) => render({showValueLabel: true, ...(args as Record<string, unknown>)})
};

export const ShowValueLabelFalse: ProgressBarStory = {
  render: (args) => render({showValueLabel: false, ...(args as Record<string, unknown>)})
};

export const ValueLabel1Of4: ProgressBarStory = {
  render: () => render({value: 25, valueLabel: '1 of 4'})
};

export const UsingNumberFormatOptionsWithCurrencyStyle: ProgressBarStory = {
  render: (args) => render({
    ...(args as Record<string, unknown>),
    showValueLabel: true,
    formatOptions
  })
};

export const NoVisibleLabel: ProgressBarStory = {
  render: (args) => render({
    label: null,
    'aria-label': 'Loading…',
    ...(args as Record<string, unknown>)
  })
};

export const LabelPositionSide: ProgressBarStory = {
  render: (args) => render({labelPosition: 'side', ...(args as Record<string, unknown>)})
};

export const LabelPositionTop: ProgressBarStory = {
  render: (args) => render({labelPosition: 'top', ...(args as Record<string, unknown>)})
};

export const LongLabel: ProgressBarStory = {
  render: (args) => render({
    label: 'Super long progress bar label. Sample label copy. Loading...',
    ...(args as Record<string, unknown>)
  })
};

export const LongLabelLabelPositionSide: ProgressBarStory = {
  render: (args) => render({
    labelPosition: 'side',
    label: 'Super long progress bar label. Sample label copy. Loading...',
    ...(args as Record<string, unknown>)
  })
};

export const IsIndeterminateTrue: ProgressBarStory = {
  render: (args) => render({isIndeterminate: true, ...(args as Record<string, unknown>)})
};

export const IsIndeterminateTrueSizeS: ProgressBarStory = {
  render: () => render({isIndeterminate: true, size: 'S'})
};

export const VariantOverBackground: ProgressBarStory = {
  render: (args) => render({variant: 'overBackground', ...(args as Record<string, unknown>)}, grayedBoxStyle)
};

export const StaticColorWhite: ProgressBarStory = {
  render: (args) => render({staticColor: 'white', ...(args as Record<string, unknown>)}, grayedBoxStyle)
};

export const StaticColorBlack: ProgressBarStory = {
  render: (args) => render({staticColor: 'black', ...(args as Record<string, unknown>)}, lightBoxStyle)
};

export const ParentWidth100: ProgressBarStory = {
  render: () => render({}, {width: '100%'}, 'span')
};

export const ParentWidth100Px: ProgressBarStory = {
  render: () => render({}, {width: '100px'}, 'span')
};

export const Width300Px: ProgressBarStory = {
  render: () => render({width: '300px', value: 100})
};

export const Width300PxIsIndeterminateTrue: ProgressBarStory = {
  render: () => render({width: '300px', isIndeterminate: true})
};

export const Width300PxLabelPositionSide: ProgressBarStory = {
  render: () => render({width: '300px', labelPosition: 'side'})
};

export const Width300PxLabelPositionSideIsIndeterminateTrue: ProgressBarStory = {
  render: () => render({width: '300px', labelPosition: 'side', isIndeterminate: true})
};

export const Width30Px: ProgressBarStory = {
  render: () => render({width: '30px'})
};

export const Width30PxSizeS: ProgressBarStory = {
  render: () => render({width: '30px', size: 'S'})
};

export const Width30PxLabelPositionSideLongLabel: ProgressBarStory = {
  render: () => render({
    width: '30px',
    labelPosition: 'side',
    label: 'Super long progress bar label. Sample label copy. Loading...'
  })
};

export const Width30PxLabelPositionSideIsIndeterminateTrueLongLabelButtonOnRight: ProgressBarStory = {
  render: () => ({
    components: {ProgressBar},
    template: `
      <ProgressBar
        label="Super long progress bar label. Sample label copy. Loading..."
        width="30px"
        labelPosition="side"
        :isIndeterminate="true" />
      <button>Confirm</button>
    `
  })
};

export const UsingRawValuesForMinValueMaxValueAndValue: ProgressBarStory = {
  render: () => render({
    showValueLabel: true,
    labelPosition: 'top',
    maxValue: 2147483648,
    value: 715827883
  })
};

export const UsingRawValuesWithNumberFormatter: ProgressBarStory = {
  render: () => render({
    showValueLabel: true,
    labelPosition: 'top',
    maxValue: 2147483648,
    value: 715827883,
    formatOptions
  })
};
