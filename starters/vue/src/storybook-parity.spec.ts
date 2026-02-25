import {mount} from '@vue/test-utils';
import {nextTick} from 'vue';
import {describe, expect, it} from 'vitest';
import gridListMeta, {MyGridListItem} from '../../../packages/vue-aria-components/stories/GridList.stories';
import listBoxMeta, {MyListBoxLoaderIndicator} from '../../../packages/vue-aria-components/stories/ListBox.stories';
import tableMeta, {DndTable, makePromise, MyCheckbox} from '../../../packages/vue-aria-components/stories/Table.stories';
import tagGroupMeta, {
  EmptyTagGroup,
  MyTag,
  TagGroupExample,
  TagGroupExampleWithRemove
} from '../../../packages/vue-aria-components/stories/TagGroup.stories';
import {
  CalendarFirstDayOfWeekExample,
  CalendarMultiMonth,
  CalendarResetValue,
  RangeCalendarMultiMonthExample
} from '../../../packages/vue-aria-components/stories/Calendar.stories';
import {SelectSupport as ToolbarSelectSupport, ToolbarExample} from '../../../packages/vue-aria-components/stories/Toolbar.stories';
import treeMeta, {TreeExampleStaticRender} from '../../../packages/vue-aria-components/stories/Tree.stories';
import {
  AutocompleteInPopover,
  AutocompleteInPopoverDialogTrigger,
  AutocompleteMenuInPopoverDialogTrigger,
  AutocompleteWithListbox,
  AutocompleteWithVirtualizedListbox
} from '../../../packages/vue-aria-components/stories/Autocomplete.stories';
import {
  AsyncVirtualizedCollectionRenderSelect,
  SelectExample,
  SelectManyItems,
  SelectRenderProps,
  SelectWithTagGroup,
  VirtualizedSelect
} from '../../../packages/vue-aria-components/stories/Select.stories';
import {
  ButtonExample,
  ButtonRender,
  PendingButton,
  PendingButtonTooltip,
  RippleButtonExample
} from '../../../packages/vue-aria-components/stories/Button.stories';
import {vi} from 'vitest';

function expectExcluded(meta: unknown, storyName: string) {
  let excludeStories = (meta as {excludeStories?: string[]}).excludeStories;
  expect(excludeStories).toContain(storyName);
}

describe('Vue storybook helper parity', () => {
  it('keeps helper exports excluded from the story list', () => {
    expectExcluded(gridListMeta, 'MyGridListItem');
    expectExcluded(listBoxMeta, 'MyListBoxLoaderIndicator');
    expectExcluded(tableMeta, 'DndTable');
    expectExcluded(tableMeta, 'makePromise');
    expectExcluded(tableMeta, 'MyCheckbox');
    expectExcluded(tagGroupMeta, 'MyTag');
    expectExcluded(treeMeta, 'TreeExampleStaticRender');
  });

  it('retains helper exports used in parity fixtures', async () => {
    expect(MyGridListItem.className).toBe('item');
    expect(MyGridListItem.style.display).toBe('flex');

    let loader = MyListBoxLoaderIndicator({orientation: 'horizontal'});
    expect(loader.style.height).toBe('100px');
    expect(loader.style.width).toBe('30px');

    expect(MyCheckbox.className).toBe('react-aria-Checkbox');
    let dndFixture = DndTable({});
    expect(dndFixture.template).toContain('First Table');

    let deferred = makePromise<number>();
    deferred.resolve(7);
    await expect(deferred.promise).resolves.toBe(7);

    expect(MyTag({href: 'https://example.com'}).cursor).toBe('pointer');
    expect(TreeExampleStaticRender().template).toContain('tree-item');
  });

  it('renders live tag group stories with selection, removal, and empty-state roles', async () => {
    let interactiveStory = TagGroupExample.render?.({selectionMode: 'single'}) as ReturnType<Exclude<typeof TagGroupExample.render, undefined>>;
    let interactiveWrapper = mount(interactiveStory);
    let tags = interactiveWrapper.findAll('.react-aria-Tag');
    expect(tags).toHaveLength(4);
    expect(interactiveWrapper.get('.react-aria-TagList').attributes('role')).toBe('grid');
    expect(interactiveWrapper.find('a[href="https://nytimes.com"]').exists()).toBe(true);
    expect(tags[0].attributes('role')).toBe('row');

    let removableStory = TagGroupExampleWithRemove.render?.({selectionMode: 'none'}) as ReturnType<Exclude<typeof TagGroupExampleWithRemove.render, undefined>>;
    let removableWrapper = mount(removableStory);
    expect(removableWrapper.findAll('button[slot="remove"]')).toHaveLength(4);
    await removableWrapper.find('button[slot="remove"]').trigger('click');
    await nextTick();
    expect(removableWrapper.findAll('.react-aria-Tag')).toHaveLength(3);

    let emptyStory = EmptyTagGroup.render?.({selectionMode: 'none'}) as ReturnType<Exclude<typeof EmptyTagGroup.render, undefined>>;
    let emptyWrapper = mount(emptyStory);
    expect(emptyWrapper.get('.react-aria-TagList').attributes('role')).toBe('group');
    expect(emptyWrapper.text()).toContain('No categories.');
  });

  it('renders toolbar stories with live useToolbar role/orientation props', () => {
    let toolbarStory = ToolbarExample.render?.({orientation: 'vertical'}) as ReturnType<Exclude<typeof ToolbarExample.render, undefined>>;
    let toolbarWrapper = mount(toolbarStory);
    let toolbarElement = toolbarWrapper.get('.react-aria-Toolbar');
    expect(toolbarElement.attributes('role')).toBe('toolbar');
    expect(toolbarElement.attributes('aria-orientation')).toBe('vertical');
    expect(toolbarElement.attributes('data-orientation')).toBe('vertical');

    let selectStory = ToolbarSelectSupport.render?.({orientation: 'horizontal'}) as ReturnType<Exclude<typeof ToolbarSelectSupport.render, undefined>>;
    let selectWrapper = mount(selectStory);
    let selectToolbarElement = selectWrapper.get('.react-aria-Toolbar');
    expect(selectToolbarElement.attributes('role')).toBe('toolbar');
    expect(selectToolbarElement.attributes('aria-label')).toBe('Text formatting');
    expect(selectToolbarElement.attributes('aria-orientation')).toBe('horizontal');
  });

  it('renders calendar stories with live hooks, first-day locale, and reset flows', async () => {
    let calendarResetStory = CalendarResetValue.render?.({}) as ReturnType<Exclude<typeof CalendarResetValue.render, undefined>>;
    let calendarResetWrapper = mount(calendarResetStory);
    let visibleCells = calendarResetWrapper.findAll('.react-aria-CalendarCell')
      .filter((cell) => !(cell.attributes('style') ?? '').includes('display: none'));
    expect(visibleCells.length).toBeGreaterThan(0);

    await visibleCells[0].trigger('click');
    await nextTick();
    expect(calendarResetWrapper.findAll('.react-aria-CalendarCell').some((cell) => cell.attributes('data-selected') === 'true')).toBe(true);

    let resetButtons = calendarResetWrapper.findAll('button');
    await resetButtons[resetButtons.length - 1].trigger('click');
    await nextTick();
    expect(calendarResetWrapper.findAll('.react-aria-CalendarCell').some((cell) => cell.attributes('data-selected') === 'true')).toBe(false);

    let multiMonthStory = CalendarMultiMonth.render?.({selectionAlignment: 'center'}) as ReturnType<Exclude<typeof CalendarMultiMonth.render, undefined>>;
    let multiMonthWrapper = mount(multiMonthStory);
    expect(multiMonthWrapper.findAll('.react-aria-CalendarGrid')).toHaveLength(3);
    expect(multiMonthWrapper.find('button').text()).toBe('Reset focused date');
    expect(multiMonthWrapper.get('.react-aria-Heading').text().startsWith('June')).toBe(true);

    let multiMonthStartStory = CalendarMultiMonth.render?.({selectionAlignment: 'start'}) as ReturnType<Exclude<typeof CalendarMultiMonth.render, undefined>>;
    let multiMonthStartWrapper = mount(multiMonthStartStory);
    expect(multiMonthStartWrapper.get('.react-aria-Heading').text().startsWith('July')).toBe(true);

    let multiMonthEndStory = CalendarMultiMonth.render?.({selectionAlignment: 'end'}) as ReturnType<Exclude<typeof CalendarMultiMonth.render, undefined>>;
    let multiMonthEndWrapper = mount(multiMonthEndStory);
    expect(multiMonthEndWrapper.get('.react-aria-Heading').text().startsWith('May')).toBe(true);

    let firstDayStory = CalendarFirstDayOfWeekExample.render?.({locale: 'en-US-u-ca-iso8601-fw-tue'}) as ReturnType<Exclude<typeof CalendarFirstDayOfWeekExample.render, undefined>>;
    let firstDayWrapper = mount(firstDayStory);
    expect(firstDayWrapper.find('.react-aria-CalendarHeaderCell').text()).toBe('T');

    let rangeStory = RangeCalendarMultiMonthExample.render?.({selectionAlignment: 'center'}) as ReturnType<Exclude<typeof RangeCalendarMultiMonthExample.render, undefined>>;
    let rangeWrapper = mount(rangeStory);
    expect(rangeWrapper.findAll('.react-aria-CalendarGrid')).toHaveLength(3);
    expect(rangeWrapper.findAll('.react-aria-CalendarCell').some((cell) => cell.attributes('data-selected') === 'true')).toBe(true);
    expect(rangeWrapper.get('.react-aria-Heading').text().startsWith('July')).toBe(true);

    let rangeStartStory = RangeCalendarMultiMonthExample.render?.({selectionAlignment: 'start'}) as ReturnType<Exclude<typeof RangeCalendarMultiMonthExample.render, undefined>>;
    let rangeStartWrapper = mount(rangeStartStory);
    expect(rangeStartWrapper.get('.react-aria-Heading').text().startsWith('August')).toBe(true);
  });

  it('renders autocomplete popover stories with real listbox shell content', async () => {
    let listboxStory = AutocompleteWithListbox.render?.({selectionMode: 'single'}) as ReturnType<Exclude<typeof AutocompleteWithListbox.render, undefined>>;
    let listboxWrapper = mount(listboxStory);
    expect(listboxWrapper.find('.react-aria-Popover').exists()).toBe(true);
    expect(listboxWrapper.findAll('.item').length).toBeGreaterThan(0);
    await listboxWrapper.findAll('.item')[0].trigger('click');
    await nextTick();
    expect(listboxWrapper.find('.item[aria-selected="true"]').exists()).toBe(true);

    let virtualizedStory = AutocompleteWithVirtualizedListbox.render?.({selectionMode: 'single'}) as ReturnType<Exclude<typeof AutocompleteWithVirtualizedListbox.render, undefined>>;
    let virtualizedWrapper = mount(virtualizedStory);
    expect(virtualizedWrapper.text()).toContain('Item 0');

    let menuTriggerStory = AutocompleteInPopover.render?.({}) as ReturnType<Exclude<typeof AutocompleteInPopover.render, undefined>>;
    let menuTriggerWrapper = mount(menuTriggerStory);
    expect(menuTriggerWrapper.text()).toContain('Section 0, Item 0');

    let dialogTriggerStory = AutocompleteInPopoverDialogTrigger.render?.({}) as ReturnType<Exclude<typeof AutocompleteInPopoverDialogTrigger.render, undefined>>;
    let dialogTriggerWrapper = mount(dialogTriggerStory);
    expect(dialogTriggerWrapper.text()).toContain('Section 1, Item 1');

    let dynamicDialogStory = AutocompleteMenuInPopoverDialogTrigger.render?.({}) as ReturnType<Exclude<typeof AutocompleteMenuInPopoverDialogTrigger.render, undefined>>;
    let dynamicDialogWrapper = mount(dynamicDialogStory);
    expect(dynamicDialogWrapper.text()).toContain('Command Palette');
  });

  it('renders button stories with pending, ripple, and render override parity behavior', async () => {
    let buttonStory = ButtonExample.render?.({}) as ReturnType<Exclude<typeof ButtonExample.render, undefined>>;
    let buttonWrapper = mount(buttonStory);
    let button = buttonWrapper.get('button');
    expect(button.text()).toContain('Press me');
    expect(button.attributes('data-variant')).toBe('primary');
    expect(button.attributes('data-style')).toBeDefined();

    vi.useFakeTimers();
    try {
      let pendingStory = PendingButton.render?.({children: 'Press me'}) as ReturnType<Exclude<typeof PendingButton.render, undefined>>;
      let pendingWrapper = mount(pendingStory);
      let pendingButton = pendingWrapper.get('button');
      expect(pendingButton.attributes('aria-disabled')).toBeUndefined();
      await pendingButton.trigger('click');
      await nextTick();
      expect(pendingButton.attributes('aria-disabled')).toBe('true');
      expect(pendingWrapper.get('.pending').exists()).toBe(true);
      expect(pendingWrapper.get('.spinner-pending').exists()).toBe(true);

      vi.advanceTimersByTime(5000);
      await nextTick();
      expect(pendingButton.attributes('aria-disabled')).toBeUndefined();
      expect(pendingWrapper.find('.spinner-pending').exists()).toBe(false);
      pendingWrapper.unmount();
    } finally {
      vi.useRealTimers();
    }

    let pendingTooltipStory = PendingButtonTooltip.render?.({children: 'Press me, then hover again to see tooltip'}) as ReturnType<Exclude<typeof PendingButtonTooltip.render, undefined>>;
    let pendingTooltipWrapper = mount(pendingTooltipStory);
    expect(pendingTooltipWrapper.text()).toContain('Press me, then hover again to see tooltip');
    await pendingTooltipWrapper.get('button').trigger('click');
    await nextTick();
    expect(pendingTooltipWrapper.get('button').attributes('aria-disabled')).toBe('true');

    let rippleStory = RippleButtonExample.render?.({}) as ReturnType<Exclude<typeof RippleButtonExample.render, undefined>>;
    let rippleWrapper = mount(rippleStory);
    await rippleWrapper.get('button').trigger('click', {clientX: 15, clientY: 15});
    await nextTick();
    expect(rippleWrapper.find('.ripple').exists()).toBe(true);

    let renderStory = ButtonRender.render?.({}) as ReturnType<Exclude<typeof ButtonRender.render, undefined>>;
    let renderWrapper = mount(renderStory);
    expect(renderWrapper.get('button').attributes('style')?.replace(/\s/g, '')).toContain('background:red');
  });

  it('renders select stories with live open and selection behavior', async () => {
    let selectStory = SelectExample({selectionMode: 'single'});
    let selectWrapper = mount(selectStory);
    expect(selectWrapper.find('.menu').exists()).toBe(false);

    await selectWrapper.get('button.react-aria-Button').trigger('click');
    expect(selectWrapper.find('.menu').exists()).toBe(true);
    await selectWrapper.findAll('.item')[1].trigger('click');
    await nextTick();
    expect(selectWrapper.get('.react-aria-SelectValue').text()).toBe('Bar');

    let renderPropsStory = SelectRenderProps({selectionMode: 'multiple'});
    let renderPropsWrapper = mount(renderPropsStory);
    await renderPropsWrapper.get('button.react-aria-Button').trigger('click');
    await renderPropsWrapper.findAll('.item')[0].trigger('click');
    await renderPropsWrapper.findAll('.item')[1].trigger('click');
    expect(renderPropsWrapper.get('.react-aria-SelectValue').text()).toBe('2 selected items');
    expect(renderPropsWrapper.get('button.react-aria-Button').text()).toContain('▲');

    let tagGroupStory = SelectWithTagGroup({selectionMode: 'multiple'});
    let tagGroupWrapper = mount(tagGroupStory);
    await tagGroupWrapper.get('button.react-aria-Button').trigger('click');
    await tagGroupWrapper.findAll('.item')[0].trigger('click');
    await tagGroupWrapper.findAll('.item')[1].trigger('click');
    expect(tagGroupWrapper.findAll('.react-aria-Tag')).toHaveLength(2);

    let manyItemsStory = SelectManyItems({selectionMode: 'single'});
    let manyItemsWrapper = mount(manyItemsStory);
    await manyItemsWrapper.get('button.react-aria-Button').trigger('click');
    expect(manyItemsWrapper.findAll('.item').length).toBeGreaterThan(40);

    let virtualizedStory = VirtualizedSelect({selectionMode: 'single'});
    let virtualizedWrapper = mount(virtualizedStory);
    await virtualizedWrapper.get('button.react-aria-Button').trigger('click');
    expect(virtualizedWrapper.findAll('.item').length).toBeGreaterThan(80);

    let asyncStory = AsyncVirtualizedCollectionRenderSelect.render?.({delay: 0}) as ReturnType<Exclude<typeof AsyncVirtualizedCollectionRenderSelect.render, undefined>>;
    let asyncWrapper = mount(asyncStory);
    await asyncWrapper.get('button.react-aria-Button').trigger('click');
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();
    expect(asyncWrapper.findAll('.item').length).toBeGreaterThan(0);
  });
});
