import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M26,3V30h6V3a1,1,0,0,0-1-1H27A1,1,0,0,0,26,3Z"></path><path fill-rule="evenodd" d="M18,13V30h6V13a1,1,0,0,0-1-1H19A1,1,0,0,0,18,13Z"></path><path fill-rule="evenodd" d="M10,21v9h6V21a1,1,0,0,0-1-1H11A1,1,0,0,0,10,21Z"></path><path fill-rule="evenodd" d="M2,25v5H8V25a1,1,0,0,0-1-1H3A1,1,0,0,0,2,25Z"></path><rect fill-rule="evenodd" height="2" rx="0.5" ry="0.5" width="34" y="32"></rect>`;

const GraphBarVertical = createWorkflowIcon('VueWorkflowGraphBarVertical', svgAttributes, svgInnerHTML);

export default GraphBarVertical;
