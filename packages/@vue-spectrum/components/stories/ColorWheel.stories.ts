import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueColorWheel} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/ColorWheel',
  component: VueColorWheel
} satisfies Meta<typeof VueColorWheel>;

export default meta;

const HIDDEN_INPUT_STYLE = 'border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 100%; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 100%; white-space: nowrap; opacity: 0.0001; pointer-events: none;';

export const ColorWheelExample: StoryFn<typeof VueColorWheel> = () => ({
  template: `
    <div class="react-aria-ColorWheel" data-rac="" style="position: relative;">
      <div class="react-aria-ColorWheelTrack" data-rac="" style='position: relative; touch-action: none; width: 200px; height: 200px; background:
          conic-gradient(
            from 90deg,
            hsl(0, 100%, 50%),
            hsl(30, 100%, 50%),
            hsl(60, 100%, 50%),
            hsl(90, 100%, 50%),
            hsl(120, 100%, 50%),
            hsl(150, 100%, 50%),
            hsl(180, 100%, 50%),
            hsl(210, 100%, 50%),
            hsl(240, 100%, 50%),
            hsl(270, 100%, 50%),
            hsl(300, 100%, 50%),
            hsl(330, 100%, 50%),
            hsl(360, 100%, 50%)
          ); clip-path: path(evenodd, "M 100, 100 m -100, 0 a 100, 100, 0, 1, 0, 200, 0 a 100, 100, 0, 1, 0 -200, 0 M 100, 100 m -72, 0 a 72, 72, 0, 1, 0, 144, 0 a 72, 72, 0, 1, 0 -144, 0"); forced-color-adjust: none;'></div>
      <div class="react-aria-ColorThumb" data-rac="" style="position: absolute; left: 186px; top: 100px; transform: translate(-50%, -50%); touch-action: none; forced-color-adjust: none; background: rgb(255, 0, 0); border: 2px solid white; box-shadow: black 0px 0px 0px 1px, black 0px 0px 0px 1px inset; width: 20px; height: 20px; border-radius: 50%; box-sizing: border-box;">
        <input aria-label="Hue" min="0" max="360" step="1" aria-valuetext="0°, red" type="range" value="0" style="${HIDDEN_INPUT_STYLE}">
      </div>
    </div>
  `
});
