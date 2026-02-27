import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {action} from '@storybook/addon-actions';
import {ref} from 'vue';
import {VueForm, VueTextField} from 'vue-aria-components';
import '../../react-aria-components/stories/styles.css';

const meta = {
  title: 'React Aria Components/Form',
  component: VueForm
} satisfies Meta<typeof VueForm>;

export default meta;

export const FormAutoFillExample: StoryFn<typeof VueForm> = () => ({
  components: {
    VueForm,
    VueTextField
  },
  setup() {
    let streetAddress = ref('');
    let city = ref('');
    let state = ref('');
    let zip = ref('');
    let country = ref('');
    let onSubmit = (event: SubmitEvent) => {
      let form = event.target as HTMLFormElement | null;
      if (form) {
        action('onSubmit')(Object.fromEntries(new FormData(form).entries()));
      }
      event.preventDefault();
    };

    return {
      city,
      country,
      onSubmit,
      state,
      streetAddress,
      zip
    };
  },
  template: `
    <VueForm
      aria-label="Shipping information"
      @submit="onSubmit">
      <VueTextField
        id="streetAddress"
        v-model="streetAddress"
        autocomplete="shipping street-address"
        label="Address"
        name="streetAddress" />
      <VueTextField
        id="city"
        v-model="city"
        autocomplete="shipping address-level2"
        label="City"
        name="city" />
      <VueTextField
        id="state"
        v-model="state"
        autocomplete="shipping address-level1"
        label="State"
        name="state" />
      <VueTextField
        id="zip"
        v-model="zip"
        autocomplete="shipping postal-code"
        label="Zip"
        name="zip" />
      <div class="react-aria-Select" data-rac="">
        <label class="react-aria-Label" for="country">Country</label>
        <select
          id="country"
          v-model="country"
          class="react-aria-Input"
          autocomplete="shipping country"
          name="country"
          title="">
          <option value="">Select an item</option>
          <option value="react-aria-1">Greece</option>
          <option value="react-aria-2">Italy</option>
          <option value="react-aria-3">Spain</option>
          <option value="react-aria-4">Mexico</option>
          <option value="react-aria-5">Canada</option>
          <option value="react-aria-6">United States</option>
        </select>
      </div>
      <button class="react-aria-Button" data-rac="" type="submit" tabindex="0" data-react-aria-pressable="true">Submit</button>
    </VueForm>
  `
});
