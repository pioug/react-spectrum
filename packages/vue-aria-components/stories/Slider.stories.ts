import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueSlider} from 'vue-aria-components';

const meta = {
  title: 'React Aria Components/Slider',
  component: VueSlider
} satisfies Meta<typeof VueSlider>;

export default meta;

export const SliderExample: StoryFn<typeof VueSlider> = () => ({
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
          <output class="react-aria-SliderOutput" data-rac="" data-orientation="horizontal" style="flex: 1 0 auto; text-align: end;">30 - 60</output>
        </div>
        <div class="react-aria-SliderTrack" data-rac="" data-orientation="horizontal" style="position: relative; touch-action: none; height: 30px; width: 100%;">
          <div style="position: absolute; background-color: gray; height: 3px; top: 13px; width: 100%;"></div>
          <div class="react-aria-SliderThumb" data-rac="" style="position: absolute; left: 30%; transform: translate(-50%, -50%); touch-action: none; width: 20px; height: 20px; border-radius: 50%; top: 50%; background-color: gray;">
            <label class="react-aria-Label">A</label>
          </div>
          <div class="react-aria-SliderThumb" data-rac="" style="position: absolute; left: 60%; transform: translate(-50%, -50%); touch-action: none; width: 20px; height: 20px; border-radius: 50%; top: 50%; background-color: gray;">
            <label class="react-aria-Label">B</label>
          </div>
        </div>
      </div>
      <button type="button">reset</button>
    </div>
  `
});

export const SliderCSS: StoryFn<typeof VueSlider> = (props: {orientation?: string, isDisabled?: boolean, minValue?: number, maxValue?: number, step?: number}) => ({
  setup() {
    return {props};
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
        <output class="react-aria-SliderOutput" data-rac="" :data-orientation="props.orientation ?? 'horizontal'" style="flex: 1 0 auto; text-align: end;">30</output>
      </div>
      <div class="react-aria-SliderTrack" data-rac="" :data-orientation="props.orientation ?? 'horizontal'" style="position: relative; touch-action: none; height: 30px; width: 100%;">
        <div style="position: absolute; background-color: gray; height: 3px; top: 50%; transform: translateY(-50%); width: 100%;"></div>
        <div class="react-aria-SliderThumb" data-rac="" style="position: absolute; left: 30%; transform: translate(-50%, -50%); touch-action: none; width: 20px; height: 20px; border-radius: 50%; top: 50%; background-color: gray;"></div>
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
