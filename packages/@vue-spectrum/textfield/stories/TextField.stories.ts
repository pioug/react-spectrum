import {action} from '@storybook/addon-actions';
import {computed, ref} from 'vue';
import {TextField} from '@vue-spectrum/textfield';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type TextFieldStoryArgs = {
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
  pattern?: string,
  placeholder?: string,
  type?: string,
  validationState?: 'invalid' | 'valid',
  value?: string,
  width?: number | string
};

const localeStrings: Record<string, string> = {
  'ar-AE': 'عِرِفِتـــانٍ خانٍِ',
  'en-US': '123 Main St.',
  'fr-FR': 'Ligne alphabétique',
  'ja-JP': 'アルファベット順',
  'ru-RU': 'Алфавитный порядок'
};

const zalgoString = 'i̶͖̊́̃̒̄͆̚͝t̶̢̢̧̺̻̘̖̗͉̟̞̭̀̀͒͂͐̐̄̇́͒̅̆́\'̶̯̳̑͑͛͐͋̈́̆̇̓͝͝s̵͙͇͉̪̉̈́̐̌̌̃̓͝';

const meta = {
  title: 'TextField',
  component: TextField,
  excludeStories: ['renderTextField', 'localeStrings', 'zalgoString'],
  args: {
    label: 'Street address',
    isQuiet: false,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false
  },
  argTypes: {
    validationState: {
      control: {
        type: 'radio'
      },
      options: [undefined, 'valid', 'invalid']
    }
  }
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

function renderTextField(baseArgs: Partial<TextFieldStoryArgs> = {}) {
  return (args: TextFieldStoryArgs) => ({
    components: {TextField},
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
      <TextField
        v-bind="mergedArgs"
        @blur="onBlur"
        @change="onChange"
        @focus="onFocus" />
    `
  });
}

export const Default: Story = {
  render: renderTextField()
};

export const ValueTestControlled: Story = {
  render: renderTextField({
    value: 'Test'
  }),
  name: 'value: Test (controlled)'
};

export const DefaultValueTestUncontrolled: Story = {
  render: renderTextField({
    defaultValue: 'Test'
  }),
  name: 'defaultValue: Test (uncontrolled)'
};

export const TypeEmail: Story = {
  render: renderTextField({
    type: 'email'
  }),
  name: 'type: email'
};

export const Pattern09: Story = {
  render: renderTextField({
    pattern: '[0-9]+'
  }),
  name: 'pattern: [0-9]+'
};

export const AutoFocusTrue: Story = {
  render: renderTextField({
    autoFocus: true
  }),
  name: 'autoFocus: true'
};

export const IconInfo: Story = {
  render: renderTextField({
    icon: 'i'
  }),
  name: 'icon: Info'
};

export const NoVisibleLabel: Story = {
  render: renderTextField({
    label: '',
    ariaLabel: 'Street address'
  }),
  name: 'no visible label'
};

export const WithDescription: Story = {
  render: renderTextField({
    description: 'Please enter your street address.'
  }),
  name: 'with description'
};

export const WithErrorMessage: Story = {
  render: renderTextField({
    errorMessage: 'Please enter a valid street address.',
    validationState: 'invalid'
  }),
  name: 'with error message'
};

export const WithValidState: Story = {
  render: renderTextField({
    value: 'user@example.com',
    validationState: 'valid'
  }),
  name: 'with valid state (shows validation icon)'
};

export const WithValidStateAndDescription: Story = {
  render: renderTextField({
    value: 'user@example.com',
    validationState: 'valid',
    description: 'This email address is valid and will be used for notifications.'
  }),
  name: 'with valid state and description'
};

export const WithDescriptionErrorMessageAndValidation: Story = {
  render: () => ({
    components: {TextField},
    setup() {
      let value = ref('0');
      let isValid = computed(() => /^\d$/.test(value.value));

      return {
        isValid,
        onBlur: action('blur'),
        onFocus: action('focus'),
        value
      };
    },
    template: `
      <TextField
        label="Favorite number"
        :description="'Enter a single digit number.'"
        :error-message="value === '' ? 'Empty input not allowed.' : 'Single digit numbers are 0-9.'"
        :model-value="value"
        :validation-state="isValid ? 'valid' : 'invalid'"
        @update:model-value="value = $event"
        @blur="onBlur"
        @focus="onFocus" />
    `
  }),
  name: 'with description, error message and validation'
};

export const WithContextualHelp: Story = {
  render: renderTextField({
    contextualHelp: 'What is a segment? Segments identify visitor traits, devices, and origins.'
  }),
  name: 'with contextual help'
};

export const CustomWidth: Story = {
  render: renderTextField({
    icon: 'i',
    validationState: 'invalid',
    width: '300px'
  }),
  name: 'custom width'
};

export const CustomWidthSmall: Story = {
  render: renderTextField({
    icon: 'i',
    validationState: 'invalid',
    width: '30px'
  }),
  name: 'custom width small'
};

export const WithDifferentLocaleText: Story = {
  render: () => ({
    components: {TextField},
    setup() {
      let locale = ref<'ar-AE' | 'en-US' | 'fr-FR' | 'ja-JP' | 'ru-RU'>('en-US');
      let isZalgo = ref(false);
      let value = computed(() => isZalgo.value ? zalgoString : localeStrings[locale.value]);
      let cycleLocale = () => {
        let order: Array<'ar-AE' | 'en-US' | 'fr-FR' | 'ja-JP' | 'ru-RU'> = ['en-US', 'fr-FR', 'ja-JP', 'ru-RU', 'ar-AE'];
        let currentIndex = order.indexOf(locale.value);
        locale.value = order[(currentIndex + 1) % order.length];
      };

      return {
        cycleLocale,
        isZalgo,
        locale,
        value
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <TextField label="Sampling of diacritics" :value="value" />
        <div style="display: flex; gap: 8px;">
          <button type="button" @click="cycleLocale">Locale: {{locale}}</button>
          <button type="button" @click="isZalgo = !isZalgo">Toggle Zalgo</button>
        </div>
      </div>
    `
  })
};
