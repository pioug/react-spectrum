import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="8"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="18" x="6" y="6"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="8" x="10" y="12"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="6" x="14" y="18"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="16" x="14" y="24"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="18" x="18" y="30"></rect>`;

const GraphGantt = createWorkflowIcon('VueWorkflowGraphGantt', svgAttributes, svgInnerHTML);

export default GraphGantt;
