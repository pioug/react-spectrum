import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32,4V32H4V4Zm1-2H3A1,1,0,0,0,2,3V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2Z"></path><rect fill-rule="evenodd" height="8" rx="0.5" ry="0.5" width="24" x="6" y="22"></rect>`;

const PaddingBottom = createWorkflowIcon('VueWorkflowPaddingBottom', svgAttributes, svgInnerHTML);

export default PaddingBottom;
