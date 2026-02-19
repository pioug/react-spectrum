import {mount} from '@vue/test-utils';
import {describe, expect, it} from 'vitest';
import {Avatar} from '@vue-spectrum/avatar';
import {Badge} from '@vue-spectrum/badge';
import {Button} from '@vue-spectrum/button';
import {ButtonGroup} from '@vue-spectrum/buttongroup';
import {Calendar, RangeCalendar} from '@vue-spectrum/calendar';
import {Card, CardView} from '@vue-spectrum/card';
import {Checkbox} from '@vue-spectrum/checkbox';
import {ColorField, ColorPicker, ColorSwatchPicker} from '@vue-spectrum/color';
import {DatePicker, DateRangePicker, TimeField} from '@vue-spectrum/datepicker';
import {FileTrigger} from '@vue-spectrum/filetrigger';
import {Image} from '@vue-spectrum/image';
import {Icon, Illustration, UIIcon} from '@vue-spectrum/icon';
import {IllustratedMessage} from '@vue-spectrum/illustratedmessage';
import {InlineAlert} from '@vue-spectrum/inlinealert';
import {Flex, Grid, fitContent, minmax, repeat} from '@vue-spectrum/layout';
import {Label} from '@vue-spectrum/label';
import {LabeledValue} from '@vue-spectrum/labeledvalue';
import {Picker} from '@vue-spectrum/picker';
import {Radio, RadioGroup} from '@vue-spectrum/radio';
import {StepList} from '@vue-spectrum/steplist';
import {Switch} from '@vue-spectrum/switch';
import {TagGroup} from '@vue-spectrum/tag';
import {Tabs} from '@vue-spectrum/tabs';
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

  it('renders flex layout styles from props', () => {
    let wrapper = mount(Flex, {
      props: {
        direction: 'column',
        gap: 'size-200',
        justifyContent: 'space-between',
        alignItems: 'center',
        wrap: true
      },
      slots: {
        default: 'Flex content'
      }
    });

    let element = wrapper.element as HTMLElement;
    expect(wrapper.classes()).toContain('vs-flex');
    expect(element.style.display).toBe('flex');
    expect(element.style.flexDirection).toBe('column');
    expect(element.style.gap).toBe('16px');
    expect(element.style.justifyContent).toBe('space-between');
    expect(element.style.alignItems).toBe('center');
    expect(element.style.flexWrap).toBe('wrap');
  });

  it('renders grid layout styles and helper expressions', () => {
    let columns = repeat(2, minmax(0, '1fr'));
    let wrapper = mount(Grid, {
      props: {
        columns,
        gap: 'size-100'
      }
    });

    let element = wrapper.element as HTMLElement;
    expect(wrapper.classes()).toContain('vs-grid');
    expect(element.style.display).toBe('grid');
    expect(element.style.gridTemplateColumns).toContain('minmax(0, 1fr)');
    expect(element.style.gap).toBe('8px');
    expect(fitContent('240px')).toBe('fit-content(240px)');
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

  it('renders illustrated message title, description, and variant class', () => {
    let wrapper = mount(IllustratedMessage, {
      props: {
        title: 'Empty state',
        description: 'No migration tasks found.',
        variant: 'info'
      }
    });

    expect(wrapper.classes()).toContain('vs-illustrated-message');
    expect(wrapper.classes()).toContain('vs-illustrated-message--info');
    expect(wrapper.get('.vs-illustrated-message__heading').text()).toBe('Empty state');
    expect(wrapper.get('.vs-illustrated-message__description').text()).toBe('No migration tasks found.');
  });

  it('renders icon variants with expected accessibility and classes', () => {
    let wrapper = mount(Icon, {
      props: {
        label: 'Direction',
        size: 'l'
      },
      slots: {
        default: '<svg viewBox="0 0 24 24"><path d="M5 12h14" /></svg>'
      }
    });

    expect(wrapper.classes()).toContain('vs-icon--l');
    expect(wrapper.attributes('aria-label')).toBe('Direction');

    let uiIcon = mount(UIIcon, {
      slots: {
        default: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /></svg>'
      }
    });
    expect(uiIcon.classes()).toContain('vs-ui-icon');

    let illustration = mount(Illustration, {
      slots: {
        default: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" /></svg>'
      }
    });
    expect(illustration.classes()).toContain('vs-illustration');
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

  it('renders labeled value with list-formatted content', () => {
    let wrapper = mount(LabeledValue, {
      props: {
        label: 'Libraries',
        value: ['Vue Spectrum', 'React Spectrum']
      }
    });

    expect(wrapper.classes()).toContain('vs-labeled-value');
    expect(wrapper.get('.vs-labeled-value__label').text()).toBe('Libraries');
    let value = wrapper.get('.vs-labeled-value__value').text();
    expect(value).toContain('Vue Spectrum');
    expect(value).toContain('React Spectrum');
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

  it('renders button group orientation and alignment classes', () => {
    let wrapper = mount(ButtonGroup, {
      props: {
        orientation: 'vertical',
        align: 'end'
      },
      slots: {
        default: '<button type="button">First</button><button type="button">Second</button>'
      }
    });

    expect(wrapper.classes()).toContain('vs-button-group');
    expect(wrapper.classes()).toContain('vs-button-group--vertical');
    expect(wrapper.classes()).toContain('vs-button-group--align-end');
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

  it('emits model updates and applies aria semantics for step list interactions', async () => {
    let wrapper = mount(StepList, {
      props: {
        ariaLabel: 'Checkout steps',
        modelValue: 'shipping',
        items: [
          {key: 'shipping', label: 'Shipping'},
          {key: 'payment', label: 'Payment'},
          {key: 'review', label: 'Review', disabled: true}
        ]
      }
    });

    let links = wrapper.findAll('a.vs-steplist__link');
    expect(wrapper.attributes('role')).toBe('list');
    expect(wrapper.attributes('aria-label')).toBe('Checkout steps');
    expect(links).toHaveLength(3);
    expect(links[0].attributes('aria-current')).toBe('step');
    expect(links[2].attributes('aria-disabled')).toBe('true');

    await links[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['payment']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['payment']);
  });

  it('updates tab selection and panel content from tab interactions', async () => {
    let wrapper = mount(Tabs, {
      props: {
        modelValue: 'overview',
        items: [
          {key: 'overview', label: 'Overview', content: 'Overview panel'},
          {key: 'details', label: 'Details', content: 'Details panel'},
          {key: 'history', label: 'History', content: 'History panel', disabled: true}
        ]
      }
    });

    let tabButtons = wrapper.findAll('button.vs-tabs__tab');
    expect(wrapper.find('[role=\"tablist\"]').exists()).toBe(true);
    expect(wrapper.get('[role=\"tabpanel\"]').text()).toContain('Overview panel');
    expect(tabButtons[2].attributes('aria-disabled')).toBe('true');

    await tabButtons[1].trigger('click');
    expect(wrapper.get('[role=\"tabpanel\"]').text()).toContain('Details panel');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['details']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['details']);
  });

  it('selects and removes tags within tag group interactions', async () => {
    let wrapper = mount(TagGroup, {
      props: {
        label: 'Framework tags',
        selectionMode: 'single',
        modelValue: ['react'],
        items: [
          {key: 'react', label: 'React'},
          {key: 'vue', label: 'Vue'},
          {key: 'svelte', label: 'Svelte', disabled: true}
        ]
      }
    });

    let tags = wrapper.findAll('.vs-tag-group__tag');
    expect(wrapper.text()).toContain('Framework tags');
    expect(tags).toHaveLength(3);
    expect(tags[0].classes()).toContain('is-selected');
    expect(tags[2].classes()).toContain('is-disabled');

    await tags[1].trigger('click');
    expect(wrapper.findAll('button.vs-tag-group__remove')).toHaveLength(3);

    await wrapper.findAll('button.vs-tag-group__remove')[0].trigger('click');
    expect(wrapper.emitted('remove')?.[0]).toEqual([['react']]);
  });

  it('emits press events from standalone cards', async () => {
    let wrapper = mount(Card, {
      props: {
        title: 'Snapshot'
      }
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('press')).toHaveLength(1);
  });

  it('emits selection and action from card view items', async () => {
    let wrapper = mount(CardView, {
      props: {
        modelValue: 'overview',
        items: [
          {id: 'overview', title: 'Overview'},
          {id: 'quality', title: 'Quality'}
        ]
      }
    });

    await wrapper.findAll('button.vs-card-view__item')[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['quality']);
    expect(wrapper.emitted('action')?.[0]).toEqual([{id: 'quality', title: 'Quality'}]);
  });

  it('emits input and change events from color field edits', async () => {
    let wrapper = mount(ColorField, {
      props: {
        modelValue: '#3366ff',
        label: 'Theme color'
      }
    });

    let input = wrapper.get('input.vs-color-field__input');
    await input.setValue('#10b981');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#10b981']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['#10b981']);
  });

  it('emits swatch selection changes and returns selected swatch item', async () => {
    let wrapper = mount(ColorSwatchPicker, {
      props: {
        modelValue: 'azure',
        items: [
          {id: 'azure', label: 'Azure', color: '#0ea5e9'},
          {id: 'emerald', label: 'Emerald', color: '#10b981'}
        ]
      }
    });

    await wrapper.findAll('button.vs-color-swatch-picker__item')[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['emerald']);
    expect(wrapper.emitted('change')?.[0]).toEqual([{id: 'emerald', label: 'Emerald', color: '#10b981'}]);
  });

  it('emits color updates from color picker field edits', async () => {
    let wrapper = mount(ColorPicker, {
      props: {
        modelValue: '#3366ff',
        label: 'Picker'
      }
    });

    await wrapper.get('input.vs-color-field__input').setValue('#f59e0b');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#f59e0b']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['#f59e0b']);
  });

  it('emits update and change events from date picker inputs', async () => {
    let wrapper = mount(DatePicker, {
      props: {
        modelValue: '2026-02-19',
        label: 'Date picker'
      }
    });

    await wrapper.get('input.vs-date-picker__input').setValue('2026-02-20');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-02-20']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['2026-02-20']);
  });

  it('emits structured range updates from date range picker inputs', async () => {
    let wrapper = mount(DateRangePicker, {
      props: {
        modelValue: {
          start: '2026-02-20',
          end: '2026-02-24'
        },
        label: 'Date range picker'
      }
    });

    await wrapper.findAll('input.vs-date-range-picker__input')[1].setValue('2026-02-25');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{
      start: '2026-02-20',
      end: '2026-02-25'
    }]);
    expect(wrapper.emitted('change')?.[0]).toEqual([{
      start: '2026-02-20',
      end: '2026-02-25'
    }]);
  });

  it('emits update and change events from time field inputs', async () => {
    let wrapper = mount(TimeField, {
      props: {
        modelValue: '09:30',
        label: 'Target time'
      }
    });

    await wrapper.get('input.vs-time-field__input').setValue('10:45');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['10:45']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['10:45']);
  });

  it('emits model updates and change events from picker selections', async () => {
    let wrapper = mount(Picker, {
      props: {
        modelValue: 'Q2',
        label: 'Roadmap milestone',
        items: ['Q1', 'Q2', 'Q3']
      }
    });

    await wrapper.get('select.vs-picker__select').setValue('Q3');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Q3']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['Q3']);
  });

  it('updates model value from calendar date input', async () => {
    let wrapper = mount(Calendar, {
      props: {
        modelValue: ''
      }
    });

    await wrapper.get('input[type="date"]').setValue('2026-03-01');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-03-01']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['2026-03-01']);
  });

  it('propagates v-model through range calendar inputs', async () => {
    let wrapper = mount({
      components: {RangeCalendar},
      data: () => ({
        range: {
          start: '',
          end: ''
        }
      }),
      template: `
        <RangeCalendar v-model="range" />
      `
    });

    let inputs = wrapper.findAll('input[type="date"]');
    await inputs[0].setValue('2026-03-01');
    await inputs[1].setValue('2026-03-05');
    expect((wrapper.vm as unknown as {range: {start: string, end: string}}).range).toEqual({
      start: '2026-03-01',
      end: '2026-03-05'
    });
  });

  it('emits selected files from file trigger input', async () => {
    let wrapper = mount(FileTrigger, {
      props: {
        allowsMultiple: true
      },
      slots: {
        default: 'Select assets'
      }
    });

    let input = wrapper.get('input[type="file"]');
    let first = new File(['alpha'], 'alpha.txt', {type: 'text/plain'});
    let second = new File(['beta'], 'beta.txt', {type: 'text/plain'});

    Object.defineProperty(input.element, 'files', {
      configurable: true,
      value: [first, second]
    });

    await input.trigger('change');

    let selected = wrapper.emitted('select')?.[0]?.[0] as File[];
    let changed = wrapper.emitted('change')?.[0]?.[0] as File[];
    expect(selected.map((file) => file.name)).toEqual(['alpha.txt', 'beta.txt']);
    expect(changed.map((file) => file.name)).toEqual(['alpha.txt', 'beta.txt']);
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
