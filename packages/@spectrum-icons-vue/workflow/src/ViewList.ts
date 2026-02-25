import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="8" rx="1" ry="1" width="8" x="2" y="2"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="22" x="12" y="4"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="22" x="12" y="16"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="22" x="12" y="28"></rect><rect fill-rule="evenodd" height="8" rx="1" ry="1" width="8" x="2" y="14"></rect><rect fill-rule="evenodd" height="8" rx="1" ry="1" width="8" x="2" y="26"></rect>`;

const ViewList = createWorkflowIcon('VueWorkflowViewList', svgAttributes, svgInnerHTML);

export default ViewList;
