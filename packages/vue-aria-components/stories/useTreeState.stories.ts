import {ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type TreeNode = {
  children?: TreeNode[],
  key: string,
  label: string
};

const nodes: TreeNode[] = [
  {
    key: 'animals',
    label: 'Animals',
    children: [
      {key: 'aardvark', label: 'Aardvark'},
      {
        key: 'bear',
        label: 'Bear',
        children: [
          {key: 'black-bear', label: 'Black Bear'},
          {key: 'brown-bear', label: 'Brown Bear'}
        ]
      },
      {key: 'kangaroo', label: 'Kangaroo'},
      {key: 'snake', label: 'Snake'}
    ]
  },
  {
    key: 'fruits',
    label: 'Fruits',
    children: [
      {key: 'apple', label: 'Apple'},
      {key: 'orange', label: 'Orange'},
      {
        key: 'kiwi',
        label: 'Kiwi',
        children: [
          {key: 'golden-kiwi', label: 'Golden Kiwi'},
          {key: 'fuzzy-kiwi', label: 'Fuzzy Kiwi'}
        ]
      }
    ]
  }
];

const meta = {
  title: 'useTreeState'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const KeyboardNavigation: Story = {
  render: () => ({
    setup() {
      let expanded = ref(new Set<string>(['animals', 'fruits', 'bear', 'kiwi']));
      let selected = ref<string | null>(null);

      let toggle = (key: string) => {
        let next = new Set(expanded.value);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        expanded.value = next;
      };

      let select = (key: string) => {
        selected.value = key;
      };

      return {
        expanded,
        nodes,
        select,
        selected,
        toggle
      };
    },
    template: `
      <div>
        <div style="font-size: 12px; color: #666; margin-bottom: 6px;">Use keyboard arrows to navigate the tree.</div>
        <ul role="tree" tabindex="0" style="list-style: none; padding-left: 0; max-width: 320px;">
          <li v-for="section in nodes" :key="section.key" role="treeitem" :aria-expanded="expanded.has(section.key)">
            <button type="button" @click="toggle(section.key)">{{expanded.has(section.key) ? '▾' : '▸'}} {{section.label}}</button>
            <ul v-if="expanded.has(section.key)" role="group" style="list-style: none; padding-left: 18px;">
              <li
                v-for="item in section.children"
                :key="item.key"
                role="treeitem"
                :aria-expanded="item.children ? expanded.has(item.key) : undefined"
                :aria-selected="selected === item.key">
                <button type="button" @click="item.children ? toggle(item.key) : select(item.key)">
                  <span v-if="item.children">{{expanded.has(item.key) ? '▾' : '▸'}} </span>{{item.label}}
                </button>
                <ul v-if="item.children && expanded.has(item.key)" role="group" style="list-style: none; padding-left: 18px;">
                  <li
                    v-for="child in item.children"
                    :key="child.key"
                    role="treeitem"
                    :aria-selected="selected === child.key">
                    <button type="button" @click="select(child.key)">{{child.label}}</button>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    `
  }),
  name: 'Keyboard Navigation'
};
