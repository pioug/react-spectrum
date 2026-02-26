import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {computed, ref} from 'vue';
import {TagGroup, type TagItemData} from '../src';

type TagGroupStoryArgs = {
  actionLabel?: string,
  allowsRemoving?: boolean,
  emptyStateLabel?: string,
  items?: TagItemData[],
  label?: string,
  maxRows?: number,
  modelValue?: string[],
  onAction?: () => void,
  onRemove?: (keys: string[]) => void,
  selectionMode?: 'multiple' | 'none' | 'single'
};

const baseItems: TagItemData[] = [
  {key: '1', label: 'Cool Tag 1'},
  {key: '2', label: 'Cool Tag 2'},
  {key: '3', label: 'Cool Tag 3'},
  {key: '4', label: 'Cool Tag 4'},
  {key: '5', label: 'Cool Tag 5'},
  {key: '6', label: 'Cool Tag 6'}
];

const manyItems: TagItemData[] = Array.from({length: 50}, (_, index) => ({
  key: String(index + 1),
  label: `Tag ${index + 1}`
}));

function renderResizable(contentTemplate: string) {
  return `
    <div style="width: 200px; height: 200px; padding: 10px; resize: horizontal; overflow: auto; background-color: var(--spectrum-global-color-gray-50);">
      ${contentTemplate}
      <p>Use the resize handle to resize the container.</p>
    </div>
  `;
}

const meta: Meta<typeof TagGroup> = {
  title: 'TagGroup',
  component: TagGroup,
  parameters: {
    actions: {
      argTypesRegex: '^$'
    }
  },
  excludeStories: [
    'baseItems',
    'manyItems',
    'renderResizable',
    'renderTagGroup',
    'renderOnRemove'
  ],
  argTypes: {
    items: {
      table: {
        disable: true
      }
    },
    onRemove: {
      table: {
        disable: true
      }
    },
    onAction: {
      table: {
        disable: true
      }
    },
    maxRows: {
      type: 'number'
    },
    contextualHelp: {
      table: {
        disable: true
      }
    },
    isRequired: {
      control: 'boolean'
    },
    necessityIndicator: {
      control: 'select',
      options: ['icon', 'label']
    },
    labelPosition: {
      control: 'select',
      options: ['top', 'side']
    },
    labelAlign: {
      control: 'select',
      options: ['start', 'end']
    },
    isInvalid: {
      control: 'boolean'
    },
    description: {
      control: 'text'
    },
    errorMessage: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderTagGroup(baseArgs: Partial<TagGroupStoryArgs> = {items: baseItems}, wrapperTemplate?: string) {
  return (args: TagGroupStoryArgs) => ({
    components: {TagGroup},
    setup() {
      let mergedArgs = computed(() => ({
        ...args,
        ...baseArgs
      }));
      let onRemove = (keys: string[]) => {
        mergedArgs.value.onRemove?.(keys);
      };
      return {args: mergedArgs, onRemove};
    },
    template: wrapperTemplate ?? `
      <TagGroup
        v-bind="args"
        aria-label="Tag group"
        @remove="onRemove" />
    `
  });
}

function renderOnRemove(baseArgs: Partial<TagGroupStoryArgs> = {}) {
  return (args: TagGroupStoryArgs) => ({
    components: {TagGroup},
    setup() {
      let mergedArgs = computed(() => ({
        ...args,
        ...baseArgs
      }));
      let items = ref<TagItemData[]>([...baseItems]);

      let handleRemove = (keys: string[]) => {
        let removed = new Set(keys);
        items.value = items.value.filter((item) => !removed.has(item.key));
        mergedArgs.value.onRemove?.(keys);
      };

      return {args: mergedArgs, items, handleRemove};
    },
    template: `
      <TagGroup
        v-bind="args"
        aria-label="Tag group with removable tags"
        :items="items"
        @remove="handleRemove" />
    `
  });
}

export const Default: Story = {
  render: renderTagGroup()
};

export const WithIcons: Story = {
  render: renderTagGroup({
    items: [
      {key: '1', label: '🔊 Cool Tag 1'},
      {key: '2', label: '🔊 Cool Tag 2'}
    ]
  }),
  name: 'With Icons'
};

export const OnRemove: Story = {
  render: renderOnRemove({
    onRemove: action('onRemove')
  }),
  name: 'onRemove'
};

export const Wrapping: Story = {
  render: renderTagGroup({}, renderResizable(`
      <TagGroup
        v-bind="args"
        aria-label="Tag group"
        @remove="onRemove" />
  `)),
  name: 'Wrapping'
};

export const LabelTruncation: Story = {
  render: renderTagGroup({
    items: [
      {key: '1', label: 'Cool Tag 1 with a really long label'},
      {key: '2', label: 'Another long cool tag label'},
      {key: '3', label: 'This tag'}
    ]
  }, `
    <div style="width: 100px;">
      <TagGroup
        v-bind="args"
        aria-label="Tag group"
        @remove="onRemove" />
    </div>
  `),
  name: 'Label Truncation'
};

export const MaxRows: Story = {
  render: renderTagGroup({
    maxRows: 2
  }, renderResizable(`
      <TagGroup
        v-bind="args"
        aria-label="Tag group"
        @remove="onRemove" />
  `)),
  name: 'maxRows'
};

export const MaxRowsManyTags: Story = {
  render: renderTagGroup({
    items: manyItems,
    maxRows: 2
  }, renderResizable(`
      <TagGroup
        v-bind="args"
        aria-label="Tag group"
        @remove="onRemove" />
  `)),
  name: 'maxRows with many tags'
};

export const MaxRowsOnRemove: Story = {
  render: renderOnRemove({
    maxRows: 2,
    onRemove: action('onRemove')
  }),
  name: 'maxRows + onRemove'
};

export const WithAvatar: Story = {
  render: renderTagGroup({
    items: [
      {key: '1', label: '👤 Cool Person 1'},
      {key: '2', label: '👤 Cool Person 2'}
    ]
  }),
  name: 'with avatar'
};

export const WithAvatarOnRemove: Story = {
  render: renderOnRemove({
    items: [
      {key: '1', label: '👤 Cool Person 1'},
      {key: '2', label: '👤 Cool Person 2'}
    ],
    onRemove: action('onRemove')
  }),
  name: 'with avatar + onRemove'
};

export const WithAction: Story = {
  render: renderTagGroup({
    onAction: action('clear'),
    actionLabel: 'Clear'
  }, `
    <div style="display: grid; gap: 8px;">
      <TagGroup
        v-bind="args"
        aria-label="Tag group"
        @remove="onRemove" />
      <button type="button" @click="args.onAction && args.onAction()">{{args.actionLabel || 'Clear'}}</button>
    </div>
  `),
  name: 'with action'
};

export const WithActionAndMaxRows: Story = {
  render: renderTagGroup({
    maxRows: 2,
    onAction: action('clear'),
    actionLabel: 'Clear'
  }, renderResizable(`
      <div style="display: grid; gap: 8px;">
        <TagGroup
          v-bind="args"
          aria-label="Tag group"
          @remove="onRemove" />
        <button type="button" @click="args.onAction && args.onAction()">{{args.actionLabel || 'Clear'}}</button>
      </div>
  `)),
  name: 'with action and maxRows'
};

export const WithLabelDescriptionContextualHelp: Story = {
  render: renderTagGroup({
    label: 'Some sample tags'
  }, renderResizable(`
      <div style="display: grid; gap: 8px;">
        <div>Here is a description about the tag group.</div>
        <div>What are these tags? Here is more information about the tag group.</div>
        <TagGroup
          v-bind="args"
          aria-label="Tag group"
          @remove="onRemove" />
      </div>
  `)),
  name: 'with label, description, contextual help'
};

export const WithLabelDescriptionContextualHelpAndAction: Story = {
  render: renderTagGroup({
    label: 'Some sample tags',
    onAction: action('clear'),
    actionLabel: 'Clear'
  }, renderResizable(`
      <div style="display: grid; gap: 8px;">
        <div>Here is a description about the tag group.</div>
        <div>What are these tags? Here is more information about the tag group.</div>
        <TagGroup
          v-bind="args"
          aria-label="Tag group"
          @remove="onRemove" />
        <button type="button" @click="args.onAction && args.onAction()">{{args.actionLabel || 'Clear'}}</button>
      </div>
  `)),
  name: 'with label, description, contextual help + action'
};

export const EmptyState: Story = {
  render: renderTagGroup({
    items: [],
    emptyStateLabel: 'No tags'
  }),
  name: 'Empty state'
};

export const CustomEmptyState: Story = {
  render: renderTagGroup({
    items: [],
    emptyStateLabel: 'No tags. Click here to add some.'
  }),
  name: 'Custom empty state'
};

export const Links: Story = {
  render: renderTagGroup({
    items: [
      {key: 'adobe', label: 'Adobe'},
      {key: 'google', label: 'Google'},
      {key: 'apple', label: 'Apple'}
    ]
  }),
  name: 'Links'
};
