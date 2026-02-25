import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="24" x="6" y="8"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="24" x="6" y="16"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="24" x="6" y="24"></rect>`;

const Rail = createWorkflowIcon('VueWorkflowRail', svgAttributes, svgInnerHTML);

export default Rail;
