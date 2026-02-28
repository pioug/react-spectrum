import {ActionButton, Button} from '@vue-spectrum/button';
import {action} from '@storybook/addon-actions';
import {computed, ref} from 'vue';
import {Form} from '@vue-spectrum/form';
import {TextArea} from '@vue-spectrum/textfield';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type TextAreaStoryArgs = {
  ariaLabel?: string,
  autoFocus?: boolean,
  contextualHelp?: string,
  defaultValue?: string,
  description?: string,
  errorMessage?: string,
  icon?: string,
  isDisabled?: boolean,
  isQuiet?: boolean,
  isReadOnly?: boolean,
  isRequired?: boolean,
  label?: string,
  modelValue?: string,
  rows?: number,
  validationState?: 'invalid' | 'valid',
  value?: string,
  width?: number | string
};

const localeStrings: Record<string, string> = {
  'ar-AE': 'عِرِفِتـــانٍ خانٍِ',
  'bg-BG': 'Азбучен ред',
  'cs-CZ': 'Abecední řádek',
  'de-DE': 'Abbruch',
  'en-US': '123 Main St.',
  'es-ES': 'Línea alfabética',
  'fr-FR': 'Ligne alphabétique',
  'it-IT': 'Riga alfabetica',
  'ja-JP': 'アルファベット順',
  'ko-KR': '알파벳 순서',
  'pt-BR': 'Linha alfabética',
  'ru-RU': 'Алфавитный порядок',
  'zh-CN': '字母顺序',
  'zh-TW': '字母順序'
};

const zalgoString = 'i̶͖̊́̃̒̄͆̚͝t̶̢̢̧̺̻̘̖̗͉̟̞̭̀̀͒͂͐̐̄̇́͒̅̆́\'̶̯̳̑͑͛͐͋̈́̆̇̓͝͝s̵͙͇͉̪̉̈́̐̌̌̃̓͝';

const meta = {
  title: 'TextArea',
  providerSwitcher: {status: 'positive'},
  component: TextArea,
  excludeStories: ['renderTextArea', 'renderInFlexLayouts', 'renderValidationExample', 'localeStrings', 'zalgoString'],
  args: {
    label: 'Comments',
    isQuiet: false,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    necessityIndicator: 'icon',
    labelPosition: 'top',
    labelAlign: 'start',
    validationState: undefined
  },
  argTypes: {
    labelPosition: {
      control: {
        type: 'radio',
        options: ['top', 'side']
      }
    },
    necessityIndicator: {
      control: {
        type: 'radio',
        options: ['icon', 'label']
      }
    },
    labelAlign: {
      control: {
        type: 'radio',
        options: ['start', 'end']
      }
    },
    validationState: {
      control: {
        type: 'radio',
        options: [null, 'valid', 'invalid']
      }
    }
  }
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

function renderTextArea(baseArgs: Partial<TextAreaStoryArgs> = {}) {
  return (args: TextAreaStoryArgs) => ({
    components: {TextArea},
    setup() {
      let mergedArgs = computed(() => ({
        ...args,
        ...baseArgs
      }));

      return {
        mergedArgs,
        onBlur: action('blur'),
        onChange: action('change'),
        onFocus: action('focus')
      };
    },
    template: `
      <TextArea
        v-bind="mergedArgs"
        @blur="onBlur"
        @change="onChange"
        @focus="onFocus" />
    `
  });
}

function renderValidationExample(heightStyle?: string) {
  return (args: TextAreaStoryArgs) => ({
    components: {TextArea},
    setup() {
      let value = ref('0');
      let isValid = computed(() => /^\d$/.test(value.value));

      return {
        args,
        heightStyle,
        isValid,
        value
      };
    },
    template: `
      <TextArea
        v-bind="args"
        label="Favorite number"
        :description="'Enter a single digit number.'"
        :error-message="value === '' ? 'Empty input not allowed.' : 'Single digit numbers are 0-9. Lorem ipsum dolor.'"
        :model-value="value"
        :validation-state="isValid ? 'valid' : 'invalid'"
        :style="heightStyle"
        @update:model-value="value = $event" />
    `
  });
}

function renderInFlexLayouts(baseArgs: Partial<TextAreaStoryArgs> = {}) {
  return (args: TextAreaStoryArgs) => ({
    components: {TextArea},
    setup() {
      let mergedArgs = computed(() => ({
        ...args,
        ...baseArgs
      }));

      return {
        mergedArgs
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>Align stretch</div>
        <div style="display: flex; gap: 8px;">
          <TextArea label="Default" v-bind="mergedArgs" />
          <TextArea label="Quiet" is-quiet v-bind="mergedArgs" />
          <TextArea label="Quiet" is-quiet v-bind="mergedArgs" />
        </div>
        <div>Align end</div>
        <div style="display: flex; gap: 8px; align-items: end;">
          <TextArea label="Default" v-bind="mergedArgs" />
          <TextArea label="Quiet" is-quiet v-bind="mergedArgs" />
          <TextArea label="Quiet" is-quiet v-bind="mergedArgs" />
        </div>
        <div>Display block</div>
        <div>
          <TextArea label="Default" v-bind="mergedArgs" />
          <TextArea label="Quiet" is-quiet v-bind="mergedArgs" />
          <TextArea label="Quiet" is-quiet v-bind="mergedArgs" />
        </div>
      </div>
    `
  });
}

export const Default: Story = {
  render: renderTextArea()
};

export const ValueTestControlled: Story = {
  render: renderTextArea({
    value: 'Test'
  }),
  name: 'value: Test (controlled)'
};

export const DefaultValueTestUncontrolled: Story = {
  render: renderTextArea({
    defaultValue: 'Test'
  }),
  name: 'defaultValue: Test (uncontrolled)'
};

export const AutoFocusTrue: Story = {
  render: renderTextArea({
    autoFocus: true
  }),
  name: 'autoFocus: true'
};

export const IconInfo: Story = {
  render: renderTextArea({
    icon: 'i'
  }),
  name: 'icon: Info'
};

export const NoVisibleLabel: Story = {
  render: renderTextArea({
    label: '',
    ariaLabel: 'Street address'
  }),
  name: 'no visible label'
};

export const WithDescription: Story = {
  render: renderTextArea({
    description: 'Enter product feedback.'
  }),
  name: 'with description'
};

export const WithErrorMessage: Story = {
  render: renderTextArea({
    errorMessage: 'Enter at least 250 characters.',
    validationState: 'invalid'
  }),
  name: 'with error message'
};

export const WithContextualHelp: Story = {
  render: renderTextArea({
    contextualHelp: 'What is a segment? Segments identify visitor traits, devices, and origins.'
  }),
  name: 'with contextual help'
};

export const CustomWidth: Story = {
  render: renderTextArea({
    icon: 'i',
    validationState: 'invalid',
    width: '300px'
  }),
  name: 'custom width'
};

export const CustomWidthSmall: Story = {
  render: renderTextArea({
    icon: 'i',
    validationState: 'invalid',
    width: '30px'
  }),
  name: 'custom width small'
};

export const CustomHeightWithLabel: Story = {
  render: (args: TextAreaStoryArgs) => ({
    components: {Form, TextArea},
    setup() {
      return {args};
    },
    template: `
      <Form>
        <div style="display: grid; gap: 12px;">
          <TextArea v-bind="args" label="Custom height" description="height: 120px" style="height: 120px;" />
          <TextArea v-bind="args" label="Custom height" description="height: 120px" is-quiet style="height: 120px;" />
          <TextArea v-bind="args" label="Custom height" description="height: 120px" style="height: 120px;" />
          <TextArea v-bind="args" label="Custom height" description="height: 120px" is-quiet style="height: 120px;" />
        </div>
      </Form>
    `
  }),
  name: 'custom height with label'
};

export const ChangeableHelptext: Story = {
  render: renderValidationExample(),
  name: 'changeable helptext',
  parameters: {
    description: {
      data: 'Verify that the changing size of the error message does not interfere with the height. To test, delete the input, then type the character "a". Height should update to match.'
    }
  }
};

export const ChangeableHelptextCustomHeight: Story = {
  render: renderValidationExample('height: 175px; min-height: 100px; max-height: 50vh;'),
  name: 'changeable helptext custom height',
  parameters: {
    description: {
      data: 'Verify that the changing size of the error message does not interfere with the height. To test, delete the input, then type the character "a". Height should update to match.'
    }
  }
};

export const ControlledInteractive: Story = {
  render: (args: TextAreaStoryArgs) => ({
    components: {Button, TextArea},
    setup() {
      let value = ref('');
      let setText = () => {
        value.value = 'decepticons are evil transformers and should be kicked out of earth';
      };

      return {
        args,
        setText,
        value
      };
    },
    template: `
      <div style="display: grid; gap: 8px; justify-items: start;">
        <TextArea
          v-bind="args"
          is-quiet
          label="megatron"
          :model-value="value"
          @update:model-value="value = $event" />
        <Button variant="primary" @click="setText">Set Text</Button>
      </div>
    `
  }),
  name: 'controlled interactive'
};

export const InFlex: Story = {
  render: renderInFlexLayouts(),
  name: 'in flex'
};

export const InFlexValidationState: Story = {
  render: renderInFlexLayouts({
    validationState: 'invalid'
  }),
  name: 'in flex validation state'
};

export const WithDifferentLocaleText: Story = {
  render: (args: TextAreaStoryArgs) => ({
    components: {ActionButton, TextArea},
    setup() {
      let localeKeys = Object.keys(localeStrings);
      let locale = ref(localeKeys[4]);
      let isZalgo = ref(false);
      let value = computed(() => isZalgo.value ? zalgoString : localeStrings[locale.value]);

      return {
        args,
        isZalgo,
        locale,
        localeKeys,
        value
      };
    },
    template: `
      <div style="display: grid; gap: 8px; justify-items: start;">
        <TextArea v-bind="args" label="Sampling of diacritics" :value="value" />
        <div style="display: flex; gap: 8px; align-items: center;">
          <label>
            Locale
            <select v-model="locale">
              <option v-for="key in localeKeys" :key="key" :value="key">{{key}}</option>
            </select>
          </label>
          <ActionButton @click="isZalgo = !isZalgo">Toggle Zalgo</ActionButton>
        </div>
      </div>
    `
  })
};
