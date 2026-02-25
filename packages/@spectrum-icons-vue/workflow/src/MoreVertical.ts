import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="18" cy="18" r="4.1"></circle><circle fill-rule="evenodd" cx="18" cy="6" r="4.1"></circle><circle fill-rule="evenodd" cx="18" cy="30" r="4.1"></circle>`;

const MoreVertical = createWorkflowIcon('VueWorkflowMoreVertical', svgAttributes, svgInnerHTML);

export default MoreVertical;
