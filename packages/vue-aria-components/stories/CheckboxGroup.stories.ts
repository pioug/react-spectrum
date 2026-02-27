import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueCheckbox} from 'vue-aria-components';
import {ref} from 'vue';

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

      return {
        baseball,
        basketball,
        soccer
      };
    },
    template: `
      <div class="react-aria-CheckboxGroup" data-rac="" role="group" aria-labelledby="favorite-sports-label">
        <span class="react-aria-Label" id="favorite-sports-label">Favorite sports</span>
        <VueCheckbox v-model="soccer"><div class="checkbox" aria-hidden="true"><svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg></div>Soccer</VueCheckbox>
        <VueCheckbox v-model="baseball"><div class="checkbox" aria-hidden="true"><svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg></div>Baseball</VueCheckbox>
        <VueCheckbox v-model="basketball"><div class="checkbox" aria-hidden="true"><svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg></div>Basketball</VueCheckbox>
      </div>
    `
  })
};

export const CheckboxGroupSubmitExample: CheckboxGroupStory = {
  render: () => ({
    components: {
      VueCheckbox
    },
    setup() {
      let soccer = ref(false);
      let baseball = ref(false);
      let basketball = ref(false);
      let isInvalid = ref(false);

      let hasSelection = () => soccer.value || baseball.value || basketball.value;
      let clearInvalidOnChange = () => {
        if (hasSelection()) {
          isInvalid.value = false;
        }
      };
      let onSubmit = () => {
        isInvalid.value = !hasSelection();
      };
      let onReset = () => {
        soccer.value = false;
        baseball.value = false;
        basketball.value = false;
        isInvalid.value = false;
      };

      return {
        soccer,
        baseball,
        basketball,
        isInvalid,
        clearInvalidOnChange,
        onSubmit,
        onReset
      };
    },
    template: `
      <form class="react-aria-Form" @submit.prevent="onSubmit" @reset.prevent="onReset">
        <div
          class="react-aria-CheckboxGroup"
          data-rac=""
          role="group"
          aria-labelledby="favorite-sports-submit-label"
          data-required="true"
          :data-invalid="isInvalid ? 'true' : undefined">
          <span class="react-aria-Label" id="favorite-sports-submit-label">Favorite sports</span>
          <VueCheckbox v-model="soccer" value="soccer" @change="clearInvalidOnChange"><div class="checkbox" aria-hidden="true"><svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg></div>Soccer</VueCheckbox>
          <VueCheckbox v-model="baseball" value="baseball" @change="clearInvalidOnChange"><div class="checkbox" aria-hidden="true"><svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg></div>Baseball</VueCheckbox>
          <VueCheckbox v-model="basketball" value="basketball" @change="clearInvalidOnChange"><div class="checkbox" aria-hidden="true"><svg viewBox="0 0 18 18"><polyline points="1 9 7 14 15 4" /></svg></div>Basketball</VueCheckbox>
        </div>
        <button class="react-aria-Button" data-rac="" type="submit" tabindex="0" data-react-aria-pressable="true">Submit</button>
        <button class="react-aria-Button" data-rac="" type="reset" tabindex="0" data-react-aria-pressable="true">Reset</button>
      </form>
    `
  })
};
