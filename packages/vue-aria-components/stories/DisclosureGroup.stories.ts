import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {ref} from 'vue';
import {VueAccordion, VueDisclosure, VueDisclosurePanel, VueDisclosureTitle} from 'vue-aria-components';
import '../../react-aria-components/stories/styles.css';

const meta = {
  title: 'React Aria Components/DisclosureGroup',
  component: VueAccordion
} satisfies Meta<typeof VueAccordion>;

export default meta;

export const DisclosureGroupExample: StoryFn<typeof VueAccordion> = () => ({
  components: {
    VueAccordion,
    VueDisclosure,
    VueDisclosurePanel,
    VueDisclosureTitle
  },
  setup() {
    let expandedKeys = ref<string[]>([]);
    let isDisabled = ref(false);
    let isExpanded = (key: string) => expandedKeys.value.includes(key);
    let toggleDisabled = () => {
      isDisabled.value = !isDisabled.value;
    };

    return {
      expandedKeys,
      isDisabled,
      isExpanded,
      toggleDisabled
    };
  },
  template: `
    <button
      class="react-aria-Button"
      data-rac=""
      data-react-aria-pressable="true"
      type="button"
      @click="toggleDisabled">
      Toggle Disabled
    </button>
    <VueAccordion v-model="expandedKeys">
      <VueDisclosure id="first" :disabled="isDisabled">
        <VueDisclosureTitle>{{ isExpanded('first') ? '⬇️' : '➡️' }} This is a disclosure header</VueDisclosureTitle>
        <VueDisclosurePanel>
          <p>This is the content of the disclosure panel.</p>
        </VueDisclosurePanel>
      </VueDisclosure>
      <VueDisclosure id="second" :disabled="isDisabled">
        <VueDisclosureTitle>{{ isExpanded('second') ? '⬇️' : '➡️' }} This is a disclosure header</VueDisclosureTitle>
        <VueDisclosurePanel>
          <p>This is the content of the disclosure panel.</p>
        </VueDisclosurePanel>
      </VueDisclosure>
    </VueAccordion>
  `
});
