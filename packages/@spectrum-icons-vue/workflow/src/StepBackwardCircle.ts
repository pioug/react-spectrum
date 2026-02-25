import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M2,18A16,16,0,1,0,18,2,16,16,0,0,0,2,18Zm20-7a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V25a1,1,0,0,1-1,1H23a1,1,0,0,1-1-1ZM7.6,17.219,16.375,10.2A1,1,0,0,1,18,10.983V25.017a1,1,0,0,1-1.625.781L7.6,18.781A1,1,0,0,1,7.6,17.219Z"></path>`;

const StepBackwardCircle = createWorkflowIcon('VueWorkflowStepBackwardCircle', svgAttributes, svgInnerHTML);

export default StepBackwardCircle;
