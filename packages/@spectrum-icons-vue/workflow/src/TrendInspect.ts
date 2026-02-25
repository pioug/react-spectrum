import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M8.9,26.619,7.3,28.409,3.613,21.182.068,23.841l1.405,2.384L2.659,25.2l4.5,8.25,3.955-5.28A14.015,14.015,0,0,1,8.9,26.619Z"></path><path fill-rule="evenodd" d="M23.07,19.332,26,15.954a7.932,7.932,0,0,0-.673-3.155L23.4,15.077l-3.312-4.759c-.066-.025-.137-.042-.2-.064L12.256,21.545a7.987,7.987,0,0,0,2.189,1.584l5.548-8.222Z"></path><path fill-rule="evenodd" d="M31.015,10.875l4.849-5.443L33.88,3.6l-4.2,4.707A13.9,13.9,0,0,1,31.015,10.875Z"></path><path fill-rule="evenodd" d="M35.338,30.3l-7.474-7.474a12.013,12.013,0,1,0-3.04,3.04L32.3,33.338a2.155,2.155,0,0,0,3.04-3.04ZM8,16A10,10,0,1,1,18,26,10,10,0,0,1,8,16Z"></path>`;

const TrendInspect = createWorkflowIcon('VueWorkflowTrendInspect', svgAttributes, svgInnerHTML);

export default TrendInspect;
