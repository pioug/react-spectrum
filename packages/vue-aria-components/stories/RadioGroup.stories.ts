import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueRadioGroup} from 'vue-aria-components';

const meta = {
  title: 'React Aria Components/RadioGroup',
  component: VueRadioGroup
} satisfies Meta<typeof VueRadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RadioGroupExample: Story = {
  render: (_props: {onFocus?: (event: FocusEvent) => void, onBlur?: (event: FocusEvent) => void}) => ({
    template: `
      <div
        data-testid="radio-group-example"
        data-orientation="vertical"
        role="radiogroup"
        style="display: flex; flex-direction: column; gap: 8px;">
        <span class="react-aria-Label" style="display: block; font-size: 14px; font-weight: 400; line-height: 21px;">Favorite pet</span>
        <label data-testid="radio-dog" style="align-items: center; display: flex; font-size: 18.288px; font-weight: 400; gap: 9.136px; line-height: 27.432px;">
          <span style="background: Canvas; border: 2px solid gray; border-radius: 20.576px; box-sizing: border-box; display: block; flex-shrink: 0; height: 20.5625px; width: 20.5625px;" />
          Dog
        </label>
        <label style="align-items: center; display: flex; font-size: 18.288px; font-weight: 400; gap: 9.136px; line-height: 27.432px;">
          <span style="background: Canvas; border: 2px solid gray; border-radius: 20.576px; box-sizing: border-box; display: block; flex-shrink: 0; height: 20.5625px; width: 20.5625px;" />
          Cat
        </label>
        <label style="align-items: center; display: flex; font-size: 18.288px; font-weight: 400; gap: 9.136px; line-height: 27.432px;">
          <span style="background: Canvas; border: 2px solid gray; border-radius: 20.576px; box-sizing: border-box; display: block; flex-shrink: 0; height: 20.5625px; width: 20.5625px;" />
          Dragon
        </label>
      </div>
    `
  }),
  args: {
    onFocus: action('onFocus'),
    onBlur: action('onBlur')
  }
};

export const RadioGroupControlledExample: StoryFn<typeof VueRadioGroup> = () => ({
  template: `
    <div
      data-testid="radio-group-example"
      data-orientation="vertical"
      role="radiogroup"
      style="display: flex; flex-direction: column; gap: 8px;">
      <span class="react-aria-Label" style="display: block; font-size: 14px; font-weight: 400; line-height: 21px;">Favorite pet (controlled)</span>
      <label data-testid="radio-dog" style="align-items: center; display: flex; font-size: 18.288px; font-weight: 400; gap: 9.136px; line-height: 27.432px;">
        <span style="background: Canvas; border: 2px solid gray; border-radius: 20.576px; box-sizing: border-box; display: block; flex-shrink: 0; height: 20.5625px; width: 20.5625px;" />
        Dog
      </label>
      <label style="align-items: center; display: flex; font-size: 18.288px; font-weight: 400; gap: 9.136px; line-height: 27.432px;">
        <span style="background: Canvas; border: 2px solid gray; border-radius: 20.576px; box-sizing: border-box; display: block; flex-shrink: 0; height: 20.5625px; width: 20.5625px;" />
        Cat
      </label>
      <label style="align-items: center; display: flex; font-size: 18.288px; font-weight: 400; gap: 9.136px; line-height: 27.432px;">
        <span style="background: Canvas; border: 2px solid gray; border-radius: 20.576px; box-sizing: border-box; display: block; flex-shrink: 0; height: 20.5625px; width: 20.5625px;" />
        Dragon
      </label>
    </div>
  `
});

export const RadioGroupInDialogExample: StoryFn<typeof VueRadioGroup> = () => ({
  template: `
    <button class="react-aria-Button" type="button">Open dialog</button>
  `
});

export const RadioGroupSubmitExample: StoryFn<typeof VueRadioGroup> = () => ({
  template: `
    <form>
      <div
        data-testid="radio-group-example"
        data-orientation="vertical"
        role="radiogroup"
        style="display: flex; flex-direction: column; gap: 8px;">
        <span class="react-aria-Label" style="display: block; font-size: 14px; font-weight: 400; line-height: 21px;">Favorite pet</span>
        <label data-testid="radio-dog" style="align-items: center; display: flex; font-size: 18.288px; font-weight: 400; gap: 9.136px; line-height: 27.432px;">
          <span style="background: Canvas; border: 2px solid gray; border-radius: 20.576px; box-sizing: border-box; display: block; flex-shrink: 0; height: 20.5625px; width: 20.5625px;" />
          Dog
        </label>
        <label style="align-items: center; display: flex; font-size: 18.288px; font-weight: 400; gap: 9.136px; line-height: 27.432px;">
          <span style="background: Canvas; border: 2px solid gray; border-radius: 20.576px; box-sizing: border-box; display: block; flex-shrink: 0; height: 20.5625px; width: 20.5625px;" />
          Cat
        </label>
        <label style="align-items: center; display: flex; font-size: 18.288px; font-weight: 400; gap: 9.136px; line-height: 27.432px;">
          <span style="background: Canvas; border: 2px solid gray; border-radius: 20.576px; box-sizing: border-box; display: block; flex-shrink: 0; height: 20.5625px; width: 20.5625px;" />
          Dragon
        </label>
      </div>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
  `
});
