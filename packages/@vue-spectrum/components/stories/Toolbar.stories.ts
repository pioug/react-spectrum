import type {Meta, StoryObj} from '@storybook/vue3-vite';
import '../../../react-aria-components/stories/styles.css';

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
    template: `
      <div>
        <label for="before">Input Before Toolbar</label>
        <input id="before" type="text">
        <div class="react-aria-Toolbar" data-rac="" role="toolbar" aria-orientation="horizontal" data-orientation="horizontal" style="display: flex; flex-wrap: wrap; gap: 20px; flex-direction: row;">
          <div role="group" aria-label="Text style">
            <button class="v7C2Sq_toggleButtonExample" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" aria-pressed="false"><strong>B</strong></button>
            <button class="v7C2Sq_toggleButtonExample" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" aria-pressed="false"><div style="text-decoration: underline;">U</div></button>
            <button class="v7C2Sq_toggleButtonExample" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" aria-pressed="false"><i>I</i></button>
          </div>
          <label data-react-aria-pressable="true" class="react-aria-Checkbox" data-rac="">
            <span style="border: 0; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; white-space: nowrap;">
              <input data-react-aria-pressable="true" tabindex="0" type="checkbox" title="">
            </span>
            <div class="checkbox">
              <svg viewBox="0 0 18 18" aria-hidden="true">
                <polyline points="1 9 7 14 15 4"></polyline>
              </svg>
            </div>
            Night Mode
          </label>
          <a class="react-aria-Link" data-rac="" href="https://google.com" tabindex="0" data-react-aria-pressable="true">Help</a>
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
    template: `
      <div class="react-aria-Toolbar" data-rac="" aria-label="Text formatting" role="toolbar" aria-orientation="horizontal" data-orientation="horizontal" style="display: flex; flex-wrap: wrap; gap: 20px; flex-direction: row;">
        <div aria-label="Style" class="react-aria-Group" data-rac="" role="group">
          <button class="react-aria-ToggleButton" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" aria-label="Bold" aria-pressed="false"><b>B</b></button>
          <button class="react-aria-ToggleButton" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" aria-label="Italic" aria-pressed="false"><i>I</i></button>
          <button class="react-aria-ToggleButton" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" aria-label="Underline" aria-pressed="false"><u>U</u></button>
        </div>
        <div role="separator" aria-orientation="vertical" class="react-aria-Separator"></div>
        <template data-react-aria-hidden="true"></template>
        <div class="react-aria-Select" data-rac="">
          <span class="react-aria-Label">Favorite Animal</span>
          <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" aria-haspopup="listbox" aria-expanded="false">
            <span class="react-aria-SelectValue" data-rac="" data-placeholder="true">Select an item</span>
            <span aria-hidden="true">▼</span>
          </button>
        </div>
        <div role="separator" aria-orientation="vertical" class="react-aria-Separator"></div>
        <div aria-label="Clipboard" class="react-aria-Group" data-rac="" role="group">
          <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true">Copy</button>
          <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true">Paste</button>
          <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true">Cut</button>
        </div>
      </div>
    `
  })
};
