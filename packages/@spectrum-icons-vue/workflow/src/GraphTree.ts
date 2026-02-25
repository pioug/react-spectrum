import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="18" rx="0.5" ry="0.5" width="18" x="2" y="8"></rect><rect fill-rule="evenodd" height="10" rx="0.5" ry="0.5" width="12" x="22" y="8"></rect><rect fill-rule="evenodd" height="6" rx="0.5" ry="0.5" width="8" x="22" y="20"></rect><rect fill-rule="evenodd" height="6" rx="0.5" ry="0.5" width="2" x="32" y="20"></rect>`;

const GraphTree = createWorkflowIcon('VueWorkflowGraphTree', svgAttributes, svgInnerHTML);

export default GraphTree;
