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
  defaultValue?: number,
  description?: string,
  errorMessage?: string,
  hideStepper?: boolean,
  isDisabled?: boolean,
  isInvalid?: boolean,
  isQuiet?: boolean,
  isReadOnly?: boolean,
  isRequired?: boolean,
  labelAlign?: 'start' | 'end',
  label?: string,
  labelPosition?: 'top' | 'side',
  max?: number,
  maxValue?: number,
  min?: number,
  minValue?: number,
  modelValue?: number | null,
  necessityIndicator?: 'icon' | 'label',
  placeholder?: string,
  step?: number,
  validationState?: 'invalid' | 'valid',
  value?: number
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
  providerSwitcher: {status: 'notice'},
  component: NumberField
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderNumberField(baseArgs: NumberFieldStoryArgs = {}, styleValue?: string) {
  return (args: NumberFieldStoryArgs) => ({
    components: {NumberField},
    setup() {
      let mergedArgs = computed(() => ({label: 'Width', ...args, ...baseArgs}));
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
  render: renderNumberField()
};

export const DefaultValue10: Story = {
  render: renderNumberField({defaultValue: 10})
};

export const Value10: Story = {
  render: renderNumberField({value: 10})
};

export const MaximumFractionDigits0: Story = {
  render: renderNumberField({step: 1})
};

export const Currency: Story = {
  render: renderNumberField({label: 'Price'})
};

export const Percent: Story = {
  render: renderNumberField({label: 'Tax'})
};

export const PercentMaxFractionDigits2NoMinFractionDigits: Story = {
  render: renderNumberField({
    label: 'Tax',
    step: 0.01
  })
};

export const PercentMin2Max2FractionDigits: Story = {
  render: renderNumberField({
    label: 'Tax',
    step: 0.01
  })
};

export const PercentMin2Max3FractionDigits: Story = {
  render: renderNumberField({
    label: 'Tax',
    step: 0.001
  })
};

export const MinValue00FractionDigits: Story = {
  render: renderNumberField({
    minValue: 0,
    step: 1
  })
};

export const PercentUsingSign: Story = {
  render: renderNumberField({label: 'Tax'})
};

export const Disabled: Story = {
  render: renderNumberField({isDisabled: true})
};

export const Readonly: Story = {
  render: renderNumberField({
    isReadOnly: true,
    defaultValue: 10
  })
};

export const IsQuiet: Story = {
  render: renderNumberField({isQuiet: true})
};

export const QuietDisabled: Story = {
  render: renderNumberField({
    isQuiet: true,
    isDisabled: true,
    defaultValue: 10
  })
};

export const QuietReadonly: Story = {
  render: renderNumberField({
    isQuiet: true,
    isReadOnly: true,
    defaultValue: 10
  })
};

export const ValidationStateInvalid: Story = {
  render: renderNumberField({validationState: 'invalid'})
};

export const ValidationStateValid: Story = {
  render: renderNumberField({validationState: 'valid'})
};

export const ValidationStateInvalidIsQuiet: Story = {
  render: renderNumberField({
    validationState: 'invalid',
    isQuiet: true
  })
};

export const ValidationStateValidIsQuiet: Story = {
  render: renderNumberField({
    validationState: 'valid',
    isQuiet: true
  })
};

export const MinValue0MaxValue20: Story = {
  render: renderNumberField({minValue: 0, maxValue: 20})
};

export const MinValue0MaxValue20Quiet: Story = {
  render: renderNumberField({
    isQuiet: true,
    minValue: 0,
    maxValue: 20
  })
};

export const MinValue50MaxValue20: Story = {
  render: renderNumberField({minValue: -50, maxValue: -20})
};

export const MinValue20MaxValue50: Story = {
  render: renderNumberField({minValue: 20, maxValue: 50})
};

export const MinValue0DefaultValue0: Story = {
  render: renderNumberField({minValue: 0, defaultValue: 0})
};

export const Step5: Story = {
  render: renderNumberField({step: 5})
};

export const Step3WithMin2Max21: Story = {
  render: renderNumberField({
    step: 3,
    minValue: 2,
    maxValue: 21
  })
};

export const AutoFocus: Story = {
  render: renderNumberField({autoFocus: true})
};

export const HideStepper: Story = {
  render: renderNumberField({hideStepper: true})
};

export const IsQuietHideStepper: Story = {
  render: renderNumberField({
    isQuiet: true,
    hideStepper: true
  })
};

export const Required: Story = {
  render: renderNumberField({isRequired: true})
};

export const Optional: Story = {
  render: renderNumberField({necessityIndicator: 'label'})
};

export const RequiredWithLabel: Story = {
  render: renderNumberField({
    isRequired: true,
    necessityIndicator: 'label'
  })
};

export const LabelTopEnd: Story = {
  render: renderNumberField({
    isRequired: true,
    labelPosition: 'top',
    labelAlign: 'end'
  })
};

export const LabelSide: Story = {
  render: renderNumberField({
    isRequired: true,
    labelPosition: 'side'
  })
};

export const NoVisibleLabel: Story = {
  render: renderNoLabel({isRequired: true})
};

export const QuietNoVisibleLabel: Story = {
  render: renderNoLabel({isQuiet: true, isRequired: true})
};

export const QuietNoVisibleLabelHidestepper: Story = {
  render: renderNoLabel({hideStepper: true, isQuiet: true, isRequired: true})
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
  })
};

export const WithDescriptionNoVisibleLabel: Story = {
  render: renderNoLabel({description: 'Please select your age.'}, 'Age')
};

export const WithErrorMessageLabelPositionSide: Story = {
  render: renderNumberField({
    labelPosition: 'side',
    errorMessage: 'Please enter a positive number.',
    validationState: 'invalid'
  })
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
  })
};

export const CustomWidth: Story = {
  render: renderNumberField({}, 'width: var(--spectrum-global-dimension-size-3000);')
};

export const QuietCustomWidth: Story = {
  render: renderNumberField({isQuiet: true}, 'width: var(--spectrum-global-dimension-size-3000);')
};

export const CustomWidthNoVisibleLabel: Story = {
  render: renderNoLabel({isRequired: true}, 'Width', 'width: var(--spectrum-global-dimension-size-3000);')
};

export const CustomWidthLabelPositionSide: Story = {
  render: renderNumberField({description: 'labelPosition: side'}, 'width: var(--spectrum-global-dimension-size-3000);')
};

export const Controlled: Story = {
  render: (args: NumberFieldStoryArgs) => ({
    components: {NumberFieldControlled},
    setup() {
      return {args};
    },
    template: '<NumberFieldControlled :args="args" />'
  })
};

export const CurrencySwitcher: Story = {
  render: (args: NumberFieldStoryArgs) => ({
    components: {NumberFieldWithCurrencySelect},
    setup() {
      return {args};
    },
    template: '<NumberFieldWithCurrencySelect :args="args" />'
  })
};

export const Flexed: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {NumberField},
    template: `
      <div style="display: flex; width: 100%; align-items: end; gap: var(--spectrum-global-dimension-size-200);">
        <NumberField class="custom_classname" label="Grows" style="flex-grow: 1;" />
        <NumberField class="custom_classname" label="Static" />
        <NumberField aria-label="Grows" class="custom_classname" label="" style="flex-grow: 1;" />
        <NumberField aria-label="Static" class="custom_classname" label="" />
      </div>
    `
  })
};

export const MinWidth: Story = {
  render: renderNumberField({}, 'width: 0; min-width: 0;')
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
  })
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
  })
};

export const ResetControlledStateToBlankWithNull: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {NumberFieldControlledStateReset},
    template: '<NumberFieldControlledStateReset />'
  })
};
