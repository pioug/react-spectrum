import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="10" rx="1" ry="1" width="24" x="10" y="22"></rect><rect fill-rule="evenodd" height="12" rx="1" ry="1" width="16" x="12" y="4"></rect><path fill-rule="evenodd" d="M7.5,16a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H4V10.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5V14H.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H2v6H.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H2v3.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V24H7.5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H4V16Z"></path>`;

const DistributeSpaceVert = createWorkflowIcon('VueWorkflowDistributeSpaceVert', svgAttributes, svgInnerHTML);

export default DistributeSpaceVert;
