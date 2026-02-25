import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M9,8H26V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V25a1,1,0,0,0,1,1H8V9A1,1,0,0,1,9,8Z"></path><path fill-rule="evenodd" d="M10,11V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V11a1,1,0,0,0-1-1H11A1,1,0,0,0,10,11ZM29.5,24H24v5.5a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5V24H14.5a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5H20V14.5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5V20h5.5a.5.5,0,0,1,.5.5v3A.5.5,0,0,1,29.5,24Z"></path>`;

const TreeExpandAll = createWorkflowIcon('VueWorkflowTreeExpandAll', svgAttributes, svgInnerHTML);

export default TreeExpandAll;
