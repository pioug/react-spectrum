import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18.1,27A8.9,8.9,0,1,0,27,18.1,8.9,8.9,0,0,0,18.1,27Zm3.9-.5a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5Z"></path><path fill-rule="evenodd" d="M14.7,27a12.238,12.238,0,0,1,1.069-5H14V14h8v1.769a12.154,12.154,0,0,1,2-.685V14h8v1.769a12.236,12.236,0,0,1,2,1.124V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V33a1,1,0,0,0,1,1H16.893A12.229,12.229,0,0,1,14.7,27ZM24,4h8v8H24ZM14,4h8v8H14ZM12,22H4V14h8Zm0-10H4V4h8Z"></path>`;

const TableRowAddBottom = createWorkflowIcon('VueWorkflowTableRowAddBottom', svgAttributes, svgInnerHTML);

export default TableRowAddBottom;
