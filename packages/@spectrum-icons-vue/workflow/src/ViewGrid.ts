import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M10,10H2V3A1,1,0,0,1,3,2h7Z"></path><rect fill-rule="evenodd" height="8" width="8" x="14" y="2"></rect><path fill-rule="evenodd" d="M34,10H26V2h7a1,1,0,0,1,1,1Z"></path><rect fill-rule="evenodd" height="8" width="8" x="2" y="14"></rect><rect fill-rule="evenodd" height="8" width="8" x="14" y="14"></rect><rect fill-rule="evenodd" height="8" width="8" x="26" y="14"></rect><path fill-rule="evenodd" d="M10,34H3a1,1,0,0,1-1-1V26h8Z"></path><rect fill-rule="evenodd" height="8" width="8" x="14" y="26"></rect><path fill-rule="evenodd" d="M33,34H26V26h8v7A1,1,0,0,1,33,34Z"></path>`;

const ViewGrid = createWorkflowIcon('VueWorkflowViewGrid', svgAttributes, svgInnerHTML);

export default ViewGrid;
