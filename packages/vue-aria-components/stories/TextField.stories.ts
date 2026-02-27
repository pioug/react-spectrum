import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {computed, ref} from 'vue';
import {VueForm, VueTextField} from 'vue-aria-components';
import '../../react-aria-components/example/index.css';
import '../../react-aria-components/stories/styles.css';

const meta = {
  title: 'React Aria Components/TextField',
  component: VueTextField
} satisfies Meta<typeof VueTextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TextfieldExample: Story = {
  render: () => ({
    components: {
      VueTextField
    },
    setup() {
      let value = ref('');
      return {
        value
      };
    },
    template: `
      <VueTextField
        data-testid="textfield-example"
        v-model="value"
        label="First name" />
    `
  })
};

export const TextFieldSubmitExample: Story = {
  args: {
    isInvalid: false
  },
  argTypes: {
    isInvalid: {
      control: {
        type: 'boolean'
      }
    }
  },
  parameters: {
    description: {
      data: 'Non controlled isInvalid should render the default error message (aka just hit submit and see that it appears). Controlled isInvalid=true should not render the error message div (aka no padding should appear between the input and the buttons).'
    }
  },
  render: (args: {isInvalid?: boolean}) => ({
    components: {
      VueForm,
      VueTextField
    },
    setup() {
      let value = ref('');
      let isSubmitted = ref(false);
      let isControlledInvalid = computed(() => Boolean(args.isInvalid));
      let hasClientError = computed(() => {
        if (!isSubmitted.value) {
          return false;
        }

        return !value.value.includes('@');
      });
      let showErrorMessage = computed(() => !isControlledInvalid.value && hasClientError.value);
      let isInvalid = computed(() => isControlledInvalid.value || hasClientError.value);

      let onSubmit = (event: Event) => {
        event.preventDefault();
        isSubmitted.value = true;
      };

      let onReset = (event: Event) => {
        event.preventDefault();
        value.value = '';
        isSubmitted.value = false;
      };

      return {
        isInvalid,
        onReset,
        onSubmit,
        showErrorMessage,
        value
      };
    },
    template: `
      <VueForm @submit="onSubmit" @reset="onReset">
        <VueTextField
          class="textfieldExample"
          name="email"
          type="email"
          required
          :invalid="isInvalid"
          v-model="value"
          label="Email" />
        <span v-if="showErrorMessage" class="errorMessage">Constraints not satisfied</span>
        <button class="react-aria-Button" data-rac="" type="submit" tabindex="0" data-react-aria-pressable="true">Submit</button>
        <button class="react-aria-Button" data-rac="" type="reset" tabindex="0" data-react-aria-pressable="true">Reset</button>
      </VueForm>
    `
  })
};
