import {mount} from '@vue/test-utils';
import {describe, expect, it} from 'vitest';
import {Avatar} from '@vue-spectrum/avatar';
import {Badge} from '@vue-spectrum/badge';
import {Button} from '@vue-spectrum/button';
import {Checkbox} from '@vue-spectrum/checkbox';
import {Image} from '@vue-spectrum/image';
import {InlineAlert} from '@vue-spectrum/inlinealert';
import {Label} from '@vue-spectrum/label';
import {Radio, RadioGroup} from '@vue-spectrum/radio';
import {Switch} from '@vue-spectrum/switch';
import {TextField} from '@vue-spectrum/textfield';
import {Text} from '@vue-spectrum/text';
import {View} from '@vue-spectrum/view';
import {Well} from '@vue-spectrum/well';

describe('Vue migration primitives', () => {
  it('renders avatar fallback initials', () => {
    let wrapper = mount(Avatar, {
      props: {
        label: 'Vue Spectrum',
        size: 'l'
      }
    });

    expect(wrapper.text()).toContain('VU');
    expect(wrapper.classes()).toContain('vs-avatar--l');
  });

  it('renders badge variants and slot content', () => {
    let wrapper = mount(Badge, {
      props: {
        variant: 'positive'
      },
      slots: {
        default: 'Ready for review'
      }
    });

    expect(wrapper.text()).toContain('Ready for review');
    expect(wrapper.classes()).toContain('vs-badge--positive');
  });

  it('renders well variants and slot content', () => {
    let wrapper = mount(Well, {
      props: {
        variant: 'notice'
      },
      slots: {
        default: 'Migration block'
      }
    });

    expect(wrapper.text()).toContain('Migration block');
    expect(wrapper.classes()).toContain('vs-well--notice');
  });

  it('renders view with dynamic element type and classes', () => {
    let wrapper = mount(View, {
      props: {
        elementType: 'section',
        border: true,
        padding: 'l'
      },
      slots: {
        default: 'View content'
      }
    });

    expect(wrapper.element.tagName).toBe('SECTION');
    expect(wrapper.classes()).toContain('vs-view--bordered');
    expect(wrapper.classes()).toContain('vs-view--padding-l');
    expect(wrapper.text()).toContain('View content');
  });

  it('renders inline alert title, content, and variant class', () => {
    let wrapper = mount(InlineAlert, {
      props: {
        variant: 'notice',
        title: 'Attention'
      },
      slots: {
        default: 'Action required.'
      }
    });

    expect(wrapper.get('.vs-inline-alert__title').text()).toBe('Attention');
    expect(wrapper.text()).toContain('Action required.');
    expect(wrapper.classes()).toContain('vs-inline-alert--notice');
  });

  it('renders image src/alt and fit class', () => {
    let wrapper = mount(Image, {
      props: {
        src: 'https://example.com/image.png',
        alt: 'Preview',
        fit: 'contain'
      }
    });

    let image = wrapper.get('img');
    expect(image.attributes('src')).toBe('https://example.com/image.png');
    expect(image.attributes('alt')).toBe('Preview');
    expect(wrapper.classes()).toContain('vs-image--fit-contain');
  });

  it('renders label content and required indicator', () => {
    let wrapper = mount(Label, {
      props: {
        forId: 'field-name',
        required: true
      },
      slots: {
        default: 'Name'
      }
    });

    expect(wrapper.attributes('for')).toBe('field-name');
    expect(wrapper.text()).toContain('Name');
    expect(wrapper.find('.vs-label__required').exists()).toBe(true);
  });

  it('renders text element, variant, and emphasis classes', () => {
    let wrapper = mount(Text, {
      props: {
        elementType: 'span',
        variant: 'detail',
        emphasized: true
      },
      slots: {
        default: 'Detail copy'
      }
    });

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.classes()).toContain('vs-text--detail');
    expect(wrapper.classes()).toContain('is-emphasized');
    expect(wrapper.text()).toContain('Detail copy');
  });

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
