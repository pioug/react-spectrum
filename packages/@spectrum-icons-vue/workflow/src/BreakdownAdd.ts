import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M15.084,30H10V26h4.75a12.214,12.214,0,0,1,1.018-4H10V18h8.636A12.168,12.168,0,0,1,30,15.084V15a1,1,0,0,0-1-1H10V8H29a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H1A1,1,0,0,0,0,3V7A1,1,0,0,0,1,8H6V33a1,1,0,0,0,1,1h9.893A12.226,12.226,0,0,1,15.084,30Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const BreakdownAdd = createWorkflowIcon('VueWorkflowBreakdownAdd', svgAttributes, svgInnerHTML);

export default BreakdownAdd;
