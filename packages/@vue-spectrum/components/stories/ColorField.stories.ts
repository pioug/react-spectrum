import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueColorField} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/ColorField',
  argTypes: {
    colorSpace: {
      control: 'select',
      options: ['rgb', 'hsl', 'hsb']
    },
    channel: {
      control: 'select',
      options: [null, 'red', 'green', 'blue', 'hue', 'saturation', 'lightness', 'brightness']
    }
  },
  component: VueColorField
} satisfies Meta<typeof VueColorField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ColorFieldExample: Story = {
  render: (args: {defaultValue?: string, label?: string}) => ({
    setup() {
      let expandHex = (value: string) => {
        let match = value.trim().match(/^#([0-9a-fA-F]{3})$/);
        if (!match) {
          return value.toUpperCase();
        }

        let expanded = match[1].split('').map((channel) => `${channel}${channel}`).join('');
        return `#${expanded.toUpperCase()}`;
      };

      let displayValue = expandHex(args.defaultValue ?? '#f00');
      return {
        args,
        displayValue
      };
    },
    template: `
      <div class="react-aria-ColorField" data-rac="" data-channel="hex">
        <label class="react-aria-Label" for="vs-color-field-input">{{ args.label ?? 'Test' }}</label>
        <input
          id="vs-color-field-input"
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          tabindex="0"
          role="textbox"
          class="react-aria-Input"
          data-rac=""
          type="text"
          :value="displayValue"
          title=""
          style="display: block;">
      </div>
    `
  }),
  args: {
    label: 'Test',
    defaultValue: '#f00'
  }
};
