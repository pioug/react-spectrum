import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,2H3A1,1,0,0,0,2,3V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2ZM12,32H4V24h8Zm0-10H4V14h8Zm0-10H4V4h8Zm10,0H14V4h8ZM32,32H24V24h8Zm0-10H24V14h8Zm0-10H24V4h8Z"></path>`;

const TableColumnMerge = createWorkflowIcon('VueWorkflowTableColumnMerge', svgAttributes, svgInnerHTML);

export default TableColumnMerge;
