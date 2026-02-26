import {TimeField} from '../src';
import {action} from '@storybook/addon-actions';
import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const CONTROLLED_VALUE = '02:35';

const meta: Meta<typeof TimeField> = {
  title: 'Date and Time/TimeField',
  component: TimeField,
  excludeStories: [
    'render'
  ]
};

export default meta;

type Story = StoryObj<typeof meta>;

export function render(args: StoryArgs = {}) {
  return {
    components: {TimeField},
    setup() {
      return {
        args,
        onChange: action('change')
      };
    },
    template: '<TimeField label="Time" v-bind="args" style="max-width: calc(100vw - 40px);" @change="onChange($event)" />'
  };
}

function renderControlledValue(args: StoryArgs) {
  return {
    components: {TimeField},
    setup() {
      let value = ref(CONTROLLED_VALUE);
      return {
        args,
        onChange: action('change'),
        value
      };
    },
    template: '<TimeField v-bind="args" :model-value="value" @update:model-value="value = $event" @change="onChange($event)" />'
  };
}

function renderEvents(args: StoryArgs) {
  return {
    components: {TimeField},
    setup() {
      let onBlur = action('onBlur');
      let onFocus = action('onFocus');
      let onFocusChange = action('onFocusChange');
      let onKeyDown = action('onKeyDown');
      let onKeyUp = action('onKeyUp');
      let onOpenChange = action('onOpenChange');

      return {
        args,
        onBlur,
        onFocus,
        onFocusChange,
        onKeyDown,
        onKeyUp,
        onOpenChange
      };
    },
    template: `
      <div @keydown="onKeyDown($event)" @keyup="onKeyUp($event)">
        <TimeField
          v-bind="args"
          @focus="onFocus($event); onFocusChange(true)"
          @blur="onBlur($event); onFocusChange(false)"
          @change="onOpenChange(false)" />
      </div>
    `
  };
}

export const Default: Story = {
  render: () => render()
};

export const DefaultValue: Story = {
  render: (args) => render({
    ...args,
    modelValue: '20:24'
  })
};

export const ControlledValue: Story = {
  render: (args) => renderControlledValue(args)
};

export const GranularitySecond: Story = {
  render: (args) => render({
    ...args,
    step: 1
  })
};

export const HourCycle12: Story = {
  render: (args) => render({
    ...args,
    modelValue: '00:00',
    description: 'hourCycle: 12'
  })
};

export const HourCycle24: Story = {
  render: (args) => render({
    ...args,
    modelValue: '00:00',
    description: 'hourCycle: 24'
  })
};

export const HourCycle12GranularityHour: Story = {
  render: (args) => render({
    ...args,
    step: 3600,
    description: 'hourCycle: 12, granularity: hour'
  })
};

export const HourCycle24GranularityHour: Story = {
  render: (args) => render({
    ...args,
    step: 3600,
    description: 'hourCycle: 24, granularity: hour'
  })
};

export const Zoned: Story = {
  render: (args) => render({
    ...args,
    modelValue: '00:45',
    description: 'zoned'
  })
};

export const ZonedPlaceholder: Story = {
  render: (args) => render({
    ...args,
    placeholder: '00:45 America/Los_Angeles'
  })
};

export const HideTimeZone: Story = {
  render: (args) => render({
    ...args,
    modelValue: '00:45',
    description: 'hideTimeZone'
  })
};

export const ForceLeadingZeros: Story = {
  render: (args) => render({
    ...args,
    modelValue: '08:00',
    description: 'shouldForceLeadingZeros'
  })
};

export const IsDisabled: Story = {
  render: (args) => render({
    ...args,
    isDisabled: true,
    modelValue: CONTROLLED_VALUE
  })
};

export const IsQuietIsDisabled: Story = {
  render: (args) => render({
    ...args,
    isQuiet: true,
    isDisabled: true,
    modelValue: CONTROLLED_VALUE
  })
};

export const IsReadOnly: Story = {
  render: (args) => render({
    ...args,
    isReadOnly: true,
    modelValue: CONTROLLED_VALUE
  })
};

export const AutoFocus: Story = {
  render: (args) => render({
    ...args,
    autoFocus: true
  })
};

export const ValidationStateInvalid: Story = {
  render: (args) => render({
    ...args,
    validationState: 'invalid',
    modelValue: CONTROLLED_VALUE
  })
};

export const ValidationStateValid: Story = {
  render: (args) => render({
    ...args,
    validationState: 'valid',
    modelValue: CONTROLLED_VALUE
  })
};

export const PlaceholderValue8Am: Story = {
  render: (args) => render({
    ...args,
    placeholder: '08:00'
  })
};

export const PlaceholderValue1980118AmZoned: Story = {
  render: (args) => render({
    ...args,
    placeholder: '1980/1/1 08:00 America/Los_Angeles'
  })
};

export const MinValue8Am: Story = {
  render: (args) => render({
    ...args,
    min: '08:00'
  })
};

export const MaxValue8Pm: Story = {
  render: (args) => render({
    ...args,
    max: '20:00'
  })
};

export const MinValue8AmMaxValue8Pm: Story = {
  render: (args) => render({
    ...args,
    min: '08:00',
    max: '20:00'
  })
};

export const AllTheEvents: Story = {
  render: (args) => renderEvents(args)
};
