import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,10H11a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V11A1,1,0,0,0,33,10Z"></path><path fill-rule="evenodd" d="M7.5,15h-2V12a6,6,0,0,1,6-6h2a1,1,0,0,0,1-1V4a1,1,0,0,0-1-1h-2a9,9,0,0,0-9,9v3H.5a.5.5,0,0,0-.5.5.49.49,0,0,0,.147.35l3.537,4.033a.5.5,0,0,0,.632,0l3.537-4.033A.49.49,0,0,0,8,15.5.5.5,0,0,0,7.5,15Z"></path>`;

const RotateLeft = createWorkflowIcon('VueWorkflowRotateLeft', svgAttributes, svgInnerHTML);

export default RotateLeft;
