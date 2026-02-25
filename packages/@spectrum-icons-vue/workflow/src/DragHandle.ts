import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle cx="14" cy="26" r="2"></circle><circle cx="14" cy="20" r="2"></circle><circle cx="14" cy="14" r="2"></circle><circle cx="14" cy="8" r="2"></circle><circle cx="20" cy="26" r="2"></circle><circle cx="20" cy="20" r="2"></circle><circle cx="20" cy="14" r="2"></circle><circle cx="20" cy="8" r="2"></circle>`;

const DragHandle = createWorkflowIcon('VueWorkflowDragHandle', svgAttributes, svgInnerHTML);

export default DragHandle;
