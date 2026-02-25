import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M4,5V31a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1H5A1,1,0,0,0,4,5Zm6.5,15a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h15a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5Z"></path>`;

const TreeCollapse = createWorkflowIcon('VueWorkflowTreeCollapse', svgAttributes, svgInnerHTML);

export default TreeCollapse;
