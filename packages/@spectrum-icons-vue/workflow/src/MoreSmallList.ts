import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="9" cy="18" r="2.85"></circle><circle fill-rule="evenodd" cx="18" cy="18" r="2.85"></circle><circle fill-rule="evenodd" cx="27" cy="18" r="2.85"></circle>`;

const MoreSmallList = createWorkflowIcon('VueWorkflowMoreSmallList', svgAttributes, svgInnerHTML);

export default MoreSmallList;
