import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="36" rx="0.5" ry="0.5" width="2" x="2"></rect><rect fill-rule="evenodd" height="10" rx="1" ry="1" width="26" x="6" y="20"></rect><rect fill-rule="evenodd" height="10" rx="1" ry="1" width="16" x="6" y="6"></rect>`;

const AlignLeft = createWorkflowIcon('VueWorkflowAlignLeft', svgAttributes, svgInnerHTML);

export default AlignLeft;
