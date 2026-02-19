import {mount} from '@vue/test-utils';
import {describe, expect, it} from 'vitest';
import {ComboBox} from '@vue-spectrum/combobox';
import {Dialog} from '@vue-spectrum/dialog';
import {ListBox} from '@vue-spectrum/listbox';
import {Menu} from '@vue-spectrum/menu';
import {Popover} from '@vue-spectrum/overlays';

describe('Vue migration composition components', () => {
  it('emits close events from dismissable dialog controls', async () => {
    let wrapper = mount(Dialog, {
      props: {
        open: true,
        title: 'Confirm changes'
      },
      slots: {
        default: 'Body copy'
      }
    });

    await wrapper.get('button.vs-dialog__close').trigger('click');
    await wrapper.get('button.vs-dialog-layer__backdrop').trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(2);
  });

  it('emits close from popover backdrop and applies placement class', async () => {
    let wrapper = mount(Popover, {
      props: {
        open: true,
        placement: 'right'
      },
      slots: {
        default: 'Popover content'
      }
    });

    expect(wrapper.get('section.vs-popover').classes()).toContain('vs-popover--right');
    await wrapper.get('button.vs-popover-layer__backdrop').trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('emits selection updates from menu item clicks', async () => {
    let wrapper = mount(Menu, {
      props: {
        modelValue: 'Forms',
        label: 'Category',
        items: ['Forms', 'Navigation', 'Overlays']
      }
    });

    await wrapper.findAll('button.vs-menu__item')[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Navigation']);
    expect(wrapper.emitted('select')?.[0]).toEqual(['Navigation']);
  });

  it('emits selection updates from listbox item clicks', async () => {
    let wrapper = mount(ListBox, {
      props: {
        modelValue: 'Vue Spectrum',
        label: 'Library',
        items: ['Vue Spectrum', 'React Spectrum', 'Tailwind CSS']
      }
    });

    await wrapper.findAll('button.vs-listbox__item')[2].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Tailwind CSS']);
    expect(wrapper.emitted('select')?.[0]).toEqual(['Tailwind CSS']);
  });

  it('emits model updates and change events from combobox input', async () => {
    let wrapper = mount(ComboBox, {
      props: {
        modelValue: '',
        label: 'Language',
        options: ['TypeScript', 'JavaScript', 'Rust']
      }
    });

    await wrapper.get('input').setValue('Rust');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Rust']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['Rust']);
    expect(wrapper.findAll('datalist option')).toHaveLength(3);
  });
});
