import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm8,23a1,1,0,0,1-1,1H11a1,1,0,0,1-1-1V11a1,1,0,0,1,1-1H25a1,1,0,0,1,1,1Z"></path>`;

const StopCircle = createWorkflowIcon('VueWorkflowStopCircle', svgAttributes, svgInnerHTML);

export default StopCircle;
