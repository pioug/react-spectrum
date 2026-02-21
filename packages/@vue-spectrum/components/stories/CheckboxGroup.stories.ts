import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueButton, VueCheckbox, VueForm} from '@vue-spectrum/components';
import {computed, ref} from 'vue';

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
    setup() {
      let soccer = ref(false);
      let baseball = ref(false);
      let basketball = ref(false);

      let selected = computed(() => [
        soccer.value ? 'soccer' : null,
        baseball.value ? 'baseball' : null,
        basketball.value ? 'basketball' : null
      ].filter((item): item is string => item != null));

      return {
        basketball,
        baseball,
        selected,
        soccer
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <h4 style="margin: 0;">Favorite sports</h4>
        <VueCheckbox v-model="soccer" label="Soccer" />
        <VueCheckbox v-model="baseball" label="Baseball" />
        <VueCheckbox v-model="basketball" label="Basketball" />
        <p style="margin: 0;">Selected: {{ selected.join(', ') || 'none' }}</p>
      </div>
    `
  })
};

export const CheckboxGroupSubmitExample: CheckboxGroupStory = {
  render: () => ({
    components: {
      VueButton,
      VueCheckbox,
      VueForm
    },
    setup() {
      let soccer = ref(false);
      let baseball = ref(false);
      let basketball = ref(false);

      let selected = computed(() => [
        soccer.value ? 'soccer' : null,
        baseball.value ? 'baseball' : null,
        basketball.value ? 'basketball' : null
      ].filter((item): item is string => item != null));

      return {
        basketball,
        baseball,
        selected,
        soccer
      };
    },
    template: `
      <VueForm>
        <h4 style="margin: 0;">Favorite sports</h4>
        <VueCheckbox v-model="soccer" label="Soccer" />
        <VueCheckbox v-model="baseball" label="Baseball" />
        <VueCheckbox v-model="basketball" label="Basketball" />
        <input type="hidden" name="sports" :value="selected.join(',')">
        <VueButton type="submit">Submit</VueButton>
        <VueButton type="reset">Reset</VueButton>
      </VueForm>
    `
  })
};
