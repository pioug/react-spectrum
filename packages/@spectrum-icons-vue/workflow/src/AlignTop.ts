import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="2" rx="0.5" ry="0.5" width="36" y="2"></rect><rect fill-rule="evenodd" height="26" rx="1" ry="1" width="10" x="6" y="6"></rect><rect fill-rule="evenodd" height="16" rx="1" ry="1" width="10" x="20" y="6"></rect>`;

const AlignTop = createWorkflowIcon('VueWorkflowAlignTop', svgAttributes, svgInnerHTML);

export default AlignTop;
