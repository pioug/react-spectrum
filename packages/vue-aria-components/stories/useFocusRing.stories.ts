import {addWindowFocusTracking} from '@vue-aria/interactions';
import {computed, defineComponent, onBeforeUnmount, onMounted, ref} from 'vue';
import {mergeProps} from '@vue-aria/utils';
import {SearchField} from '@vue-spectrum/searchfield';
import {TableView} from '@vue-spectrum/table';
import {useButton} from '@vue-aria/button';
import {useFocusRing} from '@vue-aria/focus';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type TableColumn = {
  key: string,
  label: string
};

type TableRow = {
  id: string,
  [key: string]: string
};

let manyColumns: TableColumn[] = [];
for (let index = 0; index < 100; index++) {
  manyColumns.push(
    index === 0
      ? {key: 'C0', label: 'Column name'}
      : {key: `C${index}`, label: `Column ${index}`}
  );
}

let manyRows: TableRow[] = [];
for (let rowIndex = 0; rowIndex < 1000; rowIndex++) {
  let row: TableRow = {id: `R${rowIndex}`};
  for (let columnIndex = 0; columnIndex < 100; columnIndex++) {
    row[`C${columnIndex}`] = columnIndex === 0 ? `Row ${rowIndex}` : `${rowIndex}, ${columnIndex}`;
  }

  manyRows.push(row);
}

const FocusStatusButton = defineComponent({
  props: {
    trackWindowFocus: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    let buttonRef = ref<HTMLElement | null>(null);
    let focusRing = useFocusRing();
    let button = useButton();
    let stopWindowTracking = () => {};

    onMounted(() => {
      if (props.trackWindowFocus && buttonRef.value) {
        stopWindowTracking = addWindowFocusTracking(buttonRef.value);
      }
    });

    onBeforeUnmount(() => {
      stopWindowTracking();
    });

    return {
      buttonRef,
      isFocused: focusRing.isFocused,
      isFocusVisible: focusRing.isFocusVisible,
      mergedProps: computed(() => mergeProps(focusRing.focusProps.value, button.buttonProps.value))
    };
  },
  template: `
    <button ref="buttonRef" v-bind="mergedProps">
      Focus Visible: {{isFocusVisible ? 'true' : 'false'}}<br>
      Focused: {{isFocused ? 'true' : 'false'}}
    </button>
  `
});

const meta = {
  title: 'useFocusRing'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SearchTableview: Story = {
  render: () => ({
    components: {
      SearchField,
      TableView
    },
    setup() {
      let items = ref([...manyRows]);
      let onChange = (value: string) => {
        let lowerValue = value.toLowerCase();
        items.value = manyRows.filter((item) => item.C0.toLowerCase().includes(lowerValue));
      };

      return {
        items,
        manyColumns,
        onChange
      };
    },
    template: `
      <div>
        <SearchField aria-label="table searchfield" @change="onChange" />
        <div style="margin-top: 8px; width: 700px; height: 500px; overflow: auto;">
          <TableView
            aria-label="Searchable table with many columns and rows"
            selection-mode="multiple"
            :columns="manyColumns"
            :rows="items" />
        </div>
      </div>
    `
  }),
  name: 'search + tableview',
  parameters: {
    a11y: {
      config: {
        rules: [{id: 'aria-required-children', selector: '*:not([role="grid"])'}]
      }
    }
  }
};

export const IFrame: Story = {
  render: () => ({
    components: {
      FocusStatusButton
    },
    setup() {
      let iframeRef = ref<HTMLIFrameElement | null>(null);
      let iframeBody = ref<HTMLElement | null>(null);
      let frameContent = '<!doctype html><html><body style="font-family: sans-serif; padding: 8px;"></body></html>';

      let updateFrameBody = () => {
        iframeBody.value = iframeRef.value?.contentDocument?.body ?? null;
      };

      onMounted(() => {
        if (!iframeRef.value) {
          return;
        }

        iframeRef.value.addEventListener('load', updateFrameBody);
        updateFrameBody();
      });

      onBeforeUnmount(() => {
        iframeRef.value?.removeEventListener('load', updateFrameBody);
      });

      return {
        frameContent,
        iframeBody,
        iframeRef
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <FocusStatusButton />
        <iframe ref="iframeRef" :srcdoc="frameContent" style="width: 100%; height: 180px; border: 1px solid #c6c6c6;" />
        <Teleport v-if="iframeBody" :to="iframeBody">
          <div style="display: grid; gap: 8px;">
            <FocusStatusButton :trackWindowFocus="true" />
            <FocusStatusButton />
            <FocusStatusButton />
          </div>
        </Teleport>
      </div>
    `
  }),
  name: 'focus state in dynamic iframe'
};
