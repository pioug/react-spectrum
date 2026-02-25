import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="28" rx="1" ry="1" width="8" x="2" y="4"></rect><path fill-rule="evenodd" d="M16,30.919V5.081A1,1,0,0,1,17.625,4.3L33.774,17.219a1,1,0,0,1,0,1.562L17.625,31.7A1,1,0,0,1,16,30.919Z"></path>`;

const StepForward = createWorkflowIcon('VueWorkflowStepForward', svgAttributes, svgInnerHTML);

export default StepForward;
