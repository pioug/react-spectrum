import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="12" rx="1" ry="1" width="24" x="6" y="12"></rect><rect fill-rule="evenodd" height="2" rx="0.5" ry="0.5" width="36" y="30"></rect><rect fill-rule="evenodd" height="2" rx="0.5" ry="0.5" width="36" y="4"></rect>`;

const DistributeVertically = createWorkflowIcon('VueWorkflowDistributeVertically', svgAttributes, svgInnerHTML);

export default DistributeVertically;
