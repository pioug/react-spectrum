import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueFileTrigger} from 'vue-aria-components';
import {action} from '@storybook/addon-actions';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/FileTrigger',
  component: VueFileTrigger
} satisfies Meta<typeof VueFileTrigger>;

export default meta;

export const FileTriggerButton: StoryFn<typeof VueFileTrigger> = () => ({
  components: {
    VueFileTrigger
  },
  setup() {
    return {
      onSelect: action('onSelect')
    };
  },
  template: `
    <VueFileTrigger data-testid="filetrigger-example" @select="onSelect">
      <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true">Upload</button>
    </VueFileTrigger>
  `
});

export const FileTriggerDirectories: StoryFn<typeof VueFileTrigger> = () => ({
  components: {
    VueFileTrigger
  },
  setup() {
    let files = ref<string[]>([]);
    let onSelect = (nextFiles: File[]) => {
      files.value = nextFiles.map((file) => file.webkitRelativePath !== '' ? file.webkitRelativePath : file.name);
    };

    return {
      files,
      onSelect
    };
  },
  template: `
    <VueFileTrigger accept-directory @select="onSelect">
      <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true">Upload</button>
    </VueFileTrigger>
    <ul v-if="files.length > 0">
      <li v-for="(file, index) in files" :key="index">{{ file }}</li>
    </ul>
  `
});

export const FileTriggerLinkAllowsMultiple: StoryFn<typeof VueFileTrigger> = () => ({
  components: {
    VueFileTrigger
  },
  setup() {
    return {
      onSelect: action('onSelect')
    };
  },
  template: `
    <VueFileTrigger allows-multiple @select="onSelect">
      <span class="react-aria-Link" data-rac="" tabindex="0" data-react-aria-pressable="true" role="link">Select a file</span>
    </VueFileTrigger>
  `
});
