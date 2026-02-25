import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M6,23v3H.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H6v3a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V28h5.5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H30V23a1,1,0,0,0-1-1H7A1,1,0,0,0,6,23Z"></path><path fill-rule="evenodd" d="M10,5V8H.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H10v3a1,1,0,0,0,1,1H25a1,1,0,0,0,1-1V10h9.5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H26V5a1,1,0,0,0-1-1H11A1,1,0,0,0,10,5Z"></path>`;

const DistributeVerticalCenter = createWorkflowIcon('VueWorkflowDistributeVerticalCenter', svgAttributes, svgInnerHTML);

export default DistributeVerticalCenter;
