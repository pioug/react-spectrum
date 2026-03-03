import {action} from 'storybook/actions';
import {computed, ref} from 'vue';
import {
  useTable,
  useTableCell,
  useTableColumnHeader,
  useTableColumnResize,
  useTableHeaderRow,
  useTableRow,
  useTableRowGroup,
  useTableSelectAllCheckbox,
  useTableSelectionCheckbox
} from '@vue-aria/table';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type ColumnUid = 'height' | 'level' | 'name' | 'type' | 'weight';

type TableArgs = {
  controlled?: boolean,
  docVariant?: boolean,
  includeExtraColumns?: boolean,
  resizable?: boolean,
  showControls?: boolean,
  withSelection?: boolean,
  withFocusableSiblings?: boolean,
  withRowAction?: boolean
};

type TableColumn = {
  name: string,
  uid: ColumnUid
};

type TableRecord = {
  height: string,
  id: number,
  level: string,
  name: string,
  type: string,
  weight: string
};

const columns: TableColumn[] = [
  {name: 'Name', uid: 'name'},
  {name: 'Type', uid: 'type'},
  {name: 'Level', uid: 'level'}
];

const defaultRows: TableRecord[] = [
  {id: 1, name: 'Charizard', type: 'Fire, Flying', level: '67', weight: '200lbs', height: '5\'7"'},
  {id: 2, name: 'Blastoise', type: 'Water', level: '56', weight: '188lbs', height: '5\'3"'},
  {id: 3, name: 'Venusaur', type: 'Grass, Poison', level: '83', weight: '220lbs', height: '6\'7"'},
  {id: 4, name: 'Pikachu', type: 'Electric', level: '100', weight: '13lbs', height: '1\'4"'},
  {id: 5, name: 'Charizard', type: 'Fire, Flying', level: '67', weight: '200lbs', height: '5\'7"'},
  {id: 6, name: 'Blastoise', type: 'Water', level: '56', weight: '188lbs', height: '5\'3"'},
  {id: 7, name: 'Venusaur', type: 'Grass, Poison', level: '83', weight: '220lbs', height: '6\'7"'},
  {id: 8, name: 'Pikachu', type: 'Electric', level: '100', weight: '13lbs', height: '1\'4"'},
  {id: 9, name: 'Charizard', type: 'Fire, Flying', level: '67', weight: '200lbs', height: '5\'7"'},
  {id: 10, name: 'Blastoise', type: 'Water', level: '56', weight: '188lbs', height: '5\'3"'},
  {id: 11, name: 'Venusaur', type: 'Grass, Poison', level: '83', weight: '220lbs', height: '6\'7"'},
  {id: 12, name: 'Pikachu', type: 'Electric', level: '100', weight: '13lbs', height: '1\'4"'}
];

const controlledDescription = `
You can use the buttons to save and restore the column widths. When restoring,
you will see a quick flash because the entire table is re-rendered. This
mimics what would happen if an app reloaded the whole page and restored a saved
column width state.
`;

const hiddenRangeInputStyle = 'border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;';

const meta = {
  title: 'useTable'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function getColumns(includeExtraColumns?: boolean): TableColumn[] {
  if (!includeExtraColumns) {
    return columns;
  }

  return [
    ...columns.slice(0, 2),
    {name: 'Height', uid: 'height'},
    {name: 'Weight', uid: 'weight'},
    columns[2]
  ];
}

function renderTable(args: TableArgs) {
  let withSelection = args.withSelection !== false;
  let activeColumns = getColumns(args.includeExtraColumns);
  let cellColumnKey = new Map<string, ColumnUid>();
  let collection = {
    columnCount: activeColumns.length,
    rows: defaultRows.map((row, index) => ({
      cells: activeColumns.map((column, columnIndex) => {
        let key = `row-${row.id}-${column.uid}`;
        cellColumnKey.set(key, column.uid);

        return {
          colIndex: columnIndex,
          key,
          textValue: row[column.uid]
        };
      }),
      index,
      key: `row-${row.id}`,
      textValue: row.name
    }))
  };

  return {
    setup() {
      let selectedKeys = ref(new Set<string>());
      let table = useTable({
        ariaLabel: 'Table with selection',
        collection,
        onRowAction: args.withRowAction
          ? (key) => {
            action('onAction')(key);
          }
          : undefined,
        selectedKeys,
        selectionMode: withSelection ? 'multiple' : undefined
      });

      let headerRowGroup = useTableRowGroup();
      let bodyRowGroup = useTableRowGroup();
      let headerRow = useTableHeaderRow({
        row: {
          cells: [],
          index: 0,
          key: 'header-row'
        }
      });

      let initialWidths = Object.fromEntries(
        activeColumns.map((column) => [column.uid, column.uid === 'level' ? 260 : 180])
      ) as Record<ColumnUid, number>;
      let columnWidths = ref(initialWidths);
      let savedColumnWidths = ref({...initialWidths});
      let tableRenderKey = ref(0);

      let columnHeaderMap = new Map(activeColumns.map((column) => [
        column.uid,
        useTableColumnHeader({
          columnKey: column.uid,
          table
        })
      ]));

      let resizeMap = new Map(activeColumns.map((column) => [
        column.uid,
        useTableColumnResize({
          ariaLabel: `Resize ${column.name} column`,
          isDisabled: !args.resizable,
          maxWidth: 480,
          minWidth: 80,
          onResize: (nextWidth) => {
            columnWidths.value = {
              ...columnWidths.value,
              [column.uid]: nextWidth
            };
          },
          width: computed({
            get: () => columnWidths.value[column.uid],
            set: (nextWidth) => {
              columnWidths.value = {
                ...columnWidths.value,
                [column.uid]: nextWidth
              };
            }
          })
        })
      ]));

      let rowMap = new Map(collection.rows.map((row) => [
        row.key,
        useTableRow({
          grid: table,
          row
        })
      ]));

      let cellMap = new Map(collection.rows.flatMap((row) => row.cells.map((cell) => [
        cell.key,
        useTableCell({
          cell,
          grid: table,
          row
        })
      ])));

      let rowCheckboxMap = new Map(collection.rows.map((row) => [
        row.key,
        useTableSelectionCheckbox({
          grid: table,
          key: row.key
        })
      ]));

      let selectAllCheckbox = useTableSelectAllCheckbox({
        keys: collection.rows.map((row) => row.key),
        selectedKeys,
        selectionMode: 'multiple'
      });

      let saveColumnWidths = () => {
        savedColumnWidths.value = {
          ...columnWidths.value
        };
      };

      let restoreColumnWidths = () => {
        columnWidths.value = {
          ...savedColumnWidths.value
        };
        tableRenderKey.value += 1;
      };

      let savedColumnWidthText = computed(() => {
        return `{${Object.entries(savedColumnWidths.value)
          .map(([key, value]) => `${key} => ${value}`)
          .join(',')}}`;
      });

      let getCellWidth = (cellKey: string) => {
        let columnKey = cellColumnKey.get(cellKey);
        if (!columnKey) {
          return 180;
        }

        return columnWidths.value[columnKey] ?? 180;
      };

      let getResizableHeaderStyle = (columnUid: ColumnUid) => ({
        width: `${getCellWidth(`row-1-${columnUid}`)}px`,
        textAlign: 'left',
        padding: '5px 10px',
        borderBottom: '2px solid gray',
        outline: 'none',
        cursor: 'default',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        display: 'block',
        flex: '0 0 auto'
      });

      let getResizableCellStyle = (cellKey: string, rowIndex: number) => ({
        width: `${getCellWidth(cellKey)}px`,
        padding: '5px 10px',
        outline: 'none',
        cursor: 'default',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        display: 'block',
        flex: '0 0 auto',
        background: rowIndex % 2 === 0 ? 'var(--spectrum-gray-75)' : 'var(--spectrum-gray-100)'
      });

      let getDocCellStyle = () => ({
        width: '100px',
        display: 'block'
      });

      let getDocRowStyle = (rowIndex: number) => ({
        display: 'flex',
        background: rowIndex % 2 === 0 ? 'none' : 'var(--spectrum-alias-highlight-hover)',
        outline: 'none',
        boxShadow: 'none'
      });

      return {
        activeColumns,
        args,
        bodyRowGroupProps: bodyRowGroup.rowGroupProps,
        collection,
        getCellProps: (_rowKey: string, cellKey: string) => ({
          ...cellMap.get(cellKey)?.gridCellProps.value,
          onClick: (event: MouseEvent) => {
            event.stopPropagation();
            cellMap.get(cellKey)?.press();
            table.setFocused(true);
          }
        }),
        getColumnHeaderProps: (columnUid: ColumnUid) => columnHeaderMap.get(columnUid)?.columnHeaderProps.value,
        getDocCellStyle,
        getDocRowStyle,
        getResizableCellStyle,
        getResizableHeaderStyle,
        getResizeInputProps: (columnUid: ColumnUid) => resizeMap.get(columnUid)?.inputProps.value,
        getRowCheckboxProps: (rowKey: string) => rowCheckboxMap.get(rowKey)?.checkboxProps.value,
        getRowProps: (rowKey: string) => ({
          ...rowMap.get(rowKey)?.rowProps.value,
          onClick: () => {
            rowMap.get(rowKey)?.press();
            table.setFocused(true);
            table.setFocusedKey(rowKey);
          }
        }),
        gridProps: table.gridProps,
        headerRowGroupProps: headerRowGroup.rowGroupProps,
        headerRowProps: headerRow.rowProps,
        hiddenRangeInputStyle,
        restoreColumnWidths,
        saveColumnWidths,
        savedColumnWidthText,
        selectAllCheckbox,
        tableRenderKey,
        toggleRowSelection: (rowKey: string) => rowCheckboxMap.get(rowKey)?.toggleSelection(),
        toggleSelectAll: () => selectAllCheckbox.toggleSelectAll(),
        withSelection
      };
    },
    template: `
      <table v-if="args.docVariant" v-bind="gridProps" style="display: block; position: relative;">
        <thead v-bind="headerRowGroupProps" style="display: block; position: sticky;">
          <tr v-bind="headerRowProps" style="display: flex; color: rgb(34, 34, 34);">
            <th
              v-for="column in activeColumns"
              :key="column.uid"
              v-bind="getColumnHeaderProps(column.uid)"
              style="width: 100px; display: block;">
              <div style="display: flex; position: relative;">
                <button type="button" style="background: transparent; border: 0px; padding: 0px;">{{column.name}}</button>
                <div role="presentation" style="touch-action: none; background: gray; color: transparent;">
                  <input v-bind="getResizeInputProps(column.uid)" type="range" :style="hiddenRangeInputStyle">
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody v-bind="bodyRowGroupProps" style="display: block;">
          <tr
            v-for="(row, rowIndex) in collection.rows"
            :key="row.key"
            v-bind="getRowProps(row.key)"
            :style="getDocRowStyle(rowIndex)">
            <td
              v-for="(cell, cellIndex) in row.cells"
              :key="cell.key"
              v-bind="getCellProps(row.key, cell.key)"
              :role="cellIndex === 0 ? 'rowheader' : 'gridcell'"
              :style="getDocCellStyle()">
              {{cell.textValue}}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else-if="args.controlled && args.resizable && args.showControls">
        <button @click="saveColumnWidths">Save Cols</button>
        <button @click="restoreColumnWidths">Restore Cols</button>
        <div>Current saved column state: {{savedColumnWidthText}}</div>
        <div :key="tableRenderKey">
          <table v-bind="gridProps" style="width: 100%; display: block; position: relative;">
            <thead v-bind="headerRowGroupProps" style="display: block; position: sticky; background: rgb(248, 248, 248);">
              <tr v-bind="headerRowProps" style="display: flex;">
                <th
                  v-for="column in activeColumns"
                  :key="column.uid"
                  v-bind="getColumnHeaderProps(column.uid)"
                  :style="getResizableHeaderStyle(column.uid)">
                  <div style="display: flex; position: relative;">
                    <div style="flex: 1 1 auto;">{{column.name}}</div>
                    <div role="presentation" style="touch-action: none;">
                      <div :style="hiddenRangeInputStyle">
                        <input v-bind="getResizeInputProps(column.uid)" type="range" :style="hiddenRangeInputStyle">
                      </div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody v-bind="bodyRowGroupProps" style="display: block;">
              <tr
                v-for="(row, rowIndex) in collection.rows"
                :key="row.key"
                v-bind="getRowProps(row.key)"
                style="display: flex; outline: none;">
                <td
                  v-for="(cell, cellIndex) in row.cells"
                  :key="cell.key"
                  v-bind="getCellProps(row.key, cell.key)"
                  :role="cellIndex === 0 ? 'rowheader' : 'gridcell'"
                  :style="getResizableCellStyle(cell.key, rowIndex)">
                  {{cell.textValue}}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <template v-else>
        <label v-if="args.withFocusableSiblings" for="focusable-before">Focusable before</label>
        <input v-if="args.withFocusableSiblings" id="focusable-before">
        <table
          v-bind="gridProps"
          :style="args.resizable ? {width: '100%', display: 'block', position: 'relative'} : {borderCollapse: 'collapse'}">
          <thead
            v-bind="headerRowGroupProps"
            :style="args.resizable ? {display: 'block', position: 'sticky', background: 'rgb(248, 248, 248)'} : {borderBottom: '2px solid gray', display: 'block'}">
            <tr v-bind="headerRowProps" :style="args.resizable ? {display: 'flex'} : undefined">
              <th v-if="withSelection" role="columnheader">
                <input
                  type="checkbox"
                  :aria-label="selectAllCheckbox.checkboxProps['aria-label']"
                  :checked="selectAllCheckbox.checkboxProps.checked"
                  :disabled="selectAllCheckbox.checkboxProps.disabled"
                  @change="toggleSelectAll">
              </th>
              <th
                v-for="column in activeColumns"
                :key="column.uid"
                v-bind="getColumnHeaderProps(column.uid)"
                :style="args.resizable
                  ? getResizableHeaderStyle(column.uid)
                  : {textAlign: 'left', padding: '5px 10px', outline: 'none', cursor: 'default'}">
                <template v-if="args.resizable">
                  <div style="display: flex; position: relative;">
                    <div style="flex: 1 1 auto;">{{column.name}}</div>
                    <div role="presentation" style="touch-action: none;">
                      <div :style="hiddenRangeInputStyle">
                        <input v-bind="getResizeInputProps(column.uid)" type="range" :style="hiddenRangeInputStyle">
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>{{column.name}}</template>
              </th>
            </tr>
          </thead>
          <tbody v-bind="bodyRowGroupProps" :style="args.resizable ? {display: 'block'} : {display: 'block', overflow: 'auto', maxHeight: '200px'}">
            <tr
              v-for="(row, rowIndex) in collection.rows"
              :key="row.key"
              v-bind="getRowProps(row.key)"
              :style="{display: args.resizable ? 'flex' : undefined, background: args.resizable ? undefined : (rowIndex % 2 === 1 ? 'lightgray' : 'none'), outline: 'none'}">
              <td v-if="withSelection" role="gridcell">
                <input
                  type="checkbox"
                  :aria-label="getRowCheckboxProps(row.key)?.['aria-label']"
                  :checked="getRowCheckboxProps(row.key)?.checked"
                  :disabled="getRowCheckboxProps(row.key)?.disabled"
                  @change.stop="toggleRowSelection(row.key)">
              </td>
              <td
                v-for="(cell, cellIndex) in row.cells"
                :key="cell.key"
                v-bind="getCellProps(row.key, cell.key)"
                :role="cellIndex === 0 ? 'rowheader' : 'gridcell'"
                :style="args.resizable
                  ? getResizableCellStyle(cell.key, rowIndex)
                  : {padding: '5px 10px', outline: 'none', cursor: 'default'}">
                {{cell.textValue}}
              </td>
            </tr>
          </tbody>
        </table>
        <label v-if="args.withFocusableSiblings" for="focus-after">Focusable after</label>
        <input v-if="args.withFocusableSiblings" id="focus-after">
      </template>
    `
  };
}

export const ScrollTesting: Story = {
  render: () => renderTable({withFocusableSiblings: true}),
  name: 'Scroll Testing'
};

export const ActionTesting: Story = {
  render: () => renderTable({withFocusableSiblings: true, withRowAction: true, withSelection: false}),
  name: 'Action Testing',
  parameters: {
    a11y: {
      config: {
        rules: [
          {id: 'scrollable-region-focusable', enabled: false}
        ]
      }
    }
  }
};

export const BackwardCompatActionTesting: Story = {
  render: () => renderTable({withFocusableSiblings: true, withRowAction: true, withSelection: false}),
  name: 'Backward Compat Action Testing',
  parameters: {
    a11y: {
      config: {
        rules: [
          {id: 'scrollable-region-focusable', enabled: false}
        ]
      }
    }
  }
};

export const TableWithResizingNoProps: Story = {
  render: () => renderTable({resizable: true, withSelection: false}),
  name: 'Table With Resizing No Props'
};

export const TableWithResizingFRs: Story = {
  render: () => renderTable({resizable: true, withSelection: false}),
  name: 'Table With Resizing F Rs'
};

export const TableWithResizingFRsControlled: Story = {
  render: () => renderTable({controlled: true, resizable: true, showControls: true, withSelection: false}),
  name: 'Table With Resizing F Rs Controlled',
  parameters: {
    description: {
      data: controlledDescription
    }
  }
};

export const TableWithSomeResizingFRsControlled: Story = {
  render: () => renderTable({controlled: true, includeExtraColumns: true, resizable: true, showControls: true, withSelection: false}),
  name: 'Table With Some Resizing F Rs Controlled',
  parameters: {
    description: {
      data: controlledDescription
    }
  }
};

export const DocExample: Story = {
  render: () => renderTable({docVariant: true, resizable: true, withSelection: false}),
  name: 'Doc Example'
};

export const DocExampleControlled: Story = {
  render: () => renderTable({controlled: true, docVariant: true, resizable: true, withSelection: false}),
  name: 'Doc Example Controlled'
};
