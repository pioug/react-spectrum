import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueSearchField} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/SearchField',
  component: VueSearchField
} satisfies Meta<typeof VueSearchField>;

export default meta;

export const SearchFieldExample: StoryFn<typeof VueSearchField> = () => ({
  template: `
    <div
      data-testid="search-field-example"
      class="v7C2Sq_searchFieldExample"
      data-empty="true"
      data-rac="">
      <label class="react-aria-Label">Search</label>
      <input class="react-aria-Input" type="search" value="">
      <button aria-label="Clear search" class="react-aria-Button" tabindex="-1" type="button">✕</button>
    </div>
  `
});
