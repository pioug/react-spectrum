import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueSwitch} from 'vue-aria-components';

const meta = {
  title: 'React Aria Components/Switch',
  component: VueSwitch
} satisfies Meta<typeof VueSwitch>;

export default meta;

export const SwitchExample: StoryFn<typeof VueSwitch> = () => ({
  template: `
    <label
      data-rac=""
      data-testid="switch-example"
      style="align-items: center; color: rgb(34, 34, 34); display: flex; gap: 0.571rem;">
      <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
        <input data-react-aria-pressable="true" role="switch" tabindex="0" type="checkbox">
      </span>
      <div style="background: rgb(248, 248, 248); border: 2px solid gray; border-radius: 1.143rem; height: 1.143rem; width: 2rem;">
        <div style="background: slateblue; border-radius: 16px; height: 0.857rem; margin: 0.143rem; width: 0.857rem;"></div>
      </div>
      Switch me
    </label>
  `
});
