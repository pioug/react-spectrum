import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,2H3A1,1,0,0,0,2,3V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2ZM4,4h6v8H4ZM4,14h6v8H4ZM4,32V24h6v8Zm10-2V6h8V30Zm18,2H26V24h6Zm0-10H26V14h6Zm0-10H26V4h6Z"></path>`;

const TableSelectColumn = createWorkflowIcon('VueWorkflowTableSelectColumn', svgAttributes, svgInnerHTML);

export default TableSelectColumn;
