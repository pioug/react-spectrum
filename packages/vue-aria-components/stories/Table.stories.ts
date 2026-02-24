import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueButton, VueTable} from 'vue-aria-components';
import {ref} from 'vue';

type TableColumn = {
  key: string,
  label: string
};

type TableRow = Record<string, number | string>;
type StoryArgs = Record<string, unknown>;
type StyleMap = Record<string, number | string>;

const fileColumns: TableColumn[] = [
  {key: 'name', label: 'Name'},
  {key: 'type', label: 'Type'},
  {key: 'date', label: 'Date Modified'}
];

const fileRows: TableRow[] = [
  {id: 1, name: 'Games', date: '6/7/2020', type: 'File folder'},
  {id: 2, name: 'Program Files', date: '4/7/2021', type: 'File folder'},
  {id: 3, name: 'bootmgr', date: '11/20/2010', type: 'System file'},
  {id: 4, name: 'log.txt', date: '1/18/2016', type: 'Text Document'}
];

const timeColumns: TableColumn[] = [
  {key: 'time', label: 'Time'},
  {key: 'monday', label: 'Monday'},
  {key: 'tuesday', label: 'Tuesday'},
  {key: 'wednesday', label: 'Wednesday'},
  {key: 'thursday', label: 'Thursday'},
  {key: 'friday', label: 'Friday'}
];

const timeRows: TableRow[] = [
  {id: 1, time: '08:00 - 09:00', monday: 'Math', tuesday: 'History', wednesday: 'Science', thursday: 'English', friday: 'Art'},
  {id: 2, time: '09:00 - 10:00', monday: 'Break', tuesday: 'Break', wednesday: 'Break', thursday: 'Break', friday: 'Break'},
  {id: 3, time: '10:00 - 11:00', monday: 'Math', tuesday: 'History', wednesday: 'Science', thursday: 'English', friday: 'Art'},
  {id: 4, time: '11:00 - 12:00', monday: 'Math', tuesday: 'History', wednesday: 'Science', thursday: 'English', friday: 'Art'},
  {id: 5, time: '12:00 - 13:00', monday: 'Break', tuesday: 'Break', wednesday: 'Break', thursday: 'Break', friday: 'Break'},
  {id: 6, time: '13:00 - 14:00', monday: 'History', tuesday: 'Math', wednesday: 'English', thursday: 'Science', friday: 'Art'}
];

const tableTransitionColumns: TableColumn[] = [
  {key: 'name', label: 'Name'},
  {key: 'type', label: 'Type'},
  {key: 'date', label: 'Date Modified'}
];

const tableTransitionRows1: TableRow[] = [
  {id: 25, name: 'Web Development', date: '7/10/2023', type: 'File folder'},
  {id: 26, name: 'drivers', date: '2/2/2022', type: 'System file'},
  {id: 27, name: 'debug.txt', date: '12/5/2024', type: 'Text Document'},
  {id: 28, name: 'Marketing Plan.pptx', date: '3/15/2025', type: 'PowerPoint file'},
  {id: 29, name: 'Contract_v3.pdf', date: '1/2/2025', type: 'PDF Document'},
  {id: 30, name: 'Movies', date: '5/20/2024', type: 'File folder'},
  {id: 31, name: 'User Manual.docx', date: '9/1/2024', type: 'Word Document'},
  {id: 32, name: 'Sales Data_Q1.xlsx', date: '4/10/2025', type: 'Excel file'},
  {id: 33, name: 'archive_old.rar', date: '6/1/2023', type: 'RAR archive'},
  {id: 34, name: 'logo.svg', date: '11/22/2024', type: 'SVG image'},
  {id: 35, name: 'main.py', date: '10/1/2024', type: 'Python file'},
  {id: 36, name: 'base.html', date: '8/18/2024', type: 'HTML file'},
  {id: 37, name: 'Configurations', date: '4/5/2024', type: 'File folder'},
  {id: 38, name: 'kernel32.dll', date: '9/10/2018', type: 'System file'},
  {id: 39, name: 'security_log.txt', date: '3/28/2025', type: 'Text Document'},
  {id: 40, name: 'Project Proposal v2.pptx', date: '1/15/2025', type: 'PowerPoint file'},
  {id: 41, name: 'NDA_Signed.pdf', date: '12/20/2024', type: 'PDF Document'},
  {id: 42, name: 'Downloads', date: '7/1/2024', type: 'File folder'},
  {id: 43, name: 'Meeting Minutes.docx', date: '4/12/2025', type: 'Word Document'},
  {id: 44, name: 'Financial Report_FY24.xlsx', date: '3/5/2025', type: 'Excel file'},
  {id: 45, name: 'data_backup_v1.tar.gz', date: '11/8/2024', type: 'GZIP archive'},
  {id: 46, name: 'icon.ico', date: '6/25/2024', type: 'ICO file'},
  {id: 47, name: 'app.config', date: '9/30/2024', type: 'Configuration file'},
  {id: 48, name: 'Templates', date: '2/10/2025', type: 'File folder'}
];

const tableTransitionRows2: TableRow[] = [
  {id: 100, name: 'Assets', date: '8/15/2024', type: 'File folder'},
  {id: 101, name: 'drivers64', date: '3/3/2023', type: 'System file'},
  {id: 102, name: 'install.log', date: '1/8/2025', type: 'Text Document'},
  {id: 103, name: 'Product Demo.pptx', date: '4/20/2025', type: 'PowerPoint file'},
  {id: 104, name: 'Terms_of_Service.pdf', date: '2/5/2025', type: 'PDF Document'},
  {id: 105, name: 'Animations', date: '6/25/2024', type: 'File folder'},
  {id: 106, name: 'Release Notes.docx', date: '10/1/2024', type: 'Word Document'},
  {id: 107, name: 'Financial Projections.xlsx', date: '5/12/2025', type: 'Excel file'},
  {id: 108, name: 'backup_2023.tar', date: '7/1/2024', type: 'TAR archive'},
  {id: 109, name: 'thumbnail.jpg', date: '12/1/2024', type: 'JPEG image'},
  {id: 110, name: 'api_client.py', date: '11/15/2024', type: 'Python file'},
  {id: 111, name: 'index.html', date: '9/28/2024', type: 'HTML file'},
  {id: 112, name: 'Resources', date: '5/5/2024', type: 'File folder'},
  {id: 113, name: 'msvcr100.dll', date: '10/10/2019', type: 'System file'},
  {id: 114, name: 'system_events.txt', date: '4/1/2025', type: 'Text Document'},
  {id: 115, name: 'Training Presentation.pptx', date: '2/20/2025', type: 'PowerPoint file'},
  {id: 116, name: 'Privacy_Policy.pdf', date: '1/10/2025', type: 'PDF Document'},
  {id: 117, name: 'Desktop', date: '8/1/2024', type: 'File folder'},
  {id: 118, name: 'Meeting Agenda.docx', date: '5/15/2025', type: 'Word Document'},
  {id: 119, name: 'Budget_Forecast.xlsx', date: '4/15/2025', type: 'Excel file'},
  {id: 120, name: 'code_backup.7z', date: '12/1/2024', type: '7Z archive'},
  {id: 121, name: 'icon_large.ico', date: '7/1/2024', type: 'ICO file'},
  {id: 122, name: 'settings.ini', date: '10/5/2024', type: 'Configuration file'},
  {id: 123, name: 'Project Docs', date: '3/1/2025', type: 'File folder'},
  {id: 124, name: 'winload.exe', date: '11/1/2010', type: 'System file'},
  {id: 125, name: 'application.log', date: '6/1/2025', type: 'Text Document'},
  {id: 126, name: 'Client Presentation.pptx', date: '3/1/2025', type: 'PowerPoint file'},
  {id: 127, name: 'EULA.pdf', date: '2/15/2025', type: 'PDF Document'},
  {id: 128, name: 'Temporary', date: '9/1/2024', type: 'File folder'},
  {id: 129, name: 'Action Items.docx', date: '6/1/2025', type: 'Word Document'},
  {id: 130, name: 'Revenue_Report.xlsx', date: '5/20/2025', type: 'Excel file'},
  {id: 131, name: 'data_dump.sql', date: '1/1/2025', type: 'SQL Dump'},
  {id: 132, name: 'image_preview.bmp', date: '8/20/2024', type: 'Bitmap image'},
  {id: 133, name: 'server.conf', date: '11/20/2024', type: 'Configuration file'},
  {id: 134, name: 'Documentation', date: '4/1/2025', type: 'File folder'},
  {id: 135, name: 'hal.dll', date: '12/25/2007', type: 'System file'},
  {id: 136, name: 'access.log', date: '7/1/2025', type: 'Text Document'},
  {id: 137, name: 'Strategy Presentation.pptx', date: '4/1/2025', type: 'PowerPoint file'},
  {id: 138, name: 'Service Agreement.pdf', date: '3/1/2025', type: 'PDF Document'},
  {id: 139, name: 'Recycle Bin', date: '1/1/2000', type: 'System folder'}
];

const virtualizedTableRows: TableRow[] = Array.from({length: 22}, (_, index) => ({
  id: index,
  bar: `Bar ${index}`,
  baz: `Baz ${index}`,
  foo: `Foo ${index}`
}));

const meta = {
  title: 'React Aria Components/Table',
  component: VueTable
} satisfies Meta<typeof VueTable>;

export default meta;

type TableStory = StoryFn<typeof VueTable>;
type Story = StoryObj<typeof meta>;

interface TableStoryOptions {
  actionName?: string,
  caption: string,
  columns: TableColumn[],
  containerStyle?: StyleMap,
  rows: TableRow[],
  showSelection?: boolean
}

function makeRows(count: number, prefix = 'Row'): TableRow[] {
  return Array.from({length: count}, (_, index) => ({
    id: index + 1,
    foo: `${prefix} ${index + 1} / Foo`,
    bar: `${prefix} ${index + 1} / Bar`,
    baz: `${prefix} ${index + 1} / Baz`
  }));
}

function createTableStory(args: StoryArgs = {}, options: TableStoryOptions) {
  return {
    components: {
      VueTable
    },
    setup() {
      let selected = ref<string | number>();
      return {
        args,
        caption: options.caption,
        columns: options.columns,
        containerStyle: options.containerStyle ?? {},
        onRowAction: action(options.actionName ?? 'onRowAction'),
        rows: options.rows,
        selected,
        showSelection: options.showSelection ?? true
      };
    },
    template: `
      <div :style="containerStyle">
        <VueTable
          v-bind="args"
          v-model="selected"
          :caption="caption"
          :columns="columns"
          :rows="rows"
          @rowAction="onRowAction" />
        <p v-if="showSelection" style="margin-top: 8px;">Selected row: {{ selected ?? 'none' }}</p>
      </div>
    `
  };
}

export const ReorderableTableExample: TableStory = () => ({
  template: `
    <div style="display: flex;">
      <div class="react-aria-ResizableTableContainer" style="width: 300px; overflow: auto;">
        <table aria-label="Reorderable table" class="react-aria-Table" data-allows-dragging="true" data-rac="" role="grid" style="border-collapse: collapse; table-layout: fixed; width: fit-content;" tabindex="0">
          <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
            <tr role="row">
              <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" style="width: 150px;" tabindex="-1">
                <div style="display: flex;">
                  <button aria-expanded="false" aria-haspopup="true" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" style="flex: 1 1 0%; height: 30px; text-align: left;" type="button">Id</button>
                  <div class="react-aria-ColumnResizer" data-rac="" data-react-aria-pressable="true" data-resizable-direction="both" role="presentation" style="background-clip: content-box; background-color: rgb(128, 128, 128); border-bottom: 0px solid transparent; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 0px solid transparent; box-sizing: border-box; cursor: ew-resize; flex-shrink: 0; text-align: center; touch-action: none; width: 15px;">↔<input aria-label="Resizer" aria-orientation="horizontal" max="9007199254740991" min="75" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;" type="range" value="150"></div>
                </div>
              </th>
              <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" style="width: 150px;" tabindex="-1">
                <div style="display: flex;">
                  <button aria-expanded="false" aria-haspopup="true" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" style="flex: 1 1 0%; height: 30px; text-align: left;" type="button">Name</button>
                  <div class="react-aria-ColumnResizer" data-rac="" data-react-aria-pressable="true" data-resizable-direction="both" role="presentation" style="background-clip: content-box; background-color: rgb(128, 128, 128); border-bottom: 0px solid transparent; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 0px solid transparent; box-sizing: border-box; cursor: ew-resize; flex-shrink: 0; text-align: center; touch-action: none; width: 15px;">↔<input aria-label="Resizer" aria-orientation="horizontal" max="9007199254740991" min="75" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;" type="range" value="150"></div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
            <tr class="react-aria-Row" data-rac="" draggable="true" role="row" tabindex="-1">
              <td class="react-aria-Cell" data-rac="" role="rowheader">1</td>
              <td class="react-aria-Cell" data-rac="" role="gridcell">Bob</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="react-aria-ResizableTableContainer" style="width: 300px; overflow: auto;">
        <table aria-label="Reorderable table" class="react-aria-Table" data-allows-dragging="true" data-rac="" role="grid" style="border-collapse: collapse; table-layout: fixed; width: fit-content;" tabindex="0">
          <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
            <tr role="row">
              <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" style="width: 150px;" tabindex="-1">
                <div style="display: flex;">
                  <button aria-expanded="false" aria-haspopup="true" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" style="flex: 1 1 0%; height: 30px; text-align: left;" type="button">Id</button>
                  <div class="react-aria-ColumnResizer" data-rac="" data-react-aria-pressable="true" data-resizable-direction="both" role="presentation" style="background-clip: content-box; background-color: rgb(128, 128, 128); border-bottom: 0px solid transparent; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 0px solid transparent; box-sizing: border-box; cursor: ew-resize; flex-shrink: 0; text-align: center; touch-action: none; width: 15px;">↔<input aria-label="Resizer" aria-orientation="horizontal" max="9007199254740991" min="75" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;" type="range" value="150"></div>
                </div>
              </th>
              <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" style="width: 150px;" tabindex="-1">
                <div style="display: flex;">
                  <button aria-expanded="false" aria-haspopup="true" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" style="flex: 1 1 0%; height: 30px; text-align: left;" type="button">Name</button>
                  <div class="react-aria-ColumnResizer" data-rac="" data-react-aria-pressable="true" data-resizable-direction="both" role="presentation" style="background-clip: content-box; background-color: rgb(128, 128, 128); border-bottom: 0px solid transparent; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 0px solid transparent; box-sizing: border-box; cursor: ew-resize; flex-shrink: 0; text-align: center; touch-action: none; width: 15px;">↔<input aria-label="Resizer" aria-orientation="horizontal" max="9007199254740991" min="75" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;" type="range" value="150"></div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
            <tr class="react-aria-Row" data-rac="" draggable="true" role="row" tabindex="-1">
              <td class="react-aria-Cell" data-rac="" role="rowheader">2</td>
              <td class="react-aria-Cell" data-rac="" role="gridcell">Alex</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
});

export const TableExampleStory: Story = {
  render: () => ({
    setup() {
      return {fileRows};
    },
    template: `
      <div class="react-aria-ResizableTableContainer" style="width: 400px; overflow: auto;">
        <table aria-label="Example table" class="react-aria-Table" data-rac="" role="grid" style="border-collapse: collapse; table-layout: fixed; width: fit-content;" tabindex="0">
          <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
            <tr role="row">
              <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" style="width: 30px;" tabindex="-1">
                <label class="react-aria-Checkbox" data-disabled="true" data-rac="" data-react-aria-pressable="true" slot="selection">
                  <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                    <input aria-label="Select All" data-react-aria-pressable="true" disabled type="checkbox">
                  </span>
                  <div class="checkbox">
                    <svg aria-hidden="true" viewBox="0 0 18 18">
                      <polyline points="1 9 7 14 15 4"></polyline>
                    </svg>
                  </div>
                </label>
              </th>
              <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" style="width: 120px;" tabindex="-1">
                <div style="display: flex;">
                  <button aria-expanded="false" aria-haspopup="true" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" style="flex: 1 1 0%; height: 30px; text-align: left;" type="button">Name</button>
                  <div class="react-aria-ColumnResizer" data-rac="" data-react-aria-pressable="true" data-resizable-direction="both" role="presentation" style="background-clip: content-box; background-color: rgb(128, 128, 128); border-left: 5px solid transparent; border-right: 5px solid transparent; box-sizing: border-box; cursor: ew-resize; flex-shrink: 0; text-align: center; touch-action: none; width: 15px;">↔<input aria-label="Resizer" aria-orientation="horizontal" max="9007199254740991" min="75" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;" type="range" value="120"></div>
                </div>
              </th>
              <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" style="width: 83px;" tabindex="-1">
                <div style="display: flex;">
                  <button aria-expanded="false" aria-haspopup="true" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" style="flex: 1 1 0%; height: 30px; text-align: left;" type="button">Type</button>
                  <div class="react-aria-ColumnResizer" data-rac="" data-react-aria-pressable="true" data-resizable-direction="both" role="presentation" style="background-clip: content-box; background-color: rgb(128, 128, 128); border-left: 5px solid transparent; border-right: 5px solid transparent; box-sizing: border-box; cursor: ew-resize; flex-shrink: 0; text-align: center; touch-action: none; width: 15px;">↔<input aria-label="Resizer" aria-orientation="horizontal" max="9007199254740991" min="75" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;" type="range" value="83"></div>
                </div>
              </th>
              <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" style="width: 84px;" tabindex="-1">
                <div style="display: flex;">
                  <button aria-expanded="false" aria-haspopup="true" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" style="flex: 1 1 0%; text-align: left;" type="button">Date Modified</button>
                  <div class="react-aria-ColumnResizer" data-rac="" data-react-aria-pressable="true" data-resizable-direction="both" role="presentation" style="background-clip: content-box; background-color: rgb(128, 128, 128); border-left: 5px solid transparent; border-right: 5px solid transparent; box-sizing: border-box; cursor: ew-resize; flex-shrink: 0; height: 30px; text-align: center; touch-action: none; width: 15px;">↔<input aria-label="Resizer" aria-orientation="horizontal" max="9007199254740991" min="75" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;" type="range" value="84"></div>
                </div>
              </th>
              <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" style="width: 83px;" tabindex="-1">
                <div style="display: flex;">
                  <button aria-expanded="false" aria-haspopup="true" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" style="flex: 1 1 0%; height: 30px; text-align: left;" type="button">Actions</button>
                  <div class="react-aria-ColumnResizer" data-rac="" data-react-aria-pressable="true" data-resizable-direction="both" role="presentation" style="background-clip: content-box; background-color: rgb(128, 128, 128); border-left: 5px solid transparent; border-right: 5px solid transparent; box-sizing: border-box; cursor: ew-resize; flex-shrink: 0; text-align: center; touch-action: none; width: 15px;">↔<input aria-label="Resizer" aria-orientation="horizontal" max="9007199254740991" min="75" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;" type="range" value="83"></div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
            <tr v-for="row in fileRows" :key="row.id" class="react-aria-Row" data-rac="" role="row" tabindex="-1">
              <td class="react-aria-Cell" data-rac="" role="gridcell">
                <label class="react-aria-Checkbox" data-disabled="true" data-rac="" data-react-aria-pressable="true" slot="selection">
                  <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                    <input aria-label="Select" data-react-aria-pressable="true" disabled type="checkbox">
                  </span>
                  <div class="checkbox">
                    <svg aria-hidden="true" viewBox="0 0 18 18">
                      <polyline points="1 9 7 14 15 4"></polyline>
                    </svg>
                  </div>
                </label>
              </td>
              <td class="react-aria-Cell" data-rac="" role="rowheader" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ row.name }}</td>
              <td class="react-aria-Cell" data-rac="" role="gridcell" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ row.type }}</td>
              <td class="react-aria-Cell" data-rac="" role="gridcell" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ row.date }}</td>
              <td class="react-aria-Cell" data-rac="" role="gridcell">
                <button aria-expanded="false" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" type="button">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  }),
  args: {
    selectionMode: 'none',
    selectionBehavior: 'toggle',
    escapeKeyBehavior: 'clearSelection'
  },
  argTypes: {
    selectionMode: {
      control: 'radio',
      options: ['none', 'single', 'multiple']
    },
    selectionBehavior: {
      control: 'radio',
      options: ['toggle', 'replace']
    },
    escapeKeyBehavior: {
      control: 'radio',
      options: ['clearSelection', 'none']
    }
  }
};

export const TableDynamicExample: TableStory = () => ({
  template: `
    <table aria-label="Files" class="react-aria-Table" data-rac="" role="grid" style="border-collapse: collapse;" tabindex="0">
      <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
        <tr role="row">
          <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Name</th>
          <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Type</th>
          <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Date Modified</th>
        </tr>
      </thead>
      <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td class="react-aria-Cell" data-rac="" role="rowheader">Games</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">File folder</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">6/7/2020</td>
        </tr>
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td class="react-aria-Cell" data-rac="" role="rowheader">Program Files</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">File folder</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">4/7/2021</td>
        </tr>
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td class="react-aria-Cell" data-rac="" role="rowheader">bootmgr</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">System file</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">11/20/2010</td>
        </tr>
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td class="react-aria-Cell" data-rac="" role="rowheader">log.txt</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Text Document</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">1/18/20167</td>
        </tr>
      </tbody>
    </table>
  `
});

export const TableCellColSpanExample: TableStory = () => ({
  template: `
    <table aria-label="Timetable" class="react-aria-Table" data-rac="" role="grid" style="border-collapse: collapse;" tabindex="0">
      <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
        <tr role="row">
          <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Time</th>
          <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Monday</th>
          <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Tuesday</th>
          <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Wednesday</th>
          <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Thursday</th>
          <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Friday</th>
        </tr>
      </thead>
      <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td class="react-aria-Cell" data-rac="" role="rowheader">08:00 - 09:00</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Math</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">History</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Science</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">English</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Art</td>
        </tr>
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td class="react-aria-Cell" data-rac="" role="rowheader">09:00 - 10:00</td>
          <td aria-colspan="5" class="react-aria-Cell" colspan="5" data-rac="" role="gridcell">Break</td>
        </tr>
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td class="react-aria-Cell" data-rac="" role="rowheader">10:00 - 11:00</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Math</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">History</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Science</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">English</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Art</td>
        </tr>
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td class="react-aria-Cell" data-rac="" role="rowheader">11:00 - 12:00</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Math</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">History</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Science</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">English</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Art</td>
        </tr>
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td class="react-aria-Cell" data-rac="" role="rowheader">12:00 - 13:00</td>
          <td aria-colspan="5" class="react-aria-Cell" colspan="5" data-rac="" role="gridcell">Break</td>
        </tr>
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td class="react-aria-Cell" data-rac="" role="rowheader">13:00 - 14:00</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">History</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Math</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">English</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Science</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Art</td>
        </tr>
      </tbody>
    </table>
  `
});

export const TableCellColSpanWithVariousSpansExample: TableStory = () => ({
  template: `
    <table aria-label="Table with various colspans" class="react-aria-Table" data-rac="" role="grid" style="border-collapse: collapse;" tabindex="0">
      <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
        <tr role="row">
          <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Col 1</th>
          <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Col 2</th>
          <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Col 3</th>
          <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Col 4</th>
        </tr>
      </thead>
      <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td class="react-aria-Cell" data-rac="" role="rowheader">Cell</td>
          <td aria-colspan="2" class="react-aria-Cell" colspan="2" data-rac="" role="gridcell">Span 2</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Cell</td>
        </tr>
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td class="react-aria-Cell" data-rac="" role="rowheader">Cell</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Cell</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Cell</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Cell</td>
        </tr>
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td aria-colspan="4" class="react-aria-Cell" colspan="4" data-rac="" role="rowheader">Span 4</td>
        </tr>
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td class="react-aria-Cell" data-rac="" role="rowheader">Cell</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Cell</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Cell</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Cell</td>
        </tr>
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td aria-colspan="3" class="react-aria-Cell" colspan="3" data-rac="" role="rowheader">Span 3</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Cell</td>
        </tr>
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td class="react-aria-Cell" data-rac="" role="rowheader">Cell</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Cell</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Cell</td>
          <td class="react-aria-Cell" data-rac="" role="gridcell">Cell</td>
        </tr>
        <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
          <td class="react-aria-Cell" data-rac="" role="rowheader">Cell</td>
          <td aria-colspan="3" class="react-aria-Cell" colspan="3" data-rac="" role="gridcell">Span 3</td>
        </tr>
      </tbody>
    </table>
  `
});

interface DndTableExampleArgs {
  isDisabledFirstTable?: boolean,
  isDisabledSecondTable?: boolean,
  isLoading?: boolean
}

const dndTableRowsOne = [
  {id: '1', type: 'file', name: 'Adobe Photoshop'},
  {id: '2', type: 'file', name: 'Adobe XD'},
  {id: '3', type: 'folder', name: 'Documents'},
  {id: '4', type: 'file', name: 'Adobe InDesign'},
  {id: '5', type: 'folder', name: 'Utilities'},
  {id: '6', type: 'file', name: 'Adobe AfterEffects'}
];

const dndTableRowsTwo = [
  {id: '7', type: 'folder', name: 'Pictures'},
  {id: '8', type: 'file', name: 'Adobe Fresco'},
  {id: '9', type: 'folder', name: 'Apps'},
  {id: '10', type: 'file', name: 'Adobe Illustrator'},
  {id: '11', type: 'file', name: 'Adobe Lightroom'},
  {id: '12', type: 'file', name: 'Adobe Dreamweaver'}
];

export const DndTableExample: TableStory = (args: DndTableExampleArgs) => ({
  setup() {
    return {
      args,
      dndTableRowsOne,
      dndTableRowsTwo
    };
  },
  template: `
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <table aria-label="First Table" aria-multiselectable="true" class="react-aria-Table" data-allows-dragging="true" data-rac="" role="grid" style="border-collapse: collapse;" tabindex="0">
        <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
          <tr role="row">
            <th class="react-aria-Column" data-rac="" role="columnheader"></th>
            <th class="react-aria-Column" data-rac="" role="columnheader">
              <label class="react-aria-Checkbox" data-rac="" slot="selection">
                <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                  <input type="checkbox">
                </span>
                <div class="checkbox">
                  <svg aria-hidden="true" viewBox="0 0 18 18">
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </div>
              </label>
            </th>
            <th class="react-aria-Column" data-rac="" role="columnheader">ID</th>
            <th class="react-aria-Column" data-rac="" role="columnheader">Name</th>
            <th class="react-aria-Column" data-rac="" role="columnheader">Type</th>
          </tr>
        </thead>
        <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
          <tr v-for="row in dndTableRowsOne" :key="row.id" aria-selected="false" class="react-aria-Row" data-rac="" data-selection-mode="multiple" role="row">
            <td class="react-aria-Cell" data-rac="" role="gridcell"><button class="react-aria-Button" data-rac="" style="pointer-events: none;" type="button">≡</button></td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">
              <label class="react-aria-Checkbox" data-rac="" slot="selection">
                <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                  <input type="checkbox">
                </span>
                <div class="checkbox">
                  <svg aria-hidden="true" viewBox="0 0 18 18">
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </div>
              </label>
            </td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">{{ row.id }}</td>
            <td class="react-aria-Cell" data-rac="" role="rowheader">{{ row.name }}</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">{{ row.type }}</td>
          </tr>
          <tr inert="" style="height: 0px;">
            <td style="padding: 0px; border: 0px;">
              <div data-testid="loadMoreSentinel" style="position: relative; height: 1px; width: 1px;"></div>
            </td>
          </tr>
        </tbody>
      </table>
      <table aria-label="Second Table" aria-multiselectable="true" class="react-aria-Table" data-allows-dragging="true" data-rac="" role="grid" style="border-collapse: collapse;" tabindex="0">
        <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
          <tr role="row">
            <th class="react-aria-Column" data-rac="" role="columnheader"></th>
            <th class="react-aria-Column" data-rac="" role="columnheader">
              <label class="react-aria-Checkbox" data-rac="" slot="selection">
                <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                  <input type="checkbox">
                </span>
                <div class="checkbox">
                  <svg aria-hidden="true" viewBox="0 0 18 18">
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </div>
              </label>
            </th>
            <th class="react-aria-Column" data-rac="" role="columnheader">ID</th>
            <th class="react-aria-Column" data-rac="" role="columnheader">Name</th>
            <th class="react-aria-Column" data-rac="" role="columnheader">Type</th>
          </tr>
        </thead>
        <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
          <tr v-for="row in dndTableRowsTwo" :key="row.id" aria-selected="false" class="react-aria-Row" data-rac="" data-selection-mode="multiple" role="row">
            <td class="react-aria-Cell" data-rac="" role="gridcell"><button class="react-aria-Button" data-rac="" style="pointer-events: none;" type="button">≡</button></td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">
              <label class="react-aria-Checkbox" data-rac="" slot="selection">
                <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                  <input type="checkbox">
                </span>
                <div class="checkbox">
                  <svg aria-hidden="true" viewBox="0 0 18 18">
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </div>
              </label>
            </td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">{{ row.id }}</td>
            <td class="react-aria-Cell" data-rac="" role="rowheader">{{ row.name }}</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">{{ row.type }}</td>
          </tr>
          <tr inert="" style="height: 0px;">
            <td style="padding: 0px; border: 0px;">
              <div data-testid="loadMoreSentinel" style="position: relative; height: 1px; width: 1px;"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
});

DndTableExample.args = {
  isDisabledFirstTable: false,
  isDisabledSecondTable: false,
  isLoading: false
};

export const DndTableWithNoValidDropTargets: Story = {
  render: () => ({
    setup() {
      return {dndTableRowsOne};
    },
    template: `
      <table aria-label="Table (rejects all item drops)" aria-multiselectable="true" class="react-aria-Table" data-allows-dragging="true" data-rac="" role="grid" style="border-collapse: collapse;" tabindex="0">
        <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
          <tr role="row">
            <th class="react-aria-Column" data-rac="" role="columnheader"></th>
            <th class="react-aria-Column" data-rac="" role="columnheader">
              <label class="react-aria-Checkbox" data-rac="" slot="selection">
                <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                  <input type="checkbox">
                </span>
                <div class="checkbox">
                  <svg aria-hidden="true" viewBox="0 0 18 18">
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </div>
              </label>
            </th>
            <th class="react-aria-Column" data-rac="" role="columnheader">ID</th>
            <th class="react-aria-Column" data-rac="" role="columnheader">Name</th>
            <th class="react-aria-Column" data-rac="" role="columnheader">Type</th>
          </tr>
        </thead>
        <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
          <tr v-for="row in dndTableRowsOne" :key="row.id" aria-selected="false" class="react-aria-Row" data-rac="" data-selection-mode="multiple" role="row">
            <td class="react-aria-Cell" data-rac="" role="gridcell"><button class="react-aria-Button" data-rac="" style="pointer-events: none;" type="button">≡</button></td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">
              <label class="react-aria-Checkbox" data-rac="" slot="selection">
                <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                  <input type="checkbox">
                </span>
                <div class="checkbox">
                  <svg aria-hidden="true" viewBox="0 0 18 18">
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </div>
              </label>
            </td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">{{ row.id }}</td>
            <td class="react-aria-Cell" data-rac="" role="rowheader">{{ row.name }}</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">{{ row.type }}</td>
          </tr>
        </tbody>
      </table>
    `
  }),
  name: 'Dnd Table with no valid drop targets',
  parameters: {
    description: {
      data: 'Keyboard-drag parity fixture where all drop targets are rejected.'
    }
  }
};

export const TableLoadingBodyWrapperStory: Story = {
  render: () => ({
    template: `
      <table aria-label="Files" class="react-aria-Table" data-rac="" role="grid" style="border-collapse: collapse;" tabindex="0">
        <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
          <tr role="row">
            <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Name</th>
            <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Type</th>
            <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Date Modified</th>
          </tr>
        </thead>
        <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
          <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
            <td class="react-aria-Cell" data-rac="" role="rowheader">Games</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">File folder</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">6/7/2020</td>
          </tr>
          <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
            <td class="react-aria-Cell" data-rac="" role="rowheader">Program Files</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">File folder</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">4/7/2021</td>
          </tr>
          <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
            <td class="react-aria-Cell" data-rac="" role="rowheader">bootmgr</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">System file</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">11/20/2010</td>
          </tr>
          <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
            <td class="react-aria-Cell" data-rac="" role="rowheader">log.txt</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">Text Document</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">1/18/20167</td>
          </tr>
          <tr inert="" style="height: 0px;">
            <td style="border: 0px; padding: 0px;">
              <div data-testid="loadMoreSentinel" style="height: 1px; position: relative; width: 1px;"></div>
            </td>
          </tr>
        </tbody>
      </table>
    `
  }),
  args: {
    isLoadingMore: false
  },
  name: 'Table loading, table body wrapper with collection'
};

export const TableLoadingRowRenderWrapperStory: Story = {
  render: () => ({
    template: `
      <table aria-label="Files" class="react-aria-Table" data-rac="" role="grid" style="border-collapse: collapse;" tabindex="0">
        <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
          <tr role="row">
            <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Name</th>
            <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Type</th>
            <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Date Modified</th>
          </tr>
        </thead>
        <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
          <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
            <td class="react-aria-Cell" data-rac="" role="rowheader">Games</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">File folder</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">6/7/2020</td>
          </tr>
          <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
            <td class="react-aria-Cell" data-rac="" role="rowheader">Program Files</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">File folder</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">4/7/2021</td>
          </tr>
          <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
            <td class="react-aria-Cell" data-rac="" role="rowheader">bootmgr</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">System file</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">11/20/2010</td>
          </tr>
          <tr class="react-aria-Row" data-rac="" role="row" tabindex="-1">
            <td class="react-aria-Cell" data-rac="" role="rowheader">log.txt</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">Text Document</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell">1/18/20167</td>
          </tr>
        </tbody>
      </table>
    `
  }),
  args: {
    isLoadingMore: false
  },
  name: 'Table loading, row renderer wrapper and dep array'
};

export const RenderEmptyStateStory: Story = {
  render: () => ({
    template: `
      <table aria-label="Files" aria-multiselectable="true" class="react-aria-Table" data-rac="" role="grid" style="border-collapse: collapse;" tabindex="0">
        <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
          <tr role="row">
            <th class="react-aria-Column" data-rac="" role="columnheader" tabindex="-1">
              <label class="react-aria-Checkbox" data-disabled="true" data-rac="" slot="selection">
                <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                  <input aria-label="Select All" disabled type="checkbox">
                </span>
                <div class="checkbox">
                  <svg aria-hidden="true" viewBox="0 0 18 18">
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </div>
              </label>
            </th>
            <th class="react-aria-Column" data-rac="" role="columnheader" tabindex="-1">Name</th>
            <th class="react-aria-Column" data-rac="" role="columnheader" tabindex="-1">Type</th>
            <th class="react-aria-Column" data-rac="" role="columnheader" tabindex="-1">Date Modified</th>
          </tr>
        </thead>
        <tbody class="react-aria-TableBody" data-empty="true" data-rac="" role="rowgroup">
          <tr role="row">
            <td colspan="4" role="rowheader">
              <div style="height: 30px; left: 0px; position: sticky; top: 0px; width: 400px;">No results found</div>
            </td>
          </tr>
        </tbody>
      </table>
    `
  }),
  args: {
    isLoading: false
  },
  name: 'Empty/Loading Table rendered with TableLoadingIndicator collection element'
};

interface LoadMoreArgs {
  delay?: number
}

function createLoadMoreTableStory(_args: LoadMoreArgs = {}, options: {resizeWrapper?: boolean, virtualized?: boolean} = {}) {
  let rows = [
    {name: 'Luke Skywalker'},
    {name: 'C-3PO'},
    {name: 'R2-D2'},
    {name: 'Darth Vader'},
    {name: 'Leia Organa'},
    {name: 'Owen Lars'}
  ];
  let virtualizedRows = [
    {birthYear: '19BBY', height: '172', mass: '77', name: 'Luke Skywalker'},
    {birthYear: '112BBY', height: '167', mass: '75', name: 'C-3PO'},
    {birthYear: '33BBY', height: '96', mass: '32', name: 'R2-D2'},
    {birthYear: '41.9BBY', height: '202', mass: '136', name: 'Darth Vader'},
    {birthYear: '19BBY', height: '150', mass: '49', name: 'Leia Organa'},
    {birthYear: '52BBY', height: '178', mass: '120', name: 'Owen Lars'},
    {birthYear: '47BBY', height: '165', mass: '75', name: 'Beru Whitesun lars'},
    {birthYear: 'unknown', height: '97', mass: '32', name: 'R5-D4'}
  ];

  return {
    setup() {
      return {
        options,
        rows,
        virtualizedRows
      };
    },
    template: `
      <div style="height: 150px; width: 400px; overflow: auto;">
        <div
          v-if="options.virtualized"
          :class="options.resizeWrapper ? 'react-aria-ResizableTableContainer' : ''"
          :style="options.resizeWrapper ? 'height: 150px; width: 400px; overflow: auto;' : ''">
          <div
            aria-colcount="4"
            aria-label="Load more table virtualized"
            aria-rowcount="21"
            class="react-aria-Table"
            data-rac=""
            role="grid"
            tabindex="0"
            :style="options.resizeWrapper ? '' : 'height: 150px; width: 400px; overflow: auto;'">
            <div role="presentation" style="height: 525px; pointer-events: auto; position: relative; width: 400px;">
              <div role="presentation" style="contain: size layout style; display: inline-block; height: 25px; left: 0px; opacity: 1; overflow: hidden; position: sticky; top: 0px; width: 400px; z-index: 1;">
                <div class="react-aria-TableHeader" data-rac="" role="rowgroup" style="background: var(--spectrum-gray-100); height: 100%; width: 100%;">
                  <div aria-rowindex="1" role="row">
                    <div role="presentation" style="contain: size layout style; height: 25px; left: 0px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 100px; z-index: 5;">
                      <div aria-colindex="1" class="react-aria-Column" data-rac="" role="columnheader" style="width: 100px;" tabindex="-1">Name</div>
                    </div>
                    <div role="presentation" style="contain: size layout style; height: 25px; left: 100px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 100px; z-index: 4;">
                      <div aria-colindex="2" class="react-aria-Column" data-rac="" role="columnheader" style="width: 100px;" tabindex="-1">Height</div>
                    </div>
                    <div role="presentation" style="contain: size layout style; height: 25px; left: 200px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 100px; z-index: 3;">
                      <div aria-colindex="3" class="react-aria-Column" data-rac="" role="columnheader" style="width: 100px;" tabindex="-1">Mass</div>
                    </div>
                    <div role="presentation" style="contain: size layout style; height: 25px; left: 300px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 100px; z-index: 2;">
                      <div aria-colindex="4" class="react-aria-Column" data-rac="" role="columnheader" style="width: 100px;" tabindex="-1">Birth Year</div>
                    </div>
                  </div>
                </div>
              </div>
              <div role="presentation" style="contain: size layout style; height: 500px; left: 0px; opacity: 1; overflow: hidden; position: absolute; top: 25px; width: 400px; z-index: 0;">
                <div class="react-aria-TableBody" data-rac="" role="rowgroup">
                  <div
                    v-for="(row, rowIndex) in virtualizedRows"
                    :key="row.name"
                    role="presentation"
                    :style="'contain: size layout style; height: 25px; left: 0px; opacity: 1; overflow: visible; position: absolute; top: ' + (rowIndex * 25) + 'px; width: 400px; z-index: 0;'">
                    <div :aria-rowindex="rowIndex + 2" class="react-aria-Row" data-rac="" role="row" style="height: inherit; width: inherit;" tabindex="-1">
                      <div role="presentation" style="contain: size layout style; height: 25px; left: 0px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 100px; z-index: 1;">
                        <div aria-colindex="1" class="react-aria-Cell" data-rac="" role="rowheader" style="width: 100px;" tabindex="-1">{{ row.name }}</div>
                      </div>
                      <div role="presentation" style="contain: size layout style; height: 25px; left: 100px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 100px; z-index: 1;">
                        <div aria-colindex="2" class="react-aria-Cell" data-rac="" role="gridcell" style="width: 100px;" tabindex="-1"></div>
                      </div>
                      <div role="presentation" style="contain: size layout style; height: 25px; left: 200px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 100px; z-index: 1;">
                        <div aria-colindex="3" class="react-aria-Cell" data-rac="" role="gridcell" style="width: 100px;" tabindex="-1"></div>
                      </div>
                      <div role="presentation" style="contain: size layout style; height: 25px; left: 300px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 100px; z-index: 1;">
                        <div aria-colindex="4" class="react-aria-Cell" data-rac="" role="gridcell" style="width: 100px;" tabindex="-1"></div>
                      </div>
                    </div>
                  </div>
                  <div role="presentation" style="contain: size layout style; height: 0px; left: 0px; opacity: 1; overflow: visible; position: absolute; top: 500px; width: 400px; z-index: 0;">
                    <div inert="" style="height: 0px;">
                      <div style="border: 0px; padding: 0px;">
                        <div data-testid="loadMoreSentinel" style="height: 1px; position: relative; width: 1px;"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <table
          v-else
          aria-label="Load more table"
          class="react-aria-Table"
          data-rac=""
          role="grid"
          style="border-collapse: collapse; table-layout: fixed; width: fit-content;">
          <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
            <tr role="row">
              <th class="react-aria-Column" data-rac="" role="columnheader" style="background-color: lightgray; position: sticky; top: 0px; width: 100px;">Name</th>
              <th class="react-aria-Column" data-rac="" role="columnheader" style="background-color: lightgray; position: sticky; top: 0px; width: 100px;">Height</th>
              <th class="react-aria-Column" data-rac="" role="columnheader" style="background-color: lightgray; position: sticky; top: 0px; width: 100px;">Mass</th>
              <th class="react-aria-Column" data-rac="" role="columnheader" style="background-color: lightgray; position: sticky; top: 0px; width: 100px;">Birth Year</th>
            </tr>
          </thead>
          <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
            <tr v-for="row in rows" :key="row.name" class="react-aria-Row" data-rac="" role="row" style="height: inherit; width: inherit;">
              <td class="react-aria-Cell" data-rac="" role="rowheader">{{ row.name }}</td>
              <td class="react-aria-Cell" data-rac="" role="gridcell"></td>
              <td class="react-aria-Cell" data-rac="" role="gridcell"></td>
              <td class="react-aria-Cell" data-rac="" role="gridcell"></td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  };
}

export const OnLoadMoreTableStory: Story = {
  render: (args: LoadMoreArgs) => createLoadMoreTableStory(args),
  name: 'onLoadMore table',
  args: {
    delay: 50
  }
};

export const VirtualizedTable: TableStory = () => ({
  setup() {
    return {rows: virtualizedTableRows};
  },
  template: `
    <div
      aria-colcount="5"
      aria-label="virtualized table"
      aria-multiselectable="true"
      aria-rowcount="1001"
      class="react-aria-Table"
      data-allows-dragging="true"
      data-rac=""
      role="grid"
      tabindex="0"
      style="height: 400px; width: 400px; overflow: auto; scroll-padding-top: 25px;">
      <div role="presentation" style="height: 25025px; pointer-events: auto; position: relative; width: 400px;">
        <div role="presentation" style="contain: size layout style; display: inline-block; height: 25px; left: 0px; opacity: 1; overflow: hidden; position: sticky; top: 0px; width: 400px; z-index: 1;">
          <div class="react-aria-TableHeader" data-rac="" role="rowgroup" style="background: var(--spectrum-gray-100); height: 100%; width: 100%;">
            <div aria-rowindex="1" role="row">
              <div role="presentation" style="contain: size layout style; height: 25px; left: 0px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 30px; z-index: 6;">
                <div aria-colindex="1" class="react-aria-Column" data-rac="" role="columnheader" style="width: 30px;" tabindex="-1"></div>
              </div>
              <div role="presentation" style="contain: size layout style; height: 25px; left: 30px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 30px; z-index: 5;">
                <div aria-colindex="2" class="react-aria-Column" data-rac="" role="columnheader" style="width: 30px;" tabindex="-1">
                  <label class="react-aria-Checkbox" data-rac="" data-react-aria-pressable="true" slot="selection">
                    <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                      <input aria-label="Select All" data-react-aria-pressable="true" tabindex="0" title="" type="checkbox">
                    </span>
                    <div class="checkbox">
                      <svg aria-hidden="true" viewBox="0 0 18 18">
                        <polyline points="1 9 7 14 15 4"></polyline>
                      </svg>
                    </div>
                  </label>
                </div>
              </div>
              <div role="presentation" style="contain: size layout style; height: 25px; left: 60px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 113px; z-index: 4;">
                <div aria-colindex="3" class="react-aria-Column" data-rac="" role="columnheader" style="width: 113px;" tabindex="-1">
                  <strong>Foo</strong>
                </div>
              </div>
              <div role="presentation" style="contain: size layout style; height: 25px; left: 173px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 114px; z-index: 3;">
                <div aria-colindex="4" class="react-aria-Column" data-rac="" role="columnheader" style="width: 114px;" tabindex="-1">
                  <strong>Bar</strong>
                </div>
              </div>
              <div role="presentation" style="contain: size layout style; height: 25px; left: 287px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 113px; z-index: 2;">
                <div aria-colindex="5" class="react-aria-Column" data-rac="" role="columnheader" style="width: 113px;" tabindex="-1">
                  <strong>Baz</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div role="presentation" style="contain: size layout style; height: 25000px; left: 0px; opacity: 1; overflow: hidden; position: absolute; top: 25px; width: 400px; z-index: 0;">
          <div class="react-aria-TableBody" data-rac="" role="rowgroup">
            <div
              v-for="(row, rowIndex) in rows"
              :key="row.id"
              role="presentation"
              :style="'contain: size layout style; height: 25px; left: 0px; opacity: 1; overflow: visible; position: absolute; top: ' + (rowIndex * 25) + 'px; width: 400px; z-index: 0;'">
              <div
                :aria-rowindex="rowIndex + 2"
                aria-selected="false"
                class="react-aria-Row"
                data-rac=""
                data-selection-mode="multiple"
                draggable="true"
                role="row"
                style="height: inherit; width: inherit;"
                tabindex="-1">
                <div role="presentation" style="contain: size layout style; height: 25px; left: 0px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 30px; z-index: 1;">
                  <div aria-colindex="1" class="react-aria-Cell" data-rac="" role="gridcell" style="width: 30px;" tabindex="-1">
                    <button :aria-label="'Drag ' + row.foo" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" slot="drag" style="pointer-events: none;" tabindex="0" type="button">≡</button>
                  </div>
                </div>
                <div role="presentation" style="contain: size layout style; height: 25px; left: 30px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 30px; z-index: 1;">
                  <div aria-colindex="2" class="react-aria-Cell" data-rac="" role="gridcell" style="width: 30px;" tabindex="-1">
                    <label class="react-aria-Checkbox" data-rac="" data-react-aria-pressable="true" slot="selection">
                      <span style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;">
                        <input aria-label="Select" data-react-aria-pressable="true" tabindex="0" title="" type="checkbox">
                      </span>
                      <div class="checkbox">
                        <svg aria-hidden="true" viewBox="0 0 18 18">
                          <polyline points="1 9 7 14 15 4"></polyline>
                        </svg>
                      </div>
                    </label>
                  </div>
                </div>
                <div role="presentation" style="contain: size layout style; height: 25px; left: 60px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 113px; z-index: 1;">
                  <div aria-colindex="3" class="react-aria-Cell" data-rac="" role="rowheader" style="width: 113px;" tabindex="-1">{{ row.foo }}</div>
                </div>
                <div role="presentation" style="contain: size layout style; height: 25px; left: 173px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 114px; z-index: 1;">
                  <div aria-colindex="4" class="react-aria-Cell" data-rac="" role="gridcell" style="width: 114px;" tabindex="-1">{{ row.bar }}</div>
                </div>
                <div role="presentation" style="contain: size layout style; height: 25px; left: 287px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 113px; z-index: 1;">
                  <div aria-colindex="5" class="react-aria-Cell" data-rac="" role="gridcell" style="width: 113px;" tabindex="-1">{{ row.baz }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
});

export const VirtualizedTableWithResizing: TableStory = () => ({
  setup() {
    return {rows: virtualizedTableRows};
  },
  template: `
    <div class="react-aria-ResizableTableContainer" style="height: 400px; width: 400px; overflow: auto; scroll-padding-top: 25px;">
      <div
        aria-colcount="3"
        aria-label="virtualized table"
        aria-rowcount="1001"
        class="react-aria-Table"
        data-rac=""
        role="grid"
        tabindex="0">
        <div role="presentation" style="height: 25025px; pointer-events: auto; position: relative; width: 400px;">
          <div role="presentation" style="contain: size layout style; display: inline-block; height: 25px; left: 0px; opacity: 1; overflow: hidden; position: sticky; top: 0px; width: 400px; z-index: 1;">
            <div class="react-aria-TableHeader" data-rac="" role="rowgroup" style="background: var(--spectrum-gray-100); height: 100%; width: 100%;">
              <div aria-rowindex="1" role="row">
                <div role="presentation" style="contain: size layout style; height: 25px; left: 0px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 133px; z-index: 4;">
                  <div aria-colindex="1" class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" style="width: 133px;" tabindex="-1">
                    <div style="display: flex;">
                      <button aria-expanded="false" aria-haspopup="true" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" style="flex: 1 1 0%; height: 30px; text-align: left;" tabindex="0" type="button">Foo</button>
                      <div class="react-aria-ColumnResizer" data-rac="" data-react-aria-pressable="true" data-resizable-direction="both" role="presentation" style="background-clip: content-box; background-color: rgb(128, 128, 128); border-bottom: 0px solid transparent; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 0px solid transparent; box-sizing: border-box; cursor: ew-resize; flex-shrink: 0; text-align: center; touch-action: none; width: 15px;">↔<input aria-label="Resizer" aria-orientation="horizontal" max="9007199254740991" min="75" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;" type="range" value="133"></div>
                    </div>
                  </div>
                </div>
                <div role="presentation" style="contain: size layout style; height: 25px; left: 133px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 134px; z-index: 3;">
                  <div aria-colindex="2" class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" style="width: 134px;" tabindex="-1">
                    <div style="display: flex;">
                      <button aria-expanded="false" aria-haspopup="true" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" style="flex: 1 1 0%; height: 30px; text-align: left;" tabindex="0" type="button">Bar</button>
                      <div class="react-aria-ColumnResizer" data-rac="" data-react-aria-pressable="true" data-resizable-direction="both" role="presentation" style="background-clip: content-box; background-color: rgb(128, 128, 128); border-bottom: 0px solid transparent; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 0px solid transparent; box-sizing: border-box; cursor: ew-resize; flex-shrink: 0; text-align: center; touch-action: none; width: 15px;">↔<input aria-label="Resizer" aria-orientation="horizontal" max="9007199254740991" min="75" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;" type="range" value="134"></div>
                    </div>
                  </div>
                </div>
                <div role="presentation" style="contain: size layout style; height: 25px; left: 267px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 133px; z-index: 2;">
                  <div aria-colindex="3" class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" style="width: 133px;" tabindex="-1">
                    <div style="display: flex;">
                      <button aria-expanded="false" aria-haspopup="true" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" style="flex: 1 1 0%; height: 30px; text-align: left;" tabindex="0" type="button">Baz</button>
                      <div class="react-aria-ColumnResizer" data-rac="" data-react-aria-pressable="true" data-resizable-direction="both" role="presentation" style="background-clip: content-box; background-color: rgb(128, 128, 128); border-bottom: 0px solid transparent; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 0px solid transparent; box-sizing: border-box; cursor: ew-resize; flex-shrink: 0; text-align: center; touch-action: none; width: 15px;">↔<input aria-label="Resizer" aria-orientation="horizontal" max="9007199254740991" min="75" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;" type="range" value="133"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div role="presentation" style="contain: size layout style; height: 25000px; left: 0px; opacity: 1; overflow: hidden; position: absolute; top: 25px; width: 400px; z-index: 0;">
            <div class="react-aria-TableBody" data-rac="" role="rowgroup">
              <div
                v-for="(row, rowIndex) in rows"
                :key="row.id"
                role="presentation"
                :style="'contain: size layout style; height: 25px; left: 0px; opacity: 1; overflow: visible; position: absolute; top: ' + (rowIndex * 25) + 'px; width: 400px; z-index: 0;'">
                <div
                  :aria-rowindex="rowIndex + 2"
                  class="react-aria-Row"
                  data-rac=""
                  role="row"
                  style="height: inherit; width: inherit;"
                  tabindex="-1">
                  <div role="presentation" style="contain: size layout style; height: 25px; left: 0px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 133px; z-index: 1;">
                    <div aria-colindex="1" class="react-aria-Cell" data-rac="" role="rowheader" style="width: 133px;" tabindex="-1">{{ row.foo }}</div>
                  </div>
                  <div role="presentation" style="contain: size layout style; height: 25px; left: 133px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 134px; z-index: 1;">
                    <div aria-colindex="2" class="react-aria-Cell" data-rac="" role="gridcell" style="width: 134px;" tabindex="-1">{{ row.bar }}</div>
                  </div>
                  <div role="presentation" style="contain: size layout style; height: 25px; left: 267px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 133px; z-index: 1;">
                    <div aria-colindex="3" class="react-aria-Cell" data-rac="" role="gridcell" style="width: 133px;" tabindex="-1">{{ row.baz }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
});

export const VirtualizedTableWithEmptyStateStory: Story = {
  render: () => ({
    template: `
      <div class="react-aria-ResizableTableContainer" style="height: 400px; width: 400px; overflow: auto; scroll-padding-top: 25px;">
        <div
          aria-colcount="3"
          aria-label="virtualized table"
          aria-rowcount="1"
          class="react-aria-Table"
          data-rac=""
          role="grid"
          tabindex="-1">
          <div role="presentation" style="height: 400px; pointer-events: auto; position: relative; width: 400px;">
            <div role="presentation" style="contain: size layout style; display: inline-block; height: 25px; left: 0px; opacity: 1; overflow: hidden; position: sticky; top: 0px; width: 400px; z-index: 1;">
              <div class="react-aria-TableHeader" data-rac="" role="rowgroup" style="background: var(--spectrum-gray-100); height: 100%; width: 100%;">
                <div aria-rowindex="1" role="row">
                  <div role="presentation" style="contain: size layout style; height: 25px; left: 0px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 133px; z-index: 4;">
                    <div aria-colindex="1" class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" style="width: 133px;" tabindex="-1">
                      <div style="display: flex;">
                        <button aria-expanded="false" aria-haspopup="true" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" style="flex: 1 1 0%; height: 30px; text-align: left;" tabindex="0" type="button">Foo</button>
                        <div class="react-aria-ColumnResizer" data-rac="" data-react-aria-pressable="true" data-resizable-direction="both" role="presentation" style="background-clip: content-box; background-color: rgb(128, 128, 128); border-bottom: 0px solid transparent; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 0px solid transparent; box-sizing: border-box; cursor: ew-resize; flex-shrink: 0; text-align: center; touch-action: none; width: 15px;">↔<input aria-label="Resizer" aria-orientation="horizontal" max="9007199254740991" min="75" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;" type="range" value="133"></div>
                      </div>
                    </div>
                  </div>
                  <div role="presentation" style="contain: size layout style; height: 25px; left: 133px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 134px; z-index: 3;">
                    <div aria-colindex="2" class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" style="width: 134px;" tabindex="-1">
                      <div style="display: flex;">
                        <button aria-expanded="false" aria-haspopup="true" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" style="flex: 1 1 0%; height: 30px; text-align: left;" tabindex="0" type="button">Bar</button>
                        <div class="react-aria-ColumnResizer" data-rac="" data-react-aria-pressable="true" data-resizable-direction="both" role="presentation" style="background-clip: content-box; background-color: rgb(128, 128, 128); border-bottom: 0px solid transparent; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 0px solid transparent; box-sizing: border-box; cursor: ew-resize; flex-shrink: 0; text-align: center; touch-action: none; width: 15px;">↔<input aria-label="Resizer" aria-orientation="horizontal" max="9007199254740991" min="75" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;" type="range" value="134"></div>
                      </div>
                    </div>
                  </div>
                  <div role="presentation" style="contain: size layout style; height: 25px; left: 267px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 133px; z-index: 2;">
                    <div aria-colindex="3" class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" style="width: 133px;" tabindex="-1">
                      <div style="display: flex;">
                        <button aria-expanded="false" aria-haspopup="true" class="react-aria-Button" data-rac="" data-react-aria-pressable="true" style="flex: 1 1 0%; height: 30px; text-align: left;" tabindex="0" type="button">Baz</button>
                        <div class="react-aria-ColumnResizer" data-rac="" data-react-aria-pressable="true" data-resizable-direction="both" role="presentation" style="background-clip: content-box; background-color: rgb(128, 128, 128); border-bottom: 0px solid transparent; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 0px solid transparent; box-sizing: border-box; cursor: ew-resize; flex-shrink: 0; text-align: center; touch-action: none; width: 15px;">↔<input aria-label="Resizer" aria-orientation="horizontal" max="9007199254740991" min="75" style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;" type="range" value="133"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div role="presentation" style="contain: size layout style; height: 375px; left: 0px; opacity: 1; overflow: hidden; position: absolute; top: 25px; width: 400px; z-index: 0;">
              <div class="react-aria-TableBody" data-empty="true" data-rac="" role="rowgroup">
                <div role="presentation" style="contain: size layout style; height: 0px; left: 0px; opacity: 1; overflow: visible; position: absolute; top: 0px; width: 400px; z-index: 0;">
                  <div inert="" style="height: 0px;">
                    <div style="border: 0px; padding: 0px;">
                      <div data-testid="loadMoreSentinel" style="height: 1px; position: relative; width: 1px;"></div>
                    </div>
                  </div>
                </div>
                <div role="row" style="display: contents;">
                  <div aria-colspan="3" role="rowheader" style="display: contents;">
                    <div style="height: 30px; left: 0px; position: sticky; top: 0px; width: 400px;">No results found</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }),
  args: {
    isLoading: false,
    showRows: false
  },
  name: 'Virtualized Table With Empty State'
};

export const OnLoadMoreTableStoryVirtualized: Story = {
  render: (args: LoadMoreArgs) => createLoadMoreTableStory(args, {virtualized: true}),
  name: 'Virtualized Table with async loading',
  args: {
    delay: 50
  }
};

export const OnLoadMoreTableVirtualizedResizeWrapperStory: Story = {
  render: (args: LoadMoreArgs) => createLoadMoreTableStory(args, {resizeWrapper: true, virtualized: true}),
  name: 'Virtualized Table with async loading, with wrapper around Virtualizer',
  args: {
    delay: 50
  },
  parameters: {
    description: {
      data: 'Parity fixture with a resizable wrapper around the virtualized table.'
    }
  }
};

export const TableWithSuspense: Story = {
  render: (args: {reactTransition: boolean}) => ({
    setup() {
      let loading = ref(false);
      let allRows: TableRow[] = [
        {id: 0, mission_name: 'FalconSat', launch_year: 2006},
        {id: 1, mission_name: 'DemoSat', launch_year: 2007}
      ];
      let rows = ref<TableRow[]>(allRows.slice(0, 2));

      let loadNext = () => {
        loading.value = true;
        if (!args.reactTransition) {
          rows.value = [];
        }
        setTimeout(() => {
          rows.value = [
            {id: 0, mission_name: 'Trailblazer', launch_year: 2008},
            {id: 1, mission_name: 'RatSat', launch_year: 2009}
          ];
          rows.value = allRows.concat(rows.value);
          loading.value = false;
        }, 1000);
      };

      return {
        loadNext,
        loading,
        rows
      };
    },
    template: `
      <div>
        <table aria-label="Suspense table" class="react-aria-Table" data-rac="" role="grid" style="border-collapse: collapse;" tabindex="0">
          <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
            <tr role="row">
              <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Name</th>
              <th class="react-aria-Column" data-rac="" data-react-aria-pressable="true" role="columnheader" tabindex="-1">Year</th>
            </tr>
          </thead>
          <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
            <tr v-if="rows.length === 0" class="react-aria-Row" data-rac="" role="row">
              <td class="react-aria-Cell" colspan="2" data-rac="" role="rowheader">Loading...</td>
            </tr>
            <tr v-for="row in rows" :key="row.id" class="react-aria-Row" data-rac="" role="row" tabindex="-1">
              <td class="react-aria-Cell" data-rac="" role="rowheader">{{ row.mission_name }}</td>
              <td class="react-aria-Cell" data-rac="" role="gridcell">{{ row.launch_year }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="loadNext">{{ loading ? 'Loading' : 'Load more' }}</button>
      </div>
    `
  }),
  args: {
    reactTransition: false
  },
  parameters: {
    description: {
      data: 'Expected behavior fixture for loading replacement vs transition-preserved rows.'
    }
  }
};

export const TableWithReactTransition: TableStory = () => ({
  setup() {
    let show = ref(true);
    let rows = ref<TableRow[]>(tableTransitionRows2);

    let toggleRows = () => {
      show.value = !show.value;
      rows.value = show.value ? tableTransitionRows2 : tableTransitionRows1;
    };

    return {
      columns: tableTransitionColumns,
      rows,
      toggleRows
    };
  },
  template: `
    <div>
      <button class="react-aria-Button" data-rac="" data-react-aria-pressable="true" type="button" @click="toggleRows">Toggle data using useState + startTransition</button>
      <table aria-label="test" class="react-aria-Table" data-rac="" role="grid" style="border-collapse: collapse;" tabindex="0">
        <thead class="react-aria-TableHeader" data-rac="" role="rowgroup">
          <tr role="row">
            <th
              v-for="(column, columnIndex) in columns"
              :key="column.key"
              :aria-colindex="columnIndex + 1"
              aria-sort="none"
              class="react-aria-Column"
              data-allows-sorting="true"
              data-rac=""
              data-react-aria-pressable="true"
              role="columnheader"
              tabindex="-1">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="react-aria-TableBody" data-rac="" role="rowgroup">
          <tr
            v-for="row in rows"
            :key="row.id"
            class="react-aria-Row"
            data-rac=""
            role="row"
            tabindex="-1">
            <td class="react-aria-Cell" data-rac="" role="rowheader" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ row.name }}</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ row.type }}</td>
            <td class="react-aria-Cell" data-rac="" role="gridcell" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ row.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
});
