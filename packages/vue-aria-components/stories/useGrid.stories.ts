import {ref} from 'vue';
import {useGrid, useGridCell, useGridRow, type GridCollection} from '@vue-aria/grid';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type GridArgs = {
  cellFocusMode: 'cell' | 'child',
  gridFocusMode: 'cell' | 'row'
};

const meta = {
  title: 'useGrid'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const rowSwitches = [
  ['Switch 1', 'Switch 2'],
  ['Switch 1', 'Switch 2', 'Switch 3'],
  ['Switch 1', 'Switch 2']
];

function renderGrid(args: GridArgs) {
  let collection: GridCollection = {
    columnCount: 1,
    rows: rowSwitches.map((switches, index) => ({
      cells: [
        {
          colIndex: 0,
          key: `row-${index + 1}-cell-1`,
          textValue: switches.join(', ')
        }
      ],
      index,
      key: `row-${index + 1}`,
      textValue: `Row ${index + 1}`
    }))
  };
  let switchesByRow = Object.fromEntries(collection.rows.map((row, index) => [row.key, rowSwitches[index]]));

  return {
    setup() {
      let selectedKeys = ref(new Set<string>());
      let grid = useGrid({
        ariaLabel: 'Grid',
        collection,
        focusMode: args.gridFocusMode,
        selectedKeys,
        selectionMode: 'multiple'
      });

      let rowProps = new Map<string, () => Record<string, unknown>>();
      let cellProps = new Map<string, () => Record<string, unknown>>();
      for (let row of collection.rows) {
        let rowState = useGridRow({
          grid,
          row
        });
        rowProps.set(row.key, () => ({
          ...rowState.rowProps.value,
          onClick: () => {
            rowState.press();
            grid.setFocused(true);
            grid.setFocusedKey(row.key);
          }
        }));

        let cell = row.cells[0];
        let cellState = useGridCell({
          cell,
          focusMode: args.cellFocusMode,
          grid,
          row
        });
        cellProps.set(cell.key, () => ({
          ...cellState.gridCellProps.value,
          onClick: () => {
            cellState.press();
            grid.setFocused(true);
          }
        }));
      }

      return {
        args,
        collection,
        getCellProps: (key: string) => cellProps.get(key)?.() ?? {},
        getRowProps: (key: string) => rowProps.get(key)?.() ?? {},
        grid,
        isCellFocused: (key: string) => grid.focusedKey.value === key,
        isRowFocused: (key: string) => grid.focusedKey.value === key,
        switchesByRow
      };
    },
    template: `
      <div style="display: grid; gap: 10px;">
        <div style="font-size: 12px; color: #666;">gridFocusMode={{args.gridFocusMode}}, cellFocusMode={{args.cellFocusMode}}</div>
        <div v-bind="grid.gridProps" style="display: grid; gap: 4px; width: 100%; max-width: 480px;">
          <div
            v-for="row in collection.rows"
            :key="row.key"
            v-bind="getRowProps(row.key)"
            :style="{outline: isRowFocused(row.key) ? '2px solid red' : undefined}">
            <div
              v-for="cell in row.cells"
              :key="cell.key"
              v-bind="getCellProps(cell.key)"
              :style="{outline: isCellFocused(cell.key) ? '2px solid green' : undefined, display: 'flex', gap: '10px', padding: '4px'}">
              <label v-for="switchLabel in switchesByRow[row.key]" :key="switchLabel" style="display: inline-flex; align-items: center; gap: 4px;">
                <input type="checkbox" :aria-label="switchLabel">
                <span>{{switchLabel}}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    `
  };
}

export const GridFocusModeRowCellFocusModeCell: Story = {
  render: () => renderGrid({gridFocusMode: 'row', cellFocusMode: 'cell'}),
  name: 'gridFocusMode = row, cellFocusMode = cell'
};

export const GridFocusModeRowCellFocusModeChild: Story = {
  render: () => renderGrid({gridFocusMode: 'row', cellFocusMode: 'child'}),
  name: 'gridFocusMode = row, cellFocusMode = child'
};

export const GridFocusModeCellCellFocusModeChild: Story = {
  render: () => renderGrid({gridFocusMode: 'cell', cellFocusMode: 'child'}),
  name: 'gridFocusMode = cell, cellFocusMode = child'
};

export const GridFocusModeCellCellFocusModeCell: Story = {
  render: () => renderGrid({gridFocusMode: 'cell', cellFocusMode: 'cell'}),
  name: 'gridFocusMode = cell, cellFocusMode = cell'
};
