import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M2,8.5v3a.5.5,0,0,0,.5.5H8V8H2.5A.5.5,0,0,0,2,8.5Z"></path><path fill-rule="evenodd" d="M29.5,8H16v4H29.5a.5.5,0,0,0,.5-.5v-3A.5.5,0,0,0,29.5,8Z"></path><path fill-rule="evenodd" d="M14,16H2.378A.378.378,0,0,0,2,16.378v3.244A.378.378,0,0,0,2.378,20H14Z"></path><path fill-rule="evenodd" d="M2,24.5v3a.5.5,0,0,0,.5.5H20V24H2.5A.5.5,0,0,0,2,24.5Z"></path><path fill-rule="evenodd" d="M33.5,24H28v4h5.5a.5.5,0,0,0,.5-.5v-3A.5.5,0,0,0,33.5,24Z"></path><rect fill-rule="evenodd" height="8" rx="1" ry="1" width="4" x="10" y="6"></rect><rect fill-rule="evenodd" height="8" rx="1" ry="1" width="4" x="16" y="14"></rect><rect fill-rule="evenodd" height="8" rx="1" ry="1" width="4" x="22" y="22"></rect>`;

const GraphBullet = createWorkflowIcon('VueWorkflowGraphBullet', svgAttributes, svgInnerHTML);

export default GraphBullet;
