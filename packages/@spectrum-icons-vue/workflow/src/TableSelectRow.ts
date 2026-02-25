import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,2H3A1,1,0,0,0,2,3V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2ZM22,4v6H14V4ZM4,4h8v6H4ZM4,32V26h8v6Zm10,0V26h8v6Zm18,0H24V26h8ZM30,22H6V14H30Zm2-12H24V4h8Z"></path>`;

const TableSelectRow = createWorkflowIcon('VueWorkflowTableSelectRow', svgAttributes, svgInnerHTML);

export default TableSelectRow;
