import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueSlider} from 'vue-aria-components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/Slider',
  component: VueSlider
} satisfies Meta<typeof VueSlider>;

export default meta;

export const SliderExample: StoryFn<typeof VueSlider> = () => ({
  setup() {
    let startValue = ref(30);
    let endValue = ref(60);

    let reset = () => {
      startValue.value = 0;
      endValue.value = 100;
    };

    return {
      endValue,
      reset,
      startValue
    };
  },
  template: `
    <div>
      <div
        class="react-aria-Slider"
        data-rac=""
        data-testid="slider-example"
        data-orientation="horizontal"
        role="group"
        style="position: relative; display: flex; flex-direction: column; align-items: center; width: 300px;">
        <div style="display: flex; align-self: stretch;">
          <label class="react-aria-Label">Test</label>
          <output class="react-aria-SliderOutput" data-rac="" data-orientation="horizontal" style="flex: 1 0 auto; text-align: end;">{{ startValue }} - {{ endValue }}</output>
        </div>
        <div class="react-aria-SliderTrack" data-rac="" data-orientation="horizontal" style="position: relative; touch-action: none; height: 30px; width: 100%;">
          <div style="position: absolute; background-color: gray; height: 3px; top: 13px; width: 100%;"></div>
          <div class="react-aria-SliderThumb" data-rac="" :style="{position: 'absolute', left: startValue + '%', transform: 'translate(-50%, -50%)', touchAction: 'none', width: '20px', height: '20px', borderRadius: '50%', top: '50%', backgroundColor: 'gray'}">
            <label class="react-aria-Label">A</label>
            <input type="range" min="0" max="100" step="1" v-model.number="startValue" style="position: absolute; inset: 0; opacity: 0.01;">
          </div>
          <div class="react-aria-SliderThumb" data-rac="" :style="{position: 'absolute', left: endValue + '%', transform: 'translate(-50%, -50%)', touchAction: 'none', width: '20px', height: '20px', borderRadius: '50%', top: '50%', backgroundColor: 'gray'}">
            <label class="react-aria-Label">B</label>
            <input type="range" min="0" max="100" step="1" v-model.number="endValue" style="position: absolute; inset: 0; opacity: 0.01;">
          </div>
        </div>
      </div>
      <button type="button" @click="reset">reset</button>
    </div>
  `
});

export const SliderCSS: StoryFn<typeof VueSlider> = (props: {orientation?: string, isDisabled?: boolean, minValue?: number, maxValue?: number, step?: number}) => ({
  setup() {
    let value = ref(30);

    return {
      props,
      value
    };
  },
  template: `
    <div
      class="react-aria-Slider"
      data-rac=""
      role="group"
      :data-orientation="props.orientation ?? 'horizontal'"
      style="position: relative; display: flex; flex-direction: column; align-items: center; width: 300px;">
      <div style="display: flex; align-self: stretch;">
        <label class="react-aria-Label">Test</label>
        <output class="react-aria-SliderOutput" data-rac="" :data-orientation="props.orientation ?? 'horizontal'" style="flex: 1 0 auto; text-align: end;">{{ value }}</output>
      </div>
      <div class="react-aria-SliderTrack" data-rac="" :data-orientation="props.orientation ?? 'horizontal'" style="position: relative; touch-action: none; height: 30px; width: 100%;">
        <div style="position: absolute; background-color: gray; height: 3px; top: 50%; transform: translateY(-50%); width: 100%;"></div>
        <div class="react-aria-SliderThumb" data-rac="" :style="{position: 'absolute', left: value + '%', transform: 'translate(-50%, -50%)', touchAction: 'none', width: '20px', height: '20px', borderRadius: '50%', top: '50%', backgroundColor: 'gray'}">
          <input
            type="range"
            :min="props.minValue ?? 0"
            :max="props.maxValue ?? 100"
            :step="props.step ?? 1"
            :disabled="props.isDisabled ?? false"
            v-model.number="value"
            style="position: absolute; inset: 0; opacity: 0.01;">
        </div>
      </div>
    </div>
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
