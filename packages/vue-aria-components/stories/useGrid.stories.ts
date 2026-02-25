import {computed} from 'vue';
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

function renderGrid(args: GridArgs) {
  return {
    setup() {
      let rows = computed(() => [
        ['Switch 1', 'Switch 2'],
        ['Switch 1', 'Switch 2', 'Switch 3'],
        ['Switch 1', 'Switch 2']
      ]);

      return {
        args,
        rows
      };
    },
    template: `
      <div style="display: grid; gap: 10px;">
        <div style="font-size: 12px; color: #666;">gridFocusMode={{args.gridFocusMode}}, cellFocusMode={{args.cellFocusMode}}</div>
        <table role="grid" style="border-collapse: collapse; width: 100%; max-width: 480px;">
          <tbody>
            <tr v-for="(row, rowIndex) in rows" :key="rowIndex" role="row">
              <td
                v-for="(cell, cellIndex) in row"
                :key="cellIndex"
                role="gridcell"
                style="border: 1px solid #ddd; padding: 6px;">
                <button type="button">{{cell}}</button>
              </td>
            </tr>
          </tbody>
        </table>
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
