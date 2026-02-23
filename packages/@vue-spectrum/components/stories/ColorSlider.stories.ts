import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueColorSlider} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/ColorSlider',
  component: VueColorSlider,
  excludeStories: ['ColorSliderExampleRender']
} satisfies Meta<typeof VueColorSlider>;

export default meta;

type Story = StoryObj<typeof meta>;

const HIDDEN_INPUT_STYLE = 'border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 100%; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 100%; white-space: nowrap; opacity: 0.0001; pointer-events: none;';

export function ColorSliderExampleRender() {
  return {
    template: `
      <div class="react-aria-ColorSlider" data-rac="" data-orientation="horizontal" style="display: flex; flex-direction: column; align-items: center; width: 192px;">
        <div style="display: flex; align-self: stretch; justify-content: space-between;">
          <label class="react-aria-Label">Hue</label>
          <output aria-live="off" class="react-aria-SliderOutput" data-rac="" data-orientation="horizontal">0°</output>
        </div>
        <div role="group" class="react-aria-SliderTrack" data-rac="" data-orientation="horizontal" style="position: relative; touch-action: none; forced-color-adjust: none; background: linear-gradient(to right, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0)), repeating-conic-gradient(rgb(204, 204, 204) 0%, rgb(204, 204, 204) 25%, white 0%, white 50%) 50% center / 16px 16px; height: 28px; width: 100%; border-radius: 4px;">
          <div class="react-aria-ColorThumb" data-rac="" style="position: absolute; left: 0%; transform: translate(-50%, -50%); touch-action: none; forced-color-adjust: none; background: rgb(255, 0, 0); top: 14px; border: 2px solid white; box-shadow: black 0px 0px 0px 1px, black 0px 0px 0px 1px inset; width: 20px; height: 20px; border-radius: 50%; box-sizing: border-box;">
            <input tabindex="0" aria-orientation="horizontal" min="0" max="360" step="1" type="range" value="0" style="${HIDDEN_INPUT_STYLE}">
          </div>
        </div>
      </div>
    `
  };
}

export const ColorSliderExample: Story = {
  render: () => ColorSliderExampleRender(),
  args: {
    channel: 'hue',
    defaultValue: 'hsl(0, 100%, 50%)'
  },
  argTypes: {
    channel: {
      control: 'select',
      options: ['hue', 'saturation', 'lightness', 'alpha']
    }
  }
};
