import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M24,32V25a1,1,0,0,1,1-1h7a1.161,1.161,0,0,1-.254.854l-6.892,6.892A1.161,1.161,0,0,1,24,32Z"></path><path fill-rule="evenodd" d="M31,4H5A1,1,0,0,0,4,5V31a1,1,0,0,0,1,1H22V24a2,2,0,0,1,2-2h8V5A1,1,0,0,0,31,4ZM18,24H10V22h8Zm8-6H10V16H26Zm0-6H10V10H26Z"></path>`;

const Annotate = createWorkflowIcon('VueWorkflowAnnotate', svgAttributes, svgInnerHTML);

export default Annotate;
