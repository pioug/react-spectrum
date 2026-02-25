import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {ProgressBar} from '../src';

type WrapperStyle = Record<string, string>;

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
  name: 'value: 50',
  render: (args) => renderProgressBar(args)
};

export const Value100: ProgressBarStory = {
  args: {value: 100},
  name: 'value: 100',
  render: (args) => renderProgressBar(args)
};

export const SizeS: ProgressBarStory = {
  args: {size: 'S'},
  name: 'size: S',
  render: (args) => renderProgressBar(args)
};

export const ShowValueLabelTrue: ProgressBarStory = {
  args: {showValueLabel: true},
  name: 'showValueLabel: true',
  render: (args) => renderProgressBar(args)
};

export const ShowValueLabelFalse: ProgressBarStory = {
  args: {showValueLabel: false},
  name: 'showValueLabel: false',
  render: (args) => renderProgressBar(args)
};

export const NoVisibleLabel: ProgressBarStory = {
  args: {
    label: '',
    ariaLabel: 'Loading…'
  },
  name: 'no visible label',
  render: (args) => renderProgressBar(args)
};

export const LabelPositionSide: ProgressBarStory = {
  args: {labelPosition: 'side'},
  name: 'labelPosition: side',
  render: (args) => renderProgressBar(args)
};

export const LabelPositionTop: ProgressBarStory = {
  args: {labelPosition: 'top'},
  name: 'labelPosition: top',
  render: (args) => renderProgressBar(args)
};

export const LongLabel: ProgressBarStory = {
  args: {
    label: 'Super long progress bar label. Sample label copy. Loading...'
  },
  name: 'long label',
  render: (args) => renderProgressBar(args)
};

export const LongLabelLabelPositionSide: ProgressBarStory = {
  args: {
    label: 'Super long progress bar label. Sample label copy. Loading...',
    labelPosition: 'side'
  },
  name: 'long label, labelPosition: side',
  render: (args) => renderProgressBar(args)
};

export const IsIndeterminateTrue: ProgressBarStory = {
  args: {isIndeterminate: true},
  name: 'isIndeterminate: true',
  render: (args) => renderProgressBar(args)
};

export const IsIndeterminateTrueSizeS: ProgressBarStory = {
  args: {
    isIndeterminate: true,
    size: 'S'
  },
  name: 'isIndeterminate: true, size: S',
  render: (args) => renderProgressBar(args)
};

export const ParentWidth100: ProgressBarStory = {
  name: 'parent width 100%',
  render: (args) => renderProgressBar(args, {width: '100%'})
};

export const ParentWidth100Px: ProgressBarStory = {
  name: 'parent width 100px',
  render: (args) => renderProgressBar(args, {width: '100px'})
};

export const Width300Px: ProgressBarStory = {
  args: {value: 100},
  name: 'width: 300px',
  render: (args) => renderProgressBar(args, {width: '300px'})
};

export const Width300PxIsIndeterminateTrue: ProgressBarStory = {
  args: {isIndeterminate: true},
  name: 'width: 300px, isIndeterminate: true',
  render: (args) => renderProgressBar(args, {width: '300px'})
};

export const Width300PxLabelPositionSide: ProgressBarStory = {
  args: {labelPosition: 'side'},
  name: 'width: 300px, labelPosition: side',
  render: (args) => renderProgressBar(args, {width: '300px'})
};

export const Width300PxLabelPositionSideIsIndeterminateTrue: ProgressBarStory = {
  args: {
    labelPosition: 'side',
    isIndeterminate: true
  },
  name: 'width: 300px, labelPosition: side, isIndeterminate: true',
  render: (args) => renderProgressBar(args, {width: '300px'})
};

export const Width30Px: ProgressBarStory = {
  name: 'width: 30px',
  render: (args) => renderProgressBar(args, {width: '30px'})
};

export const Width30PxSizeS: ProgressBarStory = {
  args: {size: 'S'},
  name: 'width: 30px, size: S',
  render: (args) => renderProgressBar(args, {width: '30px'})
};

export const Width30PxLabelPositionSideLongLabel: ProgressBarStory = {
  args: {
    labelPosition: 'side',
    label: 'Super long progress bar label. Sample label copy. Loading...'
  },
  name: 'width: 30px, labelPosition: side, long label',
  render: (args) => renderProgressBar(args, {width: '30px'})
};

export const Width30PxLabelPositionSideIsIndeterminateTrueLongLabelButtonOnRight: ProgressBarStory = {
  args: {
    labelPosition: 'side',
    isIndeterminate: true,
    label: 'Super long progress bar label. Sample label copy. Loading...'
  },
  name: 'width: 30px, labelPosition: side, isIndeterminate: true, long label, button on right',
  render: (args) => ({
    components: {ProgressBar},
    setup() {
      return {args};
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <div style="width: 30px;">
          <ProgressBar v-bind="args" />
        </div>
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
  name: 'Using raw values for minValue, maxValue, and value',
  render: (args) => renderProgressBar(args)
};
