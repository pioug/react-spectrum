import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M13,6H10V.5A.5.5,0,0,0,9.5,0h-1A.5.5,0,0,0,8,.5V6H5A1,1,0,0,0,4,7V29a1,1,0,0,0,1,1H8v5.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V30h3a1,1,0,0,0,1-1V7A1,1,0,0,0,13,6Z"></path><path fill-rule="evenodd" d="M31,10H28V.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5V10H23a1,1,0,0,0-1,1V25a1,1,0,0,0,1,1h3v9.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V26h3a1,1,0,0,0,1-1V11A1,1,0,0,0,31,10Z"></path>`;

const DistributeHorizontalCenter = createWorkflowIcon('VueWorkflowDistributeHorizontalCenter', svgAttributes, svgInnerHTML);

export default DistributeHorizontalCenter;
