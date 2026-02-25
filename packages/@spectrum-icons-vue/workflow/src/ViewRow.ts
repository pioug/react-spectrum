import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M34,10H2V3A1,1,0,0,1,3,2H33a1,1,0,0,1,1,1Z"></path><rect fill-rule="evenodd" height="8" width="32" x="2" y="14"></rect><path fill-rule="evenodd" d="M33,34H3a1,1,0,0,1-1-1V26H34v7A1,1,0,0,1,33,34Z"></path>`;

const ViewRow = createWorkflowIcon('VueWorkflowViewRow', svgAttributes, svgInnerHTML);

export default ViewRow;
