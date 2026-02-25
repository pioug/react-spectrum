import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="6" rx="2.8" ry="2.8" width="6" x="4" y="2"></rect><rect fill-rule="evenodd" height="6" rx="2.8" ry="2.8" width="6" x="4" y="14"></rect><rect fill-rule="evenodd" height="6" rx="2.8" ry="2.8" width="6" x="4" y="26"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="12" y="28"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="12" y="16"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="12" y="4"></rect>`;

const TextBulleted = createWorkflowIcon('VueWorkflowTextBulleted', svgAttributes, svgInnerHTML);

export default TextBulleted;
