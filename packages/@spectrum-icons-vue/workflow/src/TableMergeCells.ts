import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,2H3A1,1,0,0,0,2,3V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2ZM4,4h8v8H4ZM4,14h8v8H4ZM4,32V24h8v8Zm10,0V24h8v8Zm18,0H24V24h8Z"></path>`;

const TableMergeCells = createWorkflowIcon('VueWorkflowTableMergeCells', svgAttributes, svgInnerHTML);

export default TableMergeCells;
