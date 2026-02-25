import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="11.2" rx="1" ry="1" width="8" x="2" y="12"></rect><rect fill-rule="evenodd" height="6" rx="1" ry="1" width="6" x="28" y="4"></rect><rect fill-rule="evenodd" height="6" rx="1" ry="1" width="6" x="28" y="14"></rect><rect fill-rule="evenodd" height="6" rx="1" ry="1" width="6" x="28" y="24"></rect><path fill-rule="evenodd" d="M26,7.5v-1a.5.5,0,0,0-.5-.5h-7a.5.5,0,0,0-.5.5V16H12.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H18v9.5a.5.5,0,0,0,.5.5h7a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H20V18h5.5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H20V8h5.5A.5.5,0,0,0,26,7.5Z"></path>`;

const Workflow = createWorkflowIcon('VueWorkflowWorkflow', svgAttributes, svgInnerHTML);

export default Workflow;
