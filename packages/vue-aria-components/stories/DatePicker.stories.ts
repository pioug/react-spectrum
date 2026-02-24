import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueDatePicker, VueDateRangePicker} from 'vue-aria-components';

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
  template: `
    <div data-testid="date-picker-example">
      <span style="display: block;">Date</span>
      <div role="group" style="display: inline-flex;">
        <div role="presentation" style="unicode-bidi: isolate; border: 1px solid rgb(128, 128, 128); border-radius: 2px; background: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 14px; line-height: 21px; padding: 2px 4px;">
          <span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">mm</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">/</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">dd</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">/</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">yyyy</span>
        </div>
        <input hidden type="text" value="">
        <button type="button">🗓</button>
      </div>
    </div>
  `
});

export const DatePickerTriggerWidthExample: StoryFn<typeof VueDatePicker> = () => ({
  template: `
    <div data-testid="date-picker-example" style="width: 300px;">
      <span style="display: block;">Date</span>
      <div role="group" style="display: inline-flex; width: 300px;">
        <div role="presentation" style="unicode-bidi: isolate; border: 1px solid rgb(128, 128, 128); border-radius: 2px; background: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 14px; line-height: 21px; padding: 2px 4px; flex: 1 1 0%;">
          <span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">mm</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">/</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">dd</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">/</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">yyyy</span>
        </div>
        <input hidden type="text" value="">
        <button type="button">🗓</button>
      </div>
    </div>
  `
});

export const DateRangePickerExample: StoryFn<typeof VueDateRangePicker> = () => ({
  template: `
    <div data-testid="date-range-picker-example">
      <span style="display: block;">Date</span>
      <div role="group" style="display: inline-flex;">
        <div style="unicode-bidi: isolate; border: 1px solid rgb(128, 128, 128); border-radius: 2px; background: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 14px; line-height: 21px; padding: 2px 4px;">
          <div data-testid="date-range-picker-date-input" role="presentation" style="unicode-bidi: isolate; display: inline;">
            <span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">mm</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">/</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">dd</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">/</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">yyyy</span>
          </div>
          <input hidden type="text" value="">
          <span aria-hidden="true" style="padding: 0 4px;">–</span>
          <div role="presentation" style="unicode-bidi: isolate; display: inline;">
            <span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">mm</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">/</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">dd</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">/</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">yyyy</span>
          </div>
          <input hidden type="text" value="">
        </div>
        <button type="button">🗓</button>
      </div>
    </div>
  `
});

export const DateRangePickerTriggerWidthExample: StoryFn<typeof VueDateRangePicker> = () => ({
  template: `
    <div data-testid="date-range-picker-example" style="width: 300px;">
      <span style="display: block;">Date</span>
      <div role="group" style="display: inline-flex; width: 300px;">
        <div style="unicode-bidi: isolate; border: 1px solid rgb(128, 128, 128); border-radius: 2px; background: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 14px; line-height: 21px; padding: 2px 4px; flex: 1 1 0%;">
          <div data-testid="date-range-picker-date-input" role="presentation" style="unicode-bidi: isolate; display: inline;">
            <span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">mm</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">/</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">dd</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">/</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">yyyy</span>
          </div>
          <input hidden type="text" value="">
          <span aria-hidden="true" style="padding: 0 4px;">–</span>
          <div role="presentation" style="unicode-bidi: isolate; display: inline;">
            <span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">mm</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">/</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">dd</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">/</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums; color: rgb(128, 128, 128);">yyyy</span>
          </div>
          <input hidden type="text" value="">
        </div>
        <button type="button">🗓</button>
      </div>
    </div>
  `
});

export const DatePickerAutofill: StoryFn<typeof VueDatePicker> = (props: {onChange?: (value: string) => void}) => ({
  setup() {
    let onSubmit = (event: SubmitEvent) => {
      let target = event.target as HTMLFormElement | null;
      let entries = target ? Object.fromEntries(new FormData(target).entries()) : {};
      action('onSubmit')(entries);
      event.preventDefault();
    };

    return {
      onSubmit
    };
  },
  template: `
    <form @submit="onSubmit">
      <div>
        <label for="name">Name</label>
        <input id="name" name="firstName" type="name" autocomplete="name" style="width: 145px;">
      </div>
      <div data-testid="date-picker-example">
        <span style="display: block;">Date</span>
        <div role="group" style="display: inline-flex;">
          <div role="presentation" style="unicode-bidi: isolate; border: 1px solid rgb(128, 128, 128); border-radius: 2px; background: rgb(255, 255, 255); color: rgb(0, 0, 0); font-size: 14px; line-height: 21px; padding: 2px 4px;">
            <span style="padding: 0 2px; font-variant-numeric: tabular-nums;">4</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">/</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">8</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">/</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">2021</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">, </span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">⁦</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">2</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">:</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">45</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">⁩</span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;"> </span><span style="padding: 0 2px; font-variant-numeric: tabular-nums;">AM</span><span aria-hidden="true" style="padding: 0 2px; font-variant-numeric: tabular-nums;" v-text="' '"></span><span role="textbox" aria-readonly="true" tabindex="0" style="padding: 0 2px; font-variant-numeric: tabular-nums; caret-color: transparent;">GMT+8</span>
          </div>
          <input hidden type="text" name="bday" value="2021-04-08T02:45:22+08:00[Asia/Singapore]">
          <button type="button">🗓</button>
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  `
});
