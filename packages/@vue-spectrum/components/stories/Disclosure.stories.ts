import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueDisclosure} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/Disclosure',
  component: VueDisclosure
} satisfies Meta<typeof VueDisclosure>;

export default meta;

export const DisclosureExample: StoryFn<typeof VueDisclosure> = () => ({
  template: `
    <div class="react-aria-Disclosure" data-rac="">
      <h3 class="react-aria-Heading">
        <button
          id="react-aria-vue-disclosure-trigger-example"
          class="react-aria-Button"
          data-rac=""
          type="button"
          tabindex="0"
          data-react-aria-pressable="true"
          aria-expanded="false"
          aria-controls="react-aria-vue-disclosure-panel-example"
          style="border: 0px none; background: none; color: rgb(0, 0, 0); font: 13.3333px Arial; margin: 0px; padding: 1px 6px;"
          slot="trigger">➡️ This is a disclosure header</button>
      </h3>
      <div
        id="react-aria-vue-disclosure-panel-example"
        class="react-aria-DisclosurePanel"
        data-rac=""
        role="group"
        aria-labelledby="react-aria-vue-disclosure-trigger-example"
        aria-hidden="true"
        hidden="until-found"
        style="--disclosure-panel-width: 0px; --disclosure-panel-height: 0px;">
        <p>This is the content of the disclosure panel.</p>
      </div>
    </div>
  `
});

export const DisclosureControlledExample: StoryFn<typeof VueDisclosure> = () => ({
  template: `
    <div class="react-aria-Disclosure" data-rac="">
      <h3 class="react-aria-Heading">
        <button
          id="react-aria-vue-disclosure-trigger-controlled"
          class="react-aria-Button"
          data-rac=""
          type="button"
          tabindex="0"
          data-react-aria-pressable="true"
          aria-expanded="false"
          aria-controls="react-aria-vue-disclosure-panel-controlled"
          style="border: 0px none; background: none; color: rgb(0, 0, 0); font: 13.3333px Arial; margin: 0px; padding: 1px 6px;"
          slot="trigger">➡️ This is a disclosure header</button>
      </h3>
      <div
        id="react-aria-vue-disclosure-panel-controlled"
        class="react-aria-DisclosurePanel"
        data-rac=""
        role="group"
        aria-labelledby="react-aria-vue-disclosure-trigger-controlled"
        aria-hidden="true"
        hidden="until-found"
        style="--disclosure-panel-width: 0px; --disclosure-panel-height: 0px;">
        <p>This is the content of the disclosure panel.</p>
      </div>
    </div>
  `
});
