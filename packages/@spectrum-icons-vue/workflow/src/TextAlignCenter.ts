import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="20" x="8" y="28"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="32" x="2" y="20"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="32" x="2" y="4"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="20" x="8" y="12"></rect>`;

const TextAlignCenter = createWorkflowIcon('VueWorkflowTextAlignCenter', svgAttributes, svgInnerHTML);

export default TextAlignCenter;
