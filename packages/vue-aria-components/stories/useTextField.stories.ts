import {ref} from 'vue';
import {useTextField} from '@vue-aria/textfield';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type TextFieldStoryArgs = {
  autoCapitalize?: 'characters' | 'none' | 'off' | 'on' | 'sentences' | 'words',
  label: string,
  value?: string
};

const meta = {
  title: 'useTextField'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderInputField(args: TextFieldStoryArgs) {
  return {
    setup() {
      let inputRef = ref<HTMLInputElement | null>(null);
      let textField = useTextField({
        autoCapitalize: args.autoCapitalize,
        inputRef,
        label: args.label,
        value: args.value
      });

      return {
        args,
        inputRef,
        textField
      };
    },
    template: `
      <div style="display: grid; gap: 6px; max-width: 280px;">
        <label v-bind="textField.labelProps">{{args.label}}</label>
        <input ref="inputRef" v-bind="textField.inputProps" type="text" />
      </div>
    `
  };
}

function renderTextAreaField(args: TextFieldStoryArgs) {
  return {
    setup() {
      let inputRef = ref<HTMLTextAreaElement | null>(null);
      let textField = useTextField({
        inputElementType: 'textarea',
        inputRef,
        label: args.label,
        value: args.value
      });

      return {
        args,
        inputRef,
        textField
      };
    },
    template: `
      <div style="display: grid; gap: 6px; max-width: 320px;">
        <label v-bind="textField.labelProps">{{args.label}}</label>
        <textarea ref="inputRef" v-bind="textField.inputProps" />
      </div>
    `
  };
}

export const WithHTMLInputElement: Story = {
  render: (args) => renderInputField(args as TextFieldStoryArgs),
  args: {
    label: 'Test label',
    value: 'Test value'
  },
  name: 'With HTML Input Element'
};

export const WithHTMLTextAreaElement: Story = {
  render: (args) => renderTextAreaField(args as TextFieldStoryArgs),
  args: {
    label: 'Test label',
    value: 'Test value'
  },
  name: 'With HTML Text Area Element'
};

export const WithAutoCapitalization: Story = {
  render: (args) => renderInputField(args as TextFieldStoryArgs),
  args: {
    autoCapitalize: undefined,
    label: 'Test label'
  },
  argTypes: {
    autoCapitalize: {
      options: [undefined, 'off', 'none', 'on', 'sentences', 'words', 'characters']
    }
  },
  name: 'With Auto Capitalization'
};
