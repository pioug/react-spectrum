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

    let firstDayStory = CalendarFirstDayOfWeekExample.render?.({locale: 'en-US-u-ca-iso8601-fw-tue'}) as ReturnType<Exclude<typeof CalendarFirstDayOfWeekExample.render, undefined>>;
    let firstDayWrapper = mount(firstDayStory);
    expect(firstDayWrapper.find('.react-aria-CalendarHeaderCell').text()).toBe('T');

    let rangeStory = RangeCalendarMultiMonthExample.render?.({selectionAlignment: 'center'}) as ReturnType<Exclude<typeof RangeCalendarMultiMonthExample.render, undefined>>;
    let rangeWrapper = mount(rangeStory);
    expect(rangeWrapper.findAll('.react-aria-CalendarGrid')).toHaveLength(3);
    expect(rangeWrapper.findAll('.react-aria-CalendarCell').some((cell) => cell.attributes('data-selected') === 'true')).toBe(true);
  });
});
