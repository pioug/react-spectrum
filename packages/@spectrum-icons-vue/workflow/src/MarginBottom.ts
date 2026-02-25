import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32,4V18H4V4Zm1-2H3A1,1,0,0,0,2,3V19a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2Z"></path><rect fill-rule="evenodd" height="10" rx="1" width="32" x="2" y="24"></rect>`;

const MarginBottom = createWorkflowIcon('VueWorkflowMarginBottom', svgAttributes, svgInnerHTML);

export default MarginBottom;
