import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M2,3V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3ZM32,24v8H24V24ZM22,24v8H14V24ZM12,24v8H4V24Zm0-10v8H4V14ZM32,4v8H24V4ZM22,4v8H14V4ZM12,4v8H4V4Z"></path>`;

const TableRowMerge = createWorkflowIcon('VueWorkflowTableRowMerge', svgAttributes, svgInnerHTML);

export default TableRowMerge;
