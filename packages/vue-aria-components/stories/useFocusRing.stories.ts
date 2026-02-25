import {computed, ref} from 'vue';
import {useFocusRing} from '@vue-aria/focus';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const manyColumns = Array.from({length: 10}, (_, index) => ({
  key: `C${index}`,
  name: index === 0 ? 'Column name' : `Column ${index}`
}));

const manyRows = Array.from({length: 50}, (_, rowIndex) => {
  let row: Record<string, string> = {};
  for (let columnIndex = 0; columnIndex < manyColumns.length; columnIndex++) {
    row[`C${columnIndex}`] = columnIndex === 0 ? `Row ${rowIndex}` : `${rowIndex}, ${columnIndex}`;
  }
  return row;
});

const meta = {
  title: 'useFocusRing'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SearchTableview: Story = {
  render: () => ({
    setup() {
      let query = ref('');
      let {focusProps, isFocusVisible, isFocused} = useFocusRing({within: true});
      let items = computed(() => {
        if (!query.value) {
          return manyRows;
        }

        let needle = query.value.toLowerCase();
        return manyRows.filter((row) => row.C0.toLowerCase().includes(needle));
      });

      return {
        focusProps,
        isFocused,
        isFocusVisible,
        items,
        manyColumns,
        query
      };
    },
    template: `
      <div>
        <label>
          Search
          <input v-model="query" aria-label="table searchfield" />
        </label>
        <div
          v-bind="focusProps"
          tabindex="0"
          :style="{marginTop: '8px', border: isFocusVisible ? '2px solid #2680eb' : '1px solid #c6c6c6', padding: '8px'}">
          <div>Focus Visible: {{isFocusVisible ? 'true' : 'false'}} | Focused: {{isFocused ? 'true' : 'false'}}</div>
          <div style="max-height: 300px; overflow: auto; margin-top: 8px;">
            <table border="1" cellpadding="4" cellspacing="0">
              <thead>
                <tr>
                  <th v-for="column in manyColumns" :key="column.key">{{column.name}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, rowIndex) in items" :key="rowIndex">
                  <td v-for="column in manyColumns" :key="column.key">{{item[column.key]}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  }),
  name: 'search + tableview'
};

export const IFrame: Story = {
  render: () => ({
    setup() {
      let frameContent = '<html><body style="font-family: sans-serif; padding: 8px;"><button>Frame button 1</button><button>Frame button 2</button></body></html>';
      let {focusProps, isFocusVisible, isFocused} = useFocusRing();
      return {
        focusProps,
        frameContent,
        isFocused,
        isFocusVisible
      };
    },
    template: `
      <div style="display: grid; gap: 8px;">
        <button v-bind="focusProps">
          Focus Visible: {{isFocusVisible ? 'true' : 'false'}} | Focused: {{isFocused ? 'true' : 'false'}}
        </button>
        <iframe :srcdoc="frameContent" style="width: 100%; height: 180px; border: 1px solid #c6c6c6;" />
      </div>
    `
  }),
  name: 'focus state in dynamic iframe'
};
