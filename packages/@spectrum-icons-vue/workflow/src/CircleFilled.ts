import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="18" cy="18" r="16"></circle>`;

const CircleFilled = createWorkflowIcon('VueWorkflowCircleFilled', svgAttributes, svgInnerHTML);

export default CircleFilled;
