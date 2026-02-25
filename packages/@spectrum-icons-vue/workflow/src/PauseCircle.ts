import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM16,25a1,1,0,0,1-1,1H13a1,1,0,0,1-1-1V11a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1Zm8,0a1,1,0,0,1-1,1H21a1,1,0,0,1-1-1V11a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1Z"></path>`;

const PauseCircle = createWorkflowIcon('VueWorkflowPauseCircle', svgAttributes, svgInnerHTML);

export default PauseCircle;
