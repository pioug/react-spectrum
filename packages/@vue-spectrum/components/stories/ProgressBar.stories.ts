import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueProgressBar} from '@vue-spectrum/components';
import {computed} from 'vue';

const meta = {
  title: 'React Aria Components/ProgressBar',
  component: VueProgressBar,
  args: {
    value: 50
  },
  argTypes: {
    value: {control: 'number'},
    minValue: {control: 'number'},
    maxValue: {control: 'number'}
  }
} satisfies Meta<typeof VueProgressBar>;

export default meta;

export const ProgressBarExample: StoryFn<typeof VueProgressBar> = (args: {value?: number, minValue?: number, maxValue?: number}) => ({
  setup() {
    let minValue = computed(() => args.minValue ?? 0);
    let maxValue = computed(() => args.maxValue ?? 100);
    let range = computed(() => Math.max(maxValue.value - minValue.value, 1));
    let value = computed(() => {
      let currentValue = args.value ?? 50;
      return Math.min(Math.max(currentValue, minValue.value), maxValue.value);
    });
    let percentage = computed(() => ((value.value - minValue.value) / range.value) * 100);
    let valueText = computed(() => `${Math.round(percentage.value)}%`);

    return {
      maxValue,
      minValue,
      percentage,
      value,
      valueText
    };
  },
  template: `
    <div
      aria-label="Storage space"
      :aria-valuemax="maxValue"
      :aria-valuemin="minValue"
      :aria-valuenow="value"
      :aria-valuetext="valueText"
      class="react-aria-ProgressBar"
      role="progressbar"
      style="--fill-color: forestgreen; display: grid; grid-template-areas: 'label value' 'bar bar'; grid-template-columns: 1fr auto; gap: 4px; width: 250px; color: var(--text-color);">
      <span class="react-aria-Label">Storage space</span>
      <span class="value" style="grid-area: value;">{{valueText}}</span>
      <div class="bar" style="grid-area: bar; box-shadow: inset 0px 0px 0px 1px var(--spectrum-global-color-gray-400); height: 10px; border-radius: 5px; overflow: hidden;">
        <div class="fill" :style="{background: 'var(--fill-color)', height: '100%', width: percentage + '%'}" />
      </div>
    </div>
  `
});
