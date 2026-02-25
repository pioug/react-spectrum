import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="32" x="2" y="4"></rect><rect fill-rule="evenodd" height="8" rx="1" ry="1" width="32" x="2" y="22"></rect><rect fill-rule="evenodd" height="6" rx="1" ry="1" width="32" x="2" y="12"></rect>`;

const StrokeWidth = createWorkflowIcon('VueWorkflowStrokeWidth', svgAttributes, svgInnerHTML);

export default StrokeWidth;
