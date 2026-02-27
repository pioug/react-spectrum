import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueSearchField} from 'vue-aria-components';
import {ref} from 'vue';
import '../../react-aria-components/example/index.css';
import '../../react-aria-components/stories/styles.css';

const meta = {
  title: 'React Aria Components/SearchField',
  component: VueSearchField
} satisfies Meta<typeof VueSearchField>;

export default meta;

export const SearchFieldExample: StoryFn<typeof VueSearchField> = () => ({
  components: {
    VueSearchField
  },
  setup() {
    let query = ref('');

    return {
      query
    };
  },
  template: `
    <VueSearchField
      v-model="query"
      label="Search"
      data-testid="search-field-example"
      class="searchFieldExample" />
  `
});
