import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="14" y="4"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="14" y="16"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="14" y="28"></rect><rect fill-rule="evenodd" height="10" rx="0.5" ry="0.5" width="2" x="8"></rect><rect fill-rule="evenodd" height="10" rx="0.5" ry="0.5" width="2" x="10" y="12"></rect><rect fill-rule="evenodd" height="10" rx="0.5" ry="0.5" width="2" x="6" y="12"></rect><rect fill-rule="evenodd" height="10" rx="0.5" ry="0.5" width="2" x="10" y="24"></rect><rect fill-rule="evenodd" height="10" rx="0.5" ry="0.5" width="2" x="6" y="24"></rect><rect fill-rule="evenodd" height="10" rx="0.5" ry="0.5" width="2" x="2" y="24"></rect>`;

const TextRomanUppercase = createWorkflowIcon('VueWorkflowTextRomanUppercase', svgAttributes, svgInnerHTML);

export default TextRomanUppercase;
