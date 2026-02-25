import {action} from '@storybook/addon-actions';
import {Button} from '@vue-spectrum/button';
import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {Form} from '@vue-spectrum/form';
import {NumberField} from '../src';
import {Picker} from '@vue-spectrum/picker';
import {computed, defineComponent, ref, type PropType} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type NumberFieldStoryArgs = {
  autoFocus?: boolean,
  description?: string,
  errorMessage?: string,
  hideStepper?: boolean,
  isDisabled?: boolean,
  isInvalid?: boolean,
  isQuiet?: boolean,
  isReadOnly?: boolean,
  isRequired?: boolean,
  label?: string,
  max?: number,
  min?: number,
  modelValue?: number | null,
  placeholder?: string,
  step?: number,
  validationState?: 'invalid' | 'valid'
};

const NumberFieldControlled = defineComponent({
  name: 'NumberFieldControlledStory',
  components: {
    NumberField
  },
  props: {
    args: {
      type: Object as PropType<NumberFieldStoryArgs>,
      required: true
    }
  },
  setup(props) {
    let value = ref<number | null>(10);
    let onChange = action('onChange');

    let handleChange = (nextValue: number | null) => {
      value.value = nextValue;
      onChange(nextValue);
    };

    return {
      props,
      value,
      handleChange
    };
  },
  template: `
    <NumberField
      v-bind="props.args"
      class="custom_classname"
      label="Price"
      :model-value="value"
      @change="handleChange"
      @update:model-value="value = $event" />
  `
});

const NumberFieldWithCurrencySelect = defineComponent({
  name: 'NumberFieldWithCurrencySelectStory',
  components: {
    Form,
    NumberField,
    Picker
  },
  props: {
    args: {
      type: Object as PropType<NumberFieldStoryArgs>,
      required: true
    }
  },
  setup(props) {
    let value = ref<number | null>(10);
    let currency = ref('EUR');
    let currencySign = ref('standard');
    let currencyDisplay = ref('symbol');
    let onChange = action('onChange');

    let currencyItems = [
      {id: 'EUR', label: 'Euro'},
      {id: 'USD', label: 'US Dollar'},
      {id: 'JPY', label: 'Japanese Yen'},
      {id: 'SAR', label: 'Saudi Riyal'}
    ];

    let signItems = [
      {id: 'standard', label: 'Standard'},
      {id: 'accounting', label: 'Accounting'}
    ];

    let displayItems = [
      {id: 'symbol', label: 'Symbol'},
      {id: 'narrowSymbol', label: 'Narrow Symbol'},
      {id: 'code', label: 'Code'},
      {id: 'name', label: 'Name'}
    ];

    let description = computed(() => `Currency: ${currency.value}, sign: ${currencySign.value}, display: ${currencyDisplay.value}`);

    let handleChange = (nextValue: number | null) => {
      value.value = nextValue;
      onChange(nextValue);
    };

    return {
      props,
      value,
      currency,
      currencyDisplay,
      currencyDisplayItems: displayItems,
      currencyItems,
      currencySign,
      currencySignItems: signItems,
      description,
      handleChange
    };
  },
  template: `
    <Form>
      <NumberField
        v-bind="props.args"
        class="custom_classname"
        label="Price"
        :description="description"
        :model-value="value"
        @change="handleChange"
        @update:model-value="value = $event" />
      <Picker
        label="Choose Currency"
        :items="currencyItems"
        :model-value="currency"
        @update:model-value="currency = $event" />
      <Picker
        label="Currency Sign"
        :items="currencySignItems"
        :model-value="currencySign"
        @update:model-value="currencySign = $event" />
      <Picker
        label="Currency Display"
        :items="currencyDisplayItems"
        :model-value="currencyDisplay"
        @update:model-value="currencyDisplay = $event" />
    </Form>
  `
});

const NumberFieldControlledStateReset = defineComponent({
  name: 'NumberFieldControlledStateResetStory',
  components: {
    Button,
    NumberField
  },
  setup() {
    let controlledValue = ref<number | null>(12);

    let reset = () => {
      controlledValue.value = null;
    };

    return {
      controlledValue,
      reset
    };
  },
  template: `
    <div style="display: flex; align-items: end; gap: var(--spectrum-global-dimension-size-200);">
      <NumberField
        aria-label="numberfield to reset"
        class="custom_classname"
        label=""
        :model-value="controlledValue"
        @change="controlledValue = $event"
        @update:model-value="controlledValue = $event" />
      <Button variant="primary" @click="reset">Reset</Button>
    </div>
  `
});

const meta: Meta<typeof NumberField> = {
  title: 'NumberField',
  component: NumberField,
  args: {
    label: 'Width'
  },
  argTypes: {
    autoFocus: {
      control: 'boolean'
    },
    description: {
      control: 'text'
    },
    errorMessage: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    form: {
      control: 'text'
    },
    hideStepper: {
      control: 'boolean'
    },
    id: {
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
    isQuiet: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    isRequired: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    max: {
      control: 'number'
    },
    min: {
      control: 'number'
    },
    modelValue: {
      control: 'number'
    },
    name: {
      control: 'text'
    },
    placeholder: {
      control: 'text'
    },
    readOnly: {
      control: 'boolean'
    },
    required: {
      control: 'boolean'
    },
    step: {
      control: 'number'
    },
    validationState: {
      control: 'select',
      options: [undefined, 'invalid', 'valid']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderNumberField(baseArgs: NumberFieldStoryArgs = {}, styleValue?: string) {
  return (args: NumberFieldStoryArgs) => ({
    components: {NumberField},
    setup() {
      let mergedArgs = computed(() => ({...args, ...baseArgs}));
      return {
        mergedArgs,
        onBlur: action('onBlur'),
        onChange: action('onChange'),
        onFocus: action('onFocus')
      };
    },
    template: `
      <NumberField
        v-bind="mergedArgs"
        ${styleValue ? `style="${styleValue}"` : ''}
        class="custom_classname"
        @blur="onBlur"
        @change="onChange"
        @focus="onFocus" />
    `
  });
}

function renderNoLabel(baseArgs: NumberFieldStoryArgs = {}, ariaLabel = 'Width', styleValue?: string) {
  return (args: NumberFieldStoryArgs) => ({
    components: {NumberField},
    setup() {
      let mergedArgs = computed(() => ({
        ...args,
        ...baseArgs,
        label: ''
      }));

      return {
        mergedArgs,
        onBlur: action('onBlur'),
        onChange: action('onChange'),
        onFocus: action('onFocus')
      };
    },
    template: `
      <NumberField
        v-bind="mergedArgs"
        ${styleValue ? `style="${styleValue}"` : ''}
        aria-label="${ariaLabel}"
        class="custom_classname"
        @blur="onBlur"
        @change="onChange"
        @focus="onFocus" />
    `
  });
}

export const Default: Story = {
  render: renderNumberField(),
  name: 'default'
};

export const DefaultValue10: Story = {
  ...Default,
  args: {modelValue: 10},
  name: 'defaultValue: 10'
};

export const Value10: Story = {
  ...Default,
  args: {modelValue: 10},
  name: 'value: 10'
};

export const MaximumFractionDigits0: Story = {
  ...Default,
  args: {
    modelValue: 10,
    step: 1
  },
  name: 'maximumFractionDigits = 0'
};

export const Currency: Story = {
  ...Default,
  args: {
    label: 'Price',
    modelValue: 10
  },
  name: 'currency'
};

export const Percent: Story = {
  ...Default,
  args: {
    label: 'Tax',
    modelValue: 10
  },
  name: 'percent'
};

export const PercentMaxFractionDigits2NoMinFractionDigits: Story = {
  ...Default,
  args: {
    label: 'Tax',
    modelValue: 10,
    step: 0.01
  },
  name: 'percent, max fraction digits: 2, no min fraction digits'
};

export const PercentMin2Max2FractionDigits: Story = {
  ...Default,
  args: {
    label: 'Tax',
    modelValue: 10,
    step: 0.01
  },
  name: 'percent min = 2 max = 2 fraction digits'
};

export const PercentMin2Max3FractionDigits: Story = {
  ...Default,
  args: {
    label: 'Tax',
    modelValue: 10,
    step: 0.001
  },
  name: 'percent min = 2 max = 3 fraction digits'
};

export const MinValue00FractionDigits: Story = {
  ...Default,
  args: {
    min: 0,
    step: 1
  },
  name: 'minValue = 0, 0 fraction digits'
};

export const PercentUsingSign: Story = {
  ...Default,
  args: {
    label: 'Tax',
    modelValue: 10,
    description: 'Sign display: always'
  },
  name: 'percent using sign'
};

export const Disabled: Story = {
  ...Default,
  args: {isDisabled: true},
  name: 'disabled'
};

export const Readonly: Story = {
  ...Default,
  args: {
    isReadOnly: true,
    modelValue: 10
  },
  name: 'readonly'
};

export const IsQuiet: Story = {
  ...Default,
  args: {isQuiet: true},
  name: 'isQuiet'
};

export const QuietDisabled: Story = {
  ...Default,
  args: {
    isQuiet: true,
    isDisabled: true,
    modelValue: 10
  },
  name: 'quiet disabled'
};

export const QuietReadonly: Story = {
  ...Default,
  args: {
    isQuiet: true,
    isReadOnly: true,
    modelValue: 10
  },
  name: 'quiet readonly'
};

export const ValidationStateInvalid: Story = {
  ...Default,
  args: {validationState: 'invalid'},
  name: 'validationState: invalid'
};

export const ValidationStateValid: Story = {
  ...Default,
  args: {validationState: 'valid'},
  name: 'validationState: valid'
};

export const ValidationStateInvalidIsQuiet: Story = {
  ...Default,
  args: {
    validationState: 'invalid',
    isQuiet: true
  },
  name: 'validationState: invalid, isQuiet'
};

export const ValidationStateValidIsQuiet: Story = {
  ...Default,
  args: {
    validationState: 'valid',
    isQuiet: true
  },
  name: 'validationState: valid, isQuiet'
};

export const MinValue0MaxValue20: Story = {
  ...Default,
  args: {
    min: 0,
    max: 20
  },
  name: 'minValue = 0, maxValue = 20'
};

export const MinValue0MaxValue20Quiet: Story = {
  ...Default,
  args: {
    isQuiet: true,
    min: 0,
    max: 20
  },
  name: 'minValue = 0, maxValue = 20, quiet'
};

export const MinValue50MaxValue20: Story = {
  ...Default,
  args: {
    min: -50,
    max: -20
  },
  name: 'minValue = -50, maxValue = -20'
};

export const MinValue20MaxValue50: Story = {
  ...Default,
  args: {
    min: 20,
    max: 50
  },
  name: 'minValue = 20, maxValue = 50'
};

export const MinValue0DefaultValue0: Story = {
  ...Default,
  args: {
    min: 0,
    modelValue: 0
  },
  name: 'minValue = 0, defaultValue = 0'
};

export const Step5: Story = {
  ...Default,
  args: {step: 5},
  name: 'step = 5'
};

export const Step3WithMin2Max21: Story = {
  ...Default,
  args: {
    step: 3,
    min: 2,
    max: 21
  },
  name: 'step = 3 with min = 2, max = 21'
};

export const AutoFocus: Story = {
  ...Default,
  args: {autoFocus: true},
  name: 'autoFocus'
};

export const HideStepper: Story = {
  ...Default,
  args: {hideStepper: true},
  name: 'hideStepper'
};

export const IsQuietHideStepper: Story = {
  ...Default,
  args: {
    isQuiet: true,
    hideStepper: true
  },
  name: 'isQuiet, hideStepper'
};

export const Required: Story = {
  ...Default,
  args: {isRequired: true},
  name: 'required'
};

export const Optional: Story = {
  ...Default,
  args: {
    description: 'Optional'
  },
  name: 'optional'
};

export const RequiredWithLabel: Story = {
  ...Default,
  args: {
    isRequired: true,
    description: 'Required with label'
  },
  name: 'required with label'
};

export const LabelTopEnd: Story = {
  ...Default,
  args: {
    isRequired: true,
    description: 'labelPosition: top, labelAlign: end'
  },
  name: 'label top end'
};

export const LabelSide: Story = {
  ...Default,
  args: {
    isRequired: true,
    description: 'labelPosition: side'
  },
  name: 'label side'
};

export const NoVisibleLabel: Story = {
  render: renderNoLabel({isRequired: true}),
  name: 'no visible label'
};

export const QuietNoVisibleLabel: Story = {
  render: renderNoLabel({isQuiet: true, isRequired: true}),
  name: 'quiet no visible label'
};

export const QuietNoVisibleLabelHidestepper: Story = {
  render: renderNoLabel({hideStepper: true, isQuiet: true, isRequired: true}),
  name: 'quiet no visible label hidestepper'
};

export const AriaLabelledby: Story = {
  render: () => ({
    components: {NumberField},
    setup() {
      return {
        onBlur: action('onBlur'),
        onChange: action('onChange'),
        onFocus: action('onFocus')
      };
    },
    template: `
      <div>
        <label for="numberfield" id="label">Width</label>
        <NumberField
          id="numberfield"
          aria-labelledby="label"
          class="custom_classname"
          label=""
          :is-required="true"
          @blur="onBlur"
          @change="onChange"
          @focus="onFocus" />
      </div>
    `
  }),
  name: 'aria-labelledby'
};

export const WithDescriptionNoVisibleLabel: Story = {
  render: renderNoLabel({description: 'Please select your age.'}, 'Age'),
  name: 'with description, no visible label'
};

export const WithErrorMessageLabelPositionSide: Story = {
  ...Default,
  args: {
    description: 'labelPosition: side',
    errorMessage: 'Please enter a positive number.',
    validationState: 'invalid'
  },
  name: 'with error message, labelPosition: side'
};

export const _ContextualHelp: Story = {
  render: (args: NumberFieldStoryArgs) => ({
    components: {
      ContextualHelp,
      NumberField
    },
    setup() {
      return {
        args,
        onBlur: action('onBlur'),
        onChange: action('onChange'),
        onFocus: action('onFocus')
      };
    },
    template: `
      <div style="display: flex; align-items: end; gap: var(--spectrum-global-dimension-size-200);">
        <NumberField
          v-bind="args"
          class="custom_classname"
          @blur="onBlur"
          @change="onChange"
          @focus="onFocus" />
        <ContextualHelp title="What is a segment?">
          Segments identify who your visitors are, what devices and services they use, where they navigated from, and much more.
        </ContextualHelp>
      </div>
    `
  }),
  name: 'contextual help'
};

export const CustomWidth: Story = {
  render: renderNumberField({}, 'width: var(--spectrum-global-dimension-size-3000);'),
  name: 'custom width'
};

export const QuietCustomWidth: Story = {
  render: renderNumberField({isQuiet: true}, 'width: var(--spectrum-global-dimension-size-3000);'),
  name: 'quiet custom width'
};

export const CustomWidthNoVisibleLabel: Story = {
  render: renderNoLabel({isRequired: true}, 'Width', 'width: var(--spectrum-global-dimension-size-3000);'),
  name: 'custom width no visible label'
};

export const CustomWidthLabelPositionSide: Story = {
  render: renderNumberField({description: 'labelPosition: side'}, 'width: var(--spectrum-global-dimension-size-3000);'),
  name: 'custom width, labelPosition=side'
};

export const Controlled: Story = {
  render: (args: NumberFieldStoryArgs) => ({
    components: {NumberFieldControlled},
    setup() {
      return {args};
    },
    template: '<NumberFieldControlled :args="args" />'
  }),
  name: 'controlled'
};

export const CurrencySwitcher: Story = {
  render: (args: NumberFieldStoryArgs) => ({
    components: {NumberFieldWithCurrencySelect},
    setup() {
      return {args};
    },
    template: '<NumberFieldWithCurrencySelect :args="args" />'
  }),
  name: 'currency switcher'
};

export const Flexed: Story = {
  render: () => ({
    components: {NumberField},
    template: `
      <div style="display: flex; width: 100%; align-items: end; gap: var(--spectrum-global-dimension-size-200);">
        <NumberField class="custom_classname" label="Grows" style="flex-grow: 1;" />
        <NumberField class="custom_classname" label="Static" />
        <NumberField aria-label="Grows" class="custom_classname" label="" style="flex-grow: 1;" />
        <NumberField aria-label="Static" class="custom_classname" label="" />
      </div>
    `
  }),
  name: 'flexed'
};

export const MinWidth: Story = {
  render: renderNumberField({}, 'width: 0; min-width: 0;'),
  name: 'min width'
};

export const FocusEvents: Story = {
  render: (args: NumberFieldStoryArgs) => ({
    components: {NumberField},
    setup() {
      return {
        args,
        onBlur: action('onBlur'),
        onChange: action('onChange'),
        onFocus: action('onFocus'),
        onFocusChange: action('onFocusChange'),
        onKeyDown: action('onKeyDown'),
        onKeyUp: action('onKeyUp')
      };
    },
    template: `
      <NumberField
        v-bind="args"
        class="custom_classname"
        @blur="onBlur"
        @change="onChange"
        @focus="onFocus"
        @focusin="onFocusChange"
        @focusout="onFocusChange"
        @keydown="onKeyDown"
        @keyup="onKeyUp" />
    `
  }),
  name: 'focus events'
};

export const InputDomEvents: Story = {
  render: (args: NumberFieldStoryArgs) => ({
    components: {NumberField},
    setup() {
      return {
        args,
        onBeforeInput: action('onBeforeInput'),
        onBlur: action('onBlur'),
        onChange: action('onChange'),
        onCompositionEnd: action('onCompositionEnd'),
        onCompositionStart: action('onCompositionStart'),
        onCompositionUpdate: action('onCompositionUpdate'),
        onCopy: action('onCopy'),
        onCut: action('onCut'),
        onFocus: action('onFocus'),
        onInput: action('onInput'),
        onPaste: action('onPaste'),
        onSelect: action('onSelect')
      };
    },
    template: `
      <NumberField
        v-bind="args"
        class="custom_classname"
        @beforeinput="onBeforeInput"
        @blur="onBlur"
        @change="onChange"
        @compositionend="onCompositionEnd"
        @compositionstart="onCompositionStart"
        @compositionupdate="onCompositionUpdate"
        @copy="onCopy"
        @cut="onCut"
        @focus="onFocus"
        @input="onInput"
        @paste="onPaste"
        @select="onSelect" />
    `
  }),
  name: 'input dom events'
};

export const ResetControlledStateToBlankWithNull: Story = {
  render: () => ({
    components: {NumberFieldControlledStateReset},
    template: '<NumberFieldControlledStateReset />'
  }),
  name: 'reset controlled state to blank with null'
};
