import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,4H3A1,1,0,0,0,2,5V31a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V5A1,1,0,0,0,33,4ZM12,28H6V18h6Zm18,0H14V24H30Zm0-6H14V18H30Zm0-6H6V8H30Z"></path>`;

const Experience = createWorkflowIcon('VueWorkflowExperience', svgAttributes, svgInnerHTML);

export default Experience;
