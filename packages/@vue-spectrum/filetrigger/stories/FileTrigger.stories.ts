import {FileTrigger} from '../src';
import {Button} from '@vue-spectrum/button';
import {Link} from '@vue-spectrum/link';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof FileTrigger> = {
  title: 'FileTrigger',
  component: FileTrigger
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultWithButton: Story = {
  render: (args) => ({
    components: {Button, FileTrigger},
    setup() {
      return {args};
    },
    template: `
      <FileTrigger v-bind="args">
        <Button variant="accent">Upload</Button>
      </FileTrigger>
    `
  })
};

export const DefaultWithLink: Story = {
  render: (args) => ({
    components: {FileTrigger, Link},
    setup() {
      return {args};
    },
    template: `
      <FileTrigger v-bind="args">
        <Link>Upload</Link>
      </FileTrigger>
    `
  })
};
