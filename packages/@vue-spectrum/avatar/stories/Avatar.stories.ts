import {Avatar} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const SRC_URL_1 = 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/690bc6105945313.5f84bfc9de488.png';
const SRC_URL_2 = 'https://i.imgur.com/xIe7Wlb.png';

const meta: Meta<typeof Avatar> = {
  title: 'Avatar',
  component: Avatar
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {src: SRC_URL_1},
  name: 'default'
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    src: SRC_URL_1
  },
  name: 'isDisabled'
};

export const WithAltText: Story = {
  args: {
    alt: 'Pensive',
    src: SRC_URL_2
  },
  name: 'with alt text'
};

export const CustomSize: Story = {
  args: {
    ...WithAltText.args,
    size: 'avatar-size-700'
  },
  name: 'with custom size'
};
