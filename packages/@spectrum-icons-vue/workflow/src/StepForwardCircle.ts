import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM14,25a1,1,0,0,1-1,1H11a1,1,0,0,1-1-1V11a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1Zm14.4-6.219L19.625,25.8A1,1,0,0,1,18,25.017V10.983a1,1,0,0,1,1.625-.781L28.4,17.219A1,1,0,0,1,28.4,18.781Z"></path>`;

const StepForwardCircle = createWorkflowIcon('VueWorkflowStepForwardCircle', svgAttributes, svgInnerHTML);

export default StepForwardCircle;
