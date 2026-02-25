import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M23,2V5h3V31H23v3h6a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1Z"></path><path fill-rule="evenodd" d="M6,3V33a1,1,0,0,0,1,1h6V31H10V5h3V2H7A1,1,0,0,0,6,3Z"></path>`;

const BracketsSquare = createWorkflowIcon('VueWorkflowBracketsSquare', svgAttributes, svgInnerHTML);

export default BracketsSquare;
