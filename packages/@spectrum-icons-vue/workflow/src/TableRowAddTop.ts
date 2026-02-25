import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27,17.9A8.9,8.9,0,1,0,18.1,9,8.9,8.9,0,0,0,27,17.9ZM22,8.5a.5.5,0,0,1,.5-.5H26V4.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V8h3.5a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V10H22.5a.5.5,0,0,1-.5-.5Z"></path><path fill-rule="evenodd" d="M16.893,2H3A1,1,0,0,0,2,3V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V19.107a12.236,12.236,0,0,1-2,1.124V22H24V20.916a12.154,12.154,0,0,1-2-.685V22H14V14h1.769A12.252,12.252,0,0,1,16.893,2ZM24,24h8v8H24ZM14,24h8v8H14Zm-2-2H4V14h8Zm0,10H4V24h8Z"></path>`;

const TableRowAddTop = createWorkflowIcon('VueWorkflowTableRowAddTop', svgAttributes, svgInnerHTML);

export default TableRowAddTop;
