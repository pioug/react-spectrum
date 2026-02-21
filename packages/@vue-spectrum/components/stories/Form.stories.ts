import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueButton, VueForm} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/Form',
  component: VueForm
} satisfies Meta<typeof VueForm>;

export default meta;

export const FormAutoFillExample: StoryFn<typeof VueForm> = () => ({
  components: {
    VueButton,
    VueForm
  },
  setup() {
    let onSubmit = (event: SubmitEvent) => {
      let target = event.target as HTMLFormElement | null;
      let entries = target ? Object.fromEntries(new FormData(target).entries()) : {};
      action('onSubmit')(entries);
    };

    return {
      onSubmit
    };
  },
  template: `
    <VueForm aria-label="Shipping information" @submit="onSubmit">
      <label for="streetAddress">Address</label>
      <input id="streetAddress" name="streetAddress" type="text" autocomplete="shipping street-address">

      <label for="city">City</label>
      <input id="city" name="city" type="text" autocomplete="shipping address-level2">

      <label for="state">State</label>
      <input id="state" name="state" type="text" autocomplete="shipping address-level1">

      <label for="postalCode">Zip</label>
      <input id="postalCode" name="postalCode" type="text" autocomplete="shipping postal-code">

      <label for="country">Country</label>
      <select id="country" name="country" autocomplete="shipping country">
        <option value="">Select a country</option>
        <option>Greece</option>
        <option>Italy</option>
        <option>Spain</option>
        <option>Mexico</option>
        <option>Canada</option>
        <option>United States</option>
      </select>

      <VueButton type="submit">Submit</VueButton>
    </VueForm>
  `
});
