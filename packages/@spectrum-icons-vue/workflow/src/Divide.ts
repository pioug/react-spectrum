import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="32" x="2" y="16"></rect><circle fill-rule="evenodd" cx="18" cy="6" r="3.8"></circle><circle fill-rule="evenodd" cx="18" cy="30" r="3.8"></circle>`;

const Divide = createWorkflowIcon('VueWorkflowDivide', svgAttributes, svgInnerHTML);

export default Divide;
