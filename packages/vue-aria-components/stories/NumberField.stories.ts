import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {ref} from 'vue';
import {VueNumberField} from 'vue-aria-components';

const meta = {
  title: 'React Aria Components/NumberField',
  component: VueNumberField
} satisfies Meta<typeof VueNumberField>;

export default meta;

type Story = StoryObj<typeof meta>;

type NumberFieldArgs = {
  defaultValue?: number,
  minValue?: number,
  maxValue?: number,
  step?: number,
  formatOptions?: Intl.NumberFormatOptions,
  isWheelDisabled?: boolean
};

let defaultArgs: NumberFieldArgs = {
  defaultValue: 0,
  minValue: 0,
  maxValue: 100,
  step: 1,
  formatOptions: {style: 'currency', currency: 'USD'},
  isWheelDisabled: false
};

function validateValue(value: number): string | null {
  return value & 1 ? 'Invalid value' : null;
}

export const NumberFieldExample: Story = {
  args: defaultArgs,
  render: (args: NumberFieldArgs) => ({
    components: {
      VueNumberField
    },
    setup() {
      return {
        args,
        validateValue
      };
    },
    template: `
      <VueNumberField
        v-bind="args"
        label="Test"
        :validate="validateValue" />
    `
  })
};

export const NumberFieldControlledExample: Story = {
  args: defaultArgs,
  render: (args: NumberFieldArgs) => ({
    components: {
      VueNumberField
    },
    setup() {
      let value = ref(args.defaultValue ?? 0);

      return {
        args,
        validateValue,
        value
      };
    },
    template: `
      <VueNumberField
        v-bind="args"
        v-model="value"
        label="Test"
        :validate="validateValue" />
    `
  })
};
