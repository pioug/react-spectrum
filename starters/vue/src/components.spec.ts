import {mount} from '@vue/test-utils';
import {describe, expect, it} from 'vitest';
import {Button} from '@vue-spectrum/button';
import {Checkbox} from '@vue-spectrum/checkbox';
import {Radio, RadioGroup} from '@vue-spectrum/radio';
import {Switch} from '@vue-spectrum/switch';
import {TextField} from '@vue-spectrum/textfield';

describe('Vue migration primitives', () => {
  it('emits click from button', async () => {
    let wrapper = mount(Button, {
      slots: {default: 'Press me'}
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('updates model value from textfield input', async () => {
    let wrapper = mount(TextField, {
      props: {
        modelValue: ''
      }
    });

    await wrapper.get('input').setValue('Ada');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Ada']);
  });

  it('updates model value from checkbox change', async () => {
    let wrapper = mount(Checkbox, {
      props: {
        modelValue: false
      }
    });

    await wrapper.get('input').setValue(true);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
    expect(wrapper.emitted('change')?.[0]).toEqual([true]);
  });

  it('updates model value from switch change', async () => {
    let wrapper = mount(Switch, {
      props: {
        modelValue: false
      }
    });

    await wrapper.get('input').setValue(true);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
    expect(wrapper.emitted('change')?.[0]).toEqual([true]);
  });

  it('propagates v-model through radio group', async () => {
    let wrapper = mount({
      components: {Radio, RadioGroup},
      data: () => ({value: 'vue'}),
      template: `
        <RadioGroup v-model="value">
          <Radio value="vue">Vue</Radio>
          <Radio value="react">React</Radio>
        </RadioGroup>
      `
    });

    await wrapper.get('input[value="react"]').setValue(true);
    expect((wrapper.vm as unknown as {value: string}).value).toBe('react');
  });
});
