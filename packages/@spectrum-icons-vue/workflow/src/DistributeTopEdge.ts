import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M0,22.5v1a.5.5,0,0,0,.5.5H6v7a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V24h5.5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H.5A.5.5,0,0,0,0,22.5Z"></path><path fill-rule="evenodd" d="M0,4.5v1A.5.5,0,0,0,.5,6H10v7a1,1,0,0,0,1,1H25a1,1,0,0,0,1-1V6h9.5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H.5A.5.5,0,0,0,0,4.5Z"></path>`;

const DistributeTopEdge = createWorkflowIcon('VueWorkflowDistributeTopEdge', svgAttributes, svgInnerHTML);

export default DistributeTopEdge;
