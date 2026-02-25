import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M13.074,6H6V.5A.5.5,0,0,0,5.5,0h-1A.5.5,0,0,0,4,.5v35a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V30h7.074A.926.926,0,0,0,14,29.074V6.926A.927.927,0,0,0,13.074,6Z"></path><path fill-rule="evenodd" d="M31,10H24V.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5v35a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V26h7a1,1,0,0,0,1-1V11A1,1,0,0,0,31,10Z"></path>`;

const DistributeLeftEdge = createWorkflowIcon('VueWorkflowDistributeLeftEdge', svgAttributes, svgInnerHTML);

export default DistributeLeftEdge;
