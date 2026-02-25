import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35.9,19A8.9,8.9,0,1,0,27,27.9,8.9,8.9,0,0,0,35.9,19Zm-3.9.5a.5.5,0,0,1-.5.5h-9a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5Z"></path><path fill-rule="evenodd" d="M2,3V35a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V29.107a12.139,12.139,0,0,1-2,1.123h0V34H24V30.916a12.139,12.139,0,0,1-2-.684V34H14V26h3.308A12.229,12.229,0,0,1,15.5,22H6V16h9.5a12.229,12.229,0,0,1,1.809-4H14V4h8V7.769a12.154,12.154,0,0,1,2-.685V4h8V7.769h0a12.108,12.108,0,0,1,2,1.123V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3ZM12,26v8H4V26ZM12,4v8H4V4Z"></path>`;

const TableRowRemoveCenter = createWorkflowIcon('VueWorkflowTableRowRemoveCenter', svgAttributes, svgInnerHTML);

export default TableRowRemoveCenter;
