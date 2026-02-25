import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M13.5,0h-1a.5.5,0,0,0-.5.5V6H5A1,1,0,0,0,4,7V29a1,1,0,0,0,1,1h7v5.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V.5A.5.5,0,0,0,13.5,0Z"></path><path fill-rule="evenodd" d="M31.5,0h-1a.5.5,0,0,0-.5.5V10H23a1,1,0,0,0-1,1V25a1,1,0,0,0,1,1h7v9.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V.5A.5.5,0,0,0,31.5,0Z"></path>`;

const DistributeRightEdge = createWorkflowIcon('VueWorkflowDistributeRightEdge', svgAttributes, svgInnerHTML);

export default DistributeRightEdge;
