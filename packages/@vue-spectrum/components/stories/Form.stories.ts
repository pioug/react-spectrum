import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueForm} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/Form',
  component: VueForm
} satisfies Meta<typeof VueForm>;

export default meta;

export const FormAutoFillExample: StoryFn<typeof VueForm> = () => ({
  template: `
    <form aria-label="Shipping information" class="react-aria-Form">
      <div class="react-aria-TextField" data-rac="">
        <label class="react-aria-Label" for="streetAddress">Address</label>
        <input autocomplete="shipping street-address" tabindex="0" id="streetAddress" class="react-aria-Input" data-rac="" type="text" value="" name="streetAddress" title="">
      </div>
      <div class="react-aria-TextField" data-rac="">
        <label class="react-aria-Label" for="city">City</label>
        <input autocomplete="shipping address-level2" tabindex="0" id="city" class="react-aria-Input" data-rac="" type="text" value="" name="city" title="">
      </div>
      <div class="react-aria-TextField" data-rac="">
        <label class="react-aria-Label" for="state">State</label>
        <input autocomplete="shipping address-level1" tabindex="0" id="state" class="react-aria-Input" data-rac="" type="text" value="" name="state" title="">
      </div>
      <div class="react-aria-TextField" data-rac="">
        <label class="react-aria-Label" for="city">Zip</label>
        <input autocomplete="shipping postal-code" tabindex="0" id="city" class="react-aria-Input" data-rac="" type="text" value="" name="city" title="">
      </div>
      <template data-react-aria-hidden="true"></template>
      <div class="react-aria-Select" data-rac="">
        <span class="react-aria-Label">Country</span>
        <button id="country" class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" aria-haspopup="listbox" aria-expanded="false">
          <span class="react-aria-SelectValue" data-rac="" data-placeholder="true">Select an item</span>
          <span aria-hidden="true">▼</span>
        </button>
        <div aria-hidden="true" data-react-aria-prevent-focus="true" data-a11y-ignore="aria-hidden-focus" data-testid="hidden-select-container" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: fixed; width: 1px; white-space: nowrap; top: 0px; left: 0px;">
          <label>
            <select tabindex="-1" autocomplete="shipping country" name="country" title="">
              <option></option>
              <option value="react-aria-1">Greece</option>
              <option value="react-aria-2">Italy</option>
              <option value="react-aria-3">Spain</option>
              <option value="react-aria-4">Mexico</option>
              <option value="react-aria-5">Canada</option>
              <option value="react-aria-6">United States</option>
            </select>
          </label>
        </div>
      </div>
      <button class="react-aria-Button" data-rac="" type="submit" tabindex="0" data-react-aria-pressable="true">Submit</button>
    </form>
  `
});
