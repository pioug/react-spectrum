import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M26,10V5.207a.5.5,0,0,1,.854-.354L36,14l-9.146,9.146A.5.5,0,0,1,26,22.793V18H10V31a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V16a6,6,0,0,1,6-6Z"></path>`;

const Forward = createWorkflowIcon('VueWorkflowForward', svgAttributes, svgInnerHTML);

export default Forward;
