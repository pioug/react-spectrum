import {FileTrigger} from '../src';
import {Button} from '@vue-spectrum/button';
import {Link} from '@vue-spectrum/link';
import {action} from 'storybook/actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {ref} from 'vue';

const meta: Meta<typeof FileTrigger> = {
  title: 'FileTrigger',
  component: FileTrigger
};

export default meta;

type Story = StoryObj<typeof meta>;

export const FileTriggerButton: Story = {
  render: (args) => ({
    components: {Button, FileTrigger},
    setup() {
      return {args, onSelect: action('onSelect')};
    },
    template: `
      <FileTrigger v-bind="args" @select="onSelect" data-testid="filetrigger-example">
        <Button variant="accent">Upload</Button>
      </FileTrigger>
    `
  })
};

export const FileTriggerDirectories: Story = {
  render: (args) => ({
    components: {FileTrigger, Button},
    setup() {
      let files = ref<string[]>([]);
      let onSelect = (nextFiles: File[]) => {
        files.value = nextFiles.map((file) => file.webkitRelativePath !== '' ? file.webkitRelativePath : file.name);
      };

      return {args, files, onSelect};
    },
    template: `
      <FileTrigger v-bind="args" accept-directory @select="onSelect">
        <Button variant="accent">Upload</Button>
      </FileTrigger>
      <ul v-if="files.length > 0">
        <li v-for="(file, index) in files" :key="index">{{ file }}</li>
      </ul>
    `
  })
};

export const FileTriggerLinkAllowsMultiple: Story = {
  render: (args) => ({
    components: {FileTrigger, Link},
    setup() {
      return {args, onSelect: action('onSelect')};
    },
    template: `
      <FileTrigger v-bind="args" allows-multiple @select="onSelect">
        <Link>Upload</Link>
      </FileTrigger>
    `
  })
};
