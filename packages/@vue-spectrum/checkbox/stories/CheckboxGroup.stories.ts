import {action} from '@storybook/addon-actions';
import {Checkbox, CheckboxGroup} from '../src';
import {computed, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryArgs = Record<string, unknown>;
type CheckboxProps = Record<string, boolean | string | undefined>;
type RenderOptions = {
  checkboxProps?: CheckboxProps[],
  fixedWidth?: boolean,
  initialValue?: string[],
  note?: string
};

const meta: Meta<typeof CheckboxGroup> = {
  title: 'CheckboxGroup',
  component: CheckboxGroup,
  args: {
    label: 'Pets'
  },
  argTypes: {
    description: {
      control: 'text'
    },
    invalid: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    isInvalid: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    modelValue: {
      table: {
        disable: true
      }
    },
    validationState: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderCheckboxGroup(args: StoryArgs = {}, options: RenderOptions = {}) {
  let {
    checkboxProps = [{}, {}, {}],
    fixedWidth = false,
    initialValue = [],
    note
  } = options;
  return {
    components: {Checkbox, CheckboxGroup},
    setup() {
      let checked = ref<string[]>([...initialValue]);
      let checkboxOptions = checkboxProps;
      let isValidSelection = computed(() => checked.value.length === 2 && checked.value.includes('dogs') && checked.value.includes('dragons'));
      let errorMessage = computed(() => checked.value.includes('cats') ? 'No cats allowed.' : 'Select only dogs and dragons.');
      let onUpdate = (value: string[]) => {
        checked.value = value;
        action('onChange')(value);
      };

      return {
        args,
        checked,
        checkboxOptions,
        errorMessage,
        fixedWidth,
        isValidSelection,
        note,
        onUpdate
      };
    },
    template: `
      <div :style="{display: 'grid', gap: '8px', width: fixedWidth ? '480px' : 'auto'}">
        <div v-if="note">{{note}}</div>
        <CheckboxGroup
          v-bind="args"
          :description="fixedWidth ? 'Select a pet.' : args.description"
          :is-invalid="fixedWidth ? !isValidSelection : args.isInvalid"
          :model-value="checked"
          @update:model-value="onUpdate">
          <Checkbox value="dogs" v-bind="checkboxOptions[0]">Dogs</Checkbox>
          <Checkbox value="cats" v-bind="checkboxOptions[1]">Cats</Checkbox>
          <Checkbox value="dragons" v-bind="checkboxOptions[2]">Dragons</Checkbox>
        </CheckboxGroup>
        <div v-if="fixedWidth" style="font-size: 12px; color: #c81e1e;">{{errorMessage}}</div>
      </div>
    `
  };
}

export const Default: Story = {
  render: (args) => renderCheckboxGroup(args)
};

export const DefaultValue: Story = {
  render: (args) => renderCheckboxGroup(args, {initialValue: ['dragons']}),
  name: 'defaultValue: dragons'
};

export const ControlledValue: Story = {
  render: (args) => renderCheckboxGroup(args, {initialValue: ['dragons']}),
  name: 'controlled: dragons'
};

export const OneCheckboxDisabled: Story = {
  render: (args) => renderCheckboxGroup(args, {checkboxProps: [{}, {isDisabled: true}, {}]}),
  name: 'isDisabled on one checkbox'
};

export const TwoCheckboxDisabled: Story = {
  render: (args) => renderCheckboxGroup(args, {
    checkboxProps: [{}, {isDisabled: true}, {isDisabled: true}],
    initialValue: ['dragons']
  }),
  name: 'isDisabled two checkboxes and one checked'
};

export const OneInvalidCheckbox: Story = {
  render: (args) => renderCheckboxGroup(args, {checkboxProps: [{}, {isInvalid: true}, {}]}),
  name: 'validationState: "invalid" on one checkbox'
};

export const FixedWidth: Story = {
  render: (args) => renderCheckboxGroup(args, {fixedWidth: true, initialValue: ['dogs', 'dragons']}),
  name: 'with description, error message and validation, fixed width'
};

export const ContextualHelpStory: Story = {
  render: (args) => renderCheckboxGroup(args, {note: 'contextual help parity scenario'}),
  name: 'contextual help'
};

export const AutoFocus: Story = {
  render: (args) => renderCheckboxGroup(args, {checkboxProps: [{}, {autoFocus: true}, {}]}),
  name: 'autoFocus on one checkbox'
};

export const ControlledGroup: Story = {
  render: (args) => renderCheckboxGroup(args),
  name: 'controlled'
};
