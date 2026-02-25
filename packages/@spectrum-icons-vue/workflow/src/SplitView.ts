import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="32" rx="1" ry="1" width="14" x="2" y="2"></rect><rect fill-rule="evenodd" height="32" rx="1" ry="1" width="14" x="20" y="2"></rect>`;

const SplitView = createWorkflowIcon('VueWorkflowSplitView', svgAttributes, svgInnerHTML);

export default SplitView;
