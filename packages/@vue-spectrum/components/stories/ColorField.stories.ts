import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueColorField} from '@vue-spectrum/components';
import {ref} from 'vue';

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
    components: {
      VueColorField
    },
    setup() {
      let value = ref(args.defaultValue ?? '#f00');
      return {
        args,
        value
      };
    },
    template: `
      <VueColorField
        v-model="value"
        :label="args.label ?? 'Test'" />
    `
  }),
  args: {
    label: 'Test',
    defaultValue: '#f00'
  }
};
