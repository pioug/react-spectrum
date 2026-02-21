import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueFileTrigger} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/FileTrigger',
  component: VueFileTrigger
} satisfies Meta<typeof VueFileTrigger>;

export default meta;

export const FileTriggerButton: StoryFn<typeof VueFileTrigger> = (props: {allowsMultiple?: boolean, acceptDirectory?: boolean}) => ({
  components: {
    VueFileTrigger
  },
  setup() {
    return {
      onSelect: action('onSelect'),
      props
    };
  },
  template: `
    <VueFileTrigger
      data-testid="filetrigger-example"
      :allows-multiple="props.allowsMultiple ?? false"
      :accept-directory="props.acceptDirectory ?? false"
      @select="onSelect">
      Upload
    </VueFileTrigger>
  `
});

export const FileTriggerDirectories: StoryFn<typeof VueFileTrigger> = (props: {acceptDirectory?: boolean}) => ({
  components: {
    VueFileTrigger
  },
  setup() {
    let files = ref<string[]>([]);
    let onSelect = (selectedFiles: File[]) => {
      files.value = selectedFiles.map((file) => {
        let webkitRelativePath = (file as File & {webkitRelativePath?: string}).webkitRelativePath;
        return webkitRelativePath && webkitRelativePath !== '' ? webkitRelativePath : file.name;
      });
    };

    return {
      files,
      onSelect,
      props
    };
  },
  template: `
    <div>
      <VueFileTrigger
        :accept-directory="props.acceptDirectory ?? true"
        @select="onSelect">
        Upload
      </VueFileTrigger>
      <ul v-if="files.length > 0">
        <li v-for="file in files" :key="file">{{ file }}</li>
      </ul>
    </div>
  `
});

export const FileTriggerLinkAllowsMultiple: StoryFn<typeof VueFileTrigger> = (props: {allowsMultiple?: boolean}) => ({
  components: {
    VueFileTrigger
  },
  setup() {
    return {
      onSelect: action('onSelect'),
      props
    };
  },
  template: `
    <VueFileTrigger
      :allows-multiple="props.allowsMultiple ?? true"
      @select="onSelect">
      <span style="text-decoration: underline; cursor: pointer;">Select a file</span>
    </VueFileTrigger>
  `
});
