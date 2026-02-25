import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M9.8,17.716,23.819,3.7a1,1,0,0,1,1.414,0L32.3,10.767a1,1,0,0,1,0,1.414L18.284,26.2l4.945,4.945a.5.5,0,0,1-.353.854H4V13.125a.5.5,0,0,1,.854-.353Z"></path>`;

const PopIn = createWorkflowIcon('VueWorkflowPopIn', svgAttributes, svgInnerHTML);

export default PopIn;
