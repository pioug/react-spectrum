import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M4,5V31a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1H5A1,1,0,0,0,4,5ZM25.5,20H20v5.5a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5V20H10.5a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5H16V10.5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5V16h5.5a.5.5,0,0,1,.5.5v3A.5.5,0,0,1,25.5,20Z"></path>`;

const TreeExpand = createWorkflowIcon('VueWorkflowTreeExpand', svgAttributes, svgInnerHTML);

export default TreeExpand;
