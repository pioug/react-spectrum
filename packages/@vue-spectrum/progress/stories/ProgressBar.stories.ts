import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {ProgressBar} from '../src';

type WrapperStyle = Record<string, string>;

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

function renderProgressBar(args: Record<string, unknown>, wrapperStyle?: WrapperStyle) {
  return {
    components: {ProgressBar},
    setup() {
      return {args, wrapperStyle};
    },
    template: wrapperStyle
      ? '<div :style="wrapperStyle"><ProgressBar v-bind="args" /></div>'
      : '<ProgressBar v-bind="args" />'
  };
}

const meta: Meta<typeof ProgressBar> = {
  title: 'Progress/ProgressBar',
  component: ProgressBar,
  args: {
    label: 'Loading…',
    value: 32
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
      options: ['L', 'S']
    },
    labelPosition: {
      control: 'radio',
      options: ['side', 'top']
    },
    isIndeterminate: {
      control: 'boolean'
    },
    showValueLabel: {
      control: 'boolean'
    },
    valueLabel: {
      control: 'text'
    },
    formatOptions: {
      table: {
        disable: true
      }
    }
  }
};

export default meta;

type ProgressBarStory = StoryObj<typeof meta>;

export const Default: ProgressBarStory = {
  render: (args) => renderProgressBar(args)
};

export const Value50: ProgressBarStory = {
  args: {value: 50},
  name: 'Value 50',
  render: (args) => renderProgressBar(args)
};

export const Value100: ProgressBarStory = {
  args: {value: 100},
  name: 'Value 100',
  render: (args) => renderProgressBar(args)
};

export const SizeS: ProgressBarStory = {
  args: {size: 'S'},
  name: 'Size S',
  render: (args) => renderProgressBar(args)
};

export const ShowValueLabelTrue: ProgressBarStory = {
  args: {showValueLabel: true},
  name: 'Show Value Label True',
  render: (args) => renderProgressBar(args)
};

export const ShowValueLabelFalse: ProgressBarStory = {
  args: {showValueLabel: false},
  name: 'Show Value Label False',
  render: (args) => renderProgressBar(args)
};

export const ValueLabel1Of4: ProgressBarStory = {
  args: {
    value: 25,
    valueLabel: '1 of 4'
  },
  name: 'Value Label 1 Of 4',
  render: (args) => renderProgressBar(args)
};

export const UsingNumberFormatOptionsWithCurrencyStyle: ProgressBarStory = {
  args: {
    showValueLabel: true,
    formatOptions
  },
  name: 'Using Number Format Options With Currency Style',
  render: (args) => renderProgressBar(args)
};

export const NoVisibleLabel: ProgressBarStory = {
  args: {
    label: '',
    ariaLabel: 'Loading…'
  },
  name: 'No Visible Label',
  render: (args) => renderProgressBar(args)
};

export const LabelPositionSide: ProgressBarStory = {
  args: {labelPosition: 'side'},
  name: 'Label Position Side',
  render: (args) => renderProgressBar(args)
};

export const LabelPositionTop: ProgressBarStory = {
  args: {labelPosition: 'top'},
  name: 'Label Position Top',
  render: (args) => renderProgressBar(args)
};

export const LongLabel: ProgressBarStory = {
  args: {
    label: 'Super long progress bar label. Sample label copy. Loading...'
  },
  name: 'Long Label',
  render: (args) => renderProgressBar(args)
};

export const LongLabelLabelPositionSide: ProgressBarStory = {
  args: {
    label: 'Super long progress bar label. Sample label copy. Loading...',
    labelPosition: 'side'
  },
  name: 'Long Label Label Position Side',
  render: (args) => renderProgressBar(args)
};

export const IsIndeterminateTrue: ProgressBarStory = {
  args: {isIndeterminate: true},
  name: 'Is Indeterminate True',
  render: (args) => renderProgressBar(args)
};

export const IsIndeterminateTrueSizeS: ProgressBarStory = {
  args: {
    isIndeterminate: true,
    size: 'S'
  },
  name: 'Is Indeterminate True Size S',
  render: (args) => renderProgressBar(args)
};

export const VariantOverBackground: ProgressBarStory = {
  args: {
    variant: 'overBackground'
  },
  name: 'Variant Over Background',
  render: (args) => renderProgressBar(args, grayedBoxStyle)
};

export const StaticColorWhite: ProgressBarStory = {
  args: {
    staticColor: 'white'
  },
  name: 'Static Color White',
  render: (args) => renderProgressBar(args, grayedBoxStyle)
};

export const StaticColorBlack: ProgressBarStory = {
  args: {
    staticColor: 'black'
  },
  name: 'Static Color Black',
  render: (args) => renderProgressBar(args, lightBoxStyle)
};

export const ParentWidth100: ProgressBarStory = {
  name: 'Parent Width 100',
  render: (args) => renderProgressBar(args, {width: '100%'})
};

export const ParentWidth100Px: ProgressBarStory = {
  name: 'Parent Width 100 Px',
  render: (args) => renderProgressBar(args, {width: '100px'})
};

export const Width300Px: ProgressBarStory = {
  args: {
    width: '300px',
    value: 100
  },
  name: 'Width 300 Px',
  render: (args) => renderProgressBar(args)
};

export const Width300PxIsIndeterminateTrue: ProgressBarStory = {
  args: {
    width: '300px',
    isIndeterminate: true
  },
  name: 'Width 300 Px Is Indeterminate True',
  render: (args) => renderProgressBar(args)
};

export const Width300PxLabelPositionSide: ProgressBarStory = {
  args: {
    width: '300px',
    labelPosition: 'side'
  },
  name: 'Width 300 Px Label Position Side',
  render: (args) => renderProgressBar(args)
};

export const Width300PxLabelPositionSideIsIndeterminateTrue: ProgressBarStory = {
  args: {
    width: '300px',
    labelPosition: 'side',
    isIndeterminate: true
  },
  name: 'Width 300 Px Label Position Side Is Indeterminate True',
  render: (args) => renderProgressBar(args)
};

export const Width30Px: ProgressBarStory = {
  args: {
    width: '30px'
  },
  name: 'Width 30 Px',
  render: (args) => renderProgressBar(args)
};

export const Width30PxSizeS: ProgressBarStory = {
  args: {
    width: '30px',
    size: 'S'
  },
  name: 'Width 30 Px Size S',
  render: (args) => renderProgressBar(args)
};

export const Width30PxLabelPositionSideLongLabel: ProgressBarStory = {
  args: {
    width: '30px',
    labelPosition: 'side',
    label: 'Super long progress bar label. Sample label copy. Loading...'
  },
  name: 'Width 30 Px Label Position Side Long Label',
  render: (args) => renderProgressBar(args)
};

export const Width30PxLabelPositionSideIsIndeterminateTrueLongLabelButtonOnRight: ProgressBarStory = {
  args: {
    width: '30px',
    labelPosition: 'side',
    isIndeterminate: true,
    label: 'Super long progress bar label. Sample label copy. Loading...'
  },
  name: 'Width 30 Px Label Position Side Is Indeterminate True Long Label Button On Right',
  render: (args) => ({
    components: {ProgressBar},
    setup() {
      return {args};
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <ProgressBar v-bind="args" />
        <button type="button">Confirm</button>
      </div>
    `
  })
};

export const UsingRawValuesForMinValueMaxValueAndValue: ProgressBarStory = {
  args: {
    showValueLabel: true,
    labelPosition: 'top',
    maxValue: 2147483648,
    value: 715827883
  },
  name: 'Using Raw Values For Min Value Max Value And Value',
  render: (args) => renderProgressBar(args)
};

export const UsingRawValuesWithNumberFormatter: ProgressBarStory = {
  args: {
    showValueLabel: true,
    labelPosition: 'top',
    maxValue: 2147483648,
    value: 715827883,
    formatOptions
  },
  name: 'Using Raw Values With Number Formatter',
  render: (args) => renderProgressBar(args)
};
