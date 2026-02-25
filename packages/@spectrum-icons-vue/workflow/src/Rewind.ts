import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M4,18,18.341,5.452A1,1,0,0,1,20,6.2V29.8a1,1,0,0,1-1.659.753Z"></path><path fill-rule="evenodd" d="M22,11l6.342-5.549A1,1,0,0,1,30,6.2V29.8a1,1,0,0,1-1.658.753L22,25Z"></path>`;

const Rewind = createWorkflowIcon('VueWorkflowRewind', svgAttributes, svgInnerHTML);

export default Rewind;
