import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.134,11.26,24.718,2.846a1.068,1.068,0,0,0-1.51,0L19.491,6.562a1.052,1.052,0,0,0-.147,1.289l8.42,8.42.008-.017.186.183a1.066,1.066,0,0,0,1.509,0l3.667-3.666A1.066,1.066,0,0,0,33.134,11.26Z"></path><path fill-rule="evenodd" d="M17.462,9.383,9.585,13.011a2,2,0,0,0-1.011,1.051L1.979,29.973a1,1,0,0,0,.216,1.09l.523.523,8.156-8.157a1.619,1.619,0,0,1-.037-.254,2,2,0,1,1,2,2,1.684,1.684,0,0,1-.276-.04L4.414,33.283l.592.592a1,1,0,0,0,1.09.217l15.913-6.6a2,2,0,0,0,1.05-1.011l3.628-7.876Z"></path>`;

const VectorDraw = createWorkflowIcon('VueWorkflowVectorDraw', svgAttributes, svgInnerHTML);

export default VectorDraw;
