import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="10" rx="0.5" ry="0.5" width="2" x="2" y="24"></rect><rect fill-rule="evenodd" height="18" rx="0.5" ry="0.5" width="2" x="6" y="16"></rect><rect fill-rule="evenodd" height="18" rx="0.5" ry="0.5" width="2" x="18" y="16"></rect><rect fill-rule="evenodd" height="14" rx="0.5" ry="0.5" width="2" x="26" y="20"></rect><rect fill-rule="evenodd" height="6" rx="0.5" ry="0.5" width="2" x="30" y="28"></rect><rect fill-rule="evenodd" height="28" rx="0.5" ry="0.5" width="2" x="10" y="6"></rect><rect fill-rule="evenodd" height="22" rx="0.5" ry="0.5" width="2" x="14" y="12"></rect><rect fill-rule="evenodd" height="24" rx="0.5" ry="0.5" width="2" x="22" y="10"></rect>`;

const Histogram = createWorkflowIcon('VueWorkflowHistogram', svgAttributes, svgInnerHTML);

export default Histogram;
