import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32,2H26V34h6a2,2,0,0,0,2-2V4A2,2,0,0,0,32,2Z"></path><path fill-rule="evenodd" d="M22,2H4A2,2,0,0,0,2,4V32a2,2,0,0,0,2,2H22Z"></path>`;

const ColumnTwoB = createWorkflowIcon('VueWorkflowColumnTwoB', svgAttributes, svgInnerHTML);

export default ColumnTwoB;
