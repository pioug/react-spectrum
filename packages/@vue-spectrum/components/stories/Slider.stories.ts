import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueSlider} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/Slider',
  component: VueSlider
} satisfies Meta<typeof VueSlider>;

export default meta;

export const SliderExample: StoryFn<typeof VueSlider> = () => ({
  components: {
    VueSlider
  },
  setup() {
    let value = ref(30);
    let reset = () => {
      value.value = 0;
    };

    return {
      value,
      reset
    };
  },
  template: `
    <div>
      <VueSlider
        v-model="value"
        data-testid="slider-example"
        label="Test"
        :min="0"
        :max="100"
        :step="1" />
      <button @click="reset">reset</button>
    </div>
  `
});

export const SliderCSS: StoryFn<typeof VueSlider> = (props: {orientation?: string, isDisabled?: boolean, minValue?: number, maxValue?: number, step?: number}) => ({
  components: {
    VueSlider
  },
  setup() {
    let value = ref(30);
    return {
      props,
      value
    };
  },
  template: `
    <VueSlider
      v-model="value"
      label="Test"
      :disabled="props.isDisabled ?? false"
      :min="props.minValue ?? 0"
      :max="props.maxValue ?? 100"
      :step="props.step ?? 1" />
  `
});

SliderCSS.args = {
  orientation: 'horizontal',
  isDisabled: false,
  minValue: 0,
  maxValue: 100,
  step: 1
};

SliderCSS.argTypes = {
  orientation: {
    control: {
      type: 'inline-radio',
      options: ['horizontal', 'vertical']
    }
  }
};
