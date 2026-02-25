import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="28" rx="1" ry="1" width="24" x="6" y="4"></rect>`;

const Stop = createWorkflowIcon('VueWorkflowStop', svgAttributes, svgInnerHTML);

export default Stop;
