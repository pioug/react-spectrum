import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="24" x="6" y="16"></rect>`;

const Remove = createWorkflowIcon('VueWorkflowRemove', svgAttributes, svgInnerHTML);

export default Remove;
