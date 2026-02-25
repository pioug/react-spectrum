import {computed, ref} from 'vue';
import {useSelectableCollection, useSelectableItem} from '@vue-aria/selection';
import {type Key, type TreeNode, type TreeState, useTreeState} from '@vue-stately/tree';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StoryTreeNode = TreeNode<Record<string, never>>;

const treeNodes: StoryTreeNode[] = [
  {
    childNodes: [
      {key: 'aardvark', textValue: 'Aardvark'},
      {
        childNodes: [
          {key: 'black-bear', textValue: 'Black Bear'},
          {key: 'brown-bear', textValue: 'Brown Bear'}
        ],
        key: 'bear',
        textValue: 'Bear'
      },
      {key: 'kangaroo', textValue: 'Kangaroo'},
      {key: 'snake', textValue: 'Snake'}
    ],
    key: 'animals',
    textValue: 'Animals'
  },
  {
    childNodes: [
      {key: 'apple', textValue: 'Apple'},
      {key: 'orange', textValue: 'Orange'},
      {
        childNodes: [
          {key: 'golden-kiwi', textValue: 'Golden Kiwi'},
          {key: 'fuzzy-kiwi', textValue: 'Fuzzy Kiwi'}
        ],
        key: 'kiwi',
        textValue: 'Kiwi'
      }
    ],
    key: 'fruits',
    textValue: 'Fruits'
  }
];

const allKeys = [
  'animals',
  'aardvark',
  'bear',
  'black-bear',
  'brown-bear',
  'kangaroo',
  'snake',
  'fruits',
  'apple',
  'orange',
  'kiwi',
  'golden-kiwi',
  'fuzzy-kiwi'
];

const meta = {
  title: 'useTreeState'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

class TreeKeyboardDelegate {
  private collator: Intl.Collator;
  private state: TreeState<Record<string, never>>;

  constructor(state: TreeState<Record<string, never>>) {
    this.collator = new Intl.Collator('en');
    this.state = state;
  }

  getKeyAbove(key: Key): Key | null {
    let keyBefore = this.state.collection.getKeyBefore(key);
    while (keyBefore != null) {
      if (!this.state.disabledKeys.has(keyBefore)) {
        return keyBefore;
      }

      keyBefore = this.state.collection.getKeyBefore(keyBefore);
    }

    return null;
  }

  getKeyBelow(key: Key): Key | null {
    let keyBelow = this.state.collection.getKeyAfter(key);
    while (keyBelow != null) {
      if (!this.state.disabledKeys.has(keyBelow)) {
        return keyBelow;
      }

      keyBelow = this.state.collection.getKeyAfter(keyBelow);
    }

    return null;
  }

  getFirstKey(): Key | null {
    let key = this.state.collection.getFirstKey();
    while (key != null) {
      if (!this.state.disabledKeys.has(key)) {
        return key;
      }

      key = this.state.collection.getKeyAfter(key);
    }

    return null;
  }

  getLastKey(): Key | null {
    let key = this.state.collection.getLastKey();
    while (key != null) {
      if (!this.state.disabledKeys.has(key)) {
        return key;
      }

      key = this.state.collection.getKeyBefore(key);
    }

    return null;
  }

  getKeyForSearch(search: string, fromKey: Key | null = this.getFirstKey()): Key | null {
    let key = fromKey;
    while (key != null) {
      let item = this.state.collection.getItem(key);
      if (item?.textValue && this.collator.compare(search, item.textValue.slice(0, search.length)) === 0) {
        return key;
      }

      key = this.getKeyBelow(key);
    }

    return null;
  }
}

export const KeyboardNavigation: Story = {
  render: () => ({
    setup() {
      let treeRef = ref<HTMLElement | null>(null);
      let treeState = useTreeState({
        items: treeNodes,
        selectionMode: 'single'
      });
      let keyboardDelegate = new TreeKeyboardDelegate(treeState);
      let selectableCollection = useSelectableCollection({
        keyboardDelegate,
        selectionManager: treeState.selectionManager
      });

      let selectableItems = new Map(
        allKeys.map((key) => [key, useSelectableItem({key}, treeState.selectionManager)])
      );

      let visibleNodes = computed(() => {
        return Array.from(treeState.collection.getKeys())
          .map((key) => treeState.collection.getItem(key))
          .filter((node): node is StoryTreeNode => node != null);
      });

      let getDepth = (node: StoryTreeNode): number => {
        let depth = 0;
        let parentKey = node.parentKey ?? null;
        while (parentKey != null) {
          depth += 1;
          parentKey = treeState.collection.getItem(parentKey)?.parentKey ?? null;
        }

        return depth;
      };

      let getItemProps = (key: string) => {
        return selectableItems.get(key)?.itemProps.value;
      };

      let getItemStates = (key: string) => {
        return selectableItems.get(key)?.states.value;
      };

      let onItemClick = (node: StoryTreeNode) => {
        getItemProps(String(node.key))?.onClick();
        if (node.hasChildNodes) {
          treeState.toggleKey(node.key);
        }
      };

      return {
        collectionProps: selectableCollection.collectionProps,
        getDepth,
        getItemStates,
        onItemClick,
        treeRef,
        treeState,
        visibleNodes
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <div style="font-size: 12px; color: #666;">Keyboard arrows should move focus through visible tree nodes.</div>
        <div
          ref="treeRef"
          role="tree"
          v-bind="collectionProps"
          style="max-width: 360px; border: 1px solid #ddd; padding: 6px;">
          <div
            v-for="node in visibleNodes"
            :key="node.key"
            role="treeitem"
            :aria-expanded="node.hasChildNodes ? treeState.expandedKeys.has(node.key) : undefined"
            :aria-selected="getItemStates(String(node.key))?.isSelected"
            :style="{
              padding: '4px 6px',
              marginLeft: (getDepth(node) * 16) + 'px',
              background: getItemStates(String(node.key))?.isFocused ? '#e8e8e8' : 'transparent',
              fontWeight: getItemStates(String(node.key))?.isFocused ? '600' : '400',
              cursor: 'pointer'
            }"
            @click="onItemClick(node)">
            <span v-if="node.hasChildNodes" aria-hidden="true" style="display: inline-block; width: 14px;">
              {{treeState.expandedKeys.has(node.key) ? '▾' : '▸'}}
            </span>
            <span>{{node.textValue}}</span>
          </div>
        </div>
      </div>
    `
  }),
  name: 'Keyboard Navigation'
};
