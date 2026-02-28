import {action} from 'storybook/actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {computed, defineComponent, ref, type PropType} from 'vue';
import {type TagGroupAria, type TagGroupItemNode, useTag, useTagGroup} from '@vue-aria/tag';

type TagStoryItem = {
  href?: string,
  key: string,
  label: string
};

const meta = {
  title: 'React Aria Components/TagGroup',
  args: {
    selectionMode: 'none',
    selectionBehavior: 'toggle'
  },
  argTypes: {
    selectionMode: {
      control: 'inline-radio',
      options: ['none', 'single', 'multiple']
    },
    selectionBehavior: {
      control: 'inline-radio',
      options: ['toggle', 'replace']
    }
  },
  excludeStories: ['MyTag']
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export function MyTag(props: {href?: string, isSelected?: boolean} = {}) {
  return {
    background: props.isSelected ? 'black' : '',
    border: '1px solid gray',
    borderRadius: '4px',
    color: props.isSelected ? 'white' : '',
    cursor: props.href ? 'pointer' : 'default',
    padding: '0 4px'
  };
}

const TagRow = defineComponent({
  name: 'TagRow',
  props: {
    item: {
      type: Object as PropType<TagStoryItem | undefined>,
      default: undefined
    },
    node: {
      type: Object as PropType<TagGroupItemNode>,
      required: true
    },
    removable: {
      type: Boolean,
      default: false
    },
    tagGroup: {
      type: Object as PropType<TagGroupAria>,
      required: true
    }
  },
  setup(props) {
    let tag = useTag({
      item: computed(() => props.node),
      tagGroup: props.tagGroup
    });

    let href = computed(() => props.item?.href);
    let label = computed(() => props.item?.label ?? props.node.textValue ?? props.node.key);
    let tagStyle = computed(() => MyTag({
      href: href.value,
      isSelected: tag.isSelected.value
    }));
    let onRemovePress = () => {
      tag.removeButtonProps.value.onPress();
    };

    return {
      href,
      label,
      onRemovePress,
      tag,
      tagStyle
    };
  },
  template: `
    <div
      v-bind="tag.rowProps.value"
      class="react-aria-Tag"
      data-rac=""
      :aria-label="label"
      :style="tagStyle">
      <div v-bind="tag.gridCellProps.value" :aria-colindex="1" style="display: contents;">
        <a v-if="href" :href="href">{{ label }}</a>
        <template v-else>{{ label }}</template>
        <button
          v-if="removable && tag.allowsRemoving.value"
          :id="tag.removeButtonProps.value.id"
          class="react-aria-Button"
          data-rac=""
          :aria-label="tag.removeButtonProps.value['aria-label']"
          :aria-labelledby="tag.removeButtonProps.value['aria-labelledby']"
          :disabled="tag.removeButtonProps.value.isDisabled"
          tabindex="0"
          type="button"
          slot="remove"
          @click="onRemovePress">
          X
        </button>
      </div>
    </div>
  `
});

interface TagGroupStoryOptions {
  ariaLabel?: string,
  items: TagStoryItem[],
  label?: string,
  removable?: boolean
}

function createTagGroupStory(args: {selectionMode?: 'multiple' | 'none' | 'single'}, options: TagGroupStoryOptions) {
  return {
    components: {
      TagRow
    },
    setup() {
      let items = ref(options.items.map((item) => ({...item})));
      let selectedKeys = ref(new Set<string>());
      let itemByKey = computed(() => new Map(items.value.map((item) => [item.key, item])));
      let tagGroup = useTagGroup({
        ariaLabel: computed(() => options.ariaLabel),
        label: computed(() => options.label),
        items: computed(() => items.value.map((item) => ({
          key: item.key,
          textValue: item.label
        }))),
        onRemove: options.removable
          ? (keys) => {
            let removedKeys = new Set(Array.from(keys));
            items.value = items.value.filter((item) => !removedKeys.has(item.key));
            action('onRemove')(Array.from(removedKeys));
          }
          : undefined,
        selectedKeys,
        selectionMode: computed(() => args.selectionMode ?? 'none')
      });
      let rows = computed(() => tagGroup.collection.value.items.map((node) => ({
        item: itemByKey.value.get(node.key),
        node
      })));

      return {
        labelText: options.label,
        removable: options.removable === true,
        rows,
        tagGroup
      };
    },
    template: `
      <div class="react-aria-TagGroup">
        <span v-if="labelText" v-bind="tagGroup.labelProps.value" class="react-aria-Label">{{ labelText }}</span>
        <div
          v-bind="tagGroup.gridProps.value"
          class="react-aria-TagList"
          data-rac=""
          style="display: flex; gap: 4px;">
          <TagRow
            v-for="row in rows"
            :key="row.node.key"
            :item="row.item"
            :node="row.node"
            :removable="removable"
            :tag-group="tagGroup" />
          <template v-if="rows.length === 0">No categories.</template>
        </div>
      </div>
    `
  };
}

const standardItems: TagStoryItem[] = [
  {key: 'news', label: 'News', href: 'https://nytimes.com'},
  {key: 'travel', label: 'Travel'},
  {key: 'gaming', label: 'Gaming'},
  {key: 'shopping', label: 'Shopping'}
];

const removableItems: TagStoryItem[] = [
  {key: 'marsupial', label: 'Marsupial'},
  {key: 'animal', label: 'Animal'},
  {key: 'mammal', label: 'Mammal'},
  {key: 'chordate', label: 'Chordate'}
];

export const TagGroupExample: Story = {
  render: (args) => createTagGroupStory(args, {
    items: standardItems,
    label: 'Categories'
  })
};

export const TagGroupExampleWithRemove: Story = {
  render: (args) => createTagGroupStory(args, {
    items: removableItems,
    label: 'Categories',
    removable: true
  })
};

export const EmptyTagGroup: Story = {
  render: (args) => createTagGroupStory(args, {
    ariaLabel: 'Categories',
    items: []
  })
};
