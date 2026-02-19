import {mount} from '@vue/test-utils';
import {ref} from 'vue';
import {describe, expect, it} from 'vitest';
import {useActionGroup, useActionGroupItem} from '@vue-aria/actiongroup';
import {useAutocomplete, useSearchAutocomplete} from '@vue-aria/autocomplete';
import {watchModals} from '@vue-aria/aria-modal-polyfill';
import {useBreadcrumbItem, useBreadcrumbs} from '@vue-aria/breadcrumbs';
import {useButton, useToggleButton, useToggleButtonGroup, useToggleButtonGroupItem} from '@vue-aria/button';
import {useCalendar, useCalendarCell, useCalendarGrid, useRangeCalendar} from '@vue-aria/calendar';
import {useCheckbox, useCheckboxGroup, useCheckboxGroupItem} from '@vue-aria/checkbox';
import {CollectionBuilder, useCachedChildren} from '@vue-aria/collections';
import {useComboBox} from '@vue-aria/combobox';
import {useColorArea, useColorChannelField, useColorField, useColorSlider, useColorSwatch, useColorWheel} from '@vue-aria/color';
import {useDateField, useDatePicker, useDateRangePicker, useTimeField} from '@vue-aria/datepicker';
import {useDialog as useAriaDialog} from '@vue-aria/dialog';
import {useDisclosure as useAriaDisclosure} from '@vue-aria/disclosure';
import {Accordion, Disclosure, DisclosurePanel, DisclosureTitle} from '@vue-spectrum/accordion';
import {ActionBar} from '@vue-spectrum/actionbar';
import {ActionGroup} from '@vue-spectrum/actiongroup';
import {SearchAutocomplete} from '@vue-spectrum/autocomplete';
import {Breadcrumbs} from '@vue-spectrum/breadcrumbs';
import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {Dialog} from '@vue-spectrum/dialog';
import {ListView} from '@vue-spectrum/list';
import {Menu} from '@vue-spectrum/menu';
import {Popover} from '@vue-spectrum/overlays';

describe('Vue migration composition components', () => {
  it('computes next selection state for vue-aria action group composables', () => {
    let selectedKeys = ref(['Edit']);
    let actionGroup = useActionGroup({
      selectedKeys,
      selectionMode: ref('multiple')
    });
    let presses: Array<{key: string, selectedKeys: string[]}> = [];

    let item = useActionGroupItem({
      actionGroup,
      key: 'Delete',
      onPress: (key, nextSelectedKeys) => {
        presses.push({
          key,
          selectedKeys: Array.from(nextSelectedKeys)
        });
      }
    });

    expect(item.isSelected.value).toBe(false);
    expect(item.itemProps.value.role).toBe('menuitemcheckbox');
    item.press();
    expect(presses).toEqual([{key: 'Delete', selectedKeys: ['Edit', 'Delete']}]);
  });

  it('toggles aria-hidden when watched modal containers are added and removed', async () => {
    let previousMarkup = document.body.innerHTML;
    document.body.innerHTML = '<main data-testid=\"app-shell\"></main><div data-testid=\"portal-root\"></div>';

    try {
      let portalRoot = document.querySelector('[data-testid=\"portal-root\"]');
      let appShell = document.querySelector('[data-testid=\"app-shell\"]');

      if (!(portalRoot instanceof HTMLElement) || !(appShell instanceof HTMLElement)) {
        throw new Error('Expected portal and app shell nodes');
      }

      let stopWatching = watchModals('[data-testid=\"portal-root\"]', {document});
      let modalContainer = document.createElement('div');
      modalContainer.innerHTML = '<section aria-modal=\"true\"><p>Modal content</p></section>';

      portalRoot.append(modalContainer);
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(appShell.getAttribute('aria-hidden')).toBe('true');

      portalRoot.removeChild(modalContainer);
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(appShell.getAttribute('aria-hidden')).toBeNull();

      stopWatching();
    } finally {
      document.body.innerHTML = previousMarkup;
    }
  });

  it('filters autocomplete items and exposes focused key', () => {
    let inputValue = ref('vue');
    let autocomplete = useAutocomplete({
      inputValue,
      items: ['Vue', 'React', 'Svelte']
    });

    expect(autocomplete.filteredItems.value.map((item) => item.textValue)).toEqual(['Vue']);
    expect(autocomplete.focusedKey.value).toBe('Vue');

    inputValue.value = '';
    expect(autocomplete.filteredItems.value.map((item) => item.textValue)).toEqual(['Vue', 'React', 'Svelte']);
  });

  it('submits and clears search autocomplete state', () => {
    let inputValue = ref('rea');
    let submissions: Array<{focusedKey: string | null, value: string}> = [];
    let clearCount = 0;

    let autocomplete = useSearchAutocomplete({
      inputValue,
      items: ['React', 'Vue'],
      onClear: () => {
        clearCount += 1;
      },
      onSubmit: (value, focusedKey) => {
        submissions.push({value, focusedKey});
      }
    });

    autocomplete.submit();
    expect(submissions).toEqual([{value: 'rea', focusedKey: 'React'}]);

    autocomplete.clear();
    expect(inputValue.value).toBe('');
    expect(clearCount).toBe(1);
    expect(autocomplete.clearButtonProps.value.disabled).toBe(true);
  });

  it('provides breadcrumb nav props with default and custom labels', () => {
    let breadcrumbs = useBreadcrumbs();
    expect(breadcrumbs.navProps.value['aria-label']).toBe('Breadcrumbs');

    let customBreadcrumbs = useBreadcrumbs({
      ariaLabel: ref('Project trail')
    });
    expect(customBreadcrumbs.navProps.value['aria-label']).toBe('Project trail');
  });

  it('computes breadcrumb item props and press behavior', () => {
    let pressCount = 0;
    let item = useBreadcrumbItem({
      elementType: 'span',
      onPress: () => {
        pressCount += 1;
      }
    });

    expect(item.itemProps.value.role).toBe('link');
    expect(item.itemProps.value.tabindex).toBe(0);
    expect(item.itemProps.value['aria-disabled']).toBeUndefined();
    item.press();
    expect(pressCount).toBe(1);

    let currentItem = useBreadcrumbItem({
      autoFocus: true,
      elementType: 'span',
      isCurrent: true,
      onPress: () => {
        pressCount += 1;
      }
    });

    expect(currentItem.itemProps.value['aria-current']).toBe('page');
    expect(currentItem.itemProps.value['aria-disabled']).toBe(true);
    expect(currentItem.itemProps.value.tabindex).toBe(-1);
    currentItem.press();
    expect(pressCount).toBe(1);
  });

  it('computes vue-aria button props and press interactions', () => {
    let pressCount = 0;
    let button = useButton({
      elementType: 'a',
      href: '/docs',
      onPress: () => {
        pressCount += 1;
      }
    });

    expect(button.buttonProps.value.role).toBe('button');
    expect(button.buttonProps.value.href).toBe('/docs');
    expect(button.buttonProps.value.tabindex).toBe(0);
    button.press();
    expect(button.isPressed.value).toBe(false);
    expect(pressCount).toBe(1);

    let disabledButton = useButton({
      elementType: 'a',
      href: '/docs',
      isDisabled: true
    });
    expect(disabledButton.buttonProps.value['aria-disabled']).toBe(true);
    expect(disabledButton.buttonProps.value.href).toBeUndefined();
  });

  it('toggles vue-aria button selection and group-item radio state', () => {
    let isSelected = ref(false);
    let toggleButton = useToggleButton({
      isSelected
    });

    toggleButton.press();
    expect(isSelected.value).toBe(true);
    expect(toggleButton.buttonProps.value['aria-pressed']).toBe(true);

    let selectedKeys = ref<Iterable<string>>(['bold']);
    let group = useToggleButtonGroup({
      selectedKeys,
      selectionMode: 'single'
    });

    let italicItem = useToggleButtonGroupItem({
      group,
      id: 'italic'
    });

    expect(italicItem.buttonProps.value.role).toBe('radio');
    expect(italicItem.buttonProps.value['aria-checked']).toBe(false);
    italicItem.press();
    expect(Array.from(selectedKeys.value)).toEqual(['italic']);
  });

  it('manages vue-aria calendar navigation and date selection', () => {
    let selectedDate = ref<Date | null>(new Date(2025, 0, 15));
    let visibleDate = ref(new Date(2025, 0, 1));
    let calendar = useCalendar({
      value: selectedDate,
      visibleDate
    });

    expect(calendar.visibleRangeLabel.value).toContain('2025');
    calendar.nextPage();
    expect(calendar.visibleDate.value.getMonth()).toBe(1);

    calendar.selectDate(new Date(2025, 1, 10));
    expect(selectedDate.value?.getMonth()).toBe(1);
    expect(selectedDate.value?.getDate()).toBe(10);
  });

  it('builds calendar grid and cell selection for date and range flows', () => {
    let visibleDate = ref(new Date(2025, 0, 1));
    let calendar = useCalendar({visibleDate});
    let grid = useCalendarGrid({visibleDate});

    expect(grid.weekDays.value).toHaveLength(7);
    expect(grid.weeks.value).toHaveLength(6);

    let cellDate = grid.weeks.value[2][3];
    let cell = useCalendarCell({
      calendar,
      date: cellDate
    });
    cell.press();
    expect(calendar.selectedDate.value?.getDate()).toBe(cellDate.getDate());

    let rangeValue = ref({
      start: null as Date | null,
      end: null as Date | null
    });
    let rangeCalendar = useRangeCalendar({
      visibleDate: ref(new Date(2025, 0, 1)),
      value: rangeValue
    });
    rangeCalendar.selectDate(new Date(2025, 0, 5));
    rangeCalendar.selectDate(new Date(2025, 0, 8));

    let rangeCell = useCalendarCell({
      calendar: rangeCalendar,
      date: new Date(2025, 0, 6)
    });
    expect(rangeCell.isSelected.value).toBe(true);
  });

  it('toggles vue-aria checkbox selection and mixed state flags', () => {
    let isSelected = ref(false);
    let checkbox = useCheckbox({
      isIndeterminate: true,
      isSelected
    });

    expect(checkbox.inputProps.value['aria-checked']).toBe('mixed');
    checkbox.press();
    expect(isSelected.value).toBe(true);
    expect(checkbox.isPressed.value).toBe(false);
  });

  it('updates checkbox group selections through group item composables', () => {
    let selectedValues = ref<Iterable<string>>(['Docs']);
    let group = useCheckboxGroup({
      name: 'features',
      selectedValues
    });

    let testsItem = useCheckboxGroupItem({
      group,
      value: 'Tests'
    });

    expect(testsItem.inputProps.value.name).toBe('features');
    testsItem.press();
    expect(Array.from(selectedValues.value)).toEqual(['Docs', 'Tests']);

    testsItem.press();
    expect(Array.from(selectedValues.value)).toEqual(['Docs']);
  });

  it('builds and filters vue-aria collections with key navigation', () => {
    let builder = new CollectionBuilder<{id: string, label: string}>();
    let collection = builder.build({
      getKey: (item) => item.id,
      getTextValue: (item) => item.label,
      items: [
        {id: 'alpha', label: 'Alpha'},
        {id: 'beta', label: 'Beta'}
      ]
    });

    expect(collection.getFirstKey()).toBe('alpha');
    expect(collection.getKeyAfter('alpha')).toBe('beta');

    let filtered = collection.filter((textValue) => textValue.startsWith('A'));
    expect(filtered.getFirstKey()).toBe('alpha');
    expect(filtered.getLastKey()).toBe('alpha');
  });

  it('caches vue-aria collection children by item identity', () => {
    let alpha = {id: 'alpha', label: 'Alpha'};
    let beta = {id: 'beta', label: 'Beta'};
    let items = ref([alpha, beta]);

    let cachedChildren = useCachedChildren({
      addIdAndValue: true,
      children: (item: {id: string, label: string}) => item.label,
      getKey: (item: {id: string, label: string}) => item.id,
      idScope: 'starter',
      items
    });

    let firstPass = cachedChildren.value as Array<{key: string, rendered: unknown}>;
    expect(firstPass[0].key).toBe('starter:alpha');
    expect(firstPass[0].rendered).toBe('Alpha');

    items.value = [alpha, beta];
    let secondPass = cachedChildren.value as Array<{key: string, rendered: unknown}>;
    expect(secondPass[0]).toBe(firstPass[0]);
  });

  it('updates vue-aria color slider, channel field, and text field values', () => {
    let channelValue = ref(40);
    let slider = useColorSlider({
      channel: 'hue',
      value: channelValue
    });

    slider.increment();
    expect(channelValue.value).toBe(41);
    slider.setValue(720);
    expect(channelValue.value).toBe(360);

    let channelField = useColorChannelField({
      channel: 'hue',
      value: channelValue
    });
    channelField.decrement();
    expect(channelValue.value).toBe(359);

    let colorText = ref('#ff0000');
    let colorField = useColorField({
      value: colorText
    });
    colorField.setValue('00ff00');
    expect(colorText.value).toBe('#00ff00');
  });

  it('updates vue-aria color area, wheel, and swatch props', () => {
    let x = ref(0);
    let y = ref(0);
    let area = useColorArea({
      x,
      y
    });
    area.setValue(0.25, 0.75);
    expect(x.value).toBeCloseTo(0.25);
    expect(y.value).toBeCloseTo(0.75);

    let angle = ref(0);
    let radius = ref(0);
    let wheel = useColorWheel({
      angle,
      radius
    });
    wheel.setValue(420, 0.5);
    expect(angle.value).toBe(60);
    expect(radius.value).toBe(0.5);

    let swatch = useColorSwatch({
      color: ref('ff00ff')
    });
    expect(swatch.swatchProps.value.style.backgroundColor).toBe('#ff00ff');
  });

  it('filters and selects options with vue-aria combobox composable state', () => {
    let inputValue = ref('');
    let selectedKey = ref<string | null>(null);
    let comboBox = useComboBox({
      inputValue,
      items: ['React', 'Vue', 'Svelte'],
      selectedKey
    });

    comboBox.open('first');
    expect(comboBox.isOpen.value).toBe(true);
    expect(comboBox.focusedKey.value).toBe('React');

    inputValue.value = 'vu';
    expect(comboBox.filteredItems.value.map((item) => item.textValue)).toEqual(['Vue']);

    comboBox.selectKey('Vue');
    expect(selectedKey.value).toBe('Vue');
    expect(inputValue.value).toBe('Vue');
    expect(comboBox.isOpen.value).toBe(false);
  });

  it('reverts non-custom combobox input to last committed value', () => {
    let inputValue = ref('');
    let comboBox = useComboBox({
      allowsCustomValue: false,
      inputValue,
      items: ['One', 'Two']
    });

    comboBox.selectKey('One');
    inputValue.value = 'Custom value';
    comboBox.commit();
    expect(inputValue.value).toBe('One');
  });

  it('clamps vue-aria date field and time field values within min/max bounds', () => {
    let dateValue = ref('2026-02-05');
    let dateField = useDateField({
      inputValue: dateValue,
      maxValue: '2026-02-20',
      minValue: '2026-02-01'
    });
    dateField.setValue('2026-03-01');
    expect(dateValue.value).toBe('2026-02-20');
    expect(dateField.isInvalid.value).toBe(false);

    let timeValue = ref('09:30');
    let timeField = useTimeField({
      inputValue: timeValue,
      maxValue: '10:00'
    });
    timeField.setValue('11:45');
    expect(timeValue.value).toBe('10:00');
  });

  it('updates vue-aria date picker and date range picker selection state', () => {
    let pickerValue = ref<string | null>(null);
    let picker = useDatePicker({
      maxValue: '2026-02-28',
      minValue: '2026-02-01',
      value: pickerValue
    });

    picker.open();
    expect(picker.isOpen.value).toBe(true);
    picker.setValue('2026-03-10');
    expect(pickerValue.value).toBe('2026-02-28');
    picker.close();
    expect(picker.isOpen.value).toBe(false);

    let rangeValue = ref({
      start: null as string | null,
      end: null as string | null
    });
    let rangePicker = useDateRangePicker({
      maxValue: '2026-02-28',
      minValue: '2026-02-01',
      value: rangeValue
    });

    rangePicker.setStart('2026-02-20');
    rangePicker.setEnd('2026-03-10');
    expect(rangeValue.value).toEqual({
      start: '2026-02-20',
      end: '2026-02-28'
    });

    rangePicker.setRange({
      start: '2026-02-25',
      end: '2026-02-10'
    });
    expect(rangeValue.value).toEqual({
      start: '2026-02-25',
      end: '2026-02-25'
    });
    expect(rangePicker.isInvalid.value).toBe(false);
  });

  it('manages vue-aria dialog labeling and open state', () => {
    let openChanges: boolean[] = [];
    let dialog = useAriaDialog({
      ariaDescribedby: 'starter-dialog-description',
      onOpenChange: (isOpen) => {
        openChanges.push(isOpen);
      }
    });

    expect(dialog.dialogProps.value.role).toBe('dialog');
    expect(dialog.dialogProps.value.hidden).toBe(true);
    expect(dialog.dialogProps.value['aria-labelledby']).toBe(dialog.titleProps.value.id);

    dialog.open();
    expect(dialog.isOpen.value).toBe(true);
    expect(dialog.dialogProps.value.hidden).toBe(false);
    dialog.toggle();
    expect(dialog.isOpen.value).toBe(false);
    expect(openChanges).toEqual([true, false]);
  });

  it('keeps non-dismissable vue-aria dialog open when close is requested', () => {
    let dialog = useAriaDialog({
      ariaLabel: 'Critical alert',
      defaultOpen: true,
      isDismissable: false,
      role: 'alertdialog'
    });

    dialog.close();
    expect(dialog.isOpen.value).toBe(true);
    expect(dialog.dialogProps.value.role).toBe('alertdialog');
    expect(dialog.dialogProps.value['aria-label']).toBe('Critical alert');
  });

  it('toggles vue-aria disclosure expanded state and panel visibility', () => {
    let disclosure = useAriaDisclosure();
    expect(disclosure.isExpanded.value).toBe(false);
    expect(disclosure.panelProps.value.hidden).toBe(true);

    disclosure.toggle();
    expect(disclosure.isExpanded.value).toBe(true);
    expect(disclosure.buttonProps.value['aria-expanded']).toBe(true);
    expect(disclosure.panelProps.value.hidden).toBe(false);

    disclosure.collapse();
    expect(disclosure.isExpanded.value).toBe(false);
  });

  it('preserves controlled disclosure state when disabled', () => {
    let expanded = ref(true);
    let changes: boolean[] = [];
    let disclosure = useAriaDisclosure({
      isDisabled: true,
      isExpanded: expanded,
      onExpandedChange: (nextExpanded) => {
        changes.push(nextExpanded);
      }
    });

    disclosure.toggle();
    expect(expanded.value).toBe(true);
    expect(disclosure.buttonProps.value.disabled).toBe(true);
    expect(changes).toEqual([]);
  });

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

  it('emits open and close lifecycle events from contextual help controls', async () => {
    let wrapper = mount(ContextualHelp, {
      props: {
        modelValue: false,
        title: 'Need help',
        variant: 'info'
      },
      slots: {
        default: 'Additional context'
      }
    });

    await wrapper.get('button.vs-contextual-help__trigger').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
    expect(wrapper.emitted('open')).toHaveLength(1);
    expect(wrapper.find('section.vs-contextual-help__dialog').exists()).toBe(true);

    await wrapper.get('button.vs-contextual-help__close').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false]);
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

  it('emits action and clear selection events from action bar controls', async () => {
    let wrapper = mount(ActionBar, {
      props: {
        selectedItemCount: 2,
        items: ['Approve', 'Archive']
      }
    });

    await wrapper.findAll('button.vs-action-bar__action')[1].trigger('click');
    await wrapper.get('button.vs-action-bar__clear').trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['Archive']);
    expect(wrapper.emitted('clearSelection')).toHaveLength(1);
  });

  it('emits action and selection updates from action group', async () => {
    let wrapper = mount(ActionGroup, {
      props: {
        modelValue: ['Edit'],
        items: ['Edit', 'Delete'],
        selectionMode: 'multiple'
      }
    });

    await wrapper.findAll('button.vs-action-group__item')[1].trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['Delete']);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['Edit', 'Delete']]);
  });

  it('emits action when breadcrumb links are activated', async () => {
    let wrapper = mount(Breadcrumbs, {
      props: {
        items: ['Home', 'Migration', 'Starter'],
        current: 'Starter'
      }
    });

    await wrapper.findAll('button.vs-breadcrumbs__link')[0].trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['Home']);
    expect(wrapper.get('.vs-breadcrumbs__current').text()).toBe('Starter');
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
