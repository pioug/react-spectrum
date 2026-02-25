import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M6,22.926V30H.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5h35a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H30V22.926A.927.927,0,0,0,29.074,22H6.926A.926.926,0,0,0,6,22.926Z"></path><path fill-rule="evenodd" d="M10,5v7H.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5h35a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H26V5a1,1,0,0,0-1-1H11A1,1,0,0,0,10,5Z"></path>`;

const DistributeBottomEdge = createWorkflowIcon('VueWorkflowDistributeBottomEdge', svgAttributes, svgInnerHTML);

export default DistributeBottomEdge;
