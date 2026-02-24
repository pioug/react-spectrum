import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueTimeField} from 'vue-aria-components';

const meta = {
  title: 'React Aria Components/TimeField',
  component: VueTimeField
} satisfies Meta<typeof VueTimeField>;

export default meta;

export const TimeFieldExample: StoryFn<typeof VueTimeField> = () => ({
  template: `
    <div data-testid="time-field-example" class="react-aria-TimeField" data-rac="">
      <span class="react-aria-Label" style="display: block;">Time</span>
      <div role="group" data-react-aria-pressable="true" class="v7C2Sq_field" data-rac="" style="unicode-bidi: isolate; padding: 2px 4px; border-radius: 2px; border: 1px solid gray; background: Field; color: FieldText;">
        <span aria-hidden="true" class="v7C2Sq_segment" data-rac="" data-type="literal" style="padding: 0 2px; font-variant-numeric: tabular-nums; text-align: end;">&#8294;</span>
        <span
          role="spinbutton"
          aria-valuetext="Empty"
          aria-valuemin="1"
          aria-valuemax="12"
          aria-label="hour, "
          data-placeholder="true"
          contenteditable="true"
          spellcheck="false"
          autocorrect="off"
          enterkeyhint="next"
          inputmode="numeric"
          tabindex="0"
          class="v7C2Sq_segment v7C2Sq_placeholder"
          data-rac=""
          data-type="hour"
          style="caret-color: transparent; padding: 0 2px; font-variant-numeric: tabular-nums; text-align: end; color: gray;">&#8211;&#8211;</span>
        <span aria-hidden="true" class="v7C2Sq_segment" data-rac="" data-type="literal" style="padding: 0 2px; font-variant-numeric: tabular-nums; text-align: end;">:</span>
        <span
          role="spinbutton"
          aria-valuetext="Empty"
          aria-valuemin="0"
          aria-valuemax="59"
          aria-label="minute, "
          data-placeholder="true"
          contenteditable="true"
          spellcheck="false"
          autocorrect="off"
          enterkeyhint="next"
          inputmode="numeric"
          tabindex="0"
          class="v7C2Sq_segment v7C2Sq_placeholder"
          data-rac=""
          data-type="minute"
          style="caret-color: transparent; padding: 0 2px; font-variant-numeric: tabular-nums; text-align: end; color: gray;">&#8211;&#8211;</span>
        <span aria-hidden="true" class="v7C2Sq_segment" data-rac="" data-type="literal" style="padding: 0 2px; font-variant-numeric: tabular-nums; text-align: end;">&#8297;</span>
        <span aria-hidden="true" class="v7C2Sq_segment" data-rac="" data-type="literal" style="padding: 0 2px; font-variant-numeric: tabular-nums; text-align: end;">&#8239;</span>
        <span
          role="spinbutton"
          aria-valuetext="Empty"
          aria-valuemin="0"
          aria-valuemax="1"
          aria-label="AM/PM, "
          data-placeholder="true"
          contenteditable="true"
          spellcheck="false"
          autocorrect="off"
          enterkeyhint="next"
          tabindex="0"
          class="v7C2Sq_segment v7C2Sq_placeholder"
          data-rac=""
          data-type="dayPeriod"
          style="caret-color: transparent; padding: 0 2px; font-variant-numeric: tabular-nums; text-align: end; color: gray;">AM</span>
      </div>
      <input hidden class="" data-rac="" type="text" value="" title="" />
    </div>
  `
});
