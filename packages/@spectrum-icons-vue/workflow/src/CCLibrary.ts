import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,6H30V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V29a1,1,0,0,0,1,1H6v3a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V7A1,1,0,0,0,33,6ZM4,28V4H28V6H7A1,1,0,0,0,6,7V28Zm28,4H8V8H22V22l4-3,4,3V8h2Z"></path>`;

const CCLibrary = createWorkflowIcon('VueWorkflowCCLibrary', svgAttributes, svgInnerHTML);

export default CCLibrary;
