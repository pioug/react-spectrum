import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueDateField} from 'vue-aria-components';

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
  template: `
    <div data-testid="date-field-example" style="width: 219.61px;">
      <span style="display: block;">Date</span>
      <div
        role="group"
        style="unicode-bidi: isolate; border: 1px solid rgb(128, 128, 128); border-radius: 2px; background: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 14px; font-variant-numeric: tabular-nums; line-height: 21px; padding: 2px 4px;">
        <span style="padding: 0 2px;">1</span><span style="padding: 0 2px;">/</span><span style="padding: 0 2px;">1</span><span style="padding: 0 2px;">/</span><span style="padding: 0 2px;">2024</span><span style="padding: 0 2px;">, </span><span style="padding: 0 2px;">⁦</span><span style="padding: 0 2px;">9</span><span style="padding: 0 2px;">:</span><span style="padding: 0 2px;">01</span><span style="padding: 0 2px;">⁩</span><span style="padding: 0 2px;"> </span><span style="padding: 0 2px;">AM</span><span aria-hidden="true" style="padding: 0 2px;" v-text="' '"></span><span role="textbox" aria-readonly="true" tabindex="0" style="padding: 0 2px; caret-color: transparent;">GMT+8</span>
      </div>
      <input hidden type="text" value="2024-01-01T09:01:00+08:00[Asia/Singapore]">
    </div>
  `
});

export const DateFieldAutoFill: StoryFn<typeof VueDateField> = () => ({
  setup() {
    let onSubmit = (event: SubmitEvent) => {
      let form = event.target as HTMLFormElement | null;
      let entries = form ? Object.fromEntries(new FormData(form).entries()) : {};
      action('onSubmit')(entries);
      event.preventDefault();
    };

    return {
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
        <span style="display: block;">Date</span>
        <div
          role="group"
          style="unicode-bidi: isolate; border: 1px solid rgb(128, 128, 128); border-radius: 2px; background: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 14px; font-variant-numeric: tabular-nums; line-height: 21px; padding: 2px 4px;">
          <span style="padding: 0 2px;">4</span><span style="padding: 0 2px;">/</span><span style="padding: 0 2px;">8</span><span style="padding: 0 2px;">/</span><span style="padding: 0 2px;">2021</span><span style="padding: 0 2px;">, </span><span style="padding: 0 2px;">⁦</span><span style="padding: 0 2px;">2</span><span style="padding: 0 2px;">:</span><span style="padding: 0 2px;">45</span><span style="padding: 0 2px;">⁩</span><span style="padding: 0 2px;"> </span><span style="padding: 0 2px;">AM</span><span aria-hidden="true" style="padding: 0 2px;" v-text="' '"></span><span role="textbox" aria-readonly="true" tabindex="0" style="padding: 0 2px; caret-color: transparent;">GMT+8</span>
        </div>
        <input type="hidden" name="bday" value="2021-04-08T02:45:22+08:00[Asia/Singapore]">
      </div>
      <button type="submit">Submit</button>
    </form>
  `
});
