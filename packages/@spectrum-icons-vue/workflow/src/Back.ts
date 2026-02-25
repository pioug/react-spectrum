import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M10,10V5.207a.5.5,0,0,0-.854-.354L0,14l9.146,9.146A.5.5,0,0,0,10,22.793V18H26V31a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V16a6,6,0,0,0-6-6Z"></path>`;

const Back = createWorkflowIcon('VueWorkflowBack', svgAttributes, svgInnerHTML);

export default Back;
