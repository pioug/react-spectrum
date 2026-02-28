import {action} from 'storybook/actions';
import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueDatePicker, VueDateRangePicker} from 'vue-aria-components';
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

export const DatePickerExample: StoryFn<typeof VueDatePicker> = () => ({
  components: {
    VueDatePicker
  },
  setup() {
    let value = ref('');
    return {
      value,
      onChange: action('onChange')
    };
  },
  template: `
    <div data-testid="date-picker-example">
      <VueDatePicker
        v-model="value"
        label="Date"
        @change="onChange" />
    </div>
  `
});

export const DatePickerTriggerWidthExample: StoryFn<typeof VueDatePicker> = () => ({
  components: {
    VueDatePicker
  },
  setup() {
    let value = ref('');
    return {
      value,
      onChange: action('onChange')
    };
  },
  template: `
    <div data-testid="date-picker-example" style="width: 300px;">
      <VueDatePicker
        v-model="value"
        label="Date"
        style="width: 300px;"
        @change="onChange" />
    </div>
  `
});

export const DateRangePickerExample: StoryFn<typeof VueDateRangePicker> = () => ({
  components: {
    VueDateRangePicker
  },
  setup() {
    let value = ref({
      start: '',
      end: ''
    });

    return {
      value,
      onChange: action('onChange')
    };
  },
  template: `
    <div data-testid="date-range-picker-example">
      <VueDateRangePicker
        v-model="value"
        label="Date"
        @change="onChange" />
    </div>
  `
});

export const DateRangePickerTriggerWidthExample: StoryFn<typeof VueDateRangePicker> = () => ({
  components: {
    VueDateRangePicker
  },
  setup() {
    let value = ref({
      start: '',
      end: ''
    });

    return {
      value,
      onChange: action('onChange')
    };
  },
  template: `
    <div data-testid="date-range-picker-example" style="width: 300px;">
      <VueDateRangePicker
        v-model="value"
        label="Date"
        style="width: 300px;"
        @change="onChange" />
    </div>
  `
});

export const DatePickerAutofill: StoryFn<typeof VueDatePicker> = () => ({
  components: {
    VueDatePicker
  },
  setup() {
    let value = ref('2021-04-08');

    let onSubmit = (event: SubmitEvent) => {
      let target = event.target as HTMLFormElement | null;
      let entries = target ? Object.fromEntries(new FormData(target).entries()) : {};
      action('onSubmit')(entries);
      event.preventDefault();
    };

    return {
      value,
      onSubmit,
      onChange: action('onChange')
    };
  },
  template: `
    <form @submit="onSubmit">
      <div>
        <label for="name">Name</label>
        <input id="name" name="firstName" type="name" autocomplete="name" style="width: 145px;">
      </div>
      <div data-testid="date-picker-example">
        <VueDatePicker
          v-model="value"
          label="Date"
          @change="onChange" />
        <input type="hidden" name="bday" :value="value">
      </div>
      <button type="submit">Submit</button>
    </form>
  `
});
