import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueSearchField} from 'vue-aria-components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/SearchField',
  component: VueSearchField
} satisfies Meta<typeof VueSearchField>;

export default meta;

export const SearchFieldExample: StoryFn<typeof VueSearchField> = () => ({
  setup() {
    let query = ref('');

    return {
      clear() {
        query.value = '';
      },
      query
    };
  },
  template: `
    <div
      data-testid="search-field-example"
      class="v7C2Sq_searchFieldExample"
      :data-empty="query === '' ? 'true' : undefined"
      data-rac="">
      <label class="react-aria-Label">Search</label>
      <input class="react-aria-Input" type="search" v-model="query">
      <button aria-label="Clear search" class="react-aria-Button" tabindex="-1" type="button" @click="clear">✕</button>
    </div>
  `
});
