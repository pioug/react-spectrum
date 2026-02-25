import {action} from '@storybook/addon-actions';
import {Form} from '../src';
import {NumberField} from '@vue-spectrum/numberfield';
import {TextField} from '@vue-spectrum/textfield';
import {computed, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type FormStoryArgs = {
  isDisabled?: boolean,
  isEmphasized?: boolean,
  isQuiet?: boolean,
  isRequired?: boolean,
  labelAlign?: 'end' | 'start',
  labelPosition?: 'side' | 'top',
  necessityIndicator?: 'icon' | 'label',
  validationBehavior?: 'aria' | 'native',
  validationState?: 'invalid' | 'valid',
  width?: number
};

const meta: Meta<typeof Form> = {
  title: 'Form',
  component: Form,
  argTypes: {
    labelPosition: {
      control: 'text'
    },
    labelAlign: {
      control: 'text'
    },
    necessityIndicator: {
      control: 'text'
    },
    validationBehavior: {
      control: 'select',
      options: ['aria', 'native']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderForm(baseArgs: FormStoryArgs = {}, width?: number, rtl = false) {
  return (args: FormStoryArgs) => ({
    components: {
      Form,
      NumberField,
      TextField
    },
    setup() {
      let mergedArgs = computed<FormStoryArgs>(() => ({...args, ...baseArgs}));
      let formProps = computed(() => ({
        labelAlign: mergedArgs.value.labelAlign,
        labelPosition: mergedArgs.value.labelPosition,
        necessityIndicator: mergedArgs.value.necessityIndicator,
        validationBehavior: mergedArgs.value.validationBehavior
      }));
      let fieldDescription = computed(() => mergedArgs.value.isEmphasized ? 'Emphasized fields preview' : 'Please fill out this field.');

      return {
        formProps,
        fieldDescription,
        mergedArgs,
        onChange: action('onChange')
      };
    },
    template: `
      <div :style="{maxWidth: '${width ?? 0}px'}" :dir="${rtl ? "'rtl'" : "'ltr'"}">
        <Form v-bind="formProps">
          <TextField
            label="Name"
            :description="fieldDescription"
            :is-disabled="Boolean(mergedArgs.isDisabled)"
            :is-quiet="Boolean(mergedArgs.isQuiet)"
            :is-required="Boolean(mergedArgs.isRequired)"
            :validation-state="mergedArgs.validationState"
            @change="onChange" />
          <NumberField
            label="Quantity"
            :description="fieldDescription"
            :is-disabled="Boolean(mergedArgs.isDisabled)"
            :is-quiet="Boolean(mergedArgs.isQuiet)"
            :is-required="Boolean(mergedArgs.isRequired)"
            :validation-state="mergedArgs.validationState"
            @change="onChange" />
        </Form>
      </div>
    `
  });
}

export const Default: Story = {
  render: renderForm()
};

export const LabelPositionSide: Story = {
  render: renderForm({labelPosition: 'side'}),
  name: 'labelPosition: side'
};

export const CustomWidth: Story = {
  render: renderForm({}, 400),
  name: 'custom width'
};

export const CustomWidthLabelPositionSide: Story = {
  render: renderForm({labelPosition: 'side'}, 400),
  name: 'custom width, labelPosition: side'
};

export const LabelAlignEnd: Story = {
  render: renderForm({labelAlign: 'end'}, 400),
  name: 'labelAlign: end'
};

export const LabelPositionSideLabelAlignEnd: Story = {
  render: renderForm({labelPosition: 'side', labelAlign: 'end'}, 400),
  name: 'labelPosition: side, labelAlign: end'
};

export const FieldsNextToEachOther: Story = {
  render: () => ({
    components: {Form, TextField},
    template: `
      <Form>
        <div style="display: grid; gap: 8px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <TextField label="First Name" description="Please enter your first name." />
            <TextField label="Last Name" description="Please enter your last name." />
          </div>
          <TextField label="Street Address" description="Please include apartment or suite number." />
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
            <TextField label="City" />
            <TextField label="State" />
            <TextField label="Zip code" />
          </div>
        </div>
      </Form>
    `
  }),
  name: 'fields next to each other'
};

export const FieldsWithAutoCompleteProperty: Story = {
  render: () => ({
    components: {Form},
    template: `
      <Form>
        <div style="display: grid; gap: 8px;">
          <label>First Name <input autocomplete="billing given-name" /></label>
          <label>Last Name <input autocomplete="billing family-name" /></label>
          <label>Street Address <textarea autocomplete="billing street-address"></textarea></label>
          <label>City <input autocomplete="billing address-level2" /></label>
          <label>Email <input type="email" autocomplete="billing email" /></label>
        </div>
      </Form>
    `
  }),
  name: 'fields with autoComplete property'
};

export const IsRequiredTrue: Story = {
  render: renderForm({isRequired: true}),
  name: 'isRequired: true'
};

export const IsRequiredTrueNecessityIndicatorLabel: Story = {
  render: renderForm({isRequired: true, necessityIndicator: 'label'}),
  name: 'isRequired: true, necessityIndicator: label'
};

export const IsRequiredFalseNecessityIndicatorLabel: Story = {
  render: renderForm({isRequired: false, necessityIndicator: 'label'}),
  name: 'isRequired: false, necessityIndicator: label'
};

export const IsDisabled: Story = {
  render: renderForm({isDisabled: true}),
  name: 'isDisabled'
};

export const IsQuiet: Story = {
  render: renderForm({isQuiet: true}),
  name: 'isQuiet'
};

export const IsQuietLabelPositionSide: Story = {
  render: renderForm({isQuiet: true, labelPosition: 'side'}),
  name: 'isQuiet, labelPosition: side'
};

export const IsEmphasized: Story = {
  render: renderForm({isEmphasized: true}),
  name: 'isEmphasized'
};

export const ValidationStateInvalid: Story = {
  render: renderForm({validationState: 'invalid'}),
  name: 'validationState: invalid'
};

export const ValidationStateValid: Story = {
  render: renderForm({validationState: 'valid'}),
  name: 'validationState: valid'
};

export const ValidationStateInvalidIsQuietTrue: Story = {
  render: renderForm({validationState: 'invalid', isQuiet: true}),
  name: 'validationState: invalid, isQuiet: true'
};

export const ValidationStateValidIsQuietTrue: Story = {
  render: renderForm({validationState: 'valid', isQuiet: true}),
  name: 'validationState: valid, isQuiet: true'
};

export const FormWithReset: Story = {
  render: () => ({
    components: {Form, TextField},
    setup() {
      let value = ref('Jane');
      return {
        value,
        onReset: action('onReset')
      };
    },
    template: `
      <form @reset="value = ''; onReset()">
        <Form>
          <TextField label="Name" :model-value="value" @update:model-value="value = $event" />
        </Form>
        <div style="margin-top: 8px;">
          <button type="reset">Reset</button>
        </div>
      </form>
    `
  }),
  name: 'form with reset'
};

export const _FormWithSubmit: Story = {
  render: () => ({
    components: {Form, TextField},
    setup() {
      let value = ref('');
      return {
        value,
        onSubmit: action('onSubmit')
      };
    },
    template: `
      <form @submit.prevent="onSubmit(value)">
        <Form>
          <TextField label="Name" :model-value="value" @update:model-value="value = $event" />
        </Form>
        <div style="margin-top: 8px;">
          <button type="submit">Submit</button>
        </div>
      </form>
    `
  }),
  name: 'form with submit'
};

export const FormWithNumberfieldAndLocaleArAe: Story = {
  render: renderForm({}, undefined, true),
  name: 'form with numberfield and locale=ar-AE'
};

export const WithTranslations: Story = {
  render: () => ({
    components: {Form, TextField, NumberField},
    template: `
      <Form>
        <TextField label="Nom" description="Veuillez saisir votre nom." />
        <TextField label="Correo" description="Introduzca su correo electronico." />
        <NumberField label="Anzahl" description="Bitte Menge eingeben." />
      </Form>
    `
  }),
  name: 'with translations'
};

export const NativeValidation: Story = {
  render: renderForm({validationBehavior: 'native'})
};

export const ServerValidation: Story = {
  render: () => ({
    components: {Form, TextField},
    setup() {
      let value = ref('');
      let error = ref('');

      let submit = () => {
        error.value = value.value.length < 3 ? 'Server validation failed: minimum length is 3.' : '';
      };

      return {
        value,
        error,
        submit
      };
    },
    template: `
      <div>
        <Form>
          <TextField
            label="Username"
            :model-value="value"
            :error-message="error"
            :validation-state="error ? 'invalid' : undefined"
            @update:model-value="value = $event" />
        </Form>
        <div style="margin-top: 8px;">
          <button type="button" @click="submit">Validate on server</button>
        </div>
      </div>
    `
  })
};

export const NumberFieldFormSubmit: Story = {
  render: () => ({
    components: {Form, NumberField},
    setup() {
      let value = ref<number | null>(null);
      let submitted = ref<string>('Not submitted');

      let submit = () => {
        submitted.value = `Submitted: ${String(value ?? '')}`;
      };

      return {
        value,
        submitted,
        submit
      };
    },
    template: `
      <form @submit.prevent="submit">
        <Form>
          <NumberField label="Count" :model-value="value" @update:model-value="value = $event" />
        </Form>
        <div style="display: flex; gap: 8px; margin-top: 8px; align-items: center;">
          <button type="submit">Submit</button>
          <span>{{submitted}}</span>
        </div>
      </form>
    `
  })
};

export const FormAction: Story = {
  render: () => ({
    components: {Form, TextField},
    setup() {
      return {
        onSubmit: action('formActionSubmit')
      };
    },
    template: `
      <form action="/example-endpoint" method="post" @submit.prevent="onSubmit()">
        <Form>
          <TextField label="Action form field" />
        </Form>
        <div style="margin-top: 8px;">
          <button type="submit">Submit with action</button>
        </div>
      </form>
    `
  })
};
