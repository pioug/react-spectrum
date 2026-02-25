import {Avatar} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const SRC_URL_1 = 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/690bc6105945313.5f84bfc9de488.png';
const SRC_URL_2 = 'https://i.imgur.com/xIe7Wlb.png';

const meta: Meta<typeof Avatar> = {
  title: 'Avatar',
  component: Avatar,
  args: {
    src: SRC_URL_1
  },
  argTypes: {
    alt: {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    shape: {
      control: 'text'
    },
    size: {
      control: 'text'
    },
    src: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Avatar},
    setup() {
      return {args};
    },
    template: '<Avatar v-bind="args" />'
  }),
  name: 'default'
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true,
    src: SRC_URL_1
  },
  name: 'isDisabled'
};

export const WithAltText: Story = {
  ...Default,
  args: {
    alt: 'Pensive',
    src: SRC_URL_2
  },
  name: 'with alt text'
};

export const CustomSize: Story = {
  ...Default,
  args: {
    ...WithAltText.args,
    size: 'avatar-size-700'
  },
  name: 'with custom size'
};
