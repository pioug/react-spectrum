import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="2" rx="0.5" ry="0.5" width="34" y="32"></rect><rect fill-rule="evenodd" height="6" width="6" x="10" y="24"></rect><rect fill-rule="evenodd" height="14" width="6" x="26" y="16"></rect><rect fill-rule="evenodd" height="4" width="6" x="2" y="26"></rect><rect fill-rule="evenodd" height="10" width="6" x="18" y="20"></rect><path fill-rule="evenodd" d="M24,11v7H18V11a1,1,0,0,1,1-1h4A1,1,0,0,1,24,11Z"></path><path fill-rule="evenodd" d="M32,3V14H26V3a1,1,0,0,1,1-1h4A1,1,0,0,1,32,3Z"></path><path fill-rule="evenodd" d="M16,19v3H10V19a1,1,0,0,1,1-1h4A1,1,0,0,1,16,19Z"></path><path fill-rule="evenodd" d="M8,21v3H2V21a1,1,0,0,1,1-1H7A1,1,0,0,1,8,21Z"></path>`;

const GraphBarVerticalStacked = createWorkflowIcon('VueWorkflowGraphBarVerticalStacked', svgAttributes, svgInnerHTML);

export default GraphBarVerticalStacked;
