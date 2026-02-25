import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M4,5V31a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1H5A1,1,0,0,0,4,5ZM30,30H6V6H30Z"></path><path fill-rule="evenodd" d="M8,8V28H28V8ZM26,26H10V10H26Z"></path>`;

const Border = createWorkflowIcon('VueWorkflowBorder', svgAttributes, svgInnerHTML);

export default Border;
