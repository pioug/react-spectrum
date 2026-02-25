import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M4,32V18H32V32Zm30,1V17a1,1,0,0,0-1-1H3a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H33A1,1,0,0,0,34,33Z"></path><rect fill-rule="evenodd" height="10" rx="1" width="32" x="2" y="2"></rect>`;

const MarginTop = createWorkflowIcon('VueWorkflowMarginTop', svgAttributes, svgInnerHTML);

export default MarginTop;
