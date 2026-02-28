import {action} from 'storybook/actions';
import {Checkbox, CheckboxGroup} from '../src';
import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {computed, h, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

export type CheckboxGroupStory = StoryObj<typeof CheckboxGroup>;

type CheckboxOptionProps = Record<string, unknown>;

const meta: Meta<typeof CheckboxGroup> = {
  title: 'CheckboxGroup',
  component: CheckboxGroup,
  args: {
    label: 'Pets',
    onChange: action('onChange')
  },
  argTypes: {
    onChange: {
      table: {
        disable: true
      }
    },
    contextualHelp: {
      table: {
        disable: true
      }
    },
    defaultValue: {
      table: {
        disable: true
      }
    },
    value: {
      table: {
        disable: true
      }
    },
    isEmphasized: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    isRequired: {
      control: 'boolean'
    },
    necessityIndicator: {
      control: 'select',
      options: ['icon', 'label']
    },
    labelPosition: {
      control: 'select',
      options: ['top', 'side']
    },
    labelAlign: {
      control: 'select',
      options: ['start', 'end']
    },
    isInvalid: {
      control: 'boolean'
    },
    description: {
      control: 'text'
    },
    errorMessage: {
      control: 'text'
    },
    showErrorIcon: {
      control: 'boolean'
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical']
    },
    'aria-label': {
      control: 'text'
    },
    name: {
      control: 'text'
    }
  }
};

export default meta;

function renderGroup(args: Record<string, unknown>, checkboxProps: CheckboxOptionProps[] = [{}, {}, {}]) {
  return {
    components: {Checkbox, CheckboxGroup},
    setup() {
      let options = checkboxProps;
      let onChange = (value: string[]) => {
        (args.onChange as ((value: string[]) => void) | undefined)?.(value);
      };

      return {args, options, onChange};
    },
    template: `
      <CheckboxGroup v-bind="args" label="Pets" @change="onChange">
        <Checkbox value="dogs" v-bind="options[0]">Dogs</Checkbox>
        <Checkbox value="cats" v-bind="options[1]">Cats</Checkbox>
        <Checkbox value="dragons" v-bind="options[2]">Dragons</Checkbox>
      </CheckboxGroup>
    `
  };
}

function renderWithDescriptionErrorMessageAndValidation(args: Record<string, unknown>) {
  return {
    components: {Checkbox, CheckboxGroup},
    setup() {
      let checked = ref<string[]>(['dogs', 'dragons']);
      let isValid = computed(() => checked.value.length === 2 && checked.value.includes('dogs') && checked.value.includes('dragons'));
      let errorMessage = computed(() => checked.value.includes('cats') ? 'No cats allowed.' : 'Select only dogs and dragons.');
      let onChange = (value: string[]) => {
        checked.value = value;
        (args.onChange as ((value: string[]) => void) | undefined)?.(value);
      };

      return {args, checked, errorMessage, isValid, onChange};
    },
    template: `
      <div style="width: 480px;">
        <CheckboxGroup
          v-bind="args"
          label="Pets"
          :model-value="checked"
          :is-invalid="!isValid"
          description="Select a pet."
          :error-message="errorMessage"
          @change="onChange">
          <Checkbox value="dogs">Dogs</Checkbox>
          <Checkbox value="cats">Cats</Checkbox>
          <Checkbox value="dragons">Dragons</Checkbox>
        </CheckboxGroup>
      </div>
    `
  };
}

export const Default: CheckboxGroupStory = {
  render: (args) => renderGroup(args)
};

export const DefaultValue: CheckboxGroupStory = {
  ...Default,
  args: {
    defaultValue: ['dragons']
  },
  name: 'defaultValue: dragons'
};

export const ControlledValue: CheckboxGroupStory = {
  ...Default,
  args: {
    value: ['dragons']
  },
  name: 'controlled: dragons'
};

export const OneCheckboxDisabled: CheckboxGroupStory = {
  render: (args) => renderGroup(args, [{}, {isDisabled: true}, {}]),
  name: 'isDisabled on one checkbox'
};

export const TwoCheckboxDisabled: CheckboxGroupStory = {
  render: (args) => renderGroup({...args, defaultValue: ['dragons']}, [{}, {isDisabled: true}, {isDisabled: true}]),
  name: 'isDisabled two checkboxes and one checked'
};

export const OneInvalidCheckbox: CheckboxGroupStory = {
  render: (args) => renderGroup(args, [{}, {isInvalid: true}, {}]),
  name: 'validationState: "invalid" on one checkbox'
};

export const FixedWidth: CheckboxGroupStory = {
  render: (args) => renderWithDescriptionErrorMessageAndValidation(args),
  name: 'with description, error message and validation, fixed width'
};

export const ContextualHelpStory: CheckboxGroupStory = {
  ...Default,
  render: (args) => ({
    components: {Checkbox, CheckboxGroup, ContextualHelp},
    setup() {
      let onChange = (value: string[]) => {
        (args.onChange as ((value: string[]) => void) | undefined)?.(value);
      };

      let contextualHelp = h(ContextualHelp, {title: 'What is a segment?'}, () => 'Segments identify who your visitors are, what devices and services they use, where they navigated from, and much more.');
      return {args, contextualHelp, onChange};
    },
    template: `
      <CheckboxGroup v-bind="args" label="Pets" :contextual-help="contextualHelp" @change="onChange">
        <Checkbox value="dogs">Dogs</Checkbox>
        <Checkbox value="cats">Cats</Checkbox>
        <Checkbox value="dragons">Dragons</Checkbox>
      </CheckboxGroup>
    `
  }),
  name: 'contextual help'
};

export const AutoFocus: CheckboxGroupStory = {
  render: (args) => renderGroup(args, [{}, {autoFocus: true}, {}]),
  name: 'autoFocus on one checkbox'
};

export const ControlledGroup: CheckboxGroupStory = {
  render: (args) => ({
    components: {Checkbox, CheckboxGroup},
    setup() {
      let checked = ref<string[]>([]);
      let onChange = (value: string[]) => {
        checked.value = value;
        (args.onChange as ((value: string[]) => void) | undefined)?.(value);
      };

      return {args, checked, onChange};
    },
    template: `
      <CheckboxGroup v-bind="args" label="Pets" :model-value="checked" @change="onChange">
        <Checkbox value="dogs">Dogs</Checkbox>
        <Checkbox value="cats">Cats</Checkbox>
        <Checkbox value="dragons">Dragons</Checkbox>
      </CheckboxGroup>
    `
  }),
  name: 'controlled'
};
