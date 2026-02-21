import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueButton, VueDateField, VueForm} from '@vue-spectrum/components';
import {ref} from 'vue';

function toDateInputString(value?: number) {
  if (!value) {
    return '';
  }

  let parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toISOString().slice(0, 10);
}

const meta = {
  title: 'React Aria Components/DateField',
  argTypes: {
    onChange: {
      table: {
        disable: true
      }
    },
    granularity: {
      control: 'select',
      options: ['day', 'hour', 'minute', 'second']
    },
    minValue: {
      control: 'date'
    },
    maxValue: {
      control: 'date'
    },
    isRequired: {
      control: 'boolean'
    },
    isInvalid: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    validationBehavior: {
      control: 'select',
      options: ['native', 'aria']
    }
  },
  args: {
    onChange: action('OnChange')
  },
  component: VueDateField
} satisfies Meta<typeof VueDateField>;

export default meta;

export const DateFieldExample: StoryFn<typeof VueDateField> = (props: {
  onChange?: (value: string) => void,
  minValue?: number,
  maxValue?: number,
  isRequired?: boolean,
  isInvalid?: boolean,
  isDisabled?: boolean
}) => ({
  components: {
    VueDateField
  },
  setup() {
    let value = ref('2024-01-01');
    return {
      props,
      value,
      toDateInputString
    };
  },
  template: `
    <VueDateField
      v-model="value"
      data-testid="date-field-example"
      label="Date"
      :min="toDateInputString(props.minValue)"
      :max="toDateInputString(props.maxValue)"
      :required="props.isRequired ?? false"
      :invalid="props.isInvalid ?? false"
      :disabled="props.isDisabled ?? false"
      @change="props.onChange?.($event)" />
  `
});

export const DateFieldAutoFill: StoryFn<typeof VueDateField> = () => ({
  components: {
    VueButton,
    VueDateField,
    VueForm
  },
  setup() {
    let name = ref('');
    let birthday = ref('2021-04-07');
    let onSubmit = (event: SubmitEvent) => {
      let form = event.target as HTMLFormElement | null;
      let entries = form ? Object.fromEntries(new FormData(form).entries()) : {};
      action('onSubmit')(entries);
    };

    return {
      name,
      birthday,
      onSubmit
    };
  },
  template: `
    <VueForm @submit="onSubmit">
      <label for="name">Name</label>
      <input id="name" v-model="name" name="name" type="text" autocomplete="name">

      <VueDateField
        id="bday-field"
        v-model="birthday"
        data-testid="date-field-example"
        label="Date" />
      <input type="hidden" name="bday" :value="birthday">

      <VueButton type="submit">Submit</VueButton>
    </VueForm>
  `
});
