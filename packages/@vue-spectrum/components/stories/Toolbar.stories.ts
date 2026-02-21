import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueCheckbox, VuePicker} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/Toolbar'
} satisfies Meta;

export default meta;

export type ToolbarStory = StoryObj<typeof meta>;

export const ToolbarExample: ToolbarStory = {
  args: {
    orientation: 'horizontal'
  },
  render: () => ({
    components: {
      VueCheckbox
    },
    setup() {
      let nightMode = ref(false);
      return {
        nightMode
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <label for="before">Input Before Toolbar</label>
        <input id="before" type="text">
        <div style="display: flex; gap: 8px; align-items: center;">
          <div role="group" aria-label="Text style">
            <button type="button"><strong>B</strong></button>
            <button type="button"><span style="text-decoration: underline;">U</span></button>
            <button type="button"><i>I</i></button>
          </div>
          <VueCheckbox v-model="nightMode" label="Night Mode" />
          <a href="https://google.com">Help</a>
        </div>
        <label for="after">Input After Toolbar</label>
        <input id="after" type="text">
      </div>
    `
  })
};

export const SelectSupport: ToolbarStory = {
  args: {
    orientation: 'horizontal'
  },
  render: () => ({
    components: {
      VuePicker
    },
    setup() {
      let animal = ref('');
      return {
        animal
      };
    },
    template: `
      <div style="display: flex; gap: 8px; align-items: center;" aria-label="Text formatting">
        <div aria-label="Style">
          <button type="button" aria-label="Bold"><b>B</b></button>
          <button type="button" aria-label="Italic"><i>I</i></button>
          <button type="button" aria-label="Underline"><u>U</u></button>
        </div>
        <span aria-hidden="true">|</span>
        <VuePicker
          v-model="animal"
          label="Favorite Animal"
          :items="[
            {id: 'aardvark', label: 'Aardvark'},
            {id: 'cat', label: 'Cat'},
            {id: 'dog', label: 'Dog'},
            {id: 'kangaroo', label: 'Kangaroo'},
            {id: 'panda', label: 'Panda'},
            {id: 'snake', label: 'Snake'}
          ]" />
        <span aria-hidden="true">|</span>
        <div aria-label="Clipboard">
          <button type="button">Copy</button>
          <button type="button">Paste</button>
          <button type="button">Cut</button>
        </div>
      </div>
    `
  })
};
