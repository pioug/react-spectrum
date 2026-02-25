import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.249,6.41992A19.4457,19.4457,0,0,0,28.583,5.854a19.033,19.033,0,0,0-4.113.453A1.09269,1.09269,0,0,1,23.17,5.223V3.609A1.08709,1.08709,0,0,0,22.355,2.548,19.49413,19.49413,0,0,0,17.75,2,19.15325,19.15325,0,0,0,8,4.648V19.813a19.09947,19.09947,0,0,1,9.76-2.646,1.1,1.1,0,0,1,1.073,1.1v3.739a.991.991,0,0,0,1.406.908A19.27948,19.27948,0,0,1,32.754,21.479,1.00691,1.00691,0,0,0,34,20.511V7.4A1.00019,1.00019,0,0,0,33.249,6.41992Z"></path><rect fill-rule="evenodd" x="2" y="2" width="4" height="34" rx="0.5"></rect>`;

const Flag = createWorkflowIcon('VueWorkflowFlag', svgAttributes, svgInnerHTML);

export default Flag;
