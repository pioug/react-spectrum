import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type SliderArgs = {
  ariaLabel?: string,
  label?: string,
  max?: number,
  min?: number,
  step?: number,
  value?: number
};

const meta = {
  title: 'Slider (hooks)'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderSingleSlider(args: SliderArgs) {
  return {
    setup() {
      let value = ref(args.value ?? 40);
      return {
        args,
        value
      };
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 320px;">
        <label v-if="args.label">{{args.label}}</label>
        <input
          :aria-label="args.ariaLabel || undefined"
          type="range"
          :min="args.min ?? 0"
          :max="args.max ?? 100"
          :step="args.step ?? 1"
          v-model.number="value" />
        <output>{{value}}</output>
      </div>
    `
  };
}

function renderRangeSlider(args: {ariaLabel?: string, label?: string, left?: number, right?: number}) {
  return {
    setup() {
      let leftValue = ref(args.left ?? 25);
      let rightValue = ref(args.right ?? 75);
      return {
        args,
        leftValue,
        rightValue
      };
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 320px;">
        <label v-if="args.label">{{args.label}}</label>
        <input :aria-label="args.ariaLabel || undefined" type="range" min="0" max="100" v-model.number="leftValue" />
        <input :aria-label="args.ariaLabel || undefined" type="range" min="0" max="100" v-model.number="rightValue" />
        <output>{{leftValue}} - {{rightValue}}</output>
      </div>
    `
  };
}

function renderMultiThumb(args: {ariaLabel?: string, disabledIndices?: number[], values: number[]}) {
  return {
    setup() {
      let values = ref([...args.values]);
      let isDisabled = (index: number) => {
        return Boolean(args.disabledIndices?.includes(index));
      };

      return {
        args,
        isDisabled,
        values
      };
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 320px;">
        <div v-for="(value, index) in values" :key="index" style="display: grid; gap: 4px;">
          <label>Thumb {{index + 1}}</label>
          <input
            type="range"
            :aria-label="args.ariaLabel ? args.ariaLabel + ' ' + (index + 1) : undefined"
            min="0"
            max="100"
            :disabled="isDisabled(index)"
            v-model.number="values[index]" />
        </div>
      </div>
    `
  };
}

export const Single: Story = {
  render: () => renderSingleSlider({label: 'Size', value: 40}),
  name: 'Single'
};

export const SingleWithBigSteps: Story = {
  render: () => renderSingleSlider({label: 'Size', step: 10, value: 40}),
  name: 'Single With Big Steps'
};

export const SingleWithOrigin: Story = {
  render: () => renderSingleSlider({label: 'Exposure', min: -5, max: 5, step: 0.1, value: 0}),
  name: 'Single With Origin'
};

export const SingleWithAriaLabel: Story = {
  render: () => renderSingleSlider({ariaLabel: 'Size', value: 40}),
  name: 'Single With Aria Label'
};

export const Range: Story = {
  render: () => renderRangeSlider({label: 'Temperature', left: 25, right: 75}),
  name: 'Range'
};

export const RangeWithAriaLabel: Story = {
  render: () => renderRangeSlider({ariaLabel: 'Temperature', left: 25, right: 75}),
  name: 'Range With Aria Label'
};

export const _3Thumbs: Story = {
  render: () => renderMultiThumb({values: [10, 40, 80]}),
  name: '3 Thumbs'
};

export const _3ThumbsWithDisabled: Story = {
  render: () => renderMultiThumb({values: [10, 40, 80], disabledIndices: [1]}),
  name: '3 Thumbs With Disabled'
};

export const _8ThumbsWithDisabled: Story = {
  render: () => renderMultiThumb({values: [5, 10, 15, 30, 35, 40, 50, 75], disabledIndices: [0, 3, 4, 7]}),
  name: '8 Thumbs With Disabled'
};

export const _3ThumbsWithAriaLabel: Story = {
  render: () => renderMultiThumb({ariaLabel: 'Three thumbs', values: [10, 40, 80]}),
  name: '3 Thumbs With Aria Label'
};
