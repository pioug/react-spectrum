import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueTextField} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/TextField',
  component: VueTextField
} satisfies Meta<typeof VueTextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TextfieldExample: Story = {
  render: () => ({
    template: `
      <div data-testid="textfield-example" class="react-aria-TextField" data-rac="">
        <label class="react-aria-Label">First name</label>
        <input class="react-aria-Input" data-rac="" type="text" value="" title="" />
      </div>
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
    setup: () => ({args}),
    template: `
      <form class="react-aria-Form">
        <div class="react-aria-TextField" data-rac="" data-required="true" style="display: flex; flex-direction: column;">
          <label class="react-aria-Label">Email</label>
          <input class="react-aria-Input" data-rac="" required type="email" value="" name="email" title="" />
        </div>
        <button class="react-aria-Button" data-rac="" type="submit">Submit</button>
        <button class="react-aria-Button" data-rac="" type="reset">Reset</button>
      </form>
    `
  })
};
