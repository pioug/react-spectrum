import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M10,34H3a1,1,0,0,1-1-1V3A1,1,0,0,1,3,2h7Z"></path><rect fill-rule="evenodd" height="32" width="8" x="14" y="2"></rect><path fill-rule="evenodd" d="M33,34H26V2h7a1,1,0,0,1,1,1V33A1,1,0,0,1,33,34Z"></path>`;

const ViewColumn = createWorkflowIcon('VueWorkflowViewColumn', svgAttributes, svgInnerHTML);

export default ViewColumn;
