import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="24" x="4" y="28"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="30" x="4" y="4"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="24" x="4" y="12"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="30" x="4" y="20"></rect>`;

const TextAlignLeft = createWorkflowIcon('VueWorkflowTextAlignLeft', svgAttributes, svgInnerHTML);

export default TextAlignLeft;
