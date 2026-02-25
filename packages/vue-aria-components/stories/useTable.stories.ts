import {computed} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type TableArgs = {
  controlled?: boolean,
  includeExtraColumns?: boolean,
  resizable?: boolean
};

const columns = [
  {name: 'Name', uid: 'name'},
  {name: 'Type', uid: 'type'},
  {name: 'Level', uid: 'level'}
];

const rows = [
  {id: 1, name: 'Charizard', type: 'Fire, Flying', level: '67', weight: '200lbs', height: '5\'7"'},
  {id: 2, name: 'Blastoise', type: 'Water', level: '56', weight: '188lbs', height: '5\'3"'},
  {id: 3, name: 'Venusaur', type: 'Grass, Poison', level: '83', weight: '220lbs', height: '6\'7"'},
  {id: 4, name: 'Pikachu', type: 'Electric', level: '100', weight: '13lbs', height: '1\'4"'}
];

const meta = {
  title: 'useTable'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function renderTable(args: TableArgs) {
  return {
    setup() {
      let activeColumns = computed(() => {
        if (!args.includeExtraColumns) {
          return columns;
        }

        return [
          ...columns.slice(0, 2),
          {name: 'Height', uid: 'height'},
          {name: 'Weight', uid: 'weight'},
          columns[2]
        ];
      });

      return {
        activeColumns,
        args,
        rows
      };
    },
    template: `
      <div style="display: grid; gap: 8px; max-width: 720px;">
        <div style="font-size: 12px; color: #666;">
          resizable={{String(Boolean(args.resizable))}}, controlled={{String(Boolean(args.controlled))}}
        </div>
        <table role="grid" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th
                v-for="column in activeColumns"
                :key="column.uid"
                style="text-align: left; border: 1px solid #ddd; padding: 6px;">
                {{column.name}}
                <span v-if="args.resizable" aria-hidden="true" style="margin-left: 6px; color: #999;">↔</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td
                v-for="column in activeColumns"
                :key="column.uid"
                style="border: 1px solid #eee; padding: 6px;">
                {{row[column.uid]}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  };
}

export const ScrollTesting: Story = {
  render: () => renderTable({}),
  name: 'Scroll Testing'
};

export const ActionTesting: Story = {
  render: () => renderTable({}),
  name: 'Action Testing'
};

export const BackwardCompatActionTesting: Story = {
  render: () => renderTable({}),
  name: 'Backward Compat Action Testing'
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
  render: () => renderTable({resizable: true, controlled: true}),
  name: 'Table With Resizing F Rs Controlled'
};

export const TableWithSomeResizingFRsControlled: Story = {
  render: () => renderTable({resizable: true, controlled: true, includeExtraColumns: true}),
  name: 'Table With Some Resizing F Rs Controlled'
};

export const DocExample: Story = {
  render: () => renderTable({resizable: true}),
  name: 'Doc Example'
};

export const DocExampleControlled: Story = {
  render: () => renderTable({resizable: true, controlled: true}),
  name: 'Doc Example Controlled'
};
