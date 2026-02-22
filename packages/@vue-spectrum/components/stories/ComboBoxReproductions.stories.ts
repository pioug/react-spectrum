import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueComboBox} from '@vue-spectrum/components';
import {ref} from 'vue';
import '../../../react-aria-components/stories/combobox-reproductions.css';
import '../../../react-aria-components/stories/styles.css';

const meta = {
  title: 'React Aria Components/ComboBoxReproductions',
  component: VueComboBox
} satisfies Meta<typeof VueComboBox>;

export default meta;

export type ComboBoxReproductionStory = StoryFn<typeof VueComboBox>;

export const ComboBoxReproductionExample: ComboBoxReproductionStory = () => ({
  components: {
    VueComboBox
  },
  setup() {
    let value = ref('');
    return {
      value
    };
  },
  template: `
    <VueComboBox
      v-model="value"
      label="Favorite Animal"
      :options="[
        'Aardvark',
        'Cat',
        'Dooooooooooooooooooooooooooooooooog',
        'Kangaroo',
        'Panda',
        'Snake'
      ]" />
  `
});
