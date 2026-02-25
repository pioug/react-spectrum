import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="18" cy="27" r="2.85"></circle><circle fill-rule="evenodd" cx="18" cy="18" r="2.85"></circle><circle fill-rule="evenodd" cx="18" cy="9" r="2.85"></circle>`;

const MoreSmallListVert = createWorkflowIcon('VueWorkflowMoreSmallListVert', svgAttributes, svgInnerHTML);

export default MoreSmallListVert;
