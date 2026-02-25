import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="8" rx="1" ry="1" width="6" x="2" y="26"></rect><rect fill-rule="evenodd" height="16" rx="1" ry="1" width="6" x="10" y="18"></rect><rect fill-rule="evenodd" height="24" rx="1" ry="1" width="6" x="18" y="10"></rect><rect fill-rule="evenodd" height="32" rx="1" ry="1" width="6" x="26" y="2"></rect>`;

const ConfidenceFour = createWorkflowIcon('VueWorkflowConfidenceFour', svgAttributes, svgInnerHTML);

export default ConfidenceFour;
