import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,1,2,18,16,16,0,0,1,18,2Zm2,19.91,2.861,2.5a1,1,0,0,0,1.659-.753V12.249a1,1,0,0,0-1.659-.753L20,14Zm-3.658,2.5A1,1,0,0,0,18,23.662V12.248a1,1,0,0,0-1.658-.752L8.959,17.955Z"></path>`;

const RewindCircle = createWorkflowIcon('VueWorkflowRewindCircle', svgAttributes, svgInnerHTML);

export default RewindCircle;
