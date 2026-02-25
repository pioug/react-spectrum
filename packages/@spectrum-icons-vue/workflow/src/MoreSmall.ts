import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="17.8" cy="18.2" r="3.4"></circle><circle fill-rule="evenodd" cx="29.5" cy="18.2" r="3.4"></circle><circle fill-rule="evenodd" cx="6.1" cy="18.2" r="3.4"></circle>`;

const MoreSmall = createWorkflowIcon('VueWorkflowMoreSmall', svgAttributes, svgInnerHTML);

export default MoreSmall;
