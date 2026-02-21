import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueButton, VueDatePicker, VueDateRangePicker, VueForm} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/DatePicker',
  component: VueDatePicker,
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
  }
} satisfies Meta<typeof VueDatePicker>;

export default meta;

export const DatePickerExample: StoryFn<typeof VueDatePicker> = (args: {onChange?: (value: string) => void}) => ({
  components: {
    VueDatePicker
  },
  setup() {
    let value = ref('');
    return {
      args,
      value
    };
  },
  template: `
    <VueDatePicker
      v-model="value"
      data-testid="date-picker-example"
      label="Date"
      @change="args.onChange?.($event)" />
  `
});

export const DatePickerTriggerWidthExample: StoryFn<typeof VueDatePicker> = (args: {onChange?: (value: string) => void}) => ({
  components: {
    VueDatePicker
  },
  setup() {
    let value = ref('');
    return {
      args,
      value
    };
  },
  template: `
    <div style="width: 300px;">
      <VueDatePicker
        v-model="value"
        data-testid="date-picker-example"
        label="Date"
        @change="args.onChange?.($event)" />
    </div>
  `
});

export const DateRangePickerExample: StoryFn<typeof VueDateRangePicker> = (args: {onChange?: (value: {start: string, end: string}) => void}) => ({
  components: {
    VueDateRangePicker
  },
  setup() {
    let value = ref({start: '', end: ''});
    return {
      args,
      value
    };
  },
  template: `
    <VueDateRangePicker
      v-model="value"
      data-testid="date-range-picker-example"
      label="Date"
      @change="args.onChange?.($event)" />
  `
});

export const DateRangePickerTriggerWidthExample: StoryFn<typeof VueDateRangePicker> = (args: {onChange?: (value: {start: string, end: string}) => void}) => ({
  components: {
    VueDateRangePicker
  },
  setup() {
    let value = ref({start: '', end: ''});
    return {
      args,
      value
    };
  },
  template: `
    <div style="width: 300px;">
      <VueDateRangePicker
        v-model="value"
        data-testid="date-range-picker-example"
        label="Date"
        @change="args.onChange?.($event)" />
    </div>
  `
});

export const DatePickerAutofill: StoryFn<typeof VueDatePicker> = (props: {onChange?: (value: string) => void}) => ({
  components: {
    VueButton,
    VueDatePicker,
    VueForm
  },
  setup() {
    let firstName = ref('');
    let bday = ref('2021-04-07');
    let onSubmit = (event: SubmitEvent) => {
      let target = event.target as HTMLFormElement | null;
      let entries = target ? Object.fromEntries(new FormData(target).entries()) : {};
      action('onSubmit')(entries);
    };

    return {
      bday,
      firstName,
      onSubmit,
      props
    };
  },
  template: `
    <VueForm @submit="onSubmit">
      <label for="first-name">Name</label>
      <input id="first-name" v-model="firstName" name="firstName" type="text" autocomplete="name">
      <VueDatePicker
        v-model="bday"
        data-testid="date-picker-example"
        label="Date"
        @change="props.onChange?.($event)" />
      <input type="hidden" name="bday" :value="bday">
      <VueButton type="submit">Submit</VueButton>
    </VueForm>
  `
});
