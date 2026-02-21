import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueDisclosure, VueDisclosurePanel, VueDisclosureTitle} from '@vue-spectrum/components';
import {computed, ref} from 'vue';

const meta = {
  title: 'React Aria Components/Disclosure',
  component: VueDisclosure
} satisfies Meta<typeof VueDisclosure>;

export default meta;

export const DisclosureExample: StoryFn<typeof VueDisclosure> = (args: {disabled?: boolean}) => ({
  components: {
    VueDisclosure,
    VueDisclosurePanel,
    VueDisclosureTitle
  },
  setup() {
    return {
      args
    };
  },
  template: `
    <VueDisclosure :disabled="args.disabled ?? false">
      <VueDisclosureTitle>This is a disclosure header</VueDisclosureTitle>
      <VueDisclosurePanel>
        <p>This is the content of the disclosure panel.</p>
      </VueDisclosurePanel>
    </VueDisclosure>
  `
});

export const DisclosureControlledExample: StoryFn<typeof VueDisclosure> = (args: {disabled?: boolean}) => ({
  components: {
    VueDisclosure,
    VueDisclosurePanel,
    VueDisclosureTitle
  },
  setup() {
    let isExpanded = ref(false);
    let instanceSeed = ref(0);
    let disclosureKey = computed(() => `${instanceSeed.value}-${isExpanded.value ? 'open' : 'closed'}`);
    let toggleFromControl = () => {
      isExpanded.value = !isExpanded.value;
      instanceSeed.value += 1;
    };
    let onToggle = (expanded: boolean) => {
      isExpanded.value = expanded;
    };

    return {
      args,
      disclosureKey,
      isExpanded,
      onToggle,
      toggleFromControl
    };
  },
  template: `
    <div>
      <button @click="toggleFromControl">
        {{ isExpanded ? 'Collapse' : 'Expand' }}
      </button>
      <VueDisclosure
        :key="disclosureKey"
        :default-expanded="isExpanded"
        :disabled="args.disabled ?? false"
        @toggle="onToggle">
        <VueDisclosureTitle>This is a disclosure header</VueDisclosureTitle>
        <VueDisclosurePanel>
          <p>This is the content of the disclosure panel.</p>
        </VueDisclosurePanel>
      </VueDisclosure>
    </div>
  `
});
