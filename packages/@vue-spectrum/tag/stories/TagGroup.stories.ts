import {action} from 'storybook/actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import Audio from '@spectrum-icons-vue/workflow/Audio';
import {Content} from '@vue-spectrum/view';
import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {Heading} from '@vue-spectrum/text';
import {Link} from '@vue-spectrum/link';
import {computed, h, ref, watch} from 'vue';
import {TagGroup, type TagItemData} from '../src';

type TagGroupStoryArgs = {
  actionLabel?: string,
  allowsRemoving?: boolean,
  contextualHelp?: unknown,
  description?: string,
  emptyStateLabel?: string,
  errorMessage?: string,
  isInvalid?: boolean,
  isRequired?: boolean,
  items?: TagItemData[],
  label?: string,
  labelAlign?: 'end' | 'start',
  labelPosition?: 'side' | 'top',
  maxRows?: number,
  modelValue?: Iterable<string>,
  necessityIndicator?: 'icon' | 'label',
  onAction?: () => void,
  onRemove?: (keys: string[]) => void,
  renderEmptyState?: () => unknown,
  selectionMode?: 'multiple' | 'none' | 'single'
};

const AVATAR_URL = 'https://i.imgur.com/kJOwAdv.png';

const baseItems: TagItemData[] = [
  {key: '1', label: 'Cool Tag 1'},
  {key: '2', label: 'Cool Tag 2'},
  {key: '3', label: 'Cool Tag 3'},
  {key: '4', label: 'Cool Tag 4'},
  {key: '5', label: 'Cool Tag 5'},
  {key: '6', label: 'Cool Tag 6'}
];

const removableItems: TagItemData[] = [
  {key: '1', label: 'Cool Tag 1'},
  {key: '2', label: 'Another cool tag'},
  {key: '3', label: 'This tag'},
  {key: '4', label: 'What tag?'},
  {key: '5', label: 'This tag is cool too'},
  {key: '6', label: 'Shy tag'}
];

const manyItems: TagItemData[] = Array.from({length: 50}, (_, index) => ({
  key: String(index),
  label: `Tag ${index}`
}));

function createContextualHelp() {
  return h(ContextualHelp, null, {
    default: () => [
      h(Heading, null, () => 'What are these tags?'),
      h(Content, null, () => 'Here is more information about the tag group.')
    ]
  });
}

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
    contextualHelp: {
      table: {
        disable: true
      }
    },
    maxRows: {
      type: 'number'
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

function renderTagGroup(baseArgs: Partial<TagGroupStoryArgs> = {}, wrapperTemplate?: string) {
  return (args: TagGroupStoryArgs) => ({
    components: {TagGroup},
    setup() {
      let mergedArgs = computed(() => ({
        ...args,
        ...baseArgs
      }));
      let hasExplicitItems = computed(() => Object.prototype.hasOwnProperty.call(args, 'items') || Object.prototype.hasOwnProperty.call(baseArgs, 'items'));
      let resolvedArgs = computed(() => ({
        ...mergedArgs.value,
        items: hasExplicitItems.value ? mergedArgs.value.items : baseItems
      }));

      let onRemove = (keys: string[]) => {
        resolvedArgs.value.onRemove?.(keys);
      };

      return {
        args: resolvedArgs,
        onRemove
      };
    },
    template: wrapperTemplate ?? `
      <TagGroup
        v-bind="args"
        aria-label="Tag group"
        @remove="onRemove" />
    `
  });
}

function renderOnRemove(baseArgs: Partial<TagGroupStoryArgs> = {}, wrapperTemplate?: string) {
  return (args: TagGroupStoryArgs) => ({
    components: {TagGroup},
    setup() {
      let createInitialItems = (source?: TagItemData[]) => source ? source.map((item) => ({...item})) : [...removableItems];
      let mergedArgs = computed(() => ({
        ...args,
        ...baseArgs
      }));
      let items = ref<TagItemData[]>(createInitialItems(baseArgs.items));

      watch(() => args.items, (nextItems) => {
        if (nextItems) {
          items.value = createInitialItems(nextItems);
        }
      });

      let handleRemove = (keys: string[]) => {
        let removed = new Set(keys);
        items.value = items.value.filter((item) => !removed.has(item.key));
        mergedArgs.value.onRemove?.(keys);
      };

      return {
        args: mergedArgs,
        items,
        handleRemove
      };
    },
    template: wrapperTemplate ?? `
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
  args: {
    items: [
      {key: '1', label: 'Cool Tag 1'},
      {key: '2', label: 'Cool Tag 2'}
    ]
  },
  render: renderTagGroup({
    items: [
      {key: '1', label: 'Cool Tag 1', icon: Audio},
      {key: '2', label: 'Cool Tag 2', icon: Audio}
    ]
  })
};

export const OnRemove: Story = {
  render: renderOnRemove({
    allowsRemoving: true,
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
  args: {
    maxRows: 2
  },
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
  args: {
    maxRows: 2
  },
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
  args: {
    maxRows: 2
  },
  render: renderOnRemove({
    allowsRemoving: true,
    maxRows: 2,
    onRemove: action('onRemove')
  }, renderResizable(`
      <TagGroup
        v-bind="args"
        aria-label="Tag group with removable tags"
        :items="items"
        @remove="handleRemove" />
  `)),
  name: 'maxRows + onRemove'
};

export const WithAvatar: Story = {
  args: {
    items: [
      {key: '1', label: 'Cool Person 1'},
      {key: '2', label: 'Cool Person 2'}
    ]
  },
  render: renderTagGroup({
    items: [
      {key: '1', label: 'Cool Person 1', avatarAlt: 'default Adobe avatar', avatarSrc: AVATAR_URL},
      {key: '2', label: 'Cool Person 2'}
    ]
  }),
  name: 'with avatar'
};

export const WithAvatarOnRemove: Story = {
  render: renderOnRemove({
    allowsRemoving: true,
    items: removableItems.map((item) => ({
      ...item,
      avatarAlt: 'default Adobe avatar',
      avatarSrc: AVATAR_URL
    })),
    onRemove: action('onRemove')
  }),
  name: 'with avatar + onRemove'
};

export const WithAction: Story = {
  args: {
    actionLabel: 'Clear',
    onAction: action('clear')
  },
  render: renderTagGroup({
    actionLabel: 'Clear',
    onAction: action('clear')
  }),
  name: 'with action'
};

export const WithActionAndMaxRows: Story = {
  args: {
    actionLabel: 'Clear',
    maxRows: 2,
    onAction: action('clear')
  },
  render: renderTagGroup({
    actionLabel: 'Clear',
    maxRows: 2,
    onAction: action('clear')
  }, renderResizable(`
      <TagGroup
        v-bind="args"
        aria-label="Tag group"
        @remove="onRemove" />
  `)),
  name: 'with action and maxRows'
};

export const WithLabelDescriptionContextualHelp: Story = {
  args: {
    contextualHelp: createContextualHelp(),
    description: 'Here is a description about the tag group.',
    label: 'Some sample tags'
  },
  render: renderTagGroup({
    contextualHelp: createContextualHelp(),
    description: 'Here is a description about the tag group.',
    label: 'Some sample tags'
  }, renderResizable(`
      <TagGroup
        v-bind="args"
        aria-label="Tag group"
        @remove="onRemove" />
  `)),
  name: 'with label, description, contextual help'
};

export const WithLabelDescriptionContextualHelpAndAction: Story = {
  args: {
    actionLabel: 'Clear',
    contextualHelp: createContextualHelp(),
    description: 'Here is a description about the tag group.',
    label: 'Some sample tags',
    onAction: action('clear')
  },
  render: renderTagGroup({
    actionLabel: 'Clear',
    contextualHelp: createContextualHelp(),
    description: 'Here is a description about the tag group.',
    label: 'Some sample tags',
    onAction: action('clear')
  }, renderResizable(`
      <TagGroup
        v-bind="args"
        aria-label="Tag group"
        @remove="onRemove" />
  `)),
  name: 'with label, description, contextual help + action'
};

export const EmptyState: Story = {
  render: renderTagGroup({
    items: [],
    label: 'Tag group with empty state'
  }),
  name: 'Empty state'
};

export const CustomEmptyState: Story = {
  render: renderTagGroup({
    items: [],
    label: 'Tag group with empty state',
    renderEmptyState: () => h('span', [
      'No tags. ',
      h(Link, {
        href: '//react-spectrum.com'
      }, () => 'Click here'),
      ' to add some.'
    ])
  }),
  name: 'Custom empty state'
};

export const Links: Story = {
  render: renderTagGroup({
    items: [
      {key: 'adobe', label: 'Adobe', href: 'https://adobe.com'},
      {key: 'google', label: 'Google', href: 'https://google.com'},
      {key: 'apple', label: 'Apple', href: 'https://apple.com'}
    ]
  }),
  name: 'Links'
};
