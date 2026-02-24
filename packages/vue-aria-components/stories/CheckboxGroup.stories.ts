import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueCheckbox} from 'vue-aria-components';

const meta = {
  title: 'React Aria Components/CheckboxGroup',
  component: VueCheckbox
} satisfies Meta<typeof VueCheckbox>;

export default meta;

type CheckboxGroupStory = StoryObj<typeof meta>;

export const CheckboxGroupExample: CheckboxGroupStory = {
  render: () => ({
    components: {
      VueCheckbox
    },
    template: `
      <div class="react-aria-CheckboxGroup" data-rac="" role="group" aria-labelledby="favorite-sports-label">
        <span class="react-aria-Label" id="favorite-sports-label">Favorite sports</span>
        <VueCheckbox value="soccer"><div class="checkbox" aria-hidden="true"><svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg></div>Soccer</VueCheckbox>
        <VueCheckbox value="baseball"><div class="checkbox" aria-hidden="true"><svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg></div>Baseball</VueCheckbox>
        <VueCheckbox value="basketball"><div class="checkbox" aria-hidden="true"><svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg></div>Basketball</VueCheckbox>
      </div>
    `
  })
};

export const CheckboxGroupSubmitExample: CheckboxGroupStory = {
  render: () => ({
    components: {
      VueCheckbox
    },
    template: `
      <form class="react-aria-Form">
        <div class="react-aria-CheckboxGroup" data-rac="" role="group" aria-labelledby="favorite-sports-submit-label" data-required="true">
          <span class="react-aria-Label" id="favorite-sports-submit-label">Favorite sports</span>
          <VueCheckbox value="soccer"><div class="checkbox" aria-hidden="true"><svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg></div>Soccer</VueCheckbox>
          <VueCheckbox value="baseball"><div class="checkbox" aria-hidden="true"><svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg></div>Baseball</VueCheckbox>
          <VueCheckbox value="basketball"><div class="checkbox" aria-hidden="true"><svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg></div>Basketball</VueCheckbox>
        </div>
        <button class="react-aria-Button" data-rac="" type="submit" tabindex="0" data-react-aria-pressable="true">Submit</button>
        <button class="react-aria-Button" data-rac="" type="reset" tabindex="0" data-react-aria-pressable="true">Reset</button>
      </form>
    `
  })
};
