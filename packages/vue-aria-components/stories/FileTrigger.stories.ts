import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueFileTrigger} from 'vue-aria-components';

const meta = {
  title: 'React Aria Components/FileTrigger',
  component: VueFileTrigger
} satisfies Meta<typeof VueFileTrigger>;

export default meta;

export const FileTriggerButton: StoryFn<typeof VueFileTrigger> = () => ({
  template: `
    <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true">Upload</button>
    <input data-testid="filetrigger-example" data-rac="" type="file" style="display: none;" />
  `
});

export const FileTriggerDirectories: StoryFn<typeof VueFileTrigger> = () => ({
  template: `
    <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true">Upload</button>
    <input data-rac="" type="file" webkitdirectory="" style="display: none;" />
    <ul></ul>
  `
});

export const FileTriggerLinkAllowsMultiple: StoryFn<typeof VueFileTrigger> = () => ({
  template: `
    <span class="react-aria-Link" data-rac="" tabindex="0" data-react-aria-pressable="true" role="link">Select a file</span>
    <input data-rac="" type="file" multiple="" style="display: none;" />
  `
});
