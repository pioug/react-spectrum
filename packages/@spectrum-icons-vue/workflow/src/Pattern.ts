import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="6" x="2" y="4"></rect><rect fill-rule="evenodd" height="8" rx="0.5" ry="0.5" width="2" x="10" y="2"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="6" x="14" y="4"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="6" x="26" y="4"></rect><rect fill-rule="evenodd" height="8" rx="0.5" ry="0.5" width="2" x="22" y="2"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="6" x="2" y="20"></rect><rect fill-rule="evenodd" height="8" rx="0.5" ry="0.5" width="2" x="10" y="18"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="6" x="14" y="20"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="6" x="26" y="20"></rect><rect fill-rule="evenodd" height="8" rx="0.5" ry="0.5" width="2" x="22" y="18"></rect><rect fill-rule="evenodd" height="8" rx="0.5" ry="0.5" width="2" x="4" y="10"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="6" x="8" y="12"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="6" x="20" y="12"></rect><rect fill-rule="evenodd" height="8" rx="0.5" ry="0.5" width="2" x="16" y="10"></rect><rect fill-rule="evenodd" height="8" rx="0.5" ry="0.5" width="2" x="28" y="10"></rect><rect fill-rule="evenodd" height="8" rx="0.5" ry="0.5" width="2" x="4" y="26"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="6" x="8" y="28"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="6" x="20" y="28"></rect><rect fill-rule="evenodd" height="8" rx="0.5" ry="0.5" width="2" x="16" y="26"></rect><rect fill-rule="evenodd" height="8" rx="0.5" ry="0.5" width="2" x="28" y="26"></rect>`;

const Pattern = createWorkflowIcon('VueWorkflowPattern', svgAttributes, svgInnerHTML);

export default Pattern;
