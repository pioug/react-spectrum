import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,8H26v2h6V30H4V10h6V8H3A1,1,0,0,0,2,9V31a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V9A1,1,0,0,0,33,8Z"></path><path fill-rule="evenodd" d="M24.793,14H20V.5a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5V14H11.207a.5.5,0,0,0-.353.854L18,22l7.146-7.146A.5.5,0,0,0,24.793,14Z"></path>`;

const SaveToLight = createWorkflowIcon('VueWorkflowSaveToLight', svgAttributes, svgInnerHTML);

export default SaveToLight;
