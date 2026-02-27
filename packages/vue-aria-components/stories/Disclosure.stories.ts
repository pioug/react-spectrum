import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {ref} from 'vue';
import {VueDisclosure, VueDisclosurePanel, VueDisclosureTitle} from 'vue-aria-components';
import '../../react-aria-components/stories/styles.css';

const meta = {
  title: 'React Aria Components/Disclosure',
  component: VueDisclosure
} satisfies Meta<typeof VueDisclosure>;

export default meta;

export const DisclosureExample: StoryFn<typeof VueDisclosure> = () => ({
  components: {
    VueDisclosure,
    VueDisclosurePanel,
    VueDisclosureTitle
  },
  setup() {
    let isExpanded = ref(false);

    return {
      isExpanded,
      onToggle(nextValue: boolean) {
        isExpanded.value = nextValue;
      }
    };
  },
  template: `
    <VueDisclosure @toggle="onToggle">
      <VueDisclosureTitle>{{ isExpanded ? '⬇️' : '➡️' }} This is a disclosure header</VueDisclosureTitle>
      <VueDisclosurePanel>
        <p>This is the content of the disclosure panel.</p>
      </VueDisclosurePanel>
    </VueDisclosure>
  `
});

export const DisclosureControlledExample: StoryFn<typeof VueDisclosure> = () => ({
  components: {
    VueDisclosure,
    VueDisclosurePanel,
    VueDisclosureTitle
  },
  setup() {
    let isExpanded = ref(false);

    return {
      isExpanded
    };
  },
  template: `
    <VueDisclosure :expanded="isExpanded" @update:expanded="isExpanded = $event">
      <VueDisclosureTitle>{{ isExpanded ? '⬇️' : '➡️' }} This is a disclosure header</VueDisclosureTitle>
      <VueDisclosurePanel>
        <p>This is the content of the disclosure panel.</p>
      </VueDisclosurePanel>
    </VueDisclosure>
  `
});
