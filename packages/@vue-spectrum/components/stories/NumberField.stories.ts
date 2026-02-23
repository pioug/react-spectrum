import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueNumberField} from '@vue-spectrum/components';
import {computed} from 'vue';

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

function createNumberFieldStory(args: NumberFieldArgs) {
  return {
    setup() {
      let minValue = computed(() => args.minValue ?? 0);
      let maxValue = computed(() => args.maxValue ?? 100);
      let value = computed(() => {
        let currentValue = args.defaultValue ?? 0;
        return Math.min(Math.max(currentValue, minValue.value), maxValue.value);
      });
      let formatter = computed(() => new Intl.NumberFormat('en-US', args.formatOptions));
      let valueText = computed(() => formatter.value.format(value.value));
      let isDecrementDisabled = computed(() => value.value <= minValue.value);
      let isIncrementDisabled = computed(() => value.value >= maxValue.value);

      return {
        isDecrementDisabled,
        isIncrementDisabled,
        valueText
      };
    },
    template: `
      <div class="react-aria-NumberField" data-rac="">
        <label class="react-aria-Label">Test</label>
        <div class="react-aria-Group" data-rac="" role="group" style="display: flex;">
          <button
            aria-label="Decrease"
            class="react-aria-Button"
            data-rac=""
            :data-disabled="isDecrementDisabled ? 'true' : null"
            :disabled="isDecrementDisabled"
            slot="decrement"
            tabindex="-1"
            type="button">-</button>
          <input
            aria-roledescription="Number field"
            autocomplete="off"
            autocorrect="off"
            class="react-aria-Input"
            data-rac=""
            inputmode="numeric"
            spellcheck="false"
            tabindex="0"
            type="text"
            :value="valueText">
          <button
            aria-label="Increase"
            class="react-aria-Button"
            data-rac=""
            :data-disabled="isIncrementDisabled ? 'true' : null"
            :disabled="isIncrementDisabled"
            slot="increment"
            tabindex="-1"
            type="button">+</button>
        </div>
      </div>
    `
  };
}

export const NumberFieldExample: Story = {
  args: defaultArgs,
  render: (args: NumberFieldArgs) => createNumberFieldStory(args)
};

export const NumberFieldControlledExample: Story = {
  args: defaultArgs,
  render: (args: NumberFieldArgs) => createNumberFieldStory(args)
};
