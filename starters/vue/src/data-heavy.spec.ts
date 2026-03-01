import {mount} from '@vue/test-utils';
import {describe, expect, it} from 'vitest';
import {ref} from 'vue';
import {useVirtualizer} from '@vue-aria/virtualizer';
import {DropZone} from '@vue-spectrum/dropzone';
import {Table} from '@vue-spectrum/table';
import {Tree} from '@vue-spectrum/tree';

describe('Vue migration data-heavy components', () => {
  it('emits model updates and row action from table rows', async () => {
    let wrapper = mount(Table, {
      props: {
        columns: [
          {key: 'ticket', label: 'Ticket'},
          {key: 'owner', label: 'Owner'}
        ],
        rows: [
          {ticket: 'T-401', owner: 'Avery'},
          {ticket: 'T-402', owner: 'Quinn'}
        ],
        rowKey: 'ticket',
        modelValue: 'T-402'
      }
    });

    await wrapper.get('tbody tr').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['T-401']);
    expect(wrapper.emitted('rowAction')?.[0]).toEqual([{ticket: 'T-401', owner: 'Avery'}]);
  });

  it('emits model updates and item action from tree items', async () => {
    let wrapper = mount(Tree, {
      props: {
        items: [
          {
            id: 'project-alpha',
            label: 'Project Alpha',
            children: [
              {id: 'alpha-ui', label: 'UI'}
            ]
          },
          {
            id: 'project-beta',
            label: 'Project Beta'
          }
        ],
        modelValue: 'project-beta'
      }
    });

    await wrapper.findAll('button.vs-tree__item')[0].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['project-alpha']);
    expect(wrapper.emitted('itemAction')?.[0]).toEqual([
      {
        id: 'project-alpha',
        label: 'Project Alpha',
        children: [
          {id: 'alpha-ui', label: 'UI'}
        ]
      }
    ]);
  });

  it('starts tree branches collapsed by default and expands on toggle', async () => {
    let wrapper = mount(Tree, {
      props: {
        items: [
          {
            id: 'project-alpha',
            label: 'Project Alpha',
            children: [
              {id: 'alpha-ui', label: 'UI'}
            ]
          }
        ]
      }
    });

    expect(wrapper.findAll('button.vs-tree__item')).toHaveLength(1);
    await wrapper.get('button.vs-tree__toggle').trigger('click');
    expect(wrapper.findAll('button.vs-tree__item')).toHaveLength(2);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('itemAction')).toBeUndefined();
  });

  it('renders href nodes and empty-state content when configured', async () => {
    let wrapper = mount(Tree, {
      props: {
        items: [
          {
            id: 'docs',
            label: 'Docs',
            href: 'https://adobe.com'
          }
        ],
        renderEmptyState: () => 'No results found.'
      }
    });

    expect(wrapper.get('a.vs-tree__item').attributes('href')).toBe('https://adobe.com');
    await wrapper.setProps({items: []});
    expect(wrapper.text()).toContain('No results found.');
  });

  it('emits dropped files and dropped text from drop zone', async () => {
    let wrapper = mount(DropZone, {
      props: {
        label: 'Drop assets'
      }
    });

    let droppedFile = new File(['asset'], 'tokens.json', {type: 'application/json'});
    await wrapper.trigger('drop', {
      dataTransfer: {
        files: [droppedFile],
        getData: (type: string) => type === 'text/plain' ? 'palette' : ''
      }
    });

    let emittedFiles = wrapper.emitted('filesDrop')?.[0]?.[0] as File[];
    expect(emittedFiles).toHaveLength(1);
    expect(emittedFiles[0].name).toBe('tokens.json');
    expect(wrapper.emitted('textDrop')?.[0]).toEqual(['palette']);
  });
});

describe('useVirtualizer', () => {
  it('computes visible range with overscan and updates reactively', () => {
    let itemCount = ref(120);
    let itemHeight = ref(20);
    let viewportHeight = ref(100);
    let scrollTop = ref(60);

    let state = useVirtualizer({
      itemCount,
      itemHeight,
      viewportHeight,
      scrollTop,
      overscan: 1
    });

    expect(state.startIndex.value).toBe(2);
    expect(state.visibleCount.value).toBe(7);
    expect(state.endIndex.value).toBe(9);
    expect(state.offsetTop.value).toBe(40);
    expect(state.totalHeight.value).toBe(2400);
    expect(state.visibleIndexes.value).toEqual([2, 3, 4, 5, 6, 7, 8]);

    scrollTop.value = 180;
    expect(state.startIndex.value).toBe(8);
    expect(state.visibleIndexes.value[0]).toBe(8);
  });
});
