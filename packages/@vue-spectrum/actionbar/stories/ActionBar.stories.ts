import {action} from '@storybook/addon-actions';
import {ActionBar, ActionBarContainer, type SpectrumActionBarProps} from '../src';
import {computed, defineComponent, ref, type PropType} from 'vue';
import {Table} from '@vue-spectrum/table';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type TableRow = {
  id: string,
  foo: string,
  bar: string,
  baz: string
};

const columns = [
  {label: 'Foo', key: 'foo'},
  {label: 'Bar', key: 'bar'},
  {label: 'Baz', key: 'baz'}
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

const actionItems = ['Edit', 'Copy', 'Delete', 'Move', 'Duplicate'];

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
      type: Array as PropType<string[]>,
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
    let selectedKeys = ref<string[]>([]);
    let selectedItemCount = computed(() => selectedKeys.value.length);

    let clearSelection = () => {
      selectedKeys.value = [];
    };

    let handleAction = (key: string) => {
      if (key === 'Delete') {
        let selected = new Set(selectedKeys.value);
        rows.value = rows.value.filter((row) => !selected.has(row.id));
        selectedKeys.value = [];
      }

      props.onAction?.(key);
    };

    return {
      actionItems,
      clearSelection,
      columns,
      handleAction,
      props,
      rows,
      selectedItemCount,
      selectedKeys
    };
  },
  template: `
    <ActionBarContainer :style="{height: \`\${props.containerHeight}px\`}">
      <Table
        v-model="selectedKeys"
        aria-label="Table"
        :is-quiet="props.isQuiet"
        :columns="columns"
        :rows="rows"
        row-key="id"
        selection-mode="multiple"
        :style="props.tableWidth ? {width: props.tableWidth} : undefined" />
      <ActionBar
        :selected-item-count="selectedItemCount"
        :button-label-behavior="props.buttonLabelBehavior"
        :is-emphasized="props.isEmphasized"
        :disabled-keys="props.disabledKeys"
        :items="actionItems"
        @clear-selection="clearSelection"
        @action="handleAction" />
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
    template: '<ActionBarExample v-bind="args" :disabled-keys="[\'Edit\']" />'
  })
};
