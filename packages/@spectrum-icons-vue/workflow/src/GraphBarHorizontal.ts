import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,10H6V4H33a1,1,0,0,1,1,1V9A1,1,0,0,1,33,10Z"></path><path fill-rule="evenodd" d="M23,18H6V12H23a1,1,0,0,1,1,1v4A1,1,0,0,1,23,18Z"></path><path fill-rule="evenodd" d="M15,26H6V20h9a1,1,0,0,1,1,1v4A1,1,0,0,1,15,26Z"></path><path fill-rule="evenodd" d="M11,34H6V28h5a1,1,0,0,1,1,1v4A1,1,0,0,1,11,34Z"></path><rect fill-rule="evenodd" height="34" rx="0.5" ry="0.5" width="2" x="2" y="2"></rect>`;

const GraphBarHorizontal = createWorkflowIcon('VueWorkflowGraphBarHorizontal', svgAttributes, svgInnerHTML);

export default GraphBarHorizontal;
