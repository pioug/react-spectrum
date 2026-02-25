import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M8.1,27A8.9,8.9,0,1,0,17,18.1,8.9,8.9,0,0,0,8.1,27Zm3.9-.5a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5h-9a.5.5,0,0,1-.5-.5Z"></path><path fill-rule="evenodd" d="M33,2H1A1,1,0,0,0,0,3V33a1,1,0,0,0,1,1H6.893A12.139,12.139,0,0,1,5.77,32H2V24H5.084a12.139,12.139,0,0,1,.684-2H2V14h8v3.308A12.229,12.229,0,0,1,14,15.5V6h6v9.5a12.229,12.229,0,0,1,4,1.809V14h8v8H28.232a12.139,12.139,0,0,1,.684,2H32v8H28.231v0a12.139,12.139,0,0,1-1.123,2H33a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2ZM10,12H2V4h8Zm22,0H24V4h8Z"></path>`;

const TableColumnRemoveCenter = createWorkflowIcon('VueWorkflowTableColumnRemoveCenter', svgAttributes, svgInnerHTML);

export default TableColumnRemoveCenter;
