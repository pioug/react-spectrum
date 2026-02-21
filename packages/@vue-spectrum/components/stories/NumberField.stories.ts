import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueNumberField} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/NumberField',
  component: VueNumberField
} satisfies Meta<typeof VueNumberField>;

export default meta;

type Story = StoryObj<typeof meta>;

let defaultArgs = {
  defaultValue: 0,
  minValue: 0,
  maxValue: 100,
  step: 1,
  formatOptions: {style: 'currency', currency: 'USD'},
  isWheelDisabled: false
};

export const NumberFieldExample: Story = {
  args: defaultArgs,
  render: (args: {defaultValue?: number, minValue?: number, maxValue?: number, step?: number}) => ({
    components: {
      VueNumberField
    },
    setup() {
      let value = ref(args.defaultValue ?? null);
      return {
        args,
        value
      };
    },
    template: `
      <VueNumberField
        v-model="value"
        label="Test"
        :min="args.minValue"
        :max="args.maxValue"
        :step="args.step" />
    `
  })
};

export const NumberFieldControlledExample: Story = {
  args: defaultArgs,
  render: (args: {defaultValue?: number, minValue?: number, maxValue?: number, step?: number}) => ({
    components: {
      VueNumberField
    },
    setup() {
      let value = ref(args.defaultValue ?? null);
      let onChange = (nextValue: number | null) => {
        value.value = nextValue;
      };

      return {
        args,
        value,
        onChange
      };
    },
    template: `
      <VueNumberField
        :model-value="value"
        @update:model-value="onChange"
        label="Test"
        :min="args.minValue"
        :max="args.maxValue"
        :step="args.step" />
    `
  })
};
