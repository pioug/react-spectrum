import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="28" x="4" y="4"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="28" x="4" y="12"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="28" x="4" y="20"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="28" x="4" y="28"></rect>`;

const TextAlignJustify = createWorkflowIcon('VueWorkflowTextAlignJustify', svgAttributes, svgInnerHTML);

export default TextAlignJustify;
