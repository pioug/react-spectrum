import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueAccordion, VueButton, VueDisclosure, VueDisclosurePanel, VueDisclosureTitle} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/DisclosureGroup',
  component: VueAccordion
} satisfies Meta<typeof VueAccordion>;

export default meta;

export const DisclosureGroupExample: StoryFn<typeof VueAccordion> = (args: {multiple?: boolean}) => ({
  components: {
    VueAccordion,
    VueButton,
    VueDisclosure,
    VueDisclosurePanel,
    VueDisclosureTitle
  },
  setup() {
    let expanded = ref<string[]>([]);
    let isDisabled = ref(false);
    let toggleDisabled = () => {
      isDisabled.value = !isDisabled.value;
    };

    return {
      args,
      expanded,
      isDisabled,
      toggleDisabled
    };
  },
  template: `
    <div>
      <VueButton @click="toggleDisabled">Toggle Disabled</VueButton>
      <VueAccordion v-model="expanded" :multiple="args.multiple ?? true">
        <VueDisclosure id="first" :disabled="isDisabled">
          <VueDisclosureTitle>This is a disclosure header</VueDisclosureTitle>
          <VueDisclosurePanel>
            <p>This is the content of the disclosure panel.</p>
          </VueDisclosurePanel>
        </VueDisclosure>
        <VueDisclosure id="second" :disabled="isDisabled">
          <VueDisclosureTitle>This is a disclosure header</VueDisclosureTitle>
          <VueDisclosurePanel>
            <p>This is the content of the disclosure panel.</p>
          </VueDisclosurePanel>
        </VueDisclosure>
      </VueAccordion>
    </div>
  `
});
