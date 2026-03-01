import {action} from 'storybook/actions';
import {ActionBar, ActionBarContainer, type SpectrumActionBarProps} from '../src';
import {computed, defineComponent, type PropType, ref} from 'vue';
import Copy from '@spectrum-icons-vue/workflow/Copy';
import Delete from '@spectrum-icons-vue/workflow/Delete';
import Duplicate from '@spectrum-icons-vue/workflow/Duplicate';
import Edit from '@spectrum-icons-vue/workflow/Edit';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import Move from '@spectrum-icons-vue/workflow/Move';
import {Table} from '@vue-spectrum/table';

type ActionItemKey = 'copy' | 'delete' | 'duplicate' | 'edit' | 'move';
type ActionItem = {
  children: string,
  name: ActionItemKey
};
type TableRow = {
  id: string,
  foo: string,
  bar: string,
  baz: string
};

const columns = [
  {label: 'Foo', key: 'foo', width: 75},
  {label: 'Bar', key: 'bar', width: 75},
  {label: 'Baz', key: 'baz', width: 75}
];

const defaultRows: TableRow[] = Array.from({length: 16}, (_unused, index) => {
  let item = index + 1;
  return {
    id: `Foo ${item}`,
    foo: `Foo ${item}`,
    bar: `Bar ${item % 2 === 0 ? 2 : 1}`,
    baz: `Baz ${item % 2 === 0 ? 2 : 1}`
  };
});

const actionItems: ActionItem[] = [
  {name: 'edit', children: 'Edit'},
  {name: 'copy', children: 'Copy'},
  {name: 'delete', children: 'Delete'},
  {name: 'move', children: 'Move'},
  {name: 'duplicate', children: 'Duplicate'}
];
const actionItemIcons: Record<ActionItemKey, unknown> = {
  edit: Edit,
  copy: Copy,
  delete: Delete,
  move: Move,
  duplicate: Duplicate
};

function normalizeActionBarSelection(value: unknown): Set<string> {
  if (value == null) {
    return new Set();
  }

  if (typeof value === 'string') {
    return value.length > 0 ? new Set([value]) : new Set();
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return new Set();
  }

  let normalized = new Set<string>();
  for (let entry of value as Iterable<unknown>) {
    if (typeof entry === 'string' || typeof entry === 'number') {
      normalized.add(String(entry));
    }
  }

  return normalized;
}

const ActionBarExample = defineComponent({
  name: 'ActionBarStoryExample',
  components: {
    ActionBar,
    ActionBarContainer,
    Table
  },
  props: {
    buttonLabelBehavior: {
      type: String as PropType<'collapse' | 'hide' | 'show'>,
      default: 'collapse'
    },
    containerHeight: {
      type: Number,
      default: 300
    },
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<string | number>>,
      default: () => []
    },
    isEmphasized: {
      type: Boolean,
      default: false
    },
    isQuiet: {
      type: Boolean,
      default: false
    },
    onAction: {
      type: Function as PropType<(key: string) => void>,
      default: undefined
    },
    tableWidth: {
      type: String,
      default: '265px'
    }
  },
  setup(props) {
    let rows = ref<TableRow[]>(defaultRows.slice());
    let selectedKeys = ref<Set<string>>(new Set());
    let selectedItemCount = computed(() => selectedKeys.value.size);

    let clearSelection = () => {
      selectedKeys.value = new Set();
    };

    let handleAction = (key: string) => {
      if (key === 'delete') {
        rows.value = rows.value.filter((row) => !selectedKeys.value.has(row.id));
        selectedKeys.value = new Set();
      }

      props.onAction?.(key);
    };

    let onSelectionChange = (value: unknown) => {
      selectedKeys.value = normalizeActionBarSelection(value);
    };

    return {
      actionItemIcons,
      actionItems,
      clearSelection,
      columns,
      handleAction,
      onSelectionChange,
      props,
      rows,
      selectedItemCount,
      selectedKeys
    };
  },
  template: `
    <ActionBarContainer :style="{height: \`\${props.containerHeight}px\`}">
      <Table
        :model-value="selectedKeys"
        aria-label="Table"
        :is-quiet="props.isQuiet"
        :columns="columns"
        :rows="rows"
        row-key="id"
        selection-mode="multiple"
        @update:model-value="onSelectionChange"
        :style="props.tableWidth ? {width: props.tableWidth} : undefined" />
      <ActionBar
        :selected-item-count="selectedItemCount"
        :button-label-behavior="props.buttonLabelBehavior"
        :is-emphasized="props.isEmphasized"
        :disabled-keys="props.disabledKeys"
        :items="actionItems"
        @clear-selection="clearSelection"
        @action="handleAction">
        <template #item="{item}">
          <component :is="actionItemIcons[item.name]" />
          <span class="spectrum-ActionButton-label">{{ item.children }}</span>
        </template>
      </ActionBar>
    </ActionBarContainer>
  `
});

const meta: Meta<SpectrumActionBarProps<unknown>> = {
  title: 'ActionBar',
  component: ActionBar,
  args: {
    onAction: action('onAction')
  },
  argTypes: {
    onAction: {
      table: {
        disable: true
      }
    },
    isEmphasized: {
      control: 'boolean'
    },
    buttonLabelBehavior: {
      control: 'select',
      options: ['show', 'hide', 'collapse']
    }
  }
};

export default meta;
type ActionBarStory = StoryObj<typeof ActionBar>;

export const Default: ActionBarStory = {
  render: (args) => ({
    components: {ActionBarExample},
    setup() {
      return {args};
    },
    template: '<ActionBarExample v-bind="args" />'
  }),
  parameters: {
    a11y: {
      config: {
        rules: [{id: 'aria-required-children', selector: '*:not([role="grid"])'}]
      }
    }
  }
};

export const FullWidthStory: ActionBarStory = {
  ...Default,
  render: (args) => ({
    components: {ActionBarExample},
    setup() {
      let viewportHeight = typeof window === 'undefined' ? 768 : window.innerHeight;
      return {args, viewportHeight};
    },
    template: '<ActionBarExample v-bind="args" table-width="100vw" :container-height="viewportHeight" is-quiet />'
  })
};

export const DisabledKeysStory: ActionBarStory = {
  ...Default,
  render: (args) => ({
    components: {ActionBarExample},
    setup() {
      return {args};
    },
    template: '<ActionBarExample v-bind="args" :disabled-keys="[\'edit\']" />'
  })
};
