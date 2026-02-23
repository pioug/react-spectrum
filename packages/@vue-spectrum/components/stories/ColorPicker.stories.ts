import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueColorPicker} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/ColorPicker',
  component: VueColorPicker
} satisfies Meta<typeof VueColorPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

function ColorPickerTriggerFixtureRender() {
  return {
    template: `
      <button class="react-aria-Button" data-rac="" type="button" tabindex="0" aria-expanded="false" id="vs-color-picker-trigger" data-react-aria-pressable="true" style="background: none; border: none; padding: 0px;">
        <div aria-label="vibrant red, Color picker" role="img" aria-roledescription="color swatch" id="vs-color-picker-swatch" class="react-aria-ColorSwatch" data-rac="" style="background: linear-gradient(rgb(255, 0, 0), rgb(255, 0, 0)), repeating-conic-gradient(rgb(204, 204, 204) 0%, rgb(204, 204, 204) 25%, white 0%, white 50%) 50% center / 16px 16px; forced-color-adjust: none; width: 32px; height: 32px; border-radius: 4px; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px inset;"></div>
      </button>
    `
  };
}

export const ColorPickerExample: Story = {
  render: () => ColorPickerTriggerFixtureRender()
};

export const ColorPickerSliders: Story = {
  render: () => ColorPickerTriggerFixtureRender()
};
