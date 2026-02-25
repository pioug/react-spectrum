import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="28" rx="1" ry="1" width="8" x="26" y="4"></rect><path fill-rule="evenodd" d="M20,30.919V5.081A1,1,0,0,0,18.375,4.3L2.226,17.219a1,1,0,0,0,0,1.562L18.375,31.7A1,1,0,0,0,20,30.919Z"></path>`;

const StepBackward = createWorkflowIcon('VueWorkflowStepBackward', svgAttributes, svgInnerHTML);

export default StepBackward;
