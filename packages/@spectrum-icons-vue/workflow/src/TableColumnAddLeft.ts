import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M9,18.1A8.9,8.9,0,1,0,17.9,27,8.9,8.9,0,0,0,9,18.1Zm5,9.4a.5.5,0,0,1-.5.5H10v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H4.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H8V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path><path fill-rule="evenodd" d="M33,2H3A1,1,0,0,0,2,3V16.893a12.252,12.252,0,0,1,12-1.124V14h8v8H20.231a12.154,12.154,0,0,1,.685,2H22v8H20.231a12.236,12.236,0,0,1-1.124,2H33a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2ZM22,12H14V4h8ZM32,32H24V24h8Zm0-10H24V14h8Zm0-10H24V4h8Z"></path>`;

const TableColumnAddLeft = createWorkflowIcon('VueWorkflowTableColumnAddLeft', svgAttributes, svgInnerHTML);

export default TableColumnAddLeft;
