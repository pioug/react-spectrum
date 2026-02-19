import {mount} from '@vue/test-utils';
import {ref} from 'vue';
import {describe, expect, it, vi} from 'vitest';
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
import {useDrag, useDrop} from '@vue-aria/dnd';
import {EXAMPLE_THEME_CLASS, useExampleTheme} from '@vue-aria/example-theme';
import {useFocusRing, useHasTabbableChild} from '@vue-aria/focus';
import {useFormValidation} from '@vue-aria/form';
import {
  GridKeyboardDelegate,
  useGrid,
  useGridCell,
  useGridRow,
  useGridRowGroup,
  useGridSelectionAnnouncement,
  useGridSelectionCheckbox,
  useHighlightSelectionDescription
} from '@vue-aria/grid';
import {
  useGridList,
  useGridListItem,
  useGridListSection,
  useGridListSelectionCheckbox
} from '@vue-aria/gridlist';
import {
  I18nProvider,
  isRTL,
  useCollator,
  useDateFormatter,
  useDefaultLocale,
  useFilter,
  useListFormatter,
  useLocale,
  useLocalizedStringFormatter,
  useMessageFormatter,
  useNumberFormatter
} from '@vue-aria/i18n';
import {useField, useLabel} from '@vue-aria/label';
import {UNSTABLE_createLandmarkController, useLandmark} from '@vue-aria/landmark';
import {useLink as useAriaLink} from '@vue-aria/link';
import {getItemId, listData, useListBox as useAriaListBox, useListBoxSection as useAriaListBoxSection, useOption as useAriaOption} from '@vue-aria/listbox';
import {announce, clearAnnouncer, destroyAnnouncer} from '@vue-aria/live-announcer';
import {
  addWindowFocusTracking,
  setInteractionModality,
  useFocus,
  useFocusVisible,
  useFocusWithin,
  useHover,
  useInteractOutside,
  useKeyboard,
  useLongPress,
  useMove,
  usePress
} from '@vue-aria/interactions';
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

function createPointerEvent(
  type: string,
  init: {button?: number, pointerId?: number, pointerType?: 'mouse' | 'pen' | 'touch'} = {}
): PointerEvent {
  if (typeof PointerEvent !== 'undefined') {
    return new PointerEvent(type, {
      bubbles: true,
      button: init.button ?? 0,
      pointerId: init.pointerId ?? 1,
      pointerType: init.pointerType ?? 'mouse'
    });
  }

  let event = new MouseEvent(type, {
    bubbles: true,
    button: init.button ?? 0
  }) as unknown as PointerEvent;
  Object.defineProperty(event, 'pointerId', {value: init.pointerId ?? 1});
  Object.defineProperty(event, 'pointerType', {value: init.pointerType ?? 'mouse'});
  return event;
}

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

  it('tracks vue-aria dnd drag lifecycle callbacks and operation state', () => {
    let dragEvents: Array<string> = [];
    let drag = useDrag({
      dragItems: [{id: 'ticket-1', type: 'ticket', value: {id: 1}}],
      onDragEnd: (operation) => {
        dragEvents.push(`end:${operation}`);
      },
      onDragMove: (point) => {
        dragEvents.push(`move:${point.x},${point.y}`);
      },
      onDragStart: () => {
        dragEvents.push('start');
      }
    });

    drag.startDrag();
    drag.moveDrag({x: 40, y: 88});
    drag.endDrag('move');

    expect(drag.isDragging.value).toBe(false);
    expect(drag.lastDropOperation.value).toBe('move');
    expect(dragEvents).toEqual(['start', 'move:40,88', 'end:move']);
  });

  it('filters vue-aria dnd drops by accepted drag types', () => {
    let dropEvents: Array<string> = [];
    let drop = useDrop({
      acceptedDragTypes: ['ticket'],
      onDrop: (_items, operation) => {
        dropEvents.push(`drop:${operation}`);
      },
      onDropEnter: () => {
        dropEvents.push('enter');
      }
    });

    let ticketItems = [{id: 'ticket-2', type: 'ticket', value: {id: 2}}];
    let fileItems = [{id: 'asset-1', type: 'file', value: {name: 'spec.pdf'}}];

    expect(drop.enter(ticketItems)).toBe(true);
    expect(drop.drop(ticketItems, 'copy')).toBe('copy');
    expect(drop.lastDropOperation.value).toBe('copy');
    expect(drop.enter(fileItems)).toBe(false);
    expect(drop.drop(fileItems)).toBe('cancel');
    expect(dropEvents).toEqual(['enter', 'drop:copy']);
  });

  it('computes vue-aria example theme class and color scheme metadata', () => {
    let colorScheme = ref<'dark' | 'light' | 'system'>('dark');
    let theme = useExampleTheme({
      colorScheme
    });

    expect(theme.colorScheme.value).toBe('dark');
    expect(theme.rootProps.value.class).toBe(EXAMPLE_THEME_CLASS);
    expect(theme.rootProps.value['data-theme']).toBe('dark');

    colorScheme.value = 'light';
    expect(theme.rootProps.value['data-theme']).toBe('light');
  });

  it('appends custom class names in vue-aria example theme root props', () => {
    let theme = useExampleTheme({
      rootClassName: ref('starter-shell')
    });

    expect(theme.rootProps.value.class).toBe(`${EXAMPLE_THEME_CLASS} starter-shell`);
    expect(theme.rootProps.value['data-theme']).toBe('system');
  });

  it('tracks vue-aria focus ring modality for direct and within focus flows', () => {
    let focusRing = useFocusRing();
    window.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
    focusRing.focusProps.value.onFocus?.(new FocusEvent('focus'));
    expect(focusRing.isFocused.value).toBe(true);
    expect(focusRing.isFocusVisible.value).toBe(false);

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Tab'}));
    focusRing.focusProps.value.onBlur?.(new FocusEvent('blur'));
    focusRing.focusProps.value.onFocus?.(new FocusEvent('focus'));
    expect(focusRing.isFocusVisible.value).toBe(true);

    let withinFocusRing = useFocusRing({within: true});
    withinFocusRing.focusProps.value.onFocusin?.(new FocusEvent('focusin'));
    expect(withinFocusRing.isFocused.value).toBe(true);
    withinFocusRing.focusProps.value.onFocusout?.(new FocusEvent('focusout'));
    expect(withinFocusRing.isFocused.value).toBe(false);
  });

  it('detects vue-aria tabbable child state and updates after mutations', async () => {
    let container = document.createElement('div');
    let containerRef = ref<Element | null>(container);
    let hasTabbableChild = useHasTabbableChild(containerRef);

    expect(hasTabbableChild.value).toBe(false);

    let childButton = document.createElement('button');
    container.append(childButton);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(hasTabbableChild.value).toBe(true);

    childButton.setAttribute('disabled', 'true');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(hasTabbableChild.value).toBe(false);

    let disabledResult = useHasTabbableChild(containerRef, {isDisabled: true});
    expect(disabledResult.value).toBe(false);
  });

  it('applies vue-aria form validation handlers for native validation flows', () => {
    let commitCount = 0;
    let resetCount = 0;
    let focusCount = 0;
    let validation = useFormValidation({
      focus: () => {
        focusCount += 1;
      },
      isInvalid: true,
      onCommitValidation: () => {
        commitCount += 1;
      },
      onResetValidation: () => {
        resetCount += 1;
      },
      validationBehavior: 'native',
      validationErrors: ['Value is required']
    });

    let form = document.createElement('form');
    let input = document.createElement('input');
    form.append(input);
    document.body.append(form);

    try {
      let detach = validation.attach(input);
      expect(input.validationMessage).toBe('Value is required');

      input.dispatchEvent(new Event('change', {bubbles: true}));
      expect(commitCount).toBe(1);

      input.dispatchEvent(new Event('invalid', {cancelable: true}));
      expect(commitCount).toBe(2);
      expect(focusCount).toBe(1);

      form.dispatchEvent(new Event('reset'));
      expect(resetCount).toBe(1);

      detach();
    } finally {
      document.body.removeChild(form);
    }
  });

  it('computes vue-aria grid semantics plus row and cell selection behavior', () => {
    let rowActions: string[] = [];
    let cellActions: string[] = [];
    let selectedKeys = ref(new Set<string>());
    let collection = {
      columnCount: 2,
      rows: [
        {
          key: 'row-1',
          index: 0,
          textValue: 'Backlog',
          cells: [
            {key: 'row-1-cell-1', colIndex: 0, textValue: 'Backlog'},
            {key: 'row-1-cell-2', colIndex: 1, textValue: 'Open'}
          ]
        },
        {
          key: 'row-2',
          index: 1,
          textValue: 'Done',
          cells: [
            {key: 'row-2-cell-1', colIndex: 0, textValue: 'Done'},
            {key: 'row-2-cell-2', colIndex: 1, textValue: 'Closed'}
          ]
        }
      ]
    };

    let grid = useGrid({
      ariaLabel: 'Tickets',
      collection,
      isVirtualized: true,
      onCellAction: (key) => {
        cellActions.push(key);
      },
      onRowAction: (key) => {
        rowActions.push(key);
      },
      selectedKeys,
      selectionMode: 'multiple'
    });

    expect(grid.gridProps.value.role).toBe('grid');
    expect(grid.gridProps.value['aria-multiselectable']).toBe('true');
    expect(grid.gridProps.value['aria-rowcount']).toBe(2);
    expect(grid.keyboardDelegate.value.getKeyBelow('row-1')).toBe('row-2');

    let row = useGridRow({
      grid,
      isVirtualized: true,
      row: collection.rows[0]
    });
    row.press();
    expect(row.rowProps.value['aria-rowindex']).toBe(1);
    expect(Array.from(selectedKeys.value)).toEqual(['row-1']);
    expect(rowActions).toEqual(['row-1']);

    let cell = useGridCell({
      cell: collection.rows[0].cells[0],
      grid,
      isVirtualized: true,
      row: collection.rows[0]
    });
    cell.focus();
    expect(grid.focusedKey.value).toBe('row-1-cell-1');
    cell.press();
    expect(cellActions).toEqual(['row-1-cell-1']);

    let checkbox = useGridSelectionCheckbox({
      grid,
      key: 'row-1'
    });
    checkbox.toggleSelection();
    expect(selectedKeys.value.size).toBe(1);

    let rowGroup = useGridRowGroup();
    expect(rowGroup.rowGroupProps.value.role).toBe('rowgroup');
  });

  it('builds vue-aria grid descriptions, announcements, and keyboard navigation', () => {
    let collection = {
      columnCount: 2,
      rows: [
        {
          key: 'row-1',
          index: 0,
          textValue: 'Alpha',
          cells: [
            {key: 'row-1-cell-1', colIndex: 0, textValue: 'Alpha'},
            {key: 'row-1-cell-2', colIndex: 1, textValue: 'Open'}
          ]
        },
        {
          key: 'row-2',
          index: 1,
          textValue: 'Delta',
          cells: [
            {key: 'row-2-cell-1', colIndex: 0, textValue: 'Delta'},
            {key: 'row-2-cell-2', colIndex: 1, textValue: 'Closed'}
          ]
        }
      ]
    };

    let description = useHighlightSelectionDescription({
      hasItemActions: true,
      interactionModality: 'pointer',
      selectionBehavior: 'replace',
      selectionMode: 'multiple'
    });
    expect(description.descriptionProps.value['aria-description']).toBe('Long press to select items.');

    let selectedKeys = ref(new Set<string>());
    let announcement = useGridSelectionAnnouncement({}, {
      collection,
      isFocused: true,
      selectedKeys,
      selectionMode: 'multiple'
    });

    selectedKeys.value = new Set(['row-1']);
    announcement.syncAnnouncement();
    expect(announcement.announcement.value).toContain('Alpha selected.');

    selectedKeys.value = new Set(['row-1', 'row-2']);
    announcement.syncAnnouncement();
    expect(announcement.announcement.value).toContain('2 items selected.');

    let keyboardDelegate = new GridKeyboardDelegate({
      collection,
      focusMode: 'cell'
    });
    expect(keyboardDelegate.getKeyRightOf('row-1')).toBe('row-1-cell-1');
    expect(keyboardDelegate.getKeyBelow('row-1-cell-1')).toBe('row-2-cell-1');
    expect(keyboardDelegate.getKeyForSearch('de')).toBe('row-2-cell-1');
  });

  it('computes vue-aria gridlist semantics, item state, and section props', () => {
    let actions: string[] = [];
    let selectedKeys = ref(new Set<string>());
    let collection = {
      items: [
        {key: 'story-1', index: 0, textValue: 'Story 1', description: 'First story'},
        {key: 'story-2', index: 1, textValue: 'Story 2'}
      ]
    };

    let gridList = useGridList({
      ariaLabel: 'Stories',
      collection,
      isVirtualized: true,
      onAction: (key) => {
        actions.push(key);
      },
      selectedKeys,
      selectionMode: 'multiple'
    });

    expect(gridList.gridProps.value.role).toBe('grid');
    expect(gridList.gridProps.value['aria-rowcount']).toBe(2);

    let item = useGridListItem({
      gridList,
      isVirtualized: true,
      item: collection.items[0]
    });
    item.press();
    expect(actions).toEqual(['story-1']);
    expect(item.rowProps.value.id).toContain('story-1');
    expect(item.rowProps.value['aria-selected']).toBe(true);
    expect(item.gridCellProps.value.role).toBe('gridcell');

    let selectionCheckbox = useGridListSelectionCheckbox({
      gridList,
      key: 'story-1'
    });
    selectionCheckbox.toggleSelection();
    expect(selectedKeys.value.size).toBe(0);
    expect(selectionCheckbox.checkboxProps.value['aria-labelledby']).toContain('story-1');

    let section = useGridListSection({
      ariaLabel: 'Open stories'
    });
    expect(section.rowProps.value.role).toBe('row');
    expect(section.rowHeaderProps.value.role).toBe('rowheader');
    expect(section.rowGroupProps.value.role).toBe('rowgroup');
    expect(section.rowGroupProps.value['aria-label']).toBe('Open stories');
  });

  it('formats locale-sensitive values with vue-aria i18n helpers', () => {
    let provider = I18nProvider({
      locale: 'fr-FR'
    });

    expect(useLocale().locale).toBe('fr-FR');
    expect(isRTL('ar-EG')).toBe(true);
    expect(useDefaultLocale().locale.length).toBeGreaterThan(0);

    let collator = useCollator({
      sensitivity: 'base',
      usage: 'search'
    });
    expect(collator.compare('é', 'e')).toBe(0);

    let filter = useFilter();
    expect(filter.contains('Vue Spectrum', 'spectrum')).toBe(true);
    expect(filter.startsWith('Migration', 'mig')).toBe(true);

    let listFormatter = useListFormatter({
      style: 'long',
      type: 'conjunction'
    });
    expect(listFormatter.format(['Vue', 'React']).length).toBeGreaterThan(0);

    let numberFormatter = useNumberFormatter({
      maximumFractionDigits: 1
    });
    expect(numberFormatter.format(12.34).length).toBeGreaterThan(0);

    let dateFormatter = useDateFormatter({
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC'
    });
    expect(dateFormatter.format(new Date(Date.UTC(2026, 1, 14))).length).toBeGreaterThan(0);

    let strings = {
      'en-US': {
        greeting: 'Hello {name}'
      },
      'fr-FR': {
        greeting: 'Bonjour {name}'
      }
    };
    let messageFormatter = useMessageFormatter(strings);
    expect(messageFormatter('greeting', {name: 'Codex'})).toBe('Bonjour Codex');

    let localizedFormatter = useLocalizedStringFormatter(strings);
    expect(localizedFormatter.format('greeting', {name: 'Vue'})).toBe('Bonjour Vue');

    provider.clear();
  });

  it('computes vue-aria label and field accessibility relationships', () => {
    let label = useLabel({
      label: 'Email address'
    });

    expect(label.labelProps.value.id).toBeDefined();
    expect(label.labelProps.value.htmlFor).toBe(label.fieldProps.value.id);
    expect(label.fieldProps.value['aria-labelledby']).toContain(label.labelProps.value.id as string);

    let ariaOnlyLabel = useLabel({
      'aria-label': 'Support code'
    });
    expect(ariaOnlyLabel.labelProps.value.id).toBeUndefined();
    expect(ariaOnlyLabel.fieldProps.value['aria-label']).toBe('Support code');

    let field = useField({
      ariaDescribedby: 'legacy-help',
      description: 'Provide your strongest password.',
      errorMessage: 'Password is required.',
      isInvalid: true,
      label: 'Password'
    });

    let describedBy = field.fieldProps.value['aria-describedby'] ?? '';
    expect(describedBy).toContain(field.descriptionProps.value.id);
    expect(describedBy).toContain(field.errorMessageProps.value.id);
    expect(describedBy).toContain('legacy-help');
    expect(field.fieldProps.value['aria-labelledby']).toContain(field.labelProps.value.id as string);
  });

  it('navigates vue-aria landmarks with the landmark controller', () => {
    let main = document.createElement('main');
    let navigation = document.createElement('nav');
    main.tabIndex = -1;
    navigation.tabIndex = -1;
    document.body.append(main, navigation);

    let mainFocused = 0;
    let navigationFocused = 0;

    let mainRef = ref<Element | null>(main);
    let navigationRef = ref<Element | null>(navigation);

    let mainLandmark = useLandmark({
      'aria-label': 'Main content',
      focus: () => {
        mainFocused += 1;
      },
      role: 'main'
    }, mainRef);

    let navigationLandmark = useLandmark({
      'aria-label': 'Primary navigation',
      focus: () => {
        navigationFocused += 1;
      },
      role: 'navigation'
    }, navigationRef);

    let controller = UNSTABLE_createLandmarkController();

    try {
      expect(mainLandmark.landmarkProps.value.role).toBe('main');
      expect(navigationLandmark.landmarkProps.value.role).toBe('navigation');
      expect(controller.focusMain()).toBe(true);
      expect(mainFocused).toBe(1);
      expect(document.activeElement).toBe(main);

      expect(controller.focusNext({from: main})).toBe(true);
      expect(navigationFocused).toBe(1);
      expect(document.activeElement).toBe(navigation);

      expect(controller.focusPrevious({from: navigation})).toBe(true);
      expect(mainFocused).toBe(2);
      expect(document.activeElement).toBe(main);
    } finally {
      controller.dispose();
      document.body.removeChild(main);
      document.body.removeChild(navigation);
    }
  });

  it('applies vue-aria link semantics and press interactions', () => {
    let pressCount = 0;
    let customLink = useAriaLink({
      elementType: 'span',
      onPress: () => {
        pressCount += 1;
      }
    });

    expect(customLink.linkProps.value.role).toBe('link');
    expect(customLink.linkProps.value.tabindex).toBe(0);
    expect(customLink.linkProps.value.href).toBeUndefined();

    let span = document.createElement('span');
    document.body.append(span);

    try {
      if (customLink.linkProps.value.onKeyDown) {
        span.addEventListener('keydown', customLink.linkProps.value.onKeyDown as EventListener);
      }
      if (customLink.linkProps.value.onKeyUp) {
        span.addEventListener('keyup', customLink.linkProps.value.onKeyUp as EventListener);
      }
      if (customLink.linkProps.value.onClick) {
        span.addEventListener('click', customLink.linkProps.value.onClick as EventListener);
      }

      span.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'Enter'}));
      span.dispatchEvent(new KeyboardEvent('keyup', {bubbles: true, key: 'Enter'}));
      span.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
      expect(pressCount).toBe(2);
    } finally {
      document.body.removeChild(span);
    }

    let disabledLink = useAriaLink({
      href: '/docs',
      isDisabled: true
    });

    let anchor = document.createElement('a');
    if (disabledLink.linkProps.value.onClick) {
      anchor.addEventListener('click', disabledLink.linkProps.value.onClick as EventListener);
    }

    let disabledClickEvent = new MouseEvent('click', {bubbles: true, cancelable: true});
    anchor.dispatchEvent(disabledClickEvent);
    expect(disabledLink.linkProps.value['aria-disabled']).toBe(true);
    expect(disabledLink.linkProps.value.href).toBeUndefined();
    expect(disabledClickEvent.defaultPrevented).toBe(true);
  });

  it('computes vue-aria listbox options, sections, and list data ids', () => {
    let actionEvents: Array<string> = [];
    let selectedKeys = ref(new Set<string>());

    let listBox = useAriaListBox({
      isVirtualized: true,
      label: 'Frameworks',
      onAction: (key) => {
        actionEvents.push(String(key));
      },
      selectionMode: 'multiple',
      shouldFocusOnHover: true,
      shouldSelectOnPressUp: true
    }, {
      items: [
        {key: 'react', index: 0, textValue: 'React'},
        {key: 'vue', index: 1, textValue: 'Vue', description: 'Current migration target'}
      ]
    }, selectedKeys);

    expect(listBox.listBoxProps.value.role).toBe('listbox');
    expect(listBox.listBoxProps.value['aria-multiselectable']).toBe('true');
    expect(listData.get(listBox as unknown as object)?.id).toBe(listBox.listBoxProps.value.id);

    let option = useAriaOption({
      key: 'vue'
    }, listBox);

    option.optionProps.value.onMouseEnter();
    expect(listBox.focusedKey.value).toBe('vue');
    option.optionProps.value.onMouseDown();
    option.optionProps.value.onMouseUp();
    expect(selectedKeys.value.has('vue')).toBe(true);
    expect(actionEvents).toEqual(['vue']);
    expect(option.optionProps.value.id).toBe(getItemId(listBox as unknown as object, 'vue'));
    expect(option.optionProps.value['aria-posinset']).toBe(2);
    expect(option.optionProps.value['aria-setsize']).toBe(2);

    let section = useAriaListBoxSection({
      'aria-label': 'Primary options',
      heading: 'Core frameworks'
    });
    expect(section.itemProps.value.role).toBe('presentation');
    expect(section.headingProps.value.role).toBe('presentation');
    expect(section.groupProps.value.role).toBe('group');
    expect(section.groupProps.value['aria-labelledby']).toBe(section.headingProps.value.id);
  });

  it('announces and clears live region messages with vue-aria live announcer', () => {
    destroyAnnouncer();

    let label = document.createElement('span');
    label.id = 'live-announcer-label';
    label.textContent = 'Linked announcement';
    document.body.append(label);

    try {
      announce('List item selected', 'polite', 500);
      let liveRegionRoot = document.querySelector('[data-live-announcer=\"true\"]');
      expect(liveRegionRoot).not.toBeNull();
      expect(liveRegionRoot?.textContent).toContain('List item selected');

      announce({'aria-labelledby': 'live-announcer-label'}, 'assertive', 500);
      let imageAnnouncement = document.querySelector('[data-live-announcer=\"true\"] [role=\"img\"]');
      expect(imageAnnouncement?.getAttribute('aria-labelledby')).toBe('live-announcer-label');

      clearAnnouncer('polite');
      let politeLog = document.querySelector('[data-live-announcer=\"true\"] [aria-live=\"polite\"]');
      expect(politeLog?.textContent).toBe('');
    } finally {
      destroyAnnouncer();
      document.body.removeChild(label);
    }
  });

  it('handles vue-aria interactions focus, keyboard, and press callbacks', () => {
    let focusChanges: boolean[] = [];
    let focusEvents: string[] = [];
    let keyboardEvents: string[] = [];
    let pressEvents: string[] = [];
    let pressChanges: boolean[] = [];

    let focus = useFocus({
      onBlur: () => {
        focusEvents.push('blur');
      },
      onFocus: () => {
        focusEvents.push('focus');
      },
      onFocusChange: (isFocused) => {
        focusChanges.push(isFocused);
      }
    });

    let keyboard = useKeyboard({
      onKeyDown: (event) => {
        keyboardEvents.push(`down:${event.key}`);
      },
      onKeyUp: (event) => {
        keyboardEvents.push(`up:${event.key}`);
      }
    });

    let press = usePress({
      onPress: () => {
        pressEvents.push('press');
      },
      onPressChange: (isPressed) => {
        pressChanges.push(isPressed);
      },
      onPressEnd: () => {
        pressEvents.push('end');
      },
      onPressStart: () => {
        pressEvents.push('start');
      },
      onPressUp: () => {
        pressEvents.push('up');
      }
    });

    let button = document.createElement('button');
    document.body.append(button);

    try {
      if (focus.focusProps.value.onFocus) {
        button.addEventListener('focus', focus.focusProps.value.onFocus as EventListener);
      }
      if (focus.focusProps.value.onBlur) {
        button.addEventListener('blur', focus.focusProps.value.onBlur as EventListener);
      }
      if (keyboard.keyboardProps.value.onKeyDown) {
        button.addEventListener('keydown', keyboard.keyboardProps.value.onKeyDown as EventListener);
      }
      if (keyboard.keyboardProps.value.onKeyUp) {
        button.addEventListener('keyup', keyboard.keyboardProps.value.onKeyUp as EventListener);
      }
      if (press.pressProps.value.onKeyDown) {
        button.addEventListener('keydown', press.pressProps.value.onKeyDown as EventListener);
      }
      if (press.pressProps.value.onKeyUp) {
        button.addEventListener('keyup', press.pressProps.value.onKeyUp as EventListener);
      }
      if (press.pressProps.value.onClick) {
        button.addEventListener('click', press.pressProps.value.onClick as EventListener);
      }
      if (press.pressProps.value.onBlur) {
        button.addEventListener('blur', press.pressProps.value.onBlur as EventListener);
      }

      button.dispatchEvent(new FocusEvent('focus', {bubbles: true}));
      button.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'Enter'}));
      button.dispatchEvent(new KeyboardEvent('keyup', {bubbles: true, key: 'Enter'}));
      button.dispatchEvent(new FocusEvent('blur', {bubbles: true}));

      expect(focusEvents).toEqual(['focus', 'blur']);
      expect(focusChanges).toEqual([true, false]);
      expect(keyboardEvents).toEqual(['down:Enter', 'up:Enter']);
      expect(pressEvents).toEqual(['start', 'up', 'end', 'press']);
      expect(pressChanges).toEqual([true, false]);
      expect(press.isPressed.value).toBe(false);
    } finally {
      document.body.removeChild(button);
    }
  });

  it('tracks vue-aria hover/focus-within and global focus-visible state', () => {
    let hoverChanges: boolean[] = [];
    let focusWithinChanges: boolean[] = [];

    let hover = useHover({
      onHoverChange: (isHovered) => {
        hoverChanges.push(isHovered);
      }
    });

    let focusWithin = useFocusWithin({
      onFocusWithinChange: (isFocused) => {
        focusWithinChanges.push(isFocused);
      }
    });

    let focusVisible = useFocusVisible();
    let container = document.createElement('div');
    let child = document.createElement('button');
    let outside = document.createElement('button');
    container.append(child);
    document.body.append(container, outside);

    let stopWindowTracking = addWindowFocusTracking(container);

    try {
      if (hover.hoverProps.value.onPointerEnter) {
        container.addEventListener('pointerenter', hover.hoverProps.value.onPointerEnter as EventListener);
      }
      if (hover.hoverProps.value.onPointerLeave) {
        container.addEventListener('pointerleave', hover.hoverProps.value.onPointerLeave as EventListener);
      }
      if (focusWithin.focusWithinProps.value.onFocusin) {
        container.addEventListener('focusin', focusWithin.focusWithinProps.value.onFocusin as EventListener);
      }
      if (focusWithin.focusWithinProps.value.onFocusout) {
        container.addEventListener('focusout', focusWithin.focusWithinProps.value.onFocusout as EventListener);
      }

      container.dispatchEvent(createPointerEvent('pointerenter'));
      container.dispatchEvent(createPointerEvent('pointerleave'));

      child.dispatchEvent(new FocusEvent('focusin', {bubbles: true, relatedTarget: null}));
      child.dispatchEvent(new FocusEvent('focusout', {bubbles: true, relatedTarget: outside}));

      setInteractionModality('pointer');
      expect(focusVisible.isFocusVisible.value).toBe(false);
      setInteractionModality('keyboard');
      expect(focusVisible.isFocusVisible.value).toBe(true);

      expect(hoverChanges).toEqual([true, false]);
      expect(focusWithinChanges).toEqual([true, false]);
    } finally {
      stopWindowTracking();
      document.body.removeChild(container);
      document.body.removeChild(outside);
    }
  });

  it('fires vue-aria interact-outside and keyboard move events', () => {
    let outsideEvents: string[] = [];
    let moveEvents: Array<{type: string, x?: number, y?: number}> = [];
    let container = document.createElement('div');
    let inside = document.createElement('button');
    let outside = document.createElement('button');
    container.append(inside);
    document.body.append(container, outside);

    let stopInteractOutside = useInteractOutside({
      onInteractOutside: () => {
        outsideEvents.push('outside');
      },
      onInteractOutsideStart: () => {
        outsideEvents.push('start');
      },
      ref: ref(container)
    });

    let move = useMove({
      onMove: (event) => {
        moveEvents.push({
          type: event.type,
          x: event.deltaX,
          y: event.deltaY
        });
      },
      onMoveEnd: (event) => {
        moveEvents.push({type: event.type});
      },
      onMoveStart: (event) => {
        moveEvents.push({type: event.type});
      }
    });

    try {
      if (move.moveProps.value.onKeyDown) {
        container.addEventListener('keydown', move.moveProps.value.onKeyDown as EventListener);
      }

      outside.dispatchEvent(createPointerEvent('pointerdown'));
      outside.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      container.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'ArrowRight'}));

      expect(outsideEvents).toEqual(['start', 'outside']);
      expect(moveEvents).toEqual([
        {type: 'movestart'},
        {type: 'move', x: 1, y: 0},
        {type: 'moveend'}
      ]);
    } finally {
      stopInteractOutside();
      document.body.removeChild(container);
      document.body.removeChild(outside);
    }
  });

  it('triggers vue-aria long press callbacks after threshold', () => {
    vi.useFakeTimers();
    let longPressEvents: string[] = [];
    let button = document.createElement('button');
    document.body.append(button);

    let longPress = useLongPress({
      onLongPress: () => {
        longPressEvents.push('press');
      },
      onLongPressEnd: () => {
        longPressEvents.push('end');
      },
      onLongPressStart: () => {
        longPressEvents.push('start');
      },
      threshold: 25
    });

    try {
      if (longPress.longPressProps.value.onPointerDown) {
        button.addEventListener('pointerdown', longPress.longPressProps.value.onPointerDown as EventListener);
      }

      button.dispatchEvent(createPointerEvent('pointerdown', {pointerId: 7, pointerType: 'touch'}));
      vi.advanceTimersByTime(40);
      window.dispatchEvent(createPointerEvent('pointerup', {pointerId: 7, pointerType: 'touch'}));

      expect(longPressEvents).toEqual(['start', 'press', 'end']);
    } finally {
      vi.useRealTimers();
      document.body.removeChild(button);
    }
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
