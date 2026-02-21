import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueButton, VueForm, VueTextField} from '@vue-spectrum/components';
import {ref} from 'vue';

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
      VueTextField,
      VueButton
    },
    setup() {
      let value = ref('');
      return {
        args,
        value
      };
    },
    template: `
      <VueForm>
        <VueTextField
          v-model="value"
          label="Email"
          description="Required"
          :is-invalid="args.isInvalid" />
        <VueButton type="submit">Submit</VueButton>
        <VueButton type="reset">Reset</VueButton>
      </VueForm>
    `
  })
};
