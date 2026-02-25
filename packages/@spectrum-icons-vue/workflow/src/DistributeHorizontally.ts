import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="24" rx="1" ry="1" width="12" x="12" y="6"></rect><rect fill-rule="evenodd" height="36" rx="0.5" ry="0.5" width="2" x="4"></rect><rect fill-rule="evenodd" height="36" rx="0.5" ry="0.5" width="2" x="30"></rect>`;

const DistributeHorizontally = createWorkflowIcon('VueWorkflowDistributeHorizontally', svgAttributes, svgInnerHTML);

export default DistributeHorizontally;
