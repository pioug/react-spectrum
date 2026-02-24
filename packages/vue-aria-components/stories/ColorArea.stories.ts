import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueColorArea} from 'vue-aria-components';

const meta = {
  title: 'React Aria Components/ColorArea',
  component: VueColorArea,
  excludeStories: ['ColorAreaExampleRender']
} satisfies Meta<typeof VueColorArea>;

export default meta;

type Story = StoryObj<typeof meta>;

const HIDDEN_INPUT_STYLE = 'border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 100%; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 100%; white-space: nowrap; opacity: 0.0001; pointer-events: none;';
const SLIDER_TRACK_BASE_STYLE = 'position: relative; touch-action: none; forced-color-adjust: none; height: 28px; width: 100%; border-radius: 4px;';
const COLOR_THUMB_BASE_STYLE = 'transform: translate(-50%, -50%); touch-action: none; forced-color-adjust: none; top: 14px; border: 2px solid white; box-shadow: black 0px 0px 0px 1px, black 0px 0px 0px 1px inset; width: 20px; height: 20px; border-radius: 50%; box-sizing: border-box;';

type ColorAreaFixtureConfig = {
  areaBackground: string,
  areaThumbColor: string,
  areaThumbLeft: string,
  areaThumbTop: string,
  colorSliderLabel: string,
  colorSliderOutput: string,
  colorSliderTrackBackground: string,
  colorSliderThumbColor: string,
  colorSliderThumbLeft: string,
  sliderMax: string,
  sliderValue: string,
  xMax: string,
  xValue: string,
  yMax: string,
  yValue: string
};

function createColorAreaTemplate(config: ColorAreaFixtureConfig): string {
  return `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <div id="vs-color-area" role="group" class="react-aria-ColorArea" data-rac="" style="position: relative; touch-action: none; forced-color-adjust: none; background: ${config.areaBackground}; width: 192px; height: 192px; border-radius: 4px;">
        <div role="presentation" class="react-aria-ColorThumb" data-rac="" style="position: absolute; left: ${config.areaThumbLeft}; top: ${config.areaThumbTop}; transform: translate(-50%, -50%); touch-action: none; forced-color-adjust: none; background: ${config.areaThumbColor}; border: 2px solid white; border-radius: 50%; box-shadow: black 0px 0px 0px 1px, black 0px 0px 0px 1px inset; box-sizing: border-box; height: 20px; width: 20px;">
          <input aria-label="Color picker" min="0" max="${config.xMax}" step="1" aria-roledescription="2D slider" aria-orientation="horizontal" type="range" value="${config.xValue}" style="${HIDDEN_INPUT_STYLE}">
          <input aria-label="Color picker" min="0" max="${config.yMax}" step="1" aria-roledescription="2D slider" aria-orientation="vertical" tabindex="-1" aria-hidden="true" type="range" value="${config.yValue}" style="${HIDDEN_INPUT_STYLE}">
        </div>
      </div>
      <div class="react-aria-ColorSlider" data-rac="" data-orientation="horizontal" style="display: flex; flex-direction: column; align-items: center; width: 192px;">
        <div style="display: flex; align-self: stretch; justify-content: space-between;">
          <label class="react-aria-Label">${config.colorSliderLabel}</label>
          <output aria-live="off" class="react-aria-SliderOutput" data-rac="" data-orientation="horizontal">${config.colorSliderOutput}</output>
        </div>
        <div role="group" class="react-aria-SliderTrack" data-rac="" data-orientation="horizontal" style="${SLIDER_TRACK_BASE_STYLE} background: ${config.colorSliderTrackBackground};">
          <div class="react-aria-ColorThumb" data-rac="" style="position: absolute; left: ${config.colorSliderThumbLeft}; ${COLOR_THUMB_BASE_STYLE} background: ${config.colorSliderThumbColor};">
            <input tabindex="0" aria-orientation="horizontal" min="0" max="${config.sliderMax}" step="1" type="range" value="${config.sliderValue}" style="${HIDDEN_INPUT_STYLE}">
          </div>
        </div>
      </div>
    </div>
  `;
}

export const ColorAreaExampleRender = (config: ColorAreaFixtureConfig) => ({
  template: createColorAreaTemplate(config)
});

export const ColorAreaExample: Story = {
  render: () => ColorAreaExampleRender({
    areaBackground: 'linear-gradient(to right, rgb(0, 0, 0), rgb(255, 0, 0)), linear-gradient(to top, rgb(0, 0, 0), rgb(0, 255, 0)), rgb(0, 0, 237); background-blend-mode: screen',
    areaThumbColor: 'rgb(100, 149, 237)',
    areaThumbLeft: '39.2157%',
    areaThumbTop: '41.5686%',
    colorSliderLabel: 'Blue',
    colorSliderOutput: '237',
    colorSliderTrackBackground: 'linear-gradient(to right, rgb(100, 149, 0), rgb(100, 149, 255)), repeating-conic-gradient(rgb(204, 204, 204) 0%, rgb(204, 204, 204) 25%, white 0%, white 50%) 50% center / 16px 16px',
    colorSliderThumbColor: 'rgb(100, 149, 237)',
    colorSliderThumbLeft: '92.9412%',
    sliderMax: '255',
    sliderValue: '237',
    xMax: '255',
    xValue: '100',
    yMax: '255',
    yValue: '149'
  }),
  args: {
    defaultValue: 'rgb(100, 149, 237)',
    xChannel: 'red',
    yChannel: 'green'
  },
  argTypes: {
    xChannel: {
      control: 'select',
      options: ['red', 'green', 'blue']
    },
    yChannel: {
      control: 'select',
      options: ['red', 'green', 'blue']
    }
  }
};

export const ColorAreaHSL: Story = {
  render: () => ColorAreaExampleRender({
    areaBackground: 'linear-gradient(to top, hsla(0, 0%, 66%, 1), transparent), linear-gradient(to right, hsla(0, 100%, 66%, 1), hsla(60, 100%, 66%, 1), hsla(120, 100%, 66%, 1), hsla(180, 100%, 66%, 1), hsla(240, 100%, 66%, 1), hsla(300, 100%, 66%, 1), hsla(360, 100%, 66%, 1))',
    areaThumbColor: 'hsla(219, 79%, 66%, 1)',
    areaThumbLeft: '60.8333%',
    areaThumbTop: '21%',
    colorSliderLabel: 'Lightness',
    colorSliderOutput: '66%',
    colorSliderTrackBackground: 'linear-gradient(to right, hsla(219, 79%, 0%, 1), hsla(219, 79%, 50%, 1), hsla(219, 79%, 100%, 1)), repeating-conic-gradient(rgb(204, 204, 204) 0%, rgb(204, 204, 204) 25%, white 0%, white 50%) 50% center / 16px 16px',
    colorSliderThumbColor: 'hsla(219, 79%, 66%, 1)',
    colorSliderThumbLeft: '66%',
    sliderMax: '100',
    sliderValue: '66',
    xMax: '360',
    xValue: '219',
    yMax: '100',
    yValue: '79'
  }),
  args: {
    defaultValue: 'hsl(219, 79%, 66%)',
    xChannel: 'hue',
    yChannel: 'saturation'
  },
  argTypes: {
    xChannel: {
      control: 'select',
      options: ['hue', 'saturation', 'lightness']
    },
    yChannel: {
      control: 'select',
      options: ['hue', 'saturation', 'lightness']
    }
  }
};

export const ColorAreaHSB: Story = {
  render: () => ColorAreaExampleRender({
    areaBackground: 'linear-gradient(to top, hsla(0, 0%, 66%, 1), transparent), linear-gradient(to right, hsla(0, 100%, 33%, 1), hsla(60, 100%, 33%, 1), hsla(120, 100%, 33%, 1), hsla(180, 100%, 33%, 1), hsla(240, 100%, 33%, 1), hsla(300, 100%, 33%, 1), hsla(360, 100%, 33%, 1))',
    areaThumbColor: 'hsla(219, 65.29%, 39.93%, 1)',
    areaThumbLeft: '60.8333%',
    areaThumbTop: '21%',
    colorSliderLabel: 'Brightness',
    colorSliderOutput: '66%',
    colorSliderTrackBackground: 'linear-gradient(to right, hsla(219, 0%, 0%, 1), hsla(219, 100%, 60.5%, 1)), repeating-conic-gradient(rgb(204, 204, 204) 0%, rgb(204, 204, 204) 25%, white 0%, white 50%) 50% center / 16px 16px',
    colorSliderThumbColor: 'hsla(219, 65.29%, 39.93%, 1)',
    colorSliderThumbLeft: '66%',
    sliderMax: '100',
    sliderValue: '66',
    xMax: '360',
    xValue: '219',
    yMax: '100',
    yValue: '79'
  }),
  args: {
    defaultValue: 'hsb(219, 79%, 66%)',
    xChannel: 'hue',
    yChannel: 'saturation'
  },
  argTypes: {
    xChannel: {
      control: 'select',
      options: ['hue', 'saturation', 'brightness']
    },
    yChannel: {
      control: 'select',
      options: ['hue', 'saturation', 'brightness']
    }
  }
};
