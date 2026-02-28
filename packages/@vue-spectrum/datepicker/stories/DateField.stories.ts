import {DateField} from '../src';
import {action} from '@storybook/addon-actions';
import {computed, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;

const meta: Meta<typeof DateField> = {
  title: 'Date and Time/DateField',
  component: DateField,
  parameters: {
    actions: {
      argTypesRegex: '^$'
    }
  },
  args: {
    onChange: action('onChange')
  },
  argTypes: {
    onChange: {
      table: {
        disable: true
      }
    },
    defaultValue: {
      table: {
        disable: true
      }
    },
    value: {
      table: {
        disable: true
      }
    },
    minValue: {
      table: {
        disable: true
      }
    },
    maxValue: {
      table: {
        disable: true
      }
    },
    placeholderValue: {
      table: {
        disable: true
      }
    },
    onBlur: {
      table: {
        disable: true
      }
    },
    onFocus: {
      table: {
        disable: true
      }
    },
    onFocusChange: {
      table: {
        disable: true
      }
    },
    onKeyDown: {
      table: {
        disable: true
      }
    },
    onKeyUp: {
      table: {
        disable: true
      }
    },
    contextualHelp: {
      table: {
        disable: true
      }
    },
    label: {
      control: 'text'
    },
    granularity: {
      control: 'select',
      options: ['day', 'hour', 'minute', 'second']
    },
    hourCycle: {
      control: 'select',
      options: [12, 24]
    },
    hideTimeZone: {
      control: 'boolean'
    },
    shouldForceLeadingZeros: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    isQuiet: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    isRequired: {
      control: 'boolean'
    },
    necessityIndicator: {
      control: 'select',
      options: ['icon', 'label']
    },
    validationState: {
      control: 'select',
      options: [null, 'valid', 'invalid']
    },
    description: {
      control: 'text'
    },
    errorMessage: {
      control: 'text'
    },
    labelAlign: {
      control: 'select',
      options: ['end', 'start']
    },
    labelPosition: {
      control: 'select',
      options: ['top', 'side']
    },
    autoFocus: {
      control: 'boolean'
    },
    showFormatHelpText: {
      control: 'boolean'
    },
    'aria-label': {
      control: 'text'
    },
    width: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function render(args: StoryArgs = {}) {
  return {
    components: {DateField},
    setup() {
      return {args};
    },
    template: '<DateField label="Date" v-bind="args" style="max-width: calc(100vw - 40px);" />'
  };
}

function renderUnavailableDatesExample(args: StoryArgs) {
  return {
    components: {DateField},
    setup() {
      let value = ref('');
      let isInvalid = computed(() => value.value >= '1980-01-01' && value.value <= '1980-01-08');
      return {
        args,
        isInvalid,
        value
      };
    },
    template: `
      <DateField
        v-bind="args"
        :model-value="value"
        :is-invalid="isInvalid"
        :validation-state="isInvalid ? 'invalid' : undefined"
        description="Any date between 1/1/1980 and 1/8/1980 is unavailable."
        @update:model-value="value = $event" />
    `
  };
}

function renderEventsExample(args: StoryArgs) {
  return {
    components: {DateField},
    setup() {
      let onBlur = action('onBlur');
      let onFocus = action('onFocus');
      let onFocusChange = action('onFocusChange');
      let onKeyDown = action('onKeyDown');
      let onKeyUp = action('onKeyUp');

      return {
        args,
        onBlur,
        onFocus,
        onFocusChange,
        onKeyDown,
        onKeyUp
      };
    },
    template: `
      <div @keydown="onKeyDown($event)" @keyup="onKeyUp($event)">
        <DateField
          v-bind="args"
          @focus="onFocus($event); onFocusChange(true)"
          @blur="onBlur($event); onFocusChange(false)" />
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => render(args)
};

export const DefaultValue: Story = {
  render: (args) => render({
    ...args,
    modelValue: '2020-02-03'
  })
};

export const ControlledValue: Story = {
  render: (args) => render({
    ...args,
    modelValue: '2020-02-03'
  })
};

export const DefaultValueZoned: Story = {
  render: (args) => render({
    ...args,
    modelValue: '2020-02-03T00:00:00-08:00',
    description: 'default value date, zoned'
  }),
  name: 'defaultValue date, zoned'
};

export const DateTimeValue: Story = {
  render: (args) => render({
    ...args,
    modelValue: '2021-03-14T08:45'
  })
};

export const DateTimeValueZoned: Story = {
  render: (args) => render({
    ...args,
    modelValue: '2021-11-07T00:45-07:00[America/Los_Angeles]'
  })
};

export const DateTimeValueAbsolute: Story = {
  render: (args) => render({
    ...args,
    modelValue: '2021-11-07T07:45:00Z'
  })
};

export const DateTimeValueAbsoluteZoned: Story = {
  render: (args) => render({
    ...args,
    modelValue: '2021-11-07T07:45:00Z America/New_York'
  })
};

export const MinMaxValue: Story = {
  render: (args) => render({
    ...args,
    min: '2010-01-01',
    max: '2020-01-01'
  }),
  name: 'minValue: 2010/1/1, maxValue: 2020/1/1'
};

export const IsDateUnavailable: Story = {
  render: (args) => renderUnavailableDatesExample(args),
  parameters: {
    description: {
      data: 'Any date between 1/1/1980 and 1/8/1980 are unavailable and will display a "Date unavailable" error to the user'
    }
  }
};

export const PlaceholderVal: Story = {
  render: (args) => render({
    ...args,
    placeholder: '1980-01-01'
  }),
  name: 'placeholder value: 1980/1/1'
};

export const PlaceholderValTime: Story = {
  render: (args) => render({
    ...args,
    placeholder: '1980-01-01T08:00'
  }),
  name: 'placeholder value: 1980/1/1 8AM'
};

export const PlaceholderValTimeZoned: Story = {
  render: (args) => render({
    ...args,
    placeholder: '1980-01-01 America/Los_Angeles'
  }),
  name: 'placeholder value: 1980/1/1 zoned'
};

export const AllEvents: Story = {
  render: (args) => renderEventsExample(args),
  name: 'all the events'
};

export const ContextualHelpStory: Story = {
  render: (args) => render({
    ...args,
    description: 'Contextual help: Segments identify who your visitors are.'
  }),
  name: 'contextual help'
};
