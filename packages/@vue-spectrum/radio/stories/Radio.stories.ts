import {action} from '@storybook/addon-actions';
import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {Provider} from '@vue-spectrum/provider';
import {Radio, RadioGroup} from '../src';
import {computed, defineComponent, ref, watch} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type RadioStoryArgs = {
  description?: string,
  isDisabled?: boolean,
  isEmphasized?: boolean,
  isInvalid?: boolean,
  label?: string,
  modelValue?: string,
  name?: string,
  orientation?: 'horizontal' | 'vertical',
  validationState?: 'invalid' | 'valid'
};

type RadioOptionOverride = {
  autoFocus?: boolean,
  isDisabled?: boolean,
  label: string,
  value: string
};

const ControlledRovingTabPreview = defineComponent({
  name: 'ControlledRovingTabPreview',
  components: {Radio, RadioGroup},
  setup() {
    let selected = ref('1');

    return {
      selected,
      onChange: action('onChange')
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; align-items: center; margin: 16px;">
      <button type="button" @click="selected = '2'">Make it "Two"</button>
      <RadioGroup
        label="Lucky number? (controlled)"
        :model-value="selected"
        @update:model-value="selected = $event; onChange($event)">
        <Radio value="1">One</Radio>
        <Radio value="2">Two</Radio>
        <Radio value="3">Three</Radio>
        <Radio value="4">Four</Radio>
      </RadioGroup>
      <button type="button" @click="selected = '3'">Make it "Three"</button>
    </div>
  `
});

const meta: Meta<typeof RadioGroup> = {
  title: 'RadioGroup',
  component: RadioGroup,
  args: {
    label: 'Favorite pet',
    isEmphasized: false,
    isDisabled: false,
    isInvalid: false
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderRadioGroup(baseArgs: Partial<RadioStoryArgs> = {}, radioProps: Partial<RadioOptionOverride>[] = []) {
  return (args: RadioStoryArgs) => ({
    components: {Radio, RadioGroup},
    setup() {
      let mergedArgs = computed<RadioStoryArgs>(() => ({...args, ...baseArgs}));
      let selectedValue = ref('');

      watch(mergedArgs, (nextArgs) => {
        selectedValue.value = nextArgs.modelValue ?? '';
      }, {deep: true, immediate: true});

      let options: RadioOptionOverride[] = [
        {label: 'Dogs', value: 'dogs', ...radioProps[0]},
        {label: 'Cats', value: 'cats', ...radioProps[1]},
        {label: 'Dragons', value: 'dragons', ...radioProps[2]}
      ];

      let onChange = (value: string) => {
        selectedValue.value = value;
        action('onChange')(value);
      };

      return {
        mergedArgs,
        options,
        onChange,
        selectedValue
      };
    },
    template: `
      <RadioGroup
        :description="mergedArgs.description"
        :is-disabled="mergedArgs.isDisabled"
        :is-emphasized="mergedArgs.isEmphasized"
        :is-invalid="mergedArgs.isInvalid"
        :label="mergedArgs.label"
        :model-value="selectedValue"
        :name="mergedArgs.name ?? 'favorite-pet-group'"
        :orientation="mergedArgs.orientation"
        :validation-state="mergedArgs.validationState"
        @update:model-value="onChange">
        <Radio
          v-for="item in options"
          :key="item.value"
          :auto-focus="item.autoFocus"
          :is-disabled="item.isDisabled"
          :value="item.value">{{item.label}}</Radio>
      </RadioGroup>
    `
  });
}

export const Default: Story = {
  render: renderRadioGroup()
};

export const DefaultValueDragons: Story = {
  render: renderRadioGroup({modelValue: 'dragons'})
};

export const ControlledDragons: Story = {
  render: renderRadioGroup({modelValue: 'dragons'})
};

export const IsDisabledOnOneRadio: Story = {
  render: renderRadioGroup({}, [{}, {isDisabled: true}, {}])
};

export const WithDescription: Story = {
  render: renderRadioGroup({description: 'Please select a pet.'})
};

export const WithErrorMessage: Story = {
  render: renderRadioGroup({
    description: 'Please select a pet.',
    isInvalid: true,
    validationState: 'invalid'
  })
};

export const WithErrorMessageAndErrorIcon: Story = {
  render: renderRadioGroup({
    description: 'Please select a pet. (error icon variant)',
    isInvalid: true,
    validationState: 'invalid'
  })
};

export const WithDescriptionErrorMessageAndValidationFixedWidth: Story = {
  render: () => ({
    components: {Radio, RadioGroup},
    setup() {
      let selected = ref('dogs');
      let isInvalid = computed(() => selected.value !== 'dogs');
      let errorMessage = computed(() => selected.value === 'cats' ? 'No cats allowed.' : 'Please select dogs.');

      return {
        selected,
        isInvalid,
        errorMessage,
        onChange: action('onChange')
      };
    },
    template: `
      <div style="width: 480px;">
        <RadioGroup
          aria-label="Favorite pet"
          :description="isInvalid ? errorMessage : 'Please select a pet.'"
          :is-invalid="isInvalid"
          :model-value="selected"
          @update:model-value="selected = $event; onChange($event)">
          <Radio value="dogs">Dogs</Radio>
          <Radio value="cats">Cats</Radio>
          <Radio value="dragons">Dragons</Radio>
        </RadioGroup>
      </div>
    `
  })
};

export const _ContextualHelp: Story = {
  render: (args: RadioStoryArgs) => ({
    components: {ContextualHelp, Radio, RadioGroup},
    setup() {
      let selected = ref(args.modelValue ?? '');
      return {
        args,
        selected,
        onChange: action('onChange')
      };
    },
    template: `
      <div style="display: flex; align-items: end; gap: 8px;">
        <RadioGroup
          v-bind="args"
          label="Favorite pet"
          :model-value="selected"
          @update:model-value="selected = $event; onChange($event)">
          <Radio value="dogs">Dogs</Radio>
          <Radio value="cats">Cats</Radio>
          <Radio value="dragons">Dragons</Radio>
        </RadioGroup>
        <ContextualHelp title="What is a segment?">
          Segments identify who your visitors are, what devices and services they use, where they navigated from, and much more.
        </ContextualHelp>
      </div>
    `
  })
};

export const NoVisibleLabel: Story = {
  render: renderRadioGroup({label: ''})
};

export const LongRadioLabel: Story = {
  render: () => ({
    components: {Radio, RadioGroup},
    setup() {
      let selected = ref('');
      return {
        selected,
        onChange: action('onChange')
      };
    },
    template: `
      <RadioGroup aria-label="Favorite pet" :model-value="selected" @update:model-value="selected = $event; onChange($event)">
        <Radio value="dogs">Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs Dogs</Radio>
        <Radio value="cats">Cats</Radio>
        <Radio value="dragons">Dragons</Radio>
      </RadioGroup>
    `
  })
};

export const ProviderControlIsDisabled: Story = {
  render: () => ({
    components: {Provider, Radio, RadioGroup},
    template: `
      <Provider :is-disabled="true">
        <div style="display: grid; gap: 12px;">
          <RadioGroup aria-label="Favorite pet" name="favorite-pet-group">
            <Radio value="dogs">Dogs</Radio>
            <Radio value="cats">Cats</Radio>
            <Radio value="dragons">Dragons</Radio>
          </RadioGroup>
          <RadioGroup aria-label="Favorite cereal" name="favorite-cereal-group">
            <Radio value="reeses">Reese's Peanut Butter Puffs</Radio>
            <Radio value="honeynut">HoneyNut Cheerios</Radio>
            <Radio value="cinnamon">Cinnamon Toast Crunch</Radio>
          </RadioGroup>
        </div>
      </Provider>
    `
  })
};

export const AutoFocusOnOneRadio: Story = {
  render: renderRadioGroup({}, [{}, {autoFocus: true}, {}])
};

export const ControlledRovingTab: Story = {
  render: () => ({
    components: {ControlledRovingTabPreview},
    template: '<ControlledRovingTabPreview />'
  })
};
