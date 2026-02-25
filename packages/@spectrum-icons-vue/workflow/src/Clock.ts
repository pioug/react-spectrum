import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A14,14,0,1,1,32,18,14,14,0,0,1,18,32Z"></path><path fill-rule="evenodd" d="M20,16.086V7a1,1,0,0,0-1-1H17a1,1,0,0,0-1,1V17.586a1,1,0,0,0,.293.707L21.9,23.9a1,1,0,0,0,1.415,0l1.335-1.336a1,1,0,0,0,0-1.414l-4.357-4.358A1,1,0,0,1,20,16.086Z"></path>`;

const Clock = createWorkflowIcon('VueWorkflowClock', svgAttributes, svgInnerHTML);

export default Clock;
