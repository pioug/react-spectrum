import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M4,31V3H32V31Zm30,1V2a1,1,0,0,0-1-1H3A1,1,0,0,0,2,2V32a1,1,0,0,0,1,1H33A1,1,0,0,0,34,32Z"></path><rect fill-rule="evenodd" height="8" rx="0.5" ry="0.5" width="24" x="6" y="5"></rect>`;

const PaddingTop = createWorkflowIcon('VueWorkflowPaddingTop', svgAttributes, svgInnerHTML);

export default PaddingTop;
