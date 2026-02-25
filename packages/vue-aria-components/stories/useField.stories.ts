import {useField} from '@vue-aria/label';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type FieldStoryArgs = {
  description?: string,
  errorMessage?: string,
  label: string,
  validationState?: 'invalid' | 'valid',
  value?: string
};

const meta = {
  title: 'useField'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderField() {
  return (args: FieldStoryArgs) => ({
    setup() {
      let {descriptionProps, errorMessageProps, fieldProps, labelProps} = useField(args);
      return {
        args,
        descriptionProps,
        errorMessageProps,
        fieldProps,
        labelProps
      };
    },
    template: `
      <div>
        <label v-bind="labelProps">{{args.label}}</label>
        <input v-bind="fieldProps" :value="args.value" />
        <div v-bind="descriptionProps">{{args.description}}</div>
        <div v-if="args.validationState === 'invalid'" v-bind="errorMessageProps">{{args.errorMessage}}</div>
      </div>
    `
  });
}

export const NoError: Story = {
  render: renderField(),
  args: {
    label: 'Test label',
    value: 'Test value',
    description: 'I describe the field.',
    errorMessage: "I'm a helpful error for the field."
  }
};

export const WithError: Story = {
  render: renderField(),
  args: {
    label: 'Test label',
    value: 'Test value',
    description: 'I describe the field.',
    errorMessage: "I'm a helpful error for the field.",
    validationState: 'invalid'
  }
};
