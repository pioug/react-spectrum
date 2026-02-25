import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,20H3a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V21A1,1,0,0,0,33,20ZM12,32H4V28h8Zm0-6H4V22h8Zm20,6H14V28H32Zm0-6H14V22H32Z"></path><rect fill-rule="evenodd" height="16" rx="1" ry="1" width="8" x="26" y="2"></rect><rect fill-rule="evenodd" height="10" rx="1" ry="1" width="8" x="14" y="8"></rect><rect fill-rule="evenodd" height="6" rx="1" ry="1" width="8" x="2" y="12"></rect>`;

const TableAndChart = createWorkflowIcon('VueWorkflowTableAndChart', svgAttributes, svgInnerHTML);

export default TableAndChart;
