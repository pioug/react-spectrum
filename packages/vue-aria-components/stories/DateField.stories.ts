import {action} from 'storybook/actions';
import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueDateField} from 'vue-aria-components';
import {computed, ref} from 'vue';

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

function toDateInputValue(value: unknown): string {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Date(value).toISOString().slice(0, 10);
  }

  return '';
}

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
    let isDisabled = computed(() => Boolean(props.isDisabled));
    let min = computed(() => toDateInputValue(props.minValue));
    let max = computed(() => toDateInputValue(props.maxValue));

    let onChange = (nextValue: string) => {
      props.onChange?.(nextValue);
      action('OnChange')(nextValue);
    };

    return {
      isDisabled,
      max,
      min,
      onChange,
      value
    };
  },
  template: `
    <div data-testid="date-field-example" style="width: 219.61px;">
      <VueDateField
        v-model="value"
        label="Date"
        :disabled="isDisabled"
        :min="min"
        :max="max"
        @change="onChange" />
    </div>
  `
});

export const DateFieldAutoFill: StoryFn<typeof VueDateField> = () => ({
  components: {
    VueDateField
  },
  setup() {
    let value = ref('2021-04-08');
    let onSubmit = (event: SubmitEvent) => {
      let form = event.target as HTMLFormElement | null;
      let entries = form ? Object.fromEntries(new FormData(form).entries()) : {};
      action('onSubmit')(entries);
      event.preventDefault();
    };

    return {
      value,
      onSubmit
    };
  },
  template: `
    <form style="width: 219.61px;" @submit="onSubmit">
      <div>
        <label for="name">Name</label>
        <input id="name" name="name" type="text" autocomplete="name" style="width: 145px;">
      </div>
      <div data-testid="date-field-example">
        <VueDateField
          v-model="value"
          label="Date" />
        <input type="hidden" name="bday" :value="value">
      </div>
      <button type="submit">Submit</button>
    </form>
  `
});
