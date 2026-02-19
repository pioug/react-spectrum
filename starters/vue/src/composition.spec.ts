import {mount} from '@vue/test-utils';
import {describe, expect, it} from 'vitest';
import {Accordion, Disclosure, DisclosurePanel, DisclosureTitle} from '@vue-spectrum/accordion';
import {SearchAutocomplete} from '@vue-spectrum/autocomplete';
import {Dialog} from '@vue-spectrum/dialog';
import {ListView} from '@vue-spectrum/list';
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

  it('emits selection updates from list view item clicks', async () => {
    let wrapper = mount(ListView, {
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

  it('emits model updates and change events from search autocomplete input', async () => {
    let wrapper = mount(SearchAutocomplete, {
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

  it('propagates disclosure toggles through accordion v-model', async () => {
    let wrapper = mount({
      components: {Accordion, Disclosure, DisclosurePanel, DisclosureTitle},
      data: () => ({expanded: ['foundation']}),
      template: `
        <Accordion v-model="expanded">
          <Disclosure id="foundation">
            <DisclosureTitle>Foundation</DisclosureTitle>
            <DisclosurePanel>Foundational work</DisclosurePanel>
          </Disclosure>
          <Disclosure id="composition">
            <DisclosureTitle>Composition</DisclosureTitle>
            <DisclosurePanel>Composition work</DisclosurePanel>
          </Disclosure>
        </Accordion>
      `
    });

    expect(wrapper.findAll('.vs-disclosure__panel')).toHaveLength(1);
    await wrapper.findAll('button.vs-disclosure__trigger')[0].trigger('click');
    expect((wrapper.vm as unknown as {expanded: string[]}).expanded).toEqual([]);
    await wrapper.findAll('button.vs-disclosure__trigger')[1].trigger('click');
    expect((wrapper.vm as unknown as {expanded: string[]}).expanded).toEqual(['composition']);
  });
});
