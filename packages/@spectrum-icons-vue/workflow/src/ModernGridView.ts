import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="14" rx="1" ry="1" width="20" x="2" y="2"></rect><rect fill-rule="evenodd" height="14" rx="1" ry="1" width="8" x="26" y="2"></rect><rect fill-rule="evenodd" height="14" rx="1" ry="1" width="8" x="2" y="20"></rect><rect fill-rule="evenodd" height="14" rx="1" ry="1" width="20" x="14" y="20"></rect>`;

const ModernGridView = createWorkflowIcon('VueWorkflowModernGridView', svgAttributes, svgInnerHTML);

export default ModernGridView;
