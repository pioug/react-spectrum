import {describe, expect, it} from 'vitest';
import gridListMeta, {MyGridListItem} from '../../../packages/vue-aria-components/stories/GridList.stories';
import listBoxMeta, {MyListBoxLoaderIndicator} from '../../../packages/vue-aria-components/stories/ListBox.stories';
import tableMeta, {DndTable, makePromise, MyCheckbox} from '../../../packages/vue-aria-components/stories/Table.stories';
import tagGroupMeta, {MyTag} from '../../../packages/vue-aria-components/stories/TagGroup.stories';
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
});
