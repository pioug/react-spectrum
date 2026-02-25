import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="32" rx="1" ry="1" width="32" x="2" y="2"></rect>`;

const LoupeView = createWorkflowIcon('VueWorkflowLoupeView', svgAttributes, svgInnerHTML);

export default LoupeView;
