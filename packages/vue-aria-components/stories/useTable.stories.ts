import {action} from '@storybook/addon-actions';
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
  includeExtraColumns?: boolean,
  resizable?: boolean,
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
        selectionMode: 'multiple'
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

      let sortDirections = ref<Record<string, 'ascending' | 'descending' | undefined>>({});
      let initialWidths = Object.fromEntries(
        activeColumns.map((column) => [column.uid, column.uid === 'level' ? 260 : 180])
      ) as Record<ColumnUid, number>;
      let columnWidths = ref(initialWidths);
      let savedColumnWidths = ref({...initialWidths});

      let columnHeaderMap = new Map(activeColumns.map((column) => [
        column.uid,
        useTableColumnHeader({
          allowsSorting: true,
          columnKey: column.uid,
          onSort: (columnKey) => {
            let key = String(columnKey);
            let currentDirection = sortDirections.value[key];
            sortDirections.value = {
              ...sortDirections.value,
              [key]: currentDirection === 'ascending' ? 'descending' : 'ascending'
            };
          },
          sortDirection: computed(() => sortDirections.value[column.uid]),
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
      };

      let savedColumnWidthText = computed(() => {
        return `{${Object.entries(savedColumnWidths.value)
          .map(([key, value]) => `${key} => ${value}`)
          .join(',')}}`;
      });

      return {
        activeColumns,
        args,
        bodyRowGroup,
        collection,
        columnWidths,
        getCellProps: (_rowKey: string, cellKey: string) => ({
          ...cellMap.get(cellKey)?.gridCellProps.value,
          onClick: (event: MouseEvent) => {
            event.stopPropagation();
            cellMap.get(cellKey)?.press();
            table.setFocused(true);
          }
        }),
        getCellWidth: (cellKey: string) => {
          let columnKey = cellColumnKey.get(cellKey);
          if (!columnKey) {
            return 180;
          }

          return columnWidths.value[columnKey] ?? 180;
        },
        getColumnHeaderProps: (columnUid: ColumnUid) => columnHeaderMap.get(columnUid)?.columnHeaderProps.value,
        getResizeInputProps: (columnUid: ColumnUid) => resizeMap.get(columnUid)?.inputProps.value,
        getResizeResizerProps: (columnUid: ColumnUid) => resizeMap.get(columnUid)?.resizerProps.value,
        getRowCheckboxProps: (rowKey: string) => rowCheckboxMap.get(rowKey)?.checkboxProps.value,
        getRowProps: (rowKey: string) => ({
          ...rowMap.get(rowKey)?.rowProps.value,
          onClick: () => {
            rowMap.get(rowKey)?.press();
            table.setFocused(true);
            table.setFocusedKey(rowKey);
          }
        }),
        headerRow,
        headerRowGroup,
        isCellFocused: (cellKey: string) => table.focusedKey.value === cellKey,
        isColumnResizing: (columnUid: ColumnUid) => Boolean(resizeMap.get(columnUid)?.isResizing.value),
        isRowFocused: (rowKey: string) => table.focusedKey.value === rowKey,
        isRowSelected: (rowKey: string) => table.isSelected(rowKey),
        restoreColumnWidths,
        saveColumnWidths,
        savedColumnWidthText,
        selectAllCheckbox,
        table,
        toggleRowSelection: (rowKey: string) => rowCheckboxMap.get(rowKey)?.toggleSelection(),
        toggleSelectAll: () => selectAllCheckbox.toggleSelectAll()
      };
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 900px;">
        <div v-if="args.controlled && args.resizable" style="display: flex; gap: 8px;">
          <button type="button" @click="saveColumnWidths">Save Cols</button>
          <button type="button" @click="restoreColumnWidths">Restore Cols</button>
        </div>
        <div v-if="args.controlled && args.resizable" style="font-size: 12px; color: #666;">
          Current saved column state: {{savedColumnWidthText}}
        </div>
        <label v-if="args.withFocusableSiblings" for="focusable-before">Focusable before</label>
        <input v-if="args.withFocusableSiblings" id="focusable-before">
        <table
          v-bind="table.gridProps"
          style="width: 100%; border-collapse: collapse;">
          <thead v-bind="headerRowGroup.rowGroupProps">
            <tr v-bind="headerRow.rowProps">
              <th role="columnheader" style="width: 42px; border: 1px solid #ddd; padding: 6px;">
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
                :style="{textAlign: 'left', border: '1px solid #ddd', padding: '6px', width: columnWidths[column.uid] + 'px'}">
                <span>{{column.name}}</span>
                <span aria-hidden="true" style="margin-left: 6px;">
                  {{getColumnHeaderProps(column.uid)?.['aria-sort'] === 'ascending' ? '▲' : getColumnHeaderProps(column.uid)?.['aria-sort'] === 'descending' ? '▼' : '↕'}}
                </span>
                <input
                  v-if="args.resizable"
                  v-bind="getResizeInputProps(column.uid)"
                  :style="{width: '92px', marginLeft: '8px', opacity: isColumnResizing(column.uid) ? '1' : '0.7'}"
                  @pointerdown="getResizeResizerProps(column.uid)?.onPointerDown()"
                  @pointerup="getResizeResizerProps(column.uid)?.onPointerUp()">
              </th>
            </tr>
          </thead>
          <tbody v-bind="bodyRowGroup.rowGroupProps">
            <tr
              v-for="row in collection.rows"
              :key="row.key"
              v-bind="getRowProps(row.key)"
              :style="{background: isRowSelected(row.key) ? '#edf3ff' : undefined, outline: isRowFocused(row.key) ? '2px solid #6b8afd' : undefined}">
              <td role="gridcell" style="width: 42px; border: 1px solid #ddd; padding: 6px;">
                <input
                  type="checkbox"
                  :aria-label="getRowCheckboxProps(row.key)?.['aria-label']"
                  :checked="getRowCheckboxProps(row.key)?.checked"
                  :disabled="getRowCheckboxProps(row.key)?.disabled"
                  @change.stop="toggleRowSelection(row.key)">
              </td>
              <td
                v-for="cell in row.cells"
                :key="cell.key"
                v-bind="getCellProps(row.key, cell.key)"
                :style="{border: '1px solid #ddd', padding: '6px', width: getCellWidth(cell.key) + 'px', outline: isCellFocused(cell.key) ? '1px solid #0b66ff' : undefined}">
                {{cell.textValue}}
              </td>
            </tr>
          </tbody>
        </table>
        <label v-if="args.withFocusableSiblings" for="focusable-after">Focusable after</label>
        <input v-if="args.withFocusableSiblings" id="focusable-after">
      </div>
    `
  };
}

export const ScrollTesting: Story = {
  render: () => renderTable({withFocusableSiblings: true}),
  name: 'Scroll Testing'
};

export const ActionTesting: Story = {
  render: () => renderTable({withFocusableSiblings: true, withRowAction: true}),
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
  render: () => renderTable({withFocusableSiblings: true, withRowAction: true}),
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
  render: () => renderTable({resizable: true}),
  name: 'Table With Resizing No Props'
};

export const TableWithResizingFRs: Story = {
  render: () => renderTable({resizable: true}),
  name: 'Table With Resizing F Rs'
};

export const TableWithResizingFRsControlled: Story = {
  render: () => renderTable({controlled: true, resizable: true}),
  name: 'Table With Resizing F Rs Controlled',
  parameters: {
    description: {
      data: controlledDescription
    }
  }
};

export const TableWithSomeResizingFRsControlled: Story = {
  render: () => renderTable({controlled: true, includeExtraColumns: true, resizable: true}),
  name: 'Table With Some Resizing F Rs Controlled',
  parameters: {
    description: {
      data: controlledDescription
    }
  }
};

export const DocExample: Story = {
  render: () => renderTable({resizable: true}),
  name: 'Doc Example'
};

export const DocExampleControlled: Story = {
  render: () => renderTable({controlled: true, resizable: true}),
  name: 'Doc Example Controlled'
};
