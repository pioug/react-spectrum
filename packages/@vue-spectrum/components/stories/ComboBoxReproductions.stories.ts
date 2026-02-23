import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueComboBox} from '@vue-spectrum/components';
import '../../../react-aria-components/stories/combobox-reproductions.css';
import '../../../react-aria-components/stories/styles.css';

const meta = {
  title: 'React Aria Components/ComboBoxReproductions',
  component: VueComboBox
} satisfies Meta<typeof VueComboBox>;

export default meta;

export type ComboBoxReproductionStory = StoryFn<typeof VueComboBox>;

export const ComboBoxReproductionExample: ComboBoxReproductionStory = () => ({
  template: `
    <div class="react-aria-ComboBox" data-rac="" style="color: rgb(57, 57, 57);">
      <label class="react-aria-Label">Favorite Animal</label>
      <div>
        <input
          class="react-aria-Input"
          data-rac=""
          type="text"
          value=""
          style="margin: 0; font-size: 1.072rem; background: rgb(255, 255, 255); color: rgb(57, 57, 57); border: 1px solid rgb(143, 143, 143); border-radius: 6px; padding: 0.286rem 2rem 0.286rem 0.571rem; vertical-align: middle;">
        <button
          class="react-aria-Button"
          data-rac=""
          type="button"
          style="background: rgb(111, 70, 237); color: rgb(255, 255, 255); forced-color-adjust: none; border-radius: 4px; border: none; margin-left: -1.714rem; width: 1.429rem; height: 1.429rem; padding: 0; font-size: 0.857rem; cursor: default;">▼</button>
      </div>
    </div>
  `
});
