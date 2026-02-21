import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueSearchField} from '@vue-spectrum/components';
import {ref} from 'vue';

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
    let value = ref('');
    return {
      value
    };
  },
  template: `
    <VueSearchField
      v-model="value"
      data-testid="search-field-example"
      label="Search" />
  `
});
