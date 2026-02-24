import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueAccordion} from 'vue-aria-components';

const meta = {
  title: 'React Aria Components/DisclosureGroup',
  component: VueAccordion
} satisfies Meta<typeof VueAccordion>;

export default meta;

export const DisclosureGroupExample: StoryFn<typeof VueAccordion> = () => ({
  template: `
    <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true">Toggle Disabled</button>
    <div class="react-aria-DisclosureGroup" data-rac="">
      <div class="react-aria-Disclosure" data-rac="">
        <h3 class="react-aria-Heading">
          <button
            id="react-aria-vue-disclosure-group-trigger-first"
            class="react-aria-Button"
            data-rac=""
            type="button"
            tabindex="0"
            data-react-aria-pressable="true"
            aria-expanded="false"
            aria-controls="react-aria-vue-disclosure-group-panel-first"
            slot="trigger"
            style="border: 0px none; background: none; color: rgb(0, 0, 0); font: 13.3333px Arial; margin: 0px; padding: 1px 6px;">➡️ This is a disclosure header</button>
        </h3>
        <div
          id="react-aria-vue-disclosure-group-panel-first"
          class="react-aria-DisclosurePanel"
          data-rac=""
          role="group"
          aria-labelledby="react-aria-vue-disclosure-group-trigger-first"
          aria-hidden="true"
          hidden="until-found"
          style="--disclosure-panel-width: 0px; --disclosure-panel-height: 0px;">
          <p>This is the content of the disclosure panel.</p>
        </div>
      </div>
      <div class="react-aria-Disclosure" data-rac="">
        <h3 class="react-aria-Heading">
          <button
            id="react-aria-vue-disclosure-group-trigger-second"
            class="react-aria-Button"
            data-rac=""
            type="button"
            tabindex="0"
            data-react-aria-pressable="true"
            aria-expanded="false"
            aria-controls="react-aria-vue-disclosure-group-panel-second"
            slot="trigger"
            style="border: 0px none; background: none; color: rgb(0, 0, 0); font: 13.3333px Arial; margin: 0px; padding: 1px 6px;">➡️ This is a disclosure header</button>
        </h3>
        <div
          id="react-aria-vue-disclosure-group-panel-second"
          class="react-aria-DisclosurePanel"
          data-rac=""
          role="group"
          aria-labelledby="react-aria-vue-disclosure-group-trigger-second"
          aria-hidden="true"
          hidden="until-found"
          style="--disclosure-panel-width: 0px; --disclosure-panel-height: 0px;">
          <p>This is the content of the disclosure panel.</p>
        </div>
      </div>
    </div>
  `
});
